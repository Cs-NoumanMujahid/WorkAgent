export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'overdue'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  category: string
  dueDate: string
  createdBy: string
  assignedTo?: string
  createdAt: string
  updatedAt: string
}