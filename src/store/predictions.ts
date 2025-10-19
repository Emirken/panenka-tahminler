// src/store/predictions.ts - Son 20 maç ile güncellenmiş versiyon

import { defineStore } from 'pinia'
import { Prediction, PredictionResult, EditorResult } from '@/types'
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
    orderBy,
    onSnapshot
} from 'firebase/firestore'
import { db } from '@/firebase/config'

interface PredictionsState {
    predictions: Prediction[]
    editorResults: EditorResult[]
    todaysPicks: string[]
    loading: boolean
    unsubscribers: Array<() => void>
}

export const usePredictionsStore = defineStore('predictions', {
    state: (): PredictionsState => ({
        predictions: [],
        editorResults: [],
        todaysPicks: [],
        loading: false,
        unsubscribers: [],
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

                // Editor results'ı yükle
                const resultsRef = collection(db, 'editorResults')
                const resultsQuery = query(resultsRef, orderBy('matchDate', 'desc'))
                const resultsSnapshot = await getDocs(resultsQuery)

                this.editorResults = resultsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as EditorResult))

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

        // Son 20 tahmini getir (predictions + editorResults)
        // Aktif tahminlerden sadece sonuçlanmış olanlar, arşivden tüm tahminler (pending dahil)
        lastFiveResults(editorId: string) {
            // Aktif tahminlerden sonuçlanmış olanları al (pending hariç)
            const predictionResults = [...this.predictions]
                .filter(p => p.editorId === editorId && p.result && p.result !== 'pending')
                .map(p => ({
                    homeTeam: p.homeTeam,
                    awayTeam: p.awayTeam,
                    prediction: p.prediction,
                    odds: p.odds,
                    matchDate: p.matchDate,
                    result: p.result as 'won' | 'lost' | 'pending'
                }))

            // Silinen tahminlerden tüm sonuçları al (pending dahil - silinen tahminler için)
            const archivedResults = [...this.editorResults]
                .filter(r => r.editorId === editorId)
                .map(r => ({
                    homeTeam: r.homeTeam,
                    awayTeam: r.awayTeam,
                    prediction: r.prediction,
                    odds: r.odds,
                    matchDate: r.matchDate,
                    result: r.result
                }))

            // İkisini birleştir, tarihe göre sırala ve ilk 20'yi al
            return [...predictionResults, ...archivedResults]
                .sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime())
                .slice(0, 20)
        },

        // Editörün başarı oranı (predictions + editorResults)
        editorSuccessRate(editorId: string) {
            // Aktif tahminlerden sonuçlanmış olanları al
            const activePredictions = this.predictions.filter(
                p => p.editorId === editorId && p.result && p.result !== 'pending'
            )

            // Silinen tahminlerin sonuçlarını al
            const archivedResults = this.editorResults.filter(r => r.editorId === editorId)

            const totalCount = activePredictions.length + archivedResults.length

            if (totalCount === 0) return 0

            const wonCount = activePredictions.filter(p => p.result === 'won').length +
                             archivedResults.filter(r => r.result === 'won').length

            return Math.round((wonCount / totalCount) * 100)
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

        // Tahmini sil (sonuçlanmışsa editorResults'a kaydet)
        async deletePrediction(id: string) {
            try {
                // Tahmini bul
                const prediction = this.predictions.find(p => p.id === id)
                if (!prediction) {
                    console.error('Tahmin bulunamadı:', id)
                    return false
                }

                // Today's picks'ten kaldır (önce bu işlemi yap)
                try {
                    await this.removeFromTodaysPicks(id)
                } catch (error) {
                    console.warn('Today\'s picks\'ten kaldırma hatası (devam ediliyor):', error)
                }

                // Silinen tahmini sadece sonuçlanmışsa (won veya lost) editorResults'a kaydet
                if (prediction.result === 'won' || prediction.result === 'lost') {
                    try {
                        const editorResult: Omit<EditorResult, 'id'> = {
                            editorId: prediction.editorId,
                            homeTeam: prediction.homeTeam,
                            awayTeam: prediction.awayTeam,
                            prediction: prediction.prediction,
                            odds: prediction.odds,
                            matchDate: prediction.matchDate,
                            result: prediction.result,
                            createdAt: new Date().toISOString()
                        }

                        // editorResults koleksiyonuna ekle
                        const resultDoc = await addDoc(collection(db, 'editorResults'), editorResult)

                        // Local state'e ekle
                        this.editorResults.unshift({
                            id: resultDoc.id,
                            ...editorResult
                        })
                    } catch (error) {
                        console.error('EditorResults\'a kaydetme hatası:', error)
                        // Devam et, tahmin yine de silinsin
                    }
                }

                // Tahmini Firebase'den sil
                await deleteDoc(doc(db, 'predictions', id))

                // Local state'ten kaldır
                this.predictions = this.predictions.filter(p => p.id !== id)

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

        // Real-time listener'ları kur
        setupRealtimeListeners() {
            // Eğer zaten listener varsa, önce temizle
            this.cleanupListeners()

            // Predictions listener
            const predictionsRef = collection(db, 'predictions')
            const predictionsQuery = query(predictionsRef, orderBy('createdAt', 'desc'))
            const unsubPredictions = onSnapshot(predictionsQuery, (snapshot) => {
                this.predictions = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Prediction))
            }, (error) => {
                console.error('Predictions real-time listener hatası:', error)
            })

            // Editor Results listener
            const resultsRef = collection(db, 'editorResults')
            const resultsQuery = query(resultsRef, orderBy('matchDate', 'desc'))
            const unsubResults = onSnapshot(resultsQuery, (snapshot) => {
                this.editorResults = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as EditorResult))
            }, (error) => {
                console.error('EditorResults real-time listener hatası:', error)
            })

            // Today's Picks listener
            const picksRef = collection(db, 'todaysPicks')
            const unsubPicks = onSnapshot(picksRef, (snapshot) => {
                this.todaysPicks = snapshot.docs.map(doc => doc.data().predictionId)
            }, (error) => {
                console.error('TodaysPicks real-time listener hatası:', error)
            })

            // Unsubscribe fonksiyonlarını sakla
            this.unsubscribers = [unsubPredictions, unsubResults, unsubPicks]
        },

        // Listener'ları temizle
        cleanupListeners() {
            this.unsubscribers.forEach(unsub => unsub())
            this.unsubscribers = []
        },
    },
})