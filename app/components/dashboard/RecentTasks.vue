<template>
  <v-card rounded="xl" elevation="0" height="315"  class="hide-scrollbar" >
    <v-card-title class="pa-5 pb-0 text-body-1 font-weight-bold">
      Recent Tasks
    </v-card-title>

    <v-card-text class="pa-5">
      <div v-if="taskStore.recentTasks.length === 0" class="text-center py-8">
        <v-icon icon="mdi-checkbox-marked-outline mt-11" size="48" color="grey-lighten-1" />
        <p class="text-body-2 text-medium-emphasis mt-1">Have you created a task yet?</p>
      </div>

      <div v-else class="d-flex flex-column ga-3">
        <div
          v-for="task in taskStore.recentTasks"
          :key="task.id"
          class="d-flex align-center justify-space-between pa-3 rounded-lg"
          style="background-color: #f5f7fa;"
        >
          <div class="d-flex align-center ga-3">
            <v-icon
              :icon="task.status === 'completed' ? 'mdi-checkbox-marked-circle' : 'mdi-checkbox-blank-circle-outline'"
              :color="task.status === 'completed' ? 'success' : 'grey'"
              size="20"
            />
            <div>
              <p class="text-body-2 font-weight-medium ma-0" :class="{ 'text-decoration-line-through text-medium-emphasis': task.status === 'completed' }">
                {{ task.title }}
              </p>
              <p class="text-caption text-medium-emphasis ma-0">{{ task.category }} · Due {{ task.dueDate }}</p>
            </div>
          </div>

          <div class="d-flex align-center ga-2">
            <v-chip
              :color="priorityColor(task.priority)"
              size="x-small"
              rounded="lg"
              variant="tonal"
            >
              {{ task.priority }}
            </v-chip>
            <v-chip
              :color="statusColor(task.status)"
              size="x-small"
              rounded="lg"
              variant="tonal"
            >
              {{ task.status }}
            </v-chip>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { TaskPriority, TaskStatus } from '~/shared/types/task'

const taskStore = useTaskStore()

function priorityColor(priority: TaskPriority) {
  const map = { high: 'error', medium: 'warning', low: 'success' }
  return map[priority]
}

function statusColor(status: TaskStatus) {
  const map = {
    'completed': 'success',
    'in-progress': 'info',
    'pending': 'warning',
    'overdue': 'error',
  }
  return map[status]
}
</script>