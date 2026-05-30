import { useState, useEffect } from 'react';
import { 
  Box, Typography, Breadcrumbs, Link, CircularProgress, Stack, Button, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Divider, Grid, Select, MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import StatusBadge from '../../components/StatusBadge';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import PaymentIcon from '@mui/icons-material/Payment';

import { 
  getBookingsApi, 
  approveBookingApi, 
  rejectBookingApi, 
  cancelBookingApi,
  updateBookingPaymentApi 
} from '@/apis/booking';

// Google Calendar styling (Full Width)
const calendarStyles = {
  '.react-calendar': {
    width: '100%',
    border: 'none',
    fontFamily: 'inherit',
    backgroundColor: 'transparent',
  },
  '.react-calendar__viewContainer': {
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  },
  '.react-calendar__navigation': {
    display: 'flex',
    marginBottom: '24px',
    '& button': {
      minWidth: '44px',
      background: 'none',
      border: 'none',
      fontSize: '1.2rem',
      fontWeight: 600,
      color: '#091542',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '8px',
      transition: '0.2s',
      '&:hover': {
        backgroundColor: '#f1f5f9',
      },
    }
  },
  '.react-calendar__month-view__weekdays': {
    fontWeight: 600,
    fontSize: '0.825rem',
    color: '#64748b',
    textTransform: 'none',
    borderBottom: '1px solid #f0f0f0',
    '& abbr': {
      padding: '6px 0',
      textDecoration: 'none',
      display: 'block',
    }
  },
  '.react-calendar__month-view__days': {
    backgroundColor: '#f8fafc',
  },
  '.react-calendar__tile': {
    height: '100px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    padding: '4px 2px',
    boxSizing: 'border-box',
    borderRight: '1px solid #e2e8f0',
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    transition: '0.2s',
    '&:hover': {
      backgroundColor: '#f8fafc',
    },
    '& abbr': {
      alignSelf: 'flex-end',
      marginRight: '4px',
      marginBottom: '2px',
      fontSize: '0.8rem',
      fontWeight: 700,
      color: '#475569',
      textDecoration: 'none',
      display: 'block',
    }
  },
  '.react-calendar__tile--now': {
    backgroundColor: '#f0f9ff',
    '& abbr': {
      color: '#0284c7',
      fontWeight: 'bold',
      backgroundColor: '#bae6fd',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    '&:hover': {
      backgroundColor: '#e0f2fe',
    },
  },
  '.react-calendar__tile--active': {
    backgroundColor: '#f1f5f9 !important',
    color: '#0f172a !important',
    border: '2px solid #3b82f6 !important',
    '& abbr': {
      color: '#3b82f6',
    }
  },
  '.react-calendar__month-view__days__tile--neighboringMonth': {
    color: '#cbd5e1',
    backgroundColor: '#f8fafc',
    '& abbr': {
      color: '#cbd5e1',
    }
  },
};

const formatYMD = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'CONFIRMED':
      return '#2e7d32'; // Green
    case 'PENDING':
      return '#ed6c02'; // Orange
    case 'CANCELLED':
    case 'REJECTED':
      return '#d32f2f'; // Red
    default:
      return '#757575'; // Grey
  }
};

