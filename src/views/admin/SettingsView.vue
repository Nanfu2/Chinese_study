<template>
  <div class="min-h-screen bg-light text-dark admin-ui">
    <!-- 顶部导航和侧边栏与DashboardView共用样式 -->
    <header class="p-4 bg-white shadow-sm">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center">
          <img src="/logo.svg" alt="萌豆语文动画屋" class="h-10 w-10 rounded-full mr-3" />
          <h1 class="text-2xl font-bold text-primary">管理员后台</h1>
        </div>
        <div class="flex items-center space-x-4">
          <div class="relative">
            <button @click="toggleUserMenu" class="flex items-center space-x-2">
              <img src="/logo.svg" alt="管理员头像" class="h-8 w-8 rounded-full" />
              <span>管理员</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <!-- 用户下拉菜单 -->
            <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
              <button @click="logout" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">退出登录</button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 侧边导航 -->
    <div class="flex">
      <aside class="w-64 bg-gray-100 h-[calc(100vh-64px)] p-4">
        <nav>
          <ul class="space-y-2">
            <li>
              <a 
                href="/admin" 
                class="block px-4 py-3 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              >
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  仪表盘
                </div>
              </a>
            </li>
            <li>
              <a 
                href="/admin/users" 
                class="block px-4 py-3 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              >
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  用户管理
                </div>
              </a>
            </li>
            <li>
              <a 
                href="/admin/content" 
                class="block px-4 py-3 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              >
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  内容管理
                </div>
              </a>
            </li>
            <li>
              <a 
                href="/admin/statistics" 
                class="block px-4 py-3 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              >
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                  统计分析
                </div>
              </a>
            </li>
            <li>
              <a 
                href="/admin/settings" 
                class="block px-4 py-3 rounded-lg bg-primary text-white font-medium"
              >
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  系统设置
                </div>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- 主内容区域 -->
      <main class="flex-1 p-6">
        <div class="container mx-auto">
          <h2 class="text-xl font-bold mb-6">系统设置</h2>

          <!-- 设置选项卡 -->
          <div class="bg-white rounded-lg shadow mb-6">
            <div class="flex border-b">
              <button 
                @click="activeTab = 'general'" 
                :class="[
                  'px-6 py-3 font-medium text-sm',
                  activeTab === 'general' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'
                ]"
              >
                基本设置
              </button>
              <button 
                @click="activeTab = 'security'" 
                :class="[
                  'px-6 py-3 font-medium text-sm',
                  activeTab === 'security' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'
                ]"
              >
                安全设置
              </button>
              <button 
                @click="activeTab = 'notifications'" 
                :class="[
                  'px-6 py-3 font-medium text-sm',
                  activeTab === 'notifications' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'
                ]"
              >
                通知设置
              </button>
              <button 
                @click="activeTab = 'backup'" 
                :class="[
                  'px-6 py-3 font-medium text-sm',
                  activeTab === 'backup' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'
                ]"
              >
                数据备份
              </button>
            </div>
          </div>

          <!-- 基本设置 -->
          <div v-if="activeTab === 'general'" class="bg-white rounded-lg shadow p-6 mb-6">
            <h3 class="text-lg font-medium mb-4">基本设置</h3>
            
            <form @submit.prevent="saveGeneralSettings">
              <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="siteName" class="block text-sm font-medium text-gray-700 mb-1">网站名称</label>
                    <input 
                      id="siteName" 
                      v-model="settings.siteName" 
                      type="text" 
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label for="siteDescription" class="block text-sm font-medium text-gray-700 mb-1">网站描述</label>
                    <input 
                      id="siteDescription" 
                      v-model="settings.siteDescription" 
                      type="text" 
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="defaultLanguage" class="block text-sm font-medium text-gray-700 mb-1">默认语言</label>
                    <select 
                      id="defaultLanguage" 
                      v-model="settings.defaultLanguage" 
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="zh-CN">简体中文</option>
                      <option value="en-US">English</option>
                    </select>
                  </div>
                  
                  <div>
                    <label for="siteTheme" class="block text-sm font-medium text-gray-700 mb-1">网站主题</label>
                    <select 
                      id="siteTheme" 
                      v-model="settings.siteTheme" 
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="light">明亮模式</option>
                      <option value="dark">黑暗模式</option>
                      <option value="auto">自动切换</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">网站Logo</label>
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-16 w-16">
                      <img class="h-16 w-16 rounded" :src="settings.siteLogo" alt="网站Logo">
                    </div>
                    <div class="ml-4">
                      <button type="button" @click="triggerLogoUpload" class="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                        更换Logo
                      </button>
                      <input 
                        ref="logoUpload" 
                        type="file" 
                        accept="image/*" 
                        @change="handleLogoUpload" 
                        class="hidden"
                      />
                    </div>
                  </div>
                  <p class="mt-2 text-sm text-gray-500">推荐尺寸: 200x200px, 支持PNG、JPG、GIF格式</p>
                </div>
                
                <div class="border-t pt-4">
                  <button 
                    type="submit" 
                    class="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    保存更改
                  </button>
                </div>
              </div>
            </form>
          </div>

          <!-- 安全设置 -->
          <div v-if="activeTab === 'security'" class="bg-white rounded-lg shadow p-6 mb-6">
            <h3 class="text-lg font-medium mb-4">安全设置</h3>
            
            <form @submit.prevent="saveSecuritySettings">
              <div class="space-y-6">
                <div>
                  <div class="flex items-center">
                    <input 
                      id="enableCaptcha" 
                      v-model="settings.enableCaptcha" 
                      type="checkbox" 
                      class="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    >
                    <label for="enableCaptcha" class="ml-2 block text-sm font-medium text-gray-700">
                      启用登录验证码
                    </label>
                  </div>
                  <p class="mt-1 text-sm text-gray-500">开启后，用户登录时需要输入验证码，提高账户安全性</p>
                </div>
                
                <div>
                  <div class="flex items-center">
                    <input 
                      id="enable2FA" 
                      v-model="settings.enable2FA" 
                      type="checkbox" 
                      class="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    >
                    <label for="enable2FA" class="ml-2 block text-sm font-medium text-gray-700">
                      启用双因素认证
                    </label>
                  </div>
                  <p class="mt-1 text-sm text-gray-500">开启后，管理员账户登录时需要额外的验证步骤</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="sessionTimeout" class="block text-sm font-medium text-gray-700 mb-1">会话超时时间 (分钟)</label>
                    <input 
                      id="sessionTimeout" 
                      v-model.number="settings.sessionTimeout" 
                      type="number" 
                      min="5" 
                      max="1440" 
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label for="failedLoginAttempts" class="block text-sm font-medium text-gray-700 mb-1">允许失败登录次数</label>
                    <input 
                      id="failedLoginAttempts" 
                      v-model.number="settings.failedLoginAttempts" 
                      type="number" 
                      min="1" 
                      max="10" 
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
                
                <div class="border-t pt-4">
                  <button 
                    type="submit" 
                    class="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    保存更改
                  </button>
                </div>
              </div>
            </form>
          </div>

          <!-- 通知设置 -->
          <div v-if="activeTab === 'notifications'" class="bg-white rounded-lg shadow p-6 mb-6">
            <h3 class="text-lg font-medium mb-4">通知设置</h3>
            
            <form @submit.prevent="saveNotificationSettings">
              <div class="space-y-6">
                <div>
                  <div class="flex items-center">
                    <input 
                      id="emailNotifications" 
                      v-model="settings.emailNotifications" 
                      type="checkbox" 
                      class="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    >
                    <label for="emailNotifications" class="ml-2 block text-sm font-medium text-gray-700">
                      启用邮件通知
                    </label>
                  </div>
                  <p class="mt-1 text-sm text-gray-500">开启后，系统将发送重要事件的邮件通知给管理员</p>
                </div>
                
                <div>
                  <div class="flex items-center">
                    <input 
                      id="pushNotifications" 
                      v-model="settings.pushNotifications" 
                      type="checkbox" 
                      class="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    >
                    <label for="pushNotifications" class="ml-2 block text-sm font-medium text-gray-700">
                      启用浏览器推送通知
                    </label>
                  </div>
                  <p class="mt-1 text-sm text-gray-500">开启后，系统将在浏览器中发送重要事件的推送通知</p>
                </div>
                
                <div v-if="settings.emailNotifications">
                  <label for="adminEmail" class="block text-sm font-medium text-gray-700 mb-1">管理员邮箱</label>
                  <input 
                    id="adminEmail" 
                    v-model="settings.adminEmail" 
                    type="email" 
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div class="border-t pt-4">
                  <h4 class="text-sm font-medium text-gray-700 mb-3">通知类型</h4>
                  
                  <div class="space-y-3">
                    <div class="flex items-center">
                      <input 
                        id="notifyNewUser" 
                        v-model="settings.notifyNewUser" 
                        type="checkbox" 
                        class="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                      >
                      <label for="notifyNewUser" class="ml-2 block text-sm text-gray-700">
                        新用户注册通知
                      </label>
                    </div>
                    
                    <div class="flex items-center">
                      <input 
                        id="notifyContentUpdate" 
                        v-model="settings.notifyContentUpdate" 
                        type="checkbox" 
                        class="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                      >
                      <label for="notifyContentUpdate" class="ml-2 block text-sm text-gray-700">
                        内容更新通知
                      </label>
                    </div>
                    
                    <div class="flex items-center">
                      <input 
                        id="notifySystemAlert" 
                        v-model="settings.notifySystemAlert" 
                        type="checkbox" 
                        class="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                      >
                      <label for="notifySystemAlert" class="ml-2 block text-sm text-gray-700">
                        系统警报通知
                      </label>
                    </div>
                  </div>
                </div>
                
                <div class="border-t pt-4">
                  <button 
                    type="submit" 
                    class="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    保存更改
                  </button>
                </div>
              </div>
            </form>
          </div>

          <!-- 数据备份 -->
          <div v-if="activeTab === 'backup'" class="bg-white rounded-lg shadow p-6 mb-6">
            <h3 class="text-lg font-medium mb-4">数据备份</h3>
            
            <div class="space-y-6">
              <div>
                <div class="flex items-center">
                  <input 
                    id="autoBackup" 
                    v-model="settings.autoBackup" 
                    type="checkbox" 
                    class="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  >
                  <label for="autoBackup" class="ml-2 block text-sm font-medium text-gray-700">
                    启用自动备份
                  </label>
                </div>
                <p class="mt-1 text-sm text-gray-500">开启后，系统将按照设置的频率自动备份数据</p>
              </div>
              
              <div v-if="settings.autoBackup">
                <label for="backupFrequency" class="block text-sm font-medium text-gray-700 mb-1">备份频率</label>
                <select 
                  id="backupFrequency" 
                  v-model="settings.backupFrequency" 
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="daily">每天</option>
                  <option value="weekly">每周</option>
                  <option value="monthly">每月</option>
                </select>
              </div>
              
              <div class="border-t pt-4">
                <h4 class="text-sm font-medium text-gray-700 mb-3">备份历史</h4>
                
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">备份时间</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">文件大小</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="backup in backupHistory" :key="backup.id">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(backup.date) }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatSize(backup.size) }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ backup.status }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            @click="downloadBackup(backup.id)" 
                            class="text-primary hover:text-primary-dark mr-3"
                          >
                            下载
                          </button>
                          <button 
                            @click="restoreBackup(backup.id)" 
                            class="text-blue-600 hover:text-blue-800"
                          >
                            恢复
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div class="border-t pt-4">
                <button 
                  @click="createBackup" 
                  class="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
                >
                  立即备份
                </button>
              </div>
            </div>
          </div>

          <!-- 系统信息 -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-medium mb-4">系统信息</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p class="text-sm text-gray-500 mb-1">系统版本</p>
                <p class="text-sm font-medium text-gray-900">{{ systemInfo.version }}</p>
              </div>
              
              <div>
                <p class="text-sm text-gray-500 mb-1">数据库版本</p>
                <p class="text-sm font-medium text-gray-900">{{ systemInfo.dbVersion }}</p>
              </div>
              
              <div>
                <p class="text-sm text-gray-500 mb-1">服务器时间</p>
                <p class="text-sm font-medium text-gray-900">{{ formatDate(systemInfo.serverTime) }}</p>
              </div>
              
              <div>
                <p class="text-sm text-gray-500 mb-1">最近更新</p>
                <p class="text-sm font-medium text-gray-900">{{ formatDate(systemInfo.lastUpdate) }}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '../../store'

