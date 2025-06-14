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
import { FaRegEdit } from 'react-icons/fa';
import { InputAdornment, TextField } from '@mui/material';
import { IoMdSearch } from 'react-icons/io';
import { IoAddCircleOutline } from 'react-icons/io5';
import { MdFileUpload } from 'react-icons/md';
import AddEmployee, { type EmployeeFormData } from './AddEmployee';

interface Column {
  id: 'id' | 'name' | 'mobile' | 'email' | 'salary' | 'accountStatus' | 'approveStatus' | 'action';
  label: string;
  minWidth?: number;
  align?: 'center';
  format?: (value: number | boolean | string) => string | boolean | number;
}

const columns: readonly Column[] = [
  { id: 'id', label: 'EMPLOYEE ID', minWidth: 100 },
  { id: 'name', label: 'EMPLOYEE NAME', minWidth: 170 },
  { id: 'mobile', label: 'MOBILE NO', minWidth: 130 },
  { id: 'email', label: 'EMAIL', minWidth: 170 },
  { id: 'salary', label: 'SALARY (LKR)', minWidth: 130 },
  { id: 'accountStatus', label: 'ACCOUNT STATUS', minWidth: 150 },
  { id: 'approveStatus', label: 'APPROVE STATUS', minWidth: 150 },
  { id: 'action', label: 'ACTION', minWidth: 130 }
];

interface EmployeeData {
  id: string;
  name: string;
  mobile: string;
  email: string;
  salary: string;
  accountStatus: boolean;
  approveStatus: boolean;
}

function createData(id: string, name: string, mobile: string, email: string, salary: string, accountStatus: boolean, approveStatus: boolean): EmployeeData {
  return { id, name, mobile, email, salary, accountStatus, approveStatus };
}

const rows = [
  createData('1234', 'Christine Brooks', '077750165', 'abc@gmail.com', '400 USD', true, true),
  createData('1234', 'Christine Brooks', '077750165', 'abc@gmail.com', '400 USD', false, false),
  createData('1234', 'Christine Brooks', '077750165', 'abc@gmail.com', '400 USD', true, true),
  createData('1234', 'Christine Brooks', '077750165', 'abc@gmail.com', '400 USD', true, true),
  createData('1234', 'Christine Brooks', '077750165', 'abc@gmail.com', '400 USD', true, true),
  createData('1234', 'Christine Brooks', '077750165', 'abc@gmail.com', '400 USD', true, true),
  createData('1234', 'James Wilson', '077750165', 'james@gmail.com', '400 USD', true, true),
  createData('1234', 'Sophie Brown', '077750165', 'sophie@gmail.com', '400 USD', true, true),
  createData('1234', 'William Lee', '077750165', 'william@gmail.com', '400 USD', false, false),
  createData('1234', 'Charlotte Davis', '077750165', 'charlotte@gmail.com', '400 USD', true, true),
  createData('1234', 'Thomas Martin', '077750165', 'thomas@gmail.com', '400 USD', true, true),
  createData('1234', 'Isabella White', '077750165', 'isabella@gmail.com', '400 USD', true, true),
  createData('1234', 'Benjamin Harris', '077750165', 'benjamin@gmail.com', '400 USD', false, false),
  createData('1234', 'Amelia Clark', '077750165', 'amelia@gmail.com', '400 USD', true, true),
  createData('1234', 'Lucas Turner', '077750165', 'lucas@gmail.com', '400 USD', true, true)
];

