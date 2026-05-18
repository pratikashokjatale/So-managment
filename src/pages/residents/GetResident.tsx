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
  { id: 1, name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=1', apartment: 'A-101', tower: 'Tower A', familyMembers: 4, phone: '9876543210', role: 'Master', cardColor: 'Blue', membership: 'Active', expiry: '2026-06-15', status: 'Active' },
  { id: 2, name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=2', apartment: 'A-101', tower: 'Tower A', familyMembers: 3, phone: '9876543211', role: 'Dependent', cardColor: 'Blue', membership: 'Active', expiry: '2026-06-15', status: 'Active' },
  { id: 3, name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?u=3', apartment: 'A-103', tower: 'Tower A', familyMembers: 2, phone: '9876543212', role: 'Master', cardColor: 'Blue', membership: 'Active', expiry: '2026-07-01', status: 'Active' },
  { id: 4, name: 'Emily Davis', avatar: 'https://i.pravatar.cc/150?u=4', apartment: 'A-104', tower: 'Tower A', familyMembers: 1, phone: '9876543213', role: 'Master', cardColor: 'White', membership: '7-Day Pass', expiry: '2026-05-20', status: 'Pending' },
  { id: 5, name: 'Robert Brown', avatar: 'https://i.pravatar.cc/150?u=5', apartment: 'A-105', tower: 'Tower A', familyMembers: 5, phone: '9876543214', role: 'Master', cardColor: 'Blue', membership: 'Active', expiry: '2026-08-10', status: 'Active' },
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

          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', p: 1, bgcolor: '#f8fafc', borderRadius: '12px' }}>
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
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: 'none' }}>Resident</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: 'none' }}>Tower</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: 'none' }}>Apartment</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: 'none' }}>Family Members</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: 'none' }}>Card Type</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: 'none' }}>Membership</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: 'none' }}>Expiry</TableCell>
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
                        <Box>
                          <Typography variant="body2" fontWeight="700">{row.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{row.phone}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                      <Typography variant="body2" fontWeight="600" color="#002855">{row.tower}</Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                      <Typography variant="body2" fontWeight="600">{row.apartment}</Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                      <Typography variant="body2" fontWeight="600" color="text.secondary" sx={{ pl: 2 }}>
                        {row.familyMembers}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: row.cardColor === 'Blue' ? '#1d4ed8' : '#e2e8f0', border: '1px solid #cbd5e1' }} />
                        <Typography variant="body2" fontWeight="600">{row.cardColor} Card</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                      <StatusBadge status={row.membership} variantType="text" />
                    </TableCell>
                    <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                      <Typography variant="body2" fontWeight="600" color="error.main">{row.expiry}</Typography>
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
                      <IconButton size="small" sx={{ color: 'primary.main', bgcolor: '#eff6ff', mr: 1 }} onClick={() => navigate(`/residents/${row.id}`)}>
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
