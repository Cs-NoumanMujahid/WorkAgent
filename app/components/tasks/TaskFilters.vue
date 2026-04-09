<template>
  <v-card rounded="xl" elevation="0" border class="pa-4 mb-6">
    <v-row align="center">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="internalSearch"
          label="Search tasks"
          placeholder="Title or keyword..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          rounded="lg"
          hide-details
          clearable
        />
      </v-col>
      <v-col cols="12" sm="4" md="2">
        <v-select
          v-model="internalStatus"
          label="Status"
          :items="['All', ...statusOptions]"
          variant="outlined"
          rounded="lg"
          hide-details
        />
      </v-col>
      <v-col cols="12" sm="4" md="2">
        <v-select
          v-model="internalPriority"
          label="Priority"
          :items="['All', ...priorityOptions]"
          variant="outlined"
          rounded="lg"
          hide-details
        />
      </v-col>
      <v-col cols="12" sm="4" md="2">
        <v-select
          v-model="internalCategory"
          label="Category"
          :items="['All', ...categories]"
          variant="outlined"
          rounded="lg"
          hide-details
        />
      </v-col>
      <v-col cols="12" md="2">
        <v-text-field
          v-model="internalDate"
          label="Due Date"
          type="date"
          variant="outlined"
          rounded="lg"
          hide-details
          clearable
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import type { TaskStatus, TaskPriority } from '~/shared/types/task'

const props = defineProps<{
  search: string
  status: string
  priority: string
  category: string
  date: string
  statusOptions: TaskStatus[]
  priorityOptions: TaskPriority[]
  categories: string[]
}>()

const emit = defineEmits(['update:search', 'update:status', 'update:priority', 'update:category', 'update:date'])

const internalSearch = computed({
  get: () => props.search,
  set: (val) => emit('update:search', val)
})

const internalStatus = computed({
  get: () => props.status,
  set: (val) => emit('update:status', val)
})

const internalPriority = computed({
  get: () => props.priority,
  set: (val) => emit('update:priority', val)
})

const internalCategory = computed({
  get: () => props.category,
  set: (val) => emit('update:category', val)
})

const internalDate = computed({
  get: () => props.date,
  set: (val) => emit('update:date', val)
})
</script>
