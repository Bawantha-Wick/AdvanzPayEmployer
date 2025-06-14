import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Paper, Popover } from '@mui/material';
import { ArrowUpward, Inventory, Payments, People, AccountBalanceWallet } from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Area } from 'recharts';
import { BsCalendar3 } from 'react-icons/bs';
import { IoChevronDown } from 'react-icons/io5';

const Dashboard: React.FC = () => {
  // Use the current date as default
  const currentDate = dayjs();
  // Make sure we have fresh instances of dayjs objects
  const startDate = currentDate.subtract(30, 'day');
  const endDate = currentDate;

  const [dateRange, setDateRange] = useState({
    start: startDate,
    end: endDate
  });
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

  // Chart data to match the screenshot
  const chartData = [
    { month: 'Jan', amount: 15, year: '2022' },
    { month: 'Feb', amount: 70, year: '2022' },
    { month: 'Mar', amount: 150, year: '2022' },
    { month: 'Apr', amount: 100, year: '2022' },
    { month: 'May', amount: 180, year: '2022' },
    { month: 'Jun', amount: 120, year: '2022' },
    { month: 'Jul', amount: 160, year: '2022' },
    { month: 'Aug', amount: 350, year: '2022' }, // Peak value
    { month: 'Sep', amount: 100, year: '2022' },
    { month: 'Oct', amount: 180, year: '2022' },
    { month: 'Nov', amount: 140, year: '2022' },
    { month: 'Dec', amount: 210, year: '2022' },
    { month: 'Jan', amount: 50, year: '2022' },
    { month: 'Feb', amount: 90, year: '2022' },
    { month: 'Mar', amount: 170, year: '2022' },
    { month: 'Apr', amount: 270, year: '2022' },
    { month: 'May', amount: 220, year: '2022' },
    { month: 'Jun', amount: 240, year: '2022' },
    { month: 'Jul', amount: 190, year: '2022' },
    { month: 'Aug', amount: 180, year: '2022' },
    { month: 'Sep', amount: 130, year: '2022' },
    { month: 'Oct', amount: 200, year: '2022' },
    { month: 'Nov', amount: 180, year: '2022' },
    { month: 'Dec', amount: 190, year: '2022' }
  ];

  return (
    <Box sx={{ p: 3, bgcolor: '#faf7f2' }}>
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

      {/* Stat Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        {/* Advance Requests Card */}
        <Box sx={{ flex: '1 1 calc(25% - 24px)', minWidth: '8rem' }}>
          <Card sx={{ bgcolor: '#e8d7cd', borderRadius: '40px', position: 'relative', height: '11.5rem' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ color: '#666' }}>
                Advance requests
              </Typography>
              <Typography variant="h3" sx={{ my: 2, fontWeight: 'bold' }}>
                40
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

        {/* Total Advance Amount Card */}
        <Box sx={{ flex: '1 1 calc(25% - 24px)', minWidth: '8rem' }}>
          <Card sx={{ bgcolor: '#fff', borderRadius: '40px', position: 'relative', height: '11.5rem' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ color: '#666' }}>
                Total Advance amount
              </Typography>
              <Typography variant="h3" sx={{ my: 2, fontWeight: 'bold' }}>
                1000 USD
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
        <Box sx={{ flex: '1 1 calc(25% - 24px)', minWidth: '8rem' }}>
          <Card sx={{ bgcolor: '#e8d7cd', borderRadius: '40px', position: 'relative', height: '11.5rem' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ color: '#666' }}>
                Employees
              </Typography>
              <Typography variant="h3" sx={{ my: 2, fontWeight: 'bold' }}>
                40
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
        <Box sx={{ flex: '1 1 calc(25% - 24px)', minWidth: '8rem' }}>
          <Card sx={{ bgcolor: '#fff', borderRadius: '40px', position: 'relative', height: '11.5rem' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ color: '#666' }}>
                Liability
              </Typography>
              <Typography variant="h3" sx={{ my: 2, fontWeight: 'bold' }}>
                0
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
      <Paper sx={{ p: 3, borderRadius: '40px', mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Advance amount over time
        </Typography>
        <Box sx={{ height: 300, position: 'relative' }}>
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
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} tickMargin={10} interval={0} />
              <YAxis axisLine={false} tickLine={false} domain={[0, 400]} ticks={[0, 100, 200, 300, 400]} tickFormatter={(value) => (value === 0 ? '0' : `${value}USD`)} tick={{ fontSize: 10, fill: '#888' }} />
              <Tooltip
                formatter={(value) => [`${value} USD`]}
                labelFormatter={() => ''}
                contentStyle={{
                  backgroundColor: '#ff4d4d',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  fontSize: 12,
                  padding: '2px 8px'
                }}
                itemStyle={{ color: 'white' }}
                labelStyle={{ color: 'white' }}
              />
              <Area type="monotone" dataKey="amount" stroke="none" fill="url(#colorAmount)" />
              <Line type="monotone" dataKey="amount" stroke="#ff6b6b" strokeWidth={2} dot={{ r: 3, fill: '#ff6b6b', strokeWidth: 0 }} activeDot={{ r: 5, fill: '#ff6b6b', strokeWidth: 0 }} />

              {/* Custom peak value label */}
              <text
                x="28%"
                y="105"
                textAnchor="middle"
                fill="white"
                style={{
                  fontSize: '12px',
                  fontWeight: 'normal'
                }}
              >
                <tspan x="28%" dy="0" dx="5">
                  350 USD
                </tspan>
              </text>
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
};

export default Dashboard;
