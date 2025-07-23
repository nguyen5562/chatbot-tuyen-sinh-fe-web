import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

const NotFoundPage: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="80vh" width="100%">
      <Paper elevation={6} sx={{ maxWidth: 420, width: '100%', mx: 'auto', mt: 8, p: 5, borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <ReportProblemIcon color="warning" sx={{ fontSize: 72, mb: 3, animation: 'bounce 1.2s infinite' }} />
        <Typography variant="h4" fontWeight={700} mb={1} color="text.primary">404 - Không tìm thấy trang</Typography>
        <Typography color="text.secondary" mb={3} align="center">Trang bạn truy cập không tồn tại hoặc đã bị di chuyển.</Typography>
        <Button component={Link} to="/" variant="contained" color="primary" size="large" sx={{ borderRadius: 8, fontWeight: 600, boxShadow: 2 }}>
          Về trang chủ
        </Button>
      </Paper>
      <style>{`@keyframes bounce {0%, 100% {transform: translateY(0);}50% {transform: translateY(-16px);}}`}</style>
    </Box>
  );
};

export default NotFoundPage; 