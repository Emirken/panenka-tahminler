<template>
  <section class="todays-match-section py-12">
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
                {{ match.league }}
              </v-chip>
              <span class="match-date">{{ formattedDate }}</span>
            </div>

            <!-- Teams Section -->
            <div class="teams-container">
              <div class="team-block">
                <div class="team-logo-wrapper">
                  <img
                      :src="match.homeLogo"
                      :alt="match.homeTeam"
                      class="team-logo"
                  />
                </div>
                <span class="team-name">{{ match.homeTeam }}</span>
              </div>

              <div class="vs-divider">
                <span class="vs-text">VS</span>
              </div>

              <div class="team-block">
                <div class="team-logo-wrapper">
                  <img
                      :src="match.awayLogo"
                      :alt="match.awayTeam"
                      class="team-logo"
                  />
                </div>
                <span class="team-name">{{ match.awayTeam }}</span>
              </div>
            </div>

            <!-- Prediction Section -->
            <div class="prediction-box">
              <p class="prediction-label">Tahmin</p>
              <p class="prediction-text">{{ match.prediction }}</p>
              <p class="prediction-odds">Oran: {{ match.odds }}</p>
            </div>

            <!-- CTA Button -->
            <v-btn
                block
                color="primary"
                size="large"
                class="cta-button"
                @click="handleSubscribe"
            >
              Detaylı Analiz için Abone Ol
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Match } from '@/types'

interface Props {
  match: Match
}

interface Emits {
  (e: 'subscribe'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formattedDate = computed(() => {
  return `${props.match.matchDate} - ${props.match.matchTime}`
})

const handleSubscribe = () => {
  emit('subscribe')
}
</script>

<style scoped lang="scss">
.todays-match-section {
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
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15) !important;
    }

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
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

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

.content-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

// Mobile responsive
@media (max-width: 600px) {
  .todays-match-section {
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