<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-light to-secondary/10 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <div class="text-center">
        <h2 class="text-4xl font-bold text-primary mb-2">萌豆语文动画屋</h2>
        <p class="text-gray-600">注册账号，为孩子开启语文启蒙之旅</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6">
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
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            placeholder="至少8个字符"
          />
          <p v-if="password.length > 0 && password.length < 8" class="mt-1 text-xs text-red-500">
            密码长度至少为8个字符
          </p>
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">确认密码</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            placeholder="再次输入密码"
          />
          <p v-if="confirmPassword.length > 0 && confirmPassword !== password" class="mt-1 text-xs text-red-500">
            两次输入的密码不一致
          </p>
        </div>

        <div>
          <label for="role" class="block text-sm font-medium text-gray-700 mb-1">注册身份</label>
          <select
            id="role"
            v-model="role"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          >
            <option value="parent">家长</option>
            <option value="admin">管理员</option>
          </select>
        </div>

        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input
              id="terms"
              v-model="agreeToTerms"
              type="checkbox"
              required
              class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
          </div>
          <div class="ml-3 text-sm">
            <label for="terms" class="text-gray-500">
              我已阅读并同意 <a href="#" class="text-primary hover:underline">服务条款</a> 和 <a href="#" class="text-primary hover:underline">隐私政策</a>
            </label>
          </div>
        </div>

        <!-- 错误信息显示 -->
        <div v-if="error" class="bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading || !isFormValid"
            class="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg transition duration-150 ease-in-out hover:bg-primary/90 flex justify-center items-center"
          >
            <span v-if="isLoading" class="mr-2">注册中...</span>
            注册
          </button>
        </div>
      </form>

      <div class="text-center">
        <p class="text-sm text-gray-600">
          已有账号？ <router-link to="/login" class="text-primary font-medium hover:underline">立即登录</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '../store'

const router = useRouter()
const store = useMainStore()
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref('parent')
const agreeToTerms = ref(false)
const error = ref('')
const isLoading = ref(false)

const isFormValid = computed(() => {
  return (
    email.value.trim() !== '' &&
    password.value.length >= 8 &&
    password.value === confirmPassword.value &&
    agreeToTerms.value
  )
})

const handleRegister = async () => {
  error.value = ''
  isLoading.value = true
  
  try {
    await store.register(email.value, password.value, {
      role: role.value
    })
    
    // 根据用户角色重定向
    if (role.value === 'parent') {
      router.push('/parent')
    } else if (role.value === 'admin') {
      router.push('/admin')
    } else {
      router.push('/')
    }
  } catch (err) {
    error.value = err.message || '注册失败，请稍后重试'
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