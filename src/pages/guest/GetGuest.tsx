import { useState, useEffect } from 'react';
import {
  Box, Typography, Button, IconButton,
  Avatar, Stack,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Chip, Tooltip, Drawer, Divider, Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CloseIcon from '@mui/icons-material/Close';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';

import PageHeader from '@/components/PageHeader';
import PageToolbar from '@/components/PageToolbar';
import DataTable from '@/components/DataTable';
import { getGuestsApi, approveGuestApi, rejectGuestApi } from '@/apis/guest';
import { toast } from 'react-hot-toast';

// ── helpers ────────────────────────────────────────────────────────────────────

const extractList = (res: any): any[] => {
  if (!res) return [];
  const d = res?.data ?? res;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.items)) return d.items;
  if (Array.isArray(d?.data?.items)) return d.data.items;
  if (Array.isArray(d?.data)) return d.data;
  if (Array.isArray(d?.users)) return d.users;
  if (Array.isArray(d?.data?.users)) return d.data.users;
  return [];
};

const fmt = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const fmtTime = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

const mapGuest = (g: any) => {
  let apartment = 'N/A';
  if (g.flat?.flatNumber) apartment = `Flat ${g.flat.flatNumber}`;
  else if (g.flatNumber)  apartment = `Flat ${g.flatNumber}`;
  else if (g.flatId)      apartment = `Flat ${g.flatId.slice(-6).toUpperCase()}`;

  return {
    // raw for drawer
    _raw: g,
    id: g.id,
    name: g.name || 'Unnamed Guest',
    email: g.email || '—',
    phone: g.phone || '—',
    avatar: g.profilePhotoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(g.name || 'G')}&background=e0e7ff&color=3730a3&bold=true&size=128`,
    apartment,
    status: g.status as string,
    stayEndsAt: fmt(g.stayEndsAt),
    isExpired: g.stayEndsAt ? new Date(g.stayEndsAt) < new Date() : false,
    createdAt: fmt(g.createdAt),
    lastLogin: g.lastLoginAt ? fmtTime(g.lastLoginAt) : 'Never',
  };
};

// ── status chip ────────────────────────────────────────────────────────────────
const StatusChip = ({ status }: { status: string }) => {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    ACTIVE:    { label: 'Active',    bg: '#ecfdf5', color: '#047857' },
    PENDING:   { label: 'Pending',   bg: '#fffbeb', color: '#b45309' },
    INACTIVE:  { label: 'Inactive',  bg: '#f1f5f9', color: '#64748b' },
    SUSPENDED: { label: 'Suspended', bg: '#fef2f2', color: '#dc2626' },
  };
  const s = map[status?.toUpperCase()] ?? { label: status || '—', bg: '#f1f5f9', color: '#64748b' };
  return (
    <Chip label={s.label} size="small"
      sx={{ borderRadius: '6px', fontWeight: 700, bgcolor: s.bg, color: s.color, fontSize: '0.72rem', px: 0.5 }} />
  );
};

// ── info row for drawer ────────────────────────────────────────────────────────
const InfoRow = ({ icon, label, value, valueColor }: { icon: React.ReactNode; label: string; value: string; valueColor?: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, py: 1.5, borderBottom: '1px solid #f1f5f9' }}>
    <Box sx={{ mt: 0.2, color: '#94a3b8', flexShrink: 0 }}>{icon}</Box>
    <Box sx={{ flex: 1 }}>
      <Typography variant="caption" color="text.disabled" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.4px' }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={700} color={valueColor || 'text.primary'} sx={{ mt: 0.2 }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

// ── component ──────────────────────────────────────────────────────────────────
export default function GetGuest() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab]     = useState(0);
  const [guests, setGuests]           = useState<any[]>([]);
  const [loading, setLoading]         = useState(false);
  const [page, setPage]               = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalResults, setTotalResults] = useState(0);

  const [activeCount, setActiveCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [activeRes, pendingRes] = await Promise.all([
          getGuestsApi({ page: 1, limit: 1, status: "ACTIVE" }),
          getGuestsApi({ page: 1, limit: 1, status: "PENDING" })
        ]);
        
        const getCount = (res: any) => res?.data?.pagination?.total || res?.pagination?.total || 0;
        setActiveCount(getCount(activeRes));
        setPendingCount(getCount(pendingRes));
      } catch (err) {
        console.warn("Failed to fetch guest counts:", err);
      }
    };
    fetchCounts();
  }, [activeTab]);

  // detail drawer
  const [drawerGuest, setDrawerGuest] = useState<any | null>(null);

  // reject dialog
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [selectedGuest, setSelectedGuest]       = useState<any | null>(null);
  const [rejectReason, setRejectReason]         = useState('');

  // ── fetch ──────────────────────────────────────────────────────────────────
  const fetchGuests = async (tab: number) => {
    setLoading(true);
    try {
      const status = tab === 0 ? 'ACTIVE' : 'PENDING';
      const params: any = { limit: rowsPerPage, page, status };
      if (searchQuery) params.search = searchQuery;
      
      const res = await getGuestsApi(params);
      const list = extractList(res);
      setGuests(list.map(mapGuest));
      
      const pagination = res?.data?.pagination || res?.pagination;
      setTotalResults(pagination?.total || list.length);
    } catch (err) {
      console.warn('Failed to fetch guests:', err);
      setGuests([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGuests(activeTab); }, [activeTab, page, rowsPerPage, searchQuery]);

  // ── actions ────────────────────────────────────────────────────────────────
  const handleApprove = async (id: string) => {
    try {
      await approveGuestApi(id);
      toast.success('Guest approved');
      fetchGuests(activeTab);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to approve');
    }
  };

  const handleRejectConfirm = async () => {
    if (!selectedGuest) return;
    try {
      await rejectGuestApi(selectedGuest.id, rejectReason);
      toast.success('Guest rejected');
      fetchGuests(activeTab);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to reject');
    }
    setOpenRejectDialog(false);
    setSelectedGuest(null);
    setRejectReason('');
  };

  // ── filter ─────────────────────────────────────────────────────────────────
  const paginated = guests;

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ mt: 2, p: { xs: 2, md: 4 }, bgcolor: '#ffffff', minHeight: '100vh', borderRadius: '12px' }}>

      {/* Header */}
      <PageHeader
        title="Guest Management"
        breadcrumbs={[
          { label: 'Dashboard', link: '/' },
          { label: 'Guests' }
        ]}
        currentTab={activeTab}
        onTabChange={(_e, v) => setActiveTab(v)}
        tabs={[
          {
            label: (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Active Guests
                {activeCount > 0 && <Chip label={activeCount} size="small" sx={{ height: 18, fontSize: '0.7rem', fontWeight: 800, bgcolor: '#e0f2fe', color: '#0369a1' }} />}
              </Box>
            ),
            value: 0
          },
          {
            label: (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Guest Requests
                {pendingCount > 0 && <Chip label={pendingCount} size="small" color="warning" sx={{ height: 18, fontSize: '0.7rem', fontWeight: 800 }} />}
              </Box>
            ),
            value: 1
          }
        ]}
      />

      {/* Toolbar */}
      <PageToolbar
        searchPlaceholder={activeTab === 0 ? 'Search active guests…' : 'Search requests…'}
        searchValue={searchQuery}
        onSearchChange={(v) => { setSearchQuery(v); setPage(1); }}
        onAddClick={activeTab === 0 ? () => navigate('/guest/add') : undefined}
        addButtonLabel="Add Guest"
      />

      {/* Table */}
      <DataTable
        columns={[
          {
            id: 'guest',
            label: 'Guest',
            render: (row) => (
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar src={row.avatar} sx={{ width: 40, height: 40, borderRadius: '12px', bgcolor: '#e0e7ff', fontSize: '0.85rem', fontWeight: 800, color: '#3730a3' }} />
                <Box>
                  <Typography variant="body2" fontWeight={800} color="#091542">{row.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{row.email}</Typography>
                </Box>
              </Stack>
            )
          },
          {
            id: 'phone',
            label: 'Phone',
            render: (row) => <Typography variant="body2" fontWeight={600} color="text.primary">{row.phone}</Typography>
          },
          {
            id: 'flat',
            label: 'Flat',
            render: (row) => (
              <Chip label={row.apartment} size="small"
                sx={{ borderRadius: '6px', fontWeight: 700, bgcolor: '#eff6ff', color: '#1d4ed8', fontSize: '0.72rem' }} />
            )
          },
          {
            id: 'stayUntil',
            label: 'Stay Until',
            render: (row) => (
              <Box>
                <Typography variant="body2" fontWeight={700} color={row.isExpired ? '#ef4444' : '#091542'}>
                  {row.stayEndsAt}
                </Typography>
                {row.isExpired && (
                  <Typography variant="caption" color="#ef4444" fontWeight={700}>Expired</Typography>
                )}
              </Box>
            )
          },
          {
            id: 'date',
            label: activeTab === 0 ? 'Last Login' : 'Requested On',
            render: (row) => (
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                {activeTab === 0 ? row.lastLogin : row.createdAt}
              </Typography>
            )
          },
          {
            id: 'status',
            label: 'Status',
            render: (row) => <StatusChip status={row.status} />
          },
          {
            id: 'actions',
            label: 'Actions',
            align: 'right',
            render: (row) => (
              <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                <Tooltip title="View Details">
                  <IconButton size="small"
                    sx={{ color: '#091542', bgcolor: '#eff6ff', borderRadius: '8px', '&:hover': { bgcolor: '#dbeafe' } }}
                    onClick={() => setDrawerGuest(row)}>
                    <VisibilityOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                {activeTab === 1 && (
                  <>
                    <Tooltip title="Approve">
                      <IconButton size="small"
                        sx={{ color: '#047857', bgcolor: '#ecfdf5', borderRadius: '8px', '&:hover': { bgcolor: '#d1fae5' } }}
                        onClick={() => handleApprove(row.id)}>
                        <CheckCircleOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Reject">
                      <IconButton size="small"
                        sx={{ color: '#dc2626', bgcolor: '#fef2f2', borderRadius: '8px', '&:hover': { bgcolor: '#fee2e2' } }}
                        onClick={() => { setSelectedGuest(row); setOpenRejectDialog(true); }}>
                        <HighlightOffIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </Stack>
            )
          }
        ]}
        data={paginated}
        loading={loading}
        totalCount={totalResults}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, p) => setPage(p)}
        onRowsPerPageChange={(e: any) => {
          setRowsPerPage(Number(e.target.value));
          setPage(1);
        }}
        emptyMessage={activeTab === 0 ? 'No active guests found.' : 'No pending guest requests.'}
      />

      {/* ── Guest Detail Drawer ── */}
      <Drawer anchor="right" open={!!drawerGuest} onClose={() => setDrawerGuest(null)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 420 }, borderRadius: '16px 0 0 16px', boxShadow: '-8px 0 40px rgba(0,0,0,0.12)' } }}>
        {drawerGuest && (() => {
          const g = drawerGuest._raw;
          return (
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

              {/* Drawer header */}
              <Box sx={{ px: 3, py: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', bgcolor: '#f8fafc' }}>
                <Typography variant="h6" fontWeight={800} color="#091542">Guest Profile</Typography>
                <IconButton onClick={() => setDrawerGuest(null)} size="small" sx={{ bgcolor: '#f1f5f9', borderRadius: '8px' }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Scrollable body */}
              <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 3 }}>

                {/* Avatar + name block */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, p: 2.5, bgcolor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <Avatar src={drawerGuest.avatar} sx={{ width: 64, height: 64, borderRadius: '16px', bgcolor: '#e0e7ff', fontSize: '1.4rem', fontWeight: 800, color: '#3730a3' }} />
                  <Box>
                    <Typography variant="h6" fontWeight={800} color="#091542">{drawerGuest.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{drawerGuest.email}</Typography>
                    <Box sx={{ mt: 0.75 }}>
                      <StatusChip status={drawerGuest.status} />
                    </Box>
                  </Box>
                </Box>

                {/* Contact */}
                <Typography variant="caption" fontWeight={800} color="#091542" sx={{ textTransform: 'uppercase', letterSpacing: '0.6px', mb: 1, display: 'block' }}>
                  Contact
                </Typography>
                <InfoRow icon={<PhoneOutlinedIcon fontSize="small" />} label="Phone" value={drawerGuest.phone} />
                <InfoRow icon={<EmailOutlinedIcon fontSize="small" />} label="Email" value={drawerGuest.email} />

                <Divider sx={{ my: 2.5 }} />

                {/* Stay */}
                <Typography variant="caption" fontWeight={800} color="#091542" sx={{ textTransform: 'uppercase', letterSpacing: '0.6px', mb: 1, display: 'block' }}>
                  Stay Details
                </Typography>
                <InfoRow icon={<CalendarMonthOutlinedIcon fontSize="small" />} label="Stay Ends At"
                  value={drawerGuest.stayEndsAt}
                  valueColor={drawerGuest.isExpired ? '#ef4444' : undefined} />
                <InfoRow icon={<CalendarMonthOutlinedIcon fontSize="small" />} label="Last Login" value={drawerGuest.lastLogin} />
                <InfoRow icon={<CalendarMonthOutlinedIcon fontSize="small" />} label="Registered On" value={drawerGuest.createdAt} />

                <Divider sx={{ my: 2.5 }} />

                {/* Flat */}
                <Typography variant="caption" fontWeight={800} color="#091542" sx={{ textTransform: 'uppercase', letterSpacing: '0.6px', mb: 1, display: 'block' }}>
                  Flat Details
                </Typography>
                {g.flat ? (
                  <Box sx={{ p: 2, bgcolor: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                    <Grid container spacing={1.5}>
                      {[
                        ['Flat Number', g.flat.flatNumber],
                        ['Floor', g.flat.floorNumber],
                        ['Type', g.flat.flatType],
                        ['Occupancy', g.flat.occupancyType],
                        ['Status', g.flat.status],
                      ].map(([label, val]) => (
                        <Grid size={{ xs: 6 }} key={label}>
                          <Typography variant="caption" color="text.secondary" fontWeight={700} display="block">{label}</Typography>
                          <Typography variant="body2" fontWeight={800} color="#091542">{val || '—'}</Typography>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                ) : (
                  <InfoRow icon={<HomeOutlinedIcon fontSize="small" />} label="Flat" value={drawerGuest.apartment} />
                )}

                <Divider sx={{ my: 2.5 }} />

                {/* Verification */}
                <Typography variant="caption" fontWeight={800} color="#091542" sx={{ textTransform: 'uppercase', letterSpacing: '0.6px', mb: 1, display: 'block' }}>
                  Verification
                </Typography>
                <InfoRow icon={<VerifiedOutlinedIcon fontSize="small" />} label="Email Verified"
                  value={g.emailVerifiedAt ? fmtTime(g.emailVerifiedAt) : 'Not verified'}
                  valueColor={g.emailVerifiedAt ? '#047857' : '#94a3b8'} />
                <InfoRow icon={<VerifiedOutlinedIcon fontSize="small" />} label="Phone Verified"
                  value={g.phoneVerifiedAt ? fmtTime(g.phoneVerifiedAt) : 'Not verified'}
                  valueColor={g.phoneVerifiedAt ? '#047857' : '#94a3b8'} />
                <InfoRow icon={<BadgeOutlinedIcon fontSize="small" />} label="Approved At"
                  value={g.approvedAt ? fmtTime(g.approvedAt) : '—'}
                  valueColor={g.approvedAt ? '#047857' : '#94a3b8'} />
              </Box>

              {/* Drawer footer */}
              <Box sx={{ px: 3, py: 2, borderTop: '1px solid #f1f5f9', display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button onClick={() => setDrawerGuest(null)}
                  sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}>
                  Close
                </Button>
                {activeTab === 1 && drawerGuest.status === 'PENDING' && (
                  <Button variant="contained"
                    onClick={() => { handleApprove(drawerGuest.id); setDrawerGuest(null); }}
                    sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, bgcolor: '#047857', '&:hover': { bgcolor: '#065f46' }, boxShadow: 'none' }}>
                    Approve Guest
                  </Button>
                )}
              </Box>
            </Box>
          );
        })()}
      </Drawer>

      {/* Reject Dialog */}
      <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)} fullWidth maxWidth="sm"
        PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontWeight: 700, color: '#091542' }}>Reject Guest Request</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            Rejecting request for <strong>{selectedGuest?.name}</strong>. Provide a reason:
          </Typography>
          <TextField autoFocus fullWidth multiline rows={3} label="Reason for Rejection"
            value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
        </DialogContent>
        <DialogActions sx={{ p: 2, px: 3 }}>
          <Button onClick={() => setOpenRejectDialog(false)} sx={{ color: 'text.secondary', fontWeight: 600 }}>Cancel</Button>
          <Button onClick={handleRejectConfirm} variant="contained" color="error"
            disabled={!rejectReason.trim()}
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700, px: 3, boxShadow: 'none' }}>
            Confirm Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
