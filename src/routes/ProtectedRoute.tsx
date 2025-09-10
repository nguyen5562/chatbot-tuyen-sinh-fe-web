import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const role = useAuthStore((state) => state.role);
  const isAdmin = role === 'admin';
  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;