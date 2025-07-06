
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MoodEntry, MoodEmoji } from '@/types/mood';
import { saveMoodEntry, generateMoodId } from '@/utils/moodStorage';

interface MoodTrackerProps {
  onMoodSaved: (entry: MoodEntry) => void;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ onMoodSaved }) => {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [note, setNote] = useState('');

  const moodOptions: { emoji: MoodEmoji; label: string; value: string }[] = [
    { emoji: '😊', label: 'Great', value: 'great' },
    { emoji: '😌', label: 'Good', value: 'good' },
    { emoji: '😐', label: 'Okay', value: 'okay' },
    { emoji: '😔', label: 'Down', value: 'down' },
    { emoji: '😰', label: 'Anxious', value: 'anxious' },
  ];

  const handleSave = () => {
    if (!selectedMood) return;

    const entry: MoodEntry = {
      id: generateMoodId(),
      mood: selectedMood,
      note: note.trim(),
      timestamp: Date.now(),
      date: new Date().toLocaleDateString(),
    };

    saveMoodEntry(entry);
    onMoodSaved(entry);

    // Reset form
    setSelectedMood('');
    setNote('');
  };

  return (
    <Card className="mb-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-center text-xl text-gray-700">
          How are you feeling today?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mood Selection */}
        <div className="grid grid-cols-5 gap-2">
          {moodOptions.map((mood) => (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(mood.value)}
              className={`p-4 rounded-2xl transition-all duration-200 ${
                selectedMood === mood.value
                  ? 'bg-blue-100 scale-110 shadow-md'
                  : 'bg-gray-50 hover:bg-gray-100 hover:scale-105'
              }`}
            >
              <div className="text-3xl mb-1">{mood.emoji}</div>
              <div className="text-xs text-gray-600 font-medium">{mood.label}</div>
            </button>
          ))}
        </div>

        {/* Note Input */}
        <div>
          <Textarea
            placeholder="How was your day? (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="border-gray-200 rounded-xl resize-none"
            rows={3}
          />
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={!selectedMood}
          className="w-full bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white font-medium py-3 rounded-xl transition-all duration-200 disabled:opacity-50"
        >
          Save My Mood 💙
        </Button>
      </CardContent>
    </Card>
  );
};

export default MoodTracker;
