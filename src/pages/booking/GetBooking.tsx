import { useState } from 'react';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, 
  Select, MenuItem, Breadcrumbs, Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import Pagination from '../../components/Pagination';
import StatusBadge from '../../components/StatusBadge';
import Search from '@/components/Search';

const mockBookings = [
  { id: 1, dateTime: '15 May, 10:00 AM', facility: 'Swimming Pool', name: 'John Doe', type: 'Resident', status: 'Confirmed', amount: '₹300' },
  { id: 2, dateTime: '15 May, 01:00 PM', facility: 'Gym', name: 'Jane Smith', type: 'Resident', status: 'Confirmed', amount: '₹150' },
  { id: 3, dateTime: '15 May, 03:00 PM', facility: 'Tennis Court', name: 'Mike Johnson', type: 'Resident', status: 'Pending', amount: '₹300' },
  { id: 4, dateTime: '15 May, 07:00 PM', facility: 'Badminton Court', name: 'Emily Davis', type: 'Resident', status: 'Confirmed', amount: '₹200' },
  { id: 5, dateTime: '15 May, 08:30 PM', facility: 'Home Theatre', name: 'Robert Brown', type: 'Resident', status: 'Confirmed', amount: '₹500' },
];

export default function GetBooking() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [facilityFilter, setFacilityFilter] = useState('All Facilities');
  const [statusFilter, setStatusFilter] = useState('All Status');

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
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: '#091542' }}>
          Bookings List
        </Typography>
        <Breadcrumbs separator=">" aria-label="breadcrumb">
          <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
            Dashboard
          </Link>
          <Typography color="text.primary">Bookings</Typography>
        </Breadcrumbs>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Search 
          placeholder="Search by name, facility..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: { xs: '100%', md: 350 }, '& fieldset': { borderRadius: '8px' } }}
        />
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="text" 
            startIcon={<CalendarMonthIcon />} 
            onClick={() => navigate('/booking/calendar')}
            sx={{ color: 'text.primary', fontWeight: 600, textTransform: 'none' }}
          >
            Calendar
          </Button>
          <Button 
            variant="text" 
            startIcon={<DownloadIcon />} 
            sx={{ color: 'text.primary', fontWeight: 600, textTransform: 'none' }}
          >
            Export
          </Button>
          {/* <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/booking/add')}
            sx={{ borderRadius: '8px', textTransform: 'none', px: 3, fontWeight: 600, boxShadow: 'none', bgcolor: '#0047b3', '&:hover': { bgcolor: '#003380' } }}
          >
            Add Booking
          </Button> */}
        </Box>
      </Box>

      {/* Filters Section */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Select value={facilityFilter} onChange={(e) => setFacilityFilter(e.target.value as string)} sx={filterSelectSx}>
          <MenuItem value="All Facilities">All Facilities</MenuItem>
          <MenuItem value="Swimming Pool">Swimming Pool</MenuItem>
          <MenuItem value="Gym">Gym</MenuItem>
          <MenuItem value="Tennis Court">Tennis Court</MenuItem>
          <MenuItem value="Badminton Court">Badminton Court</MenuItem>
          <MenuItem value="Home Theatre">Home Theatre</MenuItem>
        </Select>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as string)} sx={filterSelectSx}>
          <MenuItem value="All Status">All Status</MenuItem>
          <MenuItem value="Confirmed">Confirmed</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Cancelled">Cancelled</MenuItem>
        </Select>
      </Box>

      {/* Table Section */}
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }} aria-label="bookings table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#091542', fontWeight: 600, borderBottom: 'none' }}>Date & Time</TableCell>
              <TableCell sx={{ color: '#091542', fontWeight: 600, borderBottom: 'none' }}>Facility</TableCell>
              <TableCell sx={{ color: '#091542', fontWeight: 600, borderBottom: 'none' }}>Member/Guest</TableCell>
              <TableCell sx={{ color: '#091542', fontWeight: 600, borderBottom: 'none' }}>Type</TableCell>
              <TableCell sx={{ color: '#091542', fontWeight: 600, borderBottom: 'none' }}>Status</TableCell>
              <TableCell sx={{ color: '#091542', fontWeight: 600, borderBottom: 'none' }}>Amount</TableCell>
              <TableCell sx={{ color: '#091542', fontWeight: 600, borderBottom: 'none', textAlign: 'right' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockBookings.map((row) => (
              <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                  <Typography variant="body2" sx={{ color: '#091542', fontWeight: 500 }}>{row.dateTime}</Typography>
                </TableCell>
                <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                  <Typography variant="body2" sx={{ color: '#091542' }}>{row.facility}</Typography>
                </TableCell>
                <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                  <Typography variant="body2" sx={{ color: '#091542', fontWeight: 500 }}>{row.name}</Typography>
                </TableCell>
                <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                  <Typography variant="body2" sx={{ color: '#091542' }}>{row.type}</Typography>
                </TableCell>
                <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                  <StatusBadge status={row.status} variantType="text" />
                </TableCell>
                <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                  <Typography variant="body2" sx={{ color: '#091542', fontWeight: 500 }}>{row.amount}</Typography>
                </TableCell>
                <TableCell align="right" sx={{ borderBottomColor: '#f0f0f0' }}>
                  <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={() => navigate(`/booking/${row.id}`)}>
                    <VisibilityOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={() => navigate(`/booking/edit/${row.id}`)}>
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    sx={{ color: 'text.secondary' }} 
                    onClick={() => navigate('/booking/calendar')}
                  >
                    <CalendarMonthIcon fontSize="small" />
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
          totalResults={500} 
          rowsPerPage={rowsPerPage} 
          onPageChange={handlePageChange} 
          onRowsPerPageChange={handleRowsPerPageChange} 
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>

    </Box>
  );
}
