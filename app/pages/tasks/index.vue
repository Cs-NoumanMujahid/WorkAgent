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
      :search="''"
      :loading="loading"
      :headers="headers"
      :status-options="statusOptions"
      @update-status="updateStatus"
      @view-details="viewDetails"
      @confirm-delete="confirmDelete"
      @options-change="handleOptionsChange"
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
const sortBy = ref<string>('updatedAt')
const sortDir = ref<'asc' | 'desc'>('desc')

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

const filteredTasks = computed(() => taskStore.tasks)

let searchTimer: any = null
const fetchFromApi = async () => {
  loading.value = true
  try {
    const due = filterDate.value || undefined
    await taskStore.fetchTasks({
      q: search.value || undefined,
      status: filterStatus.value === 'All' ? undefined : filterStatus.value,
      priority: filterPriority.value === 'All' ? undefined : filterPriority.value,
      category: filterCategory.value === 'All' ? undefined : filterCategory.value,
      due_from: due,
      due_to: due,
      sort_by: sortBy.value,
      sort_dir: sortDir.value,
    })
  } catch {
    uiStore.showSnackbar('Failed to load tasks.', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchFromApi()
})

watch([filterStatus, filterPriority, filterCategory, filterDate, sortBy, sortDir], async () => {
  await fetchFromApi()
})

watch(search, () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    fetchFromApi()
  }, 250)
})

const handleOptionsChange = (opts: any) => {
  const s = opts?.sortBy?.[0]
  if (!s?.key) return
  // backend expects camelCase keys like dueDate/createdAt/updatedAt
  sortBy.value = s.key
  sortDir.value = s.order === 'asc' ? 'asc' : 'desc'
}

const updateStatus = async (id: string, status: TaskStatus) => {
  try {
    await taskStore.updateTask(id, { status })
    uiStore.showSnackbar(`Status updated to ${status}`, 'success')
    await fetchFromApi()
  } catch {
    uiStore.showSnackbar('Failed to update status.', 'error')
  }
}

const viewDetails = (task: Task) => {
  selectedTask.value = task
  detailsDialog.value = true
}

const confirmDelete = (task: Task) => {
  selectedTask.value = task
  deleteDialog.value = true
}

const handleDelete = async () => {
  if (selectedTask.value) {
    try {
      await taskStore.deleteTask(selectedTask.value.id)
      uiStore.showSnackbar('Task deleted successfully', 'success')
      deleteDialog.value = false
      selectedTask.value = null
      await fetchFromApi()
    } catch {
      uiStore.showSnackbar('Failed to delete task.', 'error')
    }
  }
}
</script>
