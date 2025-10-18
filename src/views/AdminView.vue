<template>
  <div class="admin-view">
    <!-- Login Form -->
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

    <!-- Admin Panel -->
    <div v-else class="admin-panel py-6 py-md-12">
      <v-container class="content-wrapper px-2 px-md-4">
        <v-row>
          <v-col cols="12">
            <div class="header-section mb-6 mb-md-8">
              <div class="header-content">
                <div>
                  <h1 class="admin-title mb-2">Admin Paneli</h1>
                  <p class="admin-subtitle">Hoş geldin, {{ authStore.user?.fullName }}!</p>
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

                      <div class="prediction-content">
                        <v-list-item-title class="font-weight-bold mb-2 prediction-title">
                          {{ prediction.homeTeam }} vs {{ prediction.awayTeam }}
                        </v-list-item-title>
                        <v-list-item-subtitle class="prediction-subtitle">
                          <div class="mb-2">
                            <v-chip size="x-small" color="primary" class="mr-2">
                              {{ prediction.league }}
                            </v-chip>
                            <span class="text-caption text-grey">
                              {{ formatPredictionDate(prediction.matchDate) }}
                            </span>
                          </div>

                        </v-list-item-subtitle>
                        <v-list-item-subtitle class="prediction-subtitle">
                          <div >
                            <strong>Tahmin:</strong> {{ prediction.prediction }} | <strong>Oran:</strong> {{ prediction.odds }}
                          </div>
                        </v-list-item-subtitle>


                        <!-- Result Status Buttons -->
                        <div class="result-buttons mt-3">
                          <v-btn-toggle
                              :model-value="prediction.result"
                              @update:model-value="(val) => updateResult(prediction.id, val)"
                              mandatory
                              density="compact"
                              color="primary"
                          >
                            <v-btn value="won" size="small" color="success">
                              <v-icon size="16">mdi-check</v-icon>
                              <span class="ml-1 d-none d-sm-inline">Tuttu</span>
                            </v-btn>
                            <v-btn value="lost" size="small" color="error">
                              <v-icon size="16">mdi-close</v-icon>
                              <span class="ml-1 d-none d-sm-inline">Tutmadı</span>
                            </v-btn>
                            <v-btn value="pending" size="small">
                              <v-icon size="16">mdi-clock-outline</v-icon>
                              <span class="ml-1 d-none d-sm-inline">Bekliyor</span>
                            </v-btn>
                          </v-btn-toggle>
                        </div>
                      </div>

                      <template v-slot:append>
                        <div class="action-buttons">
                          <v-btn
                              icon
                              size="small"
                              color="info"
                              @click="editPrediction(prediction)"
                              class="mr-2"
                          >
                            <v-icon size="20">mdi-pencil</v-icon>
                          </v-btn>
                          <v-btn
                              icon
                              size="small"
                              color="error"
                              @click="deletePrediction(prediction.id)"
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
                        <div class="datetime-field-wrapper">
                          <v-text-field
                              v-model="newPrediction.matchDate"
                              label="Maç Tarihi ve Saati"
                              type="datetime-local"
                              variant="outlined"
                              density="comfortable"
                              required
                              class="datetime-field"
                              @click="openDateTimePicker"
                          />
                        </div>
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
                            @update:model-value="onHomeTeamChange"
                        />
                        <v-text-field
                            v-else
                            v-model="newPrediction.homeTeam"
                            label="Ev Sahibi Takım"
                            variant="outlined"
                            density="comfortable"
                            required
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
                            @update:model-value="onAwayTeamChange"
                        />
                        <v-text-field
                            v-else
                            v-model="newPrediction.awayTeam"
                            label="Deplasman Takımı"
                            variant="outlined"
                            density="comfortable"
                            required
                        />
                      </v-col>

                      <v-col cols="12" sm="6">
                        <v-text-field
                            v-model="newPrediction.homeLogo"
                            :label="newPrediction.league === 'Diğer Ligler' ? 'Ev Sahibi Logo (Emoji)' : 'Ev Sahibi Logo (Otomatik)'"
                            variant="outlined"
                            density="comfortable"
                            :readonly="newPrediction.league !== 'Diğer Ligler'"
                        />
                      </v-col>

                      <v-col cols="12" sm="6">
                        <v-text-field
                            v-model="newPrediction.awayLogo"
                            :label="newPrediction.league === 'Diğer Ligler' ? 'Deplasman Logo (Emoji)' : 'Deplasman Logo (Otomatik)'"
                            variant="outlined"
                            density="comfortable"
                            :readonly="newPrediction.league !== 'Diğer Ligler'"
                        />
                      </v-col>

                      <v-col cols="12" sm="6">
                        <v-text-field
                            v-model="newPrediction.prediction"
                            label="Tahmin"
                            variant="outlined"
                            density="comfortable"
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
                        <v-btn block color="primary" size="large" @click="addPrediction">
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
                    Ana sayfada gösterilecek 1 tahmininizi seçin.
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
                        :class="{ 'selected-pick': mySelectedTodaysPick === prediction.id }"
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
                      </v-list-item-subtitle>
                      <v-list-item-subtitle class="prediction-subtitle">
                        <div >
                          <strong>Tahmin:</strong> {{ prediction.prediction }} | <strong>Oran:</strong> {{ prediction.odds }}
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
    <v-dialog v-model="showAddActivityDialog" max-width="600">
      <v-card>
        <v-card-title class="bg-primary text-white pa-4">
          Yeni Etkinlik Ekle
        </v-card-title>
        <v-card-text class="pa-4 pa-md-6">
          <v-text-field
              v-model="newActivity.icon"
              label="İkon"
              variant="outlined"
              density="comfortable"
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

    <!-- Edit Prediction Dialog -->
    <v-dialog v-model="showEditDialog" max-width="800" persistent>
      <v-card>
        <v-card-title class="bg-primary text-white pa-4">
          <v-icon class="mr-2">mdi-pencil</v-icon>
          Tahmini Düzenle
        </v-card-title>
        <v-card-text class="pa-4 pa-md-6">
          <v-form ref="editFormRef">
            <v-row>
              <v-col cols="12" sm="6">
                <v-select
                    v-model="editingPrediction.league"
                    :items="leagues"
                    label="Liga"
                    variant="outlined"
                    density="comfortable"
                    required
                    @update:model-value="onEditLeagueChange"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                    v-model="editingPrediction.matchDate"
                    label="Maç Tarihi ve Saati"
                    type="datetime-local"
                    variant="outlined"
                    density="comfortable"
                    required
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                    v-if="editingPrediction.league !== 'Diğer Ligler'"
                    v-model="editingPrediction.homeTeam"
                    :items="editAvailableTeams"
                    label="Ev Sahibi Takım"
                    variant="outlined"
                    density="comfortable"
                    required
                    @update:model-value="onEditHomeTeamChange"
                />
                <v-text-field
                    v-else
                    v-model="editingPrediction.homeTeam"
                    label="Ev Sahibi Takım"
                    variant="outlined"
                    density="comfortable"
                    required
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                    v-if="editingPrediction.league !== 'Diğer Ligler'"
                    v-model="editingPrediction.awayTeam"
                    :items="editAvailableTeams"
                    label="Deplasman Takımı"
                    variant="outlined"
                    density="comfortable"
                    required
                    @update:model-value="onEditAwayTeamChange"
                />
                <v-text-field
                    v-else
                    v-model="editingPrediction.awayTeam"
                    label="Deplasman Takımı"
                    variant="outlined"
                    density="comfortable"
                    required
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                    v-model="editingPrediction.homeLogo"
                    :label="editingPrediction.league === 'Diğer Ligler' ? 'Ev Sahibi Logo (Emoji)' : 'Ev Sahibi Logo (Otomatik)'"
                    variant="outlined"
                    density="comfortable"
                    :readonly="editingPrediction.league !== 'Diğer Ligler'"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                    v-model="editingPrediction.awayLogo"
                    :label="editingPrediction.league === 'Diğer Ligler' ? 'Deplasman Logo (Emoji)' : 'Deplasman Logo (Otomatik)'"
                    variant="outlined"
                    density="comfortable"
                    :readonly="editingPrediction.league !== 'Diğer Ligler'"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                    v-model="editingPrediction.prediction"
                    label="Tahmin"
                    variant="outlined"
                    density="comfortable"
                    required
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                    v-model.number="editingPrediction.odds"
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
                    v-model="editingPrediction.explanation"
                    label="Açıklama"
                    variant="outlined"
                    density="comfortable"
                    rows="6"
                    required
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn @click="cancelEdit" size="small">İptal</v-btn>
          <v-btn color="primary" @click="saveEdit" size="small">
            <v-icon class="mr-1" size="18">mdi-content-save</v-icon>
            Kaydet
          </v-btn>
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
// src/views/AdminView.vue - <script setup> kısmı - TAM VERSİYON

