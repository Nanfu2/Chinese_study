<template>
  <div class="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 child-ui">
    <!-- 顶部导航 -->
    <header class="p-4 bg-white shadow-sm sticky top-0 z-10">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center">
          <button @click="goBack" class="mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-xl font-bold text-purple-600 font-display">短句练习</h1>
        </div>
        <div class="flex items-center space-x-3">
          <div class="flex items-center bg-purple-100 text-purple-700 rounded-full px-3 py-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="text-xs">{{ practiceProgress }}%</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 主内容区域 -->
    <div class="container mx-auto px-4 py-6">
      <!-- 练习模式选择 -->
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-purple-600 mb-4">选择练习模式</h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button 
              @click="selectMode('listen')"
              :class="['p-4 rounded-xl text-center transition-all duration-300 border-2', 
                      currentMode === 'listen' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300']"
            >
              <div class="flex justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="text-gray-800 font-medium">听一听</div>
              <div class="text-xs text-gray-500 mt-1">听句子选图片</div>
            </button>
            <button 
              @click="selectMode('read')"
              :class="['p-4 rounded-xl text-center transition-all duration-300 border-2', 
                      currentMode === 'read' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300']"
            >
              <div class="flex justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div class="text-gray-800 font-medium">读一读</div>
              <div class="text-xs text-gray-500 mt-1">看图片选句子</div>
            </button>
            <button 
              @click="selectMode('fill')"
              :class="['p-4 rounded-xl text-center transition-all duration-300 border-2', 
                      currentMode === 'fill' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300']"
            >
              <div class="flex justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div class="text-gray-800 font-medium">填一填</div>
              <div class="text-xs text-gray-500 mt-1">补充缺失词语</div>
            </button>
          </div>
        </div>
      </div>

      <!-- 练习内容区域 -->
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="p-6">
          <!-- 听一听模式 -->
          <div v-if="currentMode === 'listen'">
            <h4 class="text-lg font-semibold text-purple-600 mb-4">听句子，选择正确的图片</h4>
            
            <!-- 播放按钮 -->
            <div class="flex justify-center mb-6">
              <button @click="playSentenceAudio" class="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow transform hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>

            <!-- 句子显示 -->
            <div v-if="showHint" class="bg-purple-50 rounded-xl p-4 mb-6 text-center">
              <p class="text-purple-700">{{ currentSentence.sentence }}</p>
            </div>
            
            <!-- 提示按钮 -->
            <div v-if="!showHint" class="text-center mb-6">
              <button @click="showHint = true" class="text-sm text-purple-600 bg-purple-50 px-4 py-1 rounded-full">
                显示句子提示
              </button>
            </div>
            
            <!-- 图片选项 -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div 
                v-for="(option, index) in currentOptions" 
                :key="index"
                :class="['border-2 rounded-xl overflow-hidden cursor-pointer transition-all duration-300', 
                        selectedOption === index ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200 hover:border-purple-300']"
                @click="selectOption(index)"
              >
                <div class="w-full h-40 bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
                <div class="p-3 text-center text-gray-700 font-medium">{{ option.text }}</div>
              </div>
            </div>
          </div>

          <!-- 读一读模式 -->
          <div v-else-if="currentMode === 'read'">
            <h4 class="text-lg font-semibold text-purple-600 mb-4">看图片，选择正确的句子</h4>
            
            <!-- 图片显示 -->
            <div class="flex justify-center mb-6">
              <div class="rounded-xl overflow-hidden border-2 border-purple-100 shadow-sm">
                <div class="w-full max-w-md h-64 bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <!-- 句子选项 -->
            <div class="space-y-3 mb-6">
              <div 
                v-for="(option, index) in currentOptions" 
                :key="index"
                :class="['border-2 rounded-xl p-4 cursor-pointer transition-all duration-300', 
                        selectedOption === index ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300']"
                @click="selectOption(index)"
              >
                <p class="text-gray-700">{{ option.text }}</p>
              </div>
            </div>
          </div>

          <!-- 填一填模式 -->
          <div v-else-if="currentMode === 'fill'">
            <h4 class="text-lg font-semibold text-purple-600 mb-4">补充句子中缺失的词语</h4>
            
            <!-- 句子填空 -->
            <div class="bg-purple-50 rounded-xl p-6 mb-6">
              <div class="flex flex-wrap items-center gap-2 text-lg">
                <span 
                  v-for="(part, index) in sentenceParts" 
                  :key="index"
                  :class="['px-2 py-1', part.isBlank ? 'bg-white border-2 border-purple-300 rounded-lg min-w-16 text-center' : 'text-gray-700']"
                >
                  {{ part.isBlank ? (filledAnswer || '____') : part.text }}
                </span>
              </div>
            </div>
            
            <!-- 选项按钮 -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <button 
                v-for="(option, index) in currentOptions" 
                :key="index"
                :class="['bg-white border-2 rounded-lg py-2 text-center transition-all duration-300', 
                        filledAnswer === option.text ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300']"
                @click="filledAnswer = option.text"
              >
                {{ option.text }}
              </button>
            </div>
          </div>

          <!-- 反馈信息 -->
          <div v-if="showFeedback" class="p-4 rounded-xl mb-4" :class="isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
            <div class="flex items-center">
              <svg v-if="isCorrect" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>{{ feedbackMessage }}</span>
            </div>
          </div>

          <!-- 控制按钮 -->
          <div class="flex justify-between">
            <button 
              v-if="currentIndex > 0"
              @click="previousExercise"
              class="px-6 py-2 bg-gray-200 text-gray-700 rounded-full"
            >
              上一题
            </button>
            <div class="text-gray-600" v-if="currentIndex >= 0 && totalExercises > 0">
              {{ currentIndex + 1 }} / {{ totalExercises }}
            </div>
            <button 
              v-if="selectedOption !== null || filledAnswer" 
              @click="checkAnswer"
              :disabled="showFeedback"
              class="px-6 py-2 bg-purple-500 text-white rounded-full disabled:opacity-50"
            >
              {{ showFeedback ? '下一题' : '检查答案' }}
            </button>
            <button 
              v-else 
              class="px-6 py-2 bg-purple-300 text-white rounded-full cursor-not-allowed"
              disabled
            >
              请选择答案
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
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 状态管理
const currentMode = ref('listen')
const currentIndex = ref(0)
const selectedOption = ref(null)
const filledAnswer = ref('')
const showFeedback = ref(false)
const isCorrect = ref(false)
const feedbackMessage = ref('')
const showHint = ref(false)
const completedExercises = ref(0)

