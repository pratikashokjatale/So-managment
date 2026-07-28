import { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Grid, Stack, Chip, Button,
  Tabs, Tab, Select, MenuItem, TextField, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, CircularProgress
} from "@mui/material";
import {
  TrendingUp as RevenueIcon,
  People as TrafficIcon,
  NotificationsActive as AlertIcon,
  Download as ExportIcon,
  Bolt as AIIcon,
  InsertDriveFile as FileIcon
} from "@mui/icons-material";
import toast from "react-hot-toast";

import { getDashboardApi, getDashbordFacility } from "@/apis/dashboard";
import {
  getUsersReportApi,
  getBookingsReportApi,
  getPaymentsReportApi,
  getSubscriptionsReportApi,
  getStaffReportApi,
  getStaffAttendanceReportApi,
  getFacilityAccessReportApi,
  getEmergencyAlertsReportApi,
  getIssuesReportApi
} from "@/apis/reports";
import { getFacilitiesApi } from "@/apis/facility";
import { getUsersApi } from "@/apis/user";
import { getProjectsApi } from "@/apis/project";

export default function GetReport() {
  const [tabValue, setTabValue] = useState(0);

  // Dashboard Data State
  const [overview, setOverview] = useState<any>(null);
  const [facilityStats, setFacilityStats] = useState<any[]>([]);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  // Filter Data Source State
  const [facilities, setFacilities] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  // Report Export Form State
  const [reportType, setReportType] = useState("users");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [facilityFilter, setFacilityFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [generating, setGenerating] = useState(false);

  // Fetch Dashboard Data
  const loadDashboard = async () => {
    setLoadingDashboard(true);
    try {
      const ovRes = await getDashboardApi();
      setOverview(ovRes?.data || ovRes);

      const facRes = await getDashbordFacility();
      setFacilityStats(facRes?.data || facRes || []);
    } catch (err) {
      console.warn("Failed to fetch dashboard stats:", err);
    } finally {
      setLoadingDashboard(false);
    }
  };

  // Fetch filter items for dynamic dropdowns
  const loadFilterData = async () => {
    try {
      const facRes = await getFacilitiesApi({ limit: 100 });
      const facD = facRes?.data || facRes;
      const facList = facD?.items || facD?.facilities || (Array.isArray(facD) ? facD : []);
      setFacilities(facList);
    } catch (err) {
      console.warn("Failed to load facilities for filters:", err);
    }

    try {
      const usersRes = await getUsersApi({ limit: 100 });
      const usersD = usersRes?.data || usersRes;
      const usersList = usersD?.items || usersD?.users || (Array.isArray(usersD) ? usersD : []);
      setUsers(usersList);
    } catch (err) {
      console.warn("Failed to load users for filters:", err);
    }

    try {
      const projRes = await getProjectsApi({ limit: 100 });
      const projD = projRes?.data || projRes;
      const projList = projD?.items || projD?.projects || (Array.isArray(projD) ? projD : []);
      setProjects(projList);
    } catch (err) {
      console.warn("Failed to load projects for filters:", err);
    }
  };

  useEffect(() => {
    if (tabValue === 0) {
      loadDashboard();
    } else if (tabValue === 1) {
      loadFilterData();
    }
  }, [tabValue]);

  // Handle Report API selection and invocation
  const invokeReportApi = async (type: string, format: "json" | "excel") => {
    const commonParams: any = { format };
    if (fromDate) commonParams.fromDate = fromDate;
    if (toDate) commonParams.toDate = toDate;

    switch (type) {
      case "users":
        return getUsersReportApi({
          ...commonParams,
          ...(statusFilter !== "all" ? { status: statusFilter as any } : {}),
          ...(roleFilter !== "all" ? { role: roleFilter as any } : {})
        });
      case "bookings":
        return getBookingsReportApi({
          ...commonParams,
          ...(statusFilter !== "all" ? { bookingStatus: statusFilter as any } : {}),
          ...(paymentStatusFilter !== "all" ? { paymentStatus: paymentStatusFilter as any } : {}),
          ...(facilityFilter !== "all" ? { facilityId: facilityFilter } : {}),
          ...(userFilter !== "all" ? { userId: userFilter } : {})
        });
      case "payments":
        return getPaymentsReportApi({
          ...commonParams,
          ...(statusFilter !== "all" ? { paymentStatus: statusFilter as any } : {}),
          ...(userFilter !== "all" ? { userId: userFilter } : {})
        });
      case "subscriptions":
        return getSubscriptionsReportApi({
          ...commonParams,
          ...(statusFilter !== "all" ? { subscriptionStatus: statusFilter as any } : {}),
          ...(paymentStatusFilter !== "all" ? { paymentStatus: paymentStatusFilter as any } : {}),
          ...(facilityFilter !== "all" ? { facilityId: facilityFilter } : {}),
          ...(userFilter !== "all" ? { userId: userFilter } : {})
        });
      case "staff":
        return getStaffReportApi({
          ...commonParams,
          ...(statusFilter !== "all" ? { status: statusFilter as any } : {}),
          ...(projectFilter !== "all" ? { projectId: projectFilter } : {}),
          ...(facilityFilter !== "all" ? { facilityId: facilityFilter } : {})
        });
      case "staff-attendance":
        return getStaffAttendanceReportApi({
          ...commonParams,
          ...(statusFilter !== "all" ? { status: statusFilter as any } : {}),
          ...(userFilter !== "all" ? { staffId: userFilter } : {}),
          ...(facilityFilter !== "all" ? { facilityId: facilityFilter } : {})
        });
      case "facility-access":
        return getFacilityAccessReportApi({
          ...commonParams,
          ...(facilityFilter !== "all" ? { facilityId: facilityFilter } : {}),
          ...(userFilter !== "all" ? { userId: userFilter } : {})
        });
      case "emergency-alerts":
        return getEmergencyAlertsReportApi({
          ...commonParams,
          ...(statusFilter !== "all" ? { status: statusFilter as any } : {}),
          ...(userFilter !== "all" ? { userId: userFilter } : {}),
          ...(projectFilter !== "all" ? { projectId: projectFilter } : {})
        });
      case "issues":
        return getIssuesReportApi({
          ...commonParams,
          ...(statusFilter !== "all" ? { status: statusFilter as any } : {}),
          ...(userFilter !== "all" ? { userId: userFilter } : {})
        });
      default:
        throw new Error("Invalid report type selection");
    }
  };

  const handlePreview = async () => {
    setGenerating(true);
    setPreviewData(null);
    try {
      const res = await invokeReportApi(reportType, "json");
      const list = res?.data || res || [];
      setPreviewData(Array.isArray(list) ? list : []);
      toast.success("Report preview loaded!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to load preview");
    } finally {
      setGenerating(false);
    }
  };

  const handleExportExcel = async () => {
    setGenerating(true);
    try {
      const blob = await invokeReportApi(reportType, "excel");
      const filename = `${reportType}-report-${new Date().toISOString().split("T")[0]}.xlsx`;

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      toast.success("Excel report downloaded successfully!");
    } catch (err: any) {
      console.error("Download fail:", err);
      toast.error(err?.message || "Failed to export Excel report");
    } finally {
      setGenerating(false);
    }
  };

  const statCardSx = (color: string, delay: string = "0s") => ({
    p: 2.5,
    borderRadius: "16px",
    border: `1px solid ${color}20`,
    bgcolor: "white",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.02), 0 2px 4px rgba(0,0,0,0.02)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    animation: `fadeInUp 0.6s ease-out ${delay} forwards`,
    opacity: 0,
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: `0 12px 24px -8px ${color}40`,
      borderColor: `${color}40`
    }
  });

  const mainCardSx = {
    p: 3,
    borderRadius: "20px",
    border: "1px solid #f1f5f9",
    bgcolor: "white",
    boxShadow: "0 8px 32px rgba(9, 21, 66, 0.04)",
    animation: "fadeInUp 0.6s ease-out forwards",
    opacity: 0,
  };

  const selectSx = {
    height: 38,
    fontSize: "0.875rem",
    borderRadius: "10px",
    bgcolor: "#f8fafc",
    "& .MuiOutlinedInput-notchedOutline": { borderRadius: "10px", borderColor: "#e2e8f0" }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "#f8fafc", minHeight: "100vh" }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); transform: scale(1); }
          70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); transform: scale(1.05); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); transform: scale(1); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes progressFlow {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
      `}</style>

      {/* Header */}
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="start" sx={{ mb: 3 }} spacing={2}>
        <Box>
          <Typography variant="h5" fontWeight="900" color="#091542" sx={{ letterSpacing: "-1px" }}>
            AI Operational Insights
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight="700">
            Real-time occupancy auditing, predictive usage insights & report center
          </Typography>
        </Box>
      </Stack>

      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={(_, val) => setTabValue(val)}
        sx={{
          mb: 4,
          p: 0.5,
          bgcolor: "#e2e8f0",
          borderRadius: "14px",
          display: "inline-flex",
          minHeight: 48,
          "& .MuiTabs-indicator": {
            display: "none"
          },
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 800,
            fontSize: "0.95rem",
            color: "#64748b",
            borderRadius: "10px",
            zIndex: 1,
            minHeight: 40,
            py: 1,
            px: 3,
            transition: "all 0.2s ease-in-out",
            "&.Mui-selected": {
              color: "#091542",
              bgcolor: "white",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
            }
          }
        }}
      >
        <Tab label="Real-time Insights" />
        <Tab label="Report Center & Data Export" />
      </Tabs>

      {/* Real-time Insights Tab */}
      {tabValue === 0 && (
        <Box>
          {loadingDashboard ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {/* Monthly Revenue */}
              <Grid size={{ xs: 12, md: 3 }}>
                <Paper elevation={0} sx={statCardSx("#1d4ed8", "0.1s")}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Box sx={{ p: 1.2, bgcolor: "#eff6ff", borderRadius: "50%", color: "#1d4ed8", display: "flex" }}>
                      <RevenueIcon />
                    </Box>
                    <Typography variant="caption" fontWeight="900" color="#64748b">
                      MONTHLY REVENUE
                    </Typography>
                  </Stack>
                  <Typography variant="h5" fontWeight="900" color="#091542" sx={{ letterSpacing: "-0.5px" }}>
                    ₹{overview?.revenue?.monthly?.toLocaleString("en-IN") || "0.00"}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#10b981", fontWeight: 800 }}>
                    TOTAL REVENUE: ₹{overview?.revenue?.total?.toLocaleString("en-IN") || "0.00"}
                  </Typography>
                </Paper>
              </Grid>

              {/* Active Users */}
              <Grid size={{ xs: 12, md: 3 }}>
                <Paper elevation={0} sx={statCardSx("#10b981", "0.2s")}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Box sx={{ p: 1.2, bgcolor: "#f0fdf4", borderRadius: "50%", color: "#10b981", display: "flex" }}>
                      <TrafficIcon />
                    </Box>
                    <Typography variant="caption" fontWeight="900" color="#64748b">
                      ACTIVE USERS
                    </Typography>
                  </Stack>
                  <Typography variant="h5" fontWeight="900" color="#091542" sx={{ letterSpacing: "-0.5px" }}>
                    {overview?.users?.active || 0}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 800 }}>
                    TOTAL REGISTERED: {overview?.users?.total || 0}
                  </Typography>
                </Paper>
              </Grid>

              {/* Booking Statistics */}
              <Grid size={{ xs: 12, md: 3 }}>
                <Paper elevation={0} sx={statCardSx("#ea580c", "0.3s")}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Box sx={{ p: 1.2, bgcolor: "#fff7ed", borderRadius: "50%", color: "#ea580c", display: "flex" }}>
                      <FileIcon />
                    </Box>
                    <Typography variant="caption" fontWeight="900" color="#64748b">
                      TODAY'S BOOKINGS
                    </Typography>
                  </Stack>
                  <Typography variant="h5" fontWeight="900" color="#091542" sx={{ letterSpacing: "-0.5px" }}>
                    {overview?.bookings?.today || 0}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#ea580c", fontWeight: 800 }}>
                    PENDING APPROVAL: {overview?.bookings?.pendingApproval || 0}
                  </Typography>
                </Paper>
              </Grid>

              {/* Emergency Alerts */}
              <Grid size={{ xs: 12, md: 3 }}>
                <Paper elevation={0} sx={statCardSx("#ef4444", "0.4s")}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Box sx={{ p: 1.2, bgcolor: "#fef2f2", borderRadius: "50%", color: "#ef4444", display: "flex" }}>
                      <AlertIcon />
                    </Box>
                    <Typography variant="caption" fontWeight="900" color="#64748b">
                      SECURITY ALERTS
                    </Typography>
                  </Stack>
                  <Typography variant="h5" fontWeight="900" color="#ef4444" sx={{ letterSpacing: "-0.5px" }}>
                    {overview?.alerts?.emergency || 0}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#ef4444", fontWeight: 800 }}>
                    OPEN COMPLAINTS: {overview?.alerts?.openIssues || 0}
                  </Typography>
                </Paper>
              </Grid>

              {/* AI Recommendation Header Card */}
              <Grid size={12}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: "20px",
                    background: "linear-gradient(135deg, #091542 0%, #1e3a8a 40%, #3b82f6 100%)",
                    backgroundSize: "200% 200%",
                    color: "white",
                    boxShadow: "0 10px 30px -5px rgba(29, 78, 216, 0.3)",
                    position: "relative",
                    overflow: "hidden",
                    border: "none",
                    animation: "gradientShift 8s ease infinite, fadeInUp 0.6s ease-out 0.5s forwards",
                    opacity: 0,
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      background: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 60%)",
                      pointerEvents: "none"
                    }
                  }}
                >
                  <Box sx={{ p: 4, position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 2, background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(12px)" }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={{ p: 1.2, bgcolor: "rgba(255,255,255,0.15)", borderRadius: "50%", color: "white", display: "flex", animation: "pulseGlow 2s infinite" }}><AIIcon /></Box>
                      <Typography variant="caption" fontWeight="900" color="rgba(255,255,255,0.9)" sx={{ letterSpacing: 0.8 }}>AI OPERATIONAL SYSTEM SUGGESTION</Typography>
                    </Stack>
                    <Typography variant="h6" fontWeight="800" sx={{ mb: 1, fontSize: "1.1rem", lineHeight: 1.6, color: "white" }}>
                      Allocate additional housekeeping staff on weekends based on high confirmed booking counts. Average active wallet balance is ₹{Number(overview?.wallet?.averageBalance || 0).toLocaleString("en-IN")}.
                    </Typography>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 800, letterSpacing: 0.5, display: "inline-block", py: 0.5, px: 1.5, bgcolor: "rgba(0,0,0,0.2)", borderRadius: "8px", width: "fit-content" }}>DASHBOARD COMPILED REALTIME</Typography>
                  </Box>
                </Paper>
              </Grid>

              {/* Facility Usage Stats */}
              <Grid size={{ xs: 12, md: 8 }}>
                <Paper elevation={0} sx={{ ...mainCardSx, minHeight: 400 }}>
                  <Typography variant="h6" fontWeight="900" color="#091542" sx={{ mb: 4 }}>
                    Facility Capacity Load Status
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 3.5,
                      maxHeight: "280px",
                      overflowY: "auto",
                      pr: 1.5,
                      "&::-webkit-scrollbar": {
                        width: "6px",
                      },
                      "&::-webkit-scrollbar-track": {
                        background: "transparent",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: "#cbd5e1",
                        borderRadius: "10px",
                      },
                      "&::-webkit-scrollbar-thumb:hover": {
                        background: "#94a3b8",
                      },
                    }}
                  >
                    {facilityStats.map((fac) => {
                      const percentage = Math.min(100, Math.max(15, fac.totalAccess > 0 ? (fac.confirmedBookings / fac.totalAccess) * 100 : 35));
                      return (
                        <Box key={fac.id}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                            <Typography variant="caption" fontWeight="900" color="#475569">
                              {fac.name} ({fac.category})
                            </Typography>
                            <Typography variant="caption" fontWeight="900" color="#1d4ed8">
                              Total Accesses: {fac.totalAccess}
                            </Typography>
                          </Box>
                          <Box sx={{ height: 10, bgcolor: "#f1f5f9", borderRadius: "8px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
                            <Box sx={{ height: "100%", width: `${percentage}%`, background: "linear-gradient(90deg, #1d4ed8 0%, #60a5fa 50%, #1d4ed8 100%)", backgroundSize: "200% 100%", animation: "progressFlow 3s linear infinite", borderRadius: "8px" }} />
                          </Box>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block", fontWeight: 700 }}>
                            {fac.confirmedBookings} Bookings · {fac.activeSubscriptions} Active Subscriptions
                          </Typography>
                        </Box>
                      );
                    })}
                    {facilityStats.length === 0 && (
                      <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 8 }}>
                        No facility data available.
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>

              {/* Quick Demographics */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper elevation={0} sx={mainCardSx}>
                  <Typography variant="h6" fontWeight="900" color="#091542" sx={{ mb: 4 }}>
                    Resident Registry Summary
                  </Typography>
                  <Stack spacing={3}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="body2" fontWeight="800" color="#091542">Residents</Typography>
                      <Chip label={overview?.users?.byRole?.RESIDENT || 0} size="small" sx={{ fontWeight: 900, bgcolor: "#eff6ff", color: "#1d4ed8", borderRadius: "8px", px: 1 }} />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="body2" fontWeight="800" color="#091542">Guests</Typography>
                      <Chip label={overview?.users?.byRole?.GUEST || 0} size="small" sx={{ fontWeight: 900, bgcolor: "#fdf2f8", color: "#db2777", borderRadius: "8px", px: 1 }} />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="body2" fontWeight="800" color="#091542">Staff Crew</Typography>
                      <Chip label={overview?.users?.byRole?.STAFF || 0} size="small" sx={{ fontWeight: 900, bgcolor: "#f0fdf4", color: "#16a34a", borderRadius: "8px", px: 1 }} />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="body2" fontWeight="800" color="#091542">System Admins</Typography>
                      <Chip label={overview?.users?.byRole?.ADMIN || 0} size="small" sx={{ fontWeight: 900, bgcolor: "#faf5ff", color: "#7c3aed", borderRadius: "8px", px: 1 }} />
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          )}
        </Box>
      )}

      {/* Report Center & Data Export Tab */}
      {tabValue === 1 && (
        <Box>
          <Paper elevation={0} sx={{ ...mainCardSx, p: 3 }}>
            <Typography variant="h6" fontWeight="900" color="#091542" sx={{ mb: 1 }}>
              Data Export Console
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontWeight: 600 }}>
              Filter and extract database logs to JSON tables or formal Microsoft Excel spreadsheet formats
            </Typography>

            <Grid container spacing={2}>
              {/* Select Report Type */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="body2" fontWeight={800} color="#091542" sx={{ mb: 1 }}>
                  Select Category
                </Typography>
                <Select
                  value={reportType}
                  onChange={(e) => {
                    setReportType(e.target.value);
                    setStatusFilter("all");
                    setRoleFilter("all");
                    setFacilityFilter("all");
                    setUserFilter("all");
                    setProjectFilter("all");
                    setPaymentStatusFilter("all");
                    setPreviewData(null);
                  }}
                  fullWidth
                  sx={selectSx}
                >
                  <MenuItem value="users">User Profiles</MenuItem>
                  <MenuItem value="bookings">Facility Bookings</MenuItem>
                  <MenuItem value="payments">Financial Transactions</MenuItem>
                  <MenuItem value="subscriptions">User Subscriptions</MenuItem>
                  <MenuItem value="staff">Staff Roster</MenuItem>
                  <MenuItem value="staff-attendance">Staff Attendance Log</MenuItem>
                  <MenuItem value="facility-access">Facility Gate Access Log</MenuItem>
                  <MenuItem value="emergency-alerts">Emergency Alert History</MenuItem>
                  <MenuItem value="issues">Helpdesk Issues & Feedback</MenuItem>
                </Select>
              </Grid>

              {/* Status Filters */}
              {reportType !== "facility-access" && (
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="body2" fontWeight={800} color="#091542" sx={{ mb: 1 }}>
                    Status Filter
                  </Typography>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    fullWidth
                    sx={selectSx}
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    {reportType === "users" && [
                      <MenuItem key="act" value="ACTIVE">Active</MenuItem>,
                      <MenuItem key="pen" value="PENDING">Pending</MenuItem>,
                      <MenuItem key="sus" value="SUSPENDED">Suspended</MenuItem>,
                      <MenuItem key="ina" value="INACTIVE">Inactive</MenuItem>
                    ]}
                    {reportType === "bookings" && [
                      <MenuItem key="pe" value="PENDING_APPROVAL">Pending Approval</MenuItem>,
                      <MenuItem key="cf" value="CONFIRMED">Confirmed</MenuItem>,
                      <MenuItem key="rj" value="REJECTED">Rejected</MenuItem>,
                      <MenuItem key="cx" value="CANCELLED">Cancelled</MenuItem>,
                      <MenuItem key="in" value="CHECKED_IN">Checked In</MenuItem>,
                      <MenuItem key="co" value="COMPLETED">Completed</MenuItem>,
                      <MenuItem key="ns" value="NO_SHOW">No Show</MenuItem>
                    ]}
                    {reportType === "payments" && [
                      <MenuItem key="pe" value="PENDING">Pending</MenuItem>,
                      <MenuItem key="su" value="SUCCESS">Success</MenuItem>,
                      <MenuItem key="fa" value="FAILED">Failed</MenuItem>,
                      <MenuItem key="cx" value="CANCELLED">Cancelled</MenuItem>,
                      <MenuItem key="re" value="REFUNDED">Refunded</MenuItem>
                    ]}
                    {reportType === "subscriptions" && [
                      <MenuItem key="pp" value="PENDING_PAYMENT">Pending Payment</MenuItem>,
                      <MenuItem key="pe" value="PENDING_APPROVAL">Pending Approval</MenuItem>,
                      <MenuItem key="ac" value="ACTIVE">Active</MenuItem>,
                      <MenuItem key="ex" value="EXPIRED">Expired</MenuItem>,
                      <MenuItem key="ca" value="CANCELLED">Cancelled</MenuItem>,
                      <MenuItem key="rj" value="REJECTED">Rejected</MenuItem>
                    ]}
                    {reportType === "staff" && [
                      <MenuItem key="ac" value="ACTIVE">Active</MenuItem>,
                      <MenuItem key="in" value="INACTIVE">Inactive</MenuItem>,
                      <MenuItem key="ol" value="ON_LEAVE">On Leave</MenuItem>,
                      <MenuItem key="su" value="SUSPENDED">Suspended</MenuItem>,
                      <MenuItem key="te" value="TERMINATED">Terminated</MenuItem>
                    ]}
                    {reportType === "staff-attendance" && [
                      <MenuItem key="pr" value="PRESENT">Present</MenuItem>,
                      <MenuItem key="ab" value="ABSENT">Absent</MenuItem>,
                      <MenuItem key="la" value="LATE">Late</MenuItem>,
                      <MenuItem key="hd" value="HALF_DAY">Half Day</MenuItem>,
                      <MenuItem key="ol" value="ON_LEAVE">On Leave</MenuItem>
                    ]}
                    {reportType === "emergency-alerts" && [
                      <MenuItem key="op" value="OPEN">Open</MenuItem>,
                      <MenuItem key="ak" value="ACKNOWLEDGED">Acknowledged</MenuItem>,
                      <MenuItem key="rs" value="RESOLVED">Resolved</MenuItem>,
                      <MenuItem key="cx" value="CANCELLED">Cancelled</MenuItem>,
                      <MenuItem key="fa" value="FALSE_ALARM">False Alarm</MenuItem>
                    ]}
                    {reportType === "issues" && [
                      <MenuItem key="op" value="OPEN">Open</MenuItem>,
                      <MenuItem key="ip" value="IN_PROGRESS">In Progress</MenuItem>,
                      <MenuItem key="rs" value="RESOLVED">Resolved</MenuItem>,
                      <MenuItem key="cl" value="CLOSED">Closed</MenuItem>,
                      <MenuItem key="rj" value="REJECTED">Rejected</MenuItem>,
                      <MenuItem key="cx" value="CANCELLED">Cancelled</MenuItem>
                    ]}
                  </Select>
                </Grid>
              )}

              {/* Role filter (Users only) */}
              {reportType === "users" && (
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="body2" fontWeight={800} color="#091542" sx={{ mb: 1 }}>
                    Role Filter
                  </Typography>
                  <Select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    fullWidth
                    sx={selectSx}
                  >
                    <MenuItem value="all">All Roles</MenuItem>
                    <MenuItem value="RESIDENT">Resident</MenuItem>
                    <MenuItem value="GUEST">Guest</MenuItem>
                    <MenuItem value="STAFF">Staff</MenuItem>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                    <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>
                  </Select>
                </Grid>
              )}

              {/* Payment Status Filter (Bookings and Subscriptions only) */}
              {(reportType === "bookings" || reportType === "subscriptions") && (
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="body2" fontWeight={800} color="#091542" sx={{ mb: 1 }}>
                    Payment Status Filter
                  </Typography>
                  <Select
                    value={paymentStatusFilter}
                    onChange={(e) => setPaymentStatusFilter(e.target.value)}
                    fullWidth
                    sx={selectSx}
                  >
                    <MenuItem value="all">All Payment Statuses</MenuItem>
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="PAID">Paid / Success</MenuItem>
                    <MenuItem value="FAILED">Failed</MenuItem>
                    <MenuItem value="REFUNDED">Refunded</MenuItem>
                    {reportType === "bookings" && <MenuItem value="NOT_REQUIRED">Not Required</MenuItem>}
                  </Select>
                </Grid>
              )}

              {/* Facility Filter */}
              {(reportType === "bookings" || reportType === "subscriptions" || reportType === "staff" || reportType === "staff-attendance" || reportType === "facility-access") && (
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="body2" fontWeight={800} color="#091542" sx={{ mb: 1 }}>
                    Facility Filter
                  </Typography>
                  <Select
                    value={facilityFilter}
                    onChange={(e) => setFacilityFilter(e.target.value)}
                    fullWidth
                    sx={selectSx}
                  >
                    <MenuItem value="all">All Facilities</MenuItem>
                    {facilities.map((fac) => (
                      <MenuItem key={fac.id} value={fac.id}>
                        {fac.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              )}

              {/* User Filter */}
              {(reportType === "bookings" || reportType === "payments" || reportType === "subscriptions" || reportType === "staff-attendance" || reportType === "facility-access" || reportType === "emergency-alerts" || reportType === "issues") && (
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="body2" fontWeight={800} color="#091542" sx={{ mb: 1 }}>
                    {reportType === "staff-attendance" ? "Staff Member Filter" : "User Filter"}
                  </Typography>
                  <Select
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                    fullWidth
                    sx={selectSx}
                  >
                    <MenuItem value="all">
                      {reportType === "staff-attendance" ? "All Staff" : "All Users"}
                    </MenuItem>
                    {users
                      .filter((u) => reportType !== "staff-attendance" || u.role === "STAFF")
                      .map((u) => (
                        <MenuItem key={u.id} value={u.id}>
                          {u.name} ({u.email || u.phone})
                        </MenuItem>
                      ))}
                  </Select>
                </Grid>
              )}

              {/* Project Filter */}
              {(reportType === "staff" || reportType === "emergency-alerts") && (
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="body2" fontWeight={800} color="#091542" sx={{ mb: 1 }}>
                    Project Filter
                  </Typography>
                  <Select
                    value={projectFilter}
                    onChange={(e) => setProjectFilter(e.target.value)}
                    fullWidth
                    sx={selectSx}
                  >
                    <MenuItem value="all">All Projects</MenuItem>
                    {projects.map((proj) => (
                      <MenuItem key={proj.id} value={proj.id}>
                        {proj.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              )}

              {/* From Date */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="body2" fontWeight={800} color="#091542" sx={{ mb: 1 }}>
                  From Date
                </Typography>
                <TextField
                  type="date"
                  fullWidth
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", height: 38, bgcolor: "#f8fafc" } }}
                />
              </Grid>

              {/* To Date */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="body2" fontWeight={800} color="#091542" sx={{ mb: 1 }}>
                  To Date
                </Typography>
                <TextField
                  type="date"
                  fullWidth
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", height: 38, bgcolor: "#f8fafc" } }}
                />
              </Grid>
            </Grid>

            {/* Form Actions */}
            <Stack direction="row" spacing={2} sx={{ mt: 4, pt: 3, borderTop: "1px solid #f1f5f9" }}>
              <Button
                variant="outlined"
                onClick={handlePreview}
                disabled={generating}
                sx={{
                  borderRadius: "12px",
                  px: 4,
                  py: 1.5,
                  fontWeight: 900,
                  textTransform: "none",
                  color: "#091542",
                  borderColor: "#091542",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": { borderColor: "#001235", bgcolor: "#f1f5f9", transform: "scale(1.02)" }
                }}
              >
                {generating ? "Loading..." : "Preview Data"}
              </Button>
              <Button
                variant="contained"
                onClick={handleExportExcel}
                disabled={generating}
                startIcon={<ExportIcon />}
                sx={{
                  borderRadius: "12px",
                  px: 4,
                  py: 1.5,
                  fontWeight: 900,
                  textTransform: "none",
                  bgcolor: "#091542",
                  boxShadow: "none",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": { bgcolor: "#001a35", boxShadow: "0 8px 20px -6px rgba(9, 21, 66, 0.3)", transform: "scale(1.02)" }
                }}
              >
                {generating ? "Generating..." : "Download Excel Report"}
              </Button>
            </Stack>
          </Paper>

          {/* Preview Panel */}
          {previewData !== null && (
            <Paper elevation={0} sx={{ ...mainCardSx, mt: 3, p: 3 }}>
              <Typography variant="h6" fontWeight="900" color="#091542" sx={{ mb: 2 }}>
                Data Preview (Total Records: {previewData.length})
              </Typography>
              <TableContainer sx={{ maxHeight: 350, overflowY: "auto", border: "1px solid #f1f5f9", borderRadius: "12px" }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      {previewData.length > 0 ? (
                        Object.keys(previewData[0]).slice(0, 7).map((key) => (
                          <TableCell key={key} sx={{ fontWeight: 800, bgcolor: "#f8fafc", color: "#64748b", py: 1.25, borderBottom: "2px solid #f1f5f9" }}>
                            {key.toUpperCase()}
                          </TableCell>
                        ))
                      ) : (
                        <TableCell sx={{ fontWeight: 800 }}>No Columns</TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {previewData.map((row, index) => (
                      <TableRow key={index} hover sx={{ "&:nth-of-type(even)": { bgcolor: "#f8fafc" } }}>
                        {Object.values(row).slice(0, 7).map((val: any, idx) => (
                          <TableCell key={idx} sx={{ fontWeight: 600, color: "#1e293b", py: 1, borderBottom: "1px solid #f1f5f9" }}>
                            {typeof val === "boolean" ? (val ? "Yes" : "No") : (val?.toString() || "—")}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                    {previewData.length === 0 && (
                      <TableRow>
                        <TableCell align="center" sx={{ py: 3, fontWeight: 700, color: "text.secondary" }}>
                          No logs found matching selection filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Box>
      )}
    </Box>
  );
}
