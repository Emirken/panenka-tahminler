<template>
  <v-card elevation="8" class="login-card">
    <v-card-title class="text-h5 text-center bg-primary text-white pa-6">
      <v-icon size="40" class="mb-2">mdi-shield-account</v-icon>
      <div>Admin Girişi</div>
    </v-card-title>

    <v-card-text class="pa-8">
      <v-form ref="formRef" @submit.prevent="handleLogin">
        <v-text-field
            v-model="formData.username"
            label="Kullanıcı Adı"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            class="mb-4"
            :rules="[rules.required]"
            :error-messages="errorMessage"
        />

        <v-text-field
            v-model="formData.password"
            label="Şifre"
            :type="showPassword ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
            variant="outlined"
            :rules="[rules.required]"
            :error-messages="errorMessage"
        />

        <v-alert v-if="errorMessage" type="error" class="mt-4 mb-4">
          {{ errorMessage }}
        </v-alert>

        <v-btn
            type="submit"
            block
            color="primary"
            size="large"
            :loading="loading"
            class="mt-4"
        >
          Giriş Yap
        </v-btn>
      </v-form>

      <!-- Demo Credentials Info -->
      <v-expansion-panels class="mt-6">
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon class="mr-2">mdi-information</v-icon>
            Demo Kullanıcılar
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div class="demo-users">
              <div class="demo-user">
                <strong>Emircan:</strong> emircan / emircan123
              </div>
              <div class="demo-user">
                <strong>Berke:</strong> berke / berke123
              </div>
              <div class="demo-user">
                <strong>Erman:</strong> erman / erman123
              </div>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LoginCredentials } from '@/types'

interface Emits {
  (e: 'submit', credentials: LoginCredentials): void
  (e: 'error', message: string): void
}

const emit = defineEmits<Emits>()

const formRef = ref()
const loading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

const formData = ref<LoginCredentials>({
  username: '',
  password: '',
})

const rules = {
  required: (value: string) => !!value || 'Bu alan zorunludur',
}

const handleLogin = async () => {
  const { valid } = await formRef.value.validate()

  if (valid) {
    loading.value = true
    errorMessage.value = ''

    emit('submit', {
      username: formData.value.username,
      password: formData.value.password,
    })

    // Reset loading after a delay
    setTimeout(() => {
      loading.value = false
    }, 1000)
  }
}

defineExpose({
  setError: (message: string) => {
    errorMessage.value = message
  },
})
</script>

<style scoped lang="scss">
.login-card {
  max-width: 450px;
  margin: 0 auto;
  border-radius: 16px !important;

  .demo-users {
    .demo-user {
      padding: 8px 0;
      font-size: 0.875rem;
      color: #666;

      strong {
        color: #FF9800;
      }
    }
  }
}
</style>