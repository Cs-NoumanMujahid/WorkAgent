<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const taskStore = useTaskStore()

// Automatically re-initialize tasks when the user changes (login/logout/refresh)
watch(() => authStore.user?.id, (newId) => {
  if (newId) {
    taskStore.initTasks(true)
  }
}, { immediate: true })
</script>