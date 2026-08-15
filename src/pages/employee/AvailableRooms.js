import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, TextField, Button, Alert, MenuItem } from '@mui/material';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import RoomCard from '../../components/RoomCard';
import BookRoomModal from './BookRoom';
import api from '../../api/api';

const AvailableRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState({
    campus: 'ALL',
    block: 'ALL',
    floor: '',
    vcFacility: 'ALL',
    minCapacity: '',
    facility: '',
  });
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [openBookModal, setOpenBookModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchRooms();
    const timer = setInterval(() => {
      fetchRooms();
    }, 10000);
    return () => clearInterval(timer);
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
    if (e) e.preventDefault();
    try {
      const params = {};
      params.location = 'Hyd';
      if (filters.campus && filters.campus !== 'ALL') params.campus = filters.campus;
      if (filters.block && filters.block !== 'ALL') params.block = filters.block;
      if (filters.floor) params.floor = filters.floor;
      if (filters.vcFacility && filters.vcFacility !== 'ALL') params.vcFacility = filters.vcFacility;
      if (filters.minCapacity) params.minCapacity = filters.minCapacity;
      if (filters.facility) params.facility = filters.facility;

      const res = await api.get('/api/search/rooms', { params });
      setRooms(res.data);
    } catch (err) {
      console.error('Filter search failed:', err);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      campus: 'ALL',
      block: 'ALL',
      floor: '',
      vcFacility: 'ALL',
      minCapacity: '',
      facility: '',
    });
    fetchRooms();
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
        <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.1rem' } }}>
          Available Meeting Spaces (Hyderabad)
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse and reserve equipped conference rooms across Campus ATC & Capital ATC
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
            {/* Campus Select */}
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                label="Building / Campus"
                value={filters.campus}
                onChange={(e) => setFilters({ ...filters, campus: e.target.value })}
                size="small"
              >
                <MenuItem value="ALL">All Buildings</MenuItem>
                <MenuItem value="Campus ATC">Campus ATC</MenuItem>
                <MenuItem value="Capital ATC">Capital ATC</MenuItem>
              </TextField>
            </Grid>

            {/* Block Select */}
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                label="Block"
                value={filters.block}
                onChange={(e) => setFilters({ ...filters, block: e.target.value })}
                size="small"
              >
                <MenuItem value="ALL">All Blocks</MenuItem>
                <MenuItem value="A Block">A Block</MenuItem>
                <MenuItem value="B Block">B Block</MenuItem>
              </TextField>
            </Grid>

            {/* VC / Non-VC Select */}
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                label="VC Facility"
                value={filters.vcFacility}
                onChange={(e) => setFilters({ ...filters, vcFacility: e.target.value })}
                size="small"
              >
                <MenuItem value="ALL">All Facilities</MenuItem>
                <MenuItem value="VC">VC (Video Conf)</MenuItem>
                <MenuItem value="Non-VC">Non-VC</MenuItem>
              </TextField>
            </Grid>

            {/* Floor Input */}
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Floor / Level"
                placeholder="e.g. Ground Floor, Level 1"
                value={filters.floor}
                onChange={(e) => setFilters({ ...filters, floor: e.target.value })}
                size="small"
              />
            </Grid>

            {/* Min Capacity */}
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                type="number"
                label="Min Capacity"
                placeholder="e.g. 6"
                value={filters.minCapacity}
                onChange={(e) => setFilters({ ...filters, minCapacity: e.target.value })}
                size="small"
              />
            </Grid>

            {/* Filter & Reset Buttons */}
            <Grid item xs={12} sm={6} md={2} display="flex" gap={1} justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: '#002855',
                  '&:hover': { bgcolor: '#001835' },
                  py: 0.9,
                  px: 2.5,
                  fontSize: '0.85rem',
                  flexGrow: 1,
                }}
              >
                Filter
              </Button>
              <Button
                variant="outlined"
                onClick={handleResetFilters}
                sx={{ py: 0.9, px: 1.5, minWidth: 'auto' }}
                title="Reset Filters"
              >
                <FilterAltOffIcon fontSize="small" />
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

