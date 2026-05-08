export type QuadrantId = 'DO_FIRST' | 'SCHEDULE' | 'DELEGATE' | 'ELIMINATE';

export interface Task {
  id: string;
  content: string;
  completed: boolean;
  quadrantId: QuadrantId;
  createdAt: number;
  dueDate?: string;
  notes?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface QuadrantConfig {
  id: QuadrantId;
  title: string;
  description: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

export const QUADRANTS: QuadrantConfig[] = [
  {
    id: 'DO_FIRST',
    title: 'Urgent & Important',
    description: 'Do it now',
    colorClass: 'text-red-600',
    bgClass: 'bg-white',
    borderClass: 'border-red-500/20',
  },
  {
    id: 'SCHEDULE',
    title: 'Important, Not Urgent',
    description: 'Schedule a time',
    colorClass: 'text-blue-600',
    bgClass: 'bg-white',
    borderClass: 'border-blue-500/20',
  },
  {
    id: 'DELEGATE',
    title: 'Urgent, Not Important',
    description: 'Who can do it?',
    colorClass: 'text-orange-600',
    bgClass: 'bg-white',
    borderClass: 'border-orange-500/20',
  },
  {
    id: 'ELIMINATE',
    title: 'Not Urgent / Important',
    description: 'Archive or delete',
    colorClass: 'text-gray-500',
    bgClass: 'bg-gray-100/50',
    borderClass: 'border-gray-300',
  },
];
