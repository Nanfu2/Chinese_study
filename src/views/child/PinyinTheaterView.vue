<template>
  <div class="child-ui min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
    <!-- 顶部导航 -->
    <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div class="container mx-auto p-4 flex justify-between items-center">
        <button @click="goBack" class="text-indigo-600 hover:text-indigo-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 class="text-xl font-bold text-indigo-600">拼音剧场</h1>
        <button @click="goToHome" class="text-indigo-600 hover:text-indigo-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </header>

    <main class="container mx-auto p-4 py-8">
      <!-- 进度指示器 -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-indigo-600">进度</span>
          <span class="text-sm font-medium text-indigo-600">{{ currentIndex + 1 }}/{{ pinyinData.length }}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            class="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full transition-all duration-500 ease-out"
            :style="{ width: `${(currentIndex + 1) / pinyinData.length * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p class="text-lg text-indigo-600 font-medium">正在加载拼音剧场...</p>
      </div>

      <!-- 主要内容区域 -->
      <div v-else-if="pinyinData.length > 0" class="space-y-8">
        <!-- 拼音角色和对话区域 -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="p-6">
            <!-- 角色场景 -->
            <div class="flex flex-col items-center mb-6">
              <div 
                class="w-40 h-40 rounded-full bg-gradient-to-br mb-4 flex items-center justify-center"
                :class="currentCharacter?.color || 'from-orange-400 to-red-500'"
                :style="getCharacterAnimation(currentPinyin)"
              >
                <span class="text-5xl font-bold text-white">{{ currentPinyin }}</span>
              </div>
              <h2 class="text-2xl font-bold text-gray-800">{{ currentCharacter?.name || '拼音精灵' }}</h2>
            </div>

            <!-- 角色对话 -->
            <div class="bg-indigo-50 rounded-xl p-4 mb-6">
              <p class="text-gray-700 text-lg leading-relaxed">{{ currentDialogue }}</p>
            </div>
          </div>
        </div>

        <!-- 互动练习区域 -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4">考考你！</h3>
            
            <!-- 示例词展示 -->
            <div class="examples-section mb-6">
              <div class="flex flex-wrap gap-2 mb-4">
                <span 
                  v-for="example in currentExamples" 
                  :key="example"
                  class="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                >
                  {{ example }}
                </span>
              </div>
            </div>

            <!-- 练习选项 -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <button
                v-for="option in currentOptions"
                :key="option.text"
                @click="selectOption(option.text)"
                class="option-button p-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:pointer-events-none"
                :disabled="showFeedback"
                :class="{
                  'bg-gradient-to-r from-green-500 to-teal-600': showFeedback && option.text === selectedOption && isCorrect,
                  'bg-gradient-to-r from-red-500 to-pink-600': showFeedback && option.text === selectedOption && !isCorrect,
                  'scale-105 transition-transform duration-300': showFeedback && option.text === selectedOption
                }"
              >
                <div class="text-center">
                  <div class="text-3xl font-bold">{{ option.text }}</div>
                  <div class="text-sm opacity-90">{{ option.example }}</div>
                </div>
              </button>
            </div>

            <!-- 语音播放控制 -->
            <div class="flex justify-center mb-4">
              <button
                @click="playPronunciation"
                class="voice-button w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>

            <!-- 反馈提示 -->
            <div v-if="showFeedback" class="text-center mb-4">
              <p 
                class="text-lg font-bold"
                :class="isCorrect ? 'text-green-600' : 'text-red-600'"
              >
                {{ feedbackMessage }}
              </p>
              <button 
                @click="nextPinyin" 
                class="mt-4 px-6 py-3 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition-colors"
              >
                下一个
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 完成页面 -->
      <div v-else-if="showCompletion" class="flex flex-col items-center justify-center py-12">
        <div class="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-teal-600 flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-800 mb-2">恭喜完成！</h2>
        <p class="text-xl text-gray-600 mb-8">你答对了 {{ correctAnswers }} / {{ totalQuestions }} 道题</p>
        <div class="flex space-x-4">
          <button @click="restart" class="px-6 py-3 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition-colors">
            再玩一次
          </button>
          <button @click="goToHome" class="px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-full hover:bg-gray-300 transition-colors">
            返回主页
          </button>
        </div>
      </div>

      <!-- 错误状态 -->
      <div v-else class="flex flex-col items-center justify-center py-20">
        <div class="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p class="text-lg text-gray-700 font-medium mb-4">无法加载拼音数据</p>
        <p class="text-gray-500 mb-6">请检查网络连接后重试</p>
        <button @click="loadPinyinData" class="px-6 py-3 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition-colors">
          重新加载
        </button>
      </div>
    </main>

    <!-- 底部导航 -->
    <footer class="bg-white/80 backdrop-blur-md shadow-inner py-4">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center">
          <button @click="goBack" class="text-gray-600 hover:text-indigo-600 transition-colors">
            <span class="text-sm">上一页</span>
          </button>
          <button @click="goToHome" class="text-gray-600 hover:text-indigo-600 transition-colors">
            <span class="text-sm">主页</span>
          </button>
          <button @click="nextPinyin" class="text-gray-600 hover:text-indigo-600 transition-colors">
            <span class="text-sm">下一页</span>
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// 导入contentService以从数据库获取拼音数据
import { contentService } from '../../services/contentService.js'

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
const loading = ref(true)

