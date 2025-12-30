import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Footer = () => {
    const { isAuthenticated } = useAuth();
    return (
        <footer className="hidden md:block w-full py-4 mt-auto border-t backdrop-blur">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">©2025 Wörtli. All rights reserved</span>
                    </div>
                    <div className="flex gap-6 text-xs text-muted-foreground">
                        <Link
                            to="/about"
                            className="hover:text-tertiary transition-colors duration-200"
                        >
                            About
                        </Link>
                        <a
                            href="/privacy.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-tertiary transition-colors duration-200"
                        >
                            Privacy Policy
                        </a>
                        {isAuthenticated && (
                            <Link
                                to="/settings"
                                className="hover:text-tertiary transition-colors duration-200"
                            >
                                Settings
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
