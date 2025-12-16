import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, LogIn } from 'lucide-react';
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

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [libraryDialogOpen, setLibraryDialogOpen] = useState(false);
    const { currentUser, logout, isAuthenticated } = useAuth();
    const { preferences } = usePreferences();
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
                setIsMobileMenuOpen(false); // Close mobile menu when hiding
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
        setIsMobileMenuOpen(false);
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        setIsMobileMenuOpen(false);
    };

    const getHomeLink = () => {
        return isAuthenticated ? '/' : '/home';
    };

    const handleLibraryClick = () => {
        setLibraryDialogOpen(true);
        setIsMobileMenuOpen(false);
    };

    const handleLibraryClose = (listsAdded: boolean) => {
        setLibraryDialogOpen(false);
        if (listsAdded && isAuthenticated) {
            navigate('/');
        }
    };

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 w-full border-b bg-background transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'
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
                        <div className="flex items-center gap-6 flex-1 justify-center">
                            {/* Desktop Navigation */}
                            <nav className="hidden md:flex items-center gap-10">
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
                        {/* Desktop User Menu */}
                        <div className="hidden md:flex items-center">
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

                        {/* Mobile Hamburger Button with Animation */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 focus:outline-none rounded relative w-10 h-10"
                            aria-label="Toggle menu"
                        >
                            <div className="flex flex-col items-center justify-center w-full h-full gap-1.5">
                                <span
                                    className={`block h-0.5 w-6 bg-current transition-all duration-300 ease-out ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                                        }`}
                                />
                                <span
                                    className={`block h-0.5 w-6 bg-current transition-all duration-300 ease-out ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                                        }`}
                                />
                                <span
                                    className={`block h-0.5 w-6 bg-current transition-all duration-300 ease-out ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                                        }`}
                                />
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className={`md:hidden fixed left-0 right-0 z-40 bg-background border-b transition-all duration-300 ease-in-out ${isMobileMenuOpen
                    ? 'opacity-100 pointer-events-auto'
                    : 'opacity-0 pointer-events-none'
                    }`}
                style={{ top: '64px' }} // Height of header (h-16 = 64px)
            >
                <div className={`container max-w-3xl py-4 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-4'
                    }`}>
                    <nav className="flex flex-col gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => handleNavigation(getHomeLink())}
                            className="justify-start text-foreground hover:header-hover"
                        >
                            Home
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => isAuthenticated ? handleNavigation('/practice-all') : handleNavigation('/login')}
                            className="justify-start text-foreground hover:header-hover"
                        >
                            Practice
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={handleLibraryClick}
                            className="justify-start text-foreground hover:header-hover"
                        >
                            Library
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => isAuthenticated ? handleNavigation('/settings') : handleNavigation('/login')}
                            className="justify-start text-foreground hover:header-hover"
                        >
                            Settings
                        </Button>

                        <div className="border-t my-2" />

                        {isAuthenticated ? (
                            <>
                                <div className="px-4 py-2 text-sm text-muted-foreground flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <span>{preferences?.username || currentUser?.email}</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    onClick={handleLogout}
                                    className="justify-start text-foreground flex items-center gap-2"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Logout</span>
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="ghost"
                                onClick={() => handleNavigation('/login')}
                                className="justify-start text-foreground flex items-center gap-2"
                            >
                                <LogIn className="h-4 w-4" />
                                <span>Login</span>
                            </Button>
                        )}
                    </nav>
                </div>
            </div>

            {/* Spacer to prevent content jump when header becomes fixed */}
            <div className="h-16" />

            {/* Library Dialog */}
            <LibraryDialog
                open={libraryDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        handleLibraryClose(false);
                    }
                }}
            />
        </>
    );
};

export default Header;
