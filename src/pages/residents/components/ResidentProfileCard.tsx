import { Box, Typography, Avatar, Button, Stack, Chip, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  CalendarToday as CalendarIcon,
  WarningAmber as WarningIcon
} from '@mui/icons-material';
import bannerImg from '../../../assets/marbella-banner.png';
import { getFileUrl } from '@/utils/file';

interface ResidentProfileCardProps {
  resident: any;
}

export default function ResidentProfileCard({ resident }: ResidentProfileCardProps) {
  const navigate = useNavigate();

  // Format enrollment date or use a fallback
  const enrollmentDate = resident.startDate || resident.createdAt || '28/05/2026';
  const displayId = resident.id || 'bf8ee2d4-7039-4971-a3c8-d6aeaaa2b30e';

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      {/* Top Banner Area */}
      <Box sx={{ 
        position: 'relative', 
        height: { xs: 160, sm: 220, md: 260 }, 
        borderRadius: '24px', 
        overflow: 'hidden',
        boxShadow: '0 8px 30px rgba(0,0,0,0.04)'
      }}>
        <Box 
          component="img" 
          src={bannerImg} 
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        {/* Back Button inside banner */}
        <Button 
          startIcon={<ArrowBackIcon sx={{ fontSize: '18px !important' }} />} 
          onClick={() => navigate('/residents')}
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            bgcolor: 'white',
            color: '#091542',
            fontWeight: 800,
            fontSize: '0.85rem',
            borderRadius: '12px',
            textTransform: 'none',
            px: 2.5,
            py: 1,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            '&:hover': { bgcolor: '#f8fafc', transform: 'translateY(-1px)' },
            transition: 'all 0.2s'
          }}
        >
          Back to Residents
        </Button>
      </Box>

      {/* Profile info block containing overlapping avatar */}
      <Box sx={{ 
        px: { xs: 2, sm: 4 }, 
        mt: { xs: -5, sm: -7 }, 
        position: 'relative', 
        zIndex: 2,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'center', md: 'flex-end' },
        justifyContent: 'space-between',
        gap: { xs: 2, md: 4 }
      }}>
        {/* Avatar + Primary Info */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          alignItems: { xs: 'center', sm: 'flex-end' }, 
          gap: 3.5,
          textAlign: { xs: 'center', sm: 'left' }
        }}>
          {/* Circular Avatar overlapping banner */}
          <Avatar 
            src={getFileUrl(resident.photoUrl || resident.profilePhotoUrl || resident.avatar)} 
            sx={{ 
              width: { xs: 110, sm: 140 }, 
              height: { xs: 110, sm: 140 }, 
              border: '5px solid white', 
              boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
              bgcolor: 'white'
            }} 
          />
          
          {/* Identity details (Name, Badge, Enrollment, ID) */}
          <Box sx={{ pb: 1 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" justifyContent={{ xs: 'center', sm: 'flex-start' }} sx={{ mb: 1 }}>
              <Typography variant="h5" fontWeight="900" color="#091542" sx={{ letterSpacing: '-0.5px' }}>
                {resident.name}
              </Typography>
              <Chip 
                label={resident.status || 'ACTIVE'} 
                size="small" 
                icon={<Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10b981', mr: 0.5 }} />}
                sx={{ 
                  bgcolor: 'rgba(16, 185, 129, 0.05)', 
                  color: '#10b981', 
                  fontWeight: 900, 
                  fontSize: '0.68rem',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '6px',
                  px: 0.5,
                  '& .MuiChip-icon': { color: 'inherit', display: 'flex', alignItems: 'center' }
                }} 
              />
            </Stack>

            <Stack direction="row" spacing={2.5} alignItems="center" justifyContent={{ xs: 'center', sm: 'flex-start' }} flexWrap="wrap">
              <Stack direction="row" spacing={0.8} alignItems="center">
                <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary" fontWeight="700">
                  Enrollment: {enrollmentDate}
                </Typography>
              </Stack>
              <Typography 
                variant="body2" 
                fontWeight="800" 
                color="#2563eb"
                sx={{ 
                  fontSize: '0.88rem',
                  letterSpacing: '0.2px',
                  '&:hover': { textDecoration: 'underline', cursor: 'pointer' }
                }}
              >
                #{displayId}
              </Typography>
            </Stack>
          </Box>
        </Box>

        {/* Right Section: Action Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pb: 1 }}>
          {/* Warning Icon Button */}
        

          {/* Edit Profile Button */}
          <Button 
            variant="contained" 
            startIcon={<EditIcon sx={{ fontSize: '18px !important' }} />} 
            onClick={() => navigate(`/residents/edit/${resident.id}`)}
            sx={{ 
              borderRadius: '12px', 
              textTransform: 'none', 
              fontWeight: 800, 
              height: 44,
              px: 3,
              bgcolor: '#091542',
              color: 'white',
              boxShadow: '0 4px 12px rgba(9, 21, 66, 0.15)',
              '&:hover': { bgcolor: '#122566', transform: 'translateY(-1px)' },
              transition: 'all 0.2s'
            }}
          >
            Edit 
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
