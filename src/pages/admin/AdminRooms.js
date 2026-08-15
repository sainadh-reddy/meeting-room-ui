import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RoomCard from '../../components/RoomCard';
import api from '../../api/api';

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: 'Hyd',
    campus: 'Campus ATC',
    block: 'A Block',
    floor: 'Ground Floor',
    capacity: 6,
    vcFacility: 'Non-VC',
    zone: 'Zone 1',
    remarks: 'Inside Zone',
    facilities: '',
    status: 'Active',
  });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await api.get('/api/rooms');
      setRooms(res.data);
    } catch (err) {
      console.error('Error fetching rooms:', err);
    }
  };

  const handleOpenAdd = () => {
    setEditingRoom(null);
    setFormData({
      name: '',
      location: 'Hyd',
      campus: 'Campus ATC',
      block: 'A Block',
      floor: 'Ground Floor',
      capacity: 6,
      vcFacility: 'Non-VC',
      zone: 'Zone 1',
      remarks: 'Inside Zone',
      facilities: '',
      status: 'Active',
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name || '',
      location: room.location || 'Hyd',
      campus: room.campus || 'Campus ATC',
      block: room.block || 'A Block',
      floor: room.floor || 'Ground Floor',
      capacity: room.capacity || 6,
      vcFacility: room.vcFacility || 'Non-VC',
      zone: room.zone || '',
      remarks: room.remarks || '',
      facilities: room.facilities || '',
      status: room.status || 'Active',
    });
    setOpenDialog(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await api.put(`/api/rooms/${editingRoom.id}`, formData);
        setMsg('Room updated successfully!');
      } else {
        await api.post('/api/rooms', formData);
        setMsg('Room created successfully!');
      }
      setOpenDialog(false);
      fetchRooms();
    } catch (err) {
      console.error('Failed to save room:', err);
    }
  };

  const handleToggleStatus = async (room) => {
    try {
      await api.patch(`/api/rooms/${room.id}/status`, {
        status: room.status === 'Active' ? 'Inactive' : 'Active',
      });
      fetchRooms();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        gap={2}
        mb={4}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.1rem' } }}>
            Meeting Rooms Inventory (Hyderabad)
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
            Manage corporate rooms, VC hardware facilities, seating limits, and zones
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
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
          Add New Room
        </Button>
      </Box>

      {msg && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setMsg('')}>
          {msg}
        </Alert>
      )}

      <Grid container spacing={3}>
        {rooms.map((room) => (
          <Grid item xs={12} sm={6} md={4} key={room.id} display="flex">
            <RoomCard
              room={room}
              isAdmin={true}
              onEdit={handleOpenEdit}
              onToggleStatus={handleToggleStatus}
            />
          </Grid>
        ))}
      </Grid>

      {/* Add / Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleSave}>
          <DialogTitle fontWeight={700}>
            {editingRoom ? `Edit Room #${editingRoom.id}` : 'Create New Corporate Meeting Room'}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Room Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  label="Building / Campus"
                  value={formData.campus}
                  onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                  size="small"
                >
                  <MenuItem value="Campus ATC">Campus ATC</MenuItem>
                  <MenuItem value="Capital ATC">Capital ATC</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  label="Block"
                  value={formData.block}
                  onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                  size="small"
                >
                  <MenuItem value="A Block">A Block</MenuItem>
                  <MenuItem value="B Block">B Block</MenuItem>
                  <MenuItem value="N/A">N/A</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Floor / Level"
                  placeholder="e.g. Ground Floor, Level 1, 3rd Floor"
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                  required
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Seating Capacity"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value, 10) || 1 })}
                  required
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  label="Video Conf Facility (VC / Non-VC)"
                  value={formData.vcFacility}
                  onChange={(e) => setFormData({ ...formData, vcFacility: e.target.value })}
                  size="small"
                >
                  <MenuItem value="VC">VC (Video Conference)</MenuItem>
                  <MenuItem value="Non-VC">Non-VC</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  size="small"
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Zone"
                  placeholder="e.g. Zone 1, Zone 2, Zone 3, GCC"
                  value={formData.zone}
                  onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Remarks"
                  placeholder="e.g. Inside Zone, Corridor, Board room"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Facilities & Equipment"
                  placeholder="e.g. Projector, Video Conf, Dual Display, Smart Board"
                  value={formData.facilities}
                  onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                  size="small"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#002855', '&:hover': { bgcolor: '#001835' } }}>
              Save Room Details
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default AdminRooms;

