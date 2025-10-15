<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero-section py-8 py-md-16">
      <div class="content-section">
        <v-row justify="center">
          <v-col cols="12" md="10" class="text-center px-4">
            <h1 class="hero-title mb-4 fade-in">
              Hoş Geldin!
            </h1>
            <p class="hero-subtitle mb-4 mb-md-8 fade-in">
              İsabet;şans değil,analizdir!
            </p>
            <p class="hero-description mb-0 fade-in">
              Paylaştığımız tahminler, analizlerimizin ve futbola olan tutkumuzun bir ürünüdür.
            </p>
          </v-col>
        </v-row>
      </div>
    </section>

    <!-- Today's Match Section -->
    <section class="today-match-section py-8 py-md-12">
      <div class="content-section">
        <h2 class="section-title text-center mb-3 mb-md-4 px-4">
          Günün Panenkası
        </h2>

        <p class="section-description text-center mb-6 mb-md-8 px-4">
          Editörlerimizin belli bir oran üstü yaptığı tahminler
        </p>

        <v-container fluid class="px-2 px-md-4">
          <v-row>
            <!-- Dinamik olarak günün panenkası tahminlerini göster -->
            <v-col
                cols="12"
                sm="6"
                md="4"
                v-for="prediction in todaysPicks"
                :key="prediction.id"
                class="px-2 px-md-3"
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
            <v-col cols="12" v-if="todaysPicks.length === 0" class="px-2 px-md-3">
              <v-card elevation="2" class="pa-6 pa-md-8 text-center">
                <v-icon size="64" color="grey-lighten-1">mdi-calendar-remove</v-icon>
                <p class="text-h6 text-grey mt-4">
                  Henüz günün panenkası seçilmemiş.
                </p>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
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
.home-view {
  width: 100%;
  overflow-x: hidden;
}

.hero-section {
  background: linear-gradient(135deg, #FFF8E1 0%, #FFE0B2 100%);
  width: 100%;

  .hero-title {
    font-size: 2.5rem;
    font-weight: bold;
    color: #FF9800;

    @media (max-width: 960px) {
      font-size: 2rem;
    }

    @media (max-width: 600px) {
      font-size: 1.75rem;
    }
  }

  .hero-subtitle {
    font-size: 1.5rem;

    @media (max-width: 960px) {
      font-size: 1.25rem;
    }

    @media (max-width: 600px) {
      font-size: 1.1rem;
    }
  }

  .hero-description {
    font-size: 1rem;
    color: #666;

    @media (max-width: 600px) {
      font-size: 0.9rem;
    }
  }
}

.today-match-section {
  background-color: #FFF8E1;
  width: 100%;

  .section-title {
    font-size: 2rem;
    font-weight: 700;
    color: #FF9800;

    @media (max-width: 960px) {
      font-size: 1.75rem;
    }

    @media (max-width: 600px) {
      font-size: 1.5rem;
    }
  }

  .section-description {
    font-size: 1.125rem;
    color: #666;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;

    @media (max-width: 600px) {
      font-size: 1rem;
    }
  }

  .match-card {
    background: white;
    border-radius: 16px !important;
    padding: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
    transition: all 0.3s ease;
    height: 100%;

    @media (max-width: 600px) {
      padding: 16px;
      border-radius: 12px !important;
    }

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15) !important;
    }

    .match-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      @media (max-width: 600px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .league-chip {
        background-color: #FF9800 !important;
        color: white !important;
        font-weight: 600;
        font-size: 0.75rem;
      }

      .match-date {
        font-size: 0.7rem;
        color: #666;

        @media (max-width: 600px) {
          font-size: 0.65rem;
        }
      }
    }

    .editor-badge {
      margin-bottom: 16px;
      text-align: center;

      @media (max-width: 600px) {
        margin-bottom: 12px;
      }
    }

    .teams-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 20px 0;

      @media (max-width: 600px) {
        margin: 16px 0;
      }

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
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f5f5;

          @media (max-width: 600px) {
            width: 45px;
            height: 45px;
          }

          .team-emoji {
            font-size: 2rem;

            @media (max-width: 600px) {
              font-size: 1.5rem;
            }
          }
        }

        .team-name {
          font-weight: 700;
          font-size: 0.875rem;
          text-align: center;
          color: #333;

          @media (max-width: 600px) {
            font-size: 0.75rem;
          }
        }
      }

      .vs-divider {
        flex: 0 0 auto;
        padding: 0 12px;

        @media (max-width: 600px) {
          padding: 0 6px;
        }

        .vs-text {
          font-size: 1.25rem;
          font-weight: 700;
          color: #999;

          @media (max-width: 600px) {
            font-size: 1rem;
          }
        }
      }
    }

    .prediction-box {
      background: linear-gradient(135deg, #FFF8E1 0%, #FFE0B2 100%);
      padding: 14px;
      border-radius: 12px;
      text-align: center;
      margin: 16px 0;

      @media (max-width: 600px) {
        padding: 12px;
        margin: 12px 0;
      }

      .prediction-label {
        font-size: 0.7rem;
        color: #666;
        margin-bottom: 4px;
      }

      .prediction-text {
        font-size: 1rem;
        font-weight: 700;
        color: #FF9800;
        margin-bottom: 4px;

        @media (max-width: 600px) {
          font-size: 0.9rem;
        }
      }

      .prediction-odds {
        font-size: 0.95rem;
        font-weight: 600;
        color: #FBBF24;

        @media (max-width: 600px) {
          font-size: 0.85rem;
        }
      }
    }

    .cta-button {
      margin-top: 16px;
      text-transform: none !important;
      font-weight: 700;
      font-size: 0.875rem;
      padding: 18px 0 !important;
      border-radius: 12px !important;
      box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3) !important;
      transition: all 0.3s ease;

      @media (max-width: 600px) {
        font-size: 0.8rem;
        padding: 14px 0 !important;
        margin-top: 12px;
      }

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
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.6s ease-out;
}
</style>