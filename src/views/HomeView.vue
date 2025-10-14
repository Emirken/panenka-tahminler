<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero-section py-16">
      <div class="content-section">
        <v-row justify="center">
          <v-col cols="12" md="10" class="text-center">
            <h1 class="text-h2 font-weight-bold text-primary mb-4 fade-in">
              Hoş Geldiniz!
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

    <!-- Today's Match -->
    <section class="today-match-section py-12">
      <div class="content-section">
        <h2 class="section-title text-center mb-8">
          <span class="title-gunun">Günün</span> <span class="title-panenkasi">Panenkası</span>
        </h2>

        <v-row justify="center">
          <v-col cols="12" sm="10" md="6" lg="5">
            <v-card elevation="6" class="match-card">
              <!-- Header with League and Date -->
              <div class="match-header">
                <v-chip
                    color="primary"
                    size="small"
                    class="league-chip"
                >
                  Süper Lig
                </v-chip>
                <span class="match-date">28 Ekim 2023 - 21:00</span>
              </div>

              <!-- Teams Section -->
              <div class="teams-container">
                <div class="team-block">
                  <div class="team-logo-wrapper">
                    <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8JqZHYHWzIDkcMqLFXsnJhH7xOR0l-8ZAnaHHGOjUuP5dZ7UJiwHYyjkk71aOTeaSEEVuD8GB3VBme0NsiiL8iil_AMp1lxJOye_BwrHUHZwVRWOturAGaIDAt_7FuovJkchSzOQKk0oqfomSDPBlpqczuI_1fCXpJNbQzEFtDn_6dXulMC14DuDbLQ3H22DehTti8Zz5lB-Nfq1a4N2CzGcH1arEFK1YIFtddtwRph9GXWVEbhsmzlVzDOjmQrl1L_Rk3s0UzSE"
                        alt="Galatasaray"
                        class="team-logo"
                    />
                  </div>
                  <span class="team-name">Galatasaray</span>
                </div>

                <div class="vs-divider">
                  <span class="vs-text">VS</span>
                </div>

                <div class="team-block">
                  <div class="team-logo-wrapper">
                    <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYFJFQiP8FnEV87PzNCWRDJHCesrQWWMsa0A5S1OIN_3DPnIpMPAEsXUlL2mcZszIYI_dqANH706q_CH2o9Mk3fMvGevwXoAXQFIb32rGP6VjaNBmvVD15CANCLfw7ft5g6wkIiGozexb5aZ6WRxtT8g-mXmSFB6UTQVDUIfn6uT5LP3cjmDtv3XMASNPvFy7LIfTGpQ1vsGbPhUrVpiN8Poo65rFcCB4Gt0E_ZKobaa97BqepkExCTyJ2h9LComV19CWgniiJSRA"
                        alt="Fenerbahçe"
                        class="team-logo"
                    />
                  </div>
                  <span class="team-name">Fenerbahçe</span>
                </div>
              </div>

              <!-- Prediction Section -->
              <div class="prediction-box">
                <p class="prediction-label">Tahmin</p>
                <p class="prediction-text">Maç Sonucu 1 & 2.5 Gol Üstü</p>
                <p class="prediction-odds">Oran: 2.75</p>
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
        </v-row>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section py-12">
      <div class="content-section">
        <h2 class="text-h4 font-weight-bold text-center mb-10 text-primary">
          Üye Etkinliklerimiz
        </h2>

        <v-row>
          <v-col cols="12" md="4" v-for="feature in features" :key="feature.id">
            <v-card elevation="2" class="h-100 text-center pa-6">
              <v-avatar size="80" color="primary" class="mb-4">
                <v-icon size="40" color="white">{{ feature.icon }}</v-icon>
              </v-avatar>

              <h3 class="text-h6 font-weight-bold mb-3">{{ feature.title }}</h3>
              <p class="text-body-2">{{ feature.description }}</p>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useActivitiesStore } from '@/store/activities'

const activitiesStore = useActivitiesStore()

const features = computed(() => activitiesStore.allActivities)
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
    margin-bottom: 2rem;

    .title-gunun {
      color: #FF9800;
    }

    .title-panenkasi {
      color: #FBBF24;
    }
  }

  .match-card {
    background: white;
    border-radius: 16px !important;
    padding: 32px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;

    .match-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      .league-chip {
        background-color: #FF9800 !important;
        color: white !important;
        font-weight: 600;
      }

      .match-date {
        font-size: 0.875rem;
        color: #666;
      }
    }

    .teams-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 32px 0;

      .team-block {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;

        .team-logo-wrapper {
          width: 80px;
          height: 80px;
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
        }

        .team-name {
          font-weight: 700;
          font-size: 1.125rem;
          text-align: center;
          color: #333;
        }
      }

      .vs-divider {
        flex: 0 0 auto;
        padding: 0 20px;

        .vs-text {
          font-size: 2rem;
          font-weight: 700;
          color: #999;
        }
      }
    }

    .prediction-box {
      background: linear-gradient(135deg, #FFF8E1 0%, #FFE0B2 100%);
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      margin: 24px 0;

      .prediction-label {
        font-size: 0.875rem;
        color: #666;
        margin-bottom: 8px;
      }

      .prediction-text {
        font-size: 1.25rem;
        font-weight: 700;
        color: #FF9800;
        margin-bottom: 8px;
      }

      .prediction-odds {
        font-size: 1.125rem;
        font-weight: 600;
        color: #FBBF24;
      }
    }

    .cta-button {
      margin-top: 24px;
      text-transform: none !important;
      font-weight: 700;
      font-size: 1rem;
      padding: 24px 0 !important;
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

.features-section {
  background-color: #FFF8E1;
}

.h-100 {
  height: 100%;
}

.content-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

// Mobile responsive
@media (max-width: 600px) {
  .today-match-section {
    .match-card {
      padding: 20px;

      .teams-container {
        .team-block {
          .team-logo-wrapper {
            width: 60px;
            height: 60px;
          }

          .team-name {
            font-size: 0.875rem;
          }
        }

        .vs-divider {
          padding: 0 10px;

          .vs-text {
            font-size: 1.5rem;
          }
        }
      }

      .prediction-box {
        .prediction-text {
          font-size: 1rem;
        }
      }
    }
  }
}
</style>