<template>
  <div class="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 child-ui">
    <!-- 顶部导航 -->
    <header class="p-4 bg-white shadow-sm sticky top-0 z-10">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center">
          <button @click="goBack" class="mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-xl font-bold text-green-600 font-display">词汇乐园</h1>
        </div>
        <div class="flex items-center space-x-3">
          <div class="flex items-center bg-green-100 text-green-700 rounded-full px-3 py-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            <span class="text-xs">{{ currentCategory }}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 分类选择 -->
    <div class="container mx-auto px-4 py-4 overflow-x-auto">
      <div class="flex space-x-2 pb-2">
        <button 
          v-for="category in vocabularyCategories" 
          :key="category"
          :class="['px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all', 
                  currentCategory === category ? 'bg-green-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100']"
          @click="currentCategory = category"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="container mx-auto px-4 py-6">
      <!-- 学习模式选择 -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <button 
          @click="learningMode = 'flashcards'"
          :class="['bg-white rounded-xl p-4 shadow-sm border-2 transition-all', 
                  learningMode === 'flashcards' ? 'border-green-500 bg-green-50' : 'border-gray-200']"
        >
          <div class="flex items-center justify-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div class="text-center text-gray-800 font-medium">词汇卡片</div>
        </button>
        <button 
          @click="learningMode = 'game'"
          :class="['bg-white rounded-xl p-4 shadow-sm border-2 transition-all', 
                  learningMode === 'game' ? 'border-green-500 bg-green-50' : 'border-gray-200']"
        >
          <div class="flex items-center justify-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div class="text-center text-gray-800 font-medium">配对游戏</div>
        </button>
      </div>

      <!-- 词汇卡片模式 -->
      <div v-if="learningMode === 'flashcards'" class="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
        <div class="p-6">
          <!-- 卡片 -->
          <div 
            class="relative w-full max-w-md mx-auto h-64 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl shadow-md flex items-center justify-center cursor-pointer transform transition-all hover:scale-[1.02]"
            @click="flipCard"
          >
            <!-- 正面 -->
            <div v-if="!cardFlipped" class="text-center w-full px-6">
              <img :src="currentVocabulary.image" :alt="currentVocabulary.word" class="w-32 h-32 mx-auto mb-4 object-contain" />
              <h3 class="text-3xl font-bold text-gray-800">{{ currentVocabulary.word }}</h3>
            </div>
            <!-- 背面 -->
            <div v-else class="text-center w-full px-6">
              <h3 class="text-2xl font-bold text-green-600 mb-2">{{ currentVocabulary.word }}</h3>
              <p class="text-xl text-gray-600 mb-2">{{ currentVocabulary.pinyin }}</p>
              <p class="text-gray-700">{{ currentVocabulary.meaning }}</p>
              <div class="mt-4">
                <button @click="playSound" class="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>
            <!-- 翻转提示 -->
            <div class="absolute bottom-3 text-xs text-gray-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              点击翻转卡片
            </div>
          </div>

          <!-- 控制按钮 -->
          <div class="flex justify-between mt-8">
            <button 
              @click="previousVocabulary"
              :disabled="currentVocabularyIndex === 0"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一个
            </button>
            <div class="text-gray-600">{{ currentVocabularyIndex + 1 }} / {{ filteredVocabulary.length }}</div>
            <button 
              @click="nextVocabulary"
              :disabled="currentVocabularyIndex === filteredVocabulary.length - 1"
              class="px-4 py-2 bg-green-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一个
            </button>
          </div>
        </div>
      </div>

      <!-- 配对游戏模式 -->
      <div v-else-if="learningMode === 'game'" class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-green-600">配对游戏</h3>
            <div class="flex items-center space-x-3">
              <div class="bg-green-100 text-green-700 rounded-full px-3 py-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-xs">{{ gameTime }}秒</span>
              </div>
              <div class="bg-blue-100 text-blue-700 rounded-full px-3 py-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-xs">{{ matches }}/8</span>
              </div>
            </div>
          </div>

          <!-- 游戏卡片 -->
          <div class="grid grid-cols-3 gap-3">
            <div 
              v-for="(card, index) in gameCards" 
              :key="index"
              :class="['aspect-square rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 shadow-sm transform hover:scale-105', 
                      card.flipped ? 'bg-white border-2 border-green-300' : 
                      card.matched ? 'bg-green-100 border-2 border-green-400' : 
                      'bg-green-200 hover:bg-green-300']"
              :disabled="card.flipped || card.matched"
              @click="flipGameCard(index)"
            >
              <div v-if="card.flipped || card.matched" class="text-center p-2 w-full">
                <img v-if="card.type === 'image'" :src="card.content" :alt="card.alt" class="w-10 h-10 object-contain mx-auto mb-1" />
                <div v-else-if="card.type === 'word'" class="text-sm font-bold text-green-700 leading-tight">{{ card.content }}</div>
                <div v-else-if="card.type === 'pinyin'" class="text-xs text-gray-600 leading-tight">{{ card.content }}</div>
              </div>
              <div v-else class="text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
            </div>
          </div>

          <!-- 游戏完成庆祝界面 -->
          <div v-if="gameCompleted" class="mt-6 text-center bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-6 animate-pulse">
            <div class="flex justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-green-600 mb-2">恭喜你！</h3>
            <p class="text-gray-700 mb-4">你成功完成了配对游戏！</p>
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="bg-white rounded-lg p-3">
                <div class="text-sm text-gray-600">用时</div>
                <div class="text-lg font-bold text-green-600">{{ gameTime }}秒</div>
              </div>
              <div class="bg-white rounded-lg p-3">
                <div class="text-sm text-gray-600">学习词汇</div>
                <div class="text-lg font-bold text-green-600">{{ learnedWords.size }}个</div>
              </div>
            </div>
            <button @click="resetGame" class="bg-green-500 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-green-600 transition-colors">
              再玩一次
            </button>
          </div>

          <!-- 游戏控制 -->
          <div v-else class="mt-6 text-center">
            <button @click="resetGame" class="bg-green-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-green-600 transition-colors">
              重新开始游戏
            </button>
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 状态管理
const currentCategory = ref('动物')
const learningMode = ref('flashcards')
const cardFlipped = ref(false)
const currentVocabularyIndex = ref(0)
const matches = ref(0)
const gameTime = ref(0)
const gameCards = ref([])
const flippedCards = ref([])
const timer = ref(null)
const gameCompleted = ref(false)
const learnedWords = ref(new Set())

