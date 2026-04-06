import { defineStore } from 'pinia'
import type { User, ChangePasswordPayload } from '~/shared/types/user'
import type { LoginCredentials, RegisterCredentials } from '~/shared/types/user'

const ExistingUsers: (User & { password: string })[] = [
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
  if (import.meta.server) return ExistingUsers
  const stored = localStorage.getItem('work_agent_users')
  return stored ? JSON.parse(stored) : ExistingUsers
}

const savePersistentUsers = (users: any[]) => {
  if (import.meta.client) {
    localStorage.setItem('work_agent_users', JSON.stringify(users))
  }
}

const AUTH_USER_STORAGE_KEY = 'work_agent_auth_user'

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

      // `secure: true` breaks local http dev (cookie won't be stored/sent).
      const cookie = useCookie('auth_token', {
        maxAge: 60 * 60 * 24 * 7,
        secure: import.meta.env.PROD,
        sameSite: 'lax',
        path: '/'
      })
      cookie.value = this.token

      // Persist user in localStorage instead of cookies (avatar/base64 can exceed cookie size limits).
      if (import.meta.client) {
        localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(this.user))
      }

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

      const authCookie = useCookie('auth_token', { path: '/' })
      authCookie.value = null
      if (import.meta.client) {
        localStorage.removeItem(AUTH_USER_STORAGE_KEY)
      }

      navigateTo('/auth/login')
    },

    initFromCookie() {
      const authCookie = useCookie('auth_token', { path: '/' })
      if (authCookie.value) {
        this.token = authCookie.value

        // Prefer localStorage user snapshot (supports large avatar strings).
        if (import.meta.client) {
          const storedUser = localStorage.getItem(AUTH_USER_STORAGE_KEY)
          if (storedUser) {
            this.user = JSON.parse(storedUser)
          }
        }
      }
    },

    async updateProfile(data: Partial<User>): Promise<{ success: boolean; message: string }> {
      if (!this.user) return { success: false, message: 'User not logged in.' }

      const users = getPersistentUsers()
      const userIndex = users.findIndex(u => u.id === this.user?.id)

      if (userIndex === -1) {
        return { success: false, message: 'User not found in system.' }
      }

      // Update the user in the "database"
      const currentUser = users[userIndex]
      const updatedUser = { 
        ...currentUser, 
        ...data, 
        updatedAt: new Date().toISOString() 
      } as User & { password: string }

      users[userIndex] = updatedUser
      savePersistentUsers(users)

      // Update current state
      const { password, ...userWithoutPassword } = updatedUser
      this.user = userWithoutPassword

      // Persist user snapshot locally (supports large avatar strings).
      if (import.meta.client) {
        localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(this.user))
      }

      return { success: true, message: 'Profile updated successfully!' }
    },

    async changePassword(payload: ChangePasswordPayload): Promise<{ success: boolean; message: string }> {
      if (!this.user) return { success: false, message: 'User not logged in.' }

      const users = getPersistentUsers()
      const userIndex = users.findIndex(u => u.id === this.user?.id)

      if (userIndex === -1) {
        return { success: false, message: 'User not found in system.' }
      }

      const foundUser = users[userIndex]
      if (!foundUser || foundUser.password !== payload.currentPassword) {
        return { success: false, message: 'Current password is incorrect.' }
      }

      // Update password
      const updatedUser = {
        ...foundUser,
        password: payload.newPassword,
        updatedAt: new Date().toISOString()
      }
      users[userIndex] = updatedUser
      savePersistentUsers(users)

      return { success: true, message: 'Password changed successfully!' }
    },
  },
})