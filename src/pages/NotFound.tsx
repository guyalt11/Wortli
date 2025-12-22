
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-4rem)] bg-background w-full">
      <div className="text-center p-6">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-dark from-light to-light/60 bg-clip-text text-transparent">404</h1>
        <p className="text-2xl font-semibold mb-6">Oops! Page not found</p>
        <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Button onClick={() => window.location.href = "/"} size="lg" className="px-8">
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
