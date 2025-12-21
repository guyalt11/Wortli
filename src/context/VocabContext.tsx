import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { VocabList, VocabWord, DifficultyLevel, PracticeDirection, DIFFICULTY_TO_SM2_QUALITY } from '@/types/vocabulary';
import { v4 as uuidv4 } from 'uuid';
import { useSupabaseVocabLists } from '@/hooks/useSupabaseVocabLists';
import { useVocabImportExport } from '@/hooks/useVocabImportExport';
import { toast } from '@/components/ui/use-toast';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

interface VocabContextType {
  lists: VocabList[];
  isLoading: boolean;
  currentList: VocabList | null;
  addList: (name: string, description?: string, language?: string, target?: string) => Promise<VocabList | null>;
  updateList: (id: string, updates: Partial<VocabList>) => Promise<void>;
  deleteList: (id: string) => Promise<void>;
  selectList: (id: string) => Promise<void>;
  addWord: (listId: string, word: Omit<VocabWord, 'id'>) => Promise<void>;
  updateWord: (wordId: string, updates: Partial<VocabWord>) => Promise<void>;
  deleteWord: (wordId: string) => Promise<void>;
  updateWordDifficulty: (wordId: string, difficulty: DifficultyLevel, direction: PracticeDirection) => Promise<void>;
  exportList: (id: string, format: 'json') => void;
  importList: (file: File, listName: string) => Promise<VocabList | null>;
  getListById: (id: string) => VocabList | undefined;
  isLibraryOpen: boolean;
  setIsLibraryOpen: (open: boolean) => void;
  allWords: VocabWord[];
}

const VocabContext = createContext<VocabContextType | undefined>(undefined);

export const useVocab = () => {
  const context = useContext(VocabContext);
  if (!context) {
    throw new Error('useVocab must be used within a VocabProvider');
  }
  return context;
};