export default function Employees() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(9);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [openEmployeeModal, setOpenEmployeeModal] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<'add' | 'edit'>('add');
  const [selectedEmployee, setSelectedEmployee] = React.useState<EmployeeFormData | undefined>(undefined);
  const [employeesList, setEmployeesList] = React.useState<EmployeeData[]>(rows);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleOpenAddEmployeeModal = () => {
    setModalMode('add');
    setSelectedEmployee(undefined);
    setOpenEmployeeModal(true);
  };

  const handleOpenEditEmployeeModal = (employee: EmployeeData) => {
    setModalMode('edit');
    // Convert EmployeeData to EmployeeFormData
    const employeeFormData: EmployeeFormData = {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      mobile: employee.mobile,
      salary: employee.salary,
      accountStatus: employee.accountStatus,
      approveStatus: employee.approveStatus,
      bankDetails: {
        accountName: employee.name, // Assuming same name for demo purposes
        accountNumber: '52896866',
        bankName: 'Westpac',
        branch: 'Sydney'
      }
    };
    setSelectedEmployee(employeeFormData);
    setOpenEmployeeModal(true);
  };

  const handleCloseEmployeeModal = () => {
    setOpenEmployeeModal(false);
  };

  const handleSaveEmployee = (employeeData: EmployeeFormData) => {
    if (modalMode === 'add') {
      // Create new employee object
      const newEmployee: EmployeeData = {
        id: employeeData.id,
        name: employeeData.name,
        email: employeeData.email,
        mobile: employeeData.mobile,
        salary: employeeData.salary,
        accountStatus: true,
        approveStatus: true
      };
      setEmployeesList([...employeesList, newEmployee]);
    } else {
      // Update existing employee
      setEmployeesList(
        employeesList.map((emp) =>
          emp.id === employeeData.id
            ? {
                ...emp,
                name: employeeData.name,
                email: employeeData.email,
                mobile: employeeData.mobile,
                salary: employeeData.salary
              }
            : emp
        )
      );
    }
    handleCloseEmployeeModal();
  };

  const handleDeactivateEmployee = (employeeId: string) => {
    setEmployeesList(employeesList.map((emp) => (emp.id === employeeId ? { ...emp, accountStatus: false } : emp)));
  };

  const handleBlockEmployee = (employeeId: string) => {
    setEmployeesList(employeesList.map((emp) => (emp.id === employeeId ? { ...emp, accountStatus: false, approveStatus: false } : emp)));
  };

  return (
    <Box sx={{ width: '100%', bgcolor: '#fcf9f1', borderRadius: 2, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <TextField
          placeholder="Search mail"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: '250px',
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

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<MdFileUpload />}
            sx={{
              borderRadius: '8px',
              color: '#e07a64',
              borderColor: '#e07a64',
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
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
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
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index} sx={{ '& td': { borderColor: '#f0f0f0' } }}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.mobile}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.salary}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          backgroundColor: row.accountStatus ? '#ccf1ea' : '#fcd6d5',
                          color: row.accountStatus ? '#00b79a' : '#ee3827',
                          display: 'inline-block',
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          width: '120px',
                          textAlign: 'center'
                        }}
                      >
                        <Typography variant="body2">{row.accountStatus ? 'Active' : 'Inactive'}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          backgroundColor: row.approveStatus ? '#ccf1ea' : '#fcd6d5',
                          color: row.approveStatus ? '#00b79a' : '#ee3827',
                          display: 'inline-block',
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          width: '120px',
                          textAlign: 'center'
                        }}
                      >
                        <Typography variant="body2">{row.approveStatus ? 'Approved' : 'Rejected'}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="medium"
                        variant="outlined"
                        startIcon={<FaRegEdit />}
                        onClick={() => handleOpenEditEmployeeModal(row)}
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
            Showing {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, rows.length)} of {rows.length}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Button
              disabled={page === 0}
              onClick={(e) => handleChangePage(e, page - 1)}
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
              disabled={page >= Math.ceil(rows.length / rowsPerPage) - 1}
              onClick={(e) => handleChangePage(e, page + 1)}
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
      <AddEmployee open={openEmployeeModal} onClose={handleCloseEmployeeModal} onSave={handleSaveEmployee} onDeactivate={handleDeactivateEmployee} onBlock={handleBlockEmployee} mode={modalMode} employeeData={selectedEmployee} />
    </Box>
  );
}
