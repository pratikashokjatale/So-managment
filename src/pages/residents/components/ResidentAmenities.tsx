import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';

interface Booking {
  id: number;
  activity: string;
  slots: string;
  date: string;
  amount: string;
  status: string;
}

interface AmenitiesProps {
  bookings: Booking[];
}

export default function ResidentAmenities({ bookings }: AmenitiesProps) {
  return (
    <Box>
      <Typography variant="h6" fontWeight="900" color="#002855" sx={{ mb: 4 }}>Amenity Booking Ledger</Typography>
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '24px', border: '1px solid #e2e8f0', mb: 5 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>Activity</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Slots</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((b) => (
              <TableRow key={b.id} hover>
                <TableCell sx={{ fontWeight: 800, color: '#002855' }}>{b.activity}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{b.slots}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{b.date}</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>{b.amount}</TableCell>
                <TableCell>
                  <Chip 
                    label={b.status} 
                    size="small" 
                    sx={{ 
                      fontWeight: 800, 
                      bgcolor: b.status === 'Confirmed' ? '#f0fdf4' : '#f1f5f9', 
                      color: b.status === 'Confirmed' ? '#10b981' : '#64748b' 
                    }} 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
