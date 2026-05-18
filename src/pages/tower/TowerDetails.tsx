import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Breadcrumbs, 
  Link, Paper, Grid, Card, CardContent, Divider, Dialog,
  DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import {
  EditOutlined as EditOutlinedIcon,
  DeleteOutline as DeleteIcon,
  DoorBackSharp as FlatIcon,
  Add as AddIcon
} from '@mui/icons-material';

import Pagination from '@/components/Pagination';
import BackButton from '@/components/BackButton';
import { getTowers, getFlats, deleteFlat } from '@/utils/setupStore';
import type { Tower, Flat } from '@/utils/setupStore';

export default function TowerDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [tower, setTower] = useState<Tower | null>(null);
  const [towerFlats, setTowerFlats] = useState<Flat[]>([]);
  const [deleteFlatId, setDeleteFlatId] = useState<string | null>(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handlePageChange = (_event: any, value: number) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  useEffect(() => {
    const towers = getTowers();
    const foundTower = towers.find(t => t.id === id);
    if (foundTower) {
      setTower(foundTower);
      const flats = getFlats();
      setTowerFlats(flats.filter(f => f.towerId === id));
      setPage(1);
    } else {
      navigate('/tower');
    }
  }, [id, navigate]);

  const handleDeleteFlatClick = (flatId: string) => {
    setDeleteFlatId(flatId);
  };

  const handleConfirmDeleteFlat = () => {
    if (deleteFlatId) {
      deleteFlat(deleteFlatId);
      setTowerFlats(getFlats().filter(f => f.towerId === id));
      setDeleteFlatId(null);
    }
  };

  if (!tower) {
    return <Typography sx={{ p: 4 }}>Loading...</Typography>;
  }

  // Count occupancy
  const occupiedCount = towerFlats.filter(f => f.status === 'Occupied').length;
  const vacantCount = towerFlats.filter(f => f.status === 'Vacant').length;
  const maintenanceCount = towerFlats.filter(f => f.status === 'Maintenance').length;

  const paginatedFlats = towerFlats.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Occupied': return { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' }; // blue
      case 'Vacant': return { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0' }; // green
      case 'Maintenance': return { bg: '#fffbeb', text: '#b45309', border: '#fde68a' }; // amber
      default: return { bg: '#f8fafc', text: 'text.secondary', border: '#e2e8f0' };
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#ffffff', minHeight: '100vh', borderRadius: '12px' }}>
      
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#002855', mb: 1 }}>
            {tower.name}
          </Typography>
          <Breadcrumbs separator=">" aria-label="breadcrumb">
            <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
              Dashboard
            </Link>
            <Link underline="hover" color="inherit" onClick={() => navigate('/tower')} sx={{ cursor: 'pointer' }}>
              Towers
            </Link>
            <Typography color="text.primary" fontWeight="600">{tower.name} Details</Typography>
          </Breadcrumbs>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button 
            variant="outlined" 
            startIcon={<EditOutlinedIcon />}
            onClick={() => navigate(`/tower/edit/${tower.id}`)}
            sx={{ borderRadius: '8px', textTransform: 'none', px: 2.5, fontWeight: 600, borderColor: '#e0e0e0', color: 'text.primary' }}
          >
            Edit Tower
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => navigate(`/flat/add?towerId=${tower.id}`)}
            sx={{ borderRadius: '8px', textTransform: 'none', px: 2.5, fontWeight: 600, boxShadow: 'none', bgcolor: '#0047b3', '&:hover': { bgcolor: '#003380' } }}
          >
            Add Flat
          </Button>
          <BackButton to="/tower" label="Back to Towers" />
        </Box>
      </Box>

      {/* Details Area */}
      <Grid container spacing={4} sx={{ mb: 5 }}>
        
        {/* Tower Info Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 4, border: '1px solid #f0f0f0', borderRadius: '16px', height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" color="#002855" sx={{ mb: 2 }}>
              Tower Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary" fontWeight="600" display="block">TOWER NAME</Typography>
                <Typography variant="body1" fontWeight="700" color="#002855">{tower.name}</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary" fontWeight="600" display="block">PROJECT NAME</Typography>
                <Typography variant="body1" fontWeight="700" color="#0047b3">{tower.projectName}</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary" fontWeight="600" display="block">TOTAL FLOORS</Typography>
                <Typography variant="body1" fontWeight="700">{tower.floorsCount} Floors</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary" fontWeight="600" display="block">STATUS</Typography>
                <Box 
                  sx={{ 
                    display: 'inline-flex', 
                    px: 1.5, 
                    py: 0.5, 
                    borderRadius: '6px', 
                    fontSize: '0.75rem', 
                    fontWeight: 700,
                    mt: 0.5,
                    bgcolor: tower.status === 'Active' ? '#ecfdf5' : '#fef2f2',
                    color: tower.status === 'Active' ? '#10b981' : '#ef4444'
                  }}
                >
                  {tower.status}
                </Box>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" color="text.secondary" fontWeight="600" display="block">DESCRIPTION</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.6 }}>
                  {tower.description || 'No description provided for this tower.'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Dynamic Occupancy Stats */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 4, border: '1px solid #f0f0f0', borderRadius: '16px', height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" color="#002855" sx={{ mb: 2 }}>
              Occupancy Statistics
            </Typography>
            
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Card sx={{ bgcolor: '#eff6ff', borderRadius: '12px', boxShadow: 'none', border: '1px solid #bfdbfe' }}>
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                    <Typography variant="subtitle2" fontWeight="700" color="#1d4ed8">Occupied Flats</Typography>
                    <Typography variant="h6" fontWeight="800" color="#1d4ed8">{occupiedCount}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                <Card sx={{ bgcolor: '#ecfdf5', borderRadius: '12px', boxShadow: 'none', border: '1px solid #a7f3d0' }}>
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                    <Typography variant="subtitle2" fontWeight="700" color="#047857">Vacant Flats</Typography>
                    <Typography variant="h6" fontWeight="800" color="#047857">{vacantCount}</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Card sx={{ bgcolor: '#fffbeb', borderRadius: '12px', boxShadow: 'none', border: '1px solid #fde68a' }}>
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                    <Typography variant="subtitle2" fontWeight="700" color="#b45309">Under Maintenance</Typography>
                    <Typography variant="h6" fontWeight="800" color="#b45309">{maintenanceCount}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Flats List Inside Tower */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" fontWeight="bold" color="#002855" sx={{ mb: 3 }}>
          Flats in {tower.name}
        </Typography>

        <TableContainer sx={{ border: '1px solid #f0f0f0', borderRadius: '12px', overflow: 'hidden' }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ color: '#002855', fontWeight: 700, py: 2 }}>Flat Number</TableCell>
                <TableCell sx={{ color: '#002855', fontWeight: 700, py: 2 }}>Floor</TableCell>
                <TableCell sx={{ color: '#002855', fontWeight: 700, py: 2 }}>Flat Type</TableCell>
                <TableCell sx={{ color: '#002855', fontWeight: 700, py: 2 }}>Occupancy Status</TableCell>
                <TableCell sx={{ color: '#002855', fontWeight: 700, py: 2, textAlign: 'right' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedFlats.map((flat) => {
                const colors = getStatusColor(flat.status);

                return (
                  <TableRow key={flat.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ py: 2, fontWeight: 700, color: '#0047b3', borderBottomColor: '#f0f0f0' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <FlatIcon sx={{ color: 'text.secondary' }} />
                        <Typography variant="body2" fontWeight="700">{flat.number}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2, borderBottomColor: '#f0f0f0', fontWeight: 600 }}>
                      {flat.floor}
                    </TableCell>
                    <TableCell sx={{ py: 2, borderBottomColor: '#f0f0f0', fontWeight: 600 }}>
                      {flat.type}
                    </TableCell>
                    <TableCell sx={{ py: 2, borderBottomColor: '#f0f0f0' }}>
                      <Box 
                        sx={{ 
                          display: 'inline-flex', 
                          px: 1.5, 
                          py: 0.5, 
                          borderRadius: '6px', 
                          fontSize: '0.75rem', 
                          fontWeight: 700,
                          bgcolor: colors.bg,
                          color: colors.text,
                          border: `1px solid ${colors.border}`
                        }}
                      >
                        {flat.status}
                      </Box>
                    </TableCell>
                    <TableCell align="right" sx={{ py: 2, borderBottomColor: '#f0f0f0' }}>
                      <IconButton 
                        size="small" 
                        sx={{ color: 'text.secondary', mr: 1 }} 
                        onClick={() => navigate(`/flat/edit/${flat.id}`)}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        sx={{ color: 'error.main' }}
                        onClick={() => handleDeleteFlatClick(flat.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {towerFlats.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      No flats registered inside this tower yet.
                    </Typography>
                    <Button 
                      variant="outlined" 
                      startIcon={<AddIcon />} 
                      onClick={() => navigate(`/flat/add?towerId=${tower.id}`)}
                      sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 600 }}
                    >
                      Register First Flat
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination Section */}
        {towerFlats.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Pagination 
              page={page} 
              totalResults={towerFlats.length} 
              rowsPerPage={rowsPerPage} 
              onPageChange={handlePageChange} 
              onRowsPerPageChange={handleRowsPerPageChange} 
              rowsPerPageOptions={[5, 10, 20]}
            />
          </Box>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteFlatId} onClose={() => setDeleteFlatId(null)}>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#002855' }}>Delete Flat?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete this flat? This action cannot be undone and will clear all occupant records.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button 
            onClick={() => setDeleteFlatId(null)} 
            sx={{ borderRadius: '8px', textTransform: 'none', px: 3, fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleConfirmDeleteFlat} 
            sx={{ borderRadius: '8px', textTransform: 'none', px: 3, fontWeight: 600, boxShadow: 'none' }}
          >
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
