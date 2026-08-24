import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  CircularProgress,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  createAdminRazorpayQrRechargeApi,
  getWalletRechargesApi,
} from "@/apis/wallet";

interface AdminQRRechargeModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  onSuccess: () => void;
  initialAmount?: string;
}

const AdminQRRechargeModal: React.FC<AdminQRRechargeModalProps> = ({
  open,
  onClose,
  userId,
  onSuccess,
  initialAmount = "",
}) => {
  const [amount, setAmount] = useState(initialAmount);
  const [generating, setGenerating] = useState(false);
  const [qrData, setQrData] = useState<any>(null);
  const [status, setStatus] = useState<"IDLE" | "PENDING" | "SUCCESS" | "FAILED">("IDLE");
  const [pollingError, setPollingError] = useState("");

  // Reset state when modal opens/closes
  useEffect(() => {
    if (open) {
      setAmount(initialAmount);
      setGenerating(false);
      setQrData(null);
      setStatus("IDLE");
      setPollingError("");
    }
  }, [open]);

  const handleGenerate = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
    setGenerating(true);
    setPollingError("");
    try {
      const res = await createAdminRazorpayQrRechargeApi(userId, {
        amount: Number(amount),
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
    let interval: ReturnType<typeof setInterval>;
    if (status === "PENDING" && qrData?.id && open) {
      interval = setInterval(async () => {
        try {
          const res = await getWalletRechargesApi({
            userId,
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
              }, 2000); // give user time to see success
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
  }, [status, qrData, userId, open, onSuccess]);

  return (
    <Dialog open={open} onClose={() => status !== "PENDING" && onClose()} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold", color: "#091542" }}>
        Admin QR Recharge
      </DialogTitle>
      <DialogContent dividers sx={{ minHeight: 250, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {status === "IDLE" && (
          <Stack spacing={3}>
            <Typography variant="body2" color="text.secondary">
              Generate a single-use Razorpay UPI QR code. The resident can scan this from any UPI app to add exact funds.
            </Typography>
            <TextField
              fullWidth
              label="Amount (₹)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={generating}
              autoFocus
            />
            {pollingError && <Typography color="error" variant="caption">{pollingError}</Typography>}
          </Stack>
        )}

        {status === "PENDING" && qrData && (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Scan to Pay ₹{(qrData.amount / 100).toFixed(2)}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              {/* If it's an imageUrl, display it */}
              {qrData.imageUrl ? (
                <img src={qrData.imageUrl} alt="Razorpay QR" style={{ width: 200, height: 200, objectFit: "contain" }} />
              ) : (
                <Typography color="error">QR Image URL not available</Typography>
              )}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
              <CircularProgress size={16} />
              <Typography variant="body2" color="text.secondary">
                Waiting for payment confirmation...
              </Typography>
            </Box>
          </Box>
        )}

        {status === "SUCCESS" && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CheckCircleOutlineIcon sx={{ color: "#10b981", fontSize: 64, mb: 2 }} />
            <Typography variant="h5" sx={{ color: "#10b981", fontWeight: "bold" }}>
              Payment Successful!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              The wallet has been credited.
            </Typography>
          </Box>
        )}
        
        {status === "FAILED" && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="error">
              Payment Failed or Cancelled
            </Typography>
            <Button onClick={() => setStatus("IDLE")} sx={{ mt: 2 }} variant="outlined">
              Try Again
            </Button>
          </Box>
        )}
      </DialogContent>
      {status === "IDLE" && (
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={onClose}
            disabled={generating}
            sx={{ color: "text.secondary" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={generating || !amount || Number(amount) <= 0}
            variant="contained"
            sx={{
              bgcolor: "#1e40af",
              "&:hover": { bgcolor: "#1e3a8a" },
            }}
          >
            {generating ? <CircularProgress size={24} color="inherit" /> : "Generate QR"}
          </Button>
        </DialogActions>
      )}
      {status === "PENDING" && (
        <DialogActions sx={{ p: 3, justifyContent: "center" }}>
           <Button onClick={onClose} color="error" variant="text">
             Cancel Recharge
           </Button>
        </DialogActions>
      )}
      {(status === "SUCCESS" || status === "FAILED") && (
        <DialogActions sx={{ p: 3, justifyContent: "center" }}>
           <Button onClick={onClose} variant="contained">
             Close
           </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default AdminQRRechargeModal;
