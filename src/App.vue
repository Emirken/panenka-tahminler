<template>
  <v-app>
    <Header />
    <v-main class="main-style">
      <router-view />
    </v-main>
    <Footer />
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'
import { useAuthStore } from '@/store/auth'
import { usePredictionsStore } from '@/store/predictions'
import { useActivitiesStore } from '@/store/activities'

const authStore = useAuthStore()
const predictionsStore = usePredictionsStore()
const activitiesStore = useActivitiesStore()

onMounted(() => {
  authStore.checkAuth()

  // Real-time listener'ları başlat
  // Admin panelde yapılan değişiklikler otomatik olarak tüm sayfalarda görünecek
  predictionsStore.setupRealtimeListeners()
  activitiesStore.setupRealtimeListener()
})

onBeforeUnmount(() => {
  // Sayfa kapatılırken listener'ları temizle
  predictionsStore.cleanupListeners()
  activitiesStore.cleanupListeners()
})
</script>

<style lang="scss">
// V-app arkaplan rengi
.v-application {
  background-color: #edf1f6 !important;
}

// Main content wrapper
.main-content {
  background-color: #edf1f6 !important;
  min-height: calc(100vh - 200px);
  width: 100%;
  overflow-x: hidden;
}

// İçerik container'ı - TAM ORTALAMA
.main-style{
  width: 100%;
  max-width: 100vw;

  // Desktop - tam ortada, simetrik
  margin-left: auto;
  margin-right: auto;
  padding-left: 10%;
  padding-right: 10%;

  // Büyük ekranlar
  @media (min-width: 1920px) {
    padding-left: 15%;
    padding-right: 15%;
  }

  // Tablet - daha az padding
  @media (max-width: 1264px) {
    padding-left: 5%;
    padding-right: 5%;
  }

  // Mobil - minimal padding
  @media (max-width: 960px) {
    padding-left: 2%;
    padding-right: 2%;
  }

  // Çok küçük ekranlar
  @media (max-width: 600px) {
    padding-left: 0;
    padding-right: 0;
  }
}

@import '@/assets/styles/main.scss';
</style>