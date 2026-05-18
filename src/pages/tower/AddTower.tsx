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
import { getProjects, saveTower } from '@/utils/setupStore';
import type { Project } from '@/utils/setupStore';

export default function AddTower() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryProjectId = searchParams.get('projectId') || '';

  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState({
    projectId: queryProjectId,
    name: '',
    floorsCount: 1,
    status: 'Active' as 'Active' | 'Inactive',
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setProjects(getProjects());
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    saveTower({
      projectId: formData.projectId,
      name: formData.name,
      floorsCount: Number(formData.floorsCount),
      status: formData.status,
      description: formData.description
    });

    if (queryProjectId) {
      navigate(`/project/${queryProjectId}`);
    } else {
      navigate('/tower');
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#ffffff', minHeight: '100vh', borderRadius: '12px' }}>
      
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#002855', mb: 1 }}>
            Add New Tower
          </Typography>
          <Breadcrumbs separator=">" aria-label="breadcrumb">
            <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
              Dashboard
            </Link>
            <Link underline="hover" color="inherit" onClick={() => navigate('/tower')} sx={{ cursor: 'pointer' }}>
              Towers
            </Link>
            <Typography color="text.primary" fontWeight="600">Add Tower</Typography>
          </Breadcrumbs>
        </Box>
        <BackButton 
          to={queryProjectId ? `/project/${queryProjectId}` : '/tower'} 
          label={queryProjectId ? 'Back to Project' : 'Back to Towers'} 
        />
      </Box>

      {/* Form Container */}
      <Paper elevation={0} sx={{ border: '1px solid #f0f0f0', borderRadius: '16px', p: { xs: 3, md: 5 } }}>
        <Typography variant="h6" fontWeight="bold" color="#002855" sx={{ mb: 3 }}>
          Tower Details
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 4 }}>
            
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
            />

            <TextField 
              fullWidth 
              select 
              label="Status" 
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
              sx={{ '& fieldset': { borderRadius: '8px' } }}
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
                placeholder="Brief description about the tower wings, entries, structure, etc." 
                variant="outlined" 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                sx={{ '& fieldset': { borderRadius: '8px' } }}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => queryProjectId ? navigate(`/project/${queryProjectId}`) : navigate('/tower')}
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
              Save Tower
            </Button>
          </Box>
        </form>
      </Paper>

    </Box>
  );
}
