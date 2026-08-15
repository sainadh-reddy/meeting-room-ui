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
  TextField,
  InputAdornment,
  TableContainer,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import api from '../../api/api';
import { getDynamicBookingStatus, getStatusChipProps } from '../../utils/statusUtils';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    fetchBookings();

    const apiInterval = setInterval(() => {
      fetchBookings();
    }, 10000);

    const clockInterval = setInterval(() => {
      setNow(new Date());
    }, 5000);

    return () => {
      clearInterval(apiInterval);
      clearInterval(clockInterval);
    };
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/api/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to fetch all bookings:', err);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.patch(`/api/bookings/${id}/cancel`);
      fetchBookings();
    } catch (err) {
      console.error('Failed to cancel booking:', err);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const q = searchQuery.toLowerCase();
    return (
      (b.title && b.title.toLowerCase().includes(q)) ||
      (b.roomName && b.roomName.toLowerCase().includes(q)) ||
      (b.userName && b.userName.toLowerCase().includes(q)) ||
      (b.userEmail && b.userEmail.toLowerCase().includes(q))
    );
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Fixed Top Section: Header & Search Input */}
      <Box sx={{ flexShrink: 0, mb: 2 }}>
        <Box mb={2}>
          <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.1rem' } }}>
            Organization Bookings Directory
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor real-time dynamic meeting statuses and manage room reservations company-wide
          </Typography>
        </Box>

        <Paper sx={{ p: 2.5, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <TextField
            fullWidth
            placeholder="Search by meeting title, room name, user name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Paper>
      </Box>

      {/* Scrollable Data Section: Bookings Directory Table */}
      <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
        <TableContainer sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'auto', boxShadow: 'none' }}>
          <Table sx={{ minWidth: 700 }} stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>Meeting Title</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>Room</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>User / Organizer</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>Time</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>Recurrence</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>Dynamic Status</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }} align="center">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings.map((b) => {
                const dynamicStatus = getDynamicBookingStatus(b, now);
                const chipProps = getStatusChipProps(dynamicStatus);
                const canCancel = dynamicStatus !== 'Cancelled' && dynamicStatus !== 'Completed';

                return (
                  <TableRow key={b.id} hover>
                    <TableCell>#{b.id}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{b.title}</TableCell>
                    <TableCell>{b.roomName}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {b.userName || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {b.userEmail}
                      </Typography>
                    </TableCell>
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
              {filteredBookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                    No bookings found matching search query.
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

export default AdminBookings;