// 句子数据
const sentencesData = [
  // 听一听模式数据
  {
    sentence: '小猫在沙发上睡觉。',
    pinyin: 'xiǎo māo zài shā fā shàng shuì jiào。',
    image: '',
    correctOption: 0,
    options: [
      { image: '', text: '小猫在沙发上睡觉' },
      { image: '', text: '小狗在草地上跑步' },
      { image: '', text: '小鸟在树上唱歌' },
      { image: '', text: '小鱼在水里游泳' }
    ],
    blankIndex: 1,
    blankOptions: ['小猫', '小狗', '小鸟', '小鱼']
  },
  {
    sentence: '我喜欢吃苹果。',
    pinyin: 'wǒ xǐ huān chī píng guǒ。',
    image: '',
    correctOption: 1,
    options: [
      { image: '', text: '我喜欢吃香蕉' },
      { image: '', text: '我喜欢吃苹果' },
      { image: '', text: '我喜欢吃橙子' },
      { image: '', text: '我喜欢吃葡萄' }
    ],
    blankIndex: 4,
    blankOptions: ['香蕉', '苹果', '橙子', '葡萄']
  },
  {
    sentence: '天空是蓝色的。',
    pinyin: 'tiān kōng shì lán sè de。',
    image: '',
    correctOption: 0,
    options: [
      { image: '', text: '天空是蓝色的' },
      { image: '', text: '树叶是绿色的' },
      { image: '', text: '花朵是红色的' },
      { image: '', text: '香蕉是黄色的' }
    ],
    blankIndex: 3,
    blankOptions: ['红色', '蓝色', '绿色', '黄色']
  }
]

// 计算属性
const currentSentence = computed(() => {
  return sentencesData[currentIndex.value]
})

const currentOptions = computed(() => {
  if (currentMode.value === 'fill') {
    return currentSentence.value.blankOptions.map(text => ({ text }))
  }
  return currentSentence.value.options
})

const sentenceParts = computed(() => {
  const parts = currentSentence.value.sentence.split(' ')
  return parts.map((text, index) => ({
    text,
    isBlank: index === currentSentence.value.blankIndex
  }))
})

const totalExercises = computed(() => sentencesData.length)

const practiceProgress = computed(() => {
  if (totalExercises.value === 0) return 0
  return Math.round((completedExercises.value / totalExercises.value) * 100)
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

const selectMode = (mode) => {
  currentMode.value = mode
  resetExerciseState()
  currentIndex.value = 0
  completedExercises.value = 0
}

const resetExerciseState = () => {
  selectedOption.value = null
  filledAnswer.value = ''
  showFeedback.value = false
  isCorrect.value = false
  feedbackMessage.value = ''
  showHint.value = false
}

const selectOption = (index) => {
  if (showFeedback.value) return
  selectedOption.value = index
}

const playSentenceAudio = () => {
  // 这里可以添加语音播放逻辑
  console.log(`播放句子: ${currentSentence.value.sentence}`)
}

const checkAnswer = () => {
  if (showFeedback.value) {
    // 如果已经显示反馈，进入下一题
    nextExercise()
    return
  }

  let correct = false
  
  if (currentMode.value === 'fill') {
    correct = filledAnswer.value === currentSentence.value.blankOptions[0]
  } else {
    correct = selectedOption.value === currentSentence.value.correctOption
  }
  
  isCorrect.value = correct
  showFeedback.value = true
  
  if (correct) {
    feedbackMessage.value = '太棒了！回答正确！'
    if (!completedExercises.value.includes(currentIndex.value)) {
      completedExercises.value.push(currentIndex.value)
    }
  } else {
    feedbackMessage.value = '答错了，再想想吧！'
  }
}

const nextExercise = () => {
  if (currentIndex.value < sentencesData.length - 1) {
    currentIndex.value++
    resetExerciseState()
  } else {
    // 练习完成，可以显示完成页面
    console.log('练习完成！')
    // 这里可以跳转到完成页面
  }
}

const previousExercise = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    resetExerciseState()
  }
}

// 监听模式变化
watch(() => currentMode.value, () => {
  resetExerciseState()
})
</script>

<style scoped>
.font-display {
  font-family: 'Comic Sans MS', cursive, sans-serif;
}
</style>