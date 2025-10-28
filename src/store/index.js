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
    
    // 如果是家长，获取孩子列表
    if (userData && userData.user_metadata?.role === 'parent') {
      await loadChildren(userData.id)
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
      const data = await auth.signUp(email, password, userData)
      const newUserData = data.user
      await setUser(newUserData)
      return newUserData
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
      const data = await userService.getChildren(parentId)
      children.value = data
    } catch (err) {
      error.value = err.message
    }
  }
  
  const setCurrentChild = (child) => {
    currentChild.value = child
  }
  
  const addChild = async (childData) => {
    try {
      const newChild = await userService.addChild({
        ...childData,
        parent_id: user.value.id
      })
      children.value.push(newChild)
      return newChild
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
    loadUser
  }
})