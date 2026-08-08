import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const StatsCard = ({ title, value, icon: Icon, color = '#1F3C92', subtitle, onClick, active }) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        width: '100%',
        height: '100%',
        minHeight: 95,
        borderRadius: 3,
        borderLeft: `4px solid ${color}`,
        borderTop: active ? `2px solid ${color}` : '1px solid #E2E8F0',
        borderRight: active ? `2px solid ${color}` : '1px solid #E2E8F0',
        borderBottom: active ? `2px solid ${color}` : '1px solid #E2E8F0',
        boxShadow: active ? '0 8px 24px rgba(31, 60, 146, 0.18)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
        transform: active ? 'translateY(-3px)' : 'none',
        bgcolor: active ? `${color}0A` : '#ffffff',
        cursor: onClick ? 'pointer' : 'default',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 6px 18px rgba(31, 60, 146, 0.12)',
        },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box flexGrow={1} pr={1}>
            <Typography
              variant="caption"
              sx={{ fontSize: '0.78rem', fontWeight: active ? 700 : 600, color: active ? color : 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.3px' }}
              noWrap
            >
              {title}
            </Typography>
            <Typography variant="h5" sx={{ color: '#112163', my: 0.2, fontWeight: 700, fontSize: '1.4rem' }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary" noWrap display="block">
                {subtitle}
              </Typography>
            )}
          </Box>
          {Icon && (
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: color,
                flexShrink: 0,
              }}
            >
              <Icon fontSize="small" />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
