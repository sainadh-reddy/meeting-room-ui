import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import TableChartIcon from '@mui/icons-material/TableChart';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import DownloadIcon from '@mui/icons-material/Download';
import api from '../../api/api';

const AdminReports = () => {
  const downloadReport = async (endpoint, filename) => {
    try {
      const response = await api.get(endpoint, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700}>
          Reports & Export Center
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Generate and download executive audit reports in Excel and PDF formats
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Bookings Excel */}
        <Grid item xs={12} md={4} display="flex">
          <Card
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 3,
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.25s ease',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(31, 60, 146, 0.12)',
                borderColor: '#10B981',
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
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: '#10B98115',
                      color: '#10B981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <TableChartIcon fontSize="large" />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ fontSize: '1.1rem', lineHeight: 1.2 }}>
                      Bookings Excel Export
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Spreadsheet (.xlsx)
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Export complete history of all organization meeting room reservations, users, dates, and statuses.
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                startIcon={<DownloadIcon />}
                onClick={() => downloadReport('/api/reports/bookings/excel', 'bookings_report.xlsx')}
                sx={{ bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' }, py: 1 }}
              >
                Download Excel Report
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Bookings PDF */}
        <Grid item xs={12} md={4} display="flex">
          <Card
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 3,
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.25s ease',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(31, 60, 146, 0.12)',
                borderColor: '#EF4444',
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
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: '#EF444415',
                      color: '#EF4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <PictureAsPdfIcon fontSize="large" />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ fontSize: '1.1rem', lineHeight: 1.2 }}>
                      Bookings PDF Report
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      PDF Document (.pdf)
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Formatted PDF summary table suitable for executive distribution and compliance audits.
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                startIcon={<DownloadIcon />}
                onClick={() => downloadReport('/api/reports/bookings/pdf', 'bookings_report.pdf')}
                sx={{ bgcolor: '#EF4444', '&:hover': { bgcolor: '#DC2626' }, py: 1 }}
              >
                Download PDF Report
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Rooms Inventory Excel */}
        <Grid item xs={12} md={4} display="flex">
          <Card
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 3,
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
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: '#00285515',
                      color: '#002855',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <MeetingRoomIcon fontSize="large" />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ fontSize: '1.1rem', lineHeight: 1.2 }}>
                      Rooms Inventory Excel
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Spreadsheet (.xlsx)
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Export full audit inventory of meeting room spaces, floors, seating capacities, and equipment.
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                startIcon={<DownloadIcon />}
                onClick={() => downloadReport('/api/reports/rooms/excel', 'rooms_inventory.xlsx')}
                sx={{ bgcolor: '#002855', '&:hover': { bgcolor: '#001835' }, py: 1 }}
              >
                Download Rooms Excel
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminReports;
