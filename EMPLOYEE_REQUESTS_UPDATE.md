# Employee Requests Component Update

## Overview

The EmployeeRequests component has been updated to reflect the new employee request object structure and includes enhanced functionality for approving/rejecting requests with remarks.

## New Data Structure

The employee request object now follows this structure:

```json
{
  "id": "3",
  "title": "house_deposit",
  "date": "2025-08-11",
  "amount": "+100.00",
  "status": "pending",
  "type": "withdrawal",
  "verified": "false"
}
```

## Key Changes

### 1. Updated Table Columns

- **ID**: Request identifier
- **TITLE**: Request title/description
- **DATE**: Request date
- **AMOUNT**: Transaction amount (with + or - prefix)
- **TYPE**: Transaction type (withdrawal, deposit, advance, salary)
- **STATUS**: Current status (pending, approved, rejected)
- **VERIFIED**: Verification status (true/false)
- **ACTIONS**: Approve/Reject buttons for pending requests

### 2. Enhanced Approval System

- **Approval Dialog**: Modal dialog for approving/rejecting requests
- **Mandatory Remarks**: Users must provide remarks when approving/rejecting
- **Real-time Updates**: Local state updates immediately after successful operations
- **Loading States**: Visual feedback during API operations

### 3. Visual Improvements

- **Color-coded Amounts**: Green for positive, red for negative amounts
- **Type-specific Colors**: Different colors for withdrawal, deposit, advance, and salary
- **Status Indicators**: Color-coded status badges
- **Verification Badges**: Clear Yes/No indicators for verification status

### 4. API Integration

- **Service Methods**: Added `approveRequestWithRemark()` and `rejectRequestWithRemark()`
- **Error Handling**: Proper error handling with user feedback
- **Authentication**: Uses current user context for processed_by field

## Features

### Filtering

- Filter by status: All, Approved, Rejected, Pending
- Search functionality across all fields

### Actions for Pending Requests

- **Approve Button**: Green button to approve pending requests
- **Reject Button**: Red button to reject pending requests
- **Remarks Required**: Both actions require a remark to be entered

### Approval Dialog

- Shows request ID being processed
- Text area for entering remarks
- Cancel and action buttons
- Loading state during processing

## Usage

1. **View Requests**: The table displays all employee requests with the new structure
2. **Filter Requests**: Use the filter buttons or search bar to find specific requests
3. **Process Pending Requests**: Click Approve or Reject on pending items
4. **Add Remarks**: Enter mandatory remarks in the dialog
5. **Confirm Action**: Click the action button to process the request

## Technical Details

### State Management

- Uses React hooks for local state management
- Real-time updates to request status
- Optimistic updates for better UX

### API Endpoints

- `PATCH /employee-requests/{id}/status` - Update request status
- Includes processedBy, remark, and processedDate fields

### Error Handling

- Try-catch blocks for API calls
- User-friendly error messages
- Loading states to prevent duplicate submissions

## Files Modified

1. `src/components/employee/EmployeeRequests.tsx` - Main component
2. `src/services/employeeService.ts` - Added new service methods
3. `src/types/api.ts` - Updated interfaces

## Next Steps

- Consider adding bulk approval functionality
- Add request history/audit trail
- Implement notifications for status changes
- Add export functionality for request reports
