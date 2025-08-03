import api from './api';
import type { User, LoginData, RegisterData, AuthResponse } from '../types/api';

export const authService = {
  // Login user
  login: async (credentials: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    const { user, token, refreshToken } = response.data.data;

    // Store token in localStorage
    localStorage.setItem('authToken', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }

    return { user, token, refreshToken };
  },

  // Register user
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    const { user, token, refreshToken } = response.data.data;

    // Store token in localStorage
    localStorage.setItem('authToken', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }

    return { user, token, refreshToken };
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens from localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
    }
  },

  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data.data;
  },

  // Refresh token
  refreshToken: async (): Promise<AuthResponse> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post('/auth/refresh', { refreshToken });
    const { user, token, refreshToken: newRefreshToken } = response.data.data;

    // Update tokens in localStorage
    localStorage.setItem('authToken', token);
    if (newRefreshToken) {
      localStorage.setItem('refreshToken', newRefreshToken);
    }

    return { user, token, refreshToken: newRefreshToken };
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/auth/forgot-password', { email });
  },

  // Reset password
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await api.post('/auth/reset-password', { token, newPassword });
  },

  // Verify email
  verifyEmail: async (token: string): Promise<void> => {
    await api.post('/auth/verify-email', { token });
  },

  // Resend verification email
  resendVerification: async (email: string): Promise<void> => {
    await api.post('/auth/resend-verification', { email });
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await api.post('/auth/change-password', {
      currentPassword,
      newPassword
    });
  },

  // Update profile
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await api.put('/auth/profile', userData);
    return response.data.data;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  },

  // Get stored token
  getToken: (): string | null => {
    return localStorage.getItem('authToken');
  }
};
