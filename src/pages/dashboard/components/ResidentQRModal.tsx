import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogContent,
  Stack,
  CircularProgress,
  TextField,
} from "@mui/material";
import { createAdminRazorpayQrRechargeApi, getWalletRechargesApi } from "@/apis/wallet";

interface ResidentQRModalProps {
  open: boolean;
  onClose: () => void;
  user: any;
  onSuccess: () => void;
}

const AMOUNTS = [500, 1000, 2500];

const ResidentQRModal: React.FC<ResidentQRModalProps> = ({
  open,
  onClose,
  user,
  onSuccess,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number | "ANY">(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [generating, setGenerating] = useState(false);
  const [qrData, setQrData] = useState<any>(null);
  const [status, setStatus] = useState<"IDLE" | "PENDING" | "SUCCESS" | "FAILED">("IDLE");
  const [pollingError, setPollingError] = useState("");

  const actualAmount = selectedAmount === "ANY" ? Number(customAmount) : selectedAmount;

  const handleGenerate = async (amountToGenerate: number) => {
    if (!amountToGenerate || isNaN(amountToGenerate) || amountToGenerate <= 0) return;
    setGenerating(true);
    setPollingError("");
    setQrData(null);
    try {
      const res = await createAdminRazorpayQrRechargeApi(user.residentId || user.id, {
        amount: amountToGenerate,
        notes: "Recharge at CRM desk",
        metadata: { source: "crm-desk" },
      });
      if (res?.data?.razorpayQr) {
        setQrData(res.data.razorpayQr);
        setStatus("PENDING");
      } else {
        throw new Error("Failed to get QR data");
      }
    } catch (e: any) {
      console.error("QR Generation failed", e);
      setPollingError(e?.data?.message || e?.message || "Failed to generate QR code.");
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    if (open && selectedAmount !== "ANY") {
      handleGenerate(selectedAmount);
    } else {
      setStatus("IDLE");
      setQrData(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, selectedAmount]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (status === "PENDING" && qrData?.id && open) {
      interval = setInterval(async () => {
        try {
          const res = await getWalletRechargesApi({
            userId: user.residentId || user.id,
            providerOrderId: qrData.id,
          });
          const recharges = Array.isArray(res?.data) ? res.data :
                           Array.isArray(res?.data?.recharges) ? res.data.recharges :
                           Array.isArray(res?.recharges) ? res.recharges : [];

          const recharge = recharges.find((r: any) => r.providerOrderId === qrData.id);
          if (recharge) {
            if (recharge.status === "SUCCESS") {
              setStatus("SUCCESS");
              clearInterval(interval);
              setTimeout(() => {
                onSuccess();
              }, 2000);
            } else if (recharge.status === "FAILED" || recharge.status === "CANCELLED") {
              setStatus("FAILED");
              clearInterval(interval);
            }
          }
        } catch (e) {
          console.error("Polling error", e);
        }
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [status, qrData, user, open, onSuccess]);

  if (!user) return null;

  return (
    <Dialog
      open={open}
      onClose={() => status !== "PENDING" && onClose()}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          p: 2,
        },
      }}
    >
      <DialogContent sx={{ textAlign: "center" }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 700,
            color: "#1e293b",
            mb: 2,
          }}
        >
          Recharge wallet
        </Typography>

        <Typography sx={{ color: "#475569", fontSize: "0.95rem", mb: 3, px: 2 }}>
          Show this QR to <strong>{user.name} · Activity Wallet</strong>. Whatever they pay
          against it lands <strong>straight in this wallet</strong> — credited the instant it
          arrives.
        </Typography>

        {/* QR Display Area */}
        <Box sx={{ minHeight: 240, display: "flex", alignItems: "center", justifyContent: "center", mb: 3 }}>
          {status === "SUCCESS" ? (
             <Box>
                <Typography variant="h5" sx={{ color: "#10b981", fontWeight: "bold" }}>Payment Successful!</Typography>
             </Box>
          ) : generating ? (
            <CircularProgress />
          ) : qrData?.imageUrl ? (
            <img
              src={qrData.imageUrl}
              alt="Razorpay QR"
              style={{ width: 220, height: 220, objectFit: "contain", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "8px" }}
            />
          ) : (
            <Box sx={{ width: 220, height: 220, border: "1px dashed #cbd5e1", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Typography color="text.secondary">
                {selectedAmount === "ANY" ? "Enter amount below" : pollingError || "No QR generated"}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Amount Selector */}
        <Box sx={{ display: "flex", gap: 1, justifyContent: "center", mb: 2 }}>
          {AMOUNTS.map((amt) => (
            <Button
              key={amt}
              variant={selectedAmount === amt ? "contained" : "outlined"}
              onClick={() => setSelectedAmount(amt)}
              disabled={generating || status === "SUCCESS"}
              sx={{
                borderRadius: "20px",
                px: 2,
                bgcolor: selectedAmount === amt ? "#24528C" : "transparent",
                color: selectedAmount === amt ? "#ffffff" : "#24528C",
                borderColor: "#24528C",
                fontWeight: 600,
                "&:hover": {
                   bgcolor: selectedAmount === amt ? "#24528C" : "#EAF0F7",
                }
              }}
            >
              ₹{amt.toLocaleString("en-IN")}
            </Button>
          ))}
          <Button
            variant={selectedAmount === "ANY" ? "contained" : "outlined"}
            onClick={() => setSelectedAmount("ANY")}
            disabled={generating || status === "SUCCESS"}
            sx={{
              borderRadius: "20px",
              px: 2,
              bgcolor: selectedAmount === "ANY" ? "#24528C" : "transparent",
              color: selectedAmount === "ANY" ? "#ffffff" : "#24528C",
              borderColor: "#24528C",
              fontWeight: 600,
              "&:hover": {
                 bgcolor: selectedAmount === "ANY" ? "#24528C" : "#EAF0F7",
              }
            }}
          >
            Any
          </Button>
        </Box>

        {selectedAmount === "ANY" && (
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 2, px: 4 }}>
            <TextField
              size="small"
              placeholder="Enter custom amount"
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              disabled={generating || status === "SUCCESS"}
            />
            <Button 
               variant="contained" 
               disabled={!customAmount || generating || status === "SUCCESS"}
               onClick={() => handleGenerate(Number(customAmount))}
               sx={{ bgcolor: "#24528C" }}
            >
              Generate
            </Button>
          </Box>
        )}

        {/* Info Box */}
        <Box
          sx={{
            bgcolor: "#fef3c7",
            color: "#92400e",
            px: 2,
            py: 1.5,
            borderRadius: "8px",
            fontSize: "0.85rem",
            fontWeight: 500,
            mb: 2,
            mx: 2
          }}
        >
          Unique to this resident & this wallet — not a generic code. Two residents never
          share a QR.
        </Box>

        <Typography sx={{ color: "#94a3b8", fontSize: "0.75rem", mb: 4, letterSpacing: "1px" }}>
          MRB|RECHARGE|{user.residentId || user.id}|ACTIVITY|{actualAmount || 0}
        </Typography>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, px: 2 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              flex: 1,
              bgcolor: "#f1f5f9",
              color: "#475569",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              textTransform: "none",
              py: 1.5,
              "&:hover": { bgcolor: "#e2e8f0", border: "none" },
            }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            disabled={true} // Just a visual simulation button based on screenshot, backend auto-polls anyway
            sx={{
              flex: 1,
              bgcolor: "#24528C",
              color: "#ffffff",
              borderRadius: "8px",
              fontWeight: 600,
              textTransform: "none",
              py: 1.5,
              boxShadow: "none",
              "&:hover": { bgcolor: "#24528C", boxShadow: "none" },
            }}
          >
            Simulate payment
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ResidentQRModal;
