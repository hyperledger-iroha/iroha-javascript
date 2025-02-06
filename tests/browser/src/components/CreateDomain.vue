<script setup lang="ts">
import { ref } from 'vue'
import { useTask } from '@vue-kakuyaku/core'
import { client } from '../client.ts'
import * as dm from '@iroha2/data-model'

const domainName = ref('')

const { state, run: registerDomain } = useTask(() =>
  client
    .transaction(
      dm.Executable.Instructions([
        dm.InstructionBox.Register.Domain({ id: new dm.Name(domainName.value), logo: null, metadata: [] }),
      ]),
    )
    .submit({ verify: true }),
)
</script>

<template>
  <div>
    <h3>Create Domain</h3>
    <p><label for="domain">New domain name:</label> <input id="domain" v-model="domainName" /></p>
    <p>
      <button @click="registerDomain()">Register domain{{ state.pending ? '...' : '' }}</button>
    </p>
  </div>
</template>
