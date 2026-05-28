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
      <Typography variant="h6" fontWeight="900" color="#091542" sx={{ mb: 4 }}>Amenity Booking Ledger</Typography>
      <TableContainer component={Paper} elevation={0} sx={{ 
        borderRadius: '24px', 
        border: '1px solid rgba(226, 232, 240, 0.8)', 
        mb: 5,
        boxShadow: '0 4px 20px rgba(9, 21, 66, 0.01)'
      }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.75rem', letterSpacing: '0.5px', py: 2 }}>ACTIVITY</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.75rem', letterSpacing: '0.5px', py: 2 }}>SLOTS</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.75rem', letterSpacing: '0.5px', py: 2 }}>DATE</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.75rem', letterSpacing: '0.5px', py: 2, textAlign: 'right' }}>AMOUNT</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.75rem', letterSpacing: '0.5px', py: 2, pl: 4 }}>STATUS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((b) => (
              <TableRow 
                key={b.id} 
                hover
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  transition: 'background-color 0.2s ease'
                }}
              >
                <TableCell sx={{ fontWeight: 800, color: '#091542', py: 2.5 }}>{b.activity}</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2.5 }}>{b.slots}</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2.5 }}>{b.date}</TableCell>
                <TableCell sx={{ fontWeight: 900, color: '#091542', py: 2.5, textAlign: 'right', fontFamily: 'monospace', fontSize: '0.95rem' }}>{b.amount}</TableCell>
                <TableCell sx={{ py: 2.5, pl: 4 }}>
                  <Chip 
                    label={b.status} 
                    size="small" 
                    sx={{ 
                      fontWeight: 800, 
                      fontSize: '0.75rem',
                      borderRadius: '8px',
                      bgcolor: b.status === 'Confirmed' ? '#ecfdf5' : '#f1f5f9', 
                      color: b.status === 'Confirmed' ? '#10b981' : '#64748b',
                      border: b.status === 'Confirmed' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(100, 116, 139, 0.1)'
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
