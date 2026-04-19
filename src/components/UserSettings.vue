<template>
  <div>
    <h3>上传头像</h3>

    <input type="file" accept="image/*" @change="onFileChange" />

    <!-- 裁剪区域 -->
    <div v-if="imgSrc" style="margin-top: 20px">
      <Cropper
        ref="cropperRef"
        :src="imgSrc"
        :stencil-component="CircleStencil"
        :stencil-props="{
          movable: true,
          resizable: true,
          scalable: true,
        }"
        :default-boundaries="'fit'"
        background-class="no-black-bg"
        style="max-height: 480px; width: 100%; background: #f8f8f8"
      />

      <div style="margin-top: 15px">
        <button @click="cropAndUpload">确认并上传头像</button>
        <button @click="reset" style="margin-left: 10px">重新选择</button>
      </div>
    </div>

    <!-- 预览（圆形） -->
    <div v-if="previewUrl" style="margin-top: 25px">
      <p>上传成功！头像预览：</p>
      <img
        :src="previewUrl"
        style="
          width: 180px;
          height: 180px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #ddd;
        "
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import { Cropper, CircleStencil } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

const cropperRef = ref<any>(null)
const imgSrc = ref<string>('')
const previewUrl = ref<string>('')

// 选择图片
const onFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  if (imgSrc.value) URL.revokeObjectURL(imgSrc.value)
  imgSrc.value = URL.createObjectURL(file)
  previewUrl.value = ''
}

// 裁剪并上传
const cropAndUpload = async () => {
  if (!cropperRef.value) return

  const result = cropperRef.value.getResult()
  const canvas = result.canvas

  if (!canvas) return

  canvas.toBlob(
    async (blob: Blob) => {
      if (!blob) return

      const formData = new FormData()
      formData.append('avatar', blob, 'avatar.jpg')

      const res = await axios.post('/api/upload/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      previewUrl.value = res.data.data
      console.log(res.data.data)
    },
    'image/jpeg',
    0.92,
  )
}

const reset = () => {
  if (imgSrc.value) URL.revokeObjectURL(imgSrc.value)
  imgSrc.value = ''
  previewUrl.value = ''
}
</script>
<style scoped>
.no-black-bg {
  background: transparent !important;
  opacity: 1;
}
</style>
