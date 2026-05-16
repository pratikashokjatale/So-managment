import { 
  Box, Typography, Paper, Grid, Stack, Chip, Button, IconButton, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar
} from '@mui/material';
import { 
  SportsTennis as TennisIcon, 
  FitnessCenter as GymIcon,
  Movie as CinemaIcon,
  Spa as SpaIcon,
  SelfImprovement as YogaIcon,
  EditOutlined as EditIcon,
  Add as AddIcon,
  Circle as CircleIcon
} from '@mui/icons-material';

const mockFacilities = [
  { id: 1, name: 'Squash Court', category: 'Sports', status: 'Operational', price: '₹200/hr', slots: '5/12 Booked', icon: <TennisIcon />, color: '#1d4ed8' },
  { id: 2, name: 'Table Tennis', category: 'Sports', status: 'Operational', price: '₹100/hr', slots: '8/12 Booked', icon: <TennisIcon />, color: '#10b981' },
  { id: 3, name: 'Home Theatre', category: 'Leisure', status: 'In Use', price: '₹500/show', slots: 'Live Slot Taken', icon: <CinemaIcon />, color: '#7c3aed' },
  { id: 4, name: 'Grand Gym', category: 'Fitness', status: 'Operational', price: 'Included', slots: '15/30 Capacity', icon: <GymIcon />, color: '#ea580c' },
  { id: 5, name: 'Steam & Sauna', category: 'Wellness', status: 'Maintenance', price: '₹300/session', slots: 'Closed', icon: <SpaIcon />, color: '#ef4444' },
  { id: 6, name: 'Yoga Studio', category: 'Fitness', status: 'Operational', price: '₹150/class', slots: '10/20 Enrolled', icon: <YogaIcon />, color: '#db2777' },
  { id: 7, name: 'Billiards Room', category: 'Sports', status: 'Operational', price: '₹150/hr', slots: '2/4 Tables', icon: <CircleIcon />, color: '#4b5563' },
];

export default function GetFacility() {
  return (
    <Box sx={{ p: { xs: 2, md: 5 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Page Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6 }}>
        <Box>
          <Typography variant="h3" fontWeight="900" color="#002855">Facility Management</Typography>
          <Typography variant="subtitle1" color="text.secondary" fontWeight="700">Real-time Clubhouse activity oversight & pricing control</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          sx={{ borderRadius: '16px', px: 4, py: 1.5, fontWeight: 900, bgcolor: '#002855' }}
        >
          Add Facility
        </Button>
      </Stack>

      <Grid container spacing={4}>
        {/* Analytics Summary */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
            <Typography variant="h6" fontWeight="900" color="#002855" sx={{ mb: 1 }}>Total Units</Typography>
            <Typography variant="h3" fontWeight="900" color="#1d4ed8">12</Typography>
            <Typography variant="caption" color="#64748b" fontWeight="800">CATEGORIZED ACTIVITIES</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
            <Typography variant="h6" fontWeight="900" color="#002855" sx={{ mb: 1 }}>Active Slots</Typography>
            <Typography variant="h3" fontWeight="900" color="#10b981">48</Typography>
            <Typography variant="caption" color="#64748b" fontWeight="800">CURRENT OCCUPANCY</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
            <Typography variant="h6" fontWeight="900" color="#002855" sx={{ mb: 1 }}>Maintenance</Typography>
            <Typography variant="h3" fontWeight="900" color="#ef4444">01</Typography>
            <Typography variant="caption" color="#64748b" fontWeight="800">ATTENTION REQUIRED</Typography>
          </Paper>
        </Grid>

        {/* Facility Ledger */}
        <Grid size={{ xs: 12 }}>
          <Paper elevation={0} sx={{ borderRadius: '32px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800, py: 3, pl: 4 }}>FACILITY IDENTITY</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>CATEGORY</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>STATUS</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>PRICING MODEL</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>AVAILABILITY</TableCell>
                    <TableCell sx={{ fontWeight: 800 }} align="right">AUDIT</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ bgcolor: 'white' }}>
                  {mockFacilities.map((facility) => (
                    <TableRow key={facility.id} hover>
                      <TableCell sx={{ py: 2, pl: 4 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{ bgcolor: facility.color, color: 'white', width: 44, height: 44, borderRadius: '12px' }}>
                            {facility.icon}
                          </Avatar>
                          <Typography variant="body1" fontWeight="800" color="#002855">{facility.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip label={facility.category} size="small" sx={{ fontWeight: 900, borderRadius: '8px', bgcolor: '#f1f5f9' }} />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={facility.status} 
                          size="small" 
                          sx={{ 
                            fontWeight: 900, 
                            borderRadius: '8px',
                            bgcolor: facility.status === 'Operational' ? '#f0fdf4' : (facility.status === 'In Use' ? '#eff6ff' : '#fef2f2'),
                            color: facility.status === 'Operational' ? '#10b981' : (facility.status === 'In Use' ? '#1d4ed8' : '#ef4444'),
                          }} 
                        />
                      </TableCell>
                      <TableCell><Typography variant="body2" fontWeight="800" color="#1e293b">{facility.price}</Typography></TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="700" color="#64748b">{facility.slots}</Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ pr: 4 }}>
                        <IconButton size="small" sx={{ color: '#002855' }}><EditIcon fontSize="small" /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

    </Box>
  );
}
