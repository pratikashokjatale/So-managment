import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Divider,
  IconButton,
  List,
  MenuItem,
  Toolbar,
  Typography,
  useTheme,
  Tooltip,
  Avatar,
  Menu,
  alpha,
  Badge,
} from "@mui/material";
import { 
  Menu as MenuIcon, 
  Palette as PaletteIcon,
  NotificationsNone as NotificationsIcon,
  PersonOutline as ProfileIcon,
  SettingsOutlined as SettingsIcon,
  HelpOutline as SupportIcon
} from "@mui/icons-material";
import { useConfig, type PresetColor } from "@/contexts/ConfigContext";
import { menuItems } from "./menuItems";
import { useAuth } from "@/contexts/AuthContext";
import { getFileUrl } from "@/utils/file";

interface TopBarProps {
  handleDrawerToggle: () => void;
  drawerWidth: number;
}

const THEME_OPTIONS: { label: string; value: PresetColor; color: string }[] = [
  { label: "Rose Pink", value: "default", color: "#e91e63" },
  { label: "Cyber Blue", value: "theme1", color: "#0077ff" },
  { label: "Deep Teal", value: "theme2", color: "#009688" },
  { label: "Royal Purple", value: "theme3", color: "#9c27b0" },
  { label: "Forest Green", value: "theme4", color: "#2e7d32" },
  { label: "Sunset Orange", value: "theme5", color: "#ff9800" },
  { label: "Slate Indigo", value: "theme6", color: "#3f51b5" },
];

