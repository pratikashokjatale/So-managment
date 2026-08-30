import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDashboardApi,
  getDashbordRevenue,
  getDashbordFacility,
  getUserDemographicsApi,
  getPaymentMethodsStatsApi,
  getStaffAttendanceStatsApi,
} from "@/apis/dashboard";
import { getStaffAttendanceStatsApi as getActivityLogsApi } from "@/apis/logdasboard";
import { getFacilitiesApi } from "@/apis/facility";
import { getBookingsApi } from "@/apis/booking";
import { getMyQrApi } from "@/apis/user";
import { useAuth } from "@/contexts/AuthContext";
import CreateBookingDialog from "@/pages/residents/components/CreateBookingDialog";

import AdminDashboard from "./dashboard/components/AdminDashboard";
import ResidentDashboard from "./dashboard/components/ResidentDashboard";
import CRMDashboard from "./dashboard/components/crm-dashboard/CRMDashboard";

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
  { name: "Gym", value: 40, color: "#24528Cff" },
  { name: "Swimming Pool", value: 25, color: "#24528C" },
  { name: "Tennis Court", value: 20, color: "#4caf50" },
  { name: "Badminton Court", value: 10, color: "#ff9800" },
  { name: "Others", value: 5, color: "#9e9e9e" },
];

const systemLogs = [
  { id: 1, event: "New Resident Added", user: "Admin", time: "2 mins ago", type: "Success" },
  { id: 2, event: "Facility Booking Cancelled", user: "Resident", time: "15 mins ago", type: "Warning" },
  { id: 3, event: "Maintenance Alert Sent", user: "System", time: "1 hour ago", type: "Info" },
  { id: 4, event: "Payment Received: ₹1,500", user: "Admin", time: "2 hours ago", type: "Success" },
  { id: 5, event: "Staff Login Failure", user: "System", time: "3 hours ago", type: "Error" },
  { id: 6, event: "Guest Entry Recorded", user: "Security", time: "4 hours ago", type: "Success" },
];

function formatTimeAgo(date: Date) {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const mapBackendLog = (backendLog: any) => {
  const event =
    backendLog.event ||
    backendLog.action ||
    backendLog.activity ||
    backendLog.details ||
    "Activity Event";

  let user = "System";
  if (backendLog.actor && typeof backendLog.actor === "object") {
    user = backendLog.actor.name || backendLog.actor.username || "User";
  } else if (backendLog.user && typeof backendLog.user === "object") {
    user = backendLog.user.name || backendLog.user.username || "User";
  } else if (typeof backendLog.user === "string") {
    user = backendLog.user;
  } else if (typeof backendLog.actorUser === "object" && backendLog.actorUser) {
    user = backendLog.actorUser.name || "User";
  } else if (backendLog.actorUserId) {
    user = `User (${backendLog.actorUserId.substring(0, 8)})`;
  } else if (backendLog.userId) {
    user = `User (${backendLog.userId.substring(0, 8)})`;
  }

  let time = "Just now";
  const timestampStr =
    backendLog.createdAt || backendLog.timestamp || backendLog.time;
  if (timestampStr) {
    const date = new Date(timestampStr);
    if (!isNaN(date.getTime())) {
      time = formatTimeAgo(date);
    }
  }

  let type = "Info";
  const status = backendLog.status || backendLog.type;
  if (status) {
    const s = String(status).toLowerCase();
    if (s.includes("success") || s === "active" || s === "present") {
      type = "Success";
    } else if (
      s.includes("fail") ||
      s.includes("error") ||
      s === "alert" ||
      s === "denied"
    ) {
      type = "Error";
    } else if (s.includes("warn") || s === "warning" || s === "late") {
      type = "Warning";
    } else {
      type = "Info";
    }
  }

  return {
    id: backendLog.id || Math.random(),
    event,
    user,
    time,
    type,
  };
};

const getLogsList = (raw: any) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  const d = raw?.data ?? raw;
  if (Array.isArray(d)) return d;
  if (d?.items && Array.isArray(d.items)) return d.items;
  if (d?.data && Array.isArray(d.data)) return d.data;
  if (d?.logs && Array.isArray(d.logs)) return d.logs;
  if (d?.results && Array.isArray(d.results)) return d.results;
  return [];
};

