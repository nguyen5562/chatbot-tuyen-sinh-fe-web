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
      background: '#f7fafc',
    }}>
      <AppBar 
        position="static" 
        sx={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: 'none',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
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
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              overflow: 'hidden'
            }}>
              <img 
                src="/Logo_MTA_new.png" 
                alt="MTA Logo" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain' 
                }} 
              />
            </Box>
            
            {/* Brand Text */}
            <Box>
              <Box sx={{ 
                fontSize: 32, 
                fontWeight: 900, 
                letterSpacing: 0.5, 
                color: '#2d3748',
              }}>
                Admin Panel
              </Box>
              <Box sx={{ 
                fontSize: 13, 
                fontWeight: 600,
                color: '#718096',
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