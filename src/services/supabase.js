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
      // 模拟环境下的登录功能
      // 检查是否为开发环境或Supabase配置不完整
      const isDevelopment = import.meta.env.DEV || !import.meta.env.VITE_SUPABASE_URL;
      
      if (isDevelopment) {
        // 模拟登录成功响应
        console.log('模拟登录:', { email, password });
        
        // 模拟简单的验证逻辑
        if (!email || !password) {
          throw new Error('请输入邮箱和密码');
        }
        if (password.length < 6) {
          throw new Error('密码长度至少为6个字符');
        }
        
        // 创建更完整的模拟用户数据
        const mockUser = {
          id: `user_${email.replace(/[^a-z0-9]/g, '')}_${Date.now()}`,
          email: email,
          user_metadata: {
            role: email.includes('admin') ? 'admin' : 'parent',
            created_at: new Date().toISOString()
          },
          aud: 'authenticated',
          email_confirmed_at: new Date().toISOString(),
          // 确保返回的数据结构与store期望的一致
          app_metadata: { provider: 'email' },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // 在模拟环境中保存用户到localStorage
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        return {
          user: mockUser,
          session: {
            access_token: 'mock_access_token_' + Date.now(),
            refresh_token: 'mock_refresh_token_' + Date.now(),
            expires_at: Date.now() + 3600000 // 1小时后过期
          }
        };
      }
      
      // 生产环境使用真实Supabase
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
      // 模拟环境下的注册功能
      // 检查是否为开发环境或Supabase配置不完整
      const isDevelopment = import.meta.env.DEV || !import.meta.env.VITE_SUPABASE_URL;
      
      if (isDevelopment) {
        // 模拟注册成功响应
        console.log('模拟注册:', { email, password, userData });
        
        // 验证输入
        if (!email || !password) {
          throw new Error('请输入邮箱和密码');
        }
        if (password.length < 6) {
          throw new Error('密码长度至少为6个字符');
        }
        
        // 创建更完整的模拟用户数据
        const mockUser = {
          id: `user_${Date.now()}`,
          email: email,
          user_metadata: {
            ...userData,
            created_at: new Date().toISOString()
          },
          aud: 'authenticated',
          email_confirmed_at: new Date().toISOString(),
          // 确保返回的数据结构与store期望的一致
          app_metadata: { provider: 'email' },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // 在模拟环境中保存用户到localStorage
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        return {
          user: mockUser,
          session: {
            access_token: 'mock_access_token_' + Date.now(),
            refresh_token: 'mock_refresh_token_' + Date.now(),
            expires_at: Date.now() + 3600000 // 1小时后过期
          }
        };
      }
      
      // 生产环境使用真实Supabase
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
      // 模拟环境下的登出功能
      const isDevelopment = import.meta.env.DEV || !import.meta.env.VITE_SUPABASE_URL;
      
      if (isDevelopment) {
        console.log('模拟登出');
        // 在模拟环境中清除本地存储的用户信息
        localStorage.removeItem('user');
        return;
      }
      
      // 生产环境使用真实Supabase
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
      // 模拟环境下获取当前用户
      const isDevelopment = import.meta.env.DEV || !import.meta.env.VITE_SUPABASE_URL;
      
      if (isDevelopment) {
        console.log('模拟获取当前用户');
        // 从本地存储获取模拟用户（如果有）
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          try {
            const userData = JSON.parse(savedUser);
            // 确保返回的数据结构完整
            if (!userData.user_metadata) {
              userData.user_metadata = {};
            }
            return userData;
          } catch (parseError) {
            console.error('解析用户数据失败:', parseError);
            localStorage.removeItem('user');
            return null;
          }
        }
        // 如果没有保存的用户，返回null
        return null;
      }
      
      // 生产环境使用真实Supabase
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
    // 模拟环境下获取家长信息
    const isDevelopment = import.meta.env.DEV || !import.meta.env.VITE_SUPABASE_URL;
    
    if (isDevelopment) {
      console.log('模拟获取家长信息');
      return {
        id: `parent_${userId}`,
        user_id: userId,
        name: '测试家长',
        contact_phone: '13800138000'
      };
    }
    
    // 生产环境使用真实Supabase
    const { data, error } = await supabase
      .from('parents')
      .select('*')
      .eq('user_id', userId)
      .single()
    if (error) throw error
    return data
  },
  
  // 获取孩子列表
  getChildren: async (parentId) => {
    // 模拟环境下获取孩子列表
    const isDevelopment = import.meta.env.DEV || !import.meta.env.VITE_SUPABASE_URL;
    
    if (isDevelopment) {
      console.log('模拟获取孩子列表');
      // 返回模拟数据
      return [
        {
          id: 'child_1',
          parent_id: parentId,
          name: '小明',
          age: 6,
          avatar: 'https://randomuser.me/api/portraits/children/1.jpg'
        },
        {
          id: 'child_2',
          parent_id: parentId,
          name: '小红',
          age: 4,
          avatar: 'https://randomuser.me/api/portraits/children/2.jpg'
        }
      ];
    }
    
    // 生产环境使用真实Supabase
    const { data, error } = await supabase
      .from('children')
      .select('*')
      .eq('parent_id', parentId)
    if (error) throw error
    return data
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
    let query = supabase.from('animations').select('*')
    
    // 应用筛选条件
    if (filters.category) query = query.eq('category', filters.category)
    if (filters.ageGroup) query = query.eq('age_group', filters.ageGroup)
    if (filters.difficulty) query = query.eq('difficulty', filters.difficulty)
    
    const { data, error } = await query.order('order', { ascending: true })
    if (error) throw error
    return data
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