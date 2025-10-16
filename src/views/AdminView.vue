<template>
  <div class="admin-view">
    <!-- Login Form - Giriş yapılmadıysa göster -->
    <div v-if="!authStore.isAuthenticated" class="login-container">
      <v-row justify="center" align="center" style="min-height: 80vh;">
        <v-col cols="12" sm="10" md="8" lg="6" xl="4" class="px-2 px-md-4">
          <v-card elevation="8" class="login-card">
            <v-card-title class="text-center bg-primary text-white pa-4 pa-md-6">
              <v-icon size="40" class="mb-2">mdi-shield-account</v-icon>
              <div class="text-h5 text-md-h5">Admin Girişi</div>
            </v-card-title>

            <v-card-text class="pa-4 pa-md-8">
              <v-form ref="loginFormRef" @submit.prevent="handleLogin">
                <v-text-field
                    v-model="loginForm.username"
                    label="Kullanıcı Adı"
                    prepend-inner-icon="mdi-account"
                    variant="outlined"
                    class="mb-4"
                    :rules="[rules.required]"
                />

                <v-text-field
                    v-model="loginForm.password"
                    label="Şifre"
                    :type="showPassword ? 'text' : 'password'"
                    prepend-inner-icon="mdi-lock"
                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showPassword = !showPassword"
                    variant="outlined"
                    :rules="[rules.required]"
                />

                <v-alert v-if="loginError" type="error" class="mt-4 mb-4">
                  {{ loginError }}
                </v-alert>

                <v-btn
                    type="submit"
                    block
                    color="primary"
                    size="large"
                    :loading="loginLoading"
                    class="mt-4"
                >
                  Giriş Yap
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Admin Panel - Giriş yapıldıysa göster -->
    <div v-else class="admin-panel py-6 py-md-12">
      <v-container class="content-wrapper px-2 px-md-4">
        <v-row>
          <v-col cols="12">
            <div class="header-section mb-6 mb-md-8">
              <div class="header-content">
                <div>
                  <h1 class="admin-title mb-2">
                    Admin Paneli
                  </h1>
                  <p class="admin-subtitle">
                    Hoş geldin, {{ authStore.user?.fullName }}!
                  </p>
                </div>
                <v-btn
                    color="error"
                    variant="outlined"
                    size="small"
                    class="logout-btn"
                    @click="handleLogout"
                >
                  <v-icon size="20" class="d-md-inline d-none mr-2">mdi-logout</v-icon>
                  <v-icon size="20" class="d-md-none">mdi-logout</v-icon>
                  <span class="d-none d-md-inline">Çıkış</span>
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- Navigation Tabs -->
        <v-row>
          <v-col cols="12">
            <v-card elevation="0" class="bg-transparent tabs-container">
              <v-tabs
                  v-model="activeTab"
                  bg-color="white"
                  color="primary"
                  show-arrows
                  class="admin-tabs"
              >
                <v-tab value="predictions" class="tab-item">
                  <v-icon size="20" class="mr-1 d-none d-sm-inline">mdi-file-document</v-icon>
                  <span class="tab-text">Tahminlerim</span>
                </v-tab>
                <v-tab value="add-prediction" class="tab-item">
                  <v-icon size="20" class="mr-1 d-none d-sm-inline">mdi-plus</v-icon>
                  <span class="tab-text">Yeni Tahmin</span>
                </v-tab>
                <v-tab value="todays-picks" class="tab-item">
                  <v-icon size="20" class="mr-1 d-none d-sm-inline">mdi-star</v-icon>
                  <span class="tab-text">Günün Panenkası</span>
                </v-tab>
                <v-tab value="activities" class="tab-item">
                  <v-icon size="20" class="mr-1 d-none d-sm-inline">mdi-calendar</v-icon>
                  <span class="tab-text">Etkinlikler</span>
                </v-tab>
              </v-tabs>
            </v-card>
          </v-col>
        </v-row>

        <!-- Tab Content -->
        <v-row class="mt-4 mt-md-6">
          <v-col cols="12">
            <!-- My Predictions Tab -->
            <div v-if="activeTab === 'predictions'">
              <v-card elevation="2">
                <v-card-title class="bg-primary text-white pa-4">
                  <span class="card-title-text">Tahminlerim ({{ myPredictions.length }})</span>
                </v-card-title>
                <v-card-text class="pa-3 pa-md-6">
                  <div v-if="myPredictions.length === 0" class="empty-state">
                    <v-icon size="64" color="grey-lighten-1">mdi-clipboard-text-off</v-icon>
                    <p class="text-h6 text-grey mt-4">Henüz tahmin eklemediniz.</p>
                  </div>

                  <v-list v-else>
                    <v-list-item
                        v-for="prediction in myPredictions"
                        :key="prediction.id"
                        class="prediction-item mb-3 border rounded"
                    >
                      <template v-slot:prepend>
                        <v-avatar color="primary" size="40" class="d-none d-sm-flex">
                          <span class="text-h6">⚽</span>
                        </v-avatar>
                      </template>

                      <v-list-item-title class="font-weight-bold mb-2 prediction-title">
                        {{ prediction.homeTeam }} vs {{ prediction.awayTeam }}
                      </v-list-item-title>
                      <v-list-item-subtitle class="prediction-subtitle">
                        <v-chip size="x-small" color="primary" class="mr-2 mb-1">
                          {{ prediction.league }}
                        </v-chip>
                        <div class="prediction-details">
                          {{ prediction.prediction }} - Oran: {{ prediction.odds }}
                        </div>
                      </v-list-item-subtitle>

                      <template v-slot:append>
                        <v-btn
                            icon
                            size="small"
                            color="error"
                            @click="deletePrediction(prediction.id)"
                        >
                          <v-icon size="20">mdi-delete</v-icon>
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
                <v-card-title class="bg-primary text-white pa-4">
                  <span class="card-title-text">Yeni Tahmin Ekle</span>
                </v-card-title>
                <v-card-text class="pa-3 pa-md-6">
                  <v-form ref="predictionForm">
                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-select
                            v-model="newPrediction.league"
                            :items="leagues"
                            label="Liga Seçin"
                            variant="outlined"
                            density="comfortable"
                            required
                            @update:model-value="onLeagueChange"
                        />
                      </v-col>

                      <v-col cols="12" sm="6">
                        <v-text-field
                            v-model="newPrediction.matchDate"
                            label="Maç Tarihi ve Saati"
                            type="datetime-local"
                            variant="outlined"
                            density="comfortable"
                            required
                        />
                      </v-col>

                      <v-col cols="12" sm="6">
                        <v-select
                            v-if="newPrediction.league !== 'Diğer Ligler'"
                            v-model="newPrediction.homeTeam"
                            :items="availableTeams"
                            label="Ev Sahibi Takım"
                            variant="outlined"
                            density="comfortable"
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
                            density="comfortable"
                            required
                            placeholder="Takım adını yazın"
                        />
                      </v-col>

                      <v-col cols="12" sm="6">
                        <v-select
                            v-if="newPrediction.league !== 'Diğer Ligler'"
                            v-model="newPrediction.awayTeam"
                            :items="availableTeams"
                            label="Deplasman Takımı"
                            variant="outlined"
                            density="comfortable"
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
                            density="comfortable"
                            required
                            placeholder="Takım adını yazın"
                        />
                      </v-col>

                      <v-col cols="12" sm="6">
                        <v-text-field
                            v-model="newPrediction.homeLogo"
                            :label="newPrediction.league === 'Diğer Ligler' ? 'Ev Sahibi Logo (Emoji)' : 'Ev Sahibi Logo (Otomatik)'"
                            variant="outlined"
                            density="comfortable"
                            :readonly="newPrediction.league !== 'Diğer Ligler'"
                            :hint="newPrediction.league === 'Diğer Ligler' ? 'Emoji ekleyin' : 'Otomatik dolar'"
                            persistent-hint
                        />
                      </v-col>

                      <v-col cols="12" sm="6">
                        <v-text-field
                            v-model="newPrediction.awayLogo"
                            :label="newPrediction.league === 'Diğer Ligler' ? 'Deplasman Logo (Emoji)' : 'Deplasman Logo (Otomatik)'"
                            variant="outlined"
                            density="comfortable"
                            :readonly="newPrediction.league !== 'Diğer Ligler'"
                            :hint="newPrediction.league === 'Diğer Ligler' ? 'Emoji ekleyin' : 'Otomatik dolar'"
                            persistent-hint
                        />
                      </v-col>

                      <v-col cols="12" sm="6">
                        <v-text-field
                            v-model="newPrediction.prediction"
                            label="Tahmin"
                            variant="outlined"
                            density="comfortable"
                            placeholder="2.5 Gol Üstü"
                            required
                        />
                      </v-col>

                      <v-col cols="12" sm="6">
                        <v-text-field
                            v-model.number="newPrediction.odds"
                            label="Oran"
                            type="number"
                            step="0.01"
                            variant="outlined"
                            density="comfortable"
                            required
                        />
                      </v-col>

                      <v-col cols="12">
                        <v-textarea
                            v-model="newPrediction.explanation"
                            label="Açıklama"
                            variant="outlined"
                            density="comfortable"
                            rows="3"
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
                          <v-icon class="mr-2">mdi-content-save</v-icon>
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
                <v-card-title class="bg-primary text-white pa-4">
                  <div class="picks-header">
                    <div class="picks-title">
                      <v-icon class="mr-2">mdi-star</v-icon>
                      <span class="card-title-text">Günün Panenkası</span>
                    </div>
                    <v-chip color="white" variant="text" size="small">
                      {{ isMyPredictionSelected ? '1/1' : '0/1' }}
                    </v-chip>
                  </div>
                </v-card-title>
                <v-card-text class="pa-3 pa-md-6">
                  <v-alert type="info" class="mb-4" density="compact">
                    Ana sayfada gösterilecek 1 tahmininizi seçin. Her editör sadece 1 tahmin seçebilir.
                  </v-alert>

                  <div v-if="myPredictions.length === 0" class="empty-state">
                    <v-icon size="64" color="grey-lighten-1">mdi-clipboard-text-off</v-icon>
                    <p class="text-body-1 text-grey mt-4">Önce tahmin ekleyin.</p>
                  </div>

                  <v-list v-else>
                    <v-list-item
                        v-for="prediction in myPredictions"
                        :key="prediction.id"
                        class="pick-item mb-3 border rounded"
                        :class="{ 'selected-pick': isMyPredictionSelected && mySelectedTodaysPick === prediction.id }"
                    >
                      <template v-slot:prepend>
                        <v-checkbox
                            :model-value="mySelectedTodaysPick === prediction.id"
                            @update:model-value="toggleMyTodaysPick(prediction.id)"
                            color="primary"
                            hide-details
                        />
                      </template>

                      <v-list-item-title class="font-weight-bold mb-2 pick-title">
                        {{ prediction.homeTeam }} {{ prediction.homeLogo }} vs {{ prediction.awayLogo }} {{ prediction.awayTeam }}
                      </v-list-item-title>
                      <v-list-item-subtitle class="pick-subtitle">
                        <v-chip size="x-small" color="primary" class="mr-2 mb-1">
                          {{ prediction.league }}
                        </v-chip>
                        <div class="pick-details">
                          {{ prediction.prediction }} - Oran: {{ prediction.odds }}
                        </div>
                      </v-list-item-subtitle>

                      <template v-slot:append>
                        <div class="pick-actions">
                          <v-chip
                              v-if="mySelectedTodaysPick === prediction.id"
                              color="success"
                              size="x-small"
                              class="mb-2 mb-sm-0 mr-sm-2"
                          >
                            <v-icon size="14" class="mr-1">mdi-star</v-icon>
                            Seçili
                          </v-chip>
                          <v-btn
                              icon
                              size="small"
                              color="error"
                              @click="deletePredictionFromPicks(prediction.id)"
                          >
                            <v-icon size="20">mdi-delete</v-icon>
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
                <v-card-title class="bg-primary text-white pa-4">
                  <div class="activities-header">
                    <span class="card-title-text">Etkinlikler</span>
                    <v-btn
                        color="white"
                        variant="text"
                        size="small"
                        @click="showAddActivityDialog = true"
                    >
                      <v-icon size="20">mdi-plus</v-icon>
                      <span class="d-none d-sm-inline ml-1">Yeni Ekle</span>
                    </v-btn>
                  </div>
                </v-card-title>
                <v-card-text class="pa-3 pa-md-6">
                  <v-list>
                    <v-list-item
                        v-for="activity in activities"
                        :key="activity.id"
                        class="activity-item mb-3 border rounded"
                    >
                      <template v-slot:prepend>
                        <v-avatar color="primary" size="40" class="d-none d-sm-flex">
                          <v-icon color="white" size="20">{{ activity.icon }}</v-icon>
                        </v-avatar>
                      </template>

                      <v-list-item-title class="font-weight-bold activity-title">
                        {{ activity.title }}
                      </v-list-item-title>
                      <v-list-item-subtitle class="activity-subtitle">
                        {{ activity.description }}
                      </v-list-item-subtitle>

                      <template v-slot:append>
                        <v-btn
                            icon
                            size="small"
                            color="error"
                            @click="deleteActivity(activity.id)"
                        >
                          <v-icon size="20">mdi-delete</v-icon>
                        </v-btn>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Add Activity Dialog -->
    <v-dialog v-model="showAddActivityDialog" max-width="600" class="dialog-mobile">
      <v-card>
        <v-card-title class="bg-primary text-white pa-4">
          Yeni Etkinlik Ekle
        </v-card-title>
        <v-card-text class="pa-4 pa-md-6">
          <v-text-field
              v-model="newActivity.icon"
              label="İkon (Material Design Icon)"
              variant="outlined"
              density="comfortable"
              placeholder="mdi-trophy"
              class="mb-3"
          />
          <v-text-field
              v-model="newActivity.title"
              label="Başlık"
              variant="outlined"
              density="comfortable"
              class="mb-3"
          />
          <v-textarea
              v-model="newActivity.description"
              label="Açıklama"
              variant="outlined"
              density="comfortable"
              rows="3"
          />
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn @click="showAddActivityDialog = false" size="small">İptal</v-btn>
          <v-btn color="primary" @click="addActivity" size="small">Kaydet</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Snackbar -->
    <v-snackbar
        v-model="showSuccessSnackbar"
        :timeout="3000"
        color="success"
        location="top"
    >
      {{ successMessage }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { usePredictionsStore } from '@/store/predictions'
import { useActivitiesStore } from '@/store/activities'
import { leagueTeams, teamLogos } from '@/data/teams'

const router = useRouter()
const authStore = useAuthStore()
const predictionsStore = usePredictionsStore()
const activitiesStore = useActivitiesStore()

// Login Form State
const loginFormRef = ref()
const loginLoading = ref(false)
const showPassword = ref(false)
const loginError = ref('')
const loginForm = ref({
  username: '',
  password: '',
})

const rules = {
  required: (value: string) => !!value || 'Bu alan zorunludur',
}

// Login Handler
const handleLogin = async () => {
  const { valid } = await loginFormRef.value.validate()

  if (valid) {
    loginLoading.value = true
    loginError.value = ''

    const success = await authStore.login(loginForm.value)

    if (success) {
      loginForm.value = { username: '', password: '' }
    } else {
      loginError.value = 'Kullanıcı adı veya şifre hatalı!'
    }

    loginLoading.value = false
  }
}

// Logout Handler
const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'home' })
}

