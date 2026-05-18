import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, TextField, Breadcrumbs, Link, 
  Paper, Avatar, IconButton, MenuItem, Stepper, 
  Step, StepLabel, Stack, Chip, Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BackButton from '@/components/BackButton';
import { getProjects, getTowers, getFlats } from '@/utils/setupStore';
import type { Project, Tower, Flat } from '@/utils/setupStore';
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
  gender?: string;
  aadhaar?: string;
  pan?: string;
  vcard?: string;
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
  const [newMember, setNewMember] = useState({ 
    name: '', 
    relationship: '', 
    mobile: '',
    gender: '',
    aadhaar: '',
    pan: '',
    vcard: ''
  });

  // Flat Selection Cascading States
  const [projectId, setProjectId] = useState('');
  const [towerId, setTowerId] = useState('');
  const [flatId, setFlatId] = useState('');

  const [projects, setProjects] = useState<Project[]>([]);
  const [towers, setTowers] = useState<Tower[]>([]);
  const [flats, setFlats] = useState<Flat[]>([]);

  useEffect(() => {
    setProjects(getProjects());
    setTowers(getTowers());
    setFlats(getFlats());
  }, []);

  const filteredTowers = projectId ? towers.filter(t => t.projectId === projectId) : [];
  const filteredFlats = towerId ? flats.filter(f => f.towerId === towerId) : [];

  const handleFlatChange = (selectedFlatId: string) => {
    setFlatId(selectedFlatId);
    const flat = flats.find(f => f.id === selectedFlatId);
    const tower = towers.find(t => t.id === towerId);
    const project = projects.find(p => p.id === projectId);
    if (flat && tower && project) {
      setResidentData(prev => ({
        ...prev,
        apartment: `${project.name} • ${tower.name} • Flat ${flat.number}`
      }));
    }
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const addFamilyMember = () => {
    if (newMember.name && newMember.relationship) {
      setFamilyMembers([...familyMembers, { ...newMember, id: Math.random().toString() }]);
      setNewMember({ 
        name: '', 
        relationship: '', 
        mobile: '',
        gender: '',
        aadhaar: '',
        pan: '',
        vcard: ''
      });
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
                fullWidth select label="Project *" 
                value={projectId}
                onChange={(e) => {
                  setProjectId(e.target.value);
                  setTowerId('');
                  setFlatId('');
                }}
                sx={{ '& fieldset': { borderRadius: '12px' } }}
              >
                {projects.map(p => (
                  <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                ))}
              </TextField>
              <TextField 
                fullWidth select label="Tower *" 
                value={towerId}
                disabled={!projectId}
                onChange={(e) => {
                  setTowerId(e.target.value);
                  setFlatId('');
                }}
                sx={{ '& fieldset': { borderRadius: '12px' } }}
              >
                {filteredTowers.map(t => (
                  <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
                ))}
              </TextField>
              <TextField 
                fullWidth select label="Flat *" 
                value={flatId}
                disabled={!towerId}
                onChange={(e) => handleFlatChange(e.target.value)}
                sx={{ '& fieldset': { borderRadius: '12px' } }}
              >
                {filteredFlats.map(f => (
                  <MenuItem key={f.id} value={f.id}>{f.number} (Floor {f.floor})</MenuItem>
                ))}
              </TextField>
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
                <Button 
                  variant="outlined"
                  component="label"
                  startIcon={<UploadIcon />} 
                  sx={{ 
                    mt: 1.5, 
                    width: '100%',
                    py: 1.5, 
                    borderRadius: '12px', 
                    textTransform: 'none', 
                    fontWeight: 600, 
                    borderColor: '#e2e8f0', 
                    color: 'text.secondary',
                    bgcolor: '#f8fafc',
                    '&:hover': {
                      borderColor: '#0047b3',
                      bgcolor: '#eff6ff',
                      color: '#0047b3'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  Upload Aadhaar Copy
                  <input type="file" hidden />
                </Button>
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
                <Button 
                  variant="outlined"
                  component="label"
                  startIcon={<UploadIcon />} 
                  sx={{ 
                    mt: 1.5, 
                    width: '100%',
                    py: 1.5, 
                    borderRadius: '12px', 
                    textTransform: 'none', 
                    fontWeight: 600, 
                    borderColor: '#e2e8f0', 
                    color: 'text.secondary',
                    bgcolor: '#f8fafc',
                    '&:hover': {
                      borderColor: '#0047b3',
                      bgcolor: '#eff6ff',
                      color: '#0047b3'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  Upload PAN Copy
                  <input type="file" hidden />
                </Button>
              </Box>
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" fontWeight="800" color="#002855" sx={{ mb: 1 }}>Family Members</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Add details for family members living in the same apartment.</Typography>
            
            <Paper elevation={0} sx={{ p: 4, border: '1px solid #f1f5f9', borderRadius: '20px', bgcolor: '#f8fafc', mb: 4 }}>
              <Typography variant="subtitle2" fontWeight="700" color="#002855" sx={{ mb: 2 }}>Add New Member Details</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 3 }}>
                <TextField 
                  fullWidth label="Name *" 
                  value={newMember.name} 
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  sx={{ bgcolor: 'white', '& fieldset': { borderRadius: '10px' } }} 
                />
                <TextField 
                  fullWidth select label="Relationship *" 
                  value={newMember.relationship}
                  onChange={(e) => setNewMember({...newMember, relationship: e.target.value})}
                  sx={{ bgcolor: 'white', '& fieldset': { borderRadius: '10px' } }}
                >
                  <MenuItem value="Spouse">Spouse</MenuItem>
                  <MenuItem value="Child">Child</MenuItem>
                  <MenuItem value="Parent">Parent</MenuItem>
                  <MenuItem value="Sibling">Sibling</MenuItem>
                </TextField>
                <TextField 
                  fullWidth label="Mobile" 
                  value={newMember.mobile}
                  onChange={(e) => setNewMember({...newMember, mobile: e.target.value})}
                  sx={{ bgcolor: 'white', '& fieldset': { borderRadius: '10px' } }} 
                />
                <TextField 
                  fullWidth select label="Gender (Optional)" 
                  value={newMember.gender}
                  onChange={(e) => setNewMember({...newMember, gender: e.target.value})}
                  sx={{ bgcolor: 'white', '& fieldset': { borderRadius: '10px' } }}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
                <TextField 
                  fullWidth label="Aadhaar Card (Optional)" 
                  placeholder="XXXX XXXX XXXX"
                  value={newMember.aadhaar}
                  onChange={(e) => setNewMember({...newMember, aadhaar: e.target.value})}
                  sx={{ bgcolor: 'white', '& fieldset': { borderRadius: '10px' } }} 
                />
                <TextField 
                  fullWidth label="PAN Card (Optional)" 
                  placeholder="ABCDE1234F"
                  value={newMember.pan}
                  onChange={(e) => setNewMember({...newMember, pan: e.target.value})}
                  sx={{ bgcolor: 'white', '& fieldset': { borderRadius: '10px' } }} 
                />
                <TextField 
                  fullWidth label="Access Card / VCard (Optional)" 
                  placeholder="CMR-V100"
                  value={newMember.vcard}
                  onChange={(e) => setNewMember({...newMember, vcard: e.target.value})}
                  sx={{ bgcolor: 'white', '& fieldset': { borderRadius: '10px' } }} 
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />} 
                  onClick={addFamilyMember} 
                  sx={{ 
                    borderRadius: '10px', 
                    textTransform: 'none', 
                    px: 4, 
                    py: 1, 
                    fontWeight: 700,
                    bgcolor: '#0047b3',
                    '&:hover': { bgcolor: '#003380' }
                  }}
                >
                  Add Family Member
                </Button>
              </Box>
            </Paper>

            <Stack spacing={2}>
              {familyMembers.map((member) => (
                <Box key={member.id} sx={{ p: 3, border: '1px solid #f1f5f9', borderRadius: '16px', bgcolor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="body1" fontWeight="800" color="#002855">{member.name}</Typography>
                      <Chip label={member.relationship} size="small" sx={{ bgcolor: '#eff6ff', color: '#0047b3', fontWeight: 700, borderRadius: '6px' }} />
                      {member.gender && <Chip label={member.gender} size="small" variant="outlined" sx={{ borderRadius: '6px', fontSize: '0.75rem' }} />}
                    </Stack>
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mt: 1 }}>
                      {member.mobile && (
                        <Typography variant="caption" color="text.secondary">
                          <strong>Mobile:</strong> {member.mobile}
                        </Typography>
                      )}
                      {member.aadhaar && (
                        <Typography variant="caption" color="text.secondary">
                          <strong>Aadhaar:</strong> {member.aadhaar}
                        </Typography>
                      )}
                      {member.pan && (
                        <Typography variant="caption" color="text.secondary">
                          <strong>PAN:</strong> {member.pan}
                        </Typography>
                      )}
                      {member.vcard && (
                        <Typography variant="caption" color="text.secondary">
                          <strong>VCard:</strong> {member.vcard}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <IconButton color="error" onClick={() => removeFamilyMember(member.id)} sx={{ border: '1px solid #fee2e2', bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fca5a5', color: 'white' } }}>
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
      case 2: {
        const selectedProjectName = projects.find(p => p.id === projectId)?.name || 'Not Selected';
        const selectedTowerName = towers.find(t => t.id === towerId)?.name || 'Not Selected';
        const selectedFlatNumber = flats.find(f => f.id === flatId)?.number || 'Not Selected';

        return (
          <Box sx={{ py: 2 }}>
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <SuccessIcon color="success" sx={{ fontSize: 64, mb: 1.5 }} />
              <Typography variant="h5" fontWeight="900" color="#002855">Review Enrollment Details</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 500, mx: 'auto' }}>
                Please review the compiled KYC and family member profiles below before completing enrollment.
              </Typography>
            </Box>

            {/* Section 1: Master Resident Details */}
            <Paper elevation={0} sx={{ p: 4, border: '1px solid #e2e8f0', borderRadius: '20px', mb: 4, bgcolor: 'white' }}>
              <Typography variant="subtitle1" fontWeight="800" color="#002855" sx={{ mb: 3 }}>
                1. Master Resident Information
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">FULL NAME</Typography>
                  <Typography variant="body2" fontWeight="800" color="#002855" sx={{ mt: 0.5 }}>
                    {residentData.fullName || 'Not Provided'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">MOBILE PHONE</Typography>
                  <Typography variant="body2" fontWeight="800" color="#002855" sx={{ mt: 0.5 }}>
                    {residentData.mobile || 'Not Provided'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">RESIDENT CATEGORY</Typography>
                  <Typography variant="body2" fontWeight="800" color="#002855" sx={{ mt: 0.5 }}>
                    {residentData.category}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">ASSIGNED APARTMENT</Typography>
                  <Typography variant="body2" fontWeight="800" color="#002855" sx={{ mt: 0.5 }}>
                    {projectId ? `${selectedProjectName} • ${selectedTowerName} • Flat ${selectedFlatNumber}` : 'Not Assigned'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">AADHAAR CARD</Typography>
                  <Typography variant="body2" fontWeight="800" color="#002855" sx={{ mt: 0.5 }}>
                    {residentData.aadhaar || 'Not Provided'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">PAN CARD</Typography>
                  <Typography variant="body2" fontWeight="800" color="#002855" sx={{ mt: 0.5 }}>
                    {residentData.pan || 'Not Provided'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Section 2: Uploaded Compliance Files */}
            <Paper elevation={0} sx={{ p: 4, border: '1px solid #e2e8f0', borderRadius: '20px', mb: 4, bgcolor: 'white' }}>
              <Typography variant="subtitle1" fontWeight="800" color="#002855" sx={{ mb: 3 }}>
                2. KYC Documents Checklist
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Chip 
                  label={residentData.aadhaar ? "✓ Aadhaar Number Provided" : "⚠ Aadhaar Number Pending"} 
                  color={residentData.aadhaar ? "success" : "warning"}
                  variant="outlined"
                  sx={{ fontWeight: 800, borderRadius: '8px', px: 1 }}
                />
                <Chip 
                  label={residentData.pan ? "✓ PAN Number Provided" : "⚠ PAN Number Pending"} 
                  color={residentData.pan ? "success" : "warning"}
                  variant="outlined"
                  sx={{ fontWeight: 800, borderRadius: '8px', px: 1 }}
                />
              </Box>
            </Paper>

            {/* Section 3: Family Directory Preview */}
            <Paper elevation={0} sx={{ p: 4, border: '1px solid #e2e8f0', borderRadius: '20px', bgcolor: 'white' }}>
              <Typography variant="subtitle1" fontWeight="800" color="#002855" sx={{ mb: 3 }}>
                3. Family Members Directory ({familyMembers.length})
              </Typography>
              <Stack spacing={2}>
                {familyMembers.map((member) => (
                  <Box 
                    key={member.id} 
                    sx={{ 
                      p: 2.5, 
                      border: '1px solid #f1f5f9', 
                      borderRadius: '16px', 
                      bgcolor: '#f8fafc' 
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                      <Typography variant="body1" fontWeight="800" color="#002855">{member.name}</Typography>
                      <Chip label={member.relationship} size="small" sx={{ bgcolor: '#eff6ff', color: '#0047b3', fontWeight: 700, borderRadius: '6px' }} />
                      {member.gender && <Chip label={member.gender} size="small" variant="outlined" sx={{ borderRadius: '6px', fontSize: '0.75rem' }} />}
                    </Stack>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 1.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        <strong>Mobile:</strong> {member.mobile || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        <strong>Aadhaar:</strong> {member.aadhaar || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        <strong>PAN Card:</strong> {member.pan || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        <strong>Access Card/VCard:</strong> {member.vcard || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                ))}
                {familyMembers.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    No family members enrolled.
                  </Typography>
                )}
              </Stack>
            </Paper>
          </Box>
        );
      }
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#ffffff', minHeight: '100vh', borderRadius: 2 }}>
      
      <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="900" color="#002855" sx={{ mb: 1 }}>Resident Enrollment</Typography>
          <Breadcrumbs separator=">" aria-label="breadcrumb">
            <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>Dashboard</Link>
            <Link underline="hover" color="inherit" onClick={() => navigate('/residents')} sx={{ cursor: 'pointer' }}>Residents</Link>
            <Typography color="text.primary" fontWeight="600">Enrollment Form</Typography>
          </Breadcrumbs>
        </Box>
        <BackButton to="/residents" label="Back to Residents" />
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

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 6 }}>
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
