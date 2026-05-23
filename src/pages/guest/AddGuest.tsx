import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, TextField, Breadcrumbs, Link, 
  Paper, MenuItem, Select, FormControl, InputLabel, FormHelperText, Stack, Grid, IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BackButton from '@/components/BackButton';
import { getFlats } from '@/utils/setupStore';
import { addGuest } from '@/utils/guestStore';

export default function AddGuest() {
  const navigate = useNavigate();

  // Form Fields State
  const [residentValue, setResidentValue] = useState('');
  const [name, setName] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [purpose, setPurpose] = useState('');
  const [address, setAddress] = useState('');
  
  // File Upload State
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);

  // Errors State
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dynamic host residents from Flats
  const [residentsList, setResidentsList] = useState<any[]>([]);

  useEffect(() => {
    // Set default dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 2); // 2 days pass by default

    const formatDateString = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    setFromDate(formatDateString(today));
    setDueDate(formatDateString(tomorrow));

    // Populate occupied host residents
    try {
      const flats = getFlats().filter(f => f.status === 'Occupied' && f.ownerName);
      if (flats.length > 0) {
        setResidentsList(flats.map(flat => ({
          name: flat.ownerName,
          apartment: `${flat.projectName} • ${flat.towerName} • Flat ${flat.number}`
        })));
      } else {
        setResidentsList([
          { name: 'John Doe', apartment: 'Marbella Club • Tower A • Flat 101' },
          { name: 'Jane Smith', apartment: 'Marbella Club • Tower B • Flat 201' },
          { name: 'Mike Johnson', apartment: 'Marbella Club • Tower B • Flat 202' }
        ]);
      }
    } catch (e) {
      setResidentsList([
        { name: 'John Doe', apartment: 'Marbella Club • Tower A • Flat 101' },
        { name: 'Jane Smith', apartment: 'Marbella Club • Tower B • Flat 201' },
        { name: 'Mike Johnson', apartment: 'Marbella Club • Tower B • Flat 202' }
      ]);
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      });
      setErrors(prev => ({ ...prev, file: '' }));
    }
  };

  const simulateUpload = () => {
    setUploadedFile({
      name: 'aadhaar_card_scanned.pdf',
      size: '1.4 MB'
    });
    setErrors(prev => ({ ...prev, file: '' }));
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!residentValue) newErrors.resident = 'Host resident is required';
    if (!name.trim()) newErrors.name = 'Guest name is required';
    if (!fromDate) newErrors.fromDate = 'From date is required';
    if (!dueDate) newErrors.dueDate = 'Due date is required';
    if (!purpose) newErrors.purpose = 'Visit purpose is required';
    if (!address.trim()) newErrors.address = 'Guest address is required';
    if (!uploadedFile) newErrors.file = 'Aadhaar card copy is required';

    if (fromDate && dueDate && new Date(fromDate) > new Date(dueDate)) {
      newErrors.dueDate = 'Due date cannot be earlier than from date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const [resName, aptName] = residentValue.split('|');
    addGuest({
      name,
      resident: resName || 'John Doe',
      apartment: aptName || 'Marbella Club • Tower A • Flat 101',
      fromDate,
      dueDate,
      purpose,
      address,
      aadhaarFile: uploadedFile?.name,
      aadhaarSize: uploadedFile?.size
    });

    navigate('/guest');
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#ffffff', minHeight: '100vh', borderRadius: 2 }}>
      
      {/* Header Section */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#002855', mb: 1 }}>
            Add Guest Pass
          </Typography>
          <Breadcrumbs separator=">" aria-label="breadcrumb">
            <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
              Dashboard
            </Link>
            <Link underline="hover" color="inherit" onClick={() => navigate('/guest')} sx={{ cursor: 'pointer' }}>
              Guests
            </Link>
            <Typography color="text.primary" fontWeight="600">Create Pass</Typography>
          </Breadcrumbs>
        </Box>
        <BackButton to="/guest" label="Back to Guests" />
      </Box>

      {/* Form Container */}
      <Paper elevation={0} sx={{ border: '1px solid #f0f0f0', borderRadius: 4, p: { xs: 3, md: 5 } }}>
        
        <Grid container spacing={4}>
          
          {/* Guest Core details Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
              
              <FormControl fullWidth error={!!errors.resident} sx={{ gridColumn: 'span 2' }}>
                <InputLabel id="resident-select-label" sx={{ fontWeight: 600 }}>Select Host Flat</InputLabel>
                <Select
                  labelId="resident-select-label"
                  value={residentValue}
                  label="Select Host Flat"
                  onChange={(e) => {
                    setResidentValue(e.target.value);
                    setErrors(prev => ({ ...prev, resident: '' }));
                  }}
                  sx={{ borderRadius: '12px', fontWeight: 600 }}
                >
                  {residentsList.map((res, i) => (
                    <MenuItem key={i} value={`${res.name}|${res.apartment}`} sx={{ fontWeight: 600 }}>
                      {res.name} ({res.apartment.split('•').slice(-1)[0]?.trim() || res.apartment})
                    </MenuItem>
                  ))}
                </Select>
                {errors.resident && <FormHelperText>{errors.resident}</FormHelperText>}
              </FormControl>

              <TextField
                fullWidth
                label="Guest Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors(prev => ({ ...prev, name: '' }));
                }}
                error={!!errors.name}
                helperText={errors.name}
                placeholder="e.g. Alice Walker"
                sx={{ gridColumn: 'span 2', '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />

              <TextField
                fullWidth
                label="From Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setErrors(prev => ({ ...prev, fromDate: '' }));
                }}
                error={!!errors.fromDate}
                helperText={errors.fromDate}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />

              <TextField
                fullWidth
                label="Due Date (Pass End)"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  setErrors(prev => ({ ...prev, dueDate: '' }));
                }}
                error={!!errors.dueDate}
                helperText={errors.dueDate}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />

              <FormControl fullWidth error={!!errors.purpose}>
                <InputLabel id="purpose-select-label" sx={{ fontWeight: 600 }}>Purpose of Visit</InputLabel>
                <Select
                  labelId="purpose-select-label"
                  value={purpose}
                  label="Purpose of Visit"
                  onChange={(e) => {
                    setPurpose(e.target.value);
                    setErrors(prev => ({ ...prev, purpose: '' }));
                  }}
                  sx={{ borderRadius: '12px', fontWeight: 600 }}
                >
                  <MenuItem value="Family Visit">Family Visit</MenuItem>
                  <MenuItem value="Friend Visit">Friend Visit</MenuItem>
                  <MenuItem value="Maintenance">Maintenance</MenuItem>
                  <MenuItem value="Delivery">Delivery</MenuItem>
                  <MenuItem value="Business Discussion">Business Discussion</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
                {errors.purpose && <FormHelperText>{errors.purpose}</FormHelperText>}
              </FormControl>

              <TextField
                fullWidth
                label="Guest Address"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setErrors(prev => ({ ...prev, address: '' }));
                }}
                error={!!errors.address}
                helperText={errors.address}
                placeholder="e.g. 123 Beach Rd, Goa"
                sx={{ gridColumn: 'span 2', '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />

            </Box>
          </Grid>

          {/* Aadhaar Upload side */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="body2" fontWeight="700" color="text.secondary" sx={{ mb: 1 }}>
              Government-Issued ID (Aadhaar Card) *
            </Typography>

            {!uploadedFile ? (
              <Box 
                onClick={simulateUpload}
                sx={{
                  border: errors.file ? '2px dashed #ef4444' : '2px dashed #cbd5e1',
                  borderRadius: '16px',
                  bgcolor: '#f8fafc',
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: '#0047b3',
                    bgcolor: '#f1f5f9'
                  }
                }}
              >
                <input 
                  type="file" 
                  accept=".png,.jpg,.jpeg,.pdf" 
                  style={{ display: 'none' }} 
                  id="aadhaar-upload-input"
                  onChange={handleFileUpload}
                />
                <CloudUploadOutlinedIcon sx={{ fontSize: 40, color: errors.file ? '#ef4444' : '#64748b', mb: 2 }} />
                <Typography variant="body2" fontWeight="800" color="#002855">
                  Click to upload Aadhaar card copy
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Supports PNG, JPG, PDF up to 5MB
                </Typography>
                {errors.file && (
                  <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1, fontWeight: 600 }}>
                    {errors.file}
                  </Typography>
                )}
              </Box>
            ) : (
              <Paper 
                elevation={0} 
                sx={{ 
                  border: '1px solid #cbd5e1', 
                  borderRadius: '16px', 
                  p: 3, 
                  bgcolor: '#f0fdf4',
                  borderColor: '#bbf7d0',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between' 
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <CheckCircleIcon sx={{ color: '#22c55e' }} />
                  <Box>
                    <Typography variant="body2" fontWeight="800" color="#002855">
                      {uploadedFile.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {uploadedFile.size} • Verified Compliance
                    </Typography>
                  </Box>
                </Stack>
                <IconButton size="small" onClick={handleRemoveFile} sx={{ color: '#ef4444' }}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Paper>
            )}

            <Box sx={{ mt: 3, p: 2, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
              <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Compliance Guidelines
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                All temporary visitors and long-term guest entrants must present a verified physical government identity document before passing automated RFID community gates.
              </Typography>
            </Box>
          </Grid>

        </Grid>

        {/* Submit Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 5, pt: 3, borderTop: '1px solid #f0f0f0' }}>
          <Button 
            onClick={() => navigate('/guest')}
            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, px: 3, color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, px: 4, bgcolor: '#0047b3', '&:hover': { bgcolor: '#003380' } }}
          >
            Create Guest Pass
          </Button>
        </Box>

      </Paper>

    </Box>
  );
}
