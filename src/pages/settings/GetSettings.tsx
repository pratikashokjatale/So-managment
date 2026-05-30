import { useState } from 'react';
import { 
  Box, Typography, Button, Breadcrumbs, Link, Stack, TextField, MenuItem, Divider, Paper, Switch, FormControlLabel, Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Settings as GeneralIcon,
  CardMembership as MembershipIcon,
  Payment as PaymentIcon,
  Security as AccessIcon,
  Email as EmailIcon,
  Notifications as NotificationIcon,
  CloudUpload as BackupIcon,
  Lock as SecurityIcon,
  ChevronRight as ChevronIcon
} from '@mui/icons-material';

const settingTabs = [
  { id: 'general', label: 'General Settings', icon: <GeneralIcon /> },
  { id: 'membership', label: 'Membership Settings', icon: <MembershipIcon /> },
  { id: 'payment', label: 'Payment Settings', icon: <PaymentIcon /> },
  { id: 'access', label: 'Access Control', icon: <AccessIcon /> },
  { id: 'email', label: 'Email & SMS', icon: <EmailIcon /> },
  { id: 'notification', label: 'Notification Settings', icon: <NotificationIcon /> },
  { id: 'backup', label: 'Backup Settings', icon: <BackupIcon /> },
  { id: 'security', label: 'Security Settings', icon: <SecurityIcon /> },
];

export default function GetSettings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');

  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '14px',
      bgcolor: '#f8fafc',
      '& fieldset': { border: '1px solid #e2e8f0' },
      '&:hover fieldset': { borderColor: '#091542' },
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Page Header */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" fontWeight="900" color="#091542" sx={{ mb: 1 }}>Settings</Typography>
</Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '350px 1fr' }, gap: 6 }}>
        
        {/* Category Sidebar */}
        <Stack spacing={2}>
          {settingTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Box
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  p: 2.5,
                  borderRadius: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  bgcolor: isActive ? '#eff6ff' : 'white',
                  border: `2px solid ${isActive ? '#bfdbfe' : 'transparent'}`,
                  boxShadow: isActive ? 'none' : '0 4px 6px -1px rgba(0,0,0,0.05)',
                  '&:hover': {
                    transform: isActive ? 'none' : 'translateY(-2px)',
                    boxShadow: isActive ? 'none' : '0 10px 15px -3px rgba(0,0,0,0.1)',
                    bgcolor: isActive ? '#eff6ff' : '#f8fafc'
                  }
                }}
              >
                <Box sx={{ 
                  width: 52, 
                  height: 52, 
                  borderRadius: '16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: isActive ? '#091542' : '#f1f5f9',
                  color: isActive ? 'white' : '#64748b',
                  transition: '0.3s'
                }}>
                  {tab.icon}
                </Box>
                <Typography variant="h6" fontWeight="800" sx={{ flexGrow: 1, color: isActive ? '#091542' : '#475569' }}>
                  {tab.label}
                </Typography>
                {isActive && <ChevronIcon sx={{ color: '#091542' }} />}
              </Box>
            );
          })}
        </Stack>

        {/* Dynamic Content Pane */}
        <Paper elevation={0} sx={{ p: 5, borderRadius: '40px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
          {activeTab === 'general' && (
            <Box>
              
              <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>Configure your society's primary identity and global preferences.</Typography>
              
              <Stack spacing={5}>
                <Box>
                  <Typography variant="subtitle1" fontWeight="800" sx={{ mb: 2, color: '#091542' }}>SOCIETY IDENTITY</Typography>
                  <Stack spacing={3}>
                    <TextField label="Society Name" fullWidth defaultValue="Club Marbella" sx={textFieldSx} />
                    <TextField label="Official Email" fullWidth defaultValue="admin@marbellaclub.com" sx={textFieldSx} />
                    <TextField label="Society Address" fullWidth multiline rows={3} defaultValue="Marbella Club, Pearl City, Wing A" sx={textFieldSx} />
                  </Stack>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="subtitle1" fontWeight="800" sx={{ mb: 2, color: '#091542' }}>REGIONAL CONFIG</Typography>
                  <TextField select label="Timezone" fullWidth defaultValue="Asia/Kolkata" sx={textFieldSx}>
                    <MenuItem value="Asia/Kolkata">Asia/Kolkata (IST)</MenuItem>
                    <MenuItem value="UTC">UTC (Universal Time)</MenuItem>
                  </TextField>
                </Box>
              </Stack>
            </Box>
          )}

          {activeTab === 'membership' && (
            <Box>
              <Typography variant="h4" fontWeight="900" color="#091542" sx={{ mb: 1 }}>Membership Logic</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>Manage enrollment rules and card identity standards.</Typography>
              
              <Stack spacing={4}>
                <FormControlLabel control={<Switch defaultChecked />} label={<Typography fontWeight="700">Auto-Expiry on Payment Overdue</Typography>} />
                <FormControlLabel control={<Switch defaultChecked />} label={<Typography fontWeight="700">Allow Master User Guest Creation</Typography>} />
                <Divider />
                <Typography variant="subtitle1" fontWeight="800" color="#091542">DEFAULT FEE STRUCTURE</Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 6 }}><TextField label="Monthly Fee" fullWidth defaultValue="₹2,500.00" sx={textFieldSx} /></Grid>
                  <Grid size={{ xs: 6 }}><TextField label="Security Deposit" fullWidth defaultValue="₹5,000.00" sx={textFieldSx} /></Grid>
                </Grid>
              </Stack>
            </Box>
          )}

          {activeTab === 'payment' && (
            <Box>
              <Typography variant="h4" fontWeight="900" color="#091542" sx={{ mb: 1 }}>Payment Gateway</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>Configure financial transaction protocols and wallet rules.</Typography>
              
              <Stack spacing={4}>
                <TextField select label="Primary Gateway" fullWidth defaultValue="Razorpay" sx={textFieldSx}>
                  <MenuItem value="Razorpay">Razorpay (India)</MenuItem>
                  <MenuItem value="Stripe">Stripe (International)</MenuItem>
                </TextField>
                <TextField label="GST Number" fullWidth sx={textFieldSx} />
                <Divider />
                <FormControlLabel control={<Switch defaultChecked />} label={<Typography fontWeight="700">Enable Activity Wallet Auto-Recharge</Typography>} />
              </Stack>
            </Box>
          )}

          {/* Action Footer */}
          <Box sx={{ mt: 8, pt: 4, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button sx={{ borderRadius: '14px', textTransform: 'none', px: 4, fontWeight: 700, color: '#64748b' }}>Discard</Button>
            <Button variant="contained" sx={{ borderRadius: '16px', textTransform: 'none', px: 6, py: 1.5, fontWeight: 900, bgcolor: '#091542' }}>Apply Changes</Button>
          </Box>
        </Paper>
      </Box>

    </Box>
  );
}
