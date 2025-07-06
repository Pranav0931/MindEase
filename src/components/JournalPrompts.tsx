
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, PenTool } from 'lucide-react';
import { JournalPrompt, getJournalPrompts } from '@/services/aiSuggestions';

interface JournalPromptsProps {
  currentMood: string;
}

const JournalPrompts: React.FC<JournalPromptsProps> = ({ currentMood }) => {
  const [prompts, setPrompts] = useState<JournalPrompt[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'All', color: 'bg-gray-100 text-gray-800' },
    { value: 'reflection', label: 'Reflection', color: 'bg-blue-100 text-blue-800' },
    { value: 'gratitude', label: 'Gratitude', color: 'bg-green-100 text-green-800' },
    { value: 'goals', label: 'Goals', color: 'bg-purple-100 text-purple-800' },
    { value: 'emotions', label: 'Emotions', color: 'bg-pink-100 text-pink-800' },
  ];

  const refreshPrompts = () => {
    const category = selectedCategory === 'all' ? undefined : selectedCategory as any;
    const newPrompts = getJournalPrompts(currentMood, category);
    setPrompts(newPrompts);
  };

  useEffect(() => {
    refreshPrompts();
  }, [currentMood, selectedCategory]);

  const getCategoryColor = (category: string) => {
    const categoryData = categories.find(c => c.value === category);
    return categoryData?.color || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="mb-6 shadow-lg border-0 bg-gradient-to-br from-indigo-50 to-purple-50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
            <PenTool className="h-5 w-5 text-indigo-500" />
            Journal Prompts
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshPrompts}
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mt-3">
          {categories.map((category) => (
            <Badge
              key={category.value}
              className={`cursor-pointer transition-all ${
                selectedCategory === category.value
                  ? category.color + ' ring-2 ring-indigo-300'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedCategory(category.value)}
            >
              {category.label}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {prompts.map((prompt) => (
          <div
            key={prompt.id}
            className="p-4 bg-white rounded-xl border border-indigo-100 hover:border-indigo-200 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">💭</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getCategoryColor(prompt.category)}>
                    {prompt.category}
                  </Badge>
                  {prompt.mood && (
                    <Badge variant="outline" className="text-xs">
                      for {prompt.mood} mood
                    </Badge>
                  )}
                </div>
                <p className="text-gray-700 leading-relaxed mb-3">{prompt.prompt}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                >
                  Start Writing
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {prompts.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <PenTool className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No prompts available for this category.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JournalPrompts;
