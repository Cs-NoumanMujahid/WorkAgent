<template>
  <v-form ref="formRef" v-model="formValid" @submit.prevent="handleSubmit">
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="form.title"
          label="Title"
          variant="outlined"
          rounded="lg"
          prepend-inner-icon="mdi-format-title"
          :rules="[v => !!v || 'Title is required']"
          required
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="form.dueDate"
          label="Due date"
          type="date"
          variant="outlined"
          rounded="lg"
          prepend-inner-icon="mdi-calendar-clock"
          :rules="[v => !!v || 'Due date is required']"
          required
        />
      </v-col>

      <v-col cols="12">
        <v-textarea
          v-model="form.description"
          label="Description"
          variant="outlined"
          rounded="lg"
          rows="4"
          prepend-inner-icon="mdi-text-long"
          :rules="[v => !!v || 'Description is required']"
          required
        />
      </v-col>

      <v-col cols="12" md="4">
        <v-select
          v-model="form.priority"
          label="Priority"
          :items="priorityOptions"
          variant="outlined"
          rounded="lg"
          prepend-inner-icon="mdi-flag-variant-outline"
          :rules="[v => !!v || 'Priority is required']"
          required
        />
      </v-col>

      <v-col cols="12" md="4">
        <v-select
          v-model="form.status"
          label="Status"
          :items="statusOptions"
          variant="outlined"
          rounded="lg"
          prepend-inner-icon="mdi-progress-check"
          :rules="[v => !!v || 'Status is required']"
          required
        />
      </v-col>

      <v-col cols="12" md="4">
        <v-text-field
          v-model="form.category"
          label="Category"
          variant="outlined"
          rounded="lg"
          prepend-inner-icon="mdi-tag-outline"
          :rules="[v => !!v || 'Category is required']"
          required
        />
      </v-col>

      <v-col v-if="authStore.isAdmin" cols="12" md="6">
        <v-text-field
          v-model="form.assignedTo"
          label="Assigned user (optional)"
          variant="outlined"
          rounded="lg"
          prepend-inner-icon="mdi-account-arrow-right-outline"
          hint="Enter a user id"
          persistent-hint
        />
      </v-col>
    </v-row>

    <div class="d-flex justify-end ga-3 mt-4">
      <v-btn
        variant="outlined"
        rounded="lg"
        class="text-none px-6"
        :disabled="loading"
        @click="$emit('cancel')"
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
        {{ isEdit ? 'Update Task' : 'Create Task' }}
      </v-btn>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import type { Task, TaskPriority, TaskStatus } from '~/shared/types/task'

const props = defineProps<{
  initialData?: Partial<Task>
  isEdit?: boolean
  loading?: boolean
}>()

const emit = defineEmits(['submit', 'cancel'])

const authStore = useAuthStore()

const formRef = ref<any>(null)
const formValid = ref(false)

const statusOptions: TaskStatus[] = ['pending', 'in-progress', 'completed', 'overdue']
const priorityOptions: TaskPriority[] = ['low', 'medium', 'high']

const form = reactive({
  title: props.initialData?.title || '',
  description: props.initialData?.description || '',
  dueDate: props.initialData?.dueDate || '',
  priority: props.initialData?.priority || 'medium' as TaskPriority,
  status: props.initialData?.status || 'pending' as TaskStatus,
  category: props.initialData?.category || '',
  assignedTo: props.initialData?.assignedTo || '',
})

const handleSubmit = async () => {
  const result = await formRef.value?.validate()
  if (!result?.valid) return

  emit('submit', { ...form })
}

defineExpose({
  reset: () => {
    formRef.value?.reset()
    formRef.value?.resetValidation()
  }
})
</script>
