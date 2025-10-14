import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/editor-tahminleri',
    name: 'editorPredictions',
    component: () => import('../views/EditorPredictionsView.vue')
  },
  {
    path: '/etkinliklerimiz',
    name: 'activities',
    component: () => import('../views/ActivitiesView.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Navigation Guard - Admin sayfası için giriş kontrolü
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Giriş yapmamış kullanıcıyı ana sayfaya yönlendir
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router