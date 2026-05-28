import { Box, Typography, Button, Paper, Stack, Avatar, Chip, IconButton, Divider, Grid } from '@mui/material';
import { 
  Add as AddIcon, 
  EditOutlined as EditIcon, 
  DeleteOutline as DeleteIcon 
} from '@mui/icons-material';

interface ResidentDependentsTabProps {
  family: any[];
  onAddMember: () => void;
  onEditMember: (member: any) => void;
  onDeleteMember: (memberId: string) => void;
}

export default function ResidentDependentsTab({
  family,
  onAddMember,
  onEditMember,
  onDeleteMember
}: ResidentDependentsTabProps) {
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="900" color="#091542">Dependent Management</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={onAddMember}
          sx={{ 
            bgcolor: '#091542', 
            borderRadius: '12px', 
            fontWeight: 800, 
            textTransform: 'none',
            px: 3,
            py: 1.25,
            boxShadow: '0 4px 12px rgba(9, 21, 66, 0.15)',
            '&:hover': { bgcolor: '#122566' }
          }}
        >
          Enroll Member
        </Button>
      </Stack>
      <Grid container spacing={3}>
        {family.map((m) => (
          <Grid size={{ xs: 12, md: 6 }} key={m.id}>
            <Paper elevation={0} sx={{ 
              p: 4, 
              borderRadius: '28px', 
              border: '1px solid #e2e8f0', 
              bgcolor: 'white',
              boxShadow: '0 10px 30px rgba(0,0,0,0.01)',
              transition: 'all 0.2s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 15px 35px rgba(9, 21, 66, 0.04)', borderColor: '#cbd5e1' }
            }}>
              <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 3 }}>
                <Avatar sx={{ 
                  width: 56, 
                  height: 56, 
                  bgcolor: 'rgba(9, 21, 66, 0.05)', 
                  color: '#091542', 
                  fontWeight: 900,
                  fontSize: '1.25rem',
                  border: '2px solid rgba(9, 21, 66, 0.1)'
                }}>{m.name ? m.name[0] : '?'}</Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography variant="h6" fontWeight="900" color="#091542">{m.name}</Typography>
                    {m.gender && (
                      <Chip 
                        label={m.gender} 
                        size="small" 
                        variant="outlined" 
                        sx={{ borderRadius: '8px', height: 22, fontSize: '0.75rem', fontWeight: 700 }} 
                      />
                    )}
                  </Stack>
                  <Chip 
                    label={`Dependent • ${m.relationship}`} 
                    size="small" 
                    sx={{ 
                      mt: 0.5,
                      bgcolor: '#eff6ff', 
                      color: '#1d4ed8', 
                      fontWeight: 800, 
                      fontSize: '0.7rem', 
                      borderRadius: '8px' 
                    }} 
                  />
                </Box>
                <Stack direction="row" spacing={1}>
                  <IconButton 
                    color="primary" 
                    size="small" 
                    onClick={() => onEditMember(m)}
                    sx={{ 
                      bgcolor: '#f0f4f8', 
                      borderRadius: '10px',
                      '&:hover': { bgcolor: '#e2e8f0' } 
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    size="small" 
                    onClick={() => onDeleteMember(m.id)}
                    sx={{ 
                      bgcolor: '#fff5f5', 
                      borderRadius: '10px',
                      '&:hover': { bgcolor: '#ffe3e3' } 
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>
              
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="#94a3b8" fontWeight="800" sx={{ display: 'block', letterSpacing: '0.5px' }}>MOBILE NUMBER</Typography>
                  <Typography variant="body2" fontWeight="700" color="#1e293b">{m.phone || m.mobile || 'N/A'}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="#94a3b8" fontWeight="800" sx={{ display: 'block', letterSpacing: '0.5px' }}>EMAIL</Typography>
                  <Typography variant="body2" fontWeight="700" color="#1e293b" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.email || 'N/A'}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="#94a3b8" fontWeight="800" sx={{ display: 'block', letterSpacing: '0.5px' }}>ID PROOF TYPE</Typography>
                  <Typography variant="body2" fontWeight="700" color="#1e293b">{m.idType ? m.idType.replace('_', ' ') : 'N/A'}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="#94a3b8" fontWeight="800" sx={{ display: 'block', letterSpacing: '0.5px' }}>ID NUMBER</Typography>
                  <Typography variant="body2" fontWeight="700" color="#1e293b">{m.idNumber || 'N/A'}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="#94a3b8" fontWeight="800" sx={{ display: 'block', letterSpacing: '0.5px' }}>ACCESS CARD</Typography>
                  <Typography variant="body2" fontWeight="700" color="#1e293b">{m.vcard !== 'N/A' && m.vcard ? m.vcard : 'Not Assigned'}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="#94a3b8" fontWeight="800" sx={{ display: 'block', letterSpacing: '0.5px' }}>ACCESS LEVEL</Typography>
                  <Chip 
                    label={m.accessLevel || 'FULL'} 
                    size="small" 
                    sx={{ 
                      height: 20, 
                      fontSize: '0.7rem', 
                      fontWeight: 800,
                      bgcolor: (m.accessLevel || 'FULL') === 'FULL' ? '#f0fdf4' : '#fffbeb',
                      color: (m.accessLevel || 'FULL') === 'FULL' ? '#166534' : '#b45309'
                    }} 
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="#94a3b8" fontWeight="800" sx={{ display: 'block', letterSpacing: '0.5px' }}>DATE OF BIRTH</Typography>
                  <Typography variant="body2" fontWeight="700" color="#1e293b">{m.dateOfBirth ? m.dateOfBirth.split('T')[0] : 'N/A'}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="#94a3b8" fontWeight="800" sx={{ display: 'block', letterSpacing: '0.5px' }}>STATUS</Typography>
                  <Chip 
                    label={m.status || 'ACTIVE'} 
                    size="small" 
                    sx={{ 
                      height: 20, 
                      fontSize: '0.7rem', 
                      fontWeight: 800,
                      bgcolor: (m.status || 'ACTIVE') === 'ACTIVE' ? '#f0fdf4' : '#fef2f2',
                      color: (m.status || 'ACTIVE') === 'ACTIVE' ? '#166534' : '#991b1b'
                    }} 
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
        {family.length === 0 && (
          <Grid size={{ xs: 12 }}>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No family members enrolled.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
