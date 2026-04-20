<template>
  <div class="chat">
    <div class="title">
      <div class="friendName">{{ sessionName }}</div>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" @click="open = !open">
        <path
          d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z"
          stroke="#000000"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
          stroke="#000000"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z"
          stroke="#000000"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <div class="messages-container" ref="messagesContainer">
      <div
        :class="['message', message.sender_id === currentUserId ? 'mine' : '']"
        v-for="message in messages"
      >
        <!-- <div class="sender">user {{ message.user_from }}</div> -->
        <div class="time">{{ formatTime(message.created_time!) }}</div>
        <template v-if="message.sender_id === currentUserId">
          <div class="content-box">
            <div class="content">{{ message.content }}</div>
            <img :src="message.sender_avatar" />
          </div>
        </template>
        <template v-else>
          <div class="content-box">
            <img :src="message.sender_avatar" style="margin-right: 5px" />
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
    <div v-if="open" class="overlay" @submit.prevent="onsubmit">
      <form class="dialog">
        <div class="dialog-title">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            @click="open = false"
          >
            <path
              d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5"
              stroke="#1C274C"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <path
              d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
              stroke="#1C274C"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <div class="dialog-item">
          <label for="text">编辑备注</label>
          <input type="text" v-model="editName" />
        </div>
        <button>提交</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import api from '@/api'
import { type ChatMessage, type ChatMessageResponse } from '@/models/message'
import { User } from '@/models/user'
import { useRoute } from 'vue-router'
import { onMounted, ref, nextTick } from 'vue'
import { formatTime } from '@/utils/date'
import { toast } from '@/utils/toast'

const route = useRoute()
const currentUserId = User.getCurrentUserId()
const sessionId = route.params.session_id as string
const messages = ref<ChatMessageResponse[]>([])
const friendName = ref('test')
const inputMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)
const sessionName = ref('')
const open = ref(false)

let ws: WebSocket | null

const InitData = async () => {
  let res = await api.get(`/api/sessions/${sessionId}/messages`)
  messages.value = res.data.data
  console.log(res.data.data)
  res = await api.get(`/api/sessions/${sessionId}`)
  console.log(res.data.data)
  sessionName.value = res.data.data.name

  scrollToBottom()
}

const initWebSocket = async () => {
  ws = new WebSocket(`ws://${window.location.hostname}:4000/ws?user_id=${currentUserId}`)

  ws.onopen = () => {
    console.log('WebSocket connection established')
  }

  ws.onmessage = (event) => {
    const msg: ChatMessageResponse = JSON.parse(event.data)
    messages.value.push(msg)
    scrollToBottom()
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
    sender_id: currentUserId,
    content,
    session_id: sessionId,
  }

  // messages.value.push(msg)
  if (ws && ws.readyState === ws.OPEN) {
    console.log(msg)
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
const editName = ref(sessionName)
const onsubmit = async () => {
  let res = await api.patch(`/api/sessions/${sessionId}`, {
    name: editName.value,
  })
  if (res.status === 200) {
    sessionName.value = editName.value
    open.value = false
    toast.success('修改成功')
  } else {
    toast.error('修改失败')
  }
}
</script>

<style scoped lang="scss">
.chat {
  background-color: rgb(235, 235, 235);
  max-width: 500px;
  .messages-container {
    max-height: 80vh;
    overflow-y: auto;
    padding: 10px;
    display: flex;
    flex-direction: column; /* 让消息从上到下排列 */
    gap: 12px; /* 消息间距，可选 */
    -ms-overflow-style: none; /* IE / Edge (旧版) */
    scrollbar-width: none; /* Firefox */
  }

  .messages-container::-webkit-scrollbar {
    display: none; /* Chrome / Safari / 新 Edge / Opera */
  }

  .title {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #c9c9c9;
    padding: 8px 12px;
    svg {
      height: 20px;
      width: 20px;
      margin-left: auto;
      cursor: pointer;
      padding: 4px;
      border-radius: 5px;
      &:hover {
        background-color: #dbdbdb;
      }
    }
  }
  img {
    width: 27px;
    border-radius: 50%;
  }
  .content-box {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: 10px;
  }
  .message {
    .content {
      font-size: 12px;
      border-radius: 6px;
      padding: 5px;
      background-color: white;

      overflow-wrap: break-word;
      max-width: 80%;
      text-align: justify;
    }

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

    .time {
      font-size: 10px;
      color: rgb(160, 160, 160);
    }
  }

  .input-area {
    display: flex;
    gap: 8px;
    padding: 8px 10px;
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

  .dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 8px;
    padding: 5px;
    input,
    lebel {
      height: 20px;
    }
    input {
      margin-left: 10px;
      &:focus {
        outline: none;
      }
    }
    .dialog-title {
      display: flex;
    }
    svg {
      height: 20px;
      width: 20px;
      padding: 4px;
      border-radius: 4px;
      margin-left: auto;
      &:hover {
        background-color: #dbdbdb;
      }
    }
    .dialog-item {
      margin: 10px;
    }
    button {
      margin-left: 10px;
      height: 30px;
    }
  }
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }
}
</style>
