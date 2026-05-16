import { 
  Box, Typography, Paper, Grid, Stack, Chip, Divider, 
  List, ListItem, ListItemText, ListItemIcon 
} from '@mui/material';
import { 
  AccountBalanceWallet as WalletIcon, 
  CheckCircle as SuccessIcon, 
  Timeline as TimelineIcon,
  Security as SecurityIcon,
  History as HistoryIcon
} from '@mui/icons-material';

interface WalletProps {
  wallets: {
    membership: { 
      status: string; 
      currentMonth: string;
      upcomingMonths: string[];
      expiry: string;
      refundableFuture: string;
    };
    activity: { balance: string };
    security: { locked: string; refundable: string; condition: string };
  }
}

export default function ResidentWallets({ wallets }: WalletProps) {
  return (
    <Box>
      <Grid container spacing={4}>
        {/* Triple Wallet Summary */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1px solid #e2e8f0', bgcolor: 'white', height: '100%' }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
              <Box sx={{ p: 1.5, bgcolor: '#eff6ff', borderRadius: '12px', color: '#1d4ed8' }}><WalletIcon /></Box>
              <Typography variant="h6" fontWeight="900" color="#002855">Membership Wallet</Typography>
            </Stack>
            <Box sx={{ mb: 4 }}>
              <Typography variant="caption" fontWeight="800" color="#94a3b8">CURRENT STATUS</Typography>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                <Typography variant="h5" fontWeight="900" color="#1e293b">{wallets.membership.status}</Typography>
                <Chip label="Monthly Based" size="small" sx={{ fontWeight: 900, bgcolor: '#f1f5f9' }} />
              </Stack>
            </Box>
            <Divider sx={{ mb: 4 }} />
            <Box sx={{ mb: 4 }}>
              <Typography variant="caption" fontWeight="800" color="#94a3b8">ACTIVE PERIOD (NON-REFUNDABLE)</Typography>
              <Typography variant="body1" fontWeight="800" color="#002855" sx={{ mt: 1 }}>{wallets.membership.currentMonth}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" fontWeight="800" color="#94a3b8">REFUNDABLE BALANCE (UPCOMING)</Typography>
              <Typography variant="h4" fontWeight="900" color="#1d4ed8" sx={{ mt: 1 }}>{wallets.membership.refundableFuture}</Typography>
              <Typography variant="caption" color="#64748b" fontWeight="700">Valid for unused future months only</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1px solid #e2e8f0', bgcolor: 'white', height: '100%' }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
              <Box sx={{ p: 1.5, bgcolor: '#f0fdf4', borderRadius: '12px', color: '#10b981' }}><TimelineIcon /></Box>
              <Typography variant="h6" fontWeight="900" color="#002855">Activity Wallet</Typography>
            </Stack>
            <Box sx={{ mb: 4 }}>
              <Typography variant="caption" fontWeight="800" color="#94a3b8">AVAILABLE BALANCE</Typography>
              <Typography variant="h3" fontWeight="900" color="#10b981" sx={{ mt: 1 }}>{wallets.activity.balance}</Typography>
              <Typography variant="caption" color="#64748b" fontWeight="700">Used for Table Tennis, Squash, Cinema etc.</Typography>
            </Box>
            <Divider sx={{ mb: 4 }} />
            <List disablePadding>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 36 }}><SuccessIcon sx={{ color: '#10b981', fontSize: 20 }} /></ListItemIcon>
                <ListItemText primary={<Typography variant="body2" fontWeight="700">In-App Recharge Enabled</Typography>} />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 36 }}><SuccessIcon sx={{ color: '#10b981', fontSize: 20 }} /></ListItemIcon>
                <ListItemText primary={<Typography variant="body2" fontWeight="700">Auto-Debit on Checkout</Typography>} />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1px solid #e2e8f0', bgcolor: '#002855', color: 'white', height: '100%' }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
              <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }}><SecurityIcon /></Box>
              <Typography variant="h6" fontWeight="900">Security Deposit</Typography>
            </Stack>
            <Box sx={{ mb: 4 }}>
              <Typography variant="caption" fontWeight="800" sx={{ color: 'rgba(255,255,255,0.6)' }}>LOCKED AMOUNT</Typography>
              <Typography variant="h3" fontWeight="900" sx={{ mt: 1 }}>{wallets.security.locked}</Typography>
            </Box>
            <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '16px', mb: 4 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" fontWeight="700">Refund Eligibility</Typography>
                <Chip label={wallets.security.refundable} size="small" sx={{ bgcolor: 'white', color: '#002855', fontWeight: 900 }} />
              </Stack>
            </Box>
            <Stack spacing={1}>
              <Typography variant="caption" fontWeight="800" sx={{ color: 'rgba(255,255,255,0.6)' }}>REFUND POLICY</Typography>
              <Typography variant="caption" sx={{ display: 'block' }}>• Full refund on undamaged card return</Typography>
              <Typography variant="caption" sx={{ display: 'block' }}>• Deductions apply for damaged fobs</Typography>
            </Stack>
          </Paper>
        </Grid>

        {/* Detailed Membership Timeline */}
        <Grid size={{ xs: 12 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
              <HistoryIcon sx={{ color: '#002855' }} />
              <Typography variant="h6" fontWeight="900" color="#002855">Membership Timeline</Typography>
            </Stack>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 3 }}>
                <Box sx={{ p: 3, bgcolor: '#f0fdf4', borderRadius: '20px', border: '1px solid #dcfce7' }}>
                  <Typography variant="caption" fontWeight="800" color="#10b981">CURRENT ACTIVE</Typography>
                  <Typography variant="body1" fontWeight="800" color="#002855">{wallets.membership.currentMonth}</Typography>
                  <Typography variant="caption" color="#64748b" fontWeight="700">Non-Refundable Phase</Typography>
                </Box>
              </Grid>
              {wallets.membership.upcomingMonths.map((month) => (
                <Grid size={{ xs: 12, md: 3 }} key={month}>
                  <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                    <Typography variant="caption" fontWeight="800" color="#64748b">UPCOMING (PAID)</Typography>
                    <Typography variant="body1" fontWeight="800" color="#1e293b">{month}</Typography>
                    <Typography variant="caption" color="#10b981" fontWeight="800">Refundable</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
