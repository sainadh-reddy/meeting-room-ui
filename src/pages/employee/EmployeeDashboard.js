import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Table, TableHead, TableRow, TableCell, TableBody, Chip, Button, TableContainer } from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import StatsCard from '../../components/StatsCard';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { getDynamicBookingStatus, getStatusChipProps } from '../../utils/statusUtils';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myBookings, setMyBookings] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('ALL'); // 'ALL', 'Upcoming', 'Ongoing', 'Completed'
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    fetchMyBookings();
    
    // Auto-refresh API data every 10 seconds
    const apiInterval = setInterval(() => {
      fetchMyBookings();
    }, 10000);

    // Live clock tick every 5 seconds for instant dynamic status calculations
    const clockInterval = setInterval(() => {
      setNow(new Date());
    }, 5000);

    return () => {
      clearInterval(apiInterval);
      clearInterval(clockInterval);
    };
  }, []);

  const fetchMyBookings = async () => {
    try {
      const res = await api.get('/api/bookings/my');
      setMyBookings(res.data);
    } catch (err) {
      console.error('Failed to load user bookings:', err);
    }
  };

  const handleCardClick = (status) => {
    if (selectedFilter === status) {
      setSelectedFilter('ALL');
    } else {
      setSelectedFilter(status);
    }
  };

  // Dynamically map bookings with live status based on exact client time
  const processedBookings = myBookings.map((b) => ({
    ...b,
    dynamicStatus: getDynamicBookingStatus(b, now),
  }));

  const upcomingCount = processedBookings.filter((b) => b.dynamicStatus === 'Upcoming').length;
  const ongoingCount = processedBookings.filter((b) => b.dynamicStatus === 'Ongoing').length;
  const completedCount = processedBookings.filter((b) => b.dynamicStatus === 'Completed').length;

  const displayedBookings = processedBookings.filter((b) => {
    if (selectedFilter === 'ALL') return true;
    return b.dynamicStatus?.toUpperCase() === selectedFilter.toUpperCase();
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Fixed Top Section: Header & Stats Cards */}
      <Box sx={{ flexShrink: 0, mb: 2 }}>
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          gap={2}
          mb={2}
        >
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.1rem' } }}>
              Welcome back, {user?.name || 'Employee'}!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
              Real-time dynamic meeting status tracking across corporate spaces
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => navigate('/employee/rooms')}
            sx={{
              bgcolor: '#002855',
              '&:hover': { bgcolor: '#001835' },
              px: 2.5,
              py: 0.9,
              fontSize: '0.875rem',
              alignSelf: { xs: 'flex-start', sm: 'auto' },
              whiteSpace: 'nowrap',
            }}
          >
            Book a Room
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={3} display="flex">
            <StatsCard
              title="Total Reservations"
              value={myBookings.length}
              icon={CalendarMonthIcon}
              color="#002855"
              active={selectedFilter === 'ALL'}
              onClick={() => setSelectedFilter('ALL')}
            />
          </Grid>
          <Grid item xs={12} sm={3} display="flex">
            <StatsCard
              title="Ongoing Now"
              value={ongoingCount}
              icon={PlayCircleOutlineIcon}
              color="#EA580C"
              active={selectedFilter === 'Ongoing'}
              onClick={() => handleCardClick('Ongoing')}
            />
          </Grid>
          <Grid item xs={12} sm={3} display="flex">
            <StatsCard
              title="Upcoming Meetings"
              value={upcomingCount}
              icon={EventAvailableIcon}
              color="#2563EB"
              active={selectedFilter === 'Upcoming'}
              onClick={() => handleCardClick('Upcoming')}
            />
          </Grid>
          <Grid item xs={12} sm={3} display="flex">
            <StatsCard
              title="Completed Meetings"
              value={completedCount}
              icon={EventAvailableIcon}
              color="#10B981"
              active={selectedFilter === 'Completed'}
              onClick={() => handleCardClick('Completed')}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Scrollable Personal Meetings Table Section */}
      <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={1.5} mb={2} sx={{ flexShrink: 0 }}>
          <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1rem', sm: '1.15rem' } }}>
            Your Scheduled Meetings {selectedFilter !== 'ALL' ? `(${selectedFilter})` : ''}
          </Typography>
          <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
            {selectedFilter !== 'ALL' && (
              <Button
                size="small"
                startIcon={<FilterAltOffIcon />}
                onClick={() => setSelectedFilter('ALL')}
                color="inherit"
                sx={{ fontSize: '0.8rem' }}
              >
                Clear Filter
              </Button>
            )}
            <Button size="small" onClick={() => navigate('/employee/bookings')} sx={{ fontSize: '0.8rem' }}>
              View All My Bookings
            </Button>
          </Box>
        </Box>

        <TableContainer sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'auto', boxShadow: 'none' }}>
          <Table sx={{ minWidth: 600 }} stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>Room</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>Time</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>Participants</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>Dynamic Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedBookings.slice(0, 15).map((b) => {
                const chipProps = getStatusChipProps(b.dynamicStatus);
                return (
                  <TableRow key={b.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{b.title}</TableCell>
                    <TableCell>{b.roomName}</TableCell>
                    <TableCell>{b.bookingDate}</TableCell>
                    <TableCell>{`${b.startTime} - ${b.endTime}`}</TableCell>
                    <TableCell>{b.participants || 1} seats</TableCell>
                    <TableCell>
                      <Chip size="small" {...chipProps} />
                    </TableCell>
                  </TableRow>
                );
              })}
              {displayedBookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    No meetings found for status "{selectedFilter}".
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default EmployeeDashboard;

