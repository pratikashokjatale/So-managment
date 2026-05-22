import { useState } from "react";
import { Outlet, useNavigate, useLocation, Navigate } from "react-router-dom";
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
  Collapse,
  IconButton,
  Button,
} from "@mui/material";
import { 
  ExpandLess as ExpandLessIcon, 
  ExpandMore as ExpandMoreIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import { useConfig } from "@/contexts/ConfigContext";
import { menuItems } from "./menuItems";
import { alpha } from "@mui/material/styles";
import TopBar from "./TopBar";
import Loader from "@/components/Loader";
import PageNotFound from "@/pages/PageNotFound";

export default function DashboardLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const location = useLocation();
  const { navType } = useConfig();
  const { isLoggedIn, isAdmin, isAuthLoading, logout } = useAuth();

  if (isAuthLoading) {
    return <Loader />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <Box 
        sx={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center", 
          minHeight: "100vh", 
          bgcolor: "background.default", 
          p: 3 
        }}
      >
        <PageNotFound 
          title="only admin can view" 
          message="404 - Only admin can view this dashboard." 
          showBackButton={false}
        />
        <Button 
          variant="outlined" 
          color="error" 
          onClick={logout} 
          sx={{ mt: -2, borderRadius: "12px", fontWeight: 700 }}
        >
          Logout
        </Button>
      </Box>
    );
  }

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopOpen(!desktopOpen);
    }
  };

  const handleMenuToggle = (text: string) => {
    setOpenMenus(prev => ({ ...prev, [text]: !prev[text] }));
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
            sx={{ color: "white", fontWeight: 700, letterSpacing: "-0.5px", whiteSpace: "nowrap" }}
          >
            Society Management
          </Typography>
        )}
      </Box>

      <List sx={{ px: desktopOpen || isMobile ? 2 : 1.5, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const hasChildren = item.children && item.children.length > 0;
          const isMenuOpen = openMenus[item.text] || false;
          const active = location.pathname === item.path || (hasChildren && item.children?.some(child => location.pathname === child.path));

          return (
            <Box key={item.text}>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => {
                    if (hasChildren) {
                      handleMenuToggle(item.text);
                    } else {
                      navigate(item.path);
                      if (isMobile) setMobileOpen(false);
                    }
                  }}
                  selected={active && !hasChildren}
                  sx={{
                    borderRadius: "12px",
                    py: 1.25,
                    px: desktopOpen || isMobile ? 2 : 1.5,
                    justifyContent: desktopOpen || isMobile ? "initial" : "center",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    color: alpha(theme.palette.common.white, active ? 1 : 0.7),
                    "&.Mui-selected": {
                      bgcolor: alpha(theme.palette.common.white, 0.15),
                      color: "white",
                      "& .MuiListItemIcon-root": { color: "white" },
                      "&:hover": { bgcolor: alpha(theme.palette.common.white, 0.2) },
                    },
                    "&:hover": {
                      bgcolor: alpha(theme.palette.common.white, 0.1),
                      transform: (desktopOpen || isMobile) && !hasChildren ? "translateX(6px)" : "none",
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
                    <>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{ fontSize: "0.925rem", fontWeight: active ? 700 : 500 }}
                      />
                      {hasChildren && (isMenuOpen ? <ExpandLessIcon sx={{ fontSize: 18 }} /> : <ExpandMoreIcon sx={{ fontSize: 18 }} />)}
                    </>
                  )}
                </ListItemButton>
              </ListItem>

              {hasChildren && (desktopOpen || isMobile) && (
                <Collapse in={isMenuOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ ml: 3 }}>
                    {item.children?.map((child: any) => {
                      const childActive = location.pathname === child.path;
                      return (
                        <ListItemButton
                          key={child.text}
                          onClick={() => {
                            navigate(child.path);
                            if (isMobile) setMobileOpen(false);
                          }}
                          selected={childActive}
                          sx={{
                            borderRadius: "10px",
                            py: 1,
                            mb: 0.5,
                            color: alpha(theme.palette.common.white, childActive ? 1 : 0.6),
                            "&.Mui-selected": {
                              bgcolor: alpha(theme.palette.common.white, 0.1),
                              color: "white",
                              "&:hover": { bgcolor: alpha(theme.palette.common.white, 0.15) },
                            },
                            "&:hover": { bgcolor: alpha(theme.palette.common.white, 0.05) },
                          }}
                        >
                          {child.icon && (
                            <ListItemIcon
                              sx={{
                                minWidth: 32,
                                mr: 0.5,
                                justifyContent: "center",
                                color: "inherit",
                              }}
                            >
                              {child.icon}
                            </ListItemIcon>
                          )}
                          <ListItemText
                            primary={child.text}
                            primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: childActive ? 700 : 500 }}
                          />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </Box>
          );
        })}
      </List>

      {/* Logout Action Area */}
      <Box sx={{ p: 2, borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}` }}>
        {(desktopOpen || isMobile) ? (
          <ListItemButton
            onClick={logout}
            sx={{
              borderRadius: "16px",
             
              color: "#ef4444",
              px: 2.5,
              py: 1.5,
             
            }}
          >
            <ListItemIcon sx={{ color: "#ef4444", minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontSize: "0.95rem",
                fontWeight: 900,
                letterSpacing: 0.5,
              }}
            />
          </ListItemButton>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <IconButton
              onClick={logout}
              sx={{
                bgcolor: "rgba(239, 68, 68, 0.08)",
                color: "#ef4444",
                "&:hover": {
                  bgcolor: "rgba(239, 68, 68, 0.2)",
                },
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: navType === "light" ? "#f8fafc" : "background.default" }}>
      <Loader />
      <CssBaseline />
      <TopBar handleDrawerToggle={handleDrawerToggle} drawerWidth={currentDrawerWidth} />

      <Box component="nav" sx={{ width: { md: currentDrawerWidth }, flexShrink: { md: 0 }, transition: theme.transitions.create("width", { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.enteringScreen }) }}>
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
              transition: theme.transitions.create("width", { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.enteringScreen }),
              overflowX: "hidden"
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, pt: { xs: "98px", md: "114px" }, pb: { xs: 3, md: 5 }, px: { xs: 2, md: 4 }, width: { md: `calc(100% - ${currentDrawerWidth}px)` }, transition: theme.transitions.create(["width", "margin"], { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.enteringScreen }) }}>
        <Outlet />
      </Box>
    </Box>
  );
}
