<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-light to-secondary/10 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <div class="text-center">
        <h2 class="text-4xl font-bold text-primary mb-2">萌豆语文动画屋</h2>
        <p class="text-gray-600">登录开启语文学习之旅</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">邮箱地址</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">密码</label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all pr-10"
              placeholder="••••••••"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {{ showPassword ? '隐藏' : '显示' }}
            </button>
          </div>
        </div>

        <!-- 错误信息显示 -->
        <div v-if="error" class="bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg transition duration-150 ease-in-out hover:bg-primary/90 flex justify-center items-center"
          >
            <span v-if="isLoading" class="mr-2">加载中...</span>
            登录
          </button>
        </div>
      </form>

      <div class="text-center">
        <p class="text-sm text-gray-600">
          还没有账号？ <router-link to="/register" class="text-primary font-medium hover:underline">立即注册</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '../store'

const router = useRouter()
const store = useMainStore()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  error.value = ''
  isLoading.value = true
  
  try {
    await store.login(email.value, password.value)
    
    // 登录后直接跳转到儿童端
    router.push('/child')
  } catch (err) {
    error.value = err.message || '登录失败，请检查邮箱和密码'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.max-w-md {
  animation: fadeIn 0.5s ease-out;
}
</style>