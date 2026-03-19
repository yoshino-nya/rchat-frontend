<template>
  <div class="chat-container">
    <!-- 消息显示区域 -->
    <div class="messages-container" ref="messagesContainer">
      <div class="message" v-for="(message, index) in messages" :key="index">
        <div class="message-sender">
          <strong>{{
            message.user_from === currentUserId ? 'You' : 'User ' + message.user_from
          }}</strong>
        </div>
        <div class="message-content">
          {{ message.content }}
        </div>
        <div class="message-time">
          {{ formatTime(message.created_time) }}
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="send-message-container">
      <input
        v-model="newMessage"
        type="text"
        placeholder="Type your message..."
        class="message-input"
      />
      <button @click="sendMessage" class="send-button">Send</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { User } from '@/models/user.ts'
import axios from 'axios'

// 当前用户ID和目标用户ID
const route = useRoute()
const currentUserId = User.getCurrentUserId()
const targetUserId = Number(route.params.userId)

// 消息列表和新消息
const messages = ref<any[]>([])
const newMessage = ref<string>('')

// 初始化 WebSocket 连接
let ws: WebSocket | null = null

// 获取历史消息
const fetchMessages = async () => {
  try {
    const res = await axios.get(`/api/messages/${currentUserId}/${targetUserId}`)
    messages.value = res.data
    scrollToBottom() // 获取消息后滚动到底部
  } catch (error) {
    console.error('Failed to fetch messages:', error)
  }
}

// 初始化 WebSocket
const initWebSocket = () => {
  ws = new WebSocket(`ws://localhost:4000/ws?user_from=${currentUserId}`)

  ws.onopen = () => {
    console.log('WebSocket connection established')
  }

  // 接收消息
  ws.onmessage = (event) => {
    const chatMsg = JSON.parse(event.data)
    messages.value.push(chatMsg) // 添加新消息到消息列表
    scrollToBottom() // 新消息自动滚动到最底部
  }

  // 监听连接关闭
  ws.onclose = () => {
    console.log('WebSocket connection closed')
  }

  // 监听错误
  ws.onerror = (error) => {
    console.error('WebSocket error:', error)
  }
}

// 发送消息
const sendMessage = () => {
  if (newMessage.value.trim() === '') return // 空消息不发送

  const messageToSend = {
    user_from: currentUserId,
    user_to: targetUserId,
    content: newMessage.value,
    created_time: new Date().toISOString(),
  }

  // 通过 WebSocket 发送消息
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(messageToSend))
    messages.value.push(messageToSend) // 立即回显发送的消息
    newMessage.value = '' // 发送后清空输入框
    scrollToBottom() // 滚动到消息底部
  }
}

// 格式化时间
const formatTime = (time: string) => {
  const date = new Date(time)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// 滚动到最新消息
const scrollToBottom = () => {
  const container = document.querySelector('.messages-container')
  if (container) {
    container.scrollTop = container.scrollHeight
  }
}

// 组件挂载时初始化数据
onMounted(() => {
  fetchMessages() // 获取历史消息
  initWebSocket() // 初始化 WebSocket 连接
})
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.messages-container {
  flex-grow: 1;
  overflow-y: auto;
  padding-right: 10px;
}

.message {
  margin-bottom: 10px;
  background-color: #fff;
  padding: 10px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.message-sender {
  font-size: 14px;
  font-weight: bold;
}

.message-content {
  margin-top: 5px;
  font-size: 16px;
}

.message-time {
  margin-top: 5px;
  font-size: 12px;
  color: #aaa;
}

.send-message-container {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.message-input {
  width: 80%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
  box-sizing: border-box;
}

.send-button {
  width: 15%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.send-button:hover {
  background-color: #45a049;
}
</style>
