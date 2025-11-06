import { supabaseAdmin } from './supabase'

/**
 * 统计分析服务
 * 提供各种统计数据的查询功能
 */

const statisticsService = {
  
  /**
   * 获取用户统计信息
   * @param {string} timeRange - 时间范围: '7d', '30d', '90d', '1y'
   * @returns {Promise<Object>} 用户统计数据
   */
  async getUserStatistics(timeRange = '30d') {
    try {
      console.log('开始获取用户统计信息，时间范围:', timeRange)
      const dateRange = this.getDateRange(timeRange)
      
      // 获取总用户数 - 使用正确的count语法
      const { count: totalUsers, error: totalError } = await supabaseAdmin
        .from('parents')
        .select('*', { count: 'exact', head: true })
      
      if (totalError) {
        console.error('获取总用户数失败:', totalError)
        throw totalError
      }
      console.log('总用户数查询结果:', totalUsers)
      
      // 获取活跃用户数（指定时间范围内有活动的用户）
      const { count: activeUsers, error: activeError } = await supabaseAdmin
        .from('watch_history')
        .select('*', { count: 'exact', head: true })
        .gte('watched_at', dateRange.startDate)
        .lte('watched_at', dateRange.endDate)
      
      if (activeError) {
        console.error('获取活跃用户数失败:', activeError)
        throw activeError
      }
      console.log('活跃用户数查询结果:', activeUsers)
      
      // 获取平均学习时长
      const { data: learningTimeData, error: timeError } = await supabaseAdmin
        .from('watch_history')
        .select('watch_duration')
        .gte('watched_at', dateRange.startDate)
        .lte('watched_at', dateRange.endDate)
      
      if (timeError) {
        console.error('获取学习时长数据失败:', timeError)
        throw timeError
      }
      console.log('学习时长数据查询结果:', learningTimeData?.length || 0, '条记录')
      
      const avgLearningTime = learningTimeData && learningTimeData.length > 0 
        ? Math.round(learningTimeData.reduce((sum, item) => sum + (item.watch_duration || 0), 0) / learningTimeData.length / 60) 
        : 0
      
      // 获取上期数据用于计算增长率
      const previousRange = this.getPreviousDateRange(timeRange)
      const { count: previousUsers, error: previousError } = await supabaseAdmin
        .from('parents')
        .select('*', { count: 'exact', head: true })
        .lt('created_at', previousRange.endDate)
      
      if (previousError) {
        console.error('获取上期用户数失败:', previousError)
        throw previousError
      }
      
      const usersGrowth = previousUsers && previousUsers > 0
        ? Math.round(((totalUsers - previousUsers) / previousUsers) * 100)
        : totalUsers > 0 ? 100 : 0
      
      const result = {
        totalUsers: totalUsers || 0,
        usersGrowth,
        activeUsers: activeUsers || 0,
        activeUsersGrowth: 0, // 简化处理
        avgLearningTime,
        learningTimeGrowth: 0 // 简化处理
      }
      
      console.log('用户统计信息结果:', result)
      return result
    } catch (error) {
      console.error('获取用户统计信息失败:', error)
      throw error
    }
  },

  /**
   * 获取用户增长趋势数据
   * @param {string} timeRange - 时间范围
   * @returns {Promise<Array>} 用户增长趋势数据
   */
  async getUserGrowthTrend(timeRange = '30d') {
    try {
      const dateRange = this.getDateRange(timeRange)
      const interval = this.getIntervalForTimeRange(timeRange)
      
      // 按时间间隔分组统计用户注册数
      const { data, error } = await supabaseAdmin
        .from('parents')
        .select('created_at')
        .gte('created_at', dateRange.startDate)
        .lte('created_at', dateRange.endDate)
      
      if (error) throw error
      
      // 按时间间隔分组统计
      const groupedData = this.groupDataByInterval(data, 'created_at', interval)
      
      return groupedData.map(item => ({
        date: item.interval,
        count: item.count
      }))
    } catch (error) {
      console.error('获取用户增长趋势失败:', error)
      throw error
    }
  },

  /**
   * 获取内容访问分布数据
   * @param {string} timeRange - 时间范围
   * @returns {Promise<Array>} 内容访问分布数据
   */
  async getContentAccessDistribution(timeRange = '30d') {
    try {
      console.log('开始获取内容访问分布，时间范围:', timeRange)
      const dateRange = this.getDateRange(timeRange)
      
      // 获取动画内容的访问量
      const { count: animationViews, error: animationError } = await supabaseAdmin
        .from('watch_history')
        .select('*', { count: 'exact', head: true })
        .gte('watched_at', dateRange.startDate)
        .lte('watched_at', dateRange.endDate)
      
      if (animationError) {
        console.error('获取动画访问量失败:', animationError)
        throw animationError
      }
      console.log('动画访问量查询结果:', animationViews)
      
      // 获取拼音学习访问量（简化处理，统计拼音课程数量）
      const { count: pinyinCount, error: pinyinError } = await supabaseAdmin
        .from('pinyin_lessons')
        .select('*', { count: 'exact', head: true })
      
      if (pinyinError) {
        console.error('获取拼音学习数据失败:', pinyinError)
        throw pinyinError
      }
      console.log('拼音学习数据查询结果:', pinyinCount)
      
      // 获取汉字学习访问量（简化处理，统计汉字数量）
      const { count: charactersCount, error: charactersError } = await supabaseAdmin
        .from('chinese_characters')
        .select('*', { count: 'exact', head: true })
      
      if (charactersError) {
        console.error('获取汉字学习数据失败:', charactersError)
        throw charactersError
      }
      console.log('汉字学习数据查询结果:', charactersCount)
      
      const total = animationViews + pinyinCount + charactersCount
      const result = [
        {
          type: '动画',
          count: animationViews || 0,
          percentage: total > 0 ? Math.round((animationViews / total) * 100) : 0
        },
        {
          type: '拼音学习',
          count: pinyinCount || 0,
          percentage: total > 0 ? Math.round((pinyinCount / total) * 100) : 0
        },
        {
          type: '汉字学习',
          count: charactersCount || 0,
          percentage: total > 0 ? Math.round((charactersCount / total) * 100) : 0
        },
        {
          type: '其他',
          count: 0,
          percentage: 0
        }
      ]
      
      console.log('内容访问分布结果:', result)
      return result
    } catch (error) {
      console.error('获取内容访问分布失败:', error)
      throw error
    }
  },

  /**
   * 获取热门内容排行榜
   * @param {string} timeRange - 时间范围
   * @param {number} limit - 返回数量限制
   * @returns {Promise<Array>} 热门内容排行榜
   */
  async getPopularContent(timeRange = '30d', limit = 10) {
    try {
      console.log('开始获取热门内容排行榜，时间范围:', timeRange, '限制:', limit)
      const dateRange = this.getDateRange(timeRange)
      
      // 获取动画内容的观看统计
      const { data: animationStats, error } = await supabaseAdmin
        .from('watch_history')
        .select(`
          animation_id,
          animations!inner(title, thumbnail_url),
          watch_duration
        `)
        .gte('watched_at', dateRange.startDate)
        .lte('watched_at', dateRange.endDate)
      
      if (error) {
        console.error('获取热门内容数据失败:', error)
        throw error
      }
      console.log('热门内容数据查询结果:', animationStats?.length || 0, '条记录')
      
      // 如果没有数据，返回空数组
      if (!animationStats || animationStats.length === 0) {
        console.log('没有找到热门内容数据，返回空数组')
        return []
      }
      
      // 按动画分组统计
      const groupedStats = {}
      animationStats.forEach(stat => {
        const animationId = stat.animation_id
        if (!groupedStats[animationId]) {
          groupedStats[animationId] = {
            views: 0,
            totalDuration: 0,
            animation: stat.animations
          }
        }
        groupedStats[animationId].views++
        groupedStats[animationId].totalDuration += (stat.watch_duration || 0)
      })
      
      // 转换为数组并排序
      const popularContent = Object.values(groupedStats)
        .map(item => ({
          id: item.animation?.id || 'unknown',
          title: item.animation?.title || '未知内容',
          thumbnail: item.animation?.thumbnail_url || '/logo.svg',
          type: '动画',
          views: item.views,
          avgTime: item.views > 0 ? Math.round(item.totalDuration / item.views / 60) : 0, // 转换为分钟
          trend: Math.round(Math.random() * 30) - 15 // 模拟趋势数据
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, limit)
      
      console.log('热门内容排行榜结果:', popularContent)
      return popularContent
    } catch (error) {
      console.error('获取热门内容排行榜失败:', error)
      throw error
    }
  },

  /**
   * 获取时间范围对应的日期
   * @param {string} timeRange - 时间范围
   * @returns {Object} 开始和结束日期
   */
  getDateRange(timeRange) {
    const endDate = new Date()
    let startDate = new Date()
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(endDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(endDate.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1)
        break
      default:
        startDate.setDate(endDate.getDate() - 30)
    }
    
    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    }
  },

  /**
   * 获取上期时间范围
   * @param {string} timeRange - 当前时间范围
   * @returns {Object} 上期开始和结束日期
   */
  getPreviousDateRange(timeRange) {
    const currentRange = this.getDateRange(timeRange)
    const endDate = new Date(currentRange.startDate)
    let startDate = new Date(currentRange.startDate)
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(endDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(endDate.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1)
        break
      default:
        startDate.setDate(endDate.getDate() - 30)
    }
    
    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    }
  },

  /**
   * 根据时间范围获取合适的时间间隔
   * @param {string} timeRange - 时间范围
   * @returns {string} 时间间隔
   */
  getIntervalForTimeRange(timeRange) {
    switch (timeRange) {
      case '7d':
        return 'day'
      case '30d':
        return 'day'
      case '90d':
        return 'week'
      case '1y':
        return 'month'
      default:
        return 'day'
    }
  },

  /**
   * 按时间间隔分组数据
   * @param {Array} data - 原始数据
   * @param {string} dateField - 日期字段名
   * @param {string} interval - 时间间隔
   * @returns {Array} 分组后的数据
   */
  groupDataByInterval(data, dateField, interval) {
    const groups = {}
    
    data?.forEach(item => {
      const date = new Date(item[dateField])
      let groupKey
      
      switch (interval) {
        case 'day':
          groupKey = date.toISOString().split('T')[0]
          break
        case 'week':
          const weekStart = new Date(date)
          weekStart.setDate(date.getDate() - date.getDay())
          groupKey = weekStart.toISOString().split('T')[0]
          break
        case 'month':
          groupKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
          break
        default:
          groupKey = date.toISOString().split('T')[0]
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = 0
      }
      groups[groupKey]++
    })
    
    return Object.entries(groups).map(([interval, count]) => ({
      interval,
      count
    })).sort((a, b) => a.interval.localeCompare(b.interval))
  }
}

export { statisticsService };
export default statisticsService;