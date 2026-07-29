import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Typography, Paper, Grid, Divider, Stack, CircularProgress } from "@mui/material";
import { getDashboardApi } from "@/apis/dashboard";
import {
  Apartment as ApartmentIcon,
  PeopleAlt as ResidentsIcon,
  AccountBalanceWallet as RevenueIcon,
  Block as BlockedIcon,
  Schedule as ClockIcon,
  Sensors as WifiIcon,
  WarningAmber as WarningIcon,
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
const INTER = "'Inter', sans-serif";
const SERIF = "'Playfair Display', serif";

// Mock data for the area chart
const accessData = [
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

export default function GetOverview() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId") || "all";
  
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = projectId !== "all" ? { projectId } : {};
        const res = await getDashboardApi(params);
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
  const totalResidents = overview?.users?.byRole?.RESIDENT || 0;
  const monthlyRevenue = overview?.revenue?.monthly || 0;
  const apartments = overview?.flats?.total || 600; // fallback as it's not in the payload
  const blockedCards = overview?.users?.inactiveBlockedCount ?? 0;

  const projectName = projectId && projectId !== "all" ? "Marbella Grand" : "All Projects";

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#ffffff", minHeight: "100vh", fontFamily: INTER }}>
      
      {/* ── Page Header ── */}
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontFamily: SERIF, fontSize: "2rem", fontWeight: 600, color: "#192038", mb: 0.5 }}>
          Overview
        </Typography>
        <Typography sx={{ fontFamily: INTER, fontSize: "0.875rem", color: "#64748b" }}>
          {projectName}
        </Typography>
      </Box>

      {/* ── Top 4 KPI Cards ── */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        
        {/* Apartments */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper elevation={0} sx={{ p: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "16px" }}>
              <ApartmentIcon sx={{ fontSize: 18, color: "#bca47c" }} />
              <Typography sx={{ fontFamily: INTER, fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.5px" }}>
                FLATS
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: SERIF, fontWeight: 600, fontSize: "2.4rem", color: "#192038", mb: "4px" }}>
              {loading ? <CircularProgress size={24} /> : apartments}
            </Typography>
            <Typography sx={{ fontFamily: INTER, fontSize: "0.85rem", color: "#64748b" }}>
              1 project
            </Typography>
          </Paper>
        </Grid>

        {/* Residents */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper elevation={0} sx={{ p: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "16px" }}>
              <ResidentsIcon sx={{ fontSize: 18, color: "#475569" }} />
              <Typography sx={{ fontFamily: INTER, fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.5px" }}>
                RESIDENTS
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: SERIF, fontWeight: 600, fontSize: "2.4rem", color: "#192038", mb: "4px" }}>
              {loading ? <CircularProgress size={24} /> : totalResidents.toLocaleString()}
            </Typography>
            <Typography sx={{ fontFamily: INTER, fontSize: "0.85rem", color: "#64748b" }}>
              active users
            </Typography>
          </Paper>
        </Grid>

        {/* Revenue */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper elevation={0} sx={{ p: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "16px" }}>
              <RevenueIcon sx={{ fontSize: 18, color: "#bca47c" }} />
              <Typography sx={{ fontFamily: INTER, fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.5px" }}>
                REVENUE / MO
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: SERIF, fontWeight: 600, fontSize: "2.4rem", color: "#192038", mb: "4px" }}>
              {loading ? <CircularProgress size={24} /> : `₹${(monthlyRevenue >= 100000 ? (monthlyRevenue / 100000).toFixed(1) + 'L' : monthlyRevenue.toLocaleString())}`}
            </Typography>
            <Typography sx={{ fontFamily: INTER, fontSize: "0.85rem", color: "#64748b" }}>
              +12% MoM
            </Typography>
          </Paper>
        </Grid>

        {/* Blocked Cards */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper elevation={0} sx={{ p: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "16px" }}>
              <BlockedIcon sx={{ fontSize: 18, color: "#ef4444" }} />
              <Typography sx={{ fontFamily: INTER, fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.5px" }}>
                BLOCKED CARDS
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: SERIF, fontWeight: 600, fontSize: "2.4rem", color: "#192038", mb: "4px" }}>
              {loading ? <CircularProgress size={24} /> : blockedCards}
            </Typography>
            <Typography sx={{ fontFamily: INTER, fontSize: "0.85rem", color: "#64748b" }}>
              in circulation
            </Typography>
          </Paper>
        </Grid>

      </Grid>

      {/* ── Bottom Section ── */}
      <Grid container spacing={3}>
        
        {/* Access events by hour Chart */}
        <Grid size={{ xs: 12, lg: 7, xl: 8 }}>
          <Paper elevation={0} sx={{ p: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", height: "100%" }}>
            <Typography sx={{ fontFamily: INTER, fontSize: "1.1rem", fontWeight: 600, color: "#192038", mb: 4 }}>
              Access events by hour
            </Typography>
            <Box sx={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <AreaChart data={accessData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#204a7b" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#204a7b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 13 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 13 }} ticks={[0, 150, 300, 450, 600]} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                  <Area type="monotone" dataKey="events" stroke="#204a7b" strokeWidth={3} fillOpacity={1} fill="url(#colorEvents)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Alerts List */}
        <Grid size={{ xs: 12, lg: 5, xl: 4 }}>
          <Paper elevation={0} sx={{ p: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", height: "100%" }}>
            <Typography sx={{ fontFamily: INTER, fontSize: "1.1rem", fontWeight: 600, color: "#192038", mb: 3 }}>
              Alerts
            </Typography>
            
            <Stack spacing={0} divider={<Divider sx={{ borderColor: "#f1f5f9" }} />}>
              <Box sx={{ py: 2, display: "flex", alignItems: "center", gap: 2 }}>
                <WarningIcon sx={{ color: "#ef4444", fontSize: 20 }} />
                <Typography sx={{ fontFamily: INTER, fontSize: "0.95rem", color: "#334155" }}>
                  1 blocked card(s)
                </Typography>
              </Box>

              <Box sx={{ py: 2, display: "flex", alignItems: "center", gap: 2 }}>
                <ClockIcon sx={{ color: "#bca47c", fontSize: 20 }} />
                <Typography sx={{ fontFamily: INTER, fontSize: "0.95rem", color: "#334155" }}>
                  1 membership expiring in 3 days
                </Typography>
              </Box>

              <Box sx={{ py: 2, display: "flex", alignItems: "center", gap: 2 }}>
                <RevenueIcon sx={{ color: "#204a7b", fontSize: 20 }} />
                <Typography sx={{ fontFamily: INTER, fontSize: "0.95rem", color: "#334155" }}>
                  Low wallet: 11 residents
                </Typography>
              </Box>

              <Box sx={{ py: 2, display: "flex", alignItems: "center", gap: 2 }}>
                <WifiIcon sx={{ color: "#bca47c", fontSize: 20 }} />
                <Typography sx={{ fontFamily: INTER, fontSize: "0.95rem", color: "#334155" }}>
                  Gate GRAND-04 synced 2m ago
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
}
