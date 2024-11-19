<script setup lang="ts">
import { computed, onBeforeUnmount, shallowReactive, shallowRef } from 'vue'
import type { SetupEventsReturn } from '@iroha2/client'
import { datamodel } from '@iroha2/data-model'
import { P, match } from 'ts-pattern'
import { client } from '../client'

function bytesToHex(bytes: Pick<Array<number>, 'map'>): string {
  return bytes.map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

const events = shallowReactive<string[]>([])
const currentListener = shallowRef<null | SetupEventsReturn>(null)
const isListening = computed(() => !!currentListener.value)

async function startListening() {
  currentListener.value = await client.eventsStream({
    filters: [
      datamodel.EventFilterBox({ t: 'Pipeline', value: { t: 'Block', value: {} } }),
      datamodel.EventFilterBox({ t: 'Pipeline', value: { t: 'Transaction', value: {} } }),
    ],
  })

  currentListener.value.ee.on('event', (event) => {
    events.push(
      match(event)
        .returnType<string>()
        .with(
          { t: 'Pipeline', value: { t: 'Block', value: P.select() } },
          ({ status, header }) => `Block (height=${header.height}): ${status.t}`,
        )
        .with(
          { t: 'Pipeline', value: { t: 'Transaction', value: P.select() } },
          ({ hash, status }) => `Transaction (${bytesToHex([...hash.slice(0, 5)])}...): ${status.t}`,
        )
        .otherwise(({ t }) => {
          throw new Error(`This should not appear with given filters: ${t}`)
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
      <li
        v-for="(event, i) in events"
        :key="i"
      >
        {{ event }}
      </li>
    </ul>
  </div>
</template>
