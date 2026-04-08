<template>
  <v-dialog v-model="internalModel" max-width="600">
    <v-card v-if="task" rounded="xl" border class="pa-6">
      <div class="d-flex justify-space-between align-start mb-4">
        <div>
          <div class="d-flex align-center ga-2 mb-2">
            <v-chip :color="getStatusColor(task.status)" size="small" variant="tonal" class="text-capitalize">
              {{ task.status }}
            </v-chip>
            <v-chip :color="getPriorityColor(task.priority)" size="x-small" variant="flat" class="text-capitalize">
              {{ task.priority }} Priority
            </v-chip>
          </div>
          <h2 class="text-h4 font-weight-bold">{{ task.title }}</h2>
        </div>
        <v-btn icon="mdi-close" variant="text" @click="internalModel = false" />
      </div>

      <div class="mb-6">
        <div class="text-subtitle-2 text-medium-emphasis mb-1">Description</div>
        <div class="text-body-1 whitespace-pre-wrap">{{ task.description }}</div>
      </div>

      <v-row>
        <v-col cols="6" sm="3">
          <div class="text-caption text-medium-emphasis">Category</div>
          <div class="font-weight-medium">{{ task.category }}</div>
        </v-col>
        <v-col cols="6" sm="3">
          <div class="text-caption text-medium-emphasis">Due Date</div>
          <div class="font-weight-medium" :class="{ 'text-error': isOverdue(task) }">
            {{ formatDate(task.dueDate) }}
          </div>
        </v-col>
        <v-col cols="6" sm="3">
          <div class="text-caption text-medium-emphasis">Created At</div>
          <div class="font-weight-medium text-caption">{{ formatDate(task.createdAt) }}</div>
        </v-col>
        <v-col cols="6" sm="3">
          <div class="text-caption text-medium-emphasis">Updated At</div>
          <div class="font-weight-medium text-caption">{{ formatDate(task.updatedAt) }}</div>
        </v-col>
      </v-row>

      <v-divider class="my-6" />

      <div class="d-flex justify-end ga-3">
        <v-btn
          prepend-icon="mdi-pencil-outline"
          variant="tonal"
          color="primary"
          rounded="lg"
          :to="`/tasks/edit/${task.id}`"
        >
          Edit Task
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { Task } from '~/shared/types/task'
import { getStatusColor, getPriorityColor, formatDate, isOverdue } from '~/utils/task'

const props = defineProps<{
  modelValue: boolean
  task: Task | null
}>()

const emit = defineEmits(['update:modelValue'])

const internalModel = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<style scoped>
.whitespace-pre-wrap {
  white-space: pre-wrap;
}
</style>
