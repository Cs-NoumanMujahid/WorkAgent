export interface User {
  id: string
  fullName: string
  email: string
  role: 'user' | 'admin'
  phone?: string
  bio?: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

// Used only in auth forms, never stored in state
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}