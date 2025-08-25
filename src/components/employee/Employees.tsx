import * as React from 'react';
import constant from '../../constant';
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
import { FaRegEdit } from 'react-icons/fa';
import { InputAdornment, TextField, Switch, useTheme, useMediaQuery } from '@mui/material';
import { IoMdSearch } from 'react-icons/io';
import { IoAddCircleOutline } from 'react-icons/io5';
import { MdFileUpload } from 'react-icons/md';
import AddEmployee, { type EmployeeFormData } from './AddEmployee';
import ExcelUpload from './ExcelUpload';
import { employeeService } from '../../services/employeeService';
import type { CorpEmployee } from '../../types/api';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorDisplay } from '../common/ErrorDisplay';

interface Column {
  id: 'no' | 'name' | 'mobile' | 'email' | 'salary' | 'accountStatus' | 'approveStatus' | 'action';
  label: string;
  minWidth?: number;
  align?: 'center';
  format?: (value: number | boolean | string) => string | boolean | number;
}

const columns: readonly Column[] = [
  { id: 'no', label: 'EMPLOYEE ID', minWidth: 100 },
  { id: 'name', label: 'EMPLOYEE NAME', minWidth: 170 },
  { id: 'mobile', label: 'MOBILE NO', minWidth: 130 },
  { id: 'email', label: 'EMAIL', minWidth: 170 },
  { id: 'salary', label: 'SALARY', minWidth: 130 },
  { id: 'accountStatus', label: 'ACCOUNT STATUS', minWidth: 150 },
  // { id: 'approveStatus', label: 'APPROVE STATUS', minWidth: 150 },
  { id: 'action', label: 'ACTION', minWidth: 130 }
];

