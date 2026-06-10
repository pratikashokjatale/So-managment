import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow,
  Select, MenuItem, Link, Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import Pagination from '../../components/Pagination';
import StatusBadge from '../../components/StatusBadge';
import Search from '@/components/Search';

import { getWalletTransactionsApi } from '@/apis/wallet';
import { getUsersApi } from '@/apis/user';
import CircularProgress from '@mui/material/CircularProgress';

export default function GetPayment() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [userMap, setUserMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchAllUsers = async () => {
      const map: Record<string, string> = {};
      let pageNum = 1;
      const limit = 100;
      let hasMore = true;
      const maxPages = 20; // safety limit (2000 users)

      while (hasMore && pageNum <= maxPages) {
        try {
          const res = await getUsersApi({ page: pageNum, limit });
          const d = res?.data || res;
          const list = d?.items || (Array.isArray(d) ? d : []);
          
          if (list.length === 0) {
            hasMore = false;
            break;
          }

          list.forEach((u: any) => {
            if (u.id) map[u.id] = u.name;
          });

          const total = d?.pagination?.total || d?.total || 0;
          if (list.length < limit || Object.keys(map).length >= total) {
            hasMore = false;
          } else {
            pageNum += 1;
          }
        } catch (err) {
          console.error("Failed to load users for mapping:", err);
          hasMore = false;
        }
      }
      setUserMap(map);
    };

    fetchAllUsers();
  }, []);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    fetchTransactions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, typeFilter]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const params: any = { page, limit: rowsPerPage };
      if (typeFilter !== 'All Types') {
        params.type = typeFilter.toUpperCase();
      }
      
      const res = await getWalletTransactionsApi(params);
      if (res.success) {
        setTransactions(res.data?.items || []);
        setTotalResults(res.data?.pagination?.total || res.data?.total || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (_event: any, value: number) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  // Client side filtering for search query and status filter
  const filteredTransactions = transactions.filter((row) => {
    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const userName = (row.user?.name || userMap[row.userId] || '').toLowerCase();
      const userId = (row.userId || '').toLowerCase();
      const notes = (row.remarks || row.notes || '').toLowerCase();
      const type = (row.type || '').toLowerCase();
      const status = (row.status || '').toLowerCase();
      const amount = String(row.amount);
      const id = String(row.id).toLowerCase();
      if (
        !userName.includes(q) && 
        !userId.includes(q) && 
        !notes.includes(q) && 
        !type.includes(q) && 
        !status.includes(q) && 
        !amount.includes(q) && 
        !id.includes(q)
      ) {
        return false;
      }
    }
    // Status filter
    if (statusFilter !== 'All Status') {
      if ((row.status || '').toUpperCase() !== statusFilter.toUpperCase()) {
        return false;
      }
    }
    return true;
  });

  const StatCard = ({ title, amount, percentage, color }: { title: string, amount: string, percentage: string, color: string }) => (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid #f0f0f0', borderRadius: 4 }}>
      <Typography variant="body2" color="text.secondary" fontWeight="500" gutterBottom>{title}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#091542' }}>{amount}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', color: color }}>
          <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body2" fontWeight="600">{percentage}</Typography>
        </Box>
      </Box>
    </Paper>
  );

  const filterSelectSx = {
    height: 40,
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'text.primary',
    borderRadius: '10px',
    bgcolor: '#f8fafc',
    '.MuiOutlinedInput-notchedOutline': { border: 'none' },
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#ffffff', minHeight: '100vh', borderRadius: 2 }}>
      
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: '#091542' }}>
          Wallet Transactions
        </Typography>
      </Box>

      {/* Stats Section */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3, mb: 5 }}>
        <Box>
          <StatCard title="Total Collection (May)" amount="₹45,230" percentage="+20%" color="#4caf50" />
        </Box>
        <Box>
          <StatCard title="Credits" amount="₹32,150" percentage="+10%" color="#4caf50" />
        </Box>
        <Box>
          <StatCard title="Debits" amount="₹13,080" percentage="+10%" color="#4caf50" />
        </Box>
      </Box>

      {/* Filters Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as string)} sx={filterSelectSx}>
            <MenuItem value="All Types">All Types</MenuItem>
            <MenuItem value="Credit">Credit</MenuItem>
            <MenuItem value="Debit">Debit</MenuItem>
            <MenuItem value="Refund">Refund</MenuItem>
            <MenuItem value="Adjustment">Adjustment</MenuItem>
          </Select>
          {/* <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as string)} sx={filterSelectSx}>
            <MenuItem value="All Status">All Status</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Failed">Failed</MenuItem>
            <MenuItem value="Refunded">Refunded</MenuItem>
          </Select> */}
          <Search 
            placeholder="Search transactions..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: { xs: '100%', md: 300 }, '& fieldset': { borderRadius: '10px' } }}
          />
        </Box>
        <Button 
          variant="text" 
          startIcon={<DownloadIcon />} 
          sx={{ color: 'text.primary', fontWeight: 600, textTransform: 'none' }}
        >
          Export
        </Button>
      </Box>

      {/* Table Section */}
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 900 }} aria-label="transactions table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: '1px solid #f0f0f0' }}>Date</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: '1px solid #f0f0f0' }}>Time</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: '1px solid #f0f0f0' }}>User</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: '1px solid #f0f0f0' }}>Type</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: '1px solid #f0f0f0' }}>Transaction ID</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: '1px solid #f0f0f0' }}>Amount</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: '1px solid #f0f0f0' }}>Reference</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0', py: 2.5 }}>
                    <Typography variant="body2" sx={{ color: '#091542', fontWeight: 500 }}>
                      {new Date(row.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0', py: 2.5 }}>
                    <Typography variant="body2" sx={{ color: '#091542', fontWeight: 500 }}>
                      {new Date(row.createdAt).toLocaleTimeString()}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                    <Typography variant="body2" sx={{ color: '#091542', fontWeight: 600 }}>{row.user?.name || userMap[row.userId] || row.userId || '-'}</Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                    <StatusBadge status={row.type} variantType="text" />
                  </TableCell>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                    <Typography variant="body2" sx={{ color: '#0047b3', fontWeight: 600 }}>
                      #{row.id.substring(0,8).toUpperCase()}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0', fontWeight: 700, color: row.type === 'CREDIT' ? '#10b981' : '#ef4444' }}>
                    {row.type === 'CREDIT' ? '+' : '-'}₹{row.amount}
                  </TableCell>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                    <StatusBadge status={row.referenceType || '-'} variantType="text" />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Section */}
      <Box sx={{ mt: 3 }}>
        <Pagination 
          page={page} 
          totalResults={totalResults} 
          rowsPerPage={rowsPerPage} 
          onPageChange={handlePageChange} 
          onRowsPerPageChange={handleRowsPerPageChange} 
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>

    </Box>
  );
}
