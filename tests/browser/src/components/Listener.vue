<script setup lang="ts">
import { computed, onBeforeUnmount, onScopeDispose, Ref, ref, shallowReactive, shallowRef, watchEffect } from 'vue'
import type { SetupEventsReturn } from '@iroha/client'
import * as dm from '@iroha/core/data-model'
import { match, P } from 'ts-pattern'
import { client } from '../client.ts'
import { useDeferredScope, useTask, wheneverFulfilled } from '@vue-kakuyaku/core'

const events = useDeferredScope<{ events: string[]; active: Ref<boolean> }>()
const blocks = useDeferredScope<{ blocks: string[]; active: Ref<boolean> }>()

function setupEvents() {
  events.setup(() => {
    const task = useTask(() =>
      client.events({
        filters: [
          dm.EventFilterBox.Pipeline.Block({ height: null, status: null }),
          dm.EventFilterBox.Pipeline.Transaction({ status: null, hash: null, blockHeight: null }),
        ],
      }), { immediate: true })

    const events = shallowReactive<string[]>([])
    const active = ref(false)

    wheneverFulfilled(task.state, (listener) => {
      active.value = true
      listener.ee.on('event', (event) => {
        events.push(
          match(event)
            .returnType<string>()
            .with(
              { kind: 'Pipeline', value: { kind: 'Block', value: P.select() } },
              ({ status, header }) => `Block (height=${header.height.value}): ${status.kind}`,
            )
            .with(
              { kind: 'Pipeline', value: { kind: 'Transaction', value: P.select() } },
              ({ hash, status }) => `Transaction (${hash.payload.hex().slice(0, 6)}...): ${status.kind}`,
            )
            .otherwise(({ kind }) => {
              throw new Error(`This should not appear with given filters: ${kind}`)
            }),
        )
      })
    }, { immediate: true })

    onScopeDispose(() => task.state.fulfilled?.value?.stop())

    return { events, active }
  })
}

function setupBlocks() {
  blocks.setup(() => {
    const task = useTask(() => client.blocks(), { immediate: true })

    const blocks = shallowReactive<string[]>([])
    const active = ref(false)

    wheneverFulfilled(task.state, async (listener) => {
      active.value = true
      for await (const block of listener.stream) {
        blocks.push(String(block.value.payload.header.height.value))
      }
      active.value = false
    })

    onScopeDispose(() => task.state.fulfilled?.value?.stop())

    return { blocks, active }
  })
}

function setupListeners() {
  setupEvents()
  setupBlocks()
}
</script>

<template>
  <div>
    <h3>Listening</h3>

    <p>
      <button @click="setupListeners()">
        Listen
      </button>

      <ul>
        <li class="active-events">Events: {{ events.scope.value?.expose.active.value ?? false }}</li>
        <li class="active-blocks">Blocks: {{ blocks.scope.value?.expose.active.value ?? false }}</li>
      </ul>
    </p>

    <ul class="events">
      <li v-for="(item, i) in events.scope.value?.expose.events ?? []" :key="i">
        {{ item }}
      </li>
    </ul>

    <ul class="blocks">
      <li v-for="(item, i) in blocks.scope.value?.expose.blocks ?? []" :key="i">
        {{ item }}
      </li>
    </ul>
  </div>
</template>
