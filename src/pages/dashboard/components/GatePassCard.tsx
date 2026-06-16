import { Box, Typography, Paper, CircularProgress, Chip } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";

interface GatePassCardProps {
  qrLoading: boolean;
  qrCodeData: string | null;
  userStatus: string | undefined;
}

export default function GatePassCard({
  qrLoading,
  qrCodeData,
  userStatus,
}: GatePassCardProps) {
  const radarSweepStyle = {
    "@keyframes radarSweep": {
      "0%": { transform: "translateY(0px)" },
      "50%": { transform: "translateY(180px)" },
      "100%": { transform: "translateY(0px)" },
    },
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: "24px",
        border: "1px solid rgba(226, 232, 240, 0.8)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        bgcolor: "white",
        boxShadow: "0 10px 35px rgba(9, 21, 66, 0.02)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "6px",
          background: "linear-gradient(90deg, #0047b3 0%, #3b82f6 100%)",
        },
      }}
    >
      <Typography variant="h5" fontWeight="900" color="#091542" sx={{ mb: 1 }}>
        Gate Entry QR Pass
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 4, maxWidth: 300 }}
      >
        Hold this QR code against the gate scanner to pass through automatically.
      </Typography>

      {qrLoading ? (
        <Box sx={{ py: 6 }}>
          <CircularProgress size={50} sx={{ color: "#0047b3" }} />
        </Box>
      ) : qrCodeData ? (
        <Box
          sx={{
            p: 3,
            bgcolor: "#f8fafc",
            borderRadius: "24px",
            border: "1px solid #e2e8f0",
            display: "inline-block",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.03)",
            position: "relative",
            overflow: "hidden",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "scale(1.03)",
              "& .radar-line": {
                animationPlayState: "running",
              },
            },
            ...radarSweepStyle,
          }}
        >
          {/* Scanning radar visual sweep */}
          <Box
            className="radar-line"
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              width: "calc(100% - 24px)",
              height: "2px",
              background:
                "linear-gradient(90deg, transparent 0%, #0047b3 50%, transparent 100%)",
              boxShadow: "0 0 8px #0047b3",
              zIndex: 10,
              animation: "radarSweep 4s infinite linear",
            }}
          />
          <QRCodeSVG value={qrCodeData} size={180} level="H" />
        </Box>
      ) : (
        <Box sx={{ py: 6 }}>
          <Typography variant="body2" color="text.secondary" fontWeight="700">
            No access QR code available.
          </Typography>
        </Box>
      )}

      <Chip
        label={userStatus || "ACTIVE"}
        color={userStatus === "EXPIRED" ? "error" : "success"}
        sx={{
          mt: 4,
          fontWeight: 900,
          fontSize: "0.8rem",
          borderRadius: "10px",
          px: 2.5,
          background:
            userStatus === "EXPIRED"
              ? "linear-gradient(135deg, #f87171 0%, #ef4444 100%)"
              : "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
          color: "white",
        }}
      />

      <Typography
        variant="caption"
        fontWeight="800"
        color="#94a3b8"
        sx={{
          mt: 3,
          display: "block",
          letterSpacing: "1.5px",
          fontSize: "0.65rem",
        }}
      >
        USE FOR AUTOMATED GATE ENTRY
      </Typography>
    </Paper>
  );
}
