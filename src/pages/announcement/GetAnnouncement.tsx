import { useState, useEffect } from 'react';
import {
  Box, Typography, Button, CircularProgress, Drawer,
  IconButton, Chip, Divider, Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Add as AddIcon,
  Article as DocIcon,
  Close as CloseIcon,
  EditOutlined as EditIcon,
  DeleteOutline as DeleteIcon,
  PushPin as PinIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Lock as LockIcon,
  Public as PublicIcon,
  AccessTime as TimeIcon,
  Category as CategoryIcon,
  PriorityHigh as PriorityIcon,
  Apartment as ProjectIcon,
  AttachFile as AttachIcon,
  Image as ImgIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import {
  getAnnouncementsApi,
  getAnnouncementDetailsApi,
  deleteAnnouncementApi,
} from '@/apis/announcement';

const INTER = '"Inter", "Satoshi", sans-serif';
const NAVY = '#2c4d93';

// ── Helpers ────────────────────────────────────────────────────────────────
const fmtDate = (iso: string) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};
const fmtDateTime = (iso: string) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const CAT_MAP: Record<string, string> = {
  GENERAL: 'General', MAINTENANCE: 'Maintenance',
  FACILITY: 'Facility', EVENT: 'Event', STAFF: 'Staff',
};
const PRIO_MAP: Record<string, string> = {
  HIGH: 'High', URGENT: 'Urgent', NORMAL: 'Normal', LOW: 'Low',
};
const ROLE_MAP: Record<string, string> = {
  RESIDENT: 'Residents', GUEST: 'Guests', STAFF: 'Staff',
  ADMIN: 'Admins', ALL: 'All',
};

const mapAnn = (ann: any) => ({
  id: ann.id,
  title: ann.title || 'Untitled',
  body: ann.body || '',
  category: CAT_MAP[ann.category] || ann.category || 'General',
  priority: PRIO_MAP[ann.priority] || ann.priority || 'Normal',
  status: ann.status || 'DRAFT',
  pinned: !!ann.pinned,
  audienceRoles: (ann.audienceRoles || []).map((r: string) => ROLE_MAP[r] || r),
  startsAt: fmtDate(ann.startsAt),
  expiresAt: fmtDate(ann.expiresAt),
  publishedAt: fmtDateTime(ann.publishedAt),
  createdAt: fmtDateTime(ann.createdAt),
  imageUrls: (ann.imageUrls || []).filter(Boolean),
  attachmentUrls: (ann.attachmentUrls || []).filter(Boolean),
  projectName: ann.project?.name || '—',
});

// ── Download helper ────────────────────────────────────────────────────────
const downloadFile = async (url: string, filename?: string) => {
  try {
    const resp = await fetch(url, { mode: 'cors' });
    const blob = await resp.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename || url.split('/').pop() || 'download';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
  } catch {
    // fallback: open in new tab
    window.open(url, '_blank');
  }
};

const downloadAll = (ann: any) => {
  const all = [...ann.imageUrls, ...ann.attachmentUrls];
  if (!all.length) { toast.error('No files attached'); return; }
  all.forEach(url => downloadFile(url));
  toast.success(`Downloading ${all.length} file${all.length > 1 ? 's' : ''}…`);
};

