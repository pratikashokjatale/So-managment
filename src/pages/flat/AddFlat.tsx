import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, TextField, Breadcrumbs, Link, 
  Paper, MenuItem, Divider, InputAdornment
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Save as SaveIcon,
  MeetingRoom as MeetingRoomIcon,
  Description as DescriptionIcon,
  Apartment as ApartmentIcon,
  Business as BusinessIcon,
  Layers as LayersIcon,
  Home as HomeIcon,
  People as PeopleIcon,
  Close as CloseIcon,
  Circle as CircleIcon
} from '@mui/icons-material';

import BackButton from '@/components/BackButton';
import { getProjects, getTowers, saveFlat } from '@/utils/setupStore';
import { getProjectsApi } from '@/apis/project';
import { getTowersApi } from '@/apis/tower';
import { createFlatApi } from '@/apis/flat';
import { clearApiCache } from '@/utils/apiCache';
import { toast } from 'react-hot-toast';

export default function AddFlat() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryTowerId = searchParams.get('towerId') || '';

  const [projects, setProjects] = useState<any[]>([]);
  const [towers, setTowers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    projectId: '',
    towerId: queryTowerId,
    number: '',
    floor: '',
    type: '2BHK' as '1BHK' | '2BHK' | '3BHK' | '4BHK' | 'Studio' | 'Penthouse',
    occupancyType: 'OWNER' as 'OWNER' | 'TENANT' | 'VACANT',
    status: 'Vacant' as 'Vacant' | 'Occupied' | 'Maintenance'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadProjectsAndTowers = async () => {
      try {
        const projRes = await getProjectsApi({ limit: 100 });
        const projectList = projRes?.data?.data || projRes?.data?.projects || projRes?.projects || projRes?.data || [];
        setProjects(projectList);

        const promises = projectList.map((p: any) => 
          getTowersApi(p.id, { page: 1, limit: 100 })
            .then(res => Array.isArray(res?.data?.data) ? res.data.data : (res?.data?.towers || res?.towers || res?.data || []))
            .catch(() => [])
        );
        const results = await Promise.all(promises);
        const towerList = results.flat();
        setTowers(towerList);

        if (queryTowerId) {
          const tower = towerList.find(t => t.id === queryTowerId);
          if (tower) {
            setFormData(prev => ({ 
              ...prev, 
              towerId: queryTowerId,
              projectId: tower.projectId 
            }));
          }
        }
      } catch (error) {
        console.warn("Failed to load projects and towers via API, falling back to local storage:", error);
        const localProjects = getProjects();
        const localTowers = getTowers();
        setProjects(localProjects);
        setTowers(localTowers);

        if (queryTowerId) {
          const tower = localTowers.find(t => t.id === queryTowerId);
          if (tower) {
            setFormData(prev => ({ 
              ...prev, 
              towerId: queryTowerId,
              projectId: tower.projectId 
            }));
          }
        }
      }
    };
    loadProjectsAndTowers();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setSubmitting(true);
    try {
      const payload = {
        flatNumber: formData.number.trim(),
        floorNumber: formData.floor.trim(),
        flatType: formData.type,
        occupancyType: formData.occupancyType,
        status: formData.status === 'Vacant' ? 'VACANT' : formData.status === 'Occupied' ? 'OCCUPIED' : 'MAINTENANCE'
      };

      await createFlatApi(formData.towerId, payload);
      clearApiCache();
      toast.success('Flat created successfully');
      
      if (queryTowerId) {
        navigate(`/tower/${queryTowerId}`);
      } else {
        navigate('/flat');
      }
    } catch (error: any) {
      console.error('API flat creation failed:', error);
      const errMsg = error?.message || 'Failed to create flat';
      toast.error(errMsg);

      if (error?.status === 0) {
        try {
          saveFlat({
            projectId: formData.projectId,
            towerId: formData.towerId,
            number: formData.number,
            floor: formData.floor,
            type: formData.type,
            status: formData.status
          });
          toast.success('Flat saved locally (offline fallback)');
          
          if (queryTowerId) {
            navigate(`/tower/${queryTowerId}`);
          } else {
            navigate('/flat');
          }
        } catch (localError) {
          toast.error('Failed to save flat locally');
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f9fafc', minHeight: '100vh' }}>
      
      {/* Header section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" color="#091542" sx={{ mb: 0.5 }}>
            Create New Flat
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add flat specifications and ownership details
          </Typography>
        </Box>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            bgcolor: '#e8effc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <MeetingRoomIcon sx={{ color: '#2c4d93' }} />
        </Box>
      </Box>

      <form onSubmit={handleSubmit}>
        {/* Flat Specifications */}
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: '12px', p: { xs: 3, md: 4 }, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 4 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '8px',
                bgcolor: '#e8effc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}
            >
              <DescriptionIcon sx={{ color: '#2c4d93' }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" color="#091542">
                Flat Specifications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter basic information about the flat
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
            
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ bgcolor: '#e8effc', p: 0.5, borderRadius: '4px', display: 'flex' }}>
                      <BusinessIcon sx={{ color: '#2c4d93', fontSize: 20 }} />
                    </Box>
                  </InputAdornment>
                ),
              }}
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ bgcolor: '#e8effc', p: 0.5, borderRadius: '4px', display: 'flex' }}>
                      <ApartmentIcon sx={{ color: '#2c4d93', fontSize: 20 }} />
                    </Box>
                  </InputAdornment>
                ),
              }}
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ bgcolor: '#e8effc', p: 0.5, borderRadius: '4px', display: 'flex' }}>
                      <MeetingRoomIcon sx={{ color: '#2c4d93', fontSize: 20 }} />
                    </Box>
                  </InputAdornment>
                ),
              }}
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ bgcolor: '#e8effc', p: 0.5, borderRadius: '4px', display: 'flex' }}>
                      <LayersIcon sx={{ color: '#2c4d93', fontSize: 20 }} />
                    </Box>
                  </InputAdornment>
                ),
              }}
            />

            <TextField 
              fullWidth 
              select 
              label="Flat Type *" 
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              sx={{ '& fieldset': { borderRadius: '8px' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ bgcolor: '#e8effc', p: 0.5, borderRadius: '4px', display: 'flex' }}>
                      <HomeIcon sx={{ color: '#2c4d93', fontSize: 20 }} />
                    </Box>
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="1BHK">1BHK</MenuItem>
              <MenuItem value="2BHK">2BHK</MenuItem>
              <MenuItem value="3BHK">3BHK</MenuItem>
              <MenuItem value="4BHK">4BHK</MenuItem>
              <MenuItem value="Studio">Studio</MenuItem>
              <MenuItem value="Penthouse">Penthouse</MenuItem>
            </TextField>

            <TextField 
              fullWidth 
              select 
              label="Occupancy Status *" 
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              sx={{ '& fieldset': { borderRadius: '8px' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CircleIcon sx={{ color: formData.status === 'Occupied' ? '#10b981' : formData.status === 'Vacant' ? '#ef4444' : '#f59e0b', fontSize: 14, ml: 1 }} />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="Vacant">Vacant</MenuItem>
              <MenuItem value="Occupied">Occupied</MenuItem>
              <MenuItem value="Maintenance">Maintenance</MenuItem>
            </TextField>

            <TextField 
              fullWidth 
              select 
              label="Occupancy Type *" 
              value={formData.occupancyType}
              onChange={(e) => setFormData({ ...formData, occupancyType: e.target.value as any })}
              sx={{ '& fieldset': { borderRadius: '8px' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ bgcolor: '#e8effc', p: 0.5, borderRadius: '4px', display: 'flex' }}>
                      <PeopleIcon sx={{ color: '#2c4d93', fontSize: 20 }} />
                    </Box>
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="OWNER">Owner</MenuItem>
              <MenuItem value="TENANT">Tenant</MenuItem>
              <MenuItem value="VACANT">Vacant</MenuItem>
            </TextField>

          </Box>
        </Paper>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
          <Button 
            variant="outlined" 
            onClick={() => queryTowerId ? navigate(`/tower/${queryTowerId}`) : navigate('/flat')}
            startIcon={<CloseIcon />}
            sx={{ 
              borderRadius: '8px', 
              textTransform: 'none', 
              px: 3, 
              py: 1,
              fontWeight: 600, 
              borderColor: '#e0e0e0', 
              color: '#4b5563',
              '&:hover': { borderColor: '#b0b0b0', bgcolor: '#f9fafc' }
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            variant="contained" 
            disabled={submitting}
            startIcon={<SaveIcon />}
            sx={{ 
              borderRadius: '8px', 
              textTransform: 'none', 
              px: 3, 
              py: 1,
              fontWeight: 600, 
              boxShadow: 'none',
              bgcolor: '#2c4d93',
              '&:hover': { bgcolor: '#1f3b73', boxShadow: 'none' }
            }}
          >
            {submitting ? 'Saving...' : 'Save Flat'}
          </Button>
        </Box>
      </form>

    </Box>
  );
}