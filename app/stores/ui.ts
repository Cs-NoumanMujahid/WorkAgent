import { defineStore } from 'pinia'

export type SnackbarColor = 'success' | 'error' | 'info' | 'warning'

export const useUiStore = defineStore('ui', {
  state: () => ({
    snackbar: {
      show: false,
      text: '',
      color: 'success' as SnackbarColor,
      timeout: 3000,
    },
    appBackground: (import.meta.client && localStorage.getItem('appBackground')) || '#f5f7fa',
  }),

  actions: {
    showSnackbar(text: string, color: SnackbarColor = 'success', timeout: number = 3000) {
      this.snackbar.text = text
      this.snackbar.color = color
      this.snackbar.timeout = timeout
      this.snackbar.show = true
    },
    closeSnackbar() {
      this.snackbar.show = false
    },
    setAppBackground(color: string) {
      this.appBackground = color
      if (import.meta.client) {
        localStorage.setItem('appBackground', color)
      }
    },
  },
})

