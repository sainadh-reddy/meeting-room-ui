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
          p: { xs: 2.5, sm: 3 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          flexGrow: 1,
          '&:last-child': { pb: { xs: 2.5, sm: 3 } },
        }}
      >
        <Box>
          {/* Header Row: Room Icon, Name & Status Dot */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  backgroundColor: isInactive ? '#F1F5F9' : '#00285515',
                  color: isInactive ? '#64748B' : '#002855',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <MeetingRoomIcon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                  {room.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Room #{room.id}
                </Typography>
              </Box>
            </Box>

            {/* Status Dot */}
            <Box
              title={isAvailable ? 'Available' : isFullyBooked ? 'Fully Booked' : 'Not Available'}
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: isAvailable ? '#10B981' : '#EF4444',
                boxShadow: isAvailable ? '0 0 6px rgba(16, 185, 129, 0.6)' : '0 0 6px rgba(239, 68, 68, 0.6)',
                flexShrink: 0,
                mt: 0.5,
              }}
            />
          </Box>

          {/* Floor & Capacity Stats */}
          <Box display="flex" gap={2} my={2} flexWrap="wrap">
            <Box display="flex" alignItems="center" gap={0.5}>
              <LayersIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                Floor {room.floor}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={0.5}>
              <PeopleIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                {room.capacity} seats
              </Typography>
            </Box>
          </Box>

          {/* Facilities Row */}
          <Box display="flex" alignItems="center" gap={0.8} mb={2} sx={{ minHeight: 28 }}>
            {room.facilities ? (
              <>
                <BuildIcon fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: '0.78rem' }}>
                  {room.facilities}
                </Typography>
              </>
            ) : (
              <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.6, fontStyle: 'italic', fontSize: '0.78rem' }}>
                Standard setup
              </Typography>
            )}
          </Box>
        </Box>

        {/* Action Buttons Footer - Sleek & Proportional */}
        <Box display="flex" gap={1} mt="auto" justifyContent="flex-end">
          {!isAdmin && onBook && (
            <Button
              variant="contained"
              disabled={!isAvailable}
              onClick={() => onBook(room)}
              sx={{
                bgcolor: '#002855',
                '&:hover': { bgcolor: '#001835' },
                py: 0.8,
                px: 2.5,
                fontSize: '0.85rem',
                borderRadius: 2,
                width: '100%',
              }}
            >
              Book Room
            </Button>
          )}

          {isAdmin && (
            <>
              {onEdit && (
                <Button
                  variant="outlined"
                  onClick={() => onEdit(room)}
                  sx={{ py: 0.8, px: 2, fontSize: '0.85rem', borderRadius: 2, flexGrow: 1 }}
                >
                  Edit
                </Button>
              )}
              {onToggleStatus && (
                <Button
                  variant="contained"
                  color={isInactive ? 'success' : 'error'}
                  onClick={() => onToggleStatus(room)}
                  sx={{ py: 0.8, px: 2, fontSize: '0.85rem', borderRadius: 2, flexGrow: 1 }}
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
