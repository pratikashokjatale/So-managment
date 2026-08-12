import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import CRMDashboard from "@/pages/dashboard/components/CRMDashboard";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Stack,
  CircularProgress,
} from "@mui/material";
import { getAnalyticsOverviewApi } from "@/apis/analytics";
import {
  Apartment as ApartmentIcon,
  PeopleAlt as ResidentsIcon,
  AccountBalanceWallet as RevenueIcon,
  Block as BlockedIcon,
  ScheduleOutlined as ClockIcon,
  SensorsOutlined as WifiIcon,
  GppMaybeOutlined as ShieldWarningIcon,
  AccountBalanceWalletOutlined as WalletAlertIcon,
} from "@mui/icons-material";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Typography constants
const INTER = "'Inter', system-ui, sans-serif";
const SERIF = "'Cormorant Garamond', Georgia, serif";

// Mock data for the area chart (fallback)
const fallbackAccessData = [
  { time: "6a", events: 50 },
  { time: "8a", events: 120 },
  { time: "10a", events: 90 },
  { time: "12p", events: 70 },
  { time: "2p", events: 80 },
  { time: "4p", events: 140 },
  { time: "6p", events: 320 },
  { time: "8p", events: 400 },
  { time: "10p", events: 180 },
];

const formatHour = (hour: number) => {
  if (hour === 0) return "12a";
  if (hour < 12) return `${hour}a`;
  if (hour === 12) return "12p";
  return `${hour - 12}p`;
};

