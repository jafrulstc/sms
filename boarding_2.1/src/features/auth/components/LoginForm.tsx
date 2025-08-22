import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, Person, Lock } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import { login, selectAuthLoading, selectAuthError, clearError } from '../store/authSlice';
import type { LoginCredentials } from '../types';

/**
 * Login form validation schema
 */
const loginSchema = z.object({
  username: z.string()
    .min(1, 'Username is required')
    .max(50, 'Username must be less than 50 characters'),
  password: z.string()
    .min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Login form component
 */
export const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  /**
   * Handle form submission
   */
  const onSubmit = async (data: LoginFormData) => {
    try {
      // Clear any previous errors
      dispatch(clearError());
      
      // Attempt login
      await dispatch(login(data)).unwrap();
      
      // Redirect to intended page or admin dashboard
      const from = (location.state as any)?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled by the rejected case in the slice
      console.error('Login failed:', error);
    }
  };

  /**
   * Toggle password visibility
   */
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      {/* Username Field */}
      <Controller
        name="username"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Username"
            placeholder="Enter your username"
            error={!!errors.username}
            helperText={errors.username?.message}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
            autoFocus
          />
        )}
      />

      {/* Password Field */}
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            error={!!errors.password}
            helperText={errors.password?.message}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                    disabled={loading}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
        )}
      />

      {/* Remember Me Checkbox */}
      <Controller
        name="rememberMe"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Checkbox
                {...field}
                checked={field.value || false}
                disabled={loading}
              />
            }
            label="Remember me"
            sx={{ mb: 3 }}
          />
        )}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={loading}
        sx={{
          py: 1.5,
          fontSize: '1.1rem',
          fontWeight: 600,
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={20} color="inherit" />
            Signing in...
          </Box>
        ) : (
          'Sign In'
        )}
      </Button>
    </Box>
  );
};