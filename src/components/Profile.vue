<template>
  <div class="container">
    <div v-if="user && user.username" class="name">
      <img src="/avatar.jpg" alt="" />

      {{ user.username }}
    </div>
    <div v-if="user && user.id !== currentUserId">
      <button>加好友</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const username = route.params.username
const user = ref()
const currentUserId = localStorage.getItem('userId')

const fetchData = async () => {
  console.log(route.params)
  const res = await axios.get(`/api/users/name/${username}`)
  user.value = res.data
  console.log(user.value)
}
onMounted(async () => {
  fetchData()
})
</script>
<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  button {
    margin-top: auto;
  }
  .name {
    align-items: center;
    justify-content: center;
  }
}
img {
  width: 50px;
  border-radius: 50%;
}
button {
  width: 300px;
  height: 30px;
  background-color: rgb(126, 192, 254);
  border: none;
  border-radius: 7px;
}
</style>
