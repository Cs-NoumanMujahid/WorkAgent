<template>
  <v-container fluid class="pa-6">
    <div class="mb-8">
      <h1 class="text-h3 font-weight-bold mb-2">Edit Task</h1>
      <p class="text-body-1 text-medium-emphasis">
        Update task details and track progress.
      </p>
    </div>

    <v-card v-if="task" rounded="xl" elevation="0" border class="pa-6">
      <TasksTaskForm
        :initial-data="task"
        is-edit
        :loading="loading"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </v-card>
    
    <v-alert
      v-else
      type="error"
      variant="tonal"
      rounded="xl"
      title="Task Not Found"
      text="The task you are looking for does not exist or has been deleted."
      class="mt-4"
    >
      <template #append>
        <v-btn variant="text" to="/tasks">Back to Tasks</v-btn>
      </template>
    </v-alert>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const taskStore = useTaskStore()
const uiStore = useUiStore()

const taskId = route.params.id as string
const task = computed(() => taskStore.tasks.find(t => t.id === taskId))

const loading = ref(false)

const handleCancel = () => {
  navigateTo('/tasks')
}

const handleSubmit = async (formData: any) => {
  loading.value = true
  try {
    await taskStore.updateTask(taskId, {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category.trim(),
      assignedTo: formData.assignedTo?.trim() || undefined,
    })

    uiStore.showSnackbar('Task updated successfully!', 'success')
    navigateTo('/tasks')
  } catch {
    uiStore.showSnackbar('Failed to update task.', 'error')
  } finally {
    loading.value = false
  }
}
</script>
