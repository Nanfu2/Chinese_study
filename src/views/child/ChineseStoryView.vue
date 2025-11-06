<template>
  <div class="min-h-screen bg-gradient-to-b from-red-50 to-orange-50 child-ui">
    <!-- 顶部导航 -->
    <header class="p-4 bg-white shadow-sm sticky top-0 z-10">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center">
          <button @click="goBack" class="mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-xl font-bold text-red-600 font-display">汉字故事</h1>
        </div>
        <div class="flex items-center space-x-3">
          <div class="flex items-center bg-red-100 text-red-700 rounded-full px-3 py-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span class="text-xs">{{ currentCharacter.character }}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 进度指示器 -->
    <div class="container mx-auto px-4 py-2">
      <div class="bg-white rounded-full shadow-sm p-1">
        <div class="flex items-center justify-between px-4">
          <span class="text-sm text-gray-600">进度</span>
          <div class="flex-1 mx-4">
            <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-red-400 to-orange-500 transition-all duration-500" 
                   :style="{ width: charactersData.length > 0 ? `${(currentIndex / (charactersData.length - 1)) * 100}%` : '0%' }"></div>
            </div>
          </div>
          <span class="text-sm font-medium text-red-600">{{ currentIndex + 1 }}/{{ charactersData.length || 0 }}</span>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
  <div v-if="isLoading" class="container mx-auto px-4 py-6">
    <div class="bg-white rounded-2xl shadow-lg overflow-hidden p-8 text-center">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
      <p class="text-gray-600">正在加载汉字故事...</p>
    </div>
  </div>
  
  <!-- 错误提示 -->
  <div v-else-if="error" class="container mx-auto px-4 py-6">
    <div class="bg-white rounded-2xl shadow-lg overflow-hidden p-8 text-center">
      <p class="text-red-600 text-lg mb-4">{{ error }}</p>
      <button @click="loadCharacters" class="bg-red-500 text-white px-6 py-2 rounded-full text-sm font-medium">重试</button>
    </div>
  </div>

    <!-- 主内容区域 -->
    <div v-else class="container mx-auto px-4 py-6">
      <!-- 汉字展示 -->
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
        <div class="p-6 text-center">
          <!-- 现代汉字 -->
          <div class="text-8xl font-bold text-red-600 mb-4">
            {{ currentCharacter.character }}
          </div>
          
          <!-- 拼音和意思 -->
          <div class="text-gray-600 text-lg mb-6">
            {{ currentCharacter.pinyin }} | {{ currentCharacter.meaning }}
          </div>
          
          <!-- 演变过程 -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">汉字演变</h3>
            <div class="flex justify-center space-x-4 overflow-x-auto pb-2">
              <div v-for="(evolution, index) in currentCharacter.evolution" :key="index" class="flex flex-col items-center">
                <div class="w-16 h-16 border-2 border-red-200 rounded-lg flex items-center justify-center mb-2">
                  <span class="text-2xl font-bold">{{ evolution.form }}</span>
                </div>
                <span class="text-xs text-gray-500">{{ evolution.period }}</span>
              </div>
            </div>
          </div>
          
          <!-- 书写动画按钮 -->
          <button @click="showStrokeAnimation = !showStrokeAnimation" class="bg-red-100 text-red-600 px-6 py-2 rounded-full text-sm font-medium flex items-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
            {{ showStrokeAnimation ? '隐藏书写动画' : '观看书写动画' }}
          </button>
        </div>
        
        <!-- 笔画动画区域 -->
        <div v-if="showStrokeAnimation" class="bg-gray-50 p-6">
          <div class="relative w-full h-48 border-2 border-gray-200 rounded-lg mx-auto">
            <!-- 这里可以实现笔画动画，暂时用图片代替 -->
            <img :src="currentCharacter.strokeImage" :alt="currentCharacter.character + ' 书写动画'" class="w-full h-full object-contain" />
            <div class="absolute bottom-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              共 {{ currentCharacter.strokeCount }} 笔
            </div>
          </div>
          <div class="mt-4 text-center">
            <button @click="playStrokeSound" class="bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-md mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 汉字故事 -->
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
        <div class="p-6">
          <h3 class="text-xl font-semibold text-red-600 mb-4">汉字故事</h3>
          <div class="text-gray-700 leading-relaxed">
            <p class="mb-4">{{ currentCharacter?.story || currentCharacter?.meaning || '暂无故事内容' }}</p>
          </div>
          
          <!-- 相关图片 -->
            <div v-if="currentCharacter.illustration" class="mt-6">
             <img :src="currentCharacter.illustration" :alt="currentCharacter.character + ' 故事插图'" class="w-full h-48 object-cover rounded-lg" @error="handleImageError" />
            </div>
        </div>
      </div>

      <!-- 导航按钮 -->
      <div class="flex justify-between mb-6">
        <button 
          @click="previousCharacter" 
          :disabled="currentIndex === 0"
          class="bg-red-100 text-red-600 px-6 py-2 rounded-full text-sm font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          上一个
        </button>
        
        <button 
          @click="nextCharacter" 
          :disabled="currentIndex === charactersData.length - 1"
          class="bg-red-500 text-white px-6 py-2 rounded-full text-sm font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          下一个
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- 组词练习 -->
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="p-6">
          <h3 class="text-xl font-semibold text-red-600 mb-4">组词练习</h3>
          
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div v-for="word in currentCharacter.words" :key="word.text" class="border-2 border-gray-200 rounded-xl p-4 text-center transition-all hover:border-red-300">
              <div class="text-xl font-bold text-gray-800 mb-1">
                {{ word.text }}
              </div>
              <div class="text-gray-600 text-xs">
                {{ word.pinyin }} | {{ word.meaning }}
              </div>
            </div>
          </div>

          <!-- 练习游戏 -->
          <div class="bg-red-50 rounded-xl p-4">
            <h4 class="font-semibold text-red-700 mb-3">连线游戏</h4>
            <p class="text-sm text-gray-700 mb-4">请将左侧的字与右侧的意思连起来</p>
            
            <div class="flex flex-col md:flex-row justify-between gap-4">
              <!-- 左侧汉字 -->
              <div class="flex-1 space-y-2">
                <div v-for="(item, index) in matchingItems" :key="'char-'+index" class="bg-white p-3 rounded-lg text-center">
                  <span class="text-xl font-bold text-red-600">{{ item.character }}</span>
                </div>
              </div>
              
              <!-- 中间连线区域 -->
              <div class="hidden md:block w-16"></div>
              
              <!-- 右侧意思 -->
              <div class="flex-1 space-y-2">
                <div v-for="(item, index) in matchingItems" :key="'mean-'+index" class="bg-white p-3 rounded-lg text-center">
                  <span class="text-sm text-gray-700">{{ item.meaning }}</span>
                </div>
              </div>
            </div>
            
            <button @click="checkMatching" class="mt-4 w-full bg-red-500 text-white py-2 rounded-lg text-sm font-medium">
              检查答案
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 完成页面 -->
    <div v-if="showCompletion" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-3xl shadow-2xl max-w-md mx-4 p-8 text-center">
        <div class="mb-6">
          <div class="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">恭喜你！</h2>
          <p class="text-gray-600">你完成了汉字故事的学习！</p>
        </div>
        
        <div class="bg-gray-50 rounded-xl p-4 mb-6">
          <div class="grid grid-cols-2 gap-4 text-center">
            <div>
              <div class="text-2xl font-bold text-green-600">{{ learnedCharacters }}</div>
              <div class="text-sm text-gray-500">学习汉字</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-blue-600">{{ totalCharacters }}</div>
              <div class="text-sm text-gray-500">总汉字数</div>
            </div>
          </div>
          <div class="mt-4">
            <div class="text-sm text-gray-500 mb-1">完成度</div>
            <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500" 
                   :style="{ width: `${(learnedCharacters / totalCharacters) * 100}%` }"></div>
            </div>
            <div class="text-sm font-medium text-gray-700 mt-1">
              {{ Math.round((learnedCharacters / totalCharacters) * 100) }}%
            </div>
          </div>
        </div>
        
        <div class="flex space-x-3">
          <button @click="restartLearning" class="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-xl font-semibold shadow hover:shadow-md transition-shadow">
            再来一次
          </button>
          <button @click="goToHome" class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors">
            返回首页
          </button>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { contentService } from '../../services/contentService'

