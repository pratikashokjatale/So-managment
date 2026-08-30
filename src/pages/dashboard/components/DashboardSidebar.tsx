import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Stack,
  CircularProgress,
  Avatar,
  Button,
  Chip,
} from "@mui/material";
import {
  SportsTennis as TennisIcon,
  FitnessCenter as GymIcon,
  Movie as CinemaIcon,
  Spa as SpaIcon,
  SelfImprovement as YogaIcon,
  Pool as PoolIcon,
  Park as ParkIcon,
  Circle as CircleIcon,
} from "@mui/icons-material";
import { getFileUrl } from "@/utils/file";

interface DashboardSidebarProps {
  sidebarTab: number;
  setSidebarTab: (tab: number) => void;
  loadingSidebar: boolean;
  dbBookings: any[];
  dbFacilities: any[];
  isAdmin: boolean;
  user: any;
  handleBookClick: (facility: any) => void;
  navigate: (path: string) => void;
}

function getFacilityIcon(iconName: string) {
  switch (iconName) {
    case "SportsTennis":
      return <TennisIcon sx={{ color: "#24528C" }} />;
    case "FitnessCenter":
      return <GymIcon sx={{ color: "#ea580c" }} />;
    case "Movie":
      return <CinemaIcon sx={{ color: "#7A4FB5" }} />;
    case "Spa":
      return <SpaIcon sx={{ color: "#7A4FB5" }} />;
    case "SelfImprovement":
      return <YogaIcon sx={{ color: "#7A4FB5" }} />;
    case "Pool":
      return <PoolIcon sx={{ color: "#06b6d4" }} />;
    case "Park":
      return <ParkIcon sx={{ color: "#10b981" }} />;
    default:
      return <CircleIcon sx={{ color: "#94a3b8" }} />;
  }
}

