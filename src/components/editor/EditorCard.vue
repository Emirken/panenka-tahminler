<template>
  <v-card elevation="2" class="editor-card" @click="handleClick">
    <v-card-text class="pa-6">
      <div class="d-flex flex-column align-center text-center">
        <!-- Editor Avatar -->
        <v-avatar size="80" color="primary" class="mb-4">
          <v-icon size="40" color="white">mdi-account</v-icon>
        </v-avatar>

        <!-- Editor Name -->
        <h3 class="text-h6 font-weight-bold mb-2">
          {{ editor.name }}
        </h3>

        <!-- Stats -->
        <div class="stats-container">
          <div class="stat-item">
            <v-icon size="20" color="primary">mdi-chart-line</v-icon>
            <span class="stat-value">{{ predictionCount }}</span>
            <span class="stat-label">Tahmin</span>
          </div>

          <v-divider vertical class="mx-4" />

          <div class="stat-item">
            <v-icon size="20" color="success">mdi-check-circle</v-icon>
            <span class="stat-value">{{ successRate }}%</span>
            <span class="stat-label">Başarı</span>
          </div>
        </div>

        <!-- Action Button -->
        <v-btn
            color="primary"
            variant="outlined"
            size="small"
            class="mt-4"
            block
        >
          Tahminleri Gör
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Editor } from '@/types'

interface Props {
  editor: Editor
  predictionCount?: number
  successRate?: number
}

interface Emits {
  (e: 'click', editor: Editor): void
}

const props = withDefaults(defineProps<Props>(), {
  predictionCount: 0,
  successRate: 0,
})

const emit = defineEmits<Emits>()

const handleClick = () => {
  emit('click', props.editor)
}
</script>

<style scoped lang="scss">
.editor-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px !important;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
  }

  .stats-container {
    display: flex;
    align-items: center;
    margin-top: 16px;
    padding: 12px;
    background-color: rgba(255, 152, 0, 0.05);
    border-radius: 8px;
    width: 100%;

    .stat-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;

      .stat-value {
        font-size: 1.25rem;
        font-weight: 700;
        color: #333;
      }

      .stat-label {
        font-size: 0.75rem;
        color: #666;
      }
    }
  }
}
</style>