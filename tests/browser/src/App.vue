<script setup lang="ts">
import CreateDomain from './components/CreateDomain.vue'
import Listener from './components/Listener.vue'
import StatusChecker from './components/StatusChecker.vue'
import QueryDomains from './components/QueryDomains.vue'
</script>

<template>
  <StatusChecker />
  <hr>
  <CreateDomain />
  <hr>
  <QueryDomains />
  <hr>
  <Listener />
</template>

<style lang="scss">
#app {
  padding: 16px;
  font-family: sans-serif;
}
</style>
