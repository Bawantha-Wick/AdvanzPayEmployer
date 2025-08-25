import React from 'react';
import { Box, Typography } from '@mui/material';
import { IoBarChartOutline } from 'react-icons/io5';

const ReportsComingSoon: React.FC = () => {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}
    >
      <Box
        sx={{
          mb: 3,
          color: '#666'
        }}
      >
        <IoBarChartOutline size={64} />
      </Box>

      <Typography
        variant="h3"
        sx={{
          fontWeight: 600,
          color: '#333',
          mb: 2,
          fontSize: { xs: '2rem', md: '2.5rem' }
        }}
      >
        Coming Soon
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: '#666',
          fontSize: '1.1rem',
          maxWidth: '400px'
        }}
      >
        Reports and analytics features are currently in development
      </Typography>
    </Box>
  );
};

export default ReportsComingSoon;
