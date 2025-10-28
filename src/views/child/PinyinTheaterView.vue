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

    <!-- 进度指示器 -->
    <div class="container mx-auto px-4 py-2">
      <div class="bg-white rounded-full shadow-sm p-1">
        <div class="flex items-center justify-between px-4">
          <span class="text-sm text-gray-600">进度</span>
          <div class="flex-1 mx-4">
            <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-500" 
                   :style="{ width: `${(currentIndex / (pinyinData.length - 1)) * 100}%` }"></div>
            </div>
          </div>
          <span class="text-sm font-medium text-orange-600">{{ currentIndex + 1 }}/{{ pinyinData.length }}</span>
        </div>
      </div>
    </div>

    <!-- 主舞台区域 -->
    <div class="container mx-auto px-4 py-6">
      <!-- 剧场舞台 -->
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
        <div class="relative h-64 sm:h-80 bg-gradient-to-r" :class="currentCharacter.color">
          <!-- 角色和场景 -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center">
              <!-- 拼音字母 -->
              <div class="bg-white/90 text-6xl font-bold mb-4 inline-block rounded-xl px-6 py-2 shadow-lg">
                {{ currentPinyin }}
              </div>
              <!-- 拼音动画角色 -->
              <div class="relative w-40 h-40 mx-auto">
                <div class="w-full h-full bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white" 
                     :class="getCharacterAnimation(currentPinyin)">
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
              :class="['p-4 rounded-xl border-2 text-center transition-all duration-300 option-button', 
                      isSelectedOption(option.text) ? 
                        (isCorrect ? 'border-green-500 bg-green-50 shadow-lg' : 'border-red-500 bg-red-50 shadow-lg') : 
                        'border-gray-200 hover:border-orange-300 hover:shadow-md']"
              @click="selectOption(option.text)"
              :disabled="showFeedback"
            >
              <div class="text-3xl font-bold text-gray-800 mb-2">{{ option.text }}</div>
              <div class="text-gray-600 text-sm">{{ option.example }}</div>
            </button>
          </div>

          <!-- 语音播放控制 -->
          <div class="flex items-center justify-center mb-6">
            <button @click="playPronunciation" class="voice-button bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95">
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

          <!-- 下一步按钮（只在答错时显示） -->
          <button 
            v-if="showFeedback && !isCorrect" 
            @click="nextPinyin"
            class="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold shadow hover:shadow-md transition-shadow"
          >
            继续学习
          </button>
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
          <p class="text-gray-600">你完成了拼音剧场的学习！</p>
        </div>
        
        <div class="bg-gray-50 rounded-xl p-4 mb-6">
          <div class="grid grid-cols-2 gap-4 text-center">
            <div>
              <div class="text-2xl font-bold text-green-600">{{ correctAnswers }}</div>
              <div class="text-sm text-gray-500">答对题目</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-blue-600">{{ totalQuestions }}</div>
              <div class="text-sm text-gray-500">总题目数</div>
            </div>
          </div>
          <div class="mt-4">
            <div class="text-sm text-gray-500 mb-1">正确率</div>
            <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500" 
                   :style="{ width: `${(correctAnswers / totalQuestions) * 100}%` }"></div>
            </div>
            <div class="text-sm font-medium text-gray-700 mt-1">
              {{ Math.round((correctAnswers / totalQuestions) * 100) }}%
            </div>
          </div>
        </div>
        
        <div class="flex space-x-3">
          <button @click="restartPractice" class="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold shadow hover:shadow-md transition-shadow">
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
const showCompletion = ref(false)
const correctAnswers = ref(0)
const totalQuestions = ref(0)

