<template>
  <v-card elevation="2" class="prediction-card">
    <v-card-text class="pa-6">
      <!-- League Badge -->
      <v-chip color="primary" size="small" class="mb-4">
        {{ prediction.league }}
      </v-chip>

      <!-- Teams Section -->
      <div class="teams-row">
        <div class="team">
          <div class="team-logo">{{ prediction.homeLogo }}</div>
          <span class="team-name">{{ prediction.homeTeam }}</span>
        </div>

        <div class="vs-divider">
          <v-chip variant="outlined" color="grey" size="large">VS</v-chip>
        </div>

        <div class="team">
          <div class="team-logo">{{ prediction.awayLogo }}</div>
          <span class="team-name">{{ prediction.awayTeam }}</span>
        </div>
      </div>

      <v-divider class="my-4" />

      <!-- Editor Info -->
      <div class="editor-info mb-3">
        <v-icon size="16" color="grey">mdi-account</v-icon>
        <span class="text-caption text-grey ml-1">{{ prediction.editorName }}</span>
      </div>

      <!-- Explanation -->
      <p class="explanation-text">
        "{{ prediction.explanation }}"
      </p>

      <v-divider class="my-4" />

      <!-- Prediction & Odds -->
      <v-row align="center" class="prediction-row">
        <v-col cols="12" md="7">
          <div class="prediction-info">
            <p class="text-caption text-grey mb-1">Tahmin</p>
            <p class="prediction-text">{{ prediction.prediction }}</p>
          </div>
        </v-col>

        <v-col cols="12" md="5" class="text-md-right">
          <div class="odds-info">
            <p class="text-caption text-grey mb-1">Oran</p>
            <p class="odds-text">{{ prediction.odds.toFixed(2) }}</p>
          </div>
        </v-col>
      </v-row>

      <!-- Match Date -->
      <div class="match-date-info mt-4">
        <v-icon size="16" color="grey">mdi-calendar</v-icon>
        <span class="text-caption text-grey ml-1">{{ formattedDate }}</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Prediction } from '@/types'

interface Props {
  prediction: Prediction
}

const props = defineProps<Props>()

const formattedDate = computed(() => {
  const date = new Date(props.prediction.matchDate)
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})
</script>

<style scoped lang="scss">
.prediction-card {
  border-radius: 12px !important;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
  }

  .teams-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 24px 0;

    .team {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;

      .team-logo {
        font-size: 3rem;
        line-height: 1;
      }

      .team-name {
        font-weight: 600;
        font-size: 1rem;
        text-align: center;
      }
    }

    .vs-divider {
      flex: 0 0 auto;
      padding: 0 16px;
    }
  }

  .editor-info {
    display: flex;
    align-items: center;
  }

  .explanation-text {
    font-size: 0.875rem;
    color: #666;
    font-style: italic;
    line-height: 1.6;
  }

  .prediction-row {
    .prediction-info {
      .prediction-text {
        font-size: 1.125rem;
        font-weight: 700;
        color: #FF9800;
        margin: 0;
      }
    }

    .odds-info {
      .odds-text {
        font-size: 1.5rem;
        font-weight: 700;
        color: #FF9800;
        margin: 0;
      }
    }
  }

  .match-date-info {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 12px;
    border-top: 1px solid #f0f0f0;
  }
}

@media (max-width: 600px) {
  .teams-row {
    .team {
      .team-logo {
        font-size: 2rem !important;
      }

      .team-name {
        font-size: 0.875rem !important;
      }
    }

    .vs-divider {
      padding: 0 8px !important;
    }
  }
}
</style>