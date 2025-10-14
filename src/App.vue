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
.main-style{
  margin-left: 10%;
  margin-right: 10%;
}
@import '@/assets/styles/main.scss';
</style>