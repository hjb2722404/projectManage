export interface Task {
  id: number
  name: string
  type: string
  projectId: number | null
  description: string
  status: 'todo' | 'in-progress' | 'done'
  createdAt: string
  dueDate: string | null
  plannedCompletionDate: string | null
  actualCompletionDate: string | null
  progress: number // 0-100
  updatedAt: string
}