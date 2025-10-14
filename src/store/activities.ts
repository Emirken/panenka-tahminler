import { defineStore } from 'pinia'
import { Activity } from '@/types'

interface ActivitiesState {
    activities: Activity[]
}

export const useActivitiesStore = defineStore('activities', {
    state: (): ActivitiesState => ({
        activities: [
            {
                id: '1',
                icon: 'mdi-trophy',
                title: 'Haftanın Lideri',
                description: 'Haftalık tahmin yarışmamızda en yüksek puanı toplayan üyemiz, sürpriz ödüllerin sahibi oluyor.',
            },
            {
                id: '2',
                icon: 'mdi-account-group',
                title: 'Editörle Söyleşi',
                description: 'Aylık canlı yayınlarımızda uzman editörlerimiz bir araya gelip, maçları tartışın.',
            },
            {
                id: '3',
                icon: 'mdi-image',
                title: 'Özel Kupon Çekilişleri',
                description: 'Sadece abonelere özel, yüksek oranlı sürpriz kuponlar ve hediye abonelik çekilişleri.',
            },
        ],
    }),

    getters: {
        allActivities: (state) => state.activities,
    },

    actions: {
        addActivity(activity: Omit<Activity, 'id'>) {
            const newActivity: Activity = {
                ...activity,
                id: Date.now().toString(),
            }
            this.activities.push(newActivity)
            this.saveActivities()
        },

        updateActivity(id: string, updates: Partial<Activity>) {
            const index = this.activities.findIndex((a:any) => a.id === id)
            if (index !== -1) {
                this.activities[index] = { ...this.activities[index], ...updates }
                this.saveActivities()
            }
        },

        deleteActivity(id: string) {
            this.activities = this.activities.filter((a:any) => a.id !== id)
            this.saveActivities()
        },

        saveActivities() {
            localStorage.setItem('activities', JSON.stringify(this.activities))
        },

        loadActivities() {
            const stored = localStorage.getItem('activities')
            if (stored) {
                this.activities = JSON.parse(stored)
            }
        },
    },
})