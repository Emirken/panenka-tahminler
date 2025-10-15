<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero-section py-16">
      <div class="content-section">
        <v-row justify="center">
          <v-col cols="12" md="10" class="text-center">
            <h1 class="text-h2 font-weight-bold text-primary mb-4 fade-in">
              Hoş Geldin!
            </h1>
            <p class="text-h5 mb-8 fade-in">
              İsabet;şans değil,analizdir!
            </p>
            <p class="text-body-1 mb-0 fade-in">
              Paylaştığımız tahminler, analizlerimizin ve futbola olan tutkumuzun bir ürünüdür.
            </p>
          </v-col>
        </v-row>
      </div>
    </section>

    <!-- Today's Match Section -->
    <section class="today-match-section py-12">
      <div class="content-section">
        <h2 class="section-title text-center mb-4">
          Günün Panenkası
        </h2>

        <p class="section-description text-center mb-8">
          Editörlerimizin belli bir oran üstü yaptığı tahminler
        </p>

        <v-row>
          <!-- Dinamik olarak günün panenkası tahminlerini göster -->
          <v-col
              cols="12"
              md="4"
              v-for="prediction in todaysPicks"
              :key="prediction.id"
          >
            <v-card elevation="6" class="match-card">
              <!-- Header with League and Date -->
              <div class="match-header">
                <v-chip color="primary" size="small" class="league-chip">
                  {{ prediction.league }}
                </v-chip>
                <span class="match-date">{{ formatMatchDate(prediction.matchDate) }}</span>
              </div>

              <!-- Editor Name -->
              <div class="editor-badge">
                <v-chip color="secondary" size="small">
                  <v-icon size="16" class="mr-1">mdi-account</v-icon>
                  {{ prediction.editorName }}
                </v-chip>
              </div>

              <!-- Teams Section -->
              <div class="teams-container">
                <div class="team-block">
                  <div class="team-logo-wrapper">
                    <span class="team-emoji">{{ prediction.homeLogo }}</span>
                  </div>
                  <span class="team-name">{{ prediction.homeTeam }}</span>
                </div>

                <div class="vs-divider">
                  <span class="vs-text">VS</span>
                </div>

                <div class="team-block">
                  <div class="team-logo-wrapper">
                    <span class="team-emoji">{{ prediction.awayLogo }}</span>
                  </div>
                  <span class="team-name">{{ prediction.awayTeam }}</span>
                </div>
              </div>

              <!-- Prediction Section -->
              <div class="prediction-box">
                <p class="prediction-label">Tahmin</p>
                <p class="prediction-text">{{ prediction.prediction }}</p>
                <p class="prediction-odds">Oran: {{ prediction.odds.toFixed(2) }}</p>
              </div>

              <!-- CTA Button -->
              <v-btn
                  block
                  color="primary"
                  size="large"
                  class="cta-button"
                  @click="$router.push({ name: 'editorPredictions' })"
              >
                Detaylı Analiz için Abone Ol
              </v-btn>
            </v-card>
          </v-col>

          <!-- Eğer tahmin yoksa boş durum göster -->
          <v-col cols="12" v-if="todaysPicks.length === 0">
            <v-card elevation="2" class="pa-8 text-center">
              <v-icon size="64" color="grey-lighten-1">mdi-calendar-remove</v-icon>
              <p class="text-h6 text-grey mt-4">
                Henüz günün panenkası seçilmemiş. Admin panelden tahmin seçebilirsiniz.
              </p>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePredictionsStore } from '@/store/predictions'

const predictionsStore = usePredictionsStore()

// Günün panenkası tahminlerini store'dan çek
const todaysPicks = computed(() => predictionsStore.todaysPicksPredictions)

// Tarih formatla
const formatMatchDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped lang="scss">
.hero-section {
  background: linear-gradient(135deg, #FFF8E1 0%, #FFE0B2 100%);
}

.today-match-section {
  background-color: #FFF8E1;

  .section-title {
    font-size: 2rem;
    font-weight: 700;
    color: #FF9800;
  }

  .section-description {
    font-size: 1.125rem;
    color: #666;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }

  .match-card {
    background: white;
    border-radius: 16px !important;
    padding: 24px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
    transition: all 0.3s ease;
    height: 100%;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15) !important;
    }

    .match-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .league-chip {
        background-color: #FF9800 !important;
        color: white !important;
        font-weight: 600;
      }

      .match-date {
        font-size: 0.75rem;
        color: #666;
      }
    }

    .editor-badge {
      margin-bottom: 20px;
      text-align: center;
    }

    .teams-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 24px 0;

      .team-block {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;

        .team-logo-wrapper {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f5f5;

          .team-logo {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }

          .team-emoji {
            font-size: 2rem;
          }
        }

        .team-name {
          font-weight: 700;
          font-size: 0.875rem;
          text-align: center;
          color: #333;
        }
      }

      .vs-divider {
        flex: 0 0 auto;
        padding: 0 12px;

        .vs-text {
          font-size: 1.25rem;
          font-weight: 700;
          color: #999;
        }
      }
    }

    .prediction-box {
      background: linear-gradient(135deg, #FFF8E1 0%, #FFE0B2 100%);
      padding: 16px;
      border-radius: 12px;
      text-align: center;
      margin: 20px 0;

      .prediction-label {
        font-size: 0.75rem;
        color: #666;
        margin-bottom: 6px;
      }

      .prediction-text {
        font-size: 1rem;
        font-weight: 700;
        color: #FF9800;
        margin-bottom: 6px;
      }

      .prediction-odds {
        font-size: 1rem;
        font-weight: 600;
        color: #FBBF24;
      }
    }

    .cta-button {
      margin-top: 20px;
      text-transform: none !important;
      font-weight: 700;
      font-size: 0.875rem;
      padding: 20px 0 !important;
      border-radius: 12px !important;
      box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3) !important;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(255, 152, 0, 0.4) !important;
      }
    }
  }
}

.content-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

// Mobile responsive
@media (max-width: 960px) {
  .today-match-section {
    .match-card {
      margin-bottom: 24px;
      padding: 20px;

      .teams-container {
        .team-block {
          .team-logo-wrapper {
            width: 50px;
            height: 50px;

            .team-emoji {
              font-size: 1.5rem;
            }
          }

          .team-name {
            font-size: 0.75rem;
          }
        }

        .vs-divider {
          padding: 0 8px;

          .vs-text {
            font-size: 1rem;
          }
        }
      }

      .prediction-box {
        .prediction-text {
          font-size: 0.875rem;
        }
      }
    }
  }
}
</style>