const router = useRouter()
const route = useRoute()

// 状态管理
const showStrokeAnimation = ref(false)
const currentIndex = ref(0)
const charactersData = ref([])
const isLoading = ref(true)
const showCompletion = ref(false)
const learnedCharacters = ref(0)
const totalCharacters = ref(0)
const error = ref(null)

// 从contentService获取汉字数据

// 加载汉字数据
const loadCharacters = async () => {
  isLoading.value = true
  error.value = null
  try {
    // 从contentService获取汉字故事数据
    const data = await contentService.getChineseCharactersWithStories()
    charactersData.value = data
    totalCharacters.value = data.length
    console.log('加载汉字数据成功:', data)
  } catch (err) {
    console.error('加载汉字数据失败:', err)
    error.value = '加载汉字数据失败，请稍后再试'
    // 如果获取数据失败，使用默认的木字作为后备
    charactersData.value = [
      {
        character: '木',
        pinyin: 'mù',
        meaning: '树木',
        strokeCount: 4,
        evolution: [
          { form: '🌳', period: '甲骨文' },
          { form: '木', period: '金文' },
          { form: '木', period: '小篆' },
          { form: '木', period: '楷书' }
        ],
        strokeImage: '/strokes/mu.gif',
        story: '"木"字就像一棵树，有树干、树枝和树根。树木是大自然的重要成员，为我们提供氧气和木材。',
        illustration: '/stories/mu.jpg',
        words: [
          { text: '树木', pinyin: 'shù mù', meaning: '高大的植物' },
          { text: '木头', pinyin: 'mù tou', meaning: '树木的材质' },
          { text: '木工', pinyin: 'mù gōng', meaning: '制作木器的工匠' },
          { text: '木瓜', pinyin: 'mù guā', meaning: '一种水果' }
        ]
      }
    ]
    totalCharacters.value = charactersData.value.length
  } finally {
    isLoading.value = false
  }
}

