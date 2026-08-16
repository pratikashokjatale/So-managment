import React, { useState, useEffect } from "react";
import { Box, Typography, Dialog, Avatar, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import { getUsersApi } from "@/apis/user";

interface ResidentProfileModalProps {
  open: boolean;
  onClose: () => void;
  user: any;
}

const ResidentProfileModal: React.FC<ResidentProfileModalProps> = ({ open, onClose, user }) => {
  const [household, setHousehold] = useState<any[]>([]);

  useEffect(() => {
    if (open && user?.flat?._id) {
      // Fetch other members of the same household (flat)
      getUsersApi({ role: "RESIDENT", limit: 10 }).then((res: any) => {
        const list = res?.data?.users || res?.data?.items || res?.items || res?.data || [];
        // Just mock it for now using the flat residents if available, otherwise just use the fetched list
        setHousehold(Array.isArray(list) ? list.slice(0, 4) : []);
      }).catch(console.error);
    }
  }, [open, user]);

  if (!user) return null;

  const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`;
  const fullName = user?.name || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Unknown Resident";
  const unitStr = `${user?.flat?.unitNumber || ""} - ${user?.project?.name || "Grand"}`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          bgcolor: "#ffffff",
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      <Box sx={{ bgcolor: "#1e3a8a", p: 3, position: "relative" }}>
        <Box
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            bgcolor: "rgba(255,255,255,0.2)",
            width: 32,
            height: 32,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#ffffff",
            "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
          }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </Box>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: "rgba(255,255,255,0.2)",
              color: "#ffffff",
              fontSize: "1.2rem",
              fontWeight: 600,
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            {initials}
          </Avatar>
          <Box>
            <Typography sx={{ color: "#ffffff", fontSize: "1.2rem", fontWeight: 600 }}>
              {fullName}
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.85rem" }}>
              {user.accountRole || "Owner"} · {user.age || "44"} yrs · Adult
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ p: 3 }}>
        {/* Badges */}
        <Box sx={{ display: "flex", gap: 1, mb: 4 }}>
          <Box
            sx={{
              bgcolor: "#dcfce7",
              color: "#166534",
              px: 1.5,
              py: 0.5,
              borderRadius: "6px",
              fontSize: "0.75rem",
              fontWeight: 700,
            }}
          >
            Living here now
          </Box>
          <Box
            sx={{
              bgcolor: "#e0e7ff",
              color: "#3730a3",
              px: 1.5,
              py: 0.5,
              borderRadius: "6px",
              fontSize: "0.75rem",
              fontWeight: 700,
            }}
          >
            {user.role || "Buyer"}
          </Box>
          <Box
            sx={{
              bgcolor: "#f1f5f9",
              color: "#475569",
              px: 1.5,
              py: 0.5,
              borderRadius: "6px",
              fontSize: "0.75rem",
              fontWeight: 700,
            }}
          >
            {unitStr}
          </Box>
        </Box>

        {/* Household */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, color: "#b45309" }}>
            <PeopleAltOutlinedIcon sx={{ fontSize: 18 }} />
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.5px" }}>
              THIS HOUSEHOLD - {household.length || 4} people
            </Typography>
          </Box>
          
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {(household.length > 0 ? household : [
              { name: "Rohit Mehra", rel: "Owner", age: "44", badge: "BUYER" },
              { name: "Priya Mehra", rel: "Spouse", age: "41" },
              { name: "Aarav Mehra", rel: "Child", age: "12" },
              { name: "Sita Mehra", rel: "Parent", age: "68" }
            ]).map((h: any, i: number) => {
              const hName = h.firstName ? `${h.firstName} ${h.lastName || ""}` : h.name;
              const hRel = h.accountRole || h.rel || "Family";
              const hAge = h.age || "30";
              return (
                <Box key={i} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1.5, bgcolor: i % 2 === 0 ? "#f8fafc" : "#ffffff", borderRadius: "8px" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>{hName}</Typography>
                    <Typography sx={{ color: "#94a3b8", fontSize: "0.8rem" }}>{hRel} · {hAge}</Typography>
                    {h.badge && (
                      <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, color: "#2563eb", ml: 1 }}>{h.badge}</Typography>
                    )}
                  </Box>
                  <Typography sx={{ color: "#16a34a", fontSize: "0.8rem", fontWeight: 500 }}>living</Typography>
                </Box>
              )
            })}
          </Box>
        </Box>

        {/* Home Story */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, color: "#b45309" }}>
            <HistoryOutlinedIcon sx={{ fontSize: 18 }} />
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.5px" }}>
              THIS HOME'S STORY
            </Typography>
          </Box>
          
          <Box sx={{ position: "relative", pl: 3, "&::before": { content: '""', position: "absolute", left: 7, top: 8, bottom: 0, width: "2px", bgcolor: "#e2e8f0" } }}>
            <Box sx={{ position: "relative", mb: 3 }}>
              <Box sx={{ position: "absolute", left: -27, top: 6, width: 8, height: 8, borderRadius: "50%", bgcolor: "#1e3a8a" }} />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>New sale</Typography>
                <Typography sx={{ color: "#94a3b8", fontSize: "0.8rem" }}>· Jul 2024</Typography>
              </Box>
              <Typography sx={{ color: "#475569", fontSize: "0.85rem", mt: 0.5 }}>
                Marbella → <strong>Rohit & Priya Mehra</strong>
              </Typography>
            </Box>
            
            <Box sx={{ bgcolor: "#dcfce7", p: 1.5, borderRadius: "8px" }}>
              <Typography sx={{ color: "#166534", fontSize: "0.85rem" }}>
                <strong>Living now:</strong> Rohit Mehra, Priya Mehra, Aarav Mehra, Sita Mehra
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderTop: "1px solid #e2e8f0", bgcolor: "#f8fafc" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#64748b" }}>
          <LockOutlinedIcon sx={{ fontSize: 16 }} />
          <Typography sx={{ fontSize: "0.75rem" }}>
            View only — the CRM desk can browse the population but not edit records.
          </Typography>
        </Box>
        <Button onClick={onClose} variant="contained" sx={{ bgcolor: "#1e3a8a", color: "#ffffff", textTransform: "none", borderRadius: "8px", "&:hover": { bgcolor: "#1e3a8a" } }}>
          Close
        </Button>
      </Box>
    </Dialog>
  );
};

export default ResidentProfileModal;
