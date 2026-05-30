import { Box, Typography, Button, Paper, Chip, Grid } from '@mui/material';
import { 
  Upload as UploadIcon,
  Description as FileIcon,
  CheckCircle as CheckIcon,
  HourglassEmpty as PendingIcon 
} from '@mui/icons-material';
import { getFileUrl } from '@/utils/file';

interface ResidentDocumentsTabProps {
  resident: any;
  family: any[];
  onViewDocument: (title: string, url: string) => void;
}

const isPdfFile = (urlOrName: string) => {
  if (!urlOrName) return false;
  return urlOrName.toLowerCase().endsWith('.pdf');
};

export default function ResidentDocumentsTab({
  resident,
  family,
  onViewDocument
}: ResidentDocumentsTabProps) {
  const identityProofs = resident?.documents?.IDENTITY_PROOF || [];
  const personalDocs = resident?.documents?.PERSONAL_DOCUMENTS || [];
  const allDocs = [...identityProofs, ...personalDocs];

  const familyDocs = family.flatMap((member: any) => {
    const memberDocs = [
      ...(member.documents?.IDENTITY_PROOF || []),
      ...(member.documents?.PERSONAL_DOCUMENTS || [])
    ];
    return memberDocs.map((doc: any) => ({
      ...doc,
      member: `${member.name} (${member.relationship})`
    }));
  });

  return (
    <Box>
      <StackHeader />
      
      <Typography variant="subtitle1" fontWeight="800" color="#091542" sx={{ mb: 2 }}>Master Resident Documents</Typography>
      {allDocs.length > 0 ? (
        <Grid container spacing={4} sx={{ mb: 5 }}>
          {allDocs.map((doc) => (
            <Grid size={{ xs: 12, md: 4 }} key={doc.id || doc.title || doc.documentType}>
              <Paper elevation={0} sx={{ 
                p: 4, 
                borderRadius: '28px', 
                border: '1px solid #e2e8f0', 
                textAlign: 'center', 
                bgcolor: 'white',
                boxShadow: '0 10px 30px rgba(0,0,0,0.01)',
                transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 15px 35px rgba(9, 21, 66, 0.04)', borderColor: '#cbd5e1' }
              }}>
                <Box sx={{ 
                  p: (doc.photoUrl && !isPdfFile(doc.photoUrl)) ? 0 : 3, 
                  bgcolor: '#f8fafc', 
                  borderRadius: '20px', 
                  mb: 3, 
                  display: 'flex', 
                  justifyContent: 'center', 
                  height: 140, 
                  alignItems: 'center', 
                  overflow: 'hidden',
                  border: '1px solid rgba(226, 232, 240, 0.6)'
                }}>
                  {doc.photoUrl && !isPdfFile(doc.photoUrl) ? (
                    <Box component="img" src={getFileUrl(doc.photoUrl)} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <FileIcon sx={{ fontSize: 48, color: '#091542' }} />
                  )}
                </Box>
                <Typography variant="body1" fontWeight="900" color="#091542" sx={{ mb: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.title || doc.documentType}</Typography>
                <Chip
                  icon={doc.isVerified ? <CheckIcon sx={{ fontSize: '14px !important' }} /> : <PendingIcon sx={{ fontSize: '14px !important' }} />}
                  label={doc.isVerified ? 'Verified' : (doc.status || 'PENDING')}
                  size="small"
                  sx={{
                    mb: 2,
                    bgcolor: doc.isVerified ? '#f0fdf4' : '#fffbeb',
                    color: doc.isVerified ? '#10b981' : '#f59e0b',
                    fontWeight: 800, 
                    borderRadius: '10px'
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {doc.photoFileName || doc.pdfFileName || 'kyc_document.png'}
                  {(doc.photoSize || doc.pdfSize) ? ` (${Math.round((doc.photoSize || doc.pdfSize) / 1024)} KB)` : ''}
                </Typography>
                {doc.verifiedAt && (
                  <Typography variant="caption" color="#10b981" fontWeight="800" sx={{ display: 'block', mb: 1.5 }}>
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
                    onClick={() => onViewDocument(doc.title || doc.documentType, doc.photoUrl || doc.pdfUrl)}
                    sx={{ 
                      borderRadius: '12px', 
                      fontWeight: 800, 
                      textTransform: 'none', 
                      borderColor: '#cbd5e1', 
                      color: '#091542',
                      py: 1,
                      '&:hover': { bgcolor: '#f8fafc', borderColor: '#091542' }
                    }}
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

      <Typography variant="subtitle1" fontWeight="800" color="#091542" sx={{ mb: 2 }}>Family Member KYC Documents</Typography>
      {familyDocs.length > 0 ? (
        <Grid container spacing={4}>
          {familyDocs.map((doc, idx) => (
            <Grid size={{ xs: 12, md: 4 }} key={idx}>
              <Paper elevation={0} sx={{ 
                p: 4, 
                borderRadius: '28px', 
                border: '1px solid #e2e8f0', 
                textAlign: 'center', 
                bgcolor: 'white',
                boxShadow: '0 10px 30px rgba(0,0,0,0.01)',
                transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 15px 35px rgba(9, 21, 66, 0.04)', borderColor: '#cbd5e1' }
              }}>
                <Box sx={{ 
                  p: (doc.photoUrl && !isPdfFile(doc.photoUrl)) ? 0 : 3, 
                  bgcolor: '#f8fafc', 
                  borderRadius: '20px', 
                  mb: 3, 
                  display: 'flex', 
                  justifyContent: 'center', 
                  height: 140, 
                  alignItems: 'center', 
                  overflow: 'hidden',
                  border: '1px solid rgba(226, 232, 240, 0.6)'
                }}>
                  {doc.photoUrl && !isPdfFile(doc.photoUrl) ? (
                    <Box component="img" src={getFileUrl(doc.photoUrl)} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <FileIcon sx={{ fontSize: 48, color: '#091542' }} />
                  )}
                </Box>
                <Typography variant="caption" color="primary" fontWeight="800" sx={{ display: 'block', mb: 0.5 }}>{doc.member}</Typography>
                <Typography variant="body1" fontWeight="900" color="#091542" sx={{ mb: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.title || doc.documentType}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {doc.photoFileName || doc.pdfFileName || 'kyc_document.png'}
                </Typography>
                <Typography variant="caption" color="#10b981" fontWeight="800" sx={{ mb: 3, display: 'block' }}>✓ VERIFIED BY ADMIN</Typography>
                {(doc.photoUrl || doc.pdfUrl) && (
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    onClick={() => onViewDocument(doc.title || doc.documentType, doc.photoUrl || doc.pdfUrl)}
                    sx={{ 
                      borderRadius: '12px', 
                      fontWeight: 800, 
                      textTransform: 'none', 
                      borderColor: '#cbd5e1', 
                      color: '#091542',
                      py: 1,
                      '&:hover': { bgcolor: '#f8fafc', borderColor: '#091542' }
                    }}
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
  );
}

// Internal component for clean layout
function StackHeader() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', mb: 4 }}>
      <Typography variant="h6" fontWeight="900" color="#091542">KYC Compliance Repository</Typography>
      <Button 
        variant="outlined" 
        startIcon={<UploadIcon />} 
        sx={{ 
          borderRadius: '12px', 
          fontWeight: 800, 
          borderColor: '#091542', 
          color: '#091542', 
          textTransform: 'none',
          px: 3,
          py: 1,
          '&:hover': { bgcolor: 'rgba(9, 21, 66, 0.05)', borderColor: '#122566' }
        }}
      >
        Upload New Document
      </Button>
    </Box>
  );
}