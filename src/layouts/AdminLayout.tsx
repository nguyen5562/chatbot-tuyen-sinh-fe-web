import React from 'react';
import UserMenu from '../components/Auth/UserMenu';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <AppBar 
        position="static" 
        sx={{ 
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: 'none',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
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
            {/* Admin Icon */}
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
              ⚙️
            </Box>
            
            {/* Brand Text */}
            <Box>
              <Box sx={{ 
                fontSize: 32, 
                fontWeight: 900, 
                letterSpacing: 0.5, 
                color: 'white',
                textShadow: '0 2px 20px rgba(0, 0, 0, 0.3)',
              }}>
                Admin Panel
              </Box>
              <Box sx={{ 
                fontSize: 13, 
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.8)',
                letterSpacing: 1.2,
                textTransform: 'uppercase'
              }}>
                ChatBot MTA • Management
              </Box>
            </Box>
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