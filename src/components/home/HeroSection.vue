<template>
  <section class="hero-section py-16">
    <div class="content-section">
      <v-row justify="center">
        <v-col cols="12" md="10" class="text-center">
          <h1 class="hero-title fade-in">
            Hoş Geldiniz!
          </h1>
          <p class="hero-subtitle mb-8 fade-in">
            Tahminlerde İsabet, Kazançta Zirve.
          </p>
          <p class="hero-description mb-0 fade-in">
            Panenka Tahminler, uzman editör kadromuzun analizleri ve özel algoritmalarımız ile
            hazırlanan maç tahminlerini sizlerle buluşturuyor. Üyelik ve abonelik sistemlerimizle
            kazancınızı katlayın, heyecana ortak olun!
          </p>

          <!-- CTA Buttons -->
          <div class="cta-buttons mt-8">
            <v-btn
                color="primary"
                size="x-large"
                class="mr-4"
                @click="handleGetStarted"
            >
              Hemen Başla
            </v-btn>
            <v-btn
                variant="outlined"
                color="primary"
                size="x-large"
                @click="handleLearnMore"
            >
              Daha Fazla Bilgi
            </v-btn>
          </div>

          <!-- Stats -->
          <v-row class="stats-row mt-12" justify="center">
            <v-col cols="6" sm="3">
              <div class="stat-item">
                <h3 class="stat-number">1000+</h3>
                <p class="stat-label">Başarılı Tahmin</p>
              </div>
            </v-col>
            <v-col cols="6" sm="3">
              <div class="stat-item">
                <h3 class="stat-number">85%</h3>
                <p class="stat-label">Başarı Oranı</p>
              </div>
            </v-col>
            <v-col cols="6" sm="3">
              <div class="stat-item">
                <h3 class="stat-number">5000+</h3>
                <p class="stat-label">Mutlu Üye</p>
              </div>
            </v-col>
            <v-col cols="6" sm="3">
              <div class="stat-item">
                <h3 class="stat-number">7/24</h3>
                <p class="stat-label">Destek</p>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Emits {
  (e: 'get-started'): void
  (e: 'learn-more'): void
}

const emit = defineEmits<Emits>()

const handleGetStarted = () => {
  emit('get-started')
}

const handleLearnMore = () => {
  emit('learn-more')
}
</script>

<style scoped lang="scss">
.hero-section {
  background: linear-gradient(135deg, #FFF8E1 0%, #FFE0B2 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 50%, rgba(255, 152, 0, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }

  .content-section {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    position: relative;
    z-index: 1;
  }

  .hero-title {
    font-size: 3.5rem;
    font-weight: 800;
    color: #FF9800;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);

    @media (max-width: 600px) {
      font-size: 2.5rem;
    }
  }

  .hero-subtitle {
    font-size: 1.75rem;
    font-weight: 500;
    color: #FBBF24;

    @media (max-width: 600px) {
      font-size: 1.25rem;
    }
  }

  .hero-description {
    font-size: 1.125rem;
    color: #666;
    max-width: 800px;
    margin: 0 auto;
    line-height: 1.8;

    @media (max-width: 600px) {
      font-size: 1rem;
    }
  }

  .cta-buttons {
    display: flex;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;

    .v-btn {
      text-transform: none;
      font-weight: 600;
      border-radius: 12px;
      padding: 0 32px;
    }
  }

  .stats-row {
    .stat-item {
      text-align: center;
      padding: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }

      .stat-number {
        font-size: 2.5rem;
        font-weight: 700;
        color: #FF9800;
        margin-bottom: 8px;
      }

      .stat-label {
        font-size: 0.875rem;
        color: #666;
        margin: 0;
      }
    }
  }
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