const router = useRouter()
const store = useMainStore()
const showUserMenu = ref(false)
const activeTab = ref('general')
const logoUpload = ref(null)

// 设置数据
const settings = ref({
  // 基本设置
  siteName: '萌豆语文动画屋',
  siteDescription: '适合儿童学习中文的动画平台',
  defaultLanguage: 'zh-CN',
  siteTheme: 'light',
  siteLogo: '/logo.svg',
  
  // 安全设置
  enableCaptcha: true,
  enable2FA: false,
  sessionTimeout: 30,
  failedLoginAttempts: 5,
  
  // 通知设置
  emailNotifications: true,
  pushNotifications: false,
  adminEmail: 'admin@example.com',
  notifyNewUser: true,
  notifyContentUpdate: true,
  notifySystemAlert: true,
  
  // 备份设置
  autoBackup: true,
  backupFrequency: 'weekly'
})

// 备份历史数据
const backupHistory = ref([
  {
    id: '1',
    date: new Date('2023-05-01T10:30:00'),
    size: 5242880,
    status: '完成'
  },
  {
    id: '2',
    date: new Date('2023-04-24T10:30:00'),
    size: 5120000,
    status: '完成'
  },
  {
    id: '3',
    date: new Date('2023-04-17T10:30:00'),
    size: 5000000,
    status: '完成'
  }
])

