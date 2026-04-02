<template>
  <ClientOnly>
    <v-app>
      <!-- Sidebar -->
      <v-navigation-drawer v-model="drawer" permanent>
        <v-list-item
          title="Task Manager"
          subtitle="Dashboard"
          nav
        />
        <v-divider />
        <v-list density="compact" nav>
          <v-list-item
            v-for="item in navItems"
            :key="item.title"
            :prepend-icon="item.icon"
            :title="item.title"
            :to="item.to"
          />
        </v-list>
      </v-navigation-drawer>

      <!-- Header -->
      <v-app-bar elevation="1">
        <v-app-bar-nav-icon @click="drawer = !drawer" />
        <v-app-bar-title>Task Manager</v-app-bar-title>
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
                to="/profile"
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

      <!-- Main Content -->
      <v-main>
        <v-container fluid class="pa-6">
          <slot />
        </v-container>
      </v-main>
    </v-app>
  </ClientOnly>
</template>

<script setup lang="ts">
const drawer = ref(true)
const authStore = useAuthStore()

const navItems = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/dashboard' },
  { title: 'Tasks', icon: 'mdi-checkbox-marked-outline', to: '/tasks' },
  { title: 'Profile', icon: 'mdi-account', to: '/profile' },
  { title: 'Settings', icon: 'mdi-cog', to: '/settings' },
]
</script>