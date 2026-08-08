import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Chip,
  Alert,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import api from '../../api/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      const res = await api.get('/api/bookings/my');
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to fetch personal bookings:', err);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking reservation?')) return;
    try {
      await api.patch(`/api/bookings/${id}/cancel`);
      setMsg('Booking reservation cancelled successfully.');
      fetchMyBookings();
    } catch (err) {
      console.error('Cancellation failed:', err);
    }
  };

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700}>
          My Bookings & Reservations
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review your personal meeting room schedule, recurrence details, and booking cancellations
        </Typography>
      </Box>

      {msg && (
        <Alert severity="info" sx={{ mb: 3 }} onClose={() => setMsg('')}>
          {msg}
        </Alert>
      )}

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#F8FAFC' }}>
              <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Meeting Title</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Room Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Time Slot</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Recurrence</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((b) => (
              <TableRow key={b.id} hover>
                <TableCell>#{b.id}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{b.title}</TableCell>
                <TableCell>{b.roomName}</TableCell>
                <TableCell>{b.bookingDate}</TableCell>
                <TableCell>{`${b.startTime} - ${b.endTime}`}</TableCell>
                <TableCell>
                  <Chip
                    label={b.recurrenceType || 'NONE'}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.75rem' }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={b.status}
                    size="small"
                    color={
                      b.status === 'Cancelled' ? 'error' : b.status === 'Completed' ? 'success' : 'primary'
                    }
                  />
                </TableCell>
                <TableCell align="center">
                  {b.status !== 'Cancelled' && (
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={() => handleCancel(b.id)}
                    >
                      Cancel
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {bookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  You have no meeting room reservations yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default MyBookings;
