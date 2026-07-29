import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, CircularProgress, Chip, Divider, IconButton
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Article as DocIcon,
  EditOutlined as EditIcon,
  DeleteOutline as DeleteIcon,
  PushPin as PinIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  AccessTime as TimeIcon,
  Category as CategoryIcon,
  PriorityHigh as PriorityIcon,
  Apartment as ProjectIcon,
  AttachFile as AttachIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import {
  getAnnouncementDetailsApi,
  deleteAnnouncementApi,
} from '@/apis/announcement';

const INTER = '"Inter", "Satoshi", sans-serif';
const NAVY = '#2c4d93';

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

const CAT_MAP: Record<string, string> = { GENERAL: 'General', MAINTENANCE: 'Maintenance', FACILITY: 'Facility', EVENT: 'Event', STAFF: 'Staff' };
const PRIO_MAP: Record<string, string> = { HIGH: 'High', URGENT: 'Urgent', NORMAL: 'Normal', LOW: 'Low' };
const ROLE_MAP: Record<string, string> = { RESIDENT: 'Residents', GUEST: 'Guests', STAFF: 'Staff', ADMIN: 'Admins', ALL: 'All' };

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
    window.open(url, '_blank');
  }
};

export default function AnnouncementDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ann, setAnn] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        const res = await getAnnouncementDetailsApi(id);
        const data = res?.data || res;
        
        setAnn({
          id: data.id,
          title: data.title || 'Untitled',
          body: data.body || '',
          category: CAT_MAP[data.category] || data.category || 'General',
          priority: PRIO_MAP[data.priority] || data.priority || 'Normal',
          status: data.status || 'DRAFT',
          pinned: !!data.pinned,
          audienceRoles: (data.audienceRoles || []).map((r: string) => ROLE_MAP[r] || r),
          startsAt: fmtDate(data.startsAt),
          expiresAt: fmtDate(data.expiresAt),
          publishedAt: fmtDateTime(data.publishedAt),
          createdAt: fmtDateTime(data.createdAt),
          imageUrls: (data.imageUrls || []).filter(Boolean),
          attachmentUrls: (data.attachmentUrls || []).filter(Boolean),
          projectName: data.project?.name || '—',
        });
      } catch (err) {
        toast.error('Failed to load announcement details');
        navigate('/announcements');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await deleteAnnouncementApi(id!);
      toast.success('Announcement deleted');
      navigate('/announcements');
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={26} sx={{ color: NAVY }} />
      </Box>
    );
  }

  if (!ann) return null;

  const audience = ann.audienceRoles?.length ? ann.audienceRoles.join(', ') : 'All';
  const prioColor = ann.priority === 'High' || ann.priority === 'Urgent'
    ? { bg: '#fff1f2', border: '#fecdd3', text: '#e11d48' }
    : { bg: '#f9fafb', border: '#e5e7eb', text: '#6b7280' };

  return (
    <Box sx={{ fontFamily: INTER, maxWidth: 800, mx: 'auto', pb: 4 }}>
      
      {/* Header / Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Button
          startIcon={<BackIcon sx={{ fontSize: 16 }} />}
          onClick={() => navigate('/announcements')}
          sx={{ fontFamily: INTER, fontWeight: 600, color: '#6b7280', textTransform: 'none', '&:hover': { bgcolor: 'transparent', color: '#111827' } }}
        >
          Back to Announcements
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button startIcon={<EditIcon sx={{ fontSize: 16 }} />} onClick={() => navigate(`/announcements/edit/${ann.id}`)}
            sx={{ fontFamily: INTER, fontWeight: 600, fontSize: '0.85rem', textTransform: 'none', borderRadius: '8px', border: '1px solid #e5e7eb', color: '#374151', bgcolor: '#fff', '&:hover': { bgcolor: '#f9fafb' } }}
          >
            Edit
          </Button>
          <Button startIcon={<DeleteIcon sx={{ fontSize: 16 }} />} onClick={handleDelete}
            sx={{ fontFamily: INTER, fontWeight: 600, fontSize: '0.85rem', textTransform: 'none', borderRadius: '8px', border: '1px solid #fecdd3', color: '#e11d48', bgcolor: '#fff1f2', '&:hover': { bgcolor: '#ffe4e6' } }}
          >
            Delete
          </Button>
        </Box>
      </Box>

      {/* Main Content Card */}
      <Box sx={{ bgcolor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', p: { xs: '20px', md: '32px' } }}>
        
        {/* Title area */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: '10px', bgcolor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <DocIcon sx={{ fontSize: 22, color: NAVY }} />
          </Box>
          <Box>
            <Typography sx={{ fontFamily: INTER, fontWeight: 700, fontSize: '1.25rem', color: '#111827', mb: 0.5 }}>
              {ann.pinned && <PinIcon sx={{ fontSize: 14, color: NAVY, mr: 0.5, transform: 'rotate(45deg)' }} />}
              {ann.title}
            </Typography>
            <Typography sx={{ fontFamily: INTER, fontSize: '0.875rem', color: '#6b7280' }}>
              {ann.category} · to {audience}
            </Typography>
          </Box>
        </Box>

        {/* Status badges */}
        <Box sx={{ display: 'flex', gap: 1, mb: 4, flexWrap: 'wrap' }}>
          <Chip label={ann.status === 'PUBLISHED' ? 'Published' : ann.status === 'DRAFT' ? 'Draft' : 'Archived'} 
            sx={{ fontFamily: INTER, fontWeight: 600, fontSize: '0.75rem', height: 26,
              bgcolor: ann.status === 'PUBLISHED' ? '#f0fdf4' : '#f9fafb',
              color: ann.status === 'PUBLISHED' ? '#16a34a' : '#6b7280',
              border: `1px solid ${ann.status === 'PUBLISHED' ? '#d1fae5' : '#e5e7eb'}`,
            }}
          />
          <Chip label={ann.priority} 
            sx={{ fontFamily: INTER, fontWeight: 600, fontSize: '0.75rem', height: 26,
              bgcolor: prioColor.bg, color: prioColor.text, border: `1px solid ${prioColor.border}`,
            }}
          />
          {ann.pinned && (
            <Chip label="Pinned" icon={<PinIcon sx={{ fontSize: '12px !important', transform: 'rotate(45deg)' }} />}
              sx={{ fontFamily: INTER, fontWeight: 600, fontSize: '0.75rem', height: 26, bgcolor: '#eff6ff', color: NAVY, border: '1px solid #bfdbfe' }}
            />
          )}
        </Box>

        {/* Meta Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 4, p: 2, bgcolor: '#f9fafb', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
          {[
            { icon: <ProjectIcon sx={{ fontSize: 16 }} />, label: 'Project', value: ann.projectName },
            { icon: <ShareIcon sx={{ fontSize: 16 }} />, label: 'Audience', value: audience },
            { icon: <TimeIcon sx={{ fontSize: 16 }} />, label: 'Starts', value: ann.startsAt },
            { icon: <TimeIcon sx={{ fontSize: 16 }} />, label: 'Expires', value: ann.expiresAt },
            { icon: <TimeIcon sx={{ fontSize: 16 }} />, label: 'Published', value: ann.publishedAt },
            { icon: <TimeIcon sx={{ fontSize: 16 }} />, label: 'Created', value: ann.createdAt },
          ].map(({ icon, label, value }) => (
            <Box key={label} sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Box sx={{ color: '#9ca3af', mt: '2px', display: 'flex' }}>{icon}</Box>
              <Box>
                <Typography sx={{ fontFamily: INTER, fontSize: '0.75rem', color: '#6b7280', mb: 0.5 }}>{label}</Typography>
                <Typography sx={{ fontFamily: INTER, fontSize: '0.875rem', color: '#111827', fontWeight: 500 }}>{value}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Body */}
        <Typography sx={{ fontFamily: INTER, fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 1 }}>
          Announcement Content
        </Typography>
        <Typography sx={{ fontFamily: INTER, fontSize: '0.9375rem', color: '#374151', lineHeight: 1.6, whiteSpace: 'pre-wrap', mb: 4 }}>
          {ann.body || 'No content provided.'}
        </Typography>

        {/* Images */}
        {ann.imageUrls?.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ fontFamily: INTER, fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Images ({ann.imageUrls.length})
              </Typography>
              <Button size="small" startIcon={<DownloadIcon sx={{ fontSize: 14 }} />} onClick={() => ann.imageUrls.forEach((url: string) => downloadFile(url))}
                sx={{ fontFamily: INTER, fontSize: '0.8rem', fontWeight: 600, textTransform: 'none', color: NAVY, p: 0, minWidth: 0, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
              >
                Download all images
              </Button>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 2 }}>
              {ann.imageUrls.map((url: string, i: number) => (
                <Box key={i} sx={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb', aspectRatio: '1', bgcolor: '#f3f4f6', group: 'true' }}>
                  <Box component="img" src={url} alt={`img-${i + 1}`}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', cursor: 'zoom-in', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' } }}
                    onClick={() => window.open(url, '_blank')}
                    onError={(e: any) => { e.currentTarget.parentElement.style.display = 'none'; }}
                  />
                  <IconButton size="small" onClick={e => { e.stopPropagation(); downloadFile(url, `image-${i + 1}.jpg`); }}
                    sx={{ position: 'absolute', top: 6, right: 6, bgcolor: 'rgba(0,0,0,0.5)', color: '#fff', p: 0.5, '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
                  >
                    <DownloadIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Attachments */}
        {ann.attachmentUrls?.length > 0 && (
          <Box>
            <Typography sx={{ fontFamily: INTER, fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 2 }}>
              Attachments ({ann.attachmentUrls.length})
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {ann.attachmentUrls.map((url: string, i: number) => {
                const fname = decodeURIComponent(url.split('/').pop() || `file-${i + 1}`);
                return (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: '12px 16px', borderRadius: '8px', border: '1px solid #e5e7eb', bgcolor: '#f9fafb' }}>
                    <AttachIcon sx={{ fontSize: 18, color: NAVY, flexShrink: 0 }} />
                    <Typography sx={{ fontFamily: INTER, fontSize: '0.875rem', color: '#374151', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {fname}
                    </Typography>
                    <Button size="small" startIcon={<DownloadIcon sx={{ fontSize: 16 }} />} onClick={() => downloadFile(url, fname)}
                      sx={{ fontFamily: INTER, fontSize: '0.8rem', fontWeight: 600, textTransform: 'none', color: '#6b7280', p: 0, minWidth: 0, '&:hover': { bgcolor: 'transparent', color: NAVY } }}
                    >
                      Download
                    </Button>
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}

      </Box>
    </Box>
  );
}
