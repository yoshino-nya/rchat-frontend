import { reactive, computed } from 'vue'

const STORAGE_KEY = 'auth'

type User = {
  id: number
  username: string
  token?: string
}

function loadUser(): User | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

const state = reactive({
  user: loadUser()
})

function setUser(user: User | null) {
  state.user = user

  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

function clearUser() {
  setUser(null)
}

const isLogin = computed(() => !!state.user)

export function useAuth() {
  return {
    state,
    setUser,
    clearUser,
    isLogin
  }
}