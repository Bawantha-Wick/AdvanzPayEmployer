import api from './api';
import constant from '../constant';
import type { User, UserRole, CreateUserData, PaginatedResponse, PaginationParams, CorpUserRole, CreateCorpUserRoleData, CorpUserRolesResponse, UpdateCorpUserRoleData, CorpUserRoleDropdownResponse, CorpUsersResponse, CreateCorpUserData, UpdateCorpUserData, CorpUserResponse } from '../types/api';

export const userService = {
  // Get all users with pagination and search
  getUsers: async (params?: PaginationParams): Promise<PaginatedResponse<User>> => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  // Get user by ID
  getUser: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  },

  // Create new user
  createUser: async (userData: CreateUserData): Promise<User> => {
    const response = await api.post('/users', userData);
    return response.data.data;
  },

  // Update user
  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data.data;
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  // Toggle user active status
  toggleUserStatus: async (id: string): Promise<User> => {
    const response = await api.patch(`/users/${id}/toggle-status`);
    return response.data.data;
  },

  // Reset user password
  resetUserPassword: async (id: string): Promise<void> => {
    await api.post(`/users/${id}/reset-password`);
  },

  // Get user roles
  getUserRoles: async (params?: PaginationParams): Promise<PaginatedResponse<UserRole>> => {
    const response = await api.get('/user-roles', { params });
    return response.data;
  },

  // Get all available roles (without pagination)
  getAllRoles: async (): Promise<UserRole[]> => {
    const response = await api.get('/user-roles/all');
    return response.data.data;
  },

  // Get user role by ID
  getUserRole: async (id: string): Promise<UserRole> => {
    const response = await api.get(`/user-roles/${id}`);
    return response.data.data;
  },

  // Create new user role
  createUserRole: async (roleData: Omit<UserRole, 'id'>): Promise<UserRole> => {
    const response = await api.post('/user-roles', roleData);
    return response.data.data;
  },

  // Update user role
  updateUserRole: async (id: string, roleData: Partial<UserRole>): Promise<UserRole> => {
    const response = await api.put(`/user-roles/${id}`, roleData);
    return response.data.data;
  },

  // Delete user role
  deleteUserRole: async (id: string): Promise<void> => {
    await api.delete(`/user-roles/${id}`);
  },

  // Toggle user role active status
  toggleUserRoleStatus: async (id: string): Promise<UserRole> => {
    const response = await api.patch(`/user-roles/${id}/toggle-status`);
    return response.data.data;
  },

  // Get user permissions
  getUserPermissions: async (userId: string): Promise<string[]> => {
    const response = await api.get(`/users/${userId}/permissions`);
    return response.data.data;
  },

  // Get available permissions
  getAvailablePermissions: async (): Promise<string[]> => {
    const response = await api.get('/permissions');
    return response.data.data;
  },

  // Create corporate user role (new API)
  createCorpUserRole: async (roleData: CreateCorpUserRoleData): Promise<CorpUserRole> => {
    const response = await api.post('/corp-user-role', roleData);
    return response.data;
  },

  // Get corporate user roles with pagination and search
  getCorpUserRoles: async (params: { page: number; search?: string }): Promise<CorpUserRolesResponse> => {
    const response = await api.get('/corp-user-role', { params });
    return response.data.data;
  },

  // Update corporate user role (PUT API)
  updateCorpUserRole: async (roleData: UpdateCorpUserRoleData): Promise<CorpUserRole> => {
    const response = await api.put('/corp-user-role', roleData);
    return response.data;
  },

  // Disable/Toggle corporate user role status
  toggleCorpUserRoleStatus: async (roleId: number): Promise<CorpUserRole> => {
    const response = await api.put('/corp-user-role', {
      index: roleId,
      status: constant.status.inactive
    });
    return response.data;
  },

  // Get corporate user roles for dropdown
  getCorpUserRolesDropdown: async (): Promise<CorpUserRoleDropdownResponse> => {
    const response = await api.get('/corp-user-role/dd');
    return response.data;
  },

  // Get corporate users with pagination and search
  getCorpUsers: async (params: { page: number; search?: string }): Promise<CorpUsersResponse> => {
    const response = await api.get('/corp-user', { params });
    return response.data;
  },

  // Create corporate user
  createCorpUser: async (userData: CreateCorpUserData): Promise<CorpUserResponse> => {
    const response = await api.post('/corp-user', userData);
    return response.data;
  },

  // Update corporate user
  updateCorpUser: async (userData: UpdateCorpUserData): Promise<CorpUserResponse> => {
    const response = await api.put('/corp-user', userData);
    return response.data;
  },

  // Toggle corporate user status
  toggleCorpUserStatus: async (userNo: number, status: typeof constant.status.active | typeof constant.status.inactive): Promise<CorpUserResponse> => {
    const response = await api.put('/corp-user', {
      no: userNo,
      status: status
    });
    return response.data;
  },

  // Toggle corporate user status using the new API
  toggleCorpUserStatusNew: async (id: number): Promise<CorpUserResponse> => {
    const response = await api.put('/corp-user/toggle-status', {
      id: id
    });
    return response.data;
  }
};
