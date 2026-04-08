<template>
  <v-container fluid class="pa-6">
    <div class="mb-8">
      <h1 class="text-h3 font-weight-bold mb-2">Global System Tasks</h1>
      <p class="text-body-1 text-medium-emphasis">Overview and assignment of all tasks across the organization.</p>
    </div>

    <AdminSystemTaskTable
      :tasks="taskStore.allSystemTasks"
      @assign-task="handleAssign"
      @delete-task="handleDelete"
    />
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin' })

const taskStore = useTaskStore()
const authStore = useAuthStore()
const uiStore = useUiStore()

onMounted(() => {
  taskStore.initTasks()
  authStore.fetchUsers()
})

const handleAssign = (taskId: string, userId: string) => {
  taskStore.assignTask(taskId, userId)
  const user = authStore.allUsers.find(u => u.id === userId)
  uiStore.showSnackbar(`Task successfully assigned to ${user?.fullName || 'user'}`, 'success')
}

const handleDelete = (taskId: string) => {
  taskStore.deleteTask(taskId)
  uiStore.showSnackbar('Task permanently deleted from the system.', 'success')
}
</script>
