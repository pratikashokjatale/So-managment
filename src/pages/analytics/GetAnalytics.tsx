import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Grid,
} from "@mui/material";
import {
  TrendingUp as OccupancyIcon,
  People as MembersIcon,
  Sensors as AccessIcon,
  CardMembership as SubscriptionsIcon,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import toast from "react-hot-toast";

import {
  getAnalyticsOverviewApi,
  getAnalyticsBookingsByActivityApi,
  getAnalyticsRevenueByActivityApi,
  getAnalyticsAccessEventsApi,
} from "@/apis/analytics";
import type {
  BookingsByActivityItem,
  RevenueByActivityItem,
  AccessEventItem,
} from "@/apis/analytics";

const INTER = '"Inter", "Satoshi", sans-serif';
const SERIF = '"Playfair Display", "Cinzel", serif';

export default function GetAnalytics() {
  const [searchParams] = useSearchParams();
  const rawProjectId = searchParams.get("projectId") || "all";
  const projectId = rawProjectId === "all" ? "" : rawProjectId;

  // Analytics Data
  const [totals, setTotals] = useState<any>(null);
  const [bookingsData, setBookingsData] = useState<BookingsByActivityItem[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueByActivityItem[]>([]);
  const [accessEventsData, setAccessEventsData] = useState<AccessEventItem[]>([]);

  // Loading States
  const [loadingOverview, setLoadingOverview] = useState<boolean>(true);
  const [loadingBookings, setLoadingBookings] = useState<boolean>(true);
  const [loadingRevenue, setLoadingRevenue] = useState<boolean>(true);
  const [loadingAccessEvents, setLoadingAccessEvents] = useState<boolean>(true);

  // Fetch Overview/Totals
  const fetchOverview = async () => {
    setLoadingOverview(true);
    try {
      const res = (await getAnalyticsOverviewApi({
        projectId: projectId || undefined,
      })) as any;
      setTotals(res?.data?.totals || res?.totals || null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load overview analytics");
    } finally {
      setLoadingOverview(false);
    }
  };

  // Fetch Bookings By Activity
  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await getAnalyticsBookingsByActivityApi({
        projectId: projectId || undefined,
        limit: 10,
      });
      setBookingsData((res as any)?.data?.items || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingBookings(false);
    }
  };

  // Fetch Revenue By Activity
  const fetchRevenue = async () => {
    setLoadingRevenue(true);
    try {
      const res = await getAnalyticsRevenueByActivityApi({
        projectId: projectId || undefined,
        limit: 10,
      });
      setRevenueData((res as any)?.data?.items || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingRevenue(false);
    }
  };

  // Fetch Access Events
  const fetchAccessEvents = async () => {
    setLoadingAccessEvents(true);
    try {
      const res = await getAnalyticsAccessEventsApi({
        projectId: projectId || undefined,
        limit: 20,
      });
      setAccessEventsData((res as any)?.items || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingAccessEvents(false);
    }
  };

  // Trigger loading when project changes
  useEffect(() => {
    fetchOverview();
    fetchBookings();
    fetchRevenue();
    fetchAccessEvents();
  }, [projectId]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#ffffff", minHeight: "100vh", fontFamily: INTER }}>
      
      {/* ── Page Header ── */}
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontFamily: SERIF, fontSize: "2rem", fontWeight: 600, color: "#192038", mb: 0.5 }}>
          Analytics
        </Typography>
        <Typography sx={{ fontFamily: INTER, fontSize: "0.875rem", color: "#64748b" }}>
          Usage, revenue & demand insights
        </Typography>
      </Box>

      {/* ── AI Insight Card ── */}
      <Paper
        elevation={0}
        sx={{
          p: "16px 20px",
          mb: 4,
          borderRadius: "12px",
          border: "1px solid #e5dbba",
          bgcolor: "#f8fafc",
          display: "flex",
          gap: "12px",
          alignItems: "flex-start",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, marginTop: "2px" }}>
          <defs>
            <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d6b361" />
              <stop offset="100%" stopColor="#9a7122" />
            </linearGradient>
          </defs>
          <path d="M11 2L12.5 8L18.5 9.5L12.5 11L11 17L9.5 11L3.5 9.5L9.5 8L11 2Z" fill="none" stroke="url(#aiGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19 14L19.5 16.5L22 17L19.5 17.5L19 20L18.5 17.5L16 17L18.5 16.5L19 14Z" fill="none" stroke="url(#aiGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <Box>
          <Typography sx={{ 
            fontFamily: INTER, 
            fontWeight: 700, 
            fontSize: "0.95rem", 
            mb: "4px",
            background: "linear-gradient(90deg, #d6b361 0%, #9a7122 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "inline-block"
          }}>
            AI insight
          </Typography>
          <Typography sx={{ fontFamily: INTER, fontSize: "0.875rem", color: "#64748b", lineHeight: 1.5 }}>
            Demand peaks 6–9 PM. Home Theatre earns the most per booking; the Active Bundle drives the most sign-ups. Consider a second 8 PM theatre slot and an off-peak gym nudge to spread load.
          </Typography>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        
        {/* Bookings by activity */}
        <Grid size={12}>
          <Paper
            elevation={0}
            sx={{
              p: "20px 24px",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              bgcolor: "white",
              height: 340,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography sx={{ fontFamily: INTER, fontWeight: 700, fontSize: "0.95rem", color: "#1e293b", mb: "24px" }}>
              Bookings by activity
            </Typography>

            <Box sx={{ flexGrow: 1, minHeight: 0, position: "relative" }}>
              {loadingBookings ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                  <CircularProgress size={24} />
                </Box>
              ) : bookingsData.length === 0 ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                  <Typography sx={{ fontSize: "0.85rem", color: "#94a3b8" }}>No data</Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bookingsData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }} barCategoryGap="25%">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 400 }} />
                    <YAxis dataKey="facilityName" type="category" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 400 }} />
                    <Tooltip cursor={{ fill: "rgba(0,0,0,0.02)" }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                    <Bar dataKey="bookings" barSize={40} radius={[0, 6, 6, 0]}>
                      {bookingsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? "#bca47c" : "#204a7b"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Revenue by activity */}
        <Grid size={12}>
          <Paper
            elevation={0}
            sx={{
              p: "20px 24px",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              bgcolor: "white",
              height: 340,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography sx={{ fontFamily: INTER, fontWeight: 700, fontSize: "0.95rem", color: "#1e293b", mb: "24px" }}>
              Revenue by activity
            </Typography>

            <Box sx={{ flexGrow: 1, minHeight: 0, position: "relative" }}>
              {loadingRevenue ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                  <CircularProgress size={24} />
                </Box>
              ) : revenueData.length === 0 ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                  <Typography sx={{ fontSize: "0.85rem", color: "#94a3b8" }}>No data</Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }} barCategoryGap="25%">
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="facilityName" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 400 }} />
                    <YAxis tickFormatter={(val) => `${val >= 1000 ? (val / 1000) + 'k' : val}`} axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 400 }} />
                    <Tooltip cursor={{ fill: "rgba(0,0,0,0.02)" }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} formatter={(val: any) => [`₹${Number(val || 0).toLocaleString()}`, "v "]} />
                    <Bar dataKey="revenue" barSize={140} radius={[6, 6, 0, 0]}>
                      {revenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? "#bca47c" : "#204a7b"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* ── KPI Cards Bottom Row ── */}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {/* Occupancy */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper elevation={0} sx={{ p: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "16px" }}>
              <OccupancyIcon sx={{ fontSize: 16, color: "#bca47c" }} />
              <Typography sx={{ fontFamily: INTER, fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.5px" }}>
                OCCUPANCY
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: SERIF, fontWeight: 600, fontSize: "2.4rem", color: "#192038", mb: "4px" }}>
              {totals?.occupancyRate ?? 82}%
            </Typography>
            <Typography sx={{ fontFamily: INTER, fontSize: "0.85rem", color: "#64748b" }}>
              clubhouse peak
            </Typography>
          </Paper>
        </Grid>

        {/* Active Members */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper elevation={0} sx={{ p: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "16px" }}>
              <MembersIcon sx={{ fontSize: 16, color: "#475569" }} />
              <Typography sx={{ fontFamily: INTER, fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.5px" }}>
                ACTIVE MEMBERS
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: SERIF, fontWeight: 600, fontSize: "2.4rem", color: "#192038", mb: "4px" }}>
              {(totals?.activeMembers ?? 1142).toLocaleString()}
            </Typography>
            <Typography sx={{ fontFamily: INTER, fontSize: "0.85rem", color: "#64748b" }}>
              in scope
            </Typography>
          </Paper>
        </Grid>

        {/* Access Events */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper elevation={0} sx={{ p: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "16px" }}>
              <AccessIcon sx={{ fontSize: 16, color: "#bca47c" }} />
              <Typography sx={{ fontFamily: INTER, fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.5px" }}>
                ACCESS EVENTS
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: SERIF, fontWeight: 600, fontSize: "2.4rem", color: "#192038", mb: "4px" }}>
              {(totals?.accessEvents ?? 3410).toLocaleString()}
            </Typography>
            <Typography sx={{ fontFamily: INTER, fontSize: "0.85rem", color: "#64748b" }}>
              last 30 days
            </Typography>
          </Paper>
        </Grid>

        {/* Active Subscriptions */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper elevation={0} sx={{ p: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "16px" }}>
              <SubscriptionsIcon sx={{ fontSize: 16, color: "#ef4444" }} />
              <Typography sx={{ fontFamily: INTER, fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.5px" }}>
                ACTIVE SUBSCRIPTIONS
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: SERIF, fontWeight: 600, fontSize: "2.4rem", color: "#192038", mb: "4px" }}>
              {(totals?.activeSubscriptions ?? 0).toLocaleString()}
            </Typography>
            <Typography sx={{ fontFamily: INTER, fontSize: "0.85rem", color: "#64748b" }}>
              currently active
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
