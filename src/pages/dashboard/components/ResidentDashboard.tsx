import { Box, Typography, Grid } from "@mui/material";
import GatePassCard from "./GatePassCard";
import UserProfileCard from "./UserProfileCard";
import DashboardSidebar from "./DashboardSidebar";

interface ResidentDashboardProps {
  user: any;
  userName: string;
  userInitials: string;
  qrLoading: boolean;
  qrCodeData: string | null;
  navigate: (path: string) => void;
  sidebarTab: number;
  setSidebarTab: (tab: number) => void;
  loadingSidebar: boolean;
  dbBookings: any[];
  dbFacilities: any[];
  isAdmin: boolean;
  handleBookClick: (facility: any) => void;
}

export default function ResidentDashboard({
  user,
  userName,
  userInitials,
  qrLoading,
  qrCodeData,
  navigate,
  sidebarTab,
  setSidebarTab,
  loadingSidebar,
  dbBookings,
  dbFacilities,
  isAdmin,
  handleBookClick,
}: ResidentDashboardProps) {
  return (
    <Box sx={{ mt: 2, bgcolor: "#f8fafc", minHeight: "100vh" }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h4"
          fontWeight="900"
          color="#091542"
          sx={{ mb: 1, letterSpacing: "-0.5px" }}
        >
          Welcome, {userName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Access your gate entry pass, account overview, and facilities booking here.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 380px" },
          gap: 4,
          alignItems: "stretch",
        }}
      >
        {/* Left Column */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Grid container spacing={4}>
            {/* Access QR Code Card */}
            <Grid size={{ xs: 12, md: 5 }}>
              <GatePassCard
                qrLoading={qrLoading}
                qrCodeData={qrCodeData}
                userStatus={user?.status}
              />
            </Grid>

            {/* User Details & Profile Summary */}
            <Grid size={{ xs: 12, md: 7 }}>
              <UserProfileCard
                user={user}
                initials={userInitials}
                navigate={navigate}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Right Column (Sidebar) */}
        <DashboardSidebar
          sidebarTab={sidebarTab}
          setSidebarTab={setSidebarTab}
          loadingSidebar={loadingSidebar}
          dbBookings={dbBookings}
          dbFacilities={dbFacilities}
          isAdmin={isAdmin}
          user={user}
          handleBookClick={handleBookClick}
          navigate={navigate}
        />
      </Box>
    </Box>
  );
}
