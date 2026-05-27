import { Box, Typography, CircularProgress, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Button } from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import StatusBadge from '@/components/StatusBadge';

interface User {
  name: string;
}

interface Plan {
  name: string;
}

interface SubscriptionRow {
  id: string;
  userId: string;
  paymentStatus: string;
  status: string;
  endDate?: string;
  user?: User;
  plan?: Plan;
}

interface FacilitySubscriptionsTabProps {
  subscriptions: SubscriptionRow[];
  loading: boolean;
  actionLoading: boolean;
  openPaymentDialog: (sub: SubscriptionRow) => void;
  handleApproveSub: (id: string) => void;
  openRejectDialog: (sub: SubscriptionRow) => void;
  handleCancelSub: (id: string) => void;
}

export default function FacilitySubscriptionsTab({
  subscriptions = [],
  loading,
  actionLoading,
  openPaymentDialog,
  handleApproveSub,
  openRejectDialog,
  handleCancelSub
}: FacilitySubscriptionsTabProps) {
  const subscriptionsList = Array.isArray(subscriptions) ? subscriptions : [];

  return (
    <Box>
      <Typography variant="h6" fontWeight="800" color="#091542" sx={{ mb: 2.5 }}>
        Active Subscriptions
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress size={30} />
        </Box>
      ) : subscriptionsList.length === 0 ? (
        <Box sx={{ py: 6, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: '16px' }}>
          <Typography variant="body2" color="text.secondary" fontWeight="700">
            No active member subscriptions for this facility.
          </Typography>
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Member</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Plan</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Payment</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569', textAlign: 'right' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subscriptionsList.map((sub) => (
                <TableRow key={sub.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="700" color="#0f172a">
                      {sub.user?.name || `User ID: ${sub.userId?.substring(0, 8)}...`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Expires: {sub.endDate ? sub.endDate.split('T')[0] : 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{sub.plan?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <StatusBadge status={sub.paymentStatus} variantType="text" />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={sub.status} variantType="text" />
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    <IconButton size="small" onClick={() => openPaymentDialog(sub)} title="Update Payment Status">
                      <PaymentIcon fontSize="small" />
                    </IconButton>
                    {sub.status === 'PENDING_APPROVAL' && (
                      <>
                        <IconButton 
                          size="small" 
                          color="success" 
                          onClick={() => handleApproveSub(sub.id)}
                          disabled={actionLoading}
                          title="Approve"
                        >
                          <CheckIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => openRejectDialog(sub)}
                          disabled={actionLoading}
                          title="Reject"
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </>
                    )}
                    {sub.status !== 'CANCELLED' && (
                      <Button 
                        size="small" 
                        color="warning" 
                        onClick={() => handleCancelSub(sub.id)}
                        disabled={actionLoading}
                        sx={{ textTransform: 'none', ml: 0.5 }}
                      >
                        Cancel
                      </Button>
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
