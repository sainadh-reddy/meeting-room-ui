import React from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PeopleIcon from '@mui/icons-material/People';
import LayersIcon from '@mui/icons-material/Layers';
import BuildIcon from '@mui/icons-material/Build';

const RoomCard = ({ room, onBook, onToggleStatus, onEdit, isAdmin, isAvailable: isAvailableProp }) => {
  const isInactive = room.status === 'Inactive';
  const isFullyBooked = Boolean(room.isFullyBooked);

  // Room is available if explicitly passed as available, or if active and not fully booked
  const isAvailable = isAvailableProp !== undefined
    ? isAvailableProp
    : (!isInactive && !isFullyBooked);

  return (
    <Card
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        opacity: isInactive ? 0.75 : 1,
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.25s ease',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0, 40, 85, 0.12)',
          borderColor: '#002855',
        },
      }}
    >
      <CardContent
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          flexGrow: 1,
          '&:last-child': { pb: 3 },
        }}
      >
        <Box>
          {/* Header Row: Room Icon, Name & Green/Red Dot Availability Badge */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2,
                  backgroundColor: isInactive ? '#F1F5F9' : '#00285515',
                  color: isInactive ? '#64748B' : '#002855',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <MeetingRoomIcon />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                  {room.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Room #{room.id}
                </Typography>
              </Box>
            </Box>

            {/* Green Dot (Available) / Red Dot (Not Available) Only */}
            <Box
              title={isAvailable ? 'Available' : isFullyBooked ? 'Fully Booked' : 'Not Available'}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: isAvailable ? '#10B981' : '#EF4444',
                boxShadow: isAvailable ? '0 0 8px rgba(16, 185, 129, 0.6)' : '0 0 8px rgba(239, 68, 68, 0.6)',
                flexShrink: 0,
                mt: 0.5,
              }}
            />
          </Box>

          {/* Floor & Capacity Stats */}
          <Box display="flex" gap={2} my={2} flexWrap="wrap">
            <Box display="flex" alignItems="center" gap={0.5}>
              <LayersIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                Floor {room.floor}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={0.5}>
              <PeopleIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {room.capacity} seats
              </Typography>
            </Box>
          </Box>

          {/* Facilities Row with fixed minHeight for alignment */}
          <Box display="flex" alignItems="center" gap={0.8} mb={2} sx={{ minHeight: 32 }}>
            {room.facilities ? (
              <>
                <BuildIcon fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary" noWrap>
                  {room.facilities}
                </Typography>
              </>
            ) : (
              <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.6, fontStyle: 'italic' }}>
                Standard setup
              </Typography>
            )}
          </Box>
        </Box>

        {/* Action Buttons Footer */}
        <Box display="flex" gap={1} mt="auto">
          {!isAdmin && onBook && (
            <Button
              variant="contained"
              fullWidth
              disabled={!isAvailable}
              onClick={() => onBook(room)}
              sx={{ bgcolor: '#002855', '&:hover': { bgcolor: '#001835' }, py: 1 }}
            >
              Book Room
            </Button>
          )}

          {isAdmin && (
            <>
              {onEdit && (
                <Button variant="outlined" fullWidth onClick={() => onEdit(room)} sx={{ py: 1 }}>
                  Edit
                </Button>
              )}
              {onToggleStatus && (
                <Button
                  variant="contained"
                  color={isInactive ? 'success' : 'error'}
                  fullWidth
                  onClick={() => onToggleStatus(room)}
                  sx={{ py: 1 }}
                >
                  {isInactive ? 'Activate' : 'Disable'}
                </Button>
              )}
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