// 拼音数据
const pinyinData = [
  // 声母
  {
    pinyin: 'b',
    character: {
      name: '波波兔',
      color: 'from-blue-400 to-purple-500'
    },
    dialogue: '大家好！我是波波兔！我会发出"b"的声音，就像拨浪鼓发出的声音：bō bō bō！',
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
      name: '拍拍虎',
      color: 'from-red-400 to-orange-500'
    },
    dialogue: '我是拍拍虎！我喜欢拍皮球，发出"p"的声音：pāi pāi pāi！',
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
      name: '咪咪猫',
      color: 'from-pink-400 to-purple-500'
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
      name: '飞飞鸽',
      color: 'from-green-400 to-blue-500'
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
    pinyin: 'd',
    character: {
      name: '咚咚象',
      color: 'from-gray-400 to-blue-500'
    },
    dialogue: '我是咚咚象！走路咚咚响：dōng dōng dōng！就像打鼓的声音！',
    options: [
      { text: 'd', example: '大象 dà xiàng' },
      { text: 't', example: '兔子 tù zi' },
      { text: 'n', example: '奶奶 nǎi nai' },
      { text: 'l', example: '老虎 lǎo hǔ' }
    ]
  },
  {
    pinyin: 't',
    character: {
      name: '跳跳蛙',
      color: 'from-green-400 to-yellow-500'
    },
    dialogue: '我是跳跳蛙！蹦蹦跳跳：tiào tiào tiào！就像踢毽子！',
    options: [
      { text: 'd', example: '大象 dà xiàng' },
      { text: 't', example: '兔子 tù zi' },
      { text: 'n', example: '奶奶 nǎi nai' },
      { text: 'l', example: '老虎 lǎo hǔ' }
    ]
  },
  {
    pinyin: 'n',
    character: {
      name: '奶奶羊',
      color: 'from-white to-gray-300'
    },
    dialogue: '我是奶奶羊！咩咩叫：niē niē niē！就像叫奶奶！',
    options: [
      { text: 'd', example: '大象 dà xiàng' },
      { text: 't', example: '兔子 tù zi' },
      { text: 'n', example: '奶奶 nǎi nai' },
      { text: 'l', example: '老虎 lǎo hǔ' }
    ]
  },
  {
    pinyin: 'l',
    character: {
      name: '乐乐猴',
      color: 'from-orange-400 to-red-500'
    },
    dialogue: '我是乐乐猴！快乐玩耍：lè lè lè！就像拉小提琴！',
    options: [
      { text: 'd', example: '大象 dà xiàng' },
      { text: 't', example: '兔子 tù zi' },
      { text: 'n', example: '奶奶 nǎi nai' },
      { text: 'l', example: '老虎 lǎo hǔ' }
    ]
  },
  // 韵母
  {
    pinyin: 'a',
    character: {
      name: '阿阿熊',
      color: 'from-brown-400 to-orange-500'
    },
    dialogue: '我是阿阿熊！张大嘴巴：ā á ǎ à！就像在说：啊！好漂亮！',
    options: [
      { text: 'a', example: '啊 à ！' },
      { text: 'o', example: '哦 ō ！' },
      { text: 'e', example: '鹅 é ！' },
      { text: 'i', example: '衣 yī ！' }
    ]
  },
  {
    pinyin: 'o',
    character: {
      name: '喔喔鸡',
      color: 'from-yellow-400 to-red-500'
    },
    dialogue: '我是喔喔鸡！喔喔叫：ō ó ǒ ò！就像公鸡打鸣！',
    options: [
      { text: 'a', example: '啊 à ！' },
      { text: 'o', example: '哦 ō ！' },
      { text: 'e', example: '鹅 é ！' },
      { text: 'i', example: '衣 yī ！' }
    ]
  },
  {
    pinyin: 'e',
    character: {
      name: '鹅鹅鹅',
      color: 'from-white to-gray-400'
    },
    dialogue: '我是鹅鹅鹅！曲项向天歌：é é é！就像大白鹅！',
    options: [
      { text: 'a', example: '啊 à ！' },
      { text: 'o', example: '哦 ō ！' },
      { text: 'e', example: '鹅 é ！' },
      { text: 'i', example: '衣 yī ！' }
    ]
  },
  {
    pinyin: 'i',
    character: {
      name: '衣衣鹿',
      color: 'from-purple-400 to-pink-500'
    },
    dialogue: '我是衣衣鹿！穿新衣服：yī yī yī！就像美丽的衣裳！',
    options: [
      { text: 'a', example: '啊 à ！' },
      { text: 'o', example: '哦 ō ！' },
      { text: 'e', example: '鹅 é ！' },
      { text: 'i', example: '衣 yī ！' }
    ]
  },
  {
    pinyin: 'u',
    character: {
      name: '乌乌龟',
      color: 'from-green-500 to-blue-600'
    },
    dialogue: '我是乌乌龟！慢慢爬行：wū wū wū！就像乌龟走路！',
    options: [
      { text: 'u', example: '乌龟 wū guī' },
      { text: 'ü', example: '雨伞 yǔ sǎn' },
      { text: 'ai', example: '爱心 ài xīn' },
      { text: 'ei', example: '飞机 fēi jī' }
    ]
  },
  {
    pinyin: 'ü',
    character: {
      name: '雨雨鱼',
      color: 'from-blue-300 to-purple-400'
    },
    dialogue: '我是雨雨鱼！游来游去：yǔ yǔ yǔ！就像下雨天！',
    options: [
      { text: 'u', example: '乌龟 wū guī' },
      { text: 'ü', example: '雨伞 yǔ sǎn' },
      { text: 'ai', example: '爱心 ài xīn' },
      { text: 'ei', example: '飞机 fēi jī' }
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
    correctAnswers.value++
    
    // 答对后延迟1.5秒自动下一题
    setTimeout(() => {
      nextPinyin()
    }, 1500)
  } else {
    feedbackMessage.value = `答错了，正确答案是：${currentPinyin.value}`
  }
  
  totalQuestions.value++
}

