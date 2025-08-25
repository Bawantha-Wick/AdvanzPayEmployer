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
import { InputAdornment, TextField, CircularProgress, Alert, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { IoMdSearch, IoMdClose } from 'react-icons/io';
import { AiFillFilePdf } from 'react-icons/ai';
import { settlementService } from '../../services/settlementService';
import type { MonthlyLiability } from '../../types/api';

interface Column {
  id: 'billingMonth' | 'transactionType' | 'transactionDate' | 'transactionAmount' | 'balance' | 'actions';
  label: string;
  minWidth?: number;
  align?: 'center';
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

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return `${amount} USD`;
};

export default function Settlements() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(9);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [monthlyLiabilities, setMonthlyLiabilities] = React.useState<MonthlyLiability[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });
  const [pdfPreviewOpen, setPdfPreviewOpen] = React.useState(false);

  // Get current date for API call
  const currentDate = new Date().toISOString().split('T')[0];
  const corpId = 1; // You might want to get this from context or props

  // Get user info from localStorage
  const getUserInfo = () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        return JSON.parse(storedUser);
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
    }
    return null;
  };

  const userInfo = getUserInfo();
  const corpName = userInfo?.corpName || 'Company Name';

  React.useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await settlementService.getAnalytics(corpId, currentDate, currentDate);
        setMonthlyLiabilities(data.monthlyLiabilities);
      } catch (err) {
        setError('Failed to fetch settlement data');
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [corpId, currentDate]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleExportToPdf = () => {
    setPdfPreviewOpen(true);
  };

  const handleClosePdfPreview = () => {
    setPdfPreviewOpen(false);
  };

  const generatePdfContent = () => {
    const currentMonth = filteredRows[0]?.billingMonth || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    const totalAmount = filteredRows
      .reduce((sum, row) => {
        const amount = parseFloat(row.transactionAmount.replace(/[^\d.-]/g, ''));
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0)
      .toLocaleString('en-US', { minimumFractionDigits: 2 });

    const reportId = `SR-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${corpId}`;
    const generatedDate = new Date().toLocaleDateString();

    // Create PDF content as HTML string
    let pdfContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #DC7356;">
          <h1 style="color: #DC7356; margin: 0 0 10px 0; font-size: 28px;">SETTLEMENT REPORT</h1>
          <h2 style="color: #666; margin: 0; font-size: 20px; font-weight: normal;">${currentMonth}</h2>
        </div>

        <!-- Company Info -->
        <div style="margin-bottom: 20px; padding: 15px; background-color: #f0f8ff; border-radius: 8px; border-left: 4px solid #DC7356;">
          <div style="font-size: 16px; font-weight: bold; color: #333; margin-bottom: 5px;">${corpName}</div>
          <div style="color: #666; font-size: 14px;">Corporation ID: ${corpId}</div>
        </div>

        <!-- Summary Info -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
          <div style="text-align: center;">
            <div style="color: #666; font-size: 14px; margin-bottom: 5px;">Total Transactions</div>
            <div style="font-size: 18px; font-weight: bold;">${filteredRows.length}</div>
          </div>
          <div style="text-align: center;">
            <div style="color: #666; font-size: 14px; margin-bottom: 5px;">Total Amount</div>
            <div style="font-size: 18px; font-weight: bold; color: #DC7356;">$${totalAmount}</div>
          </div>
          <div style="text-align: center;">
            <div style="color: #666; font-size: 14px; margin-bottom: 5px;">Report Period</div>
            <div style="font-size: 18px; font-weight: bold;">${currentMonth}</div>
          </div>
        </div>

        <!-- Transaction Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="background-color: #DC7356;">
              <th style="color: white; padding: 12px; text-align: left; font-weight: bold;">Date</th>
              <th style="color: white; padding: 12px; text-align: left; font-weight: bold;">Type</th>
              <th style="color: white; padding: 12px; text-align: left; font-weight: bold;">Amount</th>
              <th style="color: white; padding: 12px; text-align: left; font-weight: bold;">Balance</th>
            </tr>
          </thead>
          <tbody>`;

    filteredRows.forEach((row, index) => {
      const bgColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa';
      const typeColor = row.transactionType === 'Invoice' ? '#3c92dc' : '#00b79a';
      const typeBgColor = row.transactionType === 'Invoice' ? '#e8f5fe' : '#ccf1ea';
      const balanceColor = parseFloat(row.balance.replace(/[^\d.-]/g, '')) >= 0 ? '#28a745' : '#dc3545';

      pdfContent += `
        <tr style="background-color: ${bgColor};">
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${row.transactionDate}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">
            <span style="background-color: ${typeBgColor}; color: ${typeColor}; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">
              ${row.transactionType}
            </span>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">${row.transactionAmount}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; color: ${balanceColor};">${row.balance}</td>
        </tr>`;
    });

    pdfContent += `
          </tbody>
        </table>

        <!-- Footer -->
        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
          Generated on ${generatedDate} | Report ID: ${reportId}
        </div>
      </div>`;

    return pdfContent;
  };

  const handleDownloadPdf = async () => {
    try {
      // Create a temporary div to hold the PDF content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = generatePdfContent();
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      document.body.appendChild(tempDiv);

      // Use browser's print functionality to generate PDF
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Settlement Report</title>
              <style>
                @media print {
                  body { margin: 0; }
                  @page { margin: 1in; }
                }
              </style>
            </head>
            <body>
              ${generatePdfContent()}
            </body>
          </html>
        `);
        printWindow.document.close();

        // Trigger print dialog which allows saving as PDF
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      }

      // Clean up
      document.body.removeChild(tempDiv);

      setSnackbar({
        open: true,
        message: "PDF generation initiated! Use your browser's print dialog to save as PDF.",
        severity: 'success'
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      setSnackbar({
        open: true,
        message: 'Error generating PDF. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Convert API data to table format
  const rows = React.useMemo(() => {
    return monthlyLiabilities.map((liability) => ({
      billingMonth: liability.billingMonth,
      transactionType: liability.type,
      transactionDate: liability.lastDate,
      transactionAmount: formatCurrency(liability.totalLiability),
      balance: formatCurrency(liability.balance)
    }));
  }, [monthlyLiabilities]);

  const filteredRows = React.useMemo(() => {
    return rows.filter((row) => {
      return searchTerm === '' || Object.values(row).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase()));
    });
  }, [rows, searchTerm]);

  return (
    <Box sx={{ width: '100%', bgcolor: '#fcf9f1', borderRadius: 2, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <TextField
          placeholder="Search settlements"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
          sx={{
            width: '250px',
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
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress />
        </Box>
      ) : (
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
                {filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No settlement data available
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index} sx={{ '& td': { borderColor: '#f0f0f0' } }}>
                        <TableCell>{row.billingMonth}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              backgroundColor: row.transactionType === 'Invoice' ? '#e8f5fe' : '#ccf1ea',
                              color: row.transactionType === 'Invoice' ? '#3c92dc' : '#00b79a',
                              display: 'inline-block',
                              px: 2,
                              py: 0.5,
                              borderRadius: 1,
                              minWidth: '80px',
                              textAlign: 'center'
                            }}
                          >
                            <Typography variant="body2">{row.transactionType}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{row.transactionDate}</TableCell>
                        <TableCell>{row.transactionAmount}</TableCell>
                        <TableCell>{row.balance}</TableCell>
                        <TableCell align="center">
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
                        </TableCell>
                      </TableRow>
                    );
                  })
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
      )}

      {/* PDF Preview Dialog */}
      <Dialog
        open={pdfPreviewOpen}
        onClose={handleClosePdfPreview}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            height: '75vh'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#DC7356', color: 'white' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Settlement Report - {filteredRows[0]?.billingMonth || 'Current Month'}
          </Typography>
          <IconButton onClick={handleClosePdfPreview} size="small" sx={{ color: 'white' }}>
            <IoMdClose />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Paper sx={{ p: 3, bgcolor: 'white' }}>
            {/* Simple Header */}
            <Box sx={{ textAlign: 'center', mb: 3, pb: 2, borderBottom: '2px solid #DC7356' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#DC7356', mb: 1 }}>
                SETTLEMENT REPORT
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#666' }}>
                {filteredRows[0]?.billingMonth || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              </Typography>
            </Box>

            {/* Company Info */}
            <Box sx={{ mb: 2, p: 2, bgcolor: '#f0f8ff', borderRadius: 1, borderLeft: '4px solid #DC7356' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 0.5 }}>
                {corpName}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Corporation ID: {corpId}
              </Typography>
            </Box>

            {/* Summary Info */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Total Transactions
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {filteredRows.length}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Total Amount
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#DC7356' }}>
                  $
                  {filteredRows
                    .reduce((sum, row) => {
                      const amount = parseFloat(row.transactionAmount.replace(/[^\d.-]/g, ''));
                      return sum + (isNaN(amount) ? 0 : amount);
                    }, 0)
                    .toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Report Period
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {filteredRows[0]?.billingMonth || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </Typography>
              </Box>
            </Box>

            {/* Transaction Table */}
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#DC7356' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Amount</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.map((row, index) => (
                  <TableRow key={index} sx={{ '&:nth-of-type(even)': { bgcolor: '#f8f9fa' } }}>
                    <TableCell>{row.transactionDate}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          backgroundColor: row.transactionType === 'Invoice' ? '#e8f5fe' : '#ccf1ea',
                          color: row.transactionType === 'Invoice' ? '#3c92dc' : '#00b79a',
                          display: 'inline-block',
                          px: 1,
                          py: 0.5,
                          borderRadius: 0.5,
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                      >
                        {row.transactionType}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{row.transactionAmount}</TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 'bold',
                        color: parseFloat(row.balance.replace(/[^\d.-]/g, '')) >= 0 ? '#28a745' : '#dc3545'
                      }}
                    >
                      {row.balance}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Simple Footer */}
            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #ddd', textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#666' }}>
                Generated on {new Date().toLocaleDateString()} | Report ID: SR-{new Date().getFullYear()}-{String(new Date().getMonth() + 1).padStart(2, '0')}-{corpId}
              </Typography>
            </Box>
          </Paper>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleClosePdfPreview} variant="outlined">
            Close
          </Button>
          <Button onClick={handleDownloadPdf} variant="contained" startIcon={<AiFillFilePdf />} sx={{ bgcolor: '#DC7356', '&:hover': { bgcolor: '#e55a00' } }}>
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for action feedback */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
