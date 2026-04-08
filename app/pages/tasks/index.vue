<template>
  <v-container fluid class="pa-6">
    <!-- Header -->
    <div class="mb-8 d-flex align-center justify-space-between flex-wrap ga-4">
      <div>
        <h1 class="text-h3 font-weight-bold mb-2">Tasks</h1>
        <p class="text-body-1 text-medium-emphasis">
          Manage, filter, and track your tasks effectively.
        </p>
      </div>

      <div class="d-flex align-center ga-3">
        <v-btn-toggle
          v-model="viewMode"
          mandatory
          variant="outlined"
          divided
          rounded="lg"
          color="primary"
        >
          <v-btn value="table" icon="mdi-table" />
          <v-btn value="card" icon="mdi-view-grid" />
        </v-btn-toggle>

        <v-btn
          color="primary"
          rounded="lg"
          class="text-none"
          prepend-icon="mdi-plus"
          to="/tasks/create"
        >
          New Task
        </v-btn>
      </div>
    </div>

    <!-- Filters & Search -->
    <TasksTaskFilters
      v-model:search="search"
      v-model:status="filterStatus"
      v-model:priority="filterPriority"
      v-model:category="filterCategory"
      v-model:date="filterDate"
      :status-options="statusOptions"
      :priority-options="priorityOptions"
      :categories="categories"
    />

    <!-- Table View -->
    <TasksTaskTableView
      v-if="viewMode === 'table'"
      :tasks="filteredTasks"
      :search="search"
      :loading="loading"
      :headers="headers"
      :status-options="statusOptions"
      @update-status="updateStatus"
      @view-details="viewDetails"
      @confirm-delete="confirmDelete"
    />

    <!-- Card View -->
    <TasksTaskCardView
      v-else
      :tasks="filteredTasks"
      :status-options="statusOptions"
      @update-status="updateStatus"
      @view-details="viewDetails"
      @confirm-delete="confirmDelete"
    />

    <!-- Delete Confirmation Dialog -->
    <TasksDeleteConfirmDialog
      v-model="deleteDialog"
      :task="selectedTask"
      @confirm="handleDelete"
    />

    <!-- Details Dialog -->
    <TasksTaskDetailsDialog
      v-model="detailsDialog"
      :task="selectedTask"
    />
  </v-container>
</template>

<script setup lang="ts">
import type { Task, TaskPriority, TaskStatus } from '~/shared/types/task'

definePageMeta({ middleware: 'auth' })

const taskStore = useTaskStore()
const uiStore = useUiStore()

const search = ref('')
const viewMode = ref<'table' | 'card'>('table')
const loading = ref(false)

const filterStatus = ref('All')
const filterPriority = ref('All')
const filterCategory = ref('All')
const filterDate = ref('')

const deleteDialog = ref(false)
const detailsDialog = ref(false)
const selectedTask = ref<Task | null>(null)

const statusOptions: TaskStatus[] = ['pending', 'in-progress', 'completed', 'overdue']
const priorityOptions: TaskPriority[] = ['low', 'medium', 'high']

const headers = [
  { title: 'Task Title', key: 'title', align: 'start' as const, sortable: true },
  { title: 'Category', key: 'category', align: 'start' as const, sortable: true },
  { title: 'Due Date', key: 'dueDate', align: 'start' as const, sortable: true },
  { title: 'Priority', key: 'priority', align: 'center' as const, sortable: true },
  { title: 'Status', key: 'status', align: 'center' as const, sortable: true },
  { title: 'Actions', key: 'actions', align: 'end' as const, sortable: false },
]

const categories = computed(() => {
  const cats = new Set(taskStore.tasks.map(t => t.category))
  return Array.from(cats).sort()
})

const filteredTasks = computed(() => {
  return taskStore.tasks.filter(t => {
    const matchesSearch = !search.value || 
      t.title.toLowerCase().includes(search.value.toLowerCase()) ||
      t.description.toLowerCase().includes(search.value.toLowerCase()) ||
      t.category.toLowerCase().includes(search.value.toLowerCase())
    
    const matchesStatus = filterStatus.value === 'All' || t.status === filterStatus.value
    const matchesPriority = filterPriority.value === 'All' || t.priority === filterPriority.value
    const matchesCategory = filterCategory.value === 'All' || t.category === filterCategory.value
    const matchesDate = !filterDate.value || t.dueDate === filterDate.value

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesDate
  })
})

const updateStatus = (id: string, status: TaskStatus) => {
  taskStore.updateTask(id, { status })
  uiStore.showSnackbar(`Status updated to ${status}`, 'success')
}

const viewDetails = (task: Task) => {
  selectedTask.value = task
  detailsDialog.value = true
}

const confirmDelete = (task: Task) => {
  selectedTask.value = task
  deleteDialog.value = true
}

const handleDelete = () => {
  if (selectedTask.value) {
    taskStore.deleteTask(selectedTask.value.id)
    uiStore.showSnackbar('Task deleted successfully', 'success')
    deleteDialog.value = false
    selectedTask.value = null
  }
}
</script>
