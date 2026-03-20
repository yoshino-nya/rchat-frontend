<template>
  <div class="chat">
    <div class="friendName">{{ friendName }}</div>
    <div class="messages-container" ref="messagesContainer">
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
      </div>
    </div>

    <div class="input-area">
      <textarea
        v-model="inputMessage"
        placeholder="输入消息..."
        rows="1"
        @input="autoGrow"
        @keydown.enter.exact.prevent="sendMessage"
      ></textarea>
      <button @click="sendMessage">发送</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { type ChatMessage } from '@/models/message'
import { User } from '@/models/user'
import { useRoute } from 'vue-router'
import { onMounted, ref, nextTick } from 'vue'
import { formatTime } from '@/utils/date'

const route = useRoute()
const currentUserId = User.getCurrentUserId()
const targetUserId = Number(route.params.userId)
const messages = ref<ChatMessage[]>([])
const friendName = ref('test')
const inputMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

let ws: WebSocket | null

const InitData = async () => {
  let res = await axios.get<ChatMessage[]>(`/api/messages/${currentUserId}/${targetUserId}`)
  messages.value = res.data
  scrollToBottom()
}

const initWebSocket = async () => {
  ws = new WebSocket(`ws://localhost:4000/ws?user_from=${currentUserId}`)

  ws.onopen = () => {
    console.log('WebSocket connection established')
  }

  ws.onmessage = (event) => {
    const msg: ChatMessage = JSON.parse(event.data)
    messages.value.push(msg)
  }

  ws.onclose = () => {
    console.log('WebSocket connection closed')
  }

  ws.onerror = (e) => {
    console.log('WebSocket error', e)
  }
}

const sendMessage = () => {
  const content = inputMessage.value
  if (!content) return

  const msg: ChatMessage = {
    user_from: currentUserId,
    user_to: targetUserId,
    content,
    created_time: new Date().toISOString(),
  }

  messages.value.push(msg)
  scrollToBottom()
  if (ws && ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(msg))
    inputMessage.value = ''
  } else {
    messages.value.pop()
    alert('Send message fail')
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

onMounted(() => {
  InitData()
  initWebSocket()
})

const autoGrow = (e: Event) => {
  const el = e.target as HTMLTextAreaElement
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}
</script>

<style scoped lang="scss">
.chat {
  background-color: rgb(235, 235, 235);
  max-width: 500px;
  padding: 10px;
  .messages-container {
    max-height: 80vh;
    overflow-y: auto;
    padding: 10px 0;
    display: flex;
    flex-direction: column; /* 让消息从上到下排列 */
    gap: 12px; /* 消息间距，可选 */
    -ms-overflow-style: none; /* IE / Edge (旧版) */
    scrollbar-width: none; /* Firefox */
  }

  .messages-container::-webkit-scrollbar {
    display: none; /* Chrome / Safari / 新 Edge / Opera */
  }

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

  .input-area {
    display: flex;
    gap: 8px;
    padding: 8px 10px;
  }

  textarea {
    flex: 1;
    min-height: 36px;
    max-height: 200px;
    padding: 8px 12px;
    font-size: 12px;
    line-height: 1.4;
    border: none;
    border-radius: 6px;
    resize: none;
    outline: none;
    box-sizing: border-box;

    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  textarea::-webkit-scrollbar {
    display: none;
  }

  button {
    width: 60px;
    height: 36px;
    background: rgb(124, 181, 238);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
  }

  button:hover {
    background: rgb(100, 160, 220);
  }
}
</style>
