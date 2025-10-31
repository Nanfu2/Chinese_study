<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 child-ui">
    <!-- 顶部导航 -->
    <header class="p-4 bg-white shadow-sm sticky top-0 z-10">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center">
          <button @click="goBack" class="mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-xl font-bold text-purple-600 font-display">我的成就</h1>
        </div>
        <div class="flex items-center">
          <div class="relative">
            <div class="w-10 h-10 rounded-full border-2 border-purple-300 bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 加载动画 -->
    <div v-if="isLoading" class="container mx-auto px-4 py-6">
      <!-- 顶部加载动画 -->
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
        <div class="p-6">
          <div class="animate-pulse">
            <div class="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            
            <!-- 统计卡片加载动画 -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div class="bg-gray-100 rounded-xl p-4 text-center">
                <div class="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
              <div class="bg-gray-100 rounded-xl p-4 text-center">
                <div class="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
              <div class="bg-gray-100 rounded-xl p-4 text-center">
                <div class="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
              <div class="bg-gray-100 rounded-xl p-4 text-center">
                <div class="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </div>

            <!-- 进度条加载动画 -->
            <div class="bg-gray-100 rounded-xl p-4 mb-6">
              <div class="flex items-center justify-between mb-2">
                <div class="h-4 bg-gray-200 rounded w-1/6"></div>
                <div class="h-4 bg-gray-200 rounded w-1/8"></div>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                <div class="bg-gray-300 h-2.5 rounded-full w-1/3"></div>
              </div>
              <div class="h-3 bg-gray-200 rounded w-1/3 ml-auto"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分类标签加载动画 -->
      <div class="flex space-x-2 mt-6 mb-4 overflow-x-auto pb-2">
        <div v-for="i in 5" :key="i" class="animate-pulse">
          <div class="h-8 bg-gray-200 rounded-full w-16"></div>
        </div>
      </div>

      <!-- 成就列表加载动画 -->
      <div class="space-y-4">
        <div v-for="i in 4" :key="i" class="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
          <div class="p-4 flex items-center">
            <div class="relative mr-4">
              <div class="w-16 h-16 bg-gray-200 rounded-full"></div>
            </div>
            <div class="flex-1">
              <div class="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-full mb-3"></div>
              <div class="flex items-center">
                <div class="flex items-center mr-4">
                  <div class="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div class="h-6 bg-gray-200 rounded-full w-16"></div>
              </div>
            </div>
            <div class="ml-4">
              <div class="h-8 bg-gray-200 rounded-full w-16"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 成就内容 -->
    <div v-else class="container mx-auto px-4 py-6">
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">成就概览</h2>
          
          <!-- 统计卡片 -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div class="bg-blue-50 rounded-xl p-4 text-center">
              <div class="text-blue-600 font-bold text-xl">{{ totalAchievements }}</div>
              <div class="text-blue-600 text-sm mt-1">总成就</div>
            </div>
            <div class="bg-green-50 rounded-xl p-4 text-center">
              <div class="text-green-600 font-bold text-xl">{{ completedAchievements }}</div>
              <div class="text-green-600 text-sm mt-1">已完成</div>
            </div>
            <div class="bg-yellow-50 rounded-xl p-4 text-center">
              <div class="text-yellow-600 font-bold text-xl">{{ level }}</div>
              <div class="text-yellow-600 text-sm mt-1">等级</div>
            </div>
            <div class="bg-purple-50 rounded-xl p-4 text-center">
              <div class="text-purple-600 font-bold text-xl">{{ totalPoints }}</div>
              <div class="text-purple-600 text-sm mt-1">积分</div>
            </div>
          </div>

          <!-- 连续学习天数 -->
          <div class="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 mb-6">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-orange-600 font-medium">连续学习</h3>
              <span class="text-orange-600 font-bold">{{ streakDays }}天</span>
            </div>
            <div class="w-full bg-white rounded-full h-2.5">
              <div class="bg-orange-500 h-2.5 rounded-full" :style="{ width: streakProgress + '%' }"></div>
            </div>
            <div class="text-xs text-orange-500 mt-1 text-right">
              再坚持{{ nextStreakReward - streakDays }}天获得奖励
            </div>
          </div>
        </div>
      </div>

      <!-- 成就分类标签 -->
      <div class="flex space-x-2 mt-6 mb-4 overflow-x-auto pb-2">
        <button 
          v-for="tab in achievementTabs" 
          :key="tab"
          :class="['px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all', 
                  activeTab === tab ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100']"
          @click="activeTab = tab"
        >
          {{ tab }}
        </button>
      </div>

      <!-- 成就列表 -->
      <div class="space-y-4">
        <div 
          v-for="achievement in filteredAchievements" 
          :key="achievement.id"
          :class="['bg-white rounded-xl overflow-hidden shadow-sm transition-all', 
                  achievement.isCompleted ? 'opacity-100' : 'opacity-60 grayscale']"
        >
          <div class="p-4 flex items-center">
            <div class="relative mr-4">
              <div class="w-16 h-16 rounded-full flex items-center justify-center" 
                   :class="achievement.isCompleted ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'">
                <img :src="achievement.icon" :alt="achievement.title" class="w-10 h-10" />
              </div>
              <div v-if="achievement.isNew" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <h4 class="font-bold text-gray-800">{{ achievement.title }}</h4>
              <p class="text-gray-600 text-sm mt-1">{{ achievement.description }}</p>
              <div class="flex items-center mt-2">
                <div class="flex items-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                  <span class="text-xs text-gray-500">{{ achievement.points }}积分</span>
                </div>
                <div v-if="achievement.isCompleted" class="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  已完成
                </div>
                <div v-else class="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                  进度: {{ achievement.progress }}%
                </div>
              </div>
            </div>
            <div class="ml-4">
              <button v-if="achievement.isCompleted && achievement.isNew" 
                      class="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-4 py-2 rounded-full shadow hover:shadow-md transition-shadow">
                领取奖励
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部导航 -->
    <footer class="mt-8 py-4 bg-white border-t">
      <div class="container mx-auto flex justify-center space-x-8">
        <button @click="goToHome" class="flex flex-col items-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="text-xs mt-1">首页</span>
        </button>
        <button @click="goToLibrary" class="flex flex-col items-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span class="text-xs mt-1">动画库</span>
        </button>
        <button @click="goToAchievements" class="flex flex-col items-center text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <span class="text-xs mt-1">成就</span>
        </button>
        <button @click="goToParentDashboard" class="flex flex-col items-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span class="text-xs mt-1">家长</span>
        </button>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '../../store'
