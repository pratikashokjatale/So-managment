import { useState } from "react";
import { useLocation } from "react-router-dom";
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
} from "@mui/material";
import {
  Menu as MenuIcon,
  Palette as PaletteIcon,
} from "@mui/icons-material";
import { useConfig, type PresetColor } from "@/contexts/ConfigContext";
import { menuItems } from "./menuItems";

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
  const { presetColor, setPresetColor } = useConfig() as any;

  const [_langAnchorEl, _setLangAnchorEl] = useState<null | HTMLElement>(null);
  const [paletteAnchorEl, setPaletteAnchorEl] = useState<null | HTMLElement>(
    null,
  );

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
        width: { md: `calc(100% - ${drawerWidth}px)` },
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

          <Divider
            orientation="vertical"
            flexItem
            sx={{ mx: 0.5, height: 24, alignSelf: "center" }}
          />

          <IconButton sx={{ p: 0.5, ml: 0.5 }}>
            <Avatar
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
              JD
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>
    </Box>
  );
}
