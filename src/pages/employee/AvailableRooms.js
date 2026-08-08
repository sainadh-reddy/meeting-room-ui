import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, TextField, Button, Alert } from '@mui/material';
import RoomCard from '../../components/RoomCard';
import BookRoomModal from './BookRoom';
import api from '../../api/api';

const AvailableRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState({
    floor: '',
    minCapacity: '',
    facility: '',
  });
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [openBookModal, setOpenBookModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 08:00 to 20:00

      const [roomsRes, bookingsRes] = await Promise.all([
        api.get('/api/rooms'),
        api.get('/api/bookings'),
      ]);

      const todayBookings = bookingsRes.data.filter(
        (b) => b.bookingDate === todayStr && b.status !== 'Cancelled'
      );

      const processed = roomsRes.data.map((room) => {
        const roomBookings = todayBookings.filter((b) => String(b.roomId) === String(room.id));

        const bookedHoursCount = hours.filter((hour) => {
          return roomBookings.some((b) => {
            if (!b.startTime || !b.endTime) return false;
            const startH = parseInt(b.startTime.split(':')[0], 10);
            const endH = parseInt(b.endTime.split(':')[0], 10);
            return hour >= startH && hour < endH;
          });
        }).length;

        const isFullyBooked = bookedHoursCount >= 12;
        const isInactive = room.status === 'Inactive';
        const isAvailable = !isInactive && !isFullyBooked;

        return {
          ...room,
          isFullyBooked,
          isAvailable,
        };
      });

      setRooms(processed);
    } catch (err) {
      console.error('Failed to fetch rooms:', err);
    }
  };

  const handleFilterSearch = async (e) => {
    e.preventDefault();
    try {
      const params = {};
      if (filters.floor) params.floor = filters.floor;
      if (filters.minCapacity) params.minCapacity = filters.minCapacity;
      if (filters.facility) params.facility = filters.facility;

      const res = await api.get('/api/search/rooms', { params });
      setRooms(res.data);
    } catch (err) {
      console.error('Filter search failed:', err);
    }
  };

  const handleOpenBook = (room) => {
    setSelectedRoom(room);
    setOpenBookModal(true);
  };

  const handleBookingSuccess = () => {
    setSuccessMsg('Meeting room booked successfully! Confirmation email has been queued.');
    fetchRooms();
  };

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700}>
          Available Meeting Spaces
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Find and reserve equipped conference rooms across company floors
        </Typography>
      </Box>

      {successMsg && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMsg('')}>
          {successMsg}
        </Alert>
      )}

      <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <form onSubmit={handleFilterSearch}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                type="number"
                label="Floor"
                placeholder="e.g. 1"
                value={filters.floor}
                onChange={(e) => setFilters({ ...filters, floor: e.target.value })}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                type="number"
                label="Min Seats"
                placeholder="e.g. 6"
                value={filters.minCapacity}
                onChange={(e) => setFilters({ ...filters, minCapacity: e.target.value })}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Equipment Keyword"
                placeholder="e.g. Projector"
                value={filters.facility}
                onChange={(e) => setFilters({ ...filters, facility: e.target.value })}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={2} display="flex" justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: '#002855',
                  '&:hover': { bgcolor: '#001835' },
                  py: 0.9,
                  px: 3,
                  fontSize: '0.875rem',
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                Filter
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Grid container spacing={3}>
        {rooms.map((room) => (
          <Grid item xs={12} sm={6} md={4} key={room.id} display="flex">
            <RoomCard
              room={room}
              isAdmin={false}
              isAvailable={room.isAvailable}
              onBook={handleOpenBook}
            />
          </Grid>
        ))}
        {rooms.length === 0 && (
          <Grid item xs={12}>
            <Typography color="text.secondary" align="center" my={4}>
              No active meeting rooms available matching filters.
            </Typography>
          </Grid>
        )}
      </Grid>

      <BookRoomModal
        open={openBookModal}
        onClose={() => setOpenBookModal(false)}
        selectedRoom={selectedRoom}
        onSuccess={handleBookingSuccess}
      />
    </Box>
  );
};

export default AvailableRooms;
