import { defineStore } from 'pinia'
import { Prediction, PredictionResult } from '@/types'

interface PredictionsState {
    predictions: Prediction[]
    todaysPicks: string[]
}

export const usePredictionsStore = defineStore('predictions', {
    state: (): PredictionsState => ({
        predictions: [],
        todaysPicks: [],
    }),

    getters: {
        allPredictions: (state) => state.predictions,

        predictionsByEditor: (state) => (editorId: string) => {
            // Editöre ait tahminleri maç tarihine göre sırala (en yeni en üstte)
            return [...state.predictions]
                .filter(p => p.editorId === editorId)
                .sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime())
        },

        latestPredictions: (state) => {
            return [...state.predictions]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 10)
        },

        todaysPicksPredictions: (state) => {
            return state.todaysPicks
                .map(id => state.predictions.find(p => p.id === id))
                .filter(p => p !== undefined) as Prediction[]
        },

        editorTodaysPick: (state) => (editorId: string) => {
            const editorPredictions = state.predictions.filter(p => p.editorId === editorId)
            const editorPickId = state.todaysPicks.find(pickId =>
                editorPredictions.some(p => p.id === pickId)
            )
            return editorPickId || null
        },
    },

    actions: {
        // Son 5 sonuçlanmış tahmini getir (editöre göre)
        lastFiveResults(editorId: string) {
            return [...this.predictions]
                .filter(p => p.editorId === editorId && p.result && p.result !== 'pending')
                .sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime())
                .slice(0, 5)
        },

        // Editörün başarı oranı
        editorSuccessRate(editorId: string) {
            const editorPredictions = this.predictions.filter(
                p => p.editorId === editorId && p.result && p.result !== 'pending'
            )

            if (editorPredictions.length === 0) return 0

            const wonCount = editorPredictions.filter(p => p.result === 'won').length
            return Math.round((wonCount / editorPredictions.length) * 100)
        },

        addPrediction(prediction: Omit<Prediction, 'id' | 'createdAt'>) {
            const newPrediction: Prediction = {
                ...prediction,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                result: 'pending', // Varsayılan olarak beklemede
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

        // Tahmin sonucunu güncelle
        updatePredictionResult(id: string, result: PredictionResult) {
            const index = this.predictions.findIndex(p => p.id === id)
            if (index !== -1) {
                this.predictions[index].result = result
                this.savePredictions()
            }
        },

        deletePrediction(id: string) {
            this.predictions = this.predictions.filter(p => p.id !== id)
            this.todaysPicks = this.todaysPicks.filter(pickId => pickId !== id)
            this.savePredictions()
        },

        addToTodaysPicks(predictionId: string, editorId: string) {
            const editorPredictions = this.predictions.filter(p => p.editorId === editorId)
            const oldPickId = this.todaysPicks.find(pickId =>
                editorPredictions.some(p => p.id === pickId)
            )

            if (oldPickId) {
                this.todaysPicks = this.todaysPicks.filter(id => id !== oldPickId)
            }

            if (!this.todaysPicks.includes(predictionId)) {
                this.todaysPicks.push(predictionId)
            }

            this.savePredictions()
        },

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