// 拼音数据 - 将从数据库加载
const pinyinData = ref([])

// 角色和对话数据映射
const characterDataMap = {
  'a': { name: '阿阿熊', color: 'from-orange-400 to-red-500' },
  'o': { name: '喔喔鸡', color: 'from-yellow-400 to-orange-500' },
  'e': { name: '鹅鹅鹅', color: 'from-white to-gray-400' },
  'i': { name: '衣衣鹿', color: 'from-purple-400 to-pink-500' },
  'u': { name: '乌乌龟', color: 'from-green-500 to-blue-600' },
  'ü': { name: '雨雨鱼', color: 'from-blue-300 to-purple-400' },
  'b': { name: '波波兔', color: 'from-blue-400 to-purple-500' },
  'p': { name: '拍拍虎', color: 'from-red-400 to-orange-500' },
  'm': { name: '咪咪猫', color: 'from-pink-400 to-purple-500' },
  'f': { name: '飞飞鸽', color: 'from-green-400 to-blue-500' },
  'd': { name: '咚咚象', color: 'from-gray-400 to-blue-500' },
  't': { name: '跳跳蛙', color: 'from-green-400 to-yellow-500' },
  'n': { name: '奶奶羊', color: 'from-white to-gray-300' },
  'l': { name: '乐乐猴', color: 'from-orange-400 to-red-500' },
  'ai': { name: '爱爱猫', color: 'from-red-300 to-pink-400' },
  'ei': { name: '飞飞象', color: 'from-gray-300 to-blue-400' },
  'ui': { name: '围围熊', color: 'from-brown-300 to-yellow-400' },
  'ao': { name: '袄袄狗', color: 'from-yellow-300 to-orange-400' },
  'ou': { name: '欧欧鸥', color: 'from-blue-300 to-cyan-400' },
  'iu': { name: '优优鹿', color: 'from-green-300 to-blue-400' },
  'ie': { name: '蝶蝶虫', color: 'from-purple-300 to-pink-400' },
  'üe': { name: '月月兔', color: 'from-indigo-300 to-purple-400' },
  'er': { name: '耳耳猴', color: 'from-brown-300 to-orange-400' },
  'an': { name: '安安鸭', color: 'from-yellow-300 to-green-400' },
  'en': { name: '恩恩牛', color: 'from-red-300 to-brown-400' },
  'in': { name: '音音鸟', color: 'from-blue-300 to-violet-400' },
  'un': { name: '云云羊', color: 'from-white to-gray-300' },
  'ün': { name: '运运马', color: 'from-orange-300 to-red-400' },
  'ang': { name: '昂昂虎', color: 'from-yellow-300 to-red-400' },
  'eng': { name: '朋朋熊', color: 'from-green-300 to-blue-400' },
  'ing': { name: '星星空', color: 'from-indigo-300 to-purple-400' },
  'ong': { name: '龙龙龙', color: 'from-red-300 to-yellow-400' }
}