// 词汇数据
const vocabularyData = [
  // 动物类
  {
    word: '猫',
    pinyin: 'māo',
    meaning: '一种可爱的宠物',
    image: '/vocabulary/cat.jpg',
    category: '动物'
  },
  {
    word: '狗',
    pinyin: 'gǒu',
    meaning: '人类的好朋友',
    image: '/vocabulary/dog.jpg',
    category: '动物'
  },
  {
    word: '兔子',
    pinyin: 'tù zi',
    meaning: '长耳朵的小动物',
    image: '/vocabulary/rabbit.jpg',
    category: '动物'
  },
  {
    word: '熊猫',
    pinyin: 'xióng māo',
    meaning: '中国特有的黑白相间的熊',
    image: '/vocabulary/panda.jpg',
    category: '动物'
  },
  // 水果类
  {
    word: '苹果',
    pinyin: 'píng guǒ',
    meaning: '红色或绿色的水果',
    image: '/vocabulary/apple.jpg',
    category: '水果'
  },
  {
    word: '香蕉',
    pinyin: 'xiāng jiāo',
    meaning: '黄色弯曲的水果',
    image: '/vocabulary/banana.jpg',
    category: '水果'
  },
  {
    word: '橙子',
    pinyin: 'chéng zi',
    meaning: '橙色的圆形水果',
    image: '/vocabulary/orange.jpg',
    category: '水果'
  },
  {
    word: '草莓',
    pinyin: 'cǎo méi',
    meaning: '红色带籽的小水果',
    image: '/vocabulary/strawberry.jpg',
    category: '水果'
  },
  // 颜色类
  {
    word: '红色',
    pinyin: 'hóng sè',
    meaning: '像火一样的颜色',
    image: '/vocabulary/red.jpg',
    category: '颜色'
  },
  {
    word: '蓝色',
    pinyin: 'lán sè',
    meaning: '像天空一样的颜色',
    image: '/vocabulary/blue.jpg',
    category: '颜色'
  },
  {
    word: '绿色',
    pinyin: 'lǜ sè',
    meaning: '像树叶一样的颜色',
    image: '/vocabulary/green.jpg',
    category: '颜色'
  },
  {
    word: '黄色',
    pinyin: 'huáng sè',
    meaning: '像太阳一样的颜色',
    image: '/vocabulary/yellow.jpg',
    category: '颜色'
  },
  // 数字类
  {
    word: '一',
    pinyin: 'yī',
    meaning: '数字1',
    image: '/vocabulary/one.jpg',
    category: '数字'
  },
  {
    word: '二',
    pinyin: 'èr',
    meaning: '数字2',
    image: '/vocabulary/two.jpg',
    category: '数字'
  },
  {
    word: '三',
    pinyin: 'sān',
    meaning: '数字3',
    image: '/vocabulary/three.jpg',
    category: '数字'
  },
  {
    word: '四',
    pinyin: 'sì',
    meaning: '数字4',
    image: '/vocabulary/four.jpg',
    category: '数字'
  },
  // 家庭类
  {
    word: '爸爸',
    pinyin: 'bà ba',
    meaning: '父亲',
    image: '/vocabulary/father.jpg',
    category: '家庭'
  },
  {
    word: '妈妈',
    pinyin: 'mā ma',
    meaning: '母亲',
    image: '/vocabulary/mother.jpg',
    category: '家庭'
  },
  {
    word: '哥哥',
    pinyin: 'gē ge',
    meaning: '哥哥',
    image: '/vocabulary/brother.jpg',
    category: '家庭'
  },
  {
    word: '姐姐',
    pinyin: 'jiě jie',
    meaning: '姐姐',
    image: '/vocabulary/sister.jpg',
    category: '家庭'
  },
  // 食物类
  {
    word: '米饭',
    pinyin: 'mǐ fàn',
    meaning: '主食',
    image: '/vocabulary/rice.jpg',
    category: '食物'
  },
  {
    word: '面条',
    pinyin: 'miàn tiáo',
    meaning: '面食',
    image: '/vocabulary/noodles.jpg',
    category: '食物'
  },
  {
    word: '牛奶',
    pinyin: 'niú nǎi',
    meaning: '饮品',
    image: '/vocabulary/milk.jpg',
    category: '食物'
  },
  {
    word: '鸡蛋',
    pinyin: 'jī dàn',
    meaning: '蛋类',
    image: '/vocabulary/egg.jpg',
    category: '食物'
  },
  // 交通工具类
  {
    word: '汽车',
    pinyin: 'qì chē',
    meaning: '陆地交通工具',
    image: '/vocabulary/car.jpg',
    category: '交通工具'
  },
  {
    word: '飞机',
    pinyin: 'fēi jī',
    meaning: '空中交通工具',
    image: '/vocabulary/airplane.jpg',
    category: '交通工具'
  },
  {
    word: '火车',
    pinyin: 'huǒ chē',
    meaning: '铁路交通工具',
    image: '/vocabulary/train.jpg',
    category: '交通工具'
  },
  {
    word: '自行车',
    pinyin: 'zì xíng chē',
    meaning: '人力交通工具',
    image: '/vocabulary/bicycle.jpg',
    category: '交通工具'
  },
  // 学校用品类
  {
    word: '书包',
    pinyin: 'shū bāo',
    meaning: '装书的包',
    image: '/vocabulary/backpack.jpg',
    category: '学校用品'
  },
  {
    word: '铅笔',
    pinyin: 'qiān bǐ',
    meaning: '写字工具',
    image: '/vocabulary/pencil.jpg',
    category: '学校用品'
  },
  {
    word: '书本',
    pinyin: 'shū běn',
    meaning: '学习材料',
    image: '/vocabulary/book.jpg',
    category: '学校用品'
  },
  {
    word: '橡皮',
    pinyin: 'xiàng pí',
    meaning: '擦除工具',
    image: '/vocabulary/eraser.jpg',
    category: '学校用品'
  }
]

