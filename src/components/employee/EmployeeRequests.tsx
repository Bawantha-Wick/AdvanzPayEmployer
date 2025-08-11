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
import { InputAdornment, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { IoMdSearch } from 'react-icons/io';
import { employeeService } from '../../services/employeeService';
import { useAuthContext } from '../../contexts/useAuthContext';

interface Column {
  id: 'id' | 'title' | 'date' | 'amount' | 'type' | 'status' | 'verified' | 'actions';
  label: string;
  minWidth?: number;
  align?: 'center' | 'right';
}

const columns: readonly Column[] = [
  { id: 'id', label: 'REQUEST ID', minWidth: 120 },
  { id: 'title', label: 'TITLE', minWidth: 150 },
  { id: 'date', label: 'DATE', minWidth: 120 },
  { id: 'amount', label: 'AMOUNT', minWidth: 120, align: 'right' },
  { id: 'type', label: 'TYPE', minWidth: 120 },
  { id: 'status', label: 'STATUS', minWidth: 120 },
  { id: 'verified', label: 'VERIFIED', minWidth: 100 },
  { id: 'actions', label: 'ACTIONS', minWidth: 200 }
];

interface RequestData {
  id: string;
  title: string;
  date: string;
  amount: string;
  type: 'withdrawal' | 'deposit' | 'advance' | 'salary';
  status: 'pending' | 'approved' | 'rejected';
  verified: 'true' | 'false';
}

function createData(id: string, title: string, date: string, amount: string, type: 'withdrawal' | 'deposit' | 'advance' | 'salary', status: 'pending' | 'approved' | 'rejected', verified: 'true' | 'false'): RequestData {
  return {
    id,
    title,
    date,
    amount,
    type,
    status,
    verified
  };
}

const rows = [
  createData('1', 'salary_advance', '2025-08-10', '+500.00', 'advance', 'approved', 'true'),
  createData('2', 'medical_allowance', '2025-08-11', '+200.00', 'advance', 'approved', 'true'),
  createData('3', 'house_deposit', '2025-08-11', '+100.00', 'withdrawal', 'pending', 'false'),
  createData('4', 'emergency_fund', '2025-08-12', '+300.00', 'advance', 'pending', 'false'),
  createData('5', 'salary_payment', '2025-08-12', '+1500.00', 'salary', 'approved', 'true'),
  createData('6', 'travel_allowance', '2025-08-09', '+150.00', 'advance', 'rejected', 'false'),
  createData('7', 'bonus_payment', '2025-08-08', '+800.00', 'advance', 'pending', 'false'),
  createData('8', 'overtime_pay', '2025-08-07', '+250.00', 'advance', 'approved', 'true')
];

export default function EmployeeRequests() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(9);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<string>('All');
  const [approvalDialog, setApprovalDialog] = React.useState<{
    open: boolean;
    requestId: string;
    action: 'approve' | 'reject';
  }>({ open: false, requestId: '', action: 'approve' });
  const [remark, setRemark] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [requests, setRequests] = React.useState(rows); // Use state for dynamic updates

  const { user } = useAuthContext();

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          bg: '#ccf1ea',
          text: '#00b79a'
        };
      case 'rejected':
        return {
          bg: '#fcd6d5',
          text: '#ee3827'
        };
      case 'pending':
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'withdrawal':
        return {
          bg: '#ccf1ea',
          text: '#00b79a'
        };
      // case 'deposit':
      //   return {
      //     bg: '#ccf1ea',
      //     text: '#00b79a'
      //   };
      // case 'advance':
      //   return {
      //     bg: '#e8f5fe',
      //     text: '#3c92dc'
      //   };
      // case 'salary':
      //   return {
      //     bg: '#f3e5f5',
      //     text: '#8e24aa'
      //   };
      default:
        return {
          bg: '#e8f5fe',
          text: '#3c92dc'
        };
    }
  };

  const filteredRows = React.useMemo(() => {
    return requests.filter((row) => {
      const matchesSearch = searchTerm === '' || Object.values(row).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesFilter = filterStatus === 'All' || row.status === filterStatus.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filterStatus, requests]);

  const handleFilterClick = (status: string) => {
    setFilterStatus(status);
  };

  const handleApprovalAction = (requestId: string, action: 'approve' | 'reject') => {
    setApprovalDialog({ open: true, requestId, action });
    setRemark('');
  };

  const handleApprovalSubmit = async () => {
    if (!remark.trim()) {
      alert('Please enter a remark');
      return;
    }

    setLoading(true);
    try {
      const processedBy = user?.name || 'Current User';

      if (approvalDialog.action === 'approve') {
        await employeeService.approveRequestWithRemark(approvalDialog.requestId, processedBy, remark);
      } else {
        await employeeService.rejectRequestWithRemark(approvalDialog.requestId, processedBy, remark);
      }

      // Update local state
      setRequests((prev) =>
        prev.map((row) =>
          row.id === approvalDialog.requestId
            ? {
                ...row,
                status: approvalDialog.action === 'approve' ? ('approved' as const) : ('rejected' as const),
                verified: approvalDialog.action === 'approve' ? ('true' as const) : ('false' as const)
              }
            : row
        )
      );

      setApprovalDialog({ open: false, requestId: '', action: 'approve' });
      setRemark('');
    } catch (error) {
      console.error('Error updating request status:', error);
      alert('Failed to update request status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalCancel = () => {
    setApprovalDialog({ open: false, requestId: '', action: 'approve' });
    setRemark('');
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
                const statusColors = getStatusColor(row.status);
                const typeColors = getTypeColor(row.type);
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index} sx={{ '& td': { borderColor: '#f0f0f0' } }}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.title}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell align="right">
                      <Box
                        sx={{
                          color: row.amount.startsWith('+') ? '#00b79a' : '#ee3827',
                          fontWeight: 'bold'
                        }}
                      >
                        {row.amount}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          backgroundColor: typeColors.bg,
                          color: typeColors.text,
                          display: 'inline-block',
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          width: '120px',
                          textAlign: 'center'
                        }}
                      >
                        <Typography variant="body2">{row.type}</Typography>
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
                        <Typography variant="body2">{row.status}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          backgroundColor: row.verified === 'true' ? '#ccf1ea' : '#fcd6d5',
                          color: row.verified === 'true' ? '#00b79a' : '#ee3827',
                          display: 'inline-block',
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          width: '80px',
                          textAlign: 'center'
                        }}
                      >
                        <Typography variant="body2">{row.verified === 'true' ? 'Yes' : 'No'}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {row.status === 'pending' && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleApprovalAction(row.id, 'approve')}
                            sx={{
                              backgroundColor: '#00b79a',
                              '&:hover': { backgroundColor: '#009688' },
                              minWidth: '70px'
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleApprovalAction(row.id, 'reject')}
                            sx={{
                              backgroundColor: '#ee3827',
                              '&:hover': { backgroundColor: '#d32f2f' },
                              minWidth: '70px'
                            }}
                          >
                            Reject
                          </Button>
                        </Box>
                      )}
                      {row.status !== 'pending' && (
                        <Typography variant="body2" color="textSecondary">
                          {row.status === 'approved' ? 'Approved' : 'Rejected'}
                        </Typography>
                      )}
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

      {/* Approval Dialog */}
      <Dialog open={approvalDialog.open} onClose={handleApprovalCancel} maxWidth="sm" fullWidth>
        <DialogTitle>{approvalDialog.action === 'approve' ? 'Approve Request' : 'Reject Request'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Are you sure you want to {approvalDialog.action} request ID: {approvalDialog.requestId}?
            </Typography>
            <TextField fullWidth multiline rows={3} label="Remark" value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="Enter your remarks here..." variant="outlined" />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleApprovalCancel} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleApprovalSubmit}
            variant="contained"
            color={approvalDialog.action === 'approve' ? 'success' : 'error'}
            disabled={loading}
            sx={{
              backgroundColor: approvalDialog.action === 'approve' ? '#00b79a' : '#ee3827',
              '&:hover': {
                backgroundColor: approvalDialog.action === 'approve' ? '#009688' : '#d32f2f'
              }
            }}
          >
            {loading ? 'Processing...' : approvalDialog.action === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
