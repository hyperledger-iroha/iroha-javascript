<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core'
import { useStaleState, useTask } from '@vue-kakuyaku/core'
import { client } from '../client.ts'

const { state, run } = useTask(() => client.api.telemetry.status(), { immediate: true })
const stale = useStaleState(state)
useIntervalFn(run, 1000)
</script>

<template>
  <div>
    <h3>Status</h3>

    <ul v-if="stale.fulfilled">
      <li>Blocks: {{ stale.fulfilled.value.blocks }}</li>
      <li>Uptime (sec): {{ stale.fulfilled.value.uptime.secs }}</li>
    </ul>

    <div v-else-if="stale.rejected">{{ stale.rejected.reason }}</div>
  </div>
</template>