// 对话模板
const getDialogueForPinyin = (pinyin, exampleWords) => {
  const dialogueTemplates = {
    'a': '我是阿阿熊！张大嘴巴：ā á ǎ à！就像在说：啊！好漂亮！',
    'o': '我是喔喔鸡！喔喔叫：ō ó ǒ ò！就像公鸡打鸣！',
    'e': '我是鹅鹅鹅！曲项向天歌：é é é！就像大白鹅！',
    'i': '我是衣衣鹿！穿新衣服：yī yī yī！就像美丽的衣裳！',
    'u': '我是乌乌龟！慢慢爬行：wū wū wū！就像乌龟走路！',
    'ü': '我是雨雨鱼！游来游去：yǔ yǔ yǔ！就像下雨天！',
    'b': '大家好！我是波波兔！我会发出"b"的声音，就像拨浪鼓发出的声音：bō bō bō！',
    'p': '我是拍拍虎！我喜欢拍皮球，发出"p"的声音：pāi pāi pāi！',
    'm': '我是咪咪猫！喵喵叫：mī mī mī！就像喊妈妈：mā ma！',
    'f': '我是飞飞鸽！扇动翅膀：fēi fēi fēi！就像风扇转动：fēng shàn！',
    'd': '我是咚咚象！走路咚咚响：dōng dōng dōng！就像打鼓的声音！',
    't': '我是跳跳蛙！蹦蹦跳跳：tiào tiào tiào！就像踢毽子！',
    'n': '我是奶奶羊！咩咩叫：niē niē niē！就像叫奶奶！',
    'l': '我是乐乐猴！快乐玩耍：lè lè lè！就像拉小提琴！',
    'ai': '我是爱爱猫！爱爸爸妈妈：ài ài ài！就像爱心一样温暖！',
    'ei': '我是飞飞象！用力喷气：ēi ēi ēi！就像飞机起飞一样！',
    'ui': '我是围围熊！戴着围巾：wéi wéi wéi！冬天很暖和！',
    'ao': '我是袄袄狗！穿着棉袄：ǎo ǎo ǎo！冬天不怕冷！',
    'ou': '我是欧欧鸥！海鸥飞翔：ōu ōu ōu！在大海上自由自在！',
    'iu': '我是优优鹿！非常优秀：yōu yōu yōu！学习很努力！',
    'ie': '我是蝶蝶虫！变成蝴蝶：dié dié dié！在花丛中飞舞！',
    'üe': '我是月月兔！喜欢月亮：yuè yuè yuè！晚上出来玩！',
    'er': '我是耳耳猴！耳朵长长：ěr ěr ěr！能听到很远的声音！',
    'an': '我是安安鸭！安全第一：ān ān ān！要保护好自己！',
    'en': '我是恩恩牛！懂得感恩：ēn ēn ēn！感谢帮助过我的人！',
    'in': '我是音音鸟！歌声优美：yīn yīn yīn！就像音乐一样好听！',
    'un': '我是云云羊！像云朵一样：yún yún yún！在天空中飘来飘去！',
    'ün': '我是运运马！喜欢运动：yùn yùn yùn！身体棒棒的！',
    'ang': '我是昂昂虎！斗志昂扬：áng áng áng！威风凛凛！',
    'eng': '我是朋朋熊！喜欢交朋友：péng péng péng！朋友越多越快乐！',
    'ing': '我是星星空！满天星星：xīng xīng xīng！一闪一闪亮晶晶！',
    'ong': '我是龙龙龙！恐龙来了：lóng lóng lóng！是远古的大怪兽！'
  }
  
  return dialogueTemplates[pinyin] || `一起学习拼音：${pinyin}！`
}

