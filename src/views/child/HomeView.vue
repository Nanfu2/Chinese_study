<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 child-ui">
    <!-- 顶部导航 -->
    <header class="p-4 bg-white shadow-sm">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center">
          <img src="/logo.svg" alt="萌豆语文动画屋" class="h-10 w-10 rounded-full mr-3" />
          <h1 class="text-2xl font-bold text-primary font-display">萌豆语文动画屋</h1>
        </div>
        <div class="flex items-center">
          <button @click="selectChild" class="flex items-center mr-4 text-gray-600 hover:text-primary">
            <span class="mr-1">{{ currentChild?.name || '选择孩子' }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button @click="goToAchievements" class="relative">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span v-if="newAchievements > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {{ newAchievements }}
            </span>
          </button>
        </div>
      </div>
    </header>

    <!-- 欢迎消息 -->
    <section class="py-6 px-4">
      <div class="container mx-auto">
        <h2 class="text-2xl font-bold text-gray-800 font-display">你好，{{ currentChild?.name || '小朋友' }}！</h2>
        <p class="text-gray-600 mt-1">今天要学什么呢？</p>
      </div>
    </section>

    <!-- 每日课程推荐 -->
    <section class="py-6 px-4">
      <div class="container mx-auto">
        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span class="bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center text-sm mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          今日推荐
        </h3>
        
        <!-- 加载状态 -->
        <div v-if="isLoading" class="bg-white rounded-xl p-6 text-center shadow">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p class="text-gray-600">正在加载推荐内容...</p>
        </div>
        
        <!-- 数据加载完成 -->
        <div v-else-if="dailyRecommendations.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="item in dailyRecommendations" :key="item.id" class="animation-card bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer" @click="playAnimation(item.id)">
            <div class="relative">
              <img :src="item.coverUrl" :alt="item.title" class="w-full h-48 object-cover" />
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="bg-primary/80 rounded-full h-16 w-16 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {{ item.duration }}分钟
              </div>
            </div>
            <div class="p-4">
              <h4 class="text-lg font-bold text-gray-800">{{ item.title }}</h4>
              <p class="text-gray-600 text-sm mt-1">{{ item.description }}</p>
              <div class="flex justify-between items-center mt-3">
                <span class="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{{ item.category }}</span>
                <span class="text-sm font-medium text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  完成学习
                </span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="bg-white rounded-xl p-6 text-center shadow">
          <p class="text-gray-600">今天的学习任务已完成，明天再来吧！</p>
        </div>
      </div>
    </section>

    <!-- 学习模块 -->
    <section class="py-6 px-4">
      <div class="container mx-auto">
        <h3 class="text-xl font-bold text-gray-800 mb-4">学习乐园</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <!-- 拼音剧场 -->
          <div class="bg-white rounded-2xl shadow-lg p-6 text-center transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 cursor-pointer" @click="goToPinyinTheater">
            <div class="bg-red-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h4 class="font-bold text-lg">拼音剧场</h4>
            <p class="text-xs text-gray-500 mt-1">和拼音精灵一起玩</p>
          </div>
          
          <!-- 汉字故事 -->
          <div class="bg-white rounded-2xl shadow-lg p-6 text-center transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 cursor-pointer" @click="goToChineseStories">
            <div class="bg-yellow-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h4 class="font-bold text-lg">汉字故事</h4>
            <p class="text-xs text-gray-500 mt-1">看汉字如何成长</p>
          </div>
          
          <!-- 词汇乐园 -->
          <div class="bg-white rounded-2xl shadow-lg p-6 text-center transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 cursor-pointer" @click="goToVocabularyGarden">
            <div class="bg-green-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <h4 class="font-bold text-lg">词汇乐园</h4>
            <p class="text-xs text-gray-500 mt-1">词语朋友一起玩</p>
          </div>
          
          <!-- 短句练习 -->
          <div class="bg-white rounded-2xl shadow-lg p-6 text-center transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 cursor-pointer" @click="goToSentencePractice">
            <div class="bg-blue-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h4 class="font-bold text-lg">短句练习</h4>
            <p class="text-xs text-gray-500 mt-1">学说话小能手</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 学习进度 -->
    <section class="py-6 px-4">
      <div class="container mx-auto">
        <h3 class="text-xl font-bold text-gray-800 mb-4">我的学习进度</h3>
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="mb-4">
            <div class="flex justify-between mb-2">
              <span class="font-medium">本周学习</span>
              <span class="text-primary font-bold">{{ weeklyProgress }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div class="bg-primary h-2.5 rounded-full" :style="{ width: weeklyProgress + '%' }"></div>
            </div>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div class="text-center">
              <div class="text-2xl font-bold text-primary">{{ totalDays }}</div>
              <div class="text-xs text-gray-500 mt-1">连续学习天数</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-primary">{{ learnedPinyin }}</div>
              <div class="text-xs text-gray-500 mt-1">已学拼音</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-primary">{{ learnedCharacters }}</div>
              <div class="text-xs text-gray-500 mt-1">已学汉字</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-primary">{{ totalAchievements }}</div>
              <div class="text-xs text-gray-500 mt-1">获得勋章</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 底部导航 -->
    <footer class="mt-8 py-4 bg-white border-t">
      <div class="container mx-auto flex justify-center space-x-8">
        <button @click="goToHome" class="flex flex-col items-center text-primary">
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
        <button @click="goToAchievements" class="flex flex-col items-center text-gray-500">
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

    <!-- 孩子选择弹窗 -->
    <div v-if="showChildSelector" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
        <div class="p-6">
          <h3 class="text-xl font-bold text-gray-800 mb-4">选择学习者</h3>
          <div class="space-y-3 max-h-64 overflow-y-auto">
            <div v-for="child in store.children" :key="child.id" 
                 @click="confirmChildSelection(child)"
                 class="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-blue-50 cursor-pointer transition-colors">
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-blue-600 font-bold">{{ child.name.charAt(0) }}</span>
              </div>
              <div>
                <p class="font-medium text-gray-800">{{ child.name }}</p>
                <p class="text-sm text-gray-500">{{ child.age }}岁 · {{ getLearningLevelText(child.learning_level) }}</p>
              </div>
              <div class="ml-auto">
                <svg v-if="currentChild?.id === child.id" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button @click="showChildSelector = false" class="px-4 py-2 text-gray-600 hover:text-gray-800">取消</button>
            <button @click="goToParentDashboard" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600">管理孩子</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '../../store'
import { auth, userService, contentService, learningService } from '../../services/supabase'
import { extendedContentService, extendedLearningService } from '../../services/supabase_extended'

const router = useRouter()
const store = useMainStore()

// 状态管理
const currentChild = ref(null)
const dailyRecommendations = ref([])
const newAchievements = ref(0)
const weeklyProgress = ref(0)
const totalDays = ref(0)
const learnedPinyin = ref(0)
const learnedCharacters = ref(0)
const totalAchievements = ref(0)
const isLoading = ref(true)
const showChildSelector = ref(false)

// 方法
const selectChild = () => {
  // 显示孩子选择弹窗
  showChildSelector.value = true
}

const confirmChildSelection = (child) => {
  currentChild.value = child
  store.setCurrentChild(child)
  showChildSelector.value = false
  
  // 重新加载当前孩子的数据
  loadData()
}

const getLearningLevelText = (level) => {
  const levelMap = {
    'beginner': '初级',
    'intermediate': '中级',
    'advanced': '高级'
  }
  return levelMap[level] || '初级'
}

const goToHome = () => {
  router.push('/child/home')
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

const goToPinyinTheater = () => {
  router.push('/child/pinyin-theater')
}

const goToChineseStories = () => {
  router.push('/child/chinese-story')
}

const goToVocabularyGarden = () => {
  router.push('/child/vocabulary-playground')
}

const goToSentencePractice = () => {
  router.push('/child/short-sentence-practice')
}

const playAnimation = (id) => {
  router.push(`/child/watch/${id}`)
}

// 获取每日推荐动画（按顺序显示，不因观看而消失）
const getDailyRecommendations = async (child) => {
  try {
    // 获取所有动画（按sort_order排序）
    const animations = await contentService.getAnimations()
    
    if (animations.length === 0) {
      return []
    }
    
    // 获取当前日期作为种子，确保每天显示相同的顺序
    const today = new Date()
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
    
    // 使用日期种子计算今天的起始索引
    const startIndex = seed % animations.length
    
    // 按顺序获取两个动画（如果到末尾则从头开始）
    const recommendations = []
    for (let i = 0; i < 2; i++) {
      const index = (startIndex + i) % animations.length
      const anim = animations[index]
      recommendations.push({
        id: anim.id,
        title: anim.title,
        description: anim.description,
        coverUrl: anim.thumbnail_url || '/default-animation.jpg',
        duration: Math.ceil(anim.duration / 60),
        category: '动画'
      })
    }
    
    return recommendations
  } catch (error) {
    console.error('获取每日推荐失败:', error)
    // 返回默认推荐
    return [
      {
        id: 1,
        title: '波波精灵和阿阿精灵',
        description: '学习声母b和韵母a的发音',
        coverUrl: '/pinyin-ba.jpg',
        duration: 5,
        category: '拼音'
      }
    ]
  }
}

// 加载数据
const loadData = async () => {
  try {
    isLoading.value = true
    
    // 获取当前用户信息
    const user = await auth.getCurrentUser()
    if (user) {
      // 获取家长信息
      const parentInfo = await userService.getParentInfo(user.id)
      if (parentInfo) {
        // 获取孩子列表
        const children = await userService.getChildren(parentInfo.id)
        if (children && children.length > 0) {
          // 如果没有当前选择的孩子，默认选择第一个
          if (!currentChild.value) {
            currentChild.value = children[0]
            store.setCurrentChild(children[0])
          }
          
          // 获取今日推荐动画（按顺序显示，不因观看而消失）
          dailyRecommendations.value = await getDailyRecommendations(currentChild.value)
          
          // 获取当前孩子的学习统计
          const stats = await getChildLearningStats(currentChild.value.id)
          weeklyProgress.value = Math.min(100, Math.round((stats.total_watch_time / 3600) * 10))
          totalDays.value = stats.current_streak
          learnedPinyin.value = Math.round(stats.completed_animations * 0.3)
          learnedCharacters.value = Math.round(stats.completed_animations * 0.4)
          
          // 获取当前孩子的成就数据
          const achievements = await extendedContentService.getChildAchievements(currentChild.value.id)
          totalAchievements.value = achievements.length
          newAchievements.value = achievements.filter(a => 
            new Date(a.unlocked_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
          ).length
        }
      }
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    // 如果API调用失败，使用默认数据
    dailyRecommendations.value = [
      {
        id: 1,
        title: '波波精灵和阿阿精灵',
        description: '学习声母b和韵母a的发音',
        coverUrl: '/pinyin-ba.jpg',
        duration: 5,
        category: '拼音'
      }
    ]
  } finally {
    isLoading.value = false
  }
}

// 获取孩子的学习统计
const getChildLearningStats = async (childId) => {
  try {
    // 获取观看历史统计
    const watchHistory = await learningService.getLearningStats(childId, 'week')
    const completedAnimations = watchHistory.filter(item => item.completed).length
    const totalWatchTime = watchHistory.reduce((sum, item) => sum + (item.watch_duration || 0), 0)
    
    // 计算连续学习天数
    const currentStreak = await calculateCurrentStreak(childId)
    
    return {
      total_watch_time: totalWatchTime,
      completed_animations: completedAnimations,
      current_streak: currentStreak
    }
  } catch (error) {
    console.error('获取孩子学习统计失败:', error)
    return {
      total_watch_time: 1800,
      completed_animations: 3,
      current_streak: 5
    }
  }
}

// 计算连续学习天数
const calculateCurrentStreak = async (childId) => {
  try {
    const today = new Date()
    const oneDay = 24 * 60 * 60 * 1000
    let streak = 0
    
    // 获取最近的学习记录
    const learningStats = await learningService.getLearningStats(childId, 'month')
    
    // 按日期分组
    const dates = [...new Set(learningStats.map(item => 
      new Date(item.watched_at || item.created_at).toDateString()
    ))].sort((a, b) => new Date(b) - new Date(a))
    
    // 计算连续天数
    for (let i = 0; i < dates.length; i++) {
      const currentDate = new Date(dates[i])
      const prevDate = i > 0 ? new Date(dates[i - 1]) : null
      
      if (i === 0) {
        // 检查今天是否有学习记录
        if (currentDate.toDateString() === today.toDateString()) {
          streak++
        }
      } else {
        // 检查是否连续
        const diffDays = Math.round(Math.abs((currentDate - prevDate) / oneDay))
        if (diffDays === 1) {
          streak++
        } else {
          break
        }
      }
    }
    
    return streak
  } catch (error) {
    console.error('计算连续学习天数失败:', error)
    return 5 // 默认值
  }
}

// 根据年龄获取年龄组
const getAgeGroup = (age) => {
  if (age <= 3) return 'toddler'
  if (age <= 6) return 'preschool'
  if (age <= 9) return 'elementary'
  return 'advanced'
}

// 根据学习水平获取难度级别
const getDifficultyLevel = (level) => {
  const levelMap = {
    'beginner': 'easy',
    'intermediate': 'medium',
    'advanced': 'hard'
  }
  return levelMap[level] || 'easy'
}

// 组件挂载时初始化
onMounted(async () => {
  // 确保存储中的当前孩子是最新的
  if (store.currentChild) {
    currentChild.value = store.currentChild
  } else if (store.children.length > 0) {
    // 如果没有当前选择的孩子，默认选择第一个
    currentChild.value = store.children[0]
    store.setCurrentChild(store.children[0])
  }
  
  await loadData()
})
</script>

<style scoped>
.font-display {
  font-family: 'Comic Sans MS', cursive, sans-serif;
}
</style>