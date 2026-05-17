import { useState } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Chip, Stack, IconButton, TextField, InputAdornment, Grid
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterIcon,
  History as HistoryIcon,
  Security as SecurityIcon,
  Payment as PaymentIcon,
  Apartment as ResidentIcon
} from '@mui/icons-material';

const mockLogs = [
  { id: 1, type: 'Access', user: 'Rahul Sharma', action: 'Basement Entry', time: '11:42 PM', status: 'Success', detail: 'RFID Card #CMR101-S01', icon: <SecurityIcon sx={{ color: '#1d4ed8' }} />, bgcolor: '#eff6ff' },
  { id: 2, type: 'Payment', user: 'Graziele Lopes', action: 'Activity Recharge', time: '10:15 PM', status: 'Success', detail: 'Amount: ₹5,000.00 via UPI', icon: <PaymentIcon sx={{ color: '#10b981' }} />, bgcolor: '#f0fdf4' },
  { id: 3, type: 'Resident', user: 'Admin', action: 'New Resident Added', time: '09:30 PM', status: 'Success', detail: 'Graziele Lopes (Flat 1001)', icon: <ResidentIcon sx={{ color: '#7c3aed' }} />, bgcolor: '#f5f3ff' },
  { id: 4, type: 'Security', user: 'System', action: 'Emergency SOS Triggered', time: '08:45 PM', status: 'Alert', detail: 'Basement Zone B - Resolved', icon: <SecurityIcon sx={{ color: '#ef4444' }} />, bgcolor: '#fef2f2' },
  { id: 5, type: 'Access', user: 'Unknown', action: 'Invalid Card Attempt', time: '07:20 PM', status: 'Denied', detail: 'Main Gate Reader #4', icon: <SecurityIcon sx={{ color: '#f59e0b' }} />, bgcolor: '#fffbeb' },
  { id: 6, type: 'Booking', user: 'Amit Singh', action: 'Squash Court Booked', time: '06:10 PM', status: 'Success', detail: 'Slot: 5:00 PM - 7:00 PM', icon: <HistoryIcon sx={{ color: '#0ea5e9' }} />, bgcolor: '#f0f9ff' },
];

export default function GetLogs() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Page Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6 }}>
        <Box>
          <Typography variant="h3" fontWeight="900" color="#002855">System Log Auditor</Typography>
          <Typography variant="subtitle1" color="text.secondary" fontWeight="700">Comprehensive audit trails for every biometric and financial event</Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <TextField 
            size="small"
            placeholder="Search audit trail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#64748b' }} />
                  </InputAdornment>
                ),
              }
            }}
            sx={{ width: 350, '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: 'white' } }}
          />
          <IconButton sx={{ bgcolor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <FilterIcon />
          </IconButton>
        </Stack>
      </Stack>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
            <Typography variant="h6" fontWeight="900" color="#002855" sx={{ mb: 1 }}>Total Events</Typography>
            <Typography variant="h3" fontWeight="900" color="#1d4ed8">2,450</Typography>
            <Typography variant="caption" color="#64748b" fontWeight="800">LAST 24 HOURS</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
            <Typography variant="h6" fontWeight="900" color="#002855" sx={{ mb: 1 }}>Auth Failures</Typography>
            <Typography variant="h3" fontWeight="900" color="#ef4444">12</Typography>
            <Typography variant="caption" color="#64748b" fontWeight="800">CRITICAL ALERTS</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Audit Ledger */}
      <Paper elevation={0} sx={{ borderRadius: '32px', border: '1px solid #e2e8f0', overflow: 'hidden', bgcolor: 'white' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, py: 3, pl: 4 }}>EVENT TYPE</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>INITIATOR</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>ACTION PERFORMED</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>TIMESTAMP</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>AUDIT DETAIL</TableCell>
                <TableCell sx={{ fontWeight: 800 }} align="right">STATUS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockLogs.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell sx={{ py: 2, pl: 4 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={{ width: 40, height: 40, borderRadius: '12px', bgcolor: log.bgcolor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {log.icon}
                      </Box>
                      <Typography variant="body2" fontWeight="800" color="#002855">{log.type}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="700" color="#1e293b">{log.user}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="800" color="#475569">{log.action}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="800" color="#002855">{log.time}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" fontWeight="700" color="#64748b">{log.detail}</Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ pr: 4 }}>
                    <Chip 
                      label={log.status} 
                      size="small" 
                      sx={{ 
                        fontWeight: 900, 
                        borderRadius: '8px',
                        bgcolor: log.status === 'Success' ? '#f0fdf4' : (log.status === 'Alert' ? '#fef2f2' : '#fffbeb'),
                        color: log.status === 'Success' ? '#10b981' : (log.status === 'Alert' ? '#ef4444' : '#f59e0b'),
                      }} 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
