import { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Grid, Stack, Chip, Button, IconButton, Switch,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  SportsTennis as TennisIcon, 
  FitnessCenter as GymIcon,
  Movie as CinemaIcon,
  Spa as SpaIcon,
  SelfImprovement as YogaIcon,
  Pool as PoolIcon,
  Park as ParkIcon,
  EditOutlined as EditIcon,
  DeleteOutline as DeleteIcon,
  Add as AddIcon,
  Circle as CircleIcon,
  VisibilityOutlined as VisibilityIcon
} from '@mui/icons-material';
import Pagination from '../../components/Pagination';

import { getFacilitiesApi, getFacilityStatsApi, updateFacilityApi, deleteFacilityApi } from '@/apis/facility';

// Dynamic category icons helper
function getFacilityIcon(iconName: string) {
  switch (iconName) {
    case 'SportsTennis':
      return <TennisIcon />;
    case 'FitnessCenter':
      return <GymIcon />;
    case 'Movie':
      return <CinemaIcon />;
    case 'Spa':
      return <SpaIcon />;
    case 'SelfImprovement':
      return <YogaIcon />;
    case 'Pool':
      return <PoolIcon />;
    case 'Park':
      return <ParkIcon />;
    default:
      return <CircleIcon />;
  }
}

const mapBackendFacilityToFrontend = (f: any) => {
  let normStatus = f.status || 'Operational';
  if (normStatus === 'OPERATIONAL') normStatus = 'Operational';
  else if (normStatus === 'IN_USE') normStatus = 'In Use';
  else if (normStatus === 'MAINTENANCE') normStatus = 'Maintenance';
  else if (normStatus === 'CLOSED') normStatus = 'Inactive';

  let normCategory = f.category || 'Other';
  if (normCategory === 'SPORTS') normCategory = 'Sports';
  else if (normCategory === 'FITNESS') normCategory = 'Fitness';
  else if (normCategory === 'LEISURE') normCategory = 'Leisure';
  else if (normCategory === 'WELLNESS') normCategory = 'Wellness';
  else if (normCategory === 'OTHER') normCategory = 'Other';

  const price = f.priceLabel || f.price || (f.priceAmount ? `₹${f.priceAmount}/${f.pricingModel?.toLowerCase() === 'hourly' ? 'hr' : f.pricingModel?.toLowerCase()}` : 'Free');
  const slots = `${f.bookedSlots || 0}/${f.totalSlots || 12} Booked`;

  let color = '#4b5563';
  const catLower = normCategory.toLowerCase();
  if (catLower === 'sports') color = '#1d4ed8';
  else if (catLower === 'fitness') color = '#ea580c';
  else if (catLower === 'leisure') color = '#7c3aed';
  else if (catLower === 'wellness') color = '#db2777';

  return {
    id: f.id,
    name: f.name,
    category: normCategory,
    status: normStatus,
    price,
    slots,
    color,
    description: f.description || '',
    managerName: f.managerName || '',
    managerContact: f.managerContact || '',
    iconName: f.iconKey || 'SportsTennis',
    createdAt: f.createdAt ? f.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
  };
};

