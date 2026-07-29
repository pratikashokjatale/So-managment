import { useState } from "react";
import { Box, Typography, TextField, Button, Snackbar, Alert, Chip, Divider } from "@mui/material";
import { Check as CheckIcon, WorkspacePremium as CrownIcon } from "@mui/icons-material";

const INTER = '"Inter", "Satoshi", sans-serif';
const SERIF = '"Playfair Display", "Cinzel", serif';

interface IssuedPass {
  id: string;
  name: string;
  passCode: string;
  hoursLeft: number;
  status: "active" | "revoked";
}

export default function VipPass() {
  const [guestName, setGuestName] = useState("");
  const [depositCollected] = useState(true);
  const [issuedPasses, setIssuedPasses] = useState<IssuedPass[]>([
    {
      id: "1",
      name: "thi",
      passCode: "VIP-8182",
      hoursLeft: 48,
      status: "active",
    }
  ]);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false, message: "", severity: "success",
  });

  const handleIssue = () => {
    if (!guestName.trim()) {
      setSnackbar({ open: true, message: "Please enter the guest name.", severity: "error" });
      return;
    }
    const newPass: IssuedPass = {
      id: Date.now().toString(),
      name: guestName.trim(),
      passCode: `VIP-${Math.floor(1000 + Math.random() * 9000)}`,
      hoursLeft: 48,
      status: "active",
    };
    setIssuedPasses(prev => [newPass, ...prev]);
    setSnackbar({ open: true, message: `VIP pass issued for ${guestName}!`, severity: "success" });
    setGuestName("");
  };

  const handleRevoke = (id: string) => {
    setIssuedPasses(prev => prev.map(p => p.id === id ? { ...p, status: "revoked" } : p));
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
          background: "linear-gradient(90deg, #fdf7ec 0%, #ffffff 100%)", // Subtle gradient matching the design
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
                border: "1px solid #a5d6a7",
                borderRadius: "8px",
                px: "16px",
                height: "48px",
                bgcolor: "#e7f5e8",
              }}
            >
              <Typography sx={{ fontFamily: INTER, fontSize: "0.95rem", color: "#1e293b", fontWeight: 500 }}>
                ₹2,000 deposit
              </Typography>
              {depositCollected && (
                <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <CheckIcon sx={{ fontSize: 16, color: "#2e7d32" }} />
                  <Typography sx={{ fontFamily: INTER, fontSize: "0.85rem", fontWeight: 600, color: "#2e7d32" }}>
                    Collected
                  </Typography>
                </Box>
              )}
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
          sx={{
            fontFamily: INTER,
            fontWeight: 700,
            fontSize: "1rem",
            textTransform: "none",
            borderRadius: "10px",
            py: "14px",
            bgcolor: "#dfcfb3",
            color: "#192038",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            "&:hover": { bgcolor: "#d4c1a1" },
            transition: "background 0.2s",
            boxShadow: "none"
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 18L3 9L8 13L12 4L16 13L21 9L20 18H4Z" stroke="#192038" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 18L4.5 21H19.5L20 18" stroke="#192038" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Issue 48-hour VIP pass
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
        {issuedPasses.length > 0 ? (
          issuedPasses.map((pass, i) => (
            <Box
              key={pass.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: "24px",
                py: "20px",
                borderBottom: i < issuedPasses.length - 1 ? "1px solid #f1f5f9" : "none",
                opacity: pass.status === "revoked" ? 0.5 : 1,
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
                    {pass.name}
                  </Typography>
                  <Typography sx={{ fontFamily: INTER, fontSize: "0.9rem", color: "#64748b", lineHeight: 1 }}>
                    {pass.passCode} · unlimited · {pass.hoursLeft}h 00m left
                  </Typography>
                </Box>
              </Box>

              {/* Right: status badge + revoke */}
              <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
                {pass.status === "active" ? (
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
                    label="revoked"
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

                {pass.status === "active" && (
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
          ))
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
