<template>
  <div class="chatList">
    <div>会话列表</div>
    <div class="session" v-for="s in sessions" :key="s.id" @click="onclick(s.uuid)">
      <img :src="s.avatar" />
      <div class="info">
        <div class="title">{{ s.name }}</div>
        <div class="last_msg">
          {{ s.type === 'Group' ? s.last_msg_sender + ': ' : '' }}
          {{ s.last_msg_content }}
        </div>
      </div>
      <div class="time">{{ formatTime(s.last_msg_time) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type SessionResponse } from '@/models/session'
import { formatTime } from '@/utils/date'
import api from '@/api'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const currentUserId = localStorage.getItem('userId')
const sessions = ref<SessionResponse[]>([])
const router = useRouter()

let fetchData = async () => {
  let res = await api.get(`/api/users/${currentUserId}/sessions`)
  console.log(res.data.data)
  sessions.value = res.data.data

  sessions.value.sort((a: SessionResponse, b: SessionResponse) => {
    if (!a.last_msg_time) return 1
    if (!b.last_msg_time) return -1
    return -a.last_msg_time.localeCompare(b.last_msg_time)
  })
}
const onclick = async (session_id: string) => {
  router.push(`/chat/${session_id}`)
}

await fetchData()
</script>

<style scoped lang="scss">
.chatList {
  background-color: #e3e3e3;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .session {
    display: flex;
    width: 90%;
    margin: auto auto;
    padding: 10px;
    border-radius: 10px;
    background-color: #ffffff;
    cursor: pointer;
    margin-top: 30px;
    &:hover {
      background-color: #f0f2f5;
    }
    img {
      width: 50px;
      border-radius: 50%;
    }
    .info {
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
    .last_msg {
      font-size: 14px;
      color: #888;
    }
    .time {
      margin-left: auto;
      font-size: 14px;
      color: #888;
    }
  }
}
</style>
