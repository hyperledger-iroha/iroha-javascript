<script setup lang="ts">
import { computed, onBeforeUnmount, shallowReactive, shallowRef } from 'vue'
import type { SetupEventsReturn } from '@iroha2/client'
import { datamodel } from '@iroha2/data-model'
import { match } from 'ts-pattern'
import { client } from '../client'

function bytesToHex(bytes: number[]): string {
  return bytes.map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

const events = shallowReactive<string[]>([])
const currentListener = shallowRef<null | SetupEventsReturn>(null)
const isListening = computed(() => !!currentListener.value)

async function startListening() {
  currentListener.value = await client.eventsStream({
    filters: [
      datamodel.EventFilterBox.Pipeline(
        datamodel.PipelineEventFilterBox.Block({
          height: datamodel.Option.None(),
          status: datamodel.Option.None(),
        }),
      ),
      datamodel.EventFilterBox.Pipeline(
        datamodel.PipelineEventFilterBox.Transaction({
          hash: datamodel.Option.None(),
          blockHeight: datamodel.Option.None(),
          status: datamodel.Option.None(),
        }),
      ),
    ],
  })

  currentListener.value.ee.on('event', (event) => {
    events.push(
      match(event.as('Pipeline'))
        .returnType<string>()
        .with(
          { tag: 'Block' },
          ({ content: { status, hash } }) => `Block (${bytesToHex(hash.slice(0, 5))}...): ${status.tag}`,
        )
        .with(
          { tag: 'Transaction' },
          ({ content: { hash, status } }) => `Transaction (${bytesToHex(hash.slice(0, 5))}...): ${status.tag}`,
        )
        .exhaustive(),
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
      <li
        v-for="(event, i) in events"
        :key="i"
      >
        {{ event }}
      </li>
    </ul>
  </div>
</template>