// 系统信息
const systemInfo = ref({
  version: '1.0.0',
  dbVersion: '1.0.0',
  serverTime: new Date(),
  lastUpdate: new Date('2023-04-30T15:20:00')
})

// 方法
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const logout = async () => {
  try {
    await store.logout()
    router.push('/login')
  } catch (error) {
    console.error('退出登录失败:', error)
  }
}

const saveGeneralSettings = () => {
  console.log('保存基本设置:', settings.value)
  // 实际应用中，这里可以调用API保存设置
  alert('基本设置已保存')
}

const saveSecuritySettings = () => {
  console.log('保存安全设置:', settings.value)
  // 实际应用中，这里可以调用API保存设置
  alert('安全设置已保存')
}

const saveNotificationSettings = () => {
  console.log('保存通知设置:', settings.value)
  // 实际应用中，这里可以调用API保存设置
  alert('通知设置已保存')
}

const triggerLogoUpload = () => {
  logoUpload.value?.click()
}

const handleLogoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // 实际应用中，这里应该上传文件到服务器
    // 这里仅做模拟，将文件转为DataURL显示在界面上
    const reader = new FileReader()
    reader.onload = (e) => {
      settings.value.siteLogo = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const createBackup = () => {
  console.log('创建备份')
  // 实际应用中，这里可以调用API创建备份
  alert('备份已开始，完成后将显示在备份历史中')
}

const downloadBackup = (backupId) => {
  console.log('下载备份:', backupId)
  // 实际应用中，这里可以调用API下载备份
}

const restoreBackup = (backupId) => {
  if (confirm('确定要恢复此备份吗？这将覆盖当前数据。')) {
    console.log('恢复备份:', backupId)
    // 实际应用中，这里可以调用API恢复备份
  }
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

// 格式化文件大小
const formatSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 点击其他地方关闭下拉菜单
const handleClickOutside = (event) => {
  const userMenuButton = document.querySelector('.flex.items-center.space-x-2')
  const userMenu = document.querySelector('.absolute.right-0.mt-2.w-48')
  
  if (userMenuButton && userMenu && !userMenuButton.contains(event.target) && !userMenu.contains(event.target)) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  
  // 验证用户是否为管理员
  if (!store.isAdmin) {
    router.push('/login')
  }
  
  // 在实际应用中，这里应该从API加载设置
})

// 组件卸载时移除事件监听器
import { onUnmounted } from 'vue'
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.admin-ui {
  font-family: 'Inter', system-ui, sans-serif;
}

/* 侧边栏样式优化 */
aside {
  box-shadow: 1px 0 3px rgba(0, 0, 0, 0.1);
}

/* 按钮悬停效果 */
button {
  transition: all 0.2s;
}

/* 表单项样式优化 */
input, select {
  border: 1px solid #d1d5db;
}

input:focus, select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  border-color: #3b82f6;
}
</style>