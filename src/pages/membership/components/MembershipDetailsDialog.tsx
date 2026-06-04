import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  Paper,
  Grid,
  IconButton,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import StatusBadge from '@/components/StatusBadge';
import { cancelSubscriptionApi, paySubscriptionFromWalletApi } from '@/apis/subscription';
import { useState } from 'react';
import { getFileUrl } from '@/utils/file';

interface MembershipDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  membership: any;
  onRefresh: () => void;
}

export default function MembershipDetailsDialog({ open, onClose, membership, onRefresh }: MembershipDetailsDialogProps) {
  const [cancelling, setCancelling] = useState(false);

  if (!membership) return null;

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this subscription?")) return;
    setCancelling(true);
    try {
      await cancelSubscriptionApi(membership.id);
      onRefresh();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setCancelling(false);
    }
  };

  const handlePayFromWallet = async () => {
    if (!window.confirm("Are you sure you want to pay for this subscription using your wallet balance?")) return;
    setCancelling(true); // Reusing the state for loading
    try {
      await paySubscriptionFromWalletApi(membership.id);
      onRefresh();
      onClose();
    } catch (err: any) {
      alert(err?.message || "Failed to pay from wallet.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0px 8px 32px rgba(9, 21, 66, 0.15)',
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, pb: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#091542' }}>
          Subscription Details
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: '#64748b' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: { xs: 2, md: 4 } }}>
          {/* User Section */}
          <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff', display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar src={getFileUrl(membership.user?.profilePhotoUrl)} imgProps={{ crossOrigin: 'anonymous' }} sx={{ width: 80, height: 80, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
            <Box>
              <Typography variant="h5" sx={{ color: '#091542', fontWeight: 800, mb: 0.5 }}>
                {membership.user?.name || 'Unknown User'}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1, sm: 3 } }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <PersonOutlineIcon fontSize="small" /> {membership.user?.email || 'No email provided'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {membership.user?.phone || 'No phone provided'}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Grid container spacing={3}>
            {/* Plan Info */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ height: '100%', p: 3, borderRadius: 3, bgcolor: '#fafbfd', border: '1px solid #f1f5f9' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <Box sx={{ p: 1, bgcolor: '#eff6ff', borderRadius: 2, display: 'flex' }}>
                    <AssignmentOutlinedIcon sx={{ color: '#0047b3', fontSize: 20 }} />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#091542' }}>
                    Plan Information
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">Plan Name</Typography>
                    <Typography variant="body2" fontWeight="700" color="#091542">{membership.plan?.name || '-'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">Facility</Typography>
                    <Typography variant="body2" fontWeight="700" color="#091542">{membership.facility?.name || '-'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">Amount</Typography>
                    <Typography variant="body2" fontWeight="700" color="#091542">{membership.amount ? `${membership.currency} ${membership.amount}` : '-'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">Payment Status</Typography>
                    <StatusBadge status={membership.paymentStatus || 'PENDING'} variantType="text" />
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Timeline Info */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ height: '100%', p: 3, borderRadius: 3, bgcolor: '#fafbfd', border: '1px solid #f1f5f9' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <Box sx={{ p: 1, bgcolor: '#eff6ff', borderRadius: 2, display: 'flex' }}>
                    <DateRangeOutlinedIcon sx={{ color: '#0047b3', fontSize: 20 }} />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#091542' }}>
                    Duration & Status
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">Start Date</Typography>
                    <Typography variant="body2" fontWeight="700" color="#091542">{membership.startsAt ? new Date(membership.startsAt).toLocaleDateString() : '-'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">End Date</Typography>
                    <Typography variant="body2" fontWeight="700" color="#091542">{membership.endsAt ? new Date(membership.endsAt).toLocaleDateString() : '-'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">Overall Status</Typography>
                    <StatusBadge status={membership.status || 'Active'} variantType="text" />
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Apartment Details */}
            <Grid size={{ xs: 12 }}>
              <Box sx={{ p: 3, borderRadius: 3, bgcolor: '#fafbfd', border: '1px solid #f1f5f9' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Box sx={{ p: 1, bgcolor: '#eff6ff', borderRadius: 2, display: 'flex' }}>
                    <HomeOutlinedIcon sx={{ color: '#0047b3', fontSize: 20 }} />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#091542' }}>
                    Apartment Details
                  </Typography>
                </Box>
                
                <Grid container spacing={3}>
                  <Grid size={{ xs: 6, sm: 4 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Flat Number</Typography>
                    <Typography variant="body2" fontWeight="700" color="#091542">{membership.flat?.flatNumber || '-'}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 4 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Floor</Typography>
                    <Typography variant="body2" fontWeight="700" color="#091542">{membership.flat?.floorNumber || '-'}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1, borderTop: '1px solid #f1f5f9', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {membership.status !== 'CANCELLED' && (
            <Button 
              onClick={handleCancel} 
              disabled={cancelling}
              color="error"
              variant="outlined"
              sx={{ px: 3, py: 1, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              {cancelling ? <CircularProgress size={24} color="inherit" /> : 'Cancel Subscription'}
            </Button>
          )}
          {membership.paymentStatus === 'PENDING' && membership.status !== 'CANCELLED' && (
            <Button 
              onClick={handlePayFromWallet} 
              disabled={cancelling}
              color="primary"
              variant="outlined"
              sx={{ px: 3, py: 1, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              Pay from Wallet
            </Button>
          )}
        </Box>
        <Button onClick={onClose} variant="contained" sx={{ px: 4, py: 1.25, borderRadius: 2, textTransform: 'none', bgcolor: '#0047b3', fontWeight: 700, boxShadow: 'none', '&:hover': { bgcolor: '#003380', boxShadow: 'none' } }}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
