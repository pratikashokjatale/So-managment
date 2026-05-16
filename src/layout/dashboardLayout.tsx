import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  useMediaQuery,
  Avatar,
} from "@mui/material";
import { useConfig } from "@/contexts/ConfigContext";
import { menuItems } from "./menuItems";
import { alpha } from "@mui/material/styles";
import TopBar from "./TopBar";
import Loader from "@/components/Loader";



export default function DashboardLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { navType } = useConfig();

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopOpen(!desktopOpen);
    }
  };

  const currentDrawerWidth = isMobile ? 280 : (desktopOpen ? 280 : 88);

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "primary.main",
        color: "primary.contrastText",
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      <Box
        sx={{ 
          px: desktopOpen || isMobile ? 3 : 2.5, 
          py: 4, 
          display: "flex", 
          alignItems: "center", 
          gap: 1.5,
          justifyContent: desktopOpen || isMobile ? "flex-start" : "center"
        }}
      >
        <Avatar
          sx={{
            bgcolor: "white",
            color: "primary.main",
            width: 40,
            height: 40,
            boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.2)}`,
            fontWeight: 900,
            flexShrink: 0
          }}
        >
          SM
        </Avatar>
        {(desktopOpen || isMobile) && (
          <Typography
            variant="h6"
            sx={{
              color: "white",
              fontWeight: 700,
              letterSpacing: "-0.5px",
              whiteSpace: "nowrap"
            }}
          >
            Society Management
          </Typography>
        )}
      </Box>

      <List sx={{ px: desktopOpen || isMobile ? 2 : 1.5, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                selected={active}
                sx={{
                  borderRadius: "12px",
                  py: 1.5,
                  px: desktopOpen || isMobile ? 2 : 1.5,
                  justifyContent: desktopOpen || isMobile ? "initial" : "center",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  color: alpha(theme.palette.common.white, active ? 1 : 0.7),
                  "&.Mui-selected": {
                    bgcolor: alpha(theme.palette.common.white, 0.15),
                    color: "white",
                    "& .MuiListItemIcon-root": { color: "white" },
                    "&:hover": {
                      bgcolor: alpha(theme.palette.common.white, 0.2),
                    },
                  },
                  "&:hover": {
                    bgcolor: alpha(theme.palette.common.white, 0.1),
                    transform: desktopOpen || isMobile ? "translateX(6px)" : "none",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: desktopOpen || isMobile ? 42 : 0,
                    mr: desktopOpen || isMobile ? 1 : 0,
                    justifyContent: "center",
                    color: alpha(theme.palette.common.white, active ? 1 : 0.7),
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {(desktopOpen || isMobile) && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: "0.925rem",
                      fontWeight: active ? 700 : 500,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: navType === "light" ? "#f8fafc" : "background.default",
      }}
    >
      <Loader />
      <CssBaseline />
      <TopBar
        handleDrawerToggle={handleDrawerToggle}
        drawerWidth={currentDrawerWidth}
      />

      <Box
        component="nav"
        sx={{ 
          width: { md: currentDrawerWidth }, 
          flexShrink: { md: 0 },
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 280,
              backgroundImage: "none",
              border: "none",
              bgcolor: "primary.main",
              borderRadius: 0,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: currentDrawerWidth,
              borderRight: "none",
              backgroundImage: "none",
              bgcolor: "primary.main",
              borderRadius: 0,
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: "hidden"
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: { xs: 3, md: 5, lg: 6 },
          px: { xs: 2, md: 4 },
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Outlet />
      </Box>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(0.9); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(0.9); opacity: 0.8; }
          }
          .MuiListItemButton-root {
            position: relative;
            overflow: hidden;
          }
          .MuiListItemButton-root.Mui-selected::before {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 4px;
            background-color: ${theme.palette.primary.main};
          }
        `}
      </style>
    </Box>
  );
}
