import { useState } from 'react';
import { 
  Box, Typography, Paper, Stack, 
  Button, IconButton, Divider
} from '@mui/material';
import { 
  SportsTennis as TennisIcon,
  SportsEsports as TheatreIcon,
  FitnessCenter as GymIcon,
  SelfImprovement as YogaIcon,
  NavigateNext as NextIcon,
  NavigateBefore as BeforeIcon,
  ShoppingCart as CartIcon
} from '@mui/icons-material';

const ACTIVITIES = [
  { id: 'tt', name: 'Table Tennis', icon: <TennisIcon />, price: 150 },
  { id: 'sq', name: 'Squash', icon: <TennisIcon />, price: 200 },
  { id: 'ht', name: 'Home Theatre', icon: <TheatreIcon />, price: 500 },
  { id: 'gy', name: 'Gym', icon: <GymIcon />, price: 100 },
  { id: 'yo', name: 'Yoga', icon: <YogaIcon />, price: 300 },
];

const SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
  '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
];

export default function ActivityBookingEngine() {
  const [selectedActivity, setSelectedActivity] = useState(ACTIVITIES[0]);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

  const handleSlotToggle = (slot: string) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter(s => s !== slot));
    } else {
      // Limit Logic: Max 2 slots
      if (selectedSlots.length >= 2) {
        alert("Maximum 2 slots allowed per booking.");
        return;
      }
      setSelectedSlots([...selectedSlots, slot].sort());
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>


      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '250px 1fr' }, gap: 4 }}>
        {/* Activity Selection */}
        <Stack spacing={1.5}>
          {ACTIVITIES.map((act) => (
            <Box 
              key={act.id}
              onClick={() => {
                setSelectedActivity(act);
                setSelectedSlots([]);
              }}
              sx={{ 
                p: 2, 
                borderRadius: '16px', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                transition: 'all 0.2s',
                bgcolor: selectedActivity.id === act.id ? '#eff6ff' : 'transparent',
                border: '1px solid',
                borderColor: selectedActivity.id === act.id ? '#1d4ed8' : '#f1f5f9',
                '&:hover': { bgcolor: '#f8fafc' }
              }}
            >
              <Box sx={{ color: selectedActivity.id === act.id ? '#1d4ed8' : 'text.secondary' }}>
                {act.icon}
              </Box>
              <Box>
                <Typography variant="body2" fontWeight="800" color={selectedActivity.id === act.id ? '#1d4ed8' : '#002855'}>
                  {act.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">₹{act.price} / Slot</Typography>
              </Box>
            </Box>
          ))}
        </Stack>

        {/* Slot Grid */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="subtitle1" fontWeight="800">{selectedActivity.name} Slots</Typography>
              <Typography variant="caption" color="text.secondary">Select up to 2 continuous slots</Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <IconButton size="small" sx={{ border: '1px solid #e2e8f0' }}><BeforeIcon /></IconButton>
              <IconButton size="small" sx={{ border: '1px solid #e2e8f0' }}><NextIcon /></IconButton>
            </Stack>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 2 }}>
            {SLOTS.map((slot) => {
              const isSelected = selectedSlots.includes(slot);
              return (
                <Button
                  key={slot}
                  variant={isSelected ? "contained" : "outlined"}
                  onClick={() => handleSlotToggle(slot)}
                  sx={{ 
                    borderRadius: '12px', 
                    textTransform: 'none', 
                    fontWeight: 700,
                    height: 50,
                    borderColor: '#e2e8f0',
                    bgcolor: isSelected ? '#1d4ed8' : 'transparent',
                    color: isSelected ? 'white' : 'text.primary',
                    '&:hover': { bgcolor: isSelected ? '#1e40af' : '#f8fafc' }
                  }}
                >
                  {slot}
                </Button>
              );
            })}
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="caption" color="text.secondary">Selected Slots: {selectedSlots.length}</Typography>
              <Typography variant="h6" fontWeight="900">Total: ₹{selectedSlots.length * selectedActivity.price}</Typography>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<CartIcon />}
              disabled={selectedSlots.length === 0}
              sx={{ borderRadius: '12px', px: 4, height: 48, fontWeight: 800, textTransform: 'none', bgcolor: '#002855' }}
            >
              Add to Cart
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
