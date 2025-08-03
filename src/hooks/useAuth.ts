import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';

// Auth queries
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getCurrentUser,
    enabled: authService.isAuthenticated(),
    retry: false
  });
};

// Auth mutations
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data.user);
    }
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data.user);
    }
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear();
    }
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authService.forgotPassword
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) => authService.resetPassword(token, newPassword)
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: authService.verifyEmail
  });
};

export const useResendVerification = () => {
  return useMutation({
    mutationFn: authService.resendVerification
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => authService.changePassword(currentPassword, newPassword)
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data);
    }
  });
};

export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.refreshToken,
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data.user);
    }
  });
};