// Admin Panel State
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

// SADECE KENDI TAHMİNLERİ
const myPredictions = computed(() => {
  if (!authStore.user) return []
  return predictionsStore.predictionsByEditor(authStore.user.id)
})

const activities = computed(() => activitiesStore.allActivities)

// SADECE KENDI TAHMİNLERİNDEN SEÇİLENLER
const mySelectedTodaysPick = computed(() => {
  if (!authStore.user) return null
  return predictionsStore.editorTodaysPick(authStore.user.id)
})

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
    editorName: authStore.user.fullName || authStore.user.username,
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

// SADECE KENDİ TAHMİNLERİNİ SEÇEBİLİR (MAX 1)
const toggleMyTodaysPick = (predictionId: string) => {
  if (!authStore.user) return

  if (mySelectedTodaysPick.value === predictionId) {
    // Seçimi kaldır
    predictionsStore.removeFromTodaysPicks(predictionId)
  } else {
    // Yeni tahmin seç (eski seçim otomatik kaldırılacak)
    predictionsStore.addToTodaysPicks(predictionId, authStore.user.id)
  }
}
const isMyPredictionSelected = computed(() => {
  return mySelectedTodaysPick.value !== null
})

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
  width: 100%;
}

.login-container {
  background-color: #FFF8E1;
  min-height: calc(100vh - 200px);

  .login-card {
    border-radius: 12px !important;

    @media (max-width: 600px) {
      border-radius: 8px !important;
    }

    .demo-users {
      .demo-user {
        padding: 8px 0;
        font-size: 0.875rem;
        color: #666;

        @media (max-width: 600px) {
          font-size: 0.8rem;
          padding: 6px 0;
        }

        strong {
          color: #FF9800;
        }
      }
    }
  }
}

