import { useState, useEffect, useRef } from "react";
import { Box, Typography, Dialog, DialogTitle, DialogContent, IconButton, Chip, TextField, Button, Avatar, Grid, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SensorsIcon from "@mui/icons-material/Sensors";
import GraphicEqOutlinedIcon from "@mui/icons-material/GraphicEqOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import { Html5Qrcode } from "html5-qrcode";
import toast from "react-hot-toast";
import { verifyAccessApi, type VerifyAccessPayload } from "@/apis/access";
import { updateUserApi } from "@/apis/user";
import { getFlatDetailsApi } from "@/apis/flat";

interface ScanModalProps {
  open: boolean;
  onClose: () => void;
  accessScope?: "SOCIETY_ENTRY" | "FACILITY_ACCESS";
  accessZone?: string;
  facilityId?: string;
}

export default function ScanModal({ 
  open, 
  onClose,
  accessScope = "SOCIETY_ENTRY",
  accessZone = "MAIN_GATE",
  facilityId
}: ScanModalProps) {
  const [scannedText, setScannedText] = useState("");
  const [verifiedData, setVerifiedData] = useState<any>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isProcessing = useRef(false);

  // Handle closing modal
  const handleClose = () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop().catch(console.error);
    }
    setScannedText("");
    setVerifiedData(null);
    onClose();
  };

  const handleVerifyScan = async (token: string) => {
    const cleanToken = token?.trim();
    if (!cleanToken || isProcessing.current) return;
    
    isProcessing.current = true;
    try {
      const payload: VerifyAccessPayload = {
        accessScope,
        accessQrToken: cleanToken,
        accessZone,
        ...(accessScope === "SOCIETY_ENTRY" ? { sourceDeviceId: accessZone === "MAIN_GATE" ? "MAIN-GATE-01" : `${accessZone}-01` } : {}),
        ...(accessScope === "FACILITY_ACCESS" ? { facilityId, attendanceAction: "CHECK_IN" } : {})
      };
      
      const promise = verifyAccessApi(payload);
      toast.promise(promise, {
        loading: "Verifying scan...",
        success: "Verification successful!",
        error: (err) => err?.response?.data?.message || err?.message || "Verification failed"
      });
      
      const res = await promise;
      const userData = res?.user || res?.data?.user || res?.data || res;

      let flatNumber = userData?.flat?.number || userData?.flat?.flatNumber || userData?.flatNumber;
      if (!flatNumber && userData?.flatId) {
        try {
          const flatRes = await getFlatDetailsApi(userData.flatId);
          flatNumber = flatRes?.data?.flatNumber || flatRes?.data?.number || flatRes?.flatNumber || flatRes?.number;
        } catch (e) {
          console.warn("Failed to fetch flat details", e);
        }
      }

      setVerifiedData({
        id: userData?.id || userData?._id || "",
        accessGranted: res?.data?.accessGranted !== false && res?.accessGranted !== false,
        reason: res?.data?.reason || res?.reason || "Unknown",
        name: userData?.name || "Unknown User",
        status: userData?.status || res?.data?.accessStatus?.accessStatus || "ACTIVE",
        residentId: userData?.cardNumber || userData?.id?.substring(0,8) || "N/A",
        flatNumber: flatNumber || userData?.flatId?.substring(0,6) || "N/A",
        tier: userData?.accountRole || userData?.role || "Member",
        walletBalance: userData?.walletBalance || "0",
        project: userData?.project?.name || "Grand" // Defaulting if not in response
      });
    } catch (err) {
      console.warn("Scan verify error:", err);
      setScannedText(""); // reset so they can scan again
    } finally {
      setTimeout(() => { isProcessing.current = false; }, 1000); // 1s debounce
    }
  };

  const handleBlockCard = async () => {
    if (!verifiedData?.id) {
      toast.error("User ID not found");
      return;
    }
    try {
      const promise = updateUserApi(verifiedData.id, { status: "INACTIVE" });
      toast.promise(promise, {
        loading: "Blocking card...",
        success: "Card blocked successfully",
        error: "Failed to block card"
      });
      await promise;
      handleClose();
    } catch (err) {
      console.error("Failed to block card:", err);
    }
  };

  const handleUnblockCard = async () => {
    if (!verifiedData?.id) {
      toast.error("User ID not found");
      return;
    }
    try {
      const promise = updateUserApi(verifiedData.id, { status: "ACTIVE" });
      toast.promise(promise, {
        loading: "Unblocking card...",
        success: "Card unblocked successfully",
        error: "Failed to unblock card"
      });
      await promise;
      handleClose();
    } catch (err) {
      console.error("Failed to unblock card:", err);
    }
  };

  useEffect(() => {
    if (open) {
      const startScanner = async () => {
        try {
          const html5QrCode = new Html5Qrcode("qr-reader");
          scannerRef.current = html5QrCode;
          
          await html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10 },
            (decodedText) => {
              setScannedText(decodedText);
              handleVerifyScan(decodedText);
              if (html5QrCode.isScanning) {
                html5QrCode.stop().catch(console.error);
              }
            },
            () => {
              // Ignore frame errors
            }
          );
        } catch (err) {
          console.warn("Camera start failed", err);
        }
      };

      // Slight delay to ensure the DOM element is fully rendered before mounting scanner
      setTimeout(startScanner, 100);

      return () => {
        if (scannerRef.current && scannerRef.current.isScanning) {
          scannerRef.current.stop().catch(console.error);
        }
      };
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "16px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" } }}>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 2, pt: 2, px: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <SensorsIcon sx={{ color: "#204a7b" }} />
          <Typography sx={{ fontWeight: "bold", color: "#091542", fontSize: "1.1rem" }}>Scan QR / RFID</Typography>
          <Chip label="CRM" size="small" sx={{ height: 20, fontSize: "0.7rem", bgcolor: "#eff6ff", color: "#3b82f6", fontWeight: 600 }} />
        </Box>
        <IconButton onClick={handleClose} size="small" sx={{ color: "#64748b", border: "1px solid #e2e8f0", borderRadius: "10px" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: verifiedData ? 0 : 4, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        
        {verifiedData ? (
          <Box sx={{ display: "flex", flexDirection: "column", width: "100%", textAlign: "left" }}>
            {/* Dynamic Header */}
            <Box sx={{ 
              bgcolor: verifiedData.accessGranted ? "#0d944d" : "#ef4444", 
              color: "white", 
              pt: 5, pb: 4, px: 3, 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center",
              textAlign: "center"
            }}>
              <Box sx={{ width: 80, height: 80, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.8)", display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                {verifiedData.accessGranted ? (
                  <CheckCircleOutlineIcon sx={{ fontSize: 50, color: "white" }} />
                ) : (
                  <CancelOutlinedIcon sx={{ fontSize: 50, color: "white" }} />
                )}
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: "1.4rem", letterSpacing: "1px", mb: 0.5 }}>
                {verifiedData.accessGranted ? "ACCESS GRANTED" : "ACCESS DENIED"}
              </Typography>
              <Typography sx={{ fontSize: "0.95rem", opacity: 0.9 }}>
                {verifiedData.accessGranted ? "Valid — access granted" : `Denied — ${verifiedData.reason.replace(/_/g, " ")}`}
              </Typography>
            </Box>

            {/* Profile Area */}
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Avatar sx={{ width: 64, height: 64, bgcolor: "#f1f5f9", color: "#94a3b8" }} />
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: "1.2rem", color: "#091542" }}>
                      {verifiedData.name}
                    </Typography>
                    <Chip label={verifiedData.status} size="small" sx={{ bgcolor: "#dcfce7", color: "#166534", fontWeight: 600, height: 20, fontSize: "0.7rem" }} />
                  </Box>
                  <Typography sx={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 500, letterSpacing: "0.5px" }}>
                    RESIDENT ID • {verifiedData.residentId}
                  </Typography>
                </Box>
              </Box>

              {/* Cards Grid */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: "12px", borderColor: "#e2e8f0", boxShadow: "none" }}>
                    <Typography sx={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 600, mb: 0.5, letterSpacing: "0.5px" }}>APARTMENT</Typography>
                    <Typography sx={{ fontWeight: 700, color: "#091542", fontSize: "1.05rem" }}>{verifiedData.flatNumber}</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: "12px", borderColor: "#e2e8f0", boxShadow: "none" }}>
                    <Typography sx={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 600, mb: 0.5, letterSpacing: "0.5px" }}>TIER</Typography>
                    <Typography sx={{ fontWeight: 700, color: "#091542", fontSize: "1.05rem" }}>{verifiedData.tier}</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: "12px", borderColor: "#e2e8f0", boxShadow: "none" }}>
                    <Typography sx={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 600, mb: 0.5, letterSpacing: "0.5px" }}>MONEY LEFT</Typography>
                    <Typography sx={{ fontWeight: 700, color: "#0d944d", fontSize: "1.05rem" }}>₹{verifiedData.walletBalance}</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: "12px", borderColor: "#e2e8f0", boxShadow: "none" }}>
                    <Typography sx={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 600, mb: 0.5, letterSpacing: "0.5px" }}>PROJECT</Typography>
                    <Typography sx={{ fontWeight: 700, color: "#091542", fontSize: "1.05rem" }}>{verifiedData.project}</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            {/* Actions */}
            <Box sx={{ display: "flex", gap: 2, p: 3, pt: 0 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setVerifiedData(null)}
                sx={{
                  bgcolor: "#eff6ff",
                  borderColor: "transparent",
                  color: "#1e3a8a",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: "12px",
                  py: 1.2,
                  "&:hover": { bgcolor: "#dbeafe", borderColor: "transparent" }
                }}
              >
                Scan another
              </Button>
              {verifiedData.accessGranted ? (
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleBlockCard}
                  sx={{
                    bgcolor: "#c2410c",
                    color: "white",
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: "12px",
                    boxShadow: "none",
                    py: 1.2,
                    "&:hover": { bgcolor: "#9a3412", boxShadow: "none" }
                  }}
                >
                  <BlockOutlinedIcon sx={{ fontSize: 18, mr: 1 }} />
                  Block card
                </Button>
              ) : (
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleUnblockCard}
                  sx={{
                    bgcolor: "#0d944d",
                    color: "white",
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: "12px",
                    boxShadow: "none",
                    py: 1.2,
                    "&:hover": { bgcolor: "#166534", boxShadow: "none" }
                  }}
                >
                  <CheckCircleOutlineIcon sx={{ fontSize: 18, mr: 1 }} />
                  Unblock card
                </Button>
              )}
            </Box>
          </Box>
        ) : (
          <>
            {/* Animated Scanner Box */}
            <Box sx={{ 
              position: "relative",
              width: 260, 
              height: 260, 
              bgcolor: "#0f172a", 
              borderRadius: "24px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              mb: 4,
              mt: 2,
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.15)",
              "& video": { 
                position: "absolute !important",
                top: "0 !important",
                left: "0 !important",
                minWidth: "100% !important",
                minHeight: "100% !important",
                width: "100% !important", 
                height: "100% !important", 
                objectFit: "cover !important", 
                opacity: "0.8 !important",
                zIndex: 1,
                margin: "0 !important",
                padding: "0 !important",
                transform: "none !important",
                transformOrigin: "center !important"
              },
              "& #qr-reader": { 
                border: "none !important", 
                width: "100% !important", 
                height: "100% !important" 
              },
              "& #qr-reader *": {
                margin: "0 !important",
                padding: "0 !important",
                textAlign: "left !important"
              },
              "& #qr-reader > div": { 
                width: "100% !important", 
                height: "100% !important",
                minWidth: "100% !important",
                minHeight: "100% !important",
                position: "absolute !important",
                top: "0 !important",
                left: "0 !important"
              },
              "& #qr-reader canvas": { 
                display: "none !important" 
              }
            }}>
              {/* Camera Feed Container */}
              <Box id="qr-reader" sx={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0, zIndex: 1, border: "none" }} />

              {/* Corner brackets */}
              <Box sx={{ position: "absolute", zIndex: 2, top: 20, left: 20, width: 30, height: 30, borderTop: "3px solid #bca47c", borderLeft: "3px solid #bca47c", borderRadius: "4px 0 0 0" }} />
              <Box sx={{ position: "absolute", zIndex: 2, top: 20, right: 20, width: 30, height: 30, borderTop: "3px solid #bca47c", borderRight: "3px solid #bca47c", borderRadius: "0 4px 0 0" }} />
              <Box sx={{ position: "absolute", zIndex: 2, bottom: 20, left: 20, width: 30, height: 30, borderBottom: "3px solid #bca47c", borderLeft: "3px solid #bca47c", borderRadius: "0 0 0 4px" }} />
              <Box sx={{ position: "absolute", zIndex: 2, bottom: 20, right: 20, width: 30, height: 30, borderBottom: "3px solid #bca47c", borderRight: "3px solid #bca47c", borderRadius: "0 0 4px 0" }} />
              
              {/* Animated Scanning Line */}
              <Box 
                sx={{
                  position: "absolute",
                  zIndex: 3,
                  top: 0,
                  left: 20,
                  right: 20,
                  height: "2px",
                  bgcolor: "#bca47c",
                  boxShadow: "0px 0px 8px 2px rgba(188, 164, 124, 0.5)",
                  animation: "scan 2.5s infinite ease-in-out",
                  "@keyframes scan": {
                    "0%": { top: "15%" },
                    "50%": { top: "85%" },
                    "100%": { top: "15%" }
                  }
                }}
              />
            </Box>

            <Typography sx={{ color: "#64748b", fontSize: "0.95rem", mb: 3 }}>
              Point the scanner at a member's card — or tap a card to simulate:
            </Typography>

            <Box sx={{ display: "flex", gap: 1, width: "100%", maxWidth: 300 }}>
              <TextField 
                fullWidth 
                variant="outlined" 
                placeholder="Enter Card ID manually..." 
                size="small"
                autoFocus
                value={scannedText}
                onChange={(e) => setScannedText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleVerifyScan(scannedText);
                  }
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
              />
              <Button 
                variant="contained" 
                onClick={() => handleVerifyScan(scannedText)}
                disabled={!scannedText.trim() || isProcessing.current}
                sx={{ bgcolor: "#091542", color: "white", borderRadius: "8px", minWidth: "80px", "&:hover": { bgcolor: "#162d4a" } }}
              >
                Verify
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
