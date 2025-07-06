
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoodEntry } from '@/types/mood';

interface MoodHistoryProps {
  entries: MoodEntry[];
}

const MoodHistory: React.FC<MoodHistoryProps> = ({ entries }) => {
  const getMoodEmoji = (mood: string): string => {
    const moodMap: { [key: string]: string } = {
      great: '😊',
      good: '😌',
      okay: '😐',
      down: '😔',
      anxious: '😰',
    };
    return moodMap[mood] || '😐';
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (entries.length === 0) {
    return (
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg text-gray-700">📅 Recent Moods</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">
            Start tracking your mood to see your history here!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg text-gray-700">📅 Recent Moods</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl"
          >
            <div className="text-2xl">{getMoodEmoji(entry.mood)}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800 capitalize">{entry.mood}</span>
                <span className="text-sm text-gray-500">{formatDate(entry.timestamp)}</span>
              </div>
              {entry.note && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{entry.note}</p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MoodHistory;
