<template>
  <v-dialog v-model="internalModel" max-width="400" persistent>
    <v-card rounded="xl" class="pa-4">
      <v-card-title class="text-h5 font-weight-bold">Confirm Delete</v-card-title>
      <v-card-text>
        Are you sure you want to delete "<strong>{{ task?.title }}</strong>"? This action cannot be undone.
      </v-card-text>
      <v-card-actions class="mt-4">
        <v-spacer />
        <v-btn variant="text" rounded="lg" @click="internalModel = false">Cancel</v-btn>
        <v-btn color="error" variant="flat" rounded="lg" @click="$emit('confirm')">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { Task } from '~/shared/types/task'

const props = defineProps<{
  modelValue: boolean
  task: Task | null
}>()

const emit = defineEmits(['update:modelValue', 'confirm'])

const internalModel = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>
