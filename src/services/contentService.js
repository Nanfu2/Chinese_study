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

  // 删除内容},

  // 获取汉字故事数据（用于汉字故事页面）
  async getChineseCharactersWithStories() {
    try {
      const { data, error } = await supabaseAdmin
        .from('chinese_characters')
        .select('*')
        .order('character', { ascending: true })

      if (error) {
        console.error('获取汉字故事数据失败:', error)
        throw error
      }

      if (!data || data.length === 0) {
        console.log('没有找到汉字数据')
        return []
      }

      // 转换数据格式以匹配前端需求
      return data.map(item => ({
        id: item.id,
        character: item.character,
        pinyin: item.pinyin,
        meaning: item.meaning,
        strokeCount: this.calculateStrokeCount(item.character),
        evolution: this.generateEvolutionData(item.character),
        strokeImage: item.stroke_order_url || `/strokes/${item.character}.gif`,
        story: item.meaning, // 使用meaning字段作为故事内容
        illustration: `/stories/${item.character}.jpg`,
        words: this.generateWordsForCharacter(item.character),
        audioUrl: item.audio_url,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        difficulty: item.difficulty || 'easy'
      }))
    } catch (error) {
      console.error('获取汉字故事数据出错:', error)
      throw error
    }
  },

  // 计算汉字笔画数（简化版本）
  calculateStrokeCount(character) {
    // 这里可以使用更精确的笔画数计算库
    const strokeCounts = {
      '一': 1, '二': 2, '三': 3, '四': 5, '五': 4, '六': 4, '七': 2, '八': 2, '九': 2, '十': 2,
      '人': 2, '口': 3, '日': 4, '月': 4, '山': 3, '水': 4, '火': 4, '木': 4, '土': 3, '大': 3,
      '小': 3, '上': 3, '下': 3, '中': 4, '天': 4, '地': 6, '你': 7, '我': 7, '他': 5, '她': 6,
      '它': 5, '爸': 8, '妈': 6, '哥': 10, '弟': 7, '姐': 8, '妹': 8, '百': 6, '千': 3, '万': 3,
      '家': 10, '学': 8, '校': 10, '老': 6, '师': 6, '生': 5, '书': 4, '笔': 10, '纸': 7
    }
    return strokeCounts[character] || 5
  },

  // 生成汉字演变数据
  generateEvolutionData(character) {
    // 这里可以从数据库获取真实的演变数据
    // 暂时使用简化版本
    const evolutionMap = {
      '日': [{ form: '⊙', period: '甲骨文' }, { form: '日', period: '金文' }, { form: '日', period: '小篆' }, { form: '日', period: '楷书' }],
      '月': [{ form: '🌙', period: '甲骨文' }, { form: '月', period: '金文' }, { form: '月', period: '小篆' }, { form: '月', period: '楷书' }],
      '山': [{ form: '⛰️', period: '甲骨文' }, { form: '山', period: '金文' }, { form: '山', period: '小篆' }, { form: '山', period: '楷书' }],
      '水': [{ form: '💧', period: '甲骨文' }, { form: '水', period: '金文' }, { form: '水', period: '小篆' }, { form: '水', period: '楷书' }],
      '火': [{ form: '🔥', period: '甲骨文' }, { form: '火', period: '金文' }, { form: '火', period: '小篆' }, { form: '火', period: '楷书' }],
      '木': [{ form: '🌳', period: '甲骨文' }, { form: '木', period: '金文' }, { form: '木', period: '小篆' }, { form: '木', period: '楷书' }]
    }
    return evolutionMap[character] || [{ form: character, period: '楷书' }]
  },

  // 生成汉字组词数据
  generateWordsForCharacter(character) {
    // 这里可以从数据库获取真实的组词数据
    // 暂时使用简化版本
    const wordsMap = {
      '日': [
        { text: '太阳', pinyin: 'tài yáng', meaning: '太阳系的中心天体' },
        { text: '日出', pinyin: 'rì chū', meaning: '太阳从东方升起' },
        { text: '日光', pinyin: 'rì guāng', meaning: '太阳的光芒' },
        { text: '日记', pinyin: 'rì jì', meaning: '每天记录的文字' }
      ],
      '月': [
        { text: '月亮', pinyin: 'yuè liàng', meaning: '地球的卫星' },
        { text: '月光', pinyin: 'yuè guāng', meaning: '月亮的光芒' },
        { text: '月饼', pinyin: 'yuè bǐng', meaning: '中秋节的传统食品' },
        { text: '月份', pinyin: 'yuè fèn', meaning: '时间的单位' }
      ],
      '山': [
        { text: '山峰', pinyin: 'shān fēng', meaning: '山的最高点' },
        { text: '山水', pinyin: 'shān shuǐ', meaning: '山和水，指自然风景' },
        { text: '爬山', pinyin: 'pá shān', meaning: '攀登山峰' },
        { text: '火山', pinyin: 'huǒ shān', meaning: '喷发岩浆的山' }
      ],
      '水': [
        { text: '河水', pinyin: 'hé shuǐ', meaning: '河流中的水' },
        { text: '水果', pinyin: 'shuǐ guǒ', meaning: '多汁的果实' },
        { text: '水平', pinyin: 'shuǐ píng', meaning: '平坦的程度' },
        { text: '水彩', pinyin: 'shuǐ cǎi', meaning: '用水调和的颜料' }
      ],
      '火': [
        { text: '火焰', pinyin: 'huǒ yàn', meaning: '燃烧的火苗' },
        { text: '火车', pinyin: 'huǒ chē', meaning: '铁路交通工具' },
        { text: '火柴', pinyin: 'huǒ chái', meaning: '点火的小木棍' },
        { text: '火山', pinyin: 'huǒ shān', meaning: '喷发岩浆的山' }
      ],
      '木': [
        { text: '树木', pinyin: 'shù mù', meaning: '高大的植物' },
        { text: '木头', pinyin: 'mù tou', meaning: '树木的材质' },
        { text: '木工', pinyin: 'mù gōng', meaning: '制作木器的工匠' },
        { text: '木瓜', pinyin: 'mù guā', meaning: '一种水果' }
      ]
    }
    return wordsMap[character] || [
      { text: character + '字', pinyin: this.getPinyin(character), meaning: '由' + character + '组成的词' }
    ]
  },

  // 获取拼音（简化版本）
  getPinyin(character) {
    // 这里可以使用更精确的拼音库
    const pinyinMap = {
      '一': 'yī', '二': 'èr', '三': 'sān', '四': 'sì', '五': 'wǔ', '六': 'liù', '七': 'qī', '八': 'bā', '九': 'jiǔ', '十': 'shí',
      '人': 'rén', '口': 'kǒu', '日': 'rì', '月': 'yuè', '山': 'shān', '水': 'shuǐ', '火': 'huǒ', '木': 'mù', '土': 'tǔ', '大': 'dà',
      '小': 'xiǎo', '上': 'shàng', '下': 'xià', '中': 'zhōng', '天': 'tiān', '地': 'dì', '你': 'nǐ', '我': 'wǒ', '他': 'tā', '她': 'tā',
      '它': 'tā', '爸': 'bà', '妈': 'mā', '哥': 'gē', '弟': 'dì', '姐': 'jiě', '妹': 'mèi', '百': 'bǎi', '千': 'qiān', '万': 'wàn',
      '家': 'jiā', '学': 'xué', '校': 'xiào', '老': 'lǎo', '师': 'shī', '生': 'shēng', '书': 'shū', '笔': 'bǐ', '纸': 'zhǐ'
    }
    return pinyinMap[character] || character
  },

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