import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Chip,
  Divider,
  Alert,
} from '@mui/material';
import api from '../../api/api';
import BookRoomModal from './BookRoom';

const RoomSchedule = () => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [targetDate, setTargetDate] = useState(todayStr);
  const [scheduleBookings, setScheduleBookings] = useState([]);

  // Modal State
  const [openBookModal, setOpenBookModal] = useState(false);
  const [slotTimes, setSlotTimes] = useState({ startTime: '09:00', endTime: '10:00' });
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchActiveRooms();
  }, []);

  useEffect(() => {
    if (selectedRoomId && targetDate) {
      fetchRoomSchedule();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoomId, targetDate]);

  const fetchActiveRooms = async () => {
    try {
      const res = await api.get('/api/rooms/active');
      setRooms(res.data);
      if (res.data.length > 0) {
        setSelectedRoomId(res.data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch rooms:', err);
    }
  };

  const fetchRoomSchedule = async () => {
    try {
      const res = await api.get(`/api/bookings/room/${selectedRoomId}`, {
        params: { date: targetDate },
      });
      setScheduleBookings(res.data.filter((b) => b.status !== 'Cancelled'));
    } catch (err) {
      console.error('Failed to fetch room schedule:', err);
    }
  };

  // Generate hourly blocks from 08:00 to 20:00
  const hours = Array.from({ length: 12 }, (_, i) => i + 8);

  const getBookingForHour = (hour) => {
    return scheduleBookings.find((b) => {
      if (!b.startTime || !b.endTime) return false;
      const bStartHour = parseInt(b.startTime.split(':')[0], 10);
      const bEndHour = parseInt(b.endTime.split(':')[0], 10);
      return hour >= bStartHour && hour < bEndHour;
    });
  };

  const handleSlotClick = (hour, isPast, isBooked) => {
    if (isPast || isBooked) return;

    const startH = hour < 10 ? `0${hour}` : `${hour}`;
    const endH = hour + 1 < 10 ? `0${hour + 1}` : `${hour + 1}`;

    setSlotTimes({
      startTime: `${startH}:00`,
      endTime: `${endH}:00`,
    });
    setOpenBookModal(true);
  };

  const handleBookingSuccess = () => {
    setSuccessMsg('Slot successfully booked! Confirmation email queued.');
    fetchRoomSchedule();
  };

  const selectedRoomObj = rooms.find((r) => String(r.id) === String(selectedRoomId));

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700}>
          Room Schedule Timeline
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Day-view timeline showing room availability. Click any open slot to reserve immediately.
        </Typography>
      </Box>

      {successMsg && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMsg('')}>
          {successMsg}
        </Alert>
      )}

      <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Select Room"
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              size="small"
            >
              {rooms.map((r) => (
                <MenuItem key={r.id} value={r.id}>
                  {r.name} ({r.campus || 'Campus ATC'} • {r.block && r.block !== 'N/A' ? r.block + ' • ' : ''}{r.floor}, {r.capacity} seats, {r.vcFacility || 'Non-VC'})
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="Schedule Date"
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: todayStr }}
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              size="small"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Hourly Timeline View */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={700} mb={3}>
          Hourly Availability Blocks (08:00 AM - 08:00 PM)
        </Typography>

        <Grid container spacing={2}>
          {hours.map((hour) => {
            const booking = getBookingForHour(hour);
            const isBooked = !!booking;
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const isPast = targetDate < todayStr || (targetDate === todayStr && (hour < currentHour || (hour === currentHour && currentMinute > 0)));
            const timeLabel = `${hour < 10 ? '0' + hour : hour}:00 - ${hour + 1 < 10 ? '0' + (hour + 1) : hour + 1}:00`;

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={hour}>
                <Paper
                  variant="outlined"
                  onClick={() => handleSlotClick(hour, isPast, isBooked)}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border: '1px solid #E2E8F0',
                    bgcolor: '#ffffff',
                    height: '100%',
                    minHeight: 115,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: isPast || isBooked ? 'default' : 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': (!isPast && !isBooked) ? {
                      borderColor: '#002855',
                      boxShadow: '0 6px 18px rgba(0, 40, 85, 0.12)',
                      transform: 'translateY(-2px)',
                    } : {},
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ color: isPast ? '#64748B' : '#1E293B' }}>
                      {timeLabel}
                    </Typography>
                    <Chip
                      label={isPast ? 'Passed' : isBooked ? 'Reserved' : 'Available'}
                      size="small"
                      color={isPast ? 'default' : isBooked ? 'warning' : 'success'}
                      sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                    />
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box minHeight={36} display="flex" alignItems="center">
                    {isPast ? (
                      <Typography variant="caption" color="text.secondary">
                        Time slot passed
                      </Typography>
                    ) : isBooked ? (
                      <Box>
                        <Typography variant="body2" fontWeight={600} noWrap sx={{ color: '#1E293B' }}>
                          {booking.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap display="block">
                          {booking.userName || booking.userEmail}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="caption" color="primary.main" fontWeight={600}>
                        Available - Click to book
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Paper>

      {/* Booking Dialog Modal */}
      {selectedRoomObj && (
        <BookRoomModal
          open={openBookModal}
          onClose={() => setOpenBookModal(false)}
          selectedRoom={selectedRoomObj}
          initialDate={targetDate}
          initialStartTime={slotTimes.startTime}
          initialEndTime={slotTimes.endTime}
          onSuccess={handleBookingSuccess}
        />
      )}
    </Box>
  );
};

export default RoomSchedule;
