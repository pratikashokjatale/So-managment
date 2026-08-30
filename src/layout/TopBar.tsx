import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
  Button,
} from "@mui/material";
import { Menu as MenuIcon, Logout as LogoutIcon } from "@mui/icons-material";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import { useAuth } from "@/contexts/AuthContext";
import logoImg from "@/assets/logo.jpeg";

interface TopBarProps {
  handleDrawerToggle: () => void;
  drawerWidth: number;
  currentRole?: string;
  onBackToAdmin?: () => void;
}

export default function TopBar({ handleDrawerToggle, currentRole, onBackToAdmin }: TopBarProps) {
  const theme = useTheme();
  const { logout, user } = useAuth();

  return (
    <Box
      component="header"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.drawer + 1,
        width: "100%",
        bgcolor: "#ffffff",
        color: "text.primary",
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          minHeight: 50,
          width: "100%",
          maxWidth: "1350px",
          margin: "0 auto",
          px: { xs: 2, md: 4, lg: 8 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {currentRole !== "CRM" && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              component="img"
              src={logoImg}
              alt="Logo"
              sx={{
                width: 34,
                height: 34,
                borderRadius: "8px",
                objectFit: "cover",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: "#0f172a",
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontWeight: 700,
                fontSize: "1.25rem",
                letterSpacing: "-0.5px",
                display: { xs: "none", sm: "block" },
              }}
            >
              Club Marbella
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {currentRole === "CRM" ? (
            <Button
              onClick={onBackToAdmin}
              sx={{
                bgcolor: "#EAF0F7",
                color: "#24528C",
                fontWeight: 700,
                borderRadius: "20px",
                px: 3,
                py: 0.75,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#EAF0F7",
                },
              }}
            >
              Back to Admin
            </Button>
          ) : user?.role === "CRM" ? (
            <>
              <Box sx={{ textAlign: "right", display: { xs: "none", sm: "block" } }}>
                <Typography sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem", lineHeight: 1.2 }}>
                  {user?.name || "Simran Kaur"}
                </Typography>
                <Typography sx={{ color: "#64748b", fontSize: "0.85rem" }}>
                  Sales / CRM desk
                </Typography>
              </Box>
              <Box 
                sx={{ 
                  bgcolor: "#F3E8FF", 
                  color: "#7A4FB5", 
                  fontWeight: 600, 
                  fontSize: "0.85rem", 
                  px: 1.5, 
                  py: 0.5, 
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5
                }}
              >
                <HeadsetMicIcon sx={{ fontSize: 16 }} /> CRM
              </Box>
              <IconButton
                onClick={logout}
                sx={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  p: 1,
                  "&:hover": { bgcolor: "#f8fafc" },
                }}
              >
                <LogoutIcon sx={{ fontSize: 20, color: "#64748b" }} />
              </IconButton>
            </>
          ) : (
            <Button
              onClick={logout}
              endIcon={<LogoutIcon sx={{ fontSize: 18, color: "#64748b" }} />}
              sx={{
                bgcolor: "#f8fafc",
                color: "#1e293b",
                fontWeight: 700,
                borderRadius: "20px",
                px: 2,
                py: 0.5,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#f1f5f9",
                },
              }}
            >
              Admin
            </Button>
          )}
        </Box>
      </Toolbar>
    </Box>
  );
}
