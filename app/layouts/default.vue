<template>
  <ClientOnly>
    <v-app>
      <CommonAppSidebar v-model:drawer="drawer" />
      <CommonAppHeader @toggle-drawer="drawer = !drawer" />
      <v-main style="background-color: #f5f7fa;">
        <v-container fluid class="pa-4">
          <slot />
        </v-container>
      </v-main>
    </v-app>
  </ClientOnly>
</template>

<script setup lang="ts">
const drawer = ref(true)
</script>