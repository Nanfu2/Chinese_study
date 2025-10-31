<template>
  <div class="min-h-screen bg-black">
    <!-- 顶部导航 -->
    <header class="p-4 bg-black bg-opacity-50 absolute top-0 left-0 right-0 z-10">
      <div class="container mx-auto flex justify-between items-center">
        <button @click="goBack" class="text-white hover:text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-white text-lg font-bold">{{ animation?.title || '正在加载...' }}</h1>
        <div class="w-6"></div> <!-- 占位保持对称 -->
      </div>
    </header>

    <!-- 视频播放器 -->
    <div class="relative pt-16 pb-8">
      <div class="container mx-auto px-4">
        <!-- 视频播放区域 -->
        <div class="bg-gray-900 rounded-lg overflow-hidden aspect-video max-w-4xl mx-auto relative">
          <!-- 加载状态 -->
          <div v-if="!animation" class="h-full flex items-center justify-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
          
          <!-- 视频封面 -->
          <div v-else-if="!isPlaying" class="absolute inset-0 flex items-center justify-center bg-cover bg-center" :style="{ backgroundImage: `url(${animation.thumbnail_url || '/default-animation.jpg'})` }">
            <div class="absolute inset-0 bg-black bg-opacity-40"></div>
            <button @click="playVideo" class="relative z-10 bg-primary/90 hover:bg-primary rounded-full h-20 w-20 flex items-center justify-center transition-all duration-300 transform hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
            </button>
          </div>
          
          <!-- 视频播放器 -->
          <video 
            v-if="animation"
            ref="videoPlayer"
            :src="getVideoUrl(animation.video_url)"
            class="w-full h-full object-cover"
            :poster="animation.thumbnail_url || '/default-animation.jpg'"
            controls
            @play="onVideoPlay"
            @pause="onVideoPause"
            @ended="onVideoEnd"
            @timeupdate="onTimeUpdate"
            @loadeddata="onVideoLoaded"
            @error="onVideoError"
          >
            您的浏览器不支持视频播放
          </video>
          
          <!-- 视频错误提示 -->
          <div v-if="videoError" class="absolute inset-0 flex items-center justify-center bg-red-900 bg-opacity-80">
            <div class="text-white text-center p-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p class="text-lg font-bold">视频加载失败</p>
              <p class="text-sm mt-1">请检查网络连接或联系管理员</p>
              <button @click="retryLoadVideo" class="mt-3 px-4 py-2 bg-primary text-white rounded hover:bg-blue-600">
                重新加载
              </button>
            </div>
          </div>
        </div>

        <!-- 视频信息 -->
        <div v-if="animation" class="mt-6 text-white max-w-4xl mx-auto">
          <h2 class="text-2xl font-bold mb-2">{{ animation.title }}</h2>
          <p class="text-gray-300 mb-4">{{ animation.description }}</p>
          
          <!-- 学习统计 -->
          <div class="flex items-center justify-between text-sm text-gray-400">
            <div class="flex items-center space-x-4">
              <span>时长: {{ Math.ceil(animation.duration / 60) }}分钟</span>
              <span>难度: {{ getDifficultyText(animation.difficulty) }}</span>
              <span>适合年龄: {{ getAgeGroupText(animation.age_group) }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span>当前学习者: {{ currentChild?.name }}</span>
              <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span class="text-white text-xs font-bold">{{ currentChild?.name?.charAt(0) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 互动区域 -->
        <div v-if="animation" class="mt-6 max-w-4xl mx-auto">
          <div class="bg-gray-800 rounded-lg p-4">
            <h3 class="text-white font-bold mb-3">学习互动</h3>
            <div class="flex space-x-4">
              <button @click="recordLike" class="flex items-center space-x-2 text-gray-300 hover:text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>点赞</span>
              </button>
              <button @click="recordFavorite" class="flex items-center space-x-2 text-gray-300 hover:text-yellow-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span>收藏</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainStore } from '../../store'
import { contentService, learningService } from '../../services/supabase'

const route = useRoute()
const router = useRouter()
const store = useMainStore()

// 状态管理
const animation = ref(null)
const currentChild = ref(null)
const videoPlayer = ref(null)
const watchStartTime = ref(null)
const totalWatchTime = ref(0)
const isCompleted = ref(false)
const isPlaying = ref(false)
const videoError = ref(false)
const isLoading = ref(false)

// 方法
const goBack = () => {
  router.back()
}

// 获取视频URL（处理本地和远程视频）
const getVideoUrl = (videoUrl) => {
  if (!videoUrl) return ''
  
  // 如果是本地视频文件，添加public路径前缀
  if (videoUrl.startsWith('/videos/')) {
    return videoUrl
  }
  
  // 如果是远程URL，直接返回
  if (videoUrl.startsWith('http')) {
    return videoUrl
  }
  
  // 默认处理
  return videoUrl
}

// 播放视频
const playVideo = () => {
  if (videoPlayer.value) {
    videoPlayer.value.play().catch(error => {
      console.error('播放视频失败:', error)
      videoError.value = true
    })
  }
}

// 重新加载视频
const retryLoadVideo = () => {
  videoError.value = false
  if (videoPlayer.value) {
    videoPlayer.value.load()
    videoPlayer.value.play().catch(error => {
      console.error('重新播放视频失败:', error)
      videoError.value = true
    })
  }
}

const loadAnimation = async () => {
  try {
    isLoading.value = true
    const animationId = route.params.id
    if (animationId) {
      animation.value = await contentService.getAnimationById(animationId)
      
      // 如果数据库中没有视频URL，使用默认视频
      if (!animation.value.video_url) {
        // 根据动画ID设置默认视频
        const defaultVideos = {
          '1': '/videos/pinyin-ba.mp4',
          '2': '/videos/pinyin-po.mp4', 
          '3': '/videos/hanzi-ren.mp4'
        }
        animation.value.video_url = defaultVideos[animationId] || '/videos/pinyin-ba.mp4'
      }
    }
  } catch (error) {
    console.error('加载动画失败:', error)
    // 如果API调用失败，使用默认数据
    animation.value = {
      id: route.params.id,
      title: '波波精灵和阿阿精灵',
      description: '学习声母b和韵母a的发音',
      video_url: '/videos/pinyin-ba.mp4',
      thumbnail_url: '/pinyin-ba.jpg',
      duration: 300,
      difficulty: 'easy',
      age_group: 'preschool'
    }
  } finally {
    isLoading.value = false
  }
}

const onVideoPlay = () => {
  isPlaying.value = true
  watchStartTime.value = Date.now()
  
  // 记录开始观看
  if (currentChild.value && animation.value) {
    recordWatchStart()
  }
}

const onVideoPause = () => {
  isPlaying.value = false
  if (watchStartTime.value) {
    const watchDuration = Date.now() - watchStartTime.value
    totalWatchTime.value += watchDuration
    watchStartTime.value = null
    
    // 更新观看记录
    if (currentChild.value && animation.value) {
      updateWatchRecord(watchDuration)
    }
  }
}

const onVideoEnd = () => {
  isPlaying.value = false
  if (watchStartTime.value) {
    const watchDuration = Date.now() - watchStartTime.value
    totalWatchTime.value += watchDuration
    watchStartTime.value = null
    
    // 标记为完成
    isCompleted.value = true
    
    // 记录完成观看
    if (currentChild.value && animation.value) {
      recordWatchComplete(watchDuration)
    }
  }
}

const onTimeUpdate = () => {
  // 可以在这里实现进度跟踪
}

const onVideoLoaded = () => {
  console.log('视频加载完成')
  videoError.value = false
}

const onVideoError = (error) => {
  console.error('视频加载错误:', error)
  videoError.value = true
  isPlaying.value = false
}

const recordWatchStart = async () => {
  try {
    await learningService.recordWatchHistory({
      child_id: currentChild.value.id,
      animation_id: animation.value.id,
      watch_duration: 0,
      completed: false
    })
  } catch (error) {
    console.error('记录观看开始失败:', error)
  }
}

const updateWatchRecord = async (duration) => {
  try {
    await learningService.recordWatchHistory({
      child_id: currentChild.value.id,
      animation_id: animation.value.id,
      watch_duration: Math.round(duration / 1000), // 转换为秒
      completed: isCompleted.value
    })
  } catch (error) {
    console.error('更新观看记录失败:', error)
  }
}

const recordWatchComplete = async (duration) => {
  try {
    await learningService.recordWatchHistory({
      child_id: currentChild.value.id,
      animation_id: animation.value.id,
      watch_duration: Math.round(duration / 1000), // 转换为秒
      completed: true
    })
    
    // 记录完成互动
    await learningService.recordInteraction({
      child_id: currentChild.value.id,
      animation_id: animation.value.id,
      interaction_type: 'completion',
      interaction_data: { duration: Math.round(duration / 1000) }
    })
    
    // 检查并解锁拼音小能手成就
    await checkAndUnlockPinyinAchievement()
  } catch (error) {
    console.error('记录观看完成失败:', error)
  }
}

// 检查并解锁拼音小能手成就
const checkAndUnlockPinyinAchievement = async () => {
  if (!currentChild.value || !animation.value) return
  
  try {
    // 导入扩展服务
    const { extendedContentService } = await import('../../services/supabase_extended')
    
    // 检查并解锁拼音小能手成就
    const result = await extendedContentService.checkAndUnlockPinyinAchievement(currentChild.value.id)
    
    if (result.success) {
      // 成就解锁成功，显示提示
      showAchievementUnlocked('拼音小能手', '恭喜你完成了拼音学习！')
    } else if (result.progress) {
      console.log('拼音学习进度:', result.progress, '%')
    }
  } catch (error) {
    console.error('检查拼音成就失败:', error)
  }
}

// 显示成就解锁提示
const showAchievementUnlocked = (title, message) => {
  // 创建成就解锁提示元素
  const achievementElement = document.createElement('div')
  achievementElement.className = 'fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg shadow-lg max-w-sm animate-bounce'
  achievementElement.innerHTML = `
    <div class="flex items-center space-x-3">
      <div class="bg-white rounded-full p-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      </div>
      <div>
        <h4 class="font-bold text-lg">🎉 成就解锁！</h4>
        <p class="text-sm"><strong>${title}</strong> - ${message}</p>
      </div>
    </div>
  `
  
  // 添加到页面
  document.body.appendChild(achievementElement)
  
  // 触发全局事件，通知成就页面刷新
  const event = new CustomEvent('achievementUnlocked', {
    detail: { title, message }
  })
  window.dispatchEvent(event)
  
  // 3秒后自动移除
  setTimeout(() => {
    if (achievementElement.parentNode) {
      achievementElement.parentNode.removeChild(achievementElement)
    }
  }, 3000)
}

const recordLike = async () => {
  if (!currentChild.value || !animation.value) return
  
  try {
    await learningService.recordInteraction({
      child_id: currentChild.value.id,
      animation_id: animation.value.id,
      interaction_type: 'like',
      interaction_data: { value: true }
    })
    
    alert('点赞成功！')
  } catch (error) {
    console.error('记录点赞失败:', error)
  }
}

const recordFavorite = async () => {
  if (!currentChild.value || !animation.value) return
  
  try {
    await learningService.recordInteraction({
      child_id: currentChild.value.id,
      animation_id: animation.value.id,
      interaction_type: 'favorite',
      interaction_data: { value: true }
    })
    
    alert('收藏成功！')
  } catch (error) {
    console.error('记录收藏失败:', error)
  }
}

const getDifficultyText = (difficulty) => {
  const difficultyMap = {
    'easy': '简单',
    'medium': '中等',
    'hard': '困难'
  }
  return difficultyMap[difficulty] || '简单'
}

const getAgeGroupText = (ageGroup) => {
  const ageGroupMap = {
    'toddler': '幼儿',
    'preschool': '学龄前',
    'elementary': '小学',
    'advanced': '进阶'
  }
  return ageGroupMap[ageGroup] || '学龄前'
}

// 组件挂载时初始化
onMounted(() => {
  // 设置当前孩子
  currentChild.value = store.currentChild
  
  // 如果没有选择孩子，重定向到首页
  if (!currentChild.value) {
    router.push('/child/home')
    return
  }
  
  loadAnimation()
})

// 组件卸载时保存观看记录
onUnmounted(() => {
  if (watchStartTime.value) {
    const duration = Date.now() - watchStartTime.value
    if (currentChild.value && animation.value) {
      updateWatchRecord(duration)
    }
  }
})
</script>

<style scoped>
/* 自定义视频播放器样式 */
video {
  outline: none;
}
</style>