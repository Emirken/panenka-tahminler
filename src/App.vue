<template>
  <v-app>
    <Header />
    <v-main class="main-style" >
      <router-view />
    </v-main>
    <Footer />
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
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
  predictionsStore.loadPredictions()
  activitiesStore.loadActivities()
})
</script>

<style lang="scss">
// V-app arkaplan rengi
.v-application {
  background-color: #FFF8E1 !important;
}

// Main content wrapper
.main-content {
  background-color: #FFF8E1 !important;
  min-height: calc(100vh - 200px);
  width: 100%;
  overflow-x: hidden; // Yan scroll'u engelle
}

// İçerik container'ı
.main-style{
  width: 100%;
  max-width: 100vw; // Viewport genişliğini aşmasın

  // Desktop - yan marginler
  margin-left: 10%;
  margin-right: 10%;

  // Tablet - daha az margin
  @media (max-width: 1264px) {
    margin-left: 5%;
    margin-right: 5%;
  }

  // Mobil - minimal margin
  @media (max-width: 960px) {
    margin-left: 0;
    margin-right: 0;
    padding: 0;
  }

  // Çok küçük ekranlar
  @media (max-width: 600px) {
    margin-left: 0;
    margin-right: 0;
    padding: 0;
  }
}

@import '@/assets/styles/main.scss';
</style>