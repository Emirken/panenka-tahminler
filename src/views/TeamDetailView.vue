<template>
  <div class="team-detail-view py-12">
    <div class="content-wrapper">
      <!-- Back Button -->
      <v-btn
          variant="text"
          color="primary"
          class="mb-6"
          @click="goBack"
      >
        <v-icon class="mr-2">mdi-arrow-left</v-icon>
        Puan Tablosuna Dön
      </v-btn>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <v-progress-circular
            indeterminate
            color="primary"
            size="64"
        />
        <p class="text-h6 text-grey mt-4">Takım bilgileri yükleniyor...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <v-icon size="80" color="error">mdi-alert-circle</v-icon>
        <p class="text-h6 text-grey mt-4">{{ error }}</p>
        <v-btn color="primary" class="mt-4" @click="loadTeamData">
          Tekrar Dene
        </v-btn>
      </div>

      <!-- Team Content -->
      <div v-else-if="statistics">
        <!-- Team Header -->
        <v-card elevation="4" class="team-header-card mb-6">
          <v-card-text class="pa-8">
            <div class="team-header">
              <div class="team-logo-section">
                <img :src="statistics.team.logo" class="team-main-logo" />
              </div>
              <div class="team-info-section">
                <h1 class="team-name">{{ statistics.team.name }}</h1>
                <div class="team-meta">
                  <v-chip color="white" size="small" class="mr-2">
                    {{ statistics.league.name }}
                  </v-chip>
                  <v-chip color="white" size="small">
                    {{ statistics.league.season }} Sezonu
                  </v-chip>
                </div>
                <div class="form-display mt-4">
                  <span class="form-label">Son Maçlar:</span>
                  <div class="form-badges">
                    <v-chip
                        v-for="(result, index) in formArray"
                        :key="index"
                        :color="getFormColor(result)"
                        size="small"
                        class="form-chip"
                    >
                      {{ result }}
                    </v-chip>
                  </div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Statistics Grid -->
        <v-row>
          <!-- Match Stats -->
          <v-col cols="12" md="6">
            <v-card elevation="2" class="stat-card h-100">
              <v-card-title class="card-header">
                <v-icon class="mr-2">mdi-soccer-field</v-icon>
                Maç İstatistikleri
              </v-card-title>
              <v-card-text class="pa-6">
                <div class="stat-row">
                  <span class="stat-label">Toplam Maç</span>
                  <span class="stat-value">{{ statistics.fixtures.played.total }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Galibiyet</span>
                  <span class="stat-value success">{{ statistics.fixtures.wins.total }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Beraberlik</span>
                  <span class="stat-value warning">{{ statistics.fixtures.draws.total }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Mağlubiyet</span>
                  <span class="stat-value error">{{ statistics.fixtures.loses.total }}</span>
                </div>
                <v-divider class="my-4" />
                <div class="stat-row">
                  <span class="stat-label">Ev Sahibi Galibiyet</span>
                  <span class="stat-value">{{ statistics.fixtures.wins.home }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Deplasman Galibiyet</span>
                  <span class="stat-value">{{ statistics.fixtures.wins.away }}</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Goal Stats -->
          <v-col cols="12" md="6">
            <v-card elevation="2" class="stat-card h-100">
              <v-card-title class="card-header">
                <v-icon class="mr-2">mdi-soccer</v-icon>
                Gol İstatistikleri
              </v-card-title>
              <v-card-text class="pa-6">
                <div class="stat-row">
                  <span class="stat-label">Attığı Gol</span>
                  <span class="stat-value">{{ statistics.goals.for.total.total }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Yediği Gol</span>
                  <span class="stat-value">{{ statistics.goals.against.total.total }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Ortalama Attığı Gol</span>
                  <span class="stat-value">{{ statistics.goals.for.average.total }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Ortalama Yediği Gol</span>
                  <span class="stat-value">{{ statistics.goals.against.average.total }}</span>
                </div>
                <v-divider class="my-4" />
                <div class="stat-row">
                  <span class="stat-label">Gol Yemeden</span>
                  <span class="stat-value success">{{ statistics.clean_sheet.total }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Gol Atamadığı</span>
                  <span class="stat-value error">{{ statistics.failed_to_score.total }}</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Biggest Wins/Losses -->
          <v-col cols="12" md="6">
            <v-card elevation="2" class="stat-card h-100">
              <v-card-title class="card-header">
                <v-icon class="mr-2">mdi-trophy</v-icon>
                En Büyük Sonuçlar
              </v-card-title>
              <v-card-text class="pa-6">
                <div class="stat-row">
                  <span class="stat-label">En Büyük Galibiyet (Ev)</span>
                  <span class="stat-value success">{{ statistics.biggest.wins.home || '-' }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">En Büyük Galibiyet (Dep)</span>
                  <span class="stat-value success">{{ statistics.biggest.wins.away || '-' }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">En Büyük Mağlubiyet (Ev)</span>
                  <span class="stat-value error">{{ statistics.biggest.loses.home || '-' }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">En Büyük Mağlubiyet (Dep)</span>
                  <span class="stat-value error">{{ statistics.biggest.loses.away || '-' }}</span>
                </div>
                <v-divider class="my-4" />
                <div class="stat-row">
                  <span class="stat-label">Üst Üste Galibiyet</span>
                  <span class="stat-value">{{ statistics.biggest.streak.wins }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Üst Üste Mağlubiyet</span>
                  <span class="stat-value">{{ statistics.biggest.streak.loses }}</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Formations -->
          <v-col cols="12" md="6">
            <v-card elevation="2" class="stat-card h-100">
              <v-card-title class="card-header">
                <v-icon class="mr-2">mdi-strategy</v-icon>
                Dizilişler
              </v-card-title>
              <v-card-text class="pa-6">
                <div v-if="statistics.lineups && statistics.lineups.length > 0">
                  <div
                      v-for="(lineup, index) in statistics.lineups.slice(0, 5)"
                      :key="index"
                      class="lineup-row"
                  >
                    <div class="lineup-formation">{{ lineup.formation }}</div>
                    <div class="lineup-bar-container">
                      <div
                          class="lineup-bar"
                          :style="{ width: `${(lineup.played / statistics.fixtures.played.total) * 100}%` }"
                      ></div>
                    </div>
                    <div class="lineup-count">{{ lineup.played }} maç</div>
                  </div>
                </div>
                <div v-else class="text-center text-grey">
                  Diziliş bilgisi bulunamadı
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Recent Fixtures -->
        <v-card elevation="2" class="fixtures-card mt-6">
          <v-card-title class="card-header">
            <v-icon class="mr-2">mdi-calendar</v-icon>
            Son 10 Maç
          </v-card-title>
          <v-card-text class="pa-0">
            <div v-if="fixtures && fixtures.length > 0">
              <div
                  v-for="fixture in fixtures"
                  :key="fixture.fixture.id"
                  class="fixture-item"
              >
                <div class="fixture-date">
                  {{ formatDate(fixture.fixture.date) }}
                </div>
                <div class="fixture-teams">
                  <div class="fixture-team">
                    <img :src="fixture.teams.home.logo" class="fixture-team-logo" />
                    <span class="fixture-team-name">{{ fixture.teams.home.name }}</span>
                  </div>
                  <div class="fixture-score">
                    <template v-if="fixture.fixture.status.short === 'FT'">
                      <span class="score-number">{{ fixture.goals.home }}</span>
                      <span class="score-separator">-</span>
                      <span class="score-number">{{ fixture.goals.away }}</span>
                    </template>
                    <v-chip v-else size="x-small" color="grey">
                      {{ getMatchStatus(fixture.fixture.status.short) }}
                    </v-chip>
                  </div>
                  <div class="fixture-team">
                    <span class="fixture-team-name">{{ fixture.teams.away.name }}</span>
                    <img :src="fixture.teams.away.logo" class="fixture-team-logo" />
                  </div>
                </div>
                <div class="fixture-result">
                  <v-chip
                      v-if="fixture.fixture.status.short === 'FT'"
                      :color="getResultColor(fixture, teamId)"
                      size="small"
                  >
                    {{ getResultText(fixture, teamId) }}
                  </v-chip>
                </div>
              </div>
            </div>
            <div v-else class="pa-8 text-center text-grey">
              Maç bilgisi bulunamadı
            </div>
          </v-card-text>
        </v-card>

        <!-- Upcoming Fixtures -->
        <v-card elevation="2" class="fixtures-card mt-6">
          <v-card-title class="card-header">
            <v-icon class="mr-2">mdi-calendar-clock</v-icon>
            Gelecek Maçlar
          </v-card-title>
          <v-card-text class="pa-0">
            <div v-if="upcomingFixtures && upcomingFixtures.length > 0">
              <div
                  v-for="fixture in upcomingFixtures"
                  :key="fixture.fixture.id"
                  class="fixture-item"
              >
                <div class="fixture-date">
                  {{ formatDate(fixture.fixture.date) }}
                </div>
                <div class="fixture-teams">
                  <div class="fixture-team">
                    <img :src="fixture.teams.home.logo" class="fixture-team-logo" />
                    <span class="fixture-team-name">{{ fixture.teams.home.name }}</span>
                  </div>
                  <div class="fixture-score">
                    <v-chip size="small" color="primary" variant="outlined">
                      {{ fixture.league.name }}
                    </v-chip>
                  </div>
                  <div class="fixture-team">
                    <span class="fixture-team-name">{{ fixture.teams.away.name }}</span>
                    <img :src="fixture.teams.away.logo" class="fixture-team-logo" />
                  </div>
                </div>
                <div class="fixture-result">
                  <v-chip size="small" color="grey" variant="outlined">
                    {{ getMatchStatus(fixture.fixture.status.short) }}
                  </v-chip>
                </div>
              </div>
            </div>
            <div v-else class="pa-8 text-center text-grey">
              Gelecek maç bilgisi bulunamadı
            </div>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTeamStatistics, getTeamFixtures, getTeamUpcomingFixtures, type TeamStatistics, type TeamFixture } from '@/services/footballApi'

const route = useRoute()
const router = useRouter()

// Router state'ten bilgileri al
const routerState = history.state as any
const teamId = ref<number>(routerState.teamId || 50)
const season = ref<number>(routerState.season || new Date().getFullYear())
const leagueId = ref<number>(routerState.league || 39)

const statistics = ref<TeamStatistics | null>(null)
const fixtures = ref<TeamFixture[]>([])
const upcomingFixtures = ref<TeamFixture[]>([])
const loading = ref(false)
const error = ref('')

const formArray = computed(() => {
  if (!statistics.value?.form) return []
  return statistics.value.form.split('')
})

const getFormColor = (result: string) => {
  switch (result) {
    case 'W': return 'success'
    case 'D': return 'warning'
    case 'L': return 'error'
    default: return 'grey'
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getMatchStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    'NS': 'Oynanmadı',
    'LIVE': 'Canlı',
    '1H': '1. Yarı',
    'HT': 'Devre Arası',
    '2H': '2. Yarı',
    'FT': 'Bitti',
    'PST': 'Ertelendi',
    'CANC': 'İptal',
  }
  return statusMap[status] || status
}

const getResultColor = (fixture: TeamFixture, teamId: number) => {
  const isHome = fixture.teams.home.id === teamId
  const teamGoals = isHome ? fixture.goals.home : fixture.goals.away
  const opponentGoals = isHome ? fixture.goals.away : fixture.goals.home

  if (teamGoals === null || opponentGoals === null) return 'grey'

  if (teamGoals > opponentGoals) return 'success'
  if (teamGoals < opponentGoals) return 'error'
  return 'warning'
}

const getResultText = (fixture: TeamFixture, teamId: number) => {
  const isHome = fixture.teams.home.id === teamId
  const teamGoals = isHome ? fixture.goals.home : fixture.goals.away
  const opponentGoals = isHome ? fixture.goals.away : fixture.goals.home

  if (teamGoals === null || opponentGoals === null) return '-'

  if (teamGoals > opponentGoals) return 'G'
  if (teamGoals < opponentGoals) return 'M'
  return 'B'
}

const loadTeamData = async () => {
  loading.value = true
  error.value = ''

  try {
    const [statsData, fixturesData, upcomingData] = await Promise.all([
      getTeamStatistics(teamId.value, season.value, leagueId.value),
      getTeamFixtures(teamId.value, season.value, 10),
      getTeamUpcomingFixtures(teamId.value, 5)
    ])

    statistics.value = statsData
    fixtures.value = fixturesData
    upcomingFixtures.value = upcomingData
  } catch (err: any) {
    error.value = 'Takım bilgileri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
    console.error('Team detail error:', err)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push({ name: 'standings' })
}

onMounted(() => {
  loadTeamData()
})
</script>

<style scoped lang="scss">
.team-detail-view {
  background-color: #edf1f6;
  min-height: calc(100vh - 200px);
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 80px 20px;
}

.team-header-card {
  border-radius: 12px !important;
  background: linear-gradient(135deg, #364cf5 0%, #2b3dc4 100%);
  color: white;

  .team-header {
    display: flex;
    gap: 32px;
    align-items: center;

    @media (max-width: 960px) {
      flex-direction: column;
      text-align: center;
    }

    .team-logo-section {
      .team-main-logo {
        width: 120px;
        height: 120px;
        object-fit: contain;
        background: white;
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);

        @media (max-width: 600px) {
          width: 80px;
          height: 80px;
          padding: 12px;
        }
      }
    }

    .team-info-section {
      flex: 1;

      .team-name {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 16px;

        @media (max-width: 600px) {
          font-size: 1.75rem;
        }
      }

      .team-meta {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;

        @media (max-width: 960px) {
          justify-content: center;
        }
      }

      .form-display {
        display: flex;
        align-items: center;
        gap: 12px;

        @media (max-width: 960px) {
          justify-content: center;
        }

        .form-label {
          font-size: 0.875rem;
          opacity: 0.9;
        }

        .form-badges {
          display: flex;
          gap: 4px;

          .form-chip {
            font-weight: 700;
            min-width: 32px;
          }
        }
      }
    }
  }
}

.stat-card {
  border-radius: 12px !important;

  .card-header {
    background: #f5f5f5;
    font-weight: 700;
    color: #333;
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #666;
    }

    .stat-value {
      font-size: 1.125rem;
      font-weight: 700;
      color: #333;

      &.success {
        color: #4CAF50;
      }

      &.warning {
        color: #FF9800;
      }

      &.error {
        color: #F44336;
      }
    }
  }

  .lineup-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .lineup-formation {
      min-width: 80px;
      font-weight: 700;
      color: #364cf5;
    }

    .lineup-bar-container {
      flex: 1;
      height: 24px;
      background: #f0f0f0;
      border-radius: 4px;
      overflow: hidden;

      .lineup-bar {
        height: 100%;
        background: linear-gradient(90deg, #364cf5 0%, #2b3dc4 100%);
        transition: width 0.3s ease;
      }
    }

    .lineup-count {
      min-width: 60px;
      text-align: right;
      font-size: 0.875rem;
      color: #666;
    }
  }
}

.fixtures-card {
  border-radius: 12px !important;

  .card-header {
    background: #f5f5f5;
    font-weight: 700;
    color: #333;
  }

  .fixture-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 24px;
    border-bottom: 1px solid #f0f0f0;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #f9f9f9;
    }

    @media (max-width: 960px) {
      flex-direction: column;
      gap: 12px;
      padding: 16px;
    }

    .fixture-date {
      min-width: 140px;
      font-size: 0.8125rem;
      color: #666;

      @media (max-width: 960px) {
        text-align: center;
      }
    }

    .fixture-teams {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;

      @media (max-width: 960px) {
        flex-direction: column;
        gap: 12px;
        width: 100%;
      }

      .fixture-team {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 12px;

        &:last-child {
          flex-direction: row-reverse;
          text-align: right;
        }

        @media (max-width: 960px) {
          justify-content: center;

          &:last-child {
            flex-direction: row;
            text-align: center;
          }
        }

        .fixture-team-logo {
          width: 32px;
          height: 32px;
          object-fit: contain;

          @media (max-width: 600px) {
            width: 24px;
            height: 24px;
          }
        }

        .fixture-team-name {
          font-weight: 600;
          font-size: 0.875rem;

          @media (max-width: 600px) {
            font-size: 0.8125rem;
          }
        }
      }

      .fixture-score {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 80px;
        justify-content: center;

        .score-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: #333;
        }

        .score-separator {
          font-size: 1.25rem;
          color: #999;
        }
      }
    }

    .fixture-result {
      min-width: 60px;
      text-align: center;

      @media (max-width: 960px) {
        width: 100%;
      }
    }
  }
}

.h-100 {
  height: 100%;
}
</style>