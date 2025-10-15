<template>
  <div class="admin-view">
    <!-- Login Form - Giriş yapılmadıysa göster -->
    <div v-if="!authStore.isAuthenticated" class="login-container">
      <v-row justify="center" align="center" style="min-height: 80vh;">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card elevation="8" class="login-card">
            <v-card-title class="text-h5 text-center bg-primary text-white pa-6">
              <v-icon size="40" class="mb-2">mdi-shield-account</v-icon>
              <div>Admin Girişi</div>
            </v-card-title>

            <v-card-text class="pa-8">
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

              <!-- Demo Credentials Info -->
              <v-expansion-panels class="mt-6">
                <v-expansion-panel>
                  <v-expansion-panel-title>
                    <v-icon class="mr-2">mdi-information</v-icon>
                    Demo Kullanıcılar
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <div class="demo-users">
                      <div class="demo-user">
                        <strong>Emircan:</strong> emircan / emircan123
                      </div>
                      <div class="demo-user">
                        <strong>Berke:</strong> berke / berke123
                      </div>
                      <div class="demo-user">
                        <strong>Erman:</strong> erman / erman123
                      </div>
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Admin Panel - Giriş yapıldıysa göster -->
    <div v-else class="admin-panel py-12">
      <div class="content-wrapper">
        <v-row>
          <v-col cols="12">
            <div class="d-flex justify-space-between align-items-center mb-8">
              <div>
                <h1 class="text-h3 font-weight-bold text-primary mb-2">
                  Admin Paneli
                </h1>
                <p class="text-body-1 text-grey">
                  Hoş geldin, {{ authStore.user?.username }}!
                </p>
              </div>
              <v-btn
                  color="error"
                  variant="outlined"
                  @click="handleLogout"
              >
                <v-icon class="mr-2">mdi-logout</v-icon>
                Çıkış Yap
              </v-btn>
            </div>
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
                  <span class="text-h6">Tahminlerim ({{ myPredictions.length }} tahmin)</span>
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

            <!-- Today's Picks Tab - SADECE KENDI TAHMİNLERİ -->
            <div v-if="activeTab === 'todays-picks'">
              <v-card elevation="2">
                <v-card-title class="bg-primary text-white pa-4 d-flex justify-space-between align-center">
                  <div>
                    <v-icon class="mr-2">mdi-star</v-icon>
                    <span class="text-h6">Günün Panenkası Yönetimi</span>
                  </div>
                  <v-chip color="white" variant="text">
                    {{ mySelectedTodaysPicks.length }}/1 Seçili
                  </v-chip>
                </v-card-title>
                <v-card-text class="pa-6">
                  <v-alert type="info" class="mb-4">
                    Ana sayfada gösterilecek 1 tahmininizi seçin. Sadece kendi tahminlerinizi seçebilirsiniz.
                  </v-alert>

                  <div v-if="myPredictions.length === 0" class="text-center py-8">
                    <v-icon size="64" color="grey-lighten-1">mdi-clipboard-text-off</v-icon>
                    <p class="text-h6 text-grey mt-4">Henüz tahmin eklenmemiş. Önce tahmin ekleyin.</p>
                  </div>

                  <v-list v-else>
                    <v-list-item
                        v-for="prediction in myPredictions"
                        :key="prediction.id"
                        class="mb-4 border rounded"
                        :class="{ 'selected-pick': mySelectedTodaysPicks.includes(prediction.id) }"
                    >
                      <template v-slot:prepend>
                        <v-checkbox
                            :model-value="mySelectedTodaysPicks.includes(prediction.id)"
                            @update:model-value="toggleMyTodaysPick(prediction.id)"
                            :disabled="!mySelectedTodaysPicks.includes(prediction.id) && mySelectedTodaysPicks.length >= 1"
                            color="primary"
                        />
                      </template>

                      <v-list-item-title class="font-weight-bold mb-2">
                        {{ prediction.homeTeam }} {{ prediction.homeLogo }} vs {{ prediction.awayLogo }} {{ prediction.awayTeam }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        <v-chip size="x-small" color="primary" class="mr-2">{{ prediction.league }}</v-chip>
                        {{ prediction.prediction }} - Oran: {{ prediction.odds }}
                      </v-list-item-subtitle>

                      <template v-slot:append>
                        <div class="d-flex align-center ga-2">
                          <v-chip
                              v-if="mySelectedTodaysPicks.includes(prediction.id)"
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
const mySelectedTodaysPicks = computed(() => {
  if (!authStore.user) return []
  const allPicks = predictionsStore.todaysPicks
  const myPredictionIds = myPredictions.value.map(p => p.id)
  return allPicks.filter(pickId => myPredictionIds.includes(pickId))
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

// SADECE KENDİ TAHMİNLERİNİ SEÇEBİLİR (MAX 1)
const toggleMyTodaysPick = (predictionId: string) => {
  if (mySelectedTodaysPicks.value.includes(predictionId)) {
    predictionsStore.removeFromTodaysPicks(predictionId)
  } else if (mySelectedTodaysPicks.value.length < 1) {
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

.login-container {
  background-color: #FFF8E1;
  min-height: calc(100vh - 200px);

  .login-card {
    border-radius: 16px !important;

    .demo-users {
      .demo-user {
        padding: 8px 0;
        font-size: 0.875rem;
        color: #666;

        strong {
          color: #FF9800;
        }
      }
    }
  }
}

.admin-panel {
  background-color: #FFF8E1;
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