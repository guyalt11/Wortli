import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { VocabProvider } from "@/context/VocabContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { PreferencesProvider, usePreferences } from "@/context/PreferencesContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoalCelebration from "@/components/GoalCelebration";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
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
  const { isAuthenticated, isLoading, dailyCount, currentUser } = useAuth();
  const { preferences } = usePreferences();
  const [showGoalCelebration, setShowGoalCelebration] = useState(false);

  // Goal celebration logic
  useEffect(() => {
    if (!isAuthenticated || !preferences || preferences.dailyGoal <= 0 || !currentUser || isLoading) return;

    const today = new Date().toISOString().split('T')[0];
    if (dailyCount === preferences.dailyGoal) {
      const claimReward = async () => {
        try {
          const { data, error } = await supabase.rpc('claim_daily_reward');
          if (error) {
            console.error('Error claiming daily reward:', error);
            return;
          }
          if (data === true) {
            setShowGoalCelebration(true);
          }
        } catch (err) {
          console.error('Exception in claimReward:', err);
        }
      };

      claimReward();
    }
  }, [dailyCount, preferences?.dailyGoal, isAuthenticated, currentUser, isLoading]);

  const isHomePath = location.pathname === "/home";
  const isAuthPath = ["/login", "/register"].includes(location.pathname);

  const showHeader = !isHomePath && (isAuthPath || (isAuthenticated && !isLoading));

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster />
      {showHeader && <Header />}
      <GoalCelebration
        isOpen={showGoalCelebration}
        onClose={() => setShowGoalCelebration(false)}
        dailyGoal={preferences?.dailyGoal || 0}
      />
      <main className="flex-grow pb-[calc(5rem+env(safe-area-inset-bottom)-1rem)] md:pb-0">
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
