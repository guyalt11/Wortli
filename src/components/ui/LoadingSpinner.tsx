import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
}

const LoadingSpinner = ({ className, size = "md" }: LoadingSpinnerProps) => {
    const sizeClasses = {
        sm: "h-4 w-4 border-b",
        md: "h-8 w-8 border-b-2",
        lg: "h-12 w-12 border-b-2",
        xl: "h-16 w-16 border-b-[3px]"
    };

    return (
        <div className={cn("flex items-center justify-center", className)}>
            <div
                className={cn(
                    "animate-spin rounded-full border-transparent border-primary",
                    sizeClasses[size]
                )}
            />
        </div>
    );
};

export default LoadingSpinner;
