import { createContext, useContext } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';
export type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
};

export type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

export const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext); 