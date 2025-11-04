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
                class="block px-4 py-3 rounded-lg bg-primary text-white font-medium"
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
          <h2 class="text-xl font-bold mb-6">内容管理</h2>
          
          <!-- 内容类型选项卡 -->
          <div class="mb-6">
            <div class="inline-flex rounded-md shadow-sm" role="group">
              <button 
                v-for="tab in contentTabs" 
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                  activeTab === tab.id ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                ]"
              >
                {{ tab.name }}
              </button>
            </div>
          </div>

          <!-- 内容操作按钮 -->
          <div class="flex justify-between items-center mb-6">
            <div class="flex-1 max-w-md">
              <div class="relative">
                <input 
                  v-model="searchQuery" 
                  type="text" 
                  placeholder="搜索内容" 
                  class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <button 
              @click="addContent" 
              class="ml-4 bg-primary text-white font-medium py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              添加内容
            </button>
          </div>

          <!-- 内容列表 -->
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标题</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">难度</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="item in currentTabContent" :key="item.id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.id }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div v-if="item.thumbnail" class="flex-shrink-0 h-10 w-10">
                          <img class="h-10 w-10 rounded" :src="item.thumbnail" alt="内容缩略图">
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ item.title }}</div>
                          <div v-if="item.description" class="text-xs text-gray-500 truncate max-w-xs">{{ item.description }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.category }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="[
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        item.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        item.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      ]">
                        {{ item.difficulty === 'easy' ? '简单' : item.difficulty === 'medium' ? '中等' : '困难' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.createdAt }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="[
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        item.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      ]">
                        {{ item.published ? '已发布' : '草稿' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        @click="editContent(item)" 
                        class="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        编辑
                      </button>
                      <button 
                        @click="togglePublishStatus(item)" 
                        class="text-yellow-600 hover:text-yellow-900 mr-3"
                      >
                        {{ item.published ? '下架' : '发布' }}
                      </button>
                      <button 
                        @click="deleteContent(item)" 
                        class="text-red-600 hover:text-red-900"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 分页 -->
          <div class="mt-6 flex justify-between items-center">
            <div class="text-sm text-gray-700">
              显示 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, currentTabContent.length) }} 条，共 {{ currentTabContent.length }} 条
            </div>
            <div class="flex space-x-2">
              <button 
                @click="currentPage = Math.max(1, currentPage - 1)" 
                :disabled="currentPage === 1"
                class="px-3 py-1 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                上一页
              </button>
              <button 
                @click="currentPage = Math.min(Math.ceil(currentTabContent.length / pageSize), currentPage + 1)" 
                :disabled="currentPage >= Math.ceil(currentTabContent.length / pageSize)"
                class="px-3 py-1 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                下一页
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '../../store'

const router = useRouter()
const store = useMainStore()
const showUserMenu = ref(false)

// 内容类型选项卡
const contentTabs = ref([
  { id: 'animations', name: '动画' },
  { id: 'pinyin', name: '拼音学习' },
  { id: 'characters', name: '汉字学习' },
  { id: 'stories', name: '中文故事' },
  { id: 'vocabulary', name: '词汇' }
])

const activeTab = ref('animations')
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

// 模拟内容数据
const contentData = ref({
  animations: [
    {
      id: '1',
      title: '拼音入门-声母b',
      description: '学习拼音声母b的发音和书写',
      thumbnail: '/logo.svg',
      category: '拼音学习',
      difficulty: 'easy',
      createdAt: '2023-01-10 10:00',
      published: true
    },
    {
      id: '2',
      title: '汉字启蒙-日',
      description: '学习汉字"日"的认识和书写',
      thumbnail: '/logo.svg',
      category: '汉字启蒙',
      difficulty: 'easy',
      createdAt: '2023-01-15 14:30',
      published: true
    },
    {
      id: '3',
      title: '成语故事-守株待兔',
      description: '通过动画学习成语故事"守株待兔"',
      thumbnail: '/logo.svg',
      category: '成语故事',
      difficulty: 'medium',
      createdAt: '2023-02-01 09:15',
      published: false
    }
  ],
  pinyin: [
    {
      id: 'p1',
      title: '声母教学-a',
      description: '学习拼音声母a的发音',
      category: '拼音学习',
      difficulty: 'easy',
      createdAt: '2023-01-05 11:20',
      published: true
    }
  ],
  characters: [
    {
      id: 'c1',
      title: '基础汉字-水',
      description: '学习基础汉字"水"',
      category: '汉字启蒙',
      difficulty: 'easy',
      createdAt: '2023-01-20 16:45',
      published: true
    }
  ],
  stories: [
    {
      id: 's1',
      title: '小蝌蚪找妈妈',
      description: '经典童话故事',
      category: '童话故事',
      difficulty: 'medium',
      createdAt: '2023-02-10 13:10',
      published: true
    }
  ],
  vocabulary: [
    {
      id: 'v1',
      title: '日常生活词汇',
      description: '学习日常生活中常用的中文词汇',
      category: '词汇学习',
      difficulty: 'easy',
      createdAt: '2023-02-20 15:25',
      published: false
    }
  ]
})

// 当前选项卡的内容
const currentTabContent = computed(() => {
  const content = contentData.value[activeTab.value] || []
  
  // 搜索筛选
  if (searchQuery.value.trim() !== '') {
    const query = searchQuery.value.toLowerCase()
    return content.filter(item => 
      item.title.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query)) ||
      item.category.toLowerCase().includes(query)
    )
  }
  
  return content
})

// 当前页显示的内容
const paginatedContent = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return currentTabContent.value.slice(start, end)
})

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

const addContent = () => {
  console.log('添加内容:', activeTab.value)
  // 实际应用中，这里可以打开添加内容模态框
}

const editContent = (item) => {
  console.log('编辑内容:', item)
  // 实际应用中，这里可以打开编辑模态框
}

const togglePublishStatus = (item) => {
  console.log('切换发布状态:', item)
  // 实际应用中，这里可以调用API更新内容状态
  item.published = !item.published
}

const deleteContent = (item) => {
  console.log('删除内容:', item)
  // 实际应用中，这里可以调用API删除内容，并弹出确认对话框
}

// 当切换选项卡时重置页码
const handleTabChange = () => {
  currentPage.value = 1
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
</style>