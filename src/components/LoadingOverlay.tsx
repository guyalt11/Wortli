import LoadingSpinner from "./ui/LoadingSpinner";

interface LoadingOverlayProps {
    message?: string;
}

const LoadingOverlay = ({ message }: LoadingOverlayProps) => {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <LoadingSpinner size="lg" className="scale-150" />
                {message && <p className="text-lg font-medium text-light/80 animate-pulse">{message}</p>}
            </div>
        </div>
    );
};

export default LoadingOverlay;
