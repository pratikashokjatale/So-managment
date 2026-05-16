import { useState } from 'react';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, 
  Breadcrumbs, Link, Tabs, Tab, Avatar, Stack,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import Pagination from '../../components/Pagination';
import StatusBadge from '../../components/StatusBadge';
import Search from '@/components/Search';

const mockGuests = [
  { id: 1, name: 'Alice Walker', avatar: 'https://i.pravatar.cc/150?u=11', resident: 'John Doe', apartment: 'A-101', date: '16 May 2024', status: 'Checked In' },
  { id: 2, name: 'Bob Smith', avatar: 'https://i.pravatar.cc/150?u=12', resident: 'Jane Smith', apartment: 'B-202', date: '17 May 2024', status: 'Upcoming' },
  { id: 3, name: 'Charlie Brown', avatar: 'https://i.pravatar.cc/150?u=13', resident: 'Mike Johnson', apartment: 'C-303', date: '15 May 2024', status: 'Checked Out' },
];

const mockRequests = [
  { id: 1, name: 'David Miller', avatar: 'https://i.pravatar.cc/150?u=14', resident: 'Emily Davis', apartment: 'D-404', date: '18 May 2024', purpose: 'Family Visit', status: 'Pending' },
  { id: 2, name: 'Eva Green', avatar: 'https://i.pravatar.cc/150?u=15', resident: 'Robert Brown', apartment: 'E-505', date: '19 May 2024', purpose: 'Maintenance', status: 'Pending' },
];

export default function GetGuest() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Rejection Dialog State
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setPage(1);
  };

  const handlePageChange = (_event: any, value: number) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleRejectClick = (request: any) => {
    setSelectedRequest(request);
    setOpenRejectDialog(true);
  };

  const handleConfirmReject = () => {
    console.log(`Rejected ${selectedRequest.name} for: ${rejectReason}`);
    setOpenRejectDialog(false);
    setSelectedRequest(null);
    setRejectReason('');
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#ffffff', minHeight: '100vh', borderRadius: 2 }}>
      
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: '#002855' }}>
          Guest Management
        </Typography>
        <Breadcrumbs separator=">" aria-label="breadcrumb">
          <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
            Dashboard
          </Link>
          <Typography color="text.primary">Guests</Typography>
        </Breadcrumbs>
      </Box>

      {/* Tabs Section */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="guest tabs">
          <Tab label="All Guests" sx={{ textTransform: 'none', fontWeight: 600, fontSize: '1rem' }} />
          <Tab label="Guest Requests" sx={{ textTransform: 'none', fontWeight: 600, fontSize: '1rem' }} />
        </Tabs>
      </Box>

      {/* Search & Actions Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Search 
          placeholder={activeTab === 0 ? "Search guests..." : "Search requests..."} 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: { xs: '100%', md: 350 }, '& fieldset': { borderRadius: '12px' } }}
        />
        
        {activeTab === 0 && (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/guest/add')}
            sx={{ borderRadius: '12px', textTransform: 'none', px: 3, fontWeight: 600, bgcolor: '#0047b3', '&:hover': { bgcolor: '#003380' } }}
          >
            Add Guest
          </Button>
        )}
      </Box>

      {/* Table Section */}
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Guest Name</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Resident</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Apartment</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Date</TableCell>
              {activeTab === 1 && <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Purpose</TableCell>}
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, textAlign: 'right' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(activeTab === 0 ? mockGuests : mockRequests).map((row) => (
              <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar src={row.avatar} sx={{ width: 32, height: 32 }} />
                    <Typography variant="body2" fontWeight="600" color="#002855">{row.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                  <Typography variant="body2" color="#002855">{row.resident}</Typography>
                </TableCell>
                <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                  <Typography variant="body2" color="#002855">{row.apartment}</Typography>
                </TableCell>
                <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                  <Typography variant="body2" color="#002855">{row.date}</Typography>
                </TableCell>
                {activeTab === 1 && (
                  <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                    <Typography variant="body2" color="text.secondary">{(row as any).purpose}</Typography>
                  </TableCell>
                )}
                <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                  <StatusBadge status={row.status} variantType="text" />
                </TableCell>
                <TableCell align="right" sx={{ borderBottomColor: '#f0f0f0' }}>
                  {activeTab === 0 ? (
                    <IconButton size="small" sx={{ color: 'text.secondary' }}>
                      <VisibilityOutlinedIcon fontSize="small" />
                    </IconButton>
                  ) : (
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton size="small" sx={{ color: '#4caf50' }} title="Approve">
                        <CheckCircleOutlineIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#f44336' }} title="Reject" onClick={() => handleRejectClick(row)}>
                        <HighlightOffIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Rejection Dialog */}
      <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)} fullWidth maxWidth="sm" sx={{ '& .MuiPaper-root': { borderRadius: '16px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 700, color: '#002855' }}>Reject Guest Request</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            Are you sure you want to reject the request for <strong>{selectedRequest?.name}</strong>? Please provide a reason below.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for Rejection"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, px: 3 }}>
          <Button onClick={() => setOpenRejectDialog(false)} sx={{ color: 'text.secondary', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmReject} 
            variant="contained" 
            color="error"
            disabled={!rejectReason.trim()}
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, px: 3, boxShadow: 'none' }}
          >
            Confirm Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* Pagination Section */}
      <Box sx={{ mt: 3 }}>
        <Pagination 
          page={page} 
          totalResults={activeTab === 0 ? 150 : 25} 
          rowsPerPage={rowsPerPage} 
          onPageChange={handlePageChange} 
          onRowsPerPageChange={handleRowsPerPageChange} 
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>

    </Box>
  );
}
