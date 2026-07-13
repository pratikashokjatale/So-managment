import {
  Box,
  Stack,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import StatCard from "./StatCard";
import AdminCharts from "./AdminCharts";
import DashboardSidebar from "./DashboardSidebar";
import OperationalInsights from "./OperationalInsights";
import SystemLogs from "./SystemLogs";

interface AdminDashboardProps {
  filterType: string;
  setFilterType: (val: string) => void;
  customFromDate: string;
  setCustomFromDate: (val: string) => void;
  customToDate: string;
  setCustomToDate: (val: string) => void;
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
  customFromDate,
  setCustomFromDate,
  customToDate,
  setCustomToDate,
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
    <Box sx={{ mt: 1, bgcolor: "#f8fafc", minHeight: "100vh" }}>
      {/* Top Header Row */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="center">
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            size="small"
            sx={{
              borderRadius: "8px",
              bgcolor: "white",
              minWidth: 130,
              fontWeight: 700,
              "& fieldset": { border: "1px solid #e2e8f0" },
            }}
          >
            <MenuItem value="Day">Today</MenuItem>
            <MenuItem value="Week">This Week</MenuItem>
            <MenuItem value="This Month">This Month</MenuItem>
            <MenuItem value="Year">This Year</MenuItem>
            <MenuItem value="Custom">Custom Range</MenuItem>
          </Select>

          {filterType === "Custom" && (
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                type="date"
                size="small"
                value={customFromDate}
                onChange={(e) => setCustomFromDate(e.target.value)}
                sx={{
                  width: 130,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    bgcolor: "white",
                    height: 38,
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  },
                }}
              />
              <Box sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#64748b" }}>to</Box>
              <TextField
                type="date"
                size="small"
                value={customToDate}
                onChange={(e) => setCustomToDate(e.target.value)}
                sx={{
                  width: 130,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    bgcolor: "white",
                    height: 38,
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  },
                }}
              />
            </Stack>
          )}

          <Button
            variant="contained"
            onClick={() => navigate("/report")}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              px: 2.5,
              fontWeight: 700,
              bgcolor: "#2c4d93",
              boxShadow: "none",
            }}
          >
            Report Console
          </Button>
        </Stack>
      </Box>

      {/* Stats Row */}
      {loadingStats ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
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
            gap: 2,
            mb: 3.5,
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
          gap: 2,
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
