<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const taskStore = useTaskStore()

authStore.initFromCookie()
taskStore.initTasks()
</script>