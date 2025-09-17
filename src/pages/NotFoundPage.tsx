import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';

const NotFoundPage: React.FC = () => {
  return (
    <Box 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }
      }}
    >
      <Paper
        sx={{
          maxWidth: 520,
          width: '100%',
          p: 6,
          borderRadius: 6,
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 20px 80px rgba(0, 0, 0, 0.2)',
          position: 'relative',
          zIndex: 1,
          animation: 'slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          '@keyframes slideInUp': {
            from: {
              opacity: 0,
              transform: 'translateY(60px) scale(0.95)'
            },
            to: {
              opacity: 1,
              transform: 'translateY(0) scale(1)'
            }
          }
        }}
        elevation={0}
      >
        {/* 404 Illustration */}
        <Box 
          sx={{
            fontSize: 120,
            mb: 3,
            animation: 'bounce 2s ease-in-out infinite',
            '@keyframes bounce': {
              '0%, 100%': {
                transform: 'translateY(0)'
              },
              '50%': {
                transform: 'translateY(-20px)'
              }
            }
          }}
        >
          🤖
        </Box>

        {/* Error Code */}
        <Typography 
          variant="h1" 
          sx={{
            fontSize: 96,
            fontWeight: 900,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1,
            mb: 2,
            textShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
          }}
        >
          404
        </Typography>

        {/* Title */}
        <Typography 
          variant="h4" 
          sx={{
            fontWeight: 800,
            mb: 2,
            color: 'text.primary',
            fontSize: 32
          }}
        >
          Không tìm thấy trang
        </Typography>

        {/* Description */}
        <Typography 
          variant="body1" 
          sx={{
            color: 'text.secondary',
            mb: 4,
            fontSize: 17,
            fontWeight: 500,
            lineHeight: 1.6,
            maxWidth: 400,
            mx: 'auto'
          }}
        >
          Trang bạn đang tìm kiếm có thể đã bị di chuyển, 
          đổi tên hoặc tạm thời không khả dụng.
        </Typography>

        {/* Back Button */}
        <Button 
          component={Link} 
          to="/" 
          variant="contained" 
          size="large"
          startIcon={<HomeIcon />}
          sx={{
            fontWeight: 700,
            fontSize: 18,
            px: 4,
            py: 2,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s ease',
            textTransform: 'none',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
              boxShadow: '0 16px 48px rgba(102, 126, 234, 0.5)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          Về trang chủ
        </Button>

        {/* Additional Info */}
        <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}>
          <Typography 
            variant="body2" 
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1
            }}
          >
            <img 
              src="/Logo_MTA_new.png" 
              alt="MTA Logo" 
              style={{ 
                width: '18px', 
                height: '18px', 
                objectFit: 'contain' 
              }} 
            />
            Học viện Kỹ thuật quân sự MTA • ChatBot hỗ trợ tuyển sinh
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default NotFoundPage;