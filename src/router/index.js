import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../services/supabase'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 公共路由
    {
      path: '/',
      name: 'home',
      redirect: '/login' // 重定向到登录页面
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    
    // 家长端路由
    {
      path: '/parent',
      name: 'parent',
      meta: { requiresAuth: true, role: 'parent' },
      component: () => import('../views/parent/DashboardView.vue')
    },
    {
      path: '/parent/settings',
      name: 'parent-settings',
      meta: { requiresAuth: true, role: 'parent' },
      component: () => import('../views/parent/SettingsView.vue')
    },
    
    // 儿童端路由
    {
      path: '/child',
      name: 'child-home',
      component: () => import('../views/child/HomeView.vue'),
      meta: {
        requiresAuth: true,
        role: 'child'
      }
    },
    {
      path: '/child/library',
      name: 'child-library',
      component: () => import('../views/child/LibraryView.vue'),
      meta: {
        requiresAuth: true,
        role: 'child'
      }
    },
    {
      path: '/child/achievements',
      name: 'child-achievements',
      component: () => import('../views/child/AchievementsView.vue'),
      meta: {
        requiresAuth: true,
        role: 'child'
      }
    },
    {
      path: '/child/pinyin-theater',
      name: 'child-pinyin-theater',
      component: () => import('../views/child/PinyinTheaterView.vue'),
      meta: {
        requiresAuth: true,
        role: 'child'
      }
    },
    {
      path: '/child/chinese-story',
      name: 'child-chinese-story',
      component: () => import('../views/child/ChineseStoryView.vue'),
      meta: {
        requiresAuth: true,
        role: 'child'
      }
    },
    {
      path: '/child/vocabulary-playground',
      name: 'child-vocabulary-playground',
      component: () => import('../views/child/VocabularyPlaygroundView.vue'),
      meta: {
        requiresAuth: true,
        role: 'child'
      }
    },
    {
      path: '/child/short-sentence-practice',
      name: 'child-short-sentence-practice',
      component: () => import('../views/child/ShortSentencePracticeView.vue'),
      meta: {
        requiresAuth: true,
        role: 'child'
      }
    },
    
    // 管理员路由
    {
      path: '/admin',
      name: 'admin',
      meta: { requiresAuth: true, role: 'admin' },
      component: () => import('../views/parent/DashboardView.vue') // 暂时使用家长仪表盘
    },
    
    // 404路由
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue')
    }
  ]
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  // 检查是否需要认证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    try {
      // 从Supabase获取当前用户信息
      const user = await auth.getCurrentUser()
      
      // 简化判断逻辑，只要用户存在就允许访问
      // 完全移除角色验证，确保家长端和儿童端之间可以自由切换
      if (user) {
        // 记录当前访问的角色类型
        if (to.meta.role) {
          localStorage.setItem('currentRole', to.meta.role)
        }
        next()
      } else {
        // 未认证，重定向到登录页面
        next({ name: 'login' })
      }
    } catch (error) {
      console.error('路由守卫错误:', error)
      // 错误情况下仍然允许访问，以保证基本功能
      next()
    }
  } else {
    next()
  }
})

export default router