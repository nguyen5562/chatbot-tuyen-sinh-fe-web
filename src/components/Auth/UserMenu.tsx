import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../Toast/toastContext';
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Button from "@mui/material/Button";

interface UserMenuProps {
  onLogout?: () => void;
  isAdminPage?: boolean;
}

const UserMenu: React.FC<UserMenuProps> = ({ onLogout, isAdminPage }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const loggedIn = useAuthStore((state) => state.loggedIn);
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);
  const logout = useAuthStore((state) => state.logout);
  const { showToast } = useToast();
  const username = user || "User";
  const roleIsAdmin = role === 'admin';

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    showToast("Đăng xuất thành công!", "success");
    if (onLogout) onLogout();
    navigate("/");
    handleClose();
  };

  // Admin page user menu
  if (isAdminPage) {
    return (
      <>
        <Tooltip 
          title={
            <Box sx={{ p: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#2d3748' }}>
                {username}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9, color: '#718096' }}>
                Quản trị viên
              </Typography>
            </Box>
          } 
          arrow
        >
          <IconButton
            onClick={handleMenu}
            size="large"
            sx={{ 
              color: "#2d3748", 
              p: 0,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
              }
            }}
          >
            <Avatar sx={{ 
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%)', 
              width: 48, 
              height: 48,
              border: '2px solid rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)'
            }}>
              <AdminPanelSettingsIcon sx={{ color: 'white', fontSize: 24 }} />
            </Avatar>
          </IconButton>
        </Tooltip>
        
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: { 
              borderRadius: 3, 
              minWidth: 220, 
              mt: 2,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
            },
          }}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem 
            onClick={() => navigate("/")}
            sx={{
              py: 2,
              borderRadius: 2,
              mx: 1,
              mb: 1,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(102, 126, 234, 0.1)',
                transform: 'translateX(4px)'
              }
            }}
          >
            <ListItemIcon>
              <HomeIcon sx={{ color: '#667eea' }} />
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontWeight: 600, fontSize: 15 }}>
                Về trang chủ
              </Typography>
            </ListItemText>
          </MenuItem>
          
          <Divider sx={{ mx: 2, opacity: 0.3 }} />
          
          <MenuItem 
            onClick={handleLogout}
            sx={{
              py: 2,
              borderRadius: 2,
              mx: 1,
              mt: 1,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(244, 67, 54, 0.1)',
                transform: 'translateX(4px)'
              }
            }}
          >
            <ListItemIcon>
              <LogoutIcon sx={{ color: '#f44336' }} />
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontWeight: 600, fontSize: 15 }}>
                Đăng xuất
              </Typography>
            </ListItemText>
          </MenuItem>
        </Menu>
      </>
    );
  }

  // Login button for non-logged in users
  if (!loggedIn) {
    return (
      <Button
        variant="outlined"
        color="inherit"
        startIcon={<LoginIcon />}
        onClick={() => navigate("/login")}
        sx={{ 
          borderRadius: 4, 
          fontWeight: 700, 
          fontSize: 16,
          px: 3,
          py: 1.5,
          border: '2px solid #667eea',
          color: '#667eea',
          background: 'rgba(102, 126, 234, 0.05)',
          transition: 'all 0.3s ease',
          '&:hover': {
            border: '2px solid #5a67d8',
            background: 'rgba(102, 126, 234, 0.1)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)'
          }
        }}
      >
        Đăng nhập
      </Button>
    );
  }

  // Regular user menu
  return (
    <>
      <Tooltip 
        title={
          <Box sx={{ p: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#2d3748' }}>
              {username}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9, color: '#718096' }}>
              {roleIsAdmin ? 'Quản trị viên' : 'Người dùng'}
            </Typography>
          </Box>
        } 
        arrow
      >
        <IconButton
          onClick={handleMenu}
          size="large"
          sx={{ 
            color: "#2d3748", 
            p: 0,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1)',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
            }
          }}
        >
          <Avatar sx={{ 
            background: roleIsAdmin ? 'linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            width: 48, 
            height: 48,
            color: 'white',
            fontWeight: 800,
            fontSize: 18,
            border: '2px solid rgba(255, 255, 255, 0.3)',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
          }}>
            {roleIsAdmin ? (
              <AdminPanelSettingsIcon sx={{ fontSize: 24 }} />
            ) : (
              username[0]?.toUpperCase() || 'U'
            )}
          </Avatar>
        </IconButton>
      </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: { 
            borderRadius: 3, 
            minWidth: 220, 
            mt: 2,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
          },
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {roleIsAdmin && (
          <>
            <MenuItem 
              onClick={() => navigate("/admin")}
              sx={{
                py: 2,
                borderRadius: 2,
                mx: 1,
                mb: 1,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(102, 126, 234, 0.1)',
                  transform: 'translateX(4px)'
                }
              }}
            >
              <ListItemIcon>
                <AdminPanelSettingsIcon sx={{ color: '#667eea' }} />
              </ListItemIcon>
              <ListItemText>
                <Typography sx={{ fontWeight: 600, fontSize: 15 }}>
                  Đi đến trang quản trị
                </Typography>
              </ListItemText>
            </MenuItem>
            <Divider sx={{ mx: 2, opacity: 0.3 }} />
          </>
        )}
        
        <MenuItem 
          onClick={handleLogout}
          sx={{
            py: 2,
            borderRadius: 2,
            mx: 1,
            mt: roleIsAdmin ? 1 : 0,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(244, 67, 54, 0.1)',
              transform: 'translateX(4px)'
            }
          }}
        >
          <ListItemIcon>
            <LogoutIcon sx={{ color: '#f44336' }} />
          </ListItemIcon>
          <ListItemText>
            <Typography sx={{ fontWeight: 600, fontSize: 15 }}>
              Đăng xuất
            </Typography>
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;