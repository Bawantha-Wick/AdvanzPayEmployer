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
import { InputAdornment, TextField } from '@mui/material';
import { IoMdSearch } from 'react-icons/io';

interface Column {
  id: 'requestId' | 'employeeId' | 'requestedDate' | 'requestedType' | 'processStatus' | 'processedBy' | 'processedDate' | 'remark';
  label: string;
  minWidth?: number;
  align?: 'center';
}

const columns: readonly Column[] = [
  { id: 'requestId', label: 'REQUEST ID', minWidth: 120 },
  { id: 'employeeId', label: 'EMPLOYEE ID', minWidth: 120 },
  { id: 'requestedDate', label: 'REQUESTED DATE', minWidth: 150 },
  { id: 'requestedType', label: 'REQUESTED TYPE', minWidth: 150 },
  { id: 'processStatus', label: 'PROCESS STATUS', minWidth: 150 },
  { id: 'processedBy', label: 'PROCESSED BY', minWidth: 150 },
  { id: 'processedDate', label: 'PROCESSED DATE', minWidth: 150 },
  { id: 'remark', label: 'REMARK', minWidth: 120 }
];

interface RequestData {
  requestId: string;
  employeeId: string;
  requestedDate: string;
  requestedType: string;
  processStatus: 'Approved' | 'Rejected' | 'Pending';
  processedBy: string;
  processedDate: string;
  remark: string;
}

function createData(requestId: string, employeeId: string, requestedDate: string, requestedType: string, processStatus: 'Approved' | 'Rejected' | 'Pending', processedBy: string, processedDate: string, remark: string): RequestData {
  return {
    requestId,
    employeeId,
    requestedDate,
    requestedType,
    processStatus,
    processedBy,
    processedDate,
    remark
  };
}

const rows = [
  createData('R1', '123456', '2025.02.02', 'Create', 'Approved', 'ABC', '2025.02.02', 'N/A'),
  createData('R1', '123456', '2025.02.02', 'Create', 'Approved', 'ABC', '2025.02.02', 'N/A'),
  createData('R1', '123456', '2025.02.02', 'Create', 'Approved', 'ABC', '2025.02.02', 'N/A'),
  createData('R1', '123456', '2025.02.02', 'Create', 'Approved', 'ABC', '2025.02.02', 'N/A'),
  createData('R1', '123456', '2025.02.02', 'Create', 'Approved', 'ABC', '2025.02.02', 'N/A'),
  createData('R1', '123456', '2025.02.02', 'Create', 'Approved', 'ABC', '2025.02.02', 'N/A'),
  createData('R1', '123456', '2025.02.02', 'Create', 'Rejected', 'ABC', '2025.02.02', 'N/A'),
  createData('R1', '123456', '2025.02.02', 'Create', 'Pending', 'ABC', '2025.02.02', 'N/A')
];

export default function EmployeeRequests() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(9);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<string>('All');

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return {
          bg: '#ccf1ea',
          text: '#00b79a'
        };
      case 'Rejected':
        return {
          bg: '#fcd6d5',
          text: '#ee3827'
        };
      case 'Pending':
        return {
          bg: '#fff2cc',
          text: '#ffb800'
        };
      default:
        return {
          bg: '#ccf1ea',
          text: '#00b79a'
        };
    }
  };

  const filteredRows = React.useMemo(() => {
    return rows.filter((row) => {
      const matchesSearch = searchTerm === '' || Object.values(row).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesFilter = filterStatus === 'All' || row.processStatus === filterStatus;

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filterStatus]);

  const handleFilterClick = (status: string) => {
    setFilterStatus(status);
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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ mr: 1 }}>
            Filtered by
          </Typography>
          <Button
            variant={filterStatus === 'All' ? 'contained' : 'outlined'}
            onClick={() => handleFilterClick('All')}
            sx={{
              borderRadius: '20px',
              px: 2,
              backgroundColor: filterStatus === 'All' ? '#e07a64' : 'transparent',
              color: filterStatus === 'All' ? 'white' : 'black',
              borderColor: '#e9d9c2',
              '&:hover': {
                backgroundColor: filterStatus === 'All' ? '#d06954' : 'rgba(0, 0, 0, 0.04)',
                borderColor: filterStatus === 'All' ? '#d06954' : '#e9d9c2'
              }
            }}
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'Approved' ? 'contained' : 'outlined'}
            onClick={() => handleFilterClick('Approved')}
            sx={{
              borderRadius: '20px',
              px: 2,
              backgroundColor: filterStatus === 'Approved' ? '#e07a64' : 'transparent',
              color: filterStatus === 'Approved' ? 'white' : 'black',
              borderColor: '#e9d9c2',
              '&:hover': {
                backgroundColor: filterStatus === 'Approved' ? '#d06954' : 'rgba(0, 0, 0, 0.04)',
                borderColor: filterStatus === 'Approved' ? '#d06954' : '#e9d9c2'
              }
            }}
          >
            Approved
          </Button>
          <Button
            variant={filterStatus === 'Rejected' ? 'contained' : 'outlined'}
            onClick={() => handleFilterClick('Rejected')}
            sx={{
              borderRadius: '20px',
              px: 2,
              backgroundColor: filterStatus === 'Rejected' ? '#e07a64' : 'transparent',
              color: filterStatus === 'Rejected' ? 'white' : 'black',
              borderColor: '#e9d9c2',
              '&:hover': {
                backgroundColor: filterStatus === 'Rejected' ? '#d06954' : 'rgba(0, 0, 0, 0.04)',
                borderColor: filterStatus === 'Rejected' ? '#d06954' : '#e9d9c2'
              }
            }}
          >
            Rejected
          </Button>
          <Button
            variant={filterStatus === 'Pending' ? 'contained' : 'outlined'}
            onClick={() => handleFilterClick('Pending')}
            sx={{
              borderRadius: '20px',
              px: 2,
              backgroundColor: filterStatus === 'Pending' ? '#e07a64' : 'transparent',
              color: filterStatus === 'Pending' ? 'white' : 'black',
              borderColor: '#e9d9c2',
              '&:hover': {
                backgroundColor: filterStatus === 'Pending' ? '#d06954' : 'rgba(0, 0, 0, 0.04)',
                borderColor: filterStatus === 'Pending' ? '#d06954' : '#e9d9c2'
              }
            }}
          >
            Pending
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
              {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                const statusColors = getStatusColor(row.processStatus);
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index} sx={{ '& td': { borderColor: '#f0f0f0' } }}>
                    <TableCell>{row.requestId}</TableCell>
                    <TableCell>{row.employeeId}</TableCell>
                    <TableCell>{row.requestedDate}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          backgroundColor: '#e8f5fe',
                          color: '#3c92dc',
                          display: 'inline-block',
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          width: '120px',
                          textAlign: 'center'
                        }}
                      >
                        <Typography variant="body2">{row.requestedType}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          backgroundColor: statusColors.bg,
                          color: statusColors.text,
                          display: 'inline-block',
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          width: '120px',
                          textAlign: 'center'
                        }}
                      >
                        <Typography variant="body2">{row.processStatus}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{row.processedBy}</TableCell>
                    <TableCell>{row.processedDate}</TableCell>
                    <TableCell>{row.remark}</TableCell>
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
            Showing {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, filteredRows.length)} of {filteredRows.length}
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
              disabled={page >= Math.ceil(filteredRows.length / rowsPerPage) - 1}
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
    </Box>
  );
}
