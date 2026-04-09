export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  // Must be authenticated and must be an admin
  if (!authStore.isAuthenticated) {
    return navigateTo('/auth/login')
  }

  if (!authStore.isAdmin) {
    return navigateTo('/dashboard')
  }
})
