import { useState, useEffect, cloneElement } from 'react';
import {
  Box, Typography, CircularProgress, Alert,
  Stack, IconButton, Tooltip, Paper, Chip
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  History as HistoryIcon,
  Security as SecurityIcon,
  Payment as PaymentIcon,
  Apartment as ResidentIcon
} from '@mui/icons-material';
import { getStaffAttendanceStatsApi } from '@/apis/logdasboard';

interface TimelineProps {
  userId: string;
}

const getLogMeta = (eventType: string) => {
  const type = eventType || 'System';
  switch (type.toLowerCase()) {
    case 'access':
      return {
        icon: <SecurityIcon sx={{ color: '#1d4ed8' }} />,
        bgcolor: '#eff6ff',
        color: '#1d4ed8'
      };
    case 'payment':
      return {
        icon: <PaymentIcon sx={{ color: '#10b981' }} />,
        bgcolor: '#f0fdf4',
        color: '#10b981'
      };
    case 'resident':
    case 'user':
      return {
        icon: <ResidentIcon sx={{ color: '#7c3aed' }} />,
        bgcolor: '#f5f3ff',
        color: '#7c3aed'
      };
    case 'security':
    case 'alert':
      return {
        icon: <SecurityIcon sx={{ color: '#ef4444' }} />,
        bgcolor: '#fef2f2',
        color: '#ef4444'
      };
    case 'booking':
    case 'facility':
      return {
        icon: <HistoryIcon sx={{ color: '#0ea5e9' }} />,
        bgcolor: '#f0f9ff',
        color: '#0ea5e9'
      };
    default:
      return {
        icon: <HistoryIcon sx={{ color: '#64748b' }} />,
        bgcolor: '#f8fafc',
        color: '#64748b'
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
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
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

export default function ResidentActivityTimeline({ userId }: TimelineProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLogs = async () => {
    if (!userId) return;
    setLoading(true);
    setError('');
    try {
      const res = await getStaffAttendanceStatsApi({ userId });
      const fetchedLogs = getLogsList(res);
      
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
    } catch (err: any) {
      setError(err?.message || 'Failed to load activity timeline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [userId]);

  return (
    <Box>
      {/* Header Row */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="900" color="#091542">
          Activity Audit Trail
        </Typography>
        <Tooltip title="Refresh History">
          <IconButton
            onClick={fetchLogs}
            size="small"
            disabled={loading}
            sx={{
              bgcolor: '#f1f5f9',
              '&:hover': { bgcolor: '#e2e8f0' },
              borderRadius: '8px',
              width: 34,
              height: 34
            }}
          >
            <RefreshIcon fontSize="small" sx={{ color: '#64748b' }} />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Loading Indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8, gap: 2 }}>
          <CircularProgress size={28} sx={{ color: '#091542' }} />
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            Fetching timeline events…
          </Typography>
        </Box>
      )}

      {/* Error Message */}
      {!loading && error && (
        <Alert severity="error" sx={{ borderRadius: '12px', mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Empty State */}
      {!loading && !error && logs.length === 0 && (
        <Box sx={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          py: 10, gap: 1.5, bgcolor: '#fafbff', borderRadius: '24px',
          border: '1.5px dashed #e2e8f0', textAlign: 'center', px: 4
        }}>
          <HistoryIcon sx={{ fontSize: 48, color: '#cbd5e1' }} />
          <Typography fontWeight={800} color="text.secondary">No events recorded</Typography>
          <Typography variant="caption" color="text.disabled" sx={{ maxWidth: 280 }}>
            There are no biometric scans, entries, or audit records stored for this resident.
          </Typography>
        </Box>
      )}

      {/* Vertical Timeline Card List */}
      {!loading && !error && logs.length > 0 && (
        <Box sx={{
          maxHeight: "500px",
          overflowY: "auto",
          pr: 1.5,
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
          <Box sx={{ position: 'relative', pl: 3, '&::before': {
            content: '""',
            position: 'absolute',
            left: '11px',
            top: '24px',
            bottom: '24px',
            width: '2px',
            bgcolor: '#e2e8f0',
            zIndex: 0
          }}}>
            {logs.map((log) => (
              <Box key={log.id} sx={{ mb: 4, position: 'relative' }}>
                
                {/* Timeline Node Badge Icon */}
                <Box sx={{
                  position: 'absolute',
                  left: '-28px',
                  top: 0,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: log.bgcolor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1,
                  border: '2px solid white',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                  transform: 'scale(1.2)'
                }}>
                  {/* Scale down icon inside timeline dot */}
                  {cloneElement(log.icon, { sx: { fontSize: '12px', color: log.color } })}
                </Box>

                {/* Event Content Card */}
                <Paper elevation={0} sx={{
                  p: 3,
                  ml: 2,
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0',
                  bgcolor: 'white',
                  boxShadow: '0 4px 12px rgba(9, 21, 66, 0.01)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#cbd5e1',
                    boxShadow: '0 8px 20px rgba(9, 21, 66, 0.03)'
                  }
                }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                    <Box>
                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
                        <Typography variant="body2" fontWeight="800" color="#091542">
                          {log.action}
                        </Typography>
                        <Chip
                          label={log.type}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.62rem',
                            fontWeight: 900,
                            bgcolor: log.bgcolor,
                            color: log.color,
                            borderRadius: '6px'
                          }}
                        />
                      </Stack>
                      <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ display: 'block', mb: 1 }}>
                        {log.time}
                      </Typography>
                      {log.detail && (
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                          {log.detail}
                        </Typography>
                      )}
                    </Box>
                    <Chip
                      label={log.status}
                      size="small"
                      sx={{
                        alignSelf: { xs: 'flex-start', sm: 'center' },
                        fontWeight: 900,
                        borderRadius: '8px',
                        bgcolor: log.status === 'Success' ? '#f0fdf4' : (log.status === 'Alert' ? '#fef2f2' : '#fffbeb'),
                        color: log.status === 'Success' ? '#10b981' : (log.status === 'Alert' ? '#ef4444' : '#f59e0b')
                      }}
                    />
                  </Stack>
                </Paper>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
