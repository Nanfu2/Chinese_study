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
          
          <!-- 加载状态和错误提示 -->
          <div v-if="isLoading" class="bg-white rounded-lg shadow p-8 mb-6 text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p class="text-gray-600">正在加载统计数据...</p>
          </div>
          
          <div v-else-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-red-700">{{ errorMessage }}</span>
            </div>
          </div>
          
          <!-- 时间范围选择 -->
          <div class="bg-white rounded-lg shadow p-4 mb-6">
            <div class="flex flex-col md:flex-row gap-4 items-center">
              <div class="text-sm font-medium text-gray-700">时间范围:</div>
              <div class="inline-flex rounded-md shadow-sm" role="group">
                <button 
                  v-for="range in timeRanges" 
                  :key="range.id"
                  @click="selectedTimeRange = range.id; updateMetrics()"
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
          <div v-if="!isLoading && !errorMessage && hasData" class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <!-- 用户增长趋势图 -->
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-bold mb-4">用户增长趋势</h3>
              <div class="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
                <div class="text-center w-full">
                  <div class="flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span class="text-lg font-semibold text-gray-700">总用户数: {{ metrics.totalUsers }}</span>
                  </div>
                  <div class="grid grid-cols-2 gap-4 px-8">
                    <div class="text-center">
                      <div class="text-2xl font-bold text-blue-600">{{ metrics.activeUsers }}</div>
                      <div class="text-sm text-gray-500">活跃用户</div>
                    </div>
                    <div class="text-center">
                      <div class="text-2xl font-bold text-purple-600">{{ metrics.avgLearningTime }}</div>
                      <div class="text-sm text-gray-500">平均学习时长(分钟)</div>
                    </div>
                  </div>
                  <div class="mt-6 text-sm text-gray-500">
                    <p>数据基于 {{ timeRanges.find(r => r.id === selectedTimeRange)?.name }} 统计</p>
                    <p class="mt-2">用户增长率: 
                      <span :class="metrics.usersGrowth >= 0 ? 'text-green-500' : 'text-red-500'">
                        {{ metrics.usersGrowth >= 0 ? '+' : '' }}{{ metrics.usersGrowth }}%
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 内容类型分布图 -->
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-bold mb-4">内容访问分布</h3>
              <div class="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
                <div class="text-center w-full">
                  <div class="flex justify-center mb-6">
                    <div class="w-32 h-32 relative">
                      <!-- 动态饼图 -->
                      <svg viewBox="0 0 32 32" class="w-full h-full">
                        <template v-for="(item, index) in getPieChartSegments()" :key="index">
                          <circle 
                            cx="16" 
                            cy="16" 
                            r="15" 
                            :fill="item.color" 
                            stroke-width="2" 
                            stroke="#fff"
                            :stroke-dasharray="`${item.value * 2 * Math.PI * 15 / 100} ${2 * Math.PI * 15}`"
                            :stroke-dashoffset="item.offset"
                            transform="rotate(-90 16 16)"
                          />
                        </template>
                      </svg>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-2 text-sm">
                    <div v-for="item in contentAccessDistribution" :key="item.type" class="flex items-center">
                      <div class="w-3 h-3 rounded-full mr-2" 
                           :style="{ backgroundColor: getContentColor(item.type) }"></div>
                      <span class="text-gray-600">{{ item.type }}</span>
                      <span class="ml-auto font-medium">{{ item.percentage }}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 无数据提示 -->
          <div v-else-if="!isLoading && !errorMessage && !hasData" class="bg-white rounded-lg shadow p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">暂无统计数据</h3>
            <p class="text-gray-500">当前时间段内暂无统计数据，请选择其他时间范围或等待数据生成。</p>
          </div>

          <!-- 热门内容排行榜 -->
          <div v-if="!isLoading && !errorMessage && hasData" class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-bold mb-4">热门内容排行</h3>
            <div v-if="popularContent.length > 0" class="overflow-x-auto">
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
            <div v-else class="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p class="text-gray-500">暂无热门内容数据</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '../../store'
