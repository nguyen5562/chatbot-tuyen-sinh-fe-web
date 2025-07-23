import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../utils/auth';
import { useToast } from '../components/Toast/toastContext';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonIcon from '@mui/icons-material/Person';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(username, password);
    showToast('Đăng ký thành công!', 'success');
    navigate('/login');
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3, width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <PersonAddAlt1Icon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Đăng ký
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="fullname"
              label="Họ tên"
              name="fullname"
              autoComplete="name"
              value={fullname}
              onChange={e => setFullname(e.target.value)}
              InputProps={{ startAdornment: <PersonIcon sx={{ mr: 1, color: 'primary.main' }} /> }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Tài khoản"
              name="username"
              autoComplete="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              InputProps={{ startAdornment: <AccountCircleIcon sx={{ mr: 1, color: 'primary.main' }} /> }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              InputProps={{ startAdornment: <LockIcon sx={{ mr: 1, color: 'primary.main' }} /> }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2, fontWeight: 700, fontSize: 16 }}
            >
              Đăng ký
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 1 }}>
              <Typography variant="body2" sx={{ mr: 1 }}>
                Đã có tài khoản?
              </Typography>
              <Link to="/login" style={{ color: '#1976d2', fontWeight: 600, textDecoration: 'none' }}>
                Đăng nhập
              </Link>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage; 