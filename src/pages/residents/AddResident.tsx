import { useState } from 'react';
import { 
  Box, Typography, Button, TextField, Breadcrumbs, Link, 
  Paper, Avatar, IconButton, Divider, MenuItem, Stepper, 
  Step, StepLabel, Stack, Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  NavigateNext as NextIcon,
  NavigateBefore as BeforeIcon,
  CheckCircle as SuccessIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material';

const steps = ['Resident Information', 'Family Members', 'Review & Submit'];

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  mobile: string;
}

export default function AddResident() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  
  // Form State
  const [residentData, setResidentData] = useState({
    fullName: '',
    mobile: '',
    apartment: '',
    category: 'Owner', 
    userType: 'Master',
    aadhaar: '',
    pan: '',
    photo: null as string | null
  });

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [newMember, setNewMember] = useState({ name: '', relationship: '', mobile: '' });

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const addFamilyMember = () => {
    if (newMember.name && newMember.relationship) {
      setFamilyMembers([...familyMembers, { ...newMember, id: Math.random().toString() }]);
      setNewMember({ name: '', relationship: '', mobile: '' });
    }
  };

  const removeFamilyMember = (id: string) => {
    setFamilyMembers(familyMembers.filter(m => m.id !== id));
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar sx={{ width: 100, height: 100, bgcolor: '#f0f4f8' }} src={residentData.photo || ''} />
                <IconButton 
                  color="primary" 
                  component="label"
                  sx={{ position: 'absolute', bottom: 0, right: -10, bgcolor: 'white', border: '1px solid #e0e0e0' }}
                >
                  <input hidden accept="image/*" type="file" />
                  <PhotoCameraIcon fontSize="small" />
                </IconButton>
              </Box>
              <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                Upload Profile Photo *
              </Typography>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
              <TextField 
                fullWidth label="Full Name" 
                placeholder="John Doe" 
                variant="outlined" 
                value={residentData.fullName}
                onChange={(e) => setResidentData({...residentData, fullName: e.target.value})}
                sx={{ '& fieldset': { borderRadius: '12px' } }} 
              />
              <TextField 
                fullWidth label="Mobile Number" 
                placeholder="9876543210" 
                variant="outlined" 
                value={residentData.mobile}
                onChange={(e) => setResidentData({...residentData, mobile: e.target.value})}
                sx={{ '& fieldset': { borderRadius: '12px' } }} 
              />
              <TextField 
                fullWidth label="Apartment Number" 
                placeholder="A-101" 
                variant="outlined" 
                value={residentData.apartment}
                onChange={(e) => setResidentData({...residentData, apartment: e.target.value})}
                sx={{ '& fieldset': { borderRadius: '12px' } }} 
              />
              <TextField 
                fullWidth select label="User Category" 
                value={residentData.category}
                onChange={(e) => setResidentData({...residentData, category: e.target.value})}
                sx={{ '& fieldset': { borderRadius: '12px' } }}
              >
                <MenuItem value="Owner">Owner</MenuItem>
                <MenuItem value="Tenant">Tenant</MenuItem>
              </TextField>
              <Box>
                <TextField 
                  fullWidth label="Aadhaar Card Number" 
                  placeholder="XXXX XXXX XXXX" 
                  variant="outlined" 
                  value={residentData.aadhaar}
                  onChange={(e) => setResidentData({...residentData, aadhaar: e.target.value})}
                  sx={{ '& fieldset': { borderRadius: '12px' } }} 
                />
                <Button size="small" startIcon={<UploadIcon />} sx={{ mt: 1, textTransform: 'none' }}>Upload Aadhaar Copy</Button>
              </Box>
              <Box>
                <TextField 
                  fullWidth label="PAN Card Number" 
                  placeholder="ABCDE1234F" 
                  variant="outlined" 
                  value={residentData.pan}
                  onChange={(e) => setResidentData({...residentData, pan: e.target.value})}
                  sx={{ '& fieldset': { borderRadius: '12px' } }} 
                />
                <Button size="small" startIcon={<UploadIcon />} sx={{ mt: 1, textTransform: 'none' }}>Upload PAN Copy</Button>
              </Box>
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" fontWeight="800" color="#002855" sx={{ mb: 1 }}>Family Members</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Add details for family members living in the same apartment.</Typography>
            
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #f1f5f9', borderRadius: '16px', bgcolor: '#f8fafc', mb: 3 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr auto' }, gap: 2, alignItems: 'center' }}>
                <TextField 
                  fullWidth label="Name" 
                  size="small" 
                  value={newMember.name} 
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  sx={{ bgcolor: 'white', '& fieldset': { borderRadius: '8px' } }} 
                />
                <TextField 
                  fullWidth select label="Relationship" 
                  size="small"
                  value={newMember.relationship}
                  onChange={(e) => setNewMember({...newMember, relationship: e.target.value})}
                  sx={{ bgcolor: 'white', '& fieldset': { borderRadius: '8px' } }}
                >
                  <MenuItem value="Spouse">Spouse</MenuItem>
                  <MenuItem value="Child">Child</MenuItem>
                  <MenuItem value="Parent">Parent</MenuItem>
                  <MenuItem value="Sibling">Sibling</MenuItem>
                </TextField>
                <TextField 
                  fullWidth label="Mobile" 
                  size="small"
                  value={newMember.mobile}
                  onChange={(e) => setNewMember({...newMember, mobile: e.target.value})}
                  sx={{ bgcolor: 'white', '& fieldset': { borderRadius: '8px' } }} 
                />
                <Button variant="contained" startIcon={<AddIcon />} onClick={addFamilyMember} sx={{ borderRadius: '8px', textTransform: 'none', height: 40 }}>
                  Add
                </Button>
              </Box>
            </Paper>

            <Stack spacing={2}>
              {familyMembers.map((member) => (
                <Box key={member.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, border: '1px solid #f1f5f9', borderRadius: '12px' }}>
                  <Box>
                    <Typography variant="body2" fontWeight="700">{member.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{member.relationship} • {member.mobile}</Typography>
                  </Box>
                  <IconButton color="error" size="small" onClick={() => removeFamilyMember(member.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              {familyMembers.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4, border: '1px dashed #e2e8f0', borderRadius: '12px' }}>
                  No family members added yet.
                </Typography>
              )}
            </Stack>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <SuccessIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" fontWeight="900" color="#002855">Ready for Enrollment</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 400, mx: 'auto' }}>
              Please review all information before submitting. Once submitted, the resident will be marked as "Pending" until documents are verified.
            </Typography>
            
            <Paper elevation={0} sx={{ mt: 4, p: 3, border: '1px solid #f1f5f9', borderRadius: '16px', textAlign: 'left' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Master Resident</Typography>
                  <Typography variant="body1" fontWeight="700">{residentData.fullName || 'John Doe'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Apartment</Typography>
                  <Typography variant="body1" fontWeight="700">{residentData.apartment || 'A-101'}</Typography>
                </Box>
                <Box sx={{ gridColumn: 'span 2' }}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="caption" color="text.secondary">Family Members</Typography>
                  <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {familyMembers.map(m => (
                      <Chip key={m.id} label={`${m.name} (${m.relationship})`} size="small" variant="outlined" sx={{ borderRadius: '8px' }} />
                    ))}
                    {familyMembers.length === 0 && <Typography variant="body2">None</Typography>}
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#ffffff', minHeight: '100vh', borderRadius: 2 }}>
      
      <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" fontWeight="900" color="#002855" sx={{ mb: 1 }}>Resident Enrollment</Typography>
          <Breadcrumbs separator=">" aria-label="breadcrumb">
            <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>Dashboard</Link>
            <Link underline="hover" color="inherit" onClick={() => navigate('/residents')} sx={{ cursor: 'pointer' }}>Residents</Link>
            <Typography color="text.primary" fontWeight="600">Enrollment Form</Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Stepper activeStep={activeStep} sx={{ mb: 6 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel sx={{ '& .MuiStepLabel-label': { fontWeight: 700, fontSize: '0.85rem' } }}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Paper elevation={0} sx={{ border: '1px solid #f1f5f9', borderRadius: '24px', p: { xs: 3, md: 5 }, bgcolor: 'white' }}>
          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6 }}>
            <Button 
              disabled={activeStep === 0} 
              onClick={handleBack} 
              startIcon={<BeforeIcon />}
              sx={{ borderRadius: '12px', fontWeight: 800, textTransform: 'none', px: 3 }}
            >
              Back
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button 
                variant="contained" 
                onClick={() => navigate('/residents')}
                sx={{ borderRadius: '12px', fontWeight: 800, textTransform: 'none', px: 4, bgcolor: '#0047b3' }}
              >
                Complete Enrollment
              </Button>
            ) : (
              <Button 
                variant="contained" 
                onClick={handleNext} 
                endIcon={<NextIcon />}
                sx={{ borderRadius: '12px', fontWeight: 800, textTransform: 'none', px: 4, bgcolor: '#0047b3' }}
              >
                Continue
              </Button>
            )}
          </Box>
        </Paper>
      </Box>

    </Box>
  );
}
