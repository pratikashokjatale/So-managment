import { useState } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Avatar, 
  IconButton, Chip, Button, Paper, Dialog,
  DialogTitle, DialogContent, DialogActions, Stack,
  TextField, Divider
} from '@mui/material';
import { 
  CheckCircle as ApproveIcon, 
  Cancel as RejectIcon,
  Assignment as DocIcon,
  Close as CloseIcon,
  Badge as IdIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  CreditCard as PanIcon,
  ZoomIn as ZoomIcon
} from '@mui/icons-material';

// Mock Document Images (Using generated artifacts)
const AADHAAR_URL = '/Users/pratikjatale/.gemini/antigravity/brain/c6057e1c-898f-46a0-bb20-ae0c5e641faa/aadhaar_mockup_1778944455202.png';
const PAN_URL = '/Users/pratikjatale/.gemini/antigravity/brain/c6057e1c-898f-46a0-bb20-ae0c5e641faa/pan_mockup_1778944477858.png';

const mockRequests = [
  { 
    id: 1, 
    name: 'Alice Walker', 
    avatar: 'https://i.pravatar.cc/150?u=11', 
    apartment: 'B-204', 
    type: 'New Enrollment', 
    date: '10 mins ago', 
    status: 'Pending',
    mobile: '9876543210',
    aadhaar: 'XXXX XXXX 1234',
    pan: 'ABCDE1234F',
    category: 'Owner',
    family: ['John Walker (Spouse)', 'Lily Walker (Child)']
  },
  { 
    id: 2, 
    name: 'Robert Fox', 
    avatar: 'https://i.pravatar.cc/150?u=12', 
    apartment: 'C-501', 
    type: 'Family Member Add', 
    date: '2 hours ago', 
    status: 'Pending',
    mobile: '9876543211',
    aadhaar: 'XXXX XXXX 5678',
    pan: 'BCDEF2345G',
    category: 'Tenant',
    family: []
  },
];

