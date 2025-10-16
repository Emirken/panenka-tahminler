import { defineStore } from 'pinia'
import { User, LoginCredentials } from '@/types'

interface AuthState {
    user: User | null
    isAuthenticated: boolean
}

// Demo kullanıcılar - Gerçek projede backend API kullanılacak
const DEMO_USERS = [
    { id: '1', username: 'emircan', password: 'emircan123', role: 'editor' as const, fullName: 'Emircan Adak' },
    { id: '2', username: 'berke', password: 'berke123', role: 'editor' as const, fullName: 'Berke Katıksız' },
    { id: '3', username: 'erman', password: 'erman123', role: 'editor' as const, fullName: 'Erman Şener' },
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
            // Demo login - Gerçek projede backend API çağrısı yapılacak
            const user = DEMO_USERS.find(
                u => u.username === credentials.username && u.password === credentials.password
            )

            if (user) {
                this.user = {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    fullName: user.fullName,
                } as User
                this.isAuthenticated = true
                localStorage.setItem('authUser', JSON.stringify(this.user))
                return true
            }

            return false
        },

        logout() {
            this.user = null
            this.isAuthenticated = false
            localStorage.removeItem('authUser')
        },

        checkAuth() {
            const storedUser = localStorage.getItem('authUser')
            if (storedUser) {
                this.user = JSON.parse(storedUser)
                this.isAuthenticated = true
            }
        },
    },
})