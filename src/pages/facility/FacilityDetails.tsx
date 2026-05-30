import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Breadcrumbs, Link, Paper, Grid, Stack, Tabs, Tab,
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem,
  FormControl, InputLabel
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import BackButton from '@/components/BackButton';
import { getFacilityDetailsApi, updateFacilityApi } from '@/apis/facility';
import { getBookingsApi, approveBookingApi, rejectBookingApi } from '@/apis/booking';
import { 
  getSubscriptionPlansApi, 
  createSubscriptionPlanApi, 
  getSubscriptionsApi, 
  updateSubscriptionPaymentApi,
  approveSubscriptionApi,
  rejectSubscriptionApi,
  cancelSubscriptionApi 
} from '@/apis/subscription';
import { toggleFacilityStatus } from '@/utils/facilityStore';

// Modular Component Imports
import FacilityHero from './components/FacilityHero';
import FacilitySidebar from './components/FacilitySidebar';
import FacilityOverviewTab from './components/FacilityOverviewTab';
import FacilityBookingsTab from './components/FacilityBookingsTab';
import FacilityPlansTab from './components/FacilityPlansTab';
import FacilitySubscriptionsTab from './components/FacilitySubscriptionsTab';

export default function FacilityDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // General states
  const [facility, setFacility] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // Tab 2: Bookings states
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  // Tab 3: Plans states
  const [plans, setPlans] = useState<any[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [createPlanOpen, setCreatePlanOpen] = useState(false);
  const [planForm, setPlanForm] = useState({
    name: '',
    code: '',
    description: '',
    durationDays: 30,
    priceAmount: 1000,
    priceCurrency: 'INR',
    requiresApproval: false,
    maxUsesPerDay: ''
  });

  // Tab 4: Subscriptions states
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(false);

  // Subscription Actions dialog states
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const [paymentStatusVal, setPaymentStatusVal] = useState<'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'>('PENDING');

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const [actionLoading, setActionLoading] = useState(false);

  const loadFacility = async () => {
    setLoading(true);
    if (id) {
      try {
        const res = await getFacilityDetailsApi(id);
        const f = res?.data || res;
        if (f) {
          let normStatus = f.status || 'Operational';
          if (normStatus === 'OPERATIONAL') normStatus = 'Operational';
          else if (normStatus === 'IN_USE') normStatus = 'In Use';
          else if (normStatus === 'MAINTENANCE') normStatus = 'Maintenance';
          else if (normStatus === 'CLOSED') normStatus = 'Inactive';

          let normCategory = f.category || 'Sports';
          if (normCategory === 'SPORTS') normCategory = 'Sports';
          else if (normCategory === 'FITNESS') normCategory = 'Fitness';
          else if (normCategory === 'LEISURE') normCategory = 'Leisure';
          else if (normCategory === 'WELLNESS') normCategory = 'Wellness';
          else if (normCategory === 'OTHER') normCategory = 'Other';

          const price = f.priceLabel || f.price || (f.priceAmount ? `₹${f.priceAmount}/${f.pricingModel?.toLowerCase() === 'hourly' ? 'hr' : f.pricingModel?.toLowerCase()}` : 'Free');
          const slots = `${f.bookedSlots || 0}/${f.totalSlots || 12} Booked`;

          let color = '#4b5563';
          const catLower = normCategory.toLowerCase();
          if (catLower === 'sports') color = '#1d4ed8';
          else if (catLower === 'fitness') color = '#ea580c';
          else if (catLower === 'leisure') color = '#7c3aed';
          else if (catLower === 'wellness') color = '#db2777';

          setFacility({
            id: f.id,
            name: f.name,
            code: f.code || '',
            bookingMode: f.bookingMode || 'SLOT',
            accessType: f.accessType || 'BOOKING', // 'BOOKING', 'SUBSCRIPTION', 'MIXED'
            isActive: f.isActive !== undefined ? f.isActive : true,
            requiresApproval: !!f.requiresApproval,
            category: normCategory,
            status: normStatus,
            price,
            slots,
            color,
            description: f.description || '',
            managerName: f.managerName || '',
            managerContact: f.managerContact || '',
            iconName: f.iconKey || f.iconName || 'SportsTennis',
            createdAt: f.createdAt ? f.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
            staffMembers: f.staffMembers || [],
            location: f.location || 'Clubhouse',
            floor: f.floor || 'Ground Floor',
            openingTime: f.openingTime || '00:00',
            closingTime: f.closingTime || '23:59',
            availableDays: f.availableDays || [],
            advanceBookingDays: f.advanceBookingDays || 7,
            cancellationHours: f.cancellationHours || 2,
            rules: f.rules || '',
            images: f.images || []
          });
        }
      } catch (error) {
        console.warn("Failed to load facility via API:", error);
      }
    }
    setLoading(false);
  };

  const fetchTodayBookings = async () => {
    if (!id) return;
    setBookingsLoading(true);
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const res = await getBookingsApi({ 
        facilityId: id, 
        dateFrom: todayStr, 
        dateTo: todayStr,
        limit: 100 
      });
      if (res?.success && res?.data?.items) {
        setBookings(res.data.items);
      }
    } catch (err) {
      console.error('Failed to load today bookings:', err);
    } finally {
      setBookingsLoading(false);
    }
  };

  const fetchPlans = async () => {
    if (!id) return;
    setPlansLoading(true);
    try {
      const res = await getSubscriptionPlansApi(id);
      let fetchedPlans: any[] = [];
      if (res?.success && res?.data) {
        if (Array.isArray(res.data)) {
          fetchedPlans = res.data;
        } else if (res.data.items && Array.isArray(res.data.items)) {
          fetchedPlans = res.data.items;
        } else if (res.data.plans && Array.isArray(res.data.plans)) {
          fetchedPlans = res.data.plans;
        } else if (typeof res.data === 'object') {
          const possibleArr = Object.values(res.data).find(val => Array.isArray(val));
          if (possibleArr) fetchedPlans = possibleArr as any[];
        }
      } else if (Array.isArray(res)) {
        fetchedPlans = res;
      } else if (res?.items && Array.isArray(res.items)) {
        fetchedPlans = res.items;
      }
      setPlans(fetchedPlans);
    } catch (err) {
      console.error('Failed to load plans:', err);
      setPlans([]);
    } finally {
      setPlansLoading(false);
    }
  };

  const fetchSubscriptions = async () => {
    if (!id) return;
    setSubscriptionsLoading(true);
    try {
      const res = await getSubscriptionsApi({ facilityId: id });
      let fetchedSubs: any[] = [];
      if (res?.success && res?.data) {
        if (Array.isArray(res.data)) {
          fetchedSubs = res.data;
        } else if (res.data.items && Array.isArray(res.data.items)) {
          fetchedSubs = res.data.items;
        } else if (typeof res.data === 'object') {
          const possibleArr = Object.values(res.data).find(val => Array.isArray(val));
          if (possibleArr) fetchedSubs = possibleArr as any[];
        }
      } else if (Array.isArray(res)) {
        fetchedSubs = res;
      } else if (res?.items && Array.isArray(res.items)) {
        fetchedSubs = res.items;
      }
      setSubscriptions(fetchedSubs);
    } catch (err) {
      console.error('Failed to load subscriptions:', err);
      setSubscriptions([]);
    } finally {
      setSubscriptionsLoading(false);
    }
  };

  useEffect(() => {
    loadFacility();
  }, [id]);

  useEffect(() => {
    if (activeTab === 1) {
      fetchTodayBookings();
    } else if (activeTab === 2) {
      fetchPlans();
    } else if (activeTab === 3) {
      fetchSubscriptions();
    }
  }, [activeTab, id]);

  const handleStatusToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const active = e.target.checked;
    const newStatus = active ? 'OPERATIONAL' : 'CLOSED';
    try {
      await updateFacilityApi(facility.id, { status: newStatus, isActive: active });
      loadFacility();
    } catch (err) {
      console.warn("Failed to toggle status via API, falling back:", err);
      const updated = toggleFacilityStatus(facility.id, active);
      setFacility(updated);
    }
  };

  // Booking approvals
  const handleApproveBooking = async (bookingId: string) => {
    setActionLoading(true);
    try {
      await approveBookingApi(bookingId);
      fetchTodayBookings();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    setActionLoading(true);
    try {
      await rejectBookingApi(bookingId, { reason: 'Rejected by Admin' });
      fetchTodayBookings();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Plan creation
  const handleCreatePlanSubmit = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      const payload = {
        facilityId: id,
        name: planForm.name,
        code: planForm.code,
        description: planForm.description,
        durationDays: Number(planForm.durationDays),
        priceAmount: Number(planForm.priceAmount),
        priceCurrency: planForm.priceCurrency,
        requiresApproval: planForm.requiresApproval,
        maxUsesPerDay: planForm.maxUsesPerDay !== '' ? Number(planForm.maxUsesPerDay) : null
      };
      const res = await createSubscriptionPlanApi(payload);
      if (res?.success) {
        setCreatePlanOpen(false);
        setPlanForm({
          name: '',
          code: '',
          description: '',
          durationDays: 30,
          priceAmount: 1000,
          priceCurrency: 'INR',
          requiresApproval: false,
          maxUsesPerDay: ''
        });
        fetchPlans();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Subscriptions management
  const openPaymentDialog = (sub: any) => {
    setSelectedSub(sub);
    setPaymentStatusVal(sub.paymentStatus || 'PENDING');
    setPaymentDialogOpen(true);
  };

  const handleUpdatePaymentStatus = async () => {
    if (!selectedSub) return;
    setActionLoading(true);
    try {
      const res = await updateSubscriptionPaymentApi(selectedSub.id, { paymentStatus: paymentStatusVal });
      if (res?.success) {
        setPaymentDialogOpen(false);
        fetchSubscriptions();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveSub = async (subId: string) => {
    setActionLoading(true);
    try {
      await approveSubscriptionApi(subId);
      fetchSubscriptions();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const openRejectDialog = (sub: any) => {
    setSelectedSub(sub);
    setRejectReason('');
    setRejectDialogOpen(true);
  };

  const handleRejectSub = async () => {
    if (!selectedSub) return;
    setActionLoading(true);
    try {
      const res = await rejectSubscriptionApi(selectedSub.id, { reason: rejectReason });
      if (res?.success) {
        setRejectDialogOpen(false);
        fetchSubscriptions();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelSub = async (subId: string) => {
    if (!window.confirm("Are you sure you want to cancel this subscription?")) return;
    setActionLoading(true);
    try {
      await cancelSubscriptionApi(subId);
      fetchSubscriptions();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#f8fafc' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!facility) {
    return (
      <Box sx={{ p: 5 }}>
        <Typography variant="h5" color="error">Facility not found</Typography>
        <Button onClick={() => navigate('/facility')} sx={{ mt: 2 }}>Back to Facilities</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Header Panel */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
<Typography variant="h3" fontWeight="900" color="#091542">{facility.name}</Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<EditOutlinedIcon />}
            onClick={() => navigate(`/facility/edit/${facility.id}`)}
            sx={{ borderRadius: '16px', px: 3, py: 1.25, fontWeight: 900, borderColor: '#e2e8f0', color: '#091542' }}
          >
            Edit Facility
          </Button>
          <BackButton to="/facility" />
        </Stack>
      </Stack>

      {/* Facility Hero Sub-component */}
      <FacilityHero facility={facility} />

      {/* Main Content Layout */}
      <Grid container spacing={4}>
        
        {/* Left Side Column */}
        <Grid size={{ xs: 12, md: 4 }}>
          <FacilitySidebar facility={facility} handleStatusToggle={handleStatusToggle} />
        </Grid>

        {/* Right Side Column (Tabs Panel) */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ borderRadius: '24px', border: '1px solid #e2e8f0', bgcolor: 'white', overflow: 'hidden' }}>
            <Box sx={{ borderBottom: 1, borderColor: '#f1f5f9', px: 3, pt: 2, bgcolor: '#fafbfd' }}>
              <Tabs 
                value={activeTab} 
                onChange={(_, val) => setActiveTab(val)} 
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    pb: 2,
                    minWidth: 100
                  }
                }}
              >
                <Tab label="General Overview" />
                <Tab label="Today's Bookings" />
                <Tab label="Subscription Plans" />
                <Tab label="Subscriptions" />
              </Tabs>
            </Box>

            {/* TAB CONTENT PANELS */}
            <Box sx={{ p: 4 }}>
              {activeTab === 0 && (
                <FacilityOverviewTab facility={facility} />
              )}

              {activeTab === 1 && (
                <FacilityBookingsTab 
                  bookings={bookings} 
                  loading={bookingsLoading} 
                  actionLoading={actionLoading}
                  handleApproveBooking={handleApproveBooking}
                  handleRejectBooking={handleRejectBooking}
                />
              )}

              {activeTab === 2 && (
                <FacilityPlansTab 
                  accessType={facility.accessType}
                  plans={plans}
                  loading={plansLoading}
                  setCreatePlanOpen={setCreatePlanOpen}
                />
              )}

              {activeTab === 3 && (
                <FacilitySubscriptionsTab 
                  subscriptions={subscriptions}
                  loading={subscriptionsLoading}
                  actionLoading={actionLoading}
                  openPaymentDialog={openPaymentDialog}
                  handleApproveSub={handleApproveSub}
                  openRejectDialog={openRejectDialog}
                  handleCancelSub={handleCancelSub}
                />
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Create Plan Dialog */}
      <Dialog open={createPlanOpen} onClose={() => !actionLoading && setCreatePlanOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#091542' }}>Create Subscription Plan</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField 
              label="Plan Name" 
              fullWidth 
              value={planForm.name} 
              onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })} 
              disabled={actionLoading}
            />
            <TextField 
              label="Plan Code (e.g. GYM-MONTHLY)" 
              fullWidth 
              value={planForm.code} 
              onChange={(e) => setPlanForm({ ...planForm, code: e.target.value.toUpperCase() })} 
              disabled={actionLoading}
            />
            <TextField 
              label="Description" 
              fullWidth 
              multiline 
              rows={2} 
              value={planForm.description} 
              onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })} 
              disabled={actionLoading}
            />
            <Grid container spacing={2}>
              <Grid size={6}>
                <TextField 
                  label="Duration (Days)" 
                  type="number" 
                  fullWidth 
                  value={planForm.durationDays} 
                  onChange={(e) => setPlanForm({ ...planForm, durationDays: Number(e.target.value) })} 
                  disabled={actionLoading}
                />
              </Grid>
              <Grid size={6}>
                <TextField 
                  label="Price Amount" 
                  type="number" 
                  fullWidth 
                  value={planForm.priceAmount} 
                  onChange={(e) => setPlanForm({ ...planForm, priceAmount: Number(e.target.value) })} 
                  disabled={actionLoading}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid size={6}>
                <FormControl fullWidth>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={planForm.priceCurrency}
                    label="Currency"
                    onChange={(e) => setPlanForm({ ...planForm, priceCurrency: e.target.value })}
                    disabled={actionLoading}
                  >
                    <MenuItem value="INR">INR (₹)</MenuItem>
                    <MenuItem value="USD">USD ($)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={6}>
                <TextField 
                  label="Max Uses/Day (Optional)" 
                  type="number" 
                  fullWidth 
                  value={planForm.maxUsesPerDay} 
                  onChange={(e) => setPlanForm({ ...planForm, maxUsesPerDay: e.target.value })} 
                  disabled={actionLoading}
                  placeholder="Unlimited"
                />
              </Grid>
            </Grid>

            <FormControl fullWidth>
              <InputLabel>Requires Approval</InputLabel>
              <Select
                value={planForm.requiresApproval ? "true" : "false"}
                label="Requires Approval"
                onChange={(e) => setPlanForm({ ...planForm, requiresApproval: e.target.value === "true" })}
                disabled={actionLoading}
              >
                <MenuItem value="false">Auto-Approve</MenuItem>
                <MenuItem value="true">Requires Manager Approval</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setCreatePlanOpen(false)} color="inherit" disabled={actionLoading} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreatePlanSubmit} 
            variant="contained" 
            disabled={actionLoading}
            sx={{ textTransform: 'none', boxShadow: 'none' }}
          >
            Create Plan
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Payment Dialog */}
      <Dialog open={paymentDialogOpen} onClose={() => !actionLoading && setPaymentDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#091542' }}>Update Payment Status</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Change the payment status for this user subscription.
          </Typography>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Payment Status</InputLabel>
            <Select
              value={paymentStatusVal}
              label="Payment Status"
              onChange={(e) => setPaymentStatusVal(e.target.value as any)}
              disabled={actionLoading}
            >
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="PAID">Paid</MenuItem>
              <MenuItem value="FAILED">Failed</MenuItem>
              <MenuItem value="REFUNDED">Refunded</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setPaymentDialogOpen(false)} color="inherit" disabled={actionLoading} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpdatePaymentStatus} 
            variant="contained" 
            disabled={actionLoading}
            sx={{ textTransform: 'none', boxShadow: 'none' }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => !actionLoading && setRejectDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#091542' }}>Reject Subscription</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Specify the reason for rejecting this user subscription request.
          </Typography>
          <TextField
            label="Rejection Reason"
            fullWidth
            multiline
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            disabled={actionLoading}
            autoFocus
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setRejectDialogOpen(false)} color="inherit" disabled={actionLoading} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleRejectSub} 
            color="error" 
            variant="contained" 
            disabled={actionLoading}
            sx={{ textTransform: 'none', boxShadow: 'none' }}
          >
            Confirm Reject
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
