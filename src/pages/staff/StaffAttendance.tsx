import { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Chip, Stack, Avatar, IconButton, TextField, InputAdornment, 
  CircularProgress, Grid, type SelectChangeEvent, Dialog, DialogTitle, DialogContent, DialogActions,
  Button
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Timer as TimerIcon,
  AccessTime as AccessTimeIcon,
  Coffee as BreakIcon,
  ExitToApp as LogoutIcon,
  Login as LoginIcon,
  RadioButtonChecked as DotIcon,
  WorkOutline as ShiftIcon
} from '@mui/icons-material';
import Pagination from '../../components/Pagination';

import { getAttendanceListApi } from '@/apis/attendance';
import { getFileUrl } from '@/utils/file';

interface AttendanceRecord {
  id: any;
  name: string;
  role: string;
  shift: string;
  checkIn: string;
  checkOut: string;
  status: 'Present' | 'Late' | 'Absent' | 'On Break';
  avatar: string;
  rawLog?: any;
}


interface LogEntry {
  checkInTime: string;
  checkInStatus: string;
  checkInTerminal: string;
  breakTime: string;
  breakDuration: string;
  breakTerminal: string;
  checkOutTime: string;
  checkOutStatus: string;
  checkOutTerminal: string;
}

// Pre-seeded high-fidelity access logs for each staff member
const ATTENDANCE_TIMELINES: Record<any, LogEntry> = {
  1: { checkInTime: '08:02 AM', checkInStatus: 'Checked In (On Time)', checkInTerminal: 'Main Entrance Gate A', breakTime: '01:00 PM - 01:45 PM', breakDuration: '45 mins (Lunch Break)', breakTerminal: 'Clubhouse Cafeteria', checkOutTime: 'Active', checkOutStatus: 'Still On Duty / Shift Active', checkOutTerminal: '-' },
  2: { checkInTime: '09:15 AM', checkInStatus: 'Checked In (15 Mins Late)', checkInTerminal: 'Service Gate Entrance B', breakTime: '02:00 PM - 02:30 PM', breakDuration: '30 mins (Tea Break)', breakTerminal: 'Staff Lounge Area', checkOutTime: 'Active', checkOutStatus: 'Still On Duty / Shift Active', checkOutTerminal: '-' },
  3: { checkInTime: '-', checkInStatus: 'No Log Registered', checkInTerminal: '-', breakTime: '-', breakDuration: '-', breakTerminal: '-', checkOutTime: '-', checkOutStatus: 'Absent / Not Checked In', checkOutTerminal: '-' },
  4: { checkInTime: '08:00 PM (Yesterday)', checkInStatus: 'Checked In (Shift Started)', checkInTerminal: 'Main Entrance Gate A', breakTime: '01:00 AM - 01:45 AM', breakDuration: '45 mins (Midnight Break)', breakTerminal: 'Security Room B Lounge', checkOutTime: '08:00 AM (Today)', checkOutStatus: 'Checked Out (Shift Completed)', checkOutTerminal: 'Main Entrance Gate A' },
  5: { checkInTime: '08:55 AM', checkInStatus: 'Checked In (On Time)', checkInTerminal: 'East Gardens Entrance C', breakTime: '12:30 PM - 01:15 PM', breakDuration: '45 mins (Lunch Break)', breakTerminal: 'Nursery Break Room', checkOutTime: 'Active', checkOutStatus: 'Still On Duty / Shift Active', checkOutTerminal: '-' },
  6: { checkInTime: '09:05 AM', checkInStatus: 'Checked In (5 Mins Late)', checkInTerminal: 'Main Reception Desk Lobby', breakTime: '01:00 PM - 01:45 PM', breakDuration: '45 mins (Lunch Break)', breakTerminal: 'Lobby Cafe Lounge', checkOutTime: 'Active', checkOutStatus: 'Still On Duty / Shift Active', checkOutTerminal: '-' },
  7: { checkInTime: '-', checkInStatus: 'No Log Registered', checkInTerminal: '-', breakTime: '-', breakDuration: '-', breakTerminal: '-', checkOutTime: '-', checkOutStatus: 'Absent / Not Checked In', checkOutTerminal: '-' },
  8: { checkInTime: '08:50 AM', checkInStatus: 'Checked In (On Time)', checkInTerminal: 'Admin Office Entrance', breakTime: '01:00 PM - 02:00 PM', breakDuration: '60 mins (Lunch Break)', breakTerminal: 'Central Food Court', checkOutTime: 'Active', checkOutStatus: 'Still On Duty / Shift Active', checkOutTerminal: '-' },
  9: { checkInTime: '09:30 AM', checkInStatus: 'Checked In (30 Mins Late)', checkInTerminal: 'Service Gate Entrance B', breakTime: '02:00 PM - 02:30 PM', breakDuration: '30 mins (Tea Break)', breakTerminal: 'Staff Lounge Area', checkOutTime: 'Active', checkOutStatus: 'Still On Duty / Shift Active', checkOutTerminal: '-' },
  10: { checkInTime: '09:00 AM', checkInStatus: 'Checked In (On Time)', checkInTerminal: 'Service Gate Entrance B', breakTime: '01:30 PM - 02:15 PM', breakDuration: '45 mins (Lunch Break)', breakTerminal: 'Central Food Court', checkOutTime: 'Active', checkOutStatus: 'Still On Duty / Shift Active', checkOutTerminal: '-' }
};