const fallbackDemographics = [
  { role: "RESIDENT", count: 115, status: "ACTIVE", active30Days: 90, active7Days: 45 },
  { role: "GUEST", count: 30, status: "ACTIVE", active30Days: 20, active7Days: 10 },
  { role: "STAFF", count: 50, status: "ACTIVE", active30Days: 45, active7Days: 30 },
  { role: "ADMIN", count: 5, status: "ACTIVE", active30Days: 5, active7Days: 5 },
];

const fallbackPaymentStats = [
  { provider: "RAZORPAY", count: 150, totalAmount: 75000.5, averageAmount: 500.0 },
  { provider: "WALLET", count: 80, totalAmount: 40000.25, averageAmount: 500.0 },
  { provider: "MANUAL", count: 20, totalAmount: 10000.0, averageAmount: 500.0 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();
  const [filterType, setFilterType] = useState("This Month");
  const [customFromDate, setCustomFromDate] = useState("");
  const [customToDate, setCustomToDate] = useState("");
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);

  // Default custom range dates
  useEffect(() => {
    if (filterType === "Custom" && !customFromDate && !customToDate) {
      const today = new Date();
      const last30 = new Date();
      last30.setDate(today.getDate() - 30);
      setCustomFromDate(last30.toISOString().split("T")[0]);
      setCustomToDate(today.toISOString().split("T")[0]);
    }
  }, [filterType, customFromDate, customToDate]);

  // Admin Dashboard Statistics State
  const [overview, setOverview] = useState<any>(null);
  const [revenueTrends, setRevenueTrends] = useState<any[]>([]);
  const [facilityStats, setFacilityStats] = useState<any[]>([]);
  const [demographics, setDemographics] = useState<any[]>([]);
  const [paymentStats, setPaymentStats] = useState<any[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [logs, setLogs] = useState<any[]>(systemLogs);

  // Dynamic Facilities & Bookings state
  const [dbFacilities, setDbFacilities] = useState<any[]>([]);
  const [dbBookings, setDbBookings] = useState<any[]>([]);
  const [loadingSidebar, setLoadingSidebar] = useState(false);
  const [sidebarTab, setSidebarTab] = useState(0); // 0 = Upcoming Bookings, 1 = Available Facilities
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedFacilityForBooking, setSelectedFacilityForBooking] = useState<any>(null);

  const fetchSidebarData = async () => {
    setLoadingSidebar(true);
    try {
      const facRes = await getFacilitiesApi({ limit: 10, isActive: true });
      const facD = facRes?.data || facRes;
      const facList = facD?.items || facD?.facilities || (Array.isArray(facD) ? facD : []);
      setDbFacilities(facList);

      const bookingParams: any = { limit: 10 };
      if (!isAdmin && user?.id) {
        bookingParams.userId = user.id;
      }
      const bookRes = await getBookingsApi(bookingParams);
      const bookD = bookRes?.data || bookRes;
      const bookList = bookD?.items || bookD?.bookings || (Array.isArray(bookD) ? bookD : []);
      setDbBookings(bookList);
    } catch (err) {
      console.warn("Failed to fetch sidebar facilities or bookings:", err);
    } finally {
      setLoadingSidebar(false);
    }
  };

  useEffect(() => {
    fetchSidebarData();
  }, [isAdmin, user?.id]);

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
          const params: any = {};
          if (filterType === "Day") {
            params.days = 2;
          } else if (filterType === "Week") {
            params.days = 7;
          } else if (filterType === "This Month") {
            params.days = 30;
          } else if (filterType === "Year") {
            params.days = 365;
          } else if (filterType === "Custom") {
            if (customFromDate) params.fromDate = customFromDate;
            if (customToDate) params.toDate = customToDate;
          }

          const ov = await getDashboardApi(params);
          setOverview(ov?.data || ov);

          const rev = await getDashbordRevenue(params);
          setRevenueTrends(rev?.data || rev || []);

          const fac = await getDashbordFacility(params);
          setFacilityStats(fac?.data || fac || []);

          const demo = await getUserDemographicsApi(params);
          setDemographics(demo?.data || demo || []);

          const pay = await getPaymentMethodsStatsApi(params);
          setPaymentStats(pay?.data || pay || []);

          const att = await getStaffAttendanceStatsApi(params);
          setAttendanceStats(att?.data || att || []);

          try {
            const logsRes = await getActivityLogsApi();
            const fetchedLogs = getLogsList(logsRes);
            if (fetchedLogs && fetchedLogs.length > 0) {
              setLogs(fetchedLogs.map(mapBackendLog));
            }
          } catch (err) {
            console.warn("Failed to fetch activity logs, using fallback:", err);
          }
        } catch (err) {
          console.warn("Failed to load admin stats:", err);
        } finally {
          setLoadingStats(false);
        }
      };
      loadAdminData();
    }
  }, [isAdmin, filterType, customFromDate, customToDate]);

  const handleBookClick = (facility: any) => {
    setSelectedFacilityForBooking(facility);
    setBookingDialogOpen(true);
  };

  if (!isAdmin) {
    if (user?.role === "CRM") {
      return <CRMDashboard user={user} />;
    }

    const userName = user?.name || "User";
    const userInitials = userName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    return (
      <>
        <ResidentDashboard
          user={user}
          userName={userName}
          userInitials={userInitials}
          qrLoading={qrLoading}
          qrCodeData={qrCodeData}
          navigate={navigate}
          sidebarTab={sidebarTab}
          setSidebarTab={setSidebarTab}
          loadingSidebar={loadingSidebar}
          dbBookings={dbBookings}
          dbFacilities={dbFacilities}
          isAdmin={isAdmin}
          handleBookClick={handleBookClick}
        />
        <CreateBookingDialog
          open={bookingDialogOpen}
          onClose={() => {
            setBookingDialogOpen(false);
            fetchSidebarData();
          }}
          resident={user}
        />
      </>
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
  const COLORS = ["#24528C", "#24528C", "#4caf50", "#ff9800", "#7A4FB5", "#e91e63", "#009688"];
  const pieChartData = facilityStats
    .map((fac: any, index: number) => ({
      name: fac.name,
      value: fac.totalAccess || fac.confirmedBookings || fac.activeSubscriptions || 0,
      color: COLORS[index % COLORS.length],
    }))
    .filter((item: any) => item.value > 0);
  const finalPieData = pieChartData.length > 0 ? pieChartData : pieData;
  const totalPieAccess = finalPieData.reduce((sum: number, item: any) => sum + item.value, 0);

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
            const active30 = roleData.reduce((sum, d) => sum + (d.active30Days || 0), 0);
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
  const finalPaymentStats = paymentStats.length > 0 ? paymentStats : fallbackPaymentStats;
  const totalPaymentAmount = finalPaymentStats.reduce((sum, p) => sum + (p.totalAmount || 0), 0);

  // Attendance data processing
  const finalAttendanceStats = attendanceStats || [];
  const totalAttendanceCount = finalAttendanceStats.reduce((sum, a) => sum + (a.count || 0), 0);
  const presentCount =
    finalAttendanceStats.find((a) => (a.status || "").toUpperCase() === "PRESENT")?.count || 0;
  const absentCount =
    finalAttendanceStats.find((a) => (a.status || "").toUpperCase() === "ABSENT")?.count || 0;
  const lateCount =
    finalAttendanceStats.find((a) => (a.status || "").toUpperCase() === "LATE")?.count || 0;
  const halfDayCount =
    finalAttendanceStats.find((a) => (a.status || "").toUpperCase() === "HALF_DAY")?.count || 0;

  const attendanceRate =
    totalAttendanceCount > 0
      ? Math.round(((presentCount + lateCount + halfDayCount) / totalAttendanceCount) * 100)
      : 0;

  return (
    <>
      <AdminDashboard
        filterType={filterType}
        setFilterType={setFilterType}
        customFromDate={customFromDate}
        setCustomFromDate={setCustomFromDate}
        customToDate={customToDate}
        setCustomToDate={setCustomToDate}
        navigate={navigate}
        loadingStats={loadingStats}
        overview={overview}
        finalLineData={finalLineData}
        finalPieData={finalPieData}
        totalPieAccess={totalPieAccess}
        sidebarTab={sidebarTab}
        setSidebarTab={setSidebarTab}
        loadingSidebar={loadingSidebar}
        dbBookings={dbBookings}
        dbFacilities={dbFacilities}
        isAdmin={isAdmin}
        user={user}
        handleBookClick={handleBookClick}
        roleSummaries={roleSummaries}
        totalPaymentAmount={totalPaymentAmount}
        finalPaymentStats={finalPaymentStats}
        attendanceRate={attendanceRate}
        totalAttendanceCount={totalAttendanceCount}
        presentCount={presentCount}
        absentCount={absentCount}
        lateCount={lateCount}
        halfDayCount={halfDayCount}
        logs={logs}
      />
      <CreateBookingDialog
        open={bookingDialogOpen}
        onClose={() => {
          setBookingDialogOpen(false);
          fetchSidebarData();
        }}
        resident={user}
      />
    </>
  );
}
