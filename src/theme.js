import { createTheme } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import React from 'react';

export const BlueChevronIcon = (props) => (
  <KeyboardArrowDownIcon {...props} style={{ color: '#002855', transition: 'transform 0.2s ease' }} />
);

const theme = createTheme({
  palette: {
    primary: {
      main: '#002855',
      light: '#004080',
      dark: '#001835',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#E31837',
      light: '#FF4D6D',
      dark: '#A80018',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F4F6F9',
      paper: '#ffffff',
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B',
    },
  },
  typography: {
    fontFamily: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'].join(','),
    h4: {
      fontWeight: 700,
      color: '#001835',
    },
    h5: {
      fontWeight: 600,
      color: '#002855',
    },
    h6: {
      fontWeight: 600,
      color: '#0F172A',
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 40, 85, 0.2)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        IconComponent: BlueChevronIcon,
      },
    },
  },
});

export default theme;
