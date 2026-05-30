import { useState, useEffect } from "react";
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
  Collapse,
  IconButton,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { 
  ExpandLess as ExpandLessIcon, 
  ExpandMore as ExpandMoreIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  PersonOutline as ProfileIcon,
  HelpOutline as SupportIcon,
  NavigateNext as NavigateNextIcon,
} from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import { useConfig } from "@/contexts/ConfigContext";
import { menuItems } from "./menuItems";
import TopBar from "./TopBar";
import Loader from "@/components/Loader";
import logoImg from "@/assets/logo.png";
import PageNotFound from "@/pages/PageNotFound";

const MarbellaLogo = ({ collapsed }: { collapsed?: boolean }) => (
  <Box
    sx={{
      width: collapsed ? 50 : 180,
      height: collapsed ? 32 : 120,
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease-in-out"
    }}
  >
    <Box
      component="img"
      src={logoImg}
      alt="Marbella Logo"
      sx={{
        width: "100%",
        height: "100%",
        objectFit: "contain"
      }}
    />
  </Box>
);

export default function DashboardLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const location = useLocation();
  const { navType } = useConfig();
  const { isLoggedIn, isAdmin, isAuthLoading, logout, user } = useAuth();

  const getBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter(Boolean);
    if (paths.length === 0) {
      return [{ text: "Dashboard", href: "/" }];
    }

    const items = [{ text: "Dashboard", href: "/" }];

    // If it's one of the setup items
    const firstSegment = paths[0];
    if (["project", "tower", "flat"].includes(firstSegment)) {
      items.push({ text: "Setup", href: "#" });
    }

    let currentPath = "";
    paths.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      let text = segment.charAt(0).toUpperCase() + segment.slice(1);
      if (segment === "tower") text = "Towers";
      if (segment === "flat") text = "Flats";
      if (segment === "residents") text = "Residents";
      if (segment === "membership") text = "Membership";
      if (segment === "booking") text = "Booking";
      if (segment === "payment") text = "Payment";
      if (segment === "facility") text = "Facility";
      if (segment === "gate") text = "Gate Entry";
      if (segment === "guest") text = "Guest";
      if (segment === "staff") text = "Staff";
      if (segment === "announcements") text = "Announcements";
      if (segment === "report") text = "Report";
      if (segment === "profile") text = "Profile";
      if (segment === "support") text = "Support";
      
      // If it's numeric or has uuid format, show "Details"
      if (!isNaN(Number(segment)) || segment.length > 15) {
        text = "Details";
      }

      items.push({
        text,
        href: index === paths.length - 1 ? "" : currentPath
      });
    });

    return items;
  };

  const breadcrumbs = getBreadcrumbs();

  const currentDrawerWidth = isMobile ? 280 : (desktopOpen ? 280 : 88);

  useEffect(() => {
    document.body.style.setProperty("--sidebar-width", `${currentDrawerWidth}px`);
    return () => {
      document.body.style.removeProperty("--sidebar-width");
    };
  }, [currentDrawerWidth]);

  useEffect(() => {
    const handleSetSidebar = (e: any) => {
      if (typeof e.detail === 'boolean') {
        setDesktopOpen(e.detail);
      }
    };
    window.addEventListener('set-sidebar', handleSetSidebar);
    return () => window.removeEventListener('set-sidebar', handleSetSidebar);
  }, []);

  if (isAuthLoading) {
    return <Loader />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
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
  const displayedMenuItems = isAdmin
    ? [
        ...menuItems,
        { text: "Profile", icon: <ProfileIcon />, path: "/profile" },
        { text: "Support", icon: <SupportIcon />, path: "/support" }
      ]
    : [
        { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
        { text: "Profile", icon: <ProfileIcon />, path: "/profile" },
        { text: "Support", icon: <SupportIcon />, path: "/support" }
      ];

  const isAllowedPath = 
    location.pathname === "/" || 
    location.pathname === "/profile" || 
    location.pathname === "/support";

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#091542ff",
        color: "rgba(255, 255, 255, 0.9)",
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      <Box
        sx={{ 
          px: desktopOpen || isMobile ? 3 : 2, 
          pt: 3,
          pb: 2.5,
          display: "flex", 
          flexDirection: "column",
          alignItems: "center", 
          gap: 1.5,
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          mb: 2,
          justifyContent: "center"
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <MarbellaLogo collapsed={!(desktopOpen || isMobile)} />
        </Box>
        {(desktopOpen || isMobile) && (
          <Box sx={{ textAlign: "center", mt: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
            <Typography
              variant="h5"
              sx={{ 
                color: "#f0f0efff", 
                fontWeight: 900, 
                letterSpacing: "4px", 
                fontFamily: "'Georgia', serif",
                textTransform: "uppercase",
                fontSize: "1.1rem",
                lineHeight: 1.2
              }}
            >
             - Marbella -
            </Typography>
          
            <Box 
              sx={{ 
                border: "1px solid #dfb76c", 
                px: 1.5, 
                py: 0.25, 
                borderRadius: "4px",
                mt: 0.75,
                display: "inline-block"
              }}
            >
              <Typography
                variant="caption"
                sx={{ 
                  color: "#dfb76c", 
                  fontWeight: 900, 
                  letterSpacing: "2px", 
                  textTransform: "uppercase",
                  fontSize: "0.6rem",
                  display: "block"
                }}
              >
                {isAdmin ? "Admin Panel" : `${user?.role || "User"} Portal`}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      <List sx={{ px: desktopOpen || isMobile ? 2 : 1.5, flexGrow: 1 }}>
        {displayedMenuItems.map((item) => {
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
                    color: active ? "#ffffff" : "#94a3b8",
                    borderLeft: active && (desktopOpen || isMobile) ? "4px solid #dfb76c" : "4px solid transparent",
                    pl: active && (desktopOpen || isMobile) ? "12px" : (desktopOpen || isMobile ? "16px" : "12px"),
                    bgcolor: active ? "rgba(255, 255, 255, 0.08)" : "transparent",
                    "&.Mui-selected": {
                      bgcolor: "rgba(255, 255, 255, 0.08)",
                      color: "white",
                      "& .MuiListItemIcon-root": { color: "#dfb76c" },
                      "&:hover": { bgcolor: "rgba(255, 255, 255, 0.12)" },
                    },
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.04)",
                      color: "white",
                      "& .MuiListItemIcon-root": { color: "#dfb76c" },
                      transform: (desktopOpen || isMobile) && !hasChildren ? "translateX(4px)" : "none",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: desktopOpen || isMobile ? 42 : 0,
                      mr: desktopOpen || isMobile ? 1 : 0,
                      justifyContent: "center",
                      color: active ? "#dfb76c" : "#94a3b8",
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
                            color: childActive ? "#ffffff" : "#94a3b8",
                            "&.Mui-selected": {
                              bgcolor: "rgba(255, 255, 255, 0.08)",
                              color: "white",
                              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.12)" },
                            },
                            "&:hover": { bgcolor: "rgba(255, 255, 255, 0.04)", color: "white" },
                          }}
                        >
                          {child.icon && (
                            <ListItemIcon
                              sx={{
                                minWidth: 32,
                                mr: 0.5,
                                justifyContent: "center",
                                color: childActive ? "#dfb76c" : "inherit",
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

      <Box sx={{ p: 2, borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
        {(desktopOpen || isMobile) ? (
          <ListItemButton
            onClick={logout}
            sx={{
              borderRadius: "16px",
              color: "#ef4444",
              px: 2.5,
              py: 1.5,
              "&:hover": {
                bgcolor: "rgba(239, 68, 68, 0.08)",
              }
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
              background: "#091542ff",
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
              background: "#091542ff",
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
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" sx={{ color: "#94a3b8" }} />} 
          aria-label="breadcrumb"
          sx={{ mb: 3 }}
        >
          {breadcrumbs.map((item, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return isLast ? (
              <Typography 
                key={idx} 
                sx={{ 
                  color: "#0f172a", 
                  fontWeight: 600,
                  fontSize: "0.875rem"
                }}
              >
                {item.text}
              </Typography>
            ) : (
              <Link
                key={idx}
                underline="hover"
                sx={{ 
                  color: "#64748b", 
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  cursor: item.href === "#" ? "default" : "pointer",
                  display: "flex",
                  alignItems: "center"
                }}
                onClick={() => {
                  if (item.href && item.href !== "#") {
                    navigate(item.href);
                  }
                }}
              >
                {item.text}
              </Link>
            );
          })}
        </Breadcrumbs>

        {!isAdmin && !isAllowedPath ? (
          <PageNotFound 
            title="Permission Denied" 
            message="You do not have permission to view this page. Please contact your administrator if you believe this is an error."
            showBackButton={true}
          />
        ) : (
          <Outlet />
        )}
      </Box>
    </Box>
  );
}
