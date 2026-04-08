import { defineStore } from 'pinia'
import type { Task } from '~/shared/types/task'
import { useAuthStore } from '~/stores/auth' // adjust path if yours differs

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
  }),

  actions: {
    getStorageKey() {
      const authStore = useAuthStore()
      const userId = authStore.user?.id || 'guest'
      return `work_agent_tasks_${userId}`
    },

    initTasks(force = false) {
      if (this.initialized && !force) return

      if (import.meta.client) {
        const key = this.getStorageKey()
        const stored = localStorage.getItem(key)

        this.allTasks = stored ? JSON.parse(stored) : DEFAULT_TASKS

        if (!stored) {
          localStorage.setItem(key, JSON.stringify(this.allTasks))
        }

        this.initialized = true
      } else {
        this.allTasks = DEFAULT_TASKS
      }
    },

    saveTasks() {
      if (!import.meta.client) return

      const key = this.getStorageKey()
      localStorage.setItem(key, JSON.stringify(this.allTasks))
    },

    addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) {
      const authStore = useAuthStore()

      const newTask: Task = {
        ...task,
        id: String(Date.now()),
        createdBy: authStore.user?.id || 'unknown',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      this.allTasks.push(newTask)
      this.saveTasks()
    },

    updateTask(id: string, updates: Partial<Task>) {
      const index = this.allTasks.findIndex(t => t.id === id)
      if (index !== -1) {
        this.allTasks[index] = {
          ...this.allTasks[index],
          ...updates,
          id,
          updatedAt: new Date().toISOString()
        } as Task
        this.saveTasks()
      }
    },

    deleteTask(id: string) {
      this.allTasks = this.allTasks.filter(t => t.id !== id)
      this.saveTasks()
    },

    clearTasks() {
      this.allTasks = []
      this.initialized = false
    },
  },

  getters: {
    tasks: (state) => {
      const authStore = useAuthStore()
      return state.allTasks.filter(t => t.createdBy === authStore.user?.id)
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