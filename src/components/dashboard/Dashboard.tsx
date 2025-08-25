import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Paper, Alert } from '@mui/material';
import { ArrowUpward, Inventory, Payments, People, AccountBalanceWallet } from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';

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

  const [dateRange, setDateRange] = useState(() => validateDateRange(startDate, endDate));

  // Format dates for API call (YYYY-MM-DD format)
  const fromDate = dateRange.start.format('YYYY-MM-DD');
  const toDate = dateRange.end.format('YYYY-MM-DD');

  // Fetch dashboard analytics with date range
  const { data: analytics, isLoading, error } = useDashboardAnalytics(corpId, fromDate, toDate);
  // Date picker state
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Dayjs>(dateRange.start);
  const [tempEndDate, setTempEndDate] = useState<Dayjs>(dateRange.end);
  const [currentView, setCurrentView] = useState<Dayjs>(dateRange.start);
  const [selectionMode, setSelectionMode] = useState<'start' | 'end'>('start');

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
    setDateRange(validateDateRange(tempStartDate, tempEndDate));
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
        <Box sx={{ position: 'relative' }}>
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

      {/* Stat Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: '1fr 1fr',
            lg: 'repeat(4, 1fr)'
          },
          gap: 3,
          mb: 4
        }}
      >
        {/* Withdrawal Requests Card */}
        <Box>
          <Card sx={{ bgcolor: '#e8d7cd', borderRadius: '40px', position: 'relative', height: '9rem' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ color: '#666' }}>
                Withdrawal requests
              </Typography>
              <Typography variant="h3" sx={{ my: 2, fontWeight: 'bold' }}>
                {analytics?.withdrawalRequestCount || 0}
              </Typography>
              {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ArrowUpward sx={{ color: '#4CAF50', fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" sx={{ color: '#666' }}>
                  From today data
                </Typography>
              </Box> */}
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
          <Card sx={{ bgcolor: '#fff', borderRadius: '40px', position: 'relative', height: '9rem' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ color: '#666' }}>
                Total Withdrawal amount
              </Typography>
              <Typography variant="h3" sx={{ my: 2, fontWeight: 'bold' }}>
                {analytics?.totalWithdrawalAmount || 0} USD
              </Typography>
              {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ArrowUpward sx={{ color: '#4CAF50', fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" sx={{ color: '#666' }}>
                  From today data
                </Typography>
              </Box> */}
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
          <Card sx={{ bgcolor: '#e8d7cd', borderRadius: '40px', position: 'relative', height: '9rem' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ color: '#666' }}>
                Employees
              </Typography>
              <Typography variant="h3" sx={{ my: 2, fontWeight: 'bold' }}>
                {analytics?.employeeCount || 0}
              </Typography>
              {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ArrowUpward sx={{ color: '#4CAF50', fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" sx={{ color: '#666' }}>
                  From today data
                </Typography>
              </Box> */}
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
          <Card sx={{ bgcolor: '#fff', borderRadius: '40px', position: 'relative', height: '9rem' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ color: '#666' }}>
                Total Liability
              </Typography>
              <Typography variant="h3" sx={{ my: 2, fontWeight: 'bold' }}>
                {analytics?.totalLiability || 0} USD
              </Typography>
              {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ArrowUpward sx={{ color: '#4CAF50', fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" sx={{ color: '#666' }}>
                  From today data
                </Typography>
              </Box> */}
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
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: '#666'
              }}
            >
              <Typography variant="body2">No withdrawal data available for the selected period</Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Dashboard;