export default function TopBar({
  handleDrawerToggle,
  drawerWidth,
}: TopBarProps) {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
   const { presetColor, setPresetColor } = useConfig() as any;
  const { user } = useAuth();

  const [_langAnchorEl, _setLangAnchorEl] = useState<null | HTMLElement>(null);
  const [paletteAnchorEl, setPaletteAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);

  const userName = user?.name || "Admin User";
  const userEmail = user?.email || "admin@marbellaclub.com";
  const userInitials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const currentTitle =
    menuItems.find((item) => item.path === location.pathname)?.text ||
    "Dashboard";

  return (
    <Box
      component="header"
      sx={{
        position: "fixed",
        top: 0,
        right: 0,
        zIndex: theme.zIndex.appBar,
        width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` },
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        bgcolor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: "blur(20px)",
        color: "text.primary",
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 74 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              fontSize: "1.25rem",
              letterSpacing: "-0.5px",
            }}
          >
            {currentTitle}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, sm: 1.5 },
          }}
        >
          {/* Palette Switcher */}
          <Tooltip title="Custom Theme">
            <IconButton
              onClick={(e) => setPaletteAnchorEl(e.currentTarget)}
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                color: "primary.main",
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                },
              }}
            >
              <PaletteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={paletteAnchorEl}
            open={Boolean(paletteAnchorEl)}
            onClose={() => setPaletteAnchorEl(null)}
            PaperProps={{
              sx: {
                width: 240,
                mt: 1.5,
                borderRadius: "20px",
                p: 1.5,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                border: `1px solid ${theme.palette.divider}`,
              },
            }}
          >
            <Typography
              variant="overline"
              sx={{
                px: 2,
                py: 1,
                fontWeight: 900,
                color: "text.secondary",
                display: "block",
              }}
            >
              Appearance
            </Typography>
            <List sx={{ p: 0 }}>
              {THEME_OPTIONS.map((opt) => (
                <MenuItem
                  key={opt.value}
                  onClick={() => {
                    setPresetColor(opt.value);
                    setPaletteAnchorEl(null);
                  }}
                  selected={presetColor === opt.value}
                  sx={{
                    borderRadius: "12px",
                    mb: 0.5,
                    py: 1,
                    "&.Mui-selected": {
                      bgcolor: alpha(opt.color, 0.1),
                      "&:hover": { bgcolor: alpha(opt.color, 0.2) },
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      bgcolor: opt.color,
                      mr: 2,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: presetColor === opt.value ? 800 : 500 }}
                  >
                    {opt.label}
                  </Typography>
                </MenuItem>
              ))}
            </List>
          </Menu>

          {/* Language Switcher */}
          {/* <Tooltip title="Language">
            <IconButton
              onClick={(e) => setLangAnchorEl(e.currentTarget)}
              color="inherit"
              sx={{ gap: 0.5 }}
            >
            ntSize="small" />
              <Typography
                variant="button"
                sx={{ fontWeight: 800, fontSize: "0.75rem" }}
              >
                {locale  <LanguageIcon fo}
              </Typography>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={langAnchorEl}
            open={Boolean(langAnchorEl)}
            onClose={() => setLangAnchorEl(null)}
            PaperProps={{
              sx: {
                width: 160,
                mt: 1.5,
                borderRadius: "16px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              },
            }}
          >
            <MenuItem
              onClick={() => {
                setLocale("en");
                setLangAnchorEl(null);
              }}
              selected={locale === "en"}
              sx={{ borderRadius: "8px", m: 0.5 }}
            >
              English (US)
            </MenuItem>
            <MenuItem
              onClick={() => {
                setLocale("pnb");
                setLangAnchorEl(null);
              }}
              selected={locale === "pnb"}
              sx={{ borderRadius: "8px", m: 0.5 }}
            >
              ਪੰਜਾਬੀ (Punjabi)
            </MenuItem>
          </Menu> */}

          {/* Notifications Icon */}
          <Tooltip title="Notifications">
            <IconButton
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                color: "primary.main",
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                },
              }}
            >
              <Badge badgeContent={3} color="error" sx={{ '& .MuiBadge-badge': { fontWeight: 900 } }}>
                <NotificationsIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ mx: 0.5, height: 24, alignSelf: "center" }}
          />

          <IconButton 
            onClick={(e) => setProfileAnchorEl(e.currentTarget)}
            sx={{ p: 0.5, ml: 0.5 }}
          >
            <Avatar
              src={getFileUrl(user?.photoUrl || user?.profilePhotoUrl || user?.avatar)}
              sx={{
                width: 38,
                height: 38,
                fontSize: "0.875rem",
                fontWeight: 800,
                bgcolor: "grey.200",
                color: "text.primary",
                border: `2px solid ${theme.palette.background.paper}`,
              }}
            >
              {userInitials}
            </Avatar>
          </IconButton>

          {/* Profile Dropdown Menu */}
          <Menu
            anchorEl={profileAnchorEl}
            open={Boolean(profileAnchorEl)}
            onClose={() => setProfileAnchorEl(null)}
            PaperProps={{
              sx: {
                width: 220,
                mt: 1.5,
                borderRadius: "20px",
                p: 1,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                border: `1px solid ${theme.palette.divider}`,
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "text.primary", lineHeight: 1.2 }}>
                {userName}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 0.5 }}>
                {userEmail}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  display: "inline-block", 
                  mt: 1, 
                  px: 1, 
                  py: 0.25, 
                  bgcolor: "primary.light", 
                  color: "primary.contrastText", 
                  borderRadius: "6px",
                  fontWeight: 900,
                  fontSize: "0.65rem",
                  textTransform: "uppercase"
                }}
              >
                {user?.role || "ADMIN"}
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            
            <MenuItem
              onClick={() => {
                setProfileAnchorEl(null);
                navigate('/profile');
              }}
              sx={{
                borderRadius: "12px",
                mb: 0.5,
                py: 1,
                gap: 1.5,
                "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.08) }
              }}
            >
              <ProfileIcon fontSize="small" sx={{ color: "text.secondary" }} />
              <Typography variant="body2" sx={{ fontWeight: 800, color: "#091542" }}>
                Profile
              </Typography>
            </MenuItem>

            <MenuItem
              onClick={() => {
                setProfileAnchorEl(null);
                navigate('/settings');
              }}
              sx={{
                borderRadius: "12px",
                mb: 0.5,
                py: 1,
                gap: 1.5,
                "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.08) }
              }}
            >
              <SettingsIcon fontSize="small" sx={{ color: "text.secondary" }} />
              <Typography variant="body2" sx={{ fontWeight: 800, color: "#091542" }}>
                Settings
              </Typography>
            </MenuItem>

            <MenuItem
              onClick={() => {
                setProfileAnchorEl(null);
                navigate('/support');
              }}
              sx={{
                borderRadius: "12px",
                py: 1,
                gap: 1.5,
                "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.08) }
              }}
            >
              <SupportIcon fontSize="small" sx={{ color: "text.secondary" }} />
              <Typography variant="body2" sx={{ fontWeight: 800, color: "#091542" }}>
                Support
              </Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </Box>
  );
}
