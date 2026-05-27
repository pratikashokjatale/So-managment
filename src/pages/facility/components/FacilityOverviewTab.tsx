import { Box, Typography, Divider, Grid, Stack, Avatar, Chip } from '@mui/material';

interface StaffMember {
  id?: string;
  name: string;
  avatar?: string;
  profilePhotoUrl?: string;
  designation?: string;
  department?: string;
  status?: string;
}

interface FacilityOverviewTabProps {
  facility: {
    description: string;
    openingTime: string;
    closingTime: string;
    availableDays?: string[];
    advanceBookingDays: number;
    cancellationHours: number;
    rules?: string;
    staffMembers?: StaffMember[];
  };
}

export default function FacilityOverviewTab({ facility }: FacilityOverviewTabProps) {
  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h6" fontWeight="800" color="#091542" sx={{ mb: 1.5 }}>
          Description
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, fontWeight: 500 }}>
          {facility.description || 'No description provided.'}
        </Typography>
      </Box>

      <Divider />

      <Box>
        <Typography variant="h6" fontWeight="800" color="#091542" sx={{ mb: 2 }}>
          Operational Logistics
        </Typography>
        <Grid container spacing={2}>
          <Grid size={6}>
            <Typography variant="caption" color="text.secondary" fontWeight="800" display="block">OPERATIONAL HOURS</Typography>
            <Typography variant="body1" fontWeight="700" color="#1e293b">{facility.openingTime} - {facility.closingTime}</Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="caption" color="text.secondary" fontWeight="800" display="block">ACTIVE WEEK DAYS</Typography>
            <Typography variant="body1" fontWeight="700" color="#1e293b">{facility.availableDays?.join(', ') || 'All Days'}</Typography>
          </Grid>
          <Grid size={6} sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary" fontWeight="800" display="block">BOOKING CONSTRAINT</Typography>
            <Typography variant="body1" fontWeight="700" color="#1e293b">Max {facility.advanceBookingDays} days advance</Typography>
          </Grid>
          <Grid size={6} sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary" fontWeight="800" display="block">CANCELLATION POLICY</Typography>
            <Typography variant="body1" fontWeight="700" color="#1e293b">Cancel before {facility.cancellationHours} hours</Typography>
          </Grid>
        </Grid>
      </Box>

      {facility.rules && (
        <>
          <Divider />
          <Box>
            <Typography variant="h6" fontWeight="800" color="#091542" sx={{ mb: 1.5 }}>
              Rules & Guidelines
            </Typography>
            <Box sx={{ p: 2.5, bgcolor: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
              <Typography variant="body2" color="#091542" fontWeight="600" sx={{ lineHeight: 1.6 }}>
                {facility.rules}
              </Typography>
            </Box>
          </Box>
        </>
      )}

      {facility.staffMembers && facility.staffMembers.length > 0 && (
        <>
          <Divider />
          <Box>
            <Typography variant="h6" fontWeight="800" color="#091542" sx={{ mb: 2 }}>
              Assigned Staff
            </Typography>
            <Stack spacing={2}>
              {facility.staffMembers.map((staff, idx) => (
                <Box key={staff.id || idx}>
                  <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={staff.profilePhotoUrl || staff.avatar} sx={{ width: 38, height: 38 }} />
                      <Box>
                        <Typography variant="body2" fontWeight="800" color="#091542">{staff.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{staff.designation || 'Staff'}</Typography>
                      </Box>
                    </Stack>
                    <Chip label={staff.status || 'ACTIVE'} size="small" sx={{ fontWeight: 800, borderRadius: '8px', bgcolor: '#f0fdf4', color: '#10b981' }} />
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
        </>
      )}
    </Stack>
  );
}
