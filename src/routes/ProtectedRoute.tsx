import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAdmin = typeof window !== 'undefined' && localStorage.getItem('role') === 'admin';
  if (!isAdmin) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default ProtectedRoute; 