import { auth, userService, learningService } from '../../services/supabase'
import { extendedContentService, extendedLearningService } from '../../services/supabase_extended'

const router = useRouter()
const store = useMainStore()

// 状态管理
const activeTab = ref('全部')
const achievementTabs = ['全部', '学习', '行为', '连续', '挑战']
const isLoading = ref(true)
const currentChild = ref(null)

// 成就数据
const achievements = ref([])
const childAchievements = ref([])

// 统计数据
const totalAchievements = computed(() => achievements.value.length)
const completedAchievements = computed(() => childAchievements.value.length)
const level = computed(() => Math.floor(childAchievements.value.length / 3) + 1)
const totalPoints = computed(() => {
  return childAchievements.value.reduce((sum, ca) => {
    const achievement = achievements.value.find(a => a.id === ca.achievement_id)
    return sum + (achievement?.reward_points || 0)
  }, 0)
})
const streakDays = ref(0)
const nextStreakReward = 21
const streakProgress = computed(() => (streakDays.value / nextStreakReward) * 100)

// 状态管理 - 添加观看历史数据
const watchHistory = ref([])

// 自动解锁成就的函数
const autoUnlockAchievement = async (achievement, progress) => {
  if (progress >= 100 && currentChild.value) {
    try {
      console.log('检测到成就进度达到100%，尝试自动解锁:', achievement.name)
      
      // 检查是否已经解锁
      const existingAchievement = childAchievements.value.find(ca => ca.achievement_id === achievement.id)
      if (!existingAchievement) {
        // 调用解锁成就服务
        const result = await extendedContentService.unlockAchievement(currentChild.value.id, achievement.id)
        
        if (result.success) {
          console.log('成就自动解锁成功:', achievement.name)
          
          // 刷新成就数据
          await refreshAchievements()
          
          // 发送全局事件通知其他组件
          window.dispatchEvent(new CustomEvent('achievementUnlocked', {
            detail: {
              achievementId: achievement.id,
              achievementName: achievement.name,
              childId: currentChild.value.id
            }
          }))
        }
      }
    } catch (error) {
      console.error('自动解锁成就失败:', error)
    }
  }
}

