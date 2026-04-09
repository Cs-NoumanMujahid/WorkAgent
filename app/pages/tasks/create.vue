<template>
  <v-container fluid class="pa-6">
    <div class="mb-8">
      <h1 class="text-h3 font-weight-bold mb-2">Create Task</h1>
      <p class="text-body-1 text-medium-emphasis">
        Add a new task with priority, status, category, and due date.
      </p>
    </div>

    <v-card rounded="xl" elevation="0" border class="pa-6">
      <TasksTaskForm
        :loading="loading"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import type { Task } from '~/shared/types/task'

definePageMeta({ middleware: 'auth' })

const taskStore = useTaskStore()
const uiStore = useUiStore()

const loading = ref(false)

const handleCancel = () => {
  navigateTo('/tasks')
}

const handleSubmit = async (formData: any) => {
  loading.value = true
  try {
    await taskStore.createTask({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category.trim(),
      assignedTo: formData.assignedTo?.trim() || undefined,
    })

    uiStore.showSnackbar('Task created successfully!', 'success')
    navigateTo('/tasks')
  } catch {
    uiStore.showSnackbar('Failed to create task.', 'error')
  } finally {
    loading.value = false
  }
}
</script>
