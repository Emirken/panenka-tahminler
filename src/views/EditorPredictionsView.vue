<template>
  <div class="editor-predictions-view py-12">
    <div class="content-wrapper">
      <!-- League Tabs -->
      <section class="league-tabs-section mb-8">
        <div class="league-tabs-wrapper">
          <div class="league-tabs-scroll">
            <button
                v-for="league in leagues"
                :key="league.value"
                :class="['league-tab', { 'active': selectedLeague === league.value }]"
                @click="selectedLeague = league.value"
            >
              {{ league.label }}
            </button>
          </div>
        </div>
      </section>

      <!-- Editor Tabs -->
      <section class="editor-tabs-section mb-8">
        <v-row justify="center">
          <v-col cols="12" sm="10" md="8" lg="6">
            <div class="editor-tabs-container">
              <button
                  v-for="editor in editors"
                  :key="editor.value"
                  :class="['editor-tab', { 'active': selectedEditor === editor.value }]"
                  @click="selectedEditor = editor.value"
              >
                {{ editor.label }}
              </button>
            </div>
          </v-col>
        </v-row>
      </section>

      <!-- Predictions Content -->
      <section class="predictions-content">
        <v-row justify="center">
          <v-col cols="12" lg="10" xl="8">
            <!-- Empty State -->
            <div v-if="filteredPredictions.length === 0" class="empty-state">
              <v-icon size="80" color="grey-lighten-1">mdi-calendar-remove</v-icon>
              <p class="text-h6 text-grey mt-4">
                Bu lig için henüz tahmin bulunmamaktadır.
              </p>
            </div>

            <!-- Predictions List -->
            <div v-else class="predictions-list">
              <v-card
                  v-for="prediction in filteredPredictions"
                  :key="prediction.id"
                  elevation="4"
                  class="prediction-card mb-6"
              >
                <v-card-text class="pa-6">
                  <!-- Header -->
                  <div class="prediction-header">
                    <div>
                      <h3 class="match-title">{{ prediction.homeTeam }} - {{ prediction.awayTeam }}</h3>
                      <p class="editor-name">Yorumcu: {{ prediction.editorName }}</p>
                    </div>
                    <v-chip color="primary" size="small" variant="tonal">
                      {{ prediction.league }}
                    </v-chip>
                  </div>

                  <!-- Explanation -->
                  <p class="prediction-explanation">
                    "{{ prediction.explanation }}"
                  </p>

                  <!-- Prediction Box -->
                  <div class="prediction-box">
                    <div class="prediction-info">
                      <p class="label">Tahmin</p>
                      <p class="value">{{ prediction.prediction }}</p>
                    </div>
                    <div class="odds-info">
                      <p class="label">Oran</p>
                      <p class="odds-value">{{ prediction.odds.toFixed(2) }}</p>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePredictionsStore } from '@/store/predictions'

const predictionsStore = usePredictionsStore()

const selectedLeague = ref('premier-lig')
const selectedEditor = ref('emircan')

const leagues = [
  { value: 'premier-lig', label: 'Premier Lig' },
  { value: 'serie-a', label: 'İtalya Serie A' },
  { value: 'ligue-1', label: 'Fransa Ligue 1' },
  { value: 'bundesliga', label: 'Almanya Bundesliga' },
  { value: 'la-liga', label: 'İspanya La Liga' },
  { value: 'super-lig', label: 'Türkiye Süper Lig' },
  { value: 'ptt-1', label: 'PTT 1. Lig' },
  { value: 'diger', label: 'Diğer Ligler' },
]

const editors = [
  { value: 'emircan', label: 'Emircan Adak' },
  { value: 'berke', label: 'Berke Katıksız' },
  { value: 'erman', label: 'Erman Şener' },
]

const editorIdMap: Record<string, string> = {
  emircan: '1',
  berke: '2',
  erman: '3',
}

