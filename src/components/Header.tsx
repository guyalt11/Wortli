import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, LogIn, Flame, Target, Home, Brain, BookOpen, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LibraryDialog from '@/components/LibraryDialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/context/AuthContext';
import { usePreferences } from '@/context/PreferencesContext';
import { useVocab } from '@/context/VocabContext';

const Header = () => {
    const [setIsMobileMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const { currentUser, logout, isAuthenticated, streak, dailyCount } = useAuth();
    const { preferences } = usePreferences();
    const { isLibraryOpen, setIsLibraryOpen } = useVocab();
    const navigate = useNavigate();

    // Handle scroll behavior
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < 10) {
                // Always show header at top of page
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY) {
                // Scrolling down - hide header
                setIsVisible(false);
            } else {
                // Scrolling up - show header
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const handleDailyProgressClick = () => {
        navigate('/settings');
        // Wait for navigation and DOM update, then scroll to the element
        setTimeout(() => {
            const element = document.getElementById('daily-progress');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Add a highlight animation
                element.classList.add('highlight-pulse');
                setTimeout(() => {
                    element.classList.remove('highlight-pulse');
                }, 2000);
            }
        }, 100);
    };

    const getHomeLink = () => {
        return isAuthenticated ? '/home' : '/';
    };

    const handleLibraryClick = () => {
        setIsLibraryOpen(true);
    };

    const handleLibraryClose = (listsAdded: boolean) => {
        setIsLibraryOpen(false);
        if (listsAdded && isAuthenticated) {
            navigate('/home');
        }
    };

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 w-full border-b bg-background transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-0 md:-translate-y-full'
                    }`}
            >
                <div className="container max-w-3xl">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <button
                            onClick={() => handleNavigation(getHomeLink())}
                            className="flex items-center focus:outline-none rounded"
                        >
                            <img src="/logo.webp" alt="Wörtli Logo" className="h-10 w-10" />
                        </button>
                        <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
                            {/* Desktop Navigation */}
                            <nav className="hidden md:flex items-center gap-8">
                                <button
                                    onClick={() => handleNavigation(getHomeLink())}
                                    className="text-foreground hover:text-tertiary transition-colors font-medium"
                                >
                                    Home
                                </button>
                                <button
                                    onClick={() => isAuthenticated ? handleNavigation('/practice-all') : handleNavigation('/login')}
                                    className="text-foreground hover:text-tertiary transition-colors font-medium"
                                >
                                    Practice
                                </button>
                                <button
                                    onClick={handleLibraryClick}
                                    className="text-foreground hover:text-tertiary transition-colors font-medium"
                                >
                                    Library
                                </button>
                                <button
                                    onClick={() => isAuthenticated ? handleNavigation('/settings') : handleNavigation('/login')}
                                    className="text-foreground hover:text-tertiary transition-colors font-medium"
                                >
                                    Settings
                                </button>
                            </nav>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Streak Counter*/}
                            {isAuthenticated && (
                                <div className="flex items-center gap-2">
                                    <button className="flex items-center gap-1 px-2 py-1 rounded-full border border-border light:bg-[#b8f6f3]"
                                        title="Daily Progress"
                                        onClick={handleDailyProgressClick}>
                                        <Target className="h-4 w-4 daily-progress" />
                                        <span className="text-sm font-bold text-foreground">{dailyCount}{preferences?.dailyGoal ? `/${preferences?.dailyGoal}` : ''}</span>
                                    </button>
                                    <div className="flex items-center gap-1 px-2 py-1 rounded-full border border-border light:border-[#ffa262] light:bg-[#ffe5cb]" title="Current Streak">
                                        <Flame className="h-4 w-4 text-orange-500 fill-orange-500" />
                                        <span className="text-sm font-bold text-foreground">{streak}</span>
                                    </div>
                                </div>
                            )}

                            {/* User Menu (Visible on both Mobile and Desktop) */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-9 w-9">
                                        <User className="h-5 w-5" />
                                        <span className="sr-only">User menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {isAuthenticated ? (
                                        <>
                                            <DropdownMenuLabel className="flex items-center gap-2">
                                                <User className="h-4 w-4" />
                                                <span>{preferences?.username || currentUser?.email}</span>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2">
                                                <LogOut className="h-4 w-4" />
                                                <span>Logout</span>
                                            </DropdownMenuItem>
                                        </>
                                    ) : (
                                        <>
                                            <DropdownMenuLabel>Account</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleNavigation('/login')} className="flex items-center gap-2">
                                                <LogIn className="h-4 w-4" />
                                                <span>Login</span>
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
                <div className="flex items-center justify-around h-16">
                    <button
                        onClick={() => handleNavigation(getHomeLink())}
                        className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-tertiary transition-colors flex-1"
                    >
                        <Home className="h-6 w-6" />
                        <span className="text-[10px] font-medium">Home</span>
                    </button>
                    <button
                        onClick={() => isAuthenticated ? handleNavigation('/practice-all') : handleNavigation('/login')}
                        className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-tertiary transition-colors flex-1"
                    >
                        <Brain className="h-6 w-6" />
                        <span className="text-[10px] font-medium">Practice</span>
                    </button>
                    <button
                        onClick={handleLibraryClick}
                        className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-tertiary transition-colors flex-1"
                    >
                        <BookOpen className="h-6 w-6" />
                        <span className="text-[10px] font-medium">Library</span>
                    </button>
                    <button
                        onClick={() => isAuthenticated ? handleNavigation('/settings') : handleNavigation('/login')}
                        className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-tertiary transition-colors flex-1"
                    >
                        <SettingsIcon className="h-6 w-6" />
                        <span className="text-[10px] font-medium">Settings</span>
                    </button>
                </div>
                {/* Safe area inset for mobile devices with notches */}
                <div className="h-[env(safe-area-inset-bottom)] bg-background" />
            </div>

            {/* Spacer to prevent content jump when header becomes fixed */}
            <div className="h-16" />

            {/* Library Dialog */}
            <LibraryDialog
                open={isLibraryOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        handleLibraryClose(false);
                    } else {
                        setIsLibraryOpen(true);
                    }
                }}
            />
        </>
    );
};

export default Header;
