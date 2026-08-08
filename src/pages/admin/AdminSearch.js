import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, TextField, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RoomCard from '../../components/RoomCard';
import api from '../../api/api';

const AdminSearch = () => {
  const [filters, setFilters] = useState({
    floor: '',
    minCapacity: '',
    facility: '',
    date: '',
    startTime: '',
    endTime: '',
  });
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const params = {};
      if (filters.floor) params.floor = filters.floor;
      if (filters.minCapacity) params.minCapacity = filters.minCapacity;
      if (filters.facility) params.facility = filters.facility;
      if (filters.date) params.date = filters.date;
      if (filters.startTime) params.startTime = filters.startTime;
      if (filters.endTime) params.endTime = filters.endTime;

      const res = await api.get('/api/search/rooms', { params });
      setResults(res.data);
      setSearched(true);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700}>
          Advanced Search & Availability Inspector
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Filter active meeting rooms by seating capacity, floor location, equipment, and time slots
        </Typography>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <form onSubmit={handleSearch}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Floor Number"
                value={filters.floor}
                onChange={(e) => setFilters({ ...filters, floor: e.target.value })}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Minimum Capacity (Seats)"
                value={filters.minCapacity}
                onChange={(e) => setFilters({ ...filters, minCapacity: e.target.value })}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Equipment / Facility Keyword"
                placeholder="e.g. Projector, Video Conf"
                value={filters.facility}
                onChange={(e) => setFilters({ ...filters, facility: e.target.value })}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="date"
                label="Target Date"
                InputLabelProps={{ shrink: true }}
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="time"
                label="Start Time"
                InputLabelProps={{ shrink: true }}
                value={filters.startTime}
                onChange={(e) => setFilters({ ...filters, startTime: e.target.value })}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="time"
                label="End Time"
                InputLabelProps={{ shrink: true }}
                value={filters.endTime}
                onChange={(e) => setFilters({ ...filters, endTime: e.target.value })}
                size="small"
              />
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="flex-end" mt={1}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SearchIcon />}
                sx={{ bgcolor: '#002855', '&:hover': { bgcolor: '#001835' }, px: 4, py: 1 }}
              >
                Inspect Availability
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {searched && (
        <Box>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Search Results ({results.length} rooms match parameters)
          </Typography>
          <Grid container spacing={3}>
            {results.map((room) => (
              <Grid item xs={12} sm={6} md={4} key={room.id} display="flex">
                <RoomCard room={room} isAdmin={true} />
              </Grid>
            ))}
            {results.length === 0 && (
              <Grid item xs={12}>
                <Typography color="text.secondary" align="center" my={4}>
                  No available meeting rooms match the specified filters.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default AdminSearch;
