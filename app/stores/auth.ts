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
        const { avatar, ...basicInfo } = user
        infoCookie.value = JSON.stringify(basicInfo)

        // Full User persistence (Client Only)
        if (import.meta.client) {
          try {
            localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user))
          } catch (e: any) {
             if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
              console.error('Storage quota exceeded. Some data may not persist.')
            }
          }
        }

        return { success: true, message: 'Login successful!' }
      } catch (err: any) {
        return { success: false, message: err.message || 'Login failed.' }
      }
    },

    async register(credentials: RegisterCredentials): Promise<{ success: boolean; message: string }> {
      try {
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
      } catch (err: any) {
        return { success: false, message: err.message || 'Registration failed.' }
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

      if (import.meta.client) {
        localStorage.removeItem(AUTH_USER_STORAGE_KEY)
      }

      navigateTo('/auth/login')
    },

    initFromCookie() {
      const authCookie = useCookie('auth_token', { path: '/' })
      const infoCookie = useCookie(AUTH_INFO_COOKIE_KEY, { path: '/' })

      if (authCookie.value) {
        this.token = authCookie.value
        
        // Restore basic info from cookie (Available on SSR)
        if (infoCookie.value) {
          try {
            // Nuxt/H3 might already parse JSON strings in cookies depending on config,
            // but usually it's a string here.
            this.user = typeof infoCookie.value === 'string' 
              ? JSON.parse(infoCookie.value) 
              : infoCookie.value
          } catch {
            this.user = null
          }
        }

        // Restore full data (avatar) from localStorage (Client Only)
        if (import.meta.client) {
          const storedUser = localStorage.getItem(AUTH_USER_STORAGE_KEY)
          if (storedUser) {
            try {
              const fullUser = JSON.parse(storedUser)
              // Merge full data into state if it's the same user
              if (this.user && fullUser.id === this.user.id) {
                this.user = { ...this.user, ...fullUser }
              } else if (!this.user) {
                this.user = fullUser
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
      }
    },

    async updateProfile(data: Partial<User>): Promise<{ success: boolean; message: string }> {
      try {
        if (!this.user) return { success: false, message: 'User not logged in.' }

        const users = getPersistentUsers()
        const userIndex = users.findIndex(u => u.id === this.user?.id)

        if (userIndex === -1) {
          return { success: false, message: 'User not found in system.' }
        }

        // Update database
        const currentUser = users[userIndex]
        const updatedUser = { 
          ...currentUser, 
          ...data, 
          updatedAt: new Date().toISOString() 
        } as User & { password: string }

        users[userIndex] = updatedUser
        savePersistentUsers(users)

        // Update State
        const { password, ...userWithoutPassword } = updatedUser
        this.user = userWithoutPassword

        // Update Cookies (exclude avatar)
        const infoCookie = useCookie(AUTH_INFO_COOKIE_KEY, {
          maxAge: 60 * 60 * 24 * 7,
          secure: import.meta.env.PROD,
          sameSite: 'lax',
          path: '/'
        })
        const { avatar, ...basicInfo } = this.user
        infoCookie.value = JSON.stringify(basicInfo)

        // Update LocalStorage (include avatar)
        if (import.meta.client) {
          try {
            localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(this.user))
          } catch (e: any) {
            if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
              console.error('Storage quota exceeded. Image may be too large.')
              // we can still return success as cookies are set, but user might lose avatar on next refresh
            }
          }
        }

        return { success: true, message: 'Profile updated successfully!' }
      } catch (err: any) {
        return { success: false, message: err.message || 'Profile update failed.' }
      }
    },

    async changePassword(payload: ChangePasswordPayload): Promise<{ success: boolean; message: string }> {
      try {
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

        const updatedUser = {
          ...foundUser,
          password: payload.newPassword,
          updatedAt: new Date().toISOString()
        }
        users[userIndex] = updatedUser
        savePersistentUsers(users)

        return { success: true, message: 'Password changed successfully!' }
      } catch (err: any) {
        return { success: false, message: err.message || 'Password change failed.' }
      }
    },

    // Admin Actions
    fetchUsers() {
      if (!import.meta.client) return
      const users = getPersistentUsers()
      // Map to User interface (remove passwords)
      this.allUsers = users.map(({ password, ...user }) => user as User)
    },

    deleteUser(userId: string) {
      if (!this.isAdmin) return
      const users = getPersistentUsers()
      const filtered = users.filter(u => u.id !== userId)
      savePersistentUsers(filtered)
      this.fetchUsers() // Refresh
    },

    updateUserRole(userId: string, role: 'user' | 'admin') {
      if (!this.isAdmin) return
      const users = getPersistentUsers()
      const userIndex = users.findIndex(u => u.id === userId)
      if (userIndex !== -1) {
        const u = users[userIndex]
        if (u) {
          u.role = role
          u.updatedAt = new Date().toISOString()
          savePersistentUsers(users)
          this.fetchUsers()
        }
      }
    },
  },
})