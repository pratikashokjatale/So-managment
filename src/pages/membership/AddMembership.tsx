import { 
  Box, Typography, Button, TextField, Breadcrumbs, Link, 
  Paper, Divider, MenuItem, IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

export default function AddMembership() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#ffffff', minHeight: '100vh', borderRadius: 2 }}>
      
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <IconButton onClick={() => navigate('/membership')} sx={{ mr: 1, color: 'text.secondary' }}>
            <ArrowBackIcon />
          </IconButton>
          
        </Box>
</Box>

      {/* Form Container */}
      <Paper elevation={0} sx={{ border: '1px solid #f0f0f0', borderRadius: 2, p: { xs: 3, md: 5 } }}>
        
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#091542' }}>
          Membership Details
        </Typography>

        <Divider sx={{ mb: 4 }} />

        {/* Form Fields */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <TextField fullWidth label="Member Name" placeholder="e.g. John Doe" variant="outlined" />
          </Box>
          <Box>
            <TextField fullWidth label="Apartment Number" placeholder="e.g. A-101" variant="outlined" />
          </Box>
          <Box>
            <TextField fullWidth select label="Plan Type" defaultValue="Monthly">
              <MenuItem value="Monthly">Monthly</MenuItem>
              <MenuItem value="Quarterly">Quarterly</MenuItem>
              <MenuItem value="Annual">Annual</MenuItem>
            </TextField>
          </Box>
          <Box>
            <TextField fullWidth select label="Status" defaultValue="Active">
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Expired">Expired</MenuItem>
            </TextField>
          </Box>
          <Box>
            <TextField 
              fullWidth 
              label="Start Date" 
              type="date" 
              InputLabelProps={{ shrink: true }} 
              variant="outlined" 
            />
          </Box>
          <Box>
            <TextField 
              fullWidth 
              label="End Date" 
              type="date" 
              InputLabelProps={{ shrink: true }} 
              variant="outlined" 
            />
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 5 }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/membership')}
            sx={{ borderRadius: '8px', textTransform: 'none', px: 4, fontWeight: 600, borderColor: '#e0e0e0', color: 'text.primary' }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<SaveIcon />}
            onClick={() => navigate('/membership')}
            sx={{ borderRadius: '8px', textTransform: 'none', px: 4, fontWeight: 600, boxShadow: 'none', bgcolor: '#0047b3', '&:hover': { bgcolor: '#003380' } }}
          >
            Create Membership
          </Button>
        </Box>

      </Paper>
    </Box>
  );
}
