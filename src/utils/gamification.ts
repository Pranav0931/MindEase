
import { Achievement, HabitTracker, UserStats } from '@/types/gamification';
import { MoodEntry } from '@/types/mood';
import { getMoodEntries, getStreak } from './moodStorage';

const GAMIFICATION_STORAGE_KEY = 'mindease_user_stats';

const defaultAchievements: Achievement[] = [
  {
    id: 'first-checkin',
    title: 'First Steps',
    description: 'Complete your first mood check-in',
    icon: '🌱',
    type: 'mood',
    requirement: 1,
    isUnlocked: false,
    progress: 0
  },
  {
    id: 'week-warrior',
    title: 'Week Warrior',
    description: 'Maintain a 7-day mood tracking streak',
    icon: '🏆',
    type: 'streak',
    requirement: 7,
    isUnlocked: false,
    progress: 0
  },
  {
    id: 'mindful-month',
    title: 'Mindful Month',
    description: 'Track your mood for 30 days',
    icon: '🧘‍♀️',
    type: 'consistency',
    requirement: 30,
    isUnlocked: false,
    progress: 0
  },
  {
    id: 'reflection-master',
    title: 'Reflection Master',
    description: 'Add notes to 10 mood entries',
    icon: '✍️',
    type: 'reflection',
    requirement: 10,
    isUnlocked: false,
    progress: 0
  },
  {
    id: 'positivity-seeker',
    title: 'Positivity Seeker',
    description: 'Log 5 "Great" or "Good" moods',
    icon: '☀️',
    type: 'mood',
    requirement: 5,
    isUnlocked: false,
    progress: 0
  },
  {
    id: 'consistency-champion',
    title: 'Consistency Champion',
    description: 'Check in for 14 consecutive days',
    icon: '💪',
    type: 'streak',
    requirement: 14,
    isUnlocked: false,
    progress: 0
  }
];

const defaultHabits: HabitTracker[] = [
  {
    id: 'daily-mood',
    name: 'Daily Mood Check-in',
    icon: '😊',
    description: 'Track your mood every day',
    frequency: 'daily',
    completedDates: [],
    currentStreak: 0,
    bestStreak: 0,
    totalCompletions: 0
  },
  {
    id: 'gratitude-practice',
    name: 'Gratitude Practice',
    icon: '🙏',
    description: 'Practice gratitude regularly',
    frequency: 'daily',
    completedDates: [],
    currentStreak: 0,
    bestStreak: 0,
    totalCompletions: 0
  },
  {
    id: 'mindful-breathing',
    name: 'Mindful Breathing',
    icon: '🌬️',
    description: 'Take time for breathing exercises',
    frequency: 'daily',
    completedDates: [],
    currentStreak: 0,
    bestStreak: 0,
    totalCompletions: 0
  }
];

export const getUserStats = (): UserStats => {
  const stored = localStorage.getItem(GAMIFICATION_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }

  // Initialize new user stats
  const newStats: UserStats = {
    totalMoodEntries: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalReflections: 0,
    favoriteActivities: [],
    joinedDate: Date.now(),
    achievements: [...defaultAchievements],
    habits: [...defaultHabits]
  };

  localStorage.setItem(GAMIFICATION_STORAGE_KEY, JSON.stringify(newStats));
  return newStats;
};

export const updateUserStats = (newMoodEntry?: MoodEntry): { newAchievements: Achievement[] } => {
  const stats = getUserStats();
  const moodEntries = getMoodEntries();
  const currentStreak = getStreak();

  // Update basic stats
  stats.totalMoodEntries = moodEntries.length;
  stats.currentStreak = currentStreak;
  stats.longestStreak = Math.max(stats.longestStreak, currentStreak);
  stats.totalReflections = moodEntries.filter(entry => entry.note.trim().length > 0).length;

  // Update achievements
  const newAchievements: Achievement[] = [];
  
  stats.achievements.forEach(achievement => {
    if (achievement.isUnlocked) return;

    let progress = 0;
    
    switch (achievement.type) {
      case 'mood':
        if (achievement.id === 'first-checkin') {
          progress = Math.min(stats.totalMoodEntries, achievement.requirement);
        } else if (achievement.id === 'positivity-seeker') {
          progress = moodEntries.filter(entry => 
            entry.mood === 'great' || entry.mood === 'good'
          ).length;
        }
        break;
      case 'streak':
        progress = currentStreak;
        break;
      case 'consistency':
        progress = stats.totalMoodEntries;
        break;
      case 'reflection':
        progress = stats.totalReflections;
        break;
    }

    achievement.progress = progress;
    
    if (progress >= achievement.requirement && !achievement.isUnlocked) {
      achievement.isUnlocked = true;
      achievement.unlockedAt = Date.now();
      newAchievements.push(achievement);
    }
  });

  // Update daily mood habit
  if (newMoodEntry) {
    const moodHabit = stats.habits.find(habit => habit.id === 'daily-mood');
    if (moodHabit) {
      const today = new Date().toDateString();
      if (!moodHabit.completedDates.includes(today)) {
        moodHabit.completedDates.push(today);
        moodHabit.totalCompletions++;
        moodHabit.currentStreak = currentStreak;
        moodHabit.bestStreak = Math.max(moodHabit.bestStreak, currentStreak);
      }
    }
  }

  localStorage.setItem(GAMIFICATION_STORAGE_KEY, JSON.stringify(stats));
  return { newAchievements };
};

export const completeHabit = (habitId: string): void => {
  const stats = getUserStats();
  const habit = stats.habits.find(h => h.id === habitId);
  
  if (habit) {
    const today = new Date().toDateString();
    if (!habit.completedDates.includes(today)) {
      habit.completedDates.push(today);
      habit.totalCompletions++;
      
      // Calculate streak
      const sortedDates = habit.completedDates
        .map(date => new Date(date))
        .sort((a, b) => b.getTime() - a.getTime());
      
      let streak = 0;
      const today = new Date();
      
      for (let i = 0; i < sortedDates.length; i++) {
        const expectedDate = new Date(today);
        expectedDate.setDate(today.getDate() - i);
        
        if (sortedDates[i].toDateString() === expectedDate.toDateString()) {
          streak++;
        } else {
          break;
        }
      }
      
      habit.currentStreak = streak;
      habit.bestStreak = Math.max(habit.bestStreak, streak);
    }
  }
  
  localStorage.setItem(GAMIFICATION_STORAGE_KEY, JSON.stringify(stats));
};
