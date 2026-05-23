import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, 
  Select, MenuItem, Avatar, Stack, Switch, Paper, Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Pagination from '../../components/Pagination';
import Search from '@/components/Search';
import { getStaffList, toggleStaffStatus, deleteStaff } from '@/utils/staffStore';
import type { Staff } from '@/utils/staffStore';
import { getStaffListApi, updateStaffApi, deleteStaffApi } from '@/apis/staff';

const mapBackendStaffToFrontend = (s: any) => {
  let dept = s.department || 'Other';
  if (dept === 'SECURITY') dept = 'Security';
  else if (dept === 'HOUSEKEEPING') dept = 'Housekeeping';
  else if (dept === 'MAINTENANCE') dept = 'Maintenance';
  else if (dept === 'ADMINISTRATION') dept = 'Front Office';
  else if (dept === 'SUPPORT') dept = 'Front Office';
  else if (dept === 'FACILITY') dept = 'Maintenance';
  else if (dept === 'OTHER') dept = 'Other';

  let status = 'Inactive';
  if (s.status === 'ACTIVE') status = 'Active';

  return {
    id: s.id,
    name: s.name,
    avatar: s.profilePhotoUrl || s.avatar || `https://i.pravatar.cc/150?u=${s.id}`,
    department: dept,
    phone: s.phone || '',
    email: s.email || '',
    cardNo: s.employeeCode || s.iCardNumber || s.cardNo || '',
    status: status as 'Active' | 'Inactive',
    joiningDate: s.joiningDate || '',
    address: s.address || '',
    emergencyContact: s.emergencyContactPhone || s.emergencyContact || '',
    facilityId: s.facilityId || '',
    facilityName: s.facility ? s.facility.name : (s.facilityName || 'General Duty')
  };
};

