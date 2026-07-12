import { Grid, Paper, Box, Typography, Avatar } from "@mui/material";
import {
  ErrorOutline as OpenIcon,
  NotificationsActiveOutlined as AcknowledgedIcon,
  CheckCircleOutline as ResolvedIcon,
} from "@mui/icons-material";

interface EmergencyStatsProps {
  openCount: number;
  acknowledgedCount: number;
  resolvedCount: number;
  onStatusClick?: (status: string) => void;
}

export default function EmergencyStats({
  openCount,
  acknowledgedCount,
  resolvedCount,
  onStatusClick,
}: EmergencyStatsProps) {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Paper
          elevation={0}
          onClick={() => onStatusClick && onStatusClick("OPEN")}
          sx={{
            p: 3,
            borderRadius: "24px",
            border: "1px solid #fee2e2",
            bgcolor: "#fff5f5",
            display: "flex",
            alignItems: "center",
            gap: 2.5,
            cursor: onStatusClick ? "pointer" : "default",
            userSelect: "none",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-3px)",
              boxShadow: "0 10px 25px -5px rgba(239, 68, 68, 0.15)",
            },
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#fee2e2",
              color: "#ef4444",
              width: 54,
              height: 54,
              boxShadow: "0 0 15px rgba(239, 68, 68, 0.2)",
              animation: openCount > 0 ? "pulse 2s infinite" : "none",
              "@keyframes pulse": {
                "0%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.08)", boxShadow: "0 0 20px rgba(239, 68, 68, 0.4)" },
                "100%": { transform: "scale(1)" }
              }
            }}
          >
            <OpenIcon sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography variant="body2" color="error.main" fontWeight="800" letterSpacing="0.5px">
              OPEN EMERGENCIES
            </Typography>
            <Typography variant="h4" fontWeight="950" color="#ef4444">
              {openCount}
            </Typography>
          </Box>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <Paper
          elevation={0}
          onClick={() => onStatusClick && onStatusClick("ACKNOWLEDGED")}
          sx={{
            p: 3,
            borderRadius: "24px",
            border: "1px solid #eff6ff",
            bgcolor: "#f0f7ff",
            display: "flex",
            alignItems: "center",
            gap: 2.5,
            cursor: onStatusClick ? "pointer" : "default",
            userSelect: "none",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-3px)",
              boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.15)",
            },
          }}
        >
          <Avatar sx={{ bgcolor: "#dbeafe", color: "#2c4d93", width: 54, height: 54 }}>
            <AcknowledgedIcon sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography variant="body2" color="primary.main" fontWeight="800" letterSpacing="0.5px">
              RESPONDING / ACKED
            </Typography>
            <Typography variant="h4" fontWeight="950" color="#1d4ed8">
              {acknowledgedCount}
            </Typography>
          </Box>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <Paper
          elevation={0}
          onClick={() => onStatusClick && onStatusClick("RESOLVED")}
          sx={{
            p: 3,
            borderRadius: "24px",
            border: "1px solid #f0fdf4",
            bgcolor: "#f4fdf7",
            display: "flex",
            alignItems: "center",
            gap: 2.5,
            cursor: onStatusClick ? "pointer" : "default",
            userSelect: "none",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-3px)",
              boxShadow: "0 10px 25px -5px rgba(34, 197, 94, 0.15)",
            },
          }}
        >
          <Avatar sx={{ bgcolor: "#dcfce7", color: "#16a34a", width: 54, height: 54 }}>
            <ResolvedIcon sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography variant="body2" color="success.main" fontWeight="800" letterSpacing="0.5px">
              RESOLVED / COMPLETED
            </Typography>
            <Typography variant="h4" fontWeight="950" color="#15803d">
              {resolvedCount}
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
