
import React from 'react';
import { Button } from '@/components/ui/button';
import { VocabWord, DifficultyLevel, PracticeDirection } from '@/types/vocabulary';
import { useReviewTime } from '@/hooks/useReviewTime';

interface DifficultyButtonsProps {
  word: VocabWord;
  direction: PracticeDirection;
  onSelectDifficulty: (difficulty: DifficultyLevel) => void;
}

const DifficultyButtons: React.FC<DifficultyButtonsProps> = ({
  word,
  direction,
  onSelectDifficulty
}) => {
  const { getReviewTimeEstimate } = useReviewTime();

  return (
    <div className="flex justify-between w-full gap-2">
      <Button
        className="flex-1 bg-difficulty-hard text-center min-w-0"
        onClick={() => onSelectDifficulty('hard')}
        title="Next review in 1 minute"
      >
        <div className="flex flex-col items-center">
          <span className="truncate">Hard</span>
          <span className="truncate">(1m)</span>
        </div>
      </Button>
      <Button
        className="flex-1 bg-difficulty-ok text-black text-center min-w-0"
        onClick={() => onSelectDifficulty('ok')}
        title={`Next review in ${getReviewTimeEstimate(word, 'ok', direction)}`}
      >
        <div className="flex flex-col items-center">
          <span className="truncate">OK</span>
          <span className="truncate">({getReviewTimeEstimate(word, 'ok', direction)})</span>
        </div>
      </Button>
      <Button
        className="flex-1 bg-difficulty-good text-center min-w-0"
        onClick={() => onSelectDifficulty('good')}
        title={`Next review in ${getReviewTimeEstimate(word, 'good', direction)}`}
      >
        <div className="flex flex-col items-center">
          <span className="truncate">Good</span>
          <span className="truncate">({getReviewTimeEstimate(word, 'good', direction)})</span>
        </div>
      </Button>
      <Button
        className="flex-1 bg-difficulty-perfect text-black text-center min-w-0"
        onClick={() => onSelectDifficulty('perfect')}
        title={`Next review in ${getReviewTimeEstimate(word, 'perfect', direction)}`}
      >
        <div className="flex flex-col items-center">
          <span className="truncate">Perfect</span>
          <span className="truncate">({getReviewTimeEstimate(word, 'perfect', direction)})</span>
        </div>
      </Button>
    </div>
  );
};

export default DifficultyButtons;
