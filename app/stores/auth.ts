import { defineStore } from 'pinia'
import type { User } from '~/shared/types/user'
import type { LoginCredentials, RegisterCredentials } from '~/shared/types/user'

const DEFAULT_USERS: (User & { password: string })[] = [
  {
    id: '1',
    fullName: 'Admin User',
    email: 'admin@123.com',
    password: 'passwordadmin',
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    fullName: 'Regular User',
    email: 'user@123.com',
    password: 'passworduser',
    role: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Helper for persistence
const getPersistentUsers = (): (User & { password: string })[] => {
  if (import.meta.server) return DEFAULT_USERS
  const stored = localStorage.getItem('work_agent_users')
  return stored ? JSON.parse(stored) : DEFAULT_USERS
}

const savePersistentUsers = (users: any[]) => {
  if (import.meta.client) {
    localStorage.setItem('work_agent_users', JSON.stringify(users))
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
  },

  actions: {
    async login(credentials: LoginCredentials): Promise<{ success: boolean; message: string }> {
   
      await new Promise(resolve => setTimeout(resolve, 1500))

      const users = getPersistentUsers()
      const found = users.find(
        u => u.email === credentials.email && u.password === credentials.password
      )

      if (!found) {
        return { success: false, message: 'Invalid email or password.' }
      }

      const { password, ...user } = found
      this.user = user
      this.token = `mock-token-${user.id}`

      const cookie = useCookie('auth_token', { maxAge: 60 * 60 * 24 * 7 })
      cookie.value = this.token

      const userCookie = useCookie('auth_user', { maxAge: 60 * 60 * 24 * 7 })
      userCookie.value = JSON.stringify(this.user)

      return { success: true, message: 'Login successful!' }
    },

    async register(credentials: RegisterCredentials): Promise<{ success: boolean; message: string }> {
      await new Promise(resolve => setTimeout(resolve, 1500))

      const users = getPersistentUsers()
      const exists = users.find(u => u.email === credentials.email)
      if (exists) {
        return { success: false, message: 'An account with this email already exists.' }
      }

      const newUser: User = {
        id: String(users.length + 1),
        fullName: credentials.fullName,
        email: credentials.email,
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      users.push({ ...newUser, password: credentials.password })
      savePersistentUsers(users)

      return { success: true, message: 'Registration successful! Please log in.' }
    },

    logout() {
      this.user = null
      this.token = null

      const authCookie = useCookie('auth_token')
      const userCookie = useCookie('auth_user')
      authCookie.value = null
      userCookie.value = null

      navigateTo('/auth/login')
    },

    initFromCookie() {
      const authCookie = useCookie('auth_token')
      const userCookie = useCookie('auth_user')

      if (authCookie.value && userCookie.value) {
        this.token = authCookie.value
        this.user = JSON.parse(userCookie.value as string)
      }
    },
  },
})