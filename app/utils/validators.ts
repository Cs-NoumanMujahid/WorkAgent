export const nameRules = [
  (v: string) => !!v || 'Full name is required',
]

export const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid',
]

export const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => v.length >= 8 || 'Password must be at least 8 characters',
]

export const confirmPasswordRules = (password: string) => [
  (v: string) => !!v || 'Please confirm your password',
  (v: string) => v === password || 'Passwords do not match',
]

