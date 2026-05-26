import { 
  Box, Typography, Paper, Grid, Stack, Chip, Button, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar
} from '@mui/material';
import { 
  MeetingRoom as GateIcon, 
  Timeline as HistoryIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Circle as CircleIcon
} from '@mui/icons-material';

const mockLogs = [
  { id: 1, name: 'Rahul Sharma', role: 'Staff', point: 'Main Basement', time: '11:42 PM', action: 'Entry', status: 'Authorized', avatar: 'https://i.pravatar.cc/150?u=rahul' },
  { id: 2, name: 'Graziele Lopes', role: 'Resident', point: 'Club Entry', time: '11:35 PM', action: 'Entry', status: 'Authorized', avatar: 'https://i.pravatar.cc/150?u=graziele' },
  { id: 3, name: 'Unknown User', role: 'Guest', point: 'Gym Entry', time: '11:20 PM', action: 'Denied', status: 'Invalid Card', avatar: '' },
  { id: 4, name: 'Sanjay Dutt', role: 'Staff', point: 'Service Gate', time: '11:15 PM', action: 'Exit', status: 'Authorized', avatar: 'https://i.pravatar.cc/150?u=sanjay' },
  { id: 5, name: 'Amit Singh', role: 'Staff', point: 'Main Basement', time: '11:02 PM', action: 'Entry', status: 'Authorized', avatar: 'https://i.pravatar.cc/150?u=amit' },
  { id: 6, name: 'Neha Kakkar', role: 'Staff', point: 'Club Entry', time: '10:50 PM', action: 'Exit', status: 'Authorized', avatar: 'https://i.pravatar.cc/150?u=neha' },
];

export default function GetGateEntry() {
  return (
    <Box sx={{ p: { xs: 2, md: 5 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Page Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6 }}>
        <Box>
          <Typography variant="h3" fontWeight="900" color="#091542">Gate Entry Auditor</Typography>
          <Typography variant="subtitle1" color="text.secondary" fontWeight="700">Real-time RFID biometric access logs & zone security</Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />} 
            sx={{ borderRadius: '16px', fontWeight: 800, borderColor: '#e2e8f0', color: '#091542' }}
          >
            Live Sync
          </Button>
          <Button 
            variant="contained" 
            startIcon={<FilterIcon />} 
            sx={{ borderRadius: '16px', px: 4, fontWeight: 900, bgcolor: '#091542' }}
          >
            Filters
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={4}>
        {/* Access Point Status */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Box sx={{ p: 1, bgcolor: '#eff6ff', borderRadius: '10px', color: '#1d4ed8' }}><GateIcon /></Box>
              <Typography variant="h6" fontWeight="900" color="#091542">Main Basement</Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Chip label="ONLINE" size="small" sx={{ bgcolor: '#f0fdf4', color: '#10b981', fontWeight: 900 }} />
            </Stack>
            <Typography variant="caption" fontWeight="800" color="#94a3b8">LAST ACCESS: 2 MINS AGO</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Box sx={{ p: 1, bgcolor: '#fdf2f8', borderRadius: '10px', color: '#db2777' }}><GateIcon /></Box>
              <Typography variant="h6" fontWeight="900" color="#091542">Club Entry</Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Chip label="ONLINE" size="small" sx={{ bgcolor: '#f0fdf4', color: '#10b981', fontWeight: 900 }} />
            </Stack>
            <Typography variant="caption" fontWeight="800" color="#94a3b8">LAST ACCESS: 5 MINS AGO</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Box sx={{ p: 1, bgcolor: '#fff7ed', borderRadius: '10px', color: '#ea580c' }}><GateIcon /></Box>
              <Typography variant="h6" fontWeight="900" color="#091542">Service Gate</Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Chip label="OFFLINE" size="small" sx={{ bgcolor: '#fef2f2', color: '#ef4444', fontWeight: 900 }} />
            </Stack>
            <Typography variant="caption" fontWeight="800" color="#94a3b8">SYNCING PENDING...</Typography>
          </Paper>
        </Grid>

        {/* Real-time Logs */}
        <Grid size={{ xs: 12 }}>
          <Paper elevation={0} sx={{ borderRadius: '32px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 2 }}>
              <HistoryIcon sx={{ color: '#091542' }} />
              <Typography variant="h6" fontWeight="900" color="#091542">Biometric Entry Logs</Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Typography variant="caption" color="#10b981" fontWeight="800">LIVE UPDATING...</Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800, py: 3, pl: 4 }}>USER IDENTITY</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>USER ROLE</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>ACCESS POINT</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>TIMESTAMP</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>ACTION</TableCell>
                    <TableCell sx={{ fontWeight: 800 }} align="right">AUTH STATUS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ bgcolor: 'white' }}>
                  {mockLogs.map((log) => (
                    <TableRow key={log.id} hover>
                      <TableCell sx={{ py: 2, pl: 4 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar src={log.avatar} sx={{ width: 40, height: 40, border: '2px solid #f1f5f9' }}>{log.name[0]}</Avatar>
                          <Typography variant="body1" fontWeight="800" color="#091542">{log.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip label={log.role} size="small" sx={{ fontWeight: 900, borderRadius: '8px', bgcolor: '#f1f5f9' }} />
                      </TableCell>
                      <TableCell><Typography variant="body2" fontWeight="800" color="#475569">{log.point}</Typography></TableCell>
                      <TableCell><Typography variant="body2" fontWeight="800" color="#091542">{log.time}</Typography></TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CircleIcon sx={{ fontSize: 8, color: log.action === 'Entry' ? '#10b981' : '#f59e0b' }} />
                          <Typography variant="body2" fontWeight="900" color={log.action === 'Entry' ? '#10b981' : '#f59e0b'}>{log.action.toUpperCase()}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="right" sx={{ pr: 4 }}>
                        <Chip 
                          label={log.status} 
                          size="small" 
                          sx={{ 
                            fontWeight: 900, 
                            borderRadius: '8px',
                            bgcolor: log.status === 'Authorized' ? '#f0fdf4' : '#fef2f2',
                            color: log.status === 'Authorized' ? '#10b981' : '#ef4444',
                          }} 
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

    </Box>
  );
}
