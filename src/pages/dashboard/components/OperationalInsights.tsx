import {
  Box,
  Typography,
  Grid,
  Paper,
  Stack,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import {
  People as PeopleIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

interface OperationalInsightsProps {
  roleSummaries: any[];
  totalPaymentAmount: number;
  finalPaymentStats: any[];
  attendanceRate: number;
  totalAttendanceCount: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  halfDayCount: number;
}

export default function OperationalInsights({
  roleSummaries,
  totalPaymentAmount,
  finalPaymentStats,
  attendanceRate,
  totalAttendanceCount,
  presentCount,
  absentCount,
  lateCount,
  halfDayCount,
}: OperationalInsightsProps) {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="subtitle1"
        fontWeight="900"
        color="#091542"
        sx={{ mb: 3, fontSize: "1.2rem", letterSpacing: "-0.5px" }}
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
              border: "1px solid rgba(226, 232, 240, 0.8)",
              borderRadius: "20px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              bgcolor: "white",
              boxShadow: "0 10px 35px rgba(9, 21, 66, 0.02)",
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Box
                sx={{
                  p: 1,
                  bgcolor: "#EAF0F7",
                  borderRadius: "10px",
                  color: "#24528C",
                  display: "flex",
                }}
              >
                <PeopleIcon sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="subtitle2" fontWeight="900" color="#091542">
                User Demographics
              </Typography>
            </Stack>
            <Stack
              spacing={2.5}
              sx={{ flexGrow: 1, justifyContent: "center" }}
            >
              {roleSummaries.map((summary: any) => {
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
                              ? "#24528C"
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
                        fontWeight="700"
                      >
                        {summary.active} Active
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight="700"
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
              border: "1px solid rgba(226, 232, 240, 0.8)",
              borderRadius: "20px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              bgcolor: "white",
              boxShadow: "0 10px 35px rgba(9, 21, 66, 0.02)",
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Box
                sx={{
                  p: 1,
                  bgcolor: "#f0fdf4",
                  borderRadius: "10px",
                  color: "#10b981",
                  display: "flex",
                }}
              >
                <PaymentIcon sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="subtitle2" fontWeight="900" color="#091542">
                Financial Distribution
              </Typography>
            </Stack>

            <Box
              sx={{
                mb: 3,
                p: 2,
                bgcolor: "#f8fafc",
                borderRadius: "14px",
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
              <Typography
                variant="h5"
                fontWeight="950"
                color="#24528C"
                sx={{ letterSpacing: "-0.5px" }}
              >
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
              {finalPaymentStats.map((pay: any) => {
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
                              ? "#24528C"
                              : pay.provider === "WALLET"
                              ? "#7A4FB5"
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
                        fontWeight="700"
                      >
                        {share.toFixed(0)}% Share
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight="700"
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
              border: "1px solid rgba(226, 232, 240, 0.8)",
              borderRadius: "20px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              bgcolor: "white",
              boxShadow: "0 10px 35px rgba(9, 21, 66, 0.02)",
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Box
                sx={{
                  p: 1,
                  bgcolor: "#fffbeb",
                  borderRadius: "10px",
                  color: "#d97706",
                  display: "flex",
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="subtitle2" fontWeight="900" color="#091542">
                Staff Attendance Summary
              </Typography>
            </Stack>

            <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
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
                    fontWeight="900"
                  >
                    {attendanceRate}%
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="body2" fontWeight="800" color="#1e293b">
                  Attendance Rate
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight="700"
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
                    bgcolor: "#EAF0F7",
                    borderRadius: "12px",
                    textAlign: "center",
                    border: "1px solid #EAF0F7",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="800"
                  >
                    PRESENT
                  </Typography>
                  <Typography variant="h6" fontWeight="950" color="#24528C">
                    {presentCount}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Box
                  sx={{
                    p: 1.5,
                    bgcolor: "#fef2f2",
                    borderRadius: "12px",
                    textAlign: "center",
                    border: "1px solid #fee2e2",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="800"
                  >
                    ABSENT
                  </Typography>
                  <Typography variant="h6" fontWeight="950" color="#991b1b">
                    {absentCount}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Box
                  sx={{
                    p: 1.5,
                    bgcolor: "#fffbeb",
                    borderRadius: "12px",
                    textAlign: "center",
                    border: "1px solid #fef3c7",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="800"
                  >
                    LATE
                  </Typography>
                  <Typography variant="h6" fontWeight="950" color="#92400e">
                    {lateCount}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Box
                  sx={{
                    p: 1.5,
                    bgcolor: "#f0fdf4",
                    borderRadius: "12px",
                    textAlign: "center",
                    border: "1px solid #dcfce7",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="800"
                  >
                    HALF DAY
                  </Typography>
                  <Typography variant="h6" fontWeight="950" color="#166534">
                    {halfDayCount}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
