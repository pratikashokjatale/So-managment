import { Box, Typography } from "@mui/material";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";

type CRMProfileHeaderProps = {
  userName: string;
};

const CRMProfileHeader = ({ userName }: CRMProfileHeaderProps) => (
  <Box
    component="header"
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      p: { xs: 2, md: 3 },
      borderBottom: "1px solid #e2e8f0",
      bgcolor: "#fafafa",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Box
        sx={{
          width: 44,
          height: 44,
          bgcolor: "#F3E8FF",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <HeadsetMicIcon sx={{ color: "#7A4FB5", fontSize: 22 }} />
      </Box>
      <Box>
        <Typography
          sx={{ fontWeight: 600, color: "#1e293b", fontSize: "0.95rem" }}
        >
          {userName}
        </Typography>
        <Typography sx={{ color: "#64748b", fontSize: "0.8rem" }}>
          Sales / CRM desk
        </Typography>
      </Box>
    </Box>
    <Box
      sx={{
        bgcolor: "#f2edf5",
        color: "#7750b3",
        fontWeight: 600,
        fontSize: "0.75rem",
        px: 1.5,
        py: 0.75,
        borderRadius: "20px",
      }}
    >
      CRM portal
    </Box>
  </Box>
);

export default CRMProfileHeader;