export default function DashboardSidebar({
  sidebarTab,
  setSidebarTab,
  loadingSidebar,
  dbBookings,
  dbFacilities,
  isAdmin,
  user,
  handleBookClick,
  navigate,
}: DashboardSidebarProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        border: "1px solid #f1f5f9",
        borderRadius: "16px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "white",
      }}
    >
      <Typography
        variant="subtitle1"
        fontWeight="800"
        color="#091542"
        sx={{ mb: 2 }}
      >
        Activities & Bookings
      </Typography>

      <Tabs
        value={sidebarTab}
        onChange={(_, newValue) => setSidebarTab(newValue)}
        sx={{
          mb: 3,
          borderBottom: "1px solid #f1f5f9",
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 800,
            fontSize: "0.85rem",
            minWidth: "auto",
            flex: 1,
          },
          "& .Mui-selected": { color: "#24528C !important" },
          "& .MuiTabs-indicator": { backgroundColor: "#24528C" },
        }}
      >
        <Tab label="Upcoming Bookings" />
        <Tab label="Available Facilities" />
      </Tabs>

      <Box
        sx={{
          flexGrow: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {loadingSidebar ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 4,
              flexGrow: 1,
              alignItems: "center",
            }}
          >
            <CircularProgress size={30} sx={{ color: "#24528C" }} />
          </Box>
        ) : sidebarTab === 0 ? (
          /* Bookings Tab */
          <Stack
            spacing={2}
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              maxHeight: "590px",
              pr: 0.5,
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#cbd5e1",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#94a3b8",
              },
            }}
          >
            {dbBookings.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="600"
                >
                  No upcoming bookings.
                </Typography>
                <Button
                  variant="text"
                  onClick={() => setSidebarTab(1)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 800,
                    mt: 1,
                    color: "#24528C",
                  }}
                >
                  Book a Facility
                </Button>
              </Box>
            ) : (
              dbBookings.map((booking: any) => {
                const facilityName = booking.facility?.name || "Facility";
                const iconName = booking.facility?.iconKey || "";

                // Format Date nicely
                let formattedDate = booking.bookingDate || "";
                if (formattedDate) {
                  try {
                    const d = new Date(formattedDate);
                    formattedDate = d.toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    });
                  } catch (e) {}
                }
                const timeStr = `${booking.startTime?.substring(
                  0,
                  5,
                )} - ${booking.endTime?.substring(0, 5)}`;

                return (
                  <Box
                    key={booking.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 1.5,
                      borderRadius: "12px",
                      border: "1px solid #f1f5f9",
                      bgcolor: "#f8fafc",
                    }}
                  >
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "10px",
                        bgcolor: "white",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      {getFacilityIcon(iconName)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        fontWeight="800"
                        color="#1e293b"
                        noWrap
                      >
                        {facilityName}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight="700"
                        display="block"
                      >
                        {formattedDate} | {timeStr}
                      </Typography>
                      {isAdmin && (
                        <Typography
                          variant="caption"
                          color="#24528C"
                          fontWeight="700"
                          display="block"
                        >
                          User: {booking.user?.name || "Resident"}
                        </Typography>
                      )}
                    </Box>
                    <Chip
                      label={booking.status}
                      size="small"
                      color={
                        booking.status === "CONFIRMED"
                          ? "success"
                          : booking.status === "PENDING"
                            ? "warning"
                            : "default"
                      }
                      sx={{
                        fontSize: "0.65rem",
                        fontWeight: 900,
                        height: 20,
                        borderRadius: "6px",
                      }}
                    />
                  </Box>
                );
              })
            )}
          </Stack>
        ) : (
          /* Facilities Tab */
          <Stack
            spacing={2}
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              maxHeight: "340px",
              pr: 0.5,
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#cbd5e1",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#94a3b8",
              },
            }}
          >
            {dbFacilities.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No active facilities available.
                </Typography>
              </Box>
            ) : (
              dbFacilities.map((facility: any) => {
                const priceStr =
                  facility.priceLabel ||
                  (facility.priceAmount
                    ? `₹${
                        facility.priceAmount
                      }/${facility.pricingModel?.toLowerCase() === "hourly" ? "hr" : "session"}`
                    : "Free");

                return (
                  <Box
                    key={facility.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 1.5,
                      borderRadius: "12px",
                      border: "1px solid transparent",
                      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        bgcolor: "#f8fafc",
                        borderColor: "#f1f5f9",
                        boxShadow: "0 4px 12px rgba(9, 21, 66, 0.02)",
                      },
                    }}
                  >
                    <Avatar
                      variant="rounded"
                      src={
                        facility.images?.[0]
                          ? getFileUrl(facility.images[0])
                          : undefined
                      }
                      imgProps={{ crossOrigin: "anonymous" }}
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "10px",
                        bgcolor: "#EAF0F7",
                      }}
                    >
                      {getFacilityIcon(facility.iconKey)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        fontWeight="800"
                        color="#1e293b"
                        noWrap
                      >
                        {facility.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight="700"
                        display="block"
                      >
                        {facility.location || "Clubhouse"} • {priceStr}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleBookClick(facility)}
                      sx={{
                        borderRadius: "8px",
                        textTransform: "none",
                        fontWeight: 800,
                        fontSize: "0.75rem",
                        borderColor: "#e2e8f0",
                        color: "#24528C",
                        minWidth: 60,
                        transition: "all 0.2s",
                        "&:hover": {
                          bgcolor: "#EAF0F7",
                          borderColor: "#EAF0F7",
                        },
                      }}
                    >
                      Book
                    </Button>
                  </Box>
                );
              })
            )}
          </Stack>
        )}
      </Box>

      <Box sx={{ mt: "auto", pt: 3 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate(sidebarTab === 0 ? "/booking" : "/facility")}
          sx={{
            borderRadius: "10px",
            py: 1.25,
            fontWeight: 800,
            textTransform: "none",
            bgcolor: "#24528C",
            color: "white",
            boxShadow: "none",
            transition: "all 0.2s",
            "&:hover": {
              bgcolor: "#003bb3",
              boxShadow: "0 6px 16px rgba(0, 71, 179, 0.2)",
            },
          }}
        >
          {sidebarTab === 0 ? "View All Bookings" : "View All Facilities"}
        </Button>
      </Box>
    </Paper>
  );
}
