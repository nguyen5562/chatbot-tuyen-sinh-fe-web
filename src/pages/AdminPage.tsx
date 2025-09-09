import React, { useState } from 'react';
import FileManager from '../components/Admin/FileManager';
import UserManager from '../components/Admin/UserManager';
import AdminSidebar from '../components/Sidebar/AdminSidebar';
import Box from '@mui/material/Box';

const AdminPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'file' | 'user'>('file');

  return (
    <Box sx={{ display: 'flex', width: '100%', height: '100%', minHeight: 'calc(100vh - 72px)' }}>
      <AdminSidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      
      <Box sx={{ 
        flex: 1,
        background: 'transparent',
        overflow: 'auto',
        height: '100%'
      }}>
        {selectedTab === 'file' && <FileManager />}
        {selectedTab === 'user' && <UserManager />}
      </Box>
    </Box>
  );
};

export default AdminPage;