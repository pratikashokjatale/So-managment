import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  LinearProgress,
  Stack,
  Divider,
  Toolbar,
  useTheme,
  CircularProgress,
  Chip,
  Tooltip,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  WorkOutline,
  GraphicEqOutlined as ScanIcon,
  AccountBalanceWalletOutlined,
  CalendarTodayOutlined,
  PeopleOutlined,
  CardMembershipOutlined,
  InfoOutlined,
  Logout as LogoutIcon,
  SensorsOutlined as AccessIcon,
  BarChartOutlined,
  TrendingUpOutlined,
} from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import logoImg from "@/assets/logo.jpeg";
import {
  getAnalyticsOverviewApi,
  getAnalyticsAccessEventsApi,
  getAnalyticsBookingsByActivityApi,
  getAnalyticsRevenueByActivityApi,
} from "@/apis/analytics";
import { getDashbordFacility } from "@/apis/dashboard";
import { getFacilitiesApi } from "@/apis/facility";
import { getUsersApi } from "@/apis/user";
import { adminRechargeUserWalletApi } from "@/apis/wallet";
import ScanModal from "./components/ScanModal";
import CreateProfileModal from "./components/CreateProfileModal";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";

const INTER = "'Inter', system-ui, sans-serif";
const SERIF = "'Cormorant Garamond', Georgia, serif";

const fmtTime = (iso: string) => {
  try {
    return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  } catch { return iso; }
};

