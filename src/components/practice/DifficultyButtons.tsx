
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
    <div className="flex justify-between w-full gap-2 px-1">
      <Button
        className="flex-1 h-auto py-2 bg-difficulty-hard text-[#1a1a1a] hover:bg-difficulty-hard/90 border-none rounded-xl shadow-md transition-all active:scale-95 text-center min-w-0"
        onClick={() => onSelectDifficulty('hard')}
        title="Next review in 1 minute"
      >
        <div className="flex flex-col items-center leading-tight">
          <span className="font-bold text-sm md:text-base">Hard</span>
          <span className="text-[10px] md:text-xs opacity-80 font-medium">1m</span>
        </div>
      </Button>
      <Button
        className="flex-1 h-auto py-2 bg-difficulty-ok text-[#1a1a1a] hover:bg-difficulty-ok/90 border-none rounded-xl shadow-md transition-all active:scale-95 text-center min-w-0"
        onClick={() => onSelectDifficulty('ok')}
        title={`Next review in ${getReviewTimeEstimate(word, 'ok', direction)}`}
      >
        <div className="flex flex-col items-center leading-tight">
          <span className="font-bold text-sm md:text-base">OK</span>
          <span className="text-[10px] md:text-xs opacity-80 font-medium">{getReviewTimeEstimate(word, 'ok', direction)}</span>
        </div>
      </Button>
      <Button
        className="flex-1 h-auto py-2 bg-difficulty-good text-[#1a1a1a] hover:bg-difficulty-good/90 border-none rounded-xl shadow-md transition-all active:scale-95 text-center min-w-0"
        onClick={() => onSelectDifficulty('good')}
        title={`Next review in ${getReviewTimeEstimate(word, 'good', direction)}`}
      >
        <div className="flex flex-col items-center leading-tight">
          <span className="font-bold text-sm md:text-base">Good</span>
          <span className="text-[10px] md:text-xs opacity-80 font-medium">{getReviewTimeEstimate(word, 'good', direction)}</span>
        </div>
      </Button>
      <Button
        className="flex-1 h-auto py-2 bg-difficulty-perfect text-[#1a1a1a] hover:bg-difficulty-perfect/90 border-none rounded-xl shadow-md transition-all active:scale-95 text-center min-w-0"
        onClick={() => onSelectDifficulty('perfect')}
        title={`Next review in ${getReviewTimeEstimate(word, 'perfect', direction)}`}
      >
        <div className="flex flex-col items-center leading-tight">
          <span className="font-bold text-sm md:text-base">Perfect</span>
          <span className="text-[10px] md:text-xs opacity-80 font-medium">{getReviewTimeEstimate(word, 'perfect', direction)}</span>
        </div>
      </Button>
    </div>
  );
};

export default DifficultyButtons;
