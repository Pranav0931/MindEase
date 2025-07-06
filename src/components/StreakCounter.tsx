
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StreakCounterProps {
  streak: number;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ streak }) => {
  const getStreakMessage = (streak: number): string => {
    if (streak === 0) return "Start your mood tracking journey!";
    if (streak === 1) return "Great start! Keep it up!";
    if (streak < 7) return `${streak} days strong! You're building a great habit!`;
    return `🏆 Amazing! ${streak} day streak! You're doing fantastic!`;
  };

  const getStreakEmoji = (streak: number): string => {
    if (streak === 0) return "🌱";
    if (streak < 3) return "🌿";
    if (streak < 7) return "🌸";
    return "🏆";
  };

  return (
    <Card className="mb-6 shadow-lg border-0 bg-gradient-to-r from-yellow-50 to-orange-50">
      <CardContent className="pt-6">
        <div className="text-center">
          <div className="text-4xl mb-2">{getStreakEmoji(streak)}</div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {streak} Day{streak !== 1 ? 's' : ''}
          </div>
          <p className="text-gray-600 text-sm">{getStreakMessage(streak)}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakCounter;