const fmtRupees = (n: number) => {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n.toLocaleString("en-IN")}`;
};

const ACCESS_COLOR: Record<string, string> = {
  ENTRY: "#22c55e",
  EXIT: "#ef4444",
  DENIED: "#f59e0b",
};

const OCCUPANCY_COLOR = (pct: number) =>
  pct >= 90 ? "#c25e40" : pct >= 70 ? "#f59e0b" : "#204a7b";

export default function ManagerDashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { logout, isLoggedIn, isAuthLoading, user } = useAuth();
  const [memberId, setMemberId] = useState("");
  const [selectedResident, setSelectedResident] = useState<any>(null);
  
  const [residentSearchQuery, setResidentSearchQuery] = useState("");
  const [residentOptions, setResidentOptions] = useState<any[]>([]);
  const [loadingResidents, setLoadingResidents] = useState(false);

  // Recharge State
  const [rechargeModalOpen, setRechargeModalOpen] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [rechargeMethod, setRechargeMethod] = useState('CASH');
  const [rechargeRefId, setRechargeRefId] = useState('');
  const [rechargeRemarks, setRechargeRemarks] = useState('');
  const [recharging, setRecharging] = useState(false);

  // Scan Modal State
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [createProfileModalOpen, setCreateProfileModalOpen] = useState(false);

  const handleRecharge = async () => {
    if (!memberId) {
      alert("Please select a member first.");
      return;
    }
    if (!rechargeAmount || isNaN(Number(rechargeAmount)) || Number(rechargeAmount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    setRecharging(true);
    try {
      await adminRechargeUserWalletApi(memberId, {
        amount: Number(rechargeAmount),
        method: rechargeMethod as any,
        referenceId: rechargeRefId,
        remarks: rechargeRemarks
      });
      alert("Wallet recharged successfully!");
      setRechargeModalOpen(false);
      setRechargeAmount('');
      setRechargeRefId('');
      setRechargeRemarks('');
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || err.message || "Failed to recharge wallet");
    } finally {
      setRecharging(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchResidents = async () => {
      setLoadingResidents(true);
      try {
        const p1 = getUsersApi({ limit: 10, search: residentSearchQuery, role: "RESIDENT" });
        const p2 = residentSearchQuery && !residentSearchQuery.includes(" ") 
          ? getUsersApi({ limit: 5, cardNumber: residentSearchQuery.toUpperCase(), role: "RESIDENT" })
          : Promise.resolve(null);
          
        const [res1, res2] = await Promise.all([p1, p2]);
        
        const list1 = (res1 as any)?.data?.users || (res1 as any)?.data?.items || (res1 as any)?.items || [];
        const list2 = res2 ? ((res2 as any)?.data?.users || (res2 as any)?.data?.items || (res2 as any)?.items || []) : [];
        
        const merged = [...list1, ...list2];
        const unique = merged.filter((v, i, a) => a.findIndex((t: any) => t.id === v.id) === i);
        
        setResidentOptions(unique);
      } catch (e) {
        console.warn("resident search error:", e);
      } finally {
        setLoadingResidents(false);
      }
    };
    const timer = setTimeout(fetchResidents, 400);
    return () => clearTimeout(timer);
  }, [residentSearchQuery, isLoggedIn]);

  // ── KPI stats ──────────────────────────────────────────
  const [loadingStats, setLoadingStats] = useState(true);
  const [revenue, setRevenue] = useState(0);
  const [bookingsTotal, setBookingsTotal] = useState(0);
  const [activeMembers, setActiveMembers] = useState(0);
  const [vipPasses, setVipPasses] = useState(0);

  // ── Access events ──────────────────────────────────────
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [accessEvents, setAccessEvents] = useState<any[]>([]);
  const [hourlyData, setHourlyData] = useState<{ hour: string; count: number }[]>([]);

  // ── Bookings by Activity ────────────────────────────────
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingsByActivity, setBookingsByActivity] = useState<any[]>([]);

  // ── Revenue by Activity ─────────────────────────────────
  const [loadingRevenue, setLoadingRevenue] = useState(true);
  const [revenueByActivity, setRevenueByActivity] = useState<any[]>([]);

  // ── Occupancy ──────────────────────────────────────────
  const [loadingOccupancy, setLoadingOccupancy] = useState(true);
  const [facilities, setFacilities] = useState<any[]>([]);

  // ── Auth Guard ─────────────────────────────────────────
  useEffect(() => {
    if (!isAuthLoading && !isLoggedIn) navigate("/login", { replace: true });
  }, [isAuthLoading, isLoggedIn, navigate]);

  // ── Fetch analytics/overview ───────────────────────────
  useEffect(() => {
    if (!isLoggedIn) return;
    (async () => {
      setLoadingStats(true);
      try {
        const res = await getAnalyticsOverviewApi();
        const d = res?.data || (res as any);
        setRevenue(d?.totals?.revenue ?? 0);
        setBookingsTotal(d?.totals?.bookings ?? 0);
        setActiveMembers(d?.totals?.activeMembers ?? 0);
        setVipPasses(d?.activeVipPasses ?? 0);

        // Hourly access data from daily.accessEventsByHour
        const hourly = d?.daily?.accessEventsByHour;
        if (hourly && typeof hourly === "object") {
          const sorted = Object.entries(hourly)
            .map(([h, c]) => ({ hour: `${h}:00`, count: Number(c) }))
            .sort((a, b) => parseInt(a.hour) - parseInt(b.hour));
          setHourlyData(sorted);
        }
      } catch (e) {
        console.warn("analytics/overview error:", e);
      } finally {
        setLoadingStats(false);
      }
    })();
  }, [isLoggedIn]);

  // ── Fetch analytics/access-events ─────────────────────
  useEffect(() => {
    if (!isLoggedIn) return;
    (async () => {
      setLoadingEvents(true);
      try {
        const today = new Date().toISOString().split("T")[0];
        const res = await getAnalyticsAccessEventsApi({ dateFrom: today, dateTo: today, limit: 8 });
        const items = (res as any)?.data?.items ?? (res as any)?.items ?? [];
        setAccessEvents(Array.isArray(items) ? items.slice(0, 8) : []);
      } catch (e) {
        console.warn("access-events error:", e);
      } finally {
        setLoadingEvents(false);
      }
    })();
  }, [isLoggedIn]);

  // ── Fetch analytics/bookings-by-activity ───────────────
  useEffect(() => {
    if (!isLoggedIn) return;
    (async () => {
      setLoadingBookings(true);
      try {
        const res = await getAnalyticsBookingsByActivityApi({ limit: 10 });
        const items = (res as any)?.data?.items ?? (res as any)?.items ?? [];
        setBookingsByActivity(Array.isArray(items) ? items : []);
      } catch (e) {
        console.warn("bookings-by-activity error:", e);
      } finally {
        setLoadingBookings(false);
      }
    })();
  }, [isLoggedIn]);

  // ── Fetch analytics/revenue-by-activity ────────────────
  useEffect(() => {
    if (!isLoggedIn) return;
    (async () => {
      setLoadingRevenue(true);
      try {
        const res = await getAnalyticsRevenueByActivityApi({ limit: 10 });
        const items = (res as any)?.data?.items ?? (res as any)?.items ?? [];
        setRevenueByActivity(Array.isArray(items) ? items : []);
      } catch (e) {
        console.warn("revenue-by-activity error:", e);
      } finally {
        setLoadingRevenue(false);
      }
    })();
  }, [isLoggedIn]);

  // ── Fetch facility occupancy ───────────────────────────
  useEffect(() => {
    if (!isLoggedIn) return;
    (async () => {
      setLoadingOccupancy(true);
      try {
        const [facRes, statsRes] = await Promise.allSettled([
          getFacilitiesApi({ limit: 20, isActive: true }),
          getDashbordFacility({ days: 2 }),
        ]);
        let list: any[] = [];
        if (facRes.status === "fulfilled") {
          const d = facRes.value?.data || facRes.value;
          list = (d as any)?.items ?? (d as any)?.facilities ?? (Array.isArray(d) ? d : []);
        }
        let statsMap: Record<string, any> = {};
        if (statsRes.status === "fulfilled") {
          const raw = statsRes.value?.data || statsRes.value;
          const sl = (raw as any)?.facilityStats ?? (raw as any)?.facilities ?? (raw as any)?.items ?? (Array.isArray(raw) ? raw : []);
          if (Array.isArray(sl)) sl.forEach((s: any) => { if (s.facilityId) statsMap[s.facilityId] = s; if (s.id) statsMap[s.id] = s; });
        }
        list = list.map((f: any) => {
          const s = statsMap[f.id] || {};
          const cap = f.capacity || s.capacity || 50;
          const booked = f.bookedSlots ?? s.bookedSlots ?? s.bookings ?? 0;
          return { ...f, occupancyPercent: cap > 0 ? Math.min(Math.round((booked / cap) * 100), 100) : 0 };
        });
        setFacilities(list.slice(0, 6));
      } catch (e) {
        console.warn("occupancy error:", e);
      } finally {
        setLoadingOccupancy(false);
      }
    })();
  }, [isLoggedIn]);

  const handleLogout = async () => { await logout(); navigate("/login"); };

  if (isAuthLoading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#edf1f9" }}>
        <CircularProgress />
      </Box>
    );
  }

  const kpiCards = [
    {
      icon: <AccountBalanceWalletOutlined sx={{ fontSize: 16, color: "#bca47c" }} />,
      label: "TOTAL REVENUE",
      value: loadingStats ? null : fmtRupees(revenue),
      sub: revenue > 0 ? "all time" : "no revenue yet",
    },
    {
      icon: <CalendarTodayOutlined sx={{ fontSize: 16, color: "#475569" }} />,
      label: "TOTAL BOOKINGS",
      value: loadingStats ? null : String(bookingsTotal),
      sub: "all bookings",
    },
    {
      icon: <PeopleOutlined sx={{ fontSize: 16, color: "#22c55e" }} />,
      label: "ACTIVE MEMBERS",
      value: loadingStats ? null : String(activeMembers),
      sub: "registered members",
    },
    {
      icon: <CardMembershipOutlined sx={{ fontSize: 16, color: "#f59e0b" }} />,
      label: "VIP PASSES",
      value: loadingStats ? null : String(vipPasses),
      sub: "active passes",
    },
  ];

  const demoIds = ["MEM-100482", "MEM-100613", "MEM-100731", "MEM-100355"];

  // Max values for bar width normalization
  const maxBookings = Math.max(...bookingsByActivity.map((b) => b.bookings || 0), 1);
  const maxRevenue = Math.max(...revenueByActivity.map((r) => r.revenue || 0), 1);

  // Max count for hourly bars
  const maxHourly = Math.max(...hourlyData.map((h) => h.count), 1);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#edf1f9", fontFamily: INTER }}>

      {/* ── Top Nav ── */}
      <Box component="header" sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: theme.zIndex.drawer + 1, bgcolor: "#ffffff", borderBottom: "1px solid #e2e8f0" }}>
        <Toolbar sx={{ justifyContent: "space-between", minHeight: "50px !important", maxWidth: "1100px", margin: "0 auto", px: { xs: 2, md: 3 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <Box component="img" src={logoImg} alt="Logo" sx={{ width: 28, height: 28, borderRadius: "6px", objectFit: "cover" }} />
            <Typography sx={{ fontFamily: SERIF, fontWeight: 700, fontSize: "1.05rem", color: "#0f172a", letterSpacing: "-0.3px" }}>Club Marbella</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ textAlign: "right" }}>
              <Typography sx={{ fontWeight: 600, fontSize: "0.82rem", color: "#1e293b", lineHeight: 1.2 }}>{user?.name || "Manager"}</Typography>
              <Typography sx={{ fontSize: "0.7rem", color: "#64748b" }}>Club Manager</Typography>
            </Box>
            <Button onClick={() => navigate("/")} size="small" sx={{ bgcolor: "#f1f5f9", color: "#475569", fontWeight: 600, borderRadius: "20px", px: 1.8, py: 0.4, fontSize: "0.75rem", textTransform: "none", "&:hover": { bgcolor: "#e2e8f0" } }}>Back to Admin</Button>
            <Button onClick={handleLogout} size="small" sx={{ minWidth: 0, p: 0.5, color: "#94a3b8", "&:hover": { color: "#475569" } }}>
              <LogoutIcon sx={{ fontSize: 18 }} />
            </Button>
          </Box>
        </Toolbar>
      </Box>

      {/* ── Content ── */}
      <Box sx={{ pt: "66px", maxWidth: "1100px", margin: "0 auto", px: { xs: 2, md: 3 }, pb: 5 }}>
        <Paper elevation={0} sx={{ mt: 2, borderRadius: "20px", border: "1px solid #dde3ed", bgcolor: "#ffffff", overflow: "hidden", boxShadow: "0 4px 24px rgba(99,120,160,0.12)" }}>

          {/* ── Profile Header ── */}
          <Box sx={{ px: 3, py: 2, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ width: 38, height: 38, borderRadius: "10px", bgcolor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <WorkOutline sx={{ color: "#475569", fontSize: 18 }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: "0.88rem", color: "#1e293b" }}>{user?.name || "Manager"}</Typography>
                <Typography sx={{ fontSize: "0.75rem", color: "#64748b" }}>Club Manager</Typography>
              </Box>
            </Box>
            <Button onClick={() => navigate("/")} variant="outlined" size="small" sx={{ borderColor: "#cbd5e1", color: "#475569", textTransform: "none", borderRadius: "20px", fontSize: "0.75rem", px: 2, fontWeight: 500, "&:hover": { borderColor: "#94a3b8", bgcolor: "#f8fafc" } }}>
              Back to Admin
            </Button>
          </Box>

          <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>

            {/* ── Title + Scan ── */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Box>
                <Typography sx={{ fontFamily: SERIF, fontSize: "2rem", fontWeight: 600, color: "#192038", lineHeight: 1.1, mb: 0.3 }}>Manager</Typography>
                <Typography sx={{ fontSize: "0.82rem", color: "#64748b" }}>Floor operations & member bookings</Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Button 
                  onClick={() => setScanModalOpen(true)}
                  variant="contained" 
                  startIcon={<ScanIcon />} 
                  sx={{ bgcolor: "#1e3a5f", color: "white", textTransform: "none", borderRadius: "10px", px: 2.5, py: 1, fontWeight: 600, fontSize: "0.85rem", boxShadow: "none", "&:hover": { bgcolor: "#162d4a", boxShadow: "none" } }}
                >
                  Scan / block
                </Button>
                <Button 
                  onClick={() => setCreateProfileModalOpen(true)}
                  variant="contained" 
                  startIcon={<PersonAddAltOutlinedIcon />} 
                  sx={{ bgcolor: "#f8f3e6", color: "#a17a3f", textTransform: "none", borderRadius: "10px", px: 2.5, py: 1, fontWeight: 600, fontSize: "0.85rem", boxShadow: "none", "&:hover": { bgcolor: "#f0e8d5", boxShadow: "none" } }}
                >
                  Create profile
                </Button>
              </Box>
            </Box>

            {/* ── 4 KPI Cards ── */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 1.5 }}>
              {kpiCards.map((card, idx) => (
                <Paper key={idx} elevation={0} sx={{ p: "14px 18px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1.2 }}>
                    {card.icon}
                    <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.6px", textTransform: "uppercase" }}>{card.label}</Typography>
                  </Box>
                  {card.value === null
                    ? <CircularProgress size={22} thickness={4} sx={{ color: "#204a7b", my: 0.5 }} />
                    : <Typography sx={{ 
                        fontFamily: SERIF, 
                        fontSize: "1.8rem", 
                        fontWeight: 600, 
                        color: "#192038", 
                        lineHeight: 1.1,
                        filter: card.label === "TOTAL REVENUE" ? "blur(6px)" : "none",
                        userSelect: card.label === "TOTAL REVENUE" ? "none" : "auto"
                      }}>
                        {card.value}
                      </Typography>
                  }
                  <Typography sx={{ fontSize: "0.72rem", color: "#64748b", mt: 0.3 }}>{card.sub}</Typography>
                </Paper>
              ))}
            </Box>

            {/* ── Member Counter ── */}
            <Paper elevation={0} sx={{ p: "18px 22px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <Typography sx={{ fontWeight: 600, fontSize: "0.88rem", color: "#1e293b", mb: 1.8 }}>
                Member counter — book & recharge on a member's behalf
              </Typography>
              <Box sx={{ display: "flex", gap: 1.5, mb: 1.5 }}>
                <Autocomplete
                  fullWidth
                  size="small"
                  options={residentOptions}
                  getOptionLabel={(option) => `${option.name || "Unknown"} (${option.residentId || "No ID"})${option.cardNumber ? ` [Card: ${option.cardNumber}]` : ""} - ${option.phone || ""}`}
                  value={selectedResident}
                  onChange={(_, val) => {
                    setSelectedResident(val);
                    setMemberId(val ? val.residentId || val.id : "");
                  }}
                  onInputChange={(_, val) => setResidentSearchQuery(val)}
                  loading={loadingResidents}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      placeholder="Scan card or search by name, phone, or ID..." 
                      variant="outlined" 
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingResidents ? <CircularProgress color="inherit" size={16} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: "0.83rem", bgcolor: "#fafafa" } }} 
                    />
                  )}
                />
                <Button 
                  onClick={() => setRechargeModalOpen(true)}
                  disabled={!memberId}
                  variant="contained" 
                  sx={{ bgcolor: "#1e3a5f", color: "white", textTransform: "none", borderRadius: "8px", px: 3, fontWeight: 600, fontSize: "0.83rem", whiteSpace: "nowrap", boxShadow: "none", "&:hover": { bgcolor: "#162d4a", boxShadow: "none" } }}
                >
                  Member Details
                </Button>
              </Box>
              <Box sx={{ display: "flex", gap: 0.8, alignItems: "flex-start", mb: 0.8 }}>
                <InfoOutlined sx={{ fontSize: 14, color: "#bca47c", mt: 0.2, flexShrink: 0 }} />
                <Typography sx={{ fontSize: "0.71rem", color: "#64748b", lineHeight: 1.55 }}>
                  <strong>Resident ID</strong> (MEM-######) is the member's account number — one per person. The <strong>Card ID</strong> (MB-/TW-/RY-####) is printed on their physical RFID card; a member may hold several cards (self, dependents, guest). Either loads the same account.
                </Typography>
              </Box>
              <Typography sx={{ fontSize: "0.71rem", color: "#64748b" }}>
                Demo IDs:{" "}
                {demoIds.map((id) => (
                  <Box key={id} component="span" onClick={() => setMemberId(id)} sx={{ color: "#204a7b", textDecoration: "underline", cursor: "pointer", mr: 1, "&:hover": { color: "#162d4a" } }}>{id}</Box>
                ))}
              </Typography>
            </Paper>

            {/* ── Data Panels Row ── */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 1.5, alignItems: "start" }}>

              {/* ── Left Column (Bookings & Revenue) ── */}
              <Stack spacing={1.5}>
                {/* Bookings by Activity */}
                <Paper elevation={0} sx={{ p: "18px 22px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.8 }}>
                    <BarChartOutlined sx={{ fontSize: 18, color: "#204a7b" }} />
                    <Typography sx={{ fontWeight: 600, fontSize: "0.88rem", color: "#1e293b" }}>Bookings by Activity</Typography>
                  </Box>
                  {loadingBookings ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}><CircularProgress size={28} sx={{ color: "#204a7b" }} /></Box>
                  ) : bookingsByActivity.length === 0 ? (
                    <Typography sx={{ fontSize: "0.82rem", color: "#94a3b8", textAlign: "center", py: 3 }}>No booking data</Typography>
                  ) : (
                    <Stack spacing={2}>
                      {bookingsByActivity.map((item: any, idx: number) => {
                        const pct = Math.round((item.bookings / maxBookings) * 100);
                        return (
                          <Box key={idx}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.6 }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography sx={{ fontSize: "0.83rem", color: "#1e293b", fontWeight: 500 }}>{item.facilityName}</Typography>
                                {item.category && (
                                  <Chip label={item.category} size="small" sx={{ height: 16, fontSize: "0.58rem", bgcolor: "#f1f5f9", color: "#64748b", "& .MuiChip-label": { px: 0.7 } }} />
                                )}
                              </Box>
                              <Typography sx={{ fontSize: "0.83rem", color: "#204a7b", fontWeight: 700 }}>{item.bookings}</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={pct} sx={{ height: 6, borderRadius: 4, bgcolor: "#f1f5f9", "& .MuiLinearProgress-bar": { bgcolor: "#204a7b", borderRadius: 4 } }} />
                          </Box>
                        );
                      })}
                    </Stack>
                  )}
                </Paper>

                {/* Revenue by Activity */}
                <Paper elevation={0} sx={{ p: "18px 22px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.8 }}>
                    <TrendingUpOutlined sx={{ fontSize: 18, color: "#22c55e" }} />
                    <Typography sx={{ fontWeight: 600, fontSize: "0.88rem", color: "#1e293b" }}>Revenue by Activity</Typography>
                  </Box>
                  {loadingRevenue ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}><CircularProgress size={28} sx={{ color: "#204a7b" }} /></Box>
                  ) : revenueByActivity.length === 0 ? (
                    <Typography sx={{ fontSize: "0.82rem", color: "#94a3b8", textAlign: "center", py: 3 }}>No revenue data</Typography>
                  ) : (
                    <Stack spacing={2}>
                      {revenueByActivity.map((item: any, idx: number) => {
                        const pct = Math.round((item.revenue / maxRevenue) * 100);
                        const barColor = pct >= 80 ? "#22c55e" : pct >= 50 ? "#204a7b" : "#94a3b8";
                        return (
                          <Box key={idx}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.6 }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography sx={{ fontSize: "0.83rem", color: "#1e293b", fontWeight: 500 }}>{item.facilityName}</Typography>
                                {item.category && (
                                  <Chip label={item.category} size="small" sx={{ height: 16, fontSize: "0.58rem", bgcolor: "#f1f5f9", color: "#64748b", "& .MuiChip-label": { px: 0.7 } }} />
                                )}
                              </Box>
                              <Typography sx={{ fontSize: "0.83rem", color: "#22c55e", fontWeight: 700 }}>{fmtRupees(item.revenue)}</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={pct} sx={{ height: 6, borderRadius: 4, bgcolor: "#f1f5f9", "& .MuiLinearProgress-bar": { bgcolor: barColor, borderRadius: 4 } }} />
                          </Box>
                        );
                      })}
                    </Stack>
                  )}
                </Paper>
              </Stack>

              {/* ── Right Column (Hourly Access Events) ── */}
              <Paper elevation={0} sx={{ p: "18px 22px", borderRadius: "12px", border: "1px solid #e2e8f0", height: "100%", display: "flex", flexDirection: "column" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  <BarChartOutlined sx={{ fontSize: 18, color: "#204a7b" }} />
                  <Typography sx={{ fontWeight: 600, fontSize: "0.88rem", color: "#1e293b" }}>Access Events by Hour</Typography>
                </Box>
                <Typography sx={{ fontSize: "0.7rem", color: "#94a3b8", mb: 1.5 }}>Today's access activity per hour</Typography>

                {loadingStats ? (
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1, py: 4 }}>
                    <CircularProgress size={28} sx={{ color: "#204a7b" }} />
                  </Box>
                ) : hourlyData.length === 0 ? (
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, minHeight: 160 }}>
                    <Typography sx={{ fontSize: "0.82rem", color: "#94a3b8" }}>No hourly data available</Typography>
                  </Box>
                ) : (
                  <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={hourlyData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }} barCategoryGap="30%">
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis
                          dataKey="hour"
                          tick={{ fontSize: 10, fill: "#94a3b8" }}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(v) => v.replace(":00", "")}
                        />
                        <YAxis
                          tick={{ fontSize: 10, fill: "#94a3b8" }}
                          tickLine={false}
                          axisLine={false}
                          allowDecimals={false}
                        />
                        <RTooltip
                          cursor={{ fill: "#f1f5f9" }}
                          contentStyle={{
                            background: "#ffffff",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            fontSize: "0.78rem",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            padding: "6px 12px",
                          }}
                          formatter={(val: any) => [`${val} events`, "Access"]}
                          labelFormatter={(label) => `Hour: ${label}`}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={28}>
                          {hourlyData.map((entry, idx) => (
                            <Cell
                              key={idx}
                              fill={entry.count >= maxHourly * 0.75 ? "#c25e40" : entry.count >= maxHourly * 0.4 ? "#204a7b" : "#93c5fd"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                )}

                {/* Legend */}
                <Box sx={{ display: "flex", gap: 2, mt: "auto", pt: 2, justifyContent: "center" }}>
                  {[{ color: "#c25e40", label: "High" }, { color: "#204a7b", label: "Medium" }, { color: "#93c5fd", label: "Low" }].map((l) => (
                    <Box key={l.label} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: "2px", bgcolor: l.color }} />
                      <Typography sx={{ fontSize: "0.68rem", color: "#94a3b8" }}>{l.label}</Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Box>

          </Box>
        </Paper>
      </Box>

      {/* Admin Recharge Modal */}
      <Dialog open={rechargeModalOpen} onClose={() => !recharging && setRechargeModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#091542' }}>Admin Wallet Recharge</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Use this to credit the user's wallet manually if they paid offline via Cash, UPI, or Bank Transfer.
          </Typography>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Amount (₹)"
              type="number"
              value={rechargeAmount}
              onChange={(e) => setRechargeAmount(e.target.value)}
              disabled={recharging}
            />
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Payment Method</Typography>
              <Select
                fullWidth
                value={rechargeMethod}
                onChange={(e) => setRechargeMethod(e.target.value)}
                disabled={recharging}
              >
                <MenuItem value="CASH">Cash</MenuItem>
                <MenuItem value="UPI">UPI</MenuItem>
                <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
                <MenuItem value="MANUAL">Manual/Other</MenuItem>
              </Select>
            </Box>
            <TextField
              fullWidth
              label="Reference ID (Optional)"
              value={rechargeRefId}
              onChange={(e) => setRechargeRefId(e.target.value)}
              disabled={recharging}
            />
            <TextField
              fullWidth
              label="Remarks (Optional)"
              value={rechargeRemarks}
              onChange={(e) => setRechargeRemarks(e.target.value)}
              disabled={recharging}
              multiline
              rows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setRechargeModalOpen(false)} disabled={recharging} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleRecharge}
            variant="contained" 
            disabled={recharging || !rechargeAmount}
            sx={{ bgcolor: '#0284c7', '&:hover': { bgcolor: '#0369a1' }, borderRadius: '8px', px: 3 }}
          >
            {recharging ? <CircularProgress size={24} color="inherit" /> : 'Confirm Recharge'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Scan Modal */}
      <ScanModal open={scanModalOpen} onClose={() => setScanModalOpen(false)} />
      <CreateProfileModal open={createProfileModalOpen} onClose={() => setCreateProfileModalOpen(false)} />
    </Box>
  );
}
