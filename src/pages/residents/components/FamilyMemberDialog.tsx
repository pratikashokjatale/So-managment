import { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, MenuItem, Button, IconButton, Stack, Typography 
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface FamilyMemberDialogProps {
  open: boolean;
  onClose: () => void;
  selectedMember: any;
  onSave: (formData: any) => Promise<void>;
  updatingMember: boolean;
}

export default function FamilyMemberDialog({
  open,
  onClose,
  selectedMember,
  onSave,
  updatingMember
}: FamilyMemberDialogProps) {
  const [form, setForm] = useState({
    name: '',
    relationship: 'SPOUSE',
    phone: '',
    email: '',
    idType: '',
    idNumber: '',
    status: 'ACTIVE',
    accessLevel: 'FULL',
    dateOfBirth: ''
  });

  useEffect(() => {
    if (open) {
      if (selectedMember) {
        setForm({
          name: selectedMember.name || '',
          relationship: selectedMember.relationship || 'SPOUSE',
          phone: selectedMember.phone || '',
          email: selectedMember.email || '',
          idType: selectedMember.idType || '',
          idNumber: selectedMember.idNumber || '',
          status: selectedMember.status || 'ACTIVE',
          accessLevel: selectedMember.accessLevel || 'FULL',
          dateOfBirth: selectedMember.dateOfBirth ? selectedMember.dateOfBirth.split('T')[0] : ''
        });
      } else {
        setForm({
          name: '',
          relationship: 'SPOUSE',
          phone: '',
          email: '',
          idType: '',
          idNumber: '',
          status: 'ACTIVE',
          accessLevel: 'FULL',
          dateOfBirth: ''
        });
      }
    }
  }, [open, selectedMember]);

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs"
      fullWidth
      sx={{ "& .MuiDialog-container": { pl: { md: "var(--sidebar-width, 280px)" } } }}
      PaperProps={{ sx: { borderRadius: '24px', p: 1 } }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" fontWeight="900" color="#091542">
          {selectedMember ? "Edit Family Member" : "Enroll Family Member"}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ border: 'none' }}>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField
            label="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            fullWidth
            variant="outlined"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
          <TextField
            select
            label="Relationship"
            value={form.relationship}
            onChange={(e) => setForm({ ...form, relationship: e.target.value })}
            fullWidth
            variant="outlined"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          >
            <MenuItem value="SPOUSE">Spouse</MenuItem>
            <MenuItem value="CHILD">Child</MenuItem>
            <MenuItem value="PARENT">Parent</MenuItem>
            <MenuItem value="SIBLING">Sibling</MenuItem>
            <MenuItem value="GRANDPARENT">Grandparent</MenuItem>
            <MenuItem value="IN_LAW">In Law</MenuItem>
            <MenuItem value="OTHER">Other</MenuItem>
          </TextField>
          <TextField
            label="Mobile Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            fullWidth
            variant="outlined"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
          <TextField
            label="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            fullWidth
            variant="outlined"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
          <TextField
            type="date"
            label="Date of Birth"
            value={form.dateOfBirth}
            onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
          <TextField
            select
            label="ID Proof Type"
            value={form.idType}
            onChange={(e) => setForm({ ...form, idType: e.target.value })}
            fullWidth
            variant="outlined"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="AADHAAR">Aadhaar Card</MenuItem>
            <MenuItem value="PAN">PAN Card</MenuItem>
            <MenuItem value="PASSPORT">Passport</MenuItem>
            <MenuItem value="DRIVING_LICENSE">Driving License</MenuItem>
          </TextField>
          <TextField
            label="ID Number"
            value={form.idNumber}
            onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
            fullWidth
            variant="outlined"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
          <TextField
            select
            label="Access Level"
            value={form.accessLevel}
            onChange={(e) => setForm({ ...form, accessLevel: e.target.value })}
            fullWidth
            variant="outlined"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          >
            <MenuItem value="FULL">Full Access</MenuItem>
            <MenuItem value="LIMITED">Limited Access</MenuItem>
            <MenuItem value="NONE">No Access</MenuItem>
          </TextField>
          <TextField
            select
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            fullWidth
            variant="outlined"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          >
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="INACTIVE">Inactive</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 800, color: 'text.secondary', borderColor: '#e2e8f0', px: 3 }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={updatingMember}
          sx={{ bgcolor: '#091542', borderRadius: '12px', textTransform: 'none', fontWeight: 800, px: 3 }}
        >
          {updatingMember ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
