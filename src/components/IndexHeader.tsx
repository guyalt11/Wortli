import { Button } from "@/components/ui/button";
import { Plus, Upload, Eye, EyeOff, Search, X, Play, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { VocabList } from "@/types/vocabulary";

interface IndexHeaderProps {
  onAddList: () => void;
  onImport: () => void;
  onLibrary: () => void;
  lists: VocabList[];
  onFilterChange: (showOnlyDue: boolean) => void;
  showOnlyDue?: boolean;
  onSearchChange: (searchQuery: string) => void;
  onPracticeAll?: () => void;
  initialShowOnlyDue?: boolean;
}

const IndexHeader = ({ onAddList, onImport, onLibrary, lists, onFilterChange, onSearchChange, onPracticeAll, showOnlyDue, initialShowOnlyDue = false }: IndexHeaderProps) => {
  const isControlled = typeof showOnlyDue !== 'undefined';
  const [internalShowOnlyDue, setInternalShowOnlyDue] = useState<boolean>(initialShowOnlyDue);
  useEffect(() => {
    if (!isControlled) {
      setInternalShowOnlyDue(initialShowOnlyDue);
    }
  }, [initialShowOnlyDue, isControlled]);
  const effectiveShowOnlyDue = isControlled ? showOnlyDue! : internalShowOnlyDue;
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate total due words from all lists
  const getTotalDueWords = () => {
    const now = new Date();
    let totalDue = 0;

    lists.forEach(list => {
      list.words.forEach(word => {
        const nextReviewFrom = word.nextReview?.translateFrom;
        const nextReviewTo = word.nextReview?.translateTo;

        if (!nextReviewFrom || nextReviewFrom <= now) {
          totalDue++;
        }
        if (!nextReviewTo || nextReviewTo <= now) {
          totalDue++;
        }
      });
    });

    return totalDue;
  };

  const totalDueWords = getTotalDueWords();
  return (
    <>
      <div className="flex flex-wrap flex-col sm:flex-row gap-2 mb-5 sm:mb-6">
        {/* Buttons container */}
        <div className="flex gap-2 
                  max-sm:w-[90%] max-sm:mx-auto max-sm:justify-center max-sm:space-x-2">
          {onPracticeAll && (
            <Button
              title="Practice all words"
              onClick={onPracticeAll}
              disabled={totalDueWords === 0}
              className={`gap-1 transition-all ${totalDueWords === 0 ? 'cursor-not-allowed opacity-50' : 'btn-1'}`}
            >
              <Play className="h-4 w-4 text-black" />
            </Button>
          )}

          <Button title="Add new list" onClick={onAddList} className="gap-1 transition-all btn-2 text-foreground">
            <Plus className="h-4 w-4 text-black" />
          </Button>

          <Button title="Import lists" onClick={onImport} className="gap-1 transition-all btn-3 text-foreground">
            <Upload className="h-4 w-4 text-black" />
          </Button>

          <Button title="Browse shared lists" onClick={onLibrary} className="gap-1 transition-all btn-4 text-foreground">
            <BookOpen className="h-4 w-4 text-black" />
          </Button>

          <Button
            title={effectiveShowOnlyDue ? "All lists" : "Only practicable lists"}
            onClick={() => {
              const newValue = !effectiveShowOnlyDue;
              if (!isControlled) setInternalShowOnlyDue(newValue);
              onFilterChange(newValue);
            }}
            className={`gap-1 transition-all ${effectiveShowOnlyDue ? 'btn-1' : 'btn-5'} text-foreground`}
          >
            {effectiveShowOnlyDue ? (
              <Eye className="h-4 w-4 text-black" />
            ) : (
              <EyeOff className="h-4 w-4 text-black" />
            )}
          </Button>
        </div>

        {/* Total words block */}
        <div className="h-full flex mt-3 max-sm:mt-3 max-sm:w-[90%] max-sm:mx-auto max-sm:justify-center 
                  sm:mt-0 sm:ml-auto sm:justify-end sm:w-auto self-center">
          Total words: {lists.reduce((total, list) => total + list.words.length, 0)}
          &nbsp;&nbsp;·&nbsp;&nbsp;{totalDueWords} Ready for review
        </div>
      </div>

      <div className="w-full mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search lists..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onSearchChange(e.target.value);
            }}
            className="flex h-10 w-full rounded-md border border-input bg-secondary px-3 py-2 pr-10 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                onSearchChange("");
              }}
              className="absolute right-2 top-2 h-5 w-5 rounded-full bg-transparent text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default IndexHeader;
