export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
  authStore.initFromCookie()

  if (!authStore.isAuthenticated) {
    return navigateTo('/auth/login')
  }
})