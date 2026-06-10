import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  IconButton,
  Grid,
  Divider,
  CircularProgress,
  Chip,
  LinearProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ListAlt as LogsIcon,
  Close as CloseIcon,
  OpenInNew as OpenInNewIcon,
  People as PeopleIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  Badge as BadgeIcon,
  WarningAmber as WarningIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import LogItem from "@/components/LogItem";
import { useAuth } from "@/contexts/AuthContext";
import { getMyQrApi } from "@/apis/user";
import { getFileUrl } from "@/utils/file";
import { QRCodeSVG } from "qrcode.react";

import {
  getDashboardApi,
  getDashbordRevenue,
  getDashbordFacility,
  getUserDemographicsApi,
  getPaymentMethodsStatsApi,
  getStaffAttendanceStatsApi,
} from "@/apis/dashboard";

const lineData = [
  { name: "Mon", total: 30, confirmed: 15, cancelled: 5 },
  { name: "Tue", total: 48, confirmed: 25, cancelled: 4 },
  { name: "Wed", total: 40, confirmed: 22, cancelled: 6 },
  { name: "Thu", total: 58, confirmed: 35, cancelled: 10 },
  { name: "Fri", total: 45, confirmed: 28, cancelled: 8 },
  { name: "Sat", total: 72, confirmed: 45, cancelled: 12 },
  { name: "Sun", total: 85, confirmed: 55, cancelled: 15 },
];

const pieData = [
  { name: "Gym", value: 40, color: "#0047b3" },
  { name: "Swimming Pool", value: 25, color: "#2196f3" },
  { name: "Tennis Court", value: 20, color: "#4caf50" },
  { name: "Badminton Court", value: 10, color: "#ff9800" },
  { name: "Others", value: 5, color: "#9e9e9e" },
];

const activities = [
  {
    id: 1,
    title: "Swimming Pool",
    date: "15 May 2024, 10:00 AM",
    image:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: 2,
    title: "Yoga Class",
    date: "15 May 2024, 05:30 PM",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: 3,
    title: "Tennis Tournament",
    date: "16 May 2024, 07:00 PM",
    image:
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: 4,
    title: "Squash Match",
    date: "16 May 2024, 08:30 PM",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: 5,
    title: "Billiards",
    date: "17 May 2024, 07:00 PM",
    image:
      "https://images.unsplash.com/photo-1563506730724-8d9b30176567?auto=format&fit=crop&q=80&w=200",
  },
];

const systemLogs = [
  {
    id: 1,
    event: "New Resident Added",
    user: "Admin",
    time: "2 mins ago",
    type: "Success",
  },
  {
    id: 2,
    event: "Facility Booking Cancelled",
    user: "Resident",
    time: "15 mins ago",
    type: "Warning",
  },
  {
    id: 3,
    event: "Maintenance Alert Sent",
    user: "System",
    time: "1 hour ago",
    type: "Info",
  },
  {
    id: 4,
    event: "Payment Received: ₹1,500",
    user: "Admin",
    time: "2 hours ago",
    type: "Success",
  },
  {
    id: 5,
    event: "Staff Login Failure",
    user: "System",
    time: "3 hours ago",
    type: "Error",
  },
  {
    id: 6,
    event: "Guest Entry Recorded",
    user: "Security",
    time: "4 hours ago",
    type: "Success",
  },
];