export const VocabProvider = ({ children }: { children: ReactNode }) => {

  // Use the Supabase hook to manage vocabulary lists
  const {
    lists,
    isLoading,
    error,
    refreshLists,
    saveList,
    deleteList: deleteListFromSupabase,
    saveWord,
    deleteWord: deleteWordFromSupabase,
    setLists,
    currentUser
  } = useSupabaseVocabLists();

  const getListById = useCallback((id: string): VocabList | undefined => {
    return lists.find(list => list.id === id);
  }, [lists]);

  const [currentList, setCurrentList] = useState<VocabList | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const { exportList, importList: importListFunc } = useVocabImportExport({ lists, setLists });
  const { token } = useAuth();

  // Add a new list
  const addList = useCallback(async (name: string, description?: string, language: string = 'de', target: string = 'en'): Promise<VocabList | null> => {
    try {
      const newList: VocabList = {
        id: uuidv4(),
        name,
        description,
        language,
        target,
        words: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const savedList = await saveList(newList);
      // After creating a new list, set it as the current list
      setCurrentList(savedList);
      return savedList;
    } catch (error) {
      console.error('Error adding list:', error);

      const errorMessage = error instanceof Error ? error.message : String(error);

      // Check for premium limitation errors
      if (errorMessage.toLowerCase().includes('non-premium') || errorMessage.toLowerCase().includes('only 2 lists') || (errorMessage.toLowerCase().includes('create') && errorMessage.toLowerCase().includes('2') && errorMessage.toLowerCase().includes('list'))) {
        toast({
          title: "List limit reached",
          description: "Free users can only have 2 lists. Upgrade to premium for unlimited lists.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add list. Please try again.",
          variant: "destructive",
        });
      }
      return null;
    }
  }, [saveList]);

  // Update an existing list
  const updateList = useCallback(async (id: string, updates: Partial<VocabList>): Promise<void> => {
    try {
      const list = lists.find(l => l.id === id);
      if (!list) throw new Error('List not found');

      const updatedList = {
        ...list,
        ...updates,
        updatedAt: new Date()
      };

      // Optimistically update the local state
      setLists(prev => prev.map(l => l.id === id ? updatedList : l));
      if (currentList && currentList.id === id) {
        setCurrentList(updatedList);
      }

      await saveList(updatedList);
    } catch (error) {
      console.error('Error updating list:', error);
      toast({
        title: "Error",
        description: "Failed to update list. Please try again.",
        variant: "destructive",
      });
    }
  }, [lists, saveList, currentList]);

  // Delete a list
  const deleteList = useCallback(async (id: string): Promise<void> => {
    try {
      await deleteListFromSupabase(id);

      // If the deleted list is the current list, clear it
      if (currentList && currentList.id === id) {
        setCurrentList(null);
      }
    } catch (error) {
      console.error('Error deleting list:', error);
      toast({
        title: "Error",
        description: "Failed to delete list. Please try again.",
        variant: "destructive",
      });
    }
  }, [deleteListFromSupabase, currentList]);

  // Set the currently selected list
  const selectList = useCallback(async (id: string) => {
    const list = getListById(id);
    await new Promise<void>(resolve => {
      setCurrentList(list ?? null);
      // Wait for next render cycle
      setTimeout(resolve, 0);
    });
  }, [getListById]);

  // Add a word to a list
  const addWord = useCallback(async (listId: string, wordData: Omit<VocabWord, 'id'>): Promise<void> => {
    try {
      const word: VocabWord = {
        ...wordData,
        id: uuidv4(),
      };

      await saveWord(listId, word);

      // Update the current list if this word is being added to it
      if (currentList && currentList.id === listId) {
        setCurrentList(prev => {
          if (!prev || prev.id !== listId) return prev;
          return {
            ...prev,
            words: [...prev.words, word],
            updatedAt: new Date()
          };
        });
      }
    } catch (error) {
      console.error('Error adding word:', error);

      const errorMessage = error instanceof Error ? error.message : String(error);

      // Check for premium limitation errors
      if (errorMessage.toLowerCase().includes('non-premium') || errorMessage.toLowerCase().includes('only 50 words') || (errorMessage.toLowerCase().includes('50') && errorMessage.toLowerCase().includes('word'))) {
        toast({
          title: "Word limit reached",
          description: "Free users can only have 50 words per list. Upgrade to premium for unlimited words.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add word. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [saveWord, currentList]);

  // Update a word
  const updateWord = useCallback(async (wordId: string, updates: Partial<VocabWord>): Promise<void> => {
    try {
      // Find which list contains this word
      let list: VocabList | undefined;
      let word: VocabWord | undefined;

      for (const l of lists) {
        word = l.words.find(w => w.id === wordId);
        if (word) {
          list = l;
          break;
        }
      }

      if (!list || !word) throw new Error('Word not found');

      const updatedWord = { ...word, ...updates };
      await saveWord(list.id, updatedWord);

      // Update the current list if this word is part of it
      if (currentList && currentList.id === list.id) {
        setCurrentList(prev => {
          if (!prev || prev.id !== list.id) return prev;
          const updatedWords = prev.words.map(w =>
            w.id === wordId ? updatedWord : w
          );
          return {
            ...prev,
            words: updatedWords,
            updatedAt: new Date()
          };
        });
      }
    } catch (error) {
      console.error('Error updating word:', error);
      toast({
        title: "Error",
        description: "Failed to update word. Please try again.",
        variant: "destructive",
      });
    }
  }, [lists, saveWord, currentList]);

  // Delete a word
  const deleteWord = useCallback(async (wordId: string): Promise<void> => {
    try {
      await deleteWordFromSupabase(wordId);

      // Update the current list if this word was part of it
      if (currentList) {
        setCurrentList(prev => {
          if (!prev) return prev;
          const wordInList = prev.words.some(w => w.id === wordId);
          if (!wordInList) return prev;

          return {
            ...prev,
            words: prev.words.filter(w => w.id !== wordId),
            updatedAt: new Date()
          };
        });
      }
    } catch (error) {
      console.error('Error deleting word:', error);
      toast({
        title: "Error",
        description: "Failed to delete word. Please try again.",
        variant: "destructive",
      });
    }
  }, [deleteWordFromSupabase, currentList]);

  // Update a word's difficulty and next review time based on spaced repetition
  const updateWordDifficulty = useCallback(async (
    wordId: string,
    difficulty: DifficultyLevel,
    direction: PracticeDirection
  ): Promise<void> => {
    try {
      const now = new Date();

      // Find which list contains this word
      let list: VocabList | undefined;
      let word: VocabWord | undefined;

      for (const l of lists) {
        word = l.words.find(w => w.id === wordId);
        if (word) {
          list = l;
          break;
        }
      }

      if (!list || !word) throw new Error('Word not found');

      // Get current SM2 parameters or initialize
      const currentSM2 = word.sm2?.[direction] || {
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0
      };

      // Get SM2 quality rating from our difficulty level
      const quality = DIFFICULTY_TO_SM2_QUALITY[difficulty];

      // Calculate next interval using SM2 algorithm
      const { nextParams, intervalMs } = calculateSM2NextInterval(currentSM2, quality);

      // For "hard" difficulty, always set to 1 minute regardless of SM2
      let nextReviewDate;
      if (difficulty === 'hard') {
        nextReviewDate = new Date(now.getTime() + 60000); // 1 minute in milliseconds
      } else {
        nextReviewDate = new Date(now.getTime() + intervalMs);
      }

      // Update word with new SM2 parameters and next review date
      const updatedWord = {
        ...word,
        sm2: {
          ...word.sm2 || {}, // Keep existing SM2 data for other direction if it exists
          [direction]: nextParams
        },
        nextReview: {
          ...word.nextReview || {}, // Keep existing review dates for other direction 
          [direction]: nextReviewDate
        }
      };

      await saveWord(list.id, updatedWord);

      // Update the current list if this word is part of it
      if (currentList && currentList.id === list.id) {
        setCurrentList(prev => {
          if (!prev || prev.id !== list.id) return prev;
          const updatedWords = prev.words.map(w =>
            w.id === wordId ? updatedWord : w
          );
          return {
            ...prev,
            words: updatedWords,
            updatedAt: new Date()
          };
        });
      }
    } catch (error) {
      console.error('Error updating word difficulty:', error);
      toast({
        title: "Error",
        description: "Failed to update word difficulty. Please try again.",
        variant: "destructive",
      });
    }
  }, [lists, saveWord, currentList]);

  // Import function with support for Supabase
  const importList = async (file: File, listName: string): Promise<VocabList | null> => {
    try {
      const importedList = await importListFunc(file, listName);
      if (importedList) {
        // Create a new list object without words
        const newListId = uuidv4();
        const newList: VocabList = {
          id: newListId,
          name: listName,
          description: importedList.description,
          language: importedList.language, // Use the language from the imported list
          target: importedList.target || 'en', // Use target from imported list or default to 'en'
          words: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Save the list metadata
        await saveList(newList);

        // Save words one by one
        if (!token) {
          throw new Error('User not authenticated');
        }

        // Format and save words
        const savedWords: VocabWord[] = [];
        for (const word of importedList.words) {
          const newWordId = uuidv4();

          // Create formatted word for Supabase
          const supabaseWord = {
            id: newWordId,
            list_id: newListId,
            transl: word.transl,
            origin: word.origin,
            gender: word.gender || null,
            notes: word.notes || null,
            nextReview: word.nextReview ? JSON.stringify(word.nextReview) : null,
            sm2: word.sm2 ? JSON.stringify(word.sm2) : null
          };

          // Create word for local state
          const localWord: VocabWord = {
            id: newWordId,
            transl: word.transl,
            origin: word.origin,
            gender: word.gender || null,
            notes: word.notes || null,
            nextReview: word.nextReview || undefined,
            sm2: word.sm2 || undefined
          };

          const response = await fetch(`${SUPABASE_URL}/rest/v1/words`, {
            method: 'POST',
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(supabaseWord)
          });

          if (!response.ok) {
            throw new Error('Failed to save word');
          }

          savedWords.push(localWord);
        }

        // Update the local state with all saved words
        const updatedList = {
          ...newList,
          words: savedWords
        };

        // Clear existing lists state and update with fresh data
        setLists([updatedList]);

        // Refresh the lists from the server to ensure we have the latest data
        await refreshLists();

        return updatedList;
      }
      return null;
    } catch (error) {
      console.error('Error importing list:', error);

      // Parse error message to detect premium limitations
      const errorMessage = error instanceof Error ? error.message : String(error);

      // Check for specific limitation errors
      if (errorMessage.toLowerCase().includes('non-premium') || errorMessage.toLowerCase().includes('only 2 lists') || (errorMessage.toLowerCase().includes('create') && errorMessage.toLowerCase().includes('2') && errorMessage.toLowerCase().includes('list'))) {
        toast({
          title: "List limit reached",
          description: "Free users can only have 2 lists. Upgrade to premium for unlimited lists.",
          variant: "destructive",
        });
      } else if (errorMessage.toLowerCase().includes('only 50 words') || (errorMessage.toLowerCase().includes('50') && errorMessage.toLowerCase().includes('word'))) {
        toast({
          title: "Word limit reached",
          description: "Free users can only have 50 words per list. Upgrade to premium for unlimited words.",
          variant: "destructive",
        });
      } else {
        // Generic error for other cases
        toast({
          title: "Import failed",
          description: "Failed to import list. Please try again or contact support.",
          variant: "destructive",
        });
      }

      return null;
    }
  };

  // Helper function to calculate next interval using SM2 algorithm
  function calculateSM2NextInterval(currentParams: any, quality: number) {
    // Extract current parameters
    let { easeFactor, interval, repetitions } = currentParams;

    // Apply SM2 algorithm
    if (quality < 3) {
      // If quality is less than 3, reset repetitions
      repetitions = 0;
      interval = 0;
    } else {
      // Update repetitions
      repetitions += 1;

      // Calculate interval based on repetitions
      if (repetitions === 1) {
        // First successful repetition
        interval = quality === 3 ? 0.021 :  // 12 hours for quality 3
          quality === 4 ? 0.083 :     // 1 day for quality 4
            0.33;                      // 3 days for quality 5 (perfect)
      } else if (repetitions === 2) {
        // Second successful repetition
        interval = quality === 3 ? 0.083 :    // 3 days for quality 3
          quality === 4 ? 0.33 :     // 5 days for quality 4
            1;                      // 7 days for quality 5
      } else {
        // For repetitions > 2, use the formula with quality adjustments
        const qualityFactor = quality === 3 ? 0.5 :   // Reduce interval for OK
          quality === 4 ? 1.0 :   // Normal interval for Good
            1.5;                    // Increase interval for Perfect
        interval = interval * easeFactor * qualityFactor;
      }
    }

    // Update easeFactor using the formula from SM2
    easeFactor = Math.max(
      1.3, // Minimum value for easeFactor
      easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );

    // Calculate next interval in milliseconds
    const intervalMs = interval * 24 * 60 * 60 * 1000;

    return {
      nextParams: { easeFactor, interval, repetitions },
      intervalMs
    };
  }

  const value = useMemo(() => ({
    lists,
    isLoading,
    currentList,
    addList,
    updateList,
    deleteList,
    selectList,
    addWord,
    updateWord,
    deleteWord,
    updateWordDifficulty,
    exportList,
    importList,
    getListById,
    isLibraryOpen,
    setIsLibraryOpen,
    allWords: lists.flatMap(list => list.words)
  }), [
    lists,
    isLoading,
    currentList,
    addList,
    updateList,
    deleteList,
    selectList,
    addWord,
    updateWord,
    deleteWord,
    updateWordDifficulty,
    exportList,
    importList,
    getListById,
    isLibraryOpen
  ]);

  return (
    <VocabContext.Provider value={value}>
      {children}
    </VocabContext.Provider>
  );
};
