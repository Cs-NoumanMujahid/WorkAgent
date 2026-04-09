export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore()
  const taskStore = useTaskStore()

  // Initialize stores once on app startup
  // fire-and-forget hydration
  authStore.initFromCookie()
  taskStore.initTasks()

  // once auth is ready on client, hydrate tasks from API
  if (import.meta.client) {
    watch(
      () => authStore.token,
      async (t) => {
        if (t) {
          try {
            await taskStore.fetchTasks()
          } catch {
            // ignore; UI will surface errors when user interacts
          }
        }
      },
      { immediate: true }
    )
  }
})
