
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Sparkles } from "lucide-react";
interface EmptyListsStateProps {
  onAddList: () => void;
  onLibrary: () => void;
  onOpenChange: (open: boolean) => void;
}

const EmptyListsState = ({ onAddList, onLibrary, onOpenChange }: EmptyListsStateProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-6 border-light">
      <Button
        variant="outline"
        className="w-full text-light h-24 border-2 border-dashed flex flex-col border-tertiary !bg-secondary hover:text-light"
        onClick={onAddList}
      >
        <Plus className="h-6 w-6 transition-none" />
        <span>Create your first list</span>
      </Button>
      <Button
        variant="outline"
        className="w-full text-light h-24 border-2 border-dashed flex flex-col border-tertiary !bg-secondary hover:text-light"
        onClick={() => onOpenChange(true)}
      >
        <Sparkles className="h-6 w-6 transition-none" />
        <span>Use our AI generator</span>
      </Button>
      <Button
        variant="outline"
        className="w-full text-light h-24 border-2 border-dashed flex flex-col border-tertiary !bg-secondary hover:text-light"
        onClick={onLibrary}
      >
        <BookOpen className="h-6 w-6 transition-none" />
        <span>Browse our library</span>
      </Button>
    </div>
  );
};

export default EmptyListsState;
