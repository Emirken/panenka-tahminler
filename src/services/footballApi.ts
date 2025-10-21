// src/services/footballApi.ts

const API_KEY = '491291b79f375f7e6bcb7d3c08d34b8a' // API anahtarınızı buraya yazın
const API_HOST = 'v3.football.api-sports.io'
const API_BASE_URL = 'https://v3.football.api-sports.io'

// Standings Types
export interface StandingTeam {
    rank: number
    team: {
        id: number
        name: string
        logo: string
    }
    points: number
    goalsDiff: number
    group: string
    form: string
    status: string
    description: string | null
    all: {
        played: number
        win: number
        draw: number
        lose: number
        goals: {
            for: number
            against: number
        }
    }
    home: {
        played: number
        win: number
        draw: number
        lose: number
        goals: {
            for: number
            against: number
        }
    }
    away: {
        played: number
        win: number
        draw: number
        lose: number
        goals: {
            for: number
            against: number
        }
    }
    update: string
}

export interface StandingsResponse {
    league: {
        id: number
        name: string
        country: string
        logo: string
        flag: string
        season: number
        standings: StandingTeam[][]
    }
}

// Team Statistics Types
export interface TeamStatistics {
    league: {
        id: number
        name: string
        country: string
        logo: string
        season: number
    }
    team: {
        id: number
        name: string
        logo: string
    }
    form: string
    fixtures: {
        played: {
            home: number
            away: number
            total: number
        }
        wins: {
            home: number
            away: number
            total: number
        }
        draws: {
            home: number
            away: number
            total: number
        }
        loses: {
            home: number
            away: number
            total: number
        }
    }
    goals: {
        for: {
            total: {
                home: number
                away: number
                total: number
            }
            average: {
                home: string
                away: string
                total: string
            }
            minute: {
                [key: string]: {
                    total: number | null
                    percentage: string | null
                }
            }
        }
        against: {
            total: {
                home: number
                away: number
                total: number
            }
            average: {
                home: string
                away: string
                total: string
            }
            minute: {
                [key: string]: {
                    total: number | null
                    percentage: string | null
                }
            }
        }
    }
    biggest: {
        streak: {
            wins: number
            draws: number
            loses: number
        }
        wins: {
            home: string | null
            away: string | null
        }
        loses: {
            home: string | null
            away: string | null
        }
        goals: {
            for: {
                home: number
                away: number
            }
            against: {
                home: number
                away: number
            }
        }
    }
    clean_sheet: {
        home: number
        away: number
        total: number
    }
    failed_to_score: {
        home: number
        away: number
        total: number
    }
    penalty: {
        scored: {
            total: number
            percentage: string
        }
        missed: {
            total: number
            percentage: string
        }
        total: number
    }
    lineups: Array<{
        formation: string
        played: number
    }>
    cards: {
        yellow: {
            [key: string]: {
                total: number | null
                percentage: string | null
            }
        }
        red: {
            [key: string]: {
                total: number | null
                percentage: string | null
            }
        }
    }
}

// Team Fixtures Types
export interface TeamFixture {
    fixture: {
        id: number
        referee: string | null
        timezone: string
        date: string
        timestamp: number
        periods: {
            first: number | null
            second: number | null
        }
        venue: {
            id: number | null
            name: string | null
            city: string | null
        }
        status: {
            long: string
            short: string
            elapsed: number | null
        }
    }
    league: {
        id: number
        name: string
        country: string
        logo: string
        flag: string | null
        season: number
        round: string
    }
    teams: {
        home: {
            id: number
            name: string
            logo: string
            winner: boolean | null
        }
        away: {
            id: number
            name: string
            logo: string
            winner: boolean | null
        }
    }
    goals: {
        home: number | null
        away: number | null
    }
    score: {
        halftime: {
            home: number | null
            away: number | null
        }
        fulltime: {
            home: number | null
            away: number | null
        }
        extratime: {
            home: number | null
            away: number | null
        }
        penalty: {
            home: number | null
            away: number | null
        }
    }
}

// API Functions

/**
 * Get league standings
 * @param leagueId - League ID (e.g., 39 for Premier League)
 * @param season - Season year (e.g., 2024)
 */
