import { useState, useEffect, useRef } from 'react';
import { VocabList } from '@/types/vocabulary';
import { useVocab } from '@/context/VocabContext';
import { LANGUAGES } from '@/constants/languages';
import { usePreferences } from '@/context/PreferencesContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Sparkles } from 'lucide-react';

interface AddListFormProps {
  editList?: VocabList;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (list: VocabList) => void;
  onOpenChat?: () => void;
}

const AddListForm: React.FC<AddListFormProps> = ({
  editList,
  open,
  onOpenChange,
  onSuccess,
  onOpenChat
}) => {
  const { addList, updateList } = useVocab();
  const { preferences } = usePreferences();
  const languageInputRef = useRef<HTMLInputElement>(null);
  const targetInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(editList?.name || '');
  const [description, setDescription] = useState(editList?.description || '');
  const [language, setLanguage] = useState(editList?.language || (preferences?.defaultOrigin === 'none' ? '' : preferences?.defaultOrigin) || '');
  const [target, setTarget] = useState(editList?.target || (preferences?.defaultTransl === 'none' ? '' : preferences?.defaultTransl) || '');

  // Sync defaults when preferences load
  useEffect(() => {
    if (!editList && preferences) {
      setLanguage(preferences.defaultOrigin === 'none' ? '' : preferences.defaultOrigin);
      setTarget(preferences.defaultTransl === 'none' ? '' : preferences.defaultTransl);
    }
  }, [preferences, editList]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    if (!language) {
      languageInputRef.current?.reportValidity();
      return;
    }

    if (!target) {
      targetInputRef.current?.reportValidity();
      return;
    }

    if (editList) {
      await updateList(editList.id, {
        name: name.trim(),
        description: description.trim() || undefined,
        language,
        target,
      });

      // If edit was successful and we have a callback, call it with the updated list
      if (onSuccess) {
        const updatedList = {
          ...editList,
          name: name.trim(),
          description: description.trim() || undefined,
          language,
          target,
        };
        onSuccess(updatedList);
      }
    } else {
      // When creating a new list, use the description parameter correctly
      const newList = await addList(name.trim(), description.trim() || undefined, language, target);

      // If creation was successful and we have a callback, call it with the new list
      if (newList && onSuccess) {
        onSuccess(newList);
      }
    }

    // Reset form
    setName('');
    setDescription('');
    setLanguage((preferences?.defaultOrigin === 'none' ? '' : preferences?.defaultOrigin) || '');
    setTarget((preferences?.defaultTransl === 'none' ? '' : preferences?.defaultTransl) || '');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editList ? 'Edit List' : 'Create New List'}</DialogTitle>
          <DialogDescription>
            {editList
              ? 'Update your vocabulary list details.'
              : 'Create a new vocabulary list to organize your words.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">List Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Food Vocabulary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Translate From</Label>
            <div className="relative">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="bg-secondary">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto bg-secondary">
                  {LANGUAGES.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                ref={languageInputRef}
                value={language}
                onChange={() => { }}
                required
                className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
                tabIndex={-1}
                aria-hidden="true"
                onFocus={(e) => {
                  const trigger = e.target.previousElementSibling?.querySelector('button') || e.target.parentElement?.querySelector('button');
                  if (trigger instanceof HTMLButtonElement) trigger.focus();
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target">To</Label>
            <div className="relative">
              <Select value={target} onValueChange={setTarget}>
                <SelectTrigger className="bg-secondary">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto bg-secondary">
                  {LANGUAGES.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                ref={targetInputRef}
                value={target}
                onChange={() => { }}
                required
                className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
                tabIndex={-1}
                aria-hidden="true"
                onFocus={(e) => {
                  const trigger = e.target.previousElementSibling?.querySelector('button') || e.target.parentElement?.querySelector('button');
                  if (trigger instanceof HTMLButtonElement) trigger.focus();
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a short description of this list..."
            />
          </div>

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-3">
            {!editList && onOpenChat && (
              <Button
                type="button"
                variant="ghost"
                className="group order-2 sm:order-1"
                onClick={() => {
                  onOpenChange(false);
                  onOpenChat();
                }}
              >
                <Sparkles className="h-5 w-5 mt-0.5 animate-pulse" />
                <span>Try generating with AI</span>
              </Button>
            )}
            <Button type="submit" className="order-1 sm:order-2">
              {editList ? 'Update List' : 'Create List'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddListForm;
