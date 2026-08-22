import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BusinessIcon from "@mui/icons-material/Business";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ResidentActivityTimeline from "../../residents/components/ResidentActivityTimeline";
import { getUserDetailsApi } from "@/apis/user";

interface OnboardingCaseModalProps {
  open: boolean;
  onClose: () => void;
  user: any;
}

const OnboardingCaseModal: React.FC<OnboardingCaseModalProps> = ({ open, onClose, user }) => {
  if (!user) return null;

  const roleLabel = user.accountRole === "TENANT" ? "Tenant" : "Owner";
  const flatNum = user.flat?.flatNumber || user.flatNumber || "Unknown Flat";
  const towerName = user.towerName || user.flat?.tower?.name || user.flat?.towerName || user.tower?.name || (user.flat?.towerId ? "Tower " + user.flat.towerId.slice(0, 4).toUpperCase() : "Unknown Tower");
  
  let statusBadge = "Collecting · 70% paid";
  if (user.status === "ACTIVE") {
    statusBadge = "Handover complete — active";
  } else if (user.status === "PENDING") {
    statusBadge = "Released — handover pending";
  }

  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    if (user?.id) {
      getUserDetailsApi(user.id)
        .then((res) => {
          setUserDetails(res?.data || res || null);
        })
        .catch(console.error);
    }
  }, [user?.id]);

  const displayPhone = userDetails?.phone || user?.phone;
  const displayEmail = userDetails?.email || user?.email;
  const displayAadhaar = userDetails?.aadhaarNumber || user?.aadhaarNumber;
  const displayPan = userDetails?.panNumber || user?.panNumber;

  const maskPhone = (phone?: string) => phone ? `•••• ${phone.slice(-4)}` : "—";
  const maskAadhaar = (aadhaar?: string) => aadhaar ? `XXXX XXXX ${aadhaar.slice(-4)}` : "—";
  const maskPAN = (pan?: string) => {
    if (!pan || pan.length < 5) return "—";
    return `${pan.slice(0, 1)}**${pan.slice(3, 5)}•${pan.slice(-2)}`;
  };

  let rawDocs = userDetails?.documents || userDetails?.userDocuments;
  let docs: any[] = [];
  if (Array.isArray(rawDocs)) {
    docs = rawDocs;
  } else if (rawDocs && Array.isArray(rawDocs.items)) {
    docs = rawDocs.items;
  } else if (rawDocs && Array.isArray(rawDocs.data)) {
    docs = rawDocs.data;
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: "16px",
          overflow: "hidden",
          bgcolor: "#f8fafc",
          maxHeight: "90vh",
        }
      }}
    >
      {/* Header */}
      <Box sx={{ bgcolor: "#7A4FB5", color: "#fff", p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Box sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 48, height: 48, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BusinessIcon sx={{ fontSize: 24, color: "#fff" }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: "1.1rem" }}>
              {user.name || "Rohit & Priya Mehra"}
            </Typography>
            <Typography sx={{ fontSize: "0.8rem", opacity: 0.9, mt: 0.25 }}>
              CRM-2041 · {roleLabel} · Unit {flatNum} · Marbella Grand
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
        
        {/* Info Block */}
        <Box sx={{ bgcolor: "#f1f5f9", borderRadius: "16px", p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <BusinessIcon sx={{ color: "#7A4FB5", fontSize: 20 }} />
              <Typography sx={{ fontWeight: 600, color: "#1e293b", fontSize: "0.95rem" }}>
                Unit {flatNum} allotted · 12 Jul
              </Typography>
            </Box>
            <Box sx={{ bgcolor: "#fff", border: "1px solid #e2e8f0", borderRadius: "20px", px: 2, py: 0.5 }}>
              <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#334155" }}>
                {statusBadge}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
            <Typography sx={{ color: "#64748b" }}>Phone</Typography>
            <Typography sx={{ color: "#1e293b", fontWeight: 500 }}>{maskPhone(displayPhone)}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
            <Typography sx={{ color: "#64748b" }}>Email</Typography>
            <Typography sx={{ color: "#1e293b", fontWeight: 500 }}>{displayEmail || "—"}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
            <Typography sx={{ color: "#64748b" }}>Aadhaar</Typography>
            <Typography sx={{ color: "#1e293b", fontWeight: 500 }}>{maskAadhaar(displayAadhaar)}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
            <Typography sx={{ color: "#64748b" }}>PAN</Typography>
            <Typography sx={{ color: "#1e293b", fontWeight: 500 }}>{maskPAN(displayPan)}</Typography>
          </Box>
          
          <Typography sx={{ color: "#94a3b8", fontSize: "0.75rem", mt: 1 }}>
            Aadhaar & PAN entered manually once at profile creation — reused across the app, never auto-filled.
          </Typography>
        </Box>

        {/* Activity Logs (Replaces Payment Trail) */}
        <Box sx={{ bgcolor: "#fff", border: "1px solid #e2e8f0", borderRadius: "16px", p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AccountBalanceWalletOutlinedIcon sx={{ color: "#b45309", fontSize: 20 }} />
              <Typography sx={{ fontWeight: 700, color: "#1e293b" }}>Activity logs</Typography>
            </Box>
          </Box>
          <ResidentActivityTimeline userId={user.id} compact={true} />
        </Box>

        {/* Documents Block */}
        <Box sx={{ bgcolor: "#fff", border: "1px solid #e2e8f0", borderRadius: "16px", p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <DescriptionOutlinedIcon sx={{ color: "#7A4FB5", fontSize: 20 }} />
              <Typography sx={{ fontWeight: 700, color: "#1e293b" }}>Documents ({docs.length})</Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              startIcon={<FileUploadOutlinedIcon />}
              sx={{
                color: "#7A4FB5",
                borderColor: "#e9d5ff",
                bgcolor: "#faf5ff",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "8px",
                px: 2,
                "&:hover": { borderColor: "#d8b4fe", bgcolor: "#f3e8ff" }
              }}
            >
              Add
            </Button>
          </Box>

          <Box sx={{ bgcolor: "#dcfce7", color: "#166534", borderRadius: "8px", p: 1.5, display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 18 }} />
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 500 }}>
              Released — downloadable & shareable
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {docs.map((doc: any, i: number) => (
              <Box key={i} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <DescriptionOutlinedIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                  <Typography sx={{ color: "#334155", fontWeight: 500, fontSize: "0.9rem" }}>{doc.title || doc.documentType || doc.name || "Document"}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Typography sx={{ color: "#94a3b8", fontSize: "0.8rem", mr: 1 }}>
                    {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : "—"}
                  </Typography>
                  {(doc.fileUrl || doc.url || doc.pdfUrl) && (
                    <Box 
                      component="a"
                      href={doc.fileUrl || doc.url || doc.pdfUrl}
                      target="_blank"
                      sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "8px", bgcolor: "#f1f5f9", cursor: "pointer", "&:hover": { bgcolor: "#e2e8f0" }, color: "inherit" }}
                    >
                      <DownloadOutlinedIcon sx={{ fontSize: 18, color: "#3b82f6" }} />
                    </Box>
                  )}
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "8px", bgcolor: "#f1f5f9", cursor: "pointer", "&:hover": { bgcolor: "#e2e8f0" } }}>
                    <ShareOutlinedIcon sx={{ fontSize: 18, color: "#3b82f6" }} />
                  </Box>
                </Box>
              </Box>
            ))}
            {docs.length === 0 && (
              <Typography sx={{ color: "#64748b", fontSize: "0.85rem", textAlign: "center", py: 2 }}>
                No documents found.
              </Typography>
            )}
          </Box>
        </Box>

      </DialogContent>
    </Dialog>
  );
};

export default OnboardingCaseModal;
