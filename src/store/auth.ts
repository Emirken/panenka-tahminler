// src/store/auth.ts - Firebase Authentication ile güncellenmiş versiyon

import { defineStore } from 'pinia'
import { User, LoginCredentials } from '@/types'
import { signInAnonymously } from 'firebase/auth'
import { auth } from '@/firebase/config'

interface AuthState {
    user: User | null
    isAuthenticated: boolean
}

// Demo kullanıcılar - Kullanıcı adı ve şifre kontrolü için
const DEMO_USERS = [
    { id: '1', username: 'Emirken', password: 'Chrollolucifer_35', role: 'editor' as const, fullName: 'Emircan Adak' },
    { id: '2', username: 'Bkatksz', password: 'Yanlışifre0802.', role: 'editor' as const, fullName: 'Berke Katıksız' },
    { id: '3', username: 'Erman93', password: 'V1234567.', role: 'editor' as const, fullName: 'Erman Şener' },
]

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
        isAuthenticated: false,
    }),

    getters: {
        currentUser: (state) => state.user,
        isEditor: (state) => state.user?.role === 'editor',
    },

    actions: {
        async login(credentials: LoginCredentials): Promise<boolean> {
            try {
                // Demo kullanıcı kontrolü
                const user = DEMO_USERS.find(
                    u => u.username === credentials.username && u.password === credentials.password
                )

                if (user) {
                    // Firebase Anonymous Authentication
                    // Bu sayede Firestore'a yazma yetkisi kazanırız
                    await signInAnonymously(auth)

                    this.user = {
                        id: user.id,
                        username: user.username,
                        role: user.role,
                        fullName: user.fullName,
                    } as User

                    this.isAuthenticated = true

                    // Session için localStorage'a kaydet
                    localStorage.setItem('authUser', JSON.stringify(this.user))

                    return true
                }

                return false
            } catch (error) {
                console.error('Login hatası:', error)
                return false
            }
        },

        logout() {
            this.user = null
            this.isAuthenticated = false
            localStorage.removeItem('authUser')

            // Firebase'den çıkış
            auth.signOut()
        },

        checkAuth() {
            const storedUser = localStorage.getItem('authUser')
            if (storedUser) {
                this.user = JSON.parse(storedUser)
                this.isAuthenticated = true

                // Firebase session'ı yeniden başlat
                signInAnonymously(auth).catch(err => {
                    console.error('Firebase auth yenileme hatası:', err)
                })
            }
        },
    },
})