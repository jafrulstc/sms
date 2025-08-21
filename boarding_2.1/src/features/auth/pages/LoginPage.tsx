import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Paper, Typography, Container } from '@mui/material';
import { useAppSelector } from '~/app/store/hooks';
import { selectIsAuthenticated } from '../store/authSlice';
import { LoginForm } from '../components/LoginForm';

/**
 * Login page component
 */
export const LoginPage = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Redirect to admin if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h3"
              fontWeight={700}
              color="primary.main"
              gutterBottom
            >
              School Management
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Sign in to your account
            </Typography>
          </Box>

          {/* Login Form */}
          <LoginForm />

          {/* Demo Credentials */}
          <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Demo Credentials:
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Super Admin:</strong> admin / any password
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Hostel Manager:</strong> hostel_manager / any password
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Education Admin:</strong> education_admin / any password
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Accounts Manager:</strong> accounts_manager / any password
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Boarding Manager:</strong> boarding_manager / any password
            </Typography>
            <Typography variant="body2">
              <strong>Teacher:</strong> teacher1 / any password
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};