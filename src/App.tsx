import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import ChatPage from './pages/ChatPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './routes/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';
import ToastProvider from './components/Toast/ToastProvider';

const App: React.FC = () => {
  const theme = createTheme({
    typography: {
      fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Helvetica Neue', sans-serif`
    }
  });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <MainLayout>
                  <ChatPage />
                </MainLayout>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
