<template>
  <div class="read-view">
    <!-- Hero Section -->
    <section class="hero-section py-16">
      <div class="content-section">
        <v-row justify="center">
          <v-col cols="12" md="10" class="text-center">
            <h1 class="text-h2 font-weight-bold text-primary mb-4 fade-in">
              Mutlaka Oku
            </h1>
          </v-col>
        </v-row>
      </div>
    </section>

    <!-- Content Section -->
    <section class="content-section-wrapper py-12">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="10" lg="8">
            <v-card elevation="4" class="content-card">
              <v-card-text class="pa-8">

                <br>

                <p class="text-body-1 reading-text">
                  Panenka Tahminler Ailesi olarak paylaştığımız tahminler yatırım tavsiyesi değildir. Tahminlerimizin özverili bir çalışma sonucu ortaya çıktığını söyleyebiliriz ancak bunun bir şans oyunu olduğu unutulmamalıdır.
                </p>
                
                <br>

                <p class="text-body-1 reading-text">
                  Bahis oranları platformlar arası değişiklik göstermektedir. Hiçbir platform ile çalışmadığımızı , anlaşmamız olmadığını açık şekilde söyleyebiliriz. Sunduğumuz oranlar platformlar arası ortalama oranlardır.</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.read-view {
  background-color: #FFF8E1;
  min-height: calc(100vh - 200px);
}

.hero-section {
  background: linear-gradient(135deg, #FFF8E1 0%, #FFE0B2 100%);
}

.content-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.content-section-wrapper {
  background-color: #FFF8E1;
}

.content-card {
  border-radius: 16px !important;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1) !important;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15) !important;
  }

  .reading-text {
    line-height: 1.8;
    color: #555;
    font-size: 1.125rem;
    text-align: justify;
  }
}

.h-100 {
  height: 100%;
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