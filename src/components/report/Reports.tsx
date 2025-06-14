import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { InputAdornment, TextField } from '@mui/material';
import { IoMdSearch } from 'react-icons/io';
import { AiFillFilePdf } from 'react-icons/ai';
import { FiPrinter } from 'react-icons/fi';
import { FaFileExcel } from 'react-icons/fa';
import { BsCalendar3 } from 'react-icons/bs';
import { IoChevronDown } from 'react-icons/io5';

interface Column {
  id: 'billingMonth' | 'transactionType' | 'transactionDate' | 'transactionAmount' | 'balance' | 'actions';
  label: string;
  minWidth?: number;
  align?: 'center' | 'right';
  format?: (value: number | string) => string;
}

const columns: readonly Column[] = [
  { id: 'billingMonth', label: 'BILLING MONTH', minWidth: 150 },
  { id: 'transactionType', label: 'TRANSACTION TYPE', minWidth: 150 },
  { id: 'transactionDate', label: 'TRANSACTION DATE', minWidth: 150 },
  { id: 'transactionAmount', label: 'TRANSACTION AMOUNT', minWidth: 170 },
  { id: 'balance', label: 'BALANCE', minWidth: 120 },
  { id: 'actions', label: 'ACTIONS', minWidth: 150, align: 'center' }
];

interface ReportData {
  billingMonth: string;
  transactionType: string;
  transactionDate: string;
  transactionAmount: string;
  balance: string;
}

function createData(billingMonth: string, transactionType: string, transactionDate: string, transactionAmount: string, balance: string): ReportData {
  return { billingMonth, transactionType, transactionDate, transactionAmount, balance };
}

const rows = [
  createData('2025-June', 'Invoice', '2025.02.02', '300 USD', '100 USD'),
  createData('2025-June', 'Invoice', '2025.02.02', '300 USD', '100 USD'),
  createData('2025-June', 'Invoice', '2025.02.02', '300 USD', '100 USD'),
  createData('2025-June', 'Invoice', '2025.02.02', '300 USD', '100 USD'),
  createData('2025-June', 'Invoice', '2025.02.02', '300 USD', '100 USD'),
  createData('2025-June', 'Invoice', '2025.02.02', '300 USD', '100 USD')
];

export default function Reports() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(9);
  const [searchTerm, setSearchTerm] = React.useState('');
  const dateRange = 'Jun 07, 2025 -> Jun 13, 2025';

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleExportToExcel = () => {
    // Implementation for exporting to Excel
    console.log('Exporting to Excel...');
  };

  const handleExportToPdf = () => {
    // Implementation for exporting to PDF
    console.log('Exporting to PDF...');
  };

  const handlePrint = () => {
    // Implementation for printing
    console.log('Printing...');
  };

  const filteredRows = React.useMemo(() => {
    return rows.filter((row) => {
      return searchTerm === '' || Object.values(row).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase()));
    });
  }, [searchTerm]);

  return (
    <Box sx={{ width: '100%', bgcolor: '#fcf9f1', borderRadius: 2, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <TextField
          placeholder="Search Report"
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            // bgcolor: '#ffffff',
            // border: '1px solid #e9e9e9',
            borderRadius: '4px',
            padding: '4px 12px',
            cursor: 'pointer'
          }}
        >
          <BsCalendar3 size={20} color="#767676" style={{ marginRight: '8px' }} />
          <Typography variant="body2" sx={{ color: '#606060', fontWeight: 500 }}>
            {dateRange}
          </Typography>
          <IoChevronDown size={20} color="#767676" style={{ marginLeft: '8px' }} />
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
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index} sx={{ '& td': { borderColor: '#f0f0f0' } }}>
                    <TableCell>{row.billingMonth}</TableCell>
                    <TableCell>{row.transactionType}</TableCell>
                    <TableCell>{row.transactionDate}</TableCell>
                    <TableCell>{row.transactionAmount}</TableCell>
                    <TableCell>{row.balance}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Button
                          onClick={handleExportToExcel}
                          sx={{
                            minWidth: '32px',
                            p: 0.5,
                            color: '#1d6f42'
                          }}
                        >
                          <FaFileExcel size={20} />
                        </Button>
                        <Button
                          onClick={handleExportToPdf}
                          sx={{
                            minWidth: '32px',
                            p: 0.5,
                            color: '#ff0000'
                          }}
                        >
                          <AiFillFilePdf size={20} />
                        </Button>
                        <Button
                          onClick={handlePrint}
                          sx={{
                            minWidth: '32px',
                            p: 0.5,
                            color: '#0066cc'
                          }}
                        >
                          <FiPrinter size={20} />
                        </Button>
                      </Box>
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
    </Box>
  );
}
