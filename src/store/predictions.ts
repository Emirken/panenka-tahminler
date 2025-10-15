import { defineStore } from 'pinia'
import { Prediction } from '@/types'

interface PredictionsState {
    predictions: Prediction[]
    todaysPicks: string[] // Günün panenkası seçilen tahmin ID'leri (max 3)
}

export const usePredictionsStore = defineStore('predictions', {
    state: (): PredictionsState => ({
        predictions: [
            {
                id: '1',
                editorId: '1',
                editorName: 'Emircan Adak',
                league: 'Premier Lig',
                homeTeam: 'Aston Villa',
                awayTeam: 'Arsenal',
                homeLogo: '🔴🔵',
                awayLogo: '🔴⚪',
                prediction: '2.5 Gol Üstü',
                odds: 1.70,
                explanation: 'Unai Emery eski takımına karşı sürpriz yapabilir. Aston Villa kendi evinde çok etkili bir takım. Arsenal şampiyonluk yolunda puan kaybetmek istemeyecektir. Gollü ve çekişmeli bir maç bekliyorum.',
                matchDate: '2025-10-13T21:00:00',
                createdAt: '2025-10-13T10:00:00',
            },
            {
                id: '2',
                editorId: '2',
                editorName: 'Berke Katıksız',
                league: 'İtalya Serie A',
                homeTeam: 'Inter',
                awayTeam: 'Juventus',
                homeLogo: '🔵⚫',
                awayLogo: '⚪⚫',
                prediction: '2.5 Gol Altı',
                odds: 1.80,
                explanation: 'İtalya\'nın en büyük derbisi. İki takım da zirve mücadelesi veriyor. Kontrollü bir oyun ve az gol bekliyorum.',
                matchDate: '2025-10-14T20:45:00',
                createdAt: '2025-10-13T11:00:00',
            },
            {
                id: '3',
                editorId: '1',
                editorName: 'Emircan Adak',
                league: 'Almanya Bundesliga',
                homeTeam: 'Bayern',
                awayTeam: 'Stuttgart',
                homeLogo: '🔴⚪',
                awayLogo: '⚪🔴',
                prediction: 'Handikaplı Maç Sonucu 1',
                odds: 1.95,
                explanation: 'Stuttgart bu sezonun sürpriz takımı ancak Allianz Arena\'da işleri zor. Bayern Münih, Leverkusen\'i takibini sürdürmek için hata yapmayacaktır. Farklı bir galibiyet alabilirler.',
                matchDate: '2025-10-15T18:30:00',
                createdAt: '2025-10-13T12:00:00',
            },
            {
                id: '4',
                editorId: '3',
                editorName: 'Erman Şener',
                league: 'Türkiye Süper Lig',
                homeTeam: 'Fenerbahçe',
                awayTeam: 'Galatasaray',
                homeLogo: '💛💙',
                awayLogo: '🔴🟡',
                prediction: 'Karşılıklı Gol Var',
                odds: 1.55,
                explanation: 'Derbide tansiyon yüksek olacak. Fenerbahçe\'nin ev sahibi avantajı ve son haftalardaki çıkışı önemli. Ancak Galatasaray\'ın da Icardi gibi bir gol silahı var. İki takımın da gol bulmasını bekliyorum.',
                matchDate: '2025-10-16T19:00:00',
                createdAt: '2025-10-13T13:00:00',
            },
        ],
        todaysPicks: ['1', '2', '4'], // Başlangıçta 3 tahmin seçili
    }),

    getters: {
        allPredictions: (state) => state.predictions,

        predictionsByEditor: (state) => (editorId: string) => {
            return state.predictions.filter(p => p.editorId === editorId)
        },

        latestPredictions: (state) => {
            return [...state.predictions]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 10)
        },

        // Günün Panenkası için seçilen tahminler
        todaysPicksPredictions: (state) => {
            return state.todaysPicks
                .map(id => state.predictions.find(p => p.id === id))
                .filter(p => p !== undefined) as Prediction[]
        },
    },

    actions: {
        addPrediction(prediction: Omit<Prediction, 'id' | 'createdAt'>) {
            const newPrediction: Prediction = {
                ...prediction,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
            }
            this.predictions.unshift(newPrediction)
            this.savePredictions()
        },

        updatePrediction(id: string, updates: Partial<Prediction>) {
            const index = this.predictions.findIndex(p => p.id === id)
            if (index !== -1) {
                this.predictions[index] = { ...this.predictions[index], ...updates }
                this.savePredictions()
            }
        },

        deletePrediction(id: string) {
            this.predictions = this.predictions.filter(p => p.id !== id)
            // Silinen tahmin günün panenkasında varsa oradan da kaldır
            this.todaysPicks = this.todaysPicks.filter(pickId => pickId !== id)
            this.savePredictions()
        },

        // Günün panenkası seçimini güncelle
        setTodaysPicks(predictionIds: string[]) {
            // Maksimum 3 tahmin seçilebilir
            this.todaysPicks = predictionIds.slice(0, 3)
            this.savePredictions()
        },

        // Günün panenkasına tahmin ekle
        addToTodaysPicks(predictionId: string) {
            if (this.todaysPicks.length < 3 && !this.todaysPicks.includes(predictionId)) {
                this.todaysPicks.push(predictionId)
                this.savePredictions()
            }
        },

        // Günün panenkasından tahmin çıkar
        removeFromTodaysPicks(predictionId: string) {
            this.todaysPicks = this.todaysPicks.filter(id => id !== predictionId)
            this.savePredictions()
        },

        savePredictions() {
            localStorage.setItem('predictions', JSON.stringify(this.predictions))
            localStorage.setItem('todaysPicks', JSON.stringify(this.todaysPicks))
        },

        loadPredictions() {
            const stored = localStorage.getItem('predictions')
            if (stored) {
                this.predictions = JSON.parse(stored)
            }

            const storedPicks = localStorage.getItem('todaysPicks')
            if (storedPicks) {
                this.todaysPicks = JSON.parse(storedPicks)
            }
        },
    },
})