.admin-panel {
  background-color: #FFF8E1;
  width: 100%;
  overflow-x: hidden;

  .content-wrapper {
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
  }

  .header-section {
    position: relative;

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;

      @media (max-width: 600px) {
        position: relative;
        padding-top: 40px;
      }
    }

    .admin-title {
      font-size: 2rem;
      font-weight: bold;
      color: #FF9800;

      @media (max-width: 960px) {
        font-size: 1.75rem;
      }

      @media (max-width: 600px) {
        font-size: 1.5rem;
      }
    }

    .admin-subtitle {
      font-size: 1rem;
      color: #666;

      @media (max-width: 600px) {
        font-size: 0.9rem;
      }
    }

    .logout-btn {
      @media (max-width: 600px) {
        align-self: flex-end;
        position: absolute;
        top: 0;
        right: 0;
      }
    }
  }

  .tabs-container {
    width: 100%;

    .admin-tabs {
      border-radius: 12px;
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: thin;

      &::-webkit-scrollbar {
        height: 6px;
      }

      &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }

      &::-webkit-scrollbar-thumb {
        background: #FF9800;
        border-radius: 10px;
      }

      @media (max-width: 600px) {
        border-radius: 8px;
      }

      .tab-item {
        min-width: auto !important;
        padding: 0 16px;
        white-space: nowrap;

        @media (max-width: 600px) {
          padding: 0 8px;
          font-size: 0.85rem;
        }

        .tab-text {
          @media (max-width: 400px) {
            font-size: 0.75rem;
          }
        }
      }
    }
  }

  .card-title-text {
    font-size: 1.125rem;
    font-weight: 600;

    @media (max-width: 600px) {
      font-size: 1rem;
    }
  }

  .empty-state {
    text-align: center;
    padding: 40px 20px;

    @media (max-width: 600px) {
      padding: 30px 15px;

      .v-icon {
        font-size: 48px !important;
      }

      .text-h6 {
        font-size: 1rem !important;
      }
    }
  }

  // Predictions List
  .prediction-item {
    padding: 12px;
    transition: all 0.3s ease;

    @media (max-width: 600px) {
      padding: 10px;
    }

    &:hover {
      background-color: rgba(255, 152, 0, 0.05);
    }

    .prediction-title {
      font-size: 1rem;

      @media (max-width: 600px) {
        font-size: 0.9rem;
      }
    }

    .prediction-subtitle {
      @media (max-width: 600px) {
        font-size: 0.8rem;
      }

      .prediction-details {
        margin-top: 4px;
      }
    }
  }

  // Today's Picks
  .picks-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    flex-wrap: wrap;
    gap: 8px;

    .picks-title {
      display: flex;
      align-items: center;
      flex: 1;
    }
  }

  .pick-item {
    padding: 12px;
    transition: all 0.3s ease;

    @media (max-width: 600px) {
      padding: 10px;
    }

    &.selected-pick {
      background-color: rgba(76, 175, 80, 0.1);
      border-color: #4CAF50 !important;
    }

    .pick-title {
      font-size: 0.95rem;
      line-height: 1.4;

      @media (max-width: 600px) {
        font-size: 0.85rem;
      }
    }

    .pick-subtitle {
      @media (max-width: 600px) {
        font-size: 0.75rem;
      }

      .pick-details {
        margin-top: 4px;
      }
    }

    .pick-actions {
      display: flex;
      align-items: center;
      gap: 8px;

      @media (max-width: 600px) {
        flex-direction: column;
        gap: 6px;
      }
    }
  }

  // Activities
  .activities-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 8px;
  }

  .activity-item {
    padding: 12px;
    transition: all 0.3s ease;

    @media (max-width: 600px) {
      padding: 10px;
    }

    &:hover {
      background-color: rgba(255, 152, 0, 0.05);
    }

    .activity-title {
      font-size: 1rem;

      @media (max-width: 600px) {
        font-size: 0.9rem;
      }
    }

    .activity-subtitle {
      font-size: 0.875rem;
      line-height: 1.4;

      @media (max-width: 600px) {
        font-size: 0.8rem;
      }
    }
  }
}

// Dialog Mobile Styles
.dialog-mobile {
  @media (max-width: 600px) {
    .v-card {
      margin: 16px;
    }
  }
}

// Border utility
.border {
  border: 1px solid #e0e0e0;

  @media (max-width: 600px) {
    border-radius: 8px;
  }
}

.rounded {
  border-radius: 12px;

  @media (max-width: 600px) {
    border-radius: 8px;
  }
}
</style>