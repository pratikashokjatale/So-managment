import { Box, Stack, Avatar, Typography, Chip } from '@mui/material';
import { getFileUrl } from '@/utils/file';

import { 
  SportsTennis as TennisIcon, 
  FitnessCenter as GymIcon,
  Movie as CinemaIcon,
  Spa as SpaIcon,
  SelfImprovement as YogaIcon,
  Pool as PoolIcon,
  Park as ParkIcon,
  Circle as CircleIcon
} from '@mui/icons-material';

function getFacilityIcon(iconName: string) {
  switch (iconName) {
    case 'SportsTennis':
      return <TennisIcon />;
    case 'FitnessCenter':
      return <GymIcon />;
    case 'Movie':
      return <CinemaIcon />;
    case 'Spa':
      return <SpaIcon />;
    case 'SelfImprovement':
      return <YogaIcon />;
    case 'Pool':
      return <PoolIcon />;
    case 'Park':
      return <ParkIcon />;
    default:
      return <CircleIcon />;
  }
}

interface FacilityHeroProps {
  facility: {
    name: string;
    category: string;
    code?: string;
    status: string;
    images?: string[];
    color: string;
    iconName: string;
  };
}

export default function FacilityHero({ facility }: FacilityHeroProps) {
  return (
    <Box sx={{ mb: 5, position: 'relative', height: { xs: '260px', md: '320px' }, borderRadius: '32px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 10px 40px rgba(0,40,85,0.08)' }}>
      <Box 
        component="img"
        src={getFileUrl((facility.images && facility.images[0]) || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')}
        onError={(e: any) => { e.target.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop'; }}
        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80%', background: 'linear-gradient(to top, rgba(0,20,45,0.95), transparent)' }} />
      
      <Box sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', p: { xs: 3, md: 4 } }}>
        <Stack direction="row" spacing={3} alignItems="flex-end">
          <Avatar sx={{ 
            bgcolor: facility.color, 
            color: 'white', 
            width: { xs: 70, md: 80 }, 
            height: { xs: 70, md: 80 }, 
            borderRadius: '24px', 
            border: '3px solid rgba(255,255,255,0.2)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(10px)'
          }}>
            {getFacilityIcon(facility.iconName)}
          </Avatar>
          <Box>
            <Typography variant="h3" fontWeight="900" color="white" sx={{ mb: 1, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
              {facility.name}
            </Typography>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Chip label={facility.category} size="small" sx={{ fontWeight: 800, borderRadius: '8px', bgcolor: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(10px)' }} />
              {facility.code && (
                <Chip label={`Code: ${facility.code}`} size="small" sx={{ fontWeight: 800, borderRadius: '8px', bgcolor: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(10px)' }} />
              )}
              <Chip 
                label={facility.status} 
                size="small" 
                sx={{ 
                  fontWeight: 800, 
                  borderRadius: '8px',
                  bgcolor: facility.status !== 'Inactive' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: facility.status !== 'Inactive' ? '#34d399' : '#f87171',
                  border: `1px solid ${facility.status !== 'Inactive' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                  backdropFilter: 'blur(10px)'
                }} 
              />
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
