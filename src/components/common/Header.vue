<template>
  <header class="header-container">
    <nav class="nav-wrapper">
      <v-container fluid class="px-4 px-md-6 py-3 py-md-4">
        <div class="d-flex align-center justify-space-between">
          <!-- Logo Section -->
          <div class="d-flex align-center">
            <router-link to="/" class="logo-link">
              <img
                  src="/panenkaDeneme.svg"
                  class="logo-img"
              />
              <span class="logo-text">Panenka Tahminler</span>
            </router-link>
          </div>

          <!-- Desktop Navigation - SADECE DESKTOP -->
          <div class="d-none d-lg-flex align-center nav-links">
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
<!--            <router-link
                to="/puan-tablosu"
                class="nav-link"
                :class="{ 'active': $route.name === 'standings' }"
            >
              Puan Tablosu
            </router-link>-->
            <router-link
                to="/oku"
                class="nav-link"
                :class="{ 'active': $route.name === 'read' }"
            >
              Mutlaka Oku
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
            <!-- User Section - SADECE DESKTOP -->
            <div v-if="authStore.isAuthenticated" class="d-none d-lg-block">
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn
                      variant="text"
                      class="user-btn"
                      v-bind="props"
                  >
                    <v-icon class="mr-1" color="white">mdi-account-circle</v-icon>
                    <span>{{ authStore.user?.fullName }}</span>
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

            <!-- Mobile Menu Button - SADECE MOBİL -->
            <v-btn
                icon
                variant="text"
                class="d-lg-none mobile-menu-btn"
                @click="mobileMenuOpen = !mobileMenuOpen"
            >
              <v-icon color="white" size="28">{{ mobileMenuOpen ? 'mdi-close' : 'mdi-menu' }}</v-icon>
            </v-btn>
          </div>
        </div>

        <!-- Mobile Menu - SADECE MOBİL -->
        <transition name="slide-fade">
          <div v-if="mobileMenuOpen" class="mobile-menu d-lg-none mt-4">
            <router-link
                to="/"
                class="mobile-link"
                :class="{ 'active': $route.name === 'home' }"
                @click="mobileMenuOpen = false"
            >
              <v-icon size="20" class="mr-2">mdi-home</v-icon>
              Anasayfa
            </router-link>
            <router-link
                to="/editor-tahminleri"
                class="mobile-link"
                :class="{ 'active': $route.name === 'editorPredictions' }"
                @click="mobileMenuOpen = false"
            >
              <v-icon size="20" class="mr-2">mdi-account-group</v-icon>
              Editör Tahminleri
            </router-link>
<!--            <router-link
                to="/puan-tablosu"
                class="mobile-link"
                :class="{ 'active': $route.name === 'standings' }"
                @click="mobileMenuOpen = false"
            >
              <v-icon size="20" class="mr-2">mdi-table</v-icon>
              Puan Tablosu
            </router-link>-->
            <router-link
                to="/oku"
                class="mobile-link"
                :class="{ 'active': $route.name === 'read' }"
                @click="mobileMenuOpen = false"
            >
              <v-icon size="20" class="mr-2">mdi-book-open-page-variant</v-icon>
              Mutlaka Oku
            </router-link>
            <router-link
                to="/amacimiz"
                class="mobile-link"
                :class="{ 'active': $route.name === 'purpose' }"
                @click="mobileMenuOpen = false"
            >
              <v-icon size="20" class="mr-2">mdi-target</v-icon>
              Amacımız
            </router-link>

            <!-- Mobil için kullanıcı menüsü -->
            <template v-if="authStore.isAuthenticated">
              <v-divider class="my-2 mobile-divider" />

              <div class="mobile-user">
                <div class="mobile-link" @click="navigateToAdmin">
                  <v-icon size="20" class="mr-2">mdi-shield-account</v-icon>
                  Admin Panel
                </div>
                <div class="mobile-link" @click="logout">
                  <v-icon size="20" class="mr-2">mdi-logout</v-icon>
                  Çıkış Yap
                </div>
              </div>
            </template>
          </div>
        </transition>
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
  background: #2b3dc4;
  box-shadow: 0 2px 12px rgba(43, 61, 196, 0.3);
  position: sticky;
  top: 0;
  z-index: 1000;
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

      @media (max-width: 600px) {
        height: 45px;
        width: 45px;
      }
    }

    .logo-text {
      font-size: 1.5rem;
      font-weight: 800;
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

      @media (max-width: 960px) {
        font-size: 1.25rem;
      }

      @media (max-width: 600px) {
        font-size: 1rem;
      }
    }
  }

  .nav-links {
    gap: 40px;

    .nav-link {
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      font-weight: 600;
      font-size: 1.125rem;
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
        background: white;
        transition: width 0.3s ease;
      }

      &:hover {
        color: white;
        background-color: rgba(255, 255, 255, 0.1);

        &::after {
          width: 80%;
        }
      }

      &.active {
        color: white;
        font-weight: 700;
        background-color: rgba(255, 255, 255, 0.15);

        &::after {
          width: 80%;
        }
      }
    }
  }

  .mobile-menu-btn {
    transition: all 0.3s ease;
    padding: 8px !important;

    .v-icon {
      transition: transform 0.3s ease;
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.2);

      .v-icon {
        transform: scale(1.1);
      }
    }

    &:active {
      transform: scale(0.95);
    }
  }

  .user-btn {
    color: rgba(255, 255, 255, 0.9);
    text-transform: none;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
      color: white;
      background-color: rgba(255, 255, 255, 0.1);
    }
  }

  .mobile-menu {
    background: rgba(43, 61, 196, 0.98);
    border-radius: 12px;
    padding: 12px;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);

    .mobile-divider {
      background-color: rgba(255, 255, 255, 0.3);
    }

    .mobile-link {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      border-radius: 8px;
      margin-bottom: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 600;
      font-size: 1rem;

      @media (max-width: 600px) {
        padding: 10px 12px;
        font-size: 0.9rem;
      }

      &:hover {
        background-color: rgba(255, 255, 255, 0.2);
        color: white;
        transform: translateX(8px);
      }

      &.active {
        color: white;
        font-weight: 700;
        background-color: rgba(255, 255, 255, 0.25);
      }
    }
  }
}

// Slide fade animation
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>