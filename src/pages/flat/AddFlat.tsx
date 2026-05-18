import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, TextField, Breadcrumbs, Link, 
  Paper, MenuItem, Divider 
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Save as SaveIcon
} from '@mui/icons-material';

import BackButton from '@/components/BackButton';
import { getProjects, getTowers, saveFlat } from '@/utils/setupStore';
import type { Project, Tower } from '@/utils/setupStore';

export default function AddFlat() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryTowerId = searchParams.get('towerId') || '';

  const [projects, setProjects] = useState<Project[]>([]);
  const [towers, setTowers] = useState<Tower[]>([]);
  const [formData, setFormData] = useState({
    projectId: '',
    towerId: queryTowerId,
    number: '',
    floor: '',
    type: '2BHK' as '1BHK' | '2BHK' | '3BHK' | '4BHK' | 'Studio' | 'Penthouse',
    status: 'Vacant' as 'Vacant' | 'Occupied' | 'Maintenance'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadedProjects = getProjects();
    const loadedTowers = getTowers();
    setProjects(loadedProjects);
    setTowers(loadedTowers);

    if (queryTowerId) {
      const tower = loadedTowers.find(t => t.id === queryTowerId);
      if (tower) {
        setFormData(prev => ({ 
          ...prev, 
          towerId: queryTowerId,
          projectId: tower.projectId 
        }));
      }
    }
  }, [queryTowerId]);

  // Dynamically filter towers based on project selection
  const filteredTowers = formData.projectId 
    ? towers.filter(t => t.projectId === formData.projectId)
    : [];

  const handleProjectChange = (projId: string) => {
    setFormData(prev => ({
      ...prev,
      projectId: projId,
      towerId: '' // Reset tower selection
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.projectId) newErrors.projectId = 'Project is required';
    if (!formData.towerId) newErrors.towerId = 'Tower is required';
    if (!formData.number.trim()) newErrors.number = 'Flat Number is required';
    if (!formData.floor.trim()) newErrors.floor = 'Floor is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    saveFlat({
      projectId: formData.projectId,
      towerId: formData.towerId,
      number: formData.number,
      floor: formData.floor,
      type: formData.type,
      status: formData.status
    });

    if (queryTowerId) {
      navigate(`/tower/${queryTowerId}`);
    } else {
      navigate('/flat');
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#ffffff', minHeight: '100vh', borderRadius: '12px' }}>
      
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#002855', mb: 1 }}>
            Register Flat
          </Typography>
          <Breadcrumbs separator=">" aria-label="breadcrumb">
            <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
              Dashboard
            </Link>
            <Link underline="hover" color="inherit" onClick={() => navigate('/flat')} sx={{ cursor: 'pointer' }}>
              Flats
            </Link>
            <Typography color="text.primary" fontWeight="600">Register Flat</Typography>
          </Breadcrumbs>
        </Box>
        <BackButton 
          to={queryTowerId ? `/tower/${queryTowerId}` : '/flat'} 
          label={queryTowerId ? 'Back to Tower' : 'Back to Flats'} 
        />
      </Box>

      {/* Form Container */}
      <Paper elevation={0} sx={{ border: '1px solid #f0f0f0', borderRadius: '16px', p: { xs: 3, md: 5 } }}>
        <Typography variant="h6" fontWeight="bold" color="#002855" sx={{ mb: 3 }}>
          Flat Specifications
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 4 }}>
            
            {/* Project Selection */}
            <TextField 
              fullWidth 
              select 
              label="Select Project *" 
              value={formData.projectId}
              onChange={(e) => handleProjectChange(e.target.value as string)}
              error={!!errors.projectId}
              helperText={errors.projectId}
              disabled={!!queryTowerId}
              sx={{ '& fieldset': { borderRadius: '8px' } }}
            >
              {projects.map(p => (
                <MenuItem key={p.id} value={p.id}>{p.name} ({p.code})</MenuItem>
              ))}
            </TextField>

            {/* Tower Selection (Cascaded) */}
            <TextField 
              fullWidth 
              select 
              label="Select Tower *" 
              value={formData.towerId}
              onChange={(e) => setFormData({ ...formData, towerId: e.target.value })}
              error={!!errors.towerId}
              helperText={errors.towerId || (!formData.projectId ? 'Please select a Project first' : '')}
              disabled={!!queryTowerId || !formData.projectId}
              sx={{ '& fieldset': { borderRadius: '8px' } }}
            >
              {filteredTowers.map(t => (
                <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
              ))}
            </TextField>

            <TextField 
              fullWidth 
              label="Flat Number *" 
              placeholder="e.g. 101, 304-B" 
              variant="outlined" 
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              error={!!errors.number}
              helperText={errors.number}
              sx={{ '& fieldset': { borderRadius: '8px' } }}
            />

            <TextField 
              fullWidth 
              label="Floor *" 
              placeholder="e.g. 1st Floor, Penthouse" 
              variant="outlined" 
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
              error={!!errors.floor}
              helperText={errors.floor}
              sx={{ '& fieldset': { borderRadius: '8px' } }}
            />

            <TextField 
              fullWidth 
              select 
              label="Flat Type *" 
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              sx={{ '& fieldset': { borderRadius: '8px' } }}
            >
              <MenuItem value="1BHK">1BHK</MenuItem>
              <MenuItem value="2BHK">2BHK</MenuItem>
              <MenuItem value="3BHK">3BHK</MenuItem>
              <MenuItem value="4BHK">4BHK</MenuItem>
            </TextField>

            <TextField 
              fullWidth 
              select 
              label="Occupancy Status *" 
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              sx={{ '& fieldset': { borderRadius: '8px' } }}
            >
              <MenuItem value="Vacant">Vacant</MenuItem>
              <MenuItem value="Occupied">Occupied</MenuItem>
              <MenuItem value="Maintenance">Maintenance</MenuItem>
            </TextField>

          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => queryTowerId ? navigate(`/tower/${queryTowerId}`) : navigate('/flat')}
              sx={{ 
                borderRadius: '8px', 
                textTransform: 'none', 
                px: 4, 
                fontWeight: 600, 
                borderColor: '#e0e0e0', 
                color: 'text.primary',
                '&:hover': { borderColor: '#b0b0b0' }
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="contained" 
              startIcon={<SaveIcon />}
              sx={{ 
                borderRadius: '8px', 
                textTransform: 'none', 
                px: 4, 
                fontWeight: 600, 
                boxShadow: 'none',
                bgcolor: '#0047b3',
                '&:hover': { bgcolor: '#003380' }
              }}
            >
              Save Flat
            </Button>
          </Box>
        </form>
      </Paper>

    </Box>
  );
}
