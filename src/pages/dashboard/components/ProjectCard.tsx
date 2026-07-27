import { Box, Typography, Paper } from "@mui/material";

interface ProjectCardProps {
  title: string;
  badge?: string;
  stats: {
    label: string;
    value: string | number;
  }[];
}

export default function ProjectCard({
  title,
  badge,
  stats,
}: ProjectCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        bgcolor: "#ffffff",
        mb: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 600,
            fontSize: "1.25rem",
            color: "#1e293b",
          }}
        >
          {title}
        </Typography>
        {badge && (
          <Typography
            sx={{
              color: "#94a3b8",
              fontSize: "0.75rem",
              fontWeight: 500,
            }}
          >
            {badge}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: { xs: 2, sm: 6 },
        }}
      >
        {stats.map((stat, index) => (
          <Box key={index}>
            <Typography
              variant="overline"
              sx={{
                color: "#94a3b8",
                fontWeight: 700,
                fontSize: "0.65rem",
                letterSpacing: "1px",
                display: "block",
                lineHeight: 1.2,
                mb: 0.5,
              }}
            >
              {stat.label}
            </Typography>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "#1e293b",
              }}
            >
              {stat.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
