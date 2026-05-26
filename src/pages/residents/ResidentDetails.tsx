import { useState, useEffect } from 'react';
import { 
  Box, Typography, Avatar, 
  Button, IconButton, Stack, Tabs, Tab, Paper,
  Grid, Chip, Divider, Tooltip, CircularProgress, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  EditOutlined as EditIcon,
  Description as FileIcon,
  CalendarMonth as CalendarIcon,
  Verified as VerifiedIcon,
  Add as AddIcon,
  Upload as UploadIcon,
  CreditCard as CardIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
  CheckCircle as CheckIcon,
  HourglassEmpty as PendingIcon,
  DeleteOutline as DeleteIcon,
} from '@mui/icons-material';
import ResidentWallets from './components/ResidentWallets';
import ResidentAmenities from './components/ResidentAmenities';
import bannerImg from '../../assets/marbella-banner.png';
import BackButton from '@/components/BackButton';
import { getUserDetailsApi } from '@/apis/user';
import { deleteFamilyMemberApi, updateFamilyMemberApi } from '@/apis/family';
import { toast } from 'react-hot-toast';

const mockBookings = [
  { id: 101, activity: 'Squash Court', slots: '5:00 PM - 7:00 PM (2 Slots)', date: 'May 18, 2024', amount: '₹400.00', status: 'Confirmed' },
  { id: 102, activity: 'Table Tennis', slots: '10:00 AM - 11:00 AM (1 Slot)', date: 'May 17, 2024', amount: '₹150.00', status: 'Completed' },
  { id: 103, activity: 'Home Theatre', slots: '8:00 PM - 10:00 PM (2 Slots)', date: 'May 15, 2024', amount: '₹1,000.00', status: 'Completed' },
];

