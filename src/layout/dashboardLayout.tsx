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
import logoImg from "@/assets/logo.jpeg";
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

  const currentDrawerWidth = isMobile ? 260 : (desktopOpen ? 260 : 80);

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
    ? menuItems
    : [
        { text: "Dashboard", icon: <DashboardIcon />, path: "/" }
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
        background: "rgb(7, 43, 74)", // Premium blue-slate background
        color: "rgba(255, 255, 255, 0.9)",
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      {/* Sidebar Header Branding */}
      <Box
        sx={{ 
          px: 2.5, 
          py: 3,
          display: "flex", 
          alignItems: "center",
          gap: 2,
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          mb: 2,
          width: "100%"
        }}
      >
        <Box 
          component="img"
          src={logoImg}
          alt="Logo"
          sx={{
            width: 34,
            height: 34,
            borderRadius: "8px",
            objectFit: "cover",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
          }}
        />
        {(desktopOpen || isMobile) && (
          <Typography
            variant="h6"
            sx={{ 
              color: "white", 
              fontWeight: 900, 
              fontSize: "1.25rem",
              letterSpacing: "-0.5px"
            }}
          >
           Marbella Grand
          </Typography>
        )}
      </Box>

      <List sx={{ px: 2, flexGrow: 1 }}>
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
                    borderRadius: "10px",
                    py: 0.75, // Smaller padding
                    px: desktopOpen || isMobile ? 2 : 1.5,
                    justifyContent: desktopOpen || isMobile ? "initial" : "center",
                    transition: "all 0.15s ease-in-out",
                    color: active ? "#ffffff" : "#94a3b8",
                    bgcolor: active ? "rgba(255, 255, 255, 0.15)" : "transparent",
                    "&.Mui-selected": {
                      bgcolor: "rgba(255, 255, 255, 0.15)",
                      color: "white",
                      "& .MuiListItemIcon-root": { color: "#ffffff" },
                      "&:hover": { bgcolor: "rgba(255, 255, 255, 0.22)" },
                    },
                    "&:hover": {
                      bgcolor: active ? "rgba(255, 255, 255, 0.22)" : "rgba(255, 255, 255, 0.05)",
                      color: "white",
                      "& .MuiListItemIcon-root": { color: "#ffffff" },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: desktopOpen || isMobile ? 32 : 0, // Narrower icon container
                      mr: desktopOpen || isMobile ? 1 : 0, // Reduced margin
                      justifyContent: "center",
                      color: active ? "#ffffff" : "#94a3b8",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {(desktopOpen || isMobile) && (
                    <>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: active ? 700 : 500 }} // Smaller font size
                      />
                      {hasChildren && (isMenuOpen ? <ExpandLessIcon sx={{ fontSize: 16 }} /> : <ExpandMoreIcon sx={{ fontSize: 16 }} />)}
                    </>
                  )}
                </ListItemButton>
              </ListItem>

              {hasChildren && (desktopOpen || isMobile) && (
                <Collapse in={isMenuOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ ml: 2.5 }}>
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
                            borderRadius: "8px",
                            py: 0.5, // Smaller padding
                            mb: 0.5,
                            color: childActive ? "#ffffff" : "#94a3b8",
                            bgcolor: childActive ? "rgba(255, 255, 255, 0.05)" : "transparent",
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
                                minWidth: 24, // Narrower icon container
                                mr: 0.75, // Reduced margin
                                justifyContent: "center",
                                color: childActive ? "#ffffff" : "#94a3b8",
                              }}
                            >
                              {child.icon}
                            </ListItemIcon>
                          )}
                          <ListItemText
                            primary={child.text}
                            primaryTypographyProps={{ fontSize: "0.8rem", fontWeight: childActive ? 700 : 500 }} // Smaller font size
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

      <Box sx={{ p: 2, borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}>
        {(desktopOpen || isMobile) ? (
          <ListItemButton
            onClick={logout}
            sx={{
              borderRadius: "12px",
              color: "#ef4444",
              px: 2,
              py: 1.25,
              "&:hover": {
                bgcolor: "rgba(239, 68, 68, 0.08)",
              }
            }}
          >
            <ListItemIcon sx={{ color: "#ef4444", minWidth: 36 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Log out"
              primaryTypographyProps={{
                fontSize: "0.9rem",
                fontWeight: 700,
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
              background: "rgba(19, 104, 179, 0.6)",
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
              background: "rgb(7, 43, 74)",
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

      <Box component="main" sx={{ flexGrow: 1, pt: { xs: "84px", md: "92px" }, pb: { xs: 3, md: 5 }, px: { xs: 2, md: 4 }, width: { md: `calc(100% - ${currentDrawerWidth}px)` }, transition: theme.transitions.create(["width", "margin"], { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.enteringScreen }) }}>
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" sx={{ color: "#94a3b8" }} />} 
          aria-label="breadcrumb"
          sx={{ mb: 1.5 }}
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
