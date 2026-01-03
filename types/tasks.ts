export type TaskCategory = 'work' | 'admin' | 'study' | 'health' | 'personal' | 'other';

export const CATEGORY_CONFIG: Record<TaskCategory, { label: string; color: string; bgColor: string; icon: string }> = {
  work: { label: 'Work', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)', icon: '💼' },
  admin: { label: 'Admin', color: '#64748b', bgColor: 'rgba(100, 116, 139, 0.1)', icon: '📋' },
  study: { label: 'Study', color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.1)', icon: '📖' },
  health: { label: 'Health', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)', icon: '🏋️' },
  personal: { label: 'Personal', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)', icon: '👤' },
  other: { label: 'Other', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)', icon: '📦' },
};

export interface Task {
  id: string;
  title: string;
  startTime?: Date;
  endTime?: Date;
  duration?: number; // in minutes
  isAllDay: boolean;
  isCompleted: boolean;
  category: TaskCategory;
  subtasks?: Task[];
  notes?: string;
  // Metadata for the "RPG" element
  xpReward?: number;
  statReward?: {
    capital?: number;
    intellect?: number;
    sovereignty?: number;
  };
}

export const getCategoryStats = (category: TaskCategory) => {
  switch (category) {
    case 'work':
      return { capital: 5, sovereignty: 2 };
    case 'admin':
      return { sovereignty: 5 };
    case 'study':
      return { intellect: 5 };
    case 'health':
      return { sovereignty: 3, intellect: 1 };
    default:
      return { sovereignty: 1 };
  }
};

export const SAMPLE_TASKS: Task[] = [
  {
    id: '1',
    title: 'Complete Project Proposal',
    category: 'work',
    isCompleted: false,
    isAllDay: false,
    duration: 60,
    startTime: new Date(),
  },
  {
    id: '2',
    title: 'Morning Gym Session',
    category: 'health',
    isCompleted: true,
    isAllDay: false,
    duration: 45,
    startTime: new Date(),
  },
  {
    id: '3',
    title: 'Read 20 pages',
    category: 'study',
    isCompleted: false,
    isAllDay: false,
    duration: 30,
    startTime: new Date(),
  }
];
