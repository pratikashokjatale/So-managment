import { Box, Paper, Stack, Avatar, Typography, Divider, Button } from "@mui/material";
import { getFileUrl } from "@/utils/file";

interface UserProfileCardProps {
  user: any;
  initials: string;
  navigate: (path: string) => void;
}

export default function UserProfileCard({
  user,
  initials,
  navigate,
}: UserProfileCardProps) {
  const userName = user?.name || "User";

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: "24px",
        border: "1px solid rgba(226, 232, 240, 0.8)",
        bgcolor: "white",
        height: "100%",
        boxShadow: "0 10px 35px rgba(9, 21, 66, 0.02)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "6px",
          background: "linear-gradient(90deg, #10b981 0%, #34d399 100%)",
        },
      }}
    >
      <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 4 }}>
        <Avatar
          src={getFileUrl(
            user?.photoUrl || user?.profilePhotoUrl || user?.avatar
          )}
          imgProps={{ crossOrigin: "anonymous" }}
          sx={{
            width: 76,
            height: 76,
            fontSize: "1.85rem",
            fontWeight: 900,
            bgcolor: "#eff6ff",
            color: "#1e40af",
            border: "3px solid #eff6ff",
            boxShadow: "0 4px 15px rgba(30, 64, 175, 0.08)",
          }}
        >
          {initials}
        </Avatar>
        <Box>
          <Typography
            variant="h5"
            fontWeight="950"
            color="#091542"
            sx={{ letterSpacing: "-0.5px" }}
          >
            {userName}
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            {user?.email}
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
        <Box
          sx={{
            p: 2,
            bgcolor: "#f8fafc",
            borderRadius: "14px",
            border: "1px solid #f1f5f9",
          }}
        >
          <Typography
            variant="caption"
            fontWeight="800"
            color="text.secondary"
            sx={{
              textTransform: "uppercase",
              fontSize: "0.65rem",
              letterSpacing: 0.5,
            }}
          >
            Role
          </Typography>
          <Typography
            variant="body1"
            fontWeight="800"
            color="#091542"
            sx={{ mt: 0.5 }}
          >
            {user?.role || "Resident"}
          </Typography>
        </Box>

        {user?.accountRole && (
          <Box
            sx={{
              p: 2,
              bgcolor: "#f8fafc",
              borderRadius: "14px",
              border: "1px solid #f1f5f9",
            }}
          >
            <Typography
              variant="caption"
              fontWeight="800"
              color="text.secondary"
              sx={{
                textTransform: "uppercase",
                fontSize: "0.65rem",
                letterSpacing: 0.5,
              }}
            >
              Account Type
            </Typography>
            <Typography
              variant="body1"
              fontWeight="800"
              color="#091542"
              sx={{ mt: 0.5 }}
            >
              {user?.accountRole}
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            p: 2,
            bgcolor: "#f8fafc",
            borderRadius: "14px",
            border: "1px solid #f1f5f9",
          }}
        >
          <Typography
            variant="caption"
            fontWeight="800"
            color="text.secondary"
            sx={{
              textTransform: "uppercase",
              fontSize: "0.65rem",
              letterSpacing: 0.5,
            }}
          >
            Phone Number
          </Typography>
          <Typography
            variant="body1"
            fontWeight="800"
            color="#091542"
            sx={{ mt: 0.5 }}
          >
            {user?.phone || "N/A"}
          </Typography>
        </Box>

        {user?.stayEndsAt && (
          <Box
            sx={{
              p: 2,
              bgcolor: "#fff5f5",
              borderRadius: "14px",
              border: "1px solid #ffe3e3",
            }}
          >
            <Typography
              variant="caption"
              fontWeight="800"
              color="#e53e3e"
              sx={{
                textTransform: "uppercase",
                fontSize: "0.65rem",
                letterSpacing: 0.5,
              }}
            >
              Access Expiry Date
            </Typography>
            <Typography
              variant="body1"
              fontWeight="800"
              color="#e53e3e"
              sx={{ mt: 0.5 }}
            >
              {new Date(user.stayEndsAt).toLocaleDateString("en-US", {
                dateStyle: "medium",
              })}
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ mt: 5, display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          onClick={() => navigate("/profile")}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 800,
            bgcolor: "#0047b3",
            boxShadow: "none",
            px: 4,
            py: 1.25,
            transition: "all 0.2s",
            "&:hover": {
              bgcolor: "#003bb3",
              boxShadow: "0 6px 16px rgba(0, 71, 179, 0.2)",
              transform: "scale(1.02)",
            },
          }}
        >
          View Profile details
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate("/support")}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 800,
            borderColor: "#e2e8f0",
            color: "#091542",
            px: 4,
            py: 1.25,
            transition: "all 0.2s",
            "&:hover": {
              borderColor: "#091542",
              bgcolor: "#f8fafc",
              transform: "scale(1.02)",
            },
          }}
        >
          Contact Support
        </Button>
      </Box>
    </Paper>
  );
}
