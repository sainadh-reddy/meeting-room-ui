import React from 'react';
import { Card, CardContent, Typography, Box, Button, Chip, Tooltip } from '@mui/material';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PeopleIcon from '@mui/icons-material/People';
import LayersIcon from '@mui/icons-material/Layers';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const RoomCard = ({ room, onBook, onToggleStatus, onEdit, isAdmin, isAvailable: isAvailableProp }) => {
  const isInactive = room.status === 'Inactive';
  const isFullyBooked = Boolean(room.isFullyBooked);
  const isVc = room.vcFacility === 'VC';

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
        border: isVc ? '1.5px solid #6366F1' : '1px solid #E2E8F0',
        boxShadow: isVc ? '0 4px 14px rgba(99, 102, 241, 0.08)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.25s ease',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0, 40, 85, 0.14)',
          borderColor: isVc ? '#4F46E5' : '#002855',
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
          {/* Header Row: Location, Campus & VC Badge */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5} flexWrap="wrap" gap={0.5}>
            <Box display="flex" gap={0.8} alignItems="center" flexWrap="wrap">
              <Chip
                icon={<LocationOnIcon sx={{ fontSize: '13px !important' }} />}
                label={room.location || 'Hyd'}
                size="small"
                sx={{ fontSize: '0.72rem', height: 22, fontWeight: 700, bgcolor: '#EEF2FF', color: '#4338CA' }}
              />
              <Chip
                icon={<BusinessIcon sx={{ fontSize: '13px !important' }} />}
                label={room.campus || 'Campus ATC'}
                size="small"
                sx={{ fontSize: '0.72rem', height: 22, fontWeight: 600, bgcolor: '#F1F5F9', color: '#334155' }}
              />
            </Box>

            {/* VC / Non-VC Tag */}
            <Chip
              icon={isVc ? <VideocamIcon sx={{ fontSize: '14px !important', color: '#4F46E5 !important' }} /> : <VideocamOffIcon sx={{ fontSize: '14px !important' }} />}
              label={isVc ? 'VC Facility' : 'Non-VC'}
              size="small"
              sx={{
                fontSize: '0.72rem',
                height: 24,
                fontWeight: 700,
                bgcolor: isVc ? '#E0E7FF' : '#F1F5F9',
                color: isVc ? '#3730A3' : '#64748B',
                border: isVc ? '1px solid #C7D2FE' : '1px solid #E2E8F0',
              }}
            />
          </Box>

          {/* Header Row: Room Icon, Name & Status Indicator */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2.5,
                  backgroundColor: isInactive ? '#F1F5F9' : isVc ? '#EEF2FF' : '#00285515',
                  color: isInactive ? '#64748B' : isVc ? '#4F46E5' : '#002855',
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

            {/* Availability Dot & Label */}
            <Box display="flex" alignItems="center" gap={0.6} mt={0.5}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: isInactive ? '#94A3B8' : isAvailable ? '#10B981' : '#EF4444',
                  boxShadow: isInactive
                    ? 'none'
                    : isAvailable
                    ? '0 0 6px rgba(16, 185, 129, 0.6)'
                    : '0 0 6px rgba(239, 68, 68, 0.6)',
                }}
              />
              <Typography variant="caption" fontWeight={600} color={isInactive ? 'text.disabled' : isAvailable ? 'success.main' : 'error.main'}>
                {isInactive ? 'Disabled' : isAvailable ? 'Available' : 'Occupied'}
              </Typography>
            </Box>
          </Box>

          {/* Block, Floor & Capacity Stats */}
          <Box display="flex" gap={1.5} my={1.5} flexWrap="wrap" alignItems="center">
            <Box display="flex" alignItems="center" gap={0.5}>
              <LayersIcon fontSize="small" color="action" sx={{ fontSize: '1.05rem' }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                {room.block && room.block !== 'N/A' ? `${room.block} • ` : ''}{room.floor || 'Ground Floor'}
              </Typography>
            </Box>
            <Typography color="text.disabled">•</Typography>
            <Box display="flex" alignItems="center" gap={0.5}>
              <PeopleIcon fontSize="small" color="action" sx={{ fontSize: '1.05rem' }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                {room.capacity} seats
              </Typography>
            </Box>
          </Box>

          {/* Zone & Remarks Row */}
          {(room.zone || room.remarks) && (
            <Box display="flex" alignItems="center" gap={1} mb={1.5} flexWrap="wrap">
              {room.zone && (
                <Chip
                  label={room.zone}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.72rem', height: 22, color: '#0F766E', borderColor: '#CCFBF1', bgcolor: '#F0FDFA' }}
                />
              )}
              {room.remarks && (
                <Tooltip title={`Remarks: ${room.remarks}`}>
                  <Chip
                    icon={<InfoOutlinedIcon sx={{ fontSize: '12px !important' }} />}
                    label={room.remarks}
                    size="small"
                    sx={{ fontSize: '0.7rem', height: 22, bgcolor: '#F8FAFC', color: '#64748B', maxWidth: 180 }}
                  />
                </Tooltip>
              )}
            </Box>
          )}

          {/* Equipment Facilities Row */}
          <Box display="flex" alignItems="center" gap={0.8} mb={2} sx={{ minHeight: 24 }}>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: '0.78rem', fontStyle: room.facilities ? 'normal' : 'italic' }}>
              {room.facilities ? `Facilities: ${room.facilities}` : 'Standard corporate setup'}
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons Footer */}
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

