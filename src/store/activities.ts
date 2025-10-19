// src/store/activities.ts - Firebase ile güncellenmiş versiyon

import { defineStore } from 'pinia'
import { Activity } from '@/types'
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    onSnapshot
} from 'firebase/firestore'
import { db } from '@/firebase/config'

interface ActivitiesState {
    activities: Activity[]
    loading: boolean
    unsubscribers: Array<() => void>
}

export const useActivitiesStore = defineStore('activities', {
    state: (): ActivitiesState => ({
        activities: [],
        loading: false,
        unsubscribers: [],
    }),

    getters: {
        allActivities: (state) => state.activities,
    },

    actions: {
        // Firestore'dan etkinlikleri yükle
        async loadActivities() {
            this.loading = true
            try {
                const activitiesRef = collection(db, 'activities')
                const querySnapshot = await getDocs(activitiesRef)

                this.activities = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Activity))

                // Eğer hiç etkinlik yoksa, varsayılan etkinlikleri ekle
                if (this.activities.length === 0) {
                    await this.addDefaultActivities()
                }
            } catch (error) {
                console.error('Etkinlikler yüklenirken hata:', error)
            } finally {
                this.loading = false
            }
        },

        // Varsayılan etkinlikleri ekle
        async addDefaultActivities() {
            const defaultActivities = [
                {
                    icon: 'mdi-trophy',
                    title: 'Haftanın Lideri',
                    description: 'Haftalık tahmin yarışmamızda en yüksek puanı toplayan üyemiz, sürpriz ödüllerin sahibi oluyor.',
                },
                {
                    icon: 'mdi-account-group',
                    title: 'Editörle Söyleşi',
                    description: 'Aylık canlı yayınlarımızda uzman editörlerimiz bir araya gelip, maçları tartışın.',
                },
                {
                    icon: 'mdi-image',
                    title: 'Özel Kupon Çekilişleri',
                    description: 'Sadece abonelere özel, yüksek oranlı sürpriz kuponlar ve hediye abonelik çekilişleri.',
                },
            ]

            for (const activity of defaultActivities) {
                await this.addActivity(activity)
            }
        },

        // Yeni etkinlik ekle
        async addActivity(activity: Omit<Activity, 'id'>) {
            try {
                await addDoc(collection(db, 'activities'), activity)

                // Real-time listener zaten state'i güncelleyecek

                return true
            } catch (error) {
                console.error('Etkinlik eklenirken hata:', error)
                return false
            }
        },

        // Etkinliği güncelle
        async updateActivity(id: string, updates: Partial<Activity>) {
            try {
                const activityRef = doc(db, 'activities', id)
                await updateDoc(activityRef, updates)

                // Real-time listener zaten state'i güncelleyecek

                return true
            } catch (error) {
                console.error('Etkinlik güncellenirken hata:', error)
                return false
            }
        },

        // Etkinliği sil
        async deleteActivity(id: string) {
            try {
                await deleteDoc(doc(db, 'activities', id))

                // Real-time listener zaten state'i güncelleyecek

                return true
            } catch (error) {
                console.error('Etkinlik silinirken hata:', error)
                return false
            }
        },

        // LocalStorage metodları artık kullanılmıyor (Firebase kullanıyoruz)
        saveActivities() {
            // Firebase kullanıldığı için bu metod artık boş
        },

        // Real-time listener'ı kur
        setupRealtimeListener() {
            // Eğer zaten listener varsa, önce temizle
            this.cleanupListeners()

            // Activities listener
            const activitiesRef = collection(db, 'activities')
            const unsubActivities = onSnapshot(activitiesRef, async (snapshot) => {
                this.activities = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Activity))

                // Eğer hiç etkinlik yoksa, varsayılan etkinlikleri ekle
                if (this.activities.length === 0) {
                    await this.addDefaultActivities()
                }
            }, (error) => {
                console.error('Activities real-time listener hatası:', error)
            })

            // Unsubscribe fonksiyonunu sakla
            this.unsubscribers = [unsubActivities]
        },

        // Listener'ları temizle
        cleanupListeners() {
            this.unsubscribers.forEach(unsub => unsub())
            this.unsubscribers = []
        },
    },
})