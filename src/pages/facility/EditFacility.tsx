import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, TextField, Breadcrumbs, Link, 
  Paper, MenuItem, Select, FormControl, InputLabel, FormHelperText, Stack, Grid
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '@/components/BackButton';
import { getFacilityById, saveFacility } from '@/utils/facilityStore';

// Icons for selection previews
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

const CATEGORIES = ['Sports', 'Fitness', 'Leisure', 'Wellness', 'Other'];

export default function EditFacility() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Form Fields State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Sports');
  const [price, setPrice] = useState('');
  const [slots, setSlots] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerContact, setManagerContact] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('SportsTennis');
  const [status, setStatus] = useState<any>('Operational');

  // Form Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      const facility = getFacilityById(id);
      if (facility) {
        setName(facility.name);
        setCategory(facility.category);
        setPrice(facility.price);
        setSlots(facility.slots);
        setManagerName(facility.managerName);
        setManagerContact(facility.managerContact);
        setDescription(facility.description);
        setIconName(facility.iconName || 'SportsTennis');
        setStatus(facility.status);
      }
    }
  }, [id]);

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!name.trim()) tempErrors.name = 'Facility Name is required';
    if (!price.trim()) tempErrors.price = 'Pricing Model is required';
    if (!slots.trim()) tempErrors.slots = 'Slots Description is required';
    if (!managerName.trim()) tempErrors.managerName = 'Manager Name is required';
    if (!managerContact.trim()) tempErrors.managerContact = 'Contact Number is required';
    if (!description.trim()) tempErrors.description = 'Description is required';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (id) {
      saveFacility({
        id,
        name,
        category,
        price,
        slots,
        managerName,
        managerContact,
        description,
        iconName,
        status
      });
      navigate(`/facility/${id}`);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Header & Navigation */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 1 }}>
            <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer', fontWeight: 700 }}>
              Dashboard
            </Link>
            <Link underline="hover" color="inherit" onClick={() => navigate('/facility')} sx={{ cursor: 'pointer', fontWeight: 700 }}>
              Facility Management
            </Link>
            <Typography color="text.primary" sx={{ fontWeight: 900 }}>Edit Facility</Typography>
          </Breadcrumbs>
          <Typography variant="h3" fontWeight="900" color="#002855">Edit Facility</Typography>
        </Box>
        <BackButton to={`/facility/${id}`} />
      </Stack>

      {/* Main Card Form */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 3, md: 5 }, 
          borderRadius: '32px', 
          border: '1px solid #e2e8f0',
          maxWidth: '850px',
          mx: 'auto'
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            
            {/* Facility Name */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Facility Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                variant="outlined"
                placeholder="e.g. Grand Gym, Yoga Studio"
                InputProps={{ sx: { borderRadius: '16px' } }}
              />
            </Grid>

            {/* Category */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  value={category}
                  label="Category"
                  onChange={(e) => setCategory(e.target.value)}
                  sx={{ borderRadius: '16px' }}
                >
                  {CATEGORIES.map(cat => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
                <FormHelperText>Choose the corresponding activity unit category</FormHelperText>
              </FormControl>
            </Grid>

            {/* Facility Icon Selection */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="icon-select-label">Facility Icon</InputLabel>
                <Select
                  labelId="icon-select-label"
                  id="icon-select"
                  value={iconName}
                  label="Facility Icon"
                  onChange={(e) => setIconName(e.target.value)}
                  sx={{ borderRadius: '16px' }}
                >
                  <MenuItem value="SportsTennis">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <TennisIcon sx={{ color: '#1d4ed8' }} />
                      <Typography variant="body2" fontWeight="700">Sports / Tennis Icon</Typography>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="FitnessCenter">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <GymIcon sx={{ color: '#ea580c' }} />
                      <Typography variant="body2" fontWeight="700">Gym / Fitness Icon</Typography>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="Movie">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <CinemaIcon sx={{ color: '#7c3aed' }} />
                      <Typography variant="body2" fontWeight="700">Cinema / Theatre Icon</Typography>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="Spa">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <SpaIcon sx={{ color: '#db2777' }} />
                      <Typography variant="body2" fontWeight="700">Spa / Steam & Sauna Icon</Typography>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="SelfImprovement">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <YogaIcon sx={{ color: '#10b981' }} />
                      <Typography variant="body2" fontWeight="700">Yoga / Meditation Icon</Typography>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="Pool">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <PoolIcon sx={{ color: '#06b6d4' }} />
                      <Typography variant="body2" fontWeight="700">Swimming Pool Icon</Typography>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="Park">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <ParkIcon sx={{ color: '#16a34a' }} />
                      <Typography variant="body2" fontWeight="700">Park / Jogging Track Icon</Typography>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="Circle">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <CircleIcon sx={{ color: '#4b5563' }} />
                      <Typography variant="body2" fontWeight="700">Billiards / Other Icon</Typography>
                    </Stack>
                  </MenuItem>
                </Select>
                <FormHelperText>Select a customized icon symbol to represent this unit</FormHelperText>
              </FormControl>
            </Grid>

            {/* Pricing Model */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Pricing Model"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                error={!!errors.price}
                helperText={errors.price || "e.g. ₹200/hr, Included, ₹500/show"}
                variant="outlined"
                placeholder="e.g. ₹250/hr"
                InputProps={{ sx: { borderRadius: '16px' } }}
              />
            </Grid>

            {/* Capacity / Slots */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Capacity / Slots"
                value={slots}
                onChange={(e) => setSlots(e.target.value)}
                error={!!errors.slots}
                helperText={errors.slots || "e.g. 5/12 Booked, 15/30 Capacity"}
                variant="outlined"
                placeholder="e.g. 10/20 Slots Open"
                InputProps={{ sx: { borderRadius: '16px' } }}
              />
            </Grid>

            {/* Manager Name */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Manager Name"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                error={!!errors.managerName}
                helperText={errors.managerName}
                variant="outlined"
                placeholder="Name of supervisor"
                InputProps={{ sx: { borderRadius: '16px' } }}
              />
            </Grid>

            {/* Manager Contact */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Contact Number"
                value={managerContact}
                onChange={(e) => setManagerContact(e.target.value)}
                error={!!errors.managerContact}
                helperText={errors.managerContact}
                variant="outlined"
                placeholder="e.g. +91 98765 43210"
                InputProps={{ sx: { borderRadius: '16px' } }}
              />
            </Grid>

            {/* Description */}
            <Grid size={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={!!errors.description}
                helperText={errors.description}
                variant="outlined"
                placeholder="Provide details about the facility's location, rules, and specifications..."
                InputProps={{ sx: { borderRadius: '16px' } }}
              />
            </Grid>

            {/* Action Buttons */}
            <Grid size={12} sx={{ mt: 2 }}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button 
                  variant="outlined" 
                  onClick={() => navigate(`/facility/${id}`)}
                  sx={{ borderRadius: '16px', px: 4, py: 1.5, fontWeight: 900, borderColor: '#e2e8f0', color: '#64748b' }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  variant="contained"
                  sx={{ borderRadius: '16px', px: 4, py: 1.5, fontWeight: 900, bgcolor: '#002855' }}
                >
                  Save Changes
                </Button>
              </Stack>
            </Grid>

          </Grid>
        </form>
      </Paper>

    </Box>
  );
}
