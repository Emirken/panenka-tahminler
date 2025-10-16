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

      <!-- Editor Tabs with Results -->
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
                <div class="editor-tab-content">
                  <span class="editor-name">{{ editor.label }}</span>

                  <!-- Son 5 Maç Sonuçları -->
                  <div v-if="getLastFiveResults(editor.id).length > 0" class="results-row">
                    <v-tooltip
                        v-for="(result, index) in getLastFiveResults(editor.id)"
                        :key="index"
                        location="top"
                    >
                      <template v-slot:activator="{ props }">
                        <div v-bind="props" class="result-icon">
                          <v-icon
                              :color="result.result === 'won' ? 'success' : 'error'"
                              size="18"
                          >
                            {{ result.result === 'won' ? 'mdi-check-circle' : 'mdi-close-circle' }}
                          </v-icon>
                        </div>
                      </template>
                      <div class="result-tooltip">
                        <div class="tooltip-match">{{ result.homeTeam }} vs {{ result.awayTeam }}</div>
                        <div class="tooltip-date">{{ formatTooltipDate(result.matchDate) }}</div>
                        <div class="tooltip-prediction">Tahmin: {{ result.prediction }}</div>
                        <div class="tooltip-odds">Oran: {{ result.odds }}</div>
                      </div>
                    </v-tooltip>
                  </div>
                </div>
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
                      <p class="match-date">
                        <v-icon size="16" class="mr-1">mdi-calendar</v-icon>
                        {{ formatMatchDate(prediction.matchDate) }}
                      </p>
                    </div>
                    <v-chip color="primary" size="small" variant="tonal">
                      {{ prediction.league }}
                    </v-chip>
                  </div>

                  <!-- Teams with Logos -->
                  <div class="teams-display mb-4">
                    <div class="team-info">
                      <span class="team-logo">{{ prediction.homeLogo }}</span>
                      <span class="team-name">{{ prediction.homeTeam }}</span>
                    </div>
                    <span class="vs-text">VS</span>
                    <div class="team-info">
                      <span class="team-logo">{{ prediction.awayLogo }}</span>
                      <span class="team-name">{{ prediction.awayTeam }}</span>
                    </div>
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

                  <!-- Result Badge (if available) -->
                  <div v-if="prediction.result && prediction.result !== 'pending'" class="result-badge-container mt-3">
                    <v-chip
                        :color="prediction.result === 'won' ? 'success' : 'error'"
                        size="small"
                    >
                      <v-icon size="16" class="mr-1">
                        {{ prediction.result === 'won' ? 'mdi-check' : 'mdi-close' }}
                      </v-icon>
                      {{ prediction.result === 'won' ? 'Tuttu' : 'Tutmadı' }}
                    </v-chip>
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
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePredictionsStore } from '@/store/predictions'

const route = useRoute()
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
  { value: 'emircan', id: '1', label: 'Emircan Adak' },
  { value: 'berke', id: '2', label: 'Berke Katıksız' },
  { value: 'erman', id: '3', label: 'Erman Şener' },
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

// Son 5 sonucu getir
const getLastFiveResults = (editorId: string) => {
  return predictionsStore.lastFiveResults(editorId)
}

onMounted(() => {
  const editorQuery = route.query.editor as string
  if (editorQuery && editorIdMap[editorQuery]) {
    selectedEditor.value = editorQuery
  }
})

watch(
    () => route.query.editor,
    (newEditor) => {
      if (newEditor && typeof newEditor === 'string' && editorIdMap[newEditor]) {
        selectedEditor.value = newEditor
      }
    }
)

const filteredPredictions = computed(() => {
  const editorId = editorIdMap[selectedEditor.value]
  const leagueName = leagueNameMap[selectedLeague.value]

  return predictionsStore.allPredictions.filter(
      p => p.editorId === editorId && p.league === leagueName
  )
})

const formatMatchDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Tooltip için daha kompakt tarih formatı
const formatTooltipDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
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

.league-tabs-section {
  .league-tabs-wrapper {
    background: white;
    border-bottom: 2px solid #e0e0e0;
    overflow: hidden;

    .league-tabs-scroll {
      display: flex;
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;

      &::-webkit-scrollbar {
        display: none;
      }

      .league-tab {
        flex-shrink: 0;
        padding: 16px;
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

.editor-tabs-section {
  .editor-tabs-container {
    display: flex;
    gap: 8px;
    background: #f5f5f5;
    padding: 8px;
    border-radius: 12px;

    .editor-tab {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: 8px;
      background: transparent;
      font-size: 0.875rem;
      font-weight: 500;
      color: #666;
      cursor: pointer;
      transition: all 0.3s ease;
      min-height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: rgba(255, 152, 0, 0.1);
        color: #FF9800;
      }

      &.active {
        background: #FF9800;
        color: white;
        font-weight: 700;

        .results-row {
          .result-icon {
            background: rgba(255, 255, 255, 0.2);

            .v-icon {
              color: white !important;
            }
          }
        }
      }

      .editor-tab-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        width: 100%;

        .editor-name {
          font-size: 0.875rem;
          white-space: nowrap;

          @media (max-width: 600px) {
            font-size: 0.75rem;
          }
        }

        .results-row {
          display: flex;
          gap: 4px;
          justify-content: center;
          flex-wrap: wrap;

          .result-icon {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.05);
            transition: all 0.2s ease;

            &:hover {
              transform: scale(1.15);
            }

            @media (max-width: 600px) {
              width: 20px;
              height: 20px;

              .v-icon {
                font-size: 14px !important;
              }
            }
          }
        }
      }
    }
  }
}

.result-tooltip {
  padding: 8px 12px;

  .tooltip-match {
    font-weight: 700;
    font-size: 0.875rem;
    margin-bottom: 6px;
    padding-bottom: 4px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  }

  .tooltip-date {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.85);
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 4px;

    &::before {
      content: '📅';
      font-size: 0.7rem;
    }
  }

  .tooltip-prediction {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 4px;
  }

  .tooltip-odds {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 600;
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

        .match-date {
          font-size: 0.75rem;
          color: #999;
          margin: 4px 0 0 0;
          display: flex;
          align-items: center;
        }
      }

      .teams-display {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 16px;
        background: #f9f9f9;
        border-radius: 8px;

        .team-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;

          .team-logo {
            font-size: 2rem;
          }

          .team-name {
            font-size: 0.875rem;
            font-weight: 600;
            color: #333;
          }
        }

        .vs-text {
          font-size: 1.25rem;
          font-weight: 700;
          color: #999;
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

      .result-badge-container {
        text-align: center;
        padding-top: 12px;
        border-top: 1px solid #f0f0f0;
      }
    }
  }
}

// Responsive
@media (max-width: 600px) {
  .league-tabs-scroll {
    .league-tab {
      padding: 12px !important;
      font-size: 0.75rem !important;
    }
  }

  .editor-tabs-container {
    flex-direction: column;

    .editor-tab {
      min-height: 70px !important;
      padding: 10px 8px !important;

      .editor-tab-content {
        .editor-name {
          font-size: 0.75rem !important;
        }
      }
    }
  }

  .prediction-card {
    .prediction-header {
      flex-direction: column;
      gap: 12px;
    }

    .teams-display {
      flex-direction: column;
      gap: 12px;

      .vs-text {
        margin: 8px 0;
      }
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