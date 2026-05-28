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
          <Paper elevation={0} sx={{ 
            p: 4, 
            borderRadius: '32px', 
            border: '1px solid rgba(226, 232, 240, 0.8)', 
            bgcolor: 'white', 
            height: '100%',
            boxShadow: '0 10px 30px rgba(0,0,0,0.01)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'all 0.3s ease',
            '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 20px 40px rgba(49, 46, 129, 0.08)' }
          }}>
            <Box>
              <Stack direction="row" spacing={2.5} alignItems="center" sx={{ mb: 4 }}>
                <Box sx={{ p: 1.5, bgcolor: 'rgba(49, 46, 129, 0.06)', borderRadius: '14px', color: '#312e81' }}><WalletIcon /></Box>
                <Typography variant="h6" fontWeight="900" color="#091542">Membership Wallet</Typography>
              </Stack>
              
              {/* Virtual Membership Card */}
              <Box sx={{
                p: 3,
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                mb: 4,
                boxShadow: '0 12px 28px rgba(30, 27, 75, 0.25)'
              }}>
                <Box sx={{ 
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                  background: 'radial-gradient(circle at 10% 10%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 80%)'
                }} />
                <Typography variant="caption" sx={{ letterSpacing: '1px', opacity: 0.8, fontWeight: 800 }}>MEMBERSHIP STATUS</Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.5, mb: 3 }}>
                  <Typography variant="h5" fontWeight="900" sx={{ letterSpacing: '-0.5px' }}>{wallets.membership.status}</Typography>
                  <Chip label="Monthly Based" size="small" sx={{ fontWeight: 900, bgcolor: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '0.65rem' }} />
                </Stack>
                <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 700, display: 'block' }}>ACTIVE PERIOD</Typography>
                <Typography variant="body2" fontWeight="800" sx={{ mt: 0.5 }}>{wallets.membership.currentMonth}</Typography>
              </Box>
            </Box>

            <Box>
              <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />
              <Typography variant="caption" fontWeight="800" color="#94a3b8" sx={{ letterSpacing: '0.5px' }}>REFUNDABLE BALANCE (UPCOMING)</Typography>
              <Typography variant="h4" fontWeight="900" color="#312e81" sx={{ mt: 1, mb: 0.5 }}>{wallets.membership.refundableFuture}</Typography>
              <Typography variant="caption" color="#64748b" fontWeight="700">Valid for unused future months only</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ 
            p: 4, 
            borderRadius: '32px', 
            border: '1px solid rgba(226, 232, 240, 0.8)', 
            bgcolor: 'white', 
            height: '100%',
            boxShadow: '0 10px 30px rgba(0,0,0,0.01)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'all 0.3s ease',
            '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 20px 40px rgba(6, 95, 70, 0.08)' }
          }}>
            <Box>
              <Stack direction="row" spacing={2.5} alignItems="center" sx={{ mb: 4 }}>
                <Box sx={{ p: 1.5, bgcolor: 'rgba(6, 95, 70, 0.06)', borderRadius: '14px', color: '#065f46' }}><TimelineIcon /></Box>
                <Typography variant="h6" fontWeight="900" color="#091542">Activity Wallet</Typography>
              </Stack>
              
              {/* Virtual Activity Card */}
              <Box sx={{
                p: 3,
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #065f46 0%, #022c22 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                mb: 4,
                boxShadow: '0 12px 28px rgba(2, 44, 34, 0.25)'
              }}>
                <Box sx={{ 
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                  background: 'radial-gradient(circle at 10% 10%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 80%)'
                }} />
                <Typography variant="caption" sx={{ letterSpacing: '1px', opacity: 0.8, fontWeight: 800 }}>AVAILABLE BALANCE</Typography>
                <Typography variant="h3" fontWeight="900" sx={{ mt: 1.5, mb: 3, letterSpacing: '-1px' }}>{wallets.activity.balance}</Typography>
                <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 700, display: 'block' }}>REVENUE ENGINE</Typography>
                <Typography variant="body2" fontWeight="800" sx={{ mt: 0.5 }}>Auto-Debit Enabled</Typography>
              </Box>
            </Box>

            <Box>
              <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />
              <List disablePadding>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}><SuccessIcon sx={{ color: '#10b981', fontSize: 18 }} /></ListItemIcon>
                  <ListItemText primary={<Typography variant="body2" fontWeight="700" color="#1e293b">In-App Recharge Enabled</Typography>} />
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}><SuccessIcon sx={{ color: '#10b981', fontSize: 18 }} /></ListItemIcon>
                  <ListItemText primary={<Typography variant="body2" fontWeight="700" color="#1e293b">Auto-Debit on Checkout</Typography>} />
                </ListItem>
              </List>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ 
            p: 4, 
            borderRadius: '32px', 
            border: '1px solid rgba(226, 232, 240, 0.8)', 
            bgcolor: '#091542', 
            color: 'white', 
            height: '100%',
            boxShadow: '0 12px 36px rgba(9, 21, 66, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'all 0.3s ease',
            '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 20px 40px rgba(9, 21, 66, 0.25)' }
          }}>
            <Box>
              <Stack direction="row" spacing={2.5} alignItems="center" sx={{ mb: 4 }}>
                <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '14px', color: 'white' }}><SecurityIcon /></Box>
                <Typography variant="h6" fontWeight="900">Security Deposit</Typography>
              </Stack>
              
              {/* Virtual Security Card */}
              <Box sx={{
                p: 3,
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #111827 0%, #030712 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                mb: 4,
                boxShadow: '0 12px 28px rgba(3, 7, 18, 0.35)',
                border: '1px solid rgba(255,255,255,0.15)'
              }}>
                <Box sx={{ 
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                  background: 'radial-gradient(circle at 10% 10%, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 80%)'
                }} />
                <Typography variant="caption" sx={{ letterSpacing: '1px', opacity: 0.8, fontWeight: 800 }}>LOCKED DEPOSIT</Typography>
                <Typography variant="h3" fontWeight="900" sx={{ mt: 1.5, mb: 3, letterSpacing: '-1px' }}>{wallets.security.locked}</Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 700 }}>REFUND ELIGIBILITY</Typography>
                  <Chip label={wallets.security.refundable} size="small" sx={{ bgcolor: 'white', color: '#091542', fontWeight: 900, fontSize: '0.65rem', height: 20 }} />
                </Stack>
              </Box>
            </Box>

            <Box>
              <Divider sx={{ mb: 3, borderColor: 'rgba(255,255,255,0.15)', borderStyle: 'dashed' }} />
              <Stack spacing={1.5}>
                <Typography variant="caption" fontWeight="800" sx={{ color: 'rgba(255,255,255,0.6)', letterSpacing: '0.5px' }}>REFUND POLICY</Typography>
                <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.85)' }}>• Full refund on undamaged card return</Typography>
                <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.85)' }}>• Deductions apply for damaged fobs</Typography>
              </Stack>
            </Box>
          </Paper>
        </Grid>

        {/* Detailed Membership Timeline */}
        <Grid size={{ xs: 12 }}>
          <Paper elevation={0} sx={{ 
            p: 4, 
            borderRadius: '32px', 
            border: '1px solid #e2e8f0', 
            bgcolor: 'white',
            boxShadow: '0 10px 30px rgba(0,0,0,0.01)'
          }}>
            <Stack direction="row" spacing={2.5} alignItems="center" sx={{ mb: 4 }}>
              <Box sx={{ p: 1, bgcolor: 'rgba(9, 21, 66, 0.05)', borderRadius: '10px', color: '#091542' }}><HistoryIcon /></Box>
              <Typography variant="h6" fontWeight="900" color="#091542">Membership Timeline</Typography>
            </Stack>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 3 }}>
                <Box sx={{ 
                  p: 3, 
                  bgcolor: '#f0fdf4', 
                  borderRadius: '24px', 
                  border: '1px solid #dcfce7',
                  transition: 'all 0.2s',
                  '&:hover': { transform: 'translateY(-2px)' }
                }}>
                  <Typography variant="caption" fontWeight="800" color="#10b981" sx={{ letterSpacing: '0.5px' }}>CURRENT ACTIVE</Typography>
                  <Typography variant="body1" fontWeight="800" color="#091542" sx={{ mt: 1, mb: 0.5 }}>{wallets.membership.currentMonth}</Typography>
                  <Typography variant="caption" color="#64748b" fontWeight="700">Non-Refundable Phase</Typography>
                </Box>
              </Grid>
              {wallets.membership.upcomingMonths.map((month) => (
                <Grid size={{ xs: 12, md: 3 }} key={month}>
                  <Box sx={{ 
                    p: 3, 
                    bgcolor: '#f8fafc', 
                    borderRadius: '24px', 
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.2s',
                    '&:hover': { transform: 'translateY(-2px)' }
                  }}>
                    <Typography variant="caption" fontWeight="800" color="#64748b" sx={{ letterSpacing: '0.5px' }}>UPCOMING (PAID)</Typography>
                    <Typography variant="body1" fontWeight="800" color="#1e293b" sx={{ mt: 1, mb: 0.5 }}>{month}</Typography>
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
