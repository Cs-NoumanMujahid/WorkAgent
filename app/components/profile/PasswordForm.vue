<template>
  <v-card rounded="xl" elevation="0" border class="pa-6">

    <h3 class="text-h5 font-weight-bold mb-1">
      Change Password
    </h3>

    <p class="text-body-1 text-medium-emphasis mb-6">
      Use a strong password to keep your account secure.
    </p>

    <v-form
      ref="formRef"
      v-model="formValid"
      @submit.prevent="handleSubmit"
    >

      <v-row>

        <!-- CURRENT PASSWORD -->
        <v-col cols="12" md="4">
          <v-text-field
            v-model="passData.currentPassword"
            label="Current Password"
            :type="show.current ? 'text' : 'password'"
            variant="outlined"
            rounded="lg"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="show.current ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="show.current = !show.current"
            :rules=passwordRules
            required
          />
        </v-col>

        <!-- NEW PASSWORD -->
        <v-col cols="12" md="4">
          <v-text-field
            v-model="passData.newPassword"
            label="New Password"
            :type="show.new ? 'text' : 'password'"
            variant="outlined"
            rounded="lg"
            prepend-inner-icon="mdi-lock-reset"
            :append-inner-icon="show.new ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="show.new = !show.new"
            :rules= passwordRules
            required
          />
        </v-col>

        <!-- CONFIRM PASSWORD -->
        <v-col cols="12" md="4">
          <v-text-field
            v-model="passData.confirmPassword"
            label="Confirm Password"
            :type="show.confirm ? 'text' : 'password'"
            variant="outlined"
            rounded="lg"
            prepend-inner-icon="mdi-lock-check-outline"
            :append-inner-icon="show.confirm ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="show.confirm = !show.confirm"
            :rules=confirmPasswordRules(passData.newPassword)
            required
          />
        </v-col>

      </v-row>

      <!-- ACTIONS -->
      <div class="d-flex justify-end ga-3 mt-4">

        <v-btn
          variant="outlined"
          rounded="lg"
          class="text-none px-6"
          @click="handleCancel"
          :disabled="loading"
        >
          Cancel
        </v-btn>

        <v-btn
          color="primary"
          rounded="lg"
          class="text-none px-6"
          type="submit"
          :loading="loading"
          :disabled="!formValid"
        >
          Update Password
        </v-btn>

      </div>

    </v-form>

  </v-card>
</template>

<script setup lang="ts">

const props = defineProps<{
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'change', payload: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }): void
  (e: 'cancel'): void
}>()

/* ---------------- FORM STATE ---------------- */

const formRef = ref()
const formValid = ref(false)
import { passwordRules,confirmPasswordRules } from '~/utils/validators'

const passData = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const show = reactive({
  current: false,
  new: false,
  confirm: false
})

/* ---------------- ACTIONS ---------------- */

const resetForm = () => {
  passData.currentPassword = ''
  passData.newPassword = ''
  passData.confirmPassword = ''

  // reset vuetify validation state properly
  formRef.value?.reset()
  formRef.value?.resetValidation?.()

  // reset visibility toggles
  show.current = false
  show.new = false
  show.confirm = false
}

const handleSubmit = async () => {
  const result = await formRef.value?.validate()
  if (!result?.valid) return

  emit('change', { ...passData })
}

const handleCancel = () => {
  resetForm()
  emit('cancel')
}

/* ---------------- EXPOSE ---------------- */

defineExpose({
  reset: resetForm
})

</script>