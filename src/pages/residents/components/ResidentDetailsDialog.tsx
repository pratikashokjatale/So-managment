import { 
  Dialog, DialogTitle, DialogContent, Box, Typography, 
  IconButton, Stack, Paper, Divider, 
  Button, Chip, List, ListItem, ListItemText,
  Avatar
} from '@mui/material';
import { 
  Close as CloseIcon,
  Timer as TimerIcon,
  AccountBalanceWallet as WalletIcon,
  Security as SecurityIcon,
  ShoppingCart as CartIcon,
  History as HistoryIcon,
  Add as AddIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import ActivityBookingEngine from './ActivityBookingEngine';

interface ResidentDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  resident: any;
}

export default function ResidentDetailsDialog({ open, onClose, resident }: ResidentDetailsDialogProps) {
  if (!resident) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{ sx: { borderRadius: '24px', overflow: 'hidden' } }}
    >
      <DialogTitle sx={{ bgcolor: '#091542', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={resident.avatar} sx={{ width: 48, height: 48, border: '2px solid white' }} />
          <Box>
            <Typography variant="h6" fontWeight="900">{resident.name}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>{resident.apartment} • {resident.role} • {resident.cardColor} Card</Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 4, bgcolor: '#f8fafc' }}>
        
        {/* Wallet System */}
        <Typography variant="subtitle2" fontWeight="900" color="text.secondary" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
          Account Wallets
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3, mb: 5 }}>
          {/* Membership Wallet */}
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
              <Box sx={{ p: 1, bgcolor: '#eff6ff', color: '#1d4ed8', borderRadius: '10px' }}>
                <TimerIcon />
              </Box>
              <Typography variant="subtitle1" fontWeight="800">Membership</Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">Active Status</Typography>
            <Typography variant="h6" fontWeight="800" color="#10b981" sx={{ mb: 1 }}>{resident.membership}</Typography>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">Expires:</Typography>
              <Typography variant="caption" fontWeight="700">{resident.expiry}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">Refundable:</Typography>
              <Typography variant="caption" fontWeight="700" color="primary">₹4,500.00</Typography>
            </Box>
          </Paper>

          {/* Activity Wallet */}
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
              <Box sx={{ p: 1, bgcolor: '#fef2f2', color: '#ef4444', borderRadius: '10px' }}>
                <WalletIcon />
              </Box>
              <Typography variant="subtitle1" fontWeight="800">Activity Wallet</Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">Current Balance</Typography>
            <Typography variant="h6" fontWeight="800" color="#1e293b" sx={{ mb: 1 }}>₹12,450.00</Typography>
            <Divider sx={{ my: 1 }} />
            <Button fullWidth size="small" variant="contained" sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700 }}>
              Recharge
            </Button>
          </Paper>

          {/* Security Deposit Wallet */}
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
              <Box sx={{ p: 1, bgcolor: '#f0fdf4', color: '#10b981', borderRadius: '10px' }}>
                <SecurityIcon />
              </Box>
              <Typography variant="subtitle1" fontWeight="800">Security</Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">Locked Amount</Typography>
            <Typography variant="h6" fontWeight="800" color="#64748b" sx={{ mb: 1 }}>₹5,000.00</Typography>
            <Divider sx={{ my: 1 }} />
            <Chip label="Refundable" size="small" color="success" sx={{ fontWeight: 700, borderRadius: '6px' }} />
          </Paper>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          {/* Shopping Cart */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid #e2e8f0' }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
              <CartIcon color="primary" />
              <Typography variant="h6" fontWeight="900">Active Cart</Typography>
            </Stack>
            <List disablePadding>
              <ListItem sx={{ px: 0, py: 1.5 }}>
                <ListItemText 
                  primary={<Typography variant="body2" fontWeight="700">Squash Court Booking</Typography>}
                  secondary="May 18, 5:00 PM - 7:00 PM (2 Slots)"
                />
                <Typography variant="body2" fontWeight="800">₹400.00</Typography>
              </ListItem>
              <Divider sx={{ borderStyle: 'dashed' }} />
              <ListItem sx={{ px: 0, py: 1.5 }}>
                <ListItemText 
                  primary={<Typography variant="body2" fontWeight="700">Gym Membership</Typography>}
                  secondary="Monthly Access"
                />
                <Typography variant="body2" fontWeight="800">₹2,000.00</Typography>
              </ListItem>
            </List>
            <Box sx={{ mt: 3, p: 2, bgcolor: '#f1f5f9', borderRadius: '12px' }}>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Total Amount</Typography>
                  <Typography variant="caption" fontWeight="800">₹2,400.00</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="primary" fontWeight="700">Wallet Deduction</Typography>
                  <Typography variant="caption" color="primary" fontWeight="800">-₹1,000.00</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" fontWeight="900">Final Payable</Typography>
                  <Typography variant="body2" fontWeight="900" color="primary">₹1,400.00</Typography>
                </Box>
              </Stack>
            </Box>
            <Button fullWidth variant="contained" sx={{ mt: 3, borderRadius: '12px', height: 48, fontWeight: 900, textTransform: 'none', bgcolor: '#0047b3' }}>
              Complete Checkout
            </Button>
          </Paper>

          {/* Quick Actions & Limits */}
          <Stack spacing={3}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                <HistoryIcon color="secondary" />
                <Typography variant="h6" fontWeight="900">Booking Limits</Typography>
              </Stack>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" fontWeight="700">Active Slots (Today)</Typography>
                  <Typography variant="caption" fontWeight="800">2 / 2 Max</Typography>
                </Box>
                <Box sx={{ width: '100%', height: 6, bgcolor: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                  <Box sx={{ width: '100%', height: '100%', bgcolor: '#ef4444' }} />
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                * Limit enforced: Maximum 2 continuous slots per activity. Admin override required for full-day bookings.
              </Typography>
            </Paper>

            <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
              <Typography variant="subtitle2" fontWeight="900" sx={{ mb: 2 }}>Administrative Actions</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Button variant="outlined" startIcon={<AddIcon />} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}>
                  New Pass
                </Button>
                <Button variant="outlined" startIcon={<ReceiptIcon />} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}>
                  Billing
                </Button>
              </Box>
            </Paper>
          </Stack>
        </Box>

        <Box sx={{ mt: 5 }}>
          <ActivityBookingEngine />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
