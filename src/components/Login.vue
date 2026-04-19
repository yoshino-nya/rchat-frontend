<template>
  <form @submit.prevent="handleLogin">
    <div class="title">登录</div>
    <div class="field">
      <label for="username">用户名</label>
      <input
        id="username"
        @input="clearError"
        v-model.trim="form.username"
        type="text"
        placeholder="请输入用户名"
        autocomplete="username"
        required
        autofocus
      />
    </div>
    <div class="field">
      <label for="password">密码</label>
      <input
        id="password"
        @input="clearError"
        v-model.trim="form.password"
        type="password"
        placeholder="请输入密码"
        autocomplete="password"
        required
      />
    </div>
    <div v-if="errorMsg" class="error">
      {{ errorMsg }}
    </div>
    <button type="submit">登录</button>
    <div class="register-prompt">
      <p>没有账号？<router-link to="/register">去注册</router-link></p>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'
import { User } from '@/models/user'
const router = useRouter()
const { setUser } = useAuth()
const form = reactive({
  username: '',
  password: '',
})
const errorMsg = ref('')
const clearError = () => {
  errorMsg.value = ''
}
const handleLogin = async () => {
  try {
    const res = await axios.post('/api/login', form)
    console.log(res.data)
    if (res.status === 200) {
      clearError()
      setUser({
        id: res.data.user_id,
        username: res.data.username,
      })
      localStorage.setItem('userId', res.data.user_id)
      localStorage.setItem('username', res.data.username)
      router.push('/')
    }
  } catch (error) {
    console.log(error)
    if (error instanceof AxiosError) {
      const status = error.response?.status
      if (!status) {
        errorMsg.value = '网络错误'
      } else if (status === 401 || status === 404) {
        errorMsg.value = '账号或密码错误'
        // Status::UNAUTHORIZED NOT_FOUND
      } else {
        errorMsg.value = '未知错误'
        console.log('错误:', status)
      }
    }
  }
}
</script>
<style scoped lang="scss">
form {
  width: 360px;
  margin: 120px auto;
  padding: 24px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  display: flex;
  flex-direction: column;
  gap: 16px;
}

.title {
  text-align: center;
  font-size: 20px;
  font-weight: 600;
}

.field {
  display: flex;
  align-items: center;
}

.field label {
  width: 70px;
  font-size: 14px;
  color: #555;
}

.field input {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  outline: none;
  transition: border 0.2s;
}

.field input:focus {
  border-color: #409eff;
}

button {
  margin-top: 8px;
  padding: 10px;
  border: none;
  border-radius: 6px;
  background: #409eff;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}

button:hover {
  opacity: 0.9;
}

.error {
  color: #e74c3c;
  font-size: 13px;
  text-align: center;
  min-height: 18px;
}

.title {
  text-align: center;
  font-size: 20px;
  font-weight: 600;
}

.register-prompt {
  text-align: center;
  font-size: 14px;
}

.register-prompt router-link {
  color: #409eff;
  text-decoration: none;
}

.register-prompt router-link:hover {
  text-decoration: underline;
}
</style>
