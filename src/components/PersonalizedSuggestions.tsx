
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Clock, Zap } from 'lucide-react';
import { PersonalizedSuggestion, getPersonalizedSuggestions } from '@/services/aiSuggestions';
import { MoodEntry } from '@/types/mood';
import { completeHabit } from '@/utils/gamification';

interface PersonalizedSuggestionsProps {
  currentMood: string;
  recentEntries: MoodEntry[];
}

const PersonalizedSuggestions: React.FC<PersonalizedSuggestionsProps> = ({
  currentMood,
  recentEntries
}) => {
  const [suggestions, setSuggestions] = useState<PersonalizedSuggestion[]>([]);

  const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  const refreshSuggestions = () => {
    const timeOfDay = getTimeOfDay();
    const newSuggestions = getPersonalizedSuggestions(currentMood, recentEntries, timeOfDay);
    setSuggestions(newSuggestions);
  };

  useEffect(() => {
    refreshSuggestions();
  }, [currentMood, recentEntries]);

  const handleActivityComplete = (suggestion: PersonalizedSuggestion) => {
    // Complete relevant habits
    if (suggestion.type === 'breathing' || suggestion.tags.includes('breathing')) {
      completeHabit('mindful-breathing');
    }
    if (suggestion.tags.includes('gratitude')) {
      completeHabit('gratitude-practice');
    }
  };

  const getTypeIcon = (type: PersonalizedSuggestion['type']) => {
    switch (type) {
      case 'breathing': return '🌬️';
      case 'activity': return '✨';
      case 'journal_prompt': return '✍️';
      case 'mindfulness': return '🧘‍♀️';
      default: return '💫';
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6 shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-500" />
            AI Recommendations
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshSuggestions}
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="p-4 bg-white rounded-xl border border-purple-100 hover:border-purple-200 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{getTypeIcon(suggestion.type)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-800">{suggestion.title}</h3>
                  {suggestion.duration && (
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {suggestion.duration}
                    </Badge>
                  )}
                  {suggestion.difficulty && (
                    <Badge className={`text-xs ${getDifficultyColor(suggestion.difficulty)}`}>
                      {suggestion.difficulty}
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-3">{suggestion.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {suggestion.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleActivityComplete(suggestion)}
                    className="bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    Done ✓
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PersonalizedSuggestions;
