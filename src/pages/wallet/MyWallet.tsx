import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {
  getWalletApi,
  getWalletTransactionsApi,
  createWalletRechargeOrderApi,
  verifyWalletRechargeApi
} from '@/apis/wallet';
import StatusBadge from '@/components/StatusBadge';
import Pagination from '@/components/Pagination';

// Declare Razorpay on window
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

export default function MyWallet() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalResults, setTotalResults] = useState(0);

  // Recharge Modal
  const [rechargeModalOpen, setRechargeModalOpen] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [recharging, setRecharging] = useState(false);

  useEffect(() => {
    fetchWalletData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  const fetchWalletData = async () => {
    setLoading(true);
    try {
      const walletRes = await getWalletApi();
      if (walletRes.success) setWallet(walletRes.data);

      const txRes = await getWalletTransactionsApi({ page, limit: rowsPerPage });
      if (txRes.success) {
        setTransactions(txRes.data.items || []);
        setTotalResults(txRes.data.total || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecharge = async () => {
    if (!rechargeAmount || isNaN(Number(rechargeAmount)) || Number(rechargeAmount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    setRecharging(true);
    try {
      // 1. Create order
      const orderRes = await createWalletRechargeOrderApi({
        amount: Number(rechargeAmount),
        notes: "Recharge from app"
      });

      if (!orderRes.success) throw new Error(orderRes.message);

      const { razorpay, recharge } = orderRes.data;

      // 2. Open Razorpay
      const options = {
        key: razorpay.keyId,
        amount: razorpay.amount,
        currency: razorpay.currency,
        name: "Society Management",
        description: "Wallet Recharge",
        order_id: razorpay.orderId,
        handler: async function (response: any) {
          // 3. Verify
          try {
            await verifyWalletRechargeApi({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });
            alert("Recharge successful!");
            setRechargeModalOpen(false);
            setRechargeAmount('');
            fetchWalletData();
          } catch (err) {
            console.error("Verification failed", err);
            alert("Payment verification failed.");
          }
        },
        theme: {
          color: "#091542"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        console.error(response.error);
        alert("Payment failed: " + response.error.description);
      });
      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Failed to initiate recharge.");
    } finally {
      setRecharging(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#ffffff', minHeight: '100vh', borderRadius: 2 }}>
      
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#091542' }}>
          My Wallet
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setRechargeModalOpen(true)}
          sx={{ 
            bgcolor: '#0047b3', 
            fontWeight: 600, 
            px: 3, 
            py: 1, 
            borderRadius: 2,
            textTransform: 'none',
            '&:hover': { bgcolor: '#003380' } 
          }}
        >
          Recharge Wallet
        </Button>
      </Box>

      {/* Balance Card */}
      <Paper elevation={0} sx={{ p: 4, mb: 5, borderRadius: 4, bgcolor: '#091542', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 8px 32px rgba(9,21,66,0.15)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}>
            <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 40 }} />
          </Box>
          <Box>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.5, fontWeight: 500 }}>
              Available Balance
            </Typography>
            <Typography variant="h3" fontWeight="800">
              ₹ {wallet ? wallet.balance : '0.00'}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.5 }}>Status</Typography>
          <StatusBadge status={wallet?.status || 'ACTIVE'} variantType="chip" />
        </Box>
      </Paper>

      {/* Transactions */}
      <Typography variant="h6" fontWeight="700" sx={{ mb: 3, color: '#091542' }}>
        Recent Transactions
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}><CircularProgress /></Box>
      ) : (
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
      )}

      {!loading && transactions.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Pagination 
            page={page} 
            totalResults={totalResults} 
            rowsPerPage={rowsPerPage} 
            onPageChange={(_, val) => setPage(val)} 
            onRowsPerPageChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(1); }} 
            rowsPerPageOptions={[10, 20, 50]}
          />
        </Box>
      )}

      {/* Recharge Modal */}
      <Dialog open={rechargeModalOpen} onClose={() => !recharging && setRechargeModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#091542' }}>Recharge Wallet</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Enter the amount you would like to add to your wallet. You will be redirected to a secure payment gateway.
          </Typography>
          <TextField
            fullWidth
            label="Amount (₹)"
            type="number"
            value={rechargeAmount}
            onChange={(e) => setRechargeAmount(e.target.value)}
            disabled={recharging}
            InputProps={{
              sx: { borderRadius: 2 }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setRechargeModalOpen(false)} disabled={recharging} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleRecharge} 
            variant="contained" 
            disabled={recharging}
            sx={{ bgcolor: '#0047b3', px: 4, borderRadius: 2, textTransform: 'none', '&:hover': { bgcolor: '#003380' } }}
          >
            {recharging ? <CircularProgress size={24} color="inherit" /> : 'Proceed to Pay'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
