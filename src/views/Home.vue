<template>
  <div class="app">
    <div class="header">
      <div class="icon" @click="router.push('/')">
        <img src="/favicon.ico" alt="" />
        <p>rchat</p>
      </div>
      <div class="info">
        <router-link class="link primary" :to="{ path: `/profile/${username}` }">{{
          username
        }}</router-link>
        |
        <div class="link primary" @click="logout">logout</div>
      </div>
    </div>
    <div class="content">
      <div class="sidebar">
        <div>
          <router-link to="/chat" class="link primary" active-class="active-link"
            >Messages</router-link
          >
        </div>
        <div>
          <router-link to="/friends" class="link primary" active-class="active-link"
            >My Friends</router-link
          >
        </div>
        <div>
          <router-link to="/request" class="link primary" active-class="active-link"
            >Request</router-link
          >
        </div>
        <div>
          <router-link to="/groups/create" class="link primary" active-class="active-link"
            >Creat Group</router-link
          >
        </div>
        <form class="find-user" @submit.prevent="onSubmit">
          <div class="title">Find user</div>
          <div class="search">
            <label for="text">username:&nbsp;</label>
            <input type="text" v-model="keyWord" />
          </div>
          <button>Find</button>
        </form>
      </div>
      <main class="main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toast } from '@/utils/toast'
import api from '@/api'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = localStorage.getItem('username')
const router = useRouter()
const keyWord = ref('')
const onSubmit = async () => {
  try {
    const res = await api.get(`/api/users/name/${keyWord.value}`)
    console.log(res.status)
    router.push(`/profile/${keyWord.value}`)
    keyWord.value = ''
  } catch (e) {
    toast.error('用户不存在')
  }
}
const logout = async () => {
  localStorage.clear()
  router.push('/')
}
</script>

<style scoped lang="scss">
.app {
  height: 100vh;
  box-sizing: border-box;
  padding: 20px;
  width: 100%;
  background-color: #f5f4f5;

  .header {
    margin-bottom: 10px;
    height: 50px;
    border-bottom: 1px solid #ddd;
    display: flex;
    align-items: center;
    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      &:hover {
        cursor: pointer;
      }
    }
    .info {
      margin-left: auto;
      display: flex;
      gap: 5px;
    }
  }
}
.content {
  width: 100%;
  display: flex;

  .sidebar {
    gap: 10px;
    display: flex;
    flex-direction: column;
    margin-right: 10px;

    .find-user {
      border: 1px solid #b1b4b6;
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      .title {
        border-bottom: 1px solid #b1b4b6;
        padding: 10px;
        font-weight: 800;
      }
      .search {
        padding: 10px;
      }
      input {
        width: 150px;
      }
      button {
        margin-left: auto;
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
    .active-link {
      font-weight: 800;
      background: #aaccff;
      border-radius: 4px;
      padding: 4px 8px;
    }
  }
}

.main {
  flex: 1;
}
</style>
