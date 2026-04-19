<template>
  <div class="container">

  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
const friends = ref([])
const selected = ref([])
const currentUserId = localStorage.getItem('userId')
const fetchData = async () => {
  let res = await axios.get(`/api/users/${currentUserId}/friends`)
  console.log(res.data)
  friends.value = res.data
}

await fetchData()
</script>
