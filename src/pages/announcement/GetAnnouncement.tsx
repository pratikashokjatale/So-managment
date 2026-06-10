import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, 
  Select, MenuItem, Stack, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PushPinIcon from '@mui/icons-material/PushPin';
import toast from 'react-hot-toast';

import Pagination from '../../components/Pagination';
import StatusBadge from '../../components/StatusBadge';
import Search from '@/components/Search';
import { getAnnouncementsApi, deleteAnnouncementApi } from '@/apis/announcement';

const formatDate = (iso: string) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const mapBackendAnnouncementToFrontend = (ann: any) => {
  let cat = ann.category || 'GENERAL';
  if (cat === 'GENERAL') cat = 'General';
  else if (cat === 'MAINTENANCE') cat = 'Maintenance';
  else if (cat === 'FACILITY') cat = 'Facility';
  else if (cat === 'EVENT') cat = 'Event';
  else if (cat === 'STAFF') cat = 'Staff';

  let prio = ann.priority || 'NORMAL';
  if (prio === 'HIGH') prio = 'High';
  else if (prio === 'URGENT') prio = 'Urgent';
  else if (prio === 'NORMAL') prio = 'Normal';
  else if (prio === 'LOW') prio = 'Low';

  const now = new Date().getTime();
  const start = ann.startsAt ? new Date(ann.startsAt).getTime() : 0;
  const end = ann.expiresAt ? new Date(ann.expiresAt).getTime() : Infinity;
  const isActive = now >= start && now <= end;

  return {
    id: ann.id,
    title: ann.title || '',
    category: cat,
    priority: prio,
    postedOn: formatDate(ann.startsAt),
    expiryDate: formatDate(ann.expiresAt),
    status: isActive ? 'Active' : 'Expired',
    pinned: !!ann.pinned
  };
};

export default function GetAnnouncement() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const params: any = { limit: rowsPerPage, page };
      if (searchQuery) params.search = searchQuery;
      if (typeFilter !== 'All Types') {
        params.category = typeFilter.toUpperCase();
      }
      if (statusFilter !== 'All Status') {
        params.status = statusFilter.toUpperCase();
      }

      const res = await getAnnouncementsApi(params);
      const list = res?.data?.announcements || res?.data?.items || res?.announcements || (Array.isArray(res?.data) ? res.data : null);
      if (Array.isArray(list)) {
        setAnnouncements(list.map(mapBackendAnnouncementToFrontend));
      } else {
        setAnnouncements([]);
      }
      const pagination = res?.data?.pagination || res?.pagination;
      setTotalResults(pagination?.total || (Array.isArray(list) ? list.length : 0));
    } catch (err) {
      console.warn("Failed to fetch announcements:", err);
      setAnnouncements([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [page, rowsPerPage, searchQuery, typeFilter, statusFilter]);

  const handlePageChange = (_event: any, value: number) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        await deleteAnnouncementApi(id);
        toast.success("Announcement deleted successfully!");
        fetchAnnouncements();
      } catch (err) {
        console.error("Delete failed:", err);
        toast.error("Failed to delete announcement");
      }
    }
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
      
      {/* Filters Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value as string); setPage(1); }} sx={filterSelectSx}>
            <MenuItem value="All Types">All Types</MenuItem>
            <MenuItem value="Facility">Facility</MenuItem>
            <MenuItem value="General">General</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
            <MenuItem value="Staff">Staff</MenuItem>
          </Select>
          <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as string); setPage(1); }} sx={filterSelectSx}>
            <MenuItem value="All Status">All Status</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Expired">Expired</MenuItem>
          </Select>
          <Search 
            placeholder="Search announcements..." 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            sx={{ width: { xs: '100%', md: 300 }, '& fieldset': { borderRadius: '10px' } }}
          />
        </Box>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/announcements/add')}
          sx={{ borderRadius: '10px', textTransform: 'none', px: 3, fontWeight: 600, bgcolor: '#0047b3', '&:hover': { bgcolor: '#003380' }, boxShadow: 'none' }}
        >
          Create Announcement
        </Button>
      </Box>

      {/* Table Section */}
      <TableContainer sx={{ overflowX: 'auto', minHeight: 200, position: 'relative' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table sx={{ minWidth: 900 }} aria-label="announcements table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Title</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Category</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Posted On</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Expiry Date</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Priority</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600, textAlign: 'right' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {announcements.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0', py: 2.5 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {row.pinned && <PushPinIcon fontSize="small" sx={{ color: '#0047b3', transform: 'rotate(45deg)' }} />}
                      <Typography variant="body2" sx={{ color: '#091542', fontWeight: 600 }}>{row.title}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{row.category}</Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                    <Typography variant="body2" sx={{ color: '#091542', fontWeight: 500 }}>{row.postedOn}</Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                    <Typography variant="body2" sx={{ color: '#091542', fontWeight: 500 }}>{row.expiryDate}</Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                    <Typography variant="body2" sx={{ color: '#091542', fontWeight: 500 }}>{row.priority}</Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                    <StatusBadge status={row.status} variantType="text" />
                  </TableCell>
                  <TableCell align="right" sx={{ borderBottomColor: '#f0f0f0' }}>
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={() => navigate(`/announcements/edit/${row.id}`)}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#f44336' }} onClick={() => handleDelete(row.id)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && announcements.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">No announcements found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Pagination Section */}
      <Box sx={{ mt: 3 }}>
        <Pagination 
          page={page} 
          totalResults={totalResults} 
          rowsPerPage={rowsPerPage} 
          onPageChange={handlePageChange} 
          onRowsPerPageChange={handleRowsPerPageChange} 
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>

    </Box>
  );
}
