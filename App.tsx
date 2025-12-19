import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { FamilyDashboard } from './components/FamilyDashboard';
import { ResidentDashboard } from './components/ResidentDashboard';
import { StaffDashboard } from './components/StaffDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { MockDataProvider } from './components/MockDataContext';
import { Toaster } from './components/ui/sonner';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (session?.access_token) {
          setUser(session.user);
          // Fetch user role
          const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-f835a0b6/user/role`,
            {
              headers: {
                'Authorization': `Bearer ${session.access_token}`,
              },
            }
          );
          const data = await response.json();
          if (data.role) {
            setUserRole(data.role);
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data?.session?.access_token) {
        setUser(data.user);
        
        // Fetch user role
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-f835a0b6/user/role`,
          {
            headers: {
              'Authorization': `Bearer ${data.session.access_token}`,
            },
          }
        );
        const roleData = await response.json();
        if (roleData.role) {
          setUserRole(roleData.role);
        }
        
        return { success: true };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const handleSignup = async (email: string, password: string, name: string, role: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f835a0b6/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email, password, name, role }),
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      return { success: true };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserRole(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-neutral-600">Loading AuraHome...</p>
        </div>
      </div>
    );
  }

  return (
    <MockDataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/login" 
            element={
              user ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/signup" 
            element={
              user ? <Navigate to="/dashboard" /> : <SignupPage onSignup={handleSignup} />
            } 
          />
          <Route
            path="/dashboard"
            element={
              !user ? (
                <Navigate to="/login" />
              ) : userRole === 'family' ? (
                <FamilyDashboard user={user} onLogout={handleLogout} />
              ) : userRole === 'resident' ? (
                <ResidentDashboard user={user} onLogout={handleLogout} />
              ) : userRole === 'staff' ? (
                <StaffDashboard user={user} onLogout={handleLogout} />
              ) : userRole === 'admin' ? (
                <AdminDashboard user={user} onLogout={handleLogout} />
              ) : (
                <div className="min-h-screen flex items-center justify-center">
                  <p>Invalid user role</p>
                </div>
              )
            }
          />
        </Routes>
      </Router>
      <Toaster />
    </MockDataProvider>
  );
}