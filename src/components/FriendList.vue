<template>
  <div class="container">
    <div>{{ currentUsername }}</div>
    <div>
      friend of {{ friends.length }} users
      <div class="info" v-for="friend in friends">
        <img src="/avatar.jpg" alt="" />
        <div class="username" @click="router.push(`/profile/${friend.username}`)">
          {{ friend.username }}
        </div>
        <button class="btn primary" style="margin-left: auto" @click="onclick(friend.id)">
          发消息
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getSessionId } from '@/api/getSessionId'
import { getUsernameByUserId } from '@/api/user'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

interface frinedResponse {
  id: number
  username: string
}
const currentUsername = localStorage.getItem('username')
const currentUserId = localStorage.getItem('userId')
const friends = ref<frinedResponse[]>([])
const fetchData = async () => {
  let res = await axios.get(`/api/users/${currentUserId}/friends`)
  // 目前返回的是 i32 数组
  for (const id of res.data) {
    friends.value.push({ id: id, username: await getUsernameByUserId(String(id)) })
  }

  console.log(res.data)
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
