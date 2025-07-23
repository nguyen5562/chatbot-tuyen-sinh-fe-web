import React from 'react';
import UserMenu from '../components/Auth/UserMenu';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

const ADMIN_HEADER_BG = 'linear-gradient(90deg, #283593 0%, #1976d2 100%)'; // xanh tím đậm ngang

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <AppBar position="static" sx={{ background: ADMIN_HEADER_BG }} elevation={4}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: 1, textShadow: '0 2px 8px #0002' }}>Admin Panel</span>
          </Box>
          <UserMenu isAdminPage />
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout; 