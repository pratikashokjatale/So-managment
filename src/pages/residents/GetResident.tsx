import { useState } from 'react';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Avatar, IconButton, 
  Select, MenuItem, Breadcrumbs, Link, Switch,
  Tabs, Tab
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';

import Search from '../../components/Search';
import Pagination from '../../components/Pagination';
import StatusBadge from '../../components/StatusBadge';
import ResidentRequests from './components/ResidentRequests';

const mockResidents = [
  { id: 1, name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=1', apartment: 'A-101', phone: '9876543210', membership: 'Active', cardNo: 'CMR10101', status: 'Active' },
  { id: 2, name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=2', apartment: 'A-102', phone: '9876543211', membership: 'Active', cardNo: 'CMR10102', status: 'Active' },
  { id: 3, name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?u=3', apartment: 'A-103', phone: '9876543212', membership: 'Active', cardNo: 'CMR10103', status: 'Active' },
  { id: 4, name: 'Emily Davis', avatar: 'https://i.pravatar.cc/150?u=4', apartment: 'A-104', phone: '9876543213', membership: 'Pending', cardNo: 'CMR10104', status: 'Inactive' },
  { id: 5, name: 'Robert Brown', avatar: 'https://i.pravatar.cc/150?u=5', apartment: 'A-105', phone: '9876543214', membership: 'Active', cardNo: 'CMR10105', status: 'Active' },
  { id: 6, name: 'Michael Wilson', avatar: 'https://i.pravatar.cc/150?u=6', apartment: 'A-106', phone: '9876543215', membership: 'Active', cardNo: 'CMR10106', status: 'Active' },
  { id: 7, name: 'Sarah Taylor', avatar: 'https://i.pravatar.cc/150?u=7', apartment: 'A-107', phone: '9876543216', membership: 'Active', cardNo: 'CMR10107', status: 'Active' },
  { id: 8, name: 'David Anderson', avatar: 'https://i.pravatar.cc/150?u=8', apartment: 'A-108', phone: '9876543217', membership: 'Expired', cardNo: 'CMR10108', status: 'Blocked' },
];

export default function GetResident() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const [statusFilter, setStatusFilter] = useState('All Status');
  const [aptFilter, setAptFilter] = useState('All Apartments');
  const [membershipFilter, setMembershipFilter] = useState('All Memberships');
  const [cardFilter, setCardFilter] = useState('All Cards');
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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
    <Box sx={{ mt: 2, p: { xs: 2, md: 4 }, bgcolor: '#ffffff', minHeight: '100vh', borderRadius: '12px' }}>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: '#000' }}>
          Residents
        </Typography>
        <Breadcrumbs separator=">" aria-label="breadcrumb">
          <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
            Dashboard
          </Link>
          <Typography color="text.primary">Residents</Typography>
        </Breadcrumbs>
      </Box>

      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        sx={{ 
          mb: 4, 
          borderBottom: '1px solid #f1f5f9',
          '& .MuiTab-root': { textTransform: 'none', fontWeight: 800, fontSize: '0.95rem', minWidth: 120 },
          '& .Mui-selected': { color: '#0047b3 !important' },
          '& .MuiTabs-indicator': { backgroundColor: '#0047b3', height: 3 }
        }}
      >
        <Tab label="Active Residents" />
        <Tab label="Enrollment Requests" />
      </Tabs>

      {tabValue === 0 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Search 
              placeholder="Search by name, phone, apartment, card..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ width: { xs: '100%', md: 350 }, '& fieldset': { borderRadius: '8px' } }}
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="text" 
                startIcon={<DownloadIcon />} 
                sx={{ color: 'text.primary', fontWeight: 600, textTransform: 'none' }}
              >
                Export
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => navigate('/residents/add')}
                sx={{ borderRadius: '8px', textTransform: 'none', px: 3, fontWeight: 600, boxShadow: 'none' }}
              >
                Add Resident
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as string)} sx={filterSelectSx}>
              <MenuItem value="All Status">All Status</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
            <Select value={aptFilter} onChange={(e) => setAptFilter(e.target.value as string)} sx={filterSelectSx}>
              <MenuItem value="All Apartments">All Apartments</MenuItem>
            </Select>
            <Select value={membershipFilter} onChange={(e) => setMembershipFilter(e.target.value as string)} sx={filterSelectSx}>
              <MenuItem value="All Memberships">All Memberships</MenuItem>
            </Select>
            <Select value={cardFilter} onChange={(e) => setCardFilter(e.target.value as string)} sx={filterSelectSx}>
              <MenuItem value="All Cards">All Cards</MenuItem>
            </Select>
          </Box>

          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 800 }} aria-label="residents table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: 'none' }}>Name</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: 'none' }}>Apartment</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: 'none' }}>Phone</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: 'none' }}>Membership</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: 'none' }}>Card No.</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: 'none' }}>Status</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: 'none', textAlign: 'right' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockResidents.map((row) => (
                  <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row" sx={{ borderBottomColor: '#f0f0f0' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar src={row.avatar} sx={{ width: 32, height: 32 }} />
                        <Typography variant="body2" fontWeight="500">{row.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                      <Typography variant="body2" color="text.secondary">{row.apartment}</Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                      <Typography variant="body2" color="text.secondary">{row.phone}</Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                      <StatusBadge status={row.membership} variantType="text" />
                    </TableCell>
                    <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                      <Typography variant="body2" color="text.secondary">{row.cardNo}</Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                      <Switch 
                        checked={row.status.toLowerCase() === 'active'} 
                        size="small"
                        color="success"
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: '#4caf50' },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#4caf50' },
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ borderBottomColor: '#f0f0f0' }}>
                      <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={() => navigate(`/residents/${row.id}`)}>
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={() => navigate(`/residents/edit/${row.id}`)}>
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

          <Box sx={{ mt: 2 }}>
            <Pagination 
              page={page} 
              totalResults={210} 
              rowsPerPage={rowsPerPage} 
              onPageChange={handlePageChange} 
              onRowsPerPageChange={handleRowsPerPageChange} 
            />
          </Box>
        </>
      )}

      {tabValue === 1 && (
        <ResidentRequests />
      )}

    </Box>
  );
}
