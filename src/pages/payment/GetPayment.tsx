import { useState } from 'react';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow,
  Select, MenuItem, Breadcrumbs, Link, Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import Pagination from '../../components/Pagination';
import StatusBadge from '../../components/StatusBadge';
import Search from '@/components/Search';

import { getPaymentsApi } from '@/apis/payment';
import CircularProgress from '@mui/material/CircularProgress';

export default function GetPayment() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [typeFilter, setTypeFilter] = useState('All Payments');
  const [statusFilter, setStatusFilter] = useState('All Status');
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  import('react').then(React => {
    React.useEffect(() => {
      fetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, rowsPerPage, typeFilter, statusFilter]);
  });

  const fetchPayments = async () => {
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const params: any = { page, limit: rowsPerPage };
      if (typeFilter !== 'All Payments') params.payableType = typeFilter.toUpperCase();
      if (statusFilter !== 'All Status') params.status = statusFilter.toUpperCase();
      
      const res = await getPaymentsApi(params);
      if (res.success) {
        setPayments(res.data.items || []);
        setTotalResults(res.data.total || 0);
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
          Payments
        </Typography>
</Box>

      {/* Stats Section */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3, mb: 5 }}>
        <Box>
          <StatCard title="Total Collection (May)" amount="₹45,230" percentage="+20%" color="#4caf50" />
        </Box>
        <Box>
          <StatCard title="Online Payments" amount="₹32,150" percentage="+10%" color="#4caf50" />
        </Box>
        <Box>
          <StatCard title="Cash Payments" amount="₹13,080" percentage="+10%" color="#4caf50" />
        </Box>
      </Box>

      {/* Filters Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as string)} sx={filterSelectSx}>
            <MenuItem value="All Payments">All Payments</MenuItem>
            <MenuItem value="Booking">Booking</MenuItem>
            <MenuItem value="Membership">Membership</MenuItem>
          </Select>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as string)} sx={filterSelectSx}>
            <MenuItem value="All Status">All Status</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Refunded">Refunded</MenuItem>
          </Select>
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
        <Table sx={{ minWidth: 900 }} aria-label="payments table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: '1px solid #f0f0f0' }}>Date</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: '1px solid #f0f0f0' }}>User</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: '1px solid #f0f0f0' }}>Type</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: '1px solid #f0f0f0' }}>Method</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: '1px solid #f0f0f0' }}>Amount</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: '1px solid #f0f0f0' }}>Status</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: '1px solid #f0f0f0' }}>Invoice</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No payments found.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0', py: 2.5 }}>
                    <Typography variant="body2" sx={{ color: '#091542', fontWeight: 500 }}>
                      {new Date(row.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                    <Typography variant="body2" sx={{ color: '#091542', fontWeight: 600 }}>{row.user?.name || '-'}</Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{row.payableType}</Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                    <Typography variant="body2" sx={{ color: '#091542' }}>{row.provider}</Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                    <Typography variant="body2" sx={{ color: '#091542', fontWeight: 700 }}>₹{row.amount}</Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                    <StatusBadge status={row.status} variantType="text" />
                  </TableCell>
                  <TableCell sx={{ borderBottomColor: '#f0f0f0' }}>
                    <Link href="#" underline="none" sx={{ fontWeight: 600, color: '#0047b3' }}>
                      #{row.id.substring(0,8).toUpperCase()}
                    </Link>
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
