<template>
  <div class="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50 child-ui">
    <!-- 顶部导航 -->
    <header class="p-4 bg-white shadow-sm sticky top-0 z-10">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center">
          <button @click="goBack" class="mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-xl font-bold text-orange-500 font-display">拼音剧场</h1>
        </div>
        <div class="flex items-center space-x-3">
          <div class="flex items-center bg-orange-100 text-orange-700 rounded-full px-3 py-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-xs">{{ currentPinyin }}</span>
          </div>
          <div class="flex items-center bg-green-100 text-green-700 rounded-full px-3 py-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span class="text-xs">{{ practiceCount }}/10</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 主舞台区域 -->
    <div class="container mx-auto px-4 py-6">
      <!-- 剧场舞台 -->
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
        <div class="relative h-64 sm:h-80 bg-gradient-to-r from-blue-400 to-purple-500">
          <!-- 角色和场景 -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center">
              <!-- 拼音字母 -->
              <div class="bg-white/90 text-6xl font-bold mb-4 inline-block rounded-xl px-6 py-2 shadow-lg">
                {{ currentPinyin }}
              </div>
              <!-- 拼音动画角色 -->
              <div class="relative w-40 h-40 mx-auto">
                <div class="w-full h-full bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white animate-bounce">
                  <span class="text-6xl font-bold">{{ currentPinyin }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 云朵装饰 -->
          <div class="absolute top-4 left-4 animate-float-slow">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white/30" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM12 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
            </svg>
          </div>
          <div class="absolute bottom-4 right-4 animate-float">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 text-white/30" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM12 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
            </svg>
          </div>
        </div>
        
        <!-- 角色对话 -->
        <div class="p-6 bg-orange-50">
          <div class="bg-white rounded-xl p-4 shadow-sm">
            <div class="flex items-start">
              <div class="flex-shrink-0 mr-3">
                <div class="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-red-400 flex items-center justify-center text-white">
                  <span class="text-xs font-bold">{{ currentPinyin }}</span>
                </div>
              </div>
              <div>
                <h4 class="font-semibold text-orange-600 text-sm">{{ currentCharacter.name }}</h4>
                <p class="text-gray-700 mt-1">{{ currentCharacterDialogue }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 互动练习区域 -->
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-orange-600 mb-4">跟我一起练习</h3>
          
          <!-- 练习选项 -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <button 
              v-for="option in practiceOptions" 
              :key="option.text"
              :class="['p-4 rounded-xl border-2 text-center transition-all duration-300', 
                      isSelectedOption(option.text) ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300']"
              @click="selectOption(option.text)"
            >
              <div class="text-3xl font-bold text-gray-800 mb-2">{{ option.text }}</div>
              <div class="text-gray-600 text-sm">{{ option.example }}</div>
            </button>
          </div>

          <!-- 语音播放控制 -->
          <div class="flex items-center justify-center mb-6">
            <button @click="playPronunciation" class="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow transform hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>

          <!-- 正确答案提示 -->
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

          <!-- 下一步按钮 -->
          <button 
            v-if="showNextButton" 
            @click="nextPinyin"
            class="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold shadow hover:shadow-md transition-shadow"
          >
            下一步
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 状态管理
const currentIndex = ref(0)
const selectedOption = ref('')
const showFeedback = ref(false)
const isCorrect = ref(false)
const feedbackMessage = ref('')
const practiceCount = ref(0)

// 拼音数据
const pinyinData = [
  {
    pinyin: 'b',
    character: {
      name: '波波兔'
    },
    dialogue: '大家好！我是波波兔！我会发出\"b\"的声音，就像拨浪鼓发出的声音：bō bō bō！',
    options: [
      { text: 'b', example: '拨浪鼓 bō làng gǔ' },
      { text: 'p', example: '拍皮球 pāi pí qiú' },
      { text: 'm', example: '妈妈 mā ma' },
      { text: 'f', example: '飞机 fēi jī' }
    ]
  },
  {
    pinyin: 'p',
    character: {
      name: '拍拍虎'
    },
    dialogue: '我是拍拍虎！我喜欢拍皮球，发出\"p\"的声音：pāi pāi pāi！',
    options: [
      { text: 'b', example: '拨浪鼓 bō làng gǔ' },
      { text: 'p', example: '拍皮球 pāi pí qiú' },
      { text: 'm', example: '妈妈 mā ma' },
      { text: 'f', example: '飞机 fēi jī' }
    ]
  },
  {
    pinyin: 'm',
    character: {
      name: '咪咪猫'
    },
    dialogue: '我是咪咪猫！喵喵叫：mī mī mī！就像喊妈妈：mā ma！',
    options: [
      { text: 'b', example: '拨浪鼓 bō làng gǔ' },
      { text: 'p', example: '拍皮球 pāi pí qiú' },
      { text: 'm', example: '妈妈 mā ma' },
      { text: 'f', example: '飞机 fēi jī' }
    ]
  },
  {
    pinyin: 'f',
    character: {
      name: '飞飞鸽'
    },
    dialogue: '我是飞飞鸽！扇动翅膀：fēi fēi fēi！就像风扇转动：fēng shàn！',
    options: [
      { text: 'b', example: '拨浪鼓 bō làng gǔ' },
      { text: 'p', example: '拍皮球 pāi pí qiú' },
      { text: 'm', example: '妈妈 mā ma' },
      { text: 'f', example: '飞机 fēi jī' }
    ]
  },
  {
    pinyin: 'a',
    character: {
      name: '阿阿熊'
    },
    dialogue: '我是阿阿熊！张大嘴巴：ā á ǎ à！就像在说：啊！好漂亮！',
    options: [
      { text: 'a', example: '啊 à ！' },
      { text: 'o', example: '哦 ō ！' },
      { text: 'e', example: '鹅 é ！' },
      { text: 'i', example: '衣 yī ！' }
    ]
  }
]

// 计算属性
const currentPinyin = computed(() => pinyinData[currentIndex.value].pinyin)
const currentCharacter = computed(() => pinyinData[currentIndex.value].character)
const currentCharacterDialogue = computed(() => pinyinData[currentIndex.value].dialogue)
const practiceOptions = computed(() => pinyinData[currentIndex.value].options)
// 移除对不存在的image属性的引用
const showNextButton = computed(() => showFeedback.value)

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

const selectOption = (option) => {
  if (showFeedback.value) return
  
  selectedOption.value = option
  showFeedback.value = true
  isCorrect.value = option === currentPinyin.value
  
  if (isCorrect.value) {
    feedbackMessage.value = '太棒了！回答正确！'
    practiceCount.value++
  } else {
    feedbackMessage.value = '答错了，再试试吧！'
  }
}

const isSelectedOption = (option) => {
  return selectedOption.value === option
}

const playPronunciation = () => {
  // 这里可以添加语音播放逻辑
  console.log(`播放拼音 ${currentPinyin.value} 的发音`)
}

const nextPinyin = () => {
  if (currentIndex.value < pinyinData.length - 1) {
    currentIndex.value++
    resetState()
  } else {
    // 练习完成，返回首页或显示完成页面
    router.push('/child')
  }
}

const resetState = () => {
  selectedOption.value = ''
  showFeedback.value = false
  isCorrect.value = false
  feedbackMessage.value = ''
}
</script>

<style scoped>
.font-display {
  font-family: 'Comic Sans MS', cursive, sans-serif;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

@keyframes float-slow {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.animate-float-slow {
  animation: float-slow 6s ease-in-out infinite;
}

.animate-bounce {
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-20px); }
  60% { transform: translateY(-10px); }
}
</style>