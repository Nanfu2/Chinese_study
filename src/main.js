import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import { useMainStore } from './store'
import { auth } from './services/supabase'

// 创建应用实例
const app = createApp(App)

// 使用Pinia进行状态管理
app.use(createPinia())

// 使用Vue Router进行路由管理
app.use(router)

// 挂载应用
app.mount('#app')

// 应用挂载后从Supabase恢复用户状态
// 使用更安全的方式处理用户状态恢复
setTimeout(async () => {
  try {
    const store = useMainStore()
    // 从Supabase获取当前用户信息
    const userData = await auth.getCurrentUser()
    if (userData) {
      // 直接设置状态而不是调用异步方法
      store.user = userData
      store.isAuthenticated = !!userData
      console.log('用户状态已恢复')
    }
  } catch (error) {
    console.error('恢复用户状态失败:', error)
  }
}, 0)
