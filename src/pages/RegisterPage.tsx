import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../utils/apis/authApi';
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
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.fullname.trim()) newErrors.fullname = 'Họ tên là bắt buộc';
    if (!formData.username.trim()) newErrors.username = 'Tài khoản là bắt buộc';
    if (!formData.password.trim()) newErrors.password = 'Mật khẩu là bắt buộc';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const response = await authApi.register(formData);
      
      if (response.status === 'Success') {
        showToast(response.message, 'success');
        navigate('/login');
      } else {
        showToast(response.message || 'Đăng ký thất bại. Vui lòng thử lại!', 'error');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error?.statusCode) {
        showToast(error.message || 'Đăng ký thất bại. Vui lòng thử lại!', 'error');
      } else {
        showToast('Kết nối thất bại. Vui lòng thử lại!', 'error');
      }
    } finally {
      setIsLoading(false);
    }
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
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              fullWidth
              label="Họ tên"
              value={formData.fullname}
              onChange={handleChange('fullname')}
              error={!!errors.fullname}
              helperText={errors.fullname}
              InputProps={{
                startAdornment: <PersonIcon sx={{ mr: 1, color: errors.fullname ? 'error.main' : 'primary.main' }} />
              }}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Tài khoản"
              value={formData.username}
              onChange={handleChange('username')}
              error={!!errors.username}
              helperText={errors.username}
              InputProps={{
                startAdornment: <AccountCircleIcon sx={{ mr: 1, color: errors.username ? 'error.main' : 'primary.main' }} />
              }}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Mật khẩu"
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: <LockIcon sx={{ mr: 1, color: errors.password ? 'error.main' : 'primary.main' }} />
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2, fontWeight: 700, fontSize: 16 }}
            >
              {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
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