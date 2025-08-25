import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { BsClock } from 'react-icons/bs';
import { IoRocketOutline } from 'react-icons/io5';

const ReportsComingSoon: React.FC = () => {
  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: '#fcf9f1',
        borderRadius: 2,
        p: 3,
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%',
          borderRadius: 3,
          bgcolor: '#ffffff',
          border: '1px solid #f0f0f0'
        }}
      >
        {/* Icon */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'rgba(255, 107, 0, 0.1)',
            mb: 3
          }}
        >
          <IoRocketOutline size={36} color="#ff6b00" />
        </Box>

        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: '#333',
            mb: 2,
            fontSize: '1.75rem'
          }}
        >
          {/* Reports */}
        </Typography>

        {/* Status Badge */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: 'rgba(255, 107, 0, 0.1)',
            px: 2,
            py: 0.5,
            borderRadius: 2,
            mb: 3
          }}
        >
          <BsClock size={14} color="#ff6b00" />
          <Typography
            variant="caption"
            sx={{
              color: '#ff6b00',
              fontWeight: 600,
              fontSize: '0.8rem'
            }}
          >
            Coming Soon
          </Typography>
        </Box>

        <Typography
          variant="body1"
          sx={{
            color: '#666',
            mb: 4,
            lineHeight: 1.6
          }}
        >
          We're building advanced reporting features with powerful analytics and insights. Stay tuned for enhanced data visualization and export capabilities.
        </Typography>
      </Paper>
    </Box>
  );
};

export default ReportsComingSoon;
