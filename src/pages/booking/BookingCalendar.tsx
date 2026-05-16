import { useState } from 'react';
import { 
  Box, Typography, Breadcrumbs, Link, Paper, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import StatusBadge from '../../components/StatusBadge';

// Custom styles for react-calendar to match premium theme
const calendarStyles = {
  '.react-calendar': {
    width: '100%',
    border: 'none',
    fontFamily: 'inherit',
    backgroundColor: 'transparent',
  },
  '.react-calendar__navigation': {
    display: 'flex',
    marginBottom: '20px',
    '& button': {
      minWidth: '44px',
      background: 'none',
      border: 'none',
      fontSize: '1.2rem',
      fontWeight: 600,
      color: '#002855',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '8px',
      transition: '0.2s',
      '&:hover': {
        backgroundColor: '#f5f7fa',
      },
    }
  },
  '.react-calendar__month-view__weekdays': {
    fontWeight: 600,
    fontSize: '0.875rem',
    color: 'text.secondary',
    textTransform: 'none',
    '& abbr': {
      paddingBottom: '15px',
      textDecoration: 'none',
      display: 'block',
    }
  },
  '.react-calendar__tile': {
    height: '100px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '16px 0',
    borderRadius: '16px',
    transition: '0.2s',
    '&:enabled:hover, &:enabled:focus': {
      backgroundColor: '#f5f7fa',
    },
  },
  '.react-calendar__tile--now': {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    '&:enabled:hover, &:enabled:focus': {
      backgroundColor: '#bbdefb',
    },
  },
  '.react-calendar__tile--active': {
    backgroundColor: '#0047b3 !important',
    color: 'white !important',
  },
  '.react-calendar__month-view__days__tile--neighboringMonth': {
    color: '#d0d7de',
  },
  // Yearly view specific
  '.react-calendar__year-view .react-calendar__tile': {
    height: '60px',
    justifyContent: 'center',
  }
};

export default function BookingCalendar() {
  const navigate = useNavigate();
  const [value, onChange] = useState<any>(new Date());
  const [viewType, setViewType] = useState('month'); // 'day', 'week', 'month', 'year'

  const handleViewChange = (
    _event: React.MouseEvent<HTMLElement>,
    newView: string,
  ) => {
    if (newView !== null) {
      setViewType(newView);
    }
  };

  const dayEvents = [
    { id: 1, time: '10:00 AM - 11:00 AM', facility: 'Swimming Pool', status: 'Confirmed', color: '#4caf50' },
    { id: 2, time: '01:00 PM - 02:00 PM', facility: 'Gym', status: 'Confirmed', color: '#2196f3' },
    { id: 3, time: '03:00 PM - 04:00 PM', facility: 'Tennis Court', status: 'Pending', color: '#ff9800' },
    { id: 4, time: '07:00 PM - 08:00 PM', facility: 'Badminton Court', status: 'Confirmed', color: '#3f51b5' },
    { id: 5, time: '08:30 PM - 10:30 PM', facility: 'Home Theatre', status: 'Confirmed', color: '#009688' },
  ];

  const tileContent = ({ date, view }: { date: Date, view: string }) => {
    if (view === 'month') {
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();

      // Mock event dots
      if (year === 2024 && month === 4) {
        return (
          <Box sx={{ display: 'flex', gap: 0.5, mt: 1.5 }}>
            {day === 16 && (
              <>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4caf50', border: '1.5px solid white' }} />
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#2196f3', border: '1.5px solid white' }} />
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ff9800', border: '1.5px solid white' }} />
              </>
            )}
            {(day === 7 || day === 11 || day === 24) && <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4caf50', border: '1.5px solid white' }} />}
          </Box>
        );
      }
    }
    return null;
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#ffffff', minHeight: '100vh', borderRadius: 2 }}>
      
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: '#002855' }}>
            Bookings Calendar
          </Typography>
          <Breadcrumbs separator=">" aria-label="breadcrumb">
            <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
              Dashboard
            </Link>
            <Link underline="hover" color="inherit" onClick={() => navigate('/booking')} sx={{ cursor: 'pointer' }}>
              Bookings
            </Link>
            <Typography color="text.primary">Calendar</Typography>
          </Breadcrumbs>
        </Box>

        <ToggleButtonGroup
          value={viewType}
          exclusive
          onChange={handleViewChange}
          aria-label="view type"
          sx={{ height: 40, bgcolor: '#f5f7fa', p: 0.5, borderRadius: '10px', border: 'none' }}
        >
          <ToggleButton value="day" sx={{ px: 2, border: 'none', borderRadius: '8px !important', textTransform: 'none', fontWeight: 600 }}>
            Day
          </ToggleButton>
          <ToggleButton value="week" sx={{ px: 2, border: 'none', borderRadius: '8px !important', textTransform: 'none', fontWeight: 600 }}>
            Week
          </ToggleButton>
          <ToggleButton value="month" sx={{ px: 2, border: 'none', borderRadius: '8px !important', textTransform: 'none', fontWeight: 600 }}>
            Month
          </ToggleButton>
          <ToggleButton value="year" sx={{ px: 2, border: 'none', borderRadius: '8px !important', textTransform: 'none', fontWeight: 600 }}>
            Year
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: viewType === 'day' ? '1fr' : '1fr 450px' }, gap: 6 }}>
        
        {/* Calendar Column */}
        <Box sx={calendarStyles}>
          {viewType === 'day' ? (
            <Paper elevation={0} sx={{ p: 4, border: '1px solid #f0f0f0', borderRadius: 6 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>Day Schedule</Typography>
              {/* Day view content */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {dayEvents.map(e => (
                  <Paper key={e.id} sx={{ p: 2, bgcolor: '#f8fafc', borderLeft: `5px solid ${e.color}`, display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">{e.time}</Typography>
                      <Typography variant="h6" fontWeight="bold">{e.facility}</Typography>
                    </Box>
                    <StatusBadge status={e.status} variantType="chip" />
                  </Paper>
                ))}
              </Box>
            </Paper>
          ) : (
            <Calendar 
              onChange={onChange} 
              value={value} 
              tileContent={tileContent}
              view={viewType === 'year' ? 'year' : 'month'}
              locale="en-US"
            />
          )}
        </Box>

        {/* Info Column (Hidden in Day view) */}
        {viewType !== 'day' && (
          <Box>
            <Paper elevation={0} sx={{ p: 4, border: '1px solid #f0f0f0', borderRadius: 8, minHeight: 400, bgcolor: '#fcfdfe' }}>
              <Box sx={{ mb: 5 }}>
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#002855', mb: 1 }}>
                  {value instanceof Date ? value.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Selected Date'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Schedule Overview
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {dayEvents.map(event => (
                  <Box key={event.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: event.color, mt: 0.5, boxShadow: `0 0 12px ${event.color}55`, border: '3px solid white' }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
                        {event.time}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#002855', mt: 0.2 }}>
                        {event.facility}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <StatusBadge status={event.status} variantType="text" />
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  );
}
