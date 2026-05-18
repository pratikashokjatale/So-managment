import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Breadcrumbs, 
  Link, Card, CardContent, Grid, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  VisibilityOutlined as VisibilityOutlinedIcon,
  EditOutlined as EditOutlinedIcon,
  DeleteOutline as DeleteIcon,
  Business as ProjectIcon,
  Apartment as TowerIcon,
  DoorBackSharp as FlatIcon,
  Add as AddIcon,
  LocationOn as LocationIcon,
  FiberManualRecord as DotIcon
} from '@mui/icons-material';

import Search from '@/components/Search';
import Pagination from '@/components/Pagination';
import { getProjects, deleteProject, getTowers, getFlats } from '@/utils/setupStore';
import type { Project } from '@/utils/setupStore';

export default function GetProject() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handlePageChange = (_event: any, value: number) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  // Load data
  useEffect(() => {
    setProjects(getProjects());
  }, []);

  // Reset page to 1 on filter changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  // Metrics
  const towers = getTowers();
  const flats = getFlats();
  
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'Active').length;
  const totalTowers = towers.length;
  const totalFlats = flats.length;

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteProject(deleteId);
      setProjects(getProjects()); // Refresh
      setDeleteId(null);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedProjects = filteredProjects.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <Box sx={{ mt: 2, p: { xs: 2, md: 4 }, bgcolor: '#ffffff', minHeight: '100vh', borderRadius: '12px' }}>
      
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: '#002855' }}>
            Projects
          </Typography>
          <Breadcrumbs separator=">" aria-label="breadcrumb">
            <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
              Dashboard
            </Link>
            <Typography color="text.primary">Setup</Typography>
            <Typography color="text.primary" fontWeight="600">Projects</Typography>
          </Breadcrumbs>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/project/add')}
          sx={{ 
            borderRadius: '8px', 
            textTransform: 'none', 
            px: 3, 
            fontWeight: 600, 
            boxShadow: 'none',
            bgcolor: '#0047b3',
            '&:hover': { bgcolor: '#003380' }
          }}
        >
          Add Project
        </Button>
      </Box>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ bgcolor: '#eff6ff', borderRadius: '12px', boxShadow: 'none', border: '1px solid #d0e1fd' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, bgcolor: '#0047b3', color: '#ffffff', borderRadius: '8px', display: 'flex' }}>
                <ProjectIcon />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="600">TOTAL PROJECTS</Typography>
                <Typography variant="h5" fontWeight="800" sx={{ color: '#002855' }}>{totalProjects}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ bgcolor: '#ecfdf5', borderRadius: '12px', boxShadow: 'none', border: '1px solid #a7f3d0' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, bgcolor: '#10b981', color: '#ffffff', borderRadius: '8px', display: 'flex' }}>
                <DotIcon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="600">ACTIVE PROJECTS</Typography>
                <Typography variant="h5" fontWeight="800" sx={{ color: '#065f46' }}>{activeProjects}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ bgcolor: '#faf5ff', borderRadius: '12px', boxShadow: 'none', border: '1px solid #f3e8ff' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, bgcolor: '#8b5cf6', color: '#ffffff', borderRadius: '8px', display: 'flex' }}>
                <TowerIcon />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="600">TOTAL TOWERS</Typography>
                <Typography variant="h5" fontWeight="800" sx={{ color: '#5b21b6' }}>{totalTowers}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ bgcolor: '#fffbeb', borderRadius: '12px', boxShadow: 'none', border: '1px solid #fef3c7' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, bgcolor: '#f59e0b', color: '#ffffff', borderRadius: '8px', display: 'flex' }}>
                <FlatIcon />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="600">TOTAL FLATS</Typography>
                <Typography variant="h5" fontWeight="800" sx={{ color: '#92400e' }}>{totalFlats}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Filter section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Search 
          placeholder="Search by project name, code, or location..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: { xs: '100%', md: 400 }, '& fieldset': { borderRadius: '8px' } }}
        />
      </Box>

      {/* Table Section */}
      <TableContainer sx={{ border: '1px solid #f0f0f0', borderRadius: '12px', overflow: 'hidden' }}>
        <Table sx={{ minWidth: 800 }} aria-label="projects table">
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ color: '#002855', fontWeight: 700, py: 2 }}>Project Code</TableCell>
              <TableCell sx={{ color: '#002855', fontWeight: 700, py: 2 }}>Project Name</TableCell>
              <TableCell sx={{ color: '#002855', fontWeight: 700, py: 2 }}>Location</TableCell>
              <TableCell sx={{ color: '#002855', fontWeight: 700, py: 2 }}>Towers</TableCell>
              <TableCell sx={{ color: '#002855', fontWeight: 700, py: 2 }}>Flats</TableCell>
              <TableCell sx={{ color: '#002855', fontWeight: 700, py: 2 }}>Status</TableCell>
              <TableCell sx={{ color: '#002855', fontWeight: 700, py: 2, textAlign: 'right' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProjects.map((row) => {
              const projectTowers = towers.filter(t => t.projectId === row.id).length;
              const projectFlats = flats.filter(f => f.projectId === row.id).length;

              return (
                <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row" sx={{ py: 2, fontWeight: 700, color: '#0047b3', borderBottomColor: '#f0f0f0' }}>
                    {row.code}
                  </TableCell>
                  <TableCell sx={{ py: 2, borderBottomColor: '#f0f0f0' }}>
                    <Typography variant="body2" fontWeight="700" color="#002855">{row.name}</Typography>
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', maxWidth: 250 }}>
                      {row.description}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2, borderBottomColor: '#f0f0f0' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationIcon fontSize="inherit" sx={{ color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">{row.location}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 2, borderBottomColor: '#f0f0f0' }}>
                    <Typography variant="body2" fontWeight="600" color="text.primary">{projectTowers}</Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2, borderBottomColor: '#f0f0f0' }}>
                    <Typography variant="body2" fontWeight="600" color="text.primary">{projectFlats}</Typography>
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
                        bgcolor: row.status === 'Active' ? '#ecfdf5' : '#fef2f2',
                        color: row.status === 'Active' ? '#10b981' : '#ef4444'
                      }}
                    >
                      {row.status}
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ py: 2, borderBottomColor: '#f0f0f0' }}>
                    <IconButton 
                      size="small" 
                      sx={{ color: '#0047b3', bgcolor: '#eff6ff', mr: 1, '&:hover': { bgcolor: '#d0e1fd' } }} 
                      onClick={() => navigate(`/project/${row.id}`)}
                    >
                      <VisibilityOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      sx={{ color: 'text.secondary', mr: 1 }} 
                      onClick={() => navigate(`/project/edit/${row.id}`)}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      sx={{ color: 'error.main' }}
                      onClick={() => handleDeleteClick(row.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredProjects.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    No projects found matching the criteria.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Section */}
      <Box sx={{ mt: 3 }}>
        <Pagination 
          page={page} 
          totalResults={filteredProjects.length} 
          rowsPerPage={rowsPerPage} 
          onPageChange={handlePageChange} 
          onRowsPerPageChange={handleRowsPerPageChange} 
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#002855' }}>Delete Project?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this project? Deleting this project will **permanently delete all Towers and Flats** associated with it. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button 
            onClick={() => setDeleteId(null)} 
            sx={{ borderRadius: '8px', textTransform: 'none', px: 3, fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleConfirmDelete} 
            sx={{ borderRadius: '8px', textTransform: 'none', px: 3, fontWeight: 600, boxShadow: 'none' }}
          >
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
