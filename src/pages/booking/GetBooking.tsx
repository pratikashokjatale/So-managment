import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, 
  Select, MenuItem, Breadcrumbs, Link, Stack, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, Alert, CircularProgress,
  Snackbar, Grid, Divider, Tabs, Tab
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import BlockIcon from '@mui/icons-material/Block';
import PaymentIcon from '@mui/icons-material/Payment';

import Pagination from '../../components/Pagination';
import StatusBadge from '../../components/StatusBadge';
import Search from '@/components/Search';

import { 
  getBookingsApi, 
  cancelBookingApi, 
  approveBookingApi, 
  rejectBookingApi, 
  updateBookingPaymentApi 
} from '@/apis/booking';
import { getFacilitiesApi } from '@/apis/facility';

export default function GetBooking() {
  const navigate = useNavigate();
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'ALL' | 'REQUESTS'>('ALL');
  const [pendingCount, setPendingCount] = useState(0);
  const [allCount, setAllCount] = useState(0);

  // List State
  const [bookings, setBookings] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalBookings, setTotalBookings] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [facilityFilter, setFacilityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Dialog / Action States
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [showCancelInput, setShowCancelInput] = useState(false);
  const [paymentStatusVal, setPaymentStatusVal] = useState<any>('PENDING');
  const [actionLoading, setActionLoading] = useState(false);

  // Inline Dialog States
  const [inlineRejectOpen, setInlineRejectOpen] = useState(false);
  const [rejectBookingId, setRejectBookingId] = useState<string | null>(null);
  const [inlineRejectReason, setInlineRejectReason] = useState('');

  // Toast State
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const showToast = (message: string, severity: 'success' | 'error' = 'success') => {
    setToast({ open: true, message, severity });
  };

  const fetchFacilities = async () => {
    try {
      const res = await getFacilitiesApi({ limit: 100 });
      if (res?.success && res?.data?.items) {
        setFacilities(res.data.items);
      }
    } catch (err: any) {
      console.error("Failed to fetch facilities:", err);
    }
  };

  const fetchPendingCount = async () => {
    try {
      const res = await getBookingsApi({ status: 'PENDING', limit: 1 });
      if (res?.success && res?.data?.pagination) {
        setPendingCount(res.data.pagination.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch pending count:", err);
    }
  };

  const fetchAllCount = async () => {
    try {
      const res = await getBookingsApi({ limit: 1 });
      if (res?.success && res?.data?.pagination) {
        setAllCount(res.data.pagination.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch all count:", err);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: rowsPerPage,
      };

      if (facilityFilter !== 'ALL') params.facilityId = facilityFilter;
      
      // Handle status filter by active tab state
      if (activeTab === 'REQUESTS') {
        params.status = 'PENDING';
      } else if (statusFilter !== 'ALL') {
        params.status = statusFilter;
      }
      
      if (paymentStatusFilter !== 'ALL') params.paymentStatus = paymentStatusFilter;
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;

      const res = await getBookingsApi(params);
      if (res?.success && res?.data) {
        setBookings(res.data.items || []);
        setTotalBookings(res.data.pagination?.total || 0);
      }

      fetchPendingCount();
      fetchAllCount();
    } catch (err: any) {
      showToast(err?.message || 'Failed to fetch bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [page, rowsPerPage, facilityFilter, statusFilter, paymentStatusFilter, dateFrom, dateTo, activeTab]);

  const handlePageChange = (_event: any, value: number) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const openDetails = (booking: any) => {
    setSelectedBooking(booking);
    setPaymentStatusVal(booking.paymentStatus);
    setRejectReason('');
    setCancelReason('');
    setShowRejectInput(false);
    setShowCancelInput(false);
    setDetailsOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedBooking) return;
    setActionLoading(true);
    try {
      const res = await approveBookingApi(selectedBooking.id);
      if (res?.success) {
        showToast('Booking approved successfully');
        setDetailsOpen(false);
        fetchBookings();
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to approve booking', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedBooking) return;
    if (!showRejectInput) {
      setShowRejectInput(true);
      return;
    }
    if (!rejectReason.trim()) {
      showToast('Please provide a rejection reason', 'error');
      return;
    }
    setActionLoading(true);
    try {
      const res = await rejectBookingApi(selectedBooking.id, { reason: rejectReason });
      if (res?.success) {
        showToast('Booking rejected successfully');
        setDetailsOpen(false);
        fetchBookings();
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to reject booking', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedBooking) return;
    if (!showCancelInput) {
      setShowCancelInput(true);
      return;
    }
    if (!cancelReason.trim()) {
      showToast('Please provide a cancellation reason', 'error');
      return;
    }
    setActionLoading(true);
    try {
      const res = await cancelBookingApi(selectedBooking.id, { reason: cancelReason });
      if (res?.success) {
        showToast('Booking cancelled successfully');
        setDetailsOpen(false);
        fetchBookings();
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to cancel booking', 'error');
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
        showToast('Payment status updated successfully');
        setSelectedBooking({ ...selectedBooking, paymentStatus: paymentStatusVal });
        fetchBookings();
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to update payment status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Inline Actions
  const handleInlineApprove = async (bookingId: string) => {
    setActionLoading(true);
    try {
      const res = await approveBookingApi(bookingId);
      if (res?.success) {
        showToast('Booking approved successfully');
        fetchBookings();
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to approve booking', 'error');
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
    if (!rejectBookingId) return;
    if (!inlineRejectReason.trim()) {
      showToast('Please provide a rejection reason', 'error');
      return;
    }
    setActionLoading(true);
    try {
      const res = await rejectBookingApi(rejectBookingId, { reason: inlineRejectReason });
      if (res?.success) {
        showToast('Booking rejected successfully');
        setInlineRejectOpen(false);
        fetchBookings();
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to reject booking', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'REQUESTS' && b.status?.toUpperCase() !== 'PENDING') {
      return false;
    }
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const facilityName = b.facility?.name?.toLowerCase() || '';
    const userName = b.user?.name?.toLowerCase() || '';
    const code = b.bookingCode?.toLowerCase() || '';
    return facilityName.includes(query) || userName.includes(query) || code.includes(query);
  });

  const filterSelectSx = {
    height: 40,
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'text.primary',
    borderRadius: '10px',
    bgcolor: '#f8fafc',
    '.MuiOutlinedInput-notchedOutline': { border: 'none' },
    minWidth: 150
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#ffffff', minHeight: '100vh', borderRadius: 2 }}>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: '#091542' }}>
          Bookings List
        </Typography>
        <Breadcrumbs separator=">" aria-label="breadcrumb">
          <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
            Dashboard
          </Link>
          <Typography color="text.primary">Bookings</Typography>
        </Breadcrumbs>
      </Box>

      {/* Tabs Menu */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(_e, val) => {
            setActiveTab(val);
            setPage(1);
          }}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab 
            label={
              <Stack direction="row" spacing={1} alignItems="center">
                <span>All Bookings</span>
                {allCount > 0 && (
                  <Box sx={{ bgcolor: 'grey.300', color: 'text.primary', px: 1, py: 0.1, borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800 }}>
                    {allCount}
                  </Box>
                )}
              </Stack>
            } 
            value="ALL" 
            sx={{ fontWeight: 600, textTransform: 'none' }} 
          />
          <Tab 
            label={
              <Stack direction="row" spacing={1} alignItems="center">
                <span>Booking Requests</span>
                {pendingCount > 0 && (
                  <Box sx={{ bgcolor: 'error.main', color: 'white', px: 1, py: 0.1, borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800 }}>
                    {pendingCount}
                  </Box>
                )}
              </Stack>
            } 
            value="REQUESTS" 
            sx={{ fontWeight: 600, textTransform: 'none' }} 
          />
        </Tabs>
      </Box>

      {/* Search & Top Action buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Search 
          placeholder="Search by name, facility or booking code..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: { xs: '100%', md: 380 }, '& fieldset': { borderRadius: '8px' } }}
        />
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="text" 
            startIcon={<CalendarMonthIcon />} 
            onClick={() => navigate('/booking/calendar')}
            sx={{ color: 'text.primary', fontWeight: 600, textTransform: 'none' }}
          >
            Calendar
          </Button>
          <Button 
            variant="text" 
            startIcon={<DownloadIcon />} 
            sx={{ color: 'text.primary', fontWeight: 600, textTransform: 'none' }}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Filters Section */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, color: 'text.secondary' }}>Facility</Typography>
          <Select value={facilityFilter} onChange={(e) => setFacilityFilter(e.target.value as string)} sx={filterSelectSx}>
            <MenuItem value="ALL">All Facilities</MenuItem>
            {facilities.map((fac) => (
              <MenuItem key={fac.id} value={fac.id}>{fac.name}</MenuItem>
            ))}
          </Select>
        </Box>

        {activeTab !== 'REQUESTS' && (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, color: 'text.secondary' }}>Booking Status</Typography>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as string)} sx={filterSelectSx}>
              <MenuItem value="ALL">All Status</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="CONFIRMED">Confirmed</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
            </Select>
          </Box>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, color: 'text.secondary' }}>Payment Status</Typography>
          <Select value={paymentStatusFilter} onChange={(e) => setPaymentStatusFilter(e.target.value as string)} sx={filterSelectSx}>
            <MenuItem value="ALL">All Payments</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="PAID">Paid</MenuItem>
            <MenuItem value="FAILED">Failed</MenuItem>
            <MenuItem value="REFUNDED">Refunded</MenuItem>
          </Select>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, color: 'text.secondary' }}>Date From</Typography>
          <TextField 
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ 
              bgcolor: '#f8fafc', 
              borderRadius: '10px', 
              '& fieldset': { border: 'none' },
              '& input': { height: 40, py: 0, fontSize: '0.875rem' }
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, color: 'text.secondary' }}>Date To</Typography>
          <TextField 
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ 
              bgcolor: '#f8fafc', 
              borderRadius: '10px', 
              '& fieldset': { border: 'none' },
              '& input': { height: 40, py: 0, fontSize: '0.875rem' }
            }}
          />
        </Box>
      </Box>

      {/* Table Section */}
      <TableContainer sx={{ overflowX: 'auto', minHeight: '300px', position: 'relative' }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, bgcolor: 'rgba(255, 255, 255, 0.7)', zIndex: 2 }}>
            <CircularProgress color="primary" />
          </Box>
        )}
        <Table sx={{ minWidth: 800 }} aria-label="bookings table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#091542', fontWeight: 600, borderBottom: 'none' }}>Booking Code</TableCell>
              <TableCell sx={{ color: '#091542', fontWeight: 600, borderBottom: 'none' }}>Date</TableCell>
                      <TableCell sx={{ color: '#091542', fontWeight: 600, borderBottom: 'none' }}>Time</TableCell>
              <TableCell sx={{ color: '#091542', fontWeight: 600, borderBottom: 'none' }}>Facility</TableCell>
              <TableCell sx={{ color: '#091542', fontWeight: 600, borderBottom: 'none' }}>Member</TableCell>
              <TableCell sx={{ color: '#091542', fontWeight: 600, borderBottom: 'none' }}>Booking Status</TableCell>
              <TableCell sx={{ color: '#091542', fontWeight: 600, borderBottom: 'none' }}>Payment</TableCell>
              <TableCell sx={{ color: '#091542', fontWeight: 600, borderBottom: 'none' }}>Amount</TableCell>
              <TableCell sx={{ color: '#091542', fontWeight: 600, borderBottom: 'none', textAlign: 'right' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" color="text.secondary">No bookings found matching filters.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                    <Typography variant="body2" sx={{ color: '#0047b3', fontWeight: 600 }}>{row.bookingCode}</Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                    <Typography variant="body2" sx={{ color: '#091542', fontWeight: 500 }}>
                      {row.bookingDate} 
                    </Typography>
                  </TableCell>
                         <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                    <Typography variant="body2" sx={{ color: '#091542', fontWeight: 500 }}>
                      {row.startTime?.substring(0, 5)} - {row.endTime?.substring(0, 5)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                    <Typography variant="body2" sx={{ color: '#091542' }}>{row.facility?.name || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                    <Typography variant="body2" sx={{ color: '#091542', fontWeight: 500 }}>{row.user?.name || 'N/A'}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{row.user?.role || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                    <StatusBadge status={row.status} variantType="text" />
                  </TableCell>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                    <StatusBadge status={row.paymentStatus} variantType="text" />
                  </TableCell>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                    <Typography variant="body2" sx={{ color: '#091542', fontWeight: 500 }}>
                      {row.amount} {row.currency}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ borderBottomColor: '#f0f0f0', whiteSpace: 'nowrap' }}>
                    {activeTab === 'REQUESTS' ? (
                      <>
                        <IconButton 
                          size="small" 
                          sx={{ color: 'success.main', mr: 1 }} 
                          onClick={() => handleInlineApprove(row.id)}
                          disabled={actionLoading}
                          title="Accept Booking"
                        >
                          <CheckCircleOutlineIcon fontSize="medium" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          sx={{ color: 'error.main' }} 
                          onClick={() => handleInlineRejectClick(row.id)}
                          disabled={actionLoading}
                          title="Reject Booking"
                        >
                          <HighlightOffIcon fontSize="medium" />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton 
                          size="small" 
                          sx={{ color: 'text.secondary', mr: 0.5 }} 
                          onClick={() => openDetails(row)}
                          title="View Details"
                        >
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                        {row.status === 'PENDING' && (
                          <>
                            <IconButton 
                              size="small" 
                              sx={{ color: 'success.main', mr: 0.5 }} 
                              onClick={() => handleInlineApprove(row.id)}
                              disabled={actionLoading}
                              title="Accept Booking"
                            >
                              <CheckCircleOutlineIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              sx={{ color: 'error.main' }} 
                              onClick={() => handleInlineRejectClick(row.id)}
                              disabled={actionLoading}
                              title="Reject Booking"
                            >
                              <HighlightOffIcon fontSize="small" />
                            </IconButton>
                          </>
                        )}
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Section */}
      <Box sx={{ mt: 2 }}>
        <Pagination 
          page={page} 
          totalResults={totalBookings} 
          rowsPerPage={rowsPerPage} 
          onPageChange={handlePageChange} 
          onRowsPerPageChange={handleRowsPerPageChange} 
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Box>

      {/* Details & Actions Dialog */}
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
                    <Typography variant="body2" color="text.secondary">
                      Booked For Type: {selectedBooking.bookedForType}
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
                  <Typography variant="body2" color="text.secondary">Phone: {selectedBooking.user?.phone}</Typography>
                  
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

                  {selectedBooking.notes && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>NOTES</Typography>
                      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                        "{selectedBooking.notes}"
                      </Typography>
                    </Box>
                  )}

                  {selectedBooking.status === 'REJECTED' && selectedBooking.rejectionReason && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" color="error" gutterBottom>REJECTION REASON</Typography>
                      <Alert severity="error" sx={{ py: 0.5 }}>
                        {selectedBooking.rejectionReason}
                      </Alert>
                    </Box>
                  )}

                  {selectedBooking.status === 'CANCELLED' && selectedBooking.cancellationReason && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" color="warning.main" gutterBottom>CANCELLATION REASON</Typography>
                      <Alert severity="warning" sx={{ py: 0.5 }}>
                        {selectedBooking.cancellationReason}
                      </Alert>
                    </Box>
                  )}
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
                    onClick={handleApprove}
                    disabled={actionLoading}
                    sx={{ textTransform: 'none', boxShadow: 'none' }}
                  >
                    Approve
                  </Button>
                  <Button 
                    variant="contained" 
                    color="error"
                    startIcon={<HighlightOffIcon />}
                    onClick={handleReject}
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
                  startIcon={<BlockIcon />}
                  onClick={handleCancel}
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

      {/* Snackbar feedback */}
      <Snackbar 
        open={toast.open} 
        autoHideDuration={6000} 
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setToast({ ...toast, open: false })} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>

    </Box>
  );
}
