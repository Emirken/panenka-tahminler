<template>
  <section class="features-section py-12">
    <div class="content-section">
      <h2 class="section-title text-center mb-10">
        Üye Etkinliklerimiz
      </h2>

      <v-row>
        <v-col
            cols="12"
            md="4"
            v-for="(feature, index) in features"
            :key="feature.id"
        >
          <v-card
              elevation="2"
              class="feature-card h-100"
              :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <v-card-text class="pa-8 text-center">
              <v-avatar
                  size="80"
                  :color="getFeatureColor(index)"
                  class="mb-4 feature-icon"
              >
                <v-icon size="40" color="white">{{ feature.icon }}</v-icon>
              </v-avatar>

              <h3 class="feature-title mb-3">{{ feature.title }}</h3>
              <p class="feature-description">{{ feature.description }}</p>

              <!-- Optional Action Button -->
              <v-btn
                  v-if="showActions"
                  variant="outlined"
                  :color="getFeatureColor(index)"
                  size="small"
                  class="mt-4"
                  @click="handleFeatureClick(feature)"
              >
                Daha Fazla Bilgi
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Additional Info Banner -->
      <v-row class="mt-8" v-if="showBanner">
        <v-col cols="12">
          <v-card class="info-banner" elevation="4">
            <v-card-text class="pa-6 text-center">
              <v-icon size="48" color="primary" class="mb-2">mdi-star</v-icon>
              <h3 class="text-h5 font-weight-bold mb-2">Premium Üyelik</h3>
              <p class="text-body-1 mb-4">
                Tüm etkinliklere erişim kazanın ve özel ayrıcalıklardan yararlanın!
              </p>
              <v-btn color="primary" size="large" @click="handlePremiumClick">
                Hemen Üye Ol
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Activity } from '@/types'

interface Props {
  features: Activity[]
  showActions?: boolean
  showBanner?: boolean
}

interface Emits {
  (e: 'feature-click', feature: Activity): void
  (e: 'premium-click'): void
}

const props = withDefaults(defineProps<Props>(), {
  showActions: false,
  showBanner: true,
})

const emit = defineEmits<Emits>()

const featureColors = ['primary', 'success', 'info', 'warning', 'error', 'secondary']

const getFeatureColor = (index: number) => {
  return featureColors[index % featureColors.length]
}

const handleFeatureClick = (feature: Activity) => {
  emit('feature-click', feature)
}

const handlePremiumClick = () => {
  emit('premium-click')
}
</script>

<style scoped lang="scss">
.features-section {
  background-color: #FFF8E1;
  position: relative;

  .content-section {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .section-title {
    font-size: 2rem;
    font-weight: 700;
    color: #FF9800;
  }

  .feature-card {
    border-radius: 12px !important;
    transition: all 0.3s ease;
    animation: fadeInUp 0.6s ease-out;
    animation-fill-mode: both;

    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15) !important;

      .feature-icon {
        transform: scale(1.1) rotate(5deg);
      }
    }

    .feature-icon {
      transition: all 0.3s ease;
    }

    .feature-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #333;
    }

    .feature-description {
      font-size: 0.875rem;
      color: #666;
      line-height: 1.6;
      margin: 0;
    }
  }

  .info-banner {
    background: linear-gradient(135deg, #FFE0B2 0%, #FFF8E1 100%);
    border-radius: 16px !important;
    border: 2px solid #FF9800;
  }

  .h-100 {
    height: 100%;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Mobile responsive
@media (max-width: 600px) {
  .features-section {
    .section-title {
      font-size: 1.5rem;
    }

    .feature-card {
      margin-bottom: 16px;

      .v-card-text {
        padding: 24px !important;
      }

      .feature-icon {
        width: 64px !important;
        height: 64px !important;

        .v-icon {
          font-size: 32px !important;
        }
      }

      .feature-title {
        font-size: 1.125rem;
      }
    }
  }
}
</style>