// 生成练习选项
const generatePracticeOptions = (currentPinyin, allPinyins) => {
  // 根据拼音类型分组
  const consonants = ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l']
  const singleVowels = ['a', 'o', 'e', 'i', 'u', 'ü']
  const compoundVowels1 = ['ai', 'ei', 'ui', 'ao', 'ou', 'iu', 'ie', 'üe', 'er']
  const frontNasalVowels = ['an', 'en', 'in', 'un', 'ün']
  const backNasalVowels = ['ang', 'eng', 'ing', 'ong']
  
  let similarPinyins = []
  
  // 确定当前拼音属于哪个组
  if (consonants.includes(currentPinyin)) {
    similarPinyins = consonants
  } else if (singleVowels.includes(currentPinyin)) {
    similarPinyins = singleVowels
  } else if (compoundVowels1.includes(currentPinyin)) {
    similarPinyins = compoundVowels1
  } else if (frontNasalVowels.includes(currentPinyin)) {
    similarPinyins = frontNasalVowels
  } else if (backNasalVowels.includes(currentPinyin)) {
    similarPinyins = backNasalVowels
  } else {
    // 如果不在任何组中，使用所有拼音
    similarPinyins = allPinyins
  }
  
  // 确保当前拼音在选项中
  let options = [currentPinyin]
  
  // 从相似拼音中随机选择3个不同的拼音
  while (options.length < 4) {
    const randomIndex = Math.floor(Math.random() * similarPinyins.length)
    const randomPinyin = similarPinyins[randomIndex]
    if (!options.includes(randomPinyin)) {
      options.push(randomPinyin)
    }
  }
  
  // 打乱选项顺序
  options.sort(() => Math.random() - 0.5)
  
  // 为每个选项生成示例词
  const getExampleForPinyin = (p) => {
    const examples = {
      'a': '啊 à ！',
      'o': '哦 ō ！',
      'e': '鹅 é ！',
      'i': '衣 yī ！',
      'u': '乌龟 wū guī',
      'ü': '雨伞 yǔ sǎn',
      'b': '拨浪鼓 bō làng gǔ',
      'p': '拍皮球 pāi pí qiú',
      'm': '妈妈 mā ma',
      'f': '飞机 fēi jī',
      'd': '大象 dà xiàng',
      't': '兔子 tù zi',
      'n': '奶奶 nǎi nai',
      'l': '老虎 lǎo hǔ',
      'ai': '爱心 ài xīn',
      'ei': '飞机 fēi jī',
      'ui': '围巾 wéi jīn',
      'ao': '棉袄 mián ǎo',
      'ou': '海鸥 hǎi ōu',
      'iu': '优秀 yōu xiù',
      'ie': '蝴蝶 hú dié',
      'üe': '月亮 yuè liang',
      'er': '耳朵 ěr duo',
      'an': '安全 ān quán',
      'en': '恩情 ēn qíng',
      'in': '音乐 yīn yuè',
      'un': '云朵 yún duǒ',
      'ün': '运动 yùn dòng',
      'ang': '生气 shēng qì',
      'eng': '朋友 péng yǒu',
      'ing': '星星 xīng xing',
      'ong': '恐龙 kǒng lóng'
    }
    return examples[p] || `${p} 示例`
  }
  
  // 返回格式化的选项
  return options.map(option => ({
    text: option,
    example: getExampleForPinyin(option)
  }))
}

// 加载拼音数据
const loadPinyinData = async () => {
  try {
    loading.value = true
    // 从数据库获取拼音数据
    const dbPinyinLessons = await contentService.getAllPinyin()
    
    // 将数据库数据转换为组件需要的格式
    const allPinyins = dbPinyinLessons.map(item => item.pinyin)
    
    pinyinData.value = dbPinyinLessons.map(item => ({
      id: item.id,
      pinyin: item.pinyin,
      audioUrl: item.audio_url,
      imageUrl: item.image_url,
      exampleWords: item.example_words || [],
      difficulty: item.difficulty,
      character: characterDataMap[item.pinyin] || { 
        name: `${item.pinyin}精灵`, 
        color: 'from-orange-400 to-red-500' 
      },
      dialogue: getDialogueForPinyin(item.pinyin, item.example_words || []),
      options: generatePracticeOptions(item.pinyin, allPinyins)
    }))
  } catch (error) {
    console.error('加载拼音数据失败:', error)
    // 如果加载失败，使用最小默认数据作为备选
    useMinimalDefaultData()
  } finally {
    loading.value = false
  }
}

