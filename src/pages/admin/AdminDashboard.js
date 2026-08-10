import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Table, TableHead, TableRow, TableCell, TableBody, Chip, Button, TableContainer } from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import StatsCard from '../../components/StatsCard';
import api from '../../api/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcoming: 0,
    ongoing: 0,
    completed: 0,
    cancelled: 0,
    totalRooms: 0,
  });
  const [allBookings, setAllBookings] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('ALL'); // 'ALL', 'Upcoming', 'Ongoing', 'Completed', 'Cancelled'

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        api.get('/api/reports/stats'),
        api.get('/api/bookings'),
      ]);
      setStats(statsRes.data);
      setAllBookings(bookingsRes.data);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    }
  };

  const handleCardClick = (status) => {
    if (selectedFilter === status) {
      setSelectedFilter('ALL');
    } else {
      setSelectedFilter(status);
    }
  };

  const displayedBookings = allBookings.filter((b) => {
    if (selectedFilter === 'ALL') return true;
    return b.status?.toUpperCase() === selectedFilter.toUpperCase();
  });

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.1rem' } }}>
          Admin Control Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
          Click any metric card below to filter organization bookings
        </Typography>
      </Box>

      {/* Stats Overview with Interactive Card Filtering */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} sm={6} md={2.4} display="flex">
          <StatsCard
            title="Total Rooms"
            value={stats.totalRooms}
            icon={MeetingRoomIcon}
            color="#002855"
            active={selectedFilter === 'ALL'}
            onClick={() => setSelectedFilter('ALL')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4} display="flex">
          <StatsCard
            title="Upcoming"
            value={stats.upcoming}
            icon={EventAvailableIcon}
            color="#0EA5E9"
            active={selectedFilter === 'Upcoming'}
            onClick={() => handleCardClick('Upcoming')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4} display="flex">
          <StatsCard
            title="Ongoing"
            value={stats.ongoing}
            icon={HourglassTopIcon}
            color="#F59E0B"
            active={selectedFilter === 'Ongoing'}
            onClick={() => handleCardClick('Ongoing')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4} display="flex">
          <StatsCard
            title="Completed"
            value={stats.completed}
            icon={CheckCircleIcon}
            color="#10B981"
            active={selectedFilter === 'Completed'}
            onClick={() => handleCardClick('Completed')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4} display="flex">
          <StatsCard
            title="Cancelled"
            value={stats.cancelled}
            icon={CancelIcon}
            color="#EF4444"
            active={selectedFilter === 'Cancelled'}
            onClick={() => handleCardClick('Cancelled')}
          />
        </Grid>
      </Grid>

      {/* Bookings Table */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1rem', sm: '1.15rem' } }}>
            Organization Bookings {selectedFilter !== 'ALL' ? `(${selectedFilter})` : ''}
          </Typography>
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
        </Box>

        <TableContainer sx={{ overflowX: 'auto', boxShadow: 'none' }}>
          <Table sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Room</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedBookings.map((b) => (
                <TableRow key={b.id} hover>
                  <TableCell>#{b.id}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{b.title}</TableCell>
                  <TableCell>{b.roomName}</TableCell>
                  <TableCell>{b.userName || b.userEmail}</TableCell>
                  <TableCell>{b.bookingDate}</TableCell>
                  <TableCell>{`${b.startTime} - ${b.endTime}`}</TableCell>
                  <TableCell>
                    <Chip
                      label={b.status}
                      size="small"
                      color={
                        b.status === 'Cancelled'
                          ? 'error'
                          : b.status === 'Completed'
                          ? 'success'
                          : b.status === 'Ongoing'
                          ? 'warning'
                          : 'primary'
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
              {displayedBookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    No bookings found for status "{selectedFilter}".
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

export default AdminDashboard;
