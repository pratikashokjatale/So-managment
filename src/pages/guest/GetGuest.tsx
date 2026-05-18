import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, 
  Breadcrumbs, Link, Tabs, Tab, Avatar, Stack,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Chip, Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import Pagination from '../../components/Pagination';
import StatusBadge from '../../components/StatusBadge';
import Search from '@/components/Search';
import { getGuests, approveGuestRequest, rejectGuestRequest } from '@/utils/guestStore';
import type { Guest } from '@/utils/guestStore';

export default function GetGuest() {
  const navigate = useNavigate();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Rejection Dialog State
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Guest | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Load guests dynamically
  const refreshGuests = () => {
    setGuests(getGuests());
  };

  useEffect(() => {
    refreshGuests();
  }, []);

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

  const handleApproveClick = (id: string) => {
    approveGuestRequest(id);
    refreshGuests();
  };

  const handleRejectClick = (guest: Guest) => {
    setSelectedRequest(guest);
    setOpenRejectDialog(true);
  };

  const handleConfirmReject = () => {
    if (selectedRequest) {
      rejectGuestRequest(selectedRequest.id, rejectReason);
      setOpenRejectDialog(false);
      setSelectedRequest(null);
      setRejectReason('');
      refreshGuests();
    }
  };

  // Filter based on Tab selection & search query
  const filteredRows = guests.filter((row) => {
    const matchesSearch = 
      row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.resident.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.apartment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.purpose.toLowerCase().includes(searchQuery.toLowerCase());

    const isRequest = row.status === 'Pending' || row.status === 'Rejected';
    return matchesSearch && (activeTab === 0 ? !isRequest : isRequest);
  });

  const paginatedRows = filteredRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

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
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Apartment</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Pass Validity</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>OTP Status</TableCell>
              {activeTab === 1 && <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Purpose</TableCell>}
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, textAlign: 'right' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={activeTab === 1 ? 7 : 6} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" color="text.secondary" fontWeight="600">
                    No guests found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedRows.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={row.avatar} sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: '#f1f5f9' }} />
                      <Box>
                        <Typography variant="body2" fontWeight="800" color="#002855">{row.name}</Typography>
                        <Typography variant="caption" color="text.secondary">Host: {row.resident}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                    <Typography variant="body2" fontWeight="700" color="#002855">
                      {row.apartment.split('•').slice(-1)[0]?.trim() || row.apartment}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                    <Chip 
                      label={row.validity || '7 Days Pass'} 
                      size="small" 
                      sx={{ 
                        borderRadius: '6px', 
                        fontWeight: 800, 
                        bgcolor: row.validity === 'Expired' ? '#fef2f2' : '#f0fdf4',
                        color: row.validity === 'Expired' ? '#ef4444' : '#10b981'
                      }} 
                    />
                  </TableCell>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                    <Typography variant="caption" fontWeight="700" color={row.otpStatus?.includes('Waiting') || row.otpStatus === 'Pending' ? 'warning.main' : row.otpStatus === 'Rejected' ? 'error.main' : 'success.main'}>
                      {row.otpStatus}
                    </Typography>
                  </TableCell>
                  {activeTab === 1 && (
                    <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                      <Typography variant="body2" color="text.secondary">{row.purpose}</Typography>
                    </TableCell>
                  )}
                  <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                    <StatusBadge status={row.status} variantType="text" />
                  </TableCell>
                  <TableCell align="right" sx={{ borderBottomColor: '#f0f0f0' }}>
                    {activeTab === 0 ? (
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="View Guest Details">
                          <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={() => navigate(`/guest/${row.id}`)}>
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Guest">
                          <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={() => navigate(`/guest/edit/${row.id}`)}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    ) : (
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="View Guest Details">
                          <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={() => navigate(`/guest/${row.id}`)}>
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {row.status === 'Pending' && (
                          <>
                            <Tooltip title="Approve Request">
                              <IconButton size="small" sx={{ color: '#4caf50' }} onClick={() => handleApproveClick(row.id)}>
                                <CheckCircleOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject Request">
                              <IconButton size="small" sx={{ color: '#f44336' }} onClick={() => handleRejectClick(row)}>
                                <HighlightOffIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Stack>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
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
      {filteredRows.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Pagination 
            page={page} 
            totalResults={filteredRows.length} 
            rowsPerPage={rowsPerPage} 
            onPageChange={handlePageChange} 
            onRowsPerPageChange={handleRowsPerPageChange} 
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Box>
      )}

    </Box>
  );
}
