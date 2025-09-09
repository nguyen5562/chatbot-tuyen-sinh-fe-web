import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useToast } from '../Toast/toastContext';
import { userApi } from '../../utils/apis/userApi';
import type { User } from '../../types/user';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import GroupIcon from '@mui/icons-material/Group';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

const UserManager: React.FC = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', fullname: '', role: 'user', password: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [editUser, setEditUser] = useState({ username: '', fullname: '', role: 'user', password: '' });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showPassword, setShowPassword] = useState(false);
  // const [showEditPassword, setShowEditPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userApi.getAllUser();
      if (response.statusCode === 200 && response.data) {
        setUsers(Array.isArray(response.data) ? response.data : []);
      } else {
        showToast('Không thể tải danh sách người dùng', 'error');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      showToast('Lỗi khi tải danh sách người dùng', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username.trim() || !newUser.fullname.trim() || !newUser.password.trim()) {
      showToast('Vui lòng điền đầy đủ thông tin', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await userApi.createUser(newUser);
      if (response.statusCode === 200 || response.statusCode === 201) {
        showToast('Thêm người dùng thành công!', 'success');
        setNewUser({ username: '', fullname: '', role: 'user', password: '' });
        setShowAdd(false);
        loadUsers(); // Reload users list
      } else {
        showToast(response.message || 'Không thể thêm người dùng', 'error');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      showToast('Lỗi khi thêm người dùng', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      setLoading(true);
      const response = await userApi.deleteUser(userToDelete.id);
      if (response.statusCode === 200) {
        showToast('Xóa người dùng thành công!', 'success');
        loadUsers(); // Reload users list
      } else {
        showToast(response.message || 'Không thể xóa người dùng', 'error');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showToast('Lỗi khi xóa người dùng', 'error');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };

  const cancelDeleteUser = () => {
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  const handleEditUser = (user: User) => {
    setEditId(user.id);
    setEditUser({ username: user.username, fullname: user.fullname, role: user.role, password: '' });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser.username.trim() || !editUser.fullname.trim()) {
      showToast('Vui lòng điền đầy đủ thông tin', 'error');
      return;
    }

    if (!editId) return;

    try {
      setLoading(true);
      const userData = {
        username: editUser.username,
        fullname: editUser.fullname,
        role: editUser.role,
        ...(editUser.password.trim() && { password: editUser.password })
      };
      
      const response = await userApi.updateUser(editId, userData as User);
      if (response.statusCode === 200) {
        showToast('Cập nhật người dùng thành công!', 'success');
        setEditId(null);
        loadUsers(); // Reload users list
      } else {
        showToast(response.message || 'Không thể cập nhật người dùng', 'error');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      showToast('Lỗi khi cập nhật người dùng', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    let data = users;
    if (roleFilter) data = data.filter(u => u.role === roleFilter);
    if (search) data = data.filter(u =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.fullname.toLowerCase().includes(search.toLowerCase())
    );
    return data;
  }, [users, roleFilter, search]);

  const totalPage = Math.ceil(filteredUsers.length / pageSize) || 1;
  const pagedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

  const getUserAvatar = (user: any) => {
    return user.role === 'admin' ? (
      <Avatar sx={{
        bgcolor: 'linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%)',
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%)',
        width: 40,
        height: 40
      }}>
        <AdminPanelSettingsIcon />
      </Avatar>
    ) : (
      <Avatar sx={{
        bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        width: 40,
        height: 40,
        color: 'white',
        fontWeight: 700
      }}>
        {user.fullname.charAt(0).toUpperCase()}
      </Avatar>
    );
  };

  const getRoleChip = (role: string) => {
    return role === 'admin' ? (
      <Chip
        icon={<AdminPanelSettingsIcon />}
        label="Quản trị viên"
        sx={{
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%)',
          color: 'white',
          fontWeight: 700,
          '& .MuiChip-icon': { color: 'white' }
        }}
      />
    ) : (
      <Chip
        icon={<PersonIcon />}
        label="Người dùng"
        sx={{
          background: '#667eea',
          color: 'white',
          fontWeight: 700,
          '& .MuiChip-icon': { color: 'white' }
        }}
      />
    );
  };

  return (
    <Box sx={{
      width: '100%',
      maxWidth: '1400px',
      mx: 'auto',
      p: 4,
      minHeight: 'calc(100vh - 72px)'
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            color: '#2d3748',
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <GroupIcon sx={{ fontSize: 45, color: '#667eea' }} />
          Quản lý Người dùng
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 500, color: '#718096' }}>
          Thêm, sửa, xóa và quản lý tài khoản người dùng
        </Typography>
      </Box>

      {/* Action Bar */}
      <Paper sx={{
        p: 3,
        mb: 3,
        borderRadius: 4,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          <Button
            variant="contained"
            startIcon={<PersonAddAlt1Icon />}
            onClick={() => setShowAdd(true)}
            disabled={loading}
            sx={{
              fontWeight: 700,
              fontSize: 16,
              px: 3,
              py: 1.5,
              borderRadius: 3,
              background: '#667eea',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Thêm người dùng
          </Button>

          <Box sx={{ flex: 1 }} />

          <TextField
            variant="outlined"
            size="small"
            placeholder="Tìm kiếm theo tên hoặc tài khoản..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{
              width: { xs: '100%', md: 320 },
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.9)'
                },
                '&.Mui-focused': {
                  background: 'rgba(255, 255, 255, 1)',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)'
                }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#667eea' }} />
                </InputAdornment>
              )
            }}
          />

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Lọc theo vai trò</InputLabel>
            <Select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              label="Lọc theo vai trò"
              sx={{
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.9)'
                },
                '&.Mui-focused': {
                  background: 'rgba(255, 255, 255, 1)',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)'
                }
              }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="admin">Quản trị viên</MenuItem>
              <MenuItem value="user">Người dùng</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Users Table */}
      <Paper sx={{
        borderRadius: 4,
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <TableContainer sx={{ overflowX: 'hidden' }}>
          <Table sx={{ width: '100%' }}>
            <TableHead>
              <TableRow sx={{
                background: '#667eea'
              }}>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: 16, width: '8%' }}>STT</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: 16, width: '35%' }}>Người dùng</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: 16, width: '20%' }}>Tài khoản</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: 16, width: '20%' }}>Vai trò</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: 16, textAlign: 'center', width: '17%' }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <CircularProgress sx={{ color: '#667eea' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#718096', mt: 2 }}>
                      Đang tải dữ liệu...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                pagedUsers.map((user, idx) => (
                <TableRow
                  key={user.id}
                  sx={{
                    '&:hover': {
                      bgcolor: 'rgba(102, 126, 234, 0.05)',
                      transform: 'translateX(4px)',
                      transition: 'all 0.3s ease'
                    },
                    '&:nth-of-type(even)': {
                      bgcolor: 'rgba(102, 126, 234, 0.02)'
                    }
                  }}
                >
                  <TableCell sx={{ fontWeight: 600, width: '8%' }}>
                    {(page - 1) * pageSize + idx + 1}
                  </TableCell>
                  <TableCell sx={{ width: '35%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {getUserAvatar(user)}
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
                          {user.fullname}
                        </Typography>
                        {/* <Typography variant="caption" sx={{ color: '#718096' }}>
                          ID: {user.id}
                        </Typography> */}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ width: '20%' }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 15 }}>
                      {user.username}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: '20%' }}>
                    {getRoleChip(user.role)}
                  </TableCell>
                  <TableCell align="center" sx={{ width: '17%' }}>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        onClick={() => handleEditUser(user)}
                        disabled={loading}
                        sx={{
                          color: '#2196F3',
                          '&:hover': {
                            bgcolor: 'rgba(33, 150, 243, 0.1)',
                            transform: 'scale(1.1)'
                          }
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteUser(user)}
                        disabled={loading}
                        sx={{
                          color: '#F44336',
                          '&:hover': {
                            bgcolor: 'rgba(244, 67, 54, 0.1)',
                            transform: 'scale(1.1)'
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
                ))
              )}
              {!loading && pagedUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <GroupIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#718096' }}>
                      Không tìm thấy người dùng nào
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#718096' }}>
                      Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <Box sx={{
            p: 3,
            bgcolor: 'rgba(102, 126, 234, 0.02)',
            borderTop: '1px solid rgba(102, 126, 234, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Hiển thị:
              </Typography>
              <Select
                value={pageSize}
                onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
                size="small"
                sx={{ minWidth: 80 }}
              >
                {PAGE_SIZE_OPTIONS.map(opt => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </Select>
              <Typography variant="body2" sx={{ color: '#718096' }}>
                trong tổng số {filteredUsers.length} người dùng
              </Typography>
            </Stack>

            <Pagination
              count={totalPage}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              shape="rounded"
              sx={{
                '& .MuiPaginationItem-root': {
                  fontWeight: 600
                }
              }}
            />
          </Box>
        )}
      </Paper>

      {/* Add User Dialog */}
      <Dialog open={showAdd} onClose={() => setShowAdd(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          fontWeight: 700,
          fontSize: 24,
          pb: 1,
          background: '#667eea',
          color: 'white'
        }}>
          <PersonAddAlt1Icon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Thêm người dùng mới
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <form id="add-user-form" onSubmit={handleAddUser} style={{ paddingTop: '25px' }}>
            <Stack spacing={3}>
              <FormControl fullWidth>
                <InputLabel>Vai trò</InputLabel>
                <Select
                  value={newUser.role}
                  onChange={e => setNewUser(u => ({ ...u, role: e.target.value }))}
                  label="Vai trò"
                  sx={{ borderRadius: 3 }}
                >
                  <MenuItem value="user">Người dùng</MenuItem>
                  <MenuItem value="admin">Quản trị viên</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Tài khoản"
                value={newUser.username}
                onChange={e => setNewUser(u => ({ ...u, username: e.target.value }))}
                required
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: 3 }
                }}
              />

              <TextField
                label="Họ và tên"
                value={newUser.fullname}
                onChange={e => setNewUser(u => ({ ...u, fullname: e.target.value }))}
                required
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: 3 }
                }}
              />

              <TextField
                label="Mật khẩu"
                type={showPassword ? 'text' : 'password'}
                value={newUser.password}
                onChange={e => setNewUser(u => ({ ...u, password: e.target.value }))}
                required
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: 3 }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Stack>
          </form>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => setShowAdd(false)}
            color="inherit"
            variant="outlined"
            sx={{ borderRadius: 3, fontWeight: 700 }}
            startIcon={<CloseIcon />}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            form="add-user-form"
            variant="contained"
            disabled={loading}
            sx={{
              borderRadius: 3,
              fontWeight: 700,
              background: '#667eea',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
              }
            }}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAddAlt1Icon />}
          >
            {loading ? 'Đang thêm...' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!editId} onClose={() => setEditId(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          fontWeight: 700,
          fontSize: 24,
          pb: 1,
          background: '#667eea',
          color: 'white'
        }}>
          <EditIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Chỉnh sửa thông tin
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <form id="edit-user-form" onSubmit={handleSaveEdit} style={{ paddingTop: '25px' }}>
            <Stack spacing={3}>
              <FormControl fullWidth>
                <InputLabel>Vai trò</InputLabel>
                <Select
                  value={editUser.role}
                  onChange={e => setEditUser(u => ({ ...u, role: e.target.value }))}
                  label="Vai trò"
                  sx={{ borderRadius: 3 }}
                >
                  <MenuItem value="user">Người dùng</MenuItem>
                  <MenuItem value="admin">Quản trị viên</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Tài khoản"
                value={editUser.username}
                onChange={e => setEditUser(u => ({ ...u, username: e.target.value }))}
                required
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: 3 }
                }}
              />

              <TextField
                label="Họ và tên"
                value={editUser.fullname}
                onChange={e => setEditUser(u => ({ ...u, fullname: e.target.value }))}
                required
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: 3 }
                }}
              />

              {/* <TextField
                label="Mật khẩu mới (để trống nếu không muốn thay đổi)"
                type={showEditPassword ? 'text' : 'password'}
                value={editUser.password}
                onChange={e => setEditUser(u => ({ ...u, password: e.target.value }))}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: 3 }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowEditPassword(!showEditPassword)}
                        edge="end"
                      >
                        {showEditPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              /> */}
            </Stack>
          </form>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => setEditId(null)}
            color="inherit"
            variant="outlined"
            sx={{ borderRadius: 3, fontWeight: 700 }}
            startIcon={<CloseIcon />}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            form="edit-user-form"
            variant="contained"
            disabled={loading}
            sx={{
              borderRadius: 3,
              fontWeight: 700,
              background: '#667eea',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
              }
            }}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <EditIcon />}
          >
            {loading ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onClose={cancelDeleteUser} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          fontWeight: 700,
          fontSize: 24,
          pb: 1,
          background: '#F44336',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <DeleteIcon sx={{ fontSize: 28 }} />
          Xác nhận xóa người dùng
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, paddingTop: '10px' }}>
            {userToDelete && getUserAvatar(userToDelete)}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748' }}>
                {userToDelete?.fullname}
              </Typography>
              <Typography variant="body2" sx={{ color: '#718096' }}>
                Tài khoản: {userToDelete?.username}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body1" sx={{ color: '#4a5568', lineHeight: 1.6 }}>
            Bạn có chắc chắn muốn xóa người dùng này không? Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={cancelDeleteUser}
            color="inherit"
            variant="outlined"
            disabled={loading}
            sx={{ borderRadius: 3, fontWeight: 700 }}
            startIcon={<CloseIcon />}
          >
            Hủy
          </Button>
          <Button
            onClick={confirmDeleteUser}
            variant="contained"
            disabled={loading}
            sx={{
              borderRadius: 3,
              fontWeight: 700,
              background: '#F44336',
              '&:hover': {
                background: '#d32f2f'
              }
            }}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
          >
            {loading ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManager;