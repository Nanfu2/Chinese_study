import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { auth, userService } from '../services/supabase'

export const useMainStore = defineStore('main', () => {
  // 状态
  const user = ref(null)
  const isAuthenticated = ref(false)
  const loading = ref(false)
  const error = ref(null)
  const currentChild = ref(null)
  const children = ref([])
  
  // 计算属性
  const isParent = computed(() => {
    return user.value?.user_metadata?.role === 'parent'
  })
  
  const isAdmin = computed(() => {
    return user.value?.user_metadata?.role === 'admin'
  })
  
  // 动作
  const setUser = async (userData) => {
    user.value = userData
    isAuthenticated.value = !!userData
    
    console.log('设置用户:', userData)
    console.log('用户角色:', userData?.user_metadata?.role)
    
    // 根据用户角色执行不同的初始化逻辑
    if (!userData) {
      return
    }
    
    // 管理员用户不执行家长相关的初始化
    if (userData.user_metadata?.role === 'admin') {
      console.log('管理员用户登录，跳过家长初始化流程')
      return
    }
    
    // 如果是家长，确保家长记录存在并获取孩子列表
    if (userData.user_metadata?.role === 'parent' || !userData.user_metadata?.role) {
      // 默认所有非管理员认证用户都是家长
      try {
        console.log('开始检查家长记录，用户ID:', userData.id)
        
        // 确保家长信息存在
        let parentInfo = await userService.getParentInfo(userData.id)
        console.log('获取到的家长信息:', parentInfo)
        
        if (!parentInfo || !parentInfo.id || parentInfo.id.startsWith('parent_')) {
          // 如果家长信息不存在或是模拟数据，自动创建家长记录
          console.log('家长记录不存在，开始创建...')
          parentInfo = await userService.createParent({
            user_id: userData.id,
            name: userData.email ? userData.email.split('@')[0] : '家长',
            contact_phone: '',
            avatar_url: userData.user_metadata?.avatar_url || ''
          })
          console.log('自动创建家长记录成功:', parentInfo)
          
          // 确保parentInfo.id有效
          if (!parentInfo || !parentInfo.id) {
            console.error('家长记录创建失败，parent_id无效')
            throw new Error('家长记录创建失败')
          }
        } else {
          console.log('家长记录已存在:', parentInfo)
        }
        
        // 使用正确的parent_id加载孩子列表
        await loadChildren(parentInfo.id)
        console.log('孩子列表加载完成:', children.value)
        
      } catch (error) {
        console.error('创建家长记录或加载孩子列表失败:', error)
        // 即使创建家长记录失败，也继续设置用户状态
      }
    }
  }
  
  const login = async (email, password) => {
    loading.value = true
    error.value = null

    try {
      const data = await auth.signIn(email, password)
      const userData = data.user
      await setUser(userData)
      return userData
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const register = async (email, password, userData) => {
    loading.value = true
    error.value = null

    try {
      // 确保新用户默认为家长角色
      const userDataWithRole = {
        ...userData,
        role: 'parent' // 默认设置为家长角色
      }
      
      const data = await auth.signUp(email, password, userDataWithRole)
      const newUserData = data.user
      
      if (newUserData) {
        // 立即设置用户并创建家长记录
        await setUser(newUserData)
        console.log('注册成功，用户已设置:', newUserData)
        return newUserData
      } else {
        // 如果邮箱验证启用，用户数据可能为空，需要手动获取
        const currentUser = await auth.getCurrentUser()
        if (currentUser) {
          await setUser(currentUser)
          console.log('通过getCurrentUser获取用户:', currentUser)
          return currentUser
        }
        throw new Error('注册成功但无法获取用户信息')
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const logout = async () => {
    try {
      await auth.signOut()
      user.value = null
      isAuthenticated.value = false
      currentChild.value = null
      children.value = []
    } catch (err) {
      error.value = err.message
      throw err
    }
  }
  
  const loadChildren = async (parentId) => {
    try {
      console.log('正在加载孩子列表，家长ID:', parentId);
      const data = await userService.getChildren(parentId)
      console.log('从服务获取到的孩子数据:', data);
      children.value = data || []
    } catch (err) {
      console.error('加载孩子列表失败:', err)
      error.value = err.message
      children.value = [] // 确保在出错时设置为空数组
      throw err; // 抛出错误以便调用者可以处理
    }
  }
  
  const setCurrentChild = (child) => {
    currentChild.value = child
  }
  
  const addChild = async (childData) => {
    try {
      console.log('开始添加孩子，原始数据:', childData);
      console.log('当前用户:', user.value);
      
      // 检查用户是否已登录
      if (!user.value || !user.value.id) {
        throw new Error('用户未登录或用户ID无效');
      }
      
      // 首先确保家长信息存在
      let parentInfo = await userService.getParentInfo(user.value.id)
      console.log('获取到的家长信息:', parentInfo);
      
      if (!parentInfo || !parentInfo.id) {
        // 如果家长信息不存在，创建家长信息
        console.log('家长信息不存在，正在创建...');
        parentInfo = await userService.createParent({
          user_id: user.value.id,
          name: user.value.email ? user.value.email.split('@')[0] : '家长',
          contact_phone: ''
        })
        console.log('创建的家长信息:', parentInfo);
      }
      
      // 确保parent_id有效
      if (!parentInfo || !parentInfo.id) {
        throw new Error('无法获取有效的家长ID');
      }
      
      console.log('使用家长ID添加孩子:', parentInfo.id);
      // 确保传递给addChild方法的数据格式正确
      const childDataWithParentId = {
        ...childData,
        parent_id: parentInfo.id
      };
      
      console.log('准备添加的孩子数据:', childDataWithParentId);
      const newChild = await userService.addChild(childDataWithParentId)
      
      // 重新加载孩子列表以确保数据一致性
      await loadChildren(user.value.id);
      return newChild
    } catch (err) {
      console.error('添加孩子失败的完整错误:', err);
      error.value = err.message
      throw err
    }
  }
  
  const updateChild = async (childId, childData) => {
    try {
      const result = await userService.updateChild(childId, childData)
      
      // 检查result是否为null或undefined
      if (!result) {
        const err = new Error('更新孩子失败: 服务器未返回有效响应')
        error.value = err.message
        throw err
      }
      
      if (result.error) {
        console.error('更新孩子失败:', result.error)
        error.value = result.error.message
        throw result.error
      }
      
      if (!result.data) {
        const err = new Error('更新孩子失败: 服务器返回空数据')
        error.value = err.message
        throw err
      }
      
      const index = children.value.findIndex(child => child.id === childId)
      if (index !== -1) {
        children.value[index] = result.data
      }
      
      return result.data
    } catch (err) {
      console.error('更新孩子失败:', err)
      error.value = err.message
      throw err
    }
  }
  
  const deleteChild = async (childId) => {
    try {
      await userService.deleteChild(childId)
      const index = children.value.findIndex(child => child.id === childId)
      if (index !== -1) {
        children.value.splice(index, 1)
      }
      
      // 如果删除的是当前选中的孩子，重新选择第一个孩子
      if (currentChild.value && currentChild.value.id === childId) {
        if (children.value.length > 0) {
          currentChild.value = children.value[0]
        } else {
          currentChild.value = null
        }
      }
      
      return { success: true }
    } catch (err) {
      error.value = err.message
      throw err
    }
  }
  
  const loadUser = async () => {
    try {
      // 从Supabase获取当前用户信息
      const userData = await auth.getCurrentUser()
      if (userData) {
        await setUser(userData)
      }
    } catch (err) {
      console.error('加载用户信息失败:', err)
      error.value = err.message
      throw err; // 抛出错误以便调用者可以处理
    }
  }

  return {
    user,
    isAuthenticated,
    loading,
    error,
    currentChild,
    children,
    isParent,
    isAdmin,
    login,
    register,
    logout,
    setCurrentChild,
    addChild,
    updateChild,
    deleteChild,
    loadUser,
    loadChildren
  }
})