import { statisticsService } from '../../services/statisticsService'

const router = useRouter()
const store = useMainStore()
const showUserMenu = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

// 时间范围选择
const timeRanges = ref([
  { id: '7d', name: '最近7天' },
  { id: '30d', name: '最近30天' },
  { id: '90d', name: '最近90天' },
  { id: '1y', name: '最近1年' }
])

const selectedTimeRange = ref('30d')

// 统计数据
const metrics = ref({
  totalUsers: 0,
  usersGrowth: 0,
  activeUsers: 0,
  activeUsersGrowth: 0,
  avgLearningTime: 0,
  learningTimeGrowth: 0
})

// 热门内容数据
const popularContent = ref([])

// 内容访问分布数据
const contentAccessDistribution = ref([])

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

// 获取内容类型对应的颜色
const getContentColor = (type) => {
  const colorMap = {
    '动画': '#3B82F6',
    '拼音学习': '#10B981',
    '汉字学习': '#8B5CF6',
    '其他': '#6B7280'
  }
  return colorMap[type] || '#6B7280'
}

// 计算饼图各部分的数据
const getPieChartSegments = () => {
  const segments = []
  let cumulativeOffset = 0
  
  contentAccessDistribution.value.forEach(item => {
    const value = item.percentage || 0
    segments.push({
      color: getContentColor(item.type),
      value,
      offset: `-${cumulativeOffset * 2 * Math.PI * 15 / 100}`
    })
    cumulativeOffset += value
  })
  
  return segments
}

// 加载统计数据
const loadStatisticsData = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    // 并行获取所有统计数据
    const [userStats, distributionData, popularData] = await Promise.all([
      statisticsService.getUserStatistics(selectedTimeRange.value),
      statisticsService.getContentAccessDistribution(selectedTimeRange.value),
      statisticsService.getPopularContent(selectedTimeRange.value, 10)
    ])
    
    // 更新指标数据
    metrics.value = userStats
    
    // 更新内容访问分布
    contentAccessDistribution.value = distributionData
    
    // 更新热门内容
    popularContent.value = popularData
  } catch (error) {
    console.error('加载统计数据失败:', error)
    errorMessage.value = '加载统计数据失败，请稍后重试'
    
    // 清空数据，显示错误信息
    metrics.value = {
      totalUsers: 0,
      usersGrowth: 0,
      activeUsers: 0,
      activeUsersGrowth: 0,
      avgLearningTime: 0,
      learningTimeGrowth: 0
    }
    
    popularContent.value = []
    contentAccessDistribution.value = []
  } finally {
    isLoading.value = false
  }
}

// 当时间范围改变时更新数据
const updateMetrics = () => {
  loadStatisticsData()
}

// 导出数据
const exportData = () => {
  // 实现导出功能
  const exportData = {
    timeRange: selectedTimeRange.value,
    metrics: metrics.value,
    contentDistribution: contentAccessDistribution.value,
    popularContent: popularContent.value,
    exportDate: new Date().toISOString()
  }
  
  // 创建下载链接
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `statistics-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 点击其他地方关闭下拉菜单
const handleClickOutside = (event) => {
  const userMenuButton = document.querySelector('.flex.items-center.space-x-2')
  const userMenu = document.querySelector('.absolute.right-0.mt-2.w-48')
  
  if (userMenuButton && userMenu && !userMenuButton.contains(event.target) && !userMenu.contains(event.target)) {
    showUserMenu.value = false
  }
}

// 计算属性：是否有数据
const hasData = computed(() => {
  return metrics.value.totalUsers > 0 || popularContent.value.length > 0
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  
  // 验证用户是否为管理员
  if (!store.isAdmin) {
    router.push('/login')
  }
  
  // 初始化加载数据
  loadStatisticsData()
})

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