import { defineStore } from 'pinia'
import { Prediction } from '@/types'

interface PredictionsState {
    predictions: Prediction[]
    todaysPicks: string[] // Günün panenkası seçilen tahmin ID'leri (her admindan max 1 tane)
}

export const usePredictionsStore = defineStore('predictions', {
    state: (): PredictionsState => ({
        predictions: [],
        todaysPicks: [],
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

        // Belirli bir adminın seçtiği günün panenkası tahmini
        editorTodaysPick: (state) => (editorId: string) => {
            const editorPredictions = state.predictions.filter(p => p.editorId === editorId)
            const editorPickId = state.todaysPicks.find(pickId =>
                editorPredictions.some(p => p.id === pickId)
            )
            return editorPickId || null
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
            this.todaysPicks = this.todaysPicks.filter(pickId => pickId !== id)
            this.savePredictions()
        },

        // Günün panenkasına tahmin ekle (Her admin sadece 1 tahmin seçebilir)
        addToTodaysPicks(predictionId: string, editorId: string) {
            // Önce bu adminin daha önce seçtiği tahmini bul ve kaldır
            const editorPredictions = this.predictions.filter(p => p.editorId === editorId)
            const oldPickId = this.todaysPicks.find(pickId =>
                editorPredictions.some(p => p.id === pickId)
            )

            if (oldPickId) {
                this.todaysPicks = this.todaysPicks.filter(id => id !== oldPickId)
            }

            // Yeni tahmini ekle (eğer zaten yoksa)
            if (!this.todaysPicks.includes(predictionId)) {
                this.todaysPicks.push(predictionId)
            }

            this.savePredictions()
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