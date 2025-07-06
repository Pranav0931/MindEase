
export interface MoodEntry {
  id: string;
  mood: string;
  note: string;
  timestamp: number;
  date: string;
}

export type MoodEmoji = '😊' | '😌' | '😐' | '😔' | '😰';

export interface SelfCareSuggestion {
  id: string;
  title: string;
  description: string;
  mood?: string;
}