interface StatCardProps {
  label: string;
  value: number;
  total: number;
  color: string;
}

const StatCard = ({ label, value, total, color }: StatCardProps) => {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
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
            <Typography variant="caption" fontWeight="950" color="text.primary">{percentage}%</Typography>
          </Box>
        </Box>
        <Box>
          <Typography variant="subtitle2" fontWeight="700" color="#64748b">{label}</Typography>
          <Typography variant="h5" fontWeight="900" color="#091542">{value}</Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

const mapBackendAttendanceToFrontend = (a: any) => {
  const checkIn = a.checkInAt ? new Date(a.checkInAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-';
  const checkOut = a.checkOutAt ? new Date(a.checkOutAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-';
  
  let status: 'Present' | 'Late' | 'Absent' | 'On Break' = 'Absent';
  if (a.status === 'PRESENT') status = 'Present';
  else if (a.status === 'LATE') status = 'Late';
  else if (a.status === 'ABSENT') status = 'Absent';
  else if (a.status === 'HALF_DAY') status = 'Late';

  let dept = a.staff?.department || 'Staff';
  if (dept === 'SECURITY') dept = 'Security Guard';
  else if (dept === 'HOUSEKEEPING') dept = 'Housekeeping';
  else if (dept === 'MAINTENANCE') dept = 'Maintenance Crew';
  else if (dept === 'ADMINISTRATION') dept = 'Receptionist';

  return {
    id: a.id,
    name: a.staff?.name || 'Unknown Crew',
    role: a.staff?.designation || dept,
    shift: a.staff?.shiftStart ? `${a.staff.shiftStart} - ${a.staff.shiftEnd}` : 'General (9 AM - 6 PM)',
    checkIn,
    checkOut,
    status,
    avatar: a.staff?.photoUrl || a.staff?.profilePhotoUrl || a.staff?.avatar || "",
    rawLog: a
  };
};

export default function StaffAttendance() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  // Dialog State (View-Only Log Timeline)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

  const fetchAttendance = async () => {
    try {
      const res = await getAttendanceListApi({ limit: rowsPerPage, page, search: searchTerm });
      const list = res?.data?.attendance || res?.data?.items || res?.attendance || (Array.isArray(res?.data) ? res.data : null);
      if (Array.isArray(list)) {
        setAttendance(list.map(mapBackendAttendanceToFrontend));
      } else {
        setAttendance([]);
      }
      const pagination = res?.data?.pagination || res?.pagination;
      setTotalResults(pagination?.total || (Array.isArray(list) ? list.length : 0));
    } catch (err) {
      console.warn("Failed to fetch attendance logs via API:", err);
      setAttendance([]);
      setTotalResults(0);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [page, rowsPerPage, searchTerm]);

  const handleOpenDialog = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedRecord(null);
  };

  const filteredAttendance = attendance;
  const paginatedAttendance = attendance;

  const handlePageChange = (_: any, newPage: number) => setPage(newPage);
  
  const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
    setRowsPerPage(event.target.value as number);
    setPage(1);
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'Present': return <Chip icon={<CheckIcon sx={{ fontSize: '16px !important' }} />} label="Present" size="small" sx={{ bgcolor: '#f0fdf4', color: '#10b981', fontWeight: 900, border: '1px solid #dcfce7' }} />;
      case 'Late': return <Chip icon={<TimerIcon sx={{ fontSize: '16px !important' }} />} label="Late" size="small" sx={{ bgcolor: '#fffbeb', color: '#f59e0b', fontWeight: 900, border: '1px solid #fef3c7' }} />;
      case 'Absent': return <Chip icon={<CancelIcon sx={{ fontSize: '16px !important' }} />} label="Absent" size="small" sx={{ bgcolor: '#fef2f2', color: '#ef4444', fontWeight: 900, border: '1px solid #fee2e2' }} />;
      case 'On Break': return <Chip icon={<BreakIcon sx={{ fontSize: '16px !important' }} />} label="On Break" size="small" sx={{ bgcolor: '#eff6ff', color: '#3b82f6', fontWeight: 900, border: '1px solid #dbeafe' }} />;
      default: return null;
    }
  };

  // Statistics
  const totalCount = attendance.length;
  const presentCount = attendance.filter(a => a.status === 'Present' || a.status === 'Late' || a.status === 'On Break').length;
  const absentCount = attendance.filter(a => a.status === 'Absent').length;
  const onTimeCount = attendance.filter(a => a.status === 'Present').length;
  const lateCount = attendance.filter(a => a.status === 'Late').length;

  // Resolve current active log
  const activeLog: LogEntry = selectedRecord ? (selectedRecord.rawLog ? {
    checkInTime: selectedRecord.checkIn,
    checkInStatus: selectedRecord.rawLog.status === 'LATE' ? 'Checked In (Late)' : 'Checked In (On Time)',
    checkInTerminal: selectedRecord.rawLog.accessZone || 'Main Gate Terminal',
    breakTime: '-',
    breakDuration: '-',
    breakTerminal: '-',
    checkOutTime: selectedRecord.checkOut === '-' ? 'Active' : selectedRecord.checkOut,
    checkOutStatus: selectedRecord.checkOut === '-' ? 'Still On Duty / Shift Active' : 'Checked Out (Shift Completed)',
    checkOutTerminal: selectedRecord.checkOut === '-' ? '-' : 'Main Exit Terminal'
  } : (ATTENDANCE_TIMELINES[selectedRecord.id] || {
    checkInTime: '-',
    checkInStatus: 'No Log Found',
    checkInTerminal: '-',
    breakTime: '-',
    breakDuration: '-',
    breakTerminal: '-',
    checkOutTime: '-',
    checkOutStatus: 'Absent',
    checkOutTerminal: '-'
  })) : {
    checkInTime: '-',
    checkInStatus: '-',
    checkInTerminal: '-',
    breakTime: '-',
    breakDuration: '-',
    breakTerminal: '-',
    checkOutTime: '-',
    checkOutStatus: '-',
    checkOutTerminal: '-'
  };

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Header section */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h3" fontWeight="900" color="#091542">Staff Attendance</Typography>
          <Typography variant="subtitle1" color="text.secondary" fontWeight="700">Real-time Clubhouse crew duty tracking & activity timeline logs</Typography>
        </Box>
        <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
          <TextField 
            size="small"
            placeholder="Search directory by crew..."
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
            sx={{ width: { xs: '100%', md: 350 }, '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: 'white' } }}
          />
          <IconButton sx={{ bgcolor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <FilterIcon />
          </IconButton>
        </Stack>
      </Stack>

      {/* Stats cards */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatCard label="Present Today" value={presentCount} total={totalCount} color="#3b82f6" /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatCard label="Absent" value={absentCount} total={totalCount} color="#ef4444" /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatCard label="On Time" value={onTimeCount} total={presentCount} color="#10b981" /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatCard label="Late Arrivals" value={lateCount} total={presentCount} color="#f59e0b" /></Grid>
      </Grid>

      {/* Main Table */}
      <Paper elevation={0} sx={{ borderRadius: '32px', border: '1px solid #e2e8f0', overflow: 'hidden', bgcolor: 'white' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, py: 3, pl: 4 }}>STAFF MEMBER</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>ROLE & DEPARTMENT</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>ASSIGNED SHIFT</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>CHECK-IN TIME</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>CHECK-OUT TIME</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>STATUS</TableCell>
                <TableCell sx={{ fontWeight: 800 }} align="right">DUTY ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedAttendance.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell sx={{ py: 2.5, pl: 4 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={getFileUrl(row.avatar)} sx={{ width: 44, height: 44, border: '2px solid #f1f5f9' }} />
                      <Box>
                        <Typography variant="body1" fontWeight="800" color="#091542">{row.name}</Typography>
                        <Typography variant="caption" color="#64748b" fontWeight="800">Emp ID: #CM-{row.id}00</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2" fontWeight="700" color="#1e293b">{row.role}</Typography>
                  </TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <AccessTimeIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                      <Typography variant="body2" fontWeight="700" color="#64748b">{row.shift}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" fontWeight="900" color={row.checkIn === '-' ? '#cbd5e1' : '#091542'}>
                      {row.checkIn}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" fontWeight="900" color={row.checkOut === '-' ? '#cbd5e1' : '#091542'}>
                      {row.checkOut}
                    </Typography>
                  </TableCell>

                  <TableCell>{getStatusChip(row.status)}</TableCell>

                  <TableCell align="right" sx={{ pr: 4 }}>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      startIcon={<AccessTimeIcon />}
                      onClick={() => handleOpenDialog(row)}
                      sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 900, borderColor: '#e2e8f0', color: '#091542', '&:hover': { bgcolor: '#f8fafc' } }}
                    >
                      View Logs
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {filteredAttendance.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <Typography variant="body1" color="text.secondary" fontWeight="700">No logs found matching search criteria.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ px: 4, py: 1.5, borderTop: '1px solid #e2e8f0' }}>
          <Pagination
            page={page}
            totalResults={totalResults}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[10, 25, 50]}
          />
        </Box>
      </Paper>

      {/* Premium Read-Only Timeline & Log Panel Dialog Popup */}
      <Dialog 
        open={isDialogOpen} 
        onClose={handleCloseDialog}
        PaperProps={{
          sx: { borderRadius: '28px', p: 1, maxWidth: 540, width: '100%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.12)' }
        }}
      >
        <DialogTitle sx={{ pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {selectedRecord && getStatusChip(selectedRecord.status)}
        </DialogTitle>

        <DialogContent sx={{ py: 2 }}>
          <Stack spacing={3}>
            
            {/* Header Profile Badge */}
            {selectedRecord && (
              <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={getFileUrl(selectedRecord.avatar)} sx={{ width: 56, height: 56, border: '2px solid white', boxShadow: '0 8px 16px rgba(0,0,0,0.06)' }} />
                <Box>
                  <Typography variant="h5" fontWeight="900" color="#091542">{selectedRecord.name}</Typography>
                  <Typography variant="body2" fontWeight="700" color="#64748b">{selectedRecord.role}</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                    <ShiftIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                    <Typography variant="caption" color="text.secondary" fontWeight="800">
                      {selectedRecord.shift}
                    </Typography>
                  </Stack>
                </Box>
              </Paper>
            )}

            {/* Immersive Vertical Activity Timeline */}
            <Box sx={{ pl: 1, pr: 1, py: 1 }}>
              
              {/* Step 1: Check-in */}
              <Box sx={{ display: 'flex', gap: 3, position: 'relative', pb: 4 }}>
                {/* Connecting Line */}
                <Box sx={{ 
                  position: 'absolute', 
                  left: 15, 
                  top: 32, 
                  bottom: 0, 
                  width: 2, 
                  bgcolor: activeLog.checkInTime !== '-' ? '#10b981' : '#e2e8f0', 
                  borderStyle: activeLog.checkInTime !== '-' ? 'solid' : 'dashed' 
                }} />
                
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                  <Box sx={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: '50%', 
                    bgcolor: activeLog.checkInTime !== '-' ? '#f0fdf4' : '#f1f5f9', 
                    border: `2px solid ${activeLog.checkInTime !== '-' ? '#10b981' : '#cbd5e1'}`, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <LoginIcon sx={{ fontSize: 16, color: activeLog.checkInTime !== '-' ? '#10b981' : '#94a3b8' }} />
                  </Box>
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight="900" color="#091542" sx={{ letterSpacing: 0.5 }}>1. ACCESS CHECK-IN</Typography>
                  {activeLog.checkInTime !== '-' ? (
                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="body2" fontWeight="800" color="#1e293b">
                        Checked In at <span style={{ color: '#10b981' }}>{activeLog.checkInTime}</span>
                      </Typography>
                      <Typography variant="caption" fontWeight="700" color="#64748b" display="block">
                        Status: {activeLog.checkInStatus}
                      </Typography>
                      <Typography variant="caption" fontWeight="700" color="#94a3b8" display="block">
                        Terminal Device: {activeLog.checkInTerminal}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" fontWeight="700" color="#94a3b8" sx={{ mt: 0.5 }}>
                      No check-in record registered today
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Step 2: Break Times */}
              <Box sx={{ display: 'flex', gap: 3, position: 'relative', pb: 4 }}>
                {/* Connecting Line */}
                <Box sx={{ 
                  position: 'absolute', 
                  left: 15, 
                  top: 32, 
                  bottom: 0, 
                  width: 2, 
                  bgcolor: activeLog.breakTime !== '-' ? '#f59e0b' : '#e2e8f0', 
                  borderStyle: activeLog.breakTime !== '-' ? 'solid' : 'dashed' 
                }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                  <Box sx={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: '50%', 
                    bgcolor: activeLog.breakTime !== '-' ? '#fffbeb' : '#f1f5f9', 
                    border: `2px solid ${activeLog.breakTime !== '-' ? '#f59e0b' : '#cbd5e1'}`, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <BreakIcon sx={{ fontSize: 16, color: activeLog.breakTime !== '-' ? '#f59e0b' : '#94a3b8' }} />
                  </Box>
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight="900" color="#091542" sx={{ letterSpacing: 0.5 }}>2. MEAL & SHIFT BREAKS</Typography>
                  {activeLog.breakTime !== '-' ? (
                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="body2" fontWeight="800" color="#1e293b">
                        Break Logged: <span style={{ color: '#ea580c' }}>{activeLog.breakTime}</span>
                      </Typography>
                      <Typography variant="caption" fontWeight="700" color="#64748b" display="block">
                        Duration: {activeLog.breakDuration}
                      </Typography>
                      <Typography variant="caption" fontWeight="700" color="#94a3b8" display="block">
                        Break Station: {activeLog.breakTerminal}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" fontWeight="700" color="#94a3b8" sx={{ mt: 0.5 }}>
                      No active break logged during this shift
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Step 3: Check-out */}
              <Box sx={{ display: 'flex', gap: 3, position: 'relative' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                  <Box sx={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: '50%', 
                    bgcolor: activeLog.checkOutTime !== '-' && activeLog.checkOutTime !== 'Active' ? '#fef2f2' : (activeLog.checkOutTime === 'Active' ? '#eff6ff' : '#f1f5f9'), 
                    border: `2px solid ${activeLog.checkOutTime !== '-' && activeLog.checkOutTime !== 'Active' ? '#ef4444' : (activeLog.checkOutTime === 'Active' ? '#3b82f6' : '#cbd5e1')}`, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    {activeLog.checkOutTime === 'Active' ? (
                      <DotIcon sx={{ fontSize: 16, color: '#3b82f6', animation: 'pulse 1.5s infinite' }} />
                    ) : (
                      <LogoutIcon sx={{ fontSize: 16, color: activeLog.checkOutTime !== '-' ? '#ef4444' : '#94a3b8' }} />
                    )}
                  </Box>
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight="900" color="#091542" sx={{ letterSpacing: 0.5 }}>3. ACCESS CHECK-OUT</Typography>
                  {activeLog.checkOutTime !== '-' ? (
                    <Box sx={{ mt: 0.5 }}>
                      {activeLog.checkOutTime === 'Active' ? (
                        <>
                          <Typography variant="body2" fontWeight="900" color="#3b82f6">
                            Shift Active & On Duty
                          </Typography>
                          <Typography variant="caption" fontWeight="700" color="#64748b" display="block">
                            Estimated Checkout: Shift End
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Typography variant="body2" fontWeight="800" color="#1e293b">
                            Checked Out at <span style={{ color: '#ef4444' }}>{activeLog.checkOutTime}</span>
                          </Typography>
                          <Typography variant="caption" fontWeight="700" color="#64748b" display="block">
                            Status: {activeLog.checkOutStatus}
                          </Typography>
                          <Typography variant="caption" fontWeight="700" color="#94a3b8" display="block">
                            Checkout Terminal: {activeLog.checkOutTerminal}
                          </Typography>
                        </>
                      )}
                    </Box>
                  ) : (
                    <Typography variant="body2" fontWeight="700" color="#94a3b8" sx={{ mt: 0.5 }}>
                      No checkout record registered yet
                    </Typography>
                  )}
                </Box>
              </Box>

            </Box>

          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleCloseDialog}
            variant="contained"
            sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 900, bgcolor: '#091542', px: 4, py: 1, boxShadow: 'none', '&:hover': { bgcolor: '#001a35' } }}
          >
            Close Logs
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
