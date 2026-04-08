<template>
  <v-container fluid class="pa-6">
    <div class="mb-8">
      <h1 class="text-h3 font-weight-bold mb-2">Admin Dashboard</h1>
      <p class="text-body-1 text-medium-emphasis">System-wide performance and user metrics.</p>
    </div>

    <!-- Quick Stats -->
    <v-row class="mb-8">
      <v-col cols="12" sm="6" md="3">
        <AdminStatCard
          label="Total Users"
          :value="authStore.allUsers.length"
          icon="mdi-account-group"
          color="primary"
          :trend="12"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <AdminStatCard
          label="All Tasks"
          :value="taskStore.allSystemTasks.length"
          icon="mdi-clipboard-text-outline"
          color="info"
          :trend="5"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <AdminStatCard
          label="Overdue Tasks"
          :value="overdueCount"
          icon="mdi-alert-circle"
          color="error"
          :trend="-2"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <AdminStatCard
          label="Active Admins"
          :value="adminCount"
          icon="mdi-shield-check"
          color="success"
        />
      </v-col>
    </v-row>

    <v-row>
      <!-- Overdue Tasks -->
      <v-col cols="12" lg="4">
        <v-card rounded="xl" elevation="0" border class="pa-6 h-100">
          <div class="d-flex align-center justify-space-between mb-6">
            <h2 class="text-h5 font-weight-bold text-error">Overdue Tasks</h2>
            <v-chip color="error" size="x-small" variant="flat">{{ overdueTasks.length }}</v-chip>
          </div>
          <v-list density="compact">
            <v-list-item
              v-for="task in overdueTasks.slice(0, 5)"
              :key="task.id"
              class="px-0 py-2 border-b"
            >
              <v-list-item-title class="text-body-2 font-weight-bold">{{ task.title }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption text-error">Due: {{ task.dueDate }}</v-list-item-subtitle>
              <template #append>
                <AdminAvatarGroupWrapper
                  v-if="task.assignedTo"
                  :users="[authStore.allUsers.find(u => u.id === task.assignedTo)].filter(Boolean) as any"
                  :size="24"
                />
              </template>
            </v-list-item>
            <v-list-item v-if="overdueTasks.length === 0" class="text-center py-8">
              <v-icon icon="mdi-check-circle-outline" color="success" size="large" class="mb-2" />
              <div class="text-caption text-medium-emphasis">No overdue tasks!</div>
            </v-list-item>
          </v-list>
          <v-btn v-if="overdueTasks.length > 5" to="/admin/tasks" variant="text" color="primary" block size="small" class="mt-4">View All</v-btn>
        </v-card>
      </v-col>

      <!-- Pending/Active Tasks -->
      <v-col cols="12" lg="4">
        <v-card rounded="xl" elevation="0" border class="pa-6 h-100">
          <div class="d-flex align-center justify-space-between mb-6">
            <h2 class="text-h5 font-weight-bold">Active Tasks</h2>
            <v-chip color="primary" size="x-small" variant="flat">{{ activeTasks.length }}</v-chip>
          </div>
          <v-list density="compact">
            <v-list-item
              v-for="task in activeTasks.slice(0, 5)"
              :key="task.id"
              class="px-0 py-2 border-b"
            >
              <v-list-item-title class="text-body-2 font-weight-bold">{{ task.title }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption">Status: {{ task.status }}</v-list-item-subtitle>
              <template #append>
                <AdminAvatarGroupWrapper
                  v-if="task.assignedTo"
                  :users="[authStore.allUsers.find(u => u.id === task.assignedTo)].filter(Boolean) as any"
                  :size="24"
                />
              </template>
            </v-list-item>
            <v-list-item v-if="activeTasks.length === 0" class="text-center py-8">
              <div class="text-caption text-medium-emphasis">No active tasks.</div>
            </v-list-item>
          </v-list>
          <v-btn v-if="activeTasks.length > 5" to="/admin/tasks" variant="text" color="primary" block size="small" class="mt-4">View All</v-btn>
        </v-card>
      </v-col>

      <!-- Recent Users -->
      <v-col cols="12" lg="4">
        <v-card rounded="xl" elevation="0" border class="pa-6 h-100">
          <div class="d-flex align-center justify-space-between mb-6">
            <h2 class="text-h5 font-weight-bold">Registered Users</h2>
            <v-icon icon="mdi-account-group" color="primary" />
          </div>
          <v-list density="compact">
            <v-list-item
              v-for="user in recentUsers"
              :key="user.id"
              class="px-0 py-2 border-b"
            >
              <template #prepend>
                <v-avatar size="36" color="grey-lighten-4">
                  <v-img v-if="user.avatar" :src="user.avatar" />
                  <span v-else class="text-caption font-weight-bold">{{ user.fullName[0] }}</span>
                </v-avatar>
              </template>
              <v-list-item-title class="text-body-2 font-weight-bold">{{ user.fullName }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption">{{ user.email }}</v-list-item-subtitle>
              <template #append>
                <v-chip size="x-small" class="text-uppercase" variant="tonal">{{ user.role }}</v-chip>
              </template>
            </v-list-item>
          </v-list>
          <v-btn to="/admin/users" variant="text" color="primary" block size="small" class="mt-4">Manage Users</v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin' })

const authStore = useAuthStore()
const taskStore = useTaskStore()

onMounted(() => {
  authStore.fetchUsers()
  taskStore.initTasks()
})

const overdueCount = computed(() => {
  return taskStore.allSystemTasks.filter(t => t.status === 'overdue').length
})

const adminCount = computed(() => {
  return authStore.allUsers.filter(u => u.role === 'admin').length
})

const overdueTasks = computed(() => {
  return taskStore.allSystemTasks.filter(t => t.status === 'overdue')
})

const activeTasks = computed(() => {
  return taskStore.allSystemTasks.filter(t => t.status === 'in-progress' || t.status === 'pending')
})

const recentUsers = computed(() => {
  return [...authStore.allUsers].reverse().slice(0, 5)
})
</script>
