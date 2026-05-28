import { useState, useEffect } from 'react';
import { 
  Box, Typography, Avatar, 
  Button, IconButton, Tabs, Tab, Paper,
  CircularProgress, Dialog, DialogTitle, DialogContent, Stack
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Warning as WarningIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import ResidentWallets from './components/ResidentWallets';
import ResidentAmenities from './components/ResidentAmenities';
import BackButton from '@/components/BackButton';
import { getUserDetailsApi } from '@/apis/user';
import { deleteFamilyMemberApi, updateFamilyMemberApi, createFamilyMemberApi } from '@/apis/family';
import { toast } from 'react-hot-toast';
import { getFileUrl } from '@/utils/file';

// Sub-components
import ResidentProfileCard from './components/ResidentProfileCard';
import ResidentOverviewTab from './components/ResidentOverviewTab';
import ResidentDependentsTab from './components/ResidentDependentsTab';
import ResidentDocumentsTab from './components/ResidentDocumentsTab';
import FamilyMemberDialog from './components/FamilyMemberDialog';

const isPdfFile = (urlOrName: string) => {
  if (!urlOrName) return false;
  return urlOrName.toLowerCase().endsWith('.pdf');
};

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
    setEditModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setSelectedMember(null);
    setEditModalOpen(true);
  };

  const handleSaveFamilyMember = async (formData: any) => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setUpdatingMember(true);
    try {
      if (selectedMember) {
        await updateFamilyMemberApi(selectedMember.id, {
          name: formData.name.trim(),
          relationship: formData.relationship,
          phone: formData.phone.trim() || undefined,
          email: formData.email.trim() || undefined,
          idType: formData.idType || undefined,
          idNumber: formData.idNumber.trim() || undefined,
          status: formData.status,
          accessLevel: formData.accessLevel,
          dateOfBirth: formData.dateOfBirth || undefined
        });
        toast.success("Family member details updated successfully");
      } else {
        await createFamilyMemberApi(resident.id, {
          name: formData.name.trim(),
          relationship: formData.relationship,
          phone: formData.phone.trim() || undefined,
          email: formData.email.trim() || undefined,
          idType: formData.idType || undefined,
          idNumber: formData.idNumber.trim() || undefined,
          accessLevel: formData.accessLevel,
          dateOfBirth: formData.dateOfBirth || undefined
        });
        toast.success("Family member enrolled successfully");
      }
      setEditModalOpen(false);
      fetchDetails();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update family member details");
    } finally {
      setUpdatingMember(false);
    }
  };

  const handleOpenDoc = (title: string, url: string) => {
    if (isPdfFile(url)) {
      window.open(getFileUrl(url), '_blank');
    } else {
      setDocToShow({ title, url });
      setDocOpen(true);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!resident || resident.success === false || !resident.name) {
    return (
      <Box sx={{ 
        bgcolor: '#f8fafc', 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        p: 3
      }}>
        <Paper elevation={0} sx={{ 
          p: 6, 
          borderRadius: '32px', 
          border: '1px solid #e2e8f0', 
          textAlign: 'center',
          maxWidth: 500,
          bgcolor: 'white',
          boxShadow: '0 20px 40px rgba(9, 21, 66, 0.05)'
        }}>
          <Avatar sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', width: 64, height: 64, mx: 'auto', mb: 3 }}>
            <WarningIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography variant="h5" fontWeight="900" color="#091542" sx={{ mb: 2 }}>
            Resident Profile Unreachable
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
            We couldn't retrieve the profile data for resident ID <strong>{id}</strong>. The resident might not exist, or there could be a temporary network issue.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button 
              variant="outlined" 
              onClick={() => navigate('/residents')}
              sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 800, px: 3 }}
            >
              Back to Residents
            </Button>
            <Button 
              variant="contained" 
              onClick={fetchDetails}
              sx={{ bgcolor: '#091542', borderRadius: '12px', textTransform: 'none', fontWeight: 800, px: 3 }}
            >
              Retry Connection
            </Button>
          </Stack>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pb: 8, pt: 3, px: { xs: 3, md: 6 } }}>
      {/* Redesigned horizontal stacked layout */}
      <Stack spacing={4}>
        {/* Full-Width Header Profile Card */}
        <ResidentProfileCard resident={resident} />

        {/* Custom Tabs Track */}
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            borderBottom: '1px solid #e2e8f0',
            '& .MuiTabs-flexContainer': { gap: 1 },
            '& .MuiTab-root': { 
              textTransform: 'none', 
              fontWeight: 800, 
              color: '#64748b', 
              fontSize: '0.92rem', 
              minWidth: 'auto',
              px: 3,
              pb: 1.5,
              transition: 'all 0.2s ease',
              '&:hover': { color: '#091542' }
            },
            '& .Mui-selected': { 
              color: '#091542 !important'
            },
            '& .MuiTabs-indicator': { 
              backgroundColor: '#091542',
              height: 3.5,
              borderRadius: '4px 4px 0 0'
            }
          }}
        >
          <Tab label="Profile Overview" />
          <Tab label="Wallets & Membership" />
          <Tab label="Amenity Usage" />
          <Tab label="Family Directory" />
          <Tab label="KYC Documents" />
        </Tabs>

        {/* Dynamic Tab Content Area */}
        <Box>
          {activeTab === 0 && (
            <ResidentOverviewTab resident={resident} />
          )}

          {activeTab === 1 && (
            <ResidentWallets wallets={resident.wallets || {
              membership: { status: 'Active', currentMonth: 'Current Month Paid', upcomingMonths: [], expiry: 'N/A', refundableFuture: '₹0.00' },
              activity: { balance: '₹0.00' },
              security: { locked: '₹0.00', refundable: 'Yes', condition: 'Good' }
            }} />
          )}

          {activeTab === 2 && (
            <ResidentAmenities bookings={mockBookings} />
          )}

          {activeTab === 3 && (
            <ResidentDependentsTab 
              family={family}
              onAddMember={handleOpenAddModal}
              onEditMember={handleOpenEditModal}
              onDeleteMember={handleDeleteFamilyMember}
            />
          )}

          {activeTab === 4 && (
            <ResidentDocumentsTab 
              resident={resident}
              family={family}
              onViewDocument={handleOpenDoc}
            />
          )}
        </Box>
      </Stack>

      {/* Document Viewer Dialog */}
      <Dialog 
        open={docOpen} 
        onClose={() => setDocOpen(false)} 
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: '24px', overflow: 'hidden' } }}
      >
        <DialogTitle sx={{ bgcolor: '#091542', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="900">{docToShow.title}</Typography>
          <IconButton onClick={() => setDocOpen(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, bgcolor: '#f8fafc', display: 'flex', justifyContent: 'center' }}>
          <Box 
            component="img" 
            src={getFileUrl(docToShow.url)} 
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

      {/* Enroll/Edit Family Member Dialog */}
      <FamilyMemberDialog 
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        selectedMember={selectedMember}
        onSave={handleSaveFamilyMember}
        updatingMember={updatingMember}
      />
    </Box>
  );
}
