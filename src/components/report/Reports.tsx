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
import { InputAdornment, TextField, useTheme, useMediaQuery } from '@mui/material';
import { IoMdSearch } from 'react-icons/io';
import { AiFillFilePdf } from 'react-icons/ai';
import { FiPrinter } from 'react-icons/fi';
import { FaFileExcel } from 'react-icons/fa';
import { BsCalendar3 } from 'react-icons/bs';
import { IoChevronDown } from 'react-icons/io5';
import dayjs, { Dayjs } from 'dayjs';

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
  // Date picker state
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);
  const [tempStartDate, setTempStartDate] = React.useState<Dayjs>(dateRange.start);
  const [tempEndDate, setTempEndDate] = React.useState<Dayjs>(dateRange.end);
  const [currentView, setCurrentView] = React.useState<Dayjs>(dateRange.start);
  const [selectionMode, setSelectionMode] = React.useState<'start' | 'end'>('start');

  const handleDatePickerToggle = () => {
    if (!isDatePickerOpen) {
      // Reset temp values when opening
      setTempStartDate(dateRange.start);
      setTempEndDate(dateRange.end);
      setCurrentView(dateRange.start);
      setSelectionMode('start');
    }
    setIsDatePickerOpen(!isDatePickerOpen);
  };

  const handleDateClick = (date: Dayjs) => {
    if (selectionMode === 'start') {
      setTempStartDate(date);
      setCurrentView(date);
      // If selected start date is after current end date, adjust end date
      if (date.isAfter(tempEndDate)) {
        setTempEndDate(date.add(1, 'day'));
      }
      setSelectionMode('end');
    } else {
      // Selecting end date
      if (date.isBefore(tempStartDate)) {
        // If end date is before start, swap them
        setTempStartDate(date);
        setTempEndDate(tempStartDate);
      } else if (date.isSame(tempStartDate)) {
        // If same date, add one day to end
        setTempEndDate(date.add(1, 'day'));
      } else {
        setTempEndDate(date);
      }
      setSelectionMode('start'); // Reset for next selection
    }
  };

  const handleApplyDateRange = () => {
    setDateRange({ start: tempStartDate, end: tempEndDate });
    setIsDatePickerOpen(false);
  };

  const handleCancelDateRange = () => {
    setIsDatePickerOpen(false);
  };

  const isDateInRange = (date: Dayjs) => {
    return date.isAfter(tempStartDate.subtract(1, 'day')) && date.isBefore(tempEndDate.add(1, 'day'));
  };

  const isStartDate = (date: Dayjs) => {
    return date.isSame(tempStartDate, 'day');
  };

  const isEndDate = (date: Dayjs) => {
    return date.isSame(tempEndDate, 'day');
  };

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
        <Box sx={{ position: 'relative', alignSelf: { xs: 'flex-end', lg: 'center' } }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: '4px',
              padding: '4px 12px',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
            onClick={handleDatePickerToggle}
          >
            <BsCalendar3 size={20} color="#767676" style={{ marginRight: '8px' }} />
            <Typography variant="body2" sx={{ color: '#606060', fontWeight: 500 }}>
              <span style={{ fontWeight: 'bold' }}>{dateRange.start.format('MMM DD, YYYY')}</span>
              <span style={{ margin: '0 8px', color: '#999' }}>{'->'}</span>
              <span style={{ fontWeight: 'bold' }}>{dateRange.end.format('MMM DD, YYYY')}</span>
            </Typography>
            <IoChevronDown
              size={20}
              color="#767676"
              style={{
                marginLeft: '8px',
                transform: isDatePickerOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}
            />
          </Box>

          {/* Custom Date Picker Dropdown */}
          {isDatePickerOpen && (
            <Box
              sx={{
                position: 'absolute',
                top: '100%',
                right: 0,
                zIndex: 1300,
                mt: 1,
                width: '380px',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
                border: '1px solid #e0e0e0',
                overflow: 'hidden'
              }}
            >
              {/* Header */}
              <Box sx={{ p: 2, bgcolor: '#ff6b00', color: 'white', textAlign: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {selectionMode === 'start' ? 'Select Start Date' : 'Select End Date'}
                </Typography>
                <Typography variant="caption">{selectionMode === 'start' ? 'Choose the beginning of your date range' : `Start: ${tempStartDate.format('MMM DD, YYYY')} - Now pick end date`}</Typography>
              </Box>

              {/* Calendar Grid */}
              <Box sx={{ p: 2 }}>
                {/* Month Navigation */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      cursor: 'pointer',
                      p: 1,
                      borderRadius: '50%',
                      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                    }}
                    onClick={() => setCurrentView(currentView.subtract(1, 'month'))}
                  >
                    ←
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {currentView.format('MMMM YYYY')}
                  </Typography>
                  <Box
                    sx={{
                      cursor: 'pointer',
                      p: 1,
                      borderRadius: '50%',
                      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                    }}
                    onClick={() => setCurrentView(currentView.add(1, 'month'))}
                  >
                    →
                  </Box>
                </Box>

                {/* Weekday Headers */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mb: 1 }}>
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                    <Box key={day} sx={{ textAlign: 'center', py: 1, fontSize: '12px', color: '#666' }}>
                      {day}
                    </Box>
                  ))}
                </Box>

                {/* Calendar Days */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
                  {(() => {
                    const startOfMonth = currentView.startOf('month');
                    const endOfMonth = currentView.endOf('month');
                    const startOfWeek = startOfMonth.startOf('week');
                    const endOfWeek = endOfMonth.endOf('week');

                    const days = [];
                    let current = startOfWeek;

                    while (current.isBefore(endOfWeek) || current.isSame(endOfWeek, 'day')) {
                      days.push(current);
                      current = current.add(1, 'day');
                    }

                    return days.map((date) => {
                      const isCurrentMonth = date.isSame(currentView, 'month');
                      const isToday = date.isSame(dayjs(), 'day');
                      const isStart = isStartDate(date);
                      const isEnd = isEndDate(date);
                      const inRange = isDateInRange(date) && !isStart && !isEnd;

                      return (
                        <Box
                          key={date.format('YYYY-MM-DD')}
                          sx={{
                            aspectRatio: '1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: isCurrentMonth ? 'pointer' : 'default',
                            borderRadius: '50%',
                            fontSize: '14px',
                            fontWeight: isToday ? 'bold' : 'normal',
                            color: !isCurrentMonth ? '#ccc' : isStart || isEnd ? 'white' : '#333',
                            backgroundColor: isStart ? '#ff6b00' : isEnd ? '#ff8c40' : inRange ? 'rgba(255, 107, 0, 0.1)' : 'transparent',
                            border: isToday && !isStart && !isEnd ? '2px solid #ff6b00' : 'none',
                            '&:hover': isCurrentMonth
                              ? {
                                  backgroundColor: isStart ? '#ff6b00' : isEnd ? '#ff8c40' : 'rgba(255, 107, 0, 0.2)'
                                }
                              : {}
                          }}
                          onClick={() => isCurrentMonth && handleDateClick(date)}
                        >
                          {date.format('D')}
                        </Box>
                      );
                    });
                  })()}
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  p: 2,
                  borderTop: '1px solid #e0e0e0',
                  backgroundColor: '#f8f9fa'
                }}
              >
                <Box sx={{ fontSize: '12px', color: '#666', alignSelf: 'center' }}>{selectionMode === 'start' ? 'Click a date to start' : 'Click a date to finish'}</Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: '#666',
                      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                    }}
                    onClick={handleCancelDateRange}
                  >
                    Cancel
                  </Box>
                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      backgroundColor: '#ff6b00',
                      color: 'white',
                      '&:hover': { backgroundColor: '#e55a00' }
                    }}
                    onClick={handleApplyDateRange}
                  >
                    Apply
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
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
