<template>
  <div style="width: 100%; max-width: 420px;">
    <h2 class="text-h4 font-weight-bold mb-2">Welcome back!</h2>
    <p class="text-body-2 text-medium-emphasis mb-6">
      Simplify your workflow and boost your productivity with Task Manager.
      Get Logged In and Act now ! 
    </p>

    <v-form ref="formRef" @submit.prevent="handleLogin">
      <v-text-field
        v-model="form.email"
        label="Email"
        type="email"
        variant="outlined"
        density="comfortable"
        :rules="emailRules"
        class="mb-3 custom-radius"
        style="border-radius: 32px;"
        rounded="xl"
      />

      <v-text-field
        v-model="form.password"
        label="Password"
        :type="showPassword ? 'text' : 'password'"
        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="showPassword = !showPassword"
        variant="outlined"
        density="comfortable"
        :rules="passwordRules"
        class="custom-radius"
        style="border-radius: 32px;"
        rounded="xl"
      />

      <div class="text-right mb-4 mt-1">
        <a href="#" class="text-decoration-none text-body-2 font-weight-medium" style="color: #333;">
          Forgot Password?
        </a>
      </div>

      <v-btn
        type="submit"
        size="large"
        block
        rounded="xl"
        :loading="loading"
        style="background-color: #000; color: #fff; text-transform: none; font-size: 1rem;"
        class="mb-4"
      >
        Login
      </v-btn>
    </v-form>

    <AuthSocialLogin />

    <p class="text-body-2 text-center">
      Not a member?
      <NuxtLink to="/auth/register" class="text-decoration-none font-weight-bold" style="color: #16a34a;">
        Register now
      </NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import type { LoginCredentials } from '~/shared/types/user'
import { emailRules, passwordRules } from '~/utils/validators'

definePageMeta({ layout: 'auth', middleware: 'guest' })

const formRef = ref()
const loading = ref(false)
const showPassword = ref(false)


const form = reactive<LoginCredentials>({
  email: '',
  password: '',
})

const authStore = useAuthStore()
const uiStore = useUiStore()

async function handleLogin() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    const result = await authStore.login(form)
    if (result.success) {
      uiStore.showSnackbar(result.message, 'success')
      await navigateTo('/dashboard')
    } else {
      uiStore.showSnackbar(result.message, 'error')
    }
  } catch (err: any) {
    uiStore.showSnackbar('An unexpected error occurred during login.', 'error')
  } finally {
    loading.value = false
  }
}
</script>