
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { SelfCareSuggestion } from '@/types/mood';

interface SelfCareCardProps {
  currentMood: string;
}

const SelfCareCard: React.FC<SelfCareCardProps> = ({ currentMood }) => {
  const [currentSuggestion, setCurrentSuggestion] = useState<SelfCareSuggestion | null>(null);

  const suggestions: SelfCareSuggestion[] = [
    { id: '1', title: 'Take Deep Breaths', description: 'Try the 4-7-8 breathing technique: inhale for 4, hold for 7, exhale for 8.', mood: 'anxious' },
    { id: '2', title: 'Practice Gratitude', description: 'Write down 3 things you\'re grateful for today, no matter how small.', mood: 'down' },
    { id: '3', title: 'Go for a Walk', description: 'A 10-minute walk outside can boost your mood and energy.' },
    { id: '4', title: 'Listen to Music', description: 'Put on your favorite song and let yourself feel the rhythm.' },
    { id: '5', title: 'Drink Water', description: 'Stay hydrated! Your body and mind will thank you.' },
    { id: '6', title: 'Text a Friend', description: 'Reach out to someone you care about. Connection heals.' },
    { id: '7', title: 'Stretch Your Body', description: 'Do some gentle stretches to release tension and feel more relaxed.' },
    { id: '8', title: 'Write in a Journal', description: 'Express your thoughts and feelings on paper. It can be very therapeutic.' },
    { id: '9', title: 'Take a Warm Shower', description: 'Let the warm water wash away stress and help you feel refreshed.' },
    { id: '10', title: 'Practice Self-Compassion', description: 'Be kind to yourself today. You\'re doing the best you can.' },
  ];

  const getRandomSuggestion = () => {
    // Filter suggestions based on current mood, or get all if no mood-specific ones
    const moodSpecific = suggestions.filter(s => s.mood === currentMood);
    const availableSuggestions = moodSpecific.length > 0 ? moodSpecific : suggestions;
    
    const randomIndex = Math.floor(Math.random() * availableSuggestions.length);
    return availableSuggestions[randomIndex];
  };

  useEffect(() => {
    setCurrentSuggestion(getRandomSuggestion());
  }, [currentMood]);

  const handleRefresh = () => {
    setCurrentSuggestion(getRandomSuggestion());
  };

  if (!currentSuggestion) return null;

  return (
    <Card className="mb-6 shadow-lg border-0 bg-gradient-to-br from-green-50 to-blue-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-gray-700">💡 Self-Care Tip</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold text-gray-800 mb-2">{currentSuggestion.title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{currentSuggestion.description}</p>
      </CardContent>
    </Card>
  );
};

export default SelfCareCard;
