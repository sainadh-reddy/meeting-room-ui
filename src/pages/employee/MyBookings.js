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
  TableContainer,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import api from '../../api/api';
import { getDynamicBookingStatus, getStatusChipProps } from '../../utils/statusUtils';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [msg, setMsg] = useState('');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    fetchMyBookings();

    const apiInterval = setInterval(() => {
      fetchMyBookings();
    }, 10000);

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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Fixed Top Section: Header */}
      <Box sx={{ flexShrink: 0, mb: 2 }}>
        <Box mb={1}>
          <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.1rem' } }}>
            My Bookings & Reservations
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Review your personal meeting room schedule, dynamic real-time statuses, and cancellations
          </Typography>
        </Box>

        {msg && (
          <Alert severity="info" sx={{ mt: 1 }} onClose={() => setMsg('')}>
            {msg}
          </Alert>
        )}
      </Box>

      {/* Scrollable Data Section: Personal Bookings Table */}
      <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
        <TableContainer sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'auto', boxShadow: 'none' }}>
          <Table sx={{ minWidth: 650 }} stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>Meeting Title</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>Room Name</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>Time Slot</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>Recurrence</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>Dynamic Status</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }} align="center">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((b) => {
                const dynamicStatus = getDynamicBookingStatus(b, now);
                const chipProps = getStatusChipProps(dynamicStatus);
                const canCancel = dynamicStatus !== 'Cancelled' && dynamicStatus !== 'Completed';

                return (
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
                      <Chip size="small" {...chipProps} />
                    </TableCell>
                    <TableCell align="center">
                      {canCancel && (
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
                );
              })}
              {bookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    You have no meeting room reservations yet.
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

export default MyBookings;

