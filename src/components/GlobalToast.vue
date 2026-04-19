<template>
  <div v-if="show" :class="['toast', type]">
    {{ message }}
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const show = ref(false)
const message = ref('')
const type = ref('info')

const addToast = (
  msg: string,
  t: 'success' | 'error' | 'info' | 'warning' = 'info',
  duration: number = 5000,
) => {
  message.value = msg
  type.value = t
  show.value = true
  setTimeout(() => (show.value = false), duration)
}
defineExpose({
  addToast,
})
</script>

<style scoped lang="scss">
.toast {
  position: fixed;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  min-width: 260px;
  max-width: 420px;
  padding: 14px 24px;
  border-radius: 8px;

  font-size: 15px;
  line-height: 1.5;
  text-align: center;

  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);

  border: 1px solid rgba(0, 0, 0, 0.08);
  &.success {
    background-color: #f0fdf4;
    border: 1px solid #86efac;
    color: #166534;
  }

  &.error {
    background-color: #fef2f2;
    border: 1px solid #fca5a5;
    color: #991b1b;
  }

  &.warning {
    background-color: #fffbeb;
    border: 1px solid #fcd34d;
    color: #92400e;
  }

  &.info {
    background-color: #f0f9ff;
    border: 1px solid #93c5fd;
    color: #1e40af;
  }
}
</style>
