export type Priority = 'baixa' | 'normal' | 'alta';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  priority?: Priority;
  category?: string;
}

export type FilterType = 'all' | 'pending' | 'completed';
