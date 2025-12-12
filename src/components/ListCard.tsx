import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { VocabList } from "@/types/vocabulary";
import { Pin, MoreVertical, Pencil, Trash2, Download, Upload } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useAppNavigation } from '@/hooks/useAppNavigation';
import FlagIcon from '@/components/FlagIcon';
import { RightArrow } from '@/components/Icon';

interface ListCardProps {
  list: VocabList;
  onSelect: (id: string) => void;
  onShareToggle: (id: string, share: boolean) => void;
  onPinToggle: (id: string, pinned: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onExport: (id: string) => void;
  onImport: (id: string) => void;
}

const ListCard = ({ list, onSelect, onShareToggle, onPinToggle, onEdit, onDelete, onExport, onImport }: ListCardProps) => {
  const { goToPractice } = useAppNavigation();
  // Count words due for practice in each direction
  const now = new Date();
  const translateFromCount = list.words.filter(word => {
    const nextReview = word.nextReview?.translateFrom;
    return !nextReview || nextReview <= now;
  }).length;

  const translateToCount = list.words.filter(word => {
    const nextReview = word.nextReview?.translateTo;
    return !nextReview || nextReview <= now;
  }).length;

  const totalDueCount = translateFromCount + translateToCount;

  return (
    <Card className="h-full flex flex-col bg-primary">
      {/*<Card className="h-full flex flex-col" style={{ background: 'linear-gradient(135deg, rgba(8, 35, 38, 1) 0%, rgba(21, 76, 82, 1) 100%)' }}>*/}
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-start justify-between sm:flex-1">
            <CardTitle className="text-lg text-left flex-1">
              {list.name}
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-2 py-1 rounded-md backdrop-blur bg-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-share-fill" viewBox="0 0 16 16">
                  <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5" />
                </svg>
                <Switch
                  id={`share-${list.id}`}
                  checked={list.share || false}
                  onCheckedChange={(checked) => onShareToggle(list.id, checked)}
                  className="data-[state=unchecked]:bg-secondary"
                />
              </div>
              <Button
                variant="ghost"
                className={`h-8 px-2 flex-shrink-0 hover:bg-transparent hover:text-light ${list.pinned ? 'text-yellow-500' : ''}`}
                onClick={() => onPinToggle(list.id, !list.pinned)}
                title={list.pinned ? 'Unpin list' : 'Pin list'}
              >
                <Pin className={`h-4 w-4 ${list.pinned ? 'fill-current' : ''}`} />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 p-0 hover:bg-transparent hover:text-light"
                    title="List actions"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>List Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onEdit(list.id)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(list.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onExport(list.id)}>
                    <Download className="h-4 w-4 mr-2" />
                    Export as JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onImport(list.id)}>
                    <Upload className="h-4 w-4 mr-2" />
                    Import Words
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <CardDescription className="!mt-3 md:!mt-1 text-left text-gray-400">
          {list.description && (
            <p className="text-tertiary-foreground mb-2">
              {list.description}
            </p>
          )}
          Total words: <span className="text-white font-bold">{list.words.length} · {totalDueCount}</span> Ready for review
        </CardDescription>
      </CardHeader>
      <CardFooter className="pt-2 mt-auto flex flex-wrap sm:flex-nowrap gap-2">
        <div className="w-full sm:w-auto">
          <Button
            className="w-full sm:w-auto flex-1 sm:px-10 bg-gradient-tertiary text-dark"
            onClick={() => onSelect(list.id)}
          >
            View List
          </Button>
        </div>
        <div className="w-full sm:w-auto mt-2 sm:mt-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">Practice:</h3>
            <Button
              variant="default"
              onClick={() => goToPractice(list.id, 'translateFrom')}
              className={`relative overflow-hidden truncate transition-all bg-secondary ${translateFromCount === 0 ? 'cursor-not-allowed' : ''} px-3`}
              disabled={translateFromCount === 0}
            >
              <FlagIcon country={list.target || 'en'} size={20} />
              <RightArrow size={20} className="text-foreground" />
              <FlagIcon country={list.language} size={20} />
            </Button>
            <Button
              variant="default"
              onClick={() => goToPractice(list.id, 'translateTo')}
              className={`relative overflow-hidden truncate transition-all bg-secondary ${translateToCount === 0 ? 'cursor-not-allowed' : ''} px-3`}
              disabled={translateToCount === 0}
            >
              <FlagIcon country={list.language} size={20} />
              <RightArrow size={20} className="text-foreground" />
              <FlagIcon country={list.target || 'en'} size={20} />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ListCard;