export const getStandings = async (
    leagueId: number,
    season?: number
): Promise<StandingsResponse> => {
    // 2024 sezonunu kullan (eğer başka sezon belirtilmemişse)
    const currentSeason = season || 2025

    const response = await fetch(
        `${API_BASE_URL}/standings?league=${leagueId}&season=${currentSeason}`,
        {
            headers: {
                'x-apisports-key': API_KEY
            }
        }
    )

    if (!response.ok) {
        throw new Error('Puan tablosu alınamadı')
    }

    const data = await response.json()

    if (!data.response || data.response.length === 0) {
        throw new Error('Puan tablosu verisi bulunamadı')
    }

    return data.response[0]
}

/**
 * Get team statistics for a specific season and league
 * @param teamId - Team ID
 * @param season - Season year
 * @param leagueId - League ID
 */
export const getTeamStatistics = async (
    teamId: number,
    season: number,
    leagueId: number
): Promise<TeamStatistics> => {
    const response = await fetch(
        `${API_BASE_URL}/teams/statistics?team=${teamId}&season=${season}&league=${leagueId}`,
        {
            headers: {
                'x-apisports-key': API_KEY
            }
        }
    )

    if (!response.ok) {
        throw new Error('Takım istatistikleri alınamadı')
    }

    const data = await response.json()

    if (!data.response) {
        throw new Error('Takım istatistikleri bulunamadı')
    }

    return data.response
}

/**
 * Get team fixtures (matches)
 * @param teamId - Team ID
 * @param season - Season year
 * @param last - Number of last matches to retrieve (default: 10)
 */
export const getTeamFixtures = async (
    teamId: number,
    season: number,
    last: number = 10
): Promise<TeamFixture[]> => {
    const response = await fetch(
        `${API_BASE_URL}/fixtures?team=${teamId}&season=${season}&last=${last}`,
        {
            headers: {
                'x-apisports-key': API_KEY
            }
        }
    )

    if (!response.ok) {
        throw new Error('Takım maçları alınamadı')
    }

    const data = await response.json()

    if (!data.response) {
        throw new Error('Takım maçları bulunamadı')
    }

    return data.response
}

/**
 * Get upcoming fixtures for a team
 * @param teamId - Team ID
 * @param next - Number of upcoming matches to retrieve (default: 5)
 */
export const getTeamUpcomingFixtures = async (
    teamId: number,
    next: number = 5
): Promise<TeamFixture[]> => {
    const response = await fetch(
        `${API_BASE_URL}/fixtures?team=${teamId}&next=${next}`,
        {
            headers: {
                'x-apisports-key': API_KEY
            }
        }
    )

    if (!response.ok) {
        throw new Error('Gelecek maçlar alınamadı')
    }

    const data = await response.json()

    if (!data.response) {
        throw new Error('Gelecek maçlar bulunamadı')
    }

    return data.response
}

/**
 * Get live matches
 */
export const getLiveMatches = async (): Promise<TeamFixture[]> => {
    const response = await fetch(
        `${API_BASE_URL}/fixtures?live=all`,
        {
            headers: {
                'x-apisports-key': API_KEY
            }
        }
    )

    if (!response.ok) {
        throw new Error('Canlı maçlar alınamadı')
    }

    const data = await response.json()

    return data.response || []
}

/**
 * Get fixtures by date
 * @param date - Date in format YYYY-MM-DD
 */
export const getFixturesByDate = async (date: string): Promise<TeamFixture[]> => {
    const response = await fetch(
        `${API_BASE_URL}/fixtures?date=${date}`,
        {
            headers: {
                'x-apisports-key': API_KEY
            }
        }
    )

    if (!response.ok) {
        throw new Error('Maçlar alınamadı')
    }

    const data = await response.json()

    return data.response || []
}

/**
 * Search teams by name
 * @param teamName - Team name to search
 */
export const searchTeams = async (teamName: string) => {
    const response = await fetch(
        `${API_BASE_URL}/teams?search=${encodeURIComponent(teamName)}`,
        {
            headers: {
                'X-RapidAPI-Key': API_KEY,
                'X-RapidAPI-Host': API_HOST
            }
        }
    )

    if (!response.ok) {
        throw new Error('Takım arama başarısız')
    }

    const data = await response.json()

    return data.response || []
}

// Helper function to format API errors
export const handleApiError = (error: any): string => {
    if (error.message) {
        return error.message
    }

    if (error.response?.data?.message) {
        return error.response.data.message
    }

    return 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
}

// Export API configuration for use in other files
export const API_CONFIG = {
    API_KEY,
    API_HOST,
    API_BASE_URL
}