import { useState, useEffect } from 'react';
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
import { getSubscriptionsApi } from '@/apis/subscription';
import MembershipDetailsDialog from './components/MembershipDetailsDialog';

export default function GetMembership() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [statusFilter, setStatusFilter] = useState('All Status');
  const [planFilter, setPlanFilter] = useState('All Plans');

  const [memberships, setMemberships] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState<any>(null);

  const handleOpenView = (membership: any) => {
    setSelectedMembership(membership);
    setViewDialogOpen(true);
  };

  const handleCloseView = () => {
    setViewDialogOpen(false);
    setSelectedMembership(null);
  };

  const fetchMemberships = async () => {
    setLoading(true);
    try {
      const res = await getSubscriptionsApi();
      let fetchedSubs: any[] = [];
      if (res?.success && res?.data) {
        if (Array.isArray(res.data)) {
          fetchedSubs = res.data;
        } else if (res.data.items && Array.isArray(res.data.items)) {
          fetchedSubs = res.data.items;
        } else if (typeof res.data === 'object') {
          const possibleArr = Object.values(res.data).find(val => Array.isArray(val));
          if (possibleArr) fetchedSubs = possibleArr as any[];
        }
      } else if (Array.isArray(res)) {
        fetchedSubs = res;
      } else if (res?.items && Array.isArray(res.items)) {
        fetchedSubs = res.items;
      }
      setMemberships(fetchedSubs);
    } catch (err) {
      console.error('Failed to load memberships:', err);
      setMemberships([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

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
              <TableCell sx={{ color: '#091542', fontWeight: 600, borderBottom: 'none' }}>Member Name</TableCell>
              <TableCell sx={{ color: '#091542', fontWeight: 600, borderBottom: 'none' }}>Apartment</TableCell>
              <TableCell sx={{ color: '#091542', fontWeight: 600, borderBottom: 'none' }}>Plan</TableCell>
              <TableCell sx={{ color: '#091542', fontWeight: 600, borderBottom: 'none' }}>Start Date</TableCell>
              <TableCell sx={{ color: '#091542', fontWeight: 600, borderBottom: 'none' }}>End Date</TableCell>
              <TableCell sx={{ color: '#091542', fontWeight: 600, borderBottom: 'none' }}>Status</TableCell>
              <TableCell sx={{ color: '#091542', fontWeight: 600, borderBottom: 'none' }}>Payment</TableCell>
              <TableCell sx={{ color: '#091542', fontWeight: 600, borderBottom: 'none', textAlign: 'right' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : memberships.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  No memberships found.
                </TableCell>
              </TableRow>
            ) : memberships.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row" sx={{ borderBottomColor: '#f0f0f0' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={row.user?.profilePhotoUrl || ''} sx={{ width: 32, height: 32 }} />
                      <Typography variant="body2" fontWeight="500" sx={{ color: '#091542' }}>{row.user?.name || 'Unknown'}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                    <Typography variant="body2" sx={{ color: '#091542' }}>{row.flat?.flatNumber || '-'}</Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                    <Typography variant="body2" sx={{ color: '#091542' }}>{row.plan?.name || '-'}</Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                    <Typography variant="body2" sx={{ color: '#091542' }}>{row.startsAt ? new Date(row.startsAt).toLocaleDateString() : '-'}</Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                    <Typography variant="body2" sx={{ color: '#091542' }}>{row.endsAt ? new Date(row.endsAt).toLocaleDateString() : '-'}</Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                    <StatusBadge status={row.status || 'Active'} variantType="text" />
                  </TableCell>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                    <Typography variant="body2" sx={{ color: '#091542' }}>{row.paymentStatus || '-'}</Typography>
                  </TableCell>
                <TableCell align="right" sx={{ borderBottomColor: '#f0f0f0' }}>
                  <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={() => handleOpenView(row)}>
                    <VisibilityOutlinedIcon fontSize="small" />
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
          totalResults={memberships.length || 0} 
          rowsPerPage={rowsPerPage} 
          onPageChange={handlePageChange} 
          onRowsPerPageChange={handleRowsPerPageChange} 
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>

      <MembershipDetailsDialog 
        open={viewDialogOpen} 
        onClose={handleCloseView} 
        membership={selectedMembership} 
        onRefresh={fetchMemberships}
      />

    </Box>
  );
}
