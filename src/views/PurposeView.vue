<template>
  <div class="purpose-view">
    <!-- Hero Section -->
    <section class="hero-section py-16">
      <div class="content-section">
        <v-row justify="center">
          <v-col cols="12" md="10" class="text-center">
            <v-icon size="80" color="primary" class="mb-4">mdi-target</v-icon>
            <h1 class="text-h2 font-weight-bold text-primary mb-4 fade-in">
              Amacımız
            </h1>
            <p class="text-h5 mb-4 fade-in">
              Kaliteli İçerik, Şeffaf Analiz, Güvenilir Tahmin
            </p>
            <p class="text-h6 mb-0 fade-in text-grey">
              Panenka Tahminler olarak misyonumuz, futbolseverlere ve bahis tutkunlarına
              en doğru ve güvenilir tahminleri sunmaktır.
            </p>
          </v-col>
        </v-row>
      </div>
    </section>

    <!-- Content Section -->
    <section class="content-section-main py-12">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="10" lg="8">
            <v-card elevation="4" class="purpose-card">
              <v-card-text class="pa-8">
                <p class="text-body-1 purpose-text mb-8">
                  "Panenka tahminler" ailesine hoş geldin. Bilindiği üzere futbol var olduğundan beri kitleleri peşinden sürükleyen, içinde heyecan, mücadele, taktik, zeka, yetenek gibi birçok dinamikleri içinde barındıran keyifli bir spor. Kimi aktif sporcu, kimi teknik direktör, kimi kulüp yöneticisi, kimi taraftar, kimi sadece bir spor seyircisi, kimi için yaşam amacı. Bir gerçek çok nettir ki futbol diğer spor dallarından farklı olarak halkın her kesiminden kişilerin yorumunun olduğu bir spordur.
                </p>
                <p class="text-body-1 purpose-text mb-8">
                  Kimi içinse tahminlerde bulunup müsabakasına heyecan katma isteğidir.
                </p>
                <p class="text-body-1 purpose-text">
                  Panenka tahminler ailesi olarak bizler de futbol müsabakalarına tahminlerde bulunmaktan keyif alıyor, doğru analiz için detaylara dikkat ediyor ve haftanın belirli günleri oynanacak olan maçlar hakkındaki yorumlarımızı siz kıymetli misafirlerimiz ile paylaşıyoruz. Paylaştığımız tahminler, tamamen kendi analizlerimizin ve futbola olan tutkumuzun bir ürünüdür. Tahminlermizi takip edebilir, kendi yorumunla birleştirip değerlendirebilirsin. Faydalan, düşün, keyif al !
                </p>
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
.purpose-view {
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

.content-section-main {
  background-color: #FFF8E1;
}

.purpose-card {
  border-radius: 16px !important;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1) !important;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15) !important;
  }

  .purpose-text {
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