# API Integration Documentation

## Overview

This document describes the API integration structure implemented in the AdvanzPay Employer Portal. The implementation follows modern React patterns with TypeScript, React Query for state management, and Axios for HTTP client.

## Architecture

### 1. **API Configuration** (`src/services/api.ts`)

- Centralized Axios configuration
- Request/Response interceptors for authentication
- Error handling for 401 unauthorized responses
- Base URL configuration via environment variables

### 2. **Type Definitions** (`src/types/api.ts`)

- TypeScript interfaces for all API entities
- Request/Response type definitions
- Pagination and API response wrappers

### 3. **Service Layer** (`src/services/`)

- `authService.ts` - Authentication operations
- `employeeService.ts` - Employee management operations
- `userService.ts` - User and role management operations

### 4. **Custom Hooks** (`src/hooks/`)

- `useAuth.ts` - Authentication hooks
- `useEmployees.ts` - Employee management hooks
- `useUsers.ts` - User management hooks

### 5. **Context Providers** (`src/contexts/`)

- `AuthContext.tsx` - Global authentication state
- `useAuthContext.ts` - Hook for accessing auth context

## Environment Configuration

### Development (`.env`)

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=AdvanzPay Employer Portal
VITE_ENVIRONMENT=development
VITE_ENABLE_DEV_TOOLS=true
```

### Production (`.env.production`)

```env
VITE_API_BASE_URL=https://api.advanzpay.com/v1
VITE_APP_NAME=AdvanzPay Employer Portal
VITE_ENVIRONMENT=production
VITE_ENABLE_DEV_TOOLS=false
```

## API Endpoints

### Authentication

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `POST /auth/refresh` - Refresh access token
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password
- `POST /auth/verify-email` - Verify email address

### Employee Management

- `GET /employees` - Get paginated employees list
- `GET /employees/:id` - Get specific employee
- `POST /employees` - Create new employee
- `PUT /employees/:id` - Update employee
- `DELETE /employees/:id` - Delete employee
- `PATCH /employees/:id/toggle-status` - Toggle active status
- `PATCH /employees/:id/verify` - Verify employee
- `GET /employees/stats` - Get employee statistics

### Employee Requests

- `GET /employee-requests` - Get paginated employee requests
- `GET /employee-requests/:id` - Get specific request
- `PATCH /employee-requests/:id/status` - Update request status

### User Management

- `GET /users` - Get paginated users list
- `GET /users/:id` - Get specific user
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `PATCH /users/:id/toggle-status` - Toggle user status

### User Roles

- `GET /user-roles` - Get paginated user roles
- `GET /user-roles/all` - Get all roles (no pagination)
- `GET /user-roles/:id` - Get specific role
- `POST /user-roles` - Create new role
- `PUT /user-roles/:id` - Update role
- `DELETE /user-roles/:id` - Delete role

## Usage Examples

### Authentication

```typescript
import { useAuthContext } from '../contexts/useAuthContext';

function LoginForm() {
  const { login, isLoading } = useAuthContext();

  const handleSubmit = async (data: LoginData) => {
    try {
      await login(data);
      // Redirect to dashboard
    } catch (error) {
      // Handle login error
    }
  };
}
```

### Employee Management

```typescript
import { useEmployees, useCreateEmployee } from '../hooks/useEmployees';

function EmployeesList() {
  const { data, isLoading, error } = useEmployees({ page: 1, limit: 10 });
  const createEmployee = useCreateEmployee();

  const handleCreate = async (employeeData: CreateEmployeeData) => {
    try {
      await createEmployee.mutateAsync(employeeData);
      // Employee created successfully
    } catch (error) {
      // Handle creation error
    }
  };
}
```

### Error Handling

```typescript
import { ErrorDisplay } from '../components/common/ErrorDisplay';

function MyComponent() {
  const { data, isLoading, error, refetch } = useEmployees();

  if (error) {
    return <ErrorDisplay error={error} onRetry={refetch} />;
  }

  // Component content
}
```

## Security Features

1. **Token Management**: Automatic token attachment to requests
2. **Token Refresh**: Automatic token refresh on expiration
3. **Unauthorized Handling**: Automatic logout on 401 responses
4. **Secure Storage**: Token storage in localStorage with cleanup

## Performance Features

1. **Caching**: React Query provides intelligent caching
2. **Background Updates**: Automatic data synchronization
3. **Optimistic Updates**: Immediate UI updates with rollback on error
4. **Pagination**: Built-in pagination support
5. **Search Debouncing**: Efficient search implementation

## Development Tools

1. **React Query DevTools**: Available in development mode
2. **TypeScript**: Full type safety
3. **Error Boundaries**: Graceful error handling
4. **Loading States**: Consistent loading indicators

## Migration Guide

To migrate existing components to use the API:

1. **Replace mock data** with API hooks
2. **Add loading states** using provided components
3. **Add error handling** with ErrorDisplay component
4. **Update type definitions** to match API responses
5. **Test with real API endpoints**

## Best Practices

1. **Always handle loading states**
2. **Implement proper error handling**
3. **Use TypeScript interfaces consistently**
4. **Leverage React Query caching**
5. **Keep API services pure functions**
6. **Use environment variables for configuration**
7. **Implement proper authentication flow**
8. **Test API integration thoroughly**

## Future Enhancements

1. **Offline Support**: Implement offline-first approach
2. **Real-time Updates**: WebSocket integration
3. **Advanced Caching**: More sophisticated caching strategies
4. **Performance Monitoring**: API performance tracking
5. **Rate Limiting**: Client-side rate limiting
6. **Request Deduplication**: Prevent duplicate requests
