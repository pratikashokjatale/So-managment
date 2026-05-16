import { useState } from 'react';
import { 
  Box, Typography, Button, Paper, Breadcrumbs, Link, Select, MenuItem, Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

const lineData = [
  { name: 'Mon', total: 40, online: 24, offline: 10 },
  { name: 'Tue', total: 55, online: 35, offline: 15 },
  { name: 'Wed', total: 45, online: 30, offline: 12 },
  { name: 'Thu', total: 68, online: 45, offline: 20 },
  { name: 'Fri', total: 52, online: 38, offline: 18 },
  { name: 'Sat', total: 75, online: 55, offline: 25 },
  { name: 'Sun', total: 90, online: 65, offline: 30 },
];

const pieData = [
  { name: 'Gym', value: 40, color: '#0047b3' },
  { name: 'Swimming Pool', value: 25, color: '#2196f3' },
  { name: 'Tennis Court', value: 20, color: '#4caf50' },
  { name: 'Badminton Court', value: 10, color: '#ff9800' },
  { name: 'Others', value: 5, color: '#9e9e9e' },
];

export default function GetReport() {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('This Month');

  const StatCard = ({ title, value, percentage, isPositive }: { title: string, value: string, percentage: string, isPositive: boolean }) => (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid #f0f0f0', borderRadius: 4 }}>
      <Typography variant="body2" color="text.secondary" fontWeight="600" gutterBottom>{title}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#002855' }}>{value}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', color: isPositive ? '#4caf50' : '#f44336' }}>
          {isPositive ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
          <Typography variant="body2" fontWeight="700" sx={{ ml: 0.5 }}>{percentage}</Typography>
        </Box>
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#ffffff', minHeight: '100vh', borderRadius: 2 }}>
      
      {/* Header Section */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: '#002855' }}>
            Reports & Analytics
          </Typography>
          <Breadcrumbs separator=">" aria-label="breadcrumb">
            <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
              Dashboard
            </Link>
            <Typography color="text.primary">Reports</Typography>
          </Breadcrumbs>
        </Box>
        <Stack direction="row" spacing={2}>
          <Select 
            value={timeFilter} 
            onChange={(e) => setTimeFilter(e.target.value as string)} 
            size="small"
            sx={{ borderRadius: '10px', minWidth: 140, bgcolor: '#f8fafc', '& fieldset': { border: 'none' } }}
          >
            <MenuItem value="This Week">This Week</MenuItem>
            <MenuItem value="This Month">This Month</MenuItem>
            <MenuItem value="This Year">This Year</MenuItem>
          </Select>
          <Button 
            variant="text" 
            startIcon={<DownloadIcon />} 
            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, color: '#002855' }}
          >
            Export
          </Button>
        </Stack>
      </Box>

      {/* Stats Summary Section */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 5 }}>
        <Box>
          <StatCard title="Total Revenue" value="₹45,230" percentage="+22%" isPositive={true} />
        </Box>
        <Box>
          <StatCard title="Total Bookings" value="1,560" percentage="+10%" isPositive={true} />
        </Box>
        <Box>
          <StatCard title="Active Members" value="1,245" percentage="+12%" isPositive={true} />
        </Box>
        <Box>
          <StatCard title="Guests This Week" value="56" percentage="-5%" isPositive={false} />
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 4 }}>
        {/* Revenue Overview Chart */}
        <Box>
          <Paper elevation={0} sx={{ p: 4, border: '1px solid #f0f0f0', borderRadius: 6 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 4, color: '#002855' }}>Revenue Overview</Typography>
            <Box sx={{ height: 400, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9e9e9e', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9e9e9e', fontSize: 12 }} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} 
                  />
                  <Line type="monotone" dataKey="total" stroke="#0047b3" strokeWidth={3} dot={{ r: 4, fill: '#0047b3' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="online" stroke="#4caf50" strokeWidth={3} dot={{ r: 4, fill: '#4caf50' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="offline" stroke="#ff9800" strokeWidth={3} dot={{ r: 4, fill: '#ff9800' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>

        {/* Booking by Facility Chart */}
        <Box>
          <Paper elevation={0} sx={{ p: 4, border: '1px solid #f0f0f0', borderRadius: 6, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 4, color: '#002855' }}>Booking by Facility</Typography>
            <Box sx={{ height: 300, width: '100%', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
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
                <Typography variant="h4" fontWeight="bold" color="#002855">1,560</Typography>
                <Typography variant="caption" color="text.secondary">Total</Typography>
              </Box>
            </Box>
            <Stack spacing={2} sx={{ mt: 4 }}>
              {pieData.map((item) => (
                <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color }} />
                    <Typography variant="body2" fontWeight="500">{item.name}</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight="700">{item.value}%</Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Box>
      </Box>

    </Box>
  );
}
