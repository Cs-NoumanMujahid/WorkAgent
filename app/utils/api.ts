type ApiOptions = {
  method?: string
  query?: Record<string, any>
  body?: any
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  return await $fetch<T>(path, {
    baseURL: config.public.apiBase,
    method: options.method,
    query: options.query,
    body: options.body,
    headers: authStore.token ? { Authorization: `Bearer ${authStore.token}` } : undefined,
  })
}

