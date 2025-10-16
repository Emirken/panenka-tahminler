// src/store/predictions.ts - Son 10 maç ile güncellenmiş versiyon

import { defineStore } from 'pinia'
import { Prediction, PredictionResult } from '@/types'
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
    orderBy
} from 'firebase/firestore'
import { db } from '@/firebase/config'

interface PredictionsState {
    predictions: Prediction[]
    todaysPicks: string[]
    loading: boolean
}

export const usePredictionsStore = defineStore('predictions', {
    state: (): PredictionsState => ({
        predictions: [],
        todaysPicks: [],
        loading: false,
    }),

    getters: {
        allPredictions: (state) => state.predictions,

        predictionsByEditor: (state) => (editorId: string) => {
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
        // Firestore'dan tüm tahminleri yükle
        async loadPredictions() {
            this.loading = true
            try {
                const predictionsRef = collection(db, 'predictions')
                const q = query(predictionsRef, orderBy('createdAt', 'desc'))
                const querySnapshot = await getDocs(q)

                this.predictions = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Prediction))

                // Today's picks'i yükle
                const picksRef = collection(db, 'todaysPicks')
                const picksSnapshot = await getDocs(picksRef)
                this.todaysPicks = picksSnapshot.docs.map(doc => doc.data().predictionId)
            } catch (error) {
                console.error('Tahminler yüklenirken hata:', error)
            } finally {
                this.loading = false
            }
        },

        // Son 10 sonuçlanmış tahmini getir (5'ten 10'a çıkarıldı)
        lastFiveResults(editorId: string) {
            return [...this.predictions]
                .filter(p => p.editorId === editorId && p.result && p.result !== 'pending')
                .sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime())
                .slice(0, 10)
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

        // Yeni tahmin ekle
        async addPrediction(prediction: Omit<Prediction, 'id' | 'createdAt'>) {
            try {
                const newPrediction = {
                    ...prediction,
                    createdAt: new Date().toISOString(),
                    result: 'pending' as PredictionResult,
                }

                const docRef = await addDoc(collection(db, 'predictions'), newPrediction)

                this.predictions.unshift({
                    id: docRef.id,
                    ...newPrediction
                })

                return true
            } catch (error) {
                console.error('Tahmin eklenirken hata:', error)
                return false
            }
        },

        // Tahmini güncelle
        async updatePrediction(id: string, updates: Partial<Prediction>) {
            try {
                const predictionRef = doc(db, 'predictions', id)
                await updateDoc(predictionRef, updates)

                const index = this.predictions.findIndex(p => p.id === id)
                if (index !== -1) {
                    this.predictions[index] = { ...this.predictions[index], ...updates }
                }

                return true
            } catch (error) {
                console.error('Tahmin güncellenirken hata:', error)
                return false
            }
        },

        // Tahmin sonucunu güncelle
        async updatePredictionResult(id: string, result: PredictionResult) {
            return await this.updatePrediction(id, { result })
        },

        // Tahmini sil
        async deletePrediction(id: string) {
            try {
                await deleteDoc(doc(db, 'predictions', id))

                this.predictions = this.predictions.filter(p => p.id !== id)

                // Today's picks'ten de kaldır
                await this.removeFromTodaysPicks(id)

                return true
            } catch (error) {
                console.error('Tahmin silinirken hata:', error)
                return false
            }
        },

        // Günün panenkasına ekle
        async addToTodaysPicks(predictionId: string, editorId: string) {
            try {
                // Önce bu editörün eski seçimini kaldır
                const editorPredictions = this.predictions.filter(p => p.editorId === editorId)
                const oldPickId = this.todaysPicks.find(pickId =>
                    editorPredictions.some(p => p.id === pickId)
                )

                if (oldPickId) {
                    await this.removeFromTodaysPicks(oldPickId)
                }

                // Yeni seçimi ekle
                await addDoc(collection(db, 'todaysPicks'), {
                    predictionId,
                    editorId,
                    addedAt: new Date().toISOString()
                })

                if (!this.todaysPicks.includes(predictionId)) {
                    this.todaysPicks.push(predictionId)
                }

                return true
            } catch (error) {
                console.error('Günün panenkasına eklenirken hata:', error)
                return false
            }
        },

        // Günün panenkasından kaldır
        async removeFromTodaysPicks(predictionId: string) {
            try {
                const picksRef = collection(db, 'todaysPicks')
                const q = query(picksRef, where('predictionId', '==', predictionId))
                const querySnapshot = await getDocs(q)

                const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref))
                await Promise.all(deletePromises)

                this.todaysPicks = this.todaysPicks.filter(id => id !== predictionId)

                return true
            } catch (error) {
                console.error('Günün panenkasından kaldırılırken hata:', error)
                return false
            }
        },

        // LocalStorage metodları artık kullanılmıyor (Firebase kullanıyoruz)
        savePredictions() {
            // Firebase kullanıldığı için bu metod artık boş
        },
    },
})