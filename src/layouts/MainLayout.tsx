import React from 'react';
import UserMenu from '../components/Auth/UserMenu';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
// import { isLoggedIn } from '../utils/auth'; // Đã xoá vì không dùng

const MainLayout: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  return (
    <Box sx={{
      height: '100vh',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.default',
      overflow: 'hidden'
    }}>
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
          backdropFilter: 'blur(20px)'
        }}
        elevation={0}
      >
        <Toolbar sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 2,
          minHeight: 72,
          px: 4
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 3
          }}>
            {/* Logo/Icon */}
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              🎓
            </Box>

            {/* Brand Text */}
            <Box>
              <Box sx={{
                fontSize: 32,
                fontWeight: 900,
                letterSpacing: 0.5,
                textShadow: '0 2px 20px rgba(0, 0, 0, 0.3)',
                background: 'linear-gradient(45deg, #ffffff 0%, #e0e7ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                ChatBot MTA
              </Box>
              <Box sx={{
                fontSize: 13,
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.8)',
                letterSpacing: 1.2,
                textTransform: 'uppercase'
              }}>
                AI Assistant • Tuyển sinh
              </Box>
            </Box>
          </Box>

          <UserMenu />
        </Toolbar>
      </AppBar>

      <Box sx={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout; 