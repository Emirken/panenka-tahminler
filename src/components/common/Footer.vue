<template>
  <footer class="app-footer">
    <v-container>
      <v-row align="center">
        <v-col cols="12" md="4">
          <div class="d-flex align-center mb-4 mb-md-0 justify-center justify-md-start">
            <v-avatar size="32" color="white" class="mr-3">
              <v-icon color="primary" size="20">mdi-soccer</v-icon>
            </v-avatar>
            <span class="text-h6 font-weight-bold">Panenka Tahminler</span>
          </div>
        </v-col>

        <v-col cols="12" md="4" class="text-center">
          <v-btn
              icon
              variant="text"
              size="small"
              color="white"
              href="https://instagram.com"
              target="_blank"
          >
            <v-icon>mdi-instagram</v-icon>
          </v-btn>
        </v-col>

        <v-col cols="12" md="4" class="text-center text-md-right">
          <span class="text-body-2">© 2025 Panenka Tahminler. Tüm hakları saklıdır.</span>
        </v-col>
      </v-row>
    </v-container>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.app-footer {
  background-color: #2b3dc4 !important;
  color: white;
  margin-top: auto;
  width: 100%;
  padding: 32px 0;
  box-shadow: 0 -2px 12px rgba(43, 61, 196, 0.2);

  // Mobil düzenlemeler
  @media (max-width: 960px) {
    padding: 24px 0;

    .text-h6 {
      font-size: 1rem !important;
    }

    .text-body-2 {
      font-size: 0.75rem !important;
    }
  }

  // Çok küçük ekranlar
  @media (max-width: 600px) {
    padding: 20px 0;

    .v-avatar {
      width: 28px !important;
      height: 28px !important;

      .v-icon {
        font-size: 16px !important;
      }
    }

    .text-h6 {
      font-size: 0.875rem !important;
    }
  }

  .v-btn {
    transition: all 0.3s ease;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      transform: scale(1.1);
    }
  }
}
</style>