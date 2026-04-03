<template>
  <v-container>

    <!-- PROFILE INFO -->
    <ProfileInfo @edit="openEdit" />

    <!-- EDIT PROFILE FORM -->
    <div v-if="showProfileForm" class="mt-4">
      <v-alert
        v-if="profileError"
        type="error"
        class="mb-4"
        rounded="lg"
        variant="tonal"
        closable
        @click:close="profileError = ''"
      >
        {{ profileError }}
      </v-alert>

      <ProfileForm
        :loading="profileLoading"
        @save="handleProfileSave"
        @cancel="closeProfileForm"
      />
    </div>

    <!-- ACTION BAR -->
    <v-card class="pa-4 mt-4" rounded="xl" border elevation="0">
      <div class="d-flex justify-space-between align-center">

        <div>
          <div class="text-h6 font-weight-bold">
            Security
          </div>
          <div class="text-body-2 text-medium-emphasis">
            Manage your password
          </div>
        </div>

        <v-btn
          color="primary"
          variant="tonal"
          class="text-none"
          prepend-icon="mdi-lock-reset"
          @click="openPasswordForm"
        >
          Change Password
        </v-btn>

      </div>
    </v-card>

    <!-- PASSWORD FORM -->
    <div v-if="showPasswordForm" class="mt-6">
      <v-alert
        v-if="passwordError"
        type="error"
        class="mb-4"
        rounded="lg"
        variant="tonal"
        closable
        @click:close="passwordError = ''"
      >
        {{ passwordError }}
      </v-alert>

      <PasswordForm
        :loading="loading"
        @cancel="closePasswordForm"
        @change="handlePasswordChange"
        ref="passwordFormRef"
      />
    </div>

  </v-container>
</template>

<script setup lang="ts">
import type { User } from '~/shared/types/user'
import ProfileInfo from '~/components/profile/ProfileInfo.vue'
import ProfileForm from '~/components/profile/ProfileForm.vue'
import PasswordForm from '~/components/profile/PasswordForm.vue'

definePageMeta({ middleware: 'auth' })

const authStore = useAuthStore()

const showProfileForm = ref(false)
const profileLoading = ref(false)
const profileError = ref('')

const showPasswordForm = ref(false)
const loading = ref(false)
const passwordError = ref('')
const passwordFormRef = ref()

const openEdit = () => {
  profileError.value = ''
  showPasswordForm.value = false
  passwordFormRef.value?.reset?.()
  showProfileForm.value = true
}

const closeProfileForm = () => {
  profileError.value = ''
  showProfileForm.value = false
}

const handleProfileSave = async (payload: Partial<User>) => {
  profileLoading.value = true
  profileError.value = ''

  try {
    const result = await authStore.updateProfile(payload)

    if (result.success) {
      showProfileForm.value = false
    }
    else {
      profileError.value = result.message
    }
  }
  finally {
    profileLoading.value = false
  }
}

const openPasswordForm = () => {
  passwordError.value = ''
  showProfileForm.value = false
  showPasswordForm.value = true
}

const closePasswordForm = () => {
  passwordError.value = ''
  showPasswordForm.value = false
  passwordFormRef.value?.reset()
}

const handlePasswordChange = async (payload: {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}) => {
  loading.value = true
  passwordError.value = ''

  try {
    const result = await authStore.changePassword({
      currentPassword: payload.currentPassword,
      newPassword: payload.newPassword,
    })

    if (result.success) {
      showPasswordForm.value = false
      passwordFormRef.value?.reset()
    }
    else {
      passwordError.value = result.message
    }
  }
  finally {
    loading.value = false
  }
}
</script>