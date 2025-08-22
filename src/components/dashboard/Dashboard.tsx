import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Paper, Popover, Alert } from '@mui/material';
import { ArrowUpward, Inventory, Payments, People, AccountBalanceWallet } from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Area } from 'recharts';
import { BsCalendar3 } from 'react-icons/bs';
import { IoChevronDown } from 'react-icons/io5';
import { useDashboardAnalytics } from '../../hooks/useDashboard';
import { LoadingSpinner } from '../common/LoadingSpinner';

const Dashboard: React.FC = () => {
  // Get corpId from localStorage or use default value
  const corpId = parseInt(localStorage.getItem('corpId') || '1');

  // Use the current date as default
  const currentDate = dayjs();
  // Make sure we have fresh instances of dayjs objects
  const startDate = currentDate.subtract(30, 'day');
  const endDate = currentDate;

  // Validation function to ensure from date is always less than to date
  const validateDateRange = (start: Dayjs, end: Dayjs) => {
    if (start.isAfter(end) || start.isSame(end)) {
      return {
        start: start,
        end: start.add(1, 'day')
      };
    }
    return { start, end };
  };

  const [dateRange, setDateRange] = useState(() =>
    validateDateRange(startDate, endDate)
  );

  // Format dates for API call (YYYY-MM-DD format)
  const fromDate = dateRange.start.format('YYYY-MM-DD');
  const toDate = dateRange.end.format('YYYY-MM-DD');

  // Fetch dashboard analytics with date range
  const { data: analytics, isLoading, error } = useDashboardAnalytics(corpId, fromDate, toDate);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(startDate);
  const [selectionStep, setSelectionStep] = useState<'start' | 'end'>('start');
  // Keep track of highlighted range for visualization
  const [highlightRange, setHighlightRange] = useState<boolean>(false);

  const handleDateRangeClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    // Start by showing the existing selection in visualization mode
    setHighlightRange(true);
    // Default to selecting the start date first
    setSelectionStep('start');
    // Always start with the current start date selected
    setSelectedDate(dateRange.start);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectionStep('start');
    // Stop highlighting range when closed
    setHighlightRange(false);
  };

  const handleDateChange = (date: Dayjs | null) => {
    if (!date) return;

    if (selectionStep === 'start') {
      // When selecting start date
      const newStart = date;

      // If the new start date is after the current end date, adjust the end date
      if (newStart.isAfter(dateRange.end)) {
        setDateRange(validateDateRange(newStart, newStart.add(1, 'day')));
      } else {
        // Update date range with new start date
        setDateRange((prev) => validateDateRange(newStart, prev.end));
      }

      setSelectedDate(newStart);

      // Enable range highlighting
      setHighlightRange(true);

      // Switch to end date selection
      setSelectionStep('end');
    } else {
      // When selecting end date
      // Ensure end date is not before start date
      if (date.isBefore(dateRange.start) || date.isSame(dateRange.start)) {
        // If user selects a date before or same as start, set it as start and adjust end
        const newEnd = dateRange.start.isAfter(date) ? dateRange.start : date.add(1, 'day');
        setDateRange(validateDateRange(date, newEnd));
      } else {
        // Set the end date (valid case where end > start)
        setDateRange((prev) => validateDateRange(prev.start, date));
      }

      // Close the calendar after end date is selected
      handleClose();
    }
  };

  const open = Boolean(anchorEl);

  // Transform API data for chart
  const chartData = React.useMemo(() => {
    if (!analytics?.dailyWithdrawals) {
      return [];
    }

    return analytics.dailyWithdrawals.map((item) => {
      const date = dayjs(item.date);
      return {
        date: item.date,
        amount: item.amount,
        displayDate: date.format('MMM DD'),
        fullDate: date.format('MMM DD, YYYY')
      };
    });
  }, [analytics?.dailyWithdrawals]);

  // Show loading spinner while fetching data
  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading dashboard..." />;
  }

  // Show error message if API call fails
  if (error) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#faf7f2' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load dashboard data. Please try again later.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#faf7f2' }}>
      {/* Date Range Display */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box /> {/* Empty box for alignment to match Reports.tsx layout */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: '4px',
            padding: '4px 12px',
            cursor: 'pointer'
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
        </Box>{' '}
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
          disableAutoFocus
          disableEnforceFocus
          disableRestoreFocus
          disablePortal={false}
          keepMounted={false}
          sx={{
            '& .MuiPopover-root': {
              position: 'fixed !important'
            },
            '& .MuiPopover-paper': {
              overflow: 'hidden',
              borderRadius: '24px',
              boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.15)',
              border: '1px solid #e0e0e0',
              backgroundColor: '#ffffff',
              position: 'fixed !important',
              width: '360px !important',
              height: '450px !important',
              maxHeight: '450px !important',
              minHeight: '450px !important',
              transform: 'none !important',
              willChange: 'auto'
            },
            '& .MuiPaper-root': {
              transform: 'none !important'
            }
          }}
        >
          <Box sx={{ p: 2, textAlign: 'center', bgcolor: '#ff6b00', color: 'white' }}>
            {/* <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}> */}
            {/* {selectionStep === 'start' ? 'Select Start Date' : 'Select End Date'} */}
            {/* </Typography> */}
            {/* Show current date range information */}
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
          <Box sx={{
            width: '360px',
            height: '380px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={selectedDate}
                onChange={handleDateChange}
                views={['day']}
                fixedWeekNumber={6}
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
                  width: '320px !important',
                  height: '380px !important',
                  maxHeight: '380px !important',
                  minHeight: '380px !important',
                  bgcolor: '#ffffff',
                  color: '#333',
                  padding: '12px',
                  overflow: 'hidden',
                  position: 'relative',
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
                    marginBottom: '8px',
                    height: '40px !important',
                    minHeight: '40px !important'
                  },
                  '& .MuiPickersCalendarHeader-switchViewButton': {
                    color: '#666'
                  },
                  '& .MuiPickersArrowSwitcher-button': {
                    color: '#666'
                  },
                  '& .MuiDayCalendar-header': {
                    height: '40px !important',
                    minHeight: '40px !important',
                    '& .MuiDayCalendar-weekDayLabel': {
                      color: '#666',
                      fontSize: '12px',
                      width: '36px !important',
                      height: '36px !important',
                      minHeight: '36px !important',
                      margin: '0'
                    }
                  },
                  '& .MuiPickersDay-root': {
                    color: '#333',
                    fontSize: '14px',
                    width: '32px !important',
                    height: '32px !important',
                    minWidth: '32px !important',
                    minHeight: '32px !important',
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
                    backgroundColor: 'transparent',
                    width: '32px !important',
                    height: '32px !important'
                  },
                  '& .MuiDialogActions-root': {
                    display: 'none'
                  },
                  '& .MuiPickersSlideTransition-root': {
                    minHeight: '280px !important',
                    height: '280px !important',
                    maxHeight: '280px !important',
                    overflow: 'hidden'
                  },
                  '& .MuiDayCalendar-monthContainer': {
                    position: 'relative',
                    height: '280px !important',
                    minHeight: '280px !important',
                    maxHeight: '280px !important'
                  },
                  '& .MuiDayCalendar-slideTransition': {
                    minHeight: '280px !important',
                    height: '280px !important',
                    maxHeight: '280px !important'
                  },
                  '& .MuiDayCalendar-weekContainer': {
                    height: '40px !important',
                    minHeight: '40px !important',
                    margin: '2px 0'
                  }
                }}
              />
            </LocalizationProvider>
          </Box>
        </Popover>
      </Box>

      {/* Stat Cards */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: '1fr 1fr',
          md: '1fr 1fr',
          lg: 'repeat(4, 1fr)'
        },
        gap: 3,
        mb: 4
      }}>
        {/* Withdrawal Requests Card */}
        <Box>
          <Card sx={{ bgcolor: '#e8d7cd', borderRadius: '40px', position: 'relative', height: '11.5rem' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ color: '#666' }}>
                Withdrawal requests
              </Typography>
              <Typography variant="h3" sx={{ my: 2, fontWeight: 'bold' }}>
                {analytics?.withdrawalRequestCount || 0}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ArrowUpward sx={{ color: '#4CAF50', fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" sx={{ color: '#666' }}>
                  From today data
                </Typography>
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  top: '3rem',
                  right: 20,
                  transform: 'translateY(-50%)',
                  bgcolor: '#fadad7',
                  p: 1.5,
                  borderRadius: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Inventory sx={{ color: '#ff6b6b', fontSize: 24 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Total Withdrawal Amount Card */}
        <Box>
          <Card sx={{ bgcolor: '#fff', borderRadius: '40px', position: 'relative', height: '11.5rem' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ color: '#666' }}>
                Total Withdrawal amount
              </Typography>
              <Typography variant="h3" sx={{ my: 2, fontWeight: 'bold' }}>
                {analytics?.totalWithdrawalAmount || 0} USD
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ArrowUpward sx={{ color: '#4CAF50', fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" sx={{ color: '#666' }}>
                  From today data
                </Typography>
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  top: '3rem',
                  right: 20,
                  transform: 'translateY(-50%)',
                  bgcolor: '#e8eeff',
                  p: 1.5,
                  borderRadius: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Payments sx={{ color: '#536DFE', fontSize: 24 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Employees Card */}
        <Box>
          <Card sx={{ bgcolor: '#e8d7cd', borderRadius: '40px', position: 'relative', height: '11.5rem' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ color: '#666' }}>
                Employees
              </Typography>
              <Typography variant="h3" sx={{ my: 2, fontWeight: 'bold' }}>
                {analytics?.employeeCount || 0}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ArrowUpward sx={{ color: '#4CAF50', fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" sx={{ color: '#666' }}>
                  From today data
                </Typography>
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  top: '3rem',
                  right: 20,
                  transform: 'translateY(-50%)',
                  bgcolor: '#fadad7',
                  p: 1.5,
                  borderRadius: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <People sx={{ color: '#ff6b6b', fontSize: 24 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Liability Card */}
        <Box>
          <Card sx={{ bgcolor: '#fff', borderRadius: '40px', position: 'relative', height: '11.5rem' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ color: '#666' }}>
                Total Liability
              </Typography>
              <Typography variant="h3" sx={{ my: 2, fontWeight: 'bold' }}>
                {analytics?.totalLiability || 0} USD
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ArrowUpward sx={{ color: '#4CAF50', fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" sx={{ color: '#666' }}>
                  From today data
                </Typography>
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  top: '3rem',
                  right: 20,
                  transform: 'translateY(-50%)',
                  bgcolor: '#e8eeff',
                  p: 1.5,
                  borderRadius: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <AccountBalanceWallet sx={{ color: '#536DFE', fontSize: 24 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Chart Section */}
      <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: '40px', mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontSize: { xs: '1rem', md: '1.25rem' } }}>
          Withdrawal amount over time
        </Typography>
        <Box sx={{ height: { xs: 250, md: 200 }, position: 'relative' }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.2} />
                    <stop offset="50%" stopColor="#ffc29d" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#fff8f0" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} tickMargin={10} interval={0} />
                <YAxis axisLine={false} tickLine={false} domain={[0, 'dataMax + 50']} tickFormatter={(value) => (value === 0 ? '0' : `${value}USD`)} tick={{ fontSize: 10, fill: '#888' }} />
                <Tooltip
                  formatter={(value) => [`${value} USD`, 'Withdrawal Amount']}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return payload[0].payload.fullDate;
                    }
                    return label;
                  }}
                  contentStyle={{
                    backgroundColor: '#ff4d4d',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    fontSize: 12,
                    padding: '8px 12px'
                  }}
                  itemStyle={{ color: 'white' }}
                  labelStyle={{ color: 'white' }}
                />
                <Area type="monotone" dataKey="amount" stroke="none" fill="url(#colorAmount)" />
                <Line type="monotone" dataKey="amount" stroke="#ff6b6b" strokeWidth={2} dot={{ r: 3, fill: '#ff6b6b', strokeWidth: 0 }} activeDot={{ r: 5, fill: '#ff6b6b', strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#666'
            }}>
              <Typography variant="body2">
                No withdrawal data available for the selected period
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Dashboard;
