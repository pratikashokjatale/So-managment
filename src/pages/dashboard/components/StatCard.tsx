import { Box, Typography, Paper } from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from "@mui/icons-material";

interface StatCardProps {
  title: string;
  value: string | number;
  trend: string;
  trendValue: string;
  isPositive: boolean;
}

export default function StatCard({
  title,
  value,
  trend,
  trendValue,
  isPositive,
}: StatCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        border: "1px solid #f1f5f9",
        borderLeft: isPositive ? "4px solid #10b981" : "4px solid #ef4444",
        borderRadius: "16px",
        bgcolor: "#ffffff",
        boxShadow:
          "0 4px 6px -1px rgba(0,0,0,0.01), 0 2px 4px -1px rgba(0,0,0,0.01)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 24px -10px rgba(9, 21, 66, 0.1)",
          borderColor: "#e2e8f0",
        },
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight="700"
        sx={{
          mb: 1,
          display: "block",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="h4"
        fontWeight="800"
        color="#091542"
        sx={{ mb: 1, letterSpacing: "-0.5px" }}
      >
        {value}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        {isPositive ? (
          <TrendingUpIcon sx={{ fontSize: 14, color: "#10b981" }} />
        ) : (
          <TrendingDownIcon sx={{ fontSize: 14, color: "#ef4444" }} />
        )}
        <Typography
          variant="caption"
          fontWeight="800"
          color={isPositive ? "#10b981" : "#ef4444"}
        >
          {trendValue}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ ml: 0.5, fontWeight: 500 }}
        >
          {trend}
        </Typography>
      </Box>
    </Paper>
  );
}
