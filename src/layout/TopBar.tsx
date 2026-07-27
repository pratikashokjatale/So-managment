import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
  Button,
} from "@mui/material";
import { 
  Menu as MenuIcon, 
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import logoImg from "@/assets/logo.jpeg";

interface TopBarProps {
  handleDrawerToggle: () => void;
  drawerWidth: number;
}

export default function TopBar({
  handleDrawerToggle,
}: TopBarProps) {
  const theme = useTheme();
  const { logout } = useAuth();

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
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 74, px: { xs: 2, md: 4 } }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          
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
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
              }}
            />
            <Typography
              variant="h6"
              sx={{ 
                color: "#0f172a", 
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700, 
                fontSize: "1.25rem",
                letterSpacing: "-0.5px",
                display: { xs: "none", sm: "block" }
              }}
            >
              Club Marbella
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
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
              }
            }}
          >
            Admin
          </Button>
        </Box>
      </Toolbar>
    </Box>
  );
}
