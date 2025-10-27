<template>
  <div class="min-h-screen bg-light text-dark">
    <!-- 全局错误提示 -->
    <div v-if="error" class="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg animate-fadeIn">
      {{ error }}
      <button @click="clearError" class="ml-2 text-white hover:text-gray-200">×</button>
    </div>
    
    <!-- 全局成功提示 -->
    <div v-if="successMessage" class="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg animate-fadeIn">
      {{ successMessage }}
      <button @click="clearSuccess" class="ml-2 text-white hover:text-gray-200">×</button>
    </div>
    

    
    <!-- 休息提醒 -->
    <div v-if="showRestReminder" class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl p-8 max-w-md w-full text-center">
        <h3 class="text-2xl font-bold text-primary mb-4">该休息一下了！</h3>
        <p class="text-gray-600 mb-6">连续观看时间过长，建议休息30秒后再继续学习</p>
        <button @click="dismissRestReminder" class="bg-primary text-white font-bold py-3 px-8 rounded-lg">
          我知道了
        </button>
      </div>
    </div>
    
    <!-- 主内容区域 -->
    <div :class="{ 'eye-care': isEyeCareMode }">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useMainStore } from './store'

const store = useMainStore()
const error = ref('')
const successMessage = ref('')
const isEyeCareMode = ref(false)
const showEyeCareReminder = ref(false)
const showRestReminder = ref(false)
let watchTimeInterval = null
let watchTime = 0

// 全局错误处理
const setError = (message) => {
  error.value = message
  setTimeout(() => {
    error.value = ''
  }, 5000)
}

const clearError = () => {
  error.value = ''
}

// 全局成功提示
const setSuccessMessage = (message) => {
  successMessage.value = message
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}

const clearSuccess = () => {
  successMessage.value = ''
}

// 护眼模式切换
const toggleEyeCareMode = () => {
  isEyeCareMode.value = !isEyeCareMode.value
  showEyeCareReminder.value = false
  // 存储到本地
  localStorage.setItem('eyeCareMode', isEyeCareMode.value.toString())
}

// 休息提醒相关
const startWatchTimeTracking = () => {
  if (watchTimeInterval) clearInterval(watchTimeInterval)
  
  watchTimeInterval = setInterval(() => {
    watchTime += 1
    // 每10分钟提示休息
    if (watchTime >= 600) { // 10分钟 = 600秒
      showRestReminder.value = true
      clearInterval(watchTimeInterval)
    }
  }, 1000)
}

const dismissRestReminder = () => {
  showRestReminder.value = false
  watchTime = 0
  startWatchTimeTracking()
}

// 组件挂载时初始化
onMounted(async () => {
  // 加载用户信息
  try {
    await store.loadUser()
  } catch (err) {
    console.log('未登录或会话已过期')
  }
  
  // 恢复护眼模式设置
  const savedEyeCareMode = localStorage.getItem('eyeCareMode')
  if (savedEyeCareMode === 'true') {
    isEyeCareMode.value = true
  }
  
  // 延迟显示护眼模式提示
  setTimeout(() => {
    showEyeCareReminder.value = true
  }, 30000)
  
  // 开始计时
  startWatchTimeTracking()
})

// 暴露全局方法给子组件使用
defineExpose({
  setError,
  setSuccessMessage
})
</script>

<style>
/* 全局动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
