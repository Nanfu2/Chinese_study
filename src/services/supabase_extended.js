import { createClient } from '@supabase/supabase-js'

// 创建独立的Supabase客户端实例以避免循环导入
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key'
)

// 扩展的内容服务
export const extendedContentService = {
  // 获取分类数据（带缓存优化）
  getCategories: async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, description, sort_order')
        .order('sort_order', { ascending: true })
        .limit(20) // 限制返回数量
      
      if (error) {
        // 如果表不存在或没有数据，返回模拟数据
        if (error.code === 'PGRST116' || error.message.includes('不存在')) {
          console.log('分类表不存在，返回模拟数据');
          return [
            { id: '1', name: '拼音学习', description: '学习汉语拼音基础', sort_order: 1 },
            { id: '2', name: '汉字启蒙', description: '认识常用汉字', sort_order: 2 },
            { id: '3', name: '成语故事', description: '通过故事学习成语', sort_order: 3 }
          ];
        }
        throw error;
      }
      
      return data
    } catch (error) {
      console.error('获取分类数据失败:', error);
      // 返回模拟数据作为降级方案
      return [
        { id: '1', name: '拼音学习', description: '学习汉语拼音基础', sort_order: 1 },
        { id: '2', name: '汉字启蒙', description: '认识常用汉字', sort_order: 2 },
        { id: '3', name: '成语故事', description: '通过故事学习成语', sort_order: 3 }
      ];
    }
  },

  // 获取拼音学习数据
  getPinyinLessons: async () => {
    try {
      const { data, error } = await supabase
        .from('pinyin_lessons')
        .select('*')
        .order('sort_order', { ascending: true })
      
      if (error) {
        // 如果表不存在或没有数据，返回模拟数据
        if (error.code === 'PGRST116' || error.message.includes('不存在')) {
          console.log('拼音学习表不存在，返回模拟数据');
          return [
            { id: '1', pinyin: 'a', audio_url: '/audio/a.mp3', difficulty: 'easy' },
            { id: '2', pinyin: 'o', audio_url: '/audio/o.mp3', difficulty: 'easy' },
            { id: '3', pinyin: 'e', audio_url: '/audio/e.mp3', difficulty: 'easy' }
          ];
        }
        throw error;
      }
      
      return data
    } catch (error) {
      console.error('获取拼音学习数据失败:', error);
      // 返回模拟数据作为降级方案
      return [
        { id: '1', pinyin: 'a', audio_url: '/audio/a.mp3', difficulty: 'easy' },
        { id: '2', pinyin: 'o', audio_url: '/audio/o.mp3', difficulty: 'easy' },
        { id: '3', pinyin: 'e', audio_url: '/audio/e.mp3', difficulty: 'easy' }
      ];
    }
  },

  // 获取汉字学习数据
  getChineseCharacters: async (limit = 20) => {
    try {
      const { data, error } = await supabase
        .from('chinese_characters')
        .select('*')
        .limit(limit)
        .order('difficulty', { ascending: true })
      
      if (error) {
        // 如果表不存在或没有数据，返回模拟数据
        if (error.code === 'PGRST116' || error.message.includes('不存在')) {
          console.log('汉字学习表不存在，返回模拟数据');
          return [
            { id: '1', character: '日', pinyin: 'rì', meaning: '太阳', difficulty: 'easy' },
            { id: '2', character: '月', pinyin: 'yuè', meaning: '月亮', difficulty: 'easy' },
            { id: '3', character: '山', pinyin: 'shān', meaning: '山峰', difficulty: 'easy' }
          ];
        }
        throw error;
      }
      
      return data
    } catch (error) {
      console.error('获取汉字学习数据失败:', error);
      // 返回模拟数据作为降级方案
      return [
        { id: '1', character: '日', pinyin: 'rì', meaning: '太阳', difficulty: 'easy' },
        { id: '2', character: '月', pinyin: 'yuè', meaning: '月亮', difficulty: 'easy' },
        { id: '3', character: '山', pinyin: 'shān', meaning: '山峰', difficulty: 'easy' }
      ];
    }
  },

  // 获取成就数据
  getAchievements: async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true)
        .order('condition_value', { ascending: true })
      
      if (error) {
        // 如果表不存在或没有数据，返回模拟数据
        if (error.code === 'PGRST116' || error.message.includes('不存在')) {
          console.log('成就表不存在，返回模拟数据');
          return [
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
          ];
        }
        throw error;
      }
      
      return data
    } catch (error) {
      console.error('获取成就数据失败:', error);
      // 返回模拟数据作为降级方案
      return [
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
      ];
    }
  },

  // 获取儿童成就记录
  getChildAchievements: async (childId) => {
    try {
      const { data, error } = await supabase
        .from('child_achievements')
        .select(`
          *,
          achievements (*)
        `)
        .eq('child_id', childId)
      
      if (error) {
        // 如果表不存在或没有数据，返回空数组
        if (error.code === 'PGRST116' || error.message.includes('不存在')) {
          console.log('儿童成就记录表不存在，返回空数据');
          return [];
        }
        throw error;
      }
      
      return data
    } catch (error) {
      console.error('获取儿童成就记录失败:', error);
      // 返回空数组作为降级方案
      return [];
    }
  },

  // 解锁成就
  unlockAchievement: async (childId, achievementId) => {
    try {
      console.log('正在解锁成就，孩子ID:', childId, '成就ID:', achievementId);
      
      // 检查是否已经解锁过该成就
      const { data: existingRecord, error: checkError } = await supabase
        .from('child_achievements')
        .select('id')
        .eq('child_id', childId)
        .eq('achievement_id', achievementId)
        .single()
      
      if (checkError && checkError.code !== 'PGRST116') {
        // 如果记录已存在，不重复解锁
        if (existingRecord) {
          console.log('该成就已解锁，跳过');
          return { success: true, message: '成就已解锁' };
        }
      }
      
      // 解锁成就
      const { data, error } = await supabase
        .from('child_achievements')
        .insert({
          child_id: childId,
          achievement_id: achievementId,
          unlocked_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (error) {
        // 如果表不存在，返回成功但不实际记录
        if (error.code === 'PGRST116' || error.message.includes('不存在')) {
          console.log('儿童成就记录表不存在，模拟解锁成功');
          return { success: true, message: '成就解锁成功（模拟）' };
        }
        throw error;
      }
      
      console.log('成就解锁成功:', data);
      return { success: true, data, message: '成就解锁成功' };
    } catch (error) {
      console.error('解锁成就失败:', error);
      return { success: false, error: error.message };
    }
  },

  // 检查并解锁拼音小能手成就
  checkAndUnlockPinyinAchievement: async (childId) => {
    try {
      console.log('正在检查拼音小能手成就解锁条件，孩子ID:', childId);
      
      // 获取拼音小能手成就ID（根据您提供的成就数据）
      const pinyinAchievementId = '17fb2c4b-5251-48df-a9cd-fef3fd5905fb';
      
      // 检查孩子的拼音学习完成率
      // 这里需要根据实际业务逻辑计算完成率
      // 假设我们通过观看历史来计算拼音相关动画的完成率
      const { data: watchHistory, error: historyError } = await supabase
        .from('watch_history')
        .select(`
          *,
          animations!inner(category_id)
        `)
        .eq('child_id', childId)
      
      if (historyError) {
        console.error('获取观看历史失败:', historyError);
        return { success: false, error: '无法获取学习数据' };
      }
      
      // 获取拼音分类的动画
      const { data: pinyinAnimations, error: animError } = await supabase
        .from('animations')
        .select('id')
        .eq('category_id', '1') // 假设拼音分类的ID是1
      
      if (animError) {
        console.error('获取拼音动画失败:', animError);
        return { success: false, error: '无法获取拼音学习数据' };
      }
      
      // 计算完成率
      const totalPinyinAnimations = pinyinAnimations.length;
      const completedPinyinAnimations = watchHistory.filter(record => 
        pinyinAnimations.some(anim => anim.id === record.animation_id) && record.completed
      ).length;
      
      const completionRate = totalPinyinAnimations > 0 ? 
        (completedPinyinAnimations / totalPinyinAnimations) * 100 : 0;
      
      console.log('拼音学习完成率:', completionRate, '%');
      
      // 如果完成率达到80%，解锁成就
      if (completionRate >= 80) {
        console.log('拼音学习完成率达到80%，解锁拼音小能手成就');
        return await extendedContentService.unlockAchievement(childId, pinyinAchievementId);
      } else {
        console.log('拼音学习完成率未达到80%，当前进度:', completionRate, '%');
        return { success: false, message: '拼音学习进度不足', progress: completionRate };
      }
    } catch (error) {
      console.error('检查拼音成就失败:', error);
      return { success: false, error: error.message };
    }
  }
}

// 扩展的学习统计服务
export const extendedLearningService = {
  // 获取仪表盘统计数据
  getDashboardStats: async (userId) => {
    try {
      // 直接查询学习统计表，避免循环导入
      const { data: stats, error } = await supabase
        .from('learning_stats')
        .select('*')
        .eq('user_id', userId)
        .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]) // 最近30天

      if (error) {
        // 如果表不存在或没有数据，返回模拟数据
        if (error.code === 'PGRST116' || error.message.includes('不存在')) {
          console.log('学习统计表不存在，返回模拟数据');
          return {
            total_watch_time: 1800,
            completed_animations: 3,
            earned_points: 150,
            current_streak: 5,
            favorite_category: '拼音学习'
          };
        }
        throw error;
      }

      // 计算统计数据
      const totalWatchTime = stats.reduce((sum, stat) => sum + (stat.total_watch_time || 0), 0)
      const completedAnimations = stats.reduce((sum, stat) => sum + (stat.completed_animations || 0), 0)
      const earnedPoints = stats.reduce((sum, stat) => sum + (stat.earned_points || 0), 0)

      // 计算连续学习天数（简化版）
      const currentStreak = stats.length > 0 ? Math.min(stats.length, 7) : 0

      // 获取最受欢迎的分类（简化版）
      const favoriteCategory = '拼音学习'

      return {
        total_watch_time: totalWatchTime,
        completed_animations: completedAnimations,
        earned_points: earnedPoints,
        current_streak: currentStreak,
        favorite_category: favoriteCategory
      }
    } catch (error) {
      console.error('获取仪表盘统计数据失败:', error);
      // 返回模拟数据作为降级方案
      return {
        total_watch_time: 1800,
        completed_animations: 3,
        earned_points: 150,
        current_streak: 5,
        favorite_category: '拼音学习'
      };
    }
  }
}

// 文件上传服务
export const fileUploadService = {
  // 上传文件到Supabase Storage
  uploadFile: async (file, bucketName = 'avatars', filePath = null) => {
    if (!filePath) {
      filePath = `${Date.now()}_${file.name}`
    }

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file)

    if (error) throw error

    // 获取公开URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath)

    return {
      url: publicUrl,
      filename: file.name,
      filePath: filePath
    }
  },

  // 删除文件
  deleteFile: async (filePath, bucketName = 'avatars') => {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .remove([filePath])

    if (error) throw error
    return data
  }
}

export default {
  extendedContentService,
  extendedLearningService,
  fileUploadService
}