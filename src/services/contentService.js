import { supabaseAdmin } from './supabase'

export const contentService = {
  // 获取所有动画内容
  async getAllAnimations() {
    try {
      const { data, error } = await supabaseAdmin
        .from('animations')
        .select(`
          *,
          categories(name)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('获取动画内容失败:', error)
        throw error
      }

      // 转换数据格式以匹配前端需求
      return data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        thumbnail: item.thumbnail_url || '/logo.svg',
        category: item.categories?.name || '未分类',
        difficulty: item.difficulty || 'easy',
        createdAt: new Date(item.created_at).toLocaleString('zh-CN'),
        published: item.is_active || false,
        videoUrl: item.video_url,
        duration: item.duration,
        ageGroup: item.age_group,
        viewCount: item.view_count || 0,
        likeCount: item.like_count || 0
      }))
    } catch (error) {
      console.error('获取动画内容出错:', error)
      throw error
    }
  },

  // 获取拼音学习内容
  async getAllPinyin() {
    try {
      const { data, error } = await supabaseAdmin
        .from('pinyin_lessons')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) {
        console.error('获取拼音内容失败:', error)
        throw error
      }

      return data.map(item => ({
        id: item.id,
        title: `拼音学习 - ${item.pinyin}`,
        description: `学习拼音 ${item.pinyin} 的发音和用法`,
        category: '拼音学习',
        difficulty: item.difficulty || 'easy',
        createdAt: new Date(item.created_at).toLocaleString('zh-CN'),
        published: true,
        audioUrl: item.audio_url,
        imageUrl: item.image_url,
        pinyin: item.pinyin,
        exampleWords: item.example_words || []
      }))
    } catch (error) {
      console.error('获取拼音内容出错:', error)
      throw error
    }
  },

  // 获取汉字学习内容
  async getAllCharacters() {
    try {
      const { data, error } = await supabaseAdmin
        .from('chinese_characters')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('获取汉字内容失败:', error)
        throw error
      }

      return data.map(item => ({
        id: item.id,
        title: `汉字学习 - ${item.character}`,
        description: `学习汉字"${item.character}"的拼音、含义和书写`,
        category: '汉字学习',
        difficulty: item.difficulty || 'easy',
        createdAt: new Date(item.created_at).toLocaleString('zh-CN'),
        published: true,
        character: item.character,
        pinyin: item.pinyin,
        meaning: item.meaning,
        strokeOrderUrl: item.stroke_order_url,
        audioUrl: item.audio_url
      }))
    } catch (error) {
      console.error('获取汉字内容出错:', error)
      throw error
    }
  },

  // 添加新内容
  async addContent(contentType, contentData) {
    try {
      let tableName, insertData

      switch (contentType) {
        case 'animations':
          tableName = 'animations'
          insertData = {
            title: contentData.title,
            description: contentData.description,
            video_url: contentData.videoUrl,
            thumbnail_url: contentData.thumbnail,
            duration: contentData.duration,
            category_id: contentData.categoryId,
            age_group: contentData.ageGroup,
            difficulty: contentData.difficulty,
            learning_objectives: contentData.learningObjectives || [],
            tags: contentData.tags || [],
            is_active: contentData.published || false
          }
          break
        case 'pinyin':
          tableName = 'pinyin_lessons'
          insertData = {
            pinyin: contentData.pinyin,
            audio_url: contentData.audioUrl,
            image_url: contentData.imageUrl,
            example_words: contentData.exampleWords || [],
            difficulty: contentData.difficulty || 'easy'
          }
          break
        case 'characters':
          tableName = 'chinese_characters'
          insertData = {
            character: contentData.character,
            pinyin: contentData.pinyin,
            meaning: contentData.meaning,
            stroke_order_url: contentData.strokeOrderUrl,
            audio_url: contentData.audioUrl,
            difficulty: contentData.difficulty || 'easy'
          }
          break
        default:
          throw new Error('不支持的内容类型')
      }

      const { data, error } = await supabaseAdmin
        .from(tableName)
        .insert(insertData)
        .select()
        .single()

      if (error) {
        console.error('添加内容失败:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('添加内容出错:', error)
      throw error
    }
  },

  // 更新内容
  async updateContent(contentType, contentId, contentData) {
    try {
      let tableName, updateData

      switch (contentType) {
        case 'animations':
          tableName = 'animations'
          updateData = {
            title: contentData.title,
            description: contentData.description,
            video_url: contentData.videoUrl,
            thumbnail_url: contentData.thumbnail,
            duration: contentData.duration,
            category_id: contentData.categoryId,
            age_group: contentData.ageGroup,
            difficulty: contentData.difficulty,
            learning_objectives: contentData.learningObjectives || [],
            tags: contentData.tags || [],
            is_active: contentData.published || false,
            updated_at: new Date().toISOString()
          }
          break
        case 'pinyin':
          tableName = 'pinyin_lessons'
          updateData = {
            pinyin: contentData.pinyin,
            audio_url: contentData.audioUrl,
            image_url: contentData.imageUrl,
            example_words: contentData.exampleWords || [],
            difficulty: contentData.difficulty || 'easy'
          }
          break
        case 'characters':
          tableName = 'chinese_characters'
          updateData = {
            character: contentData.character,
            pinyin: contentData.pinyin,
            meaning: contentData.meaning,
            stroke_order_url: contentData.strokeOrderUrl,
            audio_url: contentData.audioUrl,
            difficulty: contentData.difficulty || 'easy'
          }
          break
        default:
          throw new Error('不支持的内容类型')
      }

      const { data, error } = await supabaseAdmin
        .from(tableName)
        .update(updateData)
        .eq('id', contentId)
        .select()
        .single()

      if (error) {
        console.error('更新内容失败:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('更新内容出错:', error)
      throw error
    }
  },

  // 删除内容
  async deleteContent(contentType, contentId) {
    try {
      let tableName

      switch (contentType) {
        case 'animations':
          tableName = 'animations'
          break
        case 'pinyin':
          tableName = 'pinyin_lessons'
          break
        case 'characters':
          tableName = 'chinese_characters'
          break
        default:
          throw new Error('不支持的内容类型')
      }

      const { error } = await supabaseAdmin
        .from(tableName)
        .delete()
        .eq('id', contentId)

      if (error) {
        console.error('删除内容失败:', error)
        throw error
      }

      return { success: true }
    } catch (error) {
      console.error('删除内容出错:', error)
      throw error
    }
  },

  // 切换内容发布状态
  async togglePublishStatus(contentType, contentId, published) {
    try {
      let tableName, updateData

      switch (contentType) {
        case 'animations':
          tableName = 'animations'
          updateData = { is_active: published }
          break
        case 'pinyin':
        case 'characters':
          // 拼音和汉字内容默认总是发布的
          return { success: true }
        default:
          throw new Error('不支持的内容类型')
      }

      const { error } = await supabaseAdmin
        .from(tableName)
        .update(updateData)
        .eq('id', contentId)

      if (error) {
        console.error('切换发布状态失败:', error)
        throw error
      }

      return { success: true }
    } catch (error) {
      console.error('切换发布状态出错:', error)
      throw error
    }
  },

  // 获取分类列表
  async getCategories() {
    try {
      const { data, error } = await supabaseAdmin
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) {
        console.error('获取分类列表失败:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('获取分类列表出错:', error)
      throw error
    }
  }
}