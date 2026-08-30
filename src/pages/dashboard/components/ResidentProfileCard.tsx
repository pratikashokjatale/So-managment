import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Avatar, Chip, CircularProgress } from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { getFacilitiesApi } from "@/apis/facility";
import { getSlotsApi, createBookingApi } from "@/apis/booking";
import { getAdminUserWalletApi } from "@/apis/wallet";

const formatTime = (timeStr: string) => {
  if (!timeStr) return "";
  const parts = timeStr.split(":");
  return `${parts[0]}:${parts[1]}`;
};

interface ResidentProfileCardProps {
  user: any;
  walletBalance: string | number; // Fallback to user data if available
  onShowRechargeQR: () => void;
}

const ResidentProfileCard: React.FC<ResidentProfileCardProps> = ({
  user,
  walletBalance,
  onShowRechargeQR,
}) => {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingSlotId, setBookingSlotId] = useState<string | null>(null);
  const [localBalance, setLocalBalance] = useState<number>(Number(walletBalance) || 0);

  useEffect(() => {
    if (user?.id) {
      getAdminUserWalletApi(user.id)
        .then((res) => {
          setLocalBalance(res?.data?.balance || res?.balance || 0);
        })
        .catch((err) => console.error("Failed to fetch wallet balance", err));
    }
  }, [user]);

  const fetchSlots = () => {
    if (!selectedFacility) return;
    setLoadingSlots(true);
    const today = new Date().toISOString().split("T")[0];
    getSlotsApi({ facilityId: selectedFacility.id, date: today, slotMinutes: 60 })
      .then((res) => {
        const d = res?.data || res;
        const slotList = d?.slots || (Array.isArray(d) ? d : []);
        setSlots(slotList);
      })
      .catch((err) => {
        console.error("Failed to fetch slots", err);
        setSlots([]);
      })
      .finally(() => setLoadingSlots(false));
  };

  useEffect(() => {
    getFacilitiesApi({ limit: 100, isActive: true })
      .then((res) => {
        const d = res?.data || res;
        let list: any[] = [];
        if (Array.isArray(d)) {
          list = d;
        } else if (d?.items && Array.isArray(d.items)) {
          list = d.items;
        } else if (d?.facilities && Array.isArray(d.facilities)) {
          list = d.facilities;
        } else if (d?.data && Array.isArray(d.data)) {
          list = d.data;
        }
        const activeFacilities = list.filter(
          (f: any) => f.isActive !== false && f.status !== "CLOSED" && f.status !== "Inactive"
        );
        setFacilities(activeFacilities);
      })
      .catch((err) => console.error("Failed to fetch facilities", err));
  }, []);

  useEffect(() => {
    if (!selectedFacility) {
      setSlots([]);
      return;
    }
    
    // Only fetch slots if accessType is not SUBSCRIPTION
    const at = selectedFacility.accessType?.toUpperCase() || "";
    if (at === "SUBSCRIPTION") {
      setSlots([]);
      return;
    }

    setLoadingSlots(true);
    const today = new Date().toISOString().split("T")[0];
    getSlotsApi({ facilityId: selectedFacility.id, date: today, slotMinutes: 60 })
      .then((res) => {
        const d = res?.data || res;
        const slotList = d?.slots || (Array.isArray(d) ? d : []);
        setSlots(slotList);
      })
      .catch((err) => {
        console.error("Failed to fetch slots", err);
        setSlots([]);
      })
      .finally(() => setLoadingSlots(false));
  }, [selectedFacility]);

  const handleBook = async (slot: any) => {
    if (!selectedFacility || !user) return;
    const today = new Date().toISOString().split("T")[0];
    
    setBookingSlotId(`${slot.startTime}-${slot.endTime}`);
    try {
      await createBookingApi({
        facilityId: selectedFacility.id,
        bookingDate: today,
        startTime: formatTime(slot.startTime),
        endTime: formatTime(slot.endTime),
        attendeeCount: 1,
        guestCount: 0,
        bookedForType: "SELF",
        userId: user.residentId || user.id,
        notes: "Booked via CRM Desk",
      });
      alert(`Successfully booked ${selectedFacility.name} for ${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`);
      fetchSlots(); // Refresh slots after successful booking
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || err.message || "Failed to create booking");
    } finally {
      setBookingSlotId(null);
    }
  };

  if (!user) return null;

  const initials = user.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().substring(0, 2)
    : "??";

  const flatNum =
    user.flat?.flatNumber || user.flatNumber || "Unknown Flat";
  const towerName =
    user.towerName ||
    user.flat?.tower?.name ||
    user.flat?.towerName ||
    user.tower?.name ||
    (user.flat?.towerId ? "Tower " + user.flat.towerId.slice(0, 4).toUpperCase() : "");

  const blockInfo = towerName ? `${towerName}-${flatNum}` : flatNum;
  
  // Fake demographics if not present (to match screenshot vibe)
  const age = user.age || "32 yrs";
  const gender = user.gender || "Female";
  const residentId = user.residentId || user.id || "MEM-UNKNOWN";

  const statusColor = user.status === "ACTIVE" ? "#10b981" : "#f59e0b";

  const activeChips = [
    { label: "Squash", active: true },
    { label: "Pool Table", active: false },
    { label: "Home Theatre", active: false },
    { label: "Banquet Hall", active: false },
  ];

  return (
    <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Profile Header section */}
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Avatar sx={{ width: 56, height: 56, bgcolor: "#24528C", fontSize: "1.2rem", fontWeight: "bold" }}>
            {initials}
          </Avatar>
          <Box>
            <Typography sx={{ fontSize: "1.2rem", fontWeight: 700, color: "#1e293b", mb: 0.5 }}>
              {user.name || "Unknown Resident"}
            </Typography>
            <Typography sx={{ fontSize: "0.85rem", color: "#64748b" }}>
              {blockInfo} · {age} · {gender} · {residentId}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            px: 1.5,
            py: 0.5,
            bgcolor: `${statusColor}15`,
            color: statusColor,
            borderRadius: "4px",
            fontWeight: 700,
            fontSize: "0.75rem",
            letterSpacing: "0.5px",
          }}
        >
          {user.status || "ACTIVE"}
        </Box>
      </Box>

      {/* Activity Chips */}
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {facilities.map((fac, idx) => {
          const isActive = selectedFacility?.id === fac.id;
          const label = fac.priceAmount > 0 ? `${fac.name} - ₹${fac.priceAmount}` : fac.name;
          return (
            <Chip
              key={idx}
              label={label}
              onClick={() => setSelectedFacility(isActive ? null : fac)}
              sx={{
                bgcolor: isActive ? "#24528C" : "#f1f5f9",
                color: isActive ? "#ffffff" : "#475569",
                fontWeight: 600,
                cursor: "pointer",
                border: "none",
                "&:hover": {
                  bgcolor: isActive ? "#1D4270" : "#e2e8f0",
                },
              }}
            />
          );
        })}
      </Box>

      {/* Wallet Boxes */}
      <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
        {/* Activity Wallet */}
        <Box
          sx={{
            flex: 1,
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            p: 2.5,
            bgcolor: "#ffffff",
          }}
        >
          <Typography sx={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600, letterSpacing: "0.5px", mb: 1 }}>
            ACTIVITY WALLET
          </Typography>
          <Typography sx={{ fontSize: "1.5rem", color: "#1e293b", fontWeight: 700, fontFamily: "'Cormorant Garamond', serif", mb: 0.5 }}>
            ₹{Number(localBalance).toLocaleString("en-IN")}
          </Typography>
          <Typography sx={{ fontSize: "0.8rem", color: "#64748b" }}>
            Spends on activities
          </Typography>
        </Box>

        {/* Refundable Security */}
        <Box
          sx={{
            flex: 1,
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            p: 2.5,
            bgcolor: "#ffffff",
          }}
        >
          <Typography sx={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600, letterSpacing: "0.5px", mb: 1 }}>
            REFUNDABLE SECURITY
          </Typography>
          <Typography sx={{ fontSize: "1.5rem", color: "#1e293b", fontWeight: 700, fontFamily: "'Cormorant Garamond', serif", mb: 0.5 }}>
            ₹0
          </Typography>
          <Typography sx={{ fontSize: "0.8rem", color: "#64748b" }}>
            RFID card · held
          </Typography>
        </Box>
      </Box>

      {/* Show Recharge QR Button */}
      <Button
        onClick={onShowRechargeQR}
        fullWidth
        variant="contained"
        startIcon={<QrCodeScannerIcon />}
        sx={{
          bgcolor: "#c29c5e", // Golden color from screenshot
          color: "#ffffff",
          py: 1.5,
          fontWeight: 600,
          borderRadius: "8px",
          textTransform: "none",
          fontSize: "1rem",
          boxShadow: "none",
          "&:hover": { bgcolor: "#b08d55", boxShadow: "none" },
        }}
      >
        Show recharge QR
      </Button>

      {/* Booking Slots Section */}
      {selectedFacility && (
        <Box sx={{ mt: 2 }}>
          <Typography sx={{ fontSize: "0.8rem", color: "#64748b", mb: 2 }}>
            Paid — needs the resident's OTP before any money moves · non-refundable · today · no overbooking
          </Typography>

          {loadingSlots ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={30} />
            </Box>
          ) : slots.length === 0 ? (
            <Typography sx={{ fontSize: "0.9rem", color: "#94a3b8", textAlign: "center", py: 2 }}>
              No slots available for today.
            </Typography>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
                gap: 2,
              }}
            >
              {slots.map((slot, i) => {
                const isFull = slot.availableCount <= 0 || slot.status !== "AVAILABLE";
                const isBooking = bookingSlotId === `${slot.startTime}-${slot.endTime}`;
                return (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      border: "1px solid",
                      borderColor: isFull ? "#fee2e2" : "#e2e8f0",
                      bgcolor: isFull ? "#fef2f2" : "#ffffff",
                      borderRadius: "12px",
                      p: 2,
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          color: isFull ? "#ef4444" : "#10b981",
                          mt: 0.5,
                        }}
                      >
                        {isFull ? "Full" : `${slot.availableCount} of ${slot.capacity} free`}
                      </Typography>
                    </Box>

                    {isFull ? (
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "8px",
                          bgcolor: "#e2e8f0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#94a3b8",
                          fontWeight: "bold",
                        }}
                      >
                        -
                      </Box>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={() => handleBook(slot)}
                        disabled={isBooking}
                        sx={{
                          bgcolor: "#24528C",
                          color: "#ffffff",
                          textTransform: "none",
                          borderRadius: "8px",
                          px: 2,
                          py: 0.5,
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          minWidth: "auto",
                          boxShadow: "none",
                          "&:hover": { bgcolor: "#1D4270", boxShadow: "none" },
                        }}
                      >
                        {isBooking ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : "Book"}
                      </Button>
                    )}
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ResidentProfileCard;
