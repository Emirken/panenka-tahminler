<template>
  <footer class="app-footer">
    <v-container>
      <v-row align="center">
        <v-col cols="12" md="6">
          <div class="d-flex align-center mb-4 mb-md-0">
            <v-avatar size="32" color="primary" class="mr-3">
              <v-icon color="white" size="20">mdi-soccer</v-icon>
            </v-avatar>
            <span class="text-h6 font-weight-bold">Panenka Tahminler</span>
          </div>
        </v-col>

        <v-col cols="12" md="6" class="text-center text-md-right">
          <span class="text-body-2">© 2023 Panenka Tahminler. Tüm hakları saklıdır.</span>
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12" class="text-center">
          <v-btn
              icon
              variant="text"
              size="small"
              color="white"
              href="https://facebook.com"
              target="_blank"
              class="mx-2"
          >
            <v-icon>mdi-facebook</v-icon>
          </v-btn>
          <v-btn
              icon
              variant="text"
              size="small"
              color="white"
              href="https://twitter.com"
              target="_blank"
              class="mx-2"
          >
            <v-icon>mdi-twitter</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.app-footer {
  background-color: #2C3E50 !important;
  color: white;
  margin-top: auto;
}
</style>