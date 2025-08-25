import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import GroupIcon from '@mui/icons-material/Group';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const drawerWidth = 280;

type Props = {
  selectedTab: 'file' | 'user';
  setSelectedTab: (tab: 'file' | 'user') => void;
};

const AdminSidebar: React.FC<Props> = ({ selectedTab, setSelectedTab }) => {
  const menuItems = [
    {
      id: 'file' as const,
      label: 'Quản lý File',
      icon: <InsertDriveFileIcon />,
      description: 'Upload và quản lý tài liệu'
    },
    {
      id: 'user' as const,
      label: 'Quản lý Người dùng',
      icon: <GroupIcon />,
      description: 'Thêm, sửa, xóa người dùng'
    }
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: 'none',
          borderRight: '1px solid rgba(255, 255, 255, 0.2)',
          top: 72,
          height: 'calc(100vh - 72px)',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <Box sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 800,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              mb: 1
            }}
          >
            Bảng điều khiển
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            Quản lý hệ thống
          </Typography>
        </Box>

        <List sx={{ p: 0 }}>
          {menuItems.map((item) => {
            const selected = selectedTab === item.id;
            return (
              <ListItem key={item.id} disablePadding sx={{ mb: 2 }}>
                <ListItemButton
                  selected={selected}
                  onClick={() => setSelectedTab(item.id)}
                  sx={{
                    borderRadius: 3,
                    minHeight: 64,
                    background: selected 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                      : 'transparent',
                    color: selected ? 'white' : 'text.primary',
                    boxShadow: selected ? '0 8px 32px rgba(102, 126, 234, 0.3)' : 'none',
                    transition: 'all 0.3s ease',
                    px: 3,
                    py: 2,
                    '&:hover': { 
                      background: selected 
                        ? 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
                        : 'rgba(102, 126, 234, 0.08)',
                      transform: 'translateX(4px)',
                      boxShadow: selected 
                        ? '0 12px 40px rgba(102, 126, 234, 0.4)'
                        : '0 4px 20px rgba(102, 126, 234, 0.1)'
                    },
                    '&.Mui-selected': { 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    },
                    '&.Mui-selected:hover': { 
                      background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
                    },
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      color: selected ? 'white' : '#667eea',
                      minWidth: 48,
                      '& svg': {
                        fontSize: 24
                      }
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography 
                        sx={{ 
                          color: selected ? 'white' : 'text.primary', 
                          fontWeight: selected ? 700 : 600,
                          fontSize: 16,
                          mb: 0.5
                        }}
                      >
                        {item.label}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="caption"
                        sx={{
                          color: selected ? 'rgba(255,255,255,0.8)' : 'text.secondary',
                          fontSize: 12,
                          fontWeight: 500
                        }}
                      >
                        {item.description}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* Stats or additional info */}
        <Box 
          sx={{ 
            mt: 6, 
            p: 3, 
            borderRadius: 3,
            background: 'rgba(102, 126, 234, 0.05)',
            border: '1px solid rgba(102, 126, 234, 0.1)'
          }}
        >
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontWeight: 700,
              color: '#667eea',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <span>📊</span> Thống kê
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hệ thống đang hoạt động bình thường
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default AdminSidebar; 