import { useState } from 'react';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, 
  Select, MenuItem, Breadcrumbs, Link, Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import Pagination from '../../components/Pagination';
import StatusBadge from '../../components/StatusBadge';
import Search from '@/components/Search';

const mockAnnouncements = [
  { id: 1, title: 'Pool Maintenance', type: 'Facility', postedOn: '15 May 2024', expiryDate: '20 May 2024', status: 'Active' },
  { id: 2, title: 'New Yoga Classes', type: 'General', postedOn: '14 May 2024', expiryDate: '31 May 2024', status: 'Active' },
  { id: 3, title: 'Tennis Tournament', type: 'Event', postedOn: '13 May 2024', expiryDate: '25 May 2024', status: 'Active' },
  { id: 4, title: 'Club Timings Update', type: 'General', postedOn: '12 May 2024', expiryDate: '31 May 2024', status: 'Active' },
  { id: 5, title: 'Power Backup Maintenance Alert', type: 'Staff', postedOn: '11 May 2024', expiryDate: '18 May 2024', status: 'Expired' },
];

export default function GetAnnouncement() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const handlePageChange = (_event: any, value: number) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const filterSelectSx = {
    height: 40,
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'text.primary',
    borderRadius: '10px',
    bgcolor: '#f8fafc',
    '.MuiOutlinedInput-notchedOutline': { border: 'none' },
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#ffffff', minHeight: '100vh', borderRadius: 2 }}>
      
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: '#091542' }}>
          Announcements
        </Typography>
        <Breadcrumbs separator=">" aria-label="breadcrumb">
          <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
            Dashboard
          </Link>
          <Typography color="text.primary">Announcements</Typography>
        </Breadcrumbs>
      </Box>

      {/* Filters Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as string)} sx={filterSelectSx}>
            <MenuItem value="All Types">All Types</MenuItem>
            <MenuItem value="Facility">Facility</MenuItem>
            <MenuItem value="General">General</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
            <MenuItem value="Staff">Staff</MenuItem>
          </Select>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as string)} sx={filterSelectSx}>
            <MenuItem value="All Status">All Status</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Expired">Expired</MenuItem>
          </Select>
          <Search 
            placeholder="Search announcements..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: { xs: '100%', md: 300 }, '& fieldset': { borderRadius: '10px' } }}
          />
        </Box>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/announcement/add')}
          sx={{ borderRadius: '10px', textTransform: 'none', px: 3, fontWeight: 600, bgcolor: '#0047b3', '&:hover': { bgcolor: '#003380' }, boxShadow: 'none' }}
        >
          Create Announcement
        </Button>
      </Box>

      {/* Table Section */}
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 900 }} aria-label="announcements table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Title</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Posted On</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Expiry Date</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, textAlign: 'right' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockAnnouncements.map((row) => (
              <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{ borderBottomColor: '#f0f0f0', py: 2.5 }}>
                  <Typography variant="body2" sx={{ color: '#091542', fontWeight: 600 }}>{row.title}</Typography>
                </TableCell>
                <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>{row.type}</Typography>
                </TableCell>
                <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                  <Typography variant="body2" sx={{ color: '#091542', fontWeight: 500 }}>{row.postedOn}</Typography>
                </TableCell>
                <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                  <Typography variant="body2" sx={{ color: '#091542', fontWeight: 500 }}>{row.expiryDate}</Typography>
                </TableCell>
                <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                  <StatusBadge status={row.status} variantType="text" />
                </TableCell>
                <TableCell align="right" sx={{ borderBottomColor: '#f0f0f0' }}>
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    <IconButton size="small" sx={{ color: 'text.secondary' }}>
                      <VisibilityOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" sx={{ color: 'text.secondary' }}>
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" sx={{ color: '#f44336' }}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Section */}
      <Box sx={{ mt: 3 }}>
        <Pagination 
          page={page} 
          totalResults={28} 
          rowsPerPage={rowsPerPage} 
          onPageChange={handlePageChange} 
          onRowsPerPageChange={handleRowsPerPageChange} 
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>

    </Box>
  );
}
