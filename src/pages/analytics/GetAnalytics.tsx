import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
  IconButton,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import {
  TrendingUp as RevenueIcon,
  People as MembersIcon,
  CalendarMonth as BookingIcon,
  DoorBackSharp as AccessIcon,
  Business as ProjectIcon,
  Home as FlatIcon,
  Star as RateIcon,
  ArrowBackIosNew as PrevIcon,
  ArrowForwardIos as NextIcon,
  Refresh as RefreshIcon,
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
import { getProjectsApi } from "@/apis/project";

const COLORS = [
  "#0047b3",
  "#10b981",
  "#ea580c",
  "#db2777",
  "#7c3aed",
  "#06b6d4",
  "#eab308",
  "#3b82f6",
];

export default function GetAnalytics() {
  // Filters
  const [projectId, setProjectId] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  // Projects list for filter dropdown
  const [projects, setProjects] = useState<any[]>([]);

  // Analytics Data
  const [totals, setTotals] = useState<any>(null);
  const [bookingsData, setBookingsData] = useState<BookingsByActivityItem[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueByActivityItem[]>([]);
  const [accessEvents, setAccessEvents] = useState<AccessEventItem[]>([]);

  // Pagination for sub-components
  const [bookingsPage, setBookingsPage] = useState<number>(1);
  const [bookingsTotalPages, setBookingsTotalPages] = useState<number>(1);

  const [revenuePage, setRevenuePage] = useState<number>(1);
  const [revenueTotalPages, setRevenueTotalPages] = useState<number>(1);

  const [accessPage, setAccessPage] = useState<number>(1);
  const [accessTotalPages, setAccessTotalPages] = useState<number>(1);
  const limit = 5; // Rows/items per chart/table page

  // Loading States
  const [loadingOverview, setLoadingOverview] = useState<boolean>(true);
  const [loadingBookings, setLoadingBookings] = useState<boolean>(true);
  const [loadingRevenue, setLoadingRevenue] = useState<boolean>(true);
  const [loadingAccess, setLoadingAccess] = useState<boolean>(true);

  // Load projects list
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getProjectsApi({ limit: 100 });
        const list = res?.data?.data || res?.data?.projects || res?.projects || res?.data || [];
        setProjects(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Failed to fetch projects list:", err);
      }
    };
    fetchProjects();
  }, []);

  // Fetch Overview/Totals
  const fetchOverview = async () => {
    setLoadingOverview(true);
    try {
      const res = await getAnalyticsOverviewApi({
        projectId: projectId || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });
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
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        page: bookingsPage,
        limit,
      });
      setBookingsData(res?.items || []);
      // Calculate total pages (mocking pagination total if backend doesn't return count, otherwise default limit)
      setBookingsTotalPages(res?.items?.length < limit ? bookingsPage : bookingsPage + 1);
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
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        page: revenuePage,
        limit,
      });
      setRevenueData(res?.items || []);
      setRevenueTotalPages(res?.items?.length < limit ? revenuePage : revenuePage + 1);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingRevenue(false);
    }
  };

  // Fetch Access Events
  const fetchAccessEvents = async () => {
    setLoadingAccess(true);
    try {
      const res = await getAnalyticsAccessEventsApi({
        projectId: projectId || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        page: accessPage,
        limit: 10, // Larger page size for tables
      });
      setAccessEvents(res?.items || []);
      setAccessTotalPages(res?.items?.length < 10 ? accessPage : accessPage + 1);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingAccess(false);
    }
  };

  // Trigger loading when filters/pages change
  useEffect(() => {
    fetchOverview();
  }, [projectId, dateFrom, dateTo]);

  useEffect(() => {
    fetchBookings();
  }, [projectId, dateFrom, dateTo, bookingsPage]);

  useEffect(() => {
    fetchRevenue();
  }, [projectId, dateFrom, dateTo, revenuePage]);

  useEffect(() => {
    fetchAccessEvents();
  }, [projectId, dateFrom, dateTo, accessPage]);

  const handleResetFilters = () => {
    setProjectId("");
    setDateFrom("");
    setDateTo("");
    setBookingsPage(1);
    setRevenuePage(1);
    setAccessPage(1);
    toast.success("Filters reset successfully");
  };

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, bgcolor: "#f8fafc", minHeight: "100vh" }}>
      {/* Page Title & Refresh */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography
            variant="h3"
            fontWeight="900"
            color="#091542"
            sx={{ letterSpacing: "-1px" }}
          >
            Analytics Dashboard
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            fontWeight="700"
          >
            Deep usage analytics, revenue analysis & gate access auditing
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={() => {
              fetchOverview();
              fetchBookings();
              fetchRevenue();
              fetchAccessEvents();
              toast.success("Analytics refreshed");
            }}
            startIcon={<RefreshIcon />}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 800,
              bgcolor: "white",
              borderColor: "#e2e8f0",
              color: "#091542",
              "&:hover": {
                borderColor: "#cbd5e1",
                bgcolor: "#f1f5f9",
              },
            }}
          >
            Refresh
          </Button>
        </Stack>
      </Stack>

      {/* Filters Box */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: "20px",
          border: "1px solid #f1f5f9",
          bgcolor: "white",
          mb: 4,
          boxShadow: "0 4px 20px rgba(9, 21, 66, 0.01)",
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="caption" fontWeight="800" color="#64748b">
              PROJECT / CLUB SCOPE
            </Typography>
            <Select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              displayEmpty
              fullWidth
              size="small"
              sx={{
                mt: 0.5,
                borderRadius: "12px",
                bgcolor: "#f8fafc",
                "& fieldset": { borderColor: "#e2e8f0" },
              }}
            >
              <MenuItem value="">All Projects</MenuItem>
              {Array.isArray(projects) && projects.map((proj) => (
                <MenuItem key={proj.id} value={proj.id}>
                  {proj.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" fontWeight="800" color="#64748b">
              DATE FROM
            </Typography>
            <TextField
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{
                mt: 0.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  bgcolor: "#f8fafc",
                },
                "& fieldset": { borderColor: "#e2e8f0" },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" fontWeight="800" color="#64748b">
              DATE TO
            </Typography>
            <TextField
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{
                mt: 0.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  bgcolor: "#f8fafc",
                },
                "& fieldset": { borderColor: "#e2e8f0" },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Box sx={{ pt: 2 }}>
              <Button
                variant="text"
                onClick={handleResetFilters}
                sx={{
                  textTransform: "none",
                  fontWeight: 800,
                  color: "#64748b",
                  "&:hover": { color: "#091542" },
                }}
              >
                Reset Filters
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* KPI Cards Row */}
      {loadingOverview ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Projects */}
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card
              elevation={0}
              sx={{
                p: 2,
                borderRadius: "20px",
                border: "1px solid #f1f5f9",
                bgcolor: "white",
              }}
            >
              <CardContent sx={{ p: "16px !important" }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: "#eff6ff",
                      borderRadius: "12px",
                      color: "#1d4ed8",
                      display: "flex",
                    }}
                  >
                    <ProjectIcon />
                  </Box>
                  <Box>
                    <Typography variant="caption" fontWeight="800" color="#64748b">
                      TOTAL PROJECTS
                    </Typography>
                    <Typography variant="h5" fontWeight="900" color="#091542">
                      {totals?.projects ?? 0}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Flats */}
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card
              elevation={0}
              sx={{
                p: 2,
                borderRadius: "20px",
                border: "1px solid #f1f5f9",
                bgcolor: "white",
              }}
            >
              <CardContent sx={{ p: "16px !important" }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: "#f0fdf4",
                      borderRadius: "12px",
                      color: "#10b981",
                      display: "flex",
                    }}
                  >
                    <FlatIcon />
                  </Box>
                  <Box>
                    <Typography variant="caption" fontWeight="800" color="#64748b">
                      FLATS (OCCUPIED)
                    </Typography>
                    <Typography variant="h5" fontWeight="900" color="#091542">
                      {totals?.flats ?? 0} ({totals?.occupiedFlats ?? 0})
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Occupancy Rate */}
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card
              elevation={0}
              sx={{
                p: 2,
                borderRadius: "20px",
                border: "1px solid #f1f5f9",
                bgcolor: "white",
              }}
            >
              <CardContent sx={{ p: "16px !important" }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: "#faf5ff",
                      borderRadius: "12px",
                      color: "#7c3aed",
                      display: "flex",
                    }}
                  >
                    <RateIcon />
                  </Box>
                  <Box>
                    <Typography variant="caption" fontWeight="800" color="#64748b">
                      OCCUPANCY RATE
                    </Typography>
                    <Typography variant="h5" fontWeight="900" color="#091542">
                      {totals?.occupancyRate ?? 0}%
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Active Members */}
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card
              elevation={0}
              sx={{
                p: 2,
                borderRadius: "20px",
                border: "1px solid #f1f5f9",
                bgcolor: "white",
              }}
            >
              <CardContent sx={{ p: "16px !important" }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: "#fff7ed",
                      borderRadius: "12px",
                      color: "#ea580c",
                      display: "flex",
                    }}
                  >
                    <MembersIcon />
                  </Box>
                  <Box>
                    <Typography variant="caption" fontWeight="800" color="#64748b">
                      ACTIVE MEMBERS
                    </Typography>
                    <Typography variant="h5" fontWeight="900" color="#091542">
                      {totals?.activeMembers ?? 0}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Bookings */}
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card
              elevation={0}
              sx={{
                p: 2,
                borderRadius: "20px",
                border: "1px solid #f1f5f9",
                bgcolor: "white",
              }}
            >
              <CardContent sx={{ p: "16px !important" }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: "#fdf2f8",
                      borderRadius: "12px",
                      color: "#db2777",
                      display: "flex",
                    }}
                  >
                    <BookingIcon />
                  </Box>
                  <Box>
                    <Typography variant="caption" fontWeight="800" color="#64748b">
                      BOOKINGS
                    </Typography>
                    <Typography variant="h5" fontWeight="900" color="#091542">
                      {totals?.bookings ?? 0}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Active Subscriptions */}
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card
              elevation={0}
              sx={{
                p: 2,
                borderRadius: "20px",
                border: "1px solid #f1f5f9",
                bgcolor: "white",
              }}
            >
              <CardContent sx={{ p: "16px !important" }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: "#f0fdfa",
                      borderRadius: "12px",
                      color: "#0d9488",
                      display: "flex",
                    }}
                  >
                    <MembersIcon />
                  </Box>
                  <Box>
                    <Typography variant="caption" fontWeight="800" color="#64748b">
                      ACTIVE SUBSCRIPTIONS
                    </Typography>
                    <Typography variant="h5" fontWeight="900" color="#091542">
                      {totals?.activeSubscriptions ?? 0}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Revenue */}
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card
              elevation={0}
              sx={{
                p: 2,
                borderRadius: "20px",
                border: "1px solid #f1f5f9",
                bgcolor: "white",
              }}
            >
              <CardContent sx={{ p: "16px !important" }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: "#eff6ff",
                      borderRadius: "12px",
                      color: "#2563eb",
                      display: "flex",
                    }}
                  >
                    <RevenueIcon />
                  </Box>
                  <Box>
                    <Typography variant="caption" fontWeight="800" color="#64748b">
                      TOTAL REVENUE
                    </Typography>
                    <Typography variant="h5" fontWeight="900" color="#091542">
                      ₹{(totals?.revenue ?? 0).toLocaleString("en-IN")}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Access Events */}
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card
              elevation={0}
              sx={{
                p: 2,
                borderRadius: "20px",
                border: "1px solid #f1f5f9",
                bgcolor: "white",
              }}
            >
              <CardContent sx={{ p: "16px !important" }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: "#f8fafc",
                      borderRadius: "12px",
                      color: "#475569",
                      display: "flex",
                    }}
                  >
                    <AccessIcon />
                  </Box>
                  <Box>
                    <Typography variant="caption" fontWeight="800" color="#64748b">
                      ACCESS EVENTS
                    </Typography>
                    <Typography variant="h5" fontWeight="900" color="#091542">
                      {totals?.accessEvents ?? 0}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Charts Section */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        {/* Bookings By Activity */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: "20px",
              border: "1px solid #f1f5f9",
              bgcolor: "white",
              height: 480,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" fontWeight="900" color="#091542" sx={{ mb: 1 }}>
              Bookings by Activity
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 3, fontWeight: 700 }}>
              Shows number of bookings per clubhouse facility
            </Typography>

            <Box sx={{ flexGrow: 1, minHeight: 0, position: "relative" }}>
              {loadingBookings ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                  <CircularProgress />
                </Box>
              ) : bookingsData.length === 0 ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                  <Typography variant="body2" color="text.secondary">No booking activity recorded</Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bookingsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="facilityName" tick={{ fill: "#64748b", fontWeight: 700, fontSize: 11 }} />
                    <YAxis tick={{ fill: "#64748b", fontWeight: 700, fontSize: 11 }} />
                    <Tooltip cursor={{ fill: "rgba(0,0,0,0.02)" }} />
                    <Bar dataKey="bookings" radius={[8, 8, 0, 0]}>
                      {bookingsData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Box>

            <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: 2 }}>
              <IconButton
                size="small"
                onClick={() => setBookingsPage((p) => Math.max(1, p - 1))}
                disabled={bookingsPage === 1}
              >
                <PrevIcon fontSize="small" />
              </IconButton>
              <Typography variant="caption" sx={{ alignSelf: "center", fontWeight: 800, px: 1 }}>
                Page {bookingsPage}
              </Typography>
              <IconButton
                size="small"
                onClick={() => setBookingsPage((p) => p + 1)}
                disabled={bookingsData.length < limit}
              >
                <NextIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Paper>
        </Grid>

        {/* Revenue By Activity */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: "20px",
              border: "1px solid #f1f5f9",
              bgcolor: "white",
              height: 480,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" fontWeight="900" color="#091542" sx={{ mb: 1 }}>
              Revenue by Activity
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 3, fontWeight: 700 }}>
              Breakdown of total facility booking & subscription fees generated
            </Typography>

            <Box sx={{ flexGrow: 1, minHeight: 0, position: "relative" }}>
              {loadingRevenue ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                  <CircularProgress />
                </Box>
              ) : revenueData.length === 0 ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                  <Typography variant="body2" color="text.secondary">No revenue details recorded</Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="facilityName" tick={{ fill: "#64748b", fontWeight: 700, fontSize: 11 }} />
                    <YAxis tick={{ fill: "#64748b", fontWeight: 700, fontSize: 11 }} />
                    <Tooltip cursor={{ fill: "rgba(0,0,0,0.02)" }} />
                    <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
                      {revenueData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Box>

            <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: 2 }}>
              <IconButton
                size="small"
                onClick={() => setRevenuePage((p) => Math.max(1, p - 1))}
                disabled={revenuePage === 1}
              >
                <PrevIcon fontSize="small" />
              </IconButton>
              <Typography variant="caption" sx={{ alignSelf: "center", fontWeight: 800, px: 1 }}>
                Page {revenuePage}
              </Typography>
              <IconButton
                size="small"
                onClick={() => setRevenuePage((p) => p + 1)}
                disabled={revenueData.length < limit}
              >
                <NextIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Access Logs Table */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: "20px",
          border: "1px solid #f1f5f9",
          bgcolor: "white",
        }}
      >
        <Typography variant="h6" fontWeight="900" color="#091542" sx={{ mb: 1 }}>
          Clubhouse Gate Access Events
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 4, display: "block", fontWeight: 700 }}>
          Realtime gate entry logs showing system subscription and barcode validations
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: "#64748b", fontSize: "0.8rem" }}>ACCESS AT</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#64748b", fontSize: "0.8rem" }}>TYPE</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#64748b", fontSize: "0.8rem" }}>ZONE</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#64748b", fontSize: "0.8rem" }}>FACILITY</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#64748b", fontSize: "0.8rem" }}>USER / MEMBER</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#64748b", fontSize: "0.8rem" }}>ROLE</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#64748b", fontSize: "0.8rem" }}>CARD NUMBER</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingAccess ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : accessEvents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary">No access logs found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                accessEvents.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.85rem", color: "#091542" }}>
                      {new Date(log.accessAt).toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.85rem", color: "#475569" }}>
                      {log.accessType}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.85rem", color: "#475569" }}>
                      {log.accessZone}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.85rem", color: "#0047b3" }}>
                      {log.facilityName}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.85rem", color: "#091542" }}>
                      {log.userName}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.85rem", color: "#475569" }}>
                      {log.userRole}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.85rem", color: "#64748b" }}>
                      {log.cardNumber || "N/A"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: 3 }}>
          <IconButton
            size="small"
            onClick={() => setAccessPage((p) => Math.max(1, p - 1))}
            disabled={accessPage === 1}
          >
            <PrevIcon fontSize="small" />
          </IconButton>
          <Typography variant="caption" sx={{ alignSelf: "center", fontWeight: 800, px: 1 }}>
            Page {accessPage}
          </Typography>
          <IconButton
            size="small"
            onClick={() => setAccessPage((p) => p + 1)}
            disabled={accessEvents.length < 10}
          >
            <NextIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Paper>
    </Box>
  );
}
