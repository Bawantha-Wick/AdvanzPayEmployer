import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '../services/employeeService';
import type { Employee, UpdateRequestStatusData, PaginationParams } from '../types/api';

// Employee queries
export const useEmployees = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['employees', params],
    queryFn: () => employeeService.getEmployees(params)
  });
};

export const useEmployee = (id: string) => {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: () => employeeService.getEmployee(id),
    enabled: !!id
  });
};

export const useEmployeeStats = () => {
  return useQuery({
    queryKey: ['employee-stats'],
    queryFn: employeeService.getEmployeeStats
  });
};

// Employee mutations
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeeService.createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee-stats'] });
    }
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Employee> }) => employeeService.updateEmployee(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['employee-stats'] });
    }
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeeService.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee-stats'] });
    }
  });
};

export const useToggleEmployeeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeeService.toggleEmployeeStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee', data.id] });
      queryClient.invalidateQueries({ queryKey: ['employee-stats'] });
    }
  });
};

export const useVerifyEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeeService.verifyEmployee,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee', data.id] });
      queryClient.invalidateQueries({ queryKey: ['employee-stats'] });
    }
  });
};

// Employee Request queries
export const useEmployeeRequests = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['employee-requests', params],
    queryFn: () => employeeService.getEmployeeRequests(params)
  });
};

export const useEmployeeRequest = (requestId: string) => {
  return useQuery({
    queryKey: ['employee-request', requestId],
    queryFn: () => employeeService.getEmployeeRequest(requestId),
    enabled: !!requestId
  });
};

// Employee Request mutations
export const useUpdateRequestStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, statusData }: { requestId: string; statusData: UpdateRequestStatusData }) => employeeService.updateRequestStatus(requestId, statusData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-requests'] });
    }
  });
};

export const useApproveRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, processedBy, remark }: { requestId: string; processedBy: string; remark?: string }) => employeeService.approveRequest(requestId, processedBy, remark),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-requests'] });
    }
  });
};

export const useRejectRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, processedBy, remark }: { requestId: string; processedBy: string; remark?: string }) => employeeService.rejectRequest(requestId, processedBy, remark),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-requests'] });
    }
  });
};

// Employee Transactions
export const useEmployeeTransactions = (employeeId: string, params?: PaginationParams) => {
  return useQuery({
    queryKey: ['employee-transactions', employeeId, params],
    queryFn: () => employeeService.getEmployeeTransactions(employeeId, params),
    enabled: !!employeeId
  });
};
