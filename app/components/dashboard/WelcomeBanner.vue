<template>
  <v-card rounded="xl" elevation="0" class="mb-6 pa-2" color="primary">
    <v-card-text class="d-flex align-center justify-space-between flex-wrap ga-4">
      <div>
        <h2 class="text-h5 font-weight-bold text-white mb-1">
          Welcome back, {{ authStore.user?.fullName }} 👋
        </h2>
        <p class="text-body-2 text-white ma-0" style="opacity: 0.85;">
          Here's what's happening with your tasks today.
        </p>
      </div>

      <!-- Quick Actions -->
      <div class="d-flex ga-2 flex-wrap">
        <v-btn
          variant="elevated"
          color="white"
          rounded="lg"
          prepend-icon="mdi-plus"
          to="/tasks/create"
          class="text-none text-primary font-weight-bold"
        >
          New Task
        </v-btn>
        <v-btn
          variant="outlined"
          rounded="lg"
          prepend-icon="mdi-format-list-bulleted"
          to="/tasks"
          class="text-none text-white font-weight-bold"
          style="border-color: rgba(255,255,255,0.5);"
        >
          View All Tasks
        </v-btn>
        <v-btn
          variant="outlined"
          rounded="lg"
          prepend-icon="mdi-account"
          to="/profile"
          class="text-none text-white font-weight-bold"
          style="border-color: rgba(255,255,255,0.5);"
        >
          My Profile
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
</script>