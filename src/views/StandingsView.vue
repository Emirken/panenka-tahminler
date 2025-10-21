<template>
  <div class="standings-view py-12">
    <div class="content-wrapper">
      <h1 class="page-title text-center mb-8">Puan Tablosu</h1>

      <!-- League Tabs -->
      <section class="league-tabs-section mb-8">
        <v-row justify="center">
          <v-col cols="12" md="10">
            <div class="league-tabs-container">
              <button
                  v-for="league in leagues"
                  :key="league.id"
                  :class="['league-tab', { 'active': selectedLeague === league.id }]"
                  @click="selectLeague(league.id)"
              >
                {{ league.name }}
              </button>
            </div>
          </v-col>
        </v-row>
      </section>

      <!-- Standings Table -->
      <section class="standings-content">
        <v-container fluid>
          <!-- Loading State -->
          <div v-if="loading" class="loading-state">
            <v-progress-circular
                indeterminate
                color="primary"
                size="64"
            />
            <p class="text-h6 text-grey mt-4">Puan tablosu yükleniyor...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="error-state">
            <v-icon size="80" color="error">mdi-alert-circle</v-icon>
            <p class="text-h6 text-grey mt-4">{{ error }}</p>
            <v-btn color="primary" class="mt-4" @click="loadStandings">
              Tekrar Dene
            </v-btn>
          </div>

          <!-- Standings Table -->
          <v-card v-else-if="standings" elevation="4" class="standings-card">
            <v-card-title class="standings-header pa-6">
              <div class="d-flex align-items-center">
                <img v-if="standings.league.logo" :src="standings.league.logo" class="league-logo mr-3" />
                <div>
                  <h2 class="league-name">{{ standings.league.name }}</h2>
                  <p class="season-info">{{ currentSeasonText }}</p>
                  <p v-if="lastUpdated" class="last-updated text-caption text-grey">
                    Son güncelleme: {{ lastUpdated }}
                  </p>
                </div>
              </div>
            </v-card-title>

            <v-card-text class="pa-0">
              <div class="table-responsive">
                <table class="standings-table">
                  <thead>
                  <tr>
                    <th class="text-center">Sıra</th>
                    <th>Takım</th>
                    <th class="text-center">O</th>
                    <th class="text-center">G</th>
                    <th class="text-center">B</th>
                    <th class="text-center">M</th>
                    <th class="text-center">A</th>
                    <th class="text-center">Y</th>
                    <th class="text-center">AV</th>
                    <th class="text-center highlight-col">P</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr
                      v-for="team in standingsTable"
                      :key="team.team.id"
                      :class="[getPositionClass(team.rank), 'clickable-row']"
                      @click="goToTeamDetail(team.team.id, team.team.name)"
                  >
                    <td class="text-center position-cell">
                      <span class="position-number">{{ team.rank }}</span>
                    </td>
                    <td class="team-cell">
                      <div class="team-info">
                        <img :src="team.team.logo" class="team-crest" />
                        <span class="team-name">{{ team.team.name }}</span>
                      </div>
                    </td>
                    <td class="text-center">{{ team.all.played }}</td>
                    <td class="text-center">{{ team.all.win }}</td>
                    <td class="text-center">{{ team.all.draw }}</td>
                    <td class="text-center">{{ team.all.lose }}</td>
                    <td class="text-center">{{ team.all.goals.for }}</td>
                    <td class="text-center">{{ team.all.goals.against }}</td>
                    <td class="text-center">{{ team.goalsDiff > 0 ? '+' : '' }}{{ team.goalsDiff }}</td>
                    <td class="text-center highlight-col points-cell">
                      <span class="points-number">{{ team.points }}</span>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </v-card-text>

            <!-- Legend -->
            <v-card-text class="legend pa-6">
              <div class="legend-items">
                <div class="legend-item">
                  <span class="legend-color champions-league"></span>
                  <span class="legend-text">Şampiyonlar Ligi</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color europa-league"></span>
                  <span class="legend-text">Avrupa Ligi</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color relegation"></span>
                  <span class="legend-text">Düşme</span>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-container>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getStandings, type StandingsResponse, type StandingTeam } from '@/services/footballApi'