// 连线游戏数据
const matchingItems = computed(() => {
  if (!currentCharacter.value?.words?.length) return [
    { character: '日', meaning: '太阳' },
    { character: '月', meaning: '月亮' },
    { character: '山', meaning: '山峰' },
    { character: '水', meaning: '河流' }
  ];
  
  // 从当前汉字的词语中生成匹配项
  return currentCharacter.value.words.slice(0, 4).map(word => ({
    character: word.text[0], // 取词语的第一个字
    meaning: word.meaning
  }));
})

// 计算属性
const currentCharacter = computed(() => {
  if (!charactersData.value || charactersData.value.length === 0) {
    return {
      character: '',
      pinyin: '',
      meaning: '',
      strokeCount: 0,
      evolution: [],
      strokeImage: '',
      story: '',
      illustration: '',
      words: []
    }
  }
  return charactersData.value[currentIndex.value]
})

// 方法
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

const playStrokeSound = () => {
  // 这里可以添加笔画音效
  console.log(`播放${currentCharacter.value.character}的笔画音效`)
}

const checkMatching = () => {
  // 这里可以实现连线游戏的答案检查
  console.log('检查连线答案')
}

const previousCharacter = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    showStrokeAnimation.value = false
  }
}

const nextCharacter = () => {
  if (currentIndex.value < charactersData.value.length - 1) {
    currentIndex.value++
    showStrokeAnimation.value = false
    
    // 记录学习进度
    if (currentIndex.value + 1 > learnedCharacters.value) {
      learnedCharacters.value = currentIndex.value + 1
    }
  } else {
    // 学习完成
    showCompletion.value = true
  }
}

const restartLearning = () => {
  currentIndex.value = 0
  learnedCharacters.value = 0
  showCompletion.value = false
  showStrokeAnimation.value = false
}

// 处理图片加载错误
   const handleImageError = (event) => {
     // 防止无限循环：只有当当前图片不是默认图片时才替换为默认图片
     if (event.target.src !== '/stories/default.jpg' && !event.target.src.includes('default.jpg')) {
       event.target.src = '/stories/default.jpg';
       // 移除error事件监听器，防止默认图片也加载失败时的循环
       event.target.removeEventListener('error', handleImageError);
     }
   };
  
  // 组件挂载时加载数据
  onMounted(() => {
    loadCharacters()
  })
</script>

<style scoped>
.font-display {
  font-family: 'Comic Sans MS', cursive, sans-serif;
}
</style>