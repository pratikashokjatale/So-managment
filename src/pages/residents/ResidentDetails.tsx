import { Box, Typography, Breadcrumbs, Link, Paper, Avatar, Divider, Button, IconButton } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StatusBadge from '../../components/StatusBadge';

export default function ResidentDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data for demonstration
  const resident = {
    id: id,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '9876543210',
    apartment: 'A-101',
    membership: 'Active',
    cardNo: 'CMR10101',
    status: 'Active',
    joinDate: 'Jan 15, 2024',
    avatar: 'https://i.pravatar.cc/150?u=1'
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#ffffff', minHeight: '100vh', borderRadius: 2 }}>
      
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <IconButton onClick={() => navigate('/residents')} sx={{ mr: 1, color: 'text.secondary' }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#000' }}>
              Resident Details
            </Typography>
          </Box>
          <Breadcrumbs separator=">" aria-label="breadcrumb" sx={{ ml: 6 }}>
            <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
              Dashboard
            </Link>
            <Link underline="hover" color="inherit" onClick={() => navigate('/residents')} sx={{ cursor: 'pointer' }}>
              Residents
            </Link>
            <Typography color="text.primary">{resident.name}</Typography>
          </Breadcrumbs>
        </Box>
        
        <Button 
          variant="contained" 
          startIcon={<EditOutlinedIcon />}
          onClick={() => navigate(`/residents/edit/${id}`)}
          sx={{ borderRadius: '8px', textTransform: 'none', px: 3, fontWeight: 600, boxShadow: 'none' }}
        >
          Edit Resident
        </Button>
      </Box>

      {/* Main Content */}
      <Paper elevation={0} sx={{ border: '1px solid #f0f0f0', borderRadius: 2, p: { xs: 3, md: 5 } }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 4, alignItems: { xs: 'center', sm: 'flex-start' }, mb: 4 }}>
          <Avatar src={resident.avatar} sx={{ width: 120, height: 120, boxShadow: 1 }} />
          <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, flexGrow: 1 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>{resident.name}</Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>{resident.email}</Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
              <StatusBadge status={resident.status} variantType="chip" />
              <StatusBadge status={resident.membership} variantType="text" />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Personal Information</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 4 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">Phone Number</Typography>
            <Typography variant="body1" fontWeight="500">{resident.phone}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">Apartment</Typography>
            <Typography variant="body1" fontWeight="500">{resident.apartment}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">Access Card No.</Typography>
            <Typography variant="body1" fontWeight="500">{resident.cardNo}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">Join Date</Typography>
            <Typography variant="body1" fontWeight="500">{resident.joinDate}</Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
