import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#1a1a1a'
      }}
    >
      <CircularProgress 
        sx={{ 
          color: '#FFD700',
          mb: 2 
        }} 
        size={60}
      />
      <Typography 
        variant="h6" 
        sx={{ 
          color: '#FFD700',
          fontWeight: 'bold'
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default Loading;