const isSelectedOption = (option) => {
  return selectedOption.value === option
}

const playPronunciation = () => {
  // 简单的语音播放逻辑（使用Web Speech API）
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(currentPinyin.value)
    utterance.lang = 'zh-CN'
    utterance.rate = 0.8
    utterance.pitch = 1.2
    
    // 添加语音播放动画效果
    const voiceButton = document.querySelector('.voice-button')
    if (voiceButton) {
      voiceButton.classList.add('animate-pulse')
      setTimeout(() => {
        voiceButton.classList.remove('animate-pulse')
      }, 1000)
    }
    
    speechSynthesis.speak(utterance)
  } else {
    // 如果不支持语音合成，显示提示
    alert(`请跟我读：${currentPinyin.value}`)
  }
}

const nextPinyin = () => {
  if (currentIndex.value < pinyinData.length - 1) {
    currentIndex.value++
    resetState()
  } else {
    // 练习完成，显示完成页面
    showCompletion.value = true
  }
}

const restartPractice = () => {
  currentIndex.value = 0
  practiceCount.value = 0
  correctAnswers.value = 0
  totalQuestions.value = 0
  showCompletion.value = false
  resetState()
}

const getCharacterAnimation = (pinyin) => {
  const animations = {
    'b': 'animate-bounce',
    'p': 'animate-pulse',
    'm': 'animate-wiggle',
    'f': 'animate-float',
    'd': 'animate-bounce',
    't': 'animate-pulse',
    'n': 'animate-wiggle',
    'l': 'animate-float',
    'a': 'animate-bounce',
    'o': 'animate-pulse',
    'e': 'animate-wiggle',
    'i': 'animate-float',
    'u': 'animate-bounce',
    'ü': 'animate-pulse'
  }
  return animations[pinyin] || 'animate-bounce'
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

@keyframes wiggle {
  0%, 7% { transform: rotateZ(0); }
  15% { transform: rotateZ(-15deg); }
  20% { transform: rotateZ(10deg); }
  25% { transform: rotateZ(-10deg); }
  30% { transform: rotateZ(6deg); }
  35% { transform: rotateZ(-4deg); }
  40%, 100% { transform: rotateZ(0); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-20px); }
  60% { transform: translateY(-10px); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}

.animate-wiggle {
  animation: wiggle 3s ease-in-out infinite;
}

.animate-spin {
  animation: spin 4s linear infinite;
}

/* 选项按钮的悬停效果 */
.option-button {
  transition: all 0.3s ease;
}

.option-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* 语音按钮的点击效果 */
.voice-button:active {
  transform: scale(0.95);
}

/* 完成页面的入场动画 */
.completion-enter-active {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 响应式设计优化 */
@media (max-width: 640px) {
  .child-ui .text-6xl {
    font-size: 3rem;
  }
  
  .child-ui .w-40 {
    width: 8rem;
    height: 8rem;
  }
  
  .child-ui .grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
</style>