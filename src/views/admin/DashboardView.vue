<template>
  <div class="min-h-screen bg-light text-dark admin-ui">
    <!-- 顶部导航 -->
    <header class="p-4 bg-white shadow-sm">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center">
          <img src="/logo.svg" alt="萌豆语文动画屋" class="h-10 w-10 rounded-full mr-3" />
          <h1 class="text-2xl font-bold text-primary">管理员后台</h1>
        </div>
        <div class="flex items-center space-x-4">
          <div class="relative">
            <button @click="toggleUserMenu" class="flex items-center space-x-2">
              <img src="/logo.svg" alt="管理员头像" class="h-8 w-8 rounded-full" />
              <span>管理员</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <!-- 用户下拉菜单 -->
            <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
              <button @click="logout" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">退出登录</button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 侧边导航 -->
    <div class="flex">
      <aside class="w-64 bg-gray-100 h-[calc(100vh-64px)] p-4">
        <nav>
          <ul class="space-y-2">
            <li>
              <a 
                href="/admin" 
                class="block px-4 py-3 rounded-lg bg-primary text-white font-medium"
              >
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  仪表盘
                </div>
              </a>
            </li>
            <li>
              <a 
                href="/admin/users" 
                class="block px-4 py-3 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              >
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  用户管理
                </div>
              </a>
            </li>
            <li>
              <a 
                href="/admin/content" 
                class="block px-4 py-3 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              >
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  内容管理
                </div>
              </a>
            </li>
            <li>
              <a 
                href="/admin/statistics" 
                class="block px-4 py-3 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              >
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                  统计分析
                </div>
              </a>
            </li>
            <li>
              <a 
                href="/admin/settings" 
                class="block px-4 py-3 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              >
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  系统设置
                </div>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- 主内容区域 -->
      <main class="flex-1 p-6">
        <div class="container mx-auto">
          <h2 class="text-xl font-bold mb-6">欢迎来到管理员后台</h2>
          
          <!-- 加载状态 -->
          <div v-if="isLoading" class="bg-white rounded-lg shadow p-8 mb-6 text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p class="text-gray-600">正在加载数据...</p>
          </div>
          
          <!-- 错误提示 -->
          <div v-else-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-red-700">{{ errorMessage }}</span>
            </div>
          </div>
          
          <!-- 统计卡片 -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
              <h3 class="text-gray-500 text-sm font-medium">总用户数</h3>
              <p class="text-3xl font-bold mt-2">{{ totalUsers }}</p>
              <p class="text-gray-500 text-sm mt-1">所有注册家长用户</p>
            </div>
            <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
              <h3 class="text-gray-500 text-sm font-medium">活跃用户</h3>
              <p class="text-3xl font-bold mt-2">{{ activeUsers }}</p>
              <p class="text-gray-500 text-sm mt-1">近30天有活动的用户</p>
            </div>
            <div class="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
              <h3 class="text-gray-500 text-sm font-medium">内容数量</h3>
              <p class="text-3xl font-bold mt-2">{{ totalContent }}</p>
              <p class="text-gray-500 text-sm mt-1">所有动画内容</p>
            </div>
            <div class="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
              <h3 class="text-gray-500 text-sm font-medium">学习时长</h3>
              <p class="text-3xl font-bold mt-2">{{ totalLearningHours }}h</p>
              <p class="text-gray-500 text-sm mt-1">近30天总学习时间</p>
            </div>
          </div>

          <!-- 最近活动 -->
          <div v-if="!isLoading && !errorMessage" class="bg-white rounded-lg shadow p-6 mb-8">
            <h3 class="text-lg font-bold mb-4">最近活动</h3>
            <div v-if="recentActivities.length > 0" class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户</th>
                    <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">活动</th>
                    <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时间</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="activity in recentActivities" :key="activity.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          <img class="h-10 w-10 rounded-full" :src="activity.userAvatar || '/logo.svg'" alt="用户头像">
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ activity.userName }}</div>
                          <div class="text-sm text-gray-500">{{ activity.userEmail }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ activity.action }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ activity.time }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              <p>暂无互动记录</p>
            </div>
          </div>

          <!-- 学习统计图表 -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-bold mb-4">用户增长趋势</h3>
              <div class="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p class="text-gray-500">图表区域</p>
              </div>
            </div>
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-bold mb-4">内容类型分布</h3>
              <div class="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p class="text-gray-500">图表区域</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '../../store'
import { adminService } from '../../services/adminService'

const router = useRouter()
const store = useMainStore()
const showUserMenu = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

// 统计数据
const totalUsers = ref(0)
const activeUsers = ref(0)
const totalContent = ref(0)
const totalLearningHours = ref(0)

// 最近活动
const recentActivities = ref([])

// 加载仪表盘数据
const loadDashboardData = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    // 分别获取统计数据和最近活动，以便更好地处理错误
    const statsData = await adminService.getDashboardStats();
    const activitiesData = await adminService.getRecentActivities(10);
    
    // 更新统计数据
    totalUsers.value = statsData.totalUsers
    activeUsers.value = statsData.activeUsers
    totalContent.value = statsData.totalContent
    totalLearningHours.value = statsData.totalLearningHours
    
    // 更新最近活动
    recentActivities.value = activitiesData
  } catch (error) {
    console.error('加载仪表盘数据失败:', error);
    errorMessage.value = error.message || JSON.stringify(error) || '加载数据失败，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const logout = async () => {
  try {
    await store.logout()
    router.push('/login')
  } catch (error) {
    console.error('退出登录失败:', error)
  }
}

// 点击其他地方关闭下拉菜单
const handleClickOutside = (event) => {
  const userMenuButton = document.querySelector('.flex.items-center.space-x-2')
  const userMenu = document.querySelector('.absolute.right-0.mt-2.w-48')
  
  if (userMenuButton && userMenu && !userMenuButton.contains(event.target) && !userMenu.contains(event.target)) {
    showUserMenu.value = false
  }
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  
  // 验证用户是否为管理员
  if (!store.isAdmin) {
    router.push('/login')
    return
  }
  
  // 加载数据
  await loadDashboardData()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
});</script>

<style scoped>
.admin-ui {
  font-family: 'Inter', system-ui, sans-serif;
}

/* 侧边栏样式优化 */
aside {
  box-shadow: 1px 0 3px rgba(0, 0, 0, 0.1);
}

/* 卡片动画效果 */
.grid > div {
  transition: transform 0.2s, box-shadow 0.2s;
}

.grid > div:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 表格行悬停效果 */
tbody tr:hover {
  background-color: #f9fafb;
}
</style>