function StatCard({ title, value, trend, trendValue, isPositive }: any) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        border: "1px solid #f1f5f9",
        borderLeft: isPositive ? "4px solid #10b981" : "4px solid #ef4444",
        borderRadius: "16px",
        bgcolor: "#ffffff",
        boxShadow:
          "0 4px 6px -1px rgba(0,0,0,0.01), 0 2px 4px -1px rgba(0,0,0,0.01)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 24px -10px rgba(9, 21, 66, 0.1)",
          borderColor: "#e2e8f0",
        },
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight="700"
        sx={{
          mb: 1,
          display: "block",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="h4"
        fontWeight="800"
        color="#091542"
        sx={{ mb: 1, letterSpacing: "-0.5px" }}
      >
        {value}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        {isPositive ? (
          <TrendingUpIcon sx={{ fontSize: 14, color: "#10b981" }} />
        ) : (
          <TrendingDownIcon sx={{ fontSize: 14, color: "#ef4444" }} />
        )}
        <Typography
          variant="caption"
          fontWeight="800"
          color={isPositive ? "#10b981" : "#ef4444"}
        >
          {trendValue}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ ml: 0.5, fontWeight: 500 }}
        >
          {trend}
        </Typography>
      </Box>
    </Paper>
  );
}

const fallbackDemographics = [
  {
    role: "RESIDENT",
    count: 115,
    status: "ACTIVE",
    active30Days: 90,
    active7Days: 45,
  },
  {
    role: "GUEST",
    count: 30,
    status: "ACTIVE",
    active30Days: 20,
    active7Days: 10,
  },
  {
    role: "STAFF",
    count: 50,
    status: "ACTIVE",
    active30Days: 45,
    active7Days: 30,
  },
  {
    role: "ADMIN",
    count: 5,
    status: "ACTIVE",
    active30Days: 5,
    active7Days: 5,
  },
];

const fallbackPaymentStats = [
  {
    provider: "RAZORPAY",
    count: 150,
    totalAmount: 75000.5,
    averageAmount: 500.0,
  },
  {
    provider: "WALLET",
    count: 80,
    totalAmount: 40000.25,
    averageAmount: 500.0,
  },
  { provider: "MANUAL", count: 20, totalAmount: 10000.0, averageAmount: 500.0 },
];

