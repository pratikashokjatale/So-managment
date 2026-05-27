import { Box, Typography, CircularProgress, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Stack, IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import StatusBadge from '@/components/StatusBadge';

interface UserInfo {
  name: string;
  role: string;
}

interface BookingRow {
  id: string;
  startTime: string;
  endTime: string;
  bookingCode: string;
  status: string;
  user: UserInfo;
}

interface FacilityBookingsTabProps {
  bookings: BookingRow[];
  loading: boolean;
  actionLoading: boolean;
  handleApproveBooking: (id: string) => void;
  handleRejectBooking: (id: string) => void;
}

export default function FacilityBookingsTab({
  bookings,
  loading,
  actionLoading,
  handleApproveBooking,
  handleRejectBooking
}: FacilityBookingsTabProps) {
  return (
    <Box>
      <Typography variant="h6" fontWeight="800" color="#091542" sx={{ mb: 2.5 }}>
        Today's Schedule Overview
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress size={30} />
        </Box>
      ) : bookings.length === 0 ? (
        <Box sx={{ py: 6, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: '16px' }}>
          <Typography variant="body2" color="text.secondary" fontWeight="700">
            No bookings registered for today yet.
          </Typography>
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Time Slot</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Member</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Code</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569', textAlign: 'right' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell sx={{ fontWeight: 700, color: '#0f172a' }}>
                    {row.startTime?.substring(0, 5)} - {row.endTime?.substring(0, 5)}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="700">{row.user?.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{row.user?.role}</Typography>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#1e3a8a' }}>{row.bookingCode}</TableCell>
                  <TableCell>
                    <StatusBadge status={row.status} variantType="text" />
                  </TableCell>
                  <TableCell align="right">
                    {row.status === 'PENDING' ? (
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <IconButton 
                          size="small" 
                          color="success" 
                          onClick={() => handleApproveBooking(row.id)}
                          disabled={actionLoading}
                        >
                          <CheckIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => handleRejectBooking(row.id)}
                          disabled={actionLoading}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    ) : (
                      <Typography variant="caption" color="text.secondary" fontWeight="700">Processed</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