const router = useRouter()

const leagues = [
  { name: 'Premier Lig', id: 39 },
  { name: 'La Liga', id: 140 },
  { name: 'Serie A', id: 135 },
  { name: 'Ligue 1', id: 61 },
  { name: 'Bundesliga', id: 78 },
  { name: 'Süper Lig', id: 203 },
  { name: '1. Lig', id: 204 },
]

const selectedLeague = ref(39)
const standings = ref<StandingsResponse | null>(null)
const loading = ref(false)
const error = ref('')
const lastUpdated = ref<string>('')

// Cache için değişkenler
const standingsCache = ref<Map<number, { data: StandingsResponse; timestamp: number }>>(new Map())
const CACHE_DURATION = 15 * 60 * 1000 // 15 dakika

const standingsTable = computed(() => {
  if (!standings.value) return []
  return standings.value.league.standings[0] || []
})

const currentSeasonText = computed(() => {
  if (!standings.value) return ''
  return `${standings.value.league.season} Sezonu`
})

const getPositionClass = (rank: number) => {
  if (rank <= 4) return 'champions-league-row'
  if (rank <= 6) return 'europa-league-row'
  if (rank >= 18) return 'relegation-row'
  return ''
}

const formatLastUpdated = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const getCachedStandings = (leagueId: number): StandingsResponse | null => {
  const cached = standingsCache.value.get(leagueId)
  if (!cached) return null

  const now = Date.now()
  if (now - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  standingsCache.value.delete(leagueId)
  return null
}

const setCachedStandings = (leagueId: number, data: StandingsResponse) => {
  standingsCache.value.set(leagueId, {
    data,
    timestamp: Date.now()
  })
}

const selectLeague = (leagueId: number) => {
  selectedLeague.value = leagueId
  loadStandings()
}

const loadStandings = async () => {
  const cachedData = getCachedStandings(selectedLeague.value)
  if (cachedData) {
    standings.value = cachedData
    lastUpdated.value = formatLastUpdated(standingsCache.value.get(selectedLeague.value)!.timestamp)
    return
  }

  loading.value = true
  error.value = ''

  try {
    const data = await getStandings(selectedLeague.value)
    standings.value = data

    setCachedStandings(selectedLeague.value, data)
    lastUpdated.value = formatLastUpdated(Date.now())
  } catch (err: any) {
    error.value = 'Puan tablosu yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
    console.error('Standings error:', err)
  } finally {
    loading.value = false
  }
}

const goToTeamDetail = (teamId: number, teamName: string) => {
  // Takım adını URL-friendly hale getir
  const teamNameSlug = teamName.replace(/\s+/g, '-')

  router.push({
    name: 'teamDetail',
    params: {
      teamName: teamNameSlug
    },
    state: {
      teamId: teamId,
      season: standings.value?.league.season,
      league: selectedLeague.value
    }
  })
}

onMounted(() => {
  // SEO: Sayfa henüz aktif değil, Google'da indexlenmesin
  const metaRobots = document.createElement('meta')
  metaRobots.name = 'robots'
  metaRobots.content = 'noindex, nofollow'
  document.head.appendChild(metaRobots)

  loadStandings()
})
</script>

<style scoped lang="scss">
.standings-view {
  background-color: #edf1f6;
  min-height: calc(100vh - 200px);
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #364cf5;

  @media (max-width: 600px) {
    font-size: 2rem;
  }
}

.league-tabs-section {
  .league-tabs-container {
    display: flex;
    gap: 8px;
    background: white;
    padding: 8px;
    border-radius: 12px;
    overflow-x: auto;
    box-shadow: 0 2px 8px rgba(54, 76, 245, 0.1);

    &::-webkit-scrollbar {
      height: 6px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: #364cf5;
      border-radius: 3px;
    }

    .league-tab {
      flex: 1;
      min-width: 120px;
      padding: 12px 16px;
      border: none;
      border-radius: 8px;
      background: transparent;
      font-size: 0.875rem;
      font-weight: 600;
      color: #666;
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;

      &:hover {
        background: rgba(54, 76, 245, 0.1);
        color: #364cf5;
      }

      &.active {
        background: #364cf5;
        color: white;
      }

      @media (max-width: 600px) {
        min-width: 100px;
        padding: 10px 12px;
        font-size: 0.8rem;
      }
    }
  }
}

.loading-state,
.error-state {
  text-align: center;
  padding: 80px 20px;
}

.standings-card {
  border-radius: 12px !important;
  overflow: hidden;

  .standings-header {
    background: linear-gradient(135deg, #364cf5 0%, #2b3dc4 100%);
    color: white;

    .league-logo {
      width: 48px;
      height: 48px;
      object-fit: contain;
    }

    .league-name {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0;
    }

    .season-info {
      font-size: 0.875rem;
      opacity: 0.9;
      margin: 4px 0 0 0;
    }
  }

  .table-responsive {
    overflow-x: auto;
  }

  .standings-table {
    width: 100%;
    border-collapse: collapse;

    thead {
      background: #f5f5f5;

      th {
        padding: 16px 12px;
        font-size: 0.875rem;
        font-weight: 700;
        color: #333;
        border-bottom: 2px solid #e0e0e0;

        @media (max-width: 600px) {
          padding: 12px 8px;
          font-size: 0.75rem;
        }
      }
    }

    tbody {
      tr {
        transition: all 0.2s ease;
        border-bottom: 1px solid #f0f0f0;

        &.clickable-row {
          cursor: pointer;

          &:hover {
            background-color: rgba(54, 76, 245, 0.08) !important;
            transform: scale(1.01);
          }

          &:active {
            transform: scale(0.99);
          }
        }

        &.champions-league-row {
          border-left: 4px solid #4CAF50;
        }

        &.europa-league-row {
          border-left: 4px solid #FF9800;
        }

        &.relegation-row {
          border-left: 4px solid #F44336;
        }
      }

      td {
        padding: 16px 12px;
        font-size: 0.875rem;
        color: #333;

        @media (max-width: 600px) {
          padding: 12px 8px;
          font-size: 0.75rem;
        }

        &.position-cell {
          .position-number {
            font-weight: 700;
            color: #666;
          }
        }

        &.team-cell {
          .team-info {
            display: flex;
            align-items: center;
            gap: 12px;

            .team-crest {
              width: 24px;
              height: 24px;
              object-fit: contain;

              @media (max-width: 600px) {
                width: 20px;
                height: 20px;
              }
            }

            .team-name {
              font-weight: 600;

              @media (max-width: 600px) {
                font-size: 0.75rem;
              }
            }
          }
        }

        &.highlight-col {
          background-color: #f0f4ff;
        }

        &.points-cell {
          .points-number {
            font-weight: 700;
            font-size: 1rem;
            color: #364cf5;

            @media (max-width: 600px) {
              font-size: 0.875rem;
            }
          }
        }
      }
    }
  }

  .legend {
    border-top: 1px solid #e0e0e0;
    background-color: #fafafa;

    .legend-items {
      display: flex;
      gap: 24px;
      flex-wrap: wrap;
      justify-content: center;

      .legend-item {
        display: flex;
        align-items: center;
        gap: 8px;

        .legend-color {
          width: 24px;
          height: 4px;
          border-radius: 2px;

          &.champions-league {
            background-color: #4CAF50;
          }

          &.europa-league {
            background-color: #FF9800;
          }

          &.relegation {
            background-color: #F44336;
          }
        }

        .legend-text {
          font-size: 0.8125rem;
          color: #666;
        }
      }
    }
  }
}
</style>