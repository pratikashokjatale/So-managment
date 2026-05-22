import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Chip,
  Breadcrumbs,
  Link,
  Avatar,
  CircularProgress,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Security as RoleIcon,
  CheckCircle as ActiveIcon,
  CalendarToday as DateIcon,
  VerifiedUser as VerifiedIcon,
  History as LoginIcon,
  Home as FlatIcon,
} from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import { getCachedMe } from "@/utils/apiCache";

export default function GetProfile() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user: contextUser } = useAuth();
  const [user, setUser] = useState<any>(contextUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await getCachedMe();
        const freshUser = res?.data?.user || res?.user || res?.data || res;
        if (freshUser) {
          setUser(freshUser);
        }
      } catch (error) {
        console.error("Failed to fetch profile details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const userName = user?.name || "User";
  const userInitials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (loading && !user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#f8fafc",
        }}
      >
        <CircularProgress size={60} thickness={4} sx={{ color: "#002855" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, bgcolor: "#f8fafc", minHeight: "100vh" }}>
      {/* Page Header */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" fontWeight="900" color="#002855" sx={{ mb: 1 }}>
          Profile
        </Typography>
        <Breadcrumbs separator=">" sx={{ fontWeight: 600 }}>
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate("/")}
            sx={{ cursor: "pointer" }}
          >
            Dashboard
          </Link>
          <Typography color="text.primary" fontWeight="800">
            User Account
          </Typography>
        </Breadcrumbs>
      </Box>

      <Grid container spacing={4}>
        {/* Profile Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: "32px",
              border: `1px solid ${theme.palette.divider}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              bgcolor: "white",
              boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
            }}
          >
            <Avatar
              sx={{
                width: 120,
                height: 120,
                fontSize: "2.5rem",
                fontWeight: 900,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: "primary.main",
                mb: 3,
                border: `4px solid ${alpha(theme.palette.primary.main, 0.05)}`,
              }}
            >
              {userInitials}
            </Avatar>

            <Typography variant="h5" fontWeight="900" color="#002855" sx={{ mb: 1 }}>
              {userName}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {user?.email}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip
                icon={<RoleIcon sx={{ fontSize: "14px !important" }} />}
                label={user?.role || "ADMIN"}
                sx={{
                  bgcolor: "#eff6ff",
                  color: "#1e40af",
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  borderRadius: "10px",
                }}
              />
              <Chip
                icon={<ActiveIcon sx={{ fontSize: "14px !important" }} />}
                label={user?.status || "ACTIVE"}
                sx={{
                  bgcolor: "#f0fdf4",
                  color: "#166534",
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  borderRadius: "10px",
                }}
              />
            </Stack>
          </Paper>
        </Grid>

        {/* Profile Details Grid */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 5,
              borderRadius: "32px",
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: "white",
              boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
            }}
          >
            <Typography variant="h5" fontWeight="900" color="#002855" sx={{ mb: 4 }}>
              Account Information
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={1}>
                  <Typography variant="caption" fontWeight="800" color="text.secondary" sx={{ textTransform: "uppercase" }}>
                    Full Name
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography variant="body1" fontWeight="700" color="#002855">
                      {userName}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={1}>
                  <Typography variant="caption" fontWeight="800" color="text.secondary" sx={{ textTransform: "uppercase" }}>
                    Email Address
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <EmailIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                    <Typography variant="body1" fontWeight="700" color="#002855">
                      {user?.email || "N/A"}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={1}>
                  <Typography variant="caption" fontWeight="800" color="text.secondary" sx={{ textTransform: "uppercase" }}>
                    Phone Number
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <PhoneIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                    <Typography variant="body1" fontWeight="700" color="#002855">
                      {user?.phone || "N/A"}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={1}>
                  <Typography variant="caption" fontWeight="800" color="text.secondary" sx={{ textTransform: "uppercase" }}>
                    Flat Assignment
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <FlatIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                    <Typography variant="body1" fontWeight="700" color="#002855">
                      {user?.flatId || "No Flat Assigned"}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" fontWeight="900" color="#002855" sx={{ mb: 3 }}>
              Audit & Verification
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={1}>
                  <Typography variant="caption" fontWeight="800" color="text.secondary" sx={{ textTransform: "uppercase" }}>
                    Last Login
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <LoginIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                    <Typography variant="body2" fontWeight="700" color="#002855">
                      {formatDate(user?.lastLoginAt)}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={1}>
                  <Typography variant="caption" fontWeight="800" color="text.secondary" sx={{ textTransform: "uppercase" }}>
                    Email Verified At
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <VerifiedIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                    <Typography variant="body2" fontWeight="700" color="#002855">
                      {formatDate(user?.emailVerifiedAt)}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={1}>
                  <Typography variant="caption" fontWeight="800" color="text.secondary" sx={{ textTransform: "uppercase" }}>
                    Member Since
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <DateIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                    <Typography variant="body2" fontWeight="700" color="#002855">
                      {formatDate(user?.createdAt)}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={1}>
                  <Typography variant="caption" fontWeight="800" color="text.secondary" sx={{ textTransform: "uppercase" }}>
                    Last Account Update
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <DateIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                    <Typography variant="body2" fontWeight="700" color="#002855">
                      {formatDate(user?.updatedAt)}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
