<template>
  <v-card elevation="4" class="prediction-form-card">
    <v-card-title class="bg-primary text-white pa-4">
      <v-icon class="mr-2">mdi-soccer</v-icon>
      <span class="text-h6">{{ isEdit ? 'Tahmini Düzenle' : 'Yeni Tahmin Ekle' }}</span>
    </v-card-title>

    <v-card-text class="pa-6">
      <v-form ref="formRef" @submit.prevent="handleSubmit">
        <v-row>
          <!-- League Selection -->
          <v-col cols="12" md="6">
            <v-select
                v-model="formData.league"
                :items="leagues"
                label="Liga Seçin"
                prepend-inner-icon="mdi-trophy"
                variant="outlined"
                :rules="[rules.required]"
            />
          </v-col>

          <!-- Match Date -->
          <v-col cols="12" md="6">
            <v-text-field
                v-model="formData.matchDate"
                label="Maç Tarihi ve Saati"
                type="datetime-local"
                prepend-inner-icon="mdi-calendar"
                variant="outlined"
                :rules="[rules.required]"
            />
          </v-col>

          <!-- Home Team - SELECT BOX -->
          <v-col cols="12" md="6">
            <v-select
                v-model="formData.homeTeam"
                :items="availableTeams"
                label="Ev Sahibi Takım"
                prepend-inner-icon="mdi-shield"
                variant="outlined"
                :disabled="!formData.league"
                :hint="!formData.league ? 'Önce liga seçin' : ''"
                persistent-hint
                :rules="[rules.required]"
            />
          </v-col>

          <!-- Away Team - SELECT BOX -->
          <v-col cols="12" md="6">
            <v-select
                v-model="formData.awayTeam"
                :items="availableTeams"
                label="Deplasman Takımı"
                prepend-inner-icon="mdi-shield-outline"
                variant="outlined"
                :disabled="!formData.league"
                :hint="!formData.league ? 'Önce liga seçin' : ''"
                persistent-hint
                :rules="[rules.required]"
            />
          </v-col>

          <!-- Home Logo - OTOMATIK -->
          <v-col cols="12" md="6">
            <v-text-field
                v-model="formData.homeLogo"
                label="Ev Sahibi Logo (Otomatik)"
                prepend-inner-icon="mdi-image"
                variant="outlined"
                placeholder="🔴⚪"
                :hint="teamLogos[formData.homeTeam] ? 'Otomatik dolduruldu' : 'Manuel girebilirsiniz'"
                persistent-hint
                readonly
            />
          </v-col>

          <!-- Away Logo - OTOMATIK -->
          <v-col cols="12" md="6">
            <v-text-field
                v-model="formData.awayLogo"
                label="Deplasman Logo (Otomatik)"
                prepend-inner-icon="mdi-image"
                variant="outlined"
                placeholder="💛💙"
                :hint="teamLogos[formData.awayTeam] ? 'Otomatik dolduruldu' : 'Manuel girebilirsiniz'"
                persistent-hint
                readonly
            />
          </v-col>

          <!-- Prediction -->
          <v-col cols="12" md="8">
            <v-text-field
                v-model="formData.prediction"
                label="Tahmin"
                prepend-inner-icon="mdi-bullseye"
                variant="outlined"
                placeholder="Örn: 2.5 Gol Üstü, Karşılıklı Gol"
                :rules="[rules.required]"
            />
          </v-col>

          <!-- Odds -->
          <v-col cols="12" md="4">
            <v-text-field
                v-model.number="formData.odds"
                label="Oran"
                type="number"
                step="0.01"
                prepend-inner-icon="mdi-chart-line"
                variant="outlined"
                :rules="[rules.required, rules.positiveNumber]"
            />
          </v-col>

          <!-- Explanation -->
          <v-col cols="12">
            <v-textarea
                v-model="formData.explanation"
                label="Açıklama / Analiz"
                prepend-inner-icon="mdi-text"
                variant="outlined"
                rows="4"
                :rules="[rules.required]"
                placeholder="Tahmin açıklamanızı buraya yazın..."
            />
          </v-col>

          <!-- Preview -->
          <v-col cols="12" v-if="formData.homeTeam && formData.awayTeam">
            <v-card variant="outlined" class="preview-card">
              <v-card-title class="text-center text-caption text-grey">
                Önizleme
              </v-card-title>
              <v-card-text class="pa-4">
                <div class="preview-content">
                  <v-chip color="primary" size="small" class="mb-2">
                    {{ formData.league || 'Liga' }}
                  </v-chip>
                  <div class="preview-teams">
                    <div class="preview-team">
                      <span class="team-logo">{{ formData.homeLogo || '⚽' }}</span>
                      <span class="team-name">{{ formData.homeTeam }}</span>
                    </div>
                    <span class="vs">VS</span>
                    <div class="preview-team">
                      <span class="team-logo">{{ formData.awayLogo || '⚽' }}</span>
                      <span class="team-name">{{ formData.awayTeam }}</span>
                    </div>
                  </div>
                  <div class="preview-prediction">
                    <p><strong>{{ formData.prediction || 'Tahmin' }}</strong></p>
                    <p class="text-primary">Oran: {{ formData.odds || '0.00' }}</p>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <v-card-actions class="pa-6 pt-0">
      <v-spacer />
      <v-btn @click="handleCancel" variant="text">
        İptal
      </v-btn>
      <v-btn
          color="primary"
          @click="handleSubmit"
          :loading="loading"
      >
        {{ isEdit ? 'Güncelle' : 'Kaydet' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Prediction } from '@/types'
import { leagueTeams, teamLogos } from '@/data/teams'

interface Props {
  prediction?: Prediction | null
  isEdit?: boolean
}

interface Emits {
  (e: 'submit', data: any): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  prediction: null,
  isEdit: false,
})

