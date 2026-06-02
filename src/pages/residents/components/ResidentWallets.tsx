import { 
  Box, Typography, Paper, Grid, Stack, Chip, Divider, 
  List, ListItem, ListItemText, ListItemIcon, Button, Dialog, DialogTitle, DialogContent, TextField, Select, MenuItem, DialogActions, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { 
  AccountBalanceWallet as WalletIcon, 
  CheckCircle as SuccessIcon, 
  Timeline as TimelineIcon,
  Security as SecurityIcon,
  History as HistoryIcon
} from '@mui/icons-material';

import { adminRechargeUserWalletApi, getWalletTransactionsApi } from '@/apis/wallet';
import { useState, useEffect } from 'react';
import StatusBadge from '@/components/StatusBadge';
import Pagination from '@/components/Pagination';
import MembershipDetailsDialog from '@/pages/membership/components/MembershipDetailsDialog';

interface WalletProps {
  userId: string;
  onWalletUpdated?: (newBalance: number) => void;
  wallets: {
    membership: { 
      status: string; 
      currentMonth: string;
      upcomingMonths: string[];
      expiry: string;
      refundableFuture: string;
    };
    activity: { balance: string };
    security: { locked: string; refundable: string; condition: string };
  };
  activeSubscriptions?: any[];
}

export default function ResidentWallets({ userId, onWalletUpdated, wallets, activeSubscriptions = [] }: WalletProps) {
  const [rechargeModalOpen, setRechargeModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('CASH');
  const [referenceId, setReferenceId] = useState('');
  const [remarks, setRemarks] = useState('');
  const [recharging, setRecharging] = useState(false);

  // Transaction state
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalResults, setTotalResults] = useState(0);

  // Subscription detail modal state
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);
  const [subscriptionDetailOpen, setSubscriptionDetailOpen] = useState(false);

  const fetchTransactions = async () => {
    if (!userId) return;
    setLoadingTransactions(true);
    try {
      const res = await getWalletTransactionsApi({
        userId,
        page,
        limit: rowsPerPage
      });
      if (res?.success) {
        setTransactions(res.data?.items || []);
        setTotalResults(res.data?.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoadingTransactions(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, page, rowsPerPage]);

  const handleRecharge = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    setRecharging(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await adminRechargeUserWalletApi(userId, {
        amount: Number(amount),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        method: method as any,
        referenceId,
        remarks
      });
      alert("Wallet recharged successfully!");
      setRechargeModalOpen(false);
      setAmount('');
      setReferenceId('');
      setRemarks('');
      
      if (onWalletUpdated && res?.data?.wallet?.balance !== undefined) {
        onWalletUpdated(res.data.wallet.balance);
      }
      fetchTransactions();
    } catch (err: any) {
      alert(err?.message || "Failed to recharge wallet.");
    } finally {
      setRecharging(false);
    }
  };

  return (
    <Box>
      <Grid container spacing={4}>
        {/* Triple Wallet Summary */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ 
            p: 4, 
            borderRadius: '32px', 
            border: '1px solid rgba(226, 232, 240, 0.8)', 
            bgcolor: 'white', 
            height: '100%',
            boxShadow: '0 10px 30px rgba(0,0,0,0.01)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'all 0.3s ease',
            '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 20px 40px rgba(49, 46, 129, 0.08)' }
          }}>
            <Box>
              <Stack direction="row" spacing={2.5} alignItems="center" sx={{ mb: 4 }}>
                <Box sx={{ p: 1.5, bgcolor: 'rgba(49, 46, 129, 0.06)', borderRadius: '14px', color: '#312e81' }}><WalletIcon /></Box>
                <Typography variant="h6" fontWeight="900" color="#091542">Membership Wallet</Typography>
              </Stack>
              
              {/* Virtual Membership Card */}
              <Box sx={{
                p: 3,
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                mb: 4,
                boxShadow: '0 12px 28px rgba(30, 27, 75, 0.25)'
              }}>
                <Box sx={{ 
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                  background: 'radial-gradient(circle at 10% 10%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 80%)'
                }} />
                <Typography variant="caption" sx={{ letterSpacing: '1px', opacity: 0.8, fontWeight: 800 }}>MEMBERSHIP STATUS</Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.5, mb: 3 }}>
                  <Typography variant="h5" fontWeight="900" sx={{ letterSpacing: '-0.5px' }}>{wallets.membership.status}</Typography>
                  <Chip label="Monthly Based" size="small" sx={{ fontWeight: 900, bgcolor: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '0.65rem' }} />
                </Stack>
                
                {activeSubscriptions && activeSubscriptions.length > 0 ? (
                  <Box>
                    <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 700, display: 'block', mb: 1 }}>
                      ACTIVE PERIODS
                    </Typography>
                    <Stack 
                      spacing={1} 
                      sx={{ 
                        maxHeight: 145, 
                        overflowY: 'auto',
                        pr: 0.5,
                        '&::-webkit-scrollbar': { width: '4px' },
                        '&::-webkit-scrollbar-track': { background: 'rgba(255, 255, 255, 0.05)' },
                        '&::-webkit-scrollbar-thumb': { background: 'rgba(255, 255, 255, 0.2)', borderRadius: '2px' }
                      }}
                    >
                      {activeSubscriptions.map((sub) => (
                        <Box 
                          key={sub.id} 
                          onClick={() => {
                            setSelectedSubscription(sub);
                            setSubscriptionDetailOpen(true);
                          }}
                          sx={{ 
                            p: 1.25, 
                            borderRadius: '12px', 
                            bgcolor: 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            '&:hover': {
                              bgcolor: 'rgba(255,255,255,0.15)',
                              transform: 'translateY(-1px)'
                            }
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" fontWeight="800">
                              {sub.plan?.name || sub.facility?.name || 'Subscription'}
                            </Typography>
                            <Chip 
                              label="ACTIVE" 
                              size="small" 
                              sx={{ 
                                height: 16, 
                                fontSize: '0.55rem', 
                                fontWeight: 900, 
                                bgcolor: 'rgba(16,185,129,0.2)', 
                                color: '#10b981',
                                borderRadius: '4px'
                              }} 
                            />
                          </Stack>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0.5 }}>
                            <Typography variant="caption" sx={{ display: 'block', opacity: 0.7, fontSize: '0.7rem' }}>
                              Expires: {sub.endsAt ? new Date(sub.endsAt).toLocaleDateString() : 'N/A'}
                            </Typography>
                            <Typography variant="body2" fontWeight="900" sx={{ color: 'rgba(255,255,255,0.95)' }}>
                              ₹{parseFloat(sub.amount || 0).toLocaleString('en-IN')}
                            </Typography>
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                ) : (
                  <>
                    <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 700, display: 'block' }}>ACTIVE PERIOD</Typography>
                    <Typography variant="body2" fontWeight="800" sx={{ mt: 0.5 }}>{wallets.membership.currentMonth}</Typography>
                  </>
                )}
              </Box>
            </Box>

            <Box>
              <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />
              <Typography variant="caption" fontWeight="800" color="#94a3b8" sx={{ letterSpacing: '0.5px' }}>REFUNDABLE BALANCE (UPCOMING)</Typography>
              <Typography variant="h4" fontWeight="900" color="#312e81" sx={{ mt: 1, mb: 0.5 }}>{wallets.membership.refundableFuture}</Typography>
              <Typography variant="caption" color="#64748b" fontWeight="700">Valid for unused future months only</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ 
            p: 4, 
            borderRadius: '32px', 
            border: '1px solid rgba(226, 232, 240, 0.8)', 
            bgcolor: 'white', 
            height: '100%',
            boxShadow: '0 10px 30px rgba(0,0,0,0.01)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'all 0.3s ease',
            '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 20px 40px rgba(6, 95, 70, 0.08)' }
          }}>
            <Box>
              <Stack direction="row" spacing={2.5} alignItems="center" sx={{ mb: 4 }}>
                <Box sx={{ p: 1.5, bgcolor: 'rgba(6, 95, 70, 0.06)', borderRadius: '14px', color: '#065f46' }}><TimelineIcon /></Box>
                <Typography variant="h6" fontWeight="900" color="#091542">Activity Wallet</Typography>
              </Stack>
              
              {/* Virtual Activity Card */}
              <Box sx={{
                p: 3,
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #065f46 0%, #022c22 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                mb: 4,
                boxShadow: '0 12px 28px rgba(2, 44, 34, 0.25)'
              }}>
                <Box sx={{ 
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                  background: 'radial-gradient(circle at 10% 10%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 80%)'
                }} />
                <Typography variant="caption" sx={{ letterSpacing: '1px', opacity: 0.8, fontWeight: 800 }}>AVAILABLE BALANCE</Typography>
                <Typography variant="h3" fontWeight="900" sx={{ mt: 1.5, mb: 3, letterSpacing: '-1px' }}>{wallets.activity.balance}</Typography>
                <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 700, display: 'block' }}>REVENUE ENGINE</Typography>
                <Typography variant="body2" fontWeight="800" sx={{ mt: 0.5 }}>Auto-Debit Enabled</Typography>
              </Box>
            </Box>

            <Box>
              <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />
              <List disablePadding>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}><SuccessIcon sx={{ color: '#10b981', fontSize: 18 }} /></ListItemIcon>
                  <ListItemText primary={<Typography variant="body2" fontWeight="700" color="#1e293b">In-App Recharge Enabled</Typography>} />
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}><SuccessIcon sx={{ color: '#10b981', fontSize: 18 }} /></ListItemIcon>
                  <ListItemText primary={<Typography variant="body2" fontWeight="700" color="#1e293b">Auto-Debit on Checkout</Typography>} />
                </ListItem>
              </List>
              <Button 
                variant="outlined" 
                fullWidth 
                onClick={() => setRechargeModalOpen(true)}
                sx={{ mt: 2, borderRadius: 2, color: '#065f46', borderColor: 'rgba(6, 95, 70, 0.5)', '&:hover': { borderColor: '#065f46', bgcolor: 'rgba(6, 95, 70, 0.05)' } }}
              >
                Admin Recharge
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ 
            p: 4, 
            borderRadius: '32px', 
            border: '1px solid rgba(226, 232, 240, 0.8)', 
            bgcolor: '#091542', 
            color: 'white', 
            height: '100%',
            boxShadow: '0 12px 36px rgba(9, 21, 66, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'all 0.3s ease',
            '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 20px 40px rgba(9, 21, 66, 0.25)' }
          }}>
            <Box>
              <Stack direction="row" spacing={2.5} alignItems="center" sx={{ mb: 4 }}>
                <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '14px', color: 'white' }}><SecurityIcon /></Box>
                <Typography variant="h6" fontWeight="900">Security Deposit</Typography>
              </Stack>
              
              {/* Virtual Security Card */}
              <Box sx={{
                p: 3,
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #111827 0%, #030712 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                mb: 4,
                boxShadow: '0 12px 28px rgba(3, 7, 18, 0.35)',
                border: '1px solid rgba(255,255,255,0.15)'
              }}>
                <Box sx={{ 
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                  background: 'radial-gradient(circle at 10% 10%, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 80%)'
                }} />
                <Typography variant="caption" sx={{ letterSpacing: '1px', opacity: 0.8, fontWeight: 800 }}>LOCKED DEPOSIT</Typography>
                <Typography variant="h3" fontWeight="900" sx={{ mt: 1.5, mb: 3, letterSpacing: '-1px' }}>{wallets.security.locked}</Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 700 }}>REFUND ELIGIBILITY</Typography>
                  <Chip label={wallets.security.refundable} size="small" sx={{ bgcolor: 'white', color: '#091542', fontWeight: 900, fontSize: '0.65rem', height: 20 }} />
                </Stack>
              </Box>
            </Box>

            <Box>
              <Divider sx={{ mb: 3, borderColor: 'rgba(255,255,255,0.15)', borderStyle: 'dashed' }} />
              <Stack spacing={1.5}>
                <Typography variant="caption" fontWeight="800" sx={{ color: 'rgba(255,255,255,0.6)', letterSpacing: '0.5px' }}>REFUND POLICY</Typography>
                <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.85)' }}>• Full refund on undamaged card return</Typography>
                <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.85)' }}>• Deductions apply for damaged fobs</Typography>
              </Stack>
            </Box>
          </Paper>
        </Grid>

        {/* Detailed Membership Timeline */}
        <Grid size={{ xs: 12 }}>
          <Paper elevation={0} sx={{ 
            p: 4, 
            borderRadius: '32px', 
            border: '1px solid #e2e8f0', 
            bgcolor: 'white',
            boxShadow: '0 10px 30px rgba(0,0,0,0.01)'
          }}>
            <Stack direction="row" spacing={2.5} alignItems="center" sx={{ mb: 4 }}>
              <Box sx={{ p: 1, bgcolor: 'rgba(9, 21, 66, 0.05)', borderRadius: '10px', color: '#091542' }}><HistoryIcon /></Box>
              <Typography variant="h6" fontWeight="900" color="#091542">Transaction History</Typography>
            </Stack>

            {loadingTransactions ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TableContainer sx={{ overflowX: 'auto', border: '1px solid #f1f5f9', borderRadius: 3 }}>
                  <Table sx={{ minWidth: 700 }}>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Amount</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Notes</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transactions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                            No transactions found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        transactions.map((tx) => (
                          <TableRow key={tx.id} hover>
                            <TableCell sx={{ color: '#091542', fontWeight: 500 }}>
                              {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString()}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={tx.type} variantType="text" />
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700, color: tx.type === 'CREDIT' ? '#10b981' : (tx.type === 'DEBIT' ? '#ef4444' : '#091542') }}>
                              {tx.type === 'CREDIT' ? '+' : (tx.type === 'DEBIT' ? '-' : '')}₹{tx.amount}
                            </TableCell>
                            <TableCell sx={{ color: 'text.secondary' }}>{tx.notes || '-'}</TableCell>
                            <TableCell>
                              <StatusBadge status={tx.status} variantType="text" />
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                {!loadingTransactions && transactions.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Pagination 
                      page={page} 
                      totalResults={totalResults} 
                      rowsPerPage={rowsPerPage} 
                      onPageChange={(_, val) => setPage(val)} 
                      onRowsPerPageChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(1); }} 
                      rowsPerPageOptions={[5, 10, 15]}
                    />
                  </Box>
                )}
              </>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Admin Recharge Modal */}
      <Dialog open={rechargeModalOpen} onClose={() => !recharging && setRechargeModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#091542' }}>Admin Wallet Recharge</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Use this to credit the user's wallet manually if they paid offline via Cash, UPI, or Bank Transfer.
          </Typography>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Amount (₹)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={recharging}
            />
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Payment Method</Typography>
              <Select
                fullWidth
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                disabled={recharging}
              >
                <MenuItem value="CASH">Cash</MenuItem>
                <MenuItem value="UPI">UPI</MenuItem>
                <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
                <MenuItem value="MANUAL">Manual/Other</MenuItem>
              </Select>
            </Box>
            <TextField
              fullWidth
              label="Reference ID (Optional)"
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value)}
              disabled={recharging}
            />
            <TextField
              fullWidth
              label="Remarks (Optional)"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              disabled={recharging}
              multiline
              rows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setRechargeModalOpen(false)} disabled={recharging} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleRecharge} 
            variant="contained" 
            disabled={recharging}
            sx={{ bgcolor: '#065f46', px: 4, borderRadius: 2, textTransform: 'none', '&:hover': { bgcolor: '#022c22' } }}
          >
            {recharging ? <CircularProgress size={24} color="inherit" /> : 'Confirm Recharge'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Subscription Details Dialog */}
      {selectedSubscription && (
        <MembershipDetailsDialog 
          open={subscriptionDetailOpen}
          onClose={() => {
            setSubscriptionDetailOpen(false);
            setSelectedSubscription(null);
          }}
          membership={selectedSubscription}
          onRefresh={fetchTransactions}
        />
      )}
    </Box>
  );
}
