<template>
  <v-container fluid class="pa-6">
    <div class="mb-8">
      <h1 class="text-h3 font-weight-bold mb-2">Create Task</h1>
      <p class="text-body-1 text-medium-emphasis">
        Add a new task with priority, status, category, and due date.
      </p>
    </div>

    <v-card rounded="xl" elevation="0" border class="pa-6">
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
              hint="Enter a user id (e.g. 1) for now"
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
            @click="handleCancel"
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
            Create Task
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import type { TaskPriority, TaskStatus } from '~/shared/types/task'

definePageMeta({ middleware: 'auth' })

const authStore = useAuthStore()
const taskStore = useTaskStore()
const uiStore = useUiStore()

const formRef = ref<any>(null)
const formValid = ref(false)
const loading = ref(false)

const statusOptions: TaskStatus[] = ['pending', 'in-progress', 'completed', 'overdue']
const priorityOptions: TaskPriority[] = ['low', 'medium', 'high']

const form = reactive({
  title: '',
  description: '',
  dueDate: '',
  priority: 'medium' as TaskPriority,
  status: 'pending' as TaskStatus,
  category: '',
  assignedTo: '' as string,
})

const resetForm = () => {
  form.title = ''
  form.description = ''
  form.dueDate = ''
  form.priority = 'medium'
  form.status = 'pending'
  form.category = ''
  form.assignedTo = ''
  formRef.value?.resetValidation?.()
}

const handleCancel = () => {
  resetForm()
  navigateTo('/dashboard')
}

const handleSubmit = async () => {
  const result = await formRef.value?.validate()
  if (!result?.valid) return

  loading.value = true
  try {
    taskStore.addTask({
      title: form.title.trim(),
      description: form.description.trim(),
      dueDate: form.dueDate,
      priority: form.priority,
      status: form.status,
      category: form.category.trim(),
      assignedTo: authStore.isAdmin && form.assignedTo.trim() ? form.assignedTo.trim() : undefined,
    })

    uiStore.showSnackbar('Task created successfully!', 'success')
    resetForm()
    navigateTo('/tasks')
  } catch {
    uiStore.showSnackbar('Failed to create task.', 'error')
  } finally {
    loading.value = false
  }
}
</script>

