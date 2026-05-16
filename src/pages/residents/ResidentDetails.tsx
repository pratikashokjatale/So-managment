import { useState } from 'react';
import { 
  Box, Typography, Avatar, 
  Button, IconButton, Stack, Tabs, Tab, Paper,
  Grid, Chip, Divider, Tooltip
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowBack as BackIcon,
  EditOutlined as EditIcon,
  Description as FileIcon,
  CalendarMonth as CalendarIcon,
  Verified as VerifiedIcon,
  Add as AddIcon,
  Upload as UploadIcon,
  CreditCard as CardIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import ResidentWallets from './components/ResidentWallets';
import ResidentAmenities from './components/ResidentAmenities';
import bannerImg from '../../assets/marbella-banner.png';

export default function ResidentDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(0);

  const resident = {
    id: id || 'ERD246534',
    name: 'Graziele Lopes',
    email: 'graziele.lopes@society.com',
    phone: '+91 98765 43210',
    avatar: 'https://i.pravatar.cc/150?u=graziele',
    cardColor: 'Blue',
    cardNo: 'CMR101-M01',
    category: 'Resident',
    role: 'Master User (Owner)',
    status: 'Verified Profile',
    startDate: '27 Jan 2025',
    apartment: 'Wing A • Flat 1001',
    kyc: {
      aadhaar: 'XXXX-XXXX-8824',
      pan: 'ABCDE1234F',
      photoStatus: 'Verified'
    },
    wallets: {
      membership: { 
        status: 'Active', 
        currentMonth: 'May 2024 (Paid)',
        upcomingMonths: ['June 2024', 'July 2024', 'August 2024'],
        expiry: 'Aug 31, 2024',
        refundableFuture: '₹7,500.00' 
      },
      activity: { balance: '₹12,450.00' },
      security: { locked: '₹5,000.00', refundable: 'Yes (On exit)', condition: 'Good' }
    }
  };

  const mockFamily = [
    { id: 1, name: 'John Smith', role: 'Dependent (Spouse)', cardNo: 'CMR101-D01', status: 'Active', cardColor: 'Blue' },
    { id: 2, name: 'Emma Smith', role: 'Dependent (Daughter)', cardNo: 'CMR101-D02', status: 'Active', cardColor: 'Blue' },
  ];

  const mockBookings = [
    { id: 101, activity: 'Squash Court', slots: '5:00 PM - 7:00 PM (2 Slots)', date: 'May 18, 2024', amount: '₹400.00', status: 'Confirmed' },
    { id: 102, activity: 'Table Tennis', slots: '10:00 AM - 11:00 AM (1 Slot)', date: 'May 17, 2024', amount: '₹150.00', status: 'Completed' },
    { id: 103, activity: 'Home Theatre', slots: '8:00 PM - 10:00 PM (2 Slots)', date: 'May 15, 2024', amount: '₹1,000.00', status: 'Completed' },
  ];

  const handleTabChange = (_: any, newValue: number) => setActiveTab(newValue);

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pb: 8 }}>
      
      {/* Official Branded Header */}
      <Box sx={{ position: 'relative', mb: 10 }}>
        <Box sx={{ 
          height: 180, 
          width: '100%', 
          backgroundImage: `url(${bannerImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          borderRadius: '0 0 40px 40px',
          boxShadow: 'inset 0 -80px 100px -40px rgba(0,0,0,0.5), 0 10px 30px -10px rgba(0,0,0,0.1)'
        }} />
        
        <IconButton 
          onClick={() => navigate('/residents')} 
          sx={{ 
            position: 'absolute', top: 20, left: 20, 
            bgcolor: 'rgba(255,255,255,0.95)', zIndex: 2, 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            '&:hover': { bgcolor: 'white' } 
          }}
        >
          <BackIcon sx={{ color: '#002855' }} />
        </IconButton>

        <Box sx={{ px: { xs: 2, md: 6 }, mt: -6, position: 'relative', zIndex: 3 }}>
          <Stack direction="row" alignItems="flex-end" spacing={4}>
            <Avatar 
              src={resident.avatar} 
              sx={{ 
                width: 140, height: 140, 
                border: '6px solid #f8fafc', 
                boxShadow: '0 20px 40px -15px rgba(0,0,0,0.3)',
                bgcolor: 'white'
              }} 
            />
            <Box sx={{ flexGrow: 1, pb: 1 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="h4" fontWeight="900" color="#1e293b" sx={{ textShadow: '0 2px 4px rgba(255,255,255,0.8)' }}>{resident.name}</Typography>
                <Chip 
                  icon={<VerifiedIcon sx={{ fontSize: '16px !important', color: '#10b981 !important' }} />} 
                  label={resident.status} 
                  sx={{ bgcolor: 'white', color: '#10b981', fontWeight: 900, borderRadius: '8px', border: '1px solid #dcfce7' }} 
                />
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Stack direction="row" spacing={1} alignItems="center">
                  <CalendarIcon sx={{ fontSize: 18, color: '#64748b' }} />
                  <Typography variant="body1" color="#64748b" fontWeight="700">Enrollment: {resident.startDate}</Typography>
                </Stack>
                <Typography variant="body1" color="#1d4ed8" fontWeight="800">#{resident.id}</Typography>
              </Stack>
            </Box>
            <Stack direction="row" spacing={2} sx={{ pb: 1 }}>
              <Tooltip title="Block Card">
                <IconButton sx={{ bgcolor: 'white', color: '#ef4444', border: '1px solid #fee2e2' }}><WarningIcon /></IconButton>
              </Tooltip>
              <Button 
                variant="contained" 
                startIcon={<EditIcon />} 
                sx={{ 
                  borderRadius: '12px', textTransform: 'none', fontWeight: 800, 
                  height: 48, px: 4, bgcolor: '#002855'
                }}
              >
                Edit Profile
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>

      {/* Navigation Tabs */}
      <Box sx={{ px: { xs: 2, md: 6 }, mb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{ 
            borderBottom: '1px solid #e2e8f0',
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 800, color: '#64748b', minWidth: 160, fontSize: '1rem', py: 2 },
            '& .Mui-selected': { color: '#002855 !important' },
            '& .MuiTabs-indicator': { backgroundColor: '#002855', height: 4, borderRadius: '4px' }
          }}
        >
          <Tab label="Profile Overview" />
          <Tab label="Wallets & Membership" />
          <Tab label="Amenity Usage" />
          <Tab label="Family Directory" />
          <Tab label="KYC Documents" />
        </Tabs>
      </Box>

      {/* Content Area */}
      <Box sx={{ px: { xs: 2, md: 6 } }}>
        {activeTab === 0 && (
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: '28px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
                <Typography variant="h6" fontWeight="900" color="#002855" sx={{ mb: 4 }}>Administrative Details</Typography>
                <Grid container spacing={4}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="#94a3b8" fontWeight="800">FULL NAME</Typography>
                    <Typography variant="body1" fontWeight="700">{resident.name}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="#94a3b8" fontWeight="800">RESIDENCE CATEGORY</Typography>
                    <Typography variant="body1" fontWeight="700">{resident.category} • {resident.role}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="#94a3b8" fontWeight="800">AADHAAR CARD</Typography>
                    <Typography variant="body1" fontWeight="700">{resident.kyc.aadhaar}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="#94a3b8" fontWeight="800">PAN CARD</Typography>
                    <Typography variant="body1" fontWeight="700">{resident.kyc.pan}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="#94a3b8" fontWeight="800">MOBILE NUMBER</Typography>
                    <Typography variant="body1" fontWeight="700">{resident.phone}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="#94a3b8" fontWeight="800">APARTMENT</Typography>
                    <Typography variant="body1" fontWeight="700">{resident.apartment}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={3}>
                <Paper elevation={0} sx={{ p: 4, borderRadius: '28px', border: '1px solid #e2e8f0', bgcolor: 'white', textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight="900" color="#002855" sx={{ mb: 3 }}>Active Blue Card</Typography>
                  <Box sx={{ p: 4, bgcolor: '#eff6ff', borderRadius: '24px', border: '2px dashed #bfdbfe' }}>
                    <CardIcon sx={{ fontSize: 40, color: '#1d4ed8', mb: 1 }} />
                    <Typography variant="h4" fontWeight="900" color="#1d4ed8" sx={{ mb: 1 }}>{resident.cardNo}</Typography>
                    <Chip label="Master Fob" size="small" sx={{ bgcolor: '#1d4ed8', color: 'white', fontWeight: 900 }} />
                  </Box>
                  <Typography variant="caption" fontWeight="800" color="#94a3b8" sx={{ mt: 2, display: 'block' }}>RFID ACTIVATED • OFFLINE SYNCED</Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 3, borderRadius: '24px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" fontWeight="800" color="#002855">Card Condition</Typography>
                    <Chip label={resident.wallets.security.condition} size="small" sx={{ bgcolor: '#f0fdf4', color: '#10b981', fontWeight: 900 }} />
                  </Stack>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && <ResidentWallets wallets={resident.wallets} />}
        {activeTab === 2 && <ResidentAmenities bookings={mockBookings} />}

        {activeTab === 3 && (
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="900" color="#002855">Dependent Management</Typography>
              <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#002855', borderRadius: '12px', fontWeight: 800 }}>Enroll Member</Button>
            </Stack>
            <Grid container spacing={3}>
              {mockFamily.map((m) => (
                <Grid size={{ xs: 12, md: 6 }} key={m.id}>
                  <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                    <Stack direction="row" spacing={3} alignItems="center">
                      <Avatar sx={{ width: 60, height: 60, bgcolor: '#f1f5f9', color: '#002855', fontWeight: 900 }}>{m.name[0]}</Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" fontWeight="900">{m.name}</Typography>
                        <Typography variant="body2" color="#64748b" fontWeight="700">{m.role}</Typography>
                      </Box>
                      <Chip label="Blue Card" size="small" sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', fontWeight: 900 }} />
                    </Stack>
                    <Divider sx={{ my: 3 }} />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption" fontWeight="800" color="#94a3b8">CARD: {m.cardNo}</Typography>
                      <Typography variant="caption" fontWeight="800" color="#10b981">STATUS: {m.status}</Typography>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {activeTab === 4 && (
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="900" color="#002855">KYC Compliance Repository</Typography>
              <Button variant="outlined" startIcon={<UploadIcon />} sx={{ borderRadius: '12px', fontWeight: 800, borderColor: '#002855', color: '#002855' }}>Upload New</Button>
            </Stack>
            <Grid container spacing={4}>
              {['Aadhaar Card', 'PAN Card', 'Official Photo'].map((doc) => (
                <Grid size={{ xs: 12, md: 4 }} key={doc}>
                  <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <Box sx={{ p: 4, bgcolor: '#f8fafc', borderRadius: '20px', mb: 2 }}><FileIcon sx={{ fontSize: 40, color: '#cbd5e1' }} /></Box>
                    <Typography variant="body1" fontWeight="900">{doc}</Typography>
                    <Typography variant="caption" color="#10b981" fontWeight="800" sx={{ mb: 3, display: 'block' }}>VERIFIED BY ADMIN</Typography>
                    <Button fullWidth variant="outlined" sx={{ borderRadius: '10px', fontWeight: 800 }}>Audit Document</Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>

    </Box>
  );
}
