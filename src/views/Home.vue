<template>
  <div>{{ currentUsername }}</div>
</template>
<script setup lang="ts">
const currentUsername = localStorage.getItem('username')
</script>
