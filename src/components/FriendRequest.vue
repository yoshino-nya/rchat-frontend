<template>
  <div>
    Friend Request List
    <div class="container" v-for="req in friendRequests" :key="req.id">
      <div class="request">
        <img :src="req.user_avatar" alt="" />
        <div class="info">
          <div class="name" @click="router.push(`/profile/${req.user_name}`)">
            {{ req.user_name }}
          </div>
          <div class="msg" v-if="currentUserId">
            {{ req.user_from === currentUserId ? '正在验证你的申请' : '请求添加为好友' }}
          </div>
          <div class="time">
            {{ formatTime(req.created_time) }}
          </div>
          <div class="result">
            <div v-if="req.status === 'accepted' && currentUserId">
              {{ req.user_from === currentUserId ? '已添加' : '已同意' }}
            </div>
            <div v-else-if="req.status === 'rejected'">已拒绝</div>
            <div v-else>
              <button v-if="req.user_to === currentUserId" class="accept" @click="accept(req.id)">
                同意
              </button>
              <button v-if="req.user_to === currentUserId" class="reject" @click="reject(req.id)">
                拒绝
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getUserIdByUsername, getUsernameByUserId } from '@/api/user'
import { formatTime } from '@/utils/date'
import api from '@/api'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const currentUsername = localStorage.getItem('username')
const currentUserId = localStorage.getItem('userId')
const router = useRouter()
interface friendRequestResponse {
  user_from: string
  user_to: string
  created_time: string
  status: string
  id: number
  user_name: string
  user_avatar: string
}
const friendRequests = ref<friendRequestResponse[]>([])
const fetchData = async () => {
  console.log(currentUserId)
  let res = await api.get(`/api/users/${currentUserId}/friend_requests`)
  friendRequests.value = res.data.data
  console.log(friendRequests.value)
}
onMounted(async () => {
  await fetchData()
})
const accept = async (id: number) => {
  let res = await api.post(`/api/friend_request/${id}/accept`)
  await fetchData()
}
const reject = async (id: number) => {
  let res = await api.post(`/api/friend_request/${id}/reject`)
  await fetchData()
}
</script>
<style scoped lang="scss">
.container {
  font-size: 16px;
  background-color: #e3e3e3;
  display: flex;
  justify-content: center;
  .request {
    padding: 10px;
    background-color: #ffffff;
    margin: 10px;
    width: 90%;
    border-radius: 8px;
    display: flex;
    align-items: center;
    img {
      width: 50px;
      // height: 50px;
      border-radius: 50%;
      margin: 5px;
    }
    .info {
      display: flex;
      align-items: center;
      margin: 10px;
      flex: 1;
      .name {
        color: #409eff;
        cursor: pointer;
        margin-right: 5px;

        &:hover {
          text-decoration: underline;
        }
      }
      .time {
        color: #a5a5a5b7;
        font-weight: 400;
        margin: 10px;
      }
      .result {
        margin-left: auto;
        button {
          border: none;
          border-radius: 6px;
          height: 30px;
          padding: 6px 12px;
          transition: all 0.2s;
          cursor: pointer;
        }

        button.accept {
          background-color: #409eff;
          color: white;

          &:hover {
            background-color: #337ecc;
          }
        }

        button.reject {
          background-color: #f5f5f5;
          color: #666;

          &:hover {
            background-color: #e0e0e0;
          }
        }
        button + button {
          margin-left: 8px;
        }
      }
    }
  }
}
</style>
