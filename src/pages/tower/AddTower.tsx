import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, TextField, Breadcrumbs, Link, 
  Paper, MenuItem, Divider, InputAdornment 
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Save as SaveIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
  Apartment as ApartmentIcon,
  Layers as LayersIcon,
  Close as CloseIcon,
  Circle as CircleIcon
} from '@mui/icons-material';

import BackButton from '@/components/BackButton';
import { getProjects, saveTower } from '@/utils/setupStore';
import { getProjectsApi } from '@/apis/project';
import { createTowerApi } from '@/apis/tower';
import { toast } from 'react-hot-toast';

export default function AddTower() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryProjectId = searchParams.get('projectId') || '';

  const [projects, setProjects] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    projectId: queryProjectId,
    name: '',
    floorsCount: 1,
    status: 'Active' as 'Active' | 'Inactive',
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await getProjectsApi({ limit: 100 });
        const list = res?.data?.data || res?.data?.projects || res?.projects || res?.data || [];
        setProjects(list);
      } catch (error) {
        console.warn("Failed to fetch projects via API, falling back to local storage:", error);
        setProjects(getProjects());
      }
    };
    loadProjects();
    if (queryProjectId) {
      setFormData(prev => ({ ...prev, projectId: queryProjectId }));
    }
  }, [queryProjectId]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.projectId) newErrors.projectId = 'Project selection is required';
    if (!formData.name.trim()) newErrors.name = 'Tower Name is required';
    if (formData.floorsCount <= 0) newErrors.floorsCount = 'Floors Count must be greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      await createTowerApi(formData.projectId, {
        name: formData.name,
        description: formData.description,
        totalFloors: Number(formData.floorsCount)
      });
      toast.success('Tower created successfully');
      if (queryProjectId) {
        navigate(`/project/${queryProjectId}`);
      } else {
        navigate('/tower');
      }
    } catch (error: any) {
      console.warn("API tower creation failed, performing local storage fallback:", error);
      try {
        saveTower({
          projectId: formData.projectId,
          name: formData.name,
          floorsCount: Number(formData.floorsCount),
          status: formData.status,
          description: formData.description
        });
        toast.success('Tower created successfully (offline fallback)');
        if (queryProjectId) {
          navigate(`/project/${queryProjectId}`);
        } else {
          navigate('/tower');
        }
      } catch (localError) {
        toast.error(error?.message || 'Failed to create tower');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f9fafc', minHeight: '100vh' }}>
      
      {/* Header section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" color="#091542" sx={{ mb: 0.5 }}>
            Create New Tower
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add tower details and configurations
          </Typography>
        </Box>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            bgcolor: '#EAF0F7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ApartmentIcon sx={{ color: '#24528C' }} />
        </Box>
      </Box>

      <form onSubmit={handleSubmit}>
        {/* Tower Details */}
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: '12px', p: { xs: 3, md: 4 }, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 4 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '8px',
                bgcolor: '#EAF0F7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}
            >
              <DescriptionIcon sx={{ color: '#24528C' }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" color="#091542">
                Tower Details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter basic information about the tower
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
            
            <TextField 
              fullWidth 
              select 
              label="Select Project *" 
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              error={!!errors.projectId}
              helperText={errors.projectId}
              disabled={!!queryProjectId}
              sx={{ '& fieldset': { borderRadius: '8px' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ bgcolor: '#EAF0F7', p: 0.5, borderRadius: '4px', display: 'flex' }}>
                      <BusinessIcon sx={{ color: '#24528C', fontSize: 20 }} />
                    </Box>
                  </InputAdornment>
                ),
              }}
            >
              {projects.map(p => (
                <MenuItem key={p.id} value={p.id}>{p.name} ({p.code})</MenuItem>
              ))}
            </TextField>

            <TextField 
              fullWidth 
              label="Tower Name *" 
              placeholder="e.g. Tower A" 
              variant="outlined" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={!!errors.name}
              helperText={errors.name}
              sx={{ '& fieldset': { borderRadius: '8px' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ bgcolor: '#EAF0F7', p: 0.5, borderRadius: '4px', display: 'flex' }}>
                      <ApartmentIcon sx={{ color: '#24528C', fontSize: 20 }} />
                    </Box>
                  </InputAdornment>
                ),
              }}
            />

            <TextField 
              fullWidth 
              type="number"
              label="Total Floors *" 
              placeholder="e.g. 15" 
              variant="outlined" 
              value={formData.floorsCount}
              onChange={(e) => setFormData({ ...formData, floorsCount: Math.max(1, Number(e.target.value)) })}
              error={!!errors.floorsCount}
              helperText={errors.floorsCount}
              sx={{ '& fieldset': { borderRadius: '8px' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ bgcolor: '#EAF0F7', p: 0.5, borderRadius: '4px', display: 'flex' }}>
                      <LayersIcon sx={{ color: '#24528C', fontSize: 20 }} />
                    </Box>
                  </InputAdornment>
                ),
              }}
            />

            <TextField 
              fullWidth 
              select 
              label="Status" 
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
              sx={{ '& fieldset': { borderRadius: '8px' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CircleIcon sx={{ color: formData.status === 'Active' ? '#10b981' : '#ef4444', fontSize: 14, ml: 1 }} />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>

            <Box sx={{ gridColumn: 'span 2' }}>
              <TextField 
                fullWidth 
                multiline 
                rows={4} 
                label="Description" 
                placeholder="Enter tower description (optional)" 
                variant="outlined" 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                sx={{ '& fieldset': { borderRadius: '8px' } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                      <Box sx={{ bgcolor: '#EAF0F7', p: 0.5, borderRadius: '4px', display: 'flex' }}>
                        <DescriptionIcon sx={{ color: '#24528C', fontSize: 20 }} />
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
        </Paper>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
          <Button 
            variant="outlined" 
            onClick={() => queryProjectId ? navigate(`/project/${queryProjectId}`) : navigate('/tower')}
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
            startIcon={<SaveIcon />}
            disabled={loading}
            sx={{ 
              borderRadius: '8px', 
              textTransform: 'none', 
              px: 3, 
              py: 1,
              fontWeight: 600, 
              boxShadow: 'none',
              bgcolor: '#24528C',
              '&:hover': { bgcolor: '#1f3b73', boxShadow: 'none' }
            }}
          >
            {loading ? 'Saving...' : 'Save Tower'}
          </Button>
        </Box>
      </form>

    </Box>
  );
}