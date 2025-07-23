import React, { useState, useMemo } from 'react';
import { useToast } from '../Toast/toastContext';
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
import AddIcon from '@mui/icons-material/PersonAddAlt1';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';

const sampleUsers = [
  { id: '1', username: 'admin', fullname: 'System admin', role: 'admin' },
  { id: '2', username: 'user', fullname: 'Người dùng', role: 'user' },
  { id: '3', username: 'user2', fullname: 'User2', role: 'user' },
  { id: '4', username: 'nguyen', fullname: 'Nguyễn Khôi Nguyên', role: 'user' },
];

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const UserManager: React.FC = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState(sampleUsers);
  const [newUser, setNewUser] = useState({ username: '', fullname: '', role: 'user' });
  const [editId, setEditId] = useState<string | null>(null);
  const [editUser, setEditUser] = useState({ username: '', fullname: '', role: 'user' });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username.trim() || !newUser.fullname.trim()) return;
    setUsers(prev => [...prev, { id: Date.now().toString(), ...newUser }]);
    setNewUser({ username: '', fullname: '', role: 'user' });
    setShowAdd(false);
    showToast('Thêm người dùng thành công!', 'success');
  };
  const handleDeleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    showToast('Xóa người dùng thành công!', 'success');
  };
  const handleEditUser = (user: { id: string; username: string; fullname: string; role: string }) => {
    setEditId(user.id);
    setEditUser({ username: user.username, fullname: user.fullname, role: user.role });
  };
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser.username.trim() || !editUser.fullname.trim()) return;
    setUsers(prev => prev.map(u => u.id === editId ? { ...u, ...editUser } : u));
    setEditId(null);
    showToast('Cập nhật người dùng thành công!', 'success');
  };

  const filteredUsers = useMemo(() => {
    let data = users;
    if (roleFilter) data = data.filter(u => u.role === roleFilter);
    if (search) data = data.filter(u => u.username.toLowerCase().includes(search.toLowerCase()) || u.fullname.toLowerCase().includes(search.toLowerCase()));
    return data;
  }, [users, roleFilter, search]);
  const totalPage = Math.ceil(filteredUsers.length / pageSize) || 1;
  const pagedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Box width="100%" maxWidth="1200px" mx="auto" mt={2}>
      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowAdd(true)}
          sx={{ fontWeight: 700, fontSize: 16, borderRadius: 2, boxShadow: 1 }}
        >
          Thêm người dùng
        </Button>
        <Box flex={1} />
        <TextField
          variant="outlined"
          size="small"
          placeholder="Tìm kiếm..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ width: 260, bgcolor: 'white', borderRadius: 2 }}
          InputProps={{ sx: { borderRadius: 2 } }}
        />
        <Select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          displayEmpty
          size="small"
          sx={{ minWidth: 180, bgcolor: 'white', borderRadius: 2 }}
        >
          <MenuItem value="">Lọc theo vai trò</MenuItem>
          <MenuItem value="admin">System Admin</MenuItem>
          <MenuItem value="user">Người dùng</MenuItem>
        </Select>
      </Stack>
      {/* Dialog Thêm mới */}
      <Dialog open={showAdd} onClose={() => setShowAdd(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 24, pb: 0 }}>Thêm mới</DialogTitle>
        <DialogContent>
          <form id="add-user-form" onSubmit={handleAddUser}>
            <Stack spacing={2} mt={2}>
              <Select
                value={newUser.role}
                onChange={e => setNewUser(u => ({ ...u, role: e.target.value }))}
                size="small"
                sx={{ minWidth: 140, bgcolor: 'white', borderRadius: 2 }}
              >
                <MenuItem value="user">Người dùng</MenuItem>
                <MenuItem value="admin">System Admin</MenuItem>
              </Select>
              <TextField
                label="Tài khoản"
                value={newUser.username}
                onChange={e => setNewUser(u => ({ ...u, username: e.target.value }))}
                required
                size="small"
                sx={{ bgcolor: 'white', borderRadius: 2 }}
              />
              <TextField
                label="Họ tên"
                value={newUser.fullname}
                onChange={e => setNewUser(u => ({ ...u, fullname: e.target.value }))}
                required
                size="small"
                sx={{ bgcolor: 'white', borderRadius: 2 }}
              />
            </Stack>
          </form>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setShowAdd(false)} color="inherit" variant="contained" sx={{ borderRadius: 2, fontWeight: 700 }} startIcon={<CloseIcon />}>Hủy</Button>
          <Button type="submit" form="add-user-form" variant="contained" color="primary" sx={{ borderRadius: 2, fontWeight: 700 }} startIcon={<AddIcon />}>Lưu</Button>
        </DialogActions>
      </Dialog>
      {/* Dialog Sửa */}
      <Dialog open={!!editId} onClose={() => setEditId(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 24, pb: 0 }}>Sửa thông tin</DialogTitle>
        <DialogContent>
          <form id="edit-user-form" onSubmit={handleSaveEdit}>
            <Stack spacing={2} mt={2}>
              <Select
                value={editUser.role}
                onChange={e => setEditUser(u => ({ ...u, role: e.target.value }))}
                size="small"
                sx={{ minWidth: 140, bgcolor: 'white', borderRadius: 2 }}
              >
                <MenuItem value="user">Người dùng</MenuItem>
                <MenuItem value="admin">System Admin</MenuItem>
              </Select>
              <TextField
                label="Tài khoản"
                value={editUser.username}
                onChange={e => setEditUser(u => ({ ...u, username: e.target.value }))}
                required
                size="small"
                sx={{ bgcolor: 'white', borderRadius: 2 }}
              />
              <TextField
                label="Họ tên"
                value={editUser.fullname}
                onChange={e => setEditUser(u => ({ ...u, fullname: e.target.value }))}
                required
                size="small"
                sx={{ bgcolor: 'white', borderRadius: 2 }}
              />
            </Stack>
          </form>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditId(null)} color="inherit" variant="contained" sx={{ borderRadius: 2, fontWeight: 700 }} startIcon={<CloseIcon />}>Hủy</Button>
          <Button type="submit" form="edit-user-form" variant="contained" color="primary" sx={{ borderRadius: 2, fontWeight: 700 }} startIcon={<EditIcon />}>Lưu</Button>
        </DialogActions>
      </Dialog>
      <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 2, mt: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ background: '#2196f3' }}>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>STT</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Họ tên</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Tài khoản</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Vai trò</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700, textAlign: 'center' }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pagedUsers.map((u, idx) => (
                <TableRow key={u.id} hover>
                  <TableCell>{(page - 1) * pageSize + idx + 1}</TableCell>
                  <TableCell>{u.fullname}</TableCell>
                  <TableCell>{u.username}</TableCell>
                  <TableCell>{u.role === 'admin' ? 'System Admin' : 'Người dùng'}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={2} justifyContent="center">
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<EditIcon />}
                        sx={{ borderRadius: 2, fontWeight: 700, minWidth: 90 }}
                        onClick={() => handleEditUser(u)}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon />}
                        sx={{ borderRadius: 2, fontWeight: 700, minWidth: 90 }}
                        onClick={() => handleDeleteUser(u.id)}
                      >
                        Xoá
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {pagedUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography color="text.secondary" py={3}>Không có người dùng nào.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mt={3}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography>Số dòng trên mỗi trang:</Typography>
          <Select
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
            size="small"
          >
            {PAGE_SIZE_OPTIONS.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
          </Select>
        </Stack>
        <Pagination
          count={totalPage}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
          shape="rounded"
        />
      </Stack>
    </Box>
  );
};

export default UserManager; 