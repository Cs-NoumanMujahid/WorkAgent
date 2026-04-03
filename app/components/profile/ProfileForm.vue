<template>
  <v-card rounded="xl" elevation="0" border class="pa-6">

    <!-- HEADER -->
    <div class="d-flex align-center flex-wrap ga-6 mb-8 mt-4">

      <!-- AVATAR -->
      <v-avatar size="100" color="primary" rounded="lg" class="position-relative">

        <v-img v-if="formData.avatar" :src="formData.avatar" cover />

        <span v-else class="text-h3 font-weight-bold text-white">
          {{ userInitials }}
        </span>

        <v-btn
          icon="mdi-camera"
          size="small"
          color="primary"
          class="position-absolute"
          style="bottom: -10px; right: -10px;"
          @click="triggerImageUpload"
        />

        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="d-none"
          @change="handleImageUpload"
        />
      </v-avatar>

      <div class="flex-grow-1">
        <h2 class="text-h4 font-weight-bold mb-1">
          Edit Profile
        </h2>

        <p class="text-body-1 text-medium-emphasis">
          Update your personal details and how others see you.
        </p>
      </div>

    </div>

    <!-- FORM -->
    <v-form ref="formRef" v-model="formValid">

      <v-row>

        <!-- LEFT -->
        <v-col cols="12" md="6">

          <v-text-field
            v-model="formData.fullName"
            label="Full Name"
            variant="outlined"
            rounded="lg"
            prepend-inner-icon="mdi-account-outline"
            :rules="[v => !!v || 'Name is required']"
            required
          />

          <v-text-field
            v-model="formData.email"
            label="Email"
            variant="outlined"
            rounded="lg"
            prepend-inner-icon="mdi-email-outline"
            :rules="[
              v => !!v || 'Email is required',
              v => /.+@.+\..+/.test(v) || 'Invalid email'
            ]"
            required
          />

          <v-text-field
            v-model="formData.phone"
            label="Phone"
            variant="outlined"
            rounded="lg"
            prepend-inner-icon="mdi-phone-outline"
          />

        </v-col>

        <!-- RIGHT -->
        <v-col cols="12" md="6">

          <v-textarea
            v-model="formData.bio"
            label="Bio"
            variant="outlined"
            rounded="lg"
            rows="5"
            counter="300"
            prepend-inner-icon="mdi-text-account"
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
          @click="handleSubmit"
          :loading="loading"
          :disabled="!formValid"
        >
          Save Changes
        </v-btn>

      </div>

    </v-form>

  </v-card>
</template>

<script setup lang="ts">
import type { User } from '~/shared/types/user'

const authStore = useAuthStore()

const props = defineProps<{
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'save', payload: Partial<User>): void
  (e: 'cancel'): void
}>()

/* ---------------- FORM STATE ---------------- */

const formRef = ref()
const formValid = ref(false)

const fileInput = ref<HTMLInputElement | null>(null)

/**
 * IMPORTANT FIX:
 * do NOT initialize directly from store snapshot
 * because authStore.user may load AFTER mount
 */
const formData = reactive<Partial<User>>({
  fullName: '',
  email: '',
  phone: '',
  bio: '',
  avatar: ''
})

/* ---------------- SYNC STORE -> FORM ---------------- */

watchEffect(() => {
  if (!authStore.user) return

  formData.fullName = authStore.user.fullName || ''
  formData.email = authStore.user.email || ''
  formData.phone = authStore.user.phone || ''
  formData.bio = authStore.user.bio || ''
  formData.avatar = authStore.user.avatar || ''
})

/* ---------------- COMPUTED ---------------- */

const userInitials = computed(() => {
  const name = formData.fullName || '?'
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

/* ---------------- IMAGE UPLOAD ---------------- */

const triggerImageUpload = () => {
  fileInput.value?.click()
}

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  const reader = new FileReader()

  reader.onload = (e) => {
    formData.avatar = e.target?.result as string
  }

  reader.readAsDataURL(file)

  // important: allow re-upload same file
  input.value = ''
}

/* ---------------- ACTIONS ---------------- */

const handleSubmit = async () => {
  const result = await formRef.value?.validate()
  if (!result?.valid) return

  emit('save', { ...formData })
}

const handleCancel = () => {
  emit('cancel')
}

/* ---------------- RESET (optional exposure) ---------------- */

const reset = () => {
  formRef.value?.reset()
}

defineExpose({ reset })

</script>