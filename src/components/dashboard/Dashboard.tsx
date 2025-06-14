import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Paper } from '@mui/material';
import { ArrowUpward, Inventory, Payments, People, AccountBalanceWallet } from '@mui/icons-material';
import dayjs from 'dayjs';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Area } from 'recharts';
import { BsCalendar3 } from 'react-icons/bs';
import { IoChevronDown } from 'react-icons/io5';

const Dashboard: React.FC = () => {
  const [dateRange] = useState({
    start: dayjs('2025-06-07'),
    end: dayjs('2025-06-13')
  });

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
        >
          <BsCalendar3 size={20} color="#767676" style={{ marginRight: '8px' }} />
          <Typography variant="body2" sx={{ color: '#606060', fontWeight: 500 }}>
            {dateRange.start.format('MMM DD, YYYY')} {'->'} {dateRange.end.format('MMM DD, YYYY')}
          </Typography>
          <IoChevronDown size={20} color="#767676" style={{ marginLeft: '8px' }} />
        </Box>
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
