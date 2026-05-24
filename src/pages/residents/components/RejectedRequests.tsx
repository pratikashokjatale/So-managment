import { useState, useEffect } from "react";
import {
  Box, Typography, Grid, Avatar, 
  Button, IconButton, CircularProgress, Chip, Stack, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { getUsersApi, updateUserApi } from "@/apis/user";
import { toast } from "react-hot-toast";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";

export default function RejectedRequests() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedResident, setSelectedResident] = useState<any>(null);

  const handleOpenDialog = (resident: any) => {
    setSelectedResident(resident);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedResident(null);
  };
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [rejectedResidents, setRejectedResidents] = useState<any[]>([]);
  const [rejectedTotal, setRejectedTotal] = useState(0);
  const [rejectedLoading, setRejectedLoading] = useState(false);

  const fetchRejectedResidents = async () => {
    setRejectedLoading(true);
    try {
      const res = await getUsersApi({
        page,
        limit: rowsPerPage,
        search: searchQuery || undefined,
        status: "SUSPENDED",
      });

      let list: any[] = [];
      if (res?.data && Array.isArray(res.data)) list = res.data;
      else if (res?.data?.items && Array.isArray(res.data.items)) list = res.data.items;
      else if (res?.data?.users && Array.isArray(res.data.users)) list = res.data.users;
      else if (Array.isArray(res)) list = res;
      else if (Array.isArray(res?.data)) list = res.data;
      
      const pagination = res?.data?.pagination || res?.pagination;
      setRejectedResidents(list);
      setRejectedTotal(pagination?.total || list.length);
    } catch (error) {
      console.warn("Failed to fetch rejected residents:", error);
      setRejectedResidents([]);
    } finally {
      setRejectedLoading(false);
    }
  };

  useEffect(() => {
    fetchRejectedResidents();
  }, [page, rowsPerPage, searchQuery]);

  const handleRestore = async (id: string, name: string) => {
    try {
      await updateUserApi(id, { status: "PENDING" });
      toast.success(`${name} restored to pending`);
      fetchRejectedResidents();
    } catch (error: any) {
      toast.error(error?.message || "Failed to restore resident");
    }
  };

  const handlePageChange = (_event: any, value: number) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" fontWeight="900" color="#002855">Rejected Requests</Typography>
          <Typography variant="body2" color="text.secondary">Residents whose enrollment was rejected or suspended.</Typography>
        </Box>
        <Chip label={`${rejectedTotal} Records`} color="error" sx={{ fontWeight: 800, borderRadius: '8px' }} />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Search
          placeholder="Search rejected residents..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
          sx={{ width: { xs: '100%', md: 350 }, '& fieldset': { borderRadius: '8px' } }}
        />
      </Box>

      {rejectedLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      ) : rejectedResidents.length === 0 ? (
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">No rejected residents found.</Typography>
        </Box>
      ) : (
        <TableContainer sx={{ overflowX: 'auto', border: '1px solid #f1f5f9', borderRadius: '12px' }}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead sx={{ bgcolor: '#fef2f2' }}>
              <TableRow>
                <TableCell sx={{ color: '#64748b', fontWeight: 700 }}>Resident</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 700 }}>Flat</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 700 }}>Submitted</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, textAlign: 'right' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rejectedResidents.map((row) => {
                const flat = row.flat;
                return (
                  <TableRow key={row.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={`https://i.pravatar.cc/150?u=${row.id}`}
                          sx={{ width: 36, height: 36, bgcolor: '#fee2e2', color: '#ef4444', fontWeight: 900 }}
                        >
                          {row.name?.[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="700">{row.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{row.email || row.phone}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="600" color="text.secondary">
                        {flat ? `Flat ${flat.flatNumber} • Floor ${flat.floorNumber}` : (row.flatId || 'N/A')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label="SUSPENDED"
                        size="small"
                        sx={{ bgcolor: '#fee2e2', color: '#ef4444', fontWeight: 800, borderRadius: '6px' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        onClick={() => handleRestore(row.id, row.name)}
                        sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '8px', mr: 1 }}
                      >
                        Restore
                      </Button>
                      <IconButton
                        size="small"
                        sx={{ color: 'primary.main', bgcolor: '#eff6ff' }}
                        onClick={() => handleOpenDialog(row)}
                      >
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box sx={{ mt: 4 }}>
        <Pagination
          page={page}
          totalResults={rejectedTotal}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: '#002855', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Resident Details
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedResident && (
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar
                  src={`https://i.pravatar.cc/150?u=${selectedResident.id}`}
                  sx={{ width: 64, height: 64, bgcolor: '#fee2e2', color: '#ef4444', fontWeight: 900 }}
                >
                  {selectedResident.name?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="800" color="#002855">{selectedResident.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{selectedResident.email}</Typography>
                  <Typography variant="body2" color="text.secondary">{selectedResident.phone}</Typography>
                </Box>
              </Box>
              <Divider />
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="600">Flat Details</Typography>
                  <Typography variant="body1" fontWeight="700" color="#002855">
                    {selectedResident.flat ? `${selectedResident.flat.flatNumber} (Floor ${selectedResident.flat.floorNumber})` : (selectedResident.flatId || 'N/A')}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="600">Submitted Date</Typography>
                  <Typography variant="body1" fontWeight="700" color="#002855">
                    {selectedResident.createdAt ? new Date(selectedResident.createdAt).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="600">Role</Typography>
                  <Typography variant="body1" fontWeight="700" color="#002855">
                    {selectedResident.role || 'RESIDENT'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="600">Current Status</Typography>
                  <Box mt={0.5}>
                    <Chip
                      label="REJECTED"
                      size="small"
                      sx={{ bgcolor: '#fee2e2', color: '#ef4444', fontWeight: 900, borderRadius: '6px' }}
                    />
                  </Box>
                </Grid>
              </Grid>

              <Divider />

              <Box sx={{ bgcolor: '#fef2f2', p: 2, borderRadius: '12px', border: '1px solid #fee2e2' }}>
                <Typography variant="caption" color="#ef4444" fontWeight="800" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Rejection Reason</Typography>
                <Typography variant="body2" fontWeight="600" color="#7f1d1d" sx={{ mt: 0.5 }}>
                  {selectedResident.rejectReason || selectedResident.notes || "No specific reason was provided by the administrator."}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={handleCloseDialog} sx={{ fontWeight: 800, borderRadius: '8px' }}>
            Close
          </Button>
          <Button 
            variant="contained" 
            color="success" 
            sx={{ fontWeight: 800, borderRadius: '8px', boxShadow: 'none' }}
            onClick={() => {
              if (selectedResident) {
                handleRestore(selectedResident.id, selectedResident.name);
                handleCloseDialog();
              }
            }}
          >
            Restore Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