export default function BookingCalendar() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // List Dialog state
  const [listDialogOpen, setListDialogOpen] = useState(false);

  // Details Modal state
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [showCancelInput, setShowCancelInput] = useState(false);
  const [paymentStatusVal, setPaymentStatusVal] = useState<any>('PENDING');

  // Inline Reject Dialog
  const [inlineRejectOpen, setInlineRejectOpen] = useState(false);
  const [rejectBookingId, setRejectBookingId] = useState<string | null>(null);
  const [inlineRejectReason, setInlineRejectReason] = useState('');

  const fetchCalendarBookings = async (dateFrom?: string, dateTo?: string) => {
    setLoading(true);
    try {
      const params: any = { limit: 100 };
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;
      
      const res = await getBookingsApi(params);
      if (res?.success && res?.data?.items) {
        setBookings(res.data.items);
      }
    } catch (err) {
      console.error('Failed to load calendar bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const now = new Date();
    const startOfMonth = formatYMD(new Date(now.getFullYear(), now.getMonth(), 1));
    const endOfMonth = formatYMD(new Date(now.getFullYear(), now.getMonth() + 1, 0));
    fetchCalendarBookings(startOfMonth, endOfMonth);
  }, []);

  const handleActiveStartDateChange = ({ activeStartDate, view }: any) => {
    if (activeStartDate && view === 'month') {
      const startOfMonth = formatYMD(new Date(activeStartDate.getFullYear(), activeStartDate.getMonth(), 1));
      const endOfMonth = formatYMD(new Date(activeStartDate.getFullYear(), activeStartDate.getMonth() + 1, 0));
      fetchCalendarBookings(startOfMonth, endOfMonth);
    }
  };

  const refreshBookings = () => {
    const startOfMonth = formatYMD(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    const endOfMonth = formatYMD(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0));
    fetchCalendarBookings(startOfMonth, endOfMonth);
  };

  const getBookingsForDate = (date: Date) => {
    const formatted = formatYMD(date);
    return bookings.filter(b => {
      if (!b.bookingDate) return false;
      if (b.bookingDate === formatted || b.bookingDate.startsWith(formatted)) {
        return true;
      }
      try {
        const bDate = new Date(b.bookingDate);
        return bDate.getFullYear() === date.getFullYear() &&
               bDate.getMonth() === date.getMonth() &&
               bDate.getDate() === date.getDate();
      } catch (e) {
        return false;
      }
    });
  };

  const selectedDateBookings = getBookingsForDate(selectedDate);

  const tileContent = ({ date, view }: { date: Date, view: string }) => {
    if (view === 'month') {
      const dayBookings = getBookingsForDate(date);
      if (dayBookings.length > 0) {
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5, width: '100%', px: 0.5, overflow: 'hidden' }}>
            {dayBookings.slice(0, 1).map((b, idx) => (
              <Box 
                key={b.id || idx} 
                sx={{ 
                  bgcolor: `${getStatusColor(b.status)}12`, 
                  color: getStatusColor(b.status),
                  borderLeft: `3px solid ${getStatusColor(b.status)}`,
                  px: 0.6,
                  py: 0.2,
                  borderRadius: '3px',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  textAlign: 'left',
                  lineHeight: 1.3
                }}
              >
                {b.startTime?.substring(0, 5)} {b.facility?.name}
              </Box>
            ))}
            {dayBookings.length > 1 && (
              <Typography variant="caption" sx={{ fontSize: '0.62rem', color: 'text.secondary', fontWeight: 800, pl: 0.5, textAlign: 'left' }}>
                +{dayBookings.length - 1} more
              </Typography>
            )}
          </Box>
        );
      }
    }
    return null;
  };

  // Actions
  const openDetails = (booking: any) => {
    setSelectedBooking(booking);
    setPaymentStatusVal(booking.paymentStatus);
    setRejectReason('');
    setCancelReason('');
    setShowRejectInput(false);
    setShowCancelInput(false);
    setDetailsOpen(true);
  };

  const handleApprove = async (bookingId: string) => {
    setActionLoading(true);
    try {
      const res = await approveBookingApi(bookingId);
      if (res?.success) {
        setDetailsOpen(false);
        // Refresh details if open
        if (selectedBooking && selectedBooking.id === bookingId) {
          setSelectedBooking({ ...selectedBooking, status: 'CONFIRMED' });
        }
        refreshBookings();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!selectedBooking) return;
    if (!rejectReason.trim()) return;
    setActionLoading(true);
    try {
      const res = await rejectBookingApi(selectedBooking.id, { reason: rejectReason });
      if (res?.success) {
        setDetailsOpen(false);
        refreshBookings();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelSubmit = async () => {
    if (!selectedBooking) return;
    if (!cancelReason.trim()) return;
    setActionLoading(true);
    try {
      const res = await cancelBookingApi(selectedBooking.id, { reason: cancelReason });
      if (res?.success) {
        setDetailsOpen(false);
        refreshBookings();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdatePayment = async () => {
    if (!selectedBooking) return;
    setActionLoading(true);
    try {
      const res = await updateBookingPaymentApi(selectedBooking.id, { paymentStatus: paymentStatusVal });
      if (res?.success) {
        setSelectedBooking({ ...selectedBooking, paymentStatus: paymentStatusVal });
        refreshBookings();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleInlineRejectClick = (bookingId: string) => {
    setRejectBookingId(bookingId);
    setInlineRejectReason('');
    setInlineRejectOpen(true);
  };

  const handleInlineRejectSubmit = async () => {
    if (!rejectBookingId || !inlineRejectReason.trim()) return;
    setActionLoading(true);
    try {
      const res = await rejectBookingApi(rejectBookingId, { reason: inlineRejectReason });
      if (res?.success) {
        setInlineRejectOpen(false);
        refreshBookings();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#ffffff', minHeight: '100vh', borderRadius: 2 }}>
      
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: '#091542' }}>
          Bookings Calendar
        </Typography>
</Box>

      {/* Main Grid: Full Width Calendar */}
      <Box sx={{ position: 'relative' }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, bgcolor: 'rgba(255, 255, 255, 0.5)', zIndex: 2 }}>
            <CircularProgress />
          </Box>
        )}
        
        <Box sx={calendarStyles}>
          <Calendar 
            onChange={(val: any) => {
              setSelectedDate(val);
              setListDialogOpen(true);
            }} 
            value={selectedDate} 
            tileContent={tileContent}
            onActiveStartDateChange={handleActiveStartDateChange}
            locale="en-US"
          />
        </Box>
      </Box>

      {/* Day Bookings List Dialog */}
      <Dialog 
        open={listDialogOpen} 
        onClose={() => setListDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box>
            <Typography variant="h5" fontWeight="bold" color="#091542">
              Bookings Overview
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {selectedDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </Typography>
          </Box>
          <Typography variant="subtitle1" color="primary" fontWeight="bold">
            {selectedDateBookings.length} Booking{selectedDateBookings.length !== 1 ? 's' : ''}
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ py: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Code</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Time</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Facility</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Member</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569', textAlign: 'right' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedDateBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        No bookings scheduled for this date.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  selectedDateBookings.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ fontWeight: 600, color: '#0047b3' }}>{row.bookingCode}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {row.startTime?.substring(0, 5)} - {row.endTime?.substring(0, 5)}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{row.facility?.name}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.user?.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{row.user?.role}</Typography>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={row.status} variantType="text" />
                      </TableCell>
                      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                        <IconButton size="small" onClick={() => openDetails(row)} title="View Details">
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                        {row.status === 'PENDING' && (
                          <>
                            <IconButton 
                              size="small" 
                              sx={{ color: 'success.main', ml: 0.5 }} 
                              onClick={() => handleApprove(row.id)}
                              disabled={actionLoading}
                              title="Approve"
                            >
                              <CheckCircleOutlineIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              sx={{ color: 'error.main', ml: 0.5 }} 
                              onClick={() => handleInlineRejectClick(row.id)}
                              disabled={actionLoading}
                              title="Reject"
                            >
                              <HighlightOffIcon fontSize="small" />
                            </IconButton>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={() => setListDialogOpen(false)} sx={{ textTransform: 'none' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Details Dialog */}
      <Dialog 
        open={detailsOpen} 
        onClose={() => !actionLoading && setDetailsOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: '12px', p: 1 }
        }}
      >
        {selectedBooking && (
          <>
            <DialogTitle sx={{ pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" fontWeight="bold" color="#091542">
                Booking Details
              </Typography>
              <Typography variant="subtitle1" fontWeight="600" color="primary">
                {selectedBooking.bookingCode}
              </Typography>
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ py: 3 }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>FACILITY</Typography>
                  <Typography variant="body1" fontWeight="600" color="#091542">
                    {selectedBooking.facility?.name} ({selectedBooking.facility?.code})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Location: {selectedBooking.facility?.location || 'N/A'}, Floor: {selectedBooking.facility?.floor || 'N/A'}
                  </Typography>
                  
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>DATE & TIME</Typography>
                    <Typography variant="body1" fontWeight="500">
                      Date: {selectedBooking.bookingDate}
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      Time: {selectedBooking.startTime?.substring(0, 5)} - {selectedBooking.endTime?.substring(0, 5)}
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>PRICING & BILLING</Typography>
                    <Typography variant="body1" fontWeight="600">
                      Amount: {selectedBooking.amount} {selectedBooking.currency}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>USER INFO</Typography>
                  <Typography variant="body1" fontWeight="600" color="#091542">
                    {selectedBooking.user?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Role: {selectedBooking.user?.role}</Typography>
                  <Typography variant="body2" color="text.secondary">Email: {selectedBooking.user?.email}</Typography>
                  
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>STATUSES</Typography>
                    <Stack direction="row" spacing={1.5} sx={{ mt: 0.5 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">Booking</Typography>
                        <StatusBadge status={selectedBooking.status} variantType="text" />
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">Payment</Typography>
                        <StatusBadge status={selectedBooking.paymentStatus} variantType="text" />
                      </Box>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>

              {/* Payment update panel */}
              <Divider sx={{ my: 3 }} />
              <Box sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: '8px' }}>
                <Typography variant="subtitle1" fontWeight="600" color="#091542" sx={{ mb: 2 }}>
                  Update Payment Status (Admin Only)
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Select 
                    value={paymentStatusVal} 
                    onChange={(e) => setPaymentStatusVal(e.target.value as any)}
                    size="small"
                    sx={{ bgcolor: '#ffffff', minWidth: 150 }}
                  >
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="PAID">Paid</MenuItem>
                    <MenuItem value="FAILED">Failed</MenuItem>
                    <MenuItem value="REFUNDED">Refunded</MenuItem>
                  </Select>
                  <Button 
                    variant="contained" 
                    color="primary"
                    startIcon={<PaymentIcon />}
                    onClick={handleUpdatePayment}
                    disabled={actionLoading}
                    sx={{ textTransform: 'none', boxShadow: 'none' }}
                  >
                    Update Payment
                  </Button>
                </Stack>
              </Box>

              {showRejectInput && (
                <Box sx={{ mt: 2 }}>
                  <TextField
                    label="Reason for Rejection"
                    fullWidth
                    multiline
                    rows={2}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    sx={{ mt: 1 }}
                  />
                </Box>
              )}

              {showCancelInput && (
                <Box sx={{ mt: 2 }}>
                  <TextField
                    label="Reason for Cancellation"
                    fullWidth
                    multiline
                    rows={2}
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    sx={{ mt: 1 }}
                  />
                </Box>
              )}
            </DialogContent>
            <Divider />
            <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
              {selectedBooking.status === 'PENDING' && (
                <>
                  <Button 
                    variant="contained" 
                    color="success"
                    startIcon={<CheckCircleOutlineIcon />}
                    onClick={() => handleApprove(selectedBooking.id)}
                    disabled={actionLoading}
                    sx={{ textTransform: 'none', boxShadow: 'none' }}
                  >
                    Approve
                  </Button>
                  <Button 
                    variant="contained" 
                    color="error"
                    startIcon={<HighlightOffIcon />}
                    onClick={() => {
                      if (!showRejectInput) {
                        setShowRejectInput(true);
                      } else {
                        handleRejectSubmit();
                      }
                    }}
                    disabled={actionLoading}
                    sx={{ textTransform: 'none', boxShadow: 'none' }}
                  >
                    {showRejectInput ? 'Confirm Reject' : 'Reject'}
                  </Button>
                </>
              )}
              {selectedBooking.status !== 'CANCELLED' && selectedBooking.status !== 'REJECTED' && (
                <Button 
                  variant="outlined" 
                  color="warning"
                  onClick={() => {
                    if (!showCancelInput) {
                      setShowCancelInput(true);
                    } else {
                      handleCancelSubmit();
                    }
                  }}
                  disabled={actionLoading}
                  sx={{ textTransform: 'none' }}
                >
                  {showCancelInput ? 'Confirm Cancel' : 'Cancel Booking'}
                </Button>
              )}
              <Button 
                variant="outlined" 
                color="inherit" 
                onClick={() => setDetailsOpen(false)}
                disabled={actionLoading}
                sx={{ textTransform: 'none' }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Inline Reject Dialog */}
      <Dialog open={inlineRejectOpen} onClose={() => !actionLoading && setInlineRejectOpen(false)}>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#091542' }}>Reject Booking Request</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Please enter a reason for rejecting this booking request.
          </Typography>
          <TextField
            label="Rejection Reason"
            fullWidth
            multiline
            rows={3}
            value={inlineRejectReason}
            onChange={(e) => setInlineRejectReason(e.target.value)}
            autoFocus
            disabled={actionLoading}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setInlineRejectOpen(false)} color="inherit" sx={{ textTransform: 'none' }} disabled={actionLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleInlineRejectSubmit} 
            color="error" 
            variant="contained" 
            sx={{ textTransform: 'none', boxShadow: 'none' }}
            disabled={actionLoading}
          >
            Confirm Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
