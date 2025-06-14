import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import { IoMdSearch } from 'react-icons/io';

export interface TransactionHistoryItem {
  date: string;
  referenceNo: string;
  accountNo: string;
  status: string;
  amount: string;
}

interface TransactionHistoryProps {
  data: TransactionHistoryItem[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ data }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(10);
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const filteredHistory = data.filter((item) => item.referenceNo.includes(searchTerm) || item.accountNo.includes(searchTerm) || item.status.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Box sx={{ width: '100%', bgcolor: 'white', borderRadius: 2, p: 3, mt: 2 }}>
      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Search transaction"
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
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 'none', borderRadius: 2 }}>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 'bold', backgroundColor: '#ffffff' } }}>
                <TableCell>TRANSACTION DATE</TableCell>
                <TableCell>REFERENCE NO</TableCell>
                <TableCell>ACCOUNT NO</TableCell>
                <TableCell>TRANSACTION STATUS</TableCell>
                <TableCell>LOAN AMOUNT</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredHistory.length > 0 ? (
                filteredHistory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                  <TableRow hover key={index} sx={{ '& td': { borderColor: '#f0f0f0' } }}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.referenceNo}</TableCell>
                    <TableCell>{item.accountNo}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          backgroundColor: item.status === 'Active' ? '#ccf1ea' : '#fcd6d5',
                          color: item.status === 'Active' ? '#00b79a' : '#ee3827',
                          display: 'inline-block',
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          width: '80px',
                          textAlign: 'center'
                        }}
                      >
                        <Typography variant="body2">{item.status}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{item.amount}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 2 }}>
                    No transaction history found.
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
            backgroundColor: 'white',
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
            Showing {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, filteredHistory.length)} of {filteredHistory.length}
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
              disabled={page >= Math.ceil(filteredHistory.length / rowsPerPage) - 1}
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
};

export default TransactionHistory;
