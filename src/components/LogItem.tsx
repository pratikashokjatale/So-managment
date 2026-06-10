import { Box, Stack, Typography, Chip } from "@mui/material";
import { Circle as CircleIcon } from "@mui/icons-material";

interface LogItemProps {
  log: {
    id: number;
    event: string;
    user: string;
    time: string;
    type: string;
  };
}

export default function LogItem({ log }: LogItemProps) {
  const getColors = (type: string) => {
    switch (type) {
      case 'Success':
        return {
          main: '#10b981',
          bg: 'rgba(16, 185, 129, 0.04)',
          border: 'rgba(16, 185, 129, 0.15)',
        };
      case 'Error':
        return {
          main: '#ef4444',
          bg: 'rgba(239, 68, 68, 0.04)',
          border: 'rgba(239, 68, 68, 0.15)',
        };
      case 'Warning':
        return {
          main: '#f59e0b',
          bg: 'rgba(245, 158, 11, 0.04)',
          border: 'rgba(245, 158, 11, 0.15)',
        };
      default:
        return {
          main: '#3b82f6',
          bg: 'rgba(59, 130, 246, 0.04)',
          border: 'rgba(59, 130, 246, 0.15)',
        };
    }
  };

  const colors = getColors(log.type);

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      p: 2, 
      mb: 1.5,
      borderRadius: "14px", 
      bgcolor: colors.bg, 
      border: `1px solid ${colors.border}`,
      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': { 
        transform: 'translateY(-2px)', 
        boxShadow: `0 8px 16px -8px ${colors.main}`,
        borderColor: colors.main 
      }
    }}>
      <Stack direction="row" spacing={2.5} alignItems="center">
        <CircleIcon sx={{ 
          fontSize: 10, 
          color: colors.main,
          filter: `drop-shadow(0 0 4px ${colors.main})`
        }} />
        <Box>
          <Typography variant="body2" fontWeight="800" color="#1e293b">{log.event}</Typography>
          <Typography variant="caption" color="text.secondary" fontWeight="600">
            Performed by <Box component="span" sx={{ fontWeight: 800, color: '#0047b3' }}>{log.user}</Box>
          </Typography>
        </Box>
      </Stack>
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ display: 'block', mb: 0.5 }}>{log.time}</Typography>
        <Chip 
          label={log.type} 
          size="small" 
          sx={{ 
            height: 18, 
            fontSize: '0.6rem', 
            fontWeight: 900, 
            bgcolor: 'white', 
            color: colors.main,
            border: `1px solid ${colors.border}` 
          }} 
        />
      </Box>
    </Box>
  );
}
