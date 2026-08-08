import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert,
  Typography,
} from '@mui/material';
import api from '../../api/api';

const BookRoomModal = ({
  open,
  onClose,
  selectedRoom,
  initialDate,
  initialStartTime,
  initialEndTime,
  onSuccess,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    bookingDate: initialDate || todayStr,
    startTime: initialStartTime || '09:00',
    endTime: initialEndTime || '10:00',
    participants: 4,
    recurrenceType: 'NONE',
    recurrenceCount: 1,
    endDate: '',
    includeSaturdays: false,
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData((prev) => ({
        ...prev,
        bookingDate: initialDate || todayStr,
        startTime: initialStartTime || '09:00',
        endTime: initialEndTime || '10:00',
      }));
      setErrorMsg('');
    }
  }, [open, initialDate, initialStartTime, initialEndTime, todayStr]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const nowStr = new Date().toTimeString().slice(0, 5);

    if (formData.bookingDate < todayStr) {
      setErrorMsg('Cannot book a meeting room for a past date.');
      return;
    }

    if (formData.bookingDate === todayStr && formData.startTime < nowStr) {
      setErrorMsg(`Cannot book a time slot in the past (${formData.startTime}). Current time is ${nowStr}.`);
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        roomId: selectedRoom.id,
        title: formData.title,
        description: formData.description,
        bookingDate: formData.bookingDate,
        startTime: formData.startTime.length === 5 ? `${formData.startTime}:00` : formData.startTime,
        endTime: formData.endTime.length === 5 ? `${formData.endTime}:00` : formData.endTime,
        participants: parseInt(formData.participants),
        recurrenceType: formData.recurrenceType,
        recurrenceCount: parseInt(formData.recurrenceCount),
        endDate: formData.endDate ? formData.endDate : null,
        includeSaturdays: formData.includeSaturdays,
      };

      await api.post('/api/bookings', payload);
      onSuccess();
      onClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to complete booking. Slot conflict detected.');
    } finally {
      setSubmitting(false);
    }
  };

  const now = new Date();
  const currentH = now.getHours();
  const currentM = now.getMinutes();
  const nowStr = `${currentH < 10 ? '0' + currentH : currentH}:${currentM < 10 ? '0' + currentM : currentM}`;

  const isPastDate = formData.bookingDate < todayStr;
  const isStartTimePast = formData.bookingDate === todayStr && formData.startTime < nowStr;

  if (!selectedRoom) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle fontWeight={700}>
          Book Room: {selectedRoom.name} (Floor {selectedRoom.floor})
        </DialogTitle>
        <DialogContent dividers>
          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMsg}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Meeting Title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            margin="normal"
            size="small"
          />

          <TextField
            fullWidth
            label="Description / Agenda"
            multiline
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            size="small"
          />

          <Grid container spacing={2} my={0.5}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Booking Date"
                required
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: todayStr }}
                value={formData.bookingDate}
                onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                error={isPastDate}
                helperText={isPastDate ? 'Date cannot be in the past' : ''}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Participants Count"
                required
                value={formData.participants}
                onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="time"
                label="Start Time"
                required
                InputLabelProps={{ shrink: true }}
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                error={isStartTimePast}
                helperText={isStartTimePast ? `Start time is past (Now: ${nowStr})` : ''}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="time"
                label="End Time"
                required
                InputLabelProps={{ shrink: true }}
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                size="small"
              />
            </Grid>
          </Grid>

          <Typography variant="subtitle2" fontWeight={700} mt={2.5} mb={1} color="primary">
            Recurrence Options
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Recurrence Pattern"
                value={formData.recurrenceType}
                onChange={(e) => setFormData({ ...formData, recurrenceType: e.target.value })}
                size="small"
              >
                <MenuItem value="NONE">Does not repeat</MenuItem>
                <MenuItem value="DAILY">Daily</MenuItem>
                <MenuItem value="WEEKDAYS">Every Weekday (Mon-Fri)</MenuItem>
                <MenuItem value="WEEKLY">Weekly</MenuItem>
                <MenuItem value="MONTHLY">Monthly</MenuItem>
              </TextField>
            </Grid>

            {formData.recurrenceType !== 'NONE' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Repeat Occurrences Count"
                    value={formData.recurrenceCount}
                    onChange={(e) => setFormData({ ...formData, recurrenceCount: e.target.value })}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.includeSaturdays}
                        onChange={(e) => setFormData({ ...formData, includeSaturdays: e.target.checked })}
                      />
                    }
                    label="Include Saturdays in recurring schedule"
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting || isPastDate || isStartTimePast}
            sx={{ bgcolor: '#002855', '&:hover': { bgcolor: '#001835' } }}
          >
            Confirm & Reserve
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BookRoomModal;
