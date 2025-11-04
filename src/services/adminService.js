import { supabase, supabaseAdmin } from './supabase'

export const adminService = {
  // 获取所有用户列表
  async getAllUsers() {
      try {
        // 使用服务端密钥的Supabase客户端获取用户列表
        const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()

        if (error) {
          console.error('从Supabase Auth获取用户失败:', error)
          throw error
        }

        // 转换用户数据为所需的格式
        const authUsers = users.map(user => {
          // 改进角色映射逻辑
          let displayRole = '用户'; // 默认显示为用户
          const rawRole = user.role || user.user_metadata?.role;
          
          // 根据角色值映射为更友好的显示名称
          if (rawRole === 'admin' || rawRole === 'administrator') {
            displayRole = '管理员';
          } else if (rawRole === 'parent' || rawRole === 'guardian') {
            displayRole = '家长';
          }
          
          return {
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || '未命名用户',
            email: user.email || '未设置邮箱',
            avatar: '/logo.svg',
            role: displayRole,
            registeredAt: user.created_at ? new Date(user.created_at).toLocaleString('zh-CN') : '未知时间',
            active: !!user.email_confirmed_at
          };
        })

        return authUsers
      } catch (error) {
        console.error('获取用户列表失败:', error)
        throw error
      }
  },

  // 更新用户角色
  async updateUserRole(userId, role) {
    try {
      console.log(`尝试更新用户 ${userId} 的角色为 ${role}`)
      
      // 尝试使用服务端密钥客户端更新用户角色
      const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: { role: role }
      })

      if (error) {
        console.error('更新用户角色失败:', error)
        throw error
      }

      return { success: true, message: '角色更新成功' }
    } catch (error) {
      console.error('更新用户角色出错:', error)
      throw error
    }
  },

  // 更新用户状态（启用/禁用）
  async updateUserStatus(userId, active) {
    try {
      console.log(`尝试更新用户 ${userId} 的状态为 ${active}`)
      
      // 使用服务端密钥客户端更新用户状态
      const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        banned_until: active ? null : '2100-12-31T23:59:59.999Z'
      })

      if (error) {
        console.error('更新用户状态失败:', error)
        throw error
      }

      return { success: true, message: '状态更新成功' }
    } catch (error) {
      console.error('更新用户状态出错:', error)
      throw error
    }
  },

  // 删除用户
  async deleteUser(userId) {
    try {
      console.log(`尝试删除用户 ${userId}`)
      
      // 使用服务端密钥客户端删除用户
      const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)

      if (error) {
        console.error('删除用户失败:', error)
        throw new Error('删除用户失败')
      }
    } catch (error) {
      console.error('删除用户出错:', error)
      throw error
    }
  }
}