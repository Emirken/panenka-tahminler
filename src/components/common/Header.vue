<template>
  <header class="header-container">
    <nav class="nav-wrapper">
      <v-container fluid class="px-6 py-4">
        <div class="d-flex align-center justify-space-between">
          <!-- Logo Section -->
          <div class="d-flex align-center">
            <router-link to="/" class="logo-link">
              <img
                  src="../../assets/panenka.png"
                  class="logo-img"
              />
              <span class="logo-text">Panenka Tahminler</span>
            </router-link>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden-sm-and-down d-flex align-center nav-links">
            <router-link
                to="/"
                class="nav-link"
                :class="{ 'active': $route.name === 'home' }"
            >
              <span style="color: #FF9800">Anasayfa</span>
            </router-link>
            <router-link
                to="/editor-tahminleri"
                class="nav-link"
                :class="{ 'active': $route.name === 'editorPredictions' }"
            >
              <span style="color: #FF9800">Editör Tahminleri</span>
            </router-link>
            <router-link
                to="/etkinliklerimiz"
                class="nav-link"
                :class="{ 'active': $route.name === 'activities' }"
            >
              <span style="color: #FF9800">Etkinliklerimiz</span>

            </router-link>
          </div>

          <!-- Right Section (Theme & User) -->
          <div class="d-flex align-center" style="gap: 16px;">
            <!-- Theme Toggle -->
            <v-btn
                icon
                variant="text"
                class="theme-toggle"
                @click="toggleTheme"
            >
              <v-icon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night' }}</v-icon>
            </v-btn>

            <!-- User Section -->
            <div v-if="authStore.isAuthenticated" class="hidden-sm-and-down">
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn
                      variant="text"
                      class="user-btn"
                      v-bind="props"
                  >
                    <v-icon class="mr-1">mdi-account-circle</v-icon>
                    <span>{{ authStore.user?.username }}</span>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="navigateToAdmin">
                    <v-list-item-title>Admin Panel</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="logout">
                    <v-list-item-title>Çıkış Yap</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>

            <v-btn
                v-else
                variant="text"
                class="user-btn hidden-sm-and-down"
                @click="showLoginDialog = true"
            >
              <v-icon class="mr-1">mdi-account-circle</v-icon>
              <span>Giriş Yap</span>
            </v-btn>

            <!-- Mobile Menu Button -->
            <v-btn
                icon
                variant="text"
                class="hidden-md-and-up"
                @click="mobileMenuOpen = !mobileMenuOpen"
            >
              <v-icon>mdi-menu</v-icon>
            </v-btn>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div v-if="mobileMenuOpen" class="mobile-menu hidden-md-and-up mt-4">
          <router-link
              to="/"
              class="mobile-link"
              :class="{ 'active': $route.name === 'home' }"
              @click="mobileMenuOpen = false"
          >
            Anasayfa
          </router-link>
          <router-link
              to="/editor-tahminleri"
              class="mobile-link"
              :class="{ 'active': $route.name === 'editorPredictions' }"
              @click="mobileMenuOpen = false"
          >
            Editör Tahminleri
          </router-link>
          <router-link
              to="/etkinliklerimiz"
              class="mobile-link"
              :class="{ 'active': $route.name === 'activities' }"
              @click="mobileMenuOpen = false"
          >
            Etkinliklerimiz
          </router-link>

          <v-divider class="my-2" />

          <div v-if="authStore.isAuthenticated" class="mobile-user">
            <div class="mobile-link" @click="navigateToAdmin">Admin Panel</div>
            <div class="mobile-link" @click="logout">Çıkış Yap</div>
          </div>
          <div v-else class="mobile-link" @click="showLoginDialog = true">
            Giriş Yap
          </div>
        </div>
      </v-container>
    </nav>
  </header>

  <!-- Login Dialog -->
  <v-dialog v-model="showLoginDialog" max-width="400">
    <v-card>
      <v-card-title class="text-h5 text-center bg-primary text-white pa-4">
        Giriş Yap
      </v-card-title>
      <v-card-text class="pa-6">
        <v-text-field
            v-model="loginForm.username"
            label="Kullanıcı Adı"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            class="mb-4"
        />
        <v-text-field
            v-model="loginForm.password"
            label="Şifre"
            type="password"
            prepend-inner-icon="mdi-lock"
            variant="outlined"
        />
        <v-alert v-if="loginError" type="error" class="mt-4">
          {{ loginError }}
        </v-alert>
      </v-card-text>
      <v-card-actions class="pa-6 pt-0">
        <v-spacer />
        <v-btn @click="showLoginDialog = false">İptal</v-btn>
        <v-btn color="primary" @click="handleLogin">Giriş Yap</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const authStore = useAuthStore()

const showLoginDialog = ref(false)
const mobileMenuOpen = ref(false)
const isDark = ref(false)

const loginForm = ref({
  username: '',
  password: '',
})
const loginError = ref('')

const toggleTheme = () => {
  isDark.value = !isDark.value
  // Theme toggle fonksiyonu buraya eklenecek
}

const handleLogin = async () => {
  loginError.value = ''
  const success = await authStore.login(loginForm.value)

  if (success) {
    showLoginDialog.value = false
    loginForm.value = { username: '', password: '' }
    router.push({ name: 'admin' })
  } else {
    loginError.value = 'Kullanıcı adı veya şifre hatalı!'
  }
}

const logout = () => {
  authStore.logout()
  mobileMenuOpen.value = false
  router.push({ name: 'home' })
}

const navigateToAdmin = () => {
  mobileMenuOpen.value = false
  router.push({ name: 'admin' })
}
</script>

<style scoped lang="scss">
.header-container {
  background-color: rgba(0, 0, 0, 0.42);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 50;
}

.nav-wrapper {
  .logo-link {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;

    .logo-img {
      height: 60px;
      width: 60px;
      border-radius: 8px;
    }

    .logo-text {
      font-size: 1.25rem;
      font-weight: 700;
      color: #FF9800;
    }
  }

  .nav-links {
    gap: 32px;

    .nav-link {
      color: #666;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
      padding: 8px 0;

      &:hover {
        color: #FF9800;
      }

      &.active {
        color: #FF9800;
        font-weight: 700;
      }
    }
  }

  .theme-toggle {
    color: #666;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }

  .user-btn {
    color: #666;
    text-transform: none;

    &:hover {
      color: #FF9800;
    }
  }

  .mobile-menu {
    .mobile-link {
      display: block;
      padding: 12px 16px;
      color: #666;
      text-decoration: none;
      border-radius: 8px;
      margin-bottom: 4px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }

      &.active {
        color: #FF9800;
        font-weight: 700;
        background-color: rgba(255, 152, 0, 0.1);
      }
    }
  }
}
</style>