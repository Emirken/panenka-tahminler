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
              Anasayfa
            </router-link>
            <router-link
                to="/editor-tahminleri"
                class="nav-link"
                :class="{ 'active': $route.name === 'editorPredictions' }"
            >
              Editör Tahminleri
            </router-link>
            <router-link
                to="/oku"
                class="nav-link"
                :class="{ 'active': $route.name === 'read' }"
            >
              Oku
            </router-link>
            <router-link
                to="/amacimiz"
                class="nav-link"
                :class="{ 'active': $route.name === 'purpose' }"
            >
              Amacımız
            </router-link>
          </div>

          <!-- Right Section -->
          <div class="d-flex align-center" style="gap: 16px;">
            <!-- User Section - Sadece giriş yapıldıysa göster -->
            <div v-if="authStore.isAuthenticated" class="hidden-sm-and-down">
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn
                      variant="text"
                      class="user-btn"
                      v-bind="props"
                  >
                    <v-icon class="mr-1" color="white">mdi-account-circle</v-icon>
                    <span>{{ authStore.user?.username }}</span>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="navigateToAdmin" style="cursor: pointer;">
                    <template v-slot:prepend>
                      <v-icon>mdi-shield-account</v-icon>
                    </template>
                    <v-list-item-title>Admin Panel</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="logout" style="cursor: pointer;">
                    <template v-slot:prepend>
                      <v-icon>mdi-logout</v-icon>
                    </template>
                    <v-list-item-title>Çıkış Yap</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>

            <!-- Mobile Menu Button -->
            <v-btn
                icon
                variant="text"
                class="hidden-md-and-up"
                @click="mobileMenuOpen = !mobileMenuOpen"
            >
              <v-icon color="white">mdi-menu</v-icon>
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
              to="/oku"
              class="mobile-link"
              :class="{ 'active': $route.name === 'read' }"
              @click="mobileMenuOpen = false"
          >
            Oku
          </router-link>
          <router-link
              to="/amacimiz"
              class="mobile-link"
              :class="{ 'active': $route.name === 'purpose' }"
              @click="mobileMenuOpen = false"
          >
            Amacımız
          </router-link>

          <!-- Mobil için kullanıcı menüsü - Sadece giriş yapıldıysa -->
          <template v-if="authStore.isAuthenticated">
            <v-divider class="my-2" />

            <div class="mobile-user">
              <div class="mobile-link" @click="navigateToAdmin">
                <v-icon size="16" class="mr-2">mdi-shield-account</v-icon>
                Admin Panel
              </div>
              <div class="mobile-link" @click="logout">
                <v-icon size="16" class="mr-2">mdi-logout</v-icon>
                Çıkış Yap
              </div>
            </div>
          </template>
        </div>
      </v-container>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const authStore = useAuthStore()
const mobileMenuOpen = ref(false)

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
  // Yukarıdan aşağıya doğru saydamlaşan gradient
  background: linear-gradient(
          to bottom,
          rgba(0, 0, 0, 0.85) 0%,
          rgba(0, 0, 0, 0.75) 50%,
          rgba(0, 0, 0, 0.5) 100%
  );
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 0;
  z-index: 1000; // Yüksek z-index ile her zaman en üstte
}

.nav-wrapper {
  .logo-link {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }

    .logo-img {
      height: 60px;
      width: 60px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(255, 152, 0, 0.3);
    }

    .logo-text {
      font-size: 1.5rem; // Daha büyük
      font-weight: 800;
      color: #FF9800;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
  }

  .nav-links {
    gap: 40px; // Daha geniş aralık

    .nav-link {
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      font-weight: 600;
      font-size: 1.125rem; // Daha büyük yazı
      transition: all 0.3s ease;
      padding: 8px 16px;
      border-radius: 8px;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 3px;
        background: #FF9800;
        transition: width 0.3s ease;
      }

      &:hover {
        color: #FF9800;
        background-color: rgba(255, 152, 0, 0.1);

        &::after {
          width: 80%;
        }
      }

      &.active {
        color: #FF9800;
        font-weight: 700;
        background-color: rgba(255, 152, 0, 0.15);

        &::after {
          width: 80%;
        }
      }
    }
  }

  .theme-toggle {
    color: rgba(255, 255, 255, 0.9);
    transition: all 0.3s ease;

    &:hover {
      background-color: rgba(255, 152, 0, 0.2);
      transform: rotate(20deg);
    }
  }

  .user-btn {
    color: rgba(255, 255, 255, 0.9);
    text-transform: none;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
      color: #FF9800;
      background-color: rgba(255, 152, 0, 0.1);
    }
  }

  .theme-toggle {
    color: rgba(255, 255, 255, 0.9);
    transition: all 0.3s ease;

    &:hover {
      background-color: rgba(255, 152, 0, 0.2);
      transform: rotate(20deg);
    }
  }

  .user-btn {
    color: rgba(255, 255, 255, 0.9);
    text-transform: none;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
      color: #FF9800;
      background-color: rgba(255, 152, 0, 0.1);
    }
  }

  .mobile-menu {
    background: rgba(0, 0, 0, 0.95);
    border-radius: 12px;
    padding: 16px;
    backdrop-filter: blur(10px);

    .mobile-link {
      display: block;
      padding: 14px 20px;
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      border-radius: 8px;
      margin-bottom: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 600;
      font-size: 1.05rem;

      &:hover {
        background-color: rgba(255, 152, 0, 0.2);
        color: #FF9800;
        transform: translateX(8px);
      }

      &.active {
        color: #FF9800;
        font-weight: 700;
        background-color: rgba(255, 152, 0, 0.25);
      }
    }
  }
}

// Responsive
@media (max-width: 960px) {
  .nav-wrapper {
    .logo-link {
      .logo-img {
        height: 50px;
        width: 50px;
      }

      .logo-text {
        font-size: 1.25rem;
      }
    }
  }
}
</style>