import SendMessage from '@/components/SendMessage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{ path: '/chat/:userId', component: SendMessage, props: true }],
})

export default router