import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { usePredictionsStore } from '@/store/predictions'
import { useActivitiesStore } from '@/store/activities'
import { leagueTeams, teamLogos } from '@/data/teams'
import type { PredictionResult } from '@/types'

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
const openDateTimePicker = (event: Event) => {
  const target = event.target as HTMLElement;
  const input = target.closest('.datetime-field-wrapper')?.querySelector('input[type="datetime-local"]') as HTMLInputElement;
  if (input) {
    input.showPicker(); // Tarayıcı datetime picker'ını açar
  }
}
const rules = {
  required: (value: string) => !!value || 'Bu alan zorunludur',
}

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

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'home' })
}

// Admin Panel State
const activeTab = ref('predictions')
const showAddActivityDialog = ref(false)
const showEditDialog = ref(false)
const showSuccessSnackbar = ref(false)
const successMessage = ref('')
const editFormRef = ref()

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

const editingPrediction = ref({
  id: '',
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

const activities = computed(() => activitiesStore.allActivities)

const mySelectedTodaysPick = computed(() => {
  if (!authStore.user) return null
  return predictionsStore.editorTodaysPick(authStore.user.id)
})

const isMyPredictionSelected = computed(() => {
  return mySelectedTodaysPick.value !== null
})

const availableTeams = computed(() => {
  return leagueTeams[newPrediction.value.league] || []
})

const editAvailableTeams = computed(() => {
  return leagueTeams[editingPrediction.value.league] || []
})

// Tarih formatla (admin paneli için)
const formatPredictionDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

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

// Edit fonksiyonları
const onEditLeagueChange = () => {
  editingPrediction.value.homeTeam = ''
  editingPrediction.value.awayTeam = ''
  editingPrediction.value.homeLogo = ''
  editingPrediction.value.awayLogo = ''
}

const onEditHomeTeamChange = () => {
  const team = editingPrediction.value.homeTeam
  editingPrediction.value.homeLogo = teamLogos[team] || '⚽'
}

const onEditAwayTeamChange = () => {
  const team = editingPrediction.value.awayTeam
  editingPrediction.value.awayLogo = teamLogos[team] || '⚽'
}

// Tahmini düzenle
const editPrediction = (prediction: any) => {
  editingPrediction.value = {
    id: prediction.id,
    league: prediction.league,
    homeTeam: prediction.homeTeam,
    awayTeam: prediction.awayTeam,
    homeLogo: prediction.homeLogo,
    awayLogo: prediction.awayLogo,
    prediction: prediction.prediction,
    odds: prediction.odds,
    explanation: prediction.explanation,
    matchDate: prediction.matchDate,
  }
  showEditDialog.value = true
}

// Düzenlemeyi kaydet - ASYNC
const saveEdit = async () => {
  const success = await predictionsStore.updatePrediction(editingPrediction.value.id, {
    league: editingPrediction.value.league,
    homeTeam: editingPrediction.value.homeTeam,
    awayTeam: editingPrediction.value.awayTeam,
    homeLogo: editingPrediction.value.homeLogo || '⚽',
    awayLogo: editingPrediction.value.awayLogo || '⚽',
    prediction: editingPrediction.value.prediction,
    odds: editingPrediction.value.odds,
    explanation: editingPrediction.value.explanation,
    matchDate: editingPrediction.value.matchDate,
  })

  if (success) {
    showEditDialog.value = false
    successMessage.value = 'Tahmin başarıyla güncellendi!'
    showSuccessSnackbar.value = true
  } else {
    successMessage.value = 'Hata! Tahmin güncellenemedi.'
    showSuccessSnackbar.value = true
  }
}

// Düzenlemeyi iptal et
const cancelEdit = () => {
  showEditDialog.value = false
  editingPrediction.value = {
    id: '',
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
}

// Tahmin sonucunu güncelle - ASYNC
const updateResult = async (predictionId: string, result: PredictionResult) => {
  const success = await predictionsStore.updatePredictionResult(predictionId, result)
  if (success) {
    successMessage.value = 'Tahmin sonucu güncellendi!'
    showSuccessSnackbar.value = true
  }
}

// Yeni tahmin ekle - ASYNC
const addPrediction = async () => {
  if (!authStore.user) return

  const success = await predictionsStore.addPrediction({
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

  if (success) {
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
  } else {
    successMessage.value = 'Hata! Tahmin eklenemedi.'
    showSuccessSnackbar.value = true
  }
}

// Tahmini sil - ASYNC
const deletePrediction = async (id: string) => {
  if (confirm('Bu tahmini silmek istediğinizden emin misiniz?')) {
    const success = await predictionsStore.deletePrediction(id)
    if (success) {
      successMessage.value = 'Tahmin silindi!'
      showSuccessSnackbar.value = true
    } else {
      successMessage.value = 'Hata! Tahmin silinemedi.'
      showSuccessSnackbar.value = true
    }
  }
}

// Picks'ten tahmini sil - ASYNC
const deletePredictionFromPicks = async (id: string) => {
  if (confirm('Bu tahmini silmek istediğinizden emin misiniz?')) {
    const success = await predictionsStore.deletePrediction(id)
    if (success) {
      successMessage.value = 'Tahmin başarıyla silindi!'
      showSuccessSnackbar.value = true
    }
  }
}

// Günün panenkası seçimini değiştir - ASYNC
const toggleMyTodaysPick = async (predictionId: string) => {
  if (!authStore.user) return

  if (mySelectedTodaysPick.value === predictionId) {
    await predictionsStore.removeFromTodaysPicks(predictionId)
  } else {
    await predictionsStore.addToTodaysPicks(predictionId, authStore.user.id)
  }
}

// Yeni etkinlik ekle - ASYNC
const addActivity = async () => {
  const success = await activitiesStore.addActivity({
    icon: newActivity.value.icon,
    title: newActivity.value.title,
    description: newActivity.value.description,
  })

  if (success) {
    newActivity.value = { icon: '', title: '', description: '' }
    showAddActivityDialog.value = false
    successMessage.value = 'Etkinlik başarıyla eklendi!'
    showSuccessSnackbar.value = true
  }
}

// Etkinlik sil - ASYNC
const deleteActivity = async (id: string) => {
  if (confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) {
    const success = await activitiesStore.deleteActivity(id)
    if (success) {
      successMessage.value = 'Etkinlik silindi!'
      showSuccessSnackbar.value = true
    }
  }

}
</script>

<style scoped lang="scss">
.admin-view {
  background-color: #edf1f6;
  min-height: calc(100vh - 200px);
  width: 100%;
}

.login-container {
  background-color: #edf1f6;
  min-height: calc(100vh - 200px);

  .login-card {
    border-radius: 12px !important;

    @media (max-width: 600px) {
      border-radius: 8px !important;
    }
  }
}

.admin-panel {
  background-color: #edf1f6;
  width: 100%;
  overflow-x: hidden;

  .content-wrapper {
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
  }

  .header-section {
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
      color: #364cf5;

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
        position: absolute;
        top: 0;
        right: 0;
      }
    }
  }

  .tabs-container {
    .admin-tabs {
      border-radius: 12px;
      overflow-x: auto;

      @media (max-width: 600px) {
        border-radius: 8px;
      }

      .tab-item {
        min-width: auto !important;
        padding: 0 16px;

        @media (max-width: 600px) {
          padding: 0 8px;
          font-size: 0.85rem;
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
    }
  }

  .prediction-item {
    padding: 12px;
    transition: all 0.3s ease;

    @media (max-width: 600px) {
      padding: 10px;
    }

    &:hover {
      background-color: rgba(54, 76, 245, 0.05);
    }

    .prediction-content {
      flex: 1;
      width: 100%;
    }

    .prediction-title {
      font-size: 1rem;

      @media (max-width: 600px) {
        font-size: 0.9rem;
      }
    }

    .result-buttons {
      display: flex;
      gap: 8px;

      @media (max-width: 600px) {
        .v-btn {
          min-width: auto !important;
          padding: 0 8px !important;
        }
      }
    }
  }

  .picks-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    .picks-title {
      display: flex;
      align-items: center;
    }
  }

  .pick-item {
    padding: 12px;
    transition: all 0.3s ease;

    &.selected-pick {
      background-color: rgba(76, 175, 80, 0.1);
      border-color: #4CAF50 !important;
    }

    .pick-actions {
      display: flex;
      align-items: center;
      gap: 8px;

      @media (max-width: 600px) {
        flex-direction: column;
      }
    }
  }

  .activities-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .activity-item {
    padding: 12px;
    transition: all 0.3s ease;

    &:hover {
      background-color: rgba(54, 76, 245, 0.05);
    }
  }

  .action-buttons {
    display: flex;
    gap: 8px;
    align-items: center;

    @media (max-width: 600px) {
      flex-direction: column;
      gap: 4px;
    }
  }
}

.border {
  border: 1px solid #e0e0e0;
  border-radius: 12px;

  @media (max-width: 600px) {
    border-radius: 8px;
  }
}
</style>