// 词汇分类
const vocabularyCategories = ['动物', '水果', '颜色', '数字', '家庭', '食物', '交通工具', '学校用品']

// 计算属性
const filteredVocabulary = computed(() => {
  return vocabularyData.filter(item => item.category === currentCategory.value)
})

const currentVocabulary = computed(() => {
  return filteredVocabulary.value[currentVocabularyIndex.value]
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

const flipCard = () => {
  cardFlipped.value = !cardFlipped.value
}

const previousVocabulary = () => {
  if (currentVocabularyIndex.value > 0) {
    currentVocabularyIndex.value--
    cardFlipped.value = false
  }
}

const nextVocabulary = () => {
  if (currentVocabularyIndex.value < filteredVocabulary.value.length - 1) {
    currentVocabularyIndex.value++
    cardFlipped.value = false
  }
}

const playSound = () => {
  // 这里可以添加语音播放逻辑
  console.log(`播放词汇 ${currentVocabulary.value.word} 的发音`)
}

const generateGameCards = () => {
  // 从当前分类中随机选择4个词汇
  const shuffled = [...filteredVocabulary.value].sort(() => 0.5 - Math.random())
  const selected = shuffled.slice(0, 4)
  
  // 为每个词汇创建图片、汉字和拼音卡片
  let cards = []
  selected.forEach(vocab => {
    cards.push({
      id: cards.length,
      type: 'image',
      content: vocab.image,
      alt: vocab.word,
      flipped: false,
      matched: false,
      pairId: vocab.word
    })
    cards.push({
      id: cards.length,
      type: 'word',
      content: vocab.word,
      alt: vocab.word,
      flipped: false,
      matched: false,
      pairId: vocab.word
    })
    cards.push({
      id: cards.length,
      type: 'pinyin',
      content: vocab.pinyin,
      alt: vocab.word,
      flipped: false,
      matched: false,
      pairId: vocab.word
    })
  })
  
  // 洗牌
  gameCards.value = cards.sort(() => 0.5 - Math.random())
}

const flipGameCard = (index) => {
  if (flippedCards.value.length >= 2 || gameCards.value[index].flipped || gameCards.value[index].matched) {
    return
  }
  
  gameCards.value[index].flipped = true
  flippedCards.value.push(index)
  
  if (flippedCards.value.length === 2) {
    // 检查是否匹配
    const card1 = gameCards.value[flippedCards.value[0]]
    const card2 = gameCards.value[flippedCards.value[1]]
    
    if (card1.pairId === card2.pairId && card1.type !== card2.type) {
      // 匹配成功
      card1.matched = true
      card2.matched = true
      matches.value++
      
      // 添加到已学习词汇
      if (card1.type === 'word') {
        learnedWords.value.add(card1.pairId)
      }
      
      flippedCards.value = []
      
      // 检查游戏是否完成
      if (matches.value === 4) {
        gameCompleted.value = true
        stopTimer()
      }
    } else {
      // 匹配失败，稍后翻回去
      setTimeout(() => {
        card1.flipped = false
        card2.flipped = false
        flippedCards.value = []
      }, 1000)
    }
  }
}

const resetGame = () => {
  generateGameCards()
  matches.value = 0
  gameTime.value = 0
  flippedCards.value = []
  gameCompleted.value = false
  startTimer()
}

const startTimer = () => {
  if (timer.value) {
    clearInterval(timer.value)
  }
  
  timer.value = setInterval(() => {
    gameTime.value++
  }, 1000)
}

const stopTimer = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

// 监听分类变化
const unwatch = watch(() => currentCategory.value, () => {
  currentVocabularyIndex.value = 0
  cardFlipped.value = false
  if (learningMode.value === 'game') {
    resetGame()
  }
})

// 生命周期
onMounted(() => {
  generateGameCards()
  startTimer()
})

onUnmounted(() => {
  stopTimer()
  unwatch()
})
</script>

<style scoped>
.font-display {
  font-family: 'Comic Sans MS', cursive, sans-serif;
}
</style>