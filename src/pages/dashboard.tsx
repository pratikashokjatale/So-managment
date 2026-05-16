import { useState } from 'react';
import { 
  Box, Typography, Paper, Stack, Avatar, Button, 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Select, MenuItem, IconButton
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp as TrendingUpIcon, 
  TrendingDown as TrendingDownIcon,
  ListAlt as LogsIcon,
  Close as CloseIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import LogItem from '@/components/LogItem';

const lineData = [
  { name: 'Mon', total: 30, confirmed: 15, cancelled: 5 },
  { name: 'Tue', total: 48, confirmed: 25, cancelled: 4 },
  { name: 'Wed', total: 40, confirmed: 22, cancelled: 6 },
  { name: 'Thu', total: 58, confirmed: 35, cancelled: 10 },
  { name: 'Fri', total: 45, confirmed: 28, cancelled: 8 },
  { name: 'Sat', total: 72, confirmed: 45, cancelled: 12 },
  { name: 'Sun', total: 85, confirmed: 55, cancelled: 15 },
];

const pieData = [
  { name: 'Gym', value: 40, color: '#0047b3' },
  { name: 'Swimming Pool', value: 25, color: '#2196f3' },
  { name: 'Tennis Court', value: 20, color: '#4caf50' },
  { name: 'Badminton Court', value: 10, color: '#ff9800' },
  { name: 'Others', value: 5, color: '#9e9e9e' },
];

const activities = [
  { id: 1, title: 'Swimming Pool', date: '15 May 2024, 10:00 AM', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=200' },
  { id: 2, title: 'Yoga Class', date: '15 May 2024, 05:30 PM', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=200' },
  { id: 3, title: 'Tennis Tournament', date: '16 May 2024, 07:00 PM', image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=200' },
  { id: 4, title: 'Squash Match', date: '16 May 2024, 08:30 PM', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200' },
  { id: 5, title: 'Billiards', date: '17 May 2024, 07:00 PM', image: 'https://images.unsplash.com/photo-1563506730724-8d9b30176567?auto=format&fit=crop&q=80&w=200' },
];

const systemLogs = [
  { id: 1, event: 'New Resident Added', user: 'Admin', time: '2 mins ago', type: 'Success' },
  { id: 2, event: 'Facility Booking Cancelled', user: 'Resident', time: '15 mins ago', type: 'Warning' },
  { id: 3, event: 'Maintenance Alert Sent', user: 'System', time: '1 hour ago', type: 'Info' },
  { id: 4, event: 'Payment Received: ₹1,500', user: 'Admin', time: '2 hours ago', type: 'Success' },
  { id: 5, event: 'Staff Login Failure', user: 'System', time: '3 hours ago', type: 'Error' },
  { id: 6, event: 'Guest Entry Recorded', user: 'Security', time: '4 hours ago', type: 'Success' },
];

function StatCard({ title, value, trend, trendValue, isPositive }: any) {
  return (
    <Paper elevation={0} sx={{ p: 2.5, border: '1px solid #f1f5f9', borderRadius: '12px', bgcolor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>{title}</Typography>
      <Typography variant="h4" fontWeight="800" color="#002855" sx={{ mb: 1 }}>{value}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {isPositive ? <TrendingUpIcon sx={{ fontSize: 14, color: '#10b981' }} /> : <TrendingDownIcon sx={{ fontSize: 14, color: '#ef4444' }} />}
        <Typography variant="caption" fontWeight="800" color={isPositive ? '#10b981' : '#ef4444'}>
          {trendValue}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5, fontWeight: 500 }}>{trend}</Typography>
      </Box>
    </Paper>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState('This Month');
  const [logsOpen, setLogsOpen] = useState(false);

  const LogItemLocal = ({ log }: any) => (
    <LogItem log={log} />
  );

  return (
    <Box sx={{ mt: 2, p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Top Header Row */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="900" color="#002855" sx={{ letterSpacing: '-0.5px' }}>Dashboard Overview</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Welcome back, Admin! Here is what is happening today.</Typography>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            size="small"
            sx={{ borderRadius: '8px', bgcolor: 'white', minWidth: 140, fontWeight: 700, '& fieldset': { border: '1px solid #e2e8f0' } }}
          >
            <MenuItem value="Day">Today</MenuItem>
            <MenuItem value="Week">This Week</MenuItem>
            <MenuItem value="This Month">This Month</MenuItem>
            <MenuItem value="Year">This Year</MenuItem>
          </Select>
          <Button variant="contained" sx={{ borderRadius: '8px', textTransform: 'none', px: 3, fontWeight: 700, bgcolor: '#0047b3', boxShadow: 'none' }}>
            Export
          </Button>
        </Stack>
      </Box>

      {/* Stats Row */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' }, 
        gap: 3, 
        mb: 5 
      }}>
        <StatCard title="Total Residents" value="1,245" trendValue="+12" trend="this month" isPositive={true} />
        <StatCard title="Active Staff" value="98" trendValue="+5" trend="this month" isPositive={true} />
        <StatCard title="Guests This Week" value="56" trendValue="-8%" trend="vs last week" isPositive={false} />
        <StatCard title="Bookings Today" value="234" trendValue="+18%" trend="vs yesterday" isPositive={true} />
        <StatCard title="Monthly Revenue" value="₹45,230" trendValue="+22%" trend="vs last month" isPositive={true} />
      </Box>

      {/* Main Content Area */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 380px' }, gap: 4, alignItems: 'stretch' }}>
        
        {/* Left Column: Charts */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Bookings Overview */}
          <Paper elevation={0} sx={{ p: 4, border: '1px solid #f1f5f9', borderRadius: '12px', height: '400px', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1" fontWeight="800" color="#002855" sx={{ mb: 4 }}>Bookings Overview ({filterType})</Typography>
            <Box sx={{ flexGrow: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }} />
                  <Line type="monotone" dataKey="total" name="All Bookings" stroke="#0047b3" strokeWidth={3} dot={{ r: 4, fill: '#0047b3', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="confirmed" name="Confirmed" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="cancelled" name="Cancelled" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>

          {/* Facility Usage */}
          <Paper elevation={0} sx={{ p: 4, border: '1px solid #f1f5f9', borderRadius: '12px', height: '400px', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1" fontWeight="800" color="#002855" sx={{ mb: 4 }}>Facility Usage</Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 4, flexGrow: 1, minHeight: 0 }}>
              <Box sx={{ height: '100%', width: { xs: '100%', md: 280 }, position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={105}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="900" color="#002855">1,560</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">TOTAL</Typography>
                </Box>
              </Box>
              
              <Box sx={{ flexGrow: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, width: '100%' }}>
                {pieData.map((item) => (
                  <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, borderRadius: '8px', bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '2px', bgcolor: item.color }} />
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>{item.name}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 900, color: '#002855' }}>{item.value}%</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Right Column: Sidebar (Upcoming Activities) */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Paper elevation={0} sx={{ p: 4, border: '1px solid #f1f5f9', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1" fontWeight="800" color="#002855" sx={{ mb: 4 }}>Upcoming Activities</Typography>
            <Stack spacing={3} sx={{ flexGrow: 1, overflow: 'hidden' }}>
              {activities.map((activity) => (
                <Box key={activity.id} sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                  <Avatar variant="rounded" src={activity.image} sx={{ width: 60, height: 60, borderRadius: '8px' }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" fontWeight="800" color="#1e293b" noWrap>{activity.title}</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight="600">{activity.date}</Typography>
                  </Box>
                  <Button variant="outlined" size="small" sx={{ borderRadius: '6px', textTransform: 'none', fontWeight: 800, fontSize: '0.7rem', minWidth: 60 }}>Book</Button>
                </Box>
              ))}
            </Stack>
            <Box sx={{ mt: 4 }}>
              <Button variant="contained" fullWidth sx={{ borderRadius: '8px', py: 1.5, fontWeight: 800, textTransform: 'none', bgcolor: '#0047b3', color: 'white', boxShadow: 'none' }}>
                Open Schedule
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Stretched System Logs (Full Width Bottom) */}
      <Box sx={{ mt: 4 }}>
        <Paper elevation={0} sx={{ p: 4, border: '1px solid #f1f5f9', borderRadius: '12px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <LogsIcon sx={{ color: '#0047b3' }} />
              <Typography variant="subtitle1" fontWeight="800" color="#002855">System Activity Logs (Recent)</Typography>
            </Stack>
            <Button 
              size="small" 
              onClick={() => navigate('/logs')}
              endIcon={<OpenInNewIcon fontSize="inherit" />}
              sx={{ fontWeight: 800, textTransform: 'none', color: '#ef4444' }}
            >
              All Logs
            </Button>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', xl: '1fr 1fr 1fr' }, gap: 2.5 }}>
            {systemLogs.map((log) => (
              <LogItemLocal key={log.id} log={log} />
            ))}
          </Box>
        </Paper>
      </Box>

      {/* View All Logs Modal */}
      <Dialog 
        open={logsOpen} 
        onClose={() => setLogsOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '12px', p: 2 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <LogsIcon sx={{ color: '#0047b3' }} />
            <Typography variant="h6" fontWeight="900" color="#002855">All System Logs</Typography>
          </Stack>
          <IconButton onClick={() => setLogsOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack>
            {systemLogs.map((log) => (
              <LogItemLocal key={log.id} log={log} />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setLogsOpen(false)} sx={{ fontWeight: 700 }}>Close</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
