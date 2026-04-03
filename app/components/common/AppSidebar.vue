<template>
  <v-navigation-drawer
    v-model="drawer"
    width="280"
    class="modern-sidebar border-0"
    elevation="0"
  
    
 
  >

    <div class="pa-6 d-flex align-center ga-3">
      <v-avatar size="32" rounded="lg">
       <v-img src="/images/lion.png" alt="Logo" cover />
      </v-avatar>
      <span class="text-h6 font-weight-bold tracking-tight">WORK AGENT</span>
    </div>


    <div class="px-6 py-4 mx-4 mb-4 bg-grey-lighten-4 rounded-xl d-flex align-center ga-3">
      <v-avatar color="primary" size="40">
        <v-img v-if="authStore.user?.avatar" :src="authStore.user.avatar" cover />
        <span v-else class="text-subtitle-1 font-weight-bold text-white">{{ userInitials }}</span>
      </v-avatar>
      <div class="flex-grow-1 overflow-hidden">
        <p class="text-body-2 font-weight-bold ma-0 text-truncate">{{ authStore.user?.fullName }}</p>
        <p class="text-caption text-medium-emphasis ma-0 text-capitalize">{{ authStore.user?.role }}</p>
      </div>
    </div>

    <!-- Navigation -->
    <v-list density="compact" nav class="px-4 py-0">
      <v-list-item
        prepend-icon="mdi-view-dashboard-outline"
        title="Dashboard"
        to="/dashboard"
        rounded="xl"
        active-color="primary"
        class="mb-1"
      />

      <v-list-group value="Tasks">
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-checkbox-marked-outline"
            title="Tasks"
            rounded="xl"
            class="mb-1"
          />
        </template>
        <v-list-item
          prepend-icon="mdi-format-list-bulleted"
          title="All Tasks"
          to="/tasks"
          rounded="xl"
          active-color="primary"
          class="mb-1"
        />
        <v-list-item
          prepend-icon="mdi-plus-circle-outline"
          title="Create Task"
          to="/tasks/create"
          rounded="xl"
          active-color="primary"
          class="mb-1"
        />
      </v-list-group>

      <v-list-item
        prepend-icon="mdi-account-outline"
        title="Profile"
        to="/dashboard/profile"
        rounded="xl"
        active-color="primary"
        class="mb-1"
      />

      <v-list-item
        prepend-icon="mdi-cog-outline"
        title="Settings"
        to="/settings"
        rounded="xl"
        active-color="primary"
        class="mb-1"
      />

      <!-- Admin Section -->
      <v-list-group v-if="authStore.isAdmin" value="Admin">
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-shield-account-outline"
            title="Admin"
            rounded="xl"
            class="mb-1"
          />
        </template>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Admin Dashboard"
          to="/admin"
          rounded="xl"
          active-color="primary"
          class="mb-1"
        />
        <v-list-item
          prepend-icon="mdi-account-group-outline"
          title="User Management"
          to="/admin/users"
          rounded="xl"
          active-color="primary"
          class="mb-1"
        />
        <v-list-item
          prepend-icon="mdi-layers-outline"
          title="All System Tasks"
          to="/admin/tasks"
          rounded="xl"
          active-color="primary"
          class="mb-1"
        />
      </v-list-group>
    </v-list>

    <!-- Logout Section -->
    <template #append>
      <div class="pa-4 border-t">
        <v-btn
          block
          variant="text"
          prepend-icon="mdi-logout"
          color="error"
          rounded="xl"
          class="justify-start text-none font-weight-medium"
          @click="authStore.logout()"
        >
          Logout
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const drawer = defineModel<boolean>('drawer', { default: true })

const userInitials = computed(() => {
  const name = authStore.user?.fullName || '?'
  return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
})
</script>

<style scoped>
.modern-sidebar {
  background-color: #fff !important;
}

:deep(.v-list-group__items .v-list-item) {
  padding-inline-start: 48px !important;
}

.tracking-tight {
  letter-spacing: -0.025em;
}
</style>