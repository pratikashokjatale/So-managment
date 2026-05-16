import { 
  Box, Typography, Button, TextField, Breadcrumbs, Link, 
  Paper, Avatar, IconButton, Divider, MenuItem 
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function EditResident() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data to pre-populate form
  const resident = {
    id: id,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '9876543210',
    apartment: 'A-101',
    membership: 'Active',
    cardNo: 'CMR10101',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?u=1'
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#ffffff', minHeight: '100vh', borderRadius: 2 }}>
      
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <IconButton onClick={() => navigate('/residents')} sx={{ mr: 1, color: 'text.secondary' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#000' }}>
            Edit Resident
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

      {/* Form Container */}
      <Paper elevation={0} sx={{ border: '1px solid #f0f0f0', borderRadius: 2, p: { xs: 3, md: 5 } }}>
        
        {/* Profile Picture Upload */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 5 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar 
              src={resident.avatar}
              sx={{ width: 100, height: 100, bgcolor: '#f5f7fa', color: '#bdbdbd' }}
            />
            <IconButton 
              sx={{ 
                position: 'absolute', 
                bottom: 0, 
                right: -10, 
                bgcolor: 'primary.main', 
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
                boxShadow: 2
              }}
              size="small"
            >
              <PhotoCameraIcon fontSize="small" />
            </IconButton>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Allowed *.jpeg, *.jpg, *.png, *.gif
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Max size of 3.1 MB
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Form Fields */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <TextField fullWidth label="Full Name" defaultValue={resident.name} variant="outlined" />
          </Box>
          <Box>
            <TextField fullWidth label="Email Address" defaultValue={resident.email} variant="outlined" />
          </Box>
          <Box>
            <TextField fullWidth label="Phone Number" defaultValue={resident.phone} variant="outlined" />
          </Box>
          <Box>
            <TextField fullWidth label="Apartment Number" defaultValue={resident.apartment} variant="outlined" />
          </Box>
          <Box>
            <TextField fullWidth select label="Membership Status" defaultValue={resident.membership}>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Expired">Expired</MenuItem>
            </TextField>
          </Box>
          <Box>
            <TextField fullWidth label="Access Card Number" defaultValue={resident.cardNo} variant="outlined" />
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 5 }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/residents')}
            sx={{ borderRadius: '8px', textTransform: 'none', px: 4, fontWeight: 600, borderColor: '#e0e0e0', color: 'text.primary' }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/residents')}
            sx={{ borderRadius: '8px', textTransform: 'none', px: 4, fontWeight: 600, boxShadow: 'none' }}
          >
            Save Changes
          </Button>
        </Box>

      </Paper>
    </Box>
  );
}
