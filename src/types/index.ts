// Editör tipi
export interface Editor {
    id: string
    name: string
    avatar?: string
}

// Tahmin sonucu tipi
export type PredictionResult = 'won' | 'lost' | 'pending'

// Tahmin tipi - result alanı eklendi
export interface Prediction {
    id: string
    editorId: string
    editorName: string
    league: string
    homeTeam: string
    awayTeam: string
    homeLogo: string
    awayLogo: string
    prediction: string
    odds: number
    explanation: string
    matchDate: string
    createdAt: string
    result?: PredictionResult // Yeni alan: 'won' | 'lost' | 'pending'
}

// Maç tipi
export interface Match {
    id: string
    league: string
    homeTeam: string
    awayTeam: string
    homeLogo: string
    awayLogo: string
    prediction: string
    odds: number
    matchDate: string
    matchTime: string
}

// Etkinlik tipi
export interface Activity {
    id: string
    icon: string
    title: string
    description: string
}

// Kullanıcı tipi
export interface User {
    id: string
    username: string
    role: 'admin' | 'editor'
    fullName?: string
}

// Giriş bilgileri tipi
export interface LoginCredentials {
    username: string
    password: string
}

// Kupon maçı tipi (Spor Toto için)
export interface CouponMatch {
    homeTeam: string
    awayTeam: string
    prediction: string
}

// Editör sonuç geçmişi (silinen tahminlerin sonuçları için)
export interface EditorResult {
    id?: string
    editorId: string
    homeTeam: string
    awayTeam: string
    prediction: string
    odds: number
    matchDate: string
    result: 'won' | 'lost' | 'pending'
    createdAt: string
}