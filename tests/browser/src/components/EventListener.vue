<script setup lang="ts">
import { computed, onBeforeUnmount, shallowReactive, shallowRef } from 'vue'
import type { SetupEventsReturn } from '@iroha/client'
import * as datamodel from '@iroha/core/data-model'
import { P, match } from 'ts-pattern'
import { client } from '../client.ts'

const events = shallowReactive<string[]>([])
const currentListener = shallowRef<null | SetupEventsReturn>(null)
const isListening = computed(() => !!currentListener.value)

async function startListening() {
  currentListener.value = await client.events({
    filters: [
      datamodel.EventFilterBox.Pipeline.Block({ height: null, status: null }),
      datamodel.EventFilterBox.Pipeline.Transaction({ status: null, hash: null, blockHeight: null }),
    ],
  })

  currentListener.value.ee.on('event', (event) => {
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
}

async function stopListening() {
  await currentListener.value?.stop()
  currentListener.value = null
}

onBeforeUnmount(stopListening)
</script>

<template>
  <div>
    <h3>Listening</h3>

    <p>
      <button @click="isListening ? stopListening() : startListening()">
        {{ isListening ? 'Stop' : 'Listen' }}
      </button>
    </p>

    <p>Events:</p>

    <ul class="events-list">
      <li v-for="(event, i) in events" :key="i">
        {{ event }}
      </li>
    </ul>
  </div>
</template>