// 监听数据变化，检查是否需要自动解锁成就
watch([achievements, childAchievements, watchHistory, currentChild], () => {
  if (achievements.value.length > 0 && currentChild.value) {
    achievements.value.forEach(achievement => {
      const childAchievement = childAchievements.value.find(ca => ca.achievement_id === achievement.id)
      const isCompleted = !!childAchievement
      
      if (!isCompleted) {
        let progress = 0
        
        // 根据成就类型计算实际进度
        switch (achievement.condition_type) {
          case 'watch_count':
            const totalWatched = watchHistory.value.length
            progress = Math.min((totalWatched / achievement.condition_value) * 100, 100)
            break
          case 'completion_rate':
            const completedAnimations = watchHistory.value.filter(record => record.completed).length
            const totalAnimations = watchHistory.value.length
            progress = totalAnimations > 0 ? Math.min((completedAnimations / totalAnimations) * 100, 100) : 0
            break
          case 'character_count':
            progress = Math.min(30, 100) // 临时值，需要实际计算
            break
          default:
            progress = 0
        }
        
        // 检查是否需要自动解锁成就
        if (progress >= 100) {
          autoUnlockAchievement(achievement, progress)
        }
      }
    })
  }
}, { deep: true, immediate: true })

// 计算属性：过滤后的成就列表
const filteredAchievements = computed(() => {
  const allAchievements = achievements.value.map(achievement => {
    const childAchievement = childAchievements.value.find(ca => ca.achievement_id === achievement.id)
    const isCompleted = !!childAchievement
    
    // 根据成就类型计算实际进度
    let progress = 0
    if (!isCompleted) {
      // 根据成就类型计算实际进度
      switch (achievement.condition_type) {
        case 'watch_count':
          // 获取孩子的观看总数
          const totalWatched = watchHistory.value.length
          progress = Math.min((totalWatched / achievement.condition_value) * 100, 100)
          break
        case 'completion_rate':
          // 获取完成率 - 计算已完成的动画数量
          const completedAnimations = watchHistory.value.filter(record => record.completed).length
          const totalAnimations = watchHistory.value.length
          progress = totalAnimations > 0 ? Math.min((completedAnimations / totalAnimations) * 100, 100) : 0
          break
        case 'character_count':
          // 获取已学汉字数量（这里需要实际的汉字学习数据）
          progress = Math.min(30, 100) // 临时值，需要实际计算
          break
        default:
          progress = 0
      }
    } else {
      progress = 100
    }
    
    // 根据成就类型映射到前端分类
    let type = '学习'
    if (achievement.condition_type.includes('watch_count')) type = '行为'
    if (achievement.condition_type.includes('streak')) type = '连续'
    if (achievement.condition_type.includes('completion_rate')) type = '挑战'
    
    return {
      id: achievement.id,
      title: achievement.name,
      description: achievement.description,
      icon: achievement.icon_url || '/achievements/default.png',
      points: achievement.reward_points || 0,
      isCompleted: isCompleted,
      isNew: childAchievement && new Date(childAchievement.unlocked_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000,
      type: type,
      progress: Math.round(progress)
    }
  })
  
  if (activeTab.value === '全部') {
    return allAchievements
  }
  return allAchievements.filter(a => a.type === activeTab.value)
})

// 刷新成就数据
const refreshAchievements = async () => {
  try {
    isLoading.value = true
    
    // 重新获取当前孩子的成就记录和观看历史
    if (currentChild.value) {
      const childAchievementsData = await extendedContentService.getChildAchievements(currentChild.value.id)
      childAchievements.value = childAchievementsData
      
      const watchHistoryData = await learningService.getLearningStats(currentChild.value.id, 'all')
      watchHistory.value = watchHistoryData
    }
  } catch (error) {
    console.error('刷新成就数据失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 加载数据
const loadData = async () => {
  try {
    isLoading.value = true
    
    // 获取当前选择的孩子
    currentChild.value = store.currentChild
    if (!currentChild.value && store.children.length > 0) {
      currentChild.value = store.children[0]
    }
    
    if (!currentChild.value) {
      throw new Error('没有找到当前选择的孩子')
    }
    
    // 获取当前用户信息
    const user = await auth.getCurrentUser()
    if (user) {
      // 获取家长信息
      const parentInfo = await userService.getParentInfo(user.id)
      if (parentInfo) {
        // 获取所有成就
        const allAchievements = await extendedContentService.getAchievements()
        achievements.value = allAchievements
        
        // 获取当前孩子的成就记录
        const childAchievementsData = await extendedContentService.getChildAchievements(currentChild.value.id)
        childAchievements.value = childAchievementsData
        
        // 获取当前孩子的观看历史
        const watchHistoryData = await learningService.getLearningStats(currentChild.value.id, 'all')
        watchHistory.value = watchHistoryData
        
        // 获取当前孩子的学习统计来计算连续学习天数
        const stats = await extendedLearningService.getDashboardStats(currentChild.value.id)
        streakDays.value = stats.current_streak || 0
      }
    }
  } catch (error) {
    console.error('加载成就数据失败:', error)
    // 如果API调用失败，使用模拟数据作为降级方案
    achievements.value = [
      {
        id: '1',
        name: '初次见面',
        description: '观看第一个动画',
        icon_url: '/achievements/first-watch.png',
        condition_type: 'watch_count',
        condition_value: 1,
        reward_points: 10,
        is_active: true
      },
      {
        id: '2',
        name: '学习小达人',
        description: '观看10个动画',
        icon_url: '/achievements/watch-10.png',
        condition_type: 'watch_count',
        condition_value: 10,
        reward_points: 50,
        is_active: true
      },
      {
        id: '3',
        name: '拼音小能手',
        description: '完成拼音学习',
        icon_url: '/achievements/pinyin.png',
        condition_type: 'completion_rate',
        condition_value: 80,
        reward_points: 100,
        is_active: true
      },
      {
        id: '4',
        name: '汉字小专家',
        description: '认识50个汉字',
        icon_url: '/achievements/character.png',
        condition_type: 'character_count',
        condition_value: 50,
        reward_points: 150,
        is_active: true
      }
    ]
    
    childAchievements.value = []
    // 为模拟数据添加一些观看历史记录，让成就显示进度
    watchHistory.value = [
      { id: '1', child_id: '1', animation_id: '1', watch_duration: 300, completed: true, created_at: new Date().toISOString() }
    ]
    streakDays.value = 5
  } finally {
    isLoading.value = false
  }
}

// 导航方法
const goBack = () => {
  router.back()
}

const goToHome = () => {
  router.push('/child')
}

const goToLibrary = () => {
  router.push('/child/library')
}

const goToAchievements = () => {
  router.push('/child/achievements')
}

const goToParentDashboard = () => {
  router.push('/parent')
}

// 组件挂载时加载数据
onMounted(() => {
  loadData()
  
  // 监听成就解锁事件
  window.addEventListener('achievementUnlocked', handleAchievementUnlocked)
})

// 组件卸载时清理事件监听器
onUnmounted(() => {
  window.removeEventListener('achievementUnlocked', handleAchievementUnlocked)
})

// 处理成就解锁事件
const handleAchievementUnlocked = (event) => {
  console.log('收到成就解锁事件:', event.detail)
  // 刷新成就数据
  refreshAchievements()
}
</script>

<style scoped>
.font-display {
  font-family: 'Comic Sans MS', cursive, sans-serif;
}
</style>