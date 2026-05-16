import { useState } from 'react';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, 
  Select, MenuItem, Breadcrumbs, Link, Avatar, Stack, Switch
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import Pagination from '../../components/Pagination';

import Search from '@/components/Search';

const mockStaff = [
  { id: 1, name: 'Sumanth Kumar', avatar: 'https://i.pravatar.cc/150?u=21', department: 'Security', phone: '9876500001', cardNo: 'CM21001', status: 'Active' },
  { id: 2, name: 'Suresh Yadav', avatar: 'https://i.pravatar.cc/150?u=22', department: 'Housekeeping', phone: '9876500002', cardNo: 'CM21002', status: 'Active' },
  { id: 3, name: 'Amit Singh', avatar: 'https://i.pravatar.cc/150?u=23', department: 'Maintenance', phone: '9876500003', cardNo: 'CM21003', status: 'Active' },
  { id: 4, name: 'Vikram Patel', avatar: 'https://i.pravatar.cc/150?u=24', department: 'Front Office', phone: '9876500004', cardNo: 'CM21004', status: 'Inactive' },
  { id: 5, name: 'Deepak Sharma', avatar: 'https://i.pravatar.cc/150?u=25', department: 'Security', phone: '9876500005', cardNo: 'CM21005', status: 'Active' },
];

export default function GetStaff() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [deptFilter, setDeptFilter] = useState('All Departments');
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
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: '#002855' }}>
          Staff Management
        </Typography>
        <Breadcrumbs separator=">" aria-label="breadcrumb">
          <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
            Dashboard
          </Link>
          <Typography color="text.primary">Staff</Typography>
        </Breadcrumbs>
      </Box>

      {/* Filters Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value as string)} sx={filterSelectSx}>
            <MenuItem value="All Departments">All Departments</MenuItem>
            <MenuItem value="Security">Security</MenuItem>
            <MenuItem value="Housekeeping">Housekeeping</MenuItem>
            <MenuItem value="Maintenance">Maintenance</MenuItem>
            <MenuItem value="Front Office">Front Office</MenuItem>
          </Select>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as string)} sx={filterSelectSx}>
            <MenuItem value="All Status">All Status</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
          <Search 
            placeholder="Search staff by name, phone..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: { xs: '100%', md: 300 }, '& fieldset': { borderRadius: '10px' } }}
          />
        </Box>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/staff/add')}
          sx={{ borderRadius: '10px', textTransform: 'none', px: 3, fontWeight: 600, bgcolor: '#0047b3', '&:hover': { bgcolor: '#003380' }, boxShadow: 'none' }}
        >
          Add Staff
        </Button>
      </Box>

      {/* Table Section */}
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 900 }} aria-label="staff table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Department</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Phone</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Card No.</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, textAlign: 'right' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockStaff.map((row) => (
              <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{ borderBottomColor: '#f0f0f0', py: 2 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar src={row.avatar} sx={{ width: 40, height: 40 }} />
                    <Typography variant="body2" sx={{ color: '#002855', fontWeight: 600 }}>{row.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>{row.department}</Typography>
                </TableCell>
                <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                  <Typography variant="body2" sx={{ color: '#002855', fontWeight: 500 }}>{row.phone}</Typography>
                </TableCell>
                <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                  <Typography variant="body2" sx={{ color: '#002855' }}>{row.cardNo}</Typography>
                </TableCell>
                <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                  <Switch 
                    checked={row.status === 'Active'} 
                    size="small"
                    color="success"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#4caf50',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#4caf50',
                      },
                    }}
                  />
                </TableCell>
                <TableCell align="right" sx={{ borderBottomColor: '#f0f0f0' }}>
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={() => navigate(`/staff/${row.id}`)}>
                      <VisibilityOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={() => navigate(`/staff/edit/${row.id}`)}>
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
          totalResults={38} 
          rowsPerPage={rowsPerPage} 
          onPageChange={handlePageChange} 
          onRowsPerPageChange={handleRowsPerPageChange} 
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>

    </Box>
  );
}
