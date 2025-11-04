<template>
  <div class="min-h-screen bg-light text-dark admin-ui">
    <!-- 顶部导航和侧边栏与DashboardView共用样式 -->
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
                class="block px-4 py-3 rounded-lg hover:bg-gray-200 font-medium transition-colors"
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
                class="block px-4 py-3 rounded-lg bg-primary text-white font-medium"
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
          <h2 class="text-xl font-bold mb-6">统计分析</h2>
          
          <!-- 时间范围选择 -->
          <div class="bg-white rounded-lg shadow p-4 mb-6">
            <div class="flex flex-col md:flex-row gap-4 items-center">
              <div class="text-sm font-medium text-gray-700">时间范围:</div>
              <div class="inline-flex rounded-md shadow-sm" role="group">
                <button 
                  v-for="range in timeRanges" 
                  :key="range.id"
                  @click="selectedTimeRange = range.id"
                  :class="[
                    'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                    selectedTimeRange === range.id ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                  ]"
                >
                  {{ range.name }}
                </button>
              </div>
              <div class="ml-auto">
                <button 
                  @click="exportData" 
                  class="flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  导出数据
                </button>
              </div>
            </div>
          </div>

          <!-- 关键指标 -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center justify-between">
                <h3 class="text-gray-500 text-sm font-medium">总用户数</h3>
                <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <p class="text-3xl font-bold mt-4">{{ metrics.totalUsers }}</p>
              <p :class="['text-sm mt-1', metrics.usersGrowth >= 0 ? 'text-green-500' : 'text-red-500']">
                {{ metrics.usersGrowth >= 0 ? '↑' : '↓' }} {{ Math.abs(metrics.usersGrowth) }}% 较上期
              </p>
            </div>
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center justify-between">
                <h3 class="text-gray-500 text-sm font-medium">活跃用户</h3>
                <div class="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <p class="text-3xl font-bold mt-4">{{ metrics.activeUsers }}</p>
              <p :class="['text-sm mt-1', metrics.activeUsersGrowth >= 0 ? 'text-green-500' : 'text-red-500']">
                {{ metrics.activeUsersGrowth >= 0 ? '↑' : '↓' }} {{ Math.abs(metrics.activeUsersGrowth) }}% 较上期
              </p>
            </div>
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center justify-between">
                <h3 class="text-gray-500 text-sm font-medium">平均学习时长</h3>
                <div class="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p class="text-3xl font-bold mt-4">{{ metrics.avgLearningTime }}分钟</p>
              <p :class="['text-sm mt-1', metrics.learningTimeGrowth >= 0 ? 'text-green-500' : 'text-red-500']">
                {{ metrics.learningTimeGrowth >= 0 ? '↑' : '↓' }} {{ Math.abs(metrics.learningTimeGrowth) }}% 较上期
              </p>
            </div>
          </div>

          <!-- 图表区域 -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <!-- 用户增长趋势图 -->
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-bold mb-4">用户增长趋势</h3>
              <div class="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
                <div class="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p class="text-gray-500">用户增长趋势图表</p>
                </div>
              </div>
            </div>

            <!-- 内容类型分布图 -->
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-bold mb-4">内容访问分布</h3>
              <div class="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
                <div class="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                  <p class="text-gray-500">内容访问分布图表</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 热门内容排行榜 -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-bold mb-4">热门内容排行</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">排名</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">内容</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">访问量</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">平均时长</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">趋势</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(item, index) in popularContent" :key="item.id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ index + 1 }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div v-if="item.thumbnail" class="flex-shrink-0 h-10 w-10">
                          <img class="h-10 w-10 rounded" :src="item.thumbnail" alt="内容缩略图">
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ item.title }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.type }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.views }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.avgTime }}分钟</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="[
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        item.trend > 0 ? 'bg-green-100 text-green-800' :
                        item.trend < 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      ]">
                        {{ item.trend > 0 ? '↑' : item.trend < 0 ? '↓' : '→' }} {{ Math.abs(item.trend) }}%
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '../../store'

const router = useRouter()
const store = useMainStore()
const showUserMenu = ref(false)

// 时间范围选择
const timeRanges = ref([
  { id: '7d', name: '最近7天' },
  { id: '30d', name: '最近30天' },
  { id: '90d', name: '最近90天' },
  { id: '1y', name: '最近1年' }
])

const selectedTimeRange = ref('30d')

// 模拟统计数据
const metrics = ref({
  totalUsers: 128,
  usersGrowth: 12,
  activeUsers: 85,
  activeUsersGrowth: 8,
  avgLearningTime: 25,
  learningTimeGrowth: 15
})

// 热门内容数据
const popularContent = ref([
  {
    id: '1',
    title: '拼音入门-声母b',
    thumbnail: '/logo.svg',
    type: '动画',
    views: 1245,
    avgTime: 15,
    trend: 25
  },
  {
    id: '2',
    title: '汉字启蒙-日',
    thumbnail: '/logo.svg',
    type: '动画',
    views: 1056,
    avgTime: 12,
    trend: 18
  },
  {
    id: '3',
    title: '成语故事-守株待兔',
    thumbnail: '/logo.svg',
    type: '故事',
    views: 890,
    avgTime: 20,
    trend: 12
  },
  {
    id: '4',
    title: '声母教学-a',
    thumbnail: '/logo.svg',
    type: '拼音学习',
    views: 765,
    avgTime: 10,
    trend: -5
  },
  {
    id: '5',
    title: '基础汉字-水',
    thumbnail: '/logo.svg',
    type: '汉字学习',
    views: 645,
    avgTime: 8,
    trend: 10
  }
])

// 方法
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

const exportData = () => {
  console.log('导出统计数据，时间范围:', selectedTimeRange.value)
  // 实际应用中，这里可以调用API导出数据
}

// 当时间范围改变时更新数据
const updateMetrics = () => {
  console.log('更新统计数据，时间范围:', selectedTimeRange.value)
  // 实际应用中，这里可以根据时间范围调用API获取不同的数据
}

// 点击其他地方关闭下拉菜单
const handleClickOutside = (event) => {
  const userMenuButton = document.querySelector('.flex.items-center.space-x-2')
  const userMenu = document.querySelector('.absolute.right-0.mt-2.w-48')
  
  if (userMenuButton && userMenu && !userMenuButton.contains(event.target) && !userMenu.contains(event.target)) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  
  // 验证用户是否为管理员
  if (!store.isAdmin) {
    router.push('/login')
  }
  
  // 初始化加载数据
  updateMetrics()
})

// 组件卸载时移除事件监听器
import { onUnmounted } from 'vue'
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.admin-ui {
  font-family: 'Inter', system-ui, sans-serif;
}

/* 侧边栏样式优化 */
aside {
  box-shadow: 1px 0 3px rgba(0, 0, 0, 0.1);
}

/* 表格行悬停效果 */
tbody tr:hover {
  background-color: #f9fafb;
}

/* 卡片动画效果 */
.grid > div {
  transition: transform 0.2s, box-shadow 0.2s;
}

.grid > div:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>