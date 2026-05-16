import { useState } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Chip, Stack, Avatar, IconButton, TextField, InputAdornment, 
  CircularProgress, Grid, type SelectChangeEvent
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Timer as TimerIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import Pagination from '../../components/Pagination';

const mockAttendance = [
  { id: 1, name: 'Rahul Sharma', role: 'Security Guard', shift: 'Day Shift (8 AM - 8 PM)', checkIn: '08:02 AM', status: 'Present', avatar: 'https://i.pravatar.cc/150?u=rahul' },
  { id: 2, name: 'Priya Verma', role: 'Housekeeping', shift: 'General (9 AM - 6 PM)', checkIn: '09:15 AM', status: 'Late', avatar: 'https://i.pravatar.cc/150?u=priya' },
  { id: 3, name: 'Amit Singh', role: 'Plumber', shift: 'General (9 AM - 6 PM)', checkIn: '-', status: 'Absent', avatar: 'https://i.pravatar.cc/150?u=amit' },
  { id: 4, name: 'Sanjay Dutt', role: 'Electrician', shift: 'Night Shift (8 PM - 8 AM)', checkIn: '08:00 PM', status: 'Present', avatar: 'https://i.pravatar.cc/150?u=sanjay' },
  { id: 5, name: 'Vikram Seth', role: 'Gardener', shift: 'General (9 AM - 6 PM)', checkIn: '08:55 AM', status: 'Present', avatar: 'https://i.pravatar.cc/150?u=vikram' },
  { id: 6, name: 'Neha Kakkar', role: 'Receptionist', shift: 'General (9 AM - 6 PM)', checkIn: '09:05 AM', status: 'Late', avatar: 'https://i.pravatar.cc/150?u=neha' },
  { id: 7, name: 'Rajiv Mehra', role: 'Security Guard', shift: 'Night Shift (8 PM - 8 AM)', checkIn: '-', status: 'Absent', avatar: 'https://i.pravatar.cc/150?u=rajiv' },
  { id: 8, name: 'Anjali Gupta', role: 'Accountant', shift: 'General (9 AM - 6 PM)', checkIn: '08:50 AM', status: 'Present', avatar: 'https://i.pravatar.cc/150?u=anjali' },
  { id: 9, name: 'Suresh Raina', role: 'Electrician', shift: 'General (9 AM - 6 PM)', checkIn: '09:30 AM', status: 'Late', avatar: 'https://i.pravatar.cc/150?u=suresh' },
  { id: 10, name: 'Kunal Kapoor', role: 'Plumber', shift: 'General (9 AM - 6 PM)', checkIn: '09:00 AM', status: 'Present', avatar: 'https://i.pravatar.cc/150?u=kunal' },
];

interface StatCardProps {
  label: string;
  value: number;
  total: number;
  color: string;
}

const StatCard = ({ label, value, total, color }: StatCardProps) => {
  const percentage = Math.round((value / total) * 100);
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: '24px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
      <Stack direction="row" spacing={3} alignItems="center">
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress variant="determinate" value={100} size={60} thickness={4} sx={{ color: '#f1f5f9' }} />
          <CircularProgress 
            variant="determinate" 
            value={percentage} 
            size={60} 
            thickness={4} 
            sx={{ color: color, position: 'absolute', left: 0, strokeLinecap: 'round' }} 
          />
          <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="caption" fontWeight="900" color="text.primary">{percentage}%</Typography>
          </Box>
        </Box>
        <Box>
          <Typography variant="subtitle2" fontWeight="700" color="#64748b">{label}</Typography>
          <Typography variant="h5" fontWeight="900" color="#002855">{value}</Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default function StaffAttendance() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredAttendance = mockAttendance.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (_: any, newPage: number) => setPage(newPage);
  const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
    setRowsPerPage(event.target.value as number);
    setPage(1);
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'Present': return <Chip icon={<CheckIcon sx={{ fontSize: '16px !important' }} />} label="Present" size="small" sx={{ bgcolor: '#f0fdf4', color: '#10b981', fontWeight: 800, border: '1px solid #dcfce7' }} />;
      case 'Late': return <Chip icon={<TimerIcon sx={{ fontSize: '16px !important' }} />} label="Late" size="small" sx={{ bgcolor: '#fffbeb', color: '#f59e0b', fontWeight: 800, border: '1px solid #fef3c7' }} />;
      case 'Absent': return <Chip icon={<CancelIcon sx={{ fontSize: '16px !important' }} />} label="Absent" size="small" sx={{ bgcolor: '#fef2f2', color: '#ef4444', fontWeight: 800, border: '1px solid #fee2e2' }} />;
      default: return null;
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6 }}>
        <Box>
          <Typography variant="h3" fontWeight="900" color="#002855">Staff Attendance</Typography>
          <Typography variant="subtitle1" color="text.secondary" fontWeight="600">Strategic labor oversight & real-time analytics</Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <TextField 
            size="small"
            placeholder="Search directory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#64748b' }} />
                  </InputAdornment>
                ),
              }
            }}
            sx={{ width: 350, '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: 'white' } }}
          />
          <IconButton sx={{ bgcolor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <FilterIcon />
          </IconButton>
        </Stack>
      </Stack>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatCard label="Present Today" value={30} total={60} color="#3b82f6" /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatCard label="Absent" value={30} total={60} color="#ef4444" /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatCard label="On Time" value={22} total={30} color="#10b981" /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatCard label="Late" value={8} total={30} color="#f59e0b" /></Grid>
      </Grid>

      <Paper elevation={0} sx={{ borderRadius: '32px', border: '1px solid #e2e8f0', overflow: 'hidden', bgcolor: 'white', p: 4 }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, py: 3, pl: 2 }}>STAFF MEMBER</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>ROLE & DEPARTMENT</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>ASSIGNED SHIFT</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>CHECK-IN</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>STATUS</TableCell>
                <TableCell sx={{ fontWeight: 800 }} align="right">ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAttendance
                .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                .map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell sx={{ py: 2, pl: 2 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={row.avatar} sx={{ width: 48, height: 48, border: '2px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                      <Box>
                        <Typography variant="body1" fontWeight="800" color="#002855">{row.name}</Typography>
                        <Typography variant="caption" color="#64748b" fontWeight="700">Emp ID: #{row.id}442</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="700" color="#1e293b">{row.role}</Typography>
                    <Typography variant="caption" color="#94a3b8" fontWeight="800">OPERATIONS</Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <AccessTimeIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                      <Typography variant="body2" fontWeight="700" color="#64748b">{row.shift}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell><Typography variant="body2" fontWeight="900" color={row.checkIn === '-' ? '#cbd5e1' : '#002855'}>{row.checkIn}</Typography></TableCell>
                  <TableCell>{getStatusChip(row.status)}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" sx={{ color: '#64748b', bgcolor: '#f8fafc', borderRadius: '10px' }}>
                      <AccessTimeIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ mt: 3 }}>
          <Pagination 
            page={page} 
            totalResults={60} 
            rowsPerPage={rowsPerPage} 
            onPageChange={handlePageChange} 
            onRowsPerPageChange={handleRowsPerPageChange} 
          />
        </Box>
      </Paper>
    </Box>
  );
}
