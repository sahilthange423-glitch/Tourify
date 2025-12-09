import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home, DestinationsList, DestinationDetails, PackageDetails } from './pages/Public';
import { Login, Register } from './pages/Auth';
import { UserDashboard, AdminDashboard } from './pages/Dashboard';
import { getCurrentUser, logout as logoutService } from './services/store';
import { User, UserRole } from './types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
  user: User | null;
}

const ProtectedRoute = ({ children, roles, user }: ProtectedRouteProps) => {
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = getCurrentUser();
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
  };

  const handleLogout = () => {
    logoutService();
    setUser(null);
  };

  return (
    <HashRouter>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<DestinationsList />} />
          <Route path="/destinations/:id" element={<DestinationDetails />} />
          <Route path="/packages/:id" element={<PackageDetails user={user} />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />

          {/* Protected Routes */}
          <Route 
            path="/bookings" 
            element={
              <ProtectedRoute user={user}>
                <UserDashboard user={user!} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute user={user} roles={[UserRole.ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;