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

  const cardNo = resident.cardNo || `CMR-${resident.id?.substring(0, 6).toUpperCase()}`;

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

          {/* Right Column: Active Blue Card & QR Pass widget */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, height: '100%' }}>
              
              {/* Virtual ID Card */}
              <Zoom in={true} style={{ transitionDelay: '200ms' }}>
                <Paper elevation={0} sx={{ 
                  borderRadius: '24px', 
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
                  boxShadow: '0 20px 40px rgba(30, 58, 138, 0.2)',
                  position: 'relative',
                  overflow: 'hidden',
                  p: 3,
                  color: 'white'
                }}>
                  {/* Card Gloss Effect */}
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(105deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 65%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 4s infinite linear',
                    zIndex: 1,
                    pointerEvents: 'none'
                  }} />

                  <Box sx={{ position: 'relative', zIndex: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: '1px', color: 'rgba(255,255,255,0.7)' }}>
                        Smart Access
                      </Typography>
                      <MemoryRounded sx={{ fontSize: 28, color: '#fbbf24' }} />
                    </Box>

                    <Typography variant="h5" sx={{ 
                      fontWeight: 900, 
                      fontFamily: 'monospace', 
                      letterSpacing: '2px', 
                      mb: 3,
                      textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                    }}>
                      {cardNo.replace(/(.{4})/g, '$1 ').trim()}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mb: 0.5 }}>RESIDENT</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, letterSpacing: '0.5px' }}>{resident.name}</Typography>
                      </Box>
                      <Chip 
                        label="Master Fob" 
                        size="small" 
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.15)', 
                          backdropFilter: 'blur(10px)',
                          color: 'white', 
                          fontWeight: 800, 
                          fontSize: '0.65rem',
                          border: '1px solid rgba(255,255,255,0.2)'
                        }} 
                      />
                    </Box>
                  </Box>
                </Paper>
              </Zoom>

              {/* QR Code Section */}
              <Paper elevation={0} sx={{
                flex: 1,
                borderRadius: '24px',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                bgcolor: 'white',
                boxShadow: '0 12px 40px rgba(15, 23, 42, 0.04)',
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography variant="subtitle2" fontWeight="800" color="#0f172a" sx={{ mb: 3, fontSize: '0.9rem', letterSpacing: '-0.1px', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <QrIcon sx={{ fontSize: 20, color: '#3b82f6' }} /> Gate Entry Pass
                </Typography>

                <Box sx={{ position: 'relative', p: 2, borderRadius: '20px', border: '2px dashed #cbd5e1' }}>
                  <Box sx={{ 
                    position: 'absolute',
                    top: 0, left: 0, right: 0, height: '4px',
                    bgcolor: '#3b82f6',
                    boxShadow: '0 0 10px #3b82f6',
                    animation: 'scanLine 3s infinite cubic-bezier(0.4, 0, 0.2, 1)',
                    zIndex: 10,
                    borderRadius: '4px'
                  }} />
                  {qrImageDataUrl ? (
                    <Box 
                      component="img"
                      src={qrImageDataUrl} 
                      alt="Access QR"
                      sx={{ width: 160, height: 160, display: 'block', borderRadius: '12px' }}
                    />
                  ) : (
                    <QRCodeSVG 
                      value={qrCodeToken || resident.id || cardNo || ''} 
                      size={160} 
                      level="H" 
                      style={{ display: 'block' }}
                    />
                  )}
                </Box>
                
                <Typography variant="caption" sx={{ mt: 3, color: '#64748b', fontWeight: 600, textAlign: 'center', px: 2 }}>
                  Scan at the automated gate terminal for seamless entry
                </Typography>
              </Paper>

            </Box>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
}