// 使用最小默认数据（当数据库加载失败时）
const useMinimalDefaultData = () => {
  // 只提供基本的拼音数据，避免大量硬编码的模拟数据
  const minimalData = [
    { pinyin: 'a', character: characterDataMap['a'], dialogue: getDialogueForPinyin('a') },
    { pinyin: 'o', character: characterDataMap['o'], dialogue: getDialogueForPinyin('o') },
    { pinyin: 'e', character: characterDataMap['e'], dialogue: getDialogueForPinyin('e') },
    { pinyin: 'i', character: characterDataMap['i'], dialogue: getDialogueForPinyin('i') },
    { pinyin: 'u', character: characterDataMap['u'], dialogue: getDialogueForPinyin('u') }
  ]
  
  // 为每个默认拼音生成练习选项
  const allPinyins = minimalData.map(item => item.pinyin)
  pinyinData.value = minimalData.map(item => ({
    ...item,
    options: generatePracticeOptions(item.pinyin, allPinyins)
  }))
}

// 计算属性
const currentPinyin = computed(() => {
  if (pinyinData.value.length > 0 && currentIndex.value < pinyinData.value.length) {
    return pinyinData.value[currentIndex.value].pinyin
  }
  return ''
})

const currentCharacter = computed(() => {
  if (pinyinData.value.length > 0 && currentIndex.value < pinyinData.value.length) {
    return pinyinData.value[currentIndex.value].character
  }
  return { name: '拼音精灵', color: 'from-orange-400 to-red-500' }
})

const currentDialogue = computed(() => {
  if (pinyinData.value.length > 0 && currentIndex.value < pinyinData.value.length) {
    return pinyinData.value[currentIndex.value].dialogue
  }
  return ''
})

const currentOptions = computed(() => {
  if (pinyinData.value.length > 0 && currentIndex.value < pinyinData.value.length) {
    return pinyinData.value[currentIndex.value].options
  }
  return []
})

const currentExamples = computed(() => {
  if (pinyinData.value.length > 0 && currentIndex.value < pinyinData.value.length) {
    return pinyinData.value[currentIndex.value].exampleWords || []
  }
  return []
})

// 角色动画映射
const getCharacterAnimation = (pinyin) => {
  const animations = {
    'a': 'animate-bounce',
    'o': 'animate-pulse',
    'e': 'animate-float',
    'i': 'animate-wiggle',
    'u': 'animate-float-slow',
    'ü': 'animate-spin'
  }
  return animations[pinyin] || 'animate-float'
}

// 核心交互方法
const selectOption = async (option) => {
  if (showFeedback.value) return
  
  selectedOption.value = option
  isCorrect.value = option === currentPinyin.value
  showFeedback.value = true
  
  if (isCorrect.value) {
    feedbackMessage.value = '太棒了！回答正确！'
    correctAnswers.value++
  } else {
    feedbackMessage.value = `答错了！正确答案是 ${currentPinyin.value}`
  }
  
  totalQuestions.value++
  practiceCount.value++
  
  // 可以在这里添加成功动画效果
  if (isCorrect.value) {
    const characterElement = document.querySelector(`.bg-gradient-to-br.${currentCharacter.value?.color}`)
    if (characterElement) {
      characterElement.classList.add('celebration')
      setTimeout(() => {
        characterElement.classList.remove('celebration')
      }, 1000)
    }
  }
}

const playPronunciation = () => {
  // 优先使用数据库中的音频URL
  const currentAudioUrl = pinyinData.value[currentIndex.value]?.audioUrl
  
  if (currentAudioUrl) {
    // 创建并播放音频
    const audio = new Audio(currentAudioUrl)
    audio.play().catch(error => {
      console.error('播放音频失败:', error)
      // 回退到Web Speech API
      fallbackTextToSpeech(currentPinyin.value)
    })
  } else {
    // 如果没有音频URL，使用Web Speech API
    fallbackTextToSpeech(currentPinyin.value)
  }
}

