<template>
  <v-app-bar elevation="0" border="b">
    <v-app-bar-nav-icon @click="$emit('toggle-drawer')" />
    <v-app-bar-title class="font-weight-bold">Dashboard</v-app-bar-title>
    <template #append>
      <v-btn icon="mdi-bell" />
      <v-menu>
        <template #activator="{ props }">
          <v-btn icon="mdi-account-circle" v-bind="props" />
        </template>
        <v-list>
          <v-list-item
            prepend-icon="mdi-account"
            title="Profile"
            to="/dashboard/profile"
          />
          <v-list-item
            prepend-icon="mdi-cog"
            title="Settings"
            to="/settings"
          />
          <v-divider />
          <v-list-item
            prepend-icon="mdi-logout"
            title="Logout"
            @click="authStore.logout()"
          />
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
defineEmits(['toggle-drawer'])
</script>