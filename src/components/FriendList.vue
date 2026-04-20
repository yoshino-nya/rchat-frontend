<template>
  <div class="container">
    <div>{{ currentUsername }}</div>
    <div>
      friend of {{ friends.length }} users
      <div class="info" v-for="friend in friends">
        <img :src="friend.friend_avatar" alt="" />
        <div class="username" @click="router.push(`/profile/${friend.friend_name}`)">
          {{ friend.friend_name }}
        </div>
        <button class="btn primary" style="margin-left: auto" @click="onclick(friend.friend_id)">
          发消息
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getSessionId } from '@/api/getSessionId'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'

interface frinedResponse {
  friend_id: number
  friend_name: string
  friend_avatar: string
  created_time: string
}
const currentUsername = localStorage.getItem('username')
const currentUserId = localStorage.getItem('userId')
const friends = ref<frinedResponse[]>([])
const fetchData = async () => {
  let res = await api.get(`/api/users/${currentUserId}/friends/details`)
  friends.value = res.data.data
}
const router = useRouter()
const onclick = async (id: number) => {
  let session_id = await getSessionId(id, Number(currentUserId))
  router.push(`/chat/${session_id}`)
}

await fetchData()
</script>

<style lang="scss">
@use '../styles/components/button.scss' as btn;
.container {
  background-color: #e3e3e3;
  // max-width: 700px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .info {
    display: flex;
    width: 90%;
    margin: auto auto;
    padding: 10px;
    border-radius: 10px;
    background-color: #ffffff;
    align-items: center;
    justify-content: center;

    margin-top: 30px;
    img {
      width: 50px;
      border-radius: 50%;
    }
    .username {
      color: #409eff;
      cursor: pointer;
      margin: 10px;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
