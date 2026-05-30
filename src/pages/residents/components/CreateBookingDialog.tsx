import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, Button, IconButton, Stepper, Step,
  StepLabel, CircularProgress, Chip, Avatar, TextField,
  Divider, Stack, Alert, ToggleButton, ToggleButtonGroup,
  Paper
} from '@mui/material';
import {
  Close as CloseIcon,
  SportsTennis as SportsIcon,
  CheckCircle as CheckCircleIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
  EventSeat as SeatIcon
} from '@mui/icons-material';
import { getFacilitiesApi } from '@/apis/facility';
import { getSubscriptionPlansApi, createSubscriptionApi } from '@/apis/subscription';
import { getSlotsApi, createBookingApi } from '@/apis/booking';
import { toast } from 'react-hot-toast';
import { getFileUrl } from '@/utils/file';

interface CreateBookingDialogProps {
  open: boolean;
  onClose: () => void;
  resident: { id: string; name: string; avatar?: string; photoUrl?: string; profilePhotoUrl?: string } | null;
}

const STEPS = ['Select Facility', 'Choose Plan / Slots', 'Confirm'];

/* ------------------------------------------------------------------ helpers */
const formatTime = (t: string) => {
  const [h, m] = t.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayH = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayH}:${m} ${ampm}`;
};

const today = () => new Date().toISOString().split('T')[0];

/* ================================================================== Dialog */
export default function CreateBookingDialog({ open, onClose, resident }: CreateBookingDialogProps) {
  const [step, setStep] = useState(0);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<any>(null);

  // --- subscription flow ---
  const [plans, setPlans] = useState<any[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  // --- slot booking flow ---
  const [bookingDate, setBookingDate] = useState(today());
  const [slotMinutes, setSlotMinutes] = useState<number>(60);
  const [slots, setSlots] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [attendeeCount, setAttendeeCount] = useState(1);
  const [guestCount, setGuestCount] = useState(0);
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<any>(null);

  /* -------------------------------------------------------- reset on close */
  const handleClose = () => {
    setStep(0);
    setSelectedFacility(null);
    setSelectedPlan(null);
    setSelectedSlot(null);
    setSlots([]);
    setPlans([]);
    setBookingDate(today());
    setSlotMinutes(60);
    setAttendeeCount(1);
    setGuestCount(0);
    setNotes('');
    setSuccess(false);
    setCreatedBooking(null);
    onClose();
  };

  /* ------------------------------------------------------- load facilities */
  useEffect(() => {
    if (!open) return;
    setLoadingFacilities(true);
    getFacilitiesApi({ limit: 100 })
      .then((res) => {
        // Match exact parsing pattern from GetFacility.tsx
        const d = res?.data || res;
        let list: any[] = [];
        if (Array.isArray(d)) {
          list = d;
        } else if (d?.items && Array.isArray(d.items)) {
          list = d.items;
        } else if (d?.facilities && Array.isArray(d.facilities)) {
          list = d.facilities;
        } else if (d?.data && Array.isArray(d.data)) {
          list = d.data;
        }
        setFacilities(list);
      })
      .catch(() => setFacilities([]))
      .finally(() => setLoadingFacilities(false));
  }, [open]);

  /* ----------------------------------------------- load plans / slots on step 1 */
  useEffect(() => {
    if (step !== 1 || !selectedFacility) return;
    const at = selectedFacility.accessType?.toUpperCase() || '';
    if (at === 'SLOT_BOOKING' || at === 'MIXED') {
      fetchSlots();
    } else {
      // SUBSCRIPTION
      setLoadingPlans(true);
      getSubscriptionPlansApi(selectedFacility.id, true)
        .then((res) => {
          // Same pattern: res?.data || res, then .items / .plans / .data / array
          const d = res?.data || res;
          let list: any[] = [];
          if (Array.isArray(d)) {
            list = d;
          } else if (d?.items && Array.isArray(d.items)) {
            list = d.items;
          } else if (d?.plans && Array.isArray(d.plans)) {
            list = d.plans;
          } else if (d?.data && Array.isArray(d.data)) {
            list = d.data;
          }
          setPlans(list);
        })
        .catch(() => setPlans([]))
        .finally(() => setLoadingPlans(false));
    }
  }, [step, selectedFacility]);

  /* ---------------------------------------------------------- fetch slots */
  const fetchSlots = async () => {
    if (!selectedFacility || !bookingDate) return;
    setLoadingSlots(true);
    setSlots([]);
    setSelectedSlot(null);
    try {
      const res = await getSlotsApi({ facilityId: selectedFacility.id, date: bookingDate, slotMinutes: slotMinutes as any });
      // Handle nesting: res may be { success, data: { slots } } or { slots } or { data: { data: { slots } } }
      const d = res?.data || res;
      const slotList = d?.slots || (Array.isArray(d) ? d : []);
      setSlots(slotList);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to fetch slots');
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    if (step === 1 && selectedFacility) {
      const at = selectedFacility.accessType?.toUpperCase() || '';
      if (at === 'SLOT_BOOKING' || at === 'MIXED') {
        fetchSlots();
      }
    }
  }, [bookingDate, slotMinutes]);

  /* ------------------------------------------------------------ submit */
  const handleSubmit = async () => {
    if (!resident || !selectedFacility) return;
    const at = selectedFacility.accessType?.toUpperCase() || '';
    const isSlot = at === 'SLOT_BOOKING' || at === 'MIXED';
    setSubmitting(true);
    try {
      if (isSlot) {
        if (!selectedSlot) { toast.error('Please select a slot'); setSubmitting(false); return; }
        const res = await createBookingApi({
          facilityId: selectedFacility.id,
          bookingDate,
          startTime: selectedSlot.startTime.substring(0, 5),
          endTime: selectedSlot.endTime.substring(0, 5),
          attendeeCount,
          guestCount,
          bookedForType: 'OTHER',
          userId: resident?.id,
          bookedForUserId: resident?.id, 
          residentId: resident?.id, // added residentId just in case
          notes: notes ? `${notes}\n\n(Booked on behalf of Resident: ${resident?.name})` : `(Booked on behalf of Resident: ${resident?.name})`,
        } as any);
        // Unwrap: res may be { success, message, data: {...} } or { data: {...} } or booking directly
        const booking = res?.data?.id ? res.data : res?.data || res;
        setCreatedBooking(booking);
      } else {
        if (!selectedPlan) { toast.error('Please select a plan'); setSubmitting(false); return; }
        const res = await createSubscriptionApi({ planId: selectedPlan.id, userId: resident?.id } as any);
        const sub = res?.data?.id ? res.data : res?.data || res;
        setCreatedBooking(sub);
      }
      setSuccess(true);
      setStep(2);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------------------------------------------------- accessType badge */
  const accessTypeBadge = (at: string) => {
    const t = at?.toUpperCase() || '';
    if (t === 'SLOT_BOOKING') return { label: 'Slot Booking', color: '#6366f1', bg: 'rgba(99,102,241,0.08)' };
    if (t === 'SUBSCRIPTION') return { label: 'Subscription', color: '#10b981', bg: 'rgba(16,185,129,0.08)' };
    return { label: 'Mixed', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' };
  };

  const isSlotMode = selectedFacility &&
    (['SLOT_BOOKING', 'MIXED'].includes(selectedFacility.accessType?.toUpperCase() || ''));

  /* =========================================================== RENDER */
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(9,21,66,0.18)',
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ p: 0 }}>
        <Box sx={{
          background: 'linear-gradient(135deg, #091542 0%, #1a3a8a 100%)',
          px: 3, py: 2.5,
          display: 'flex', alignItems: 'center', justifyContent: 'end'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: 42, height: 42, borderRadius: '12px',
              bgcolor: 'rgba(255,255,255,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <SportsIcon sx={{ color: 'white', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={800} color="white" sx={{ lineHeight: 1.2 }}>
                Create Booking
              </Typography>
              {resident && (
                <Typography variant="caption" color="rgba(255,255,255,0.7)">
                  for {resident.name}
                </Typography>
              )}
            </Box>
          </Box>
          <IconButton onClick={handleClose} sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Stepper */}
        <Box sx={{ px: 3, pt: 2.5, pb: 1.5, bgcolor: '#fafbff' }}>
          <Stepper activeStep={step} alternativeLabel>
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel
                  sx={{
                    '& .MuiStepLabel-label': { fontSize: '0.78rem', fontWeight: 700 },
                    '& .MuiStepIcon-root.Mui-active': { color: '#091542' },
                    '& .MuiStepIcon-root.Mui-completed': { color: '#10b981' },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3, minHeight: 380, bgcolor: '#fafbff' }}>

        {/* ========================= STEP 0: SELECT FACILITY ========================= */}
        {step === 0 && (
          <Box>
            <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mb: 2 }}>
              Select a facility to book
            </Typography>
            {loadingFacilities ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress size={36} sx={{ color: '#091542' }} />
              </Box>
            ) : (
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                gap: 2
              }}>
                {facilities.map((f) => {
                  const badge = accessTypeBadge(f.accessType || '');
                  const selected = selectedFacility?.id === f.id;
                  return (
                    <Paper
                      key={f.id}
                      onClick={() => setSelectedFacility(f)}
                      elevation={0}
                      sx={{
                        p: 2, borderRadius: '14px', cursor: 'pointer',
                        border: selected ? '2px solid #091542' : '1.5px solid #e2e8f0',
                        bgcolor: selected ? 'rgba(9,21,66,0.03)' : 'white',
                        transition: 'all 0.2s',
                        '&:hover': { borderColor: '#091542', transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(9,21,66,0.08)' },
                        position: 'relative'
                      }}
                    >
                      {selected && (
                        <CheckCircleIcon sx={{ position: 'absolute', top: 10, right: 10, color: '#091542', fontSize: 20 }} />
                      )}
                      {/* Facility image or icon */}
                      <Box sx={{
                        width: '100%', height: 80, borderRadius: '10px', mb: 1.5, overflow: 'hidden',
                        bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {f.images?.[0] ? (
                          <Box component="img" src={getFileUrl(f.images[0])} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <SportsIcon sx={{ fontSize: 32, color: '#94a3b8' }} />
                        )}
                      </Box>
                      <Typography variant="body2" fontWeight={800} color="#091542" sx={{ mb: 0.5, fontSize: '0.85rem' }}>
                        {f.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, flexWrap: 'wrap' }}>
                        <Chip
                          label={badge.label}
                          size="small"
                          sx={{ bgcolor: badge.bg, color: badge.color, fontWeight: 800, fontSize: '0.65rem', height: 20 }}
                        />
                        {f.location && (
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            {f.location}
                          </Typography>
                        )}
                      </Box>
                    </Paper>
                  );
                })}
                {!loadingFacilities && facilities.length === 0 && (
                  <Box sx={{ gridColumn: '1/-1', textAlign: 'center', py: 6 }}>
                    <Typography color="text.secondary">No active facilities found</Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        )}

        {/* ========================= STEP 1: PLAN or SLOTS ========================= */}
        {step === 1 && selectedFacility && (
          <Box>
            {/* Facility header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5, p: 1.5, bgcolor: 'white', borderRadius: '12px', border: '1.5px solid #e2e8f0' }}>
              <Box sx={{ width: 44, height: 44, borderRadius: '10px', overflow: 'hidden', bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {selectedFacility.images?.[0] ? (
                  <Box component="img" src={getFileUrl(selectedFacility.images[0])} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <SportsIcon sx={{ fontSize: 24, color: '#94a3b8' }} />
                )}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight={800} color="#091542" sx={{ fontSize: '0.9rem' }}>{selectedFacility.name}</Typography>
                <Typography variant="caption" color="text.secondary">{selectedFacility.location || 'Facility'}</Typography>
              </Box>
              <Chip
                label={accessTypeBadge(selectedFacility.accessType || '').label}
                size="small"
                sx={{ bgcolor: accessTypeBadge(selectedFacility.accessType || '').bg, color: accessTypeBadge(selectedFacility.accessType || '').color, fontWeight: 800, fontSize: '0.68rem' }}
              />
            </Box>

            {/* ---- SUBSCRIPTION PLANS ---- */}
            {!isSlotMode && (
              <>
                <Typography variant="body2" fontWeight={700} color="text.secondary" sx={{ mb: 1.5 }}>
                  Select a Subscription Plan
                </Typography>
                {loadingPlans ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={32} sx={{ color: '#091542' }} /></Box>
                ) : plans.length === 0 ? (
                  <Alert severity="info" sx={{ borderRadius: '12px' }}>No active subscription plans found for this facility.</Alert>
                ) : (
                  <Stack spacing={1.5}>
                    {plans.map((plan) => {
                      const sel = selectedPlan?.id === plan.id;
                      return (
                        <Paper
                          key={plan.id}
                          onClick={() => setSelectedPlan(plan)}
                          elevation={0}
                          sx={{
                            p: 2, borderRadius: '12px', cursor: 'pointer',
                            border: sel ? '2px solid #091542' : '1.5px solid #e2e8f0',
                            bgcolor: sel ? 'rgba(9,21,66,0.03)' : 'white',
                            display: 'flex', alignItems: 'center', gap: 2,
                            transition: 'all 0.2s',
                            '&:hover': { borderColor: '#091542', boxShadow: '0 4px 12px rgba(9,21,66,0.08)' }
                          }}
                        >
                          {sel && <CheckCircleIcon sx={{ color: '#091542', fontSize: 22, flexShrink: 0 }} />}
                          <Box sx={{ flex: 1 }}>
                            <Typography fontWeight={800} color="#091542" sx={{ fontSize: '0.88rem' }}>{plan.name}</Typography>
                            {plan.description && (
                              <Typography variant="caption" color="text.secondary">{plan.description}</Typography>
                            )}
                            <Stack direction="row" spacing={1.5} sx={{ mt: 0.5 }}>
                              <Typography variant="caption" fontWeight={700} color="text.secondary">
                                {plan.durationDays} days
                              </Typography>
                              {plan.maxUsesPerDay && (
                                <Typography variant="caption" fontWeight={700} color="text.secondary">
                                  {plan.maxUsesPerDay}x/day
                                </Typography>
                              )}
                            </Stack>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography fontWeight={900} color="#091542" sx={{ fontSize: '1.1rem' }}>
                              ₹{parseFloat(plan.priceAmount || 0).toLocaleString('en-IN')}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">{plan.priceCurrency || 'INR'}</Typography>
                          </Box>
                        </Paper>
                      );
                    })}
                  </Stack>
                )}
              </>
            )}

            {/* ---- SLOT BOOKING ---- */}
            {isSlotMode && (
              <>
                {/* Date + Duration selectors */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                  <TextField
                    label="Booking Date"
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    inputProps={{ min: today() }}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    InputProps={{ startAdornment: <CalendarIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} /> }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>Slot Duration</Typography>
                    <ToggleButtonGroup
                      value={slotMinutes}
                      exclusive
                      onChange={(_, v) => { if (v) setSlotMinutes(v); }}
                      size="small"
                      sx={{ '& .MuiToggleButton-root': { borderRadius: '8px !important', fontWeight: 700, fontSize: '0.75rem', px: 1.5 } }}
                    >
                      {[30, 45, 60, 90, 120].map((m) => (
                        <ToggleButton key={m} value={m} sx={{ '&.Mui-selected': { bgcolor: '#091542 !important', color: 'white' } }}>
                          {m}m
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </Box>
                </Stack>

                {/* Slot grid */}
                <Typography variant="body2" fontWeight={700} color="text.secondary" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <TimeIcon sx={{ fontSize: 16 }} /> Available Slots
                </Typography>

                {loadingSlots ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={32} sx={{ color: '#091542' }} /></Box>
                ) : slots.length === 0 ? (
                  <Alert severity="info" sx={{ borderRadius: '12px' }}>No slots available for selected date.</Alert>
                ) : (
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 1, mb: 2 }}>
                    {slots.map((slot, i) => {
                      const avail = slot.status === 'AVAILABLE' && slot.availableCount > 0;
                      const sel = selectedSlot?.startTime === slot.startTime;
                      return (
                        <Paper
                          key={i}
                          onClick={() => avail && setSelectedSlot(slot)}
                          elevation={0}
                          sx={{
                            p: 1.5, borderRadius: '10px', textAlign: 'center',
                            cursor: avail ? 'pointer' : 'not-allowed',
                            border: sel ? '2px solid #091542' : '1.5px solid #e2e8f0',
                            bgcolor: sel ? 'rgba(9,21,66,0.04)' : avail ? 'white' : '#f8fafc',
                            opacity: avail ? 1 : 0.5,
                            transition: 'all 0.15s',
                            '&:hover': avail ? { borderColor: '#091542', transform: 'translateY(-1px)', boxShadow: '0 4px 12px rgba(9,21,66,0.08)' } : {}
                          }}
                        >
                          <Typography fontWeight={800} color={sel ? '#091542' : 'text.primary'} sx={{ fontSize: '0.8rem' }}>
                            {formatTime(slot.startTime)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                            – {formatTime(slot.endTime)}
                          </Typography>
                          <Box sx={{ mt: 0.5 }}>
                            <Chip
                              label={avail ? `${slot.availableCount} left` : 'Full'}
                              size="small"
                              sx={{
                                height: 16, fontSize: '0.6rem', fontWeight: 800,
                                bgcolor: avail ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                color: avail ? '#10b981' : '#ef4444'
                              }}
                            />
                          </Box>
                        </Paper>
                      );
                    })}
                  </Box>
                )}

                {/* Attendee + notes */}
                {selectedSlot && (
                  <Box sx={{ mt: 1 }}>
                    <Divider sx={{ mb: 2 }} />
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                      <TextField
                        label="Attendees"
                        type="number"
                        value={attendeeCount}
                        onChange={(e) => setAttendeeCount(Math.max(1, parseInt(e.target.value) || 1))}
                        inputProps={{ min: 1, max: selectedSlot.capacity || 10 }}
                        size="small"
                        sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                        InputProps={{ startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} /> }}
                      />
                      <TextField
                        label="Guests"
                        type="number"
                        value={guestCount}
                        onChange={(e) => setGuestCount(Math.max(0, parseInt(e.target.value) || 0))}
                        inputProps={{ min: 0 }}
                        size="small"
                        sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                        InputProps={{ startAdornment: <SeatIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} /> }}
                      />
                    </Stack>
                    <TextField
                      label="Notes (optional)"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      multiline
                      rows={2}
                      fullWidth
                      size="small"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />
                  </Box>
                )}
              </>
            )}
          </Box>
        )}

        {/* ========================= STEP 2: SUCCESS ========================= */}
        {step === 2 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Box sx={{
              width: 80, height: 80, borderRadius: '50%',
              bgcolor: 'rgba(16,185,129,0.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2
            }}>
              <CheckCircleIcon sx={{ fontSize: 44, color: '#10b981' }} />
            </Box>
            <Typography variant="h6" fontWeight={900} color="#091542" sx={{ mb: 0.5 }}>
              {isSlotMode ? 'Booking Created!' : 'Subscription Created!'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {isSlotMode
                ? `Your slot booking has been confirmed for ${resident?.name}.`
                : `Subscription plan activated for ${resident?.name}.`
              }
            </Typography>

            {/* Booking details */}
            {createdBooking && (
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: '14px', border: '1.5px solid #e2e8f0', textAlign: 'left', maxWidth: 400, mx: 'auto' }}>
                {isSlotMode ? (
                  <Stack spacing={1.5}>
                    {createdBooking.bookingCode && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>Booking Code</Typography>
                        <Typography variant="caption" fontWeight={900} color="#091542">{createdBooking.bookingCode}</Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>Facility</Typography>
                      <Typography variant="caption" fontWeight={800}>{selectedFacility?.name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>Date</Typography>
                      <Typography variant="caption" fontWeight={800}>{createdBooking.bookingDate || bookingDate}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>Time</Typography>
                      <Typography variant="caption" fontWeight={800}>
                        {formatTime(createdBooking.startTime || selectedSlot?.startTime || '')} – {formatTime(createdBooking.endTime || selectedSlot?.endTime || '')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>Status</Typography>
                      <Chip label={createdBooking.status || 'CONFIRMED'} size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800, bgcolor: 'rgba(16,185,129,0.1)', color: '#10b981' }} />
                    </Box>
                    {createdBooking.amount && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>Amount</Typography>
                        <Typography variant="caption" fontWeight={900} color="#091542">₹{parseFloat(createdBooking.amount).toLocaleString('en-IN')}</Typography>
                      </Box>
                    )}
                  </Stack>
                ) : (
                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>Plan</Typography>
                      <Typography variant="caption" fontWeight={800}>{selectedPlan?.name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>Status</Typography>
                      <Chip label={createdBooking.status || 'ACTIVE'} size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800, bgcolor: 'rgba(16,185,129,0.1)', color: '#10b981' }} />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>Amount</Typography>
                      <Typography variant="caption" fontWeight={900} color="#091542">
                        ₹{parseFloat(selectedPlan?.priceAmount || 0).toLocaleString('en-IN')}
                      </Typography>
                    </Box>
                  </Stack>
                )}
              </Paper>
            )}
          </Box>
        )}
      </DialogContent>

      {/* Footer actions */}
      <DialogActions sx={{ px: 3, py: 2, bgcolor: '#fafbff', borderTop: '1px solid #e2e8f0', gap: 1.5 }}>
        {step === 2 ? (
          <Button
            variant="contained"
            onClick={handleClose}
            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 800, bgcolor: '#091542', '&:hover': { bgcolor: '#122566' }, px: 4 }}
          >
            Done
          </Button>
        ) : (
          <>
            <Button
              onClick={step === 0 ? handleClose : () => setStep(step - 1)}
              startIcon={step > 0 ? <ArrowBackIcon /> : undefined}
              sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, color: 'text.secondary' }}
            >
              {step === 0 ? 'Cancel' : 'Back'}
            </Button>
            <Box sx={{ flex: 1 }} />
            {step === 0 && (
              <Button
                variant="contained"
                disabled={!selectedFacility}
                onClick={() => setStep(1)}
                sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 800, bgcolor: '#091542', '&:hover': { bgcolor: '#122566' }, px: 3 }}
              >
                Next
              </Button>
            )}
            {step === 1 && (
              <Button
                variant="contained"
                disabled={submitting || (isSlotMode ? !selectedSlot : !selectedPlan)}
                onClick={handleSubmit}
                startIcon={submitting ? <CircularProgress size={16} sx={{ color: 'white' }} /> : undefined}
                sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 800, bgcolor: '#091542', '&:hover': { bgcolor: '#122566' }, px: 3 }}
              >
                {submitting ? 'Creating...' : 'Confirm Booking'}
              </Button>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}