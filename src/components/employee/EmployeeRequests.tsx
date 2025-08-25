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
import { InputAdornment, TextField, Dialog, DialogTitle, DialogContent, DialogActions, useTheme, useMediaQuery, CircularProgress } from '@mui/material';
import { IoMdSearch } from 'react-icons/io';
import { employeeService } from '../../services/employeeService';
import { useAuthContext } from '../../contexts/useAuthContext';
import type { CorpTransaction, CorpTransactionsResponse } from '../../types/api';

interface Column {
  id: 'id' | 'employee' | 'title' | 'date' | 'amount' | 'status' | 'actions';
  label: string;
  minWidth?: number;
  align?: 'center' | 'right';
}

const columns: readonly Column[] = [
  { id: 'id', label: 'REQUEST ID', minWidth: 100 },
  { id: 'employee', label: 'EMPLOYEE', minWidth: 150 },
  { id: 'title', label: 'TITLE', minWidth: 150 },
  { id: 'date', label: 'DATE', minWidth: 120 },
  { id: 'amount', label: 'AMOUNT', minWidth: 120 },
  { id: 'status', label: 'STATUS', minWidth: 120 },
  { id: 'actions', label: 'ACTIONS', minWidth: 200 }
];

export default function EmployeeRequests() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalTransactions, setTotalTransactions] = React.useState(0);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<string>('All');
  const [approvalDialog, setApprovalDialog] = React.useState<{
    open: boolean;
    requestId: number;
    action: 'approve' | 'reject';
  }>({ open: false, requestId: 0, action: 'approve' });
  const [remark, setRemark] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [initialLoading, setInitialLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [transactions, setTransactions] = React.useState<CorpTransaction[]>([]);
  const [processingId, setProcessingId] = React.useState<number | null>(null);

  const { user } = useAuthContext();

  // Fetch transactions from API
  const fetchTransactions = async (page: number = 1) => {
    try {
      setInitialLoading(true);
      const response: CorpTransactionsResponse = await employeeService.getCorpTransactions(page, 10);
      setTransactions(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setTotalTransactions(response.data.pagination.total);
      setCurrentPage(page);
      setError(null);
    } catch (err) {
      setError('Failed to fetch employee requests');
      console.error('Error fetching transactions:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTransactions();
  }, []);

  const handleChangePage = (newPage: number) => {
    fetchTransactions(newPage);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          bg: '#ccf1ea',
          text: '#00b79a'
        };
      case 'cancelled':
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
          bg: '#fcd6d5',
          text: '#ee3827'
        };
      case 'deposit':
        return {
          bg: '#ccf1ea',
          text: '#00b79a'
        };
      default:
        return {
          bg: '#e8f5fe',
          text: '#3c92dc'
        };
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredTransactions = React.useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch = searchTerm === '' || transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) || transaction.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || transaction.employee.email.toLowerCase().includes(searchTerm.toLowerCase()) || transaction.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = filterStatus === 'All' || (filterStatus === 'Completed' && transaction.status === 'completed') || (filterStatus === 'Cancelled' && transaction.status === 'cancelled') || (filterStatus === 'Pending' && transaction.status === 'pending');

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filterStatus, transactions]);

  const handleFilterClick = (status: string) => {
    setFilterStatus(status);
  };

  const handleApprovalAction = (requestId: number, action: 'approve' | 'reject') => {
    setApprovalDialog({ open: true, requestId, action });
    setRemark('');
  };

  const handleApprovalSubmit = async () => {
    if (!remark.trim()) {
      alert('Please enter a remark');
      return;
    }

    setLoading(true);
    setProcessingId(approvalDialog.requestId);
    try {
      await employeeService.updateTransactionStatus(approvalDialog.requestId, approvalDialog.action, remark);

      // Refresh the current page data
      await fetchTransactions(currentPage);

      setApprovalDialog({ open: false, requestId: 0, action: 'approve' });
      setRemark('');
    } catch (error) {
      console.error('Error updating request status:', error);
      alert('Failed to update request status. Please try again.');
    } finally {
      setLoading(false);
      setProcessingId(null);
    }
  };

  const handleApprovalCancel = () => {
    setApprovalDialog({ open: false, requestId: 0, action: 'approve' });
    setRemark('');
  };

  if (initialLoading) {
    return (
      <Box sx={{ width: '100%', bgcolor: '#fcf9f1', borderRadius: 2, p: { xs: 2, md: 3 }, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: '100%', bgcolor: '#fcf9f1', borderRadius: 2, p: { xs: 2, md: 3 } }}>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="error" gutterBottom>
            {error}
          </Typography>
          <Button variant="contained" onClick={() => fetchTransactions(currentPage)} sx={{ mt: 2 }}>
            Try Again
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', bgcolor: '#fcf9f1', borderRadius: 2, p: { xs: 2, md: 3 } }}>
      {/* <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 3 }}> */}
      {/* <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6" color="primary">
              📋
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary">
              Total Requests
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {totalTransactions}
            </Typography>
          </Box>
        </Paper> */}

      {/* <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#fff3e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6" color="warning.main">
              ⏳
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary">
              Pending
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {transactions.filter((t) => t.status === 'pending').length}
            </Typography>
          </Box>
        </Paper> */}

      {/* <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#e8f5e8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6" color="success.main">
              ✅
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary">
              Approved
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {transactions.filter((t) => t.status === 'approved').length}
            </Typography>
          </Box>
        </Paper> */}
      {/* </Box> */}

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', lg: 'center' },
          mb: 2,
          gap: { xs: 2, lg: 0 }
        }}
      >
        <TextField
          placeholder="Search requests..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: { xs: '100%', lg: '250px' },
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              backgroundColor: '#ffffff'
            }
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IoMdSearch />
                </InputAdornment>
              )
            }
          }}
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 1,
            flexWrap: 'wrap'
          }}
        >
          <Typography variant="body2" sx={{ mr: { xs: 0, sm: 1 }, mb: { xs: 1, sm: 0 } }}>
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
            variant={filterStatus === 'Completed' ? 'contained' : 'outlined'}
            onClick={() => handleFilterClick('Completed')}
            sx={{
              borderRadius: '20px',
              px: 2,
              backgroundColor: filterStatus === 'Completed' ? '#e07a64' : 'transparent',
              color: filterStatus === 'Completed' ? 'white' : 'black',
              borderColor: '#e9d9c2',
              '&:hover': {
                backgroundColor: filterStatus === 'Completed' ? '#d06954' : 'rgba(0, 0, 0, 0.04)',
                borderColor: filterStatus === 'Completed' ? '#d06954' : '#e9d9c2'
              }
            }}
          >
            Approved
          </Button>
          <Button
            variant={filterStatus === 'Cancelled' ? 'contained' : 'outlined'}
            onClick={() => handleFilterClick('Cancelled')}
            sx={{
              borderRadius: '20px',
              px: 2,
              backgroundColor: filterStatus === 'Cancelled' ? '#e07a64' : 'transparent',
              color: filterStatus === 'Cancelled' ? 'white' : 'black',
              borderColor: '#e9d9c2',
              '&:hover': {
                backgroundColor: filterStatus === 'Cancelled' ? '#d06954' : 'rgba(0, 0, 0, 0.04)',
                borderColor: filterStatus === 'Cancelled' ? '#d06954' : '#e9d9c2'
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
              {filteredTransactions.map((transaction) => {
                const statusColors = getStatusColor(transaction.status);
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={transaction.id} sx={{ '& td': { borderColor: '#f0f0f0' } }}>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {transaction.employee.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {transaction.employee.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{transaction.title}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          Ref: {transaction.referenceNumber}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                    <TableCell align="left">
                      <Box
                        sx={{
                          color: transaction.type === 'withdrawal' ? '#ee3827' : '#00b79a',
                          fontWeight: 'bold'
                        }}
                      >
                        {formatAmount(transaction.amount)}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Box
                          sx={{
                            backgroundColor: statusColors.bg,
                            color: statusColors.text,
                            display: 'inline-block',
                            px: 2,
                            py: 0.5,
                            borderRadius: 1,
                            width: '100px',
                            textAlign: 'center'
                          }}
                        >
                          <Typography variant="body2">{transaction.status === 'completed' ? 'Approved' : transaction.status === 'cancelled' ? 'Rejected' : 'Pending'}</Typography>
                        </Box>
                        {
                          // transaction.verified && (
                          //   <Box
                          //     sx={{
                          //       backgroundColor: '#ccf1ea',
                          //       color: '#00b79a',
                          //       display: 'inline-block',
                          //       px: 1,
                          //       py: 0.25,
                          //       borderRadius: 1,
                          //       width: '100px',
                          //       textAlign: 'center'
                          //     }}
                          //   >
                          //     <Typography variant="caption">Verified</Typography>
                          //   </Box>
                          // )
                        }
                      </Box>
                    </TableCell>
                    <TableCell>
                      {transaction.status === 'pending' && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleApprovalAction(transaction.id, 'approve')}
                            disabled={processingId === transaction.id}
                            sx={{
                              backgroundColor: '#00b79a',
                              '&:hover': { backgroundColor: '#009688' },
                              minWidth: '70px'
                            }}
                          >
                            {processingId === transaction.id ? <CircularProgress size={16} color="inherit" /> : 'Approve'}
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleApprovalAction(transaction.id, 'reject')}
                            disabled={processingId === transaction.id}
                            sx={{
                              backgroundColor: '#ee3827',
                              '&:hover': { backgroundColor: '#d32f2f' },
                              minWidth: '70px'
                            }}
                          >
                            {processingId === transaction.id ? <CircularProgress size={16} color="inherit" /> : 'Reject'}
                          </Button>
                        </Box>
                      )}
                      {transaction.status !== 'pending' && (
                        <Typography variant="body2" color="textSecondary">
                          {transaction.status === 'completed' ? 'Approved' : 'Rejected'}
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
            Showing page {currentPage} of {totalPages} ({totalTransactions} total requests)
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
              disabled={currentPage >= totalPages}
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

      {/* Empty State */}
      {filteredTransactions.length === 0 && !initialLoading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No requests found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {searchTerm || filterStatus !== 'All' ? 'Try adjusting your search or filter criteria.' : 'There are no employee requests at the moment.'}
          </Typography>
        </Box>
      )}

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
