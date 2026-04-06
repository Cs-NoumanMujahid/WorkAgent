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
  },
})

