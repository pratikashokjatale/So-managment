import { Box, Stack, Typography, Button, CircularProgress, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface PlanRow {
  id: string;
  name: string;
  code: string;
  durationDays: number;
  priceAmount: number;
  priceCurrency: string;
  requiresApproval: boolean;
  maxUsesPerDay?: number | null;
}

interface FacilityPlansTabProps {
  accessType: string;
  plans: PlanRow[];
  loading: boolean;
  setCreatePlanOpen: (open: boolean) => void;
}

export default function FacilityPlansTab({
  accessType,
  plans = [],
  loading,
  setCreatePlanOpen
}: FacilityPlansTabProps) {
  const plansList = Array.isArray(plans) ? plans : [];

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight="800" color="#091542">
          Subscription Packages
        </Typography>
        {(accessType === 'SUBSCRIPTION' || accessType === 'MIXED') && (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => setCreatePlanOpen(true)}
            sx={{ textTransform: 'none', borderRadius: '12px', boxShadow: 'none' }}
          >
            Add Plan
          </Button>
        )}
      </Stack>

      {accessType !== 'SUBSCRIPTION' && accessType !== 'MIXED' && (
        <Box sx={{ p: 3, bgcolor: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '16px', mb: 3 }}>
          <Typography variant="body2" color="#b45309" fontWeight="700">
            Notice: This facility's access model is configured as Slot-based. subscription packages can only be created for facilities with Access Type set to SUBSCRIPTION or MIXED.
          </Typography>
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress size={30} />
        </Box>
      ) : plansList.length === 0 ? (
        <Box sx={{ py: 6, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: '16px' }}>
          <Typography variant="body2" color="text.secondary" fontWeight="700">
            No subscription plans defined for this facility.
          </Typography>
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Name (Code)</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Duration</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Requires Approval</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Usage Limit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {plansList.map((plan) => (
                <TableRow key={plan.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="700" color="#091542">{plan.name}</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight="600">{plan.code}</Typography>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{plan.durationDays} Days</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#0f172a' }}>
                    {plan.priceAmount} {plan.priceCurrency}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={plan.requiresApproval ? "Yes" : "Auto-Approve"} 
                      size="small" 
                      color={plan.requiresApproval ? "warning" : "success"}
                      sx={{ fontWeight: 800, borderRadius: '8px' }} 
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    {plan.maxUsesPerDay ? `${plan.maxUsesPerDay}/day` : 'Unlimited'}
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
