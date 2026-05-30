import { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, CircularProgress, Alert,
  Stack, IconButton, Tooltip
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  EventNote as EventNoteIcon
} from '@mui/icons-material';
import { api } from '@/utils/axios';

interface AmenitiesProps {
  userId: string;
}

/* ------------------------------------------------------------------ helpers */
const formatTime = (t?: string) => {
  if (!t) return '—';
  const [h, m] = t.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayH = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayH}:${m} ${ampm}`;
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const statusStyle = (status: string) => {
  const s = status?.toUpperCase() || '';
  if (s === 'CONFIRMED') return { bg: '#ecfdf5', color: '#10b981', border: 'rgba(16,185,129,0.2)' };
  if (s === 'COMPLETED') return { bg: '#f1f5f9', color: '#64748b', border: 'rgba(100,116,139,0.1)' };
  if (s === 'PENDING_APPROVAL') return { bg: '#fff7ed', color: '#ea580c', border: 'rgba(234,88,12,0.15)' };
  if (s === 'CANCELLED') return { bg: '#fef2f2', color: '#ef4444', border: 'rgba(239,68,68,0.15)' };
  return { bg: '#f1f5f9', color: '#64748b', border: 'rgba(100,116,139,0.1)' };
};

const statusLabel = (status: string) => {
  const s = status?.toUpperCase() || '';
  if (s === 'PENDING_APPROVAL') return 'Pending';
  if (s) return s.charAt(0) + s.slice(1).toLowerCase();
  return '—';
};

/* ================================================================ Component */
export default function ResidentAmenities({ userId }: AmenitiesProps) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    if (!userId) return;
    setLoading(true);
    setError('');
    try {
      // Call bookings API with userId filter to only show this resident's bookings
      const axiosRes = await api.get('bookings', { params: { userId, limit: 50, page: 1 } });
      const raw = axiosRes?.data;

      // Unwrap: raw.data contains items
      const d = raw?.data ?? raw;
      let list: any[] = [];

      if (Array.isArray(d)) {
        list = d;
      } else if (d?.items && Array.isArray(d.items)) {
        list = d.items;           // ← confirmed shape: data.items
      } else if (d?.bookings && Array.isArray(d.bookings)) {
        list = d.bookings;
      } else if (d?.data && Array.isArray(d.data)) {
        list = d.data;
      } else if (d?.results && Array.isArray(d.results)) {
        list = d.results;
      }

      setBookings(list);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [userId]);

  return (
    <Box>
      {/* Header row */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight="900" color="#091542">
          Amenity Booking Ledger
        </Typography>
        <Tooltip title="Refresh">
          <IconButton
            onClick={fetchBookings}
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

      {/* Loading */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6, gap: 2 }}>
          <CircularProgress size={28} sx={{ color: '#091542' }} />
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            Loading bookings…
          </Typography>
        </Box>
      )}

      {/* Error */}
      {!loading && error && (
        <Alert severity="error" sx={{ borderRadius: '12px', mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Empty */}
      {!loading && !error && bookings.length === 0 && (
        <Box sx={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          py: 8, gap: 1.5, bgcolor: '#fafbff', borderRadius: '20px',
          border: '1.5px dashed #e2e8f0'
        }}>
          <EventNoteIcon sx={{ fontSize: 44, color: '#cbd5e1' }} />
          <Typography fontWeight={700} color="text.secondary">No bookings found</Typography>
          <Typography variant="caption" color="text.disabled">
            This resident has not made any amenity bookings yet.
          </Typography>
        </Box>
      )}

      {/* Table */}
      {!loading && !error && bookings.length > 0 && (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: '20px',
            border: '1px solid rgba(226,232,240,0.8)',
            mb: 5,
            boxShadow: '0 4px 20px rgba(9,21,66,0.01)'
          }}
        >
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                {['ACTIVITY', 'BOOKING CODE', 'SLOTS', 'DATE', 'AMOUNT', 'STATUS'].map((col, i) => (
                  <TableCell
                    key={col}
                    sx={{
                      fontWeight: 800,
                      color: '#64748b',
                      fontSize: '0.72rem',
                      letterSpacing: '0.5px',
                      py: 1.8,
                      textAlign: i >= 4 ? (i === 4 ? 'right' : 'left') : 'left',
                      pl: i === 5 ? 3 : undefined
                    }}
                  >
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((b, idx) => {
                const sStyle = statusStyle(b.status);
                // Derive display values from API fields
                const activityName = b.facility?.name || b.facilityName || '—';
                const startFmt = formatTime(b.startTime);
                const endFmt = formatTime(b.endTime);
                const slotLabel = (b.startTime && b.endTime)
                  ? `${startFmt} – ${endFmt}`
                  : '—';
                const dateLabel = formatDate(b.bookingDate);
                const amount = b.amount
                  ? `₹${parseFloat(b.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                  : '—';

                return (
                  <TableRow
                    key={b.id || idx}
                    hover
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    <TableCell sx={{ fontWeight: 800, color: '#091542', py: 2.2 }}>
                      {activityName}
                    </TableCell>
                    <TableCell sx={{ py: 2.2 }}>
                      <Typography
                        variant="caption"
                        fontWeight={700}
                        sx={{
                          bgcolor: '#f1f5f9',
                          color: '#334155',
                          px: 1,
                          py: 0.4,
                          borderRadius: '6px',
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                          letterSpacing: '0.5px'
                        }}
                      >
                        {b.bookingCode || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2.2, fontSize: '0.85rem' }}>
                      {slotLabel}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2.2, fontSize: '0.85rem' }}>
                      {dateLabel}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 900, color: '#091542', py: 2.2, textAlign: 'right', fontFamily: 'monospace', fontSize: '0.92rem' }}>
                      {amount}
                    </TableCell>
                    <TableCell sx={{ py: 2.2, pl: 3 }}>
                      <Chip
                        label={statusLabel(b.status)}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          fontSize: '0.72rem',
                          borderRadius: '8px',
                          bgcolor: sStyle.bg,
                          color: sStyle.color,
                          border: `1px solid ${sStyle.border}`
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
