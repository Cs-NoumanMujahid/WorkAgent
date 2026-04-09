<template>
  <v-row>
    <v-col
      v-for="task in tasks"
      :key="task.id"
      cols="12"
      sm="6"
      lg="4"
    >
      <v-card
        rounded="xl"
        elevation="0"
        border
        class="h-100 d-flex flex-column transition-swing overflow-hidden"
        :class="{ 'border-error border-opacity-100': isOverdue(task) }"
        hover
      >
        <div class="pa-5 flex-grow-1">
          <div class="d-flex align-start justify-space-between mb-3">
            <v-chip
              :color="getPriorityColor(task.priority)"
              size="x-small"
              variant="flat"
              class="text-uppercase font-weight-black"
            >
              {{ task.priority }}
            </v-chip>
            <div class="d-flex ga-1">
              <v-btn
                icon="mdi-pencil-outline"
                variant="text"
                size="x-small"
                :to="`/tasks/edit/${task.id}`"
              />
              <v-btn
                icon="mdi-trash-can-outline"
                variant="text"
                size="x-small"
                color="error"
                @click="$emit('confirm-delete', task)"
              />
            </div>
          </div>

          <h3 class="text-h6 font-weight-bold mb-1 text-truncate" :class="{ 'text-decoration-line-through text-medium-emphasis': task.status === 'completed' }">
            {{ task.title }}
          </h3>
          <p class="text-body-2 text-medium-emphasis mb-4 line-clamp-2" style="height: 40px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; line-clamp: 2;">
            {{ task.description }}
          </p>

          <div class="d-flex align-center ga-4 mb-4">
            <div class="d-flex align-center ga-1 text-caption text-medium-emphasis">
              <v-icon icon="mdi-calendar-range" size="small" />
              <span :class="{ 'text-error font-weight-bold': isOverdue(task) }">{{ formatDate(task.dueDate) }}</span>
            </div>
            <div class="d-flex align-center ga-1 text-caption text-medium-emphasis">
              <v-icon icon="mdi-tag-outline" size="small" />
              <span>{{ task.category }}</span>
            </div>
          </div>
        </div>

        <v-divider />

        <div class="pa-3 d-flex align-center justify-space-between bg-grey-lighten-5">
          <v-menu transition="scale-transition">
            <template #activator="{ props: menuProps }">
              <v-chip
                v-bind="menuProps"
                :color="getStatusColor(task.status)"
                size="small"
                variant="tonal"
                append-icon="mdi-chevron-down"
              >
                {{ task.status }}
              </v-chip>
            </template>
            <v-list density="compact">
              <v-list-item
                v-for="status in statusOptions"
                :key="status"
                :title="status"
                class="text-capitalize"
                @click="$emit('update-status', task.id, status)"
              />
            </v-list>
          </v-menu>

          <v-btn
            variant="text"
            color="primary"
            size="small"
            class="text-none"
            @click="$emit('view-details', task)"
          >
            Details
          </v-btn>
        </div>
      </v-card>
    </v-col>

    <v-col v-if="tasks.length === 0" cols="12">
      <v-card rounded="xl" border elevation="0" class="pa-12 text-center">
        <v-icon icon="mdi-magnify-remove-outline" size="64" color="medium-emphasis" class="mb-4" />
        <h3 class="text-h6 font-weight-bold">No tasks matching criteria</h3>
        <p class="text-body-2 text-medium-emphasis">Try adjusting your search or filters.</p>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { Task, TaskStatus } from '~/shared/types/task'
import { getStatusColor, getPriorityColor, formatDate, isOverdue } from '~/utils/task'

defineProps<{
  tasks: Task[]
  statusOptions: TaskStatus[]
}>()

defineEmits(['update-status', 'view-details', 'confirm-delete'])
</script>
