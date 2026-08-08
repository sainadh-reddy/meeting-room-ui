import React from 'react';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, Drawer } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ mobileOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();

  const adminNav = [
    { text: 'Dashboard', icon: DashboardIcon, path: '/admin/dashboard' },
    { text: 'Rooms Inventory', icon: MeetingRoomIcon, path: '/admin/rooms' },
    { text: 'All Bookings', icon: BookmarkAddedIcon, path: '/admin/bookings' },
    { text: 'Advanced Search', icon: SearchIcon, path: '/admin/search' },
    { text: 'Export Reports', icon: AssessmentIcon, path: '/admin/reports' },
  ];

  const employeeNav = [
    { text: 'Dashboard', icon: DashboardIcon, path: '/employee/dashboard' },
    { text: 'Available Rooms', icon: EventAvailableIcon, path: '/employee/rooms' },
    { text: 'Room Schedule', icon: CalendarMonthIcon, path: '/employee/schedule' },
    { text: 'My Bookings', icon: BookmarkAddedIcon, path: '/employee/bookings' },
  ];

  const navItems = isAdmin ? adminNav : employeeNav;

  const handleItemClick = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const drawerContent = (
    <Box
      sx={{
        width: 260,
        bgcolor: '#001835',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Brand Logo Header */}
      <Box p={3} display="flex" alignItems="center" gap={1.5}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: '#E31837',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.4rem',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(227, 24, 55, 0.4)',
          }}
        >
          V
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={800} sx={{ color: '#ffffff', lineHeight: 1.1, letterSpacing: '0.5px' }}>
            Virtusa
          </Typography>
          <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.72rem' }}>
            Room Booking System
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

      {/* User Info Capsule */}
      <Box p={2} mx={2} my={2} sx={{ bgcolor: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
        <Typography variant="subtitle2" fontWeight={600} noWrap sx={{ color: '#ffffff' }}>
          {user?.name || 'User'}
        </Typography>
        <Typography variant="caption" sx={{ color: '#E31837', fontWeight: 700, display: 'block' }}>
          {user?.role || 'EMPLOYEE'}
        </Typography>
        <Typography variant="caption" sx={{ color: '#94A3B8' }} noWrap display="block">
          {user?.email}
        </Typography>
      </Box>

      {/* Navigation Links */}
      <List sx={{ px: 1.5, flexGrow: 1 }}>
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <ListItemButton
              key={item.text}
              onClick={() => handleItemClick(item.path)}
              sx={{
                borderRadius: 2,
                mb: 0.8,
                bgcolor: active ? '#002855' : 'transparent',
                color: active ? '#ffffff' : '#CBD5E1',
                borderLeft: active ? '4px solid #E31837' : '4px solid transparent',
                '&:hover': {
                  bgcolor: active ? '#002855' : 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                },
              }}
            >
              <ListItemIcon sx={{ color: active ? '#E31837' : '#94A3B8', minWidth: 36 }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontSize: '0.88rem', fontWeight: active ? 600 : 400 }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

      {/* Logout Action */}
      <Box p={2}>
        <ListItemButton
          onClick={() => {
            if (onClose) onClose();
            logout();
            navigate('/login');
          }}
          sx={{
            borderRadius: 2,
            color: '#F87171',
            '&:hover': { bgcolor: 'rgba(248, 113, 113, 0.1)' },
          }}
        >
          <ListItemIcon sx={{ color: '#F87171', minWidth: 36 }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Sign Out" primaryTypographyProps={{ fontSize: '0.88rem', fontWeight: 600 }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer (xs & sm screens) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: 260, bgcolor: '#001835', borderRight: 'none' },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Fixed Sidebar (md & up) */}
      <Box
        sx={{
          width: 260,
          bgcolor: '#001835',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
          zIndex: 1200,
        }}
      >
        {drawerContent}
      </Box>
    </>
  );
};

export default Sidebar;
