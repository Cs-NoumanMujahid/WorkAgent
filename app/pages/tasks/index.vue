<template>
  <v-container fluid class="pa-6">
    <div class="mb-8 d-flex align-center justify-space-between flex-wrap ga-4">
      <div>
        <h1 class="text-h3 font-weight-bold mb-2">Tasks</h1>
        <p class="text-body-1 text-medium-emphasis">
          Basic list for now. Full CRUD comes next.
        </p>
      </div>

      <v-btn
        color="primary"
        variant="tonal"
        rounded="lg"
        class="text-none"
        prepend-icon="mdi-plus"
        to="/tasks/create"
      >
        New Task
      </v-btn>
    </div>

    <v-card rounded="xl" elevation="0" border class="pa-2">
      <v-list lines="two">
        <v-list-item
          v-for="t in taskStore.tasks"
          :key="t.id"
          :title="t.title"
          :subtitle="t.description"
        >
          <template #prepend>
            <v-icon
              :icon="t.status === 'completed' ? 'mdi-check-circle-outline' : 'mdi-checkbox-blank-circle-outline'"
              :color="t.status === 'completed' ? 'success' : 'primary'"
            />
          </template>

          <template #append>
            <v-chip size="small" variant="tonal" class="text-capitalize">
              {{ t.status }}
            </v-chip>
          </template>
        </v-list-item>

        <v-list-item v-if="taskStore.tasks.length === 0" title="No tasks yet." subtitle="Create your first task." />
      </v-list>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const taskStore = useTaskStore()
</script>

