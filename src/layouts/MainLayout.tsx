import React from 'react';
import UserMenu from '../components/Auth/UserMenu';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
// import { isLoggedIn } from '../utils/auth'; // Đã xoá vì không dùng

const MainLayout: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <AppBar position="static" sx={{ background: 'linear-gradient(to right, #1976d2, #42a5f5)' }} elevation={4}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: 1, textShadow: '0 2px 8px #0002' }}>ChatBot MTA</span>
          </Box>
          <UserMenu />
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Không còn sidebar ChatHistory ở đây nữa */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout; 