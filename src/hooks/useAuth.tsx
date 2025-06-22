import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Admin } from '../types';
import { authService } from '../services/auth';

interface AuthContextType {
  admin: Admin | null;
  isLoading: boolean;
  login: (phoneNumber: string, pin: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved session
    const savedAdmin = localStorage.getItem('admin');
    if (savedAdmin) {
      const adminData = JSON.parse(savedAdmin);
      authService.verifySession(adminData.$id).then((isValid) => {
        if (isValid) {
          setAdmin(adminData);
          // Refresh session periodically
          const interval = setInterval(() => {
            authService.refreshSession(adminData.$id);
          }, 5 * 60 * 1000); // Every 5 minutes
          return () => clearInterval(interval);
        } else {
          localStorage.removeItem('admin');
        }
      });
    }
    setIsLoading(false);
  }, []);

  const login = async (phoneNumber: string, pin: string) => {
    const adminData = await authService.login(phoneNumber, pin);
    if (adminData) {
      setAdmin(adminData);
      localStorage.setItem('admin', JSON.stringify(adminData));
    }
  };

  const logout = async () => {
    if (admin) {
      await authService.logout(admin.$id);
      setAdmin(null);
      localStorage.removeItem('admin');
    }
  };

  const refreshSession = async () => {
    if (admin) {
      await authService.refreshSession(admin.$id);
    }
  };

  return (
    <AuthContext.Provider value={{ admin, isLoading, login, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};