<template>
  <v-card elevation="2" class="activity-manager-card">
    <v-card-title class="bg-primary text-white pa-4 d-flex justify-space-between align-center">
      <div>
        <v-icon class="mr-2">mdi-calendar-star</v-icon>
        <span class="text-h6">Etkinlikler Yönetimi</span>
      </div>
      <v-btn
          color="white"
          variant="text"
          prepend-icon="mdi-plus"
          @click="showAddDialog = true"
      >
        Yeni Ekle
      </v-btn>
    </v-card-title>

    <v-card-text class="pa-6">
      <!-- Empty State -->
      <div v-if="activities.length === 0" class="empty-state">
        <v-icon size="80" color="grey-lighten-2">mdi-calendar-remove</v-icon>
        <p class="text-h6 text-grey mt-4">Henüz etkinlik eklenmemiş</p>
        <v-btn color="primary" class="mt-4" @click="showAddDialog = true">
          İlk Etkinliği Ekle
        </v-btn>
      </div>

      <!-- Activities List -->
      <v-list v-else>
        <v-list-item
            v-for="activity in activities"
            :key="activity.id"
            class="activity-item mb-4"
        >
          <template v-slot:prepend>
            <v-avatar color="primary" size="56">
              <v-icon color="white" size="28">{{ activity.icon }}</v-icon>
            </v-avatar>
          </template>

          <v-list-item-title class="font-weight-bold mb-2">
            {{ activity.title }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-wrap">
            {{ activity.description }}
          </v-list-item-subtitle>

          <template v-slot:append>
            <div class="d-flex flex-column ga-2">
              <v-btn
                  icon
                  size="small"
                  color="info"
                  @click="handleEdit(activity)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                  icon
                  size="small"
                  color="error"
                  @click="handleDelete(activity.id)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>

    <!-- Add/Edit Activity Dialog -->
    <v-dialog v-model="showAddDialog" max-width="600" persistent>
      <v-card>
        <v-card-title class="bg-primary text-white pa-4">
          {{ editingActivity ? 'Etkinliği Düzenle' : 'Yeni Etkinlik Ekle' }}
        </v-card-title>
        <v-card-text class="pa-6">
          <v-form ref="formRef">
            <v-text-field
                v-model="activityForm.icon"
                label="İkon (Material Design Icon)"
                prepend-inner-icon="mdi-star"
                variant="outlined"
                placeholder="mdi-trophy"
                class="mb-4"
                hint="Örnek: mdi-trophy, mdi-account-group, mdi-gift"
                persistent-hint
            />
            <v-text-field
                v-model="activityForm.title"
                label="Başlık"
                prepend-inner-icon="mdi-format-title"
                variant="outlined"
                class="mb-4"
            />
            <v-textarea
                v-model="activityForm.description"
                label="Açıklama"
                prepend-inner-icon="mdi-text"
                variant="outlined"
                rows="4"
            />

            <!-- Preview -->
            <v-card variant="outlined" class="mt-4 pa-4" v-if="activityForm.icon">
              <p class="text-caption text-grey text-center mb-2">Önizleme</p>
              <div class="text-center">
                <v-avatar size="60" color="primary" class="mb-2">
                  <v-icon size="30" color="white">{{ activityForm.icon }}</v-icon>
                </v-avatar>
                <p class="font-weight-bold">{{ activityForm.title || 'Başlık' }}</p>
                <p class="text-caption text-grey">{{ activityForm.description || 'Açıklama' }}</p>
              </div>
            </v-card>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn @click="closeDialog">İptal</v-btn>
          <v-btn color="primary" @click="handleSave">
            {{ editingActivity ? 'Güncelle' : 'Kaydet' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Etkinliği Sil</v-card-title>
        <v-card-text>
          Bu etkinliği silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showDeleteDialog = false">İptal</v-btn>
          <v-btn color="error" @click="confirmDelete">Sil</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Activity } from '@/types'

interface Props {
  activities: Activity[]
}

interface Emits {
  (e: 'add', activity: Omit<Activity, 'id'>): void
  (e: 'edit', id: string, activity: Partial<Activity>): void
  (e: 'delete', id: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formRef = ref()
const showAddDialog = ref(false)
const showDeleteDialog = ref(false)
const editingActivity = ref<Activity | null>(null)
const deletingActivityId = ref<string | null>(null)

const activityForm = ref({
  icon: '',
  title: '',
  description: '',
})

const handleEdit = (activity: Activity) => {
  editingActivity.value = activity
  activityForm.value = {
    icon: activity.icon,
    title: activity.title,
    description: activity.description,
  }
  showAddDialog.value = true
}

const handleDelete = (id: string) => {
  deletingActivityId.value = id
  showDeleteDialog.value = true
}

const confirmDelete = () => {
  if (deletingActivityId.value) {
    emit('delete', deletingActivityId.value)
    showDeleteDialog.value = false
    deletingActivityId.value = null
  }
}

const handleSave = () => {
  if (editingActivity.value) {
    // Edit mode
    emit('edit', editingActivity.value.id, {
      icon: activityForm.value.icon,
      title: activityForm.value.title,
      description: activityForm.value.description,
    })
  } else {
    // Add mode
    emit('add', {
      icon: activityForm.value.icon,
      title: activityForm.value.title,
      description: activityForm.value.description,
    })
  }
  closeDialog()
}

const closeDialog = () => {
  showAddDialog.value = false
  editingActivity.value = null
  activityForm.value = {
    icon: '',
    title: '',
    description: '',
  }
  formRef.value?.reset()
}
</script>

<style scoped lang="scss">
.activity-manager-card {
  border-radius: 12px !important;

  .empty-state {
    text-align: center;
    padding: 60px 20px;
  }

  .activity-item {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 16px;
    transition: all 0.3s ease;

    &:hover {
      background-color: rgba(255, 152, 0, 0.05);
      border-color: #FF9800;
    }
  }
}
</style>