import { defineStore } from 'pinia'
import type { User, ChangePasswordPayload } from '~/shared/types/user'
import type { LoginCredentials, RegisterCredentials } from '~/shared/types/user'
import { apiFetch } from '~/utils/api'

const AUTH_INFO_COOKIE_KEY = 'user_info'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    allUsers: [] as User[],
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
  },

  actions: {
    async login(credentials: LoginCredentials): Promise<{ success: boolean; message: string }> {
      try {
        const result = await apiFetch<{ token: string; user: User }>('/auth/login', {
          method: 'POST',
          body: credentials,
        })

        this.user = result.user
        this.token = result.token

        // Token Cookie
        const tokenCookie = useCookie('auth_token', {
          maxAge: 60 * 60 * 24 * 7,
          secure: import.meta.env.PROD,
          sameSite: 'lax',
          path: '/'
        })
        tokenCookie.value = this.token

        // Basic User Info Cookie (Safe for SSR, no large avatar)
        const infoCookie = useCookie(AUTH_INFO_COOKIE_KEY, {
          maxAge: 60 * 60 * 24 * 7,
          secure: import.meta.env.PROD,
          sameSite: 'lax',
          path: '/'
        })
        const { avatar, ...basicInfo } = this.user
        infoCookie.value = JSON.stringify(basicInfo)

        return { success: true, message: 'Login successful!' }
      } catch (err: any) {
        return { success: false, message: err?.data?.detail || err.message || 'Login failed.' }
      }
    },

    async register(credentials: RegisterCredentials): Promise<{ success: boolean; message: string }> {
      try {
        await apiFetch<User>('/auth/register', {
          method: 'POST',
          body: {
            fullName: credentials.fullName,
            email: credentials.email,
            password: credentials.password,
          },
        })
        return { success: true, message: 'Registration successful! Please log in.' }
      } catch (err: any) {
        return { success: false, message: err?.data?.detail || err.message || 'Registration failed.' }
      }
    },

    logout() {
      const taskStore = useTaskStore()
      taskStore.clearTasks()

      this.user = null
      this.token = null

      const authCookie = useCookie('auth_token', { path: '/' })
      authCookie.value = null
      
      const infoCookie = useCookie(AUTH_INFO_COOKIE_KEY, { path: '/' })
      infoCookie.value = null

      navigateTo('/auth/login')
    },

    async initFromCookie() {
      const authCookie = useCookie('auth_token', { path: '/' })
      const infoCookie = useCookie(AUTH_INFO_COOKIE_KEY, { path: '/' })

      if (authCookie.value) {
        this.token = authCookie.value
        
        // Restore basic info from cookie (Available on SSR)
        if (infoCookie.value) {
          try {
        
            this.user = typeof infoCookie.value === 'string' 
              ? JSON.parse(infoCookie.value) 
              : infoCookie.value
          } catch {
            this.user = null
          }
        }

        // Hydrate full user from API (includes avatar)
        try {
          const me = await apiFetch<User>('/auth/me')
          this.user = me
        } catch {
          // token invalid/expired, reset to login
          this.logout()
        }
      }
    },

    async updateProfile(data: Partial<User>): Promise<{ success: boolean; message: string }> {
      try {
        if (!this.user) return { success: false, message: 'User not logged in.' }

        const updated = await apiFetch<User>('/auth/me', {
          method: 'PUT',
          body: data,
        })
        this.user = updated

        // Update Cookies (exclude avatar)
        const infoCookie = useCookie(AUTH_INFO_COOKIE_KEY, {
          maxAge: 60 * 60 * 24 * 7,
          secure: import.meta.env.PROD,
          sameSite: 'lax',
          path: '/'
        })
        const { avatar, ...basicInfo } = this.user
        infoCookie.value = JSON.stringify(basicInfo)

        return { success: true, message: 'Profile updated successfully!' }
      } catch (err: any) {
        return { success: false, message: err?.data?.detail || err.message || 'Profile update failed.' }
      }
    },

    async changePassword(payload: ChangePasswordPayload): Promise<{ success: boolean; message: string }> {
      try {
        if (!this.user) return { success: false, message: 'User not logged in.' }

        const res = await apiFetch<{ success: boolean; message: string }>('/auth/change-password', {
          method: 'POST',
          body: payload,
        })
        return { success: true, message: res.message || 'Password changed successfully!' }
      } catch (err: any) {
        return { success: false, message: err?.data?.detail || err.message || 'Password change failed.' }
      }
    },

    // Admin Actions
    async fetchUsers(params: { q?: string; role?: string; sort_by?: string; sort_dir?: string } = {}) {
      try {
        this.allUsers = await apiFetch<User[]>('/admin/users', { query: params })
      } catch {
        this.allUsers = []
      }
    },

    async deleteUser(userId: string) {
      await apiFetch(`/admin/users/${userId}`, { method: 'DELETE' })
      this.allUsers = this.allUsers.filter(u => u.id !== userId)
    },

    async updateUserRole(userId: string, role: 'user' | 'admin') {
      const updated = await apiFetch<User>(`/admin/users/${userId}/role`, {
        method: 'PATCH',
        body: { role },
      })
      const idx = this.allUsers.findIndex(u => u.id === userId)
      if (idx !== -1) this.allUsers[idx] = updated
    },
  },
})