export default function Employees() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState('');
  const [openEmployeeModal, setOpenEmployeeModal] = React.useState(false);
  const [openExcelUploadModal, setOpenExcelUploadModal] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<'add' | 'edit'>('add');
  const [selectedEmployee, setSelectedEmployee] = React.useState<EmployeeFormData | undefined>(undefined);
  const [toggleLoading, setToggleLoading] = React.useState<number | null>(null);

  // API state
  const [employees, setEmployees] = React.useState<CorpEmployee[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [pagination, setPagination] = React.useState({ total: 0, pages: 0 });

  // Debounce search term
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch employees when page or search term changes
  React.useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await employeeService.getCorpEmployees(currentPage, debouncedSearchTerm);
        setEmployees(response.data.employees);
        setPagination(response.data.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch employees');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [currentPage, debouncedSearchTerm]);

  const retryFetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeService.getCorpEmployees(currentPage, debouncedSearchTerm);
      setEmployees(response.data.employees);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleOpenAddEmployeeModal = () => {
    setModalMode('add');
    setSelectedEmployee(undefined);
    setOpenEmployeeModal(true);
  };

  const handleOpenEditEmployeeModal = (employee: CorpEmployee) => {
    setModalMode('edit');
    // Convert CorpEmployee to EmployeeFormData
    const employeeFormData: EmployeeFormData = {
      id: employee.no.toString(),
      name: employee.name,
      email: employee.email,
      mobile: employee.mobile,
      salary: employee.basicSalAmt,
      accountStatus: employee.status === constant.status.active,
      approveStatus: employee.status === constant.status.active,
      status: (employee.status as 'ACTV' | 'INAC' | 'BLCK') || 'ACTV',
      bankDetails: {
        accountName: employee.accName,
        accountNumber: employee.accNo,
        bankName: employee.accBank,
        branch: employee.accBranch
      }
    };
    setSelectedEmployee(employeeFormData);
    setOpenEmployeeModal(true);
  };

  const handleCloseEmployeeModal = () => {
    setOpenEmployeeModal(false);
  };

  const handleOpenExcelUploadModal = () => {
    setOpenExcelUploadModal(true);
  };

  const handleCloseExcelUploadModal = () => {
    setOpenExcelUploadModal(false);
  };

  const handleExcelUploadSuccess = () => {
    // Refresh the employee list after successful upload
    retryFetchEmployees();
    setOpenExcelUploadModal(false);
  };

  const handleSaveEmployee = () => {
    // For now, just close the modal and refresh the data
    // In a real application, you would make an API call to save the employee
    handleCloseEmployeeModal();
    retryFetchEmployees(); // Refresh the employee list
  };

  const handleToggleEmployeeStatus = async (employeeNo: number) => {
    try {
      setToggleLoading(employeeNo); // Set loading state for this specific employee
      await employeeService.toggleCorpEmployeeStatus(employeeNo);

      // Refresh the employee list
      retryFetchEmployees();
    } catch (error) {
      console.error('Error toggling employee status:', error);
      // You might want to show a toast notification here
    } finally {
      setToggleLoading(null); // Clear loading state
    }
  };

  // Show loading spinner
  if (loading) {
    return <LoadingSpinner message="Loading employees..." />;
  }

  // Show error message
  if (error) {
    return <ErrorDisplay error={error} onRetry={retryFetchEmployees} variant="page" />;
  }

  return (
    <Box sx={{ width: '100%', bgcolor: '#fcf9f1', borderRadius: 2, p: { xs: 2, md: 3 } }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', md: 'center' },
          mb: 2,
          gap: { xs: 2, md: 0 }
        }}
      >
        <TextField
          placeholder="Search employees..."
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{
            width: { xs: '100%', md: '250px' },
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              backgroundColor: '#ffffff'
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IoMdSearch />
              </InputAdornment>
            )
          }}
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2
          }}
        >
          <Button
            variant="outlined"
            startIcon={<MdFileUpload />}
            onClick={handleOpenExcelUploadModal}
            sx={{
              borderRadius: '8px',
              color: '#e07a64',
              borderColor: '#e07a64',
              fontSize: { xs: '0.875rem', md: '1rem' },
              '&:hover': {
                borderColor: '#d06954',
                backgroundColor: 'rgba(224, 122, 100, 0.04)'
              }
            }}
          >
            Upload excel sheet
          </Button>

          <Button
            variant="contained"
            startIcon={<IoAddCircleOutline />}
            onClick={handleOpenAddEmployeeModal}
            sx={{
              borderRadius: '8px',
              backgroundColor: '#e07a64',
              fontSize: { xs: '0.875rem', md: '1rem' },
              '&:hover': {
                backgroundColor: '#d06954'
              }
            }}
          >
            Add new employe
          </Button>
        </Box>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 'none', borderRadius: 2 }}>
        <TableContainer sx={{ maxHeight: { xs: '70vh', md: 'none' } }}>
          <Table stickyHeader aria-label="sticky table" size={isMobile ? 'small' : 'medium'}>
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 'bold', backgroundColor: '#ffffff' } }}>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={employee.no} sx={{ '& td': { borderColor: '#f0f0f0' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">{employee.no}</Typography>
                        {employee.isNew === '1' && (
                          <Box
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              backgroundColor: '#2d9143ff',
                              color: '#ffffff',
                              fontSize: '10px',
                              fontWeight: 600,
                              px: 1,
                              py: 0.25,
                              borderRadius: '4px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.3px',
                              border: '1px solid #218354ff',
                              boxShadow: '0 1px 3px rgba(224, 122, 100, 0.2)'
                            }}
                          >
                            NEW
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.mobile}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{parseFloat(employee.basicSalAmt)} USD</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        <Switch
                          checked={employee.status === 'ACTV'}
                          onChange={() => handleToggleEmployeeStatus(employee.no)}
                          size="small"
                          disabled={toggleLoading === employee.no}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#e07a64',
                              '&:hover': {
                                backgroundColor: 'rgba(224, 122, 100, 0.04)'
                              }
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#e07a64'
                            }
                          }}
                        />
                      </Box>
                    </TableCell>
                    {/* <TableCell>
                      <Box
                        sx={{
                          backgroundColor: employee.status === 'ACTV' ? '#ccf1ea' : '#fcd6d5',
                          color: employee.status === 'ACTV' ? '#00b79a' : '#ee3827',
                          display: 'inline-block',
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          width: '120px',
                          textAlign: 'center'
                        }}
                      >
                        <Typography variant="body2">{employee.apStatusLabel}</Typography>
                      </Box>
                    </TableCell> */}
                    <TableCell>
                      <Button
                        size="medium"
                        variant="outlined"
                        startIcon={<FaRegEdit />}
                        onClick={() => handleOpenEditEmployeeModal(employee)}
                        sx={{
                          color: '#e07a64',
                          borderColor: '#e07a64',
                          borderRadius: '10px',
                          padding: '6px 16px',
                          '&:hover': {
                            borderColor: '#d06954',
                            backgroundColor: 'rgba(224, 122, 100, 0.04)'
                          }
                        }}
                      >
                        View & Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {employees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      {searchTerm ? 'No employees found matching your search.' : 'No employees found.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 1.5,
            backgroundColor: '#fcf9f1',
            borderBottomLeftRadius: '8px',
            borderBottomRightRadius: '8px'
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: '12px',
              color: '#888888',
              fontWeight: 400
            }}
          >
            Showing {employees.length > 0 ? (currentPage - 1) * 10 + 1 : 0}-{Math.min(currentPage * 10, pagination.total)} of {pagination.total}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Button
              disabled={currentPage === 1}
              onClick={() => handleChangePage(currentPage - 1)}
              sx={{
                minWidth: '32px',
                minHeight: '32px',
                height: '32px',
                width: '32px',
                padding: 0,
                border: '1px solid #e9d9c2',
                borderRadius: '4px',
                color: '#000',
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              &lt;
            </Button>
            <Button
              disabled={currentPage >= pagination.pages}
              onClick={() => handleChangePage(currentPage + 1)}
              sx={{
                minWidth: '32px',
                minHeight: '32px',
                height: '32px',
                width: '32px',
                padding: 0,
                border: '1px solid #e9d9c2',
                borderRadius: '4px',
                color: '#000',
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              &gt;
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Add/Edit Employee Modal */}
      <AddEmployee open={openEmployeeModal} onClose={handleCloseEmployeeModal} onSave={handleSaveEmployee} mode={modalMode} employeeData={selectedEmployee} />

      {/* Excel Upload Modal */}
      <ExcelUpload open={openExcelUploadModal} onClose={handleCloseExcelUploadModal} onSuccess={handleExcelUploadSuccess} />
    </Box>
  );
}
