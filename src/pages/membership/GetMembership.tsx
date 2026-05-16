import { useState } from 'react';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Avatar, IconButton, 
  Select, MenuItem, Breadcrumbs, Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import Pagination from '../../components/Pagination';
import StatusBadge from '../../components/StatusBadge';
import Search from '@/components/Search';

const mockMemberships = [
  { id: 1, name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=1', apartment: 'A-101', plan: 'Monthly', startDate: '01 May 2024', endDate: '31 May 2024', status: 'Active', upcoming: '3 Months' },
  { id: 2, name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=2', apartment: 'A-102', plan: 'Monthly', startDate: '01 May 2024', endDate: '31 May 2024', status: 'Active', upcoming: '2 Months' },
  { id: 3, name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?u=3', apartment: 'A-103', plan: 'Quarterly', startDate: '01 Apr 2024', endDate: '30 Jun 2024', status: 'Active', upcoming: '2 Months' },
  { id: 4, name: 'Emily Davis', avatar: 'https://i.pravatar.cc/150?u=4', apartment: 'A-104', plan: 'Monthly', startDate: '01 Mar 2024', endDate: '31 Mar 2024', status: 'Expired', upcoming: '0' },
  { id: 5, name: 'Robert Brown', avatar: 'https://i.pravatar.cc/150?u=5', apartment: 'A-105', plan: 'Monthly', startDate: '01 May 2024', endDate: '31 May 2024', status: 'Active', upcoming: '4 Months' },
];

export default function GetMembership() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
   const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [statusFilter, setStatusFilter] = useState('All Status');
  const [planFilter, setPlanFilter] = useState('All Plans');

  const handlePageChange = (_event: any, value: number) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const filterSelectSx = {
    height: 36,
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'text.primary',
    boxShadow: 'none',
    '.MuiOutlinedInput-notchedOutline': { border: 'none' },
    '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#ffffff', minHeight: '100vh', borderRadius: 2 }}>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: '#002855' }}>
          Memberships
        </Typography>
        <Breadcrumbs separator=">" aria-label="breadcrumb">
          <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
            Dashboard
          </Link>
          <Typography color="text.primary">Memberships</Typography>
        </Breadcrumbs>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Search 
          placeholder="Search by name, apartment..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: { xs: '100%', md: 350 }, '& fieldset': { borderRadius: '8px' } }}
        />
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* <Button 
            variant="text" 
            startIcon={<DownloadIcon />} 
            sx={{ color: 'text.primary', fontWeight: 600, textTransform: 'none' }}
          >
            Export
          </Button> */}
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<PersonAddIcon />}
            onClick={() => navigate('/membership/add')}
            sx={{ borderRadius: '8px', textTransform: 'none', px: 3, fontWeight: 600, boxShadow: 'none', bgcolor: '#0047b3', '&:hover': { bgcolor: '#003380' } }}
          >
            Add Membership
          </Button>
        </Box>
      </Box>

      {/* Filters Section */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as string)} sx={filterSelectSx}>
          <MenuItem value="All Status">All Status</MenuItem>
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Expired">Expired</MenuItem>
        </Select>
        <Select value={planFilter} onChange={(e) => setPlanFilter(e.target.value as string)} sx={filterSelectSx}>
          <MenuItem value="All Plans">All Plans</MenuItem>
          <MenuItem value="Monthly">Monthly</MenuItem>
          <MenuItem value="Quarterly">Quarterly</MenuItem>
        </Select>
      </Box>

      {/* Table Section */}
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }} aria-label="memberships table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#002855', fontWeight: 600, borderBottom: 'none' }}>Member Name</TableCell>
              <TableCell sx={{ color: '#002855', fontWeight: 600, borderBottom: 'none' }}>Apartment</TableCell>
              <TableCell sx={{ color: '#002855', fontWeight: 600, borderBottom: 'none' }}>Plan</TableCell>
              <TableCell sx={{ color: '#002855', fontWeight: 600, borderBottom: 'none' }}>Start Date</TableCell>
              <TableCell sx={{ color: '#002855', fontWeight: 600, borderBottom: 'none' }}>End Date</TableCell>
              <TableCell sx={{ color: '#002855', fontWeight: 600, borderBottom: 'none' }}>Status</TableCell>
              <TableCell sx={{ color: '#002855', fontWeight: 600, borderBottom: 'none' }}>Upcoming</TableCell>
              <TableCell sx={{ color: '#002855', fontWeight: 600, borderBottom: 'none', textAlign: 'right' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockMemberships.map((row) => (
              <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row" sx={{ borderBottomColor: '#f0f0f0' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={row.avatar} sx={{ width: 32, height: 32 }} />
                    <Typography variant="body2" fontWeight="500" sx={{ color: '#002855' }}>{row.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                  <Typography variant="body2" sx={{ color: '#002855' }}>{row.apartment}</Typography>
                </TableCell>
                <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                  <Typography variant="body2" sx={{ color: '#002855' }}>{row.plan}</Typography>
                </TableCell>
                <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                  <Typography variant="body2" sx={{ color: '#002855' }}>{row.startDate}</Typography>
                </TableCell>
                <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                  <Typography variant="body2" sx={{ color: '#002855' }}>{row.endDate}</Typography>
                </TableCell>
                <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                  <StatusBadge status={row.status} variantType="text" />
                </TableCell>
                <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                  <Typography variant="body2" sx={{ color: '#002855' }}>{row.upcoming}</Typography>
                </TableCell>
                <TableCell align="right" sx={{ borderBottomColor: '#f0f0f0' }}>
                  <IconButton size="small" sx={{ color: 'text.secondary' }}>
                    <VisibilityOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" sx={{ color: 'text.secondary' }}>
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" sx={{ color: 'text.secondary' }}>
                    <MoreVertOutlinedIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Section */}
      <Box sx={{ mt: 2 }}>
        <Pagination 
          page={page} 
          totalResults={123} 
          rowsPerPage={rowsPerPage} 
          onPageChange={handlePageChange} 
          onRowsPerPageChange={handleRowsPerPageChange} 
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>

    </Box>
  );
}
