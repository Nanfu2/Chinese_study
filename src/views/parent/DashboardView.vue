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

    <!-- 学习数据看板 -->
    <section class="py-6 px-4">
      <div class="container mx-auto">
        <h3 class="text-xl font-bold mb-6">{{ currentChild?.name || '孩子' }}的学习数据</h3>
        
        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          <!-- 本周学习进度 -->
          <div class="stat-card">
            <div class="flex items-center justify-between">
              <h4 class="text-gray-500">本周学习进度</h4>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p class="text-3xl font-bold mt-2">{{ hasWeeklyProgress ? weeklyProgress + '%' : '...' }}</p>
            <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div v-if="hasWeeklyProgress" class="bg-green-500 h-2 rounded-full" :style="{ width: weeklyProgress + '%' }"></div>
              <div v-else class="bg-gray-300 h-2 rounded-full w-full"></div>
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
            <p class="text-3xl font-bold mt-2">{{ hasInteractionData ? interactionCompletionRate + '%' : '...' }}</p>
            <div class="flex items-center mt-2 text-sm">
              <span v-if="hasInteractionData" :class="{ 'text-green-500': interactionCompletionRate >= 80, 'text-yellow-500': interactionCompletionRate >= 60, 'text-red-500': interactionCompletionRate < 60 }">
                {{ interactionCompletionRate >= 80 ? '表现优秀' : interactionCompletionRate >= 60 ? '需要加油' : '请多练习' }}
              </span>
              <span v-else class="text-gray-400">暂无数据</span>
            </div>
          </div>
        </div>
        
        <!-- 学习分析图表 -->
        <div class="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
          
          <!-- 学习内容分布 -->
          <div class="dashboard-card">
            <h4 class="text-lg font-bold mb-4">学习内容分布</h4>
            <div class="h-64 flex items-center justify-center">
              <div v-if="hasContentDistribution" class="flex flex-wrap gap-4 justify-center">
                <div v-for="(item, index) in contentDistribution" :key="index" class="flex flex-col items-center">
                  <div class="w-20 h-20 rounded-full flex items-center justify-center" :style="{ backgroundColor: item.color }">
                    <span class="text-white font-bold">{{ item.percentage }}%</span>
                  </div>
                  <span class="mt-2">{{ item.type }}</span>
                </div>
              </div>
              <div v-else class="text-gray-400">
                <span>暂无分布数据</span>
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
                <tr v-if="hasKnowledgePoints" v-for="(item, index) in knowledgePoints" :key="index">
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
                <tr v-else>
                  <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                    <div class="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>暂无知识点数据</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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

// 学习数据
const weeklyProgress = ref(null)
const interactionCompletionRate = ref(null)
const contentDistribution = ref([])
const knowledgePoints = ref([])
const parentingActivities = ref([])

// 数据加载状态
const isLoading = ref(false)
const isInitialized = ref(false) // 标记是否已经初始化加载学习数据
const hasWeeklyProgress = computed(() => weeklyProgress.value !== null)
const hasInteractionData = computed(() => interactionCompletionRate.value !== null)
const hasContentDistribution = computed(() => contentDistribution.value.length > 0)
const hasKnowledgePoints = computed(() => knowledgePoints.value.length > 0)
const hasParentingActivities = computed(() => parentingActivities.value.length > 0)

// 表单数据
const childForm = ref({
  id: '',
  name: '',
  age: 6,
  learning_level: 'beginner',
  avatar_url: ''
})

const loadLearningData = async () => {
  if (!currentChild.value) return
  
  isLoading.value = true
  try {
    // 获取本周学习进度
    const weeklyStats = await learningService.getLearningStats(currentChild.value.id, 'week')
    if (weeklyStats && weeklyStats.length > 0) {
      const totalWatchTime = weeklyStats.reduce((sum, stat) => sum + (stat.total_watch_time || 0), 0)
      weeklyProgress.value = Math.min(Math.floor(totalWatchTime / 3600), 100) // 转换为小时并限制为100%
    }
    
    // 获取互动任务完成率
    const interactions = await learningService.getInteractionCompletionRate(currentChild.value.id)
    if (interactions) {
      interactionCompletionRate.value = interactions.rate
    }
    
    // 获取学习内容分布
    const distribution = await learningService.getContentDistribution(currentChild.value.id)
    if (distribution) {
      contentDistribution.value = distribution
    }
    
    // 获取知识点掌握情况
    const knowledgePointsData = await learningService.getKnowledgePoints(currentChild.value.id)
    if (knowledgePointsData) {
      knowledgePoints.value = knowledgePointsData
    }
    
    // 获取亲子互动推荐
    const activities = await learningService.getParentingActivities(currentChild.value.id)
    if (activities) {
      parentingActivities.value = activities
    }
  } catch (error) {
    console.error('加载学习数据失败:', error)
  } finally {
    isLoading.value = false
  }
}


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
          // 只在组件初始化时加载学习数据，避免重复加载
          if (!isInitialized.value) {
            loadLearningData()
            isInitialized.value = true
          }
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
      const updatedChild = await store.updateChild(childForm.value.id, childForm.value)
      const index = children.value.findIndex(child => child.id === updatedChild.id)
      if (index !== -1) {
        // 创建新的数组以触发视图更新
        const newChildren = [...children.value];
        newChildren[index] = updatedChild;
        children.value = newChildren;
      }
      if (selectedChildId.value === updatedChild.id) {
        currentChild.value = updatedChild
      }
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
      const newChild = await store.addChild(childData)
      
      // 添加成功后，重新从数据库加载最新的孩子列表
      await store.loadChildren(store.user.id)
      
      // 选中新添加的孩子
      if (newChild && newChild.id) {
        selectedChildId.value = newChild.id
        currentChild.value = newChild
        // 不需要在这里调用 loadLearningData()，因为 watch 监听器会自动处理
      }
    }
    hideChildModal()
  } catch (error) {
    console.error('保存孩子信息失败:', error)
    alert('保存孩子信息失败: ' + (error.message || '未知错误'))
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
    if (currentChild.value) {
      await loadLearningData()
    }
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
    if (store.user && store.user.id) {
      console.log('用户认证成功，开始加载孩子列表，用户ID:', store.user.id)
      
      // 数据加载由store的setUser方法处理，这里不需要额外调用loadChildren
      // store.setUser会自动处理家长记录创建和孩子列表加载
      console.log('加载到的孩子列表:', store.children)
      
    } else {
      console.log('用户未认证或用户ID不存在，store.user:', store.user)
    }
  } catch (error) {
    console.error('初始化失败:', error)
    alert('加载孩子数据失败: ' + (error.message || '未知错误'))
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

// 组件挂载时初始化
onMounted(async () => {
  await loadChildrenData()
  
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