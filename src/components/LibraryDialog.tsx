import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useSharedLists } from '@/hooks/useSharedLists';
import { useVocab } from '@/context/VocabContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import FlagIcon from '@/components/FlagIcon';
import { VocabList } from '@/types/vocabulary';
import { ChevronDown, ChevronRight } from 'lucide-react';
import LoadingOverlay from '@/components/LoadingOverlay';
import { getLanguageName } from '@/constants/languages';

interface LibraryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const LibraryDialog = ({ open, onOpenChange }: LibraryDialogProps) => {
    const { sharedLists, isLoading } = useSharedLists();
    const { importList } = useVocab();
    const { isAuthenticated } = useAuth();
    const [selectedLanguage, setSelectedLanguage] = useState<string>('any');
    const [selectedListIds, setSelectedListIds] = useState<Set<string>>(new Set());
    const [expandedListId, setExpandedListId] = useState<string | null>(null);
    const [isImporting, setIsImporting] = useState(false);

    // Get unique languages from shared lists
    const availableLanguages = useMemo(() => {
        const languages = new Set(sharedLists.map(list => list.language));
        return Array.from(languages).sort();
    }, [sharedLists]);

    // Filter lists by selected language
    const filteredLists = useMemo(() => {
        if (selectedLanguage === 'any') {
            return sharedLists;
        }
        return sharedLists.filter(list => list.language === selectedLanguage);
    }, [sharedLists, selectedLanguage]);

    const { systemLists, userLists } = useMemo(() => {
        const SYSTEM_USER_ID = '2a439013-2c4e-44f9-ba7b-00baf0676138';
        return {
            systemLists: filteredLists.filter(list => list.userId === SYSTEM_USER_ID),
            userLists: filteredLists.filter(list => list.userId !== SYSTEM_USER_ID)
        };
    }, [filteredLists]);

    const handleCheckboxChange = (listId: string, checked: boolean) => {
        const newSelected = new Set(selectedListIds);
        if (checked) {
            newSelected.add(listId);
        } else {
            newSelected.delete(listId);
        }
        setSelectedListIds(newSelected);
    };

    const handleLanguageChange = (language: string) => {
        setSelectedLanguage(language);
        setSelectedListIds(new Set()); // Clear all selections when language changes
    };

    const toggleExpanded = (listId: string) => {
        setExpandedListId(expandedListId === listId ? null : listId);
    };

