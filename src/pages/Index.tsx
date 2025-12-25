import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVocab } from '@/context/VocabContext';
import { usePreferences } from '@/context/PreferencesContext';
import { useVocabImportExport } from '@/hooks/useVocabImportExport';
import { toast } from "@/components/ui/use-toast";
import AddListForm from '@/components/AddListForm';
import VocabListGrid from '@/components/VocabListGrid';
import IndexHeader from '@/components/IndexHeader';
import EmptyListsState from '@/components/EmptyListsState';
import ImportListDialog from '@/components/ImportListDialog';
import EditListDialog from '@/components/EditListDialog';
import DeleteListDialog from '@/components/DeleteListDialog';
import ChatButton from '@/components/ChatButton';
import { VocabList } from '@/types/vocabulary';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { useEffect, useRef } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const Index = () => {
  const { lists, exportList, importList, deleteList, updateList, getListById, addWord, isLoading, isLibraryOpen, setIsLibraryOpen } = useVocab();
  const { preferences } = usePreferences();
  const navigate = useNavigate();
  const { goToList, goToPracticeAll } = useAppNavigation();
  const { importList: importListFunc } = useVocabImportExport({ lists, setLists: async () => { } });
  const [showEmptyState, setShowEmptyState] = useState(false);
  const listsRef = useRef(lists);

  useEffect(() => {
    listsRef.current = lists;
    // Only show empty state if not loading and lists are empty
    if (!isLoading && lists.length === 0) {
      setShowEmptyState(true);
    } else {
      setShowEmptyState(false);
    }
  }, [lists, isLoading]);

  // UI state
  const [addListOpen, setAddListOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  // Initialize showOnlyDue from preferences so the initial state is respected by controlled IndexHeader
  const [showOnlyDue, setShowOnlyDue] = useState<boolean>(() => preferences?.hideEmptyLists ?? false);
  const [searchQuery, setSearchQuery] = useState("");

  // Keep showOnlyDue in sync if preferences change later
  useEffect(() => {
    setShowOnlyDue(preferences?.hideEmptyLists ?? false);
  }, [preferences?.hideEmptyLists]);

  // Edit list state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<VocabList | null>(null);

  // Delete list state
  const [deleteListId, setDeleteListId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Library state removed - using global context

  // Chat state
  const [chatOpen, setChatOpen] = useState(false);

  // Handlers
  const handleAddList = () => {
    setAddListOpen(true);
  };

  const handleImportClick = () => {
    setImportDialogOpen(true);
  };

  const handleLibraryClick = () => {
    setIsLibraryOpen(true);
  };

  const handleImport = async (file: File, listName: string) => {
    const list = await importList(file, listName);
    const maxRetries = 3;
    let retryCount = 0;
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    while (retryCount < maxRetries) {
      const exists = listsRef.current.some(l => l.id === list.id);
      if (exists) {
        setImportDialogOpen(false);
        navigate(`/list/${list.id}`);
        return;
      }
      retryCount++;
      await delay(300);
    }

    toast({
      title: "Error",
      description: "Failed to navigate to list after import. Please try again.",
      variant: "destructive",
    });
  };

  const handleEditList = (id: string) => {
    const list = lists.find(l => l.id === id);
    if (list) {
      setSelectedList(list);
      setEditDialogOpen(true);
    }
  };

  const handleSaveEdit = (id: string, updates: Partial<VocabList>) => {
    updateList(id, updates);
  };

  const handleDeleteList = (id: string) => {
    setDeleteListId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteList = () => {
    if (deleteListId) {
      deleteList(deleteListId);
      toast({
        title: "List deleted",
        description: "The vocabulary list has been deleted.",
      });
      setDeleteDialogOpen(false);
    }
  };

  const handlePracticeAll = () => {
    goToPracticeAll('translateFrom');
  };

  const handleShareToggle = (id: string, share: boolean) => {
    updateList(id, { share });
  };

  const handlePinToggle = (id: string, pinned: boolean) => {
    updateList(id, { pinned });
  };

  const importWordsToList = async (file: File, listId: string) => {
    try {
      const importedList = await importListFunc(file, 'temp');

      if (!importedList || !importedList.words.length) {
        toast({
          title: "No words found",
          description: "The file doesn't contain any words to import.",
          variant: "destructive",
        });
        return;
      }

      // Add each word to the list
      for (const word of importedList.words) {
        await addWord(listId, {
          origin: word.origin,
          transl: word.transl,
          gender: word.gender,
          notes: word.notes
        });
      }

      toast({
        title: "Import successful",
        description: `Added ${importedList.words.length} word${importedList.words.length > 1 ? 's' : ''} to the list.`,
      });
    } catch (error) {
      console.error('Error importing words to list:', error);
      toast({
        title: "Import error",
        description: "Failed to import words to the list. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container py-6 max-w-3xl">
      <ChatButton open={chatOpen} onOpenChange={setChatOpen} />
      <IndexHeader
        onAddList={handleAddList}
        onImport={handleImportClick}
        onLibrary={handleLibraryClick}
        lists={lists}
        onFilterChange={setShowOnlyDue}
        showOnlyDue={showOnlyDue}
        onSearchChange={setSearchQuery}
        onPracticeAll={handlePracticeAll}
        initialShowOnlyDue={preferences?.hideEmptyLists || false}
      />


      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : showEmptyState ? (
        <EmptyListsState onAddList={handleAddList} onLibrary={handleLibraryClick} />
      ) : (
        <VocabListGrid
          lists={lists.filter(list => list.name.toLowerCase().includes(searchQuery.toLowerCase()))}
          onSelectList={goToList}
          onEditList={handleEditList}
          onDeleteList={handleDeleteList}
          onExportList={exportList}
          onImportWords={async (file, listId) => {
            await importWordsToList(file, listId);
          }}
          onShareToggle={handleShareToggle}
          onPinToggle={handlePinToggle}
          showOnlyDue={showOnlyDue}
          onAddList={handleAddList}
          onLibrary={handleLibraryClick}
        />
      )}

      <AddListForm
        open={addListOpen}
        onOpenChange={setAddListOpen}
        onOpenChat={() => setChatOpen(true)}
        onSuccess={async (list) => {

          const maxRetries = 3;
          let retryCount = 0;

          const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

          while (retryCount < maxRetries) {
            const exists = listsRef.current.some(list => list.id === listsRef.current?.[0].id);
            if (exists) {
              navigate(`/list/${list.id}`);
              return;
            }

            retryCount++;
            await delay(300);
          }

          console.error('Index: Failed to find list after retries');
          toast({
            title: "Error",
            description: "Failed to navigate to list. Please try again.",
            variant: "destructive",
          });
        }}
      />

      <ImportListDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImport={handleImport}
      />

      <EditListDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveEdit}
        list={selectedList}
      />

      <DeleteListDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDeleteList}
      />

    </div>
  );
};

export default Index;
