import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, currentUser } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100dvh-4rem)]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Since we don't have admin functionality in our AuthContext,
  // we'll just show a message and redirect to home
  toast({
    title: "Admin Access Restricted",
    description: "Admin functionality is not available in the current implementation.",
    variant: "destructive",
  });
  return <Navigate to="/" />;
};

export default AdminRoute;
