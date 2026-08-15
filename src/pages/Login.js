import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const result = await login(email, password);
    if (result.success) {
      if (result.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
    } else {
      setErrorMsg(result.message);
    }
  };

  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #001835 0%, #002855 50%, #004080 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Card
        className="fade-in"
        sx={{
          maxWidth: 440,
          width: '100%',
          borderRadius: 4,
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.3)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header Branding */}
          <Box textAlign="center" display="flex" flexDirection="column" alignItems="center" mb={3}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 3,
                bgcolor: '#E31837',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '2rem',
                mb: 1.5,
                boxShadow: '0 6px 18px rgba(227, 24, 55, 0.4)',
              }}
            >
              V
            </Box>
            <Typography variant="h5" fontWeight={800} sx={{ color: '#002855', letterSpacing: '0.5px' }}>
              Virtusa Portal
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Meeting Room Booking System
            </Typography>
          </Box>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
              {errorMsg}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              margin="normal"
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              size="small"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.2,
                bgcolor: '#002855',
                fontSize: '1rem',
                '&:hover': { bgcolor: '#001835' },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </form>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary">
              DEMO QUICK FILL
            </Typography>
          </Divider>

          <Box display="flex" gap={1.5}>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              startIcon={<AdminPanelSettingsIcon />}
              onClick={() => handleQuickFill('admin@meetingroom.com', 'Admin@123')}
              sx={{ borderColor: '#002855', color: '#002855' }}
            >
              Demo Admin
            </Button>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              startIcon={<PersonOutlineIcon />}
              onClick={() => handleQuickFill('alice@meetingroom.com', 'Employee@123')}
              sx={{ borderColor: '#E31837', color: '#E31837' }}
            >
              Demo Employee
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
