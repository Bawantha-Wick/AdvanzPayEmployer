import React from 'react';
import { Alert, Box, Button, Typography } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

interface ErrorDisplayProps {
  error: Error | string;
  onRetry?: () => void;
  title?: string;
  variant?: 'alert' | 'page';
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry, title = 'Error', variant = 'alert' }) => {
  const errorMessage = typeof error === 'string' ? error : error.message || 'An unexpected error occurred';

  if (variant === 'page') {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={8} px={4} textAlign="center">
        <ErrorOutline sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
          {errorMessage}
        </Typography>
        {onRetry && (
          <Button variant="contained" onClick={onRetry}>
            Try Again
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Alert
        severity="error"
        action={
          onRetry && (
            <Button color="inherit" size="small" onClick={onRetry}>
              Retry
            </Button>
          )
        }
      >
        <strong>{title}:</strong> {errorMessage}
      </Alert>
    </Box>
  );
};
