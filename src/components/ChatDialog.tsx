import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Loader2 } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { sendChatMessage, ChatMessage } from '@/services/chatService';
import { toast } from '@/components/ui/use-toast';
import { useVocab } from '@/context/VocabContext';
import TypingIndicator from '@/components/ui/TypingIndicator';
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from '@/components/LoadingOverlay';
import { useAuth } from '@/context/AuthContext';
import { usePreferences } from '@/context/PreferencesContext';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, ListPlus } from 'lucide-react';

interface ChatDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const ChatDialog = ({ open, onOpenChange }: ChatDialogProps) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSavingList, setIsSavingList] = useState(false);
    const [importMode, setImportMode] = useState<'new' | 'existing' | null>(null);
    const [selectedListId, setSelectedListId] = useState<string>('');
    const [viewportHeight, setViewportHeight] = useState('100dvh');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { importList, addWord, lists, allWords } = useVocab();
    const { token } = useAuth();
    const { preferences } = usePreferences();
    const navigate = useNavigate();

    // Mobile keyboard not to cover input
    useEffect(() => {
        if (!window.visualViewport) return;

        const handleResize = () => {
            setViewportHeight(`${window.visualViewport.height}px`);
        };

        window.visualViewport.addEventListener('resize', handleResize);
        handleResize();

        return () => window.visualViewport?.removeEventListener('resize', handleResize);
    }, []);

    // Reset chat when opened
    useEffect(() => {
        if (open) {
            setMessages([]);
            setImportMode(null);
            setSelectedListId('');
        }
    }, [open]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const extractJSON = (text: string): any | null => {
        try {
            const codeBlockMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
            if (codeBlockMatch) {
                return JSON.parse(codeBlockMatch[1]);
            }
            const jsonMatch = text.match(/\{[\s\S]*"name"[\s\S]*"language"[\s\S]*"words"[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return null;
        } catch {
            return null;
        }
    };

    const isValidVocabList = (obj: any): boolean => {
        return (
            obj &&
            typeof obj === 'object' &&
            typeof obj.name === 'string' &&
            typeof obj.language === 'string' &&
            Array.isArray(obj.words) &&
            obj.words.every((word: any) =>
                typeof word.origin === 'string' &&
                typeof word.transl === 'string'
            )
        );
    };

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [input]);

    useEffect(() => {
        if (!isLoading && !/Mobi|Android/i.test(navigator.userAgent)) {
            textareaRef.current?.focus();
        }
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            role: 'user',
            content: input.trim(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // If user just started typing without choosing, default to 'new'
        let effectiveImportMode = importMode;
        if (!effectiveImportMode) {
            setImportMode('new');
            effectiveImportMode = 'new';
        }

        try {
            if (!token) throw new Error('Not authenticated');

            // Find context for the selected list if in 'existing' mode
            const selectedList = effectiveImportMode === 'existing' ? lists.find(l => l.id === selectedListId) : null;

            // Determine words to exclude (prioritize selected list words, then all words if preference is on)
            let existingWordStrings: string[] | undefined = undefined;
            if (preferences?.aiInclude ?? true) {
                if (selectedList) {
                    // Combine selected list words and all words for better context
                    const listWords = selectedList.words.map(w => w.origin.toLowerCase());
                    const otherWords = allWords.map(w => w.origin.toLowerCase());
                    existingWordStrings = Array.from(new Set([...listWords, ...otherWords]));
                } else {
                    existingWordStrings = Array.from(new Set(allWords.map(w => w.origin.toLowerCase())));
                }
            }

            const response = await sendChatMessage(
                userMessage.content,
                messages,
                token,
                selectedList?.language || preferences?.defaultOrigin,
                selectedList?.target || preferences?.defaultTransl,
                preferences?.aiRules,
                existingWordStrings
            );

            const jsonData = extractJSON(response);

            if (jsonData && isValidVocabList(jsonData)) {
                setIsSavingList(true);

                if (importMode === 'existing' && selectedListId) {
                    // Add words to existing list sequentially for better stability
                    for (const word of jsonData.words) {
                        try {
                            await addWord(selectedListId, {
                                origin: word.origin,
                                transl: word.transl,
                                gender: word.gender,
                                notes: word.notes
                            });
                        } catch (err) {
                            console.error('Error adding word to existing list:', err);
                        }
                    }

                    const successMessage: ChatMessage = {
                        role: 'assistant',
                        content: `Excellent! I've added ${jsonData.words.length} words to your existing list.`,
                    };
                    setMessages((prev) => [...prev, successMessage]);

                    onOpenChange(false);
                    setTimeout(() => {
                        navigate(`/list/${selectedListId}`);
                    }, 100);
                } else {
                    // Create new list (default or if 'new' chosen)
                    const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
                    const jsonFile = new File([jsonBlob], `${jsonData.name}.json`, { type: 'application/json' });

                    const importedList = await importList(jsonFile, jsonData.name);

                    if (importedList) {
                        onOpenChange(false);
                        setTimeout(() => {
                            navigate(`/list/${importedList.id}`);
                        }, 100);
                    } else {
                        toast({
                            title: 'Error',
                            description: 'Failed to import the vocabulary list.',
                            variant: 'destructive',
                        });
                    }
                }
            } else {
                const assistantMessage: ChatMessage = {
                    role: 'assistant',
                    content: response,
                };
                setMessages((prev) => [...prev, assistantMessage]);
            }
        } catch (error: any) {
            console.error('Chat error:', error);

            let errorMessage = 'Failed to get response from AI. Please try again.';
            if (error.message) {
                errorMessage = error.message;
            }

            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
            setIsSavingList(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {isSavingList && <LoadingOverlay message="Saving vocabulary list..." />}
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent
                    style={{ height: viewportHeight }}
                    className="sm:max-w-full md:max-w-3xl flex flex-col p-0 gap-0 border-0 sm:border animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300 sm:rounded-lg rounded-none fixed top-0 left-0 translate-x-0 translate-y-0 sm:fixed sm:left-[50%] sm:top-[50%] sm:-translate-x-1/2 sm:-translate-y-1/2"
                >
                    <DialogHeader className="px-6 pt-5 pb-5 border-b-0 sm:border-b border-white/20 bg-gradient-dark">
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <MessageCircle className="h-6 w-6 text-light" />
                            AI Assistant
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 flex flex-col overflow-y-auto px-6 py-3 space-y-3 bg-dark">
                        {messages.length === 0 && !importMode ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center animate-pulse">
                                    <MessageCircle className="h-8 w-8 text-light" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xl text-tertiary-foreground font-bold">AI Assistant</p>
                                    <p className="text-sm text-tertiary-foreground/80 max-w-md">
                                        What would you like me to help you with?
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
                                    <Button
                                        variant="outline"
                                        className="group h-24 flex flex-col gap-2"
                                        onClick={() => setImportMode('new')}
                                    >
                                        <Plus className="h-6 w-6 text-light group-hover:text-light-foreground transition-none" />
                                        <span>Create New List</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="group h-24 flex flex-col gap-2"
                                        onClick={() => setImportMode('existing')}
                                        disabled={lists.length === 0}
                                    >
                                        <ListPlus className="h-6 w-6 text-light group-hover:text-light-foreground transition-none" />
                                        <span>Add to Existing</span>
                                    </Button>
                                </div>

                                {lists.length === 0 && (
                                    <p className="text-xs text-tertiary-foreground/60 italic">
                                        (You don't have any lists yet. Create a new one first!)
                                    </p>
                                )}
                            </div>
                        ) : messages.length === 0 && importMode === 'existing' && !selectedListId ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                                <div className="space-y-2 flex flex-col items-center">
                                    <div className="w-16 h-16 mb-4 rounded-full bg-secondary flex items-center justify-center animate-pulse">
                                        <MessageCircle className="h-8 w-8 text-light" />
                                    </div>
                                    <p className="text-lg text-tertiary-foreground font-semibold">Which list should I add to?</p>
                                </div>

                                <div className="w-full max-w-xs">
                                    <Select onValueChange={setSelectedListId}>
                                        <SelectTrigger className="bg-dark/50 border-white/10">
                                            <SelectValue placeholder="Select a list..." />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-60 overflow-y-auto">
                                            {lists.map(list => (
                                                <SelectItem key={list.id} value={list.id}>
                                                    {list.name} ({list.words.length} words)
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="bg-secondary text-tertiary-foreground/60"
                                    onClick={() => setImportMode(null)}
                                >
                                    Back
                                </Button>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center animate-pulse">
                                    <MessageCircle className="h-8 w-8 text-light" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-lg text-tertiary-foreground font-semibold">
                                        {importMode === 'new' ? 'Creating a New List' : `Adding to: ${lists.find(l => l.id === selectedListId)?.name}`}
                                    </p>
                                    <p className="text-sm text-tertiary-foreground max-w-md">
                                        Tell me what vocabulary you'd like to generate!
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-tertiary-foreground/40 h-7 text-[10px]"
                                    onClick={() => {
                                        setImportMode(null);
                                        setSelectedListId('');
                                    }}
                                >
                                    Change Destination
                                </Button>
                            </div>
                        ) : (
                            messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in-0 slide-in-from-bottom-2 duration-300`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div
                                        className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-3 shadow-lg transition-all hover:shadow-xl ${message.role === 'user' ? 'bg-light text-light-foreground' : 'bg-gradient-dark'
                                            }`}
                                    >
                                        <p className="text-sm md:text-base whitespace-pre-wrap break-words leading-relaxed">
                                            {message.content}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                        {isLoading && (
                            <div className="flex justify-start animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                                <div className="rounded-2xl px-5 py-3 shadow-lg bg-gradient-dark">
                                    <TypingIndicator />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="border-t-0 sm:border-t border-white/20 px-6 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-gradient-dark">
                        <div className="flex gap-3">
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder={importMode === 'existing' && !selectedListId ? "Select a list first..." : "Type your message..."}
                                disabled={isLoading || (importMode === 'existing' && !selectedListId)}
                                rows={1}
                                className="flex-1 resize-none px-4 py-3 text-sm md:text-base border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-light focus:border-transparent disabled:opacity-50 bg-dark overflow-hidden"
                            />
                            <Button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading || (importMode === 'existing' && !selectedListId)}
                                size="icon"
                                className="h-12 w-12 rounded-xl transition-all hover:scale-105 active:scale-95"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Send className="h-5 w-5" />
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ChatDialog;
