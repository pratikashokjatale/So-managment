import { useState, useEffect } from "react";
import {
  Outlet,
  useNavigate,
  useLocation,
  Navigate,
  useSearchParams,
} from "react-router-dom";
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
  Breadcrumbs,
  Link,
  Paper,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Dashboard as DashboardIcon,
  NavigateNext as NavigateNextIcon,
  Business as ProjectIcon,
  VerifiedUser as AdminIcon,
  Wifi as WifiIcon,
  HeadsetMicOutlined as CrmIcon,
  BusinessCenterOutlined as ManagerIcon,
} from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import { useConfig } from "@/contexts/ConfigContext";
import { menuItems } from "./menuItems";
import TopBar from "./TopBar";
import Loader from "@/components/Loader";
import PageNotFound from "@/pages/PageNotFound";
import { getProjectsApi } from "@/apis/project";
import CRMDashboard from "@/pages/dashboard/components/CRMDashboard";

export default function DashboardLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [anchorElProject, setAnchorElProject] = useState<null | HTMLElement>(
    null,
  );
  const [anchorElRole, setAnchorElRole] = useState<null | HTMLElement>(null);
  const [currentRole, setCurrentRole] = useState("Admin (you)");
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const projectId = searchParams.get("projectId") || "all";
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getProjectsApi({ limit: 100 });
        const list =
          res?.data?.data ||
          res?.data?.projects ||
          res?.projects ||
          res?.data ||
          [];
        setProjects(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Failed to fetch projects for sidebar:", err);
      }
    };
    fetchProjects();
  }, []);

  // Sync role dropdown with current route
  useEffect(() => {
    if (location.pathname === "/") {
      setCurrentRole("Admin (you)");
    } else if (location.pathname === "/manager") {
      setCurrentRole("Manager");
    }
  }, [location.pathname]);

  const { navType } = useConfig();
  const { isLoggedIn, isAdmin, isAuthLoading, user } = useAuth();

  const getBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter(Boolean);
    if (paths.length === 0) return [];
    const items: { text: string; href: string }[] = [];
    let currentPath = "";
    paths.forEach((segment, index) => {
      currentPath += `/${segment}`;
      let text = segment.charAt(0).toUpperCase() + segment.slice(1);
      if (segment === "tower") text = "Towers";
      if (segment === "flat") text = "Flats";
      if (!isNaN(Number(segment)) || segment.length > 15) text = "Details";

      if (segment === "setup") {
        items.push({ text: "Setup", href: "#" });
      } else {
        items.push({
          text,
          href: index === paths.length - 1 ? "" : currentPath,
        });
      }
    });
    return items;
  };

  const breadcrumbs = getBreadcrumbs();
  const currentDrawerWidth = 230; // Minimized sidebar width

  if (isAuthLoading) return <Loader />;
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  // Manager role gets their own standalone page — no sidebar shell needed
  if (location.pathname === "/manager") {
    return <Outlet />;
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuToggle = (text: string) => {
    setOpenMenus((prev) => ({ ...prev, [text]: !prev[text] }));
  };

  const displayedMenuItems = isAdmin
    ? menuItems
    : [
        {
          text: "Dashboard",
          icon: <DashboardIcon />,
          path: user?.role === "MANAGER" ? "/manager" : "/",
        },
      ];

  const isAllowedPath =
    location.pathname === "/" ||
    location.pathname === "/profile" ||
    location.pathname === "/support" ||
    location.pathname === "/manager";

  // Sidebar Component rendered inside a floating card
  const sidebarContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "transparent",
        color: "#1e293b",
        overflowX: "hidden",
        pt: 2.5,
      }}
    >
      {/* Selectors matching exactly the image */}
      <Box sx={{ px: 2, mb: 2 }}>
        <Box
          onClick={(e) => setAnchorElProject(e.currentTarget)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: anchorElProject ? "#f8fafc" : "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            p: "8px 12px",
            mb: 2,
            cursor: "pointer",
            transition: "all 0.2s",
            "&:hover": { bgcolor: "#f1f5f9" },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <ProjectIcon
              sx={{
                color: "#64748b",
                fontSize: 18,
              }}
            />
            <Typography
              sx={{
                fontSize: "0.85rem",
                fontWeight: 500,
                color: "#1e293b",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                maxWidth: 120,
              }}
            >
              {projectId === "all"
                ? "All Projects"
                : projects.find((p) => p.id === projectId)?.name ||
                  "All Projects"}
            </Typography>
          </Box>
          <ExpandMoreIcon sx={{ color: "#64748b", fontSize: 16 }} />
        </Box>

        <Menu
          anchorEl={anchorElProject}
          open={Boolean(anchorElProject)}
          onClose={() => setAnchorElProject(null)}
          PaperProps={{
            elevation: 0,
            sx: {
              mt: 1,
              width: 200,
              overflow: "visible",
              filter: "drop-shadow(0px 4px 20px rgba(0,0,0,0.08))",
              borderRadius: "12px",
              border: "1px solid #f1f5f9",
            },
          }}
          transformOrigin={{ horizontal: "left", vertical: "top" }}
          anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        >
          <MenuItem
            onClick={() => {
              searchParams.set("projectId", "all");
              setSearchParams(searchParams);
              setAnchorElProject(null);
            }}
            sx={{
              fontSize: "0.85rem",
              py: 1.5,
              color: projectId === "all" ? "#1e293b" : "#475569",
              fontWeight: projectId === "all" ? 600 : 400,
              bgcolor: projectId === "all" ? "#f8fafc" : "transparent",
            }}
          >
            All Projects
          </MenuItem>
          {projects.map((proj) => (
            <MenuItem
              key={proj.id}
              onClick={() => {
                searchParams.set("projectId", proj.id);
                setSearchParams(searchParams);
                setAnchorElProject(null);
              }}
              sx={{
                fontSize: "0.85rem",
                py: 1.5,
                color: projectId === proj.id ? "#1e293b" : "#475569",
                fontWeight: projectId === proj.id ? 600 : 400,
                bgcolor: projectId === proj.id ? "#f8fafc" : "transparent",
              }}
            >
              {proj.name}
            </MenuItem>
          ))}
        </Menu>

        <Typography
          variant="overline"
          sx={{
            color: "#94a3b8",
            fontWeight: 700,
            fontSize: "0.6rem",
            letterSpacing: "0.5px",
            mb: 0.5,
            display: "block",
            textTransform: "uppercase",
          }}
        >
          VIEW AS
        </Typography>

        <Box
          onClick={(e) => setAnchorElRole(e.currentTarget)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "transparent",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            p: "8px 12px",
            cursor: "pointer",
            transition: "all 0.2s",
            "&:hover": { bgcolor: "#f1f5f9" },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {currentRole === "Admin (you)" && (
              <AdminIcon
                sx={{ color: theme.palette.primary.main, fontSize: 16 }}
              />
            )}
            {currentRole === "CRM" && (
              <CrmIcon
                sx={{ color: theme.palette.primary.main, fontSize: 16 }}
              />
            )}
            {currentRole === "Manager" && (
              <ManagerIcon
                sx={{ color: theme.palette.primary.main, fontSize: 16 }}
              />
            )}
            <Typography
              sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#1e293b" }}
            >
              {currentRole}
            </Typography>
          </Box>
          <ExpandMoreIcon sx={{ color: "#64748b", fontSize: 16 }} />
        </Box>

        <Menu
          anchorEl={anchorElRole}
          open={Boolean(anchorElRole)}
          onClose={() => setAnchorElRole(null)}
          PaperProps={{
            elevation: 0,
            sx: {
              mt: 1,
              width: 200,
              overflow: "visible",
              filter: "drop-shadow(0px 4px 20px rgba(0,0,0,0.08))",
              borderRadius: "12px",
              border: "1px solid #f1f5f9",
            },
          }}
          transformOrigin={{ horizontal: "left", vertical: "top" }}
          anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        >
          {[
            { label: "Admin (you)", icon: <AdminIcon sx={{ fontSize: 18 }} /> },
            { label: "CRM", icon: <CrmIcon sx={{ fontSize: 18 }} /> },
            { label: "Manager", icon: <ManagerIcon sx={{ fontSize: 18 }} /> },
          ].map((role) => (
            <MenuItem
              key={role.label}
              onClick={() => {
                setCurrentRole(role.label);
                setAnchorElRole(null);
                if (role.label === "Manager") {
                  navigate("/manager");
                } else if (role.label === "Admin (you)") {
                  navigate("/");
                }
              }}
              sx={{
                fontSize: "0.85rem",
                py: 1.5,
                gap: 1.5,
                color:
                  currentRole === role.label
                    ? theme.palette.primary.main
                    : "#475569",
                fontWeight: currentRole === role.label ? 600 : 400,
                bgcolor: currentRole === role.label ? "#eff6ff" : "transparent",
                borderRadius: "8px",
                mx: 1,
                my: 0.25,
                "&:hover": { bgcolor: "#f8fafc" },
              }}
            >
              {role.icon}
              {role.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {/* Navigation List styled exactly like the image */}
      <List
        sx={{ px: 1.5, flexGrow: 1, overflowY: "auto", overflowX: "hidden" }}
      >
        {displayedMenuItems.map((item) => {
          const hasChildren = item.children && item.children.length > 0;
          const isMenuOpen = openMenus[item.text] || false;
          // Check if parent or child is active
          const active =
            location.pathname === item.path ||
            (hasChildren &&
              item.children?.some((child) => location.pathname === child.path));

          return (
            <Box key={item.text}>
              <ListItem disablePadding sx={{ mb: 0.25 }}>
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
                    borderRadius: "8px",
                    py: 1,
                    px: 1.5,
                    transition: "all 0.15s ease-in-out",
                    color: active ? "#0f172a" : "#64748b",
                    bgcolor: active
                      ? theme.palette.primary.light
                      : "transparent",
                    "&.Mui-selected": {
                      bgcolor: theme.palette.primary.light,
                      color: "#0f172a",
                      "& .MuiListItemIcon-root": {
                        color: theme.palette.primary.main,
                      },
                      "&:hover": { bgcolor: "#e2e8f0" },
                    },
                    "&:hover": {
                      bgcolor: active ? "#e2e8f0" : "rgba(0,0,0,0.04)",
                      color: "#0f172a",
                      "& .MuiListItemIcon-root": {
                        color: theme.palette.primary.main,
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 32,
                      justifyContent: "flex-start",
                      color: active ? theme.palette.primary.main : "#94a3b8",
                      "& svg": { fontSize: 20 },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: "0.85rem",
                      fontWeight: active ? 700 : 500,
                      letterSpacing: "-0.1px",
                    }}
                  />
                  {hasChildren &&
                    (isMenuOpen ? (
                      <ExpandLessIcon sx={{ fontSize: 16 }} />
                    ) : (
                      <ExpandMoreIcon sx={{ fontSize: 16 }} />
                    ))}
                </ListItemButton>
              </ListItem>

              {/* Nested Sub-menus matching the style */}
              {hasChildren && (
                <Collapse in={isMenuOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ ml: 1.5 }}>
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
                            py: 0.75,
                            mb: 0.25,
                            pl: 2,
                            color: childActive ? "#0f172a" : "#64748b",
                            bgcolor: childActive
                              ? theme.palette.primary.light
                              : "transparent",
                            "&.Mui-selected": {
                              bgcolor: theme.palette.primary.light,
                              color: "#0f172a",
                              "& .MuiListItemIcon-root": {
                                color: theme.palette.primary.main,
                              },
                              "&:hover": { bgcolor: "#e2e8f0" },
                            },
                            "&:hover": {
                              bgcolor: "rgba(0,0,0,0.04)",
                              color: "#0f172a",
                            },
                          }}
                        >
                          {child.icon && (
                            <ListItemIcon
                              sx={{
                                minWidth: 28,
                                justifyContent: "flex-start",
                                color: childActive
                                  ? theme.palette.primary.main
                                  : "#94a3b8",
                                "& svg": { fontSize: 18 },
                              }}
                            >
                              {child.icon}
                            </ListItemIcon>
                          )}
                          <ListItemText
                            primary={child.text}
                            primaryTypographyProps={{
                              fontSize: "0.8rem",
                              fontWeight: childActive ? 600 : 500,
                            }}
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

      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <WifiIcon sx={{ fontSize: 14, color: "#10b981" }} />
        <Typography
          sx={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 700 }}
        >
          All gates online
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#edf1f9ff" }}>
      <Loader />
      <CssBaseline />
      <TopBar
        handleDrawerToggle={handleDrawerToggle}
        drawerWidth={currentDrawerWidth}
      />

      {/* Main container holding the single combined white card */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "1350px", // Decreased width to force larger left/right margins
          margin: "0 auto",
          px: { xs: 0, md: 4, lg: 8 }, // Margins on left and right
          pb: { xs: 0, md: 2 }, // Small margin on bottom
          pt: { xs: "50px", md: "calc(50px + 16px)" }, // Small margin on top (plus TopBar height)
          height: "100vh", // Keeps the sidebar layout strictly filling the screen height
          boxSizing: "border-box",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            width: "100%",
            height: "100%",
            bgcolor: "#ffffff",
            borderRadius: { xs: 0, md: "24px" },
            border: { xs: "none", md: "1px solid #e2e8f0" },
            overflow: "hidden",
            boxShadow: {
              xs: "none",
              md: "0 2px 8px rgba(99, 120, 160, 0.06), 0 8px 32px rgba(99, 120, 160, 0.10), 0 24px 64px rgba(99, 120, 160, 0.08)",
            },
          }}
        >
          {/* Left Sidebar embedded directly inside the card */}
          {user?.role !== "CRM" && (
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                width: currentDrawerWidth,
                flexShrink: 0,
                borderRight: "1px solid #e2e8f0",
                bgcolor: "#f8fafc",
              }}
            >
              {sidebarContent}
            </Box>
          )}

          {/* Mobile Drawer (Hidden on Desktop) */}
          {user?.role !== "CRM" && (
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
                  bgcolor: "#f8fafc",
                },
              }}
            >
              {sidebarContent}
            </Drawer>
          )}

          {/* Right Main Content Area embedded in the same card */}
          <Box
            sx={{
              flexGrow: 1,
              bgcolor: "transparent",
              overflow: "auto",
              p: user?.role === "CRM" ? 0 : { xs: 2, md: 4 },
              zoom: 0.85, // Scale down the content to make it more compact
            }}
          >
            {breadcrumbs.length > 0 && user?.role !== "CRM" && (
              <Breadcrumbs
                separator={
                  <NavigateNextIcon
                    fontSize="small"
                    sx={{ color: "#94a3b8" }}
                  />
                }
                aria-label="breadcrumb"
                sx={{ mb: 2, px: { xs: 2, md: 4 }, pt: 2 }}
              >
                {breadcrumbs.map((item, idx) => {
                  const isLast = idx === breadcrumbs.length - 1;
                  return isLast ? (
                    <Typography
                      key={idx}
                      sx={{
                        color: "#0f172a",
                        fontWeight: 600,
                        fontSize: "0.875rem",
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
                        alignItems: "center",
                      }}
                      onClick={() => {
                        if (item.href && item.href !== "#") navigate(item.href);
                      }}
                    >
                      {item.text}
                    </Link>
                  );
                })}
              </Breadcrumbs>
            )}

            {!isAdmin && !isAllowedPath ? (
              <PageNotFound
                title="Permission Denied"
                message="You do not have permission to view this page."
                showBackButton={true}
              />
            ) : (
              <Outlet />
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
