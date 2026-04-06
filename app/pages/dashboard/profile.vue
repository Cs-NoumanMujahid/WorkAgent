<template>
  <v-container fluid class="pa-6">

    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-h3 font-weight-bold mb-2">My Profile</h1>
      <p class="text-body-1 text-medium-emphasis">
        Manage your personal information, security, and account preferences.
      </p>
    </div>

    <v-row>
      <v-col cols="12" xl="9">

        <!-- PROFILE INFO -->
        <ProfileInfo
          v-if="currentView === 'info'"
          @edit="currentView = 'edit'"
        />

        <!-- PROFILE EDIT -->
        <ProfileForm
          v-else-if="currentView === 'edit'"
          :loading="isUpdatingProfile"
          @save="handleUpdateProfile"
          @cancel="goToInfo"
        />

        <!-- PASSWORD CHANGE -->
        <PasswordForm
          v-else-if="currentView === 'password'"
          ref="passFormRef"
          :loading="isChangingPassword"
          @change="handleChangePassword"
          @cancel="goToInfo"
        />

        <!-- SECURITY (visible on all screen sizes) -->
        <v-card
          v-if="currentView !== 'password'"
          rounded="xl"
          elevation="0"
          border
          class="pa-6 mt-6"
        >
          <div class="d-flex align-center justify-space-between flex-wrap ga-4">
            <div>
              <div class="d-flex align-center ga-2">
                <v-icon icon="mdi-shield-lock-outline" color="primary" />
                <span class="text-h6 font-weight-bold">Security</span>
              </div>
              <div class="text-body-2 text-medium-emphasis">
                Update your password to keep your account secure.
              </div>
            </div>

            <v-btn
              color="primary"
              variant="tonal"
              class="text-none"
              prepend-icon="mdi-lock-reset"
              @click="openPasswordView"
            >
              Change Password
            </v-btn>
          </div>
        </v-card>

      </v-col>

      <!-- SIDE PANEL -->
      <v-col cols="12" xl="3" class="d-none d-xl-block">

        <v-card rounded="xl" elevation="0" border class="pa-6 sticky-top">

          <div class="text-subtitle-1 font-weight-bold mb-4">
            Account Overview
          </div>

          <div class="d-flex justify-space-between mb-2">
            <span class="text-body-2 text-medium-emphasis">Status</span>
            <v-chip size="x-small" color="success" variant="flat">
              Active
            </v-chip>
          </div>

          <div class="d-flex justify-space-between mb-2">
            <span class="text-body-2 text-medium-emphasis">Member Since</span>
            <span class="text-body-2 font-weight-medium">
              {{ formatDate(authStore.user?.createdAt) }}
            </span>
          </div>

          <div class="d-flex justify-space-between">
            <span class="text-body-2 text-medium-emphasis">Last Updated</span>
            <span class="text-body-2 font-weight-medium">
              {{ formatTime(authStore.user?.updatedAt) }}
            </span>
          </div>

          <v-divider class="my-6" />

          <div class="bg-primary-lighten-5 pa-4 rounded-lg">
            <div class="d-flex align-center ga-2 mb-2">
              <v-icon icon="mdi-shield-check" color="primary" />
              <span class="text-subtitle-2 font-weight-bold text-primary">
                Secure Account
              </span>
            </div>
            <p class="text-caption text-primary ma-0">
              Your profile is protected with modern security standards.
            </p>
          </div>

        </v-card>

      </v-col>
    </v-row>

    <!-- SNACKBAR -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      rounded="lg"
      location="top end"
    >
      {{ snackbar.text }}

      <template #actions>
        <v-btn variant="text" @click="snackbar.show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

  </v-container>
</template>

<script setup lang="ts">
import type { User, ChangePasswordPayload } from '~/shared/types/user'
import { nextTick } from 'vue'
import ProfileInfo from '~/components/profile/ProfileInfo.vue'
import ProfileForm from '~/components/profile/ProfileForm.vue'
import PasswordForm from '~/components/profile/PasswordForm.vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const authStore = useAuthStore()

type ProfileView = 'info' | 'edit' | 'password'
const currentView = ref<ProfileView>('info')

const isUpdatingProfile = ref(false)
const isChangingPassword = ref(false)

const passFormRef = ref<any>(null)

/* ---------------- SAFE VIEW SWITCH HELPERS ---------------- */

const goToInfo = () => {
  currentView.value = 'info'
}

const openPasswordView = () => {
  currentView.value = 'password'
  // if user clicks from bottom "Security" card, the form renders near top.
  // Scroll so it feels like the button "opened" something.
  nextTick(() => {
    if (import.meta.client) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  })
}

/* ---------------- SNACKBAR ---------------- */

const snackbar = reactive({
  show: false,
  text: '',
  color: 'success'
})

const showMessage = (text: string, color: string = 'success') => {
  snackbar.text = text
  snackbar.color = color
  snackbar.show = true
}

/* ---------------- PROFILE UPDATE ---------------- */

const handleUpdateProfile = async (data: Partial<User>) => {
  isUpdatingProfile.value = true

  try {
    const result = await authStore.updateProfile(data)

    if (result.success) {
      showMessage(result.message)
      goToInfo()
    } else {
      showMessage(result.message, 'error')
    }
  } catch {
    showMessage('Profile update failed.', 'error')
  } finally {
    isUpdatingProfile.value = false
  }
}

/* ---------------- PASSWORD CHANGE ---------------- */

const handleChangePassword = async (payload: ChangePasswordPayload) => {
  isChangingPassword.value = true

  try {
    const result = await authStore.changePassword(payload)

    if (result.success) {
      showMessage(result.message)

      // reset form safely
      passFormRef.value?.reset?.()

      goToInfo()
    } else {
      showMessage(result.message, 'error')
    }
  } catch {
    showMessage('Password change failed.', 'error')
  } finally {
    isChangingPassword.value = false
  }
}

/* ---------------- FORMATTING ---------------- */

const formatDate = (date?: string) => {
  if (!date) return '---'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatTime = (date?: string) => {
  if (!date) return '---'
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.sticky-top {
  position: sticky;
  top: 24px;
}

.bg-primary-lighten-5 {
  background-color: rgba(var(--v-theme-primary), 0.05);
}
</style>