import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Breadcrumbs, Link, Paper, Grid, Stack, Chip, Switch, Divider, Avatar
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import BackButton from '@/components/BackButton';
import { getFacilityById, toggleFacilityStatus } from '@/utils/facilityStore';

// Dynamic category icons helper
import { 
  SportsTennis as TennisIcon, 
  FitnessCenter as GymIcon,
  Movie as CinemaIcon,
  Spa as SpaIcon,
  SelfImprovement as YogaIcon,
  Pool as PoolIcon,
  Park as ParkIcon,
  Circle as CircleIcon
} from '@mui/icons-material';

function getFacilityIcon(iconName: string) {
  switch (iconName) {
    case 'SportsTennis':
      return <TennisIcon />;
    case 'FitnessCenter':
      return <GymIcon />;
    case 'Movie':
      return <CinemaIcon />;
    case 'Spa':
      return <SpaIcon />;
    case 'SelfImprovement':
      return <YogaIcon />;
    case 'Pool':
      return <PoolIcon />;
    case 'Park':
      return <ParkIcon />;
    default:
      return <CircleIcon />;
  }
}

export default function FacilityDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [facility, setFacility] = useState<any>(null);

  useEffect(() => {
    if (id) {
      const found = getFacilityById(id);
      if (found) {
        setFacility(found);
      }
    }
  }, [id]);

  if (!facility) {
    return (
      <Box sx={{ p: 5 }}>
        <Typography variant="h5" color="error">Facility not found</Typography>
        <Button onClick={() => navigate('/facility')} sx={{ mt: 2 }}>Back to Facilities</Button>
      </Box>
    );
  }

  const handleStatusToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const active = e.target.checked;
    const updated = toggleFacilityStatus(facility.id, active);
    setFacility(updated);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Operational':
        return { bg: '#f0fdf4', text: '#10b981', dot: '#10b981' };
      case 'In Use':
        return { bg: '#eff6ff', text: '#1d4ed8', dot: '#1d4ed8' };
      case 'Maintenance':
        return { bg: '#fff7ed', text: '#ea580c', dot: '#ea580c' };
      default:
        return { bg: '#f1f5f9', text: '#64748b', dot: '#64748b' };
    }
  };

  const currentStatusColors = getStatusColor(facility.status);

  // Mock booking slots for high-fidelity representation
  const mockBookings = [
    { time: '09:00 AM - 10:00 AM', resident: 'John Doe', flat: 'Tower A • Flat 101' },
    { time: '11:00 AM - 12:00 PM', resident: 'Jane Smith', flat: 'Tower B • Flat 201' },
    { time: '04:00 PM - 05:00 PM', resident: 'Mike Johnson', flat: 'Tower B • Flat 202' }
  ];

  // Mock maintenance history
  const mockMaintenance = [
    { date: '12 May 2026', type: 'Routine Cleaning', status: 'Completed', cost: '₹500' },
    { date: '04 May 2026', type: 'Equipment Inspection', status: 'Completed', cost: '₹1,200' }
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Header Panel */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 1 }}>
            <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer', fontWeight: 700 }}>
              Dashboard
            </Link>
            <Link underline="hover" color="inherit" onClick={() => navigate('/facility')} sx={{ cursor: 'pointer', fontWeight: 700 }}>
              Facility Management
            </Link>
            <Typography color="text.primary" sx={{ fontWeight: 900 }}>{facility.name}</Typography>
          </Breadcrumbs>
          <Typography variant="h3" fontWeight="900" color="#002855">{facility.name}</Typography>
        </Box>
        <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<EditOutlinedIcon />}
              onClick={() => navigate(`/facility/edit/${facility.id}`)}
              sx={{ borderRadius: '16px', px: 3, py: 1.25, fontWeight: 900, borderColor: '#e2e8f0', color: '#002855' }}
            >
              Edit Facility
            </Button>
          <BackButton to="/facility" />
        </Stack>
      </Stack>

      <Grid container spacing={4}>
        
        {/* Left Side: General Info & Command */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={4}>
            
            {/* Identity Card */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
              <Stack direction="row" spacing={3} alignItems="flex-start" sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: facility.color, color: 'white', width: 64, height: 64, borderRadius: '18px' }}>
                  {getFacilityIcon(facility.iconName)}
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="900" color="#002855" sx={{ mb: 1 }}>
                    {facility.name}
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Chip label={facility.category} size="small" sx={{ fontWeight: 900, borderRadius: '8px', bgcolor: '#f1f5f9' }} />
                    <Chip 
                      label={facility.status} 
                      size="small" 
                      sx={{ 
                        fontWeight: 900, 
                        borderRadius: '8px',
                        bgcolor: currentStatusColors.bg,
                        color: currentStatusColors.text,
                      }} 
                    />
                  </Stack>
                </Box>
              </Stack>
              
              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" fontWeight="900" color="#002855" sx={{ mb: 1 }}>
                Facility Description
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7, fontWeight: 500 }}>
                {facility.description}
              </Typography>

              <Grid container spacing={3}>
                <Grid size={6}>
                  <Typography variant="caption" color="text.secondary" fontWeight="800" display="block" sx={{ mb: 0.5 }}>
                    PRICING MODEL
                  </Typography>
                  <Typography variant="h5" fontWeight="900" color="#1e293b">
                    {facility.price}
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="caption" color="text.secondary" fontWeight="800" display="block" sx={{ mb: 0.5 }}>
                    CURRENT AVAILABILITY
                  </Typography>
                  <Typography variant="h5" fontWeight="900" color="#1e293b">
                    {facility.slots}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Operations Command Status Toggle */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
              <Typography variant="h5" fontWeight="900" color="#002855" sx={{ mb: 1.5 }}>
                Operations Control
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontWeight: 600 }}>
                Toggle active status to close bookings during scheduled cleanings or sudden maintenance intervals.
              </Typography>
              
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  borderRadius: '20px', 
                  bgcolor: '#f8fafc',
                  border: '1px dashed #cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  {facility.status !== 'Inactive' ? (
                    <CheckCircleOutlineIcon sx={{ color: '#10b981', fontSize: 32 }} />
                  ) : (
                    <BlockOutlinedIcon sx={{ color: '#cbd5e1', fontSize: 32 }} />
                  )}
                  <Box>
                    <Typography variant="body1" fontWeight="800" color="#002855">
                      Active Status Switch
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight="700">
                      Currently: {facility.status !== 'Inactive' ? 'ONLINE (Operational)' : 'OFFLINE (Inactive)'}
                    </Typography>
                  </Box>
                </Stack>
                <Switch
                  checked={facility.status !== 'Inactive'}
                  onChange={handleStatusToggle}
                  color="success"
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </Paper>
            </Paper>

            {/* Supervision Details */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
              <Typography variant="h5" fontWeight="900" color="#002855" sx={{ mb: 3 }}>
                Supervisor Information
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', width: 44, height: 44 }}>
                      <SupervisorAccountOutlinedIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="800">FACILITY MANAGER</Typography>
                      <Typography variant="body1" fontWeight="800" color="#1e293b">{facility.managerName}</Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: '#f0fdf4', color: '#10b981', width: 44, height: 44 }}>
                      <PhoneInTalkOutlinedIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="800">DIRECT CONTACT</Typography>
                      <Typography variant="body1" fontWeight="800" color="#1e293b">{facility.managerContact}</Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>

          </Stack>
        </Grid>

        {/* Right Side: Active Slots & History */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={4}>
            
            {/* Active Bookings Log */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
              <Typography variant="h5" fontWeight="900" color="#002855" sx={{ mb: 3 }}>
                Today's Bookings
              </Typography>
              
              {facility.status === 'Inactive' ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" fontWeight="700">
                    No active slots. Facility is currently offline.
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={2.5}>
                  {mockBookings.map((slot, index) => (
                    <Box key={index}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="body2" fontWeight="800" color="#002855">{slot.resident}</Typography>
                          <Typography variant="caption" color="text.secondary" fontWeight="700">{slot.flat}</Typography>
                        </Box>
                        <Chip label={slot.time} size="small" sx={{ fontWeight: 800, borderRadius: '8px', bgcolor: '#eff6ff', color: '#1d4ed8' }} />
                      </Stack>
                      {index < mockBookings.length - 1 && <Divider sx={{ mt: 2.5 }} />}
                    </Box>
                  ))}
                </Stack>
              )}
            </Paper>

            {/* Maintenance Log */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
              <Typography variant="h5" fontWeight="900" color="#002855" sx={{ mb: 3 }}>
                Maintenance Log
              </Typography>
              <Stack spacing={2.5}>
                {mockMaintenance.map((log, index) => (
                  <Box key={index}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box>
                        <Typography variant="body2" fontWeight="800" color="#002855">{log.type}</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight="700">Audit Date: {log.date}</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Chip label={log.status} size="small" color="success" sx={{ fontWeight: 800, borderRadius: '8px', mb: 0.5 }} />
                        <Typography variant="body2" fontWeight="800" color="#64748b" display="block">{log.cost}</Typography>
                      </Box>
                    </Stack>
                    {index < mockMaintenance.length - 1 && <Divider sx={{ mt: 2.5 }} />}
                  </Box>
                ))}
              </Stack>
            </Paper>

          </Stack>
        </Grid>

      </Grid>

    </Box>
  );
}
