<template>
  <div class="container">
    <div class="name">
      <img :src="user.avatar" alt="" />
      <div>
        {{ user.username }}
      </div>
    </div>
    <button class="btn primary" v-if="Number(currentUserId) === user.id">编辑资料</button>
    <button class="btn primary" v-else-if="isFriend" @click="onclick(user.id)">发消息</button>
    <button class="btn primary" @click="sendRequest()" v-else>加好友</button>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from '@/utils/toast'
import { getSessionId } from '@/api/getSessionId'

const route = useRoute()
const router = useRouter()
let username = route.params.username
const user = ref()
const currentUserId = localStorage.getItem('userId')
const isFriend = ref(false)

const fetchData = async () => {
  // get username
  let res = await axios.get(`/api/users/name/${username}`)
  user.value = res.data.data
  // user.id is i32

  // get friendship state
  res = await axios.get(`/api/relationships/${currentUserId}/${user.value.id}`)
  isFriend.value = res.data.is_friend
}
const sendRequest = async () => {
  let res = await axios.post(`/api/friend_request`, {
    user_from: Number(currentUserId),
    user_to: user.value.id,
  })
  if (res.status === 200) {
    toast.success('好友申请发送成功')
  }
}
const onclick = async (id: number) => {
  let session_id = await getSessionId(id, Number(currentUserId))
  router.push(`/chat/${session_id}`)
}
watch(
  () => route.params.username,
  (newUsername) => {
    if (newUsername) {
      username = newUsername
      fetchData()
    }
  },
  { immediate: true },
)
await fetchData()
</script>
<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  img {
    width: 50px;
    border-radius: 50%;
  }
  .name {
    align-items: center;
    justify-content: center;
  }
  button {
    width: 300px;
  }
}
</style>
