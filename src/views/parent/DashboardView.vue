<template>
  <div class="min-h-screen bg-light text-dark parent-ui">
    <!-- 顶部导航 -->
    <header class="p-4 bg-white shadow-sm">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center">
          <img src="/logo.svg" alt="萌豆语文动画屋" class="h-10 w-10 rounded-full mr-3" />
          <h1 class="text-2xl font-bold text-primary">萌豆语文动画屋</h1>
        </div>
        <div class="flex items-center space-x-4">
          <div class="relative">
            <button @click="toggleNotification" class="relative p-2 text-gray-600 hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span v-if="unreadNotifications > 0" class="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {{ unreadNotifications }}
              </span>
            </button>
            <!-- 通知下拉菜单 -->
            <div v-if="showNotifications" class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
              <div class="p-3 border-b border-gray-100">
                <h3 class="font-bold">通知</h3>
              </div>
              <div v-if="notifications.length > 0" class="max-h-96 overflow-y-auto">
                <div v-for="notification in notifications" :key="notification.id" class="p-3 hover:bg-gray-50 border-b border-gray-100">
                  <p class="text-sm">{{ notification.message }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ notification.time }}</p>
                </div>
              </div>
              <div v-else class="p-4 text-center text-gray-500 text-sm">
                暂无通知
              </div>
            </div>
          </div>
          <div class="relative">
            <button @click="toggleUserMenu" class="flex items-center space-x-2">
              <img :src="user?.avatar || '/logo.svg'" alt="用户头像" class="h-8 w-8 rounded-full" />
              <span>{{ user?.email ? user.email.split('@')[0] : '用户' }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <!-- 用户下拉菜单 -->
            <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
              <a href="/parent/settings" class="block px-4 py-2 text-sm hover:bg-gray-50">设置</a>
              <button @click="logout" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">退出登录</button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 孩子选择器 -->
    <section class="py-4 px-4 bg-gray-50">
      <div class="container mx-auto">
        <div class="flex flex-wrap items-center gap-4">
          <h2 class="text-xl font-bold">孩子管理</h2>
          <div class="relative">
            <select v-model="selectedChildId" @change="loadChildData" class="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-primary">
              <option v-for="child in children" :key="child.id" :value="child.id">
                {{ child.name }} ({{ child.age }}岁)
              </option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <button @click="addChild" class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            添加孩子
          </button>
        </div>
      </div>
    </section>

    <!-- 学习数据看板 -->
    <section class="py-6 px-4">
      <div class="container mx-auto">
        <h3 class="text-xl font-bold mb-6">{{ currentChild?.name || '孩子' }}的学习数据</h3>
        
        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <!-- 今日观看时长 -->
          <div class="stat-card">
            <div class="flex items-center justify-between">
              <h4 class="text-gray-500">今日观看时长</h4>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-3xl font-bold mt-2">{{ todayWatchTime }}分钟</p>
            <div class="flex items-center mt-2 text-sm">
              <span :class="{ 'text-green-500': todayWatchTime > 0, 'text-red-500': todayWatchTime === 0 }">
                {{ todayWatchTime > 0 ? '已完成今日学习' : '今日未学习' }}
              </span>
            </div>
          </div>
          
          <!-- 本周学习进度 -->
          <div class="stat-card">
            <div class="flex items-center justify-between">
              <h4 class="text-gray-500">本周学习进度</h4>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p class="text-3xl font-bold mt-2">{{ weeklyProgress }}%</p>
            <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div class="bg-green-500 h-2 rounded-full" :style="{ width: weeklyProgress + '%' }"></div>
            </div>
          </div>
          
          <!-- 互动任务完成率 -->
          <div class="stat-card">
            <div class="flex items-center justify-between">
              <h4 class="text-gray-500">互动任务完成率</h4>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <p class="text-3xl font-bold mt-2">{{ interactionCompletionRate }}%</p>
            <div class="flex items-center mt-2 text-sm">
              <span :class="{ 'text-green-500': interactionCompletionRate >= 80, 'text-yellow-500': interactionCompletionRate >= 60, 'text-red-500': interactionCompletionRate < 60 }">
                {{ interactionCompletionRate >= 80 ? '表现优秀' : interactionCompletionRate >= 60 ? '需要加油' : '请多练习' }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- 学习分析图表 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <!-- 观看时长趋势 -->
          <div class="dashboard-card">
            <h4 class="text-lg font-bold mb-4">近7天观看时长（分钟）</h4>
            <div class="h-64">
              <!-- 这里会用Chart.js绘制图表 -->
              <div class="flex justify-between items-end h-full">
                <div v-for="(day, index) in weeklyWatchTime" :key="index" class="flex flex-col items-center w-1/7">
                  <div class="bg-primary/20 rounded-t-md transition-all duration-300 hover:bg-primary/40" :style="{ height: (day.minutes / maxWatchTime * 100) + '%', minHeight: '10px' }"></div>
                  <span class="mt-2 text-xs">{{ day.minutes }}</span>
                  <span class="text-xs text-gray-500">{{ day.day }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 学习内容分布 -->
          <div class="dashboard-card">
            <h4 class="text-lg font-bold mb-4">学习内容分布</h4>
            <div class="h-64 flex items-center justify-center">
              <!-- 这里会用Chart.js绘制饼图 -->
              <div class="flex flex-wrap gap-4 justify-center">
                <div v-for="(item, index) in contentDistribution" :key="index" class="flex flex-col items-center">
                  <div class="w-20 h-20 rounded-full flex items-center justify-center" :style="{ backgroundColor: item.color }">
                    <span class="text-white font-bold">{{ item.percentage }}%</span>
                  </div>
                  <span class="mt-2">{{ item.type }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 知识点掌握情况 -->
        <div class="dashboard-card mb-8">
          <div class="flex justify-between items-center mb-4">
            <h4 class="text-lg font-bold">知识点掌握情况</h4>
            <select class="text-sm border border-gray-300 rounded-lg px-3 py-1">
              <option>拼音</option>
              <option>汉字</option>
              <option>词语</option>
              <option>短句</option>
            </select>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="bg-gray-50">
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">知识点</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">最后学习日期</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">掌握程度</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(item, index) in knowledgePoints" :key="index">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.lastLearnedDate }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="{
                      'bg-green-100 text-green-800': item.mastery === '熟练',
                      'bg-yellow-100 text-yellow-800': item.mastery === '一般',
                      'bg-red-100 text-red-800': item.mastery === '需要巩固'
                    }">
                      {{ item.mastery }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <button class="text-primary hover:text-primary/80">查看详情</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- 观看设置 -->
        <div class="dashboard-card mb-8">
          <h4 class="text-lg font-bold mb-4">观看设置</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">每日观看时长限制</label>
              <div class="flex items-center">
                <input type="range" v-model="dailyTimeLimit" min="10" max="30" step="5" class="w-full mr-4" />
                <span class="text-lg font-medium min-w-12">{{ dailyTimeLimit }}分钟</span>
              </div>
              <p class="text-xs text-gray-500 mt-2">默认20分钟，可在10-30分钟之间调整</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">内容筛选</label>
              <div class="space-y-2">
                <div class="flex items-center">
                  <input type="checkbox" id="filter-complex" v-model="contentFilters.complexCharacters" class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                  <label for="filter-complex" class="ml-2 block text-sm text-gray-700">屏蔽复杂汉字内容</label>
                </div>
                <div class="flex items-center">
                  <input type="checkbox" id="filter-advanced" v-model="contentFilters.advancedVocabulary" class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                  <label for="filter-advanced" class="ml-2 block text-sm text-gray-700">屏蔽高级词汇内容</label>
                </div>
              </div>
            </div>
          </div>
          <button @click="saveSettings" class="mt-6 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90">
            保存设置
          </button>
        </div>
        
        <!-- 亲子互动工具 -->
        <div class="dashboard-card">
          <h4 class="text-lg font-bold mb-4">亲子互动推荐</h4>
          <p class="text-gray-600 mb-4">根据孩子的学习内容，我们推荐以下亲子活动：</p>
          
          <div v-if="parentingActivities.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="(activity, index) in parentingActivities" :key="index" class="bg-white p-4 rounded-lg border border-gray-200">
              <h5 class="font-bold text-primary">{{ activity.title }}</h5>
              <p class="text-gray-600 text-sm mt-2">{{ activity.description }}</p>
              <div class="flex justify-between items-center mt-4">
                <span class="text-xs text-gray-500">{{ activity.relatedTo }}</span>
                <button class="text-sm text-primary hover:underline">查看详情</button>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            暂无推荐活动
          </div>
        </div>
      </div>
    </section>

    <!-- 底部 -->
    <footer class="mt-12 py-6 bg-white border-t">
      <div class="container mx-auto text-center text-gray-500 text-sm">
        <p>© 2025 萌豆语文动画屋 - 低龄儿童语文启蒙视频学习平台</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '../../store'

const router = useRouter()
const store = useMainStore()

// 状态管理
const user = ref({})
const children = ref([
  { id: '1', name: '小明', age: 5, avatar: '/avatar-1.png' },
  { id: '2', name: '小红', age: 7, avatar: '/avatar-2.png' }
])
const selectedChildId = ref('1')
const currentChild = ref(null)
const showNotifications = ref(false)
const showUserMenu = ref(false)
const unreadNotifications = ref(2)
const notifications = ref([
  { id: 1, message: '小明完成了今天的学习任务！', time: '10:30' },
  { id: 2, message: '系统推荐了3个亲子活动', time: '昨天' }
])

// 学习数据
const todayWatchTime = ref(25)
const weeklyProgress = ref(68)
const interactionCompletionRate = ref(85)
const weeklyWatchTime = ref([
  { day: '一', minutes: 20 },
  { day: '二', minutes: 15 },
  { day: '三', minutes: 25 },
  { day: '四', minutes: 0 },
  { day: '五', minutes: 30 },
  { day: '六', minutes: 20 },
  { day: '日', minutes: 25 }
])
const maxWatchTime = computed(() => {
  return Math.max(...weeklyWatchTime.value.map(day => day.minutes)) * 1.2
})
const contentDistribution = ref([
  { type: '拼音', percentage: 40, color: '#FF6B6B' },
  { type: '汉字', percentage: 30, color: '#4ECDC4' },
  { type: '词语', percentage: 20, color: '#FFD166' },
  { type: '短句', percentage: 10, color: '#6A0572' }
])
const knowledgePoints = ref([
  { name: '声母 b/p/m/f', lastLearnedDate: '今天', mastery: '熟练' },
  { name: '韵母 a/o/e', lastLearnedDate: '昨天', mastery: '熟练' },
  { name: '韵母 ü', lastLearnedDate: '3天前', mastery: '需要巩固' },
  { name: '汉字：日、月、水', lastLearnedDate: '今天', mastery: '一般' },
  { name: '汉字：山、石', lastLearnedDate: '2天前', mastery: '熟练' }
])
const parentingActivities = ref([
  {
    title: '家庭拼音小老师',
    description: '让孩子当小老师，教爸爸妈妈读今天学到的拼音',
    relatedTo: '拼音学习'
  },
  {
    title: '汉字找找看',
    description: '在家中寻找今天学到的汉字，如"日"可以是日历、太阳图案等',
    relatedTo: '汉字学习'
  }
])

// 设置
const dailyTimeLimit = ref(20)
const contentFilters = ref({
  complexCharacters: true,
  advancedVocabulary: false
})

// 方法
const toggleNotification = () => {
  showNotifications.value = !showNotifications.value
  if (showNotifications.value) {
    // 标记通知为已读
    unreadNotifications.value = 0
  }
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const logout = async () => {
  await store.logout()
  router.push('/login')
}

const addChild = () => {
  // 添加孩子的逻辑
  console.log('添加孩子')
}

const loadChildData = () => {
  // 加载选定孩子的数据
  currentChild.value = children.value.find(child => child.id === selectedChildId.value)
}

const saveSettings = () => {
  // 保存设置的逻辑
  console.log('保存设置')
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showNotifications.value = false
    showUserMenu.value = false
  }
}

// 组件挂载时初始化
onMounted(() => {
  user.value = store.user
  currentChild.value = children.value[0]
  
  // 添加点击外部关闭下拉菜单的事件监听
  document.addEventListener('click', handleClickOutside)
})

// 组件卸载时清理事件监听
const cleanup = () => {
  document.removeEventListener('click', handleClickOutside)
}

defineExpose({ cleanup })
</script>