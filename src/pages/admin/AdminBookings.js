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

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBookings();
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
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700}>
          Organization Bookings Directory
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor and manage all room reservations across the entire company
        </Typography>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box mb={3}>
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
        </Box>

        <TableContainer sx={{ overflowX: 'auto', boxShadow: 'none' }}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Meeting Title</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Room</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>User / Organizer</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Recurrence</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings.map((b) => (
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
