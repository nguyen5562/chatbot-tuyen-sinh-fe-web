import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../Toast/toastContext';
import { userApi } from '../../utils/apis/userApi';
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";

interface UserMenuProps {
  onLogout?: () => void;
  isAdminPage?: boolean;
}

const UserMenu: React.FC<UserMenuProps> = ({ onLogout, isAdminPage }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [updateProfileOpen, setUpdateProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [fullname, setFullname] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const loggedIn = useAuthStore((state) => state.loggedIn);
  const user = useAuthStore((state) => state.user);
  const userId = useAuthStore((state) => state.userId);
  const role = useAuthStore((state) => state.role);
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);
  const { showToast } = useToast();

  const username = user || "User";
  const roleIsAdmin = role === 'admin';

  // Khởi tạo fullname từ authStore
  useEffect(() => {
    if (user) {
      setFullname(user);
    }
  }, [user]);

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

  const handleUpdateProfile = async () => {
    if (!fullname.trim()) {
      showToast("Vui lòng nhập họ và tên!", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await userApi.updateUser(userId || '', { fullname: fullname.trim() });
      if (response.statusCode === 200) {
        // Cập nhật authStore với tên mới
        updateUser(fullname.trim());
        showToast("Cập nhật thông tin thành công!", "success");
        setUpdateProfileOpen(false);
      } else {
        showToast(response.message || "Có lỗi xảy ra!", "error");
      }
    } catch {
      showToast("Có lỗi xảy ra khi cập nhật thông tin!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      showToast("Vui lòng điền đầy đủ thông tin!", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Mật khẩu mới và xác nhận mật khẩu không khớp!", "error");
      return;
    }

    if (newPassword.length < 6) {
      showToast("Mật khẩu mới phải có ít nhất 6 ký tự!", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await userApi.changePassword(userId || '', oldPassword, newPassword);
      if (response.statusCode === 200) {
        showToast("Đổi mật khẩu thành công!", "success");
        setChangePasswordOpen(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showToast(response.message || "Có lỗi xảy ra!", "error");
      }
    } catch {
      showToast("Có lỗi xảy ra khi đổi mật khẩu!", "error");
    } finally {
      setLoading(false);
    }
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

          <MenuItem 
            onClick={() => setUpdateProfileOpen(true)}
            sx={{
              py: 2,
              borderRadius: 2,
              mx: 1,
              mb: 1,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(76, 175, 80, 0.1)',
                transform: 'translateX(4px)'
              }
            }}
          >
            <ListItemIcon>
              <PersonIcon sx={{ color: '#4caf50' }} />
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontWeight: 600, fontSize: 15 }}>
                Cập nhật thông tin
              </Typography>
            </ListItemText>
          </MenuItem>

          <MenuItem 
            onClick={() => setChangePasswordOpen(true)}
            sx={{
              py: 2,
              borderRadius: 2,
              mx: 1,
              mb: 1,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(255, 152, 0, 0.1)',
                transform: 'translateX(4px)'
              }
            }}
          >
            <ListItemIcon>
              <LockIcon sx={{ color: '#ff9800' }} />
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontWeight: 600, fontSize: 15 }}>
                Đổi mật khẩu
              </Typography>
            </ListItemText>
          </MenuItem>
          
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

        {/* Update Profile Dialog */}
        <Dialog 
          open={updateProfileOpen} 
          onClose={() => setUpdateProfileOpen(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
            }
          }}
        >
          <DialogTitle sx={{ 
            textAlign: 'center', 
            fontWeight: 700, 
            fontSize: 20,
            color: '#2d3748',
            pb: 1
          }}>
            Cập nhật thông tin cá nhân
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Họ và tên"
              fullWidth
              variant="outlined"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              sx={{
                mt: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button 
              onClick={() => setUpdateProfileOpen(false)}
              sx={{ 
                borderRadius: 2,
                fontWeight: 600,
                px: 3
              }}
            >
              Hủy
            </Button>
            <Button 
              onClick={handleUpdateProfile}
              variant="contained"
              disabled={loading}
              sx={{ 
                borderRadius: 2,
                fontWeight: 600,
                px: 3,
                background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)',
                }
              }}
            >
              {loading ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Change Password Dialog */}
        <Dialog 
          open={changePasswordOpen} 
          onClose={() => setChangePasswordOpen(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
            }
          }}
        >
          <DialogTitle sx={{ 
            textAlign: 'center', 
            fontWeight: 700, 
            fontSize: 20,
            color: '#2d3748',
            pb: 1
          }}>
            Đổi mật khẩu
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Mật khẩu hiện tại"
              type="password"
              fullWidth
              variant="outlined"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              sx={{
                mt: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            <TextField
              margin="dense"
              label="Mật khẩu mới"
              type="password"
              fullWidth
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{
                mt: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            <TextField
              margin="dense"
              label="Xác nhận mật khẩu mới"
              type="password"
              fullWidth
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{
                mt: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button 
              onClick={() => setChangePasswordOpen(false)}
              sx={{ 
                borderRadius: 2,
                fontWeight: 600,
                px: 3
              }}
            >
              Hủy
            </Button>
            <Button 
              onClick={handleChangePassword}
              variant="contained"
              disabled={loading}
              sx={{ 
                borderRadius: 2,
                fontWeight: 600,
                px: 3,
                background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)',
                }
              }}
            >
              {loading ? 'Đang đổi...' : 'Đổi mật khẩu'}
            </Button>
          </DialogActions>
        </Dialog>
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
          </>
        )}

        <MenuItem 
          onClick={() => setUpdateProfileOpen(true)}
          sx={{
            py: 2,
            borderRadius: 2,
            mx: 1,
            mb: 1,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(76, 175, 80, 0.1)',
              transform: 'translateX(4px)'
            }
          }}
        >
          <ListItemIcon>
            <PersonIcon sx={{ color: '#4caf50' }} />
          </ListItemIcon>
          <ListItemText>
            <Typography sx={{ fontWeight: 600, fontSize: 15 }}>
              Cập nhật thông tin
            </Typography>
          </ListItemText>
        </MenuItem>

        <MenuItem 
          onClick={() => setChangePasswordOpen(true)}
          sx={{
            py: 2,
            borderRadius: 2,
            mx: 1,
            mb: 1,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(255, 152, 0, 0.1)',
              transform: 'translateX(4px)'
            }
          }}
        >
          <ListItemIcon>
            <LockIcon sx={{ color: '#ff9800' }} />
          </ListItemIcon>
          <ListItemText>
            <Typography sx={{ fontWeight: 600, fontSize: 15 }}>
              Đổi mật khẩu
            </Typography>
          </ListItemText>
        </MenuItem>
        
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

      {/* Update Profile Dialog */}
      <Dialog 
        open={updateProfileOpen} 
        onClose={() => setUpdateProfileOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center', 
          fontWeight: 700, 
          fontSize: 20,
          color: '#2d3748',
          pb: 1
        }}>
          Cập nhật thông tin cá nhân
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Họ và tên"
            fullWidth
            variant="outlined"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            sx={{
              mt: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setUpdateProfileOpen(false)}
            sx={{ 
              borderRadius: 2,
              fontWeight: 600,
              px: 3
            }}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleUpdateProfile}
            variant="contained"
            disabled={loading}
            sx={{ 
              borderRadius: 2,
              fontWeight: 600,
              px: 3,
              background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)',
              }
            }}
          >
            {loading ? 'Đang cập nhật...' : 'Cập nhật'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog 
        open={changePasswordOpen} 
        onClose={() => setChangePasswordOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center', 
          fontWeight: 700, 
          fontSize: 20,
          color: '#2d3748',
          pb: 1
        }}>
          Đổi mật khẩu
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Mật khẩu hiện tại *"
            type="password"
            fullWidth
            variant="outlined"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            sx={{
              mt: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          <TextField
            margin="dense"
            label="Mật khẩu mới *"
            type="password"
            fullWidth
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{
              mt: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          <TextField
            margin="dense"
            label="Xác nhận mật khẩu mới *"
            type="password"
            fullWidth
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{
              mt: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setChangePasswordOpen(false)}
            sx={{ 
              borderRadius: 2,
              fontWeight: 600,
              px: 3
            }}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleChangePassword}
            variant="contained"
            disabled={loading}
            sx={{ 
              borderRadius: 2,
              fontWeight: 600,
              px: 3,
              background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)',
              }
            }}
          >
            {loading ? 'Đang đổi...' : 'Đổi mật khẩu'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserMenu;