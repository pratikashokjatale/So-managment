import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, TextField, Breadcrumbs, Link, 
  Paper, Avatar, IconButton, Divider, MenuItem 
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import BackButton from '@/components/BackButton';
import { getProjects, getTowers, getFlats } from '@/utils/setupStore';
import type { Project, Tower, Flat } from '@/utils/setupStore';

export default function EditResident() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Reactive State
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '9876543210',
    apartment: 'A-101',
    membership: 'Active',
    cardNo: 'CMR10101',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?u=1'
  });

  // Cascading states
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
    
    // Simulate fetching database resident details to edit
    if (id === '2') {
      setFormData({
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '9876543211',
        apartment: 'A-101',
        membership: 'Active',
        cardNo: 'CMR10102',
        status: 'Active',
        avatar: 'https://i.pravatar.cc/150?u=2'
      });
    } else if (id === '3') {
      setFormData({
        name: 'Mike Johnson',
        email: 'mike.j@example.com',
        phone: '9876543212',
        apartment: 'A-103',
        membership: 'Active',
        cardNo: 'CMR10103',
        status: 'Active',
        avatar: 'https://i.pravatar.cc/150?u=3'
      });
    }
  }, [id]);

  const filteredTowers = projectId ? towers.filter(t => t.projectId === projectId) : [];
  const filteredFlats = towerId ? flats.filter(f => f.towerId === towerId) : [];

  const handleFlatChange = (selectedFlatId: string) => {
    setFlatId(selectedFlatId);
    const flat = flats.find(f => f.id === selectedFlatId);
    const tower = towers.find(t => t.id === towerId);
    const project = projects.find(p => p.id === projectId);
    if (flat && tower && project) {
      setFormData(prev => ({
        ...prev,
        apartment: `${project.name} • ${tower.name} • Flat ${flat.number}`
      }));
    }
  };

  const handleSave = () => {
    // In real app, save to db
    navigate('/residents');
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#ffffff', minHeight: '100vh', borderRadius: 2 }}>
      
      {/* Header Section */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#002855', mb: 1 }}>
            Edit Resident
          </Typography>
          <Breadcrumbs separator=">" aria-label="breadcrumb">
            <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
              Dashboard
            </Link>
            <Link underline="hover" color="inherit" onClick={() => navigate('/residents')} sx={{ cursor: 'pointer' }}>
              Residents
            </Link>
            <Typography color="text.primary" fontWeight="600">{formData.name}</Typography>
          </Breadcrumbs>
        </Box>
        <BackButton to="/residents" label="Back to Residents" />
      </Box>

      {/* Form Container */}
      <Paper elevation={0} sx={{ border: '1px solid #f0f0f0', borderRadius: 4, p: { xs: 3, md: 5 } }}>
        
        {/* Profile Picture Upload */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 5 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar 
              src={formData.avatar}
              sx={{ width: 100, height: 100, bgcolor: '#f5f7fa', color: '#bdbdbd' }}
            />
            <IconButton 
              sx={{ 
                position: 'absolute', 
                bottom: 0, 
                right: -10, 
                bgcolor: 'primary.main', 
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
                boxShadow: 2
              }}
              size="small"
            >
              <PhotoCameraIcon fontSize="small" />
            </IconButton>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Allowed *.jpeg, *.jpg, *.png, *.gif
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Max size of 3.1 MB
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Form Fields */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
          <TextField 
            fullWidth 
            label="Full Name" 
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            variant="outlined" 
            sx={{ '& fieldset': { borderRadius: '12px' } }}
          />
          <TextField 
            fullWidth 
            label="Email Address" 
            value={formData.email} 
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            variant="outlined" 
            sx={{ '& fieldset': { borderRadius: '12px' } }}
          />
          <TextField 
            fullWidth 
            label="Phone Number" 
            value={formData.phone} 
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            variant="outlined" 
            sx={{ '& fieldset': { borderRadius: '12px' } }}
          />
          <TextField 
            fullWidth 
            select 
            label="Membership Status" 
            value={formData.membership}
            onChange={(e) => setFormData({ ...formData, membership: e.target.value })}
            sx={{ '& fieldset': { borderRadius: '12px' } }}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Expired">Expired</MenuItem>
          </TextField>
          <TextField 
            fullWidth 
            label="Access Card Number" 
            value={formData.cardNo} 
            onChange={(e) => setFormData({ ...formData, cardNo: e.target.value })}
            variant="outlined" 
            sx={{ '& fieldset': { borderRadius: '12px' } }}
          />

          <Box sx={{ gridColumn: 'span 2' }}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight="bold" color="#002855" sx={{ mb: 2 }}>
              Resident Flat Allocation: {formData.apartment || 'Not selected'}
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 3 }}>
              <TextField 
                fullWidth select label="Project" 
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
                fullWidth select label="Tower" 
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
                fullWidth select label="Flat" 
                value={flatId}
                disabled={!towerId}
                onChange={(e) => handleFlatChange(e.target.value)}
                sx={{ '& fieldset': { borderRadius: '12px' } }}
              >
                {filteredFlats.map(f => (
                  <MenuItem key={f.id} value={f.id}>{f.number} (Floor {f.floor})</MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 5 }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/residents')}
            sx={{ borderRadius: '8px', textTransform: 'none', px: 4, fontWeight: 600, borderColor: '#e0e0e0', color: 'text.primary' }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSave}
            sx={{ borderRadius: '8px', textTransform: 'none', px: 4, fontWeight: 600, boxShadow: 'none', bgcolor: '#0047b3' }}
          >
            Save Changes
          </Button>
        </Box>

      </Paper>
    </Box>
  );
}
