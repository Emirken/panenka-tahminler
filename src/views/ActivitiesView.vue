<template>
  <div class="activities-view py-12">
    <v-container>
      <h1 class="text-h3 font-weight-bold text-center text-primary mb-4">
        Spor Toto Etkinliği
      </h1>
      <p class="text-h6 text-center mb-12">
        15 doğru tahmini yap, büyük ödülü kazan!
      </p>

      <!-- Coupon Form -->
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card elevation="4" class="pa-6">
            <div v-for="(match, index) in matches" :key="index" class="mb-6">
              <v-row align="center">
                <v-col cols="1" class="text-center">
                  <span class="text-h6 font-weight-bold">{{ index + 1 }}.</span>
                </v-col>

                <v-col cols="7">
                  <span class="font-weight-medium">{{ match.teams }}</span>
                </v-col>

                <v-col cols="4">
                  <v-btn-toggle
                      v-model="match.selected"
                      mandatory
                      divided
                      density="compact"
                      color="primary"
                  >
                    <v-btn value="1" size="small">1</v-btn>
                    <v-btn value="0" size="small">0</v-btn>
                    <v-btn value="2" size="small">2</v-btn>
                  </v-btn-toggle>
                </v-col>
              </v-row>

              <v-divider v-if="index < matches.length - 1" class="mt-4" />
            </div>

            <v-btn
                block
                color="primary"
                size="x-large"
                class="mt-6"
                @click="submitCoupon"
            >
              Kaydet
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Success Dialog -->
    <v-dialog v-model="showSuccessDialog" max-width="400">
      <v-card>
        <v-card-text class="text-center pa-8">
          <v-icon size="80" color="success">mdi-check-circle</v-icon>
          <h3 class="text-h5 font-weight-bold mt-4 mb-2">Başarılı!</h3>
          <p class="text-body-1">Kuponunuz başarıyla kaydedildi.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="showSuccessDialog = false">Tamam</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Match {
  teams: string
  selected: string
}

const matches = ref<Match[]>([
  { teams: 'Beşiktaş - Trabzonspor', selected: '1' },
  { teams: 'Ankaragücü - Alanyaspor', selected: '1' },
  { teams: 'Kasımpaşa - Adana Demirspor', selected: '1' },
  { teams: 'Kayserispor - Başakşehir', selected: '1' },
  { teams: 'Rizespor - Sivasspor', selected: '1' },
  { teams: 'Hatayspor - Antalyaspor', selected: '1' },
  { teams: 'Pendikspor - Fatih Karagümrük', selected: '1' },
  { teams: 'Gaziantep FK - Konyaspor', selected: '1' },
  { teams: 'Manchester City - Everton', selected: '1' },
  { teams: 'Real Madrid - Girona', selected: '1' },
  { teams: 'Bayer Leverkusen - Bayern Münih', selected: '1' },
  { teams: 'Roma - Inter', selected: '1' },
  { teams: 'Lazio - Bologna', selected: '1' },
  { teams: 'Napoli - Genoa', selected: '1' },
  { teams: 'Freiburg - Eintracht Frankfurt', selected: '1' },
])

const showSuccessDialog = ref(false)

const submitCoupon = () => {
  // Kupon kaydetme işlemi burada yapılacak
  showSuccessDialog.value = true
  console.log('Kupon kaydedildi:', matches.value)
}
</script>

<style scoped lang="scss">
.activities-view {
  background-color: #FFF8E1;
  min-height: calc(100vh - 200px);
}
</style>