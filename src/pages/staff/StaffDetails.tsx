import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Button, Paper, Avatar, Breadcrumbs, Link, Divider, Stack
} from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import ApartmentIcon from '@mui/icons-material/Apartment';

export default function StaffDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock staff data
  const staff = {
    id: id,
    name: 'Sumanth Kumar',
    avatar: 'https://i.pravatar.cc/150?u=21',
    department: 'Security',
    phone: '+91 98765 00001',
    email: 'sumanth.k@society.com',
    cardNo: 'CM21001',
    status: 'Active',
    joiningDate: '12 Jan 2023',
    address: '123, Marbella Club, Road No. 5, Jubilee Hills, Hyderabad',
    emergencyContact: '+91 98765 11111'
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#ffffff', minHeight: '100vh', borderRadius: 2 }}>
      
      {/* Header Section */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: '#002855' }}>
            Staff Details
          </Typography>
          <Breadcrumbs separator=">" aria-label="breadcrumb">
            <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
              Dashboard
            </Link>
            <Link underline="hover" color="inherit" onClick={() => navigate('/staff')} sx={{ cursor: 'pointer' }}>
              Staff
            </Link>
            <Typography color="text.primary">Details</Typography>
          </Breadcrumbs>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/staff')}
            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
          >
            Back to List
          </Button>
          <Button 
            variant="contained" 
            startIcon={<EditIcon />} 
            onClick={() => navigate(`/staff/edit/${id}`)}
            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, bgcolor: '#0047b3', boxShadow: 'none' }}
          >
            Edit Profile
          </Button>
        </Stack>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '4.5fr 7.5fr' }, gap: 4 }}>
        {/* ID Card Column */}
        <Box>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 0, 
              borderRadius: 6, 
              overflow: 'hidden', 
              border: '1px solid #f0f0f0',
              boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              position: 'relative'
            }}
          >
            {/* ID Card Header */}
            <Box sx={{ bgcolor: '#002855', p: 3, color: 'white', textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="800" sx={{ letterSpacing: 1 }}>SOCIETY ID CARD</Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>PREMIUM RESIDENCY</Typography>
            </Box>

            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Avatar 
                src={staff.avatar} 
                sx={{ 
                  width: 140, 
                  height: 140, 
                  mx: 'auto', 
                  mb: 3, 
                  border: '5px solid white',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                }} 
              />
              <Typography variant="h5" fontWeight="800" color="#002855" sx={{ mb: 0.5 }}>{staff.name}</Typography>
              <Typography variant="subtitle1" fontWeight="600" color="primary" sx={{ mb: 3 }}>{staff.department}</Typography>
              
              <Divider sx={{ mb: 3 }} />

              <Stack spacing={2} sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>
                  <Typography variant="body2" color="text.secondary">Card Number</Typography>
                  <Typography variant="body2" fontWeight="700" color="#002855">{staff.cardNo}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>
                  <Typography variant="body2" color="text.secondary">Joining Date</Typography>
                  <Typography variant="body2" fontWeight="700" color="#002855">{staff.joiningDate}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <Typography variant="body2" fontWeight="700" color="#4caf50">{staff.status}</Typography>
                </Box>
              </Stack>

              <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 4, display: 'inline-block', border: '1px solid #f0f0f0' }}>
                <QRCodeSVG value={`STAFF:${staff.cardNo}:${staff.name}`} size={120} level="H" />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>Scan to verify identity</Typography>
            </Box>
          </Paper>
        </Box>

        {/* Detailed Info Column */}
        <Box>
          <Paper elevation={0} sx={{ p: 4, border: '1px solid #f0f0f0', borderRadius: 6 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 4, color: '#002855' }}>General Information</Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 4 }}>
              <Box>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <BadgeIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle2" color="text.secondary">Full Name</Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="600">{staff.name}</Typography>
                </Stack>
              </Box>
              <Box>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <ApartmentIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle2" color="text.secondary">Department</Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="600">{staff.department}</Typography>
                </Stack>
              </Box>
              <Box>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <PhoneIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle2" color="text.secondary">Phone Number</Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="600">{staff.phone}</Typography>
                </Stack>
              </Box>
              <Box>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <EmailIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle2" color="text.secondary">Email Address</Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="600">{staff.email}</Typography>
                </Stack>
              </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" fontWeight="bold" sx={{ mb: 4, color: '#002855' }}>Additional Details</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Box>
                <Stack spacing={1}>
                  <Typography variant="subtitle2" color="text.secondary">Permanent Address</Typography>
                  <Typography variant="body1" fontWeight="500">{staff.address}</Typography>
                </Stack>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 4 }}>
                <Box>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" color="text.secondary">Emergency Contact</Typography>
                    <Typography variant="body1" fontWeight="600" color="error">{staff.emergencyContact}</Typography>
                  </Stack>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
