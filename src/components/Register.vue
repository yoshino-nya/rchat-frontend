<template>
  <form @submit.prevent="handleSubmit">
    <div class="title">注册账号</div>
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
    <div class="field">
      <label for="password">确认密码</label>
      <input
        id="password"
        @input="clearError"
        v-model.trim="form.verifyPassword"
        type="password"
        placeholder="请再次输入密码"
        required
      />
    </div>
    <div v-if="errorMsg" class="error">
      {{ errorMsg }}
    </div>
    <button type="submit">注册</button>
    <div class="login-prompt">
      <p>已有账号？<router-link to="/login">去登录</router-link></p>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'vue-router'
const router = useRouter()
const form = reactive({
  username: '',
  password: '',
  verifyPassword: '',
})
const errorMsg = ref('')
const clearError = () => {
  errorMsg.value = ''
}
const handleSubmit = async () => {
  if (form.password != form.verifyPassword) {
    errorMsg.value = '两次输入密码不一致'
    return
  }
  try {
    const res = await axios.post('/api/register', form)
    if (res.status === 200) {
      clearError()
      alert('注册成功')
      router.push('/login')
    }
  } catch (error) {
    console.log(error)
    if (error instanceof AxiosError) {
      const status = error.response?.status
      if (!status) {
        errorMsg.value = '网络错误'
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
.login-prompt {
  text-align: center;
  font-size: 14px;
}

.login-prompt router-link {
  color: #409eff;
  text-decoration: none;
}

.login-prompt router-link:hover {
  text-decoration: underline;
}
</style>