// 回退到文本转语音
const fallbackTextToSpeech = (text) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-CN'
    speechSynthesis.speak(utterance)
  }
}

const nextPinyin = () => {
  if (currentIndex.value < pinyinData.value.length - 1) {
    currentIndex.value++
    resetState()
  } else {
    // 完成所有练习
    showCompletion.value = true
  }
}

// 重置状态
const resetState = () => {
  selectedOption.value = ''
  showFeedback.value = false
  isCorrect.value = false
  feedbackMessage.value = ''
}

// 重新开始
const restart = () => {
  currentIndex.value = 0
  correctAnswers.value = 0
  totalQuestions.value = 0
  practiceCount.value = 0
  showCompletion.value = false
  resetState()
}

// 导航方法
const goBack = () => {
  router.back()
}

const goToHome = () => {
  router.push('/')
}

// 组件挂载时加载数据
onMounted(() => {
  loadPinyinData()
})
</script>

<style scoped>
.child-ui {
  font-family: 'Noto Sans SC', sans-serif;
}

/* 角色浮动动画 */
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

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-15px); }
  60% { transform: translateY(-10px); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes wiggle {
  0%, 7% { transform: rotateZ(0); }
  15% { transform: rotateZ(-5deg); }
  20% { transform: rotateZ(4deg); }
  25% { transform: rotateZ(-3deg); }
  30% { transform: rotateZ(2deg); }
  35% { transform: rotateZ(-1deg); }
  40%, 100% { transform: rotateZ(0); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 添加更丰富的动画效果 */
@keyframes bounce-in {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); }
}

@keyframes pulse-grow {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@keyframes slide-in-up {
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes slide-in-down {
  0% { transform: translateY(-20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes rainbow-glow {
  0% { box-shadow: 0 0 5px rgba(255, 99, 132, 0.7); }
  25% { box-shadow: 0 0 15px rgba(54, 162, 235, 0.7); }
  50% { box-shadow: 0 0 15px rgba(255, 206, 86, 0.7); }
  75% { box-shadow: 0 0 15px rgba(75, 192, 192, 0.7); }
  100% { box-shadow: 0 0 5px rgba(255, 99, 132, 0.7); }
}

@keyframes spin-smooth {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes celebration {
  0% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.1) rotate(5deg); }
  50% { transform: scale(1.2) rotate(0deg); }
  75% { transform: scale(1.1) rotate(-5deg); }
  100% { transform: scale(1) rotate(0deg); }
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

/* 样式类应用 */
.slide-in-up {
  animation: slide-in-up 0.5s ease-out;
}

.slide-in-down {
  animation: slide-in-down 0.5s ease-out;
}

.fade-in {
  animation: fade-in 0.5s ease-out;
}

.rainbow-glow {
  animation: rainbow-glow 2s ease-in-out infinite;
}

.celebration {
  animation: celebration 0.5s ease-in-out;
}

/* 按钮效果增强 */
.option-button {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.option-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.option-button:hover::before {
  left: 100%;
}

/* 语音按钮特效 */
.voice-button {
  position: relative;
  z-index: 1;
}

.voice-button::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: scale(0);
  transition: transform 0.3s ease;
}

.voice-button:active::after {
  transform: scale(1);
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
  
  .bg-white.rounded-2xl.shadow-lg.overflow-hidden {
    padding: 0.5rem;
  }
  
  .p-6 {
    padding: 1.5rem;
  }
  
  .examples-section span {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .child-ui {
    background-image: linear-gradient(to bottom, #111827, #312e81);
  }
  
  .child-ui .bg-white {
    background-color: #1f2937;
    color: #f9fafb;
  }
  
  .child-ui .text-gray-800 {
    color: #f9fafb;
  }
  
  .child-ui .text-gray-700 {
    color: #e5e7eb;
  }
  
  .child-ui .bg-indigo-50 {
    background-color: #312e81;
  }
  
  .child-ui .examples-section span {
    background-color: #4338ca;
    color: #e0e7ff;
  }
}
</style>