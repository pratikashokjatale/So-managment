import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Button, Paper, Breadcrumbs, Link, TextField, MenuItem, Avatar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';

export default function EditStaff() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock staff data
  const [staff, setStaff] = useState({
    name: 'Sumanth Kumar',
    department: 'Security',
    phone: '9876500001',
    email: 'sumanth.k@society.com',
    cardNo: 'CM21001',
    status: 'Active',
    joiningDate: '2023-01-12',
    address: '123, Marbella Club, Road No. 5, Jubilee Hills, Hyderabad',
    emergencyContact: '9876511111'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStaff({ ...staff, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log('Saving staff:', staff);
    navigate(`/staff/${id}`);
  };

  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      bgcolor: '#fcfdfe'
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#ffffff', minHeight: '100vh', borderRadius: 2 }}>
      
      {/* Header Section */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: '#002855' }}>
            Edit Staff Profile
          </Typography>
          <Breadcrumbs separator=">" aria-label="breadcrumb">
            <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
              Dashboard
            </Link>
            <Link underline="hover" color="inherit" onClick={() => navigate('/staff')} sx={{ cursor: 'pointer' }}>
              Staff
            </Link>
            <Typography color="text.primary">Edit</Typography>
          </Breadcrumbs>
        </Box>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(`/staff/${id}`)}
          sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
        >
          Cancel
        </Button>
      </Box>

      <Paper elevation={0} sx={{ p: 4, border: '1px solid #f0f0f0', borderRadius: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Avatar Edit Section */}
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Avatar 
                src="https://i.pravatar.cc/150?u=21" 
                sx={{ width: 120, height: 120, border: '4px solid #f0f0f0' }} 
              />
              <Button 
                variant="contained" 
                size="small" 
                sx={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  right: 0, 
                  borderRadius: '50%', 
                  minWidth: 40, 
                  height: 40, 
                  p: 0,
                  bgcolor: '#002855',
                  '&:hover': { bgcolor: '#001a35' }
                }}
              >
                <EditIcon fontSize="small" />
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Update Profile Picture</Typography>
          </Box>

          {/* Form Fields Grid */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
            <TextField
              label="Full Name"
              name="name"
              fullWidth
              value={staff.name}
              onChange={handleChange}
              sx={textFieldSx}
            />
            <TextField
              select
              label="Department"
              name="department"
              fullWidth
              value={staff.department}
              onChange={handleChange}
              sx={textFieldSx}
            >
              <MenuItem value="Security">Security</MenuItem>
              <MenuItem value="Housekeeping">Housekeeping</MenuItem>
              <MenuItem value="Maintenance">Maintenance</MenuItem>
              <MenuItem value="Front Office">Front Office</MenuItem>
            </TextField>
            <TextField
              label="Phone Number"
              name="phone"
              fullWidth
              value={staff.phone}
              onChange={handleChange}
              sx={textFieldSx}
            />
            <TextField
              label="Email Address"
              name="email"
              fullWidth
              value={staff.email}
              onChange={handleChange}
              sx={textFieldSx}
            />
            <TextField
              label="Card Number"
              name="cardNo"
              fullWidth
              value={staff.cardNo}
              onChange={handleChange}
              sx={textFieldSx}
            />
            <TextField
              type="date"
              label="Joining Date"
              name="joiningDate"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={staff.joiningDate}
              onChange={handleChange}
              sx={textFieldSx}
            />
            <Box sx={{ gridColumn: { md: 'span 2' } }}>
              <TextField
                label="Permanent Address"
                name="address"
                fullWidth
                multiline
                rows={3}
                value={staff.address}
                onChange={handleChange}
                sx={textFieldSx}
              />
            </Box>
            <TextField
              label="Emergency Contact"
              name="emergencyContact"
              fullWidth
              value={staff.emergencyContact}
              onChange={handleChange}
              sx={textFieldSx}
            />
            <TextField
              select
              label="Status"
              name="status"
              fullWidth
              value={staff.status}
              onChange={handleChange}
              sx={textFieldSx}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => navigate(`/staff/${id}`)}
              sx={{ borderRadius: '10px', textTransform: 'none', px: 4, fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              startIcon={<SaveIcon />}
              onClick={handleSave}
              sx={{ borderRadius: '10px', textTransform: 'none', px: 4, fontWeight: 600, bgcolor: '#0047b3', boxShadow: 'none' }}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
