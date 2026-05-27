import { Paper, Typography, Stack, Switch, Box, Avatar } from '@mui/material';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';

interface FacilitySidebarProps {
  facility: {
    price: string;
    slots: string;
    location: string;
    floor: string;
    status: string;
    managerName: string;
    managerContact: string;
  };
  handleStatusToggle: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FacilitySidebar({ facility, handleStatusToggle }: FacilitySidebarProps) {
  return (
    <Stack spacing={4}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
        <Typography variant="subtitle2" color="text.secondary" fontWeight="800" gutterBottom>PRICING & MODEL</Typography>
        <Typography variant="h4" fontWeight="900" color="#091542" sx={{ mb: 3 }}>
          {facility.price}
        </Typography>
        
        <Typography variant="subtitle2" color="text.secondary" fontWeight="800" gutterBottom>AVAILABILITY</Typography>
        <Typography variant="h5" fontWeight="800" color="#1e293b" sx={{ mb: 3 }}>
          {facility.slots}
        </Typography>

        <Typography variant="subtitle2" color="text.secondary" fontWeight="800" gutterBottom>LOCATION & VENUE</Typography>
        <Typography variant="body1" fontWeight="700" color="#475569">
          {facility.location} • {facility.floor}
        </Typography>
      </Paper>

      {/* Operations Switch */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: '24px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="body1" fontWeight="800" color="#091542">
              Operational Status
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight="700">
              {facility.status !== 'Inactive' ? 'Online / Open' : 'Offline / Closed'}
            </Typography>
          </Box>
          <Switch
            checked={facility.status !== 'Inactive'}
            onChange={handleStatusToggle}
            color="success"
          />
        </Stack>
      </Paper>

      {/* Contact Card */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: '24px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
        <Typography variant="body2" color="text.secondary" fontWeight="800" sx={{ mb: 2 }}>
          DIRECT SUPERVISOR
        </Typography>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', width: 36, height: 36 }}>
              <SupervisorAccountOutlinedIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight="700" color="#1e293b">{facility.managerName}</Typography>
              <Typography variant="caption" color="text.secondary">Manager</Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ bgcolor: '#f0fdf4', color: '#10b981', width: 36, height: 36 }}>
              <PhoneInTalkOutlinedIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight="700" color="#1e293b">{facility.managerContact}</Typography>
              <Typography variant="caption" color="text.secondary">Direct Line</Typography>
            </Box>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
