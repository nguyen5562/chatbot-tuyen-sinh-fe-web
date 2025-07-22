import React from 'react';
import UserMenu from '../components/Auth/UserMenu';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen h-screen flex flex-col bg-gradient-to-br from-gray-100 to-blue-100">
      <header className="h-16 bg-gradient-to-r from-blue-900 to-blue-700 text-white flex items-center justify-between px-8 shadow-lg gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-extrabold tracking-wide drop-shadow">Admin Panel</span>
        </div>
        <UserMenu isAdminPage />
      </header>
      <div className="flex flex-1 min-h-0 h-0">
        <main className="flex-1 p-0 md:p-6 w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 