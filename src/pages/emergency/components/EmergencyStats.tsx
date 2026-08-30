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
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Paper
          elevation={0}
          onClick={() => onStatusClick && onStatusClick("OPEN")}
          sx={{
            p: 2,
            borderRadius: "12px",
            border: "1px solid #fee2e2",
            bgcolor: "#fff5f5",
            display: "flex",
            alignItems: "center",
            gap: 2,
            cursor: onStatusClick ? "pointer" : "default",
            userSelect: "none",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(239, 68, 68, 0.15)",
            },
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#fee2e2",
              color: "#ef4444",
              width: 44,
              height: 44,
              boxShadow: "0 0 10px rgba(239, 68, 68, 0.2)",
              animation: openCount > 0 ? "pulse 2s infinite" : "none",
              "@keyframes pulse": {
                "0%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.05)", boxShadow: "0 0 15px rgba(239, 68, 68, 0.3)" },
                "100%": { transform: "scale(1)" }
              }
            }}
          >
            <OpenIcon sx={{ fontSize: 22 }} />
          </Avatar>
          <Box>
            <Typography variant="caption" color="error.main" fontWeight="800" letterSpacing="0.5px">
              OPEN EMERGENCIES
            </Typography>
            <Typography variant="h5" fontWeight="950" color="#ef4444" sx={{ lineHeight: 1.2 }}>
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
            p: 2,
            borderRadius: "12px",
            border: "1px solid #EAF0F7",
            bgcolor: "#f0f7ff",
            display: "flex",
            alignItems: "center",
            gap: 2,
            cursor: onStatusClick ? "pointer" : "default",
            userSelect: "none",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
            },
          }}
        >
          <Avatar sx={{ bgcolor: "#EAF0F7", color: "#24528C", width: 44, height: 44 }}>
            <AcknowledgedIcon sx={{ fontSize: 22 }} />
          </Avatar>
          <Box>
            <Typography variant="caption" color="primary.main" fontWeight="800" letterSpacing="0.5px">
              RESPONDING / ACKED
            </Typography>
            <Typography variant="h5" fontWeight="950" color="#24528C" sx={{ lineHeight: 1.2 }}>
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
            p: 2,
            borderRadius: "12px",
            border: "1px solid #dcfce7",
            bgcolor: "#f0fdf4",
            display: "flex",
            alignItems: "center",
            gap: 2,
            cursor: onStatusClick ? "pointer" : "default",
            userSelect: "none",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(34, 197, 94, 0.15)",
            },
          }}
        >
          <Avatar sx={{ bgcolor: "#dcfce7", color: "#16a34a", width: 44, height: 44 }}>
            <ResolvedIcon sx={{ fontSize: 22 }} />
          </Avatar>
          <Box>
            <Typography variant="caption" color="#16a34a" fontWeight="800" letterSpacing="0.5px">
              RESOLVED / COMPLETED
            </Typography>
            <Typography variant="h5" fontWeight="950" color="#15803d" sx={{ lineHeight: 1.2 }}>
              {resolvedCount}
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
