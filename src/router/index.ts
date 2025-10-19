import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
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
    path: '/puan-tablosu',
    name: 'standings',
    component: () => import('../views/StandingsView.vue')
  },
  {
    path: '/takim/:teamId',
    name: 'teamDetail',
    component: () => import('../views/TeamDetailView.vue')
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

// Real-time Firestore listeners kullanıldığı için navigation guard'a gerek kalmadı
// Admin panelde yapılan değişiklikler otomatik olarak tüm sayfalarda görünecek

export default router