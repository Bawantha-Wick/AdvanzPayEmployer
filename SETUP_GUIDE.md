# API Integration Setup Guide

## Getting Started

This guide will help you set up and configure the API integration for the AdvanzPay Employer Portal.

## Prerequisites

- Node.js 18+ installed
- Backend API server running (or access to production API)
- Environment variables configured

## Installation

The required dependencies have been installed:

- `axios` - HTTP client
- `@tanstack/react-query` - State management
- `@tanstack/react-query-devtools` - Development tools

## Configuration

### 1. Environment Variables

Create your environment files:

**For Development (`.env`):**

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=AdvanzPay Employer Portal
VITE_ENVIRONMENT=development
VITE_ENABLE_DEV_TOOLS=true
```

**For Production (`.env.production`):**

```env
VITE_API_BASE_URL=https://api.advanzpay.com/v1
VITE_APP_NAME=AdvanzPay Employer Portal
VITE_ENVIRONMENT=production
VITE_ENABLE_DEV_TOOLS=false
```

### 2. API Base URL

Update the `VITE_API_BASE_URL` in your `.env` file to match your backend API server.

## Quick Start

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Test API Integration

The application now includes:

- ✅ **React Query** setup with caching and devtools
- ✅ **Axios** configuration with interceptors
- ✅ **Authentication** context and hooks
- ✅ **Employee Management** with full CRUD operations
- ✅ **User Management** with role-based access
- ✅ **Error Handling** and loading states
- ✅ **TypeScript** types for all API entities

### 3. View React Query DevTools

In development mode, you'll see the React Query DevTools at the bottom of your screen. This helps monitor:

- API call status
- Cache state
- Query invalidation
- Background refetching

## Component Migration

### Before (Static Data)

```typescript
const [employees, setEmployees] = useState(mockData);
```

### After (API Integration)

```typescript
import { useEmployees } from '../hooks/useEmployees';

const { data: employees, isLoading, error } = useEmployees();

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorDisplay error={error} onRetry={refetch} />;
```

## Example API Integration

Check out `src/components/employee/EmployeesWithAPI.tsx` for a complete example of:

- Loading states
- Error handling
- CRUD operations
- Pagination
- Search functionality
- Optimistic updates

## Authentication Flow

The application now supports:

1. **Login/Register** with token management
2. **Automatic token refresh**
3. **Protected routes** with authentication guards
4. **Logout** with proper cleanup

## Testing the Integration

### 1. Mock API Server (Optional)

If you don't have a backend yet, you can create a simple mock server:

```javascript
// mock-server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Mock employees endpoint
app.get('/api/employees', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        name: 'John Doe',
        phone: '1234567890',
        email: 'john@example.com',
        salary: '50000',
        isActive: true,
        isVerified: true
      }
    ],
    pagination: {
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1
    }
  });
});

app.listen(3000, () => {
  console.log('Mock server running on http://localhost:3000');
});
```

### 2. Run Mock Server

```bash
node mock-server.js
```

## API Contract

All API endpoints should return responses in this format:

```typescript
{
  success: boolean;
  data: T; // Your actual data
  message?: string;
  errors?: string[];
}
```

For paginated endpoints:

```typescript
{
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

## Error Handling

The application includes comprehensive error handling:

1. **Network Errors** - Automatic retry with exponential backoff
2. **401 Unauthorized** - Automatic logout and redirect
3. **Validation Errors** - Display field-specific errors
4. **Server Errors** - User-friendly error messages

## Performance Features

- **Caching**: Intelligent query caching with React Query
- **Background Updates**: Automatic data synchronization
- **Optimistic Updates**: Immediate UI feedback
- **Request Deduplication**: Prevents duplicate API calls
- **Stale While Revalidate**: Shows cached data while fetching fresh data

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your API server allows requests from your frontend domain
2. **404 Errors**: Verify API base URL in environment variables
3. **Auth Issues**: Check token storage and expiration handling
4. **Type Errors**: Ensure API responses match TypeScript interfaces

### Debug Tools

1. **React Query DevTools** - Monitor query state
2. **Browser Network Tab** - Inspect API requests/responses
3. **Console Logs** - Check for JavaScript errors
4. **Redux DevTools** - If using Redux alongside React Query

## Next Steps

1. **Update API URLs** to point to your actual backend
2. **Customize error messages** for your specific use cases
3. **Add more API endpoints** as needed
4. **Implement real-time features** with WebSockets
5. **Add offline support** with service workers

## Support

For questions or issues:

1. Check the `API_INTEGRATION.md` documentation
2. Review the example components
3. Test with the mock server first
4. Verify environment configuration

The API integration is now complete and ready for production use!
