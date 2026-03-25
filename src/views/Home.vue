<template>
  <div>{{ currentUsername }}</div>
  <div>
    friend of {{ friends.length }} users
    <div v-for="friend in friends">
      {{ friend }}
    </div>
  </div>
  <router-link to="/request">好友申请</router-link>
</template>
<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'

const currentUsername = localStorage.getItem('username')
const currentUserId = localStorage.getItem('userId')
const friends = ref([])
const fetchData = async () => {
  let res = await axios.get(`/api/users/${currentUserId}/friends`)
  friends.value = res.data
}
onMounted(async () => {
  fetchData()
})
</script>
