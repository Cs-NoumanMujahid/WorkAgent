<template>
  <v-card rounded="xl" elevation="0" border class="pa-6">

    <!-- HEADER -->
    <div class="d-flex align-center justify-space-between mb-6">

      <div>
        <h2 class="text-h5 font-weight-bold mb-1">
          Profile Information
        </h2>

        <p class="text-body-2 text-medium-emphasis">
          Your public and account details
        </p>
      </div>

      <!-- ACTION BUTTONS -->
      <div class="d-flex align-center ga-2">

        <v-btn
          color="primary"
          variant="tonal"
          class="text-none"
          prepend-icon="mdi-pencil"
          @click="$emit('edit')"
        >
          Edit
        </v-btn>

      </div>

    </div>

    <!-- PROFILE HEADER -->
    <div class="d-flex align-center ga-5 mb-6">

      <v-avatar size="80" color="primary" rounded="lg">
        <v-img
          v-if="user?.avatar"
          :src="user.avatar"
          cover
        />

        <span v-else class="text-h4 font-weight-bold text-white">
          {{ initials }}
        </span>
      </v-avatar>

      <div>
        <h3 class="text-h6 font-weight-bold mb-1">
          {{ user?.fullName || 'Unknown User' }}
        </h3>

        <p class="text-body-2 text-medium-emphasis">
          {{ user?.email || 'No email available' }}
        </p>

        <div class="d-flex align-center ga-2 text-caption text-medium-emphasis mt-1">
          <v-icon size="16" icon="mdi-calendar-blank-outline" />
          <span>Member since {{ memberSince }}</span>
        </div>
      </div>

    </div>

    <!-- INFO GRID -->
    <v-row dense>

      <v-col cols="12" md="6">
        <div class="mb-4">
          <div class="d-flex align-center ga-2 text-caption text-medium-emphasis">
            <v-icon size="16" icon="mdi-phone-outline" />
            <span>Phone</span>
          </div>
          <div class="text-body-1">
            {{ user?.phone || 'Not provided' }}
          </div>
        </div>
      </v-col>

      <v-col cols="12">
        <div class="mb-2">
          <div class="d-flex align-center ga-2 text-caption text-medium-emphasis">
            <v-icon size="16" icon="mdi-text-account" />
            <span>Bio</span>
          </div>
          <div class="text-body-1">
            {{ user?.bio || 'No bio added yet.' }}
          </div>
        </div>
      </v-col>

    </v-row>

  </v-card>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

/* ---------------- EMITS ---------------- */

defineEmits<{
  (e: 'edit'): void
}>()

/* ---------------- INITIALS ---------------- */

const initials = computed(() => {
  const name = user.value?.fullName || ''
  if (!name) return '?'

  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const memberSince = computed(() => {
  const raw = user.value?.createdAt
  if (!raw) return '—'

  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: '2-digit' }).format(date)
})
</script>