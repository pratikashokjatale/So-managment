import { 
  Box, Typography, Paper, Grid, Stack, Chip, Button, Avatar
} from '@mui/material';
import { 
  TrendingUp as RevenueIcon,
  People as TrafficIcon,
  Timer as PeakIcon,
  Download as ExportIcon,
  ChevronRight as ChevronIcon,
  Bolt as AIIcon
} from '@mui/icons-material';

const facilityStats = [
  { id: 1, name: 'Grand Gym', usage: '88%', peak: '06:00 PM', trend: '+12%', revenue: '₹45,200', color: '#1d4ed8' },
  { id: 2, name: 'Squash Court', usage: '65%', peak: '07:30 PM', trend: '+5%', revenue: '₹22,100', color: '#10b981' },
  { id: 3, name: 'Home Theatre', usage: '92%', peak: '08:00 PM', trend: '+20%', revenue: '₹85,500', color: '#7c3aed' },
  { id: 4, name: 'Table Tennis', usage: '42%', peak: '04:00 PM', trend: '-2%', revenue: '₹8,400', color: '#ea580c' },
];

export default function GetReport() {
  return (
    <Box sx={{ p: { xs: 2, md: 5 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Page Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6 }}>
        <Box>
          <Typography variant="h3" fontWeight="900" color="#091542">AI Operational Insights</Typography>
          <Typography variant="subtitle1" color="text.secondary" fontWeight="700">Predictive usage patterns and financial health auditing</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<ExportIcon />} 
          sx={{ borderRadius: '16px', px: 4, py: 1.5, fontWeight: 900, bgcolor: '#091542' }}
        >
          Export Executive Summary
        </Button>
      </Stack>

      <Grid container spacing={4}>
        {/* KPI Cards */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Box sx={{ p: 1, bgcolor: '#eff6ff', borderRadius: '12px', color: '#1d4ed8' }}><RevenueIcon /></Box>
              <Typography variant="caption" fontWeight="900" color="#64748b">MONTHLY REVENUE</Typography>
            </Stack>
            <Typography variant="h4" fontWeight="900" color="#091542">₹8,45,200</Typography>
            <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 800 }}>+18.4% VS LAST MONTH</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Box sx={{ p: 1, bgcolor: '#f0fdf4', borderRadius: '12px', color: '#10b981' }}><TrafficIcon /></Box>
              <Typography variant="caption" fontWeight="900" color="#64748b">CLUB TRAFFIC</Typography>
            </Stack>
            <Typography variant="h4" fontWeight="900" color="#091542">1,240</Typography>
            <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 800 }}>85% ACTIVE RESIDENTS</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Box sx={{ p: 1, bgcolor: '#fef2f2', borderRadius: '12px', color: '#ef4444' }}><PeakIcon /></Box>
              <Typography variant="caption" fontWeight="900" color="#64748b">PEAK LOAD TIME</Typography>
            </Stack>
            <Typography variant="h4" fontWeight="900" color="#091542">07:45 PM</Typography>
            <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 800 }}>HIGH CONGESTION ALERT</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1px solid #091542', bgcolor: '#091542', color: 'white' }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Box sx={{ p: 1, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }}><AIIcon /></Box>
              <Typography variant="caption" fontWeight="900" color="rgba(255,255,255,0.7)">AI RECOMMENDATION</Typography>
            </Stack>
            <Typography variant="body2" fontWeight="700" sx={{ mb: 1 }}>Optimize GYM staffing for 6 PM - 9 PM slots.</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 800 }}>BASED ON 30-DAY PATTERN</Typography>
          </Paper>
        </Grid>

        {/* Heatmap Placeholder & usage charts */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1px solid #e2e8f0', bgcolor: 'white', minHeight: 400 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h6" fontWeight="900" color="#091542">Hourly Usage Heatmap</Typography>
              <Chip label="Real-time" size="small" sx={{ fontWeight: 900, bgcolor: '#f0fdf4', color: '#10b981' }} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {['Gym', 'Pool', 'Theatre', 'Squash'].map((fac) => (
                <Box key={fac}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" fontWeight="800" color="#475569">{fac.toUpperCase()}</Typography>
                    <Typography variant="caption" fontWeight="800" color="#64748b">LOAD: {Math.floor(Math.random() * 100)}%</Typography>
                  </Box>
                  <Box sx={{ height: 12, bgcolor: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                    <Box sx={{ height: '100%', width: `${Math.floor(Math.random() * 100)}%`, bgcolor: '#1d4ed8', borderRadius: '6px' }} />
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Facility performance ledger */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
            <Typography variant="h6" fontWeight="900" color="#091542" sx={{ mb: 4 }}>Facility Efficiency</Typography>
            <Stack spacing={3}>
              {facilityStats.map((fac) => (
                <Box key={fac.id}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ width: 8, height: 8, bgcolor: fac.color }}> </Avatar>
                      <Typography variant="body2" fontWeight="800" color="#091542">{fac.name}</Typography>
                    </Stack>
                    <Typography variant="body2" fontWeight="900" color="#1d4ed8">{fac.usage}</Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">Revenue: {fac.revenue} • Peak: {fac.peak}</Typography>
                </Box>
              ))}
            </Stack>
            <Button fullWidth sx={{ mt: 4, borderRadius: '12px', textTransform: 'none', fontWeight: 800, color: '#091542' }} endIcon={<ChevronIcon />}>
              View Detailed Analytics
            </Button>
          </Paper>
        </Grid>
      </Grid>

    </Box>
  );
}
