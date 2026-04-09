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
      @query-change="handleQueryChange"
    />
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin' })

const taskStore = useTaskStore()
const authStore = useAuthStore()
const uiStore = useUiStore()

onMounted(() => {
  taskStore.fetchTasks()
  authStore.fetchUsers()
})

const taskQuery = reactive({
  q: '',
  status: 'All',
})

const handleQueryChange = async (payload: { q: string; status: string }) => {
  taskQuery.q = payload.q
  taskQuery.status = payload.status
  try {
    await taskStore.fetchTasks({
      q: taskQuery.q || undefined,
      status: taskQuery.status === 'All' ? undefined : taskQuery.status,
    })
  } catch {
    uiStore.showSnackbar('Failed to load system tasks.', 'error')
  }
}

const handleAssign = async (taskId: string, userId: string) => {
  try {
    await taskStore.updateTask(taskId, { assignedTo: userId })
    const user = authStore.allUsers.find(u => u.id === userId)
    uiStore.showSnackbar(`Task successfully assigned to ${user?.fullName || 'user'}`, 'success')
    await taskStore.fetchTasks({
      q: taskQuery.q || undefined,
      status: taskQuery.status === 'All' ? undefined : taskQuery.status,
    })
  } catch {
    uiStore.showSnackbar('Failed to assign task.', 'error')
  }
}

const handleDelete = async (taskId: string) => {
  try {
    await taskStore.deleteTask(taskId)
    uiStore.showSnackbar('Task permanently deleted from the system.', 'success')
    await taskStore.fetchTasks({
      q: taskQuery.q || undefined,
      status: taskQuery.status === 'All' ? undefined : taskQuery.status,
    })
  } catch {
    uiStore.showSnackbar('Failed to delete task.', 'error')
  }
}
</script>
