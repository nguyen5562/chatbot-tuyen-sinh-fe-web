import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast/toastContext';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import { authApi } from '../utils/apis/authApi';
import { useAuthStore } from '../store/authStore';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
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
      const response = await authApi.login(formData);

      if (response.status === 'Success') {
        showToast(response.message, 'success');
        login(response.data?.user.fullname, response.data?.user.role, response.data?.access_token, response.data?.user.id);
        navigate('/');
      } else {
        showToast(response.message || 'Đăng nhập thất bại. Vui lòng thử lại!', 'error');
      }
    } catch (error: any) {
      console.error('Login error:', error);

      if (error?.statusCode) {
        showToast(error.message || 'Đăng nhập thất bại. Vui lòng thử lại!', 'error');
      } else {
        showToast('Kết nối thất bại. Vui lòng thử lại!', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: '#f7fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 2
    }}>
      <Container component="main" maxWidth="sm">
        <Paper 
          elevation={0}
          sx={{ 
            p: 6, 
            borderRadius: 4, 
            width: '100%',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Header Section */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar 
                sx={{ 
                  m: 'auto',
                  mb: 2,
                  width: 64,
                  height: 64,
                  background: '#667eea',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
                }}
              >
                <LockOutlinedIcon sx={{ fontSize: 28 }} />
              </Avatar>
              <Typography 
                component="h1" 
                variant="h4" 
                sx={{ 
                  fontWeight: 900,
                  mb: 1,
                  color: '#2d3748'
                }}
              >
                Đăng nhập
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ fontWeight: 500, color: '#718096' }}
              >
                Chào mừng bạn quay trở lại!
              </Typography>
            </Box>

            {/* Form Section */}
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                fullWidth
                label="Tài khoản"
                value={formData.username}
                onChange={handleChange('username')}
                error={!!errors.username}
                helperText={errors.username}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.8)',
                    transition: 'all 0.3s ease',
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
                    <AccountCircleIcon 
                      sx={{ 
                        mr: 2, 
                        color: errors.username ? 'error.main' : '#667eea'
                      }} 
                    />
                  )
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
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.8)',
                    transition: 'all 0.3s ease',
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
                    <LockIcon 
                      sx={{ 
                        mr: 2, 
                        color: errors.password ? 'error.main' : '#667eea'
                      }} 
                    />
                  )
                }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{ 
                  mt: 2, 
                  mb: 3, 
                  py: 2,
                  fontWeight: 700, 
                  fontSize: 16,
                  borderRadius: 3,
                  background: '#667eea',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: '#5a67d8',
                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.5)',
                    transform: 'translateY(-2px)'
                  },
                  '&:disabled': {
                    background: '#a0aec0',
                    boxShadow: 'none'
                  }
                }}
              >
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: 1,
                mt: 2,
                p: 3,
                borderRadius: 3,
                background: 'rgba(102, 126, 234, 0.05)'
              }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Chưa có tài khoản?
                </Typography>
                <Link 
                  to="/register" 
                  style={{ 
                    color: '#667eea', 
                    fontWeight: 700, 
                    textDecoration: 'none',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Đăng ký ngay
                </Link>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage; 