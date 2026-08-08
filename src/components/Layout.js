import React from 'react';
import { Box, Container } from '@mui/material';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <Box display="flex" minHeight="100vh" bgcolor="#F4F7FC">
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: '260px',
          p: { xs: 2, md: 4 },
          width: 'calc(100% - 260px)',
          minHeight: '100vh',
        }}
      >
        <Container maxWidth="xl" disableGutters className="fade-in">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
