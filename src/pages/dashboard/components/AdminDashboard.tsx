import {
  Box,
  Stack,
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";
import StatCard from "./StatCard";
import AdminCharts from "./AdminCharts";
import DashboardSidebar from "./DashboardSidebar";
import OperationalInsights from "./OperationalInsights";
import SystemLogs from "./SystemLogs";

interface AdminDashboardProps {
  filterType: string;
  setFilterType: (val: string) => void;
  navigate: (path: string) => void;
  loadingStats: boolean;
  overview: any;
  finalLineData: any[];
  finalPieData: any[];
  totalPieAccess: number;
  sidebarTab: number;
  setSidebarTab: (tab: number) => void;
  loadingSidebar: boolean;
  dbBookings: any[];
  dbFacilities: any[];
  isAdmin: boolean;
  user: any;
  handleBookClick: (facility: any) => void;
  roleSummaries: any[];
  totalPaymentAmount: number;
  finalPaymentStats: any[];
  attendanceRate: number;
  totalAttendanceCount: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  halfDayCount: number;
  logs: any[];
}

export default function AdminDashboard({
  filterType,
  setFilterType,
  navigate,
  loadingStats,
  overview,
  finalLineData,
  finalPieData,
  totalPieAccess,
  sidebarTab,
  setSidebarTab,
  loadingSidebar,
  dbBookings,
  dbFacilities,
  isAdmin,
  user,
  handleBookClick,
  roleSummaries,
  totalPaymentAmount,
  finalPaymentStats,
  attendanceRate,
  totalAttendanceCount,
  presentCount,
  absentCount,
  lateCount,
  halfDayCount,
  logs,
}: AdminDashboardProps) {
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
        <AdminCharts
          filterType={filterType}
          finalLineData={finalLineData}
          finalPieData={finalPieData}
          totalPieAccess={totalPieAccess}
        />

        {/* Right Column: Sidebar (Activities & Bookings) */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <DashboardSidebar
            sidebarTab={sidebarTab}
            setSidebarTab={setSidebarTab}
            loadingSidebar={loadingSidebar}
            dbBookings={dbBookings}
            dbFacilities={dbFacilities}
            isAdmin={isAdmin}
            user={user}
            handleBookClick={handleBookClick}
            navigate={navigate}
          />
        </Box>
      </Box>

      {/* Operational & Financial Insights */}
      {isAdmin && (
        <OperationalInsights
          roleSummaries={roleSummaries}
          totalPaymentAmount={totalPaymentAmount}
          finalPaymentStats={finalPaymentStats}
          attendanceRate={attendanceRate}
          totalAttendanceCount={totalAttendanceCount}
          presentCount={presentCount}
          absentCount={absentCount}
          lateCount={lateCount}
          halfDayCount={halfDayCount}
        />
      )}

      {/* Stretched System Logs (Full Width Bottom) */}
      <SystemLogs logs={logs} navigate={navigate} />
    </Box>
  );
}
