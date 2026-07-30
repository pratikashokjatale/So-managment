import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Typography, TextField, Button, Snackbar, Alert, Chip, CircularProgress } from "@mui/material";
import { Check as CheckIcon } from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import { getVipPassesApi, createVipPassApi, cancelVipPassApi } from "@/apis/vipPass";

const INTER = '"Inter", "Satoshi", sans-serif';
const SERIF = '"Playfair Display", "Cinzel", serif';

interface VipPassData {
  id: string;
  guestName: string;
  passCode: string;
  validUntil: string;
  effectiveStatus: string;
  depositAmount: number;
  depositCollected: boolean;
}

export default function VipPass() {
  const { projectId: authProjectId } = useAuth();
  const [searchParams] = useSearchParams();
  const rawProjectId = searchParams.get("projectId") || authProjectId || "all";
  const projectId = rawProjectId === "all" ? "" : rawProjectId;

  const [guestName, setGuestName] = useState("");
  const [depositAmount, setDepositAmount] = useState<number | string>(2000);
  const [depositCollected, setDepositCollected] = useState(false);
  const [issuedPasses, setIssuedPasses] = useState<VipPassData[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false, message: "", severity: "success",
  });

  const fetchPasses = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (projectId && projectId !== "all") {
        params.projectId = projectId;
      }
      const res = await getVipPassesApi(params);
      
      let list: any[] = [];
      if (res) {
        if (Array.isArray(res)) list = res;
        else if (res.data && Array.isArray(res.data)) list = res.data;
        else if (res.data && typeof res.data === 'object') {
          const possibleArr = Object.values(res.data).find(v => Array.isArray(v));
          if (possibleArr) list = possibleArr as any[];
        }
        else if (typeof res === 'object') {
          const possibleArr = Object.values(res).find(v => Array.isArray(v));
          if (possibleArr) list = possibleArr as any[];
        }
      }
      
      setIssuedPasses(list);
    } catch (error: any) {
      setSnackbar({ open: true, message: error?.message || "Failed to load passes", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasses();
  }, [projectId]);

  const handleIssue = async () => {
    if (!guestName.trim()) {
      setSnackbar({ open: true, message: "Please enter the guest name.", severity: "error" });
      return;
    }
    
    if (!depositCollected) {
      setSnackbar({ open: true, message: "Please mark the deposit as collected first.", severity: "error" });
      return;
    }
    
    // projectId is required according to spec, but we might be in "All Projects" view
    const targetProjectId = projectId === "all" || !projectId ? "" : projectId;
    
    if (!targetProjectId) {
      setSnackbar({ open: true, message: "Please select a specific project to issue a VIP pass.", severity: "error" });
      return;
    }

    try {
      setSubmitting(true);
      await createVipPassApi({
        projectId: targetProjectId,
        guestName: guestName.trim(),
        depositAmount: Number(depositAmount) || 2000,
        depositCollected: depositCollected,
        validHours: 48,
        notes: "Created from Dashboard"
      });
      setSnackbar({ open: true, message: `VIP pass issued for ${guestName}!`, severity: "success" });
      setGuestName("");
      fetchPasses();
    } catch (error: any) {
      setSnackbar({ open: true, message: error?.message || "Failed to create VIP pass", severity: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      await cancelVipPassApi(id, "Revoked by admin");
      fetchPasses();
    } catch (error: any) {
      setSnackbar({ open: true, message: error?.message || "Failed to revoke VIP pass", severity: "error" });
    }
  };

  return (
    <Box sx={{ fontFamily: INTER }}>

      {/* ── Page Header ── */}
      <Box sx={{ mb: "28px" }}>
        <Typography sx={{ fontFamily: SERIF, fontWeight: 500, fontSize: "1.85rem", color: "#192038", mb: "4px" }}>
          VIP Pass
        </Typography>
        <Typography sx={{ fontFamily: INTER, fontSize: "0.875rem", color: "#64748b" }}>
          48-hour unlimited access — a favour, on the house
        </Typography>
      </Box>

      {/* ── Create VIP Pass Card ── */}
      <Box
        sx={{
          border: "1px solid #dfcfb3",
          borderRadius: "16px",
          background: "linear-gradient(90deg, #fdf7ec 0%, #ffffff 100%)",
          p: "28px 32px",
          width: "100%",
          mb: "32px",
        }}
      >
        {/* Card title */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: "32px" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 18L3 9L8 13L12 4L16 13L21 9L20 18H4Z" stroke="#b68e4c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 18L4.5 21H19.5L20 18" stroke="#b68e4c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <Typography sx={{ fontFamily: SERIF, fontWeight: 500, fontSize: "1.35rem", color: "#192038" }}>
            Create a VIP pass
          </Typography>
        </Box>

        {/* Form row */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: "28px", mb: "24px" }}>
          {/* Guest Name */}
          <Box>
            <Typography sx={{ fontFamily: INTER, fontSize: "0.75rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", mb: "8px" }}>
              GUEST NAME
            </Typography>
            <TextField
              fullWidth
              placeholder="Full name"
              value={guestName}
              onChange={e => setGuestName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleIssue()}
              size="small"
              disabled={submitting}
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontFamily: INTER,
                  fontSize: "0.95rem",
                  borderRadius: "8px",
                  bgcolor: "#fff",
                  color: "#1e293b",
                  height: 48,
                  "& fieldset": { borderColor: "#e2e8f0" },
                  "&:hover fieldset": { borderColor: "#cbd5e1" },
                  "&.Mui-focused fieldset": { borderColor: "#6366f1", borderWidth: "1.5px" },
                  "& input::placeholder": { color: "#94a3b8", opacity: 1 },
                },
              }}
            />
          </Box>

          {/* RFID Deposit */}
          <Box>
            <Typography sx={{ fontFamily: INTER, fontSize: "0.75rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", mb: "8px" }}>
              RFID CARD DEPOSIT
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: depositCollected ? "1px solid #a5d6a7" : "1px solid #e2e8f0",
                borderRadius: "10px",
                px: "16px",
                height: "48px",
                bgcolor: depositCollected ? "#e7f5e8" : "#fff",
                transition: "all 0.2s"
              }}
            >
              <TextField
                variant="standard"
                value={depositAmount}
                onChange={e => setDepositAmount(e.target.value)}
                type="number"
                disabled={submitting}
                InputProps={{
                  disableUnderline: true,
                  startAdornment: <Typography sx={{ mr: 0.5, color: '#1e293b', fontSize: "1rem" }}>₹</Typography>,
                  sx: {
                    fontFamily: INTER,
                    fontSize: "1rem",
                    color: "#1e293b",
                  }
                }}
                sx={{ 
                  width: '140px', 
                  '& input': { p: 0, textAlign: 'left', WebkitAppearance: 'none', margin: 0, MozAppearance: 'textfield' } 
                }}
              />
              <Box
                onClick={() => !submitting && setDepositCollected(!depositCollected)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: submitting ? "default" : "pointer",
                }}
              >
                {depositCollected ? (
                  <>
                    <CheckIcon sx={{ fontSize: 18, color: "#059669" }} />
                    <Typography sx={{ fontFamily: INTER, fontSize: "0.95rem", fontWeight: 600, color: "#059669" }}>
                      Collected
                    </Typography>
                  </>
                ) : (
                  <Typography sx={{ fontFamily: INTER, fontSize: "0.95rem", fontWeight: 600, color: "#64748b" }}>
                    Mark collected
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Feature tags */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "14px", mb: "28px", flexWrap: "wrap" }}>
          {["Unlimited access — everywhere", "Valid 48 hours", "No activity charges"].map(feat => (
            <Box key={feat} sx={{ display: "flex", alignItems: "center", gap: "6px", border: "1px solid #e2e8f0", bgcolor: "#fff", borderRadius: "100px", px: "14px", py: "6px" }}>
              <CheckIcon sx={{ fontSize: 15, color: "#64748b" }} />
              <Typography sx={{ fontFamily: INTER, fontSize: "0.85rem", color: "#475569" }}>
                {feat}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Issue button */}
        <Button
          fullWidth
          onClick={handleIssue}
          disabled={submitting}
          sx={{
            fontFamily: INTER,
            fontWeight: 700,
            fontSize: "1rem",
            textTransform: "none",
            borderRadius: "10px",
            py: "14px",
            bgcolor: submitting ? "#e2e8f0" : "#dfcfb3",
            color: submitting ? "#94a3b8" : "#192038",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            "&:hover": { bgcolor: "#d4c1a1" },
            transition: "background 0.2s",
            boxShadow: "none"
          }}
        >
          {submitting ? (
            <CircularProgress size={20} sx={{ color: "#94a3b8" }} />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 18L3 9L8 13L12 4L16 13L21 9L20 18H4Z" stroke="#192038" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 18L4.5 21H19.5L20 18" stroke="#192038" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {submitting ? "Issuing..." : "Issue 48-hour VIP pass"}
        </Button>
      </Box>

      {/* ── Issued Passes ── */}
      <Box
        sx={{
          border: "1px solid #e2e8f0",
          borderRadius: "16px",
          bgcolor: "#fff",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box sx={{ px: "32px", py: "18px", bgcolor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
          <Typography sx={{ fontFamily: INTER, fontWeight: 700, fontSize: "0.95rem", color: "#64748b" }}>
            Issued passes
          </Typography>
        </Box>

        {/* Passes list */}
        {loading ? (
          <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
            <CircularProgress size={30} sx={{ color: "#dfcfb3" }} />
          </Box>
        ) : issuedPasses.length > 0 ? (
          issuedPasses.map((pass, i) => {
            const isActive = pass.effectiveStatus === "ACTIVE";
            const validUntilDate = new Date(pass.validUntil);
            const hoursLeft = Math.max(0, Math.floor((validUntilDate.getTime() - Date.now()) / (1000 * 60 * 60)));
            
            return (
              <Box
                key={pass.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: "24px",
                  py: "20px",
                  borderBottom: i < issuedPasses.length - 1 ? "1px solid #f1f5f9" : "none",
                  opacity: isActive ? 1 : 0.5,
                  transition: "opacity 0.2s",
                }}
              >
                {/* Left: icon + info */}
                <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: "14px",
                      bgcolor: "#fcf8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 18L3 9L8 13L12 4L16 13L21 9L20 18H4Z" stroke="#b68e4c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4 18L4.5 21H19.5L20 18" stroke="#b68e4c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Box>
                  <Box>
                    <Typography sx={{ fontFamily: INTER, fontWeight: 700, fontSize: "1.1rem", color: "#192038", mb: "6px", lineHeight: 1 }}>
                      {pass.guestName}
                    </Typography>
                    <Typography sx={{ fontFamily: INTER, fontSize: "0.9rem", color: "#64748b", lineHeight: 1 }}>
                      {pass.passCode} · unlimited {isActive ? `· ${hoursLeft}h left` : ""} · {pass.depositCollected ? `₹${pass.depositAmount || 2000} Deposit` : 'No Deposit'}
                    </Typography>
                  </Box>
                </Box>
  
                {/* Right: status badge + revoke */}
                <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  {isActive ? (
                    <Chip
                      label="active"
                      size="small"
                      sx={{
                        fontFamily: INTER,
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        bgcolor: "#e7f5e8",
                        color: "#2e7d32",
                        height: 26,
                        px: "4px"
                      }}
                    />
                  ) : (
                    <Chip
                      label={pass.effectiveStatus ? pass.effectiveStatus.toLowerCase() : "revoked"}
                      size="small"
                      sx={{
                        fontFamily: INTER,
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        bgcolor: "#f1f5f9",
                        color: "#94a3b8",
                        height: 24,
                      }}
                    />
                  )}
  
                  {isActive && (
                    <Button
                      onClick={() => handleRevoke(pass.id)}
                      sx={{
                        fontFamily: INTER,
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        textTransform: "none",
                        borderRadius: "8px",
                        px: "18px",
                        py: "8px",
                        bgcolor: "#fdeceb",
                        color: "#d84742",
                        minWidth: 0,
                        boxShadow: "none",
                        "&:hover": { bgcolor: "#fca5a5", boxShadow: "none" },
                      }}
                    >
                      Revoke
                    </Button>
                  )}
                </Box>
              </Box>
            );
          })
        ) : (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <Typography sx={{ fontFamily: INTER, fontSize: "0.9rem", color: "#94a3b8" }}>
              No VIP passes issued yet
            </Typography>
          </Box>
        )}
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))} sx={{ borderRadius: "10px", fontWeight: 600, fontFamily: INTER }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
