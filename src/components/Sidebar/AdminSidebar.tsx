import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import GroupIcon from '@mui/icons-material/Group';

const drawerWidth = 260;

type Props = {
  selectedTab: 'file' | 'user';
  setSelectedTab: (tab: 'file' | 'user') => void;
};

const AdminSidebar: React.FC<Props> = ({ selectedTab, setSelectedTab }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: 'linear-gradient(to bottom, #1a237e, #1976d2)',
          color: 'white',
          borderRight: 0,
          top: 64,
          height: 'calc(100% - 64px)',
        },
      }}
    >
      <List sx={{ mt: 4 }}>
        <ListItem disablePadding>
          <ListItemButton
            selected={selectedTab === 'file'}
            onClick={() => setSelectedTab('file')}
            sx={{ borderRadius: 2, mb: 1 }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              <InsertDriveFileIcon />
            </ListItemIcon>
            <ListItemText primary="Quản lý file" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            selected={selectedTab === 'user'}
            onClick={() => setSelectedTab('user')}
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary="Quản lý người dùng" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default AdminSidebar; 