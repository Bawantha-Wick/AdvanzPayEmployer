import React, { createContext, useEffect, useState } from 'react';
import { useCurrentUser, useLogin, useLogout, useRegister } from '../hooks/useAuth';
import { authService } from '../services/authService';
import type { User, LoginData, RegisterData } from '../types/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginData) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  const { data: user, isLoading: isUserLoading, refetch } = useCurrentUser();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          await refetch();
        } catch (error) {
          console.error('Failed to fetch current user:', error);
          // Clear invalid token
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, [refetch]);

  const login = async (credentials: LoginData) => {
    await loginMutation.mutateAsync(credentials);
  };

  const register = async (userData: RegisterData) => {
    await registerMutation.mutateAsync(userData);
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    user: user || null,
    isAuthenticated: !!user,
    isLoading: isUserLoading || loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
    login,
    register,
    logout
  };

  // Show loading spinner while initializing
  if (!isInitialized) {
    return <LoadingSpinner fullScreen message="Initializing..." />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