// ── Card ──────────────────────────────────────────────────────────────────
function AnnCard({ ann, onClick }: { ann: any; onClick: () => void }) {
  const isPublished = ann.status === 'PUBLISHED';
  const audience = ann.audienceRoles.length ? ann.audienceRoles.join(', ') : 'All';
  const hasFiles = ann.imageUrls.length > 0 || ann.attachmentUrls.length > 0;

  return (
    <Box
      onClick={onClick}
      sx={{
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        bgcolor: '#fff',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'box-shadow 0.18s, border-color 0.18s',
        '&:hover': { boxShadow: '0 4px 20px rgba(99,120,160,0.10)', borderColor: '#d1d5db' },
      }}
    >
      {/* Card body */}
      <Box sx={{ p: '16px 18px' }}>
        {/* Top row: icon + title + download */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: '12px' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1, minWidth: 0 }}>
            {/* Icon: doc icon */}
            <Box
              sx={{
                width: 34, height: 34, borderRadius: '8px', overflow: 'hidden',
                flexShrink: 0, mt: '1px', bgcolor: '#eff6ff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <DocIcon sx={{ fontSize: 18, color: NAVY }} />
            </Box>

            {/* Title + subtitle */}
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontFamily: INTER, fontWeight: 600, fontSize: '0.9rem',
                  color: '#111827', lineHeight: 1.3, mb: '3px',
                }}
              >
                {ann.pinned && (
                  <PinIcon sx={{ fontSize: 11, color: NAVY, mr: 0.5, transform: 'rotate(45deg)', verticalAlign: 'middle' }} />
                )}
                {ann.title}
              </Typography>
              <Typography sx={{ fontFamily: INTER, fontSize: '0.76rem', color: '#9ca3af' }}>
                {ann.category} · to {audience}
              </Typography>
            </Box>
          </Box>

          {/* Download button — downloads all files */}
          <Tooltip title={hasFiles ? 'Download all files' : 'No files attached'} placement="top">
            <span>
              <IconButton
                size="small"
                onClick={e => { e.stopPropagation(); downloadAll(ann); }}
                disabled={!hasFiles}
                sx={{
                  color: hasFiles ? '#6b7280' : '#d1d5db',
                  p: '4px', ml: '8px',
                  '&:hover': { color: NAVY },
                }}
              >
                <DownloadIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {/* Badges */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {isPublished ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', bgcolor: '#f0fdf4', border: '1px solid #d1fae5', borderRadius: '6px', px: '9px', py: '4px' }}>
              <PublicIcon sx={{ fontSize: 11, color: '#16a34a' }} />
              <Typography sx={{ fontFamily: INTER, fontSize: '0.73rem', fontWeight: 600, color: '#16a34a' }}>Shared</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', bgcolor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px', px: '9px', py: '4px' }}>
              <LockIcon sx={{ fontSize: 11, color: '#6b7280' }} />
              <Typography sx={{ fontFamily: INTER, fontSize: '0.73rem', fontWeight: 600, color: '#6b7280' }}>Private</Typography>
            </Box>
          )}

          <Box
            onClick={e => e.stopPropagation()}
            sx={{
              display: 'flex', alignItems: 'center', gap: '4px',
              bgcolor: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '6px',
              px: '9px', py: '4px', cursor: 'pointer',
              '&:hover': { bgcolor: '#f1f5f9' },
            }}
          >
            <ShareIcon sx={{ fontSize: 11, color: '#6b7280' }} />
            <Typography sx={{ fontFamily: INTER, fontSize: '0.73rem', fontWeight: 600, color: '#6b7280' }}>
              Manage access
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}



// ── Main ──────────────────────────────────────────────────────────────────
export default function GetAnnouncement() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await getAnnouncementsApi({ limit: 100, page: 1 });
      const list =
        res?.data?.announcements ||
        res?.data?.items ||
        res?.announcements ||
        res?.items ||
        (Array.isArray(res?.data) ? res.data : []);
      setAnnouncements(Array.isArray(list) ? list.map(mapAnn) : []);
    } catch (err) {
      console.warn('Failed to fetch announcements:', err);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const handleCardClick = (ann: any) => {
    // Navigate to a dedicated details page instead of opening a drawer
    navigate(`/announcements/${ann.id}`);
  };

  return (
    <Box sx={{ fontFamily: INTER }}>
      {/* Header */}
      <Box sx={{ mb: '24px' }}>
        <Typography sx={{ fontFamily: INTER, fontWeight: 600, fontSize: '1.2rem', color: '#111827' }}>
          Documents & Reports
        </Typography>
        <Typography sx={{ fontFamily: INTER, fontSize: '0.8rem', color: '#9ca3af', mt: '2px', mb: '16px' }}>
          Publish and share to residents, staff or admins
        </Typography>
        <Button
          onClick={() => navigate('/announcements/add')}
          startIcon={<AddIcon sx={{ fontSize: 16 }} />}
          sx={{ fontFamily: INTER, fontWeight: 600, fontSize: '0.85rem', textTransform: 'none', borderRadius: '8px', bgcolor: NAVY, color: '#fff', px: '16px', py: '8px', '&:hover': { bgcolor: '#1e3a7a' }, boxShadow: 'none' }}
        >
          Upload & share
        </Button>
      </Box>

      {/* Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={26} sx={{ color: NAVY }} />
        </Box>
      ) : announcements.length === 0 ? (
        <Box sx={{ border: '1px dashed #e5e7eb', borderRadius: '12px', py: 8, textAlign: 'center' }}>
          <DocIcon sx={{ fontSize: 36, color: '#d1d5db', mb: 1 }} />
          <Typography sx={{ fontFamily: INTER, fontSize: '0.875rem', color: '#9ca3af' }}>
            No announcements yet. Click <strong>Create</strong> to add one.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: '12px' }}>
          {announcements.map(ann => (
            <AnnCard key={ann.id} ann={ann} onClick={() => handleCardClick(ann)} />
          ))}
        </Box>
      )}
    </Box>
  );
}
