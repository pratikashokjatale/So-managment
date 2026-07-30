import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Chip, Divider, Fade, Zoom } from '@mui/material';
import { 
  CreditCard as CardIcon, 
  QrCode2 as QrIcon, 
  PersonRounded, 
  BadgeRounded, 
  VerifiedUserRounded, 
  PhoneRounded, 
  HomeRounded,
  ContactPageRounded,
  MemoryRounded
} from '@mui/icons-material';
import { QRCodeSVG } from 'qrcode.react';
import { getUserQrApi } from '@/apis/user';
import logoImg from '@/assets/logo.jpeg';

interface ResidentOverviewTabProps {
  resident: any;
}

export default function ResidentOverviewTab({ resident }: ResidentOverviewTabProps) {
  const [qrCodeToken, setQrCodeToken] = useState<string | null>(null);
  const [qrImageDataUrl, setQrImageDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (resident?.id) {
      getUserQrApi(resident.id)
        .then((res) => {
          const qrData = res?.data || res;
          if (qrData?.qrImageDataUrl) {
            setQrImageDataUrl(qrData.qrImageDataUrl);
          }
          if (qrData?.accessQrToken) {
            setQrCodeToken(qrData.accessQrToken);
          } else {
            // fallback support for legacy formats
            const fallbackToken = qrData?.qrCode || qrData?.code || (typeof qrData === "string" ? qrData : null);
            setQrCodeToken(fallbackToken);
          }
        })
        .catch((err) => console.log('Failed to fetch QR:', err));
    }
  }, [resident?.id]);

  const identityProofs = resident?.documents?.IDENTITY_PROOF || [];
  
  const flatObj = resident?.flat;
  const flatLabel = flatObj
    ? `Flat ${flatObj.flatNumber} • Floor ${flatObj.floorNumber} • ${flatObj.flatType || ''} (${flatObj.occupancyType || ''})`
    : (resident?.apartment || (resident?.flatId ? `Flat ID: ${resident.flatId}` : 'N/A'));

  const cardNo = resident.cardNumber || resident.cardNo || `CMR-${String(resident.id || '').substring(0, 6).toUpperCase()}`;

  // Aadhaar/PAN status checks
  const aadhaarStatus = identityProofs.find((d: any) => d.documentType === 'AADHAR_CARD')?.isVerified;
  const panStatus = identityProofs.find((d: any) => d.documentType === 'PAN_CARD')?.isVerified;

  const InfoItem = ({ icon, label, value, valueColor = '#091542' }: any) => (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'flex-start', 
      gap: 1.5,
      p: 2,
      borderRadius: '16px',
      transition: 'all 0.3s ease',
      '&:hover': {
        bgcolor: '#f8fafc',
        transform: 'translateY(-2px)'
      }
    }}>
      <Box sx={{ 
        mt: 0.5,
        p: 1, 
        borderRadius: '12px', 
        bgcolor: '#eff6ff', 
        color: '#3b82f6',
        display: 'flex' 
      }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="caption" color="#64748b" fontWeight="700" sx={{ display: 'block', mb: 0.5, letterSpacing: '0.8px', fontSize: '0.65rem', textTransform: 'uppercase' }}>
          {label}
        </Typography>
        <Typography variant="body1" fontWeight="800" color={valueColor} sx={{ fontSize: '0.95rem' }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Fade in={true} timeout={500}>
      <Box sx={{ width: '100%', pt: 1 }}>
        <style>{`
          @keyframes scanLine {
            0% { top: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>

        <Grid container spacing={4}>
          {/* Left Column: Administrative Details Card */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper elevation={0} sx={{ 
              p: { xs: 3, sm: 4.5 }, 
              borderRadius: '28px', 
              border: '1px solid rgba(226, 232, 240, 0.8)', 
              bgcolor: 'white',
              background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
              boxShadow: '0 12px 40px rgba(15, 23, 42, 0.04)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Decorative background element */}
              <Box sx={{
                position: 'absolute',
                top: -100,
                right: -100,
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, rgba(255,255,255,0) 70%)',
                zIndex: 0
              }} />

              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                  <Box sx={{ p: 1.2, borderRadius: '14px', bgcolor: '#1e293b', color: 'white', display: 'flex' }}>
                    <ContactPageRounded sx={{ fontSize: 24 }} />
                  </Box>
                  <Typography variant="h6" fontWeight="900" color="#0f172a" sx={{ fontSize: '1.25rem', letterSpacing: '-0.3px' }}>
                    Administrative Details
                  </Typography>
                </Box>

                <Grid container spacing={1}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <InfoItem 
                      icon={<PersonRounded sx={{ fontSize: 20 }} />} 
                      label="Full Name" 
                      value={resident.name} 
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <InfoItem 
                      icon={<BadgeRounded sx={{ fontSize: 20 }} />} 
                      label="Residence Category" 
                      value={`${resident.category || 'Resident'} • ${resident.role}`} 
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <InfoItem 
                      icon={<VerifiedUserRounded sx={{ fontSize: 20 }} />} 
                      label="Aadhaar Card" 
                      value={aadhaarStatus ? 'Verified' : 'Pending Verification'} 
                      valueColor={aadhaarStatus ? '#10b981' : '#f59e0b'}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <InfoItem 
                      icon={<CardIcon sx={{ fontSize: 20 }} />} 
                      label="Pan Card" 
                      value={panStatus ? 'Verified' : 'Pending Verification'} 
                      valueColor={panStatus ? '#10b981' : '#f59e0b'}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <InfoItem 
                      icon={<PhoneRounded sx={{ fontSize: 20 }} />} 
                      label="Contact Phone" 
                      value={resident.phone || 'N/A'} 
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <InfoItem 
                      icon={<HomeRounded sx={{ fontSize: 20 }} />} 
                      label="Apartment / Flat" 
                      value={flatLabel} 
                    />
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>

          {/* Right Column: Physical ID Card Widget */}
          <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Paper 
              elevation={1} 
              sx={{ 
                width: '100%', 
                minHeight: 440,
                border: "1px solid #e2e8f0", 
                borderRadius: "16px", 
                display: "flex", 
                flexDirection: "column", 
                overflow: "hidden", 
                bgcolor: "#ffffff",
                position: "relative",
                boxShadow: '0 20px 40px rgba(15, 23, 42, 0.06)'
              }}
            >
              {/* Logo placeholder */}
              <Box sx={{ mt: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Box component="img" src={logoImg} alt="Marbella Logo" sx={{ height: 50, objectFit: 'contain' }} />
                <Box sx={{ width: '40%', height: '1px', bgcolor: '#cbd5e1', mt: 1.5 }} />
              </Box>

              {/* Avatar placeholder */}
              <Box sx={{ mt: 3, mx: "auto", width: 120, height: 140, bgcolor: "#e2e8f0", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <PersonRounded sx={{ fontSize: 70, color: "#94a3b8" }} />
              </Box>

              {/* Title and ID */}
              <Box sx={{ mt: 2.5, textAlign: "center" }}>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 700, color: "#1e3a8a", letterSpacing: "1px" }}>
                  RESIDENT ID NUMBER
                </Typography>
                <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 600, color: "#1e293b", letterSpacing: "3px", mt: 0.5 }}>
                  {String(cardNo).replace(/(.{2})/g, '$1 ').trim()}
                </Typography>
              </Box>

              {/* QR Code */}
              <Box sx={{ mt: 2, mx: "auto", flexGrow: 1, display: "flex", alignItems: "center", pb: 5 }}>
                {qrImageDataUrl ? (
                  <Box 
                    component="img"
                    src={qrImageDataUrl} 
                    alt="Access QR"
                    sx={{ width: 100, height: 100, display: 'block', borderRadius: '8px' }}
                  />
                ) : (
                  <QRCodeSVG 
                    value={String(qrCodeToken || resident.id || cardNo || '')} 
                    size={100} 
                    level="H" 
                    style={{ display: 'block' }}
                  />
                )}
              </Box>

              {/* Wave footer */}
              <Box sx={{ mt: "auto", width: "100%", position: 'relative' }}>
                {/* Gold Wave Layer */}
                <svg viewBox="0 0 200 24" preserveAspectRatio="none" style={{ width: "100%", height: "20px", display: "block" }}>
                  <path d="M0,12 C50,-5 150,20 200,5 L200,24 L0,24 Z" fill="#bca47c" />
                </svg>
                {/* Dark Blue Wave Layer (overlapping) */}
                <svg viewBox="0 0 200 24" preserveAspectRatio="none" style={{ width: "100%", height: "20px", display: "block", marginTop: "-17px", position: "relative", zIndex: 2 }}>
                  <path d="M0,12 C50,-5 150,20 200,5 L200,24 L0,24 Z" fill="#1e293b" />
                </svg>
                {/* Bottom block */}
                <Box sx={{ bgcolor: "#1e293b", height: "40px", position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", marginTop: "-1px" }}>
                  <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#ffffff", letterSpacing: "0.5px" }}>
                    clubmarbella.app
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
}
