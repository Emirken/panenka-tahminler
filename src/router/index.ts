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
    path: '/oku',
    name: 'read',
    component: () => import('../views/ReadView.vue')
  },
  {
    path: '/amacimiz',
    name: 'purpose',
    component: () => import('../views/PurposeView.vue')
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
    // requiresAuth kaldırıldı - AdminView kendi içinde kontrol edecek
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Navigation Guard kaldırıldı - AdminView içinde kontrol yapılıyor
export default router