export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  categoryId?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: number;
  updatedAt: number;
}