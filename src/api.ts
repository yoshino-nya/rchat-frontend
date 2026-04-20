// api.ts
import axios from 'axios'
import { useAuth } from './stores/auth'

const api = axios.create({
  baseURL: '',
})

const { state } = useAuth()

api.interceptors.request.use((config) => {
  const token = state.user?.token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
