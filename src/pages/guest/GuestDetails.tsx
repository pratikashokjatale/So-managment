import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Breadcrumbs, Link, Paper, Avatar, Stack, Chip, Divider, Grid, Alert, 
} from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate, useParams } from 'react-router-dom';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import BackButton from '@/components/BackButton';
import StatusBadge from '@/components/StatusBadge';
import { getGuestById, approveGuestRequest, rejectGuestRequest } from '@/utils/guestStore';
import type { Guest } from '@/utils/guestStore';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

export default function GuestDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [guest, setGuest] = useState<Guest | null>(null);

  // Rejection Dialog State
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    if (id) {
      setGuest(getGuestById(id) || null);
    }
  }, [id]);

  const handleApprove = () => {
    if (id) {
      const updated = approveGuestRequest(id);
      setGuest(updated);
    }
  };

  const handleReject = () => {
    setOpenRejectDialog(true);
  };

  const handleConfirmReject = () => {
    if (id && rejectReason.trim()) {
      const updated = rejectGuestRequest(id, rejectReason);
      setGuest(updated);
      setOpenRejectDialog(false);
      setRejectReason('');
    }
  };

  if (!guest) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#ffffff', minHeight: '100vh', borderRadius: 2 }}>
        <Typography variant="h5" color="error" fontWeight="bold">Guest Pass not found.</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/guest')} 
          sx={{ mt: 3, borderRadius: '8px', textTransform: 'none', px: 3, fontWeight: 600 }}
        >
          Back to Guests
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#ffffff', minHeight: '100vh', borderRadius: 2 }}>
      
      {/* Header Section */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'end', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<EditOutlinedIcon />}
            onClick={() => navigate(`/guest/edit/${guest.id}`)}
            sx={{ 
              borderRadius: '10px', 
              textTransform: 'none', 
              fontWeight: 600, 
              borderColor: '#e2e8f0', 
              color: '#091542',
              '&:hover': { borderColor: '#091542', bgcolor: '#f8fafc' }
            }}
          >
            Edit Pass
          </Button>
          <BackButton to="/guest" label="Back to Guests" />
        </Stack>
      </Box>

      {/* Main Grid Content */}
      <Grid container spacing={4}>
        
        {/* Guest Credentials Card */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ border: '1px solid #f0f0f0', borderRadius: 4, p: 4, mb: 4 }}>
            
            <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 4 }}>
              <Avatar 
                src={guest.avatar} 
                sx={{ width: 72, height: 72, borderRadius: '20px', bgcolor: '#f1f5f9', border: '1px solid #e2e8f0' }} 
              />
              <Box>
                <Typography variant="h5" fontWeight="bold" color="#091542">{guest.name}</Typography>
                <Typography variant="body2" color="text.secondary" fontWeight="600" sx={{ mt: 0.5 }}>
                  Pass ID: {guest.id.toUpperCase()}
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ mb: 4 }} />

            {/* Basic details fields */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
              
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ textTransform: 'uppercase' }}>
                  Host Resident Name
                </Typography>
                <Typography variant="body1" fontWeight="800" color="#091542" sx={{ mt: 0.5 }}>
                  {guest.resident}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ textTransform: 'uppercase' }}>
                  Apartment / Designation
                </Typography>
                <Typography variant="body1" fontWeight="800" color="#091542" sx={{ mt: 0.5 }}>
                  {guest.apartment}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ textTransform: 'uppercase' }}>
                  Purpose of Visit
                </Typography>
                <Typography variant="body1" fontWeight="800" color="#091542" sx={{ mt: 0.5 }}>
                  {guest.purpose}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ textTransform: 'uppercase' }}>
                  Pass Duration / Dates
                </Typography>
                <Typography variant="body1" fontWeight="800" color="#091542" sx={{ mt: 0.5 }}>
                  {new Date(guest.fromDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} to {new Date(guest.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </Typography>
              </Box>

              <Box sx={{ gridColumn: 'span 2' }}>
                <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ textTransform: 'uppercase' }}>
                  Origin Address
                </Typography>
                <Typography variant="body1" fontWeight="800" color="#091542" sx={{ mt: 0.5 }}>
                  {guest.address}
                </Typography>
              </Box>

            </Box>

          </Paper>

          {/* Uploaded Documents card */}
          <Paper elevation={0} sx={{ border: '1px solid #f0f0f0', borderRadius: 4, p: 4 }}>
            <Typography variant="h6" fontWeight="bold" color="#091542" sx={{ mb: 3 }}>
              Government ID Verification (KYC)
            </Typography>

            <Paper 
              elevation={0} 
              sx={{ 
                border: '1px solid #cbd5e1', 
                borderRadius: '16px', 
                p: 3, 
                bgcolor: '#f8fafc',
                borderColor: '#e2e8f0',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between' 
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: '#eff6ff', color: '#3b82f6', borderRadius: '12px' }}>
                  <ArticleOutlinedIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight="800" color="#091542">
                    {guest.aadhaarFile || 'aadhaar_card_scanned.pdf'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {guest.aadhaarSize || '1.4 MB'} • Compliant Document
                  </Typography>
                </Box>
              </Stack>
              <Chip 
                label="Compliance Verified" 
                size="small" 
                sx={{ borderRadius: '6px', fontWeight: 800, bgcolor: '#ecfdf5', color: '#10b981' }} 
              />
            </Paper>
          </Paper>

        </Grid>

        {/* Right compliance, validation status panel */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Access QR Pass */}
          <Paper elevation={0} sx={{ border: '1px solid #f0f0f0', borderRadius: 4, p: 4, mb: 4, textAlign: 'center' }}>
            <Typography variant="h6" fontWeight="bold" color="#091542" sx={{ mb: 2 }}>
              Access QR Pass
            </Typography>
            {guest ? (
              <Box sx={{ p: 2.5, bgcolor: '#f8fafc', borderRadius: '20px', border: '2px dashed #cbd5e1', display: 'inline-block' }}>
                <QRCodeSVG value={guest.id || id || ''} size={150} level="H" />
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>No QR Pass available</Typography>
            )}
            <Typography variant="caption" fontWeight="800" color="#94a3b8" sx={{ mt: 2, display: 'block' }}>
              USE FOR GATE ENTRY VALIDATION
            </Typography>
          </Paper>

          <Paper elevation={0} sx={{ border: '1px solid #f0f0f0', borderRadius: 4, p: 4, mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" color="#091542" sx={{ mb: 3 }}>
              Verification Status
            </Typography>

            <Stack spacing={3}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ textTransform: 'uppercase', display: 'block', mb: 1 }}>
                  Gate Access Pass Status
                </Typography>
                <StatusBadge status={guest.status} variantType="text" />
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ textTransform: 'uppercase', display: 'block', mb: 1 }}>
                  Pass Validity
                </Typography>
                <Chip 
                  label={guest.validity} 
                  size="medium" 
                  sx={{ 
                    borderRadius: '8px', 
                    fontWeight: 800, 
                    bgcolor: guest.validity === 'Expired' ? '#fef2f2' : '#f0fdf4',
                    color: guest.validity === 'Expired' ? '#ef4444' : '#10b981'
                  }} 
                />
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ textTransform: 'uppercase', display: 'block', mb: 1 }}>
                  OTP Approval State
                </Typography>
                <Typography variant="body2" fontWeight="800" color={guest.otpStatus?.includes('Waiting') || guest.otpStatus === 'Pending' ? 'warning.main' : guest.otpStatus === 'Rejected' ? 'error.main' : 'success.main'}>
                  {guest.otpStatus}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ textTransform: 'uppercase', display: 'block', mb: 1 }}>
                  Date Requested
                </Typography>
                <Typography variant="body2" fontWeight="800" color="#091542">
                  {guest.date}
                </Typography>
              </Box>

            </Stack>

            {/* Rejection alert if applicable */}
            {guest.status === 'Rejected' && guest.rejectionReason && (
              <Alert severity="error" sx={{ mt: 3, borderRadius: '12px', fontWeight: 600 }}>
                <strong>Rejection Reason:</strong> {guest.rejectionReason}
              </Alert>
            )}

            {/* Administrative controls */}
            {guest.status === 'Pending' && (
              <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #f0f0f0' }}>
                <Typography variant="body2" fontWeight="700" color="text.secondary" sx={{ mb: 2 }}>
                  Administrative Authorization
                </Typography>
                <Stack spacing={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleOutlineIcon />}
                    onClick={handleApprove}
                    sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, py: 1.2, boxShadow: 'none' }}
                  >
                    Approve Guest Pass
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    startIcon={<HighlightOffIcon />}
                    onClick={handleReject}
                    sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, py: 1.2 }}
                  >
                    Reject Guest Request
                  </Button>
                </Stack>
              </Box>
            )}

          </Paper>
        </Grid>

      </Grid>

      {/* Rejection Reason Modal */}
      <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)} fullWidth maxWidth="sm" sx={{ '& .MuiPaper-root': { borderRadius: '16px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 700, color: '#091542' }}>Reject Guest Request</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            Please provide a reason to reject this request for <strong>{guest.name}</strong>.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for Rejection"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, px: 3 }}>
          <Button onClick={() => setOpenRejectDialog(false)} sx={{ color: 'text.secondary', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmReject} 
            variant="contained" 
            color="error"
            disabled={!rejectReason.trim()}
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, px: 3, boxShadow: 'none' }}
          >
            Confirm Reject
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}