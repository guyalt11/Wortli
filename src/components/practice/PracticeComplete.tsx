
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PracticeCompleteProps {
  totalWords: number;
  onRestart: () => void;
  onBack: () => void;
}

const PracticeComplete: React.FC<PracticeCompleteProps> = ({
  totalWords
}) => {

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Practice Complete!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {totalWords === 0 ? (
          <p>Great job! You’ve reviewed all the words. Come back soon to practice some more!</p>
        ) : (
          <p>You’ve successfully reviewed {totalWords} words. Well done!</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PracticeComplete;
