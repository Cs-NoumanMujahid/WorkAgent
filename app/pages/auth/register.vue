<template>
  <div style="width: 100%; max-width: 420px; max-height: 83vh; ">
    <h2 class="text-h4 font-weight-bold mb-2">Welcome back!</h2>
    <p class="text-body-2 text-medium-emphasis mb-6">
      Simplify your workflow and boost your productivity with Task Manager.
      Get Started for Free  
    </p>

    <v-form ref="formRef" @submit.prevent="handleRegister">

 
      <v-text-field
        v-model="form.fullName"
        label="Full Name"
        variant="outlined"
        density="comfortable"
        :rules="nameRules"
        class="mb-3 custom-radius"
        style="border-radius: 32px;"
        rounded="xl"
      />

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

       <v-text-field
        v-model="form.confirmPassword"
        label="Confirm Password"
        :type="showPassword ? 'text' : 'password'"
        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="showPassword = !showPassword"
        variant="outlined"
        density="comfortable"
        :rules="confirmPasswordRules(form.password)"
        class="custom-radius"
        style="border-radius: 32px;"
        rounded="xl"
      />

      <div class="text-right mb-4 mt-1">
        <a href="#" class="text-decoration-none text-body-2 font-weight-medium" style="color: #333;">
          Forgot Password?
        </a>
      </div>

      <v-alert v-if="error" type="error" class="mb-4" rounded="lg">
        {{ error }}
      </v-alert>

      <v-btn
        type="submit"
        size="large"
        block
        rounded="xl"
        :loading="loading"
        style="background-color: #000; color: #fff; text-transform: none; font-size: 1rem;"
        class="mb-4"
      >
        Register
      </v-btn>
    </v-form>

     <AuthSocialLogin />

    <p class="text-body-2 text-center">
      Already have an account?
      <NuxtLink to="/auth/login" class="text-decoration-none font-weight-bold" style="color: #16a34a;">
        Login here
      </NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import type {RegisterCredentials } from '~/shared/types/user'
import { emailRules, passwordRules, nameRules,confirmPasswordRules } from '~/utils/validators'

definePageMeta({ layout: 'auth', middleware: 'guest' })

const formRef = ref()
const loading = ref(false)
const showPassword = ref(false)
const error = ref('')

const form = reactive<RegisterCredentials>({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const authStore = useAuthStore()

async function handleRegister() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  const result = await authStore.register(form)
  loading.value = false

  if (result.success) {
    navigateTo('/auth/login')
  } else {
    error.value = result.message
  }
}
</script>