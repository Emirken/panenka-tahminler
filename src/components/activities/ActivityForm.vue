<template>
  <v-card elevation="4">
    <v-card-title class="bg-primary text-white pa-4">
      <span class="text-h6">{{ isEdit ? 'Etkinliği Düzenle' : 'Yeni Etkinlik Ekle' }}</span>
    </v-card-title>

    <v-card-text class="pa-6">
      <v-form ref="formRef" @submit.prevent="handleSubmit">
        <v-row>
          <v-col cols="12">
            <v-text-field
                v-model="formData.icon"
                label="İkon (Material Design Icon)"
                placeholder="mdi-trophy"
                prepend-inner-icon="mdi-star"
                variant="outlined"
                :rules="[rules.required]"
                hint="Örnek: mdi-trophy, mdi-account-group, mdi-gift"
                persistent-hint
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
                v-model="formData.title"
                label="Etkinlik Başlığı"
                placeholder="Haftanın Lideri"
                prepend-inner-icon="mdi-format-title"
                variant="outlined"
                :rules="[rules.required]"
            />
          </v-col>

          <v-col cols="12">
            <v-textarea
                v-model="formData.description"
                label="Açıklama"
                placeholder="Etkinlik açıklamasını buraya yazın..."
                prepend-inner-icon="mdi-text"
                variant="outlined"
                rows="4"
                :rules="[rules.required]"
            />
          </v-col>

          <!-- Icon Preview -->
          <v-col cols="12" v-if="formData.icon">
            <v-card variant="outlined" class="pa-4">
              <div class="text-center">
                <p class="text-caption text-grey mb-2">Önizleme</p>
                <v-avatar size="60" color="primary" class="mb-2">
                  <v-icon size="30" color="white">{{ formData.icon }}</v-icon>
                </v-avatar>
                <p class="text-body-2 font-weight-bold">{{ formData.title || 'Başlık' }}</p>
                <p class="text-caption text-grey">{{ formData.description || 'Açıklama' }}</p>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <v-card-actions class="pa-6 pt-0">
      <v-spacer />
      <v-btn @click="handleCancel" variant="text">
        İptal
      </v-btn>
      <v-btn
          color="primary"
          @click="handleSubmit"
          :loading="loading"
      >
        {{ isEdit ? 'Güncelle' : 'Kaydet' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Activity } from '@/types'

interface Props {
  activity?: Activity | null
  isEdit?: boolean
}

interface Emits {
  (e: 'submit', data: Omit<Activity, 'id'>): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  activity: null,
  isEdit: false,
})

const emit = defineEmits<Emits>()

const formRef = ref()
const loading = ref(false)

const formData = ref({
  icon: '',
  title: '',
  description: '',
})

// Validation rules
const rules = {
  required: (value: string) => !!value || 'Bu alan zorunludur',
}

// Watch for activity changes (for edit mode)
watch(
    () => props.activity,
    (newActivity) => {
      if (newActivity) {
        formData.value = {
          icon: newActivity.icon,
          title: newActivity.title,
          description: newActivity.description,
        }
      }
    },
    { immediate: true }
)

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate()

  if (valid) {
    loading.value = true

    // Simulate API call
    setTimeout(() => {
      emit('submit', {
        icon: formData.value.icon,
        title: formData.value.title,
        description: formData.value.description,
      })

      loading.value = false
      resetForm()
    }, 500)
  }
}

const handleCancel = () => {
  resetForm()
  emit('cancel')
}

const resetForm = () => {
  formData.value = {
    icon: '',
    title: '',
    description: '',
  }
  formRef.value?.reset()
}
</script>

<style scoped lang="scss">
.v-card {
  border-radius: 12px !important;
}
</style>