import { auth, userService, contentService, learningService } from './supabase'
import { extendedContentService, extendedLearningService, fileUploadService } from './supabase_extended'

// API服务类 - 封装所有后端业务逻辑
export class ApiService {
  constructor() {
    this.auth = auth
    this.userService = userService
    this.contentService = contentService
    this.learningService = learningService
    this.extendedContentService = extendedContentService
    this.extendedLearningService = extendedLearningService
    this.fileUploadService = fileUploadService
  }

  // 认证相关方法
  async login(email, password) {
    return await this.auth.signIn(email, password)
  }

  async register(email, password, userData) {
    return await this.auth.signUp(email, password, userData)
  }

  async logout() {
    return await this.auth.signOut()
  }

  async getCurrentUser() {
    return await this.auth.getCurrentUser()
  }

  // 用户管理相关方法
  async getParentInfo(userId) {
    return await this.userService.getParentInfo(userId)
  }

  async getChildren(parentId) {
    return await this.userService.getChildren(parentId)
  }

  async addChild(childData) {
    return await this.userService.addChild(childData)
  }

  // 内容管理相关方法
  async getAnimations(filters = {}) {
    return await this.contentService.getAnimations(filters)
  }

  async getAnimationById(id) {
    return await this.contentService.getAnimationById(id)
  }

  async getCategories() {
    return await this.extendedContentService.getCategories()
  }

  // 学习记录相关方法
  async recordWatchHistory(record) {
    return await this.learningService.recordWatchHistory(record)
  }

  async recordInteraction(interaction) {
    return await this.learningService.recordInteraction(interaction)
  }

  async getLearningStats(childId, timeRange = 'week') {
    return await this.learningService.getLearningStats(childId, timeRange)
  }

  // 拼音学习相关方法
  async getPinyinLessons() {
    return await this.extendedContentService.getPinyinLessons()
  }

  // 汉字学习相关方法
  async getChineseCharacters(limit = 20) {
    return await this.extendedContentService.getChineseCharacters(limit)
  }

  // 成就系统相关方法
  async getAchievements() {
    return await this.extendedContentService.getAchievements()
  }

  async getChildAchievements(childId) {
    return await this.extendedContentService.getChildAchievements(childId)
  }

  // 统计分析相关方法
  async getDashboardStats(userId) {
    return await this.extendedLearningService.getDashboardStats(userId)
  }

  // 文件上传相关方法
  async uploadFile(file, type = 'avatar') {
    const bucketName = type === 'avatar' ? 'avatars' : 'uploads'
    return await this.fileUploadService.uploadFile(file, bucketName)
  }
}

// 创建全局API服务实例
export const apiService = new ApiService()

export default apiService