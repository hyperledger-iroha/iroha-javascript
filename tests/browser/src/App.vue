<script setup lang="ts">
import CreateDomain from './components/CreateDomain.vue'
import EventListener from './components/EventListener.vue'
import StatusChecker from './components/StatusChecker.vue'
</script>

<template>
  <StatusChecker />
  <hr>
  <CreateDomain />
  <hr>
  <EventListener />
</template>

<style lang="scss">
#app {
  padding: 16px;
  font-family: sans-serif;
}
</style>
