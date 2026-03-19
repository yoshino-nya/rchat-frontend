<template>
  <div class="chat">
    <div class="friendName">{{ friendName }}</div>
    <div
      :class="['message', message.user_from === currentUserId ? 'mine' : '']"
      v-for="message in messages"
    >
      <!-- <div class="sender">user {{ message.user_from }}</div> -->
      <div class="time">{{ formatTime(message.created_time!) }}</div>
      <template v-if="message.user_from === currentUserId">
        <div class="content-box">
          <div class="content">{{ message.content }}</div>
          <img src="/avatar.jpg" />
        </div>
      </template>
      <template v-else>
        <div class="content-box">
          <img src="/avatar.jpg" style="margin-right: 5px" />
          <div class="content">{{ message.content }}</div>
        </div>
      </template>
      <br />
    </div>
    <input />
    <button>发送</button>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { type ChatMessage } from '@/models/message'
import { User } from '@/models/user'
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { formatTime } from '@/utils/date'

const route = useRoute()
const currentUserId = User.getCurrentUserId()
const targetUserId = Number(route.params.userId)
const messages = ref<ChatMessage[]>([])
const friendName = ref('test')

const InitData = async () => {
  let res = await axios.get<ChatMessage[]>(`/api/messages/${currentUserId}/${targetUserId}`)
  messages.value = res.data
}

onMounted(() => {
  InitData()
})
</script>

<style scoped lang="scss">
.chat {
  background-color: rgb(235, 235, 235);
  max-width: 500px;
  padding: 10px;
  .friendName {
    text-align: center;
  }
  img {
    width: 27px;
    border-radius: 50%;
  }
  .content-box {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .message {
    &.mine {
      .content {
        background-color: rgb(11, 138, 207);
        color: white;
      }

      .content-box {
        justify-content: flex-end;
      }
      img {
        margin-left: 5px;
      }
    }

    .content {
      font-size: 12px;
      border-radius: 6px;
      padding: 5px;
      background-color: white;
    }

    .time {
      font-size: 10px;
      color: rgb(160, 160, 160);
    }
  }

  input,
  button {
    border-radius: 5px;
    border: none;
  }
  input:focus {
    outline: none;
  }
  input {
    width: 400px;
  }
  button {
    background-color: rgb(124, 181, 238);
    border-radius: 6px;
    border: none;
  }
}
</style>
