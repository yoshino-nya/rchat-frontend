import Login from '@/components/Login.vue'
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
  ],
})

router.beforeEach((to, from, next) => {
  const userId = localStorage.getItem('userId')
  if (!userId) {
    if (to.path === '/login' || to.path === '/register') {
      next()
    } else {
      next('/login')
    }
  } else {
    if (to.path === '/login' || to.path === '/register') {
      next(from.fullPath || '/home')
    } else {
      next()
    }
  }
})
export default router
