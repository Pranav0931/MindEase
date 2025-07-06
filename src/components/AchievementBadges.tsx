
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Lock } from 'lucide-react';
import { Achievement, getUserStats } from '@/utils/gamification';

const AchievementBadges: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [unlockedCount, setUnlockedCount] = useState(0);

  useEffect(() => {
    const stats = getUserStats();
    setAchievements(stats.achievements);
    setUnlockedCount(stats.achievements.filter(a => a.isUnlocked).length);
  }, []);

  const getProgressWidth = (progress: number, requirement: number) => {
    return Math.min((progress / requirement) * 100, 100);
  };

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return `${Math.floor(days / 7)} weeks ago`;
  };

  return (
    <Card className="mb-6 shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-orange-50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-600" />
          Achievements ({unlockedCount}/{achievements.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-xl border transition-all ${
                achievement.isUnlocked
                  ? 'bg-white border-yellow-200 shadow-sm'
                  : 'bg-gray-50 border-gray-200 opacity-75'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="text-2xl">{achievement.icon}</div>
                  {!achievement.isUnlocked && (
                    <Lock className="absolute -top-1 -right-1 h-3 w-3 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-semibold ${
                      achievement.isUnlocked ? 'text-gray-800' : 'text-gray-500'
                    }`}>
                      {achievement.title}
                    </h3>
                    {achievement.isUnlocked && (
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                        Unlocked
                      </Badge>
                    )}
                  </div>
                  <p className={`text-sm mb-2 ${
                    achievement.isUnlocked ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {achievement.description}
                  </p>
                  
                  {!achievement.isUnlocked && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Progress</span>
                        <span>{achievement.progress}/{achievement.requirement}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getProgressWidth(achievement.progress, achievement.requirement)}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {achievement.isUnlocked && achievement.unlockedAt && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Star className="h-3 w-3" />
                      <span>Unlocked {formatTimeAgo(achievement.unlockedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementBadges;
