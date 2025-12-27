import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { VocabProvider } from "@/context/VocabContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { PreferencesProvider } from "@/context/PreferencesContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import VocabList from "./pages/VocabList";
import Practice from "./pages/Practice";
import PracticeAll from "./pages/PracticeAll";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import TokenExpiryChecker from "./components/TokenExpiryChecker";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  const isHomePath = location.pathname === "/home";
  const isAuthPath = ["/login", "/register"].includes(location.pathname);

  const showHeader = !isHomePath && (isAuthPath || (isAuthenticated && !isLoading));

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster />
      <Sonner />
      {showHeader && <Header />}
      <main className="flex-grow">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            }
          />
          <Route
            path="/list/:listId"
            element={
              <ProtectedRoute>
                <VocabList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/practice/:listId"
            element={
              <ProtectedRoute>
                <Practice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/practice-all"
            element={
              <ProtectedRoute>
                <PracticeAll />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <TokenExpiryChecker />
          <PreferencesProvider>
            <VocabProvider>
              <AppContent />
            </VocabProvider>
          </PreferencesProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