    const renderListRow = (list: VocabList) => (
        <div key={list.id} className="border rounded-md overflow-hidden bg-dark/20">
            <div className="flex items-center gap-3 p-2 hover:bg-tertiary/50">
                <button
                    onClick={() => toggleExpanded(list.id)}
                    className="p-1 hover:bg-tertiary rounded transition-transform duration-200"
                >
                    {expandedListId === list.id ? (
                        <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                    ) : (
                        <ChevronRight className="h-4 w-4 transition-transform duration-200" />
                    )}
                </button>
                <FlagIcon country={list.language} size={20} />
                <div
                    className="flex-1 cursor-pointer"
                    onClick={() => toggleExpanded(list.id)}
                >
                    <div className="font-medium">{list.name}</div>
                    {list.description && (
                        <div className="text-sm text-tertiary-foreground line-clamp-1">
                            {list.description}
                        </div>
                    )}
                    <div className="text-xs text-tertiary-foreground">
                        {list.words.length} words
                    </div>
                </div>
                <Checkbox
                    id={`list-${list.id}`}
                    checked={selectedListIds.has(list.id)}
                    onCheckedChange={(checked) => handleCheckboxChange(list.id, checked as boolean)}
                    onClick={(e) => e.stopPropagation()}
                />
            </div>

            <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                    maxHeight: expandedListId === list.id ? '15rem' : '0',
                    opacity: expandedListId === list.id ? 1 : 0
                }}
            >
                <div className="bg-tertiary/30 p-3 border-t overflow-y-auto" style={{ maxHeight: '15rem' }}>
                    <div className="space-y-1">
                        {list.words.length === 0 ? (
                            <div className="text-sm text-tertiary-foreground text-center py-2">
                                No words in this list
                            </div>
                        ) : (
                            list.words.map((word, index) => (
                                <div
                                    key={index}
                                    className="text-sm flex items-center gap-2 py-1 px-2 hover:bg-tertiary/50 rounded"
                                >
                                    <span className="font-medium">{word.origin}</span>
                                    <span className="text-tertiary-foreground">|</span>
                                    <span>{word.transl}</span>
                                    {word.gender && (
                                        <span className="text-xs text-tertiary-foreground ml-auto">
                                            ({word.gender})
                                        </span>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const handleAddLists = async () => {
        if (selectedListIds.size === 0) {
            toast({
                title: 'No lists selected',
                description: 'Please select at least one list to add.',
                variant: 'destructive',
            });
            return;
        }

        // Close dialog first
        onOpenChange(false);

        setIsImporting(true);
        let successCount = 0;
        let errorCount = 0;

        for (const listId of selectedListIds) {
            const list = sharedLists.find(l => l.id === listId);
            if (!list) continue;

            try {
                // Convert the list to JSON format - ensure words array is properly included
                const listData = {
                    name: list.name,
                    description: list.description || '',
                    language: list.language,
                    target: list.target || 'en',
                    words: list.words.map(word => ({
                        transl: word.transl,
                        origin: word.origin,
                        gender: word.gender || null,
                        notes: word.notes || null
                    }))
                };

                // Create a blob and file from the data
                const blob = new Blob([JSON.stringify(listData)], { type: 'application/json' });
                const file = new File([blob], `${list.name}.json`, { type: 'application/json' });

                // Import the list
                const result = await importList(file, list.name);

                // Only count as success if importList returns a valid result
                if (result) {
                    successCount++;
                } else {
                    errorCount++;
                }
            } catch (error) {
                console.error(`Error importing list ${list.name}:`, error);
                errorCount++;
            }
        }

        setIsImporting(false);
        setSelectedListIds(new Set());

        // Show success toast only if there were successful imports
        if (successCount > 0) {
            toast({
                title: 'Lists imported',
                description: `Successfully imported ${successCount} list${successCount > 1 ? 's' : ''}.`,
            });

            // Close dialog and notify parent that lists were added
            onOpenChange(false);
        }
    };

    return (
        <>
            {isImporting && <LoadingOverlay message="Importing lists..." />}
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Shared Lists Library</DialogTitle>
                        <DialogDescription>
                            Import lists shared by other users.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
                        {/* Language Filter */}
                        <div className="flex items-center gap-2 pt-1">
                            <Label htmlFor="language-filter">Language:</Label>
                            <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                                <SelectTrigger id="language-filter" className="w-[180px]">
                                    <SelectValue placeholder="Any" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="any">All Languages</SelectItem>
                                    {availableLanguages.map(lang => (
                                        <SelectItem key={lang} value={lang}>
                                            {getLanguageName(lang)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Lists */}
                        <div className="flex-1 overflow-y-auto border rounded-md p-2 space-y-2">
                            {isLoading ? (
                                <div className="text-center py-8 text-tertiary-foreground">
                                    Loading shared lists...
                                </div>
                            ) : filteredLists.length === 0 ? (
                                <div className="text-center py-8 text-tertiary-foreground">
                                    No shared lists available.
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {systemLists.length > 0 && (
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-semibold text-tertiary-foreground px-1">Wörtli Lists</h3>
                                            <div className="space-y-2">
                                                {systemLists.map(list => renderListRow(list))}
                                            </div>
                                        </div>
                                    )}

                                    {userLists.length > 0 && (
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-semibold text-tertiary-foreground px-1">User Lists</h3>
                                            <div className="space-y-2">
                                                {userLists.map(list => renderListRow(list))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddLists}
                            disabled={!isAuthenticated || selectedListIds.size === 0 || isImporting}
                            title={!isAuthenticated ? "Please login to add lists" : ""}
                        >
                            {isImporting ? 'Adding...' : `Add ${selectedListIds.size > 0 ? `(${selectedListIds.size})` : ''}`}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default LibraryDialog;
