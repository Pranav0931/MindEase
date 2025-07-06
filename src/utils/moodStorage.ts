
import { MoodEntry } from '@/types/mood';

const MOOD_STORAGE_KEY = 'mindease_mood_entries';

export const saveMoodEntry = (entry: MoodEntry): void => {
  const existingEntries = getMoodEntries();
  const updatedEntries = [entry, ...existingEntries];
  localStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(updatedEntries));
};

export const getMoodEntries = (): MoodEntry[] => {
  const stored = localStorage.getItem(MOOD_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getStreak = (): number => {
  const entries = getMoodEntries();
  if (entries.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  const todayString = today.toDateString();

  // Check if user logged mood today
  const todayEntry = entries.find(entry => 
    new Date(entry.timestamp).toDateString() === todayString
  );

  if (!todayEntry) return 0;

  // Count consecutive days
  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const checkDateString = checkDate.toDateString();

    const hasEntry = entries.some(entry => 
      new Date(entry.timestamp).toDateString() === checkDateString
    );

    if (hasEntry) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

export const generateMoodId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};
