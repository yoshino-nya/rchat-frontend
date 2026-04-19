import { createApp } from 'vue'
import Toast from '../components/GlobalToast.vue'

let instance: any

function init() {
  const div = document.createElement('div')
  document.body.appendChild(div)
  instance = createApp(Toast).mount(div)
}

function baseToast(
  msg: string,
  type: 'success' | 'error' | 'info' | 'warning' = 'info',
  duration = 3000,
) {
  if (!instance) init()
  instance.addToast(msg, type, duration)
}

export const toast = Object.assign(baseToast, {
  success(msg: string, duration = 3000) {
    baseToast(msg, 'success', duration)
  },
  error(msg: string, duration = 3000) {
    baseToast(msg, 'error', duration)
  },
  warning(msg: string, duration = 3000) {
    baseToast(msg, 'warning', duration)
  },
  info(msg: string, duration = 3000) {
    baseToast(msg, 'info', duration)
  },
})
