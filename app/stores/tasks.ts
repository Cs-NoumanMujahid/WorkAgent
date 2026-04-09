import { defineStore } from 'pinia'
import type { Task } from '~/shared/types/task'
import { apiFetch } from '~/utils/api'

const DEFAULT_TASKS: Task[] = [
  {
    id: '1',
    title: 'Design Dashboard',
    description: 'Create Charts and add mock data',
    status: 'completed',
    priority: 'high',
    category: 'Design',
    dueDate: '2026-04-01',
    createdBy: '2',
    createdAt: '2026-03-01',
    updatedAt: '2026-03-01',
  },
  {
    id: '2',
    title: 'Fix login bug',
    description: 'Users cannot login on mobile',
    status: 'in-progress',
    priority: 'high',
    category: 'Development',
    dueDate: '2026-04-05',
    createdBy: '2',
    createdAt: '2026-03-02',
    updatedAt: '2026-03-02',
  },
  {
    id: '3',
    title: 'Write API documentation',
    description: 'Document all endpoints',
    status: 'pending',
    priority: 'medium',
    category: 'Documentation',
    dueDate: '2026-04-10',
    createdBy: '2',
    createdAt: '2026-03-03',
    updatedAt: '2026-03-03',
  },
  {
    id: '4',
    title: 'Automation',
    description: 'Automate deployment process',
    status: 'pending',
    priority: 'medium',
    category: 'DevOps',
    dueDate: '2026-03-01',
    createdBy: '2',
    createdAt: '2026-03-04',
    updatedAt: '2026-03-04',
  },
  {
    id: '5',
    title: 'Update dependencies',
    description: 'Update all npm packages',
    status: 'overdue',
    priority: 'low',
    category: 'Maintenance',
    dueDate: '2026-03-15',
    createdBy: '2',
    createdAt: '2026-03-05',
    updatedAt: '2026-03-05',
  },
  {
    id: '6',
    title: 'User testing session',
    description: 'Conduct usability testing',
    status: 'in-progress',
    priority: 'high',
    category: 'Research',
    dueDate: '2026-04-08',
    createdBy: '2',
    createdAt: '2026-03-06',
    updatedAt: '2026-03-06',
  },
]

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    allTasks: [] as Task[],
    initialized: false,
    loading: false,
  }),

  actions: {
    initTasks() {
      // keep a minimal fallback for SSR/first paint; API hydration happens after auth init
      if (this.initialized) return
      this.allTasks = DEFAULT_TASKS
      this.initialized = true
    },

    async fetchTasks(params: {
      q?: string
      status?: string
      priority?: string
      category?: string
      due_from?: string
      due_to?: string
      sort_by?: string
      sort_dir?: string
    } = {}) {
      this.loading = true
      try {
        const tasks = await apiFetch<Task[]>('/tasks', { query: params })
        this.allTasks = tasks
      } finally {
        this.loading = false
      }
    },

    addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) {
      throw new Error('Use createTask() with API')
    },

    async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) {
      const created = await apiFetch<Task>('/tasks', { method: 'POST', body: task })
      this.allTasks = [created, ...this.allTasks]
      return created
    },

    async updateTask(id: string, updates: Partial<Task>) {
      const updated = await apiFetch<Task>(`/tasks/${id}`, { method: 'PUT', body: updates })
      const idx = this.allTasks.findIndex(t => t.id === id)
      if (idx !== -1) this.allTasks[idx] = updated
      return updated
    },

    async deleteTask(id: string) {
      await apiFetch(`/tasks/${id}`, { method: 'DELETE' })
      this.allTasks = this.allTasks.filter(t => t.id !== id)
    },

    clearTasks() {
      this.allTasks = []
      this.initialized = false
    },

    assignTask(taskId: string, userId: string) {
      // handled via updateTask for API
    },
  },

  getters: {
    // Admin only: See all tasks in the system
    allSystemTasks: (state) => state.allTasks,

    tasks: (state) => {
      // server already filters by permissions; keep as-is
      return state.allTasks
    },

    totalTasks: (state) => {
      const authStore = useAuthStore()
      return state.allTasks.filter(t => t.createdBy === authStore.user?.id).length
    },

    completedTasks: (state) => {
      const authStore = useAuthStore()
      return state.allTasks.filter(t =>
        t.createdBy === authStore.user?.id && t.status === 'completed'
      ).length
    },

    pendingTasks: (state) => {
      const authStore = useAuthStore()
      return state.allTasks.filter(t =>
        t.createdBy === authStore.user?.id && t.status === 'pending'
      ).length
    },

    inProgressTasks: (state) => {
      const authStore = useAuthStore()
      return state.allTasks.filter(t =>
        t.createdBy === authStore.user?.id && t.status === 'in-progress'
      ).length
    },

    overdueTasks: (state) => {
      const authStore = useAuthStore()
      return state.allTasks.filter(t =>
        t.createdBy === authStore.user?.id && t.status === 'overdue'
      ).length
    },

    recentTasks: (state) => {
      const authStore = useAuthStore()
      return state.allTasks
        .filter(t => t.createdBy === authStore.user?.id)
        .slice()
        .reverse()
        .slice(0, 5)
    },
  }
})