import { useState } from 'react';
import { 
  Box, Typography, Button, Breadcrumbs, Link, Stack, TextField, MenuItem, Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import PaymentIcon from '@mui/icons-material/Payment';
import SecurityIcon from '@mui/icons-material/Security';
import EmailIcon from '@mui/icons-material/Email';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BackupIcon from '@mui/icons-material/Backup';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const settingTabs = [
  { id: 'general', label: 'General Settings', icon: <SettingsIcon fontSize="small" />, description: 'View and update your society basic details.' },
  { id: 'membership', label: 'Membership Settings', icon: <CardMembershipIcon fontSize="small" />, description: 'Configure membership types and rules.' },
  { id: 'payment', label: 'Payment Settings', icon: <PaymentIcon fontSize="small" />, description: 'Manage payment gateways and methods.' },
  { id: 'access', label: 'Access Control', icon: <SecurityIcon fontSize="small" />, description: 'Define user roles and permissions.' },
  { id: 'email', label: 'Email & SMS', icon: <EmailIcon fontSize="small" />, description: 'Setup communication channels.' },
  { id: 'notification', label: 'Notification Settings', icon: <NotificationsIcon fontSize="small" />, description: 'Manage push and email alerts.' },
  { id: 'backup', label: 'Backup Settings', icon: <BackupIcon fontSize="small" />, description: 'Configure system backups.' },
  { id: 'security', label: 'Security Settings', icon: <VerifiedUserIcon fontSize="small" />, description: 'Update passwords and auth settings.' },
];

export default function GetSettings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');

  const [generalSettings, setGeneralSettings] = useState({
    clubName: 'Club Marbella',
    address: 'Marbella Club, Main Gate, Pearl City',
    contactNumber: '+91 98765 43210',
    email: 'info@clubmarbella.com',
    timezone: 'Asia/Kolkata',
  });

  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      bgcolor: '#f8fafc',
      '& fieldset': { border: '1px solid #e2e8f0' },
      '&:hover fieldset': { borderColor: '#0047b3' },
    },
    '& .MuiInputLabel-root': {
      fontWeight: 500,
      color: 'text.secondary',
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, bgcolor: '#ffffff', minHeight: '100vh', borderRadius: 2 }}>
      
      {/* Header Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" fontWeight="800" sx={{ mb: 1, color: '#002855', letterSpacing: '-0.5px' }}>
          Settings
        </Typography>
        <Breadcrumbs separator="•" aria-label="breadcrumb">
          <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer', fontWeight: 500 }}>
            Dashboard
          </Link>
          <Typography color="text.primary" fontWeight="600">Preferences</Typography>
        </Breadcrumbs>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '300px 1fr' }, gap: 8 }}>
        
        {/* Navigation Sidebar */}
        <Box>
          <Stack spacing={1}>
            {settingTabs.map((tab) => (
              <Box
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  bgcolor: activeTab === tab.id ? 'rgba(0, 71, 179, 0.05)' : 'transparent',
                  border: activeTab === tab.id ? '1px solid rgba(0, 71, 179, 0.1)' : '1px solid transparent',
                  '&:hover': {
                    bgcolor: activeTab === tab.id ? 'rgba(0, 71, 179, 0.08)' : '#f8fafc',
                  }
                }}
              >
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: activeTab === tab.id ? '#0047b3' : '#f1f5f9',
                  color: activeTab === tab.id ? 'white' : '#64748b',
                }}>
                  {tab.icon}
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight="700" color={activeTab === tab.id ? '#0047b3' : '#1e293b'}>
                    {tab.label}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Content Section */}
        <Box>
          {activeTab === 'general' && (
            <Box>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight="800" color="#002855" sx={{ mb: 1 }}>General Settings</Typography>
                <Typography variant="body2" color="text.secondary">Manage your society's identity and basic information.</Typography>
              </Box>
              
              <Stack spacing={6}>
                {/* Society Information */}
                <Box>
                  <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 3, color: '#002855' }}>Society Identity</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 4 }}>
                    <TextField
                      label="Society Name"
                      fullWidth
                      value={generalSettings.clubName}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, clubName: e.target.value })}
                      sx={textFieldSx}
                    />
                    <TextField
                      label="Physical Address"
                      fullWidth
                      multiline
                      rows={3}
                      value={generalSettings.address}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                      sx={textFieldSx}
                    />
                  </Box>
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                {/* Contact Information */}
                <Box>
                  <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 3, color: '#002855' }}>Contact Information</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 4 }}>
                    <TextField
                      label="Primary Contact Number"
                      fullWidth
                      value={generalSettings.contactNumber}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, contactNumber: e.target.value })}
                      sx={textFieldSx}
                    />
                    <TextField
                      label="Official Email Address"
                      fullWidth
                      value={generalSettings.email}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, email: e.target.value })}
                      sx={textFieldSx}
                    />
                  </Box>
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                {/* Regional Preferences */}
                <Box>
                  <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 3, color: '#002855' }}>Regional Preferences</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 4 }}>
                    <TextField
                      select
                      label="System Timezone"
                      fullWidth
                      value={generalSettings.timezone}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                      sx={textFieldSx}
                    >
                      <MenuItem value="Asia/Kolkata">Asia/Kolkata (IST)</MenuItem>
                      <MenuItem value="UTC">UTC (Universal Time)</MenuItem>
                      <MenuItem value="America/New_York">America/New_York (EST)</MenuItem>
                    </TextField>
                  </Box>
                </Box>
              </Stack>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 8, pt: 4, borderTop: '1px solid #f1f5f9' }}>
                <Button 
                  variant="contained" 
                  sx={{ 
                    borderRadius: '14px', 
                    textTransform: 'none', 
                    px: 8, 
                    py: 1.8, 
                    fontWeight: 800, 
                    bgcolor: '#0047b3', 
                    boxShadow: '0 4px 14px 0 rgba(0,71,179,0.39)',
                    '&:hover': {
                      bgcolor: '#003380',
                      boxShadow: '0 6px 20px rgba(0,71,179,0.23)'
                    }
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            </Box>
          )}

          {activeTab !== 'general' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 500, bgcolor: '#f8fafc', borderRadius: '24px' }}>
              <Box sx={{ 
                width: 80, 
                height: 80, 
                borderRadius: '24px', 
                bgcolor: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                mb: 3
              }}>
                {settingTabs.find(t => t.id === activeTab)?.icon}
              </Box>
              <Typography variant="h6" color="#002855" fontWeight="800">
                {settingTabs.find(t => t.id === activeTab)?.label}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{settingTabs.find(t => t.id === activeTab)?.description}</Typography>
              <Button variant="outlined" sx={{ mt: 4, borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}>Request Access</Button>
            </Box>
          )}
        </Box>
      </Box>

    </Box>
  );
}
