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
    <Grid container spacing={4} sx={{ mb: 4 }}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Paper
          elevation={0}
          onClick={() => onStatusClick && onStatusClick("OPEN")}
          sx={{
            p: 3,
            borderRadius: "24px",
            border: "1px solid #e2e8f0",
            bgcolor: "white",
            display: "flex",
            alignItems: "center",
            gap: 2.5,
            cursor: onStatusClick ? "pointer" : "default",
            userSelect: "none",
            transition: "transform 0.2s ease",
            "&:hover": { transform: "translateY(-2px)" },
          }}
        >
          <Avatar sx={{ bgcolor: "#fff7ed", color: "#ea580c", width: 52, height: 52 }}>
            <OpenIcon />
          </Avatar>
          <Box>
            <Typography variant="body2" color="text.secondary" fontWeight="700">
              OPEN TICKETS
            </Typography>
            <Typography variant="h4" fontWeight="900" color="#091542">
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
            p: 3,
            borderRadius: "24px",
            border: "1px solid #e2e8f0",
            bgcolor: "white",
            display: "flex",
            alignItems: "center",
            gap: 2.5,
            cursor: onStatusClick ? "pointer" : "default",
            userSelect: "none",
            transition: "transform 0.2s ease",
            "&:hover": { transform: "translateY(-2px)" },
          }}
        >
          <Avatar sx={{ bgcolor: "#eff6ff", color: "#1d4ed8", width: 52, height: 52 }}>
            <InProgressIcon />
          </Avatar>
          <Box>
            <Typography variant="body2" color="text.secondary" fontWeight="700">
              IN PROGRESS
            </Typography>
            <Typography variant="h4" fontWeight="900" color="#091542">
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
            p: 3,
            borderRadius: "24px",
            border: "1px solid #e2e8f0",
            bgcolor: "white",
            display: "flex",
            alignItems: "center",
            gap: 2.5,
            cursor: onStatusClick ? "pointer" : "default",
            userSelect: "none",
            transition: "transform 0.2s ease",
            "&:hover": { transform: "translateY(-2px)" },
          }}
        >
          <Avatar sx={{ bgcolor: "#f0fdf4", color: "#16a34a", width: 52, height: 52 }}>
            <ResolvedIcon />
          </Avatar>
          <Box>
            <Typography variant="body2" color="text.secondary" fontWeight="700">
              RESOLVED TICKETS
            </Typography>
            <Typography variant="h4" fontWeight="900" color="#091542">
              {resolvedCount}
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
