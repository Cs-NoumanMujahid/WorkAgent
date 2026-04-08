export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore()
  const taskStore = useTaskStore()

  // Initialize stores once on app startup
  authStore.initFromCookie()
  taskStore.initTasks()
})
