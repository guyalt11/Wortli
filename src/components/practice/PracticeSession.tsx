import React, { useState, useEffect, useRef } from 'react';
import { useVocab } from '@/context/VocabContext';
import { useNavigate } from 'react-router-dom';
import PracticeCard from '@/components/practice/PracticeCard';
import PracticeHeader from './PracticeHeader';
import PracticeComplete from './PracticeComplete';
import WordCompletionCounter from './WordCompletionCounter';
import PracticeProgressBar from '@/components/PracticeProgressBar';
import { DifficultyLevel, PracticeDirection } from '@/types/vocabulary';
import { usePracticeWords } from '@/hooks/usePracticeWords';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DeleteWordDialog from '@/components/DeleteWordDialog';
import { Button } from '@/components/ui/button';
import FlagIcon from '@/components/FlagIcon';

interface PracticeSessionProps {
  direction: PracticeDirection;
  onDirectionChange: (direction: PracticeDirection) => void;
}

const PracticeSession: React.FC<PracticeSessionProps> = ({
  direction,
  onDirectionChange
}) => {
  const { currentList, updateWordDifficulty, selectList, deleteWord, isLoading } = useVocab();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const { practiceWords, resetPracticeWords } = usePracticeWords(direction);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [processedStatus, setProcessedStatus] = useState<boolean[]>([]);

  // Store the initial word list as a ref so it never changes during the session
  const initialWordsRef = useRef<typeof practiceWords>([]);
  // Store the initial total words count as a ref so it never changes during the session
  const totalWordsRef = useRef<number>(0);

  // Initialize the words only once when practiceWords changes and initialWordsRef is empty
  useEffect(() => {
    if (practiceWords.length > 0 && initialWordsRef.current.length === 0) {
      initialWordsRef.current = [...practiceWords]; // Create a deep copy
      totalWordsRef.current = practiceWords.length;
    }
  }, [practiceWords]);

  // Add a refresh counter to force re-render when refreshing
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Reset session and refs when direction changes
  const resetSession = () => {
    resetPracticeWords();
    setCurrentIndex(0);
    setCompletedCount(0);
    setIsAnswered(false);
    setProcessedStatus([]);
    initialWordsRef.current = [];
    totalWordsRef.current = 0;
    setRefreshCounter(prev => prev + 1); // Increment refresh counter
  };

  // Reset only the session state without fetching new words
  const resetSessionState = () => {
    setCurrentIndex(0);
    setCompletedCount(0);
    setIsAnswered(false);
  };

  useEffect(() => {
    resetSession();
  }, [direction]);

  // Handle refresh by reloading the list and resetting the session
  const handleRefresh = async () => {
    if (currentList) {
      await selectList(currentList.id);
      resetSession();
    }
  };

  // Show loading state while loading lists
  if (isLoading || !currentList) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading practice session...</p>
        </div>
      </div>
    );
  }

  // Use the initial words list if it exists, otherwise fall back to practiceWords
  const wordsToUse = initialWordsRef.current.length > 0 ? initialWordsRef.current : practiceWords;
  const currentWord = wordsToUse[currentIndex];
  const totalWords = totalWordsRef.current > 0 ? totalWordsRef.current : wordsToUse.length;
  const isComplete = currentIndex >= wordsToUse.length || wordsToUse.length === 0;

  const handleAnswered = (difficulty: DifficultyLevel) => {
    if (currentWord) {
      // Track processing without mutating initialWordsRef.current
      if (!processedStatus[currentIndex]) {
        setProcessedStatus(prev => {
          const next = [...prev];
          next[currentIndex] = true;
          return next;
        });
        setCompletedCount(prev => prev + 1);
      }

      setIsAnswered(true);

      // Call updateWordDifficulty in the background
      updateWordDifficulty(currentWord.id, difficulty, direction).catch(error => {
        console.error('Error updating word difficulty:', error);
      });

      // Move to the next card after a short delay
      setTimeout(() => {
        handleNext();
      }, 100);
    }
  };

  const handleNext = () => {
    setCurrentIndex(prev => prev + 1);
    setIsAnswered(false);
  };

  const handleSkip = () => {
    if (!processedStatus[currentIndex]) {
      setProcessedStatus(prev => {
        const next = [...prev];
        next[currentIndex] = true;
        return next;
      });
      setCompletedCount(prev => prev + 1);
    }
    handleNext();
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      // If the word we are going back to was processed (answered or skipped), decrement completion
      if (processedStatus[prevIndex]) {
        setProcessedStatus(prev => {
          const next = [...prev];
          next[prevIndex] = false;
          return next;
        });
        setCompletedCount(prev => Math.max(0, prev - 1));
      }
      setCurrentIndex(prevIndex);
      setIsAnswered(false);
    }
  };

  const handleRestart = () => {
    resetSession();
  };

  const handleDelete = async () => {
    if (currentWord) {
      await deleteWord(currentWord.id);
      // Remove the word from our practice list
      initialWordsRef.current = initialWordsRef.current.filter(w => w.id !== currentWord.id);
      totalWordsRef.current = initialWordsRef.current.length;

      // If we've deleted all words, set counts to trigger completion screen
      if (initialWordsRef.current.length === 0) {
        setCompletedCount(0);
        totalWordsRef.current = 0;
        setCurrentIndex(0);
        return;
      }
    }
  };

  return (
    <div className="container py-6 max-w-3xl">
      <PracticeHeader
        listName={currentList.name}
        direction={direction}
        onDirectionChange={onDirectionChange}
        onBack={() => navigate(`/list/${currentList?.id}`)}
        onRefresh={handleRefresh}
      />

      <div className="mb-4">
        <PracticeProgressBar
          currentProgress={completedCount}
          totalWords={totalWords}
        />
      </div>

      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          disabled={currentIndex === 0}
          className="text-tertiary-foreground flex items-center gap-1 px-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>

        <WordCompletionCounter
          completedCount={completedCount}
          totalWords={totalWords}
        />

        <Button
          variant="ghost"
          size="sm"
          onClick={handleSkip}
          disabled={isComplete || currentIndex >= totalWords - 1}
          className="text-tertiary-foreground flex items-center gap-1 px-2"
        >
          <span>Skip</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {isComplete ? (
        <PracticeComplete
          totalWords={totalWords}
          onRestart={handleRestart}
          onBack={() => navigate(`/list/${currentList?.id}`)}
        />
      ) : (
        <PracticeCard
          key={`${currentWord?.id}-${currentIndex}-${direction}-${refreshCounter}`}
          word={currentWord}
          direction={direction}
          onAnswer={handleAnswered}
          onNext={handleNext}
          isAnswered={isAnswered}
          onDelete={() => setShowDeleteDialog(true)}
        />
      )}

      <DeleteWordDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={() => {
          handleDelete();
          setShowDeleteDialog(false);
        }}
      />
    </div>
  );
};

export default PracticeSession;
