import React, { useState } from 'react';
import { Box, Container, AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box display="flex" minHeight="100vh" bgcolor="#F4F6F9" flexDirection="column">
      {/* Mobile Top App Bar (Visible on xs & sm screens) */}
      <AppBar
        position="sticky"
        elevation={1}
        sx={{
          bgcolor: '#001835',
          color: '#ffffff',
          display: { xs: 'flex', md: 'none' },
          zIndex: 1100,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Box display="flex" alignItems="center" gap={1.2}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                bgcolor: '#E31837',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem',
                color: '#ffffff',
              }}
            >
              V
            </Box>
            <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: '0.5px' }}>
              Virtusa
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Box display="flex" flexGrow={1}>
        {/* Sidebar Component (Mobile Drawer & Desktop Fixed) */}
        <Sidebar mobileOpen={mobileOpen} onClose={handleDrawerToggle} />

        {/* Responsive Main Canvas */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            ml: { xs: 0, md: '260px' },
            p: { xs: 2, sm: 3, md: 4 },
            width: { xs: '100%', md: 'calc(100% - 260px)' },
            minHeight: '100vh',
            boxSizing: 'border-box',
          }}
        >
          <Container maxWidth="xl" disableGutters className="fade-in">
            <Outlet />
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
