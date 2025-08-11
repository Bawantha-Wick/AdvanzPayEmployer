// Employee related interfaces
export interface Employee {
  id: string;
  name: string;
  phone: string;
  email: string;
  salary: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Corporate Employee interfaces for the new API
export interface CorpEmployee {
  no: number;
  name: string;
  email: string;
  mobile: string;
  basicSalAmt: string;
  accNo: string;
  accName: string;
  accBank: string;
  accBranch: string;
  status: string;
  statusLabel: string;
  apStatus: string;
  apStatusLabel: string;
  isNew?: string; // New boolean parameter to indicate newly added employees
}

export interface CorpEmployeesResponse {
  statusCode: number;
  status: boolean;
  responseCode: string;
  message: string;
  data: {
    pagination: {
      total: number;
      pages: number;
    };
    employees: CorpEmployee[];
  };
}

export interface CreateEmployeeData {
  name: string;
  phone: string;
  email: string;
  salary: string;
}

// Corporate Employee creation data
export interface CreateCorpEmployeeData {
  name: string;
  email: string;
  mobile: string;
  basicSalAmt: number;
  accNo: string;
  accName: string;
  accBank: string;
  accBranch: string;
}

// Corporate Employee update data
export interface UpdateCorpEmployeeData {
  no: number;
  name: string;
  email: string;
  password?: string;
  mobile: string;
  basicSalAmt: number;
  accNo: string;
  accName: string;
  accBank: string;
  accBranch: string;
  status: string;
}

// Employee Request interfaces
export interface EmployeeRequest {
  id: string;
  title: string;
  date: string;
  amount: string;
  type: 'withdrawal' | 'deposit' | 'advance' | 'salary';
  status: 'pending' | 'approved' | 'rejected';
  verified: 'true' | 'false';
  employeeId?: string;
  employeeName?: string;
  processedBy?: string;
  processedDate?: string;
  remark?: string;
}

export interface UpdateRequestStatusData {
  processStatus: 'approved' | 'rejected';
  remark?: string;
  processedBy: string;
}

// User related interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface UserRole {
  id: string;
  roleName: string;
  permissions: string[];
  description?: string;
  isActive: boolean;
}

export interface CorpUserRole {
  id?: string;
  name: string;
  description: string;
  permissions: string;
}

export interface CreateCorpUserRoleData {
  name: string;
  description: string;
  permissions: string;
}

export interface UpdateCorpUserRoleData {
  no: number;
  name: string;
  description: string;
  permissions: string;
  status: string;
}

export interface CorpUserRoleItem {
  no: number;
  name: string;
  description: string;
  permissions: string;
  status: string;
}

export interface CorpUserRolesResponse {
  pagination: {
    page: number;
    total: number;
    pages: number;
  };
  roles: CorpUserRoleItem[];
}

export interface CorpUserRoleDropdownItem {
  no: number;
  name: string;
}

export interface CorpUserRoleDropdownResponse {
  statusCode: number;
  status: boolean;
  responseCode: string;
  message: string;
  data: {
    roles: CorpUserRoleDropdownItem[];
  };
}

// Corporate User interfaces
export interface CorpUser {
  no: number;
  name: string;
  email: string;
  title: string;
  mobile: string;
  status: string;
  statusLabel: string;
  role: number;
  roleLabel: string;
}

export interface CorpUsersResponse {
  statusCode: number;
  status: boolean;
  responseCode: string;
  message: string;
  data: {
    pagination: {
      page: string;
      total: number;
      pages: number;
    };
    users: CorpUser[];
  };
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface CreateCorpUserData {
  name: string;
  email: string;
  password: string;
  title: string;
  mobile: string;
  role: number;
}

export interface UpdateCorpUserData {
  no: number;
  name: string;
  email: string;
  password?: string;
  title: string;
  mobile: string;
  role: number;
}

export interface CorpUserResponse {
  statusCode: number;
  status: boolean;
  responseCode: string;
  message: string;
  data?: unknown;
}

// Auth interfaces
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginUser {
  id: number;
  username: string;
  email: string;
  title: string;
  mobile: string;
  accessToken: string;
  refreshToken: string;
}

export interface LoginApiResponse {
  statusCode: number;
  status: boolean;
  responseCode: string;
  message: string;
  data: LoginUser;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface RefreshTokenResponse {
  statusCode: number;
  status: boolean;
  responseCode: string;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

// Settlement interfaces
export interface Settlement {
  id: string;
  employeeId: string;
  employeeName: string;
  amount: string;
  date: string;
  status: 'Pending' | 'Completed' | 'Failed';
  transactionId?: string;
  paymentMethod: string;
}

// Transaction interfaces
export interface Transaction {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'Advance' | 'Salary' | 'Bonus' | 'Deduction';
  amount: string;
  date: string;
  status: 'Pending' | 'Completed' | 'Failed';
  description?: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
