<template>
  <div class="container mx-auto px-4 py-8 max-w-3xl">
    <h1 class="text-2xl font-bold text-primary mb-6">家长设置</h1>
    
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">账户信息</h2>
      <form @submit.prevent="updateAccount">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">电子邮箱</label>
            <input 
              v-model="accountForm.email" 
              type="email" 
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="请输入电子邮箱"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
            <input 
              v-model="accountForm.username" 
              type="text" 
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="请输入用户名"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">新密码（选填）</label>
            <input 
              v-model="accountForm.newPassword" 
              type="password" 
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="请输入新密码"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">确认新密码（选填）</label>
            <input 
              v-model="accountForm.confirmPassword" 
              type="password" 
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="请确认新密码"
            />
          </div>
        </div>
        
        <div class="mt-6">
          <button 
              type="submit" 
              class="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
              :disabled="isLoading"
            >
              {{ isLoading ? '保存中...' : '保存修改' }}
            </button>
        </div>
      </form>
    </div>
    
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4">系统设置</h2>
      
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <label class="text-gray-700">护眼模式</label>
          <input 
            v-model="systemSettings.eyeCareMode" 
            type="checkbox" 
            class="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
            @change="saveSystemSettings"
          />
        </div>
        
        <div class="flex items-center justify-between">
          <label class="text-gray-700">休息提醒</label>
          <input 
            v-model="systemSettings.restReminder" 
            type="checkbox" 
            class="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
            @change="saveSystemSettings"
          />
        </div>
        
        <div class="flex items-center justify-between">
          <label class="text-gray-700">自动播放</label>
          <input 
            v-model="systemSettings.autoPlay" 
            type="checkbox" 
            class="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
            @change="saveSystemSettings"
          />
        </div>
        
        <div class="pt-4 border-t border-gray-200">
          <button 
            @click="switchToChildMode" 
            class="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-md hover:opacity-90 transition-opacity flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            切换到儿童端
          </button>
        </div>
      </div>
    </div>
    
    <!-- 错误提示 -->
    <div v-if="error" class="mt-6 bg-red-50 text-red-500 p-4 rounded-md">
      {{ error }}
    </div>
    
    <!-- 成功提示 -->
    <div v-if="success" class="mt-6 bg-green-50 text-green-500 p-4 rounded-md">
      {{ success }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useMainStore } from '../../store'

const store = useMainStore()
const isLoading = ref(false)
const error = ref('')
const success = ref('')

// 账户表单数据
const accountForm = reactive({
  email: '',
  username: '',
  newPassword: '',
  confirmPassword: ''
});

// 切换到儿童端
const switchToChildMode = () => {
  // 记录当前用户角色，以便能够切换回来
  localStorage.setItem('lastRole', 'parent')
  // 切换到儿童端首页
  window.location.href = '/child'
}

// 系统设置
const systemSettings = reactive({
  eyeCareMode: false,
  restReminder: true,
  autoPlay: false
})

// 初始化表单数据
onMounted(() => {
  // 加载用户信息
  if (store.user) {
    accountForm.email = store.user.email || ''
    accountForm.username = store.user.user_metadata?.username || ''
  }
  
  // 加载系统设置
  loadSystemSettings()
})

// 加载系统设置
const loadSystemSettings = () => {
  try {
    const savedSettings = localStorage.getItem('systemSettings')
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings)
      Object.assign(systemSettings, parsedSettings)
    }
  } catch (err) {
    console.error('加载系统设置失败:', err)
  }
}

// 保存系统设置
const saveSystemSettings = () => {
  try {
    localStorage.setItem('systemSettings', JSON.stringify(systemSettings))
    
    // 触发全局设置更新
    if (window.__VUE_APP_INSTANCE__) {
      window.__VUE_APP_INSTANCE__.toggleEyeCareMode(systemSettings.eyeCareMode)
    }
  } catch (err) {
    console.error('保存系统设置失败:', err)
  }
}

// 更新账户信息
const updateAccount = async () => {
  isLoading.value = true
  error.value = ''
  success.value = ''
  
  try {
    // 表单验证
    if (!accountForm.email) {
      throw new Error('请输入电子邮箱')
    }
    
    if (accountForm.newPassword && accountForm.newPassword.length < 8) {
      throw new Error('密码长度至少为8个字符')
    }
    
    if (accountForm.newPassword && accountForm.newPassword !== accountForm.confirmPassword) {
      throw new Error('两次输入的密码不一致')
    }
    
    // 这里应该调用API更新用户信息
    // 由于是模拟环境，我们直接更新localStorage
    if (store.user) {
      const updatedUser = {
        ...store.user,
        email: accountForm.email,
        user_metadata: {
          ...store.user.user_metadata,
          username: accountForm.username
        }
      }
      
      // 更新store
      await store.setUser(updatedUser)
      
      // 显示成功消息
      success.value = '账户信息更新成功'
      
      // 3秒后清除成功消息
      setTimeout(() => {
        success.value = ''
      }, 3000)
    }
  } catch (err) {
    error.value = err.message || '更新失败，请重试'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* 组件特定样式 */
</style>