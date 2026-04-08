<template>
  <v-card rounded="xl" elevation="0" border>
    <v-data-table
      :headers="headers"
      :items="tasks"
      :search="search"
      :loading="loading"
      hover
      class="bg-transparent"
    >
      <template #[`item.title`]="{ item }">
        <div class="d-flex align-center">
          <v-icon
            v-if="isOverdue(item)"
            icon="mdi-alert-circle"
            color="error"
            size="small"
            class="mr-2"
          />
          <span :class="{ 'text-decoration-line-through text-medium-emphasis': item.status === 'completed' }">
            {{ item.title }}
          </span>
        </div>
      </template>

      <template #[`item.status`]="{ item }">
        <v-menu offset-y transition="scale-transition">
          <template #activator="{ props: menuProps }">
            <v-chip
              v-bind="menuProps"
              :color="getStatusColor(item.status)"
              size="small"
              variant="tonal"
              class="text-capitalize cursor-pointer"
              append-icon="mdi-chevron-down"
            >
              {{ item.status }}
            </v-chip>
          </template>
          <v-list density="compact">
            <v-list-item
              v-for="status in statusOptions"
              :key="status"
              :title="status"
              class="text-capitalize"
              @click="$emit('update-status', item.id, status)"
            />
          </v-list>
        </v-menu>
      </template>

      <template #[`item.priority`]="{ item }">
        <v-chip
          :color="getPriorityColor(item.priority)"
          size="x-small"
          variant="flat"
          class="text-capitalize font-weight-bold"
        >
          {{ item.priority }}
        </v-chip>
      </template>

      <template #[`item.dueDate`]="{ item }">
        <span :class="{ 'text-error font-weight-bold': isOverdue(item) }">
          {{ formatDate(item.dueDate) }}
        </span>
      </template>

      <template #[`item.actions`]="{ item }">
        <div class="d-flex ga-1">
          <v-btn
            icon="mdi-eye-outline"
            variant="text"
            size="small"
            color="medium-emphasis"
            @click="$emit('view-details', item)"
          />
          <v-btn
            icon="mdi-pencil-outline"
            variant="text"
            size="small"
            color="primary"
            :to="`/tasks/edit/${item.id}`"
          />
          <v-btn
            icon="mdi-trash-can-outline"
            variant="text"
            size="small"
            color="error"
            @click="$emit('confirm-delete', item)"
          />
        </div>
      </template>

      <template #no-data>
        <div class="py-12 d-flex flex-column align-center text-center">
          <v-icon icon="mdi-clipboard-text-outline" size="64" color="medium-emphasis" class="mb-4" />
          <h3 class="text-h6 font-weight-bold mb-1">No tasks found</h3>
          <p class="text-body-2 text-medium-emphasis mb-6">Create a new task or adjust your filters.</p>
          <v-btn color="primary" rounded="lg" to="/tasks/create">Create Task</v-btn>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import type { Task, TaskStatus } from '~/shared/types/task'
import { getStatusColor, getPriorityColor, formatDate, isOverdue } from '~/utils/task'

defineProps<{
  tasks: Task[]
  search: string
  loading: boolean
  headers: any[]
  statusOptions: TaskStatus[]
}>()

defineEmits(['update-status', 'view-details', 'confirm-delete'])
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
