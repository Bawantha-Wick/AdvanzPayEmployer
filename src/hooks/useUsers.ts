import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import type { User, UserRole, PaginationParams } from '../types/api';

// User queries
export const useUsers = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userService.getUsers(params)
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUser(id),
    enabled: !!id
  });
};

export const useUserPermissions = (userId: string) => {
  return useQuery({
    queryKey: ['user-permissions', userId],
    queryFn: () => userService.getUserPermissions(userId),
    enabled: !!userId
  });
};

export const useAvailablePermissions = () => {
  return useQuery({
    queryKey: ['available-permissions'],
    queryFn: userService.getAvailablePermissions
  });
};

// User mutations
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) => userService.updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
    }
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.toggleUserStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', data.id] });
    }
  });
};

export const useResetUserPassword = () => {
  return useMutation({
    mutationFn: userService.resetUserPassword
  });
};

// User Role queries
export const useUserRoles = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['user-roles', params],
    queryFn: () => userService.getUserRoles(params)
  });
};

export const useAllRoles = () => {
  return useQuery({
    queryKey: ['all-roles'],
    queryFn: userService.getAllRoles
  });
};

export const useUserRole = (id: string) => {
  return useQuery({
    queryKey: ['user-role', id],
    queryFn: () => userService.getUserRole(id),
    enabled: !!id
  });
};

// User Role mutations
export const useCreateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.createUserRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      queryClient.invalidateQueries({ queryKey: ['all-roles'] });
    }
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UserRole> }) => userService.updateUserRole(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      queryClient.invalidateQueries({ queryKey: ['all-roles'] });
      queryClient.invalidateQueries({ queryKey: ['user-role', variables.id] });
    }
  });
};

export const useDeleteUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.deleteUserRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      queryClient.invalidateQueries({ queryKey: ['all-roles'] });
    }
  });
};

export const useToggleUserRoleStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.toggleUserRoleStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      queryClient.invalidateQueries({ queryKey: ['all-roles'] });
      queryClient.invalidateQueries({ queryKey: ['user-role', data.id] });
    }
  });
};

// Corporate Users hooks
export const useCorpUsers = (params: { page: number; search?: string }) => {
  return useQuery({
    queryKey: ['corp-users', params],
    queryFn: () => userService.getCorpUsers(params)
  });
};