export default function ResidentDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(0);

  // API Integration States
  const [resident, setResident] = useState<any>(null);
  const [family, setFamily] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Document Viewer Dialog State
  const [docOpen, setDocOpen] = useState(false);
  const [docToShow, setDocToShow] = useState({ title: '', url: '' });

  // Edit Family Member Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    relationship: 'SPOUSE',
    status: 'ACTIVE',
    accessLevel: 'FULL'
  });
  const [updatingMember, setUpdatingMember] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await getUserDetailsApi(id || '');
      // API returns { success, message, data: { id, name, ..., documents, familyMembers } }
      const user = res?.data || res;
      setResident(user);
      // Use embedded familyMembers from the user detail response
      setFamily(user?.familyMembers || user?.family || []);
    } catch (error) {
      console.warn("Failed to fetch resident details via API:", error);
      setResident({
        id: id || 'ERD246534',
        name: 'Graziele Lopes',
        email: 'graziele.lopes@society.com',
        phone: '+91 98765 43210',
        avatar: 'https://i.pravatar.cc/150?u=graziele',
        cardNo: 'CMR101-M01',
        role: 'RESIDENT',
        status: 'ACTIVE',
        startDate: '27 Jan 2025',
        documents: { IDENTITY_PROOF: [], PERSONAL_DOCUMENTS: [] },
        familyMembers: [],
      });
      setFamily([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleTabChange = (_: any, newValue: number) => setActiveTab(newValue);

  const handleDeleteFamilyMember = async (memberId: string) => {
    if (!window.confirm("Are you sure you want to delete this family member?")) return;
    try {
      await deleteFamilyMemberApi(memberId);
      toast.success("Family member deleted successfully");
      fetchDetails();
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete family member");
    }
  };

  const handleOpenEditModal = (member: any) => {
    setSelectedMember(member);
    setEditForm({
      name: member.name || '',
      relationship: member.relationship || 'SPOUSE',
      status: member.status || 'ACTIVE',
      accessLevel: member.accessLevel || 'FULL'
    });
    setEditModalOpen(true);
  };

  const handleUpdateFamilyMember = async () => {
    if (!selectedMember) return;
    if (!editForm.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setUpdatingMember(true);
    try {
      await updateFamilyMemberApi(selectedMember.id, {
        name: editForm.name.trim(),
        relationship: editForm.relationship,
        status: editForm.status,
        accessLevel: editForm.accessLevel
      });
      toast.success("Family member details updated successfully");
      setEditModalOpen(false);
      fetchDetails();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update family member details");
    } finally {
      setUpdatingMember(false);
    }
  };

  const handleOpenDoc = (title: string, url: string) => {
    setDocToShow({ title, url });
    setDocOpen(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const identityProofs = resident?.documents?.IDENTITY_PROOF || [];
  const personalDocs = resident?.documents?.PERSONAL_DOCUMENTS || [];
  const allDocs = [...identityProofs, ...personalDocs];

  const familyDocs = family.flatMap((member: any) => {
    const memberDocs = [...(member.documents?.IDENTITY_PROOF || []), ...(member.documents?.PERSONAL_DOCUMENTS || [])];
    return memberDocs.map((doc: any) => ({
      ...doc,
      member: `${member.name} (${member.relationship})`
    }));
  });

  // Build a readable flat label from the embedded flat object
  const flatObj = resident?.flat;
  const flatLabel = flatObj
    ? `Flat ${flatObj.flatNumber} • Floor ${flatObj.floorNumber} • ${flatObj.flatType || ''} (${flatObj.occupancyType || ''})`
    : (resident?.apartment || (resident?.flatId ? `Flat ID: ${resident.flatId}` : 'N/A'));

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pb: 8 }}>
      
      {/* Official Branded Header */}
      <Box sx={{ position: 'relative', mb: 10 }}>
        <Box sx={{ 
          height: 180, 
          width: '100%', 
          backgroundImage: `url(${bannerImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          borderRadius: '0 0 40px 40px',
          boxShadow: 'inset 0 -80px 100px -40px rgba(0,0,0,0.5), 0 10px 30px -10px rgba(0,0,0,0.1)'
        }} />
        
        <BackButton 
          to="/residents" 
          label="Back to Residents"
          sx={{ 
            position: 'absolute', top: 20, right: 20, 
            bgcolor: 'rgba(255,255,255,0.95)', zIndex: 2, 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            '&:hover': { bgcolor: 'white' },
            color: '#002855'
          }} 
        />

        <Box sx={{ px: { xs: 2, md: 6 }, mt: -6, position: 'relative', zIndex: 3 }}>
          <Stack direction="row" alignItems="flex-end" spacing={4}>
            <Avatar 
              src={resident.profilePhotoUrl || resident.avatar || `https://i.pravatar.cc/150?u=${resident.id}`} 
              sx={{ 
                width: 140, height: 140, 
                border: '6px solid #f8fafc', 
                boxShadow: '0 20px 40px -15px rgba(0,0,0,0.3)',
                bgcolor: 'white'
              }} 
            />
            <Box sx={{ flexGrow: 1, pb: 1 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="h4" fontWeight="900" color="#1e293b" sx={{ textShadow: '0 2px 4px rgba(255,255,255,0.8)' }}>
                  {resident.name}
                </Typography>
                <Chip 
                  icon={<VerifiedIcon sx={{ fontSize: '16px !important', color: '#10b981 !important' }} />} 
                  label={resident.status || 'Active Profile'} 
                  sx={{ bgcolor: 'white', color: '#10b981', fontWeight: 900, borderRadius: '8px', border: '1px solid #dcfce7' }} 
                />
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Stack direction="row" spacing={1} alignItems="center">
                  <CalendarIcon sx={{ fontSize: 18, color: '#64748b' }} />
                  <Typography variant="body1" color="#64748b" fontWeight="700">
                    Enrollment: {resident.startDate || (resident.createdAt ? new Date(resident.createdAt).toLocaleDateString() : 'N/A')}
                  </Typography>
                </Stack>
                <Typography variant="body1" color="#1d4ed8" fontWeight="800">#{resident.id}</Typography>
              </Stack>
            </Box>
            <Stack direction="row" spacing={2} sx={{ pb: 1 }}>
              <Tooltip title="Block Card">
                <IconButton sx={{ bgcolor: 'white', color: '#ef4444', border: '1px solid #fee2e2' }}><WarningIcon /></IconButton>
              </Tooltip>
              <Button 
                variant="contained" 
                startIcon={<EditIcon />} 
                onClick={() => navigate(`/residents/edit/${id}`)}
                sx={{ 
                  borderRadius: '12px', textTransform: 'none', fontWeight: 800, 
                  height: 48, px: 4, bgcolor: '#002855'
                }}
              >
                Edit Profile
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>

      {/* Navigation Tabs */}
      <Box sx={{ px: { xs: 2, md: 6 }, mb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{ 
            borderBottom: '1px solid #e2e8f0',
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 800, color: '#64748b', minWidth: 160, fontSize: '1rem', py: 2 },
            '& .Mui-selected': { color: '#002855 !important' },
            '& .MuiTabs-indicator': { backgroundColor: '#002855', height: 4, borderRadius: '4px' }
          }}
        >
          <Tab label="Profile Overview" />
          <Tab label="Wallets & Membership" />
          <Tab label="Amenity Usage" />
          <Tab label="Family Directory" />
          <Tab label="KYC Documents" />
        </Tabs>
      </Box>

      {/* Content Area */}
      <Box sx={{ px: { xs: 2, md: 6 } }}>
        {activeTab === 0 && (
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: '28px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
                <Typography variant="h6" fontWeight="900" color="#002855" sx={{ mb: 4 }}>Administrative Details</Typography>
                <Grid container spacing={4}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="#94a3b8" fontWeight="800">FULL NAME</Typography>
                    <Typography variant="body1" fontWeight="700">{resident.name}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="#94a3b8" fontWeight="800">RESIDENCE CATEGORY</Typography>
                    <Typography variant="body1" fontWeight="700">
                      {resident.category || 'Resident'} • {resident.role}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="#94a3b8" fontWeight="800">AADHAAR CARD</Typography>
                    <Typography variant="body1" fontWeight="700">
                      {identityProofs.find((d: any) => d.documentType === 'AADHAR_CARD')?.isVerified ? 'Verified' : (identityProofs.some((d: any) => d.documentType === 'AADHAR_CARD') ? 'Pending Verification' : 'Not Uploaded')}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="#94a3b8" fontWeight="800">PAN CARD</Typography>
                    <Typography variant="body1" fontWeight="700">
                      {identityProofs.find((d: any) => d.documentType === 'PAN_CARD')?.isVerified ? 'Verified' : (identityProofs.some((d: any) => d.documentType === 'PAN_CARD') ? 'Pending Verification' : 'Not Uploaded')}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="#94a3b8" fontWeight="800">CONTACT PHONE</Typography>
                    <Typography variant="body1" fontWeight="700">{resident.phone || 'N/A'}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="#94a3b8" fontWeight="800">APARTMENT / FLAT</Typography>
                    <Typography variant="body1" fontWeight="700">{flatLabel}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={3}>
                <Paper elevation={0} sx={{ p: 4, borderRadius: '28px', border: '1px solid #e2e8f0', bgcolor: 'white', textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight="900" color="#002855" sx={{ mb: 3 }}>Active Blue Card</Typography>
                  <Box sx={{ p: 4, bgcolor: '#eff6ff', borderRadius: '24px', border: '2px dashed #bfdbfe' }}>
                    <CardIcon sx={{ fontSize: 40, color: '#1d4ed8', mb: 1 }} />
                    <Typography variant="h4" fontWeight="900" color="#1d4ed8" sx={{ mb: 1 }}>
                      {resident.cardNo || `CMR-${resident.id?.substring(0,6).toUpperCase()}`}
                    </Typography>
                    <Chip label="Master Fob" size="small" sx={{ bgcolor: '#1d4ed8', color: 'white', fontWeight: 900 }} />
                  </Box>
                  <Typography variant="caption" fontWeight="800" color="#94a3b8" sx={{ mt: 2, display: 'block' }}>RFID ACTIVATED • OFFLINE SYNCED</Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 3, borderRadius: '24px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" fontWeight="800" color="#002855">Card Condition</Typography>
                    <Chip label={resident.wallets?.security?.condition || 'Good'} size="small" sx={{ bgcolor: '#f0fdf4', color: '#10b981', fontWeight: 900 }} />
                  </Stack>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && <ResidentWallets wallets={resident.wallets || {
          membership: { status: 'Active', currentMonth: 'Current Month Paid', upcomingMonths: [], expiry: 'N/A', refundableFuture: '₹0.00' },
          activity: { balance: '₹0.00' },
          security: { locked: '₹0.00', refundable: 'Yes', condition: 'Good' }
        }} />}
        {activeTab === 2 && <ResidentAmenities bookings={mockBookings} />}

        {activeTab === 3 && (
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="900" color="#002855">Dependent Management</Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                onClick={() => navigate(`/residents/edit/${resident.id}`)}
                sx={{ bgcolor: '#002855', borderRadius: '12px', fontWeight: 800, textTransform: 'none' }}
              >
                Enroll Member
              </Button>
            </Stack>
            <Grid container spacing={3}>
              {family.map((m) => (
                <Grid size={{ xs: 12, md: 6 }} key={m.id}>
                  <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
                    <Stack direction="row" spacing={3} alignItems="center">
                      <Avatar sx={{ width: 60, height: 60, bgcolor: '#f0f4f8', color: '#002855', fontWeight: 900 }}>{m.name[0]}</Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="h6" fontWeight="900" color="#002855">{m.name}</Typography>
                          {m.gender && <Chip label={m.gender} size="small" variant="outlined" sx={{ borderRadius: '6px', height: 20, fontSize: '0.7rem' }} />}
                        </Stack>
                        <Typography variant="body2" color="#64748b" fontWeight="700">
                          Dependent ({m.relationship})
                        </Typography>
                      </Box>
                      <Chip label="Blue Card" size="small" sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', fontWeight: 900 }} />
                      <IconButton 
                        color="primary" 
                        size="small" 
                        onClick={() => handleOpenEditModal(m)}
                        sx={{ ml: 1, bgcolor: '#f0f4f8', '&:hover': { bgcolor: '#e2e8f0' } }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        size="small" 
                        onClick={() => handleDeleteFamilyMember(m.id)}
                        sx={{ ml: 1, bgcolor: '#fff5f5', '&:hover': { bgcolor: '#ffe3e3' } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                                              
                    </Stack>
                    <Divider sx={{ my: 3 }} />
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                      <Box>
                        <Typography variant="caption" color="#94a3b8" fontWeight="800" sx={{ display: 'block' }}>MOBILE NUMBER</Typography>
                        <Typography variant="body2" fontWeight="700" color="text.primary">{m.phone || m.mobile || 'N/A'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="#94a3b8" fontWeight="800" sx={{ display: 'block' }}>ACCESS CARD / VCARD</Typography>
                        <Typography variant="body2" fontWeight="700" color="text.primary">{m.vcard !== 'N/A' && m.vcard ? m.vcard : 'Not Assigned'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="#94a3b8" fontWeight="800" sx={{ display: 'block' }}>ACCESS LEVEL</Typography>
                        <Typography variant="body2" fontWeight="700" color="text.primary">{m.accessLevel || 'FULL'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="#94a3b8" fontWeight="800" sx={{ display: 'block' }}>STATUS</Typography>
                        <Typography variant="body2" fontWeight="700" color="text.primary">{m.status || 'ACTIVE'}</Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
              {family.length === 0 && (
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No family members enrolled.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {activeTab === 4 && (
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="900" color="#002855">KYC Compliance Repository</Typography>
              <Button variant="outlined" startIcon={<UploadIcon />} sx={{ borderRadius: '12px', fontWeight: 800, borderColor: '#002855', color: '#002855', textTransform: 'none' }}>Upload New Document</Button>
            </Stack>
            
            <Typography variant="subtitle1" fontWeight="800" color="#002855" sx={{ mb: 2 }}>Master Resident Documents</Typography>
            {allDocs.length > 0 ? (
              <Grid container spacing={4} sx={{ mb: 5 }}>
                {allDocs.map((doc) => (
                  <Grid size={{ xs: 12, md: 4 }} key={doc.id || doc.title}>
                    <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid #e2e8f0', textAlign: 'center', bgcolor: 'white' }}>
                      <Box sx={{ p: doc.photoUrl ? 0 : 4, bgcolor: '#f8fafc', borderRadius: '20px', mb: 2, display: 'flex', justifyContent: 'center', height: 120, alignItems: 'center', overflow: 'hidden' }}>
                        {doc.photoUrl ? (
                          <Box component="img" src={doc.photoUrl} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <FileIcon sx={{ fontSize: 44, color: '#002855' }} />
                        )}
                      </Box>
                      <Typography variant="body1" fontWeight="900" color="#002855" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.title || doc.documentType}</Typography>
                      <Chip
                        icon={doc.isVerified ? <CheckIcon sx={{ fontSize: '14px !important' }} /> : <PendingIcon sx={{ fontSize: '14px !important' }} />}
                        label={doc.isVerified ? 'Verified' : (doc.status || 'PENDING')}
                        size="small"
                        sx={{
                          mb: 1,
                          bgcolor: doc.isVerified ? '#f0fdf4' : '#fffbeb',
                          color: doc.isVerified ? '#10b981' : '#f59e0b',
                          fontWeight: 800, borderRadius: '8px'
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {doc.photoFileName || doc.pdfFileName || 'kyc_document.png'}
                        {(doc.photoSize || doc.pdfSize) ? ` (${Math.round((doc.photoSize || doc.pdfSize) / 1024)} KB)` : ''}
                      </Typography>
                      {doc.verifiedAt && (
                        <Typography variant="caption" color="#10b981" fontWeight="700" sx={{ display: 'block', mb: 2 }}>
                          Verified: {new Date(doc.verifiedAt).toLocaleDateString()}
                        </Typography>
                      )}
                      {doc.uploadedBy && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                          Uploaded by: {doc.uploadedBy}
                        </Typography>
                      )}
                      {(doc.photoUrl || doc.pdfUrl) && (
                        <Button 
                          fullWidth 
                          variant="outlined" 
                          onClick={() => handleOpenDoc(doc.title || doc.documentType, doc.photoUrl || doc.pdfUrl)}
                          sx={{ borderRadius: '10px', fontWeight: 800, textTransform: 'none', borderColor: '#e2e8f0', color: 'text.primary' }}
                        >
                          View Document
                        </Button>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 5 }}>No documents uploaded for master resident.</Typography>
            )}

            <Typography variant="subtitle1" fontWeight="800" color="#002855" sx={{ mb: 2 }}>Family Member KYC Documents</Typography>
            {familyDocs.length > 0 ? (
              <Grid container spacing={4}>
                {familyDocs.map((doc, idx) => (
                  <Grid size={{ xs: 12, md: 4 }} key={idx}>
                    <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid #e2e8f0', textAlign: 'center', bgcolor: 'white' }}>
                      <Box sx={{ p: doc.photoUrl ? 0 : 4, bgcolor: '#f8fafc', borderRadius: '20px', mb: 2, display: 'flex', justifyContent: 'center', height: 120, alignItems: 'center', overflow: 'hidden' }}>
                        {doc.photoUrl ? (
                          <Box component="img" src={doc.photoUrl} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <FileIcon sx={{ fontSize: 44, color: '#0047b3' }} />
                        )}
                      </Box>
                      <Typography variant="caption" color="primary" fontWeight="800" sx={{ display: 'block', mb: 0.5 }}>{doc.member}</Typography>
                      <Typography variant="body1" fontWeight="900" color="#002855" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.title || doc.documentType}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {doc.photoFileName || doc.pdfFileName || 'kyc_document.png'}
                      </Typography>
                      <Typography variant="caption" color="#10b981" fontWeight="800" sx={{ mb: 3, display: 'block' }}>✓ VERIFIED BY ADMIN</Typography>
                      {(doc.photoUrl || doc.pdfUrl) && (
                        <Button 
                          fullWidth 
                          variant="outlined" 
                          onClick={() => handleOpenDoc(doc.title || doc.documentType, doc.photoUrl || doc.pdfUrl)}
                          sx={{ borderRadius: '10px', fontWeight: 800, textTransform: 'none', borderColor: '#e2e8f0', color: 'text.primary' }}
                        >
                          View Document
                        </Button>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" color="text.secondary">No documents uploaded for family members.</Typography>
            )}
          </Box>
        )}
      </Box>

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

      {/* Edit Family Member Dialog */}
      <Dialog 
        open={editModalOpen} 
        onClose={() => setEditModalOpen(false)} 
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography variant="h6" fontWeight="900" color="#002855">
            Edit Family Member
          </Typography>
          <IconButton onClick={() => setEditModalOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Full Name"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              fullWidth
              variant="outlined"
            />
            <TextField
              select
              label="Relationship"
              value={editForm.relationship}
              onChange={(e) => setEditForm({ ...editForm, relationship: e.target.value })}
              fullWidth
              variant="outlined"
            >
              <MenuItem value="SPOUSE">Spouse</MenuItem>
              <MenuItem value="CHILD">Child</MenuItem>
              <MenuItem value="PARENT">Parent</MenuItem>
              <MenuItem value="SIBLING">Sibling</MenuItem>
              <MenuItem value="GRANDPARENT">Grandparent</MenuItem>
              <MenuItem value="IN_LAW">In Law</MenuItem>
              <MenuItem value="OTHER">Other</MenuItem>
            </TextField>
            <TextField
              select
              label="Access Level"
              value={editForm.accessLevel}
              onChange={(e) => setEditForm({ ...editForm, accessLevel: e.target.value })}
              fullWidth
              variant="outlined"
            >
              <MenuItem value="FULL">Full Access</MenuItem>
              <MenuItem value="LIMITED">Limited Access</MenuItem>
              <MenuItem value="NONE">No Access</MenuItem>
            </TextField>
            <TextField
              select
              label="Status"
              value={editForm.status}
              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              fullWidth
              variant="outlined"
            >
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="INACTIVE">Inactive</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setEditModalOpen(false)} 
            variant="outlined"
            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 800, color: 'text.secondary', borderColor: '#e2e8f0' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateFamilyMember} 
            variant="contained"
            disabled={updatingMember}
            sx={{ bgcolor: '#002855', borderRadius: '10px', textTransform: 'none', fontWeight: 800 }}
          >
            {updatingMember ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
