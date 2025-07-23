import React, { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
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
    }, 2500);
  }, []);

  const handleClose = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 items-end">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={() => handleClose(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider; 