<template>
  <div class="admin-dashboard">
    <!-- Welcome Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card elevation="2" class="welcome-card">
          <v-card-text class="pa-6">
            <div class="d-flex align-center justify-space-between">
              <div>
                <h2 class="text-h4 font-weight-bold text-primary mb-2">
                  Hoş Geldin, {{ username }}! 👋
                </h2>
                <p class="text-body-1 text-grey">
                  Admin panelindesin. İşte bugünün özeti:
                </p>
              </div>
              <v-avatar size="80" color="primary">
                <v-icon size="40" color="white">mdi-account-circle</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="2" class="stat-card stat-card-1">
          <v-card-text class="text-center pa-6">
            <v-icon size="48" color="primary" class="mb-3">mdi-file-document</v-icon>
            <h3 class="text-h3 font-weight-bold mb-2">{{ stats.predictions }}</h3>
            <p class="text-body-2 text-grey">Toplam Tahmin</p>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card elevation="2" class="stat-card stat-card-2">
          <v-card-text class="text-center pa-6">
            <v-icon size="48" color="success" class="mb-3">mdi-check-circle</v-icon>
            <h3 class="text-h3 font-weight-bold mb-2">{{ stats.successRate }}%</h3>
            <p class="text-body-2 text-grey">Başarı Oranı</p>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card elevation="2" class="stat-card stat-card-3">
          <v-card-text class="text-center pa-6">
            <v-icon size="48" color="info" class="mb-3">mdi-calendar</v-icon>
            <h3 class="text-h3 font-weight-bold mb-2">{{ stats.activities }}</h3>
            <p class="text-body-2 text-grey">Etkinlik</p>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card elevation="2" class="stat-card stat-card-4">
          <v-card-text class="text-center pa-6">
            <v-icon size="48" color="warning" class="mb-3">mdi-trophy</v-icon>
            <h3 class="text-h3 font-weight-bold mb-2">{{ stats.totalViews }}</h3>
            <p class="text-body-2 text-grey">Toplam Görüntülenme</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Actions -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="bg-primary text-white pa-4">
            <v-icon class="mr-2">mdi-flash</v-icon>
            Hızlı İşlemler
          </v-card-title>
          <v-card-text class="pa-6">
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <v-btn
                    block
                    color="primary"
                    size="large"
                    prepend-icon="mdi-plus"
                    @click="$emit('add-prediction')"
                >
                  Yeni Tahmin
                </v-btn>
              </v-col>

              <v-col cols="12" sm="6" md="3">
                <v-btn
                    block
                    color="success"
                    size="large"
                    prepend-icon="mdi-calendar-plus"
                    @click="$emit('add-activity')"
                >
                  Yeni Etkinlik
                </v-btn>
              </v-col>

              <v-col cols="12" sm="6" md="3">
                <v-btn
                    block
                    color="info"
                    size="large"
                    prepend-icon="mdi-chart-line"
                    @click="$emit('view-stats')"
                >
                  İstatistikler
                </v-btn>
              </v-col>

              <v-col cols="12" sm="6" md="3">
                <v-btn
                    block
                    color="secondary"
                    size="large"
                    prepend-icon="mdi-cog"
                    @click="$emit('settings')"
                >
                  Ayarlar
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  username: string
  totalPredictions?: number
  totalActivities?: number
  successRate?: number
  totalViews?: number
}

interface Emits {
  (e: 'add-prediction'): void
  (e: 'add-activity'): void
  (e: 'view-stats'): void
  (e: 'settings'): void
}

const props = withDefaults(defineProps<Props>(), {
  totalPredictions: 0,
  totalActivities: 0,
  successRate: 0,
  totalViews: 0,
})

const emit = defineEmits<Emits>()

const stats = computed(() => ({
  predictions: props.totalPredictions,
  activities: props.totalActivities,
  successRate: props.successRate,
  totalViews: props.totalViews,
}))
</script>

<style scoped lang="scss">
.admin-dashboard {
  .welcome-card {
    background: linear-gradient(135deg, #FFF8E1 0%, #FFE0B2 100%);
    border-radius: 12px !important;
  }

  .stat-card {
    border-radius: 12px !important;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
    }

    &.stat-card-1 {
      border-left: 4px solid #FF9800;
    }

    &.stat-card-2 {
      border-left: 4px solid #4CAF50;
    }

    &.stat-card-3 {
      border-left: 4px solid #2196F3;
    }

    &.stat-card-4 {
      border-left: 4px solid #FFC107;
    }
  }
}
</style>