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
import { InputAdornment, TextField, Popover, useTheme, useMediaQuery } from '@mui/material';
import { IoMdSearch } from 'react-icons/io';
import { AiFillFilePdf } from 'react-icons/ai';
import { FiPrinter } from 'react-icons/fi';
import { FaFileExcel } from 'react-icons/fa';
import { BsCalendar3 } from 'react-icons/bs';
import { IoChevronDown } from 'react-icons/io5';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(9);
  const [searchTerm, setSearchTerm] = React.useState('');

  // Date range state
  const currentDate = dayjs();
  const startDate = currentDate.subtract(30, 'day');
  const endDate = currentDate;

  const [dateRange, setDateRange] = React.useState({
    start: startDate,
    end: endDate
  });
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(startDate);
  const [selectionStep, setSelectionStep] = React.useState<'start' | 'end'>('start');
  const [highlightRange, setHighlightRange] = React.useState<boolean>(false);

  const handleDateRangeClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setHighlightRange(true);
    setSelectionStep('start');
    setSelectedDate(dateRange.start);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectionStep('start');
    setHighlightRange(false);
  };

  const handleDateChange = (date: Dayjs | null) => {
    if (!date) return;

    if (selectionStep === 'start') {
      // When selecting start date
      const newStart = date;

      // Update date range with new start date
      setDateRange((prev) => ({ ...prev, start: newStart }));
      setSelectedDate(newStart);

      // Enable range highlighting
      setHighlightRange(true);

      // Switch to end date selection
      setSelectionStep('end');
    } else {
      // When selecting end date
      // Ensure end date is not before start date
      if (date.isBefore(dateRange.start)) {
        // If user selects a date before start, swap the dates
        setDateRange({
          start: date,
          end: dateRange.start
        });
      } else {
        // Set the end date
        setDateRange((prev) => ({ ...prev, end: date }));
      }

      // Close the calendar after end date is selected
      handleClose();
    }
  };

  const open = Boolean(anchorEl);

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
    <Box sx={{ width: '100%', bgcolor: '#fcf9f1', borderRadius: 2, p: { xs: 2, md: 3 } }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', lg: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', lg: 'center' }, 
        mb: 2,
        gap: { xs: 2, lg: 0 }
      }}>
        <TextField
          placeholder="Search Report"
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
            borderRadius: '4px',
            padding: '4px 12px',
            cursor: 'pointer',
            alignSelf: { xs: 'flex-end', lg: 'center' }
          }}
          onClick={handleDateRangeClick}
        >
          <BsCalendar3 size={20} color="#767676" style={{ marginRight: '8px' }} />
          <Typography variant="body2" sx={{ color: '#606060', fontWeight: 500 }}>
            <span style={{ fontWeight: 'bold' }}>{dateRange.start.format('MMM DD, YYYY')}</span>
            <span style={{ margin: '0 8px', color: '#999' }}>{'->'}</span>
            <span style={{ fontWeight: 'bold' }}>{dateRange.end.format('MMM DD, YYYY')}</span>
          </Typography>
          <IoChevronDown size={20} color="#767676" style={{ marginLeft: '8px' }} />
        </Box>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          sx={{
            '& .MuiPopover-paper': {
              overflow: 'hidden',
              borderRadius: '24px',
              boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.15)',
              border: '1px solid #e0e0e0',
              backgroundColor: '#ffffff'
            }
          }}
        >
          <Box sx={{ p: 2, textAlign: 'center', bgcolor: '#ff6b00', color: 'white' }}>
            <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
              {highlightRange ? (
                <>
                  Current range: {dateRange.start.format('MMM DD')} - {dateRange.end.format('MMM DD, YYYY')}
                </>
              ) : (
                selectionStep === 'end' && <>Start date: {dateRange.start.format('MMM DD, YYYY')}</>
              )}
            </Typography>
          </Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={selectedDate}
              onChange={handleDateChange}
              views={['day']}
              slotProps={{
                day: (ownerState) => {
                  if (!ownerState.day) return {};

                  // Format dates to compare
                  const currentDayFormatted = ownerState.day.format('YYYY-MM-DD');
                  const startDateFormatted = dateRange.start.format('YYYY-MM-DD');
                  const endDateFormatted = dateRange.end.format('YYYY-MM-DD');

                  // Check if this day is the start date
                  const isStartDate = currentDayFormatted === startDateFormatted;

                  // Check if this day is the end date
                  const isEndDate = currentDayFormatted === endDateFormatted;

                  // Check if this day is between start and end (for highlighting the range)
                  const isInRange = highlightRange && ownerState.day.isAfter(dateRange.start) && ownerState.day.isBefore(dateRange.end);

                  if (isStartDate) {
                    return {
                      sx: {
                        backgroundColor: '#ff6b00',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#ff6b00'
                        }
                      }
                    };
                  } else if (isEndDate) {
                    return {
                      sx: {
                        backgroundColor: '#ff8c40',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#ff8c40'
                        }
                      }
                    };
                  } else if (isInRange) {
                    return {
                      sx: {
                        backgroundColor: 'rgba(255, 107, 0, 0.1)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 107, 0, 0.2)'
                        }
                      }
                    };
                  }
                  return {};
                }
              }}
              sx={{
                width: '320px',
                bgcolor: '#ffffff',
                color: '#333',
                padding: '12px',
                '& .MuiPickersCalendarHeader-label': {
                  color: '#333',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  textTransform: 'capitalize',
                  textAlign: 'center',
                  margin: 'auto'
                },
                '& .MuiPickersCalendarHeader-root': {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 8px',
                  marginBottom: '8px'
                },
                '& .MuiPickersCalendarHeader-switchViewButton': {
                  color: '#666'
                },
                '& .MuiPickersArrowSwitcher-button': {
                  color: '#666'
                },
                '& .MuiDayCalendar-header': {
                  '& .MuiDayCalendar-weekDayLabel': {
                    color: '#666',
                    fontSize: '12px',
                    width: '36px',
                    height: '36px',
                    margin: '0'
                  }
                },
                '& .MuiPickersDay-root': {
                  color: '#333',
                  fontSize: '14px',
                  width: '32px',
                  height: '32px',
                  margin: '2px',
                  borderRadius: '50%',
                  '&.Mui-selected': {
                    backgroundColor: '#ff6b00',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#ff6b00'
                    },
                    '&:focus': {
                      backgroundColor: '#ff6b00'
                    }
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 107, 0, 0.1)'
                  },
                  '&.MuiPickersDay-today': {
                    border: '1px solid #ff6b00'
                  },
                  '&.Mui-disabled': {
                    color: '#cccccc'
                  }
                },
                '& .MuiPickersDay-hiddenDaySpacingFiller': {
                  backgroundColor: 'transparent'
                },
                '& .MuiDialogActions-root': {
                  display: 'none'
                },
                '& .MuiPickersSlideTransition-root': {
                  minHeight: '240px'
                }
              }}
            />
          </LocalizationProvider>
        </Popover>
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
