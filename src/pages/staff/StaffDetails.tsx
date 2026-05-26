import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Paper, Avatar, Breadcrumbs, Link, 
  Button, Stack, Divider, Chip, CircularProgress 
} from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import ApartmentIcon from '@mui/icons-material/Apartment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PlaceIcon from '@mui/icons-material/Place';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined';
import { getStaffById } from '@/utils/staffStore';
// import type { Staff } from '@/utils/staffStore';
import { getStaffDetailsApi } from '@/apis/staff';
import { getFileUrl } from '@/utils/file';

export default function StaffDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [staff, setStaff] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStaff = async () => {
      setLoading(true);
      if (id) {
        try {
          const res = await getStaffDetailsApi(id);
          const s = res?.data || res;
          if (s) {
            let dept = s.department || 'SECURITY';
            if (dept === 'SECURITY') dept = 'Security';
            else if (dept === 'HOUSEKEEPING') dept = 'Housekeeping';
            else if (dept === 'MAINTENANCE') dept = 'Maintenance';
            else if (dept === 'ADMINISTRATION') dept = 'Front Office';
            else if (dept === 'SUPPORT') dept = 'Front Office';
            else if (dept === 'FACILITY') dept = 'Maintenance';
            else if (dept === 'OTHER') dept = 'Other';

            let status = 'Inactive';
            if (s.status === 'ACTIVE') status = 'Active';

            setStaff({
              id: s.id,
              name: s.name,
              avatar: s.photoUrl || s.profilePhotoUrl || s.avatar || "",
              department: dept,
              phone: s.phone || '',
              email: s.email || '',
              cardNo: s.employeeCode || s.iCardNumber || s.cardNo || '',
              status: status as 'Active' | 'Inactive',
              joiningDate: s.joiningDate ? s.joiningDate.split('T')[0] : '',
              address: s.address || '',
              emergencyContact: s.emergencyContactPhone || s.emergencyContact || '',
              facilityId: s.facilityId || '',
              facilityName: s.facility ? s.facility.name : (s.facilityName || 'General Duty'),
              
              designation: s.designation || '',
              shiftStart: s.shiftStart || '',
              shiftEnd: s.shiftEnd || '',
              workDays: s.workDays || [],
              accessLevel: s.accessLevel || '',
              attendanceMode: s.attendanceMode || '',
              idProofType: s.idProofType || '',
              idProofNumber: s.idProofNumber || '',
              employmentType: s.employmentType || ''
            } as any);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn("Failed to fetch staff details via API, falling back:", err);
        }

        const found = getStaffById(id);
        if (found) {
          setStaff(found);
        }
      }
      setLoading(false);
    };
    loadStaff();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#f8fafc' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!staff) {
    return (
      <Box sx={{ p: 5 }}>
        <Typography variant="h5" color="error">Staff member not found</Typography>
        <Button onClick={() => navigate('/staff')} sx={{ mt: 2 }} variant="contained">
          Back to Staff List
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Header Section */}
      <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 1 }}>
            <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer', fontWeight: 700 }}>
              Dashboard
            </Link>
            <Link underline="hover" color="inherit" onClick={() => navigate('/staff')} sx={{ cursor: 'pointer', fontWeight: 700 }}>
              Staff Management
            </Link>
            <Typography color="text.primary" sx={{ fontWeight: 900 }}>{staff.name}</Typography>
          </Breadcrumbs>
          <Typography variant="h3" fontWeight="900" color="#002855">Staff Details</Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/staff')}
            sx={{ borderRadius: '16px', px: 3, py: 1.25, fontWeight: 900, borderColor: '#e2e8f0', color: '#002855', bgcolor: 'white', '&:hover': { bgcolor: '#f1f5f9' } }}
          >
            Back to List
          </Button>
          <Button 
            variant="contained" 
            startIcon={<EditIcon />} 
            onClick={() => navigate(`/staff/edit/${staff.id}`)}
            sx={{ borderRadius: '16px', px: 3, py: 1.25, fontWeight: 900, bgcolor: '#002855', boxShadow: 'none', '&:hover': { bgcolor: '#001a35' } }}
          >
            Edit Profile
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={4}>
        
        {/* Left Column: Photorealistic Society ID Card (I-Card) */}
        <Grid size={{ xs: 12, md: 5, lg: 4.5 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 0, 
              borderRadius: '32px', 
              overflow: 'hidden', 
              border: '1px solid #e2e8f0',
              boxShadow: '0 25px 50px -12px rgba(0, 40, 85, 0.08)',
              background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
              position: 'relative'
            }}
          >
            {/* Holographic Security Band */}
            <Box sx={{ height: '6px', background: 'linear-gradient(90deg, #3b82f6 0%, #10b981 50%, #7c3aed 100%)' }} />

            {/* ID Card Header */}
            <Box sx={{ bgcolor: '#002855', p: 4, color: 'white', textAlign: 'center', position: 'relative' }}>
              <Typography variant="h5" fontWeight="900" sx={{ letterSpacing: 2, mb: 0.5 }}>MARBELLA CLUB</Typography>
              <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 900, letterSpacing: 1.5, display: 'block' }}>OFFICIAL CREW IDENTITY CARD</Typography>
              
              {/* Dynamic Status Beacon */}
              <Chip 
                label={staff.status} 
                size="small" 
                sx={{ 
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  fontWeight: 900,
                  fontSize: '0.65rem',
                  height: 20,
                  bgcolor: staff.status === 'Active' ? '#10b981' : '#64748b',
                  color: 'white'
                }} 
              />
            </Box>

            <Box sx={{ p: 4, textAlign: 'center' }}>
              
              {/* Styled Avatar with Gold Ring Accent */}
              <Box sx={{ display: 'inline-block', position: 'relative', mb: 3 }}>
                <Avatar 
                  src={getFileUrl(staff.avatar)} 
                  sx={{ 
                    width: 150, 
                    height: 150, 
                    border: '5px solid white',
                    boxShadow: '0 12px 28px rgba(0, 40, 85, 0.15)'
                  }} 
                />
              </Box>

              <Typography variant="h4" fontWeight="900" color="#002855" sx={{ mb: 0.5 }}>{staff.name}</Typography>
              <Typography variant="subtitle1" fontWeight="800" color="#1d4ed8" sx={{ mb: 2 }}>{staff.department}</Typography>
              
              {/* Dynamic Assigned Duty Location Badge */}
              <Chip 
                label={`Assigned Location: ${staff.facilityName}`} 
                size="medium" 
                sx={{ 
                  fontWeight: 900, 
                  px: 2, 
                  py: 2, 
                  borderRadius: '12px', 
                  bgcolor: '#f0fdf4', 
                  color: '#16a34a', 
                  border: '1px solid #dcfce7',
                  mb: 4,
                  fontSize: '0.85rem'
                }} 
              />

              <Divider sx={{ mb: 4 }} />

              {/* ID Metadata Fields */}
              <Stack spacing={2} sx={{ mb: 4, bgcolor: '#f8fafc', p: 2.5, borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary" fontWeight="700">Card Number</Typography>
                  <Typography variant="body2" fontWeight="900" color="#002855">{staff.cardNo}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary" fontWeight="700">Joining Date</Typography>
                  <Typography variant="body2" fontWeight="900" color="#002855">{staff.joiningDate}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary" fontWeight="700">Verification</Typography>
                  <Typography variant="body2" fontWeight="900" color="#16a34a">SECURITY CLEARED</Typography>
                </Box>
              </Stack>

              {/* Verified QR Scanner Block */}
              <Box sx={{ 
                p: 2, 
                bgcolor: 'white', 
                borderRadius: '24px', 
                display: 'inline-block', 
                border: '1px solid #e2e8f0', 
                boxShadow: '0 8px 24px rgba(0,0,0,0.02)' 
              }}>
                <QRCodeSVG value={`STAFF_VERIFIED:${staff.cardNo}:${staff.name}:${staff.department}:${staff.facilityName}`} size={140} level="H" />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, fontWeight: 800 }}>
                Scan with Gate Access Terminal to verify crew identity
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column: Detailed Info Ledger */}
        <Grid size={{ xs: 12, md: 7, lg: 7.5 }}>
          <Stack spacing={4}>
            
            {/* General Info Profile */}
            <Paper elevation={0} sx={{ p: 4, border: '1px solid #e2e8f0', borderRadius: '32px', bgcolor: 'white' }}>
              <Typography variant="h5" fontWeight="900" sx={{ mb: 4, color: '#002855' }}>General Information</Typography>
              
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <BadgeIcon color="primary" fontSize="small" sx={{ color: '#1d4ed8' }} />
                      <Typography variant="subtitle2" color="text.secondary" fontWeight="700">Full Legal Name</Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="800" color="#1e293b">{staff.name}</Typography>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <ApartmentIcon color="primary" fontSize="small" sx={{ color: '#1d4ed8' }} />
                      <Typography variant="subtitle2" color="text.secondary" fontWeight="700">Department</Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="800" color="#1e293b">{staff.department}</Typography>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <PhoneIcon color="primary" fontSize="small" sx={{ color: '#1d4ed8' }} />
                      <Typography variant="subtitle2" color="text.secondary" fontWeight="700">Phone Number</Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="800" color="#1e293b">{staff.phone}</Typography>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <EmailIcon color="primary" fontSize="small" sx={{ color: '#1d4ed8' }} />
                      <Typography variant="subtitle2" color="text.secondary" fontWeight="700">Email Address</Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="800" color="#1e293b">{staff.email}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>

            {/* Employment and Contact Info */}
            <Paper elevation={0} sx={{ p: 4, border: '1px solid #e2e8f0', borderRadius: '32px', bgcolor: 'white' }}>
              <Typography variant="h5" fontWeight="900" sx={{ mb: 4, color: '#002855' }}>Employment & Security Details</Typography>
              
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CalendarTodayIcon color="primary" fontSize="small" sx={{ color: '#1d4ed8' }} />
                      <Typography variant="subtitle2" color="text.secondary" fontWeight="700">Date of Joining</Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="800" color="#1e293b">{staff.joiningDate}</Typography>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <PlaceIcon color="primary" fontSize="small" sx={{ color: '#16a34a' }} />
                      <Typography variant="subtitle2" color="text.secondary" fontWeight="700">Assigned Duty Facility</Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="800" color="#16a34a">{staff.facilityName}</Typography>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <ShieldOutlinedIcon color="primary" fontSize="small" sx={{ color: '#16a34a' }} />
                      <Typography variant="subtitle2" color="text.secondary" fontWeight="700">Security Clearance</Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="800" color="#16a34a">Approved (Level 1)</Typography>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <ContactPhoneOutlinedIcon color="primary" fontSize="small" sx={{ color: '#ef4444' }} />
                      <Typography variant="subtitle2" color="text.secondary" fontWeight="700">Emergency Contact</Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="900" color="#ef4444">{staff.emergencyContact}</Typography>
                  </Stack>
                </Grid>

                <Grid size={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid size={12}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="700">Permanent Home Address</Typography>
                    <Typography variant="body1" fontWeight="700" color="#1e293b" sx={{ lineHeight: 1.7 }}>{staff.address}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>

            {/* Work Schedule & Access Details */}
            <Paper elevation={0} sx={{ p: 4, border: '1px solid #e2e8f0', borderRadius: '32px', bgcolor: 'white' }}>
              <Typography variant="h5" fontWeight="900" sx={{ mb: 4, color: '#002855' }}>Schedule & Access Details</Typography>
              
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="700">Designation / Role</Typography>
                    <Typography variant="body1" fontWeight="800" color="#1e293b">{staff.designation || staff.department}</Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="700">Employment Type</Typography>
                    <Typography variant="body1" fontWeight="800" color="#1e293b">{(staff.employmentType || 'FULL_TIME').replace('_', ' ')}</Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="700">Shift Timing</Typography>
                    <Typography variant="body1" fontWeight="800" color="#1e293b">{staff.shiftStart} to {staff.shiftEnd}</Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="700">Work Days</Typography>
                    <Typography variant="body1" fontWeight="800" color="#1e293b">{staff.workDays?.join(', ') || 'Mon-Sat'}</Typography>
                  </Stack>
                </Grid>
                
                <Grid size={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="700">Access Level</Typography>
                    <Typography variant="body1" fontWeight="800" color="#1e293b">{(staff.accessLevel || 'FACILITY_ONLY').replace('_', ' ')}</Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="700">ID Proof Provided</Typography>
                    <Typography variant="body1" fontWeight="800" color="#1e293b">{staff.idProofType} {staff.idProofNumber ? `(${staff.idProofNumber})` : ''}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>

          </Stack>
        </Grid>

      </Grid>
    </Box>
  );
}
