import CreateGroup from '@/components/CreateGroup.vue'
import FriendList from '@/components/FriendList.vue'
import FriendRequest from '@/components/FriendRequest.vue'
import Login from '@/components/Login.vue'
import Profile from '@/components/Profile.vue'
import Register from '@/components/Register.vue'
import SendMessage from '@/components/SendMessage.vue'
import SessionList from '@/components/SessionList.vue'
import UserSettings from '@/components/UserSettings.vue'
import Home from '@/views/Home.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home,
      redirect: '/chat',
      children: [
        { path: '/chat/:session_id', component: SendMessage, props: true },
        { path: '/request', component: FriendRequest },
        { path: '/profile/:username', component: Profile },
        { path: '/profile/:username/settings', component: UserSettings },
        { path: '/friends', component: FriendList },
        { path: '/chat', component: SessionList },
        { path: '/groups/create', component: CreateGroup },
      ],
    },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/test', component: () => import('@/components/GlobalToast.vue') },
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
