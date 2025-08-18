import api from './api';
import type { Employee, CreateEmployeeData, CreateCorpEmployeeData, UpdateCorpEmployeeData, EmployeeRequest, UpdateRequestStatusData, PaginatedResponse, PaginationParams, Transaction, CorpEmployeesResponse, CorpEmployee } from '../types/api';

export const employeeService = {
  // Get corporate employees with pagination and search (new API)
  getCorpEmployees: async (page: number = 1, search: string = ''): Promise<CorpEmployeesResponse> => {
    const response = await api.get('/corp-emp', {
      params: { page, search }
    });
    return response.data;
  },

  // Get all employees with pagination and search
  getEmployees: async (params?: PaginationParams): Promise<PaginatedResponse<Employee>> => {
    const response = await api.get('/employees', { params });
    return response.data;
  },

  // Get employee by ID
  getEmployee: async (id: string): Promise<Employee> => {
    const response = await api.get(`/employees/${id}`);
    return response.data.data;
  },

  // Create new employee
  createEmployee: async (employee: CreateEmployeeData): Promise<Employee> => {
    const response = await api.post('/employees', employee);
    return response.data.data;
  },

  // Create new corporate employee
  createCorpEmployee: async (employee: CreateCorpEmployeeData): Promise<CorpEmployee> => {
    const response = await api.post('/corp-emp', employee);
    return response.data;
  },

  // Update corporate employee
  updateCorpEmployee: async (employee: UpdateCorpEmployeeData): Promise<CorpEmployee> => {
    const response = await api.put('/corp-emp', employee);
    return response.data;
  },

  // Update employee
  updateEmployee: async (id: string, employee: Partial<Employee>): Promise<Employee> => {
    const response = await api.put(`/employees/${id}`, employee);
    return response.data.data;
  },

  // Delete employee
  deleteEmployee: async (id: string): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },

  // Toggle employee active status
  toggleEmployeeStatus: async (id: string): Promise<Employee> => {
    const response = await api.patch(`/employees/${id}/toggle-status`);
    return response.data.data;
  },

  // Verify employee
  verifyEmployee: async (id: string): Promise<Employee> => {
    const response = await api.patch(`/employees/${id}/verify`);
    return response.data.data;
  },

  // Get employee requests
  getEmployeeRequests: async (params?: PaginationParams): Promise<PaginatedResponse<EmployeeRequest>> => {
    const response = await api.get('/employee-requests', { params });
    return response.data;
  },

  // Get employee request by ID
  getEmployeeRequest: async (requestId: string): Promise<EmployeeRequest> => {
    const response = await api.get(`/employee-requests/${requestId}`);
    return response.data.data;
  },

  // Update request status
  updateRequestStatus: async (requestId: string, statusData: UpdateRequestStatusData): Promise<EmployeeRequest> => {
    const response = await api.patch(`/employee-requests/${requestId}/status`, {
      ...statusData,
      processedDate: new Date().toISOString()
    });
    return response.data.data;
  },

  // Approve request with remark
  approveRequestWithRemark: async (requestId: string, processedBy: string, remark: string): Promise<EmployeeRequest> => {
    return employeeService.updateRequestStatus(requestId, {
      processStatus: 'approved',
      processedBy,
      remark
    });
  },

  // Approve request (alias for consistency)
  approveRequest: async (requestId: string, processedBy: string, remark?: string): Promise<EmployeeRequest> => {
    return employeeService.updateRequestStatus(requestId, {
      processStatus: 'approved',
      processedBy,
      remark: remark || ''
    });
  },

  // Reject request with remark
  rejectRequestWithRemark: async (requestId: string, processedBy: string, remark: string): Promise<EmployeeRequest> => {
    return employeeService.updateRequestStatus(requestId, {
      processStatus: 'rejected',
      processedBy,
      remark
    });
  },

  // Reject request (alias for consistency)
  rejectRequest: async (requestId: string, processedBy: string, remark?: string): Promise<EmployeeRequest> => {
    return employeeService.updateRequestStatus(requestId, {
      processStatus: 'rejected',
      processedBy,
      remark: remark || ''
    });
  },

  // Get employee transactions
  getEmployeeTransactions: async (employeeId: string, params?: PaginationParams): Promise<PaginatedResponse<Transaction>> => {
    const response = await api.get(`/employees/${employeeId}/transactions`, { params });
    return response.data;
  },

  // Get employee statistics
  getEmployeeStats: async (): Promise<{
    totalEmployees: number;
    activeEmployees: number;
    verifiedEmployees: number;
    pendingRequests: number;
  }> => {
    const response = await api.get('/employees/stats');
    return response.data.data;
  },

  // Toggle corporate employee status
  toggleCorpEmployeeStatus: async (id: number): Promise<CorpEmployee> => {
    const response = await api.put('/corp-emp/toggle-status', {
      id: id
    });
    return response.data;
  },

  // Upload Excel file with employee data
  uploadExcelFile: async (file: File): Promise<{ message: string; count: number }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/corp/upload-employees', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Upload employee data (from Excel preview)
  uploadEmployeeData: async (employees: CreateCorpEmployeeData[]): Promise<{ message: string; count: number }> => {
    const response = await api.post('/corp/employees/bulk-create', { employees });
    return response.data;
  }
};
