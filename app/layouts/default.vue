<template>
  <ClientOnly>
    <v-app>
      <CommonAppSidebar v-model:drawer="drawer" />
      <CommonAppHeader @toggle-drawer="drawer = !drawer" />
      <v-main :style="{ backgroundColor: uiStore.appBackground }">
        <v-container fluid class="pa-4">
          <slot />
        </v-container>
      </v-main>

      <v-snackbar
        v-model="uiStore.snackbar.show"
        :color="uiStore.snackbar.color"
        :timeout="uiStore.snackbar.timeout"
        rounded="lg"
        location="top end"
      >
        {{ uiStore.snackbar.text }}

        <template #actions>
          <v-btn variant="text" @click="uiStore.closeSnackbar()">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-app>
  </ClientOnly>
</template>

<script setup lang="ts">
const drawer = ref(true)
const uiStore = useUiStore()
</script>