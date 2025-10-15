<script setup lang="ts">
import { ref } from 'vue'
import { useTask } from '@vue-kakuyaku/core'
import { client } from '../client.ts'
import * as dm from '@iroha/core/data-model'

const { state, run: update } = useTask(() =>
  client.find.domains()
    .executeAll()
)
</script>

<template>
  <div>
    <h3>Domains</h3>
    <p>
      <button @click="update()">Query domains</button>
    </p>

    <ul class="domains" v-if="state.fulfilled">
      <li v-for="x in state.fulfilled.value">
        {{ x.id.value }}
      </li>
    </ul>
  </div>
</template>
