import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { MdErrorOutline, MdWarning } from 'react-icons/md';
import { IoCheckmarkCircle } from 'react-icons/io5';

export interface ExcelEmployeeData {
  id: string;
  name: string;
  email: string;
  mobile: string;
  salary: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  branch: string;
  rowIndex: number;
}

interface ValidationError {
  rowIndex: number;
  field: string;
  message: string;
}

interface ExcelPreviewProps {
  data: ExcelEmployeeData[];
  fileName: string;
  onBack: () => void;
  onSubmit: (data: ExcelEmployeeData[], onError: (error: string) => void) => void;
  isSubmitting?: boolean;
}

const ExcelPreview: React.FC<ExcelPreviewProps> = ({ data, fileName, onBack, onSubmit, isSubmitting = false }) => {
  const [employees, setEmployees] = React.useState<ExcelEmployeeData[]>(data);
  const [editingCell, setEditingCell] = React.useState<{ rowIndex: number; field: keyof ExcelEmployeeData } | null>(null);
  const [tempValue, setTempValue] = React.useState<string>('');
  const [validationErrors, setValidationErrors] = React.useState<ValidationError[]>([]);
  const [apiError, setApiError] = React.useState<string>('');

  const validateData = React.useCallback(() => {
    const errors: ValidationError[] = [];

    employees.forEach((employee, index) => {
      if (!employee.name.trim()) {
        errors.push({ rowIndex: index, field: 'name', message: 'Name is required' });
      }
      if (!employee.email.trim()) {
        errors.push({ rowIndex: index, field: 'email', message: 'Email is required' });
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.email)) {
        errors.push({ rowIndex: index, field: 'email', message: 'Invalid email format' });
      }
      if (!employee.mobile.trim()) {
        errors.push({ rowIndex: index, field: 'mobile', message: 'Mobile number is required' });
      }
      if (!employee.salary.trim()) {
        errors.push({ rowIndex: index, field: 'salary', message: 'Basic salary is required' });
      } else if (isNaN(Number(employee.salary)) || Number(employee.salary) <= 0) {
        errors.push({ rowIndex: index, field: 'salary', message: 'Invalid salary amount' });
      }
      if (!employee.accountName.trim()) {
        errors.push({ rowIndex: index, field: 'accountName', message: 'Account name is required' });
      }
      if (!employee.accountNumber.trim()) {
        errors.push({ rowIndex: index, field: 'accountNumber', message: 'Account number is required' });
      }
      if (!employee.bankName.trim()) {
        errors.push({ rowIndex: index, field: 'bankName', message: 'Bank name is required' });
      }
      if (!employee.branch.trim()) {
        errors.push({ rowIndex: index, field: 'branch', message: 'Branch is required' });
      }

      // Duplicate email check
      const duplicateEmails = employees.filter((emp, i) => i !== index && emp.email === employee.email);
      if (duplicateEmails.length > 0) {
        errors.push({ rowIndex: index, field: 'email', message: 'Duplicate email found' });
      }
    });

    setValidationErrors(errors);
  }, [employees]);

  React.useEffect(() => {
    validateData();
  }, [validateData]);

  const handleCellEdit = (rowIndex: number, field: keyof ExcelEmployeeData, currentValue: string) => {
    setEditingCell({ rowIndex, field });
    setTempValue(currentValue);
  };

  const handleSaveEdit = () => {
    if (!editingCell) return;

    const updatedEmployees = [...employees];
    updatedEmployees[editingCell.rowIndex] = {
      ...updatedEmployees[editingCell.rowIndex],
      [editingCell.field]: tempValue
    };

    setEmployees(updatedEmployees);
    setEditingCell(null);
    setTempValue('');
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
    setTempValue('');
  };

  const handleRemoveEmployee = (rowIndex: number) => {
    const updatedEmployees = employees.filter((_, index) => index !== rowIndex);
    setEmployees(updatedEmployees);
  };

  const handleSubmit = async () => {
    if (validationErrors.length > 0) {
      return;
    }

    setApiError(''); // Clear any previous API errors
    onSubmit(employees, (error: string) => {
      setApiError(error);
    });
  };

  const getFieldError = (rowIndex: number, field: string) => {
    return validationErrors.find((error) => error.rowIndex === rowIndex && error.field === field);
  };

  const hasRowErrors = (rowIndex: number) => {
    return validationErrors.some((error) => error.rowIndex === rowIndex);
  };

  const renderEditableCell = (employee: ExcelEmployeeData, rowIndex: number, field: keyof ExcelEmployeeData) => {
    const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.field === field;
    const error = getFieldError(rowIndex, field);
    const value = employee[field];

    if (isEditing) {
      return (
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: '200px' }}>
            <TextField
              size="small"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              autoFocus
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  height: '32px',
                  fontSize: '0.875rem'
                }
              }}
            />
            <IconButton size="small" onClick={handleSaveEdit} color="primary">
              <SaveIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={handleCancelEdit}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </TableCell>
      );
    }

    return (
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minHeight: '32px' }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              sx={{
                color: error ? '#d32f2f' : 'inherit',
                fontWeight: error ? 500 : 400
              }}
            >
              {String(value) || '-'}
            </Typography>
            {error && (
              <Typography variant="caption" sx={{ color: '#d32f2f', display: 'block' }}>
                {error.message}
              </Typography>
            )}
          </Box>
          <IconButton
            size="small"
            onClick={() => handleCellEdit(rowIndex, field, String(value))}
            sx={{
              opacity: 0.6,
              '&:hover': { opacity: 1 }
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
      </TableCell>
    );
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{
            color: '#e07a64',
            '&:hover': {
              backgroundColor: 'rgba(224, 122, 100, 0.04)'
            }
          }}
        >
          Back to Upload
        </Button>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            File: {fileName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {employees.length} employee{employees.length !== 1 ? 's' : ''} found
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting || validationErrors.length > 0}
          sx={{
            borderRadius: '8px',
            backgroundColor: '#e07a64',
            '&:hover': {
              backgroundColor: '#d06954'
            },
            '&:disabled': {
              backgroundColor: '#ccc'
            }
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Data'}
        </Button>
      </Box>

      {/* API Error */}
      {apiError && (
        <Alert severity="error" sx={{ mb: 1 }} icon={<MdErrorOutline />}>
          <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
            Please review each record and ensure the Employee ID, Email, and Mobile Number are unique and correctly formatted, then re-upload{' '}
          </Typography>
          {/* <Typography variant="body2">{apiError}</Typography> */}
        </Alert>
      )}

      {/* Validation Summary */}
      {validationErrors.length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }} icon={<MdErrorOutline />}>
          <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
            Please fix the following errors before submitting:
          </Typography>
          <Typography variant="body2">
            {validationErrors.length} error{validationErrors.length !== 1 ? 's' : ''} found across {new Set(validationErrors.map((e) => e.rowIndex)).size} employee{new Set(validationErrors.map((e) => e.rowIndex)).size !== 1 ? 's' : ''}
          </Typography>
        </Alert>
      )}

      {employees.length === 0 && (
        <Alert severity="warning" sx={{ mb: 3 }} icon={<MdWarning />}>
          No employee data to preview. Please upload a valid Excel file.
        </Alert>
      )}

      {/* Data Table */}
      {employees.length > 0 && (
        <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 'none', borderRadius: 2 }}>
          <TableContainer sx={{ maxHeight: '60vh' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 'bold', backgroundColor: '#ffffff' } }}>
                  <TableCell sx={{ minWidth: 80 }}>Row</TableCell>
                  <TableCell sx={{ minWidth: 120 }}>Employee ID</TableCell>
                  <TableCell sx={{ minWidth: 150 }}>Name</TableCell>
                  <TableCell sx={{ minWidth: 200 }}>Email</TableCell>
                  <TableCell sx={{ minWidth: 130 }}>Mobile Number</TableCell>
                  <TableCell sx={{ minWidth: 120 }}>Basic Salary</TableCell>
                  <TableCell sx={{ minWidth: 150 }}>Account Name</TableCell>
                  <TableCell sx={{ minWidth: 150 }}>Account Number</TableCell>
                  <TableCell sx={{ minWidth: 130 }}>Bank Name</TableCell>
                  <TableCell sx={{ minWidth: 120 }}>Branch</TableCell>
                  <TableCell sx={{ minWidth: 80 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((employee, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      '& td': { borderColor: '#f0f0f0' },
                      backgroundColor: hasRowErrors(index) ? 'rgba(211, 47, 47, 0.04)' : 'inherit'
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">{employee.rowIndex}</Typography>
                        {hasRowErrors(index) && <Chip size="small" label="Error" color="error" sx={{ fontSize: '10px', height: '18px' }} />}
                      </Box>
                    </TableCell>
                    {renderEditableCell(employee, index, 'id')}
                    {renderEditableCell(employee, index, 'name')}
                    {renderEditableCell(employee, index, 'email')}
                    {renderEditableCell(employee, index, 'mobile')}
                    {renderEditableCell(employee, index, 'salary')}
                    {renderEditableCell(employee, index, 'accountName')}
                    {renderEditableCell(employee, index, 'accountNumber')}
                    {renderEditableCell(employee, index, 'bankName')}
                    {renderEditableCell(employee, index, 'branch')}
                    <TableCell>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleRemoveEmployee(index)}
                        sx={{
                          fontSize: '12px',
                          padding: '4px 8px',
                          minWidth: 'auto'
                        }}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Footer */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              backgroundColor: '#fcf9f1',
              borderTop: '1px solid #f0f0f0'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Total: {employees.length} employee{employees.length !== 1 ? 's' : ''}
              </Typography>
              {validationErrors.length === 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IoCheckmarkCircle color="#00b79a" size={16} />
                  <Typography variant="caption" sx={{ color: '#00b79a' }}>
                    All data validated
                  </Typography>
                </Box>
              )}
            </Box>

            <Typography variant="caption" color="text.secondary">
              Click on any field to edit • Use Remove to delete rows
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default ExcelPreview;
