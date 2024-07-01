<script setup lang="ts">
import { ref } from 'vue'
import { datamodel } from '@iroha2/data-model'
import { useTask } from '@vue-kakuyaku/core'
import { client } from '../client'

const domainName = ref('')

const { state, run: registerDomain } = useTask(() =>
  client.submit(
    datamodel.Executable.Instructions([
      datamodel.InstructionBox.Register(
        datamodel.RegisterBox.Domain({
          object: { id: { name: domainName.value }, logo: datamodel.Option.None(), metadata: new Map() },
        }),
      ),
    ]),
    { verify: true },
  ),
)
</script>

<template>
  <div>
    <h3>Create Domain</h3>
    <p>
      <label for="domain">New domain name:</label> <input
        id="domain"
        v-model="domainName"
      >
    </p>
    <p>
      <button @click="registerDomain()">
        Register domain{{ state.pending ? '...' : '' }}
      </button>
    </p>
  </div>
</template>