export default function GetStaff() {
  const navigate = useNavigate();
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const fetchStaff = async () => {
    try {
      const res = await getStaffListApi({ limit: 100 });
      const list = res?.data?.staff || res?.data?.items || res?.staff || (Array.isArray(res?.data) ? res.data : null);
      if (Array.isArray(list)) {
        setStaffList(list.map(mapBackendStaffToFrontend));
      } else {
        setStaffList(getStaffList());
      }
    } catch (err) {
      console.warn("Failed to fetch staff list via API, falling back:", err);
      setStaffList(getStaffList());
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handlePageChange = (_event: any, value: number) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleStatusToggle = async (id: string) => {
    const staff = staffList.find(s => s.id === id);
    if (!staff) return;
    const isCurrentlyActive = staff.status === 'Active';
    const newStatus = isCurrentlyActive ? 'INACTIVE' : 'ACTIVE';

    try {
      await updateStaffApi(id, { status: newStatus });
      fetchStaff();
    } catch (err) {
      console.warn("Failed to toggle staff status via API, falling back:", err);
      const updated = toggleStaffStatus(id);
      setStaffList(prev => prev.map(s => s.id === id ? updated : s));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStaffApi(id);
      fetchStaff();
    } catch (err) {
      console.warn("Failed to delete staff member via API, falling back:", err);
      deleteStaff(id);
      const updated = getStaffList();
      setStaffList(updated);
    }
    
    const totalPages = Math.ceil(staffList.length / rowsPerPage);
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  };

  // Filter and Search Logic
  const filteredStaff = staffList.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          staff.phone.includes(searchQuery) ||
                          staff.cardNo.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDept = deptFilter === 'All Departments' || staff.department === deptFilter;
    const matchesStatus = statusFilter === 'All Status' || staff.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Pagination bounds
  const totalResults = filteredStaff.length;
  const paginatedStaff = filteredStaff.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const filterSelectSx = {
    height: 44,
    minWidth: 180,
    fontSize: '0.875rem',
    fontWeight: 700,
    color: '#002855',
    borderRadius: '16px',
    bgcolor: '#f8fafc',
    '.MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#002855' }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Header Section */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6 }}>
        <Box>
          <Typography variant="h3" fontWeight="900" color="#002855">Staff Management</Typography>
          <Typography variant="subtitle1" color="text.secondary" fontWeight="700">Manage estate crew, assigned facilities, and digital I-Cards</Typography>
        </Box>
        <Button 
          variant="contained" 
          onClick={() => navigate('/staff/add')}
          sx={{ borderRadius: '16px', px: 4, py: 1.5, fontWeight: 900, bgcolor: '#002855' }}
        >
          Add Staff Member
        </Button>
      </Stack>

      {/* Filters Section */}
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: '24px', mb: 4, bgcolor: 'white' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
            <Select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value as string)} sx={filterSelectSx}>
              <MenuItem value="All Departments">All Departments</MenuItem>
              <MenuItem value="Security">Security</MenuItem>
              <MenuItem value="Housekeeping">Housekeeping</MenuItem>
              <MenuItem value="Maintenance">Maintenance</MenuItem>
              <MenuItem value="Front Office">Front Office</MenuItem>
              <MenuItem value="Fitness & Gym Training">Fitness & Gym Training</MenuItem>
              <MenuItem value="Pool Operations">Pool Operations</MenuItem>
              <MenuItem value="Wellness & Spa">Wellness & Spa</MenuItem>
              <MenuItem value="Park & Gardens">Park & Gardens</MenuItem>
            </Select>

            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as string)} sx={filterSelectSx}>
              <MenuItem value="All Status">All Status</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>

            <Search 
              placeholder="Search by name, phone or card..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              sx={{ width: { xs: '100%', sm: 320 }, '& fieldset': { borderRadius: '16px', borderColor: '#e2e8f0' } }}
            />
          </Stack>
        </Stack>
      </Paper>

      {/* Table Section */}
      <Paper elevation={0} sx={{ borderRadius: '32px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 900 }} aria-label="staff table">
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, py: 3, pl: 4 }}>STAFF IDENTITY</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>DEPARTMENT</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>DUTY LOCATION / FACILITY</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>PHONE NUMBER</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>CARD NUMBER</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>ACTIVE STATUS</TableCell>
                <TableCell sx={{ fontWeight: 800 }} align="right">ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ bgcolor: 'white' }}>
              {paginatedStaff.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell sx={{ py: 2.5, pl: 4 }}>
                    <Stack direction="row" spacing={2} alignItems="center" onClick={() => navigate(`/staff/${row.id}`)} sx={{ cursor: 'pointer' }}>
                      <Avatar src={row.avatar} sx={{ width: 44, height: 44, border: '2px solid #f1f5f9' }} />
                      <Typography variant="body1" fontWeight="800" color="#002855" sx={{ '&:hover': { color: '#1d4ed8' } }}>
                        {row.name}
                      </Typography>
                    </Stack>
                  </TableCell>
                  
                  <TableCell>
                    <Chip label={row.department} size="small" sx={{ fontWeight: 900, borderRadius: '8px', bgcolor: '#eff6ff', color: '#1d4ed8' }} />
                  </TableCell>

                  <TableCell>
                    <Chip label={row.facilityName} size="small" sx={{ fontWeight: 900, borderRadius: '8px', bgcolor: '#f0fdf4', color: '#16a34a' }} />
                  </TableCell>

                  <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>
                    {row.phone}
                  </TableCell>

                  <TableCell sx={{ fontWeight: 800, color: '#002855' }}>
                    {row.cardNo}
                  </TableCell>

                  <TableCell>
                    <Switch 
                      checked={row.status === 'Active'} 
                      onChange={() => handleStatusToggle(row.id)}
                      size="small"
                      color="success"
                    />
                  </TableCell>

                  <TableCell align="right" sx={{ pr: 4 }}>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton size="small" sx={{ color: '#0284c7' }} onClick={() => navigate(`/staff/${row.id}`)}>
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#002855' }} onClick={() => navigate(`/staff/edit/${row.id}`)}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#f44336' }} onClick={() => handleDelete(row.id)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}

              {paginatedStaff.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <Typography variant="body1" color="text.secondary" fontWeight="700">No staff members found matching the active criteria.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Spaced Pagination Wrapper */}
        <Box sx={{ px: 4, py: 1.5, borderTop: '1px solid #e2e8f0' }}>
          <Pagination 
            page={page} 
            totalResults={totalResults} 
            rowsPerPage={rowsPerPage} 
            onPageChange={handlePageChange} 
            onRowsPerPageChange={handleRowsPerPageChange} 
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Box>
      </Paper>

    </Box>
  );
}
