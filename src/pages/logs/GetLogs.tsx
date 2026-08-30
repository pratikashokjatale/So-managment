import { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Chip, Stack, IconButton, TextField, InputAdornment, Grid, CircularProgress
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterIcon,
  History as HistoryIcon,
  Security as SecurityIcon,
  Payment as PaymentIcon,
  Apartment as ResidentIcon
} from '@mui/icons-material';
import { getStaffAttendanceStatsApi } from '@/apis/logdasboard';

const mockLogsFallback = [
  { id: 1, type: 'Access', user: 'Rahul Sharma', action: 'Basement Entry', time: '11:42 PM', status: 'Success', detail: 'RFID Card #CMR101-S01', icon: <SecurityIcon sx={{ color: '#24528C' }} />, bgcolor: '#EAF0F7' },
  { id: 2, type: 'Payment', user: 'Graziele Lopes', action: 'Activity Recharge', time: '10:15 PM', status: 'Success', detail: 'Amount: ₹5,000.00 via UPI', icon: <PaymentIcon sx={{ color: '#10b981' }} />, bgcolor: '#f0fdf4' },
  { id: 3, type: 'Resident', user: 'Admin', action: 'New Resident Added', time: '09:30 PM', status: 'Success', detail: 'Graziele Lopes (Flat 1001)', icon: <ResidentIcon sx={{ color: '#7A4FB5' }} />, bgcolor: '#F3E8FF' },
  { id: 4, type: 'Security', user: 'System', action: 'Emergency SOS Triggered', time: '08:45 PM', status: 'Alert', detail: 'Basement Zone B - Resolved', icon: <SecurityIcon sx={{ color: '#ef4444' }} />, bgcolor: '#fef2f2' },
  { id: 5, type: 'Access', user: 'Unknown', action: 'Invalid Card Attempt', time: '07:20 PM', status: 'Denied', detail: 'Main Gate Reader #4', icon: <SecurityIcon sx={{ color: '#f59e0b' }} />, bgcolor: '#fffbeb' },
  { id: 6, type: 'Booking', user: 'Amit Singh', action: 'Squash Court Booked', time: '06:10 PM', status: 'Success', detail: 'Slot: 5:00 PM - 7:00 PM', icon: <HistoryIcon sx={{ color: '#0ea5e9' }} />, bgcolor: '#f0f9ff' },
];

const getLogMeta = (eventType: string) => {
  const type = eventType || 'System';
  switch (type.toLowerCase()) {
    case 'access':
      return {
        icon: <SecurityIcon sx={{ color: '#24528C' }} />,
        bgcolor: '#EAF0F7'
      };
    case 'payment':
      return {
        icon: <PaymentIcon sx={{ color: '#10b981' }} />,
        bgcolor: '#f0fdf4'
      };
    case 'resident':
    case 'user':
      return {
        icon: <ResidentIcon sx={{ color: '#7A4FB5' }} />,
        bgcolor: '#F3E8FF'
      };
    case 'security':
    case 'alert':
      return {
        icon: <SecurityIcon sx={{ color: '#ef4444' }} />,
        bgcolor: '#fef2f2'
      };
    case 'booking':
    case 'facility':
      return {
        icon: <HistoryIcon sx={{ color: '#0ea5e9' }} />,
        bgcolor: '#f0f9ff'
      };
    default:
      return {
        icon: <HistoryIcon sx={{ color: '#64748b' }} />,
        bgcolor: '#f8fafc'
      };
  }
};

const mapStatus = (statusStr: string) => {
  if (!statusStr) return 'Success';
  const s = statusStr.toLowerCase();
  if (s.includes('success') || s === 'active' || s === 'present') return 'Success';
  if (s.includes('fail') || s === 'alert' || s === 'error') return 'Alert';
  if (s.includes('deny') || s.includes('denied') || s === 'invalid') return 'Denied';
  return 'Success';
};

const formatLogTime = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr || '—';
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' ' + date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
};

const getLogsList = (raw: any) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  const d = raw?.data ?? raw;
  if (Array.isArray(d)) return d;
  if (d?.items && Array.isArray(d.items)) return d.items;
  if (d?.data && Array.isArray(d.data)) return d.data;
  if (d?.logs && Array.isArray(d.logs)) return d.logs;
  if (d?.results && Array.isArray(d.results)) return d.results;
  return [];
};

