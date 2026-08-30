import { Grid, Paper, Box, Typography, Avatar } from "@mui/material";
import {
  ErrorOutline as OpenIcon,
  HourglassEmpty as InProgressIcon,
  AssignmentTurnedIn as ResolvedIcon,
} from "@mui/icons-material";

interface IssueStatsProps {
  openCount: number;
  inProgressCount: number;
  resolvedCount: number;
  onStatusClick?: (status: string) => void;
}

export default function IssueStats({
  openCount,
  inProgressCount,
  resolvedCount,
  onStatusClick,
}: IssueStatsProps) {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Paper
          elevation={0}
          onClick={() => onStatusClick && onStatusClick("OPEN")}
          sx={{
            p: 2,
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            bgcolor: "white",
            display: "flex",
            alignItems: "center",
            gap: 2,
            cursor: onStatusClick ? "pointer" : "default",
            userSelect: "none",
            transition: "transform 0.2s ease",
            "&:hover": { transform: "translateY(-2px)" },
          }}
        >
          <Avatar sx={{ bgcolor: "#fff7ed", color: "#ea580c", width: 44, height: 44 }}>
            <OpenIcon sx={{ fontSize: 22 }} />
          </Avatar>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight="700">
              OPEN TICKETS
            </Typography>
            <Typography variant="h5" fontWeight="900" color="#091542" sx={{ lineHeight: 1.2 }}>
              {openCount}
            </Typography>
          </Box>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <Paper
          elevation={0}
          onClick={() => onStatusClick && onStatusClick("IN_PROGRESS")}
          sx={{
            p: 2,
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            bgcolor: "white",
            display: "flex",
            alignItems: "center",
            gap: 2,
            cursor: onStatusClick ? "pointer" : "default",
            userSelect: "none",
            transition: "transform 0.2s ease",
            "&:hover": { transform: "translateY(-2px)" },
          }}
        >
          <Avatar sx={{ bgcolor: "#EAF0F7", color: "#24528C", width: 44, height: 44 }}>
            <InProgressIcon sx={{ fontSize: 22 }} />
          </Avatar>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight="700">
              IN PROGRESS
            </Typography>
            <Typography variant="h5" fontWeight="900" color="#091542" sx={{ lineHeight: 1.2 }}>
              {inProgressCount}
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
            border: "1px solid #e2e8f0",
            bgcolor: "white",
            display: "flex",
            alignItems: "center",
            gap: 2,
            cursor: onStatusClick ? "pointer" : "default",
            userSelect: "none",
            transition: "transform 0.2s ease",
            "&:hover": { transform: "translateY(-2px)" },
          }}
        >
          <Avatar sx={{ bgcolor: "#f0fdf4", color: "#16a34a", width: 44, height: 44 }}>
            <ResolvedIcon sx={{ fontSize: 22 }} />
          </Avatar>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight="700">
              RESOLVED TICKETS
            </Typography>
            <Typography variant="h5" fontWeight="900" color="#091542" sx={{ lineHeight: 1.2 }}>
              {resolvedCount}
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
