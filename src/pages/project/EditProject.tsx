import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, TextField, Breadcrumbs, Link, 
  Paper, MenuItem, Divider 
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Save as SaveIcon
} from '@mui/icons-material';

import BackButton from '@/components/BackButton';
import { getProjects, saveProject } from '@/utils/setupStore';

export default function EditProject() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    location: '',
    status: 'Active' as 'Active' | 'Inactive',
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const projects = getProjects();
    const project = projects.find(p => p.id === id);
    if (project) {
      setFormData({
        name: project.name,
        code: project.code,
        location: project.location,
        status: project.status,
        description: project.description
      });
    } else {
      // Direct back if not found
      navigate('/project');
    }
    setLoading(false);
  }, [id, navigate]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Project Name is required';
    if (!formData.code.trim()) newErrors.code = 'Project Code is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    saveProject({
      ...formData,
      id: id
    });
    navigate('/project');
  };

  if (loading) {
    return <Typography sx={{ p: 4 }}>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#ffffff', minHeight: '100vh', borderRadius: '12px' }}>
      
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#002855', mb: 1 }}>
            Edit Project
          </Typography>
          <Breadcrumbs separator=">" aria-label="breadcrumb">
            <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
              Dashboard
            </Link>
            <Link underline="hover" color="inherit" onClick={() => navigate('/project')} sx={{ cursor: 'pointer' }}>
              Projects
            </Link>
            <Typography color="text.primary" fontWeight="600">Edit Project</Typography>
          </Breadcrumbs>
        </Box>
        <BackButton to="/project" label="Back to Projects" />
      </Box>

      {/* Form Container */}
      <Paper elevation={0} sx={{ border: '1px solid #f0f0f0', borderRadius: '16px', p: { xs: 3, md: 5 } }}>
        <Typography variant="h6" fontWeight="bold" color="#002855" sx={{ mb: 3 }}>
          Project Details: {formData.name}
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 4 }}>
            <TextField 
              fullWidth 
              label="Project Name *" 
              variant="outlined" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={!!errors.name}
              helperText={errors.name}
              sx={{ '& fieldset': { borderRadius: '8px' } }}
            />
            <TextField 
              fullWidth 
              label="Project Code *" 
              variant="outlined" 
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              error={!!errors.code}
              helperText={errors.code}
              sx={{ '& fieldset': { borderRadius: '8px' } }}
            />
            <TextField 
              fullWidth 
              label="Location *" 
              variant="outlined" 
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              error={!!errors.location}
              helperText={errors.location}
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
              onClick={() => navigate('/project')}
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
              Save Changes
            </Button>
          </Box>
        </form>
      </Paper>

    </Box>
  );
}