const leagueNameMap: Record<string, string> = {
  'premier-lig': 'Premier Lig',
  'serie-a': 'İtalya Serie A',
  'ligue-1': 'Fransa Ligue 1',
  'bundesliga': 'Almanya Bundesliga',
  'la-liga': 'İspanya La Liga',
  'super-lig': 'Türkiye Süper Lig',
  'ptt-1': 'PTT 1. Lig',
  'diger': 'Diğer Ligler',
}

const filteredPredictions = computed(() => {
  const editorId = editorIdMap[selectedEditor.value]
  const leagueName = leagueNameMap[selectedLeague.value]

  return predictionsStore.allPredictions.filter(
      p => p.editorId === editorId && p.league === leagueName
  )
})
</script>

<style scoped lang="scss">
.editor-predictions-view {
  background-color: #FFF8E1;
  min-height: calc(100vh - 200px);
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
}

// League Tabs Styling
.league-tabs-section {
  .league-tabs-wrapper {
    background: white;
    border-bottom: 2px solid #e0e0e0;
    overflow: hidden;

    .league-tabs-scroll {
      display: flex;
      overflow-x: auto;
      scrollbar-width: none; // Firefox
      -ms-overflow-style: none; // IE/Edge

      &::-webkit-scrollbar {
        display: none; // Chrome/Safari
      }

      .league-tab {
        flex-shrink: 0;
        padding: 16px 16px;
        border: none;
        border-bottom: 2px solid transparent;
        background: transparent;
        font-size: 0.875rem;
        font-weight: 500;
        color: #666;
        cursor: pointer;
        transition: all 0.3s ease;
        white-space: nowrap;

        &:hover {
          color: #FF9800;
        }

        &.active {
          color: #FF9800;
          border-bottom-color: #FF9800;
          font-weight: 700;
        }
      }
    }
  }
}

// Editor Tabs Styling
.editor-tabs-section {
  .editor-tabs-container {
    display: flex;
    gap: 8px;
    background: #f5f5f5;
    padding: 8px;
    border-radius: 12px;

    .editor-tab {
      flex: 1;
      padding: 12px 16px;
      border: none;
      border-radius: 8px;
      background: transparent;
      font-size: 0.875rem;
      font-weight: 500;
      color: #666;
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;

      &:hover {
        background: rgba(255, 152, 0, 0.1);
        color: #FF9800;
      }

      &.active {
        background: #FF9800;
        color: white;
        font-weight: 700;
      }
    }
  }
}

.predictions-content {
  .empty-state {
    text-align: center;
    padding: 80px 20px;
  }

  .predictions-list {
    .prediction-card {
      border-radius: 12px !important;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
      }

      .prediction-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 16px;

        .match-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 4px;
        }

        .editor-name {
          font-size: 0.75rem;
          color: #666;
          margin: 0;
        }
      }

      .prediction-explanation {
        font-size: 0.875rem;
        color: #666;
        font-style: italic;
        line-height: 1.6;
        margin-bottom: 16px;
      }

      .prediction-box {
        background: linear-gradient(135deg, #FFF8E1 0%, #FFE0B2 100%);
        padding: 16px;
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .prediction-info,
        .odds-info {
          .label {
            font-size: 0.75rem;
            color: #666;
            margin-bottom: 4px;
          }

          .value {
            font-size: 1.125rem;
            font-weight: 700;
            color: #FF9800;
            margin: 0;
          }

          .odds-value {
            font-size: 2rem;
            font-weight: 700;
            color: #FBBF24;
            margin: 0;
          }
        }

        .odds-info {
          text-align: right;
        }
      }
    }
  }
}

// Responsive
@media (max-width: 600px) {
  .league-tabs-scroll {
    .league-tab {
      padding: 12px 12px !important;
      font-size: 0.75rem !important;
    }
  }

  .editor-tabs-container {
    .editor-tab {
      font-size: 0.75rem !important;
      padding: 10px 8px !important;
    }
  }

  .prediction-card {
    .prediction-header {
      flex-direction: column;
      gap: 12px;
    }

    .prediction-box {
      flex-direction: column;
      gap: 16px;
      text-align: center;

      .odds-info {
        text-align: center !important;
      }
    }
  }
}
</style>