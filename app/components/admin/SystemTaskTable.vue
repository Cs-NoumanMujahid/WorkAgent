<template>
  <v-card rounded="xl" elevation="0" border class="overflow-hidden">
    <div class="pa-4 d-flex align-center justify-space-between border-b flex-wrap ga-3">
      <div class="d-flex align-center ga-3 flex-grow-1" style="max-width: 400px;">
        <v-text-field
          v-model="search"
          placeholder="Filter system tasks..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          rounded="lg"
          hide-details
          clearable
        />
      </div>
      <div class="d-flex align-center ga-2">
        <v-select
          v-model="statusFilter"
          :items="statusOptions"
          label="Status"
          density="compact"
          variant="outlined"
          hide-details
          rounded="lg"
          style="width: 140px;"
        />
      </div>
    </div>

    <v-data-table
      :headers="headers"
      :items="filteredTasks"
      :search="search"
      class="bg-transparent"
      hover
    >
      <template #[`item.title`]="{ item }">
        <div class="py-2">
          <div class="text-body-2 font-weight-bold">{{ item.title }}</div>
          <div class="text-caption text-medium-emphasis text-truncate" style="max-width: 250px;">
            {{ item.description }}
          </div>
        </div>
      </template>

      <template #[`item.assignedTo`]="{ item }">
        <div class="d-flex align-center justify-center">
          <v-menu offset-y transition="scale-transition">
            <template #activator="{ props: menuProps }">
              <div v-bind="menuProps" class="cursor-pointer">
                <AdminAvatarGroupWrapper
                  :users="getAssignedUsers(item)"
                  :max="1"
                  :size="28"
                  v-if="item.assignedTo"
                />
                <v-btn
                  v-else
                  icon="mdi-account-plus-outline"
                  variant="text"
                  size="x-small"
                  color="medium-emphasis"
                />
              </div>
            </template>
            <v-list density="compact" max-height="300">
              <v-list-subheader>Assign to</v-list-subheader>
              <v-list-item
                v-for="user in authStore.allUsers"
                :key="user.id"
                @click="$emit('assign-task', item.id, user.id)"
              >
                <template #prepend>
                  <v-avatar size="24">
                    <v-img v-if="user.avatar" :src="user.avatar" />
                    <v-icon v-else icon="mdi-account" />
                  </v-avatar>
                </template>
                <v-list-item-title class="text-caption">{{ user.fullName }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </template>

      <template #[`item.status`]="{ item }">
        <v-chip
          :color="getStatusColor(item.status)"
          size="x-small"
          class="text-uppercase font-weight-bold"
          variant="flat"
        >
          {{ item.status }}
        </v-chip>
      </template>

      <template #[`item.priority`]="{ item }">
        <v-icon
          :icon="getPriorityIcon(item.priority)"
          :color="getPriorityColor(item.priority)"
          size="small"
        />
      </template>

      <template #[`item.actions`]="{ item }">
        <v-btn
          icon="mdi-trash-can-outline"
          variant="text"
          size="small"
          color="error"
          @click="$emit('delete-task', item.id)"
        />
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import type { Task, TaskStatus } from '~/shared/types/task'
import { getStatusColor, getPriorityColor } from '~/utils/task'

const authStore = useAuthStore()

const props = defineProps<{
  tasks: Task[]
}>()

defineEmits(['assign-task', 'delete-task'])

const search = ref('')
const statusFilter = ref('All')
const statusOptions = ['All', 'pending', 'in-progress', 'completed', 'overdue']

const headers = [
  { title: 'Task Details', key: 'title', align: 'start' as const },
  { title: 'Assignee', key: 'assignedTo', align: 'center' as const, sortable: false },
  { title: 'Priority', key: 'priority', align: 'center' as const },
  { title: 'Status', key: 'status', align: 'center' as const },
  { title: 'Actions', key: 'actions', align: 'end' as const, sortable: false },
]

const filteredTasks = computed(() => {
  return props.tasks.filter(t => {
    const matchesStatus = statusFilter.value === 'All' || t.status === statusFilter.value
    return matchesStatus
  })
})

const getAssignedUsers = (task: Task) => {
  if (!task.assignedTo) return []
  const user = authStore.allUsers.find(u => u.id === task.assignedTo)
  return user ? [user] : []
}

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case 'high': return 'mdi-chevron-double-up'
    case 'medium': return 'mdi-chevron-up'
    case 'low': return 'mdi-chevron-down'
    default: return 'mdi-minus'
  }
}
</script>
