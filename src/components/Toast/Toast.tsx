import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';
import type { AlertColor } from '@mui/material/Alert';

interface ToastProps {
  message: string;
  type: AlertColor;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const getTypeConfig = (type: AlertColor) => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircleIcon sx={{ fontSize: 24 }} />,
          color: '#4CAF50',
          bg: 'rgba(76, 175, 80, 0.1)',
          border: 'rgba(76, 175, 80, 0.3)'
        };
      case 'error':
        return {
          icon: <ErrorIcon sx={{ fontSize: 24 }} />,
          color: '#F44336',
          bg: 'rgba(244, 67, 54, 0.1)',
          border: 'rgba(244, 67, 54, 0.3)'
        };
      case 'warning':
        return {
          icon: <WarningIcon sx={{ fontSize: 24 }} />,
          color: '#FF9800',
          bg: 'rgba(255, 152, 0, 0.1)',
          border: 'rgba(255, 152, 0, 0.3)'
        };
      case 'info':
      default:
        return {
          icon: <InfoIcon sx={{ fontSize: 24 }} />,
          color: '#2196F3',
          bg: 'rgba(33, 150, 243, 0.1)',
          border: 'rgba(33, 150, 243, 0.3)'
        };
    }
  };

  const config = getTypeConfig(type);

  return (
    <Paper
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2.5,
        pr: 1,
        borderRadius: 4,
        minWidth: 320,
        maxWidth: 480,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${config.border}`,
        boxShadow: `0 12px 40px ${config.bg.replace('0.1', '0.3')}`,
        position: 'relative',
        overflow: 'hidden',
        animation: 'slideInFromRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: config.color
        },
        '@keyframes slideInFromRight': {
          from: {
            opacity: 0,
            transform: 'translateX(100px) scale(0.95)'
          },
          to: {
            opacity: 1,
            transform: 'translateX(0) scale(1)'
          }
        }
      }}
      elevation={0}
    >
      {/* Icon */}
      <Box
        sx={{
          color: config.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        {config.icon}
      </Box>

      {/* Message */}
      <Typography
        variant="body1"
        sx={{
          flex: 1,
          fontWeight: 600,
          fontSize: 15,
          lineHeight: 1.4,
          color: 'text.primary'
        }}
      >
        {message}
      </Typography>

      {/* Close Button */}
      <IconButton
        onClick={onClose}
        size="small"
        sx={{
          color: 'text.secondary',
          ml: 1,
          transition: 'all 0.3s ease',
          '&:hover': {
            color: 'text.primary',
            background: 'rgba(0, 0, 0, 0.05)',
            transform: 'scale(1.1)'
          }
        }}
      >
        <CloseIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Paper>
  );
};

export default Toast;