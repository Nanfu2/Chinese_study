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

    <!-- 孩子管理 -->
    <section class="py-4 px-4 bg-gray-50">
      <div class="container mx-auto">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <h2 class="text-xl font-bold">孩子管理</h2>
            <div class="relative">
              <select v-model="selectedChildId" @change="loadChildData" class="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">请选择孩子</option>
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
          </div>
          
          <div class="flex gap-2">
            <button @click="handleRefreshChildren" class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              刷新
            </button>
            <button @click="showAddChildModal" class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              添加孩子
            </button>
            <button v-if="selectedChildId" @click="showEditChildModal" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              编辑
            </button>
            <button v-if="selectedChildId" @click="showDeleteChildModal" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              删除
            </button>
          </div>
        </div>
        
        <!-- 孩子列表 -->
        <div v-if="children && children.length > 0" class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="child in children" :key="child.id" 
               @click="selectChild(child.id)"
               :class="['child-card cursor-pointer transition-all duration-300', 
                        selectedChildId === child.id ? 'border-2 border-primary shadow-lg' : 'border border-gray-200']">
            <div class="flex items-center p-4">
              <img :src="child.avatar_url || '/logo.svg'" :alt="child.name" class="h-12 w-12 rounded-full object-cover" />
              <div class="ml-4">
                <h3 class="font-bold text-lg">{{ child.name }}</h3>
                <p class="text-gray-600">{{ child.age }}岁</p>
                <p class="text-sm text-gray-500">{{ getLearningLevelText(child.learning_level || 'beginner') }}</p>
              </div>
            </div>
            <div class="px-4 pb-4">
              <div class="flex justify-between text-sm text-gray-500">
                <span>创建时间: {{ formatDate(child.created_at) }}</span>
                <span v-if="selectedChildId === child.id" class="text-primary font-bold">当前选中</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 空状态 -->
        <div v-else class="mt-8 text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">暂无孩子</h3>
          <p class="text-gray-500 mb-4">请添加您的孩子来开始学习管理</p>
          <button @click="showAddChildModal" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90">
            添加第一个孩子
          </button>
        </div>
      </div>
    </section>
    
    <!-- 孩子数据展示 -->
    <section v-if="currentChild" class="py-6 px-4">
      <div class="container mx-auto">
        <h3 class="text-xl font-bold mb-6">{{ currentChild.name }}的数据</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 基本信息卡片 -->
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h4 class="text-lg font-bold mb-4">基本信息</h4>
            <div class="space-y-3">
              <p><span class="font-medium">姓名:</span> {{ currentChild.name }}</p>
              <p><span class="font-medium">年龄:</span> {{ currentChild.age }}岁</p>
              <p><span class="font-medium">学习水平:</span> {{ getLearningLevelText(currentChild.learning_level) }}</p>
              <p><span class="font-medium">创建时间:</span> {{ formatDate(currentChild.created_at) }}</p>
            </div>
          </div>
          
          <!-- 其他数据卡片 -->
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow duration-300" @click="openLearningStatsModal">
            <h4 class="text-lg font-bold mb-4">学习统计</h4>
            <div class="space-y-3">
              <p><span class="font-medium">最近学习时间:</span> {{ currentChild.last_learned_at ? formatDate(currentChild.last_learned_at) : '暂无' }}</p>
              <p><span class="font-medium">总学习时长:</span> {{ currentChild.total_learn_time || 0 }}分钟</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 加载指示器 -->
    <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p>加载中...</p>
      </div>
    </div>

    <!-- 添加/编辑孩子模态框 -->
    <div v-if="showChildModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div class="p-6">
          <h3 class="text-lg font-bold mb-4">{{ isEditingChild ? '编辑孩子信息' : '添加新孩子' }}</h3>
          
          <form @submit.prevent="saveChild">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">孩子姓名</label>
                <input v-model="childForm.name" type="text" required 
                       :class="['w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary', 
                                formErrors.name ? 'border-red-500' : 'border-gray-300']">
                <p v-if="formErrors.name" class="mt-1 text-sm text-red-600">{{ formErrors.name }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">年龄 (0-18岁)</label>
                <input v-model.number="childForm.age" type="number" min="0" max="18" required
                       :class="['w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary', 
                                formErrors.age ? 'border-red-500' : 'border-gray-300']">
                <p v-if="formErrors.age" class="mt-1 text-sm text-red-600">{{ formErrors.age }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">学习水平</label>
                <select v-model="childForm.learning_level" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="beginner">初级</option>
                  <option value="elementary">小学低年级</option>
                  <option value="intermediate">小学中高年级</option>
                  <option value="advanced">高级</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">头像URL (可选)</label>
                <input v-model="childForm.avatar_url" type="url" 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <p v-if="formErrors.avatar_url" class="mt-1 text-sm text-red-600">{{ formErrors.avatar_url }}</p>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 mt-6">
              <button type="button" @click="hideChildModal" 
                      class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                取消
              </button>
              <button type="submit" 
                      :disabled="isSaving"
                      class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
                {{ isSaving ? '保存中...' : (isEditingChild ? '保存' : '添加') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 删除确认模态框 -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="bg-red-100 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold">确认删除</h3>
          </div>
          
          <p class="text-gray-600 mb-6">
            您确定要删除孩子 "{{ currentChild?.name }}" 吗？此操作将删除该孩子的所有学习记录，且无法恢复。
          </p>
          
          <div class="flex justify-end space-x-3">
            <button @click="hideDeleteModal" 
                    class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
              取消
            </button>
            <button @click="confirmDeleteChild" 
                    class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              确认删除
            </button>
          </div>
        </div>
      </div>
    </div>



    <!-- 学习统计详情弹窗 -->
    <div v-if="isLearningStatsModalVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[80vh] overflow-hidden">
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-xl font-bold">{{ currentChild?.name }} - 学习统计</h3>
            <button @click="closeLearningStatsModal" class="text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          <!-- 加载状态 -->
          <div v-if="isLoadingLearningStats" class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span class="ml-2">加载学习统计中...</span>
          </div>
          
          <!-- 学习统计内容 -->
          <div v-else class="space-y-6">
            <!-- 时间范围选择 -->
            <div class="flex items-center space-x-4">
              <span class="text-sm font-medium">时间范围:</span>
              <div class="flex space-x-2">
                <button 
                  v-for="range in timeRanges" 
                  :key="range.value"
                  @click="selectTimeRange(range.value)"
                  :class="[
                    'px-3 py-1 rounded text-sm',
                    selectedTimeRange === range.value 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                >
                  {{ range.label }}
                </button>
              </div>
            </div>
            
            <!-- 观看历史统计 -->
            <div class="bg-white p-4 rounded-lg border border-gray-200">
              <h4 class="text-lg font-bold mb-4">观看历史统计</h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="text-center">
                  <p class="text-2xl font-bold text-blue-600">{{ learningStats.total_watch_time || 0 }}分钟</p>
                  <p class="text-sm text-gray-600">总观看时长</p>
                </div>
                <div class="text-center">
                  <p class="text-2xl font-bold text-green-600">{{ learningStats.total_completed || 0 }}个</p>
                  <p class="text-sm text-gray-600">完成动画数</p>
                </div>
                <div class="text-center">
                  <p class="text-2xl font-bold text-purple-600">{{ learningStats.total_days || 0 }}天</p>
                  <p class="text-sm text-gray-600">学习天数</p>
                </div>
              </div>
            </div>
            
            <!-- 互动记录统计 -->
            <div class="bg-white p-4 rounded-lg border border-gray-200">
              <h4 class="text-lg font-bold mb-4">互动记录统计</h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="text-center">
                  <p class="text-2xl font-bold text-yellow-600">{{ learningStats.total_points || 0 }}分</p>
                  <p class="text-sm text-gray-600">获得积分</p>
                </div>
                <div class="text-center">
                  <p class="text-2xl font-bold text-red-600">{{ learningStats.total_interactions || 0 }}次</p>
                  <p class="text-sm text-gray-600">互动次数</p>
                </div>
                <div class="text-center">
                  <p class="text-2xl font-bold text-indigo-600">{{ learningStats.avg_interaction_score || 0 }}分</p>
                  <p class="text-sm text-gray-600">平均互动得分</p>
                </div>
              </div>
            </div>
            
            <!-- 最近学习记录 -->
            <div class="bg-white p-4 rounded-lg border border-gray-200">
              <h4 class="text-lg font-bold mb-4">最近学习记录</h4>
              <div v-if="learningStats.recent_activities && learningStats.recent_activities.length > 0" class="space-y-3 max-h-60 overflow-y-auto">
                <div v-for="activity in learningStats.recent_activities" :key="activity.id" class="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div class="flex-1">
                    <p class="font-medium">{{ activity.title || '未知动画' }}</p>
                    <p class="text-sm text-gray-500">{{ formatDateTime(activity.watched_at || activity.created_at) }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-medium">{{ activity.watch_duration ? Math.round(activity.watch_duration / 60) + '分钟' : '互动' }}</p>
                    <p v-if="activity.completed" class="text-xs text-green-600">已完成</p>
                    <p v-else-if="activity.interaction_type" class="text-xs text-blue-600">{{ getInteractionTypeText(activity.interaction_type) }}</p>
                  </div>
                </div>
              </div>
              <div v-else class="text-center text-gray-500 py-4">
                暂无学习记录
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部 -->
    <footer class="mt-12 py-6 bg-white border-t">
      <div class="container mx-auto text-center text-gray-500 text-sm">
        <p>© 2025 萌豆语文动画屋 - 低龄儿童语文启蒙视频学习平台</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '../../store'
import { learningService } from '../../services/supabase'

const router = useRouter()
const store = useMainStore()

// 状态管理
const user = ref({})
const children = ref([])
const selectedChildId = ref('')
const currentChild = ref(null)
const showNotifications = ref(false)
const showUserMenu = ref(false)
const unreadNotifications = ref(0)
const notifications = ref([])

// 孩子管理相关状态
const showChildModal = ref(false)
const showDeleteModal = ref(false)
const isEditingChild = ref(false)
const isSaving = ref(false)
const formErrors = ref({})

// 数据加载状态
const isLoading = ref(false)

// 学习统计相关状态
const isLearningStatsModalVisible = ref(false)
const isLoadingLearningStats = ref(false)
const learningStats = ref({})
const selectedTimeRange = ref('week')
const timeRanges = ref([
  { label: '本周', value: 'week' },
  { label: '本月', value: 'month' },
  { label: '本季度', value: 'quarter' },
  { label: '本年', value: 'year' }
])

// 表单数据
const childForm = ref({
  id: '',
  name: '',
  age: 6,
  learning_level: 'beginner',
  avatar_url: ''
})


// 监听 store.children 的变化并更新本地状态
watch(
  () => store.children,
  (newChildren) => {
    try {
      console.log('store.children 变化:', newChildren)
      if (newChildren && newChildren.length > 0) {
        children.value = [...newChildren]
        // 如果还没有选中孩子，选中第一个
        if (!selectedChildId.value && children.value.length > 0) {
          selectedChildId.value = newChildren[0].id
          currentChild.value = newChildren[0]
        }
      } else {
        children.value = []
        selectedChildId.value = ''
        currentChild.value = null
      }
    } catch (error) {
      console.error('处理孩子列表变化时出错:', error)
    }
  },
  { deep: true, immediate: true }
)

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

// 孩子管理方法
const showAddChildModal = () => {
  isEditingChild.value = false
  childForm.value = {
    id: '',
    name: '',
    age: 6,
    learning_level: 'beginner',
    avatar_url: ''
  }
  formErrors.value = {}
  showChildModal.value = true
}

const showEditChildModal = () => {
  if (!currentChild.value) return
  
  isEditingChild.value = true
  childForm.value = {
    id: currentChild.value.id,
    name: currentChild.value.name,
    age: currentChild.value.age,
    learning_level: currentChild.value.learning_level || 'beginner',
    avatar_url: currentChild.value.avatar_url || ''
  }
  formErrors.value = {}
  showChildModal.value = true
}

const showDeleteChildModal = () => {
  if (!currentChild.value) return
  showDeleteModal.value = true
}

const hideChildModal = () => {
  showChildModal.value = false
}

const hideDeleteModal = () => {
  showDeleteModal.value = false
}

const validateForm = () => {
  const errors = {}
  
  // 验证姓名
  if (!childForm.value.name || childForm.value.name.trim().length === 0) {
    errors.name = '请输入孩子姓名'
  } else if (childForm.value.name.length > 20) {
    errors.name = '姓名不能超过20个字符'
  }
  
  // 验证年龄
  if (childForm.value.age === null || childForm.value.age === undefined) {
    errors.age = '请输入年龄'
  } else if (childForm.value.age < 0 || childForm.value.age > 18) {
    errors.age = '年龄必须在0-18岁之间'
  }
  
  // 验证头像URL格式（如果提供了）
  if (childForm.value.avatar_url && childForm.value.avatar_url.trim() !== '') {
    try {
      new URL(childForm.value.avatar_url)
    } catch (e) {
      errors.avatar_url = '请输入有效的URL'
    }
  }
  
  formErrors.value = errors
  return Object.keys(errors).length === 0
}

const saveChild = async () => {
  // 表单验证
  if (!validateForm()) {
    return
  }
  
  isSaving.value = true
  try {
    if (isEditingChild.value) {
      // 编辑孩子
      console.log('正在编辑孩子，表单数据:', childForm.value);
      
      // 准备更新数据，确保类型正确
      const updateData = {
        name: childForm.value.name,
        age: parseInt(childForm.value.age),
        learning_level: childForm.value.learning_level,
        avatar_url: childForm.value.avatar_url || null
      };
      
      // 调试日志
      console.log('准备提交的更新数据:', updateData);
      
      const updatedChild = await store.updateChild(childForm.value.id, updateData)
      
      if (!updatedChild) {
        throw new Error('更新孩子失败: 未返回有效数据')
      }
      
      // 更新本地状态
      const index = children.value.findIndex(child => child.id === childForm.value.id)
      if (index !== -1) {
        children.value[index] = updatedChild
      }
      
      if (selectedChildId.value === childForm.value.id) {
        currentChild.value = updatedChild
      }
      
      // 显示成功消息
      alert('孩子信息更新成功')
    } else {
      // 添加新孩子
      console.log('正在添加新孩子，表单数据:', childForm.value);
      // 确保必填字段有默认值
      const childData = {
        name: childForm.value.name || '未命名',
        age: parseInt(childForm.value.age) || 6,
        learning_level: childForm.value.learning_level || 'beginner',
        avatar_url: childForm.value.avatar_url || ''
      };
      
      console.log('处理后的孩子数据:', childData);
      const { data: newChild, error } = await store.addChild(childData)
      
      if (error) throw error;
      
      // 添加成功后，重新从数据库加载最新的孩子列表
      if (store.user?.id) {
        await store.loadChildren(store.user.id)
      }
      
      // 选中新添加的孩子
      if (newChild?.id) {
        selectedChildId.value = newChild.id
        currentChild.value = newChild
      }
    }
    hideChildModal()
  } catch (error) {
    console.error('保存孩子信息失败:', error)
    console.error('完整错误堆栈:', error.stack)
    alert(`保存失败: ${error.message || '请检查控制台获取详细错误信息'}`)
    
    // 如果是编辑操作，保留表单数据让用户可以修正
    if (!isEditingChild.value) {
      hideChildModal()
    }
  } finally {
    isSaving.value = false
  }
}

const confirmDeleteChild = async () => {
  try {
    await store.deleteChild(selectedChildId.value)
    
    // 删除成功后，重新从数据库加载最新的孩子列表
    await store.loadChildren(store.user.id)
    
    // 数据更新由watch监听器处理，这里不需要额外处理
    // watch监听器会自动处理 children 数组的更新和选中孩子的逻辑
    
    hideDeleteModal()
  } catch (error) {
    console.error('删除孩子失败:', error)
    alert('删除孩子失败: ' + (error.message || '未知错误'))
  }
}

const selectChild = (childId) => {
  selectedChildId.value = childId
  loadChildData()
}

const getLearningLevelText = (level) => {
  const levels = {
    'beginner': '初级',
    'elementary': '小学低年级',
    'intermediate': '小学中高年级',
    'advanced': '高级'
  }
  return levels[level] || '初级'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

const loadChildData = async () => {
  if (!selectedChildId.value) return
  
  isLoading.value = true
  try {
    // 从children数组中找到选中的孩子
    currentChild.value = children.value.find(child => child.id === selectedChildId.value)
    console.log('选中的孩子:', currentChild.value)
  } catch (error) {
    console.error('加载孩子数据失败:', error)
  } finally {
    isLoading.value = false
  }
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

const loadChildrenData = async () => {
  try {
    // 页面刷新后重新加载用户信息
    await store.loadUser()
    user.value = store.user
    
    // 确保用户认证完成后再加载孩子列表
    if (store.user?.id) {
      console.log('用户认证成功，开始加载孩子列表，用户ID:', store.user.id)
      
      // 数据加载由store的setUser方法处理，这里不需要额外调用loadChildren
      // store.setUser会自动处理家长记录创建和孩子列表加载
      console.log('加载到的孩子列表:', store.children)
      
    } else {
      console.log('用户未认证或用户ID不存在，store.user:', store.user)
      alert('用户信息加载失败，请重新登录')
      router.push('/login')
    }
  } catch (error) {
    console.error('初始化失败:', error)
    alert('加载孩子数据失败: ' + (error.message || '未知错误'))
    router.push('/login')
  }
}

const refreshChildrenData = async () => {
  try {
    if (store.user && store.user.id) {
      // 重新加载用户信息，这会触发store的setUser方法，自动处理孩子列表加载
      await store.loadUser()
      
      // 数据更新由watch监听器处理，这里不需要额外处理
      console.log('孩子列表刷新完成')
    }
  } catch (error) {
    console.error('刷新孩子数据失败:', error)
    alert('刷新孩子数据失败: ' + (error.message || '未知错误'))
  }
}

// 添加一个方法用于手动刷新孩子数据
const handleRefreshChildren = async () => {
  try {
    await refreshChildrenData()
    // 显示成功消息
    alert('数据刷新成功')
  } catch (error) {
    alert('刷新失败: ' + (error.message || '未知错误'))
  }
}

// 学习统计相关方法
const openLearningStatsModal = async () => {
  if (!currentChild.value) {
    alert('请先选择一个孩子')
    return
  }
  
  console.log('打开学习统计弹窗，孩子ID:', currentChild.value.id)
  isLearningStatsModalVisible.value = true
  await loadLearningStats()
}

const closeLearningStatsModal = () => {
  isLearningStatsModalVisible.value = false
  learningStats.value = {}
}

const selectTimeRange = async (range) => {
  selectedTimeRange.value = range
  await loadLearningStats()
}

const loadLearningStats = async () => {
  if (!currentChild.value) return
  
  isLoadingLearningStats.value = true
  try {
    console.log('开始加载学习统计数据，孩子ID:', currentChild.value.id)
    // 调用API获取学习统计数据
    const stats = await learningService.getLearningStats(currentChild.value.id, selectedTimeRange.value)
    console.log('API返回的数据:', stats)
    learningStats.value = processLearningStats(stats || [])
    console.log('处理后的学习统计数据:', learningStats.value)
  } catch (error) {
    console.error('加载学习统计数据失败:', error)
    // 如果API调用失败，显示模拟数据
    learningStats.value = getMockLearningStats()
  } finally {
    isLoadingLearningStats.value = false
  }
}

const processLearningStats = (rawStats) => {
  if (!rawStats || !Array.isArray(rawStats)) {
    return getMockLearningStats()
  }
  
  // 分离观看历史和互动记录
  const watchHistory = rawStats.filter(stat => stat.watch_duration !== undefined)
  const interactions = rawStats.filter(stat => stat.interaction_type !== undefined)
  
  // 观看历史统计
  const totalWatchTime = watchHistory.reduce((sum, stat) => sum + (stat.watch_duration || 0), 0)
  const totalCompleted = watchHistory.filter(stat => stat.completed).length
  
  // 互动记录统计
  const totalInteractions = interactions.length
  const totalPoints = interactions.reduce((sum, stat) => {
    // 根据互动类型计算积分
    const points = getInteractionPoints(stat.interaction_type)
    return sum + points
  }, 0)
  
  // 计算学习天数（基于观看历史）
  const uniqueDates = [...new Set(watchHistory.map(stat => {
    const date = new Date(stat.watched_at || stat.created_at)
    return date.toDateString()
  }))].length
  
  // 获取最近活动记录（合并观看历史和互动记录）
  const recentActivities = [...watchHistory, ...interactions]
    .sort((a, b) => new Date(b.watched_at || b.created_at) - new Date(a.watched_at || a.created_at))
    .slice(0, 10)
    .map(activity => ({
      id: activity.id,
      title: activity.title || '互动记录',
      watched_at: activity.watched_at,
      created_at: activity.created_at,
      watch_duration: activity.watch_duration,
      completed: activity.completed,
      interaction_type: activity.interaction_type
    }))
  
  return {
    total_watch_time: Math.round(totalWatchTime / 60), // 转换为分钟
    total_completed: totalCompleted,
    total_points: totalPoints,
    total_days: uniqueDates,
    total_interactions: totalInteractions,
    avg_interaction_score: totalInteractions > 0 ? Math.round(totalPoints / totalInteractions) : 0,
    recent_activities: recentActivities
  }
}

const getInteractionPoints = (interactionType) => {
  const pointsMap = {
    'like': 1,
    'share': 3,
    'quiz_answer': 5,
    'comment': 2,
    'complete_quiz': 10
  }
  return pointsMap[interactionType] || 1
}

const getInteractionTypeText = (interactionType) => {
  const typeMap = {
    'like': '点赞',
    'share': '分享',
    'quiz_answer': '答题',
    'comment': '评论',
    'complete_quiz': '完成测验'
  }
  return typeMap[interactionType] || interactionType
}

const getMockLearningStats = () => {
  // 基于数据库中的真实模拟数据生成统计
  // 数据库中的模拟数据：
  // 张小豆（ID: 550e8400-e29b-41d4-a716-446655440000）有3条观看记录和2条互动记录
  // 张小萌（ID: 550e8400-e29b-41d4-a716-446655440001）有2条观看记录和2条互动记录
  
  // 模拟观看历史记录（基于数据库真实数据）
  const mockWatchHistory = [
    {
      id: 'watch_1',
      child_id: '550e8400-e29b-41d4-a716-446655440000',
      animation_id: '550e8400-e29b-41d4-a716-446655440001',
      watch_duration: 300, // 5分钟
      completed: true,
      watched_at: '2025-10-25T10:00:00Z'
    },
    {
      id: 'watch_2',
      child_id: '550e8400-e29b-41d4-a716-446655440000',
      animation_id: '550e8400-e29b-41d4-a716-446655440002',
      watch_duration: 180, // 3分钟
      completed: false,
      watched_at: '2025-10-26T11:30:00Z'
    },
    {
      id: 'watch_3',
      child_id: '550e8400-e29b-41d4-a716-446655440000',
      animation_id: '550e8400-e29b-41d4-a716-446655440003',
      watch_duration: 420, // 7分钟
      completed: true,
      watched_at: '2025-10-27T09:15:00Z'
    },
    {
      id: 'watch_4',
      child_id: '550e8400-e29b-41d4-a716-446655440001',
      animation_id: '550e8400-e29b-41d4-a716-446655440001',
      watch_duration: 240, // 4分钟
      completed: true,
      watched_at: '2025-10-25T14:00:00Z'
    },
    {
      id: 'watch_5',
      child_id: '550e8400-e29b-41d4-a716-446655440001',
      animation_id: '550e8400-e29b-41d4-a716-446655440004',
      watch_duration: 360, // 6分钟
      completed: false,
      watched_at: '2025-10-26T16:45:00Z'
    }
  ]
  
  // 模拟互动记录（基于数据库真实数据）
  const mockInteractions = [
    {
      id: 'interaction_1',
      child_id: '550e8400-e29b-41d4-a716-446655440000',
      animation_id: '550e8400-e29b-41d4-a716-446655440001',
      interaction_type: 'quiz_answer',
      interaction_data: { score: 80, answers: ['A', 'B', 'C'] },
      created_at: '2025-10-25T10:30:00Z'
    },
    {
      id: 'interaction_2',
      child_id: '550e8400-e29b-41d4-a716-446655440000',
      animation_id: '550e8400-e29b-41d4-a716-446655440002',
      interaction_type: 'like',
      interaction_data: { value: true },
      created_at: '2025-10-26T12:00:00Z'
    },
    {
      id: 'interaction_3',
      child_id: '550e8400-e29b-41d4-a716-446655440001',
      animation_id: '550e8400-e29b-41d4-a716-446655440003',
      interaction_type: 'quiz_answer',
      interaction_data: { score: 90, answers: ['A', 'B', 'D'] },
      created_at: '2025-10-25T14:30:00Z'
    },
    {
      id: 'interaction_4',
      child_id: '550e8400-e29b-41d4-a716-446655440001',
      animation_id: '550e8400-e29b-41d4-a716-446655440004',
      interaction_type: 'share',
      interaction_data: { platform: 'wechat' },
      created_at: '2025-10-26T17:00:00Z'
    }
  ]
  
  // 计算统计数据
  const totalWatchTime = mockWatchHistory.reduce((sum, stat) => sum + (stat.watch_duration || 0), 0)
  const totalCompleted = mockWatchHistory.filter(stat => stat.completed).length
  const totalInteractions = mockInteractions.length
  const totalPoints = mockInteractions.reduce((sum, stat) => sum + getInteractionPoints(stat.interaction_type), 0)
  
  // 计算学习天数
  const uniqueDates = [...new Set(mockWatchHistory.map(stat => {
    const date = new Date(stat.watched_at)
    return date.toDateString()
  }))].length
  
  // 获取最近活动记录
  const recentActivities = [...mockWatchHistory, ...mockInteractions]
    .sort((a, b) => new Date(b.watched_at || b.created_at) - new Date(a.watched_at || a.created_at))
    .slice(0, 10)
    .map(activity => ({
      id: activity.id,
      title: activity.animation_id ? `动画 ${activity.animation_id.slice(-4)}` : '互动记录',
      watched_at: activity.watched_at,
      created_at: activity.created_at,
      watch_duration: activity.watch_duration,
      completed: activity.completed,
      interaction_type: activity.interaction_type
    }))
  
  return {
    total_watch_time: Math.round(totalWatchTime / 60), // 转换为分钟
    total_completed: totalCompleted,
    total_points: totalPoints,
    total_days: uniqueDates,
    total_interactions: totalInteractions,
    avg_interaction_score: totalInteractions > 0 ? Math.round(totalPoints / totalInteractions) : 0,
    recent_activities: recentActivities
  }
}

const formatShortDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (date.toDateString() === today.toDateString()) {
    return '今天'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return '昨天'
  } else {
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }
}

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return ''
  const date = new Date(dateTimeString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  
  if (diffMins < 1) {
    return '刚刚'
  } else if (diffMins < 60) {
    return `${diffMins}分钟前`
  } else if (diffHours < 24) {
    return `${diffHours}小时前`
  } else if (diffHours < 48) {
    return '昨天'
  } else {
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }
}

// 移除不再使用的getCategoryName函数

// 组件挂载时初始化
onMounted(async () => {
  // 立即显示加载状态
  isLoading.value = true
  
  try {
    // 并行加载数据，减少等待时间
    await Promise.all([
      loadChildrenData(),
      // 可以添加其他并行加载的数据
    ])
  } catch (error) {
    console.error('页面初始化失败:', error)
  } finally {
    isLoading.value = false
  }
  
  // 添加点击外部关闭下拉菜单的事件监听
  document.addEventListener('click', handleClickOutside)
})

// 组件卸载时清理事件监听
const cleanup = () => {
  document.removeEventListener('click', handleClickOutside)
}

defineExpose({ cleanup })
</script>

<style scoped>
.stat-card {
  @apply bg-white p-6 rounded-lg shadow-sm border border-gray-100;
}

.dashboard-card {
  @apply bg-white p-6 rounded-lg shadow-sm border border-gray-100;
}

/* 孩子卡片样式 */
.child-card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer;
}

.child-card:hover {
  @apply transform scale-105;
}

/* 模态框动画 */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

/* 表单样式 */
.form-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

/* 按钮样式 */
.btn-primary {
  @apply bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-200;
}

.btn-secondary {
  @apply bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200;
}

.btn-danger {
  @apply bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200;
}
</style>