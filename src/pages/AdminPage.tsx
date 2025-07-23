import React, { useState } from 'react';
import FileManager from '../components/Admin/FileManager';
import UserManager from '../components/Admin/UserManager';
import AdminSidebar from '../components/Sidebar/AdminSidebar';

const AdminPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'file' | 'user'>('file');

  return (
    <div className="flex w-full h-full">
      <AdminSidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <div className="flex-1 pt-6 pl-6">
        {selectedTab === 'file' && <FileManager />}
        {selectedTab === 'user' && <UserManager />}
      </div>
    </div>
  );
};

export default AdminPage; 