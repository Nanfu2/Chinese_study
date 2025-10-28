import { createClient } from '@supabase/supabase-js'

// 创建Supabase客户端
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key'
)

// 认证相关
export const auth = {
  // 登录
  signIn: async (email, password) => {
    try {
      // 直接使用真实Supabase认证
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  },
  
  // 注册
  signUp: async (email, password, userData) => {
    try {
      // 直接使用真实Supabase注册
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('注册失败:', error);
      throw error;
    }
  },
  
  // 登出
  signOut: async () => {
    try {
      // 直接使用真实Supabase登出
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('登出失败:', error);
      throw error;
    }
  },
  
  // 获取当前用户
  getCurrentUser: async () => {
    try {
      // 直接使用真实Supabase获取当前用户
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('获取当前用户失败:', error);
      return null;
    }
  },
  
  // 更新用户信息
  updateUser: async (userData) => {
    const { data, error } = await supabase.auth.updateUser({
      data: userData
    })
    if (error) throw error
    return data
  }
}

// 用户相关
export const userService = {
  // 获取家长信息
  getParentInfo: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('parents')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error) {
        // 如果表不存在或没有数据，返回模拟数据
        if (error.code === 'PGRST116' || error.message.includes('不存在')) {
          console.log('家长表不存在，返回模拟数据');
          return {
            id: `parent_${userId}`,
            user_id: userId,
            name: '测试家长',
            contact_phone: '13800138000'
          };
        }
        throw error;
      }
      
      return data
    } catch (error) {
      console.error('获取家长信息失败:', error);
      // 返回模拟数据作为降级方案
      return {
        id: `parent_${userId}`,
        user_id: userId,
        name: '测试家长',
        contact_phone: '13800138000'
      };
    }
  },
  
  // 获取孩子列表
  getChildren: async (parentId) => {
    try {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('parent_id', parentId)
      
      if (error) {
        // 如果表不存在或没有数据，返回模拟数据
        if (error.code === 'PGRST116' || error.message.includes('不存在')) {
          console.log('孩子表不存在，返回模拟数据');
          return [
            {
              id: 'child_1',
              parent_id: parentId,
              name: '小明',
              age: 6,
              avatar_url: 'https://randomuser.me/api/portraits/children/1.jpg'
            }
          ];
        }
        throw error;
      }
      
      return data
    } catch (error) {
      console.error('获取孩子列表失败:', error);
      // 返回模拟数据作为降级方案
      return [
        {
          id: 'child_1',
          parent_id: parentId,
          name: '小明',
          age: 6,
          avatar_url: 'https://randomuser.me/api/portraits/children/1.jpg'
        }
      ];
    }
  },
  
  // 添加儿童
  addChild: async (childData) => {
    const { data, error } = await supabase
      .from('children')
      .insert(childData)
      .single()
    if (error) throw error
    return data
  }
}

// 动画内容相关
export const contentService = {
  // 获取动画列表
  getAnimations: async (filters = {}) => {
    try {
      let query = supabase.from('animations').select('*')
      
      // 应用筛选条件
      if (filters.category) query = query.eq('category_id', filters.category)
      if (filters.ageGroup) query = query.eq('age_group', filters.ageGroup)
      if (filters.difficulty) query = query.eq('difficulty', filters.difficulty)
      
      const { data, error } = await query.order('sort_order', { ascending: true })
      
      if (error) {
        // 如果表不存在或没有数据，返回模拟数据
        if (error.code === 'PGRST116' || error.message.includes('不存在')) {
          console.log('动画表不存在，返回模拟数据');
          return [
            {
              id: '1',
              title: '波波精灵和阿阿精灵',
              description: '学习声母b和韵母a的发音',
              video_url: '/videos/pinyin-ba.mp4',
              thumbnail_url: '/pinyin-ba.jpg',
              duration: 300,
              category_id: '1',
              age_group: 'preschool',
              difficulty: 'easy',
              is_active: true
            }
          ];
        }
        throw error;
      }
      
      return data
    } catch (error) {
      console.error('获取动画列表失败:', error);
      // 返回模拟数据作为降级方案
      return [
        {
          id: '1',
          title: '波波精灵和阿阿精灵',
          description: '学习声母b和韵母a的发音',
          video_url: '/videos/pinyin-ba.mp4',
          thumbnail_url: '/pinyin-ba.jpg',
          duration: 300,
          category_id: '1',
          age_group: 'preschool',
          difficulty: 'easy',
          is_active: true
        }
      ];
    }
  },
  
  // 获取单个动画详情
  getAnimationById: async (id) => {
    const { data, error } = await supabase
      .from('animations')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }
}

// 学习记录相关
export const learningService = {
  // 记录观看历史
  recordWatchHistory: async (record) => {
    const { data, error } = await supabase
      .from('watch_history')
      .insert(record)
    if (error) throw error
    return data
  },
  
  // 记录互动结果
  recordInteraction: async (interaction) => {
    const { data, error } = await supabase
      .from('interactions')
      .insert(interaction)
    if (error) throw error
    return data
  },
  
  // 获取学习统计
  getLearningStats: async (childId, timeRange = 'week') => {
    let timeFilter = {};
    const now = new Date();
    
    if (timeRange === 'day') {
      timeFilter = { created_at: { gte: new Date(now.setHours(0, 0, 0, 0)) } };
    } else if (timeRange === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      timeFilter = { created_at: { gte: weekAgo } };
    }
    
    const { data, error } = await supabase
      .from('learning_stats')
      .select('*')
      .eq('child_id', childId)
      .match(timeFilter)
    if (error) throw error
    return data
  }
}

export default supabase