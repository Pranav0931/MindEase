
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'streak' | 'mood' | 'reflection' | 'consistency';
  requirement: number;
  isUnlocked: boolean;
  unlockedAt?: number;
  progress: number;
}

export interface HabitTracker {
  id: string;
  name: string;
  icon: string;
  description: string;
  frequency: 'daily' | 'weekly';
  completedDates: string[];
  currentStreak: number;
  bestStreak: number;
  totalCompletions: number;
}

export interface UserStats {
  totalMoodEntries: number;
  currentStreak: number;
  longestStreak: number;
  totalReflections: number;
  favoriteActivities: string[];
  joinedDate: number;
  achievements: Achievement[];
  habits: HabitTracker[];
}