const emit = defineEmits<Emits>()

const formRef = ref()
const loading = ref(false)

const leagues = [
  'Premier Lig',
  'İtalya Serie A',
  'Fransa Ligue 1',
  'Almanya Bundesliga',
  'İspanya La Liga',
  'Türkiye Süper Lig',
  'PTT 1. Lig',
  'UEFA Şampiyonlar Ligi',
  'UEFA Avrupa Ligi',
  'Diğer Ligler'
]

const formData = ref({
  league: '',
  homeTeam: '',
  awayTeam: '',
  homeLogo: '',
  awayLogo: '',
  prediction: '',
  odds: 0,
  explanation: '',
  matchDate: '',
})

const rules = {
  required: (value: any) => !!value || 'Bu alan zorunludur',
  positiveNumber: (value: number) => value > 0 || 'Oran 0\'dan büyük olmalıdır',
}

// Liga değiştiğinde takımları getir
const availableTeams = computed(() => {
  if (!formData.value.league) return []
  return leagueTeams[formData.value.league] || []
})

// Liga değiştiğinde takım seçimlerini sıfırla
watch(() => formData.value.league, () => {
  formData.value.homeTeam = ''
  formData.value.awayTeam = ''
  formData.value.homeLogo = ''
  formData.value.awayLogo = ''
})

// Ev sahibi takım değiştiğinde logoyu otomatik getir
watch(() => formData.value.homeTeam, (newTeam) => {
  if (newTeam && teamLogos[newTeam]) {
    formData.value.homeLogo = teamLogos[newTeam]
  }
})

// Deplasman takımı değiştiğinde logoyu otomatik getir
watch(() => formData.value.awayTeam, (newTeam) => {
  if (newTeam && teamLogos[newTeam]) {
    formData.value.awayLogo = teamLogos[newTeam]
  }
})

// Watch for prediction changes (for edit mode)
watch(
    () => props.prediction,
    (newPrediction) => {
      if (newPrediction) {
        formData.value = {
          league: newPrediction.league,
          homeTeam: newPrediction.homeTeam,
          awayTeam: newPrediction.awayTeam,
          homeLogo: newPrediction.homeLogo,
          awayLogo: newPrediction.awayLogo,
          prediction: newPrediction.prediction,
          odds: newPrediction.odds,
          explanation: newPrediction.explanation,
          matchDate: newPrediction.matchDate,
        }
      }
    },
    { immediate: true }
)

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate()

  if (valid) {
    loading.value = true

    setTimeout(() => {
      emit('submit', {
        league: formData.value.league,
        homeTeam: formData.value.homeTeam,
        awayTeam: formData.value.awayTeam,
        homeLogo: formData.value.homeLogo || '⚽',
        awayLogo: formData.value.awayLogo || '⚽',
        prediction: formData.value.prediction,
        odds: formData.value.odds,
        explanation: formData.value.explanation,
        matchDate: formData.value.matchDate,
      })

      loading.value = false
      resetForm()
    }, 500)
  }
}

const handleCancel = () => {
  resetForm()
  emit('cancel')
}

const resetForm = () => {
  formData.value = {
    league: '',
    homeTeam: '',
    awayTeam: '',
    homeLogo: '',
    awayLogo: '',
    prediction: '',
    odds: 0,
    explanation: '',
    matchDate: '',
  }
  formRef.value?.reset()
}
</script>

<style scoped lang="scss">
.prediction-form-card {
  border-radius: 12px !important;

  .preview-card {
    background-color: #FFF8E1;
    border-radius: 8px;

    .preview-content {
      text-align: center;

      .preview-teams {
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin: 16px 0;

        .preview-team {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;

          .team-logo {
            font-size: 2rem;
          }

          .team-name {
            font-weight: 600;
            font-size: 0.875rem;
          }
        }

        .vs {
          font-weight: 700;
          color: #999;
          font-size: 1.5rem;
        }
      }

      .preview-prediction {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid #ddd;

        p {
          margin: 4px 0;
        }
      }
    }
  }
}
</style>