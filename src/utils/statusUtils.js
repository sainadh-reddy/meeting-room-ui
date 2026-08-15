/**
 * Utility functions for real-time dynamic meeting status evaluation
 */

export const getDynamicBookingStatus = (booking, now = new Date()) => {
  if (!booking) return 'Upcoming';
  if (booking.status === 'Cancelled') return 'Cancelled';

  const { bookingDate, startTime, endTime } = booking;
  if (!bookingDate || !startTime || !endTime) {
    return booking.status || 'Upcoming';
  }

  // Format today's date YYYY-MM-DD
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  if (bookingDate < todayStr) {
    return 'Completed';
  } else if (bookingDate > todayStr) {
    return 'Upcoming';
  } else {
    // Same day
    const startStr = startTime.length === 5 ? startTime : startTime.substring(0, 5);
    const endStr = endTime.length === 5 ? endTime : endTime.substring(0, 5);

    if (currentHHMM < startStr) {
      return 'Upcoming';
    } else if (currentHHMM >= startStr && currentHHMM < endStr) {
      return 'Ongoing';
    } else {
      return 'Completed';
    }
  }
};

export const getStatusChipProps = (status) => {
  switch (status) {
    case 'Ongoing':
      return {
        label: '🟢 ONGOING NOW',
        color: 'warning',
        variant: 'filled',
        sx: {
          fontWeight: 700,
          backgroundColor: '#FFF7ED',
          color: '#C2410C',
          border: '1px solid #FDBA74',
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': { opacity: 1 },
            '50%': { opacity: 0.7 },
            '100%': { opacity: 1 },
          },
        },
      };
    case 'Upcoming':
      return {
        label: 'Upcoming',
        color: 'primary',
        variant: 'filled',
        sx: { fontWeight: 600, backgroundColor: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' },
      };
    case 'Completed':
      return {
        label: 'Completed',
        color: 'success',
        variant: 'outlined',
        sx: { fontWeight: 600, backgroundColor: '#F0FDF4', color: '#15803D', borderColor: '#BBF7D0' },
      };
    case 'Cancelled':
      return {
        label: 'Cancelled',
        color: 'error',
        variant: 'outlined',
        sx: { fontWeight: 600, backgroundColor: '#FEF2F2', color: '#B91C1C', borderColor: '#FCA5A5' },
      };
    default:
      return {
        label: status || 'Upcoming',
        color: 'default',
        variant: 'outlined',
      };
  }
};
