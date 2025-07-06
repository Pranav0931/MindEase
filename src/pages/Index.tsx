
import React, { useState, useEffect } from 'react';
import MoodTracker from '@/components/MoodTracker';
import SelfCareCard from '@/components/SelfCareCard';
import MoodHistory from '@/components/MoodHistory';
import StreakCounter from '@/components/StreakCounter';
import PersonalizedSuggestions from '@/components/PersonalizedSuggestions';
import AchievementBadges from '@/components/AchievementBadges';
import JournalPrompts from '@/components/JournalPrompts';
import { MoodEntry } from '@/types/mood';
import { getMoodEntries, getStreak } from '@/utils/moodStorage';
import { updateUserStats } from '@/utils/gamification';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [streak, setStreak] = useState(0);
  const [currentMood, setCurrentMood] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'home' | 'journal' | 'achievements'>('home');
  const { toast } = useToast();

  useEffect(() => {
    const entries = getMoodEntries();
    setMoodEntries(entries);
    setStreak(getStreak());
    
    // Set current mood from today's entry if it exists
    const today = new Date().toDateString();
    const todayEntry = entries.find(entry => 
      new Date(entry.timestamp).toDateString() === today
    );
    if (todayEntry) {
      setCurrentMood(todayEntry.mood);
    }
  }, []);

  const handleMoodSaved = (newEntry: MoodEntry) => {
    const updatedEntries = [newEntry, ...moodEntries];
    setMoodEntries(updatedEntries);
    setStreak(getStreak());
    setCurrentMood(newEntry.mood);
    
    // Update gamification stats and check for new achievements
    const { newAchievements } = updateUserStats(newEntry);
    
    // Show achievement notifications
    newAchievements.forEach((achievement) => {
      toast({
        title: `🎉 Achievement Unlocked!`,
        description: `${achievement.icon} ${achievement.title}: ${achievement.description}`,
      });
    });
    
    toast({
      title: "Mood saved! 💙",
      description: "Thank you for checking in with yourself today.",
    });
  };

  const tabs = [
    { id: 'home', label: 'Home', emoji: '🏠' },
    { id: 'journal', label: 'Journal', emoji: '📝' },
    { id: 'achievements', label: 'Progress', emoji: '🏆' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">MindEase</h1>
          <p className="text-gray-600">Your AI-powered mental health companion</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-white rounded-xl p-1 mb-6 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all font-medium text-sm ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <span>{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Home Tab */}
        {activeTab === 'home' && (
          <>
            {/* Streak Counter */}
            <StreakCounter streak={streak} />

            {/* Mood Tracker */}
            <MoodTracker onMoodSaved={handleMoodSaved} />

            {/* AI Personalized Suggestions */}
            {currentMood && (
              <PersonalizedSuggestions 
                currentMood={currentMood} 
                recentEntries={moodEntries.slice(0, 5)} 
              />
            )}

            {/* Self-Care Suggestion (fallback) */}
            {!currentMood && <SelfCareCard currentMood={currentMood} />}

            {/* Mood History */}
            <MoodHistory entries={moodEntries.slice(0, 5)} />
          </>
        )}

        {/* Journal Tab */}
        {activeTab === 'journal' && (
          <>
            <JournalPrompts currentMood={currentMood} />
            
            {/* Recent journal entries could go here */}
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📔</div>
              <p>Journal feature coming soon!</p>
              <p className="text-sm mt-1">For now, use the prompts above to guide your reflection.</p>
            </div>
          </>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <>
            <AchievementBadges />
            
            {/* Habit tracker could go here */}
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📊</div>
              <p>More progress tracking coming soon!</p>
              <p className="text-sm mt-1">Keep checking in daily to unlock more achievements.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
