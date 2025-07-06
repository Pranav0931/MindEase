
import React, { useState, useEffect } from 'react';
import MoodTracker from '@/components/MoodTracker';
import SelfCareCard from '@/components/SelfCareCard';
import MoodHistory from '@/components/MoodHistory';
import StreakCounter from '@/components/StreakCounter';
import { MoodEntry } from '@/types/mood';
import { getMoodEntries, getStreak } from '@/utils/moodStorage';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [streak, setStreak] = useState(0);
  const [currentMood, setCurrentMood] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    const entries = getMoodEntries();
    setMoodEntries(entries);
    setStreak(getStreak());
  }, []);

  const handleMoodSaved = (newEntry: MoodEntry) => {
    const updatedEntries = [newEntry, ...moodEntries];
    setMoodEntries(updatedEntries);
    setStreak(getStreak());
    setCurrentMood(newEntry.mood);
    
    toast({
      title: "Mood saved! 💙",
      description: "Thank you for checking in with yourself today.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">MindEase</h1>
          <p className="text-gray-600">Your daily mental health companion</p>
        </div>

        {/* Streak Counter */}
        <StreakCounter streak={streak} />

        {/* Mood Tracker */}
        <MoodTracker onMoodSaved={handleMoodSaved} />

        {/* Self-Care Suggestion */}
        <SelfCareCard currentMood={currentMood} />

        {/* Mood History */}
        <MoodHistory entries={moodEntries.slice(0, 5)} />
      </div>
    </div>
  );
};

export default Index;