const fallbackAttendanceStats = [
  { status: "PRESENT", count: 1200 },
  { status: "ABSENT", count: 50 },
  { status: "LATE", count: 75 },
  { status: "HALF_DAY", count: 30 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();
  const [filterType, setFilterType] = useState("This Month");
  const [logsOpen, setLogsOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);

  // Admin Dashboard Statistics State
  const [overview, setOverview] = useState<any>(null);
  const [revenueTrends, setRevenueTrends] = useState<any[]>([]);
  const [facilityStats, setFacilityStats] = useState<any[]>([]);
  const [demographics, setDemographics] = useState<any[]>([]);
  const [paymentStats, setPaymentStats] = useState<any[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);

  const LogItemLocal = ({ log }: any) => <LogItem log={log} />;

  // Load User Access QR Code
  useEffect(() => {
    if (!isAdmin) {
      const fetchQr = async () => {
        setQrLoading(true);
        try {
          const res = await getMyQrApi();
          const data =
            res?.data?.qrCode ||
            res?.qrCode ||
            res?.data?.code ||
            res?.code ||
            res?.data ||
            res;
          if (data && typeof data === "string") {
            setQrCodeData(data);
          } else if (data && typeof data === "object" && data.code) {
            setQrCodeData(data.code);
          } else if (data && typeof data === "object" && data.qrCode) {
            setQrCodeData(data.qrCode);
          }
        } catch (err) {
          console.warn("Failed to fetch own QR code for dashboard:", err);
        } finally {
          setQrLoading(false);
        }
      };
      fetchQr();
    }
  }, [isAdmin]);

  // Load Admin Data
  useEffect(() => {
    if (isAdmin) {
      const loadAdminData = async () => {
        setLoadingStats(true);
        try {
          const ov = await getDashboardApi();
          setOverview(ov?.data || ov);

          let days = 30;
          if (filterType === "Day") days = 2;
          else if (filterType === "Week") days = 7;
          else if (filterType === "This Month") days = 30;
          else if (filterType === "Year") days = 365;

          const rev = await getDashbordRevenue({ days });
          setRevenueTrends(rev?.data || rev || []);

          const fac = await getDashbordFacility();
          setFacilityStats(fac?.data || fac || []);

          const demo = await getUserDemographicsApi();
          setDemographics(demo?.data || demo || []);

          const pay = await getPaymentMethodsStatsApi({ days });
          setPaymentStats(pay?.data || pay || []);

          const att = await getStaffAttendanceStatsApi({ days });
          setAttendanceStats(att?.data || att || []);
        } catch (err) {
          console.warn("Failed to load admin stats:", err);
        } finally {
          setLoadingStats(false);
        }
      };
      loadAdminData();
    }
  }, [isAdmin, filterType]);

  if (!isAdmin) {
    const userName = user?.name || "User";
    const userInitials = userName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    return (
      <Box sx={{ mt: 2, bgcolor: "#f8fafc", minHeight: "100vh" }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h4"
            fontWeight="900"
            color="#091542"
            sx={{ mb: 1, letterSpacing: "-0.5px" }}
          >
            Welcome, {userName}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Access your gate entry pass and account overview here.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Access QR Code Card */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: "24px",
                border: "1px solid #f1f5f9",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                bgcolor: "white",
                boxShadow: "0 10px 30px rgba(9, 21, 66, 0.02)",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "6px",
                  bgcolor: "#0047b3",
                },
              }}
            >
              <Typography
                variant="h5"
                fontWeight="900"
                color="#091542"
                sx={{ mb: 1 }}
              >
                Gate Entry QR Pass
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Hold this QR code against the gate scanner to pass through
                automatically.
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
                    borderRadius: "20px",
                    border: "2px dashed #cbd5e1",
                    display: "inline-block",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.02)",
                    transition: "transform 0.3s",
                    "&:hover": { transform: "scale(1.02)" },
                  }}
                >
                  <QRCodeSVG value={qrCodeData} size={180} level="H" />
                </Box>
              ) : (
                <Box sx={{ py: 6 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight="700"
                  >
                    No access QR code available.
                  </Typography>
                </Box>
              )}

              <Chip
                label={user?.status || "ACTIVE"}
                color={user?.status === "EXPIRED" ? "error" : "success"}
                sx={{
                  mt: 4,
                  fontWeight: 900,
                  fontSize: "0.8rem",
                  borderRadius: "10px",
                  px: 2,
                }}
              />

              <Typography
                variant="caption"
                fontWeight="800"
                color="#94a3b8"
                sx={{ mt: 3, display: "block", letterSpacing: "1px" }}
              >
                USE FOR AUTOMATED GATE ENTRY
              </Typography>
            </Paper>
          </Grid>

          {/* User Details & Profile Summary */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: "24px",
                border: "1px solid #f1f5f9",
                bgcolor: "white",
                height: "100%",
                boxShadow: "0 10px 30px rgba(9, 21, 66, 0.02)",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "6px",
                  bgcolor: "#10b981",
                },
              }}
            >
              <Stack
                direction="row"
                spacing={3}
                alignItems="center"
                sx={{ mb: 4 }}
              >
                <Avatar
                  src={getFileUrl(
                    user?.photoUrl || user?.profilePhotoUrl || user?.avatar,
                  )}
                  imgProps={{ crossOrigin: "anonymous" }}
                  sx={{
                    width: 70,
                    height: 70,
                    fontSize: "1.75rem",
                    fontWeight: 900,
                    bgcolor: "#eff6ff",
                    color: "#1e40af",
                    border: "2px solid #eff6ff",
                  }}
                >
                  {userInitials}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="900" color="#091542">
                    {userName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={500}
                  >
                    {user?.email}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}
              >
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "#f8fafc",
                    borderRadius: "14px",
                    border: "1px solid #f1f5f9",
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight="800"
                    color="text.secondary"
                    sx={{ textTransform: "uppercase" }}
                  >
                    Role
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight="800"
                    color="#091542"
                    sx={{ mt: 0.5 }}
                  >
                    {user?.role || "Resident"}
                  </Typography>
                </Box>

                {user?.accountRole && (
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "#f8fafc",
                      borderRadius: "14px",
                      border: "1px solid #f1f5f9",
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontWeight="800"
                      color="text.secondary"
                      sx={{ textTransform: "uppercase" }}
                    >
                      Account Type
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="800"
                      color="#091542"
                      sx={{ mt: 0.5 }}
                    >
                      {user?.accountRole}
                    </Typography>
                  </Box>
                )}

                <Box
                  sx={{
                    p: 2,
                    bgcolor: "#f8fafc",
                    borderRadius: "14px",
                    border: "1px solid #f1f5f9",
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight="800"
                    color="text.secondary"
                    sx={{ textTransform: "uppercase" }}
                  >
                    Phone Number
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight="800"
                    color="#091542"
                    sx={{ mt: 0.5 }}
                  >
                    {user?.phone || "N/A"}
                  </Typography>
                </Box>

                {user?.stayEndsAt && (
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "#fff5f5",
                      borderRadius: "14px",
                      border: "1px solid #ffe3e3",
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontWeight="800"
                      color="#e53e3e"
                      sx={{ textTransform: "uppercase" }}
                    >
                      Access Expiry Date
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="800"
                      color="#e53e3e"
                      sx={{ mt: 0.5 }}
                    >
                      {new Date(user.stayEndsAt).toLocaleDateString("en-US", {
                        dateStyle: "medium",
                      })}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Box sx={{ mt: 5, display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => navigate("/profile")}
                  sx={{
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: 800,
                    bgcolor: "#0047b3",
                    boxShadow: "none",
                    px: 4,
                    py: 1.25,
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "#003bb3",
                      boxShadow: "0 6px 16px rgba(0, 71, 179, 0.2)",
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  View Profile details
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/support")}
                  sx={{
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: 800,
                    borderColor: "#e2e8f0",
                    color: "#091542",
                    px: 4,
                    py: 1.25,
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: "#091542",
                      bgcolor: "#f8fafc",
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  Contact Support
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  }

  // Map daily trends for the LineChart
  const lineChartData = revenueTrends.map((t: any) => {
    const d = new Date(t.date);
    const label =
      d.toLocaleDateString("en-US", { weekday: "short" }) + " " + d.getDate();
    return {
      name: label,
      total: t.transactionCount || 0,
      confirmed: t.successCount || 0,
      cancelled: t.failedCount || 0,
    };
  });
  const finalLineData = lineChartData.length > 0 ? lineChartData : lineData;

  // Map facility statistics for the PieChart
  const COLORS = [
    "#0047b3",
    "#2196f3",
    "#4caf50",
    "#ff9800",
    "#9c27b0",
    "#e91e63",
    "#009688",
  ];
  const pieChartData = facilityStats
    .map((fac: any, index: number) => ({
      name: fac.name,
      value: fac.totalAccess || 0,
      color: COLORS[index % COLORS.length],
    }))
    .filter((item: any) => item.value > 0);
  const finalPieData = pieChartData.length > 0 ? pieChartData : pieData;
  const totalPieAccess = finalPieData.reduce(
    (sum: number, item: any) => sum + item.value,
    0,
  );

  // User demographics aggregation
  const roleSummaries =
    demographics.length > 0
      ? ["RESIDENT", "GUEST", "STAFF", "ADMIN", "SUPER_ADMIN"]
          .map((role) => {
            const roleData = demographics.filter((d: any) => d.role === role);
            const total = roleData.reduce((sum, d) => sum + (d.count || 0), 0);
            const active = roleData
              .filter((d) => d.status === "ACTIVE")
              .reduce((sum, d) => sum + (d.count || 0), 0);
            const pending = roleData
              .filter((d) => d.status === "PENDING")
              .reduce((sum, d) => sum + (d.count || 0), 0);
            const active30 = roleData.reduce(
              (sum, d) => sum + (d.active30Days || 0),
              0,
            );
            return { role, total, active, pending, active30 };
          })
          .filter((r) => r.total > 0)
      : fallbackDemographics.map((f) => ({
          role: f.role,
          total: f.count,
          active: f.count - (f.role === "RESIDENT" ? 15 : 0),
          pending: f.role === "RESIDENT" ? 15 : 0,
          active30: f.active30Days,
        }));

  // Payments data processing
  const finalPaymentStats =
    paymentStats.length > 0 ? paymentStats : fallbackPaymentStats;
  const totalPaymentAmount = finalPaymentStats.reduce(
    (sum, p) => sum + (p.totalAmount || 0),
    0,
  );

  // Attendance data processing
  const finalAttendanceStats =
    attendanceStats.length > 0 ? attendanceStats : fallbackAttendanceStats;
  const totalAttendanceCount = finalAttendanceStats.reduce(
    (sum, a) => sum + (a.count || 0),
    0,
  );
  const presentCount =
    finalAttendanceStats.find(
      (a) => (a.status || "").toUpperCase() === "PRESENT",
    )?.count || 0;
  const absentCount =
    finalAttendanceStats.find(
      (a) => (a.status || "").toUpperCase() === "ABSENT",
    )?.count || 0;
  const lateCount =
    finalAttendanceStats.find((a) => (a.status || "").toUpperCase() === "LATE")
      ?.count || 0;
  const halfDayCount =
    finalAttendanceStats.find(
      (a) => (a.status || "").toUpperCase() === "HALF_DAY",
    )?.count || 0;

  const attendanceRate =
    totalAttendanceCount > 0
      ? Math.round(
          ((presentCount + lateCount + halfDayCount) / totalAttendanceCount) *
            100,
        )
      : 95;

  return (
    <Box sx={{ mt: 2, bgcolor: "#f8fafc", minHeight: "100vh" }}>
      {/* Top Header Row */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            size="small"
            sx={{
              borderRadius: "8px",
              bgcolor: "white",
              minWidth: 140,
              fontWeight: 700,
              "& fieldset": { border: "1px solid #e2e8f0" },
            }}
          >
            <MenuItem value="Day">Today</MenuItem>
            <MenuItem value="Week">This Week</MenuItem>
            <MenuItem value="This Month">This Month</MenuItem>
            <MenuItem value="Year">This Year</MenuItem>
          </Select>
          <Button
            variant="contained"
            onClick={() => navigate("/report")}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              px: 3,
              fontWeight: 700,
              bgcolor: "#0047b3",
              boxShadow: "none",
            }}
          >
            Report Console
          </Button>
        </Stack>
      </Box>

      {/* Stats Row */}
      {loadingStats ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr 1fr",
              md: "repeat(3, 1fr)",
              lg: "repeat(5, 1fr)",
            },
            gap: 3,
            mb: 5,
          }}
        >
          <StatCard
            title="Total Residents"
            value={overview?.users?.byRole?.RESIDENT || 0}
            trendValue="+12"
            trend="this month"
            isPositive={true}
          />
          <StatCard
            title="Active Staff"
            value={overview?.staff?.active || 0}
            trendValue="+5"
            trend="this month"
            isPositive={true}
          />
          <StatCard
            title="Guests Roster"
            value={overview?.users?.byRole?.GUEST || 0}
            trendValue="-2%"
            trend="vs last week"
            isPositive={false}
          />
          <StatCard
            title="Bookings Today"
            value={overview?.bookings?.today || 0}
            trendValue="+18%"
            trend="vs yesterday"
            isPositive={true}
          />
          <StatCard
            title="Monthly Revenue"
            value={`₹${(overview?.revenue?.monthly || 0).toLocaleString("en-IN")}`}
            trendValue="+22%"
            trend="vs last month"
            isPositive={true}
          />
        </Box>
      )}

      {/* Main Content Area */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 380px" },
          gap: 4,
          alignItems: "stretch",
        }}
      >
        {/* Left Column: Charts */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Bookings Overview */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              border: "1px solid #f1f5f9",
              borderRadius: "12px",
              height: "400px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight="800"
              color="#091542"
              sx={{ mb: 4 }}
            >
              Bookings & Transactions ({filterType})
            </Typography>
            <Box sx={{ flexGrow: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={finalLineData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 600 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 600 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    name="All Transactions"
                    stroke="#0047b3"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "#0047b3",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="confirmed"
                    name="Successful"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "#10b981",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cancelled"
                    name="Failed"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "#f59e0b",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>

          {/* Facility Usage */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              border: "1px solid #f1f5f9",
              borderRadius: "12px",
              height: "400px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight="800"
              color="#091542"
              sx={{ mb: 4 }}
            >
              Facility Footfall Distribution
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                gap: 4,
                flexGrow: 1,
                minHeight: 0,
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  width: { xs: "100%", md: 280 },
                  position: "relative",
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={finalPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={105}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {finalPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h4" fontWeight="900" color="#091542">
                    {totalPieAccess}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="700"
                  >
                    FOOTFALL
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  flexGrow: 1,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                  width: "100%",
                }}
              >
                {finalPieData.map((item) => (
                  <Box
                    key={item.name}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1.5,
                      borderRadius: "8px",
                      bgcolor: "#f8fafc",
                      border: "1px solid #f1f5f9",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "2px",
                          bgcolor: item.color,
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          color: "#64748b",
                        }}
                        noWrap
                      >
                        {item.name}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: "0.9rem",
                        fontWeight: 900,
                        color: "#091542",
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Right Column: Sidebar (Upcoming Activities) */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              border: "1px solid #f1f5f9",
              borderRadius: "16px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight="800"
              color="#091542"
              sx={{ mb: 4 }}
            >
              Upcoming Activities
            </Typography>
            <Stack spacing={2} sx={{ flexGrow: 1, overflow: "hidden" }}>
              {activities.map((activity) => (
                <Box
                  key={activity.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 1.5,
                    borderRadius: "12px",
                    border: "1px solid transparent",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      bgcolor: "#f8fafc",
                      borderColor: "#f1f5f9",
                      boxShadow: "0 4px 12px rgba(9, 21, 66, 0.02)",
                    },
                  }}
                >
                  <Avatar
                    variant="rounded"
                    src={activity.image}
                    sx={{ width: 50, height: 50, borderRadius: "10px" }}
                  />
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      fontWeight="800"
                      color="#1e293b"
                      noWrap
                    >
                      {activity.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight="600"
                    >
                      {activity.date}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      borderRadius: "8px",
                      textTransform: "none",
                      fontWeight: 800,
                      fontSize: "0.75rem",
                      borderColor: "#e2e8f0",
                      color: "#0047b3",
                      minWidth: 60,
                      transition: "all 0.2s",
                      "&:hover": {
                        bgcolor: "#eff6ff",
                        borderColor: "#bfdbfe",
                      },
                    }}
                  >
                    Book
                  </Button>
                </Box>
              ))}
            </Stack>
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  borderRadius: "10px",
                  py: 1.5,
                  fontWeight: 800,
                  textTransform: "none",
                  bgcolor: "#0047b3",
                  color: "white",
                  boxShadow: "none",
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: "#003bb3",
                    boxShadow: "0 6px 16px rgba(0, 71, 179, 0.2)",
                  },
                }}
              >
                Open Schedule
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Operational & Financial Insights */}
      {isAdmin && (
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="subtitle1"
            fontWeight="800"
            color="#091542"
            sx={{ mb: 3 }}
          >
            Operational & Financial Insights
          </Typography>
          <Grid container spacing={4}>
            {/* User Demographics Card */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  border: "1px solid #f1f5f9",
                  borderRadius: "12px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ mb: 3 }}
                >
                  <PeopleIcon sx={{ color: "#0047b3" }} />
                  <Typography
                    variant="subtitle2"
                    fontWeight="800"
                    color="#091542"
                  >
                    User Demographics
                  </Typography>
                </Stack>
                <Stack
                  spacing={2.5}
                  sx={{ flexGrow: 1, justifyContent: "center" }}
                >
                  {roleSummaries.map((summary) => {
                    const activeRatio =
                      summary.total > 0
                        ? (summary.active / summary.total) * 100
                        : 0;
                    return (
                      <Box key={summary.role}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 0.75,
                          }}
                        >
                          <Typography
                            variant="body2"
                            fontWeight="800"
                            color="#1e293b"
                          >
                            {summary.role}
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight="900"
                            color="#091542"
                          >
                            {summary.total} Total
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={activeRatio}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: "#e2e8f0",
                            "& .MuiLinearProgress-bar": {
                              bgcolor:
                                summary.role === "RESIDENT"
                                  ? "#0047b3"
                                  : summary.role === "STAFF"
                                    ? "#10b981"
                                    : "#ff9800",
                              borderRadius: 3,
                            },
                          }}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mt: 0.5,
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontWeight="600"
                          >
                            {summary.active} Active
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontWeight="600"
                          >
                            {summary.pending} Pending
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              </Paper>
            </Grid>

            {/* Financial Distribution Card */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  border: "1px solid #f1f5f9",
                  borderRadius: "12px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <PaymentIcon sx={{ color: "#0047b3" }} />
                  <Typography
                    variant="subtitle2"
                    fontWeight="800"
                    color="#091542"
                  >
                    Financial Distribution
                  </Typography>
                </Stack>

                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    bgcolor: "#f8fafc",
                    borderRadius: "8px",
                    border: "1px solid #f1f5f9",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="700"
                    sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
                  >
                    Total Period Revenue
                  </Typography>
                  <Typography variant="h5" fontWeight="900" color="#0047b3">
                    ₹
                    {totalPaymentAmount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Typography>
                </Box>

                <Stack
                  spacing={2.5}
                  sx={{ flexGrow: 1, justifyContent: "center" }}
                >
                  {finalPaymentStats.map((pay) => {
                    const share =
                      totalPaymentAmount > 0
                        ? (pay.totalAmount / totalPaymentAmount) * 100
                        : 0;
                    return (
                      <Box key={pay.provider}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 0.75,
                          }}
                        >
                          <Typography
                            variant="body2"
                            fontWeight="800"
                            color="#1e293b"
                          >
                            {pay.provider}
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight="900"
                            color="#091542"
                          >
                            ₹
                            {(pay.totalAmount || 0).toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                            })}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={share}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: "#e2e8f0",
                            "& .MuiLinearProgress-bar": {
                              bgcolor:
                                pay.provider === "RAZORPAY"
                                  ? "#2196f3"
                                  : pay.provider === "WALLET"
                                    ? "#9c27b0"
                                    : "#4caf50",
                              borderRadius: 3,
                            },
                          }}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mt: 0.5,
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontWeight="600"
                          >
                            {share.toFixed(0)}% Share
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontWeight="600"
                          >
                            {pay.count} txns
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              </Paper>
            </Grid>

            {/* Staff Attendance Summary Card */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  border: "1px solid #f1f5f9",
                  borderRadius: "12px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ mb: 3 }}
                >
                  <CheckCircleIcon sx={{ color: "#0047b3" }} />
                  <Typography
                    variant="subtitle2"
                    fontWeight="800"
                    color="#091542"
                  >
                    Staff Attendance Summary
                  </Typography>
                </Stack>

                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      display: "inline-flex",
                      width: 70,
                      height: 70,
                    }}
                  >
                    <CircularProgress
                      variant="determinate"
                      value={attendanceRate}
                      size={70}
                      thickness={5}
                      sx={{
                        color:
                          attendanceRate >= 90
                            ? "#10b981"
                            : attendanceRate >= 75
                              ? "#ff9800"
                              : "#ef4444",
                      }}
                    />
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: "absolute",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        variant="body2"
                        component="div"
                        color="text.secondary"
                        fontWeight="800"
                      >
                        {attendanceRate}%
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight="800"
                      color="#1e293b"
                    >
                      Attendance Rate
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight="600"
                    >
                      Based on {totalAttendanceCount} total records
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                  <Grid size={{ xs: 6 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: "#eff6ff",
                        borderRadius: "8px",
                        textAlign: "center",
                        border: "1px solid #dbeafe",
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight="700"
                      >
                        PRESENT
                      </Typography>
                      <Typography variant="h6" fontWeight="900" color="#1e40af">
                        {presentCount}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: "#fef2f2",
                        borderRadius: "8px",
                        textAlign: "center",
                        border: "1px solid #fee2e2",
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight="700"
                      >
                        ABSENT
                      </Typography>
                      <Typography variant="h6" fontWeight="900" color="#991b1b">
                        {absentCount}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: "#fffbeb",
                        borderRadius: "8px",
                        textAlign: "center",
                        border: "1px solid #fef3c7",
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight="700"
                      >
                        LATE
                      </Typography>
                      <Typography variant="h6" fontWeight="900" color="#92400e">
                        {lateCount}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: "#f0fdf4",
                        borderRadius: "8px",
                        textAlign: "center",
                        border: "1px solid #dcfce7",
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight="700"
                      >
                        HALF DAY
                      </Typography>
                      <Typography variant="h6" fontWeight="900" color="#166534">
                        {halfDayCount}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Stretched System Logs (Full Width Bottom) */}
      <Box sx={{ mt: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            border: "1px solid #f1f5f9",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(9, 21, 66, 0.02)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <LogsIcon sx={{ color: "#0047b3" }} />
              <Typography variant="subtitle1" fontWeight="800" color="#091542">
                System Activity Logs (Recent)
              </Typography>
            </Stack>
            <Button
              size="small"
              onClick={() => navigate("/logs")}
              endIcon={<OpenInNewIcon fontSize="inherit" />}
              sx={{ fontWeight: 800, textTransform: "none", color: "#ef4444" }}
            >
              All Logs
            </Button>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
                xl: "1fr 1fr 1fr",
              },
              gap: 2.5,
            }}
          >
            {systemLogs.map((log) => (
              <LogItemLocal key={log.id} log={log} />
            ))}
          </Box>
        </Paper>
      </Box>

      {/* View All Logs Modal */}
      <Dialog
        open={logsOpen}
        onClose={() => setLogsOpen(false)}
        maxWidth="md"
        fullWidth
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: "blur(4px)",
              bgcolor: "rgba(9, 21, 66, 0.15)",
            },
          },
        }}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            p: 2,
            border: "1px solid #f1f5f9",
            boxShadow: "0 20px 40px rgba(9, 21, 66, 0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <LogsIcon sx={{ color: "#0047b3" }} />
            <Typography variant="h6" fontWeight="900" color="#091542">
              All System Logs
            </Typography>
          </Stack>
          <IconButton
            onClick={() => setLogsOpen(false)}
            sx={{ color: "#64748b" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack>
            {systemLogs.map((log) => (
              <LogItemLocal key={log.id} log={log} />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: "1px solid #f1f5f9" }}>
          <Button
            onClick={() => setLogsOpen(false)}
            variant="contained"
            sx={{
              borderRadius: "10px",
              fontWeight: 800,
              textTransform: "none",
              bgcolor: "#091542",
              color: "white",
              px: 3,
              "&:hover": { bgcolor: "#001a35" },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
