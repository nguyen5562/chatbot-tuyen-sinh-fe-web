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
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Button from "@mui/material/Button";
import { isAdmin } from '../../utils/localStorage';

interface UserMenuProps {
  onLogout?: () => void;
  isAdminPage?: boolean;
}

const UserMenu: React.FC<UserMenuProps> = ({ onLogout, isAdminPage }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const username = localStorage.getItem("user") || "User";
  const loggedIn = useAuthStore((state) => state.loggedIn);
  const logout = useAuthStore((state) => state.logout);
  const { showToast } = useToast();
  const roleIsAdmin = isAdmin();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    logout();
    showToast("Đăng xuất thành công!", "info");
    if (onLogout) onLogout();
    navigate("/");
    handleClose();
  };

  if (isAdminPage) {
    return (
      <>
        <Tooltip title={username} arrow>
          <IconButton
            onClick={handleMenu}
            size="large"
            sx={{ color: "white", p: 0 }}
          >
            <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
              <AdminPanelSettingsIcon />
            </Avatar>
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 4,
            sx: { borderRadius: 3, minWidth: 200, mt: 1 },
          }}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={() => navigate("/")}>
            <ListItemIcon>
              <HomeIcon color="primary" />
            </ListItemIcon>
            <ListItemText>Go to home page</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon color="error" />
            </ListItemIcon>
            <ListItemText>Đăng xuất</ListItemText>
          </MenuItem>
        </Menu>
      </>
    );
  }

  if (!loggedIn) {
    return (
      <Button
        variant="outlined"
        color="inherit"
        startIcon={<LoginIcon />}
        onClick={() => navigate("/login")}
        sx={{ borderRadius: 8, fontWeight: 600, fontSize: 16 }}
      >
        Đăng nhập
      </Button>
    );
  }

  return (
    <>
      <Tooltip title={username} arrow>
        <IconButton
          onClick={handleMenu}
          size="large"
          sx={{ color: "white", p: 0 }}
        >
          <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
            {username[0].toUpperCase()}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 4,
          sx: { borderRadius: 3, minWidth: 200, mt: 1 },
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {roleIsAdmin && (
          <>
            <MenuItem onClick={() => navigate("/admin")}> 
              <ListItemIcon>
                <AdminPanelSettingsIcon color="primary" />
              </ListItemIcon>
              <ListItemText>Admin</ListItemText>
            </MenuItem>
            <Divider />
          </>
        )}
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon color="error" />
          </ListItemIcon>
          <ListItemText>Đăng xuất</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
