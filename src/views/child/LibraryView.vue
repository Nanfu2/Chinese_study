<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 child-ui">
    <!-- 顶部导航 -->
    <header class="p-4 bg-white shadow-sm sticky top-0 z-10">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center">
          <button @click="goBack" class="mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-xl font-bold text-primary font-display">动画库</h1>
        </div>
        <div class="flex items-center">
          <div class="relative">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="搜索动画..." 
              class="px-4 py-2 pl-10 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary w-40 md:w-64"
            />
            <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </header>

    <!-- 分类标签 -->
    <div class="container mx-auto px-4 py-4 overflow-x-auto">
      <div class="flex space-x-2 pb-2">
        <button 
          v-for="category in categories" 
          :key="category"
          :class="['px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all', 
                  activeCategory === category ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100']"
          @click="activeCategory = category"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <!-- 动画列表 -->
    <div class="container mx-auto px-4 py-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="animation in filteredAnimations" 
          :key="animation.id"
          class="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
          @click="playAnimation(animation.id)"
        >
          <div class="relative">
            <img :src="animation.coverUrl" :alt="animation.title" class="w-full h-48 object-cover" />
            <div class="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <div class="bg-primary/90 rounded-full h-16 w-16 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {{ animation.duration }}分钟
            </div>
            <div v-if="animation.isNew" class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              新上线
            </div>
            <div v-if="animation.isCompleted" class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
              已完成
            </div>
          </div>
          <div class="p-4">
            <h4 class="text-lg font-bold text-gray-800">{{ animation.title }}</h4>
            <p class="text-gray-600 text-sm mt-1 line-clamp-2">{{ animation.description }}</p>
            <div class="flex justify-between items-center mt-3">
              <span class="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{{ animation.category }}</span>
              <div class="flex items-center">
                <svg v-if="animation.isFavorite" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-if="filteredAnimations.length === 0" class="bg-white rounded-xl p-8 text-center shadow mt-8">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <h3 class="text-xl font-semibold text-gray-700">没有找到动画</h3>
        <p class="text-gray-500 mt-2">尝试使用不同的搜索词或选择其他分类</p>
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
        <button @click="goToLibrary" class="flex flex-col items-center text-primary">
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
import { useRouter } from 'vue-router'

const router = useRouter()

// 状态管理
const searchQuery = ref('')
const activeCategory = ref('全部')
const categories = ['全部', '拼音', '汉字', '词汇', '句子', '故事']
const animations = ref([
  // 拼音类动画
  {
    id: 1,
    title: '波波精灵和阿阿精灵',
    description: '学习声母b和韵母a的发音，跟着可爱的精灵一起学习吧！',
    coverUrl: '/pinyin-ba.jpg',
    duration: 5,
    category: '拼音',
    isNew: true,
    isCompleted: true,
    isFavorite: true
  },
  {
    id: 2,
    title: '妈妈的魔法拼音课',
    description: '学习声母m的发音和常见词语',
    coverUrl: '/pinyin-ma.jpg',
    duration: 4,
    category: '拼音',
    isNew: false,
    isCompleted: true,
    isFavorite: false
  },
  {
    id: 3,
    title: '大老虎的呼噜声',
    description: '学习声母h的发音技巧',
    coverUrl: '/pinyin-hu.jpg',
    duration: 6,
    category: '拼音',
    isNew: false,
    isCompleted: false,
    isFavorite: true
  },
  // 汉字类动画
  {
    id: 4,
    title: '日字的故事',
    description: '了解日字的演变过程，从甲骨文到现在的楷书',
    coverUrl: '/character-ri.jpg',
    duration: 6,
    category: '汉字',
    isNew: false,
    isCompleted: true,
    isFavorite: false
  },
  {
    id: 5,
    title: '月字的旅行',
    description: '探索月字的起源和变化',
    coverUrl: '/character-yue.jpg',
    duration: 5,
    category: '汉字',
    isNew: false,
    isCompleted: true,
    isFavorite: true
  },
  {
    id: 6,
    title: '山水之间',
    description: '学习山和水两个汉字的书写和意义',
    coverUrl: '/character-shanshui.jpg',
    duration: 7,
    category: '汉字',
    isNew: true,
    isCompleted: false,
    isFavorite: false
  },
  // 词汇类动画
  {
    id: 7,
    title: '动物朋友们',
    description: '学习各种动物的名称和特点',
    coverUrl: '/vocabulary-animals.jpg',
    duration: 8,
    category: '词汇',
    isNew: false,
    isCompleted: false,
    isFavorite: true
  },
  {
    id: 8,
    title: '颜色王国大冒险',
    description: '认识各种颜色的名称',
    coverUrl: '/vocabulary-colors.jpg',
    duration: 6,
    category: '词汇',
    isNew: false,
    isCompleted: true,
    isFavorite: false
  },
  // 句子类动画
  {
    id: 9,
    title: '我喜欢...',
    description: '学习用简单的句子表达喜好',
    coverUrl: '/sentence-like.jpg',
    duration: 5,
    category: '句子',
    isNew: false,
    isCompleted: true,
    isFavorite: false
  },
  // 故事类动画
  {
    id: 10,
    title: '小兔子找妈妈',
    description: '一个温馨的童话故事，学习亲情和友情',
    coverUrl: '/story-rabbit.jpg',
    duration: 10,
    category: '故事',
    isNew: false,
    isCompleted: false,
    isFavorite: true
  },
  {
    id: 11,
    title: '小猴子摘桃子',
    description: '关于坚持和努力的故事',
    coverUrl: '/story-monkey.jpg',
    duration: 8,
    category: '故事',
    isNew: true,
    isCompleted: false,
    isFavorite: false
  }
])

// 计算属性：过滤后的动画列表
const filteredAnimations = computed(() => {
  let result = animations.value
  
  // 按分类过滤
  if (activeCategory.value !== '全部') {
    result = result.filter(anim => anim.category === activeCategory.value)
  }
  
  // 按搜索词过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(anim => 
      anim.title.toLowerCase().includes(query) || 
      anim.description.toLowerCase().includes(query)
    )
  }
  
  return result
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

const playAnimation = (id) => {
  router.push(`/child/watch/${id}`)
}

// 组件挂载时初始化
onMounted(() => {
  // 这里可以从API获取动画数据
  console.log('加载动画库数据')
})
</script>

<style scoped>
.font-display {
  font-family: 'Comic Sans MS', cursive, sans-serif;
}
</style>