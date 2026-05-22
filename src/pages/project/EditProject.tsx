import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, TextField, Breadcrumbs, Link, 
  Paper, MenuItem, Divider, CircularProgress 
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Save as SaveIcon
} from '@mui/icons-material';

import BackButton from '@/components/BackButton';
import { getProjects, saveProject } from '@/utils/setupStore';
import { getProjectDetailsApi, updateProjectApi } from '@/apis/project';
import { toast } from 'react-hot-toast';

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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      setLoading(true);
      try {
        if (!id) throw new Error("No project ID");
        const res = await getProjectDetailsApi(id);
        const project = res?.data || res;
        if (project) {
          // Normalize status
          let normStatus: 'Active' | 'Inactive' = 'Active';
          if (project.status?.toUpperCase() === 'INACTIVE') {
            normStatus = 'Inactive';
          }
          setFormData({
            name: project.name || '',
            code: project.code || '',
            location: project.location || '',
            status: normStatus,
            description: project.description || ''
          });
        } else {
          throw new Error("Project details empty");
        }
      } catch (error) {
        console.warn("Failed to fetch project via API, falling back to local storage:", error);
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
          navigate('/project');
        }
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [id, navigate]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Project Name is required';
    if (!formData.code.trim()) newErrors.code = 'Project Code is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!id) return;
    
    setSaving(true);
    try {
      const payload: any = {
        name: formData.name.trim(),
        status: formData.status === 'Active' ? 'ACTIVE' : 'INACTIVE',
      };

      if (formData.description?.trim()) {
        payload.description = formData.description.trim();
      } else {
        payload.description = null;
      }

      if (formData.location?.trim()) {
        payload.location = formData.location.trim();
      } else {
        payload.location = null;
      }

      await updateProjectApi(id, payload);
      toast.success('Project updated successfully');
      navigate('/project');
    } catch (error: any) {
      console.error("API project update failed:", error);
      const errMsg = error?.message || 'Failed to update project';
      toast.error(errMsg);

      if (error?.status === 0) {
        try {
          saveProject({
            ...formData,
            id: id
          });
          toast.success('Project updated successfully (offline fallback)');
          navigate('/project');
        } catch (localError) {
          toast.error('Failed to save project locally');
        }
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
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
              disabled={saving}
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
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </form>
      </Paper>

    </Box>
  );
}