export default function GetLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [logs, setLogs] = useState<any[]>(mockLogsFallback);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await getStaffAttendanceStatsApi();
      const fetchedLogs = getLogsList(res);
      if (fetchedLogs.length > 0) {
        const mapped = fetchedLogs.map((log: any) => {
          const type = log.type || log.eventType || 'Access';
          const meta = getLogMeta(type);
          return {
            id: log.id || Math.random(),
            type: type,
            user: log.actor?.name || log.user?.name || log.actorUserId || 'System',
            action: log.event || log.action || 'Performed Action',
            time: formatLogTime(log.createdAt || log.timestamp || log.time),
            status: mapStatus(log.status),
            detail: log.detail || log.description || '',
            ...meta
          };
        });
        setLogs(mapped);
      } else {
        setLogs([]);
      }
    } catch (error) {
      console.warn('Failed to fetch activity logs, using fallback:', error);
      setLogs(mockLogsFallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    log.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.detail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEventsCount = logs.length;
  const authFailuresCount = logs.filter(log => log.status === 'Denied' || log.status === 'Alert').length;

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Page Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6 }}>
        <Box>
          <Typography variant="h3" fontWeight="900" color="#091542">System Log Auditor</Typography>
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
          <IconButton onClick={fetchLogs} disabled={loading} sx={{ bgcolor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <FilterIcon />
          </IconButton>
        </Stack>
      </Stack>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
            <Typography variant="h6" fontWeight="900" color="#091542" sx={{ mb: 1 }}>Total Events</Typography>
            <Typography variant="h3" fontWeight="900" color="#24528C">
              {loading && logs.length === mockLogsFallback.length ? <CircularProgress size={24} /> : totalEventsCount.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="#64748b" fontWeight="800">AUDIT LEDGER SIZE</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
            <Typography variant="h6" fontWeight="900" color="#091542" sx={{ mb: 1 }}>Auth Failures</Typography>
            <Typography variant="h3" fontWeight="900" color="#ef4444">
              {loading && logs.length === mockLogsFallback.length ? <CircularProgress size={24} /> : authFailuresCount.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="#64748b" fontWeight="800">CRITICAL ALERTS & DENIALS</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Audit Ledger Table with Custom Scroller */}
      <Paper elevation={0} sx={{ borderRadius: '32px', border: '1px solid #e2e8f0', overflow: 'hidden', bgcolor: 'white' }}>
        <TableContainer sx={{ 
          maxHeight: '520px', 
          overflowY: 'auto',
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#cbd5e1",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#94a3b8",
          },
        }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, py: 3, pl: 4, bgcolor: '#f8fafc', color: '#64748b' }}>EVENT TYPE</TableCell>
                <TableCell sx={{ fontWeight: 800, bgcolor: '#f8fafc', color: '#64748b' }}>INITIATOR</TableCell>
                <TableCell sx={{ fontWeight: 800, bgcolor: '#f8fafc', color: '#64748b' }}>ACTION PERFORMED</TableCell>
                <TableCell sx={{ fontWeight: 800, bgcolor: '#f8fafc', color: '#64748b' }}>TIMESTAMP</TableCell>
                <TableCell sx={{ fontWeight: 800, bgcolor: '#f8fafc', color: '#64748b' }}>AUDIT DETAIL</TableCell>
                <TableCell sx={{ fontWeight: 800, bgcolor: '#f8fafc', color: '#64748b' }} align="right">STATUS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && logs.length === mockLogsFallback.length ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                      <CircularProgress size={24} />
                      <Typography fontWeight="700" color="text.secondary">Fetching audit logs...</Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography fontWeight="700" color="text.secondary">No events match your criteria.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell sx={{ py: 2, pl: 4 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ width: 40, height: 40, borderRadius: '12px', bgcolor: log.bgcolor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {log.icon}
                        </Box>
                        <Typography variant="body2" fontWeight="800" color="#091542">{log.type}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="700" color="#1e293b">{log.user}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="800" color="#475569">{log.action}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="800" color="#091542">{log.time}</Typography>
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
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
