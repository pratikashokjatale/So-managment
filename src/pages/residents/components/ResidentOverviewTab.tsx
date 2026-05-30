import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Chip, Divider } from '@mui/material';
import { CreditCard as CardIcon, QrCode2 as QrIcon } from '@mui/icons-material';
import { QRCodeSVG } from 'qrcode.react';
import { getUserQrApi } from '@/apis/user';

interface ResidentOverviewTabProps {
  resident: any;
}

export default function ResidentOverviewTab({ resident }: ResidentOverviewTabProps) {
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);

  useEffect(() => {
    if (resident?.id) {
      getUserQrApi(resident.id)
        .then((res) => {
          const data = res?.data?.qrCode || res?.qrCode || res?.data?.code || res?.code || res?.data || res;
          if (typeof data === "string") {
            setQrCodeData(data);
          } else if (data && typeof data === "object" && data.code) {
            setQrCodeData(data.code);
          } else if (data && typeof data === "object" && data.qrCode) {
            setQrCodeData(data.qrCode);
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

  return (
    <Box sx={{ width: '100%' }}>
      <style>{`
        @keyframes scanLine {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>

      <Grid container spacing={4}>
        {/* Left Column: Administrative Details Card (8/12 width) */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ 
            p: 4.5, 
            borderRadius: '24px', 
            border: '1px solid #e2e8f0', 
            bgcolor: 'white',
            boxShadow: '0 8px 30px rgba(0,0,0,0.01)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <Typography variant="h6" fontWeight="900" color="#091542" sx={{ mb: 4, fontSize: '1.05rem', letterSpacing: '-0.2px' }}>
              Administrative Details
            </Typography>

            <Grid container spacing={4}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box>
                  <Typography variant="caption" color="#94a3b8" fontWeight="800" sx={{ display: 'block', mb: 0.8, letterSpacing: '0.6px', fontSize: '0.68rem', textTransform: 'uppercase' }}>
                    Full Name
                  </Typography>
                  <Typography variant="body1" fontWeight="800" color="#091542" sx={{ fontSize: '0.95rem' }}>
                    {resident.name}
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box>
                  <Typography variant="caption" color="#94a3b8" fontWeight="800" sx={{ display: 'block', mb: 0.8, letterSpacing: '0.6px', fontSize: '0.68rem', textTransform: 'uppercase' }}>
                    Residence Category
                  </Typography>
                  <Typography variant="body1" fontWeight="800" color="#091542" sx={{ fontSize: '0.95rem' }}>
                    {resident.category || 'Resident'} • {resident.role}
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box>
                  <Typography variant="caption" color="#94a3b8" fontWeight="800" sx={{ display: 'block', mb: 0.8, letterSpacing: '0.6px', fontSize: '0.68rem', textTransform: 'uppercase' }}>
                    Aadhaar Card
                  </Typography>
                  <Typography variant="body1" fontWeight="800" color={aadhaarStatus ? '#10b981' : '#f59e0b'} sx={{ fontSize: '0.95rem' }}>
                    {aadhaarStatus ? 'Verified' : 'Pending Verification'}
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box>
                  <Typography variant="caption" color="#94a3b8" fontWeight="800" sx={{ display: 'block', mb: 0.8, letterSpacing: '0.6px', fontSize: '0.68rem', textTransform: 'uppercase' }}>
                    Pan Card
                  </Typography>
                  <Typography variant="body1" fontWeight="800" color={panStatus ? '#10b981' : '#f59e0b'} sx={{ fontSize: '0.95rem' }}>
                    {panStatus ? 'Verified' : 'Pending Verification'}
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box>
                  <Typography variant="caption" color="#94a3b8" fontWeight="800" sx={{ display: 'block', mb: 0.8, letterSpacing: '0.6px', fontSize: '0.68rem', textTransform: 'uppercase' }}>
                    Contact Phone
                  </Typography>
                  <Typography variant="body1" fontWeight="800" color="#091542" sx={{ fontSize: '0.95rem' }}>
                    {resident.phone || 'N/A'}
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box>
                  <Typography variant="caption" color="#94a3b8" fontWeight="800" sx={{ display: 'block', mb: 0.8, letterSpacing: '0.6px', fontSize: '0.68rem', textTransform: 'uppercase' }}>
                    Apartment / Flat
                  </Typography>
                  <Typography variant="body1" fontWeight="800" color="#091542" sx={{ fontSize: '0.95rem' }}>
                    {flatLabel}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Right Column: Active Blue Card & QR Pass widget (4/12 width) */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ 
            p: 3.5, 
            borderRadius: '24px', 
            border: '1px solid #e2e8f0', 
            bgcolor: 'white',
            boxShadow: '0 8px 30px rgba(0,0,0,0.01)',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            alignItems: 'center'
          }}>
            {/* Top Mockup Card */}
            <Box sx={{ width: '100%' }}>
              <Typography variant="subtitle2" fontWeight="900" color="#091542" sx={{ mb: 2, fontSize: '0.9rem', letterSpacing: '-0.1px', textAlign: 'center' }}>
                Active Blue Card
              </Typography>
              
              <Box sx={{
                borderRadius: '16px',
                bgcolor: '#f0f7ff',
                border: '1.5px dashed #2563eb',
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                maxWidth: 260,
                mx: 'auto'
              }}>
                <CardIcon sx={{ fontSize: 32, color: '#2563eb' }} />
                <Typography variant="body1" fontWeight="900" color="#2563eb" sx={{ letterSpacing: '1px', fontFamily: 'monospace' }}>
                  {cardNo}
                </Typography>
                <Chip 
                  label="Master Fob" 
                  size="small" 
                  sx={{ 
                    bgcolor: '#2563eb', 
                    color: 'white', 
                    fontWeight: 900, 
                    fontSize: '0.62rem', 
                    height: 20,
                    px: 0.5
                  }} 
                />
              </Box>
            </Box>

            <Divider sx={{ width: '100%', borderColor: '#f1f5f9' }} />

            {/* QR Pass directly embedded below */}
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="subtitle2" fontWeight="900" color="#091542" sx={{ mb: 2, fontSize: '0.9rem', letterSpacing: '-0.1px', display: 'flex', alignItems: 'center', gap: 1 }}>
                <QrIcon sx={{ fontSize: 18 }} /> Gate Entry QR Pass
              </Typography>

              <Box sx={{ 
                p: 2, 
                bgcolor: 'white', 
                borderRadius: '24px', 
                display: 'inline-block', 
                border: '1px solid #e2e8f0', 
                boxShadow: '0 8px 24px rgba(0,0,0,0.02)' 
              }}>
                <QRCodeSVG 
                  value={qrCodeData || resident.id || cardNo || ''} 
                  size={140} 
                  level="H" 
                />
              </Box>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, fontWeight: 800, textAlign: 'center' }}>
              Scan with Gate Access Terminal to verify resident identity
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
