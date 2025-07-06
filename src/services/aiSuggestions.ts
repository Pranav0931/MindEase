
import { MoodEntry } from '@/types/mood';

export interface PersonalizedSuggestion {
  id: string;
  type: 'activity' | 'journal_prompt' | 'breathing' | 'mindfulness';
  title: string;
  description: string;
  duration?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export interface JournalPrompt {
  id: string;
  prompt: string;
  category: 'reflection' | 'gratitude' | 'goals' | 'emotions';
  mood?: string;
}

// Simulate AI-driven suggestions based on mood patterns and history
export const getPersonalizedSuggestions = (
  currentMood: string,
  recentEntries: MoodEntry[],
  timeOfDay: 'morning' | 'afternoon' | 'evening'
): PersonalizedSuggestion[] => {
  const suggestions: PersonalizedSuggestion[] = [];

  // Mood-specific suggestions
  if (currentMood === 'anxious') {
    suggestions.push({
      id: 'breathing-4-7-8',
      type: 'breathing',
      title: '4-7-8 Breathing Exercise',
      description: 'A proven technique to calm anxiety. Inhale for 4, hold for 7, exhale for 8.',
      duration: '5 minutes',
      difficulty: 'easy',
      tags: ['anxiety', 'breathing', 'quick']
    });
    suggestions.push({
      id: 'progressive-relaxation',
      type: 'activity',
      title: 'Progressive Muscle Relaxation',
      description: 'Tense and release each muscle group to reduce physical anxiety.',
      duration: '15 minutes',
      difficulty: 'medium',
      tags: ['anxiety', 'relaxation', 'body']
    });
  }

  if (currentMood === 'down') {
    suggestions.push({
      id: 'gratitude-practice',
      type: 'activity',
      title: 'Three Good Things',
      description: 'Write down three things that went well today and why they were meaningful.',
      duration: '10 minutes',
      difficulty: 'easy',
      tags: ['gratitude', 'reflection', 'positive']
    });
    suggestions.push({
      id: 'gentle-movement',
      type: 'activity',
      title: 'Gentle Movement',
      description: 'Take a slow walk or do some light stretching to boost your mood.',
      duration: '10-20 minutes',
      difficulty: 'easy',
      tags: ['movement', 'mood-boost', 'gentle']
    });
  }

  // Time-based suggestions
  if (timeOfDay === 'morning') {
    suggestions.push({
      id: 'morning-intention',
      type: 'mindfulness',
      title: 'Set Morning Intention',
      description: 'Take a moment to set a positive intention for your day ahead.',
      duration: '3 minutes',
      difficulty: 'easy',
      tags: ['morning', 'intention', 'mindfulness']
    });
  }

  if (timeOfDay === 'evening') {
    suggestions.push({
      id: 'evening-reflection',
      type: 'journal_prompt',
      title: 'Evening Reflection',
      description: 'Reflect on your day and acknowledge one thing you did well.',
      duration: '10 minutes',
      difficulty: 'easy',
      tags: ['evening', 'reflection', 'self-compassion']
    });
  }

  // Pattern-based suggestions (analyze recent entries)
  const recentMoods = recentEntries.slice(0, 3).map(entry => entry.mood);
  if (recentMoods.every(mood => mood === 'anxious' || mood === 'down')) {
    suggestions.push({
      id: 'self-compassion',
      type: 'mindfulness',
      title: 'Self-Compassion Break',
      description: 'Practice being kind to yourself during this difficult time.',
      duration: '8 minutes',
      difficulty: 'medium',
      tags: ['self-compassion', 'difficult-times', 'kindness']
    });
  }

  return suggestions.slice(0, 3); // Return top 3 suggestions
};

export const getJournalPrompts = (
  currentMood: string,
  category?: 'reflection' | 'gratitude' | 'goals' | 'emotions'
): JournalPrompt[] => {
  const allPrompts: JournalPrompt[] = [
    // Reflection prompts
    { id: '1', prompt: 'What challenged me today, and how did I handle it?', category: 'reflection' },
    { id: '2', prompt: 'What am I learning about myself lately?', category: 'reflection' },
    { id: '3', prompt: 'How have I grown in the past week?', category: 'reflection' },
    
    // Gratitude prompts
    { id: '4', prompt: 'What small moment brought me joy today?', category: 'gratitude' },
    { id: '5', prompt: 'Who am I grateful for and why?', category: 'gratitude' },
    { id: '6', prompt: 'What part of my daily routine am I most thankful for?', category: 'gratitude' },
    
    // Goals prompts
    { id: '7', prompt: 'What small step can I take tomorrow toward my goals?', category: 'goals' },
    { id: '8', prompt: 'What would I do if I knew I couldn\'t fail?', category: 'goals' },
    { id: '9', prompt: 'How can I be kinder to myself this week?', category: 'goals' },
    
    // Emotions prompts
    { id: '10', prompt: 'What emotions am I feeling right now, and where do I feel them in my body?', category: 'emotions', mood: 'anxious' },
    { id: '11', prompt: 'What would I tell a friend who was feeling the way I feel right now?', category: 'emotions', mood: 'down' },
    { id: '12', prompt: 'What activities make me feel most like myself?', category: 'emotions' },
  ];

  let filteredPrompts = allPrompts;
  
  if (category) {
    filteredPrompts = allPrompts.filter(prompt => prompt.category === category);
  }
  
  if (currentMood) {
    const moodSpecific = filteredPrompts.filter(prompt => prompt.mood === currentMood);
    if (moodSpecific.length > 0) {
      return moodSpecific;
    }
  }
  
  return filteredPrompts.slice(0, 3);
};
