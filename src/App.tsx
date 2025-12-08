import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { SplashScreen } from "@/components/SplashScreen";
import { LoginPage } from "@/pages/LoginPage";
import { HomePage } from "@/pages/HomePage";
import { MotorDetailPage } from "@/pages/MotorDetailPage";
import { WalletPage } from "@/pages/WalletPage";
import { TopUpPage } from "@/pages/TopUpPage";
import { HistoryPage } from "@/pages/HistoryPage";
import { ProfilePage } from "@/pages/ProfilePage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user } = useApp();
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/motor/:id" element={<MotorDetailPage />} />
      <Route path="/wallet" element={<WalletPage />} />
      <Route path="/wallet/topup" element={<TopUpPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
