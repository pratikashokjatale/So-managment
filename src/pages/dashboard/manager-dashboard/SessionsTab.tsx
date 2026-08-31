// @ts-nocheck
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  Download as DownloadIcon,
  ScheduleOutlined as ClockIcon,
  TableBarOutlined as TableIcon,
} from "@mui/icons-material";
import { getBookingsApi } from "@/apis/booking";

const BRAND = "#24528C";
const GREEN = "#22c55e";
const GOLD = "#bca47c";
const GOLD_D = "#a17a3f";
const MUT = "#64748b";
const INK = "#1e293b";
const BG = "#f1f5f9";
const LINE = "#e2e8f0";

// Helper to format "HH:MM" (24h) to "hh:mm a" (12h)
const formatTime12h = (time24: string) => {
  if (!time24) return "";
  const [h, m] = time24.split(":");
  let hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "pm" : "am";
  hour = hour % 12 || 12;
  return `${hour.toString().padStart(2, "0")}:${m} ${ampm}`;
};

export default function SessionsTab() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());
  const today = new Date().toISOString().split("T")[0];

  // Update "now" every minute so timers refresh
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await getBookingsApi({ dateFrom: today, dateTo: today, limit: 100 });
      const items = res?.data?.items || res?.items || [];
      
      // Sort by start time
      items.sort((a, b) => {
        if (!a.startTime || !b.startTime) return 0;
        return a.startTime.localeCompare(b.startTime);
      });
      setBookings(items);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Compute status for a booking
  const getSessionState = (b: any) => {
    if (b.status === "CANCELLED" || b.status === "REJECTED") return { status: "cancelled", color: MUT, label: "cancelled" };
    
    if (!b.startTime || !b.endTime) return { status: "unknown", color: MUT, label: "unknown" };
    
    // Parse times relative to today
    const [startH, startM] = b.startTime.split(":");
    const [endH, endM] = b.endTime.split(":");
    const startDate = new Date(now);
    startDate.setHours(parseInt(startH), parseInt(startM), 0, 0);
    
    const endDate = new Date(now);
    endDate.setHours(parseInt(endH), parseInt(endM), 0, 0);
    
    const startMs = startDate.getTime();
    const endMs = endDate.getTime();
    const nowMs = now.getTime();
    
    if (nowMs >= endMs || b.status === "COMPLETED") {
      return { status: "done", color: MUT, label: "done", bg: "#f1f5f9", text: "#64748b" };
    }
    
    if (nowMs >= startMs && nowMs < endMs) {
      const minsLeft = Math.floor((endMs - nowMs) / 60000);
      return { status: "ongoing", color: GREEN, label: "ongoing", bg: "#dcfce7", text: "#166534", subtext: `${minsLeft} min left` };
    }
    
    // Upcoming
    const minsUntil = Math.floor((startMs - nowMs) / 60000);
    return { status: "upcoming", color: BRAND, label: "upcoming", bg: "#e0e7ff", text: "#3730a3", subtext: `in ${minsUntil} min`, minsUntil };
  };

  // Home Theatre bookings are highlighted in Alarms; the schedule stays complete.
  const alarms = bookings.filter(b => {
    const facilityName = String(b.facility?.name || "").toLowerCase();
    return facilityName.includes("home theatre") || facilityName.includes("home theater");
  }).map(b => {
    const s = getSessionState(b);
    return { ...b, state: s };
  });

  const alarmText = (booking: any) => {
    if (booking.state.status === "ongoing") return `is live · ${booking.state.subtext}`;
    if (booking.state.status === "upcoming") return `starts ${booking.state.subtext}`;
    if (booking.state.status === "done") return `${formatTime12h(booking.startTime)}–${formatTime12h(booking.endTime)} · completed`;
    if (booking.state.status === "cancelled") return "cancelled";
    return `${formatTime12h(booking.startTime)}–${formatTime12h(booking.endTime)}`;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: "1.7rem",
              fontWeight: 600,
              color: INK,
              lineHeight: 1.1,
              mb: 0.3,
            }}
          >
            Sessions
          </Typography>
          <Typography sx={{ fontSize: "0.85rem", color: MUT }}>
            Today's facility bookings
          </Typography>
        </Box>
        <Box sx={{ ml: "auto" }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon sx={{ fontSize: 16 }} />}
            sx={{
              bgcolor: BG,
              color: BRAND,
              borderColor: "transparent",
              textTransform: "none",
              borderRadius: "8px",
              px: 2,
              py: 1,
              fontWeight: 600,
              fontSize: "0.85rem",
              "&:hover": { bgcolor: "#e2e8f0", borderColor: "transparent" },
            }}
          >
            Export Excel
          </Button>
        </Box>
      </Box>

      {/* Alarms */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "16px",
          p: 2.5,
          bgcolor: `${GOLD}10`,
          border: `1px solid ${GOLD}44`,
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: "0.95rem", color: INK, mb: 1.5 }}>
          Alarms
        </Typography>
        {alarms.length === 0 ? (
          <Typography sx={{ fontSize: "0.85rem", color: MUT }}>No Home Theatre bookings for today.</Typography>
        ) : (
          <Stack spacing={1.5}>
            {alarms.map((b, idx) => (
              <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                <ClockIcon sx={{ fontSize: 16, color: GOLD_D }} />
                <Typography sx={{ fontSize: "0.85rem", color: INK, flex: 1 }}>
                  {b.facility?.name} {alarmText(b)} — {b.user?.name || "Unknown"} ({b.attendeeCount || 0} pax)
                </Typography>
                <Typography sx={{ fontSize: "0.75rem", color: MUT }}>
                  {b.user?.cardNumber || "N/A"} · {b.user?.flatNumber || "N/A"}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </Paper>

      {/* Today's Schedule */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: `1px solid ${LINE}`,
          bgcolor: "#f8fafc",
          overflow: "hidden",
        }}
      >
        <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${LINE}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: MUT }}>
            Today's schedule
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress size={28} sx={{ color: BRAND }} />
          </Box>
        ) : bookings.length === 0 ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <Typography sx={{ fontSize: "0.9rem", color: MUT }}>No bookings for today.</Typography>
          </Box>
        ) : (
          <Stack divider={<Box sx={{ height: "1px", bgcolor: LINE }} />}>
            {bookings.map((b, idx) => {
              const st = getSessionState(b);
              
              return (
                <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 2.5, p: 2.5, bgcolor: "#fff" }}>
                  {/* Icon */}
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: BG,
                      flexShrink: 0,
                    }}
                  >
                    <TableIcon sx={{ fontSize: 18, color: MUT }} />
                  </Box>

                  {/* Details */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: "0.95rem", fontWeight: 600, color: INK }}>
                      {b.facility?.name || "Facility"} · {b.user?.name || "Unknown"}
                    </Typography>
                    <Typography sx={{ fontSize: "0.75rem", color: MUT, mt: 0.5 }}>
                      {b.user?.cardNumber || "MEM-XXX"} · {b.user?.flatNumber || "N/A"} · {b.attendeeCount || 0} pax · {formatTime12h(b.startTime)}–{formatTime12h(b.endTime)}
                    </Typography>
                  </Box>

                  {/* Status */}
                  <Box sx={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", width: 80 }}>
                    <Box
                      sx={{
                        px: 1.5,
                        py: 0.3,
                        borderRadius: "12px",
                        bgcolor: st.bg || BG,
                        color: st.text || MUT,
                        fontSize: "0.7rem",
                        fontWeight: 700,
                      }}
                    >
                      {st.label}
                    </Box>
                    {st.subtext && (
                      <Typography sx={{ fontSize: "0.65rem", color: MUT, mt: 0.5, fontWeight: 500 }}>
                        {st.subtext}
                      </Typography>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Stack>
        )}
      </Paper>
    </Box>
  );
}
