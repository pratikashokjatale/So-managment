// @ts-nocheck
import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  Download as DownloadIcon,
  PersonOutline as PersonIcon,
  ScheduleOutlined as ClockIcon,
  ErrorOutline as AlertIcon,
  GroupOutlined as GroupIcon,
} from "@mui/icons-material";
import { getStaffListApi } from "@/apis/staff";
import { getAttendanceListApi } from "@/apis/attendance";

const BRAND = "#24528C";
const GREEN = "#22c55e";
const GOLD = "#bca47c";
const GOLD_D = "#a17a3f";
const RED = "#ef4444";
const MUT = "#64748b";
const INK = "#1e293b";
const BG = "#f1f5f9";
const LINE = "#e2e8f0";

const todayInIndia = () => new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Kolkata",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

const checkInTime = (value: string) => value ? new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
}).format(new Date(value)) : "—";

export default function StaffTab() {
  const [staff, setStaff] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  const fetchStaff = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const date = todayInIndia();
      const [staffResponse, attendanceResponse] = await Promise.all([
        getStaffListApi({ limit: 100, status: "ACTIVE" }),
        getAttendanceListApi({ dateFrom: date, dateTo: date, page: 1, limit: 100 }),
      ]);
      let staffItems = staffResponse?.data?.items || staffResponse?.items || staffResponse?.data || staffResponse || [];
      let attendanceItems = attendanceResponse?.data?.items || attendanceResponse?.items || attendanceResponse?.data || attendanceResponse || [];
      setStaff(Array.isArray(staffItems) ? staffItems : []);
      setAttendance(Array.isArray(attendanceItems) ? attendanceItems : []);
    } catch (error) {
      console.error("Failed to fetch staff:", error);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
    const interval = window.setInterval(() => fetchStaff(false), 30000);
    return () => window.clearInterval(interval);
  }, []);

  // Join today's live attendance records to the staff directory.
  const staffWithAttendance = useMemo(() => {
    const byStaffId = new Map(attendance.map(record => [record.staffId || record.staff?.id, record]));
    return staff.map(s => {
      const record = byStaffId.get(s.id);
      if (!record) return { ...s, attendance: { status: "absent", checkedIn: false } };
      const apiStatus = String(record.status || "ABSENT").toUpperCase();
      return {
        ...s,
        attendance: {
          ...record,
          status: apiStatus === "LATE" ? "late" : apiStatus === "ABSENT" || apiStatus === "ON_LEAVE" ? "absent" : "on_time",
          checkedIn: Boolean(record.checkInAt) && !record.checkOutAt && !["ABSENT", "ON_LEAVE"].includes(apiStatus),
          time: checkInTime(record.checkInAt),
          lateMins: record.lateMinutes ?? record.minutesLate ?? record.lateByMinutes ?? 0,
        },
      };
    });
  }, [staff, attendance]);

  // Extract unique departments for filters
  const departments = useMemo(() => {
    const deps = new Set(staff.map(s => s.department).filter(Boolean));
    return ["All", ...Array.from(deps)];
  }, [staff]);

  const filteredStaff = activeFilter === "All"
    ? staffWithAttendance
    : staffWithAttendance.filter(s => s.department === activeFilter);

  // Calculate KPIs
  const onDutyCount = staffWithAttendance.filter(s => s.attendance?.checkedIn).length;
  const lateCount = staffWithAttendance.filter(s => s.attendance?.status === "late").length;
  const absentCount = staffWithAttendance.filter(s => s.attendance?.status === "absent").length;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: "1.7rem",
              fontWeight: 600,
              color: INK,
              lineHeight: 1.1,
              mb: 0.3,
            }}
          >
            Staff
          </Typography>
          <Typography sx={{ fontSize: "0.85rem", color: MUT }}>
            Attendance, punctuality & directory
          </Typography>
        </Box>
        <Box sx={{ ml: "auto" }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon sx={{ fontSize: 16 }} />}
            sx={{
              bgcolor: BG,
              color: BRAND,
              borderColor: "transparent",
              textTransform: "none",
              borderRadius: "8px",
              px: 2,
              py: 1,
              fontWeight: 600,
              fontSize: "0.85rem",
              "&:hover": { bgcolor: "#e2e8f0", borderColor: "transparent" },
            }}
          >
            Export Excel
          </Button>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{ p: 2, borderRadius: "12px", border: `1px solid ${LINE}`, display: "flex", flexDirection: "column" }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1.2 }}>
            <PersonIcon sx={{ fontSize: 16, color: GREEN }} />
            <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: MUT, letterSpacing: "0.6px", textTransform: "uppercase" }}>ON DUTY</Typography>
          </Box>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "1.8rem", fontWeight: 600, color: INK, lineHeight: 1.1 }}>
            {onDutyCount}
          </Typography>
          <Typography sx={{ fontSize: "0.75rem", color: MUT, mt: "auto" }}>
            of {staffWithAttendance.length}
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{ p: 2, borderRadius: "12px", border: `1px solid ${LINE}`, display: "flex", flexDirection: "column" }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1.2 }}>
            <ClockIcon sx={{ fontSize: 16, color: GOLD_D }} />
            <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: MUT, letterSpacing: "0.6px", textTransform: "uppercase" }}>LATE TODAY</Typography>
          </Box>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "1.8rem", fontWeight: 600, color: INK, lineHeight: 1.1 }}>
            {lateCount}
          </Typography>
          <Typography sx={{ fontSize: "0.75rem", color: MUT, mt: "auto" }}>
            past 10 min grace
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{ p: 2, borderRadius: "12px", border: `1px solid ${LINE}`, display: "flex", flexDirection: "column" }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1.2 }}>
            <AlertIcon sx={{ fontSize: 16, color: RED }} />
            <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: MUT, letterSpacing: "0.6px", textTransform: "uppercase" }}>ABSENT</Typography>
          </Box>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "1.8rem", fontWeight: 600, color: INK, lineHeight: 1.1 }}>
            {absentCount}
          </Typography>
          <Typography sx={{ fontSize: "0.75rem", color: MUT, mt: "auto" }}>
            no check-in
          </Typography>
        </Paper>
      </Box>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {departments.map(dep => (
          <Button
            key={dep}
            onClick={() => setActiveFilter(dep)}
            sx={{
              textTransform: "none",
              borderRadius: "20px",
              px: 2,
              py: 0.5,
              fontSize: "0.8rem",
              fontWeight: 600,
              bgcolor: activeFilter === dep ? BRAND : BG,
              color: activeFilter === dep ? "#fff" : MUT,
              "&:hover": { bgcolor: activeFilter === dep ? "#24528C" : "#e2e8f0" },
            }}
          >
            {dep}
          </Button>
        ))}
      </Box>

      {/* Staff List */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: `1px solid ${LINE}`,
          bgcolor: "#fff",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress size={28} sx={{ color: BRAND }} />
          </Box>
        ) : filteredStaff.length === 0 ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <Typography sx={{ fontSize: "0.9rem", color: MUT }}>No staff members found.</Typography>
          </Box>
        ) : (
          <Stack divider={<Box sx={{ height: "1px", bgcolor: LINE }} />}>
            {filteredStaff.map((s, idx) => {
              const shiftStr = s.shiftStart && s.shiftEnd ? `${s.shiftStart.substring(0, 5)} - ${s.shiftEnd.substring(0, 5)}` : "No shift set";
              const isCheckedIn = s.attendance?.checkedIn;
              const isAbsent = s.attendance?.status === "absent";
              const isLate = s.attendance?.status === "late";
              
              return (
                <Box key={s.id || idx} sx={{ display: "flex", alignItems: "center", gap: 2.5, p: 2 }}>
                  {/* Avatar */}
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "#e0f2fe", // light blue tint
                      flexShrink: 0,
                    }}
                  >
                    <GroupIcon sx={{ fontSize: 20, color: "#24528C" }} />
                  </Box>

                  {/* Details */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: "0.95rem", fontWeight: 600, color: INK }}>
                      {s.name}
                    </Typography>
                    <Typography sx={{ fontSize: "0.75rem", color: MUT, mt: 0.2 }}>
                      {s.department || "No Dept"} {s.designation ? `· ${s.designation}` : ""} {s.phone ? `· ${s.phone}` : ""}
                    </Typography>
                  </Box>

                  {/* Right Side: Shift & Action */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography sx={{ fontSize: "0.75rem", color: MUT }}>
                        {shiftStr}
                      </Typography>
                      
                      {isAbsent ? (
                        <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: RED }}>
                          Absent
                        </Typography>
                      ) : isLate ? (
                        <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: GOLD_D }}>
                          +{s.attendance?.lateMins} min · {s.attendance?.time}
                        </Typography>
                      ) : (
                        <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: GREEN }}>
                          On time · {s.attendance?.time}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        )}
      </Paper>
    </Box>
  );
}