export default function ResidentRequests() {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [kycOpen, setKycOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  
  // Document Viewer State
  const [docOpen, setDocOpen] = useState(false);
  const [docToShow, setDocToShow] = useState({ title: '', url: '' });

  const handleOpenKyc = (request: any) => {
    setSelectedRequest(request);
    setKycOpen(true);
  };

  const handleOpenDoc = (title: string, url: string) => {
    setDocToShow({ title, url });
    setDocOpen(true);
  };

  const handleApprove = () => {
    console.log('Approved:', selectedRequest.id);
    setKycOpen(false);
  };

  const handleOpenReject = () => {
    setRejectOpen(true);
  };

  const handleConfirmReject = () => {
    console.log('Rejected:', selectedRequest.id, 'Reason:', rejectReason);
    setRejectOpen(false);
    setKycOpen(false);
    setRejectReason('');
  };

  return (
    <Box sx={{ mt: 5 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" fontWeight="900" color="#002855">Pending Enrollment Requests</Typography>
          <Typography variant="body2" color="text.secondary">Review and approve resident submissions for card enrollment.</Typography>
        </Box>
        <Chip label={`${mockRequests.length} Requests`} color="primary" sx={{ fontWeight: 800, borderRadius: '8px' }} />
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #f1f5f9', borderRadius: '12px' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Resident</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Apartment</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Request Type</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Submitted</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#64748b', textAlign: 'right' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockRequests.map((request) => (
              <TableRow key={request.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={request.avatar} sx={{ width: 36, height: 36, borderRadius: '10px' }} />
                    <Typography variant="body2" fontWeight="700">{request.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="600" color="text.secondary">{request.apartment}</Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={request.type} 
                    size="small" 
                    sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', fontWeight: 700, borderRadius: '6px' }} 
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="caption" fontWeight="600" color="text.secondary">{request.date}</Typography>
                </TableCell>
                <TableCell align="right">
                  <Button 
                    size="small" 
                    startIcon={<DocIcon fontSize="small" />} 
                    onClick={() => handleOpenKyc(request)}
                    sx={{ textTransform: 'none', fontWeight: 800, borderRadius: '8px' }}
                  >
                    View KYC
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* KYC Details Dialog */}
      <Dialog 
        open={kycOpen} 
        onClose={() => setKycOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        {selectedRequest && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
              <Typography variant="h6" fontWeight="900" color="#002855">Resident KYC Details</Typography>
              <IconButton onClick={() => setKycOpen(false)} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4, mt: 2 }}>
                <Avatar src={selectedRequest.avatar} sx={{ width: 80, height: 80, borderRadius: '16px' }} />
                <Box>
                  <Typography variant="h5" fontWeight="800" color="#002855">{selectedRequest.name}</Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight="600">{selectedRequest.type}</Typography>
                </Box>
              </Box>

              <Stack spacing={2.5}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" fontWeight="700" color="text.secondary">MOBILE</Typography>
                    </Stack>
                    <Typography variant="body2" fontWeight="700">{selectedRequest.mobile}</Typography>
                  </Box>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <HomeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" fontWeight="700" color="text.secondary">APARTMENT</Typography>
                    </Stack>
                    <Typography variant="body2" fontWeight="700">{selectedRequest.apartment} ({selectedRequest.category})</Typography>
                  </Box>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <IdIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" fontWeight="700" color="text.secondary">AADHAAR</Typography>
                    </Stack>
                    <Typography variant="body2" fontWeight="700">{selectedRequest.aadhaar}</Typography>
                    <Button 
                      size="small" 
                      startIcon={<ZoomIcon fontSize="inherit" />}
                      onClick={() => handleOpenDoc('Aadhaar Card', AADHAAR_URL)}
                      sx={{ p: 0, textTransform: 'none', mt: 0.5, fontWeight: 700 }}
                    >
                      View Document
                    </Button>
                  </Box>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <PanIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" fontWeight="700" color="text.secondary">PAN CARD</Typography>
                    </Stack>
                    <Typography variant="body2" fontWeight="700">{selectedRequest.pan}</Typography>
                    <Button 
                      size="small" 
                      startIcon={<ZoomIcon fontSize="inherit" />}
                      onClick={() => handleOpenDoc('PAN Card', PAN_URL)}
                      sx={{ p: 0, textTransform: 'none', mt: 0.5, fontWeight: 700 }}
                    >
                      View Document
                    </Button>
                  </Box>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="caption" fontWeight="800" color="text.secondary" sx={{ display: 'block', mb: 1 }}>FAMILY MEMBERS</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {selectedRequest.family.length > 0 ? selectedRequest.family.map((f: string) => (
                      <Chip key={f} label={f} size="small" variant="outlined" sx={{ borderRadius: '8px', fontWeight: 600 }} />
                    )) : <Typography variant="body2" color="text.secondary">No family details provided.</Typography>}
                  </Box>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 3, gap: 2 }}>
              <Button 
                variant="outlined" 
                color="error" 
                fullWidth 
                startIcon={<RejectIcon />}
                onClick={handleOpenReject}
                sx={{ borderRadius: '12px', fontWeight: 800, textTransform: 'none', height: 45 }}
              >
                Reject Request
              </Button>
              <Button 
                variant="contained" 
                color="success" 
                fullWidth 
                startIcon={<ApproveIcon />}
                onClick={handleApprove}
                sx={{ borderRadius: '12px', fontWeight: 800, textTransform: 'none', height: 45, bgcolor: '#10b981' }}
              >
                Approve Enrollment
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Document Viewer Dialog */}
      <Dialog 
        open={docOpen} 
        onClose={() => setDocOpen(false)} 
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: '24px', overflow: 'hidden' } }}
      >
        <DialogTitle sx={{ bgcolor: '#002855', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="900">{docToShow.title}</Typography>
          <IconButton onClick={() => setDocOpen(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, bgcolor: '#f8fafc', display: 'flex', justifyContent: 'center' }}>
          <Box 
            component="img" 
            src={docToShow.url} 
            sx={{ 
              maxWidth: '100%', 
              height: 'auto', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              m: 4,
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }} 
          />
        </DialogContent>
      </Dialog>

      {/* Reject Reason Dialog */}
      <Dialog 
        open={rejectOpen} 
        onClose={() => setRejectOpen(false)}
        PaperProps={{ sx: { borderRadius: '12px' } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Reject Request</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Please provide a reason for rejecting the enrollment request for <strong>{selectedRequest?.name}</strong>.
          </Typography>
          <TextField 
            fullWidth 
            multiline 
            rows={3} 
            placeholder="e.g. Invalid Aadhaar copy, Photo not clear..." 
            variant="outlined" 
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            sx={{ '& fieldset': { borderRadius: '8px' } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setRejectOpen(false)} sx={{ fontWeight: 700, textTransform: 'none' }}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleConfirmReject}
            disabled={!rejectReason}
            sx={{ fontWeight: 700, textTransform: 'none', borderRadius: '8px' }}
          >
            Confirm Reject
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
