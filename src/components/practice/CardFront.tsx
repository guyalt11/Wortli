import React from 'react';
import { Button } from '@/components/ui/button';
import GenderTag from '@/components/GenderTag';
import { DirectionFlag } from '@/components/FlagIcon';
import { VocabWord, PracticeDirection, Gender } from '@/types/vocabulary';
import { Trash2 } from 'lucide-react';
import { speak } from '@/lib/speech';
import { useVocab } from '@/context/VocabContext';

interface CardFrontProps {
  word: VocabWord;
  direction: PracticeDirection;
  flipped: boolean;
  onDelete: () => void;
  language?: string;
  target?: string;
}

const CardFront: React.FC<CardFrontProps> = ({ word, direction, flipped, onDelete, language, target }) => {
  const getGenderBgClass = (gender: Gender | undefined) => {
    switch (gender) {
      case 'm': return 'bg-gender-m';
      case 'f': return 'bg-gender-f';
      case 'n': return 'bg-gender-n';
      case 'c': return 'bg-gender-c';
      default: return '';
    }
  };

  const { currentList } = useVocab();
  // For translateTo (Language to English), show language word
  // For translateFrom (English to Language), show English word
  const frontText = direction === 'translateTo' ? word.origin : word.transl;

  const getLanguageCode = (lang: string) => {
    switch (lang) {
      case 'de': return 'de-DE';
      case 'he': return 'he-IL';
      case 'is': return 'is-IS';
      default: return 'en-US';
    }
  };

  return (
    <div className="text-center w-full">
      <div className="mb-2 text-tertiary-foreground text-sm flex items-center justify-center">
        <DirectionFlag direction={direction} size={16} language={language} target={target} />
      </div>
      <div className="flex items-center justify-center gap-2">
        <h2 className="text-2xl font-bold break-words min-w-0 [overflow-wrap:anywhere]">{frontText}</h2>
        <span>{direction === 'translateTo' && word.gender && (
          <div className={`${getGenderBgClass(word.gender)} rounded-full text-dark`}>
            <GenderTag gender={word.gender} />
          </div>
        )}</span>
      </div>

      {/* TODO: Add language-specific audio button */}
      {direction === 'translateTo' && (currentList?.language === 'de' || currentList?.language === 'en') && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-4"
          onClick={(e) => {
            e.stopPropagation();
            speak(word.origin, getLanguageCode(currentList?.language || 'en'));
          }}
        >
          🔊 Listen
        </Button>
      )}

      {direction === 'translateTo' && word.notes && (
        <div className="mt-4 text-sm text-tertiary-foreground">
          <p>{word.notes}</p>
        </div>
      )}

      <div className="mt-6 border-b border-white pb-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CardFront;
