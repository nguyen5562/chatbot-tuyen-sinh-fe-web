import React, { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Toast from './Toast';
import { ToastContext } from './toastContext';
import type { ToastType, ToastItem } from './toastContext';

const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now().toString() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const handleClose = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <Box
        sx={{
          position: 'fixed',
          top: 24,
          right: 24,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          alignItems: 'flex-end',
          pointerEvents: 'none'
        }}
      >
        {toasts.map((toast, index) => (
          <Box
            key={toast.id}
            sx={{
              pointerEvents: 'auto',
              animation: 'slideInFromRight 0.4s ease-out',
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'both',
              '@keyframes slideInFromRight': {
                from: {
                  opacity: 0,
                  transform: 'translateX(100px)'
                },
                to: {
                  opacity: 1,
                  transform: 'translateX(0)'
                }
              }
            }}
          >
            <Toast 
              {...toast} 
              onClose={() => handleClose(toast.id)} 
            />
          </Box>
        ))}
      </Box>
    </ToastContext.Provider>
  );
};

export default ToastProvider;