export default function GetOverview() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId") || "all";
  const { user } = useAuth();

  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  if (user?.role === "CRM") {
    return <CRMDashboard user={user} />;
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = projectId !== "all" ? { projectId } : {};
        const res = await getAnalyticsOverviewApi(params);
        setOverview(res?.data || res);
      } catch (err) {
        console.warn("Failed to fetch overview stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  // Derived metrics from API
  const totalResidents = overview?.totals?.activeMembers || 0;
  const monthlyRevenue = overview?.totals?.revenue || 0;
  const apartments = overview?.totals?.flats || 0;
  const blockedCards = overview?.totals?.inactiveBlockedCount ?? 0;

  const chartData =
    overview?.daily?.accessEventsByHour?.map((item: any) => ({
      time: formatHour(item.hour),
      events: item.count,
    })) || fallbackAccessData;

  const projectName =
    projectId && projectId !== "all"
      ? "Marbella Grand"
      : "All Projects · combined";

  const getAlertIcon = (key: string, severity: string) => {
    if (key === "blocked_cards") return <ShieldWarningIcon sx={{ color: "#c25e40", fontSize: 22 }} />;
    if (key === "membership_expiring_3_days") return <ClockIcon sx={{ color: "#bca47c", fontSize: 22 }} />;
    if (key === "low_wallet") return <WalletAlertIcon sx={{ color: "#204a7b", fontSize: 22 }} />;
    if (key === "active_rfid_devices") return <WifiIcon sx={{ color: "#bca47c", fontSize: 22 }} />;
    
    if (severity === "WARNING") return <ShieldWarningIcon sx={{ color: "#c25e40", fontSize: 22 }} />;
    return <ClockIcon sx={{ color: "#bca47c", fontSize: 22 }} />;
  };

  const renderAlertText = (alert: any) => {
    if (alert.key === "blocked_cards") return `${alert.count} blocked card(s)`;
    if (alert.key === "membership_expiring_3_days") return `${alert.count} membership expiring in 3 days`;
    if (alert.key === "low_wallet") return `Low wallet: ${alert.count} residents`;
    if (alert.label.includes(alert.count.toString())) return alert.label;
    return `${alert.label}: ${alert.count}`;
  };

  const renderAlerts = () => {
    const allAlerts = overview?.alerts || [];

    if (allAlerts.length === 0) {
      // Show mock alerts during loading or if none, but since user said "dont change in ui",
      // maybe they want the original look exactly if no alerts. But real data is better.
      if (!overview) return null; // let it be empty while loading
      return (
        <Typography
          sx={{
            py: 2,
            fontFamily: INTER,
            fontSize: "0.95rem",
            color: "#94a3b8",
            textAlign: "center",
          }}
        >
          No active alerts
        </Typography>
      );
    }

    return allAlerts.map((alert: any) => (
      <Box
        key={alert.key}
        sx={{ py: 2, display: "flex", alignItems: "center", gap: 2 }}
      >
        {getAlertIcon(alert.key, alert.severity)}
        <Typography
          sx={{ fontFamily: INTER, fontSize: "0.95rem", color: "#334155" }}
        >
          {renderAlertText(alert)}
        </Typography>
      </Box>
    ));
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        bgcolor: "#ffffff",
        minHeight: "100vh",
        fontFamily: INTER,
      }}
    >
      {/* ── Page Header ── */}
      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{
            fontFamily: SERIF,
            fontSize: "2rem",
            fontWeight: 600,
            color: "#192038",
            mb: 0.5,
          }}
        >
          Overview
        </Typography>
        <Typography
          sx={{ fontFamily: INTER, fontSize: "0.875rem", color: "#64748b" }}
        >
          {projectName}
        </Typography>
      </Box>

      {/* ── Top 4 KPI Cards ── */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Apartments */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: "24px",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                mb: "16px",
              }}
            >
              <ApartmentIcon sx={{ fontSize: 18, color: "#bca47c" }} />
              <Typography
                sx={{
                  fontFamily: INTER,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#94a3b8",
                  letterSpacing: "0.5px",
                }}
              >
                FLATS
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: SERIF,
                fontWeight: 600,
                fontSize: "2.4rem",
                color: "#192038",
                mb: "4px",
              }}
            >
              {loading ? <CircularProgress size={24} /> : apartments}
            </Typography>
            <Typography
              sx={{ fontFamily: INTER, fontSize: "0.85rem", color: "#64748b" }}
            >
              {overview?.totals?.projects || 1} project
              {(overview?.totals?.projects || 1) !== 1 ? "s" : ""}
            </Typography>
          </Paper>
        </Grid>

        {/* Residents */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: "24px",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                mb: "16px",
              }}
            >
              <ResidentsIcon sx={{ fontSize: 18, color: "#475569" }} />
              <Typography
                sx={{
                  fontFamily: INTER,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#94a3b8",
                  letterSpacing: "0.5px",
                }}
              >
                RESIDENTS
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: SERIF,
                fontWeight: 600,
                fontSize: "2.4rem",
                color: "#192038",
                mb: "4px",
              }}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                totalResidents.toLocaleString()
              )}
            </Typography>
            <Typography
              sx={{ fontFamily: INTER, fontSize: "0.85rem", color: "#64748b" }}
            >
              active users
            </Typography>
          </Paper>
        </Grid>

        {/* Revenue */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: "24px",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                mb: "16px",
              }}
            >
              <RevenueIcon sx={{ fontSize: 18, color: "#bca47c" }} />
              <Typography
                sx={{
                  fontFamily: INTER,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#94a3b8",
                  letterSpacing: "0.5px",
                }}
              >
                REVENUE / MO
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: SERIF,
                fontWeight: 600,
                fontSize: "2.4rem",
                color: "#192038",
                mb: "4px",
              }}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                `₹${monthlyRevenue >= 100000 ? (monthlyRevenue / 100000).toFixed(1) + "L" : monthlyRevenue.toLocaleString()}`
              )}
            </Typography>
            <Typography
              sx={{ fontFamily: INTER, fontSize: "0.85rem", color: "#64748b" }}
            >
              +12% MoM
            </Typography>
          </Paper>
        </Grid>

        {/* Blocked Cards */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: "24px",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                mb: "16px",
              }}
            >
              <BlockedIcon sx={{ fontSize: 18, color: "#ef4444" }} />
              <Typography
                sx={{
                  fontFamily: INTER,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#94a3b8",
                  letterSpacing: "0.5px",
                }}
              >
                BLOCKED CARDS
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: SERIF,
                fontWeight: 600,
                fontSize: "2.4rem",
                color: "#192038",
                mb: "4px",
              }}
            >
              {loading ? <CircularProgress size={24} /> : blockedCards}
            </Typography>
            <Typography
              sx={{ fontFamily: INTER, fontSize: "0.85rem", color: "#64748b" }}
                >              in circulation
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* ── Individual Projects (Only shown when 'All Projects' is selected) ── */}
      {projectId === "all" && overview?.projects && overview.projects.length > 0 && (
        <Box sx={{ mb: 4 }}>
          {overview.projects.map((project: any) => (
            <Paper 
              key={project.projectId} 
              elevation={0} 
              sx={{ 
                bgcolor: "#f8fafc", 
                border: "1px solid #e2e8f0", 
                borderRadius: "16px", 
                p: "20px", 
                mb: 3 
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, px: 1 }}>
                <Typography sx={{ fontFamily: SERIF, fontSize: "1.2rem", fontWeight: 600, color: "#192038" }}>
                  {project.projectName}
                </Typography>
                {project.projectName.includes("Twin") && (
                  <Typography sx={{ fontFamily: INTER, fontSize: "0.75rem", color: "#94a3b8" }}>
                    sample
                  </Typography>
                )}
              </Box>
              <Box 
                sx={{ 
                  bgcolor: "#ffffff", 
                  borderRadius: "12px", 
                  p: "16px 24px",
                  display: "flex",
                  boxShadow: "0px 1px 2px rgba(0,0,0,0.02)"
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontFamily: INTER, fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.5px", mb: 0.5, textTransform: "uppercase" }}>APTS</Typography>
                  <Typography sx={{ fontFamily: INTER, fontSize: "1.1rem", fontWeight: 700, color: "#192038" }}>{project.flats}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontFamily: INTER, fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.5px", mb: 0.5, textTransform: "uppercase" }}>ACTIVE</Typography>
                  <Typography sx={{ fontFamily: INTER, fontSize: "1.1rem", fontWeight: 700, color: "#192038" }}>{project.activeMembers}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontFamily: INTER, fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.5px", mb: 0.5, textTransform: "uppercase" }}>REV</Typography>
                  <Typography sx={{ fontFamily: INTER, fontSize: "1.1rem", fontWeight: 700, color: "#192038" }}>
                    ₹{(project.revenue >= 100000 ? (project.revenue / 100000).toFixed(1) + 'L' : (project.revenue || 0).toLocaleString())}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {/* ── Bottom Section ── */}
      <Grid container spacing={3}>
        {/* Access events by hour Chart */}
        <Grid size={{ xs: 12, lg: 7, xl: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: "24px",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              height: "100%",
            }}
          >
            <Typography
              sx={{
                fontFamily: INTER,
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "#192038",
                mb: 4,
              }}
            >
              Access events by hour
            </Typography>
            <Box sx={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorEvents"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#204a7b"
                        stopOpacity={0.15}
                      />
                      <stop offset="95%" stopColor="#204a7b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="4 4"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 13 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 13 }}
                    ticks={[0, 150, 300, 450, 600]}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="events"
                    stroke="#204a7b"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorEvents)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Alerts List */}
        <Grid size={{ xs: 12, lg: 5, xl: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: "24px",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              height: "100%",
            }}
          >
            <Typography
              sx={{
                fontFamily: INTER,
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "#192038",
                mb: 3,
              }}
            >
              Alerts
            </Typography>

            <Stack
              spacing={0}
              divider={<Divider sx={{ borderColor: "#f1f5f9" }} />}
            >
              {loading ? (
                <Box sx={{ py: 4, display: "flex", justifyContent: "center" }}>
                  <CircularProgress size={30} />
                </Box>
              ) : (
                renderAlerts()
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
