import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { type AlertColor } from '@mui/material/Alert';

interface ToastProps {
  message: string;
  type: AlertColor;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  return (
    <Snackbar
      open={true}
      autoHideDuration={2500}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <MuiAlert onClose={onClose} severity={type} elevation={6} variant="filled" sx={{ minWidth: 220, maxWidth: 360, fontSize: 16, alignItems: 'center' }}>
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

export default Toast; 