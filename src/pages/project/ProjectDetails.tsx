import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Breadcrumbs, 
  Link, Paper, Grid, Card, CardContent, Divider, Dialog,
  DialogTitle, DialogContent, DialogContentText, DialogActions,
  CircularProgress
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import {
  VisibilityOutlined as VisibilityOutlinedIcon,
  EditOutlined as EditOutlinedIcon,
  DeleteOutline as DeleteIcon,
  Apartment as TowerIcon,
  DoorBackSharp as FlatIcon,
  Add as AddIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

import Pagination from '@/components/Pagination';
import BackButton from '@/components/BackButton';
import { getProjects, getTowers, deleteTower, getFlats } from '@/utils/setupStore';
import { getProjectDetailsApi } from '@/apis/project';
import { getCachedFlatsSequentially } from '@/utils/apiCache';
import { deleteTowerApi } from '@/apis/tower';
import { toast } from 'react-hot-toast';

export default function ProjectDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [project, setProject] = useState<any | null>(null);
  const [projectTowers, setProjectTowers] = useState<any[]>([]);
  const [flats, setFlats] = useState<any[]>([]);
  const [deleteTowerId, setDeleteTowerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
    const loadProjectDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await getProjectDetailsApi(id);
        const foundProject = res?.data || res;
        if (foundProject) {
          setProject(foundProject);
          const towers = foundProject.Towers || foundProject.towers || [];
          setProjectTowers(towers);

          // Fetch all flats dynamically for the project's towers sequentially
          const towerIds = towers.map((t: any) => t.id);
          const allFlats = await getCachedFlatsSequentially(towerIds);
          setFlats(allFlats);
          
          setPage(1);
        } else {
          throw new Error("Project not found");
        }
      } catch (error) {
        console.warn("Failed to fetch project details via API, performing local storage fallback:", error);
        const projects = getProjects();
        const foundProject = projects.find(p => p.id === id);
        if (foundProject) {
          setProject(foundProject);
          const towers = getTowers();
          setProjectTowers(towers.filter(t => t.projectId === id));
          setFlats(getFlats().filter(f => f.projectId === id));
          setPage(1);
        } else {
          navigate('/project');
        }
      } finally {
        setLoading(false);
      }
    };
    loadProjectDetails();
  }, [id, navigate]);

  const handleDeleteTowerClick = (towerId: string) => {
    setDeleteTowerId(towerId);
  };

  const handleConfirmDeleteTower = async () => {
    if (deleteTowerId) {
      try {
        await deleteTowerApi(deleteTowerId);
        toast.success("Tower deleted successfully");
      } catch (error: any) {
        console.warn("API tower deletion failed, performing local storage fallback:", error);
        deleteTower(deleteTowerId);
        toast.success("Tower deleted successfully (offline fallback)");
      }
      if (project && (project.Towers || project.towers)) {
        const remainingTowers = projectTowers.filter(t => t.id !== deleteTowerId);
        setProjectTowers(remainingTowers);
      } else {
        setProjectTowers(getTowers().filter(t => t.projectId === id));
      }
      setDeleteTowerId(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!project) {
    return <Typography sx={{ p: 4 }}>Project not found.</Typography>;
  }

  const projectFlats = flats.length;

  const paginatedTowers = projectTowers.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#ffffff', minHeight: '100vh', borderRadius: '12px' }}>
      
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'end', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button 
            variant="outlined" 
            startIcon={<EditOutlinedIcon />}
            onClick={() => navigate(`/project/edit/${project.id}`)}
            sx={{ borderRadius: '8px', textTransform: 'none', px: 2.5, fontWeight: 600, borderColor: '#e0e0e0', color: 'text.primary' }}
          >
            Edit Project
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => navigate(`/tower/add?projectId=${project.id}`)}
            sx={{ borderRadius: '8px', textTransform: 'none', px: 2.5, fontWeight: 600, boxShadow: 'none', bgcolor: '#0047b3', '&:hover': { bgcolor: '#003380' } }}
          >
            Add Tower
          </Button>
          <BackButton to="/project" label="Back to Projects" />
        </Box>
      </Box>

      {/* Main Details and Side Stats */}
      <Grid container spacing={4} sx={{ mb: 5 }}>
        
        {/* Project Metadata */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ p: 4, border: '1px solid #f0f0f0', borderRadius: '16px', height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" color="#091542" sx={{ mb: 2 }}>
              Project Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary" fontWeight="600" display="block">PROJECT NAME</Typography>
                <Typography variant="body1" fontWeight="700" color="#091542">{project.name}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary" fontWeight="600" display="block">PROJECT CODE</Typography>
                <Typography variant="body1" fontWeight="700" color="#0047b3">{project.code}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary" fontWeight="600" display="block">LOCATION</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <LocationIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  <Typography variant="body1" fontWeight="600">{project.location}</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
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
                    bgcolor: project.status === 'Active' ? '#ecfdf5' : '#fef2f2',
                    color: project.status === 'Active' ? '#10b981' : '#ef4444'
                  }}
                >
                  {project.status}
                </Box>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" color="text.secondary" fontWeight="600" display="block">DESCRIPTION</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.6 }}>
                  {project.description || 'No description provided for this project.'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Dynamic Summary Cards */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Card sx={{ bgcolor: '#faf5ff', borderRadius: '16px', boxShadow: 'none', border: '1px solid #f3e8ff' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2.5, py: 3 }}>
                  <Box sx={{ p: 2, bgcolor: '#8b5cf6', color: '#ffffff', borderRadius: '12px', display: 'flex' }}>
                    <TowerIcon fontSize="medium" />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="700">TOWERS IN PROJECT</Typography>
                    <Typography variant="h4" fontWeight="800" sx={{ color: '#5b21b6', mt: 0.5 }}>{projectTowers.length}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12 }}>
              <Card sx={{ bgcolor: '#fffbeb', borderRadius: '16px', boxShadow: 'none', border: '1px solid #fef3c7' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2.5, py: 3 }}>
                  <Box sx={{ p: 2, bgcolor: '#f59e0b', color: '#ffffff', borderRadius: '12px', display: 'flex' }}>
                    <FlatIcon fontSize="medium" />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="700">FLATS IN PROJECT</Typography>
                    <Typography variant="h4" fontWeight="800" sx={{ color: '#92400e', mt: 0.5 }}>{projectFlats}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Nested Towers List */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" fontWeight="bold" color="#091542" sx={{ mb: 3 }}>
          Towers in {project.name}
        </Typography>

        <TableContainer sx={{ border: '1px solid #f0f0f0', borderRadius: '12px', overflow: 'hidden' }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ color: '#091542', fontWeight: 700, py: 2 }}>Tower Name</TableCell>
                <TableCell sx={{ color: '#091542', fontWeight: 700, py: 2 }}>Total Floors</TableCell>
                <TableCell sx={{ color: '#091542', fontWeight: 700, py: 2 }}>Flats Count</TableCell>
                <TableCell sx={{ color: '#091542', fontWeight: 700, py: 2 }}>Status</TableCell>
                <TableCell sx={{ color: '#091542', fontWeight: 700, py: 2, textAlign: 'right' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTowers.map((tower) => {
                const towerFlatsCount = flats.filter(f => f.towerId === tower.id).length;

                return (
                  <TableRow key={tower.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ py: 2, fontWeight: 700, color: '#091542', borderBottomColor: '#f0f0f0' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <TowerIcon sx={{ color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="body2" fontWeight="700">{tower.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{tower.description}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2, borderBottomColor: '#f0f0f0' }}>
                      <Typography variant="body2" fontWeight="600">{tower.totalFloors !== undefined ? tower.totalFloors : tower.floorsCount} Floors</Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, borderBottomColor: '#f0f0f0' }}>
                      <Typography variant="body2" fontWeight="600" color="#0047b3">{towerFlatsCount} Flats</Typography>
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
                          bgcolor: (tower.status?.toUpperCase() === 'ACTIVE' || tower.status === 'Active') ? '#ecfdf5' : '#fef2f2',
                          color: (tower.status?.toUpperCase() === 'ACTIVE' || tower.status === 'Active') ? '#10b981' : '#ef4444'
                        }}
                      >
                        {tower.status}
                      </Box>
                    </TableCell>
                    <TableCell align="right" sx={{ py: 2, borderBottomColor: '#f0f0f0' }}>
                      <IconButton 
                        size="small" 
                        sx={{ color: '#0047b3', bgcolor: '#eff6ff', mr: 1, '&:hover': { bgcolor: '#d0e1fd' } }} 
                        onClick={() => navigate(`/tower/${tower.id}`)}
                      >
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        sx={{ color: 'text.secondary', mr: 1 }} 
                        onClick={() => navigate(`/tower/edit/${tower.id}`)}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        sx={{ color: 'error.main' }}
                        onClick={() => handleDeleteTowerClick(tower.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {projectTowers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      No towers registered under this project yet.
                    </Typography>
                    <Button 
                      variant="outlined" 
                      startIcon={<AddIcon />} 
                      onClick={() => navigate(`/tower/add?projectId=${project.id}`)}
                      sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 600 }}
                    >
                      Add First Tower
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination Section */}
        {projectTowers.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Pagination 
              page={page} 
              totalResults={projectTowers.length} 
              rowsPerPage={rowsPerPage} 
              onPageChange={handlePageChange} 
              onRowsPerPageChange={handleRowsPerPageChange} 
              rowsPerPageOptions={[5, 10, 20]}
            />
          </Box>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTowerId} onClose={() => setDeleteTowerId(null)}>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#091542' }}>Delete Tower?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this tower? Deleting this tower will **permanently delete all Flats** inside it. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button 
            onClick={() => setDeleteTowerId(null)} 
            sx={{ borderRadius: '8px', textTransform: 'none', px: 3, fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleConfirmDeleteTower} 
            sx={{ borderRadius: '8px', textTransform: 'none', px: 3, fontWeight: 600, boxShadow: 'none' }}
          >
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}