export default function GetFacility() {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const res = await getFacilitiesApi({ limit: rowsPerPage, page });
      let list: any[] = [];
      const d = res?.data || res;
      if (Array.isArray(d)) {
        list = d;
      } else if (d?.items && Array.isArray(d.items)) {
        list = d.items;
      } else if (d?.facilities && Array.isArray(d.facilities)) {
        list = d.facilities;
      } else if (d?.data && Array.isArray(d.data)) {
        list = d.data;
      }

      setFacilities(list.map(mapBackendFacilityToFrontend));
      const pagination = d?.pagination || res?.pagination;
      setTotalResults(pagination?.total || list.length);
    } catch (error) {
      console.warn("Failed to fetch facilities via API:", error);
      setFacilities([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await getFacilityStatsApi();
      const data = res?.data || res;
      if (data && data.totalUnits !== undefined) {
        setStats(data);
      }
    } catch (error) {
      console.warn("Failed to fetch facility stats via API:", error);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const isCurrentlyActive = currentStatus !== 'Inactive';
    const newStatus = isCurrentlyActive ? 'CLOSED' : 'OPERATIONAL';
    const newIsActive = !isCurrentlyActive;
    
    try {
      await updateFacilityApi(id, { status: newStatus, isActive: newIsActive });
      fetchFacilities();
      fetchStats();
      toast.success(`Facility status changed to ${newStatus}`);
    } catch (err: any) {
      console.warn("Failed to toggle facility status via API, falling back:", err);
      toast.error(err?.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFacilityApi(id);
      fetchFacilities();
      fetchStats();
      toast.success("Facility deleted successfully!");
    } catch (err: any) {
      console.warn("Failed to delete facility via API, falling back:", err);
      toast.error(err?.response?.data?.message || "Failed to delete facility");
    }

    const totalPages = Math.ceil(totalResults / rowsPerPage);
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  };


  // Compute analytics
  const totalUnits = stats?.totalUnits !== undefined ? stats.totalUnits : facilities.length;
  const activeOccupancy = stats?.activeBookings !== undefined ? stats.activeBookings : (facilities.filter((f: any) => f.status === 'In Use').length * 12 + 24);
  const maintenanceCount = stats?.maintenance !== undefined ? stats.maintenance : facilities.filter((f: any) => f.status === 'Maintenance').length;

  const paginatedFacilities = facilities;

  const getStatusChipStyles = (status: string) => {
    switch (status) {
      case 'Operational':
        return { bg: '#f0fdf4', color: '#10b981' };
      case 'In Use':
        return { bg: '#eff6ff', color: '#1d4ed8' };
      case 'Maintenance':
        return { bg: '#fff7ed', color: '#ea580c' };
      default: // Inactive
        return { bg: '#f1f5f9', color: '#64748b' };
    }
  };

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
          onClick={() => navigate('/facility/add')}
          sx={{ borderRadius: '16px', px: 4, py: 1.5, fontWeight: 900, bgcolor: '#002855' }}
        >
          Add Facility
        </Button>
      </Stack>

      <Grid container spacing={4}>
        
        {/* Analytics Summary */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
            <Typography variant="h6" fontWeight="900" color="#002855" sx={{ mb: 1 }}>Total Units</Typography>
            <Typography variant="h3" fontWeight="900" color="#1d4ed8">{totalUnits}</Typography>
            <Typography variant="caption" color="#64748b" fontWeight="800">CATEGORIZED ACTIVITIES</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
            <Typography variant="h6" fontWeight="900" color="#002855" sx={{ mb: 1 }}>Active Bookings</Typography>
            <Typography variant="h3" fontWeight="900" color="#10b981">{activeOccupancy}</Typography>
            <Typography variant="caption" color="#64748b" fontWeight="800">CURRENT BOOKED SLOTS</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
            <Typography variant="h6" fontWeight="900" color="#002855" sx={{ mb: 1 }}>Maintenance</Typography>
            <Typography variant="h3" fontWeight="900" color="#ef4444">{String(maintenanceCount).padStart(2, '0')}</Typography>
            <Typography variant="caption" color="#64748b" fontWeight="800">ATTENTION REQUIRED</Typography>
          </Paper>
        </Grid>

        {/* Facility Ledger */}
        <Grid size={12}>
          <Paper elevation={0} sx={{ borderRadius: '32px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800, py: 3, pl: 4 }}>FACILITY IDENTITY</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>CATEGORY</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>STATUS</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>TOGGLE ACTIVE</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>PRICING MODEL</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>AVAILABILITY</TableCell>
                    <TableCell sx={{ fontWeight: 800 }} align="right">AUDIT ACTIONS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ bgcolor: 'white' }}>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <CircularProgress size={30} />
                      </TableCell>
                    </TableRow>
                  ) : paginatedFacilities.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                          No facilities found matching the criteria.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedFacilities.map((facility) => {
                      const chipColors = getStatusChipStyles(facility.status);
                      return (
                        <TableRow key={facility.id} hover>
                          {/* Identity */}
                          <TableCell sx={{ py: 2.5, pl: 4 }}>
                          <Stack 
                            direction="row" 
                            spacing={2} 
                            alignItems="center" 
                            onClick={() => navigate(`/facility/${facility.id}`)}
                            sx={{ cursor: 'pointer' }}
                          >
                            <Avatar sx={{ bgcolor: facility.color, color: 'white', width: 44, height: 44, borderRadius: '12px' }}>
                              {getFacilityIcon(facility.iconName)}
                            </Avatar>
                            <Typography variant="body1" fontWeight="800" color="#002855" sx={{ '&:hover': { color: '#1d4ed8' } }}>
                              {facility.name}
                            </Typography>
                          </Stack>
                        </TableCell>

                        {/* Category */}
                        <TableCell>
                          <Chip label={facility.category} size="small" sx={{ fontWeight: 900, borderRadius: '8px', bgcolor: '#f1f5f9' }} />
                        </TableCell>

                        {/* Status Chip */}
                        <TableCell>
                          <Chip 
                            label={facility.status} 
                            size="small" 
                            sx={{ 
                              fontWeight: 900, 
                              borderRadius: '8px',
                              bgcolor: chipColors.bg,
                              color: chipColors.color
                            }} 
                          />
                        </TableCell>

                        {/* Status Switch Toggle */}
                        <TableCell>
                          <Switch
                            size="small"
                            color="success"
                            checked={facility.status !== 'Inactive'}
                            onChange={() => handleStatusToggle(facility.id, facility.status)}
                          />
                        </TableCell>

                        {/* Price */}
                        <TableCell>
                          <Typography variant="body2" fontWeight="800" color="#1e293b">{facility.price}</Typography>
                        </TableCell>

                        {/* Slots Availability */}
                        <TableCell>
                          <Typography variant="body2" fontWeight="700" color="#64748b">{facility.slots}</Typography>
                        </TableCell>

                        {/* Audit Actions */}
                        <TableCell align="right" sx={{ pr: 4 }}>
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <IconButton 
                              size="small" 
                              onClick={() => navigate(`/facility/${facility.id}`)}
                              sx={{ color: '#0284c7' }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => navigate(`/facility/edit/${facility.id}`)}
                              sx={{ color: '#002855' }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => handleDelete(facility.id)}
                              sx={{ color: '#ef4444' }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  }))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ px: 4, py: 1.5, borderTop: '1px solid #e2e8f0' }}>
              <Pagination
                page={page}
                totalResults={totalResults}
                rowsPerPage={rowsPerPage}
                onPageChange={(_, value) => setPage(value)}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(Number(event.target.value));
                  setPage(1);
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

    </Box>
  );
}
