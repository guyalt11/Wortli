
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { VocabList, PracticeDirection } from "@/types/vocabulary";
import ListCard from "@/components/ListCard";

interface VocabListGridProps {
  lists: VocabList[];
  onSelectList: (id: string) => void;
  onEditList: (id: string) => void;
  onDeleteList: (id: string) => void;
  onExportList: (id: string, format: 'json') => void;
  onImportWords: (file: File, listName: string) => Promise<void>;
  onShareToggle: (id: string, share: boolean) => void;
  onPinToggle: (id: string, pinned: boolean) => void;
  urlDirection: string;
  listId: string;
  showOnlyDue: boolean;
}

const VocabListGrid = ({
  lists,
  onSelectList,
  onEditList,
  onDeleteList,
  onExportList,
  onImportWords,
  onShareToggle,
  onPinToggle,
  urlDirection,
  listId,
  showOnlyDue,
}: VocabListGridProps) => {
  const { goToList, goToPractice } = useAppNavigation();

  const handlePractice = (direction: string, id: string) => {
    goToPractice(id, direction as PracticeDirection);
  };

  return (
    <div className="space-y-4">
      {lists
        .sort((a, b) => {
          // Pinned lists come first
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return 0;
        })
        .filter(list => !showOnlyDue || list.words.some(word => {
          const now = new Date();
          return (!word.nextReview?.translateFrom || word.nextReview.translateFrom <= now) ||
            (!word.nextReview?.translateTo || word.nextReview.translateTo <= now);
        }))
        .map((list) => (
          <div key={list.id} className="flex flex-col">
            <ListCard
              list={list}
              onSelect={() => {
                onSelectList(list.id);
                goToList(list.id);
              }}
              onEdit={() => onEditList(list.id)}
              onDelete={() => onDeleteList(list.id)}
              onExport={() => onExportList(list.id, 'json')}
              onImport={() => {
                // Create a file input element to trigger file selection
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = async (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    await onImportWords(file, list.id);
                  }
                };
                input.click();
              }}
              onShareToggle={onShareToggle}
              onPinToggle={onPinToggle}
            />
          </div>
        ))}
    </div>
  );
};

export default VocabListGrid;
