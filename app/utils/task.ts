import type { Task, TaskPriority, TaskStatus } from '~/shared/types/task'

export const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case 'completed': return 'success'
    case 'in-progress': return 'primary'
    case 'pending': return 'warning'
    case 'overdue': return 'error'
    default: return 'grey'
  }
}

export const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case 'high': return 'error'
    case 'medium': return 'warning'
    case 'low': return 'success'
    default: return 'grey'
  }
}

export const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A'
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return dateStr
  }
}

export const isOverdue = (task: Task) => {
  if (task.status === 'completed') return false
  if (!task.dueDate) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueDate = new Date(task.dueDate)
  return dueDate < today
}
