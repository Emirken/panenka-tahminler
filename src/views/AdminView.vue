<template>
  <div class="admin-view py-12">
    <div class="content-wrapper">
      <v-row>
        <v-col cols="12">
          <h1 class="text-h3 font-weight-bold text-primary mb-2">
            Admin Paneli
          </h1>
          <p class="text-body-1 text-grey mb-8">
            Hoş geldin, {{ authStore.user?.username }}!
          </p>
        </v-col>
      </v-row>

      <!-- Navigation Tabs -->
      <v-row>
        <v-col cols="12">
          <v-card elevation="0" class="bg-transparent">
            <v-tabs
                v-model="activeTab"
                bg-color="white"
                color="primary"
            >
              <v-tab value="predictions">Tahminlerim</v-tab>
              <v-tab value="add-prediction">Yeni Tahmin Ekle</v-tab>
              <v-tab value="todays-picks">Günün Panenkası</v-tab>
              <v-tab value="activities">Etkinlikler</v-tab>
            </v-tabs>
          </v-card>
        </v-col>
      </v-row>

      <!-- Tab Content -->
      <v-row class="mt-6">
        <v-col cols="12">
          <!-- My Predictions Tab -->
          <div v-if="activeTab === 'predictions'">
            <v-card elevation="2">
              <v-card-title class="bg-primary text-white">
                <span class="text-h6">Tahminlerim</span>
              </v-card-title>
              <v-card-text class="pa-6">
                <div v-if="myPredictions.length === 0" class="text-center py-8">
                  <v-icon size="64" color="grey-lighten-1">mdi-clipboard-text-off</v-icon>
                  <p class="text-h6 text-grey mt-4">Henüz tahmin eklemediniz.</p>
                </div>

                <v-list v-else>
                  <v-list-item
                      v-for="prediction in myPredictions"
                      :key="prediction.id"
                      class="mb-4 border rounded"
                  >
                    <template v-slot:prepend>
                      <v-avatar color="primary" size="48">
                        <span class="text-h6">⚽</span>
                      </v-avatar>
                    </template>

                    <v-list-item-title class="font-weight-bold mb-2">
                      {{ prediction.homeTeam }} vs {{ prediction.awayTeam }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      <v-chip size="x-small" color="primary" class="mr-2">{{ prediction.league }}</v-chip>
                      {{ prediction.prediction }} - Oran: {{ prediction.odds }}
                    </v-list-item-subtitle>

                    <template v-slot:append>
                      <v-btn
                          icon
                          size="small"
                          color="error"
                          @click="deletePrediction(prediction.id)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </div>

          <!-- Add Prediction Tab -->
          <div v-if="activeTab === 'add-prediction'">
            <v-card elevation="2">
              <v-card-title class="bg-primary text-white">
                <span class="text-h6">Yeni Tahmin Ekle</span>
              </v-card-title>
              <v-card-text class="pa-6">
                <v-form ref="predictionForm">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-select
                          v-model="newPrediction.league"
                          :items="leagues"
                          label="Liga Seçin"
                          variant="outlined"
                          required
                          @update:model-value="onLeagueChange"
                      />
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                          v-model="newPrediction.matchDate"
                          label="Maç Tarihi ve Saati"
                          type="datetime-local"
                          variant="outlined"
                          required
                      />
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-select
                          v-if="newPrediction.league !== 'Diğer Ligler'"
                          v-model="newPrediction.homeTeam"
                          :items="availableTeams"
                          label="Ev Sahibi Takım"
                          variant="outlined"
                          required
                          :disabled="!newPrediction.league"
                          :hint="!newPrediction.league ? 'Önce liga seçin' : ''"
                          persistent-hint
                          @update:model-value="onHomeTeamChange"
                      />
                      <v-text-field
                          v-else
                          v-model="newPrediction.homeTeam"
                          label="Ev Sahibi Takım"
                          variant="outlined"
                          required
                          placeholder="Takım adını yazın"
                      />
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-select
                          v-if="newPrediction.league !== 'Diğer Ligler'"
                          v-model="newPrediction.awayTeam"
                          :items="availableTeams"
                          label="Deplasman Takımı"
                          variant="outlined"
                          required
                          :disabled="!newPrediction.league"
                          :hint="!newPrediction.league ? 'Önce liga seçin' : ''"
                          persistent-hint
                          @update:model-value="onAwayTeamChange"
                      />
                      <v-text-field
                          v-else
                          v-model="newPrediction.awayTeam"
                          label="Deplasman Takımı"
                          variant="outlined"
                          required
                          placeholder="Takım adını yazın"
                      />
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                          v-model="newPrediction.homeLogo"
                          :label="newPrediction.league === 'Diğer Ligler' ? 'Ev Sahibi Logo (Emoji)' : 'Ev Sahibi Logo (Otomatik)'"
                          variant="outlined"
                          :readonly="newPrediction.league !== 'Diğer Ligler'"
                          :hint="newPrediction.league === 'Diğer Ligler' ? 'Emoji ekleyin (ör: 🔴⚪)' : 'Takım seçilince otomatik dolar'"
                          persistent-hint
                          :placeholder="newPrediction.league === 'Diğer Ligler' ? '🔴⚪' : ''"
                      />
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                          v-model="newPrediction.awayLogo"
                          :label="newPrediction.league === 'Diğer Ligler' ? 'Deplasman Logo (Emoji)' : 'Deplasman Logo (Otomatik)'"
                          variant="outlined"
                          :readonly="newPrediction.league !== 'Diğer Ligler'"
                          :hint="newPrediction.league === 'Diğer Ligler' ? 'Emoji ekleyin (ör: 💛💙)' : 'Takım seçilince otomatik dolar'"
                          persistent-hint
                          :placeholder="newPrediction.league === 'Diğer Ligler' ? '💛💙' : ''"
                      />
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                          v-model="newPrediction.prediction"
                          label="Tahmin"
                          variant="outlined"
                          placeholder="2.5 Gol Üstü"
                          required
                      />
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                          v-model.number="newPrediction.odds"
                          label="Oran"
                          type="number"
                          step="0.01"
                          variant="outlined"
                          required
                      />
                    </v-col>

                    <v-col cols="12">
                      <v-textarea
                          v-model="newPrediction.explanation"
                          label="Açıklama"
                          variant="outlined"
                          rows="4"
                          required
                      />
                    </v-col>

                    <v-col cols="12">
                      <v-btn
                          block
                          color="primary"
                          size="large"
                          @click="addPrediction"
                      >
                        Tahmini Kaydet
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </div>

          <!-- Today's Picks Tab -->
          <div v-if="activeTab === 'todays-picks'">
            <v-card elevation="2">
              <v-card-title class="bg-primary text-white pa-4 d-flex justify-space-between align-center">
                <div>
                  <v-icon class="mr-2">mdi-star</v-icon>
                  <span class="text-h6">Günün Panenkası Yönetimi</span>
                </div>
                <v-chip color="white" variant="text">
                  {{ selectedTodaysPicks.length }}/3 Seçili
                </v-chip>
              </v-card-title>
              <v-card-text class="pa-6">
                <v-alert type="info" class="mb-4">
                  Ana sayfada gösterilecek maksimum 3 tahmin seçin. Her editörden 1 tahmin seçmeniz önerilir.
                </v-alert>

                <div v-if="allPredictions.length === 0" class="text-center py-8">
                  <v-icon size="64" color="grey-lighten-1">mdi-clipboard-text-off</v-icon>
                  <p class="text-h6 text-grey mt-4">Henüz tahmin eklenmemiş.</p>
                </div>

                <v-list v-else>
                  <v-list-item
                      v-for="prediction in allPredictions"
                      :key="prediction.id"
                      class="mb-4 border rounded"
                      :class="{ 'selected-pick': selectedTodaysPicks.includes(prediction.id) }"
                  >
                    <template v-slot:prepend>
                      <v-checkbox
                          :model-value="selectedTodaysPicks.includes(prediction.id)"
                          @update:model-value="toggleTodaysPick(prediction.id)"
                          :disabled="!selectedTodaysPicks.includes(prediction.id) && selectedTodaysPicks.length >= 3"
                          color="primary"
                      />
                    </template>

                    <v-list-item-title class="font-weight-bold mb-2">
                      {{ prediction.homeTeam }} {{ prediction.homeLogo }} vs {{ prediction.awayLogo }} {{ prediction.awayTeam }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      <v-chip size="x-small" color="secondary" class="mr-2">{{ prediction.editorName }}</v-chip>
                      <v-chip size="x-small" color="primary" class="mr-2">{{ prediction.league }}</v-chip>
                      {{ prediction.prediction }} - Oran: {{ prediction.odds }}
                    </v-list-item-subtitle>

                    <template v-slot:append>
                      <div class="d-flex align-center ga-2">
                        <v-chip
                            v-if="selectedTodaysPicks.includes(prediction.id)"
                            color="success"
                            size="small"
                            class="mr-2"
                        >
                          <v-icon size="16" class="mr-1">mdi-star</v-icon>
                          Günün Panenkası
                        </v-chip>
                        <v-btn
                            icon
                            size="small"
                            color="error"
                            @click="deletePredictionFromPicks(prediction.id)"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </div>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </div>

          <!-- Activities Tab -->
          <div v-if="activeTab === 'activities'">
            <v-card elevation="2">
              <v-card-title class="bg-primary text-white d-flex justify-space-between align-center">
                <span class="text-h6">Etkinlikler Yönetimi</span>
                <v-btn
                    color="white"
                    variant="text"
                    @click="showAddActivityDialog = true"
                >
                  <v-icon left>mdi-plus</v-icon>
                  Yeni Ekle
                </v-btn>
              </v-card-title>
              <v-card-text class="pa-6">
                <v-list>
                  <v-list-item
                      v-for="activity in activities"
                      :key="activity.id"
                      class="mb-4 border rounded"
                  >
                    <template v-slot:prepend>
                      <v-avatar color="primary" size="48">
                        <v-icon color="white">{{ activity.icon }}</v-icon>
                      </v-avatar>
                    </template>

                    <v-list-item-title class="font-weight-bold">
                      {{ activity.title }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ activity.description }}
                    </v-list-item-subtitle>

                    <template v-slot:append>
                      <v-btn
                          icon
                          size="small"
                          color="error"
                          @click="deleteActivity(activity.id)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- Add Activity Dialog -->
    <v-dialog v-model="showAddActivityDialog" max-width="600">
      <v-card>
        <v-card-title class="bg-primary text-white">
          Yeni Etkinlik Ekle
        </v-card-title>
        <v-card-text class="pa-6">
          <v-text-field
              v-model="newActivity.icon"
              label="İkon (Material Design Icon)"
              variant="outlined"
              placeholder="mdi-trophy"
              class="mb-4"
          />
          <v-text-field
              v-model="newActivity.title"
              label="Başlık"
              variant="outlined"
              class="mb-4"
          />
          <v-textarea
              v-model="newActivity.description"
              label="Açıklama"
              variant="outlined"
              rows="3"
          />
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn @click="showAddActivityDialog = false">İptal</v-btn>
          <v-btn color="primary" @click="addActivity">Kaydet</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Snackbar -->
    <v-snackbar
        v-model="showSuccessSnackbar"
        :timeout="3000"
        color="success"
    >
      {{ successMessage }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/store/auth'
import { usePredictionsStore } from '@/store/predictions'
import { useActivitiesStore } from '@/store/activities'
import { leagueTeams, teamLogos } from '@/data/teams'

const authStore = useAuthStore()
const predictionsStore = usePredictionsStore()
const activitiesStore = useActivitiesStore()

const activeTab = ref('predictions')
const showAddActivityDialog = ref(false)
const showSuccessSnackbar = ref(false)
const successMessage = ref('')

const leagues = [
  'Premier Lig',
  'İtalya Serie A',
  'Fransa Ligue 1',
  'Almanya Bundesliga',
  'İspanya La Liga',
  'Türkiye Süper Lig',
  'PTT 1. Lig',
  'Diğer Ligler'
]

const newPrediction = ref({
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

const newActivity = ref({
  icon: '',
  title: '',
  description: '',
})

const myPredictions = computed(() => {
  if (!authStore.user) return []
  return predictionsStore.predictionsByEditor(authStore.user.id)
})

const allPredictions = computed(() => predictionsStore.allPredictions)
const activities = computed(() => activitiesStore.allActivities)

const selectedTodaysPicks = computed(() => predictionsStore.todaysPicks)

const availableTeams = computed(() => {
  return leagueTeams[newPrediction.value.league] || []
})

const onLeagueChange = () => {
  newPrediction.value.homeTeam = ''
  newPrediction.value.awayTeam = ''
  newPrediction.value.homeLogo = ''
  newPrediction.value.awayLogo = ''
}

const onHomeTeamChange = () => {
  const team = newPrediction.value.homeTeam
  newPrediction.value.homeLogo = teamLogos[team] || '⚽'
}

const onAwayTeamChange = () => {
  const team = newPrediction.value.awayTeam
  newPrediction.value.awayLogo = teamLogos[team] || '⚽'
}

const addPrediction = () => {
  if (!authStore.user) return

  predictionsStore.addPrediction({
    editorId: authStore.user.id,
    editorName: authStore.user.username,
    league: newPrediction.value.league,
    homeTeam: newPrediction.value.homeTeam,
    awayTeam: newPrediction.value.awayTeam,
    homeLogo: newPrediction.value.homeLogo || '⚽',
    awayLogo: newPrediction.value.awayLogo || '⚽',
    prediction: newPrediction.value.prediction,
    odds: newPrediction.value.odds,
    explanation: newPrediction.value.explanation,
    matchDate: newPrediction.value.matchDate,
  })

  newPrediction.value = {
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

  successMessage.value = 'Tahmin başarıyla eklendi!'
  showSuccessSnackbar.value = true
  activeTab.value = 'predictions'
}

const deletePrediction = (id: string) => {
  if (confirm('Bu tahmini silmek istediğinizden emin misiniz?')) {
    predictionsStore.deletePrediction(id)
    successMessage.value = 'Tahmin silindi!'
    showSuccessSnackbar.value = true
  }
}

const deletePredictionFromPicks = (id: string) => {
  if (confirm('Bu tahmini silmek istediğinizden emin misiniz? Günün panenkasından da kaldırılacaktır.')) {
    predictionsStore.deletePrediction(id)
    successMessage.value = 'Tahmin başarıyla silindi!'
    showSuccessSnackbar.value = true
  }
}

const toggleTodaysPick = (predictionId: string) => {
  if (selectedTodaysPicks.value.includes(predictionId)) {
    predictionsStore.removeFromTodaysPicks(predictionId)
  } else if (selectedTodaysPicks.value.length < 3) {
    predictionsStore.addToTodaysPicks(predictionId)
  }
}

const addActivity = () => {
  activitiesStore.addActivity({
    icon: newActivity.value.icon,
    title: newActivity.value.title,
    description: newActivity.value.description,
  })

  newActivity.value = {
    icon: '',
    title: '',
    description: '',
  }

  showAddActivityDialog.value = false
  successMessage.value = 'Etkinlik başarıyla eklendi!'
  showSuccessSnackbar.value = true
}

const deleteActivity = (id: string) => {
  if (confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) {
    activitiesStore.deleteActivity(id)
    successMessage.value = 'Etkinlik silindi!'
    showSuccessSnackbar.value = true
  }
}
</script>

<style scoped lang="scss">
.admin-view {
  background-color: #FFF8E1;
  min-height: calc(100vh - 200px);
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
}

.border {
  border: 1px solid #e0e0e0;
}

.selected-pick {
  background-color: rgba(76, 175, 80, 0.1);
  border-color: #4CAF50 !important;
}
</style>