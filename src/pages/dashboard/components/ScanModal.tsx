import { useState, useEffect, useRef } from "react";
import { Box, Typography, Dialog, DialogTitle, DialogContent, IconButton, Chip, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SensorsIcon from "@mui/icons-material/Sensors";
import GraphicEqOutlinedIcon from "@mui/icons-material/GraphicEqOutlined";
import { Html5Qrcode } from "html5-qrcode";

export default function ScanModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [scannedText, setScannedText] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);

  // Handle closing modal
  const handleClose = () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop().catch(console.error);
    }
    setScannedText("");
    onClose();
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
              if (html5QrCode.isScanning) {
                html5QrCode.stop().catch(console.error);
              }
            },
            () => {
              // Ignore frame errors
            }
          );
        } catch (err) {
          console.warn("Camera start failed, possibly no camera found or permission denied", err);
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
     
      
      <DialogContent sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        
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
            width: "100% !important", 
            height: "100% !important", 
            objectFit: "cover !important", 
            opacity: "0.8 !important",
            zIndex: 1,
            margin: "0 !important",
            padding: "0 !important"
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
          "& #qr-reader div": { 
            width: "100% !important", 
            height: "100% !important",
            position: "static !important"
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

        <TextField 
          fullWidth 
          variant="outlined" 
          placeholder="Simulate Card ID or enter manually..." 
          size="small"
          autoFocus
          value={scannedText}
          onChange={(e) => setScannedText(e.target.value)}
          sx={{ maxWidth: 300, "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
        />
      </DialogContent>
    </Dialog>
  );
}
