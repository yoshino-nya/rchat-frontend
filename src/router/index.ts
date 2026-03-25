import FriendRequest from '@/components/FriendRequest.vue'
import Login from '@/components/Login.vue'
import Profile from '@/components/Profile.vue'
import Register from '@/components/Register.vue'
import SendMessage from '@/components/SendMessage.vue'
import Home from '@/views/Home.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Home },
    { path: '/chat/:userId', component: SendMessage, props: true },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/request', component: FriendRequest },
    { path: '/:username', component: Profile },
  ],
})

router.beforeEach((to, from) => {
  const userId = localStorage.getItem('userId')
  if (!userId) {
    if (to.path === '/login' || to.path === '/register') {
      return true
    } else {
      return '/login'
    }
  } else {
    if (to.path === '/login' || to.path === '/register') {
      return from.fullPath || '/home'
    } else {
      return true
    }
  }
})
export default router
