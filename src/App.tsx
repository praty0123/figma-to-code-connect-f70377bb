import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MockDataProvider } from "@/contexts/MockDataContext";
import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/pages/LoginPage";
import { SignupPage } from "@/pages/SignupPage";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { FamilyDashboard } from "@/pages/FamilyDashboard";
import { ResidentDashboard } from "@/pages/ResidentDashboard";
import { StaffDashboard } from "@/pages/StaffDashboard";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    // Mock login - in production, use real auth
    const mockUser = { email, user_metadata: { name: email.split('@')[0], role: 'family' } };
    setUser(mockUser);
    setUserRole('family');
    return { success: true };
  };

  const handleSignup = async (email: string, password: string, name: string, role: string) => {
    // Mock signup
    return { success: true };
  };

  const handleLogout = () => {
    setUser(null);
    setUserRole(null);
  };

  const getDashboard = () => {
    switch (userRole) {
      case 'admin': return <AdminDashboard user={user} onLogout={handleLogout} />;
      case 'family': return <FamilyDashboard user={user} onLogout={handleLogout} />;
      case 'resident': return <ResidentDashboard user={user} onLogout={handleLogout} />;
      case 'staff': return <StaffDashboard user={user} onLogout={handleLogout} />;
      default: return <Navigate to="/login" />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <MockDataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
              <Route path="/signup" element={<SignupPage onSignup={handleSignup} />} />
              <Route path="/admin" element={user ? <AdminDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
              <Route path="/family" element={user ? <FamilyDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
              <Route path="/resident" element={user ? <ResidentDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
              <Route path="/staff" element={user ? <StaffDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </MockDataProvider>
    </QueryClientProvider>
  );
};

export default App;
