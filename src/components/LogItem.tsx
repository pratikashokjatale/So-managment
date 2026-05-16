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
  const getStatusColor = (type: string) => {
    switch (type) {
      case 'Success': return '#10b981';
      case 'Error': return '#ef4444';
      case 'Warning': return '#f59e0b';
      default: return '#3b82f6';
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      p: 2, 
      mb: 1.5,
      borderRadius: 4, 
      bgcolor: '#f8fafc', 
      border: '1px solid #f1f5f9',
      transition: 'all 0.2s',
      '&:hover': { transform: 'scale(1.005)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }
    }}>
      <Stack direction="row" spacing={3} alignItems="center">
        <CircleIcon sx={{ fontSize: 10, color: getStatusColor(log.type) }} />
        <Box>
          <Typography variant="body2" fontWeight="700" color="#1e293b">{log.event}</Typography>
          <Typography variant="caption" color="text.secondary" fontWeight="500">
            Performed by <Box component="span" sx={{ fontWeight: 700, color: '#0047b3' }}>{log.user}</Box>
          </Typography>
        </Box>
      </Stack>
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ display: 'block' }}>{log.time}</Typography>
        <Chip 
          label={log.type} 
          size="small" 
          sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800, bgcolor: 'white', border: '1px solid #e2e8f0' }} 
        />
      </Box>
    </Box>
  );
}
