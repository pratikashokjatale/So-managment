import {
  Dashboard as DashboardIcon,
  Business as ProjectIcon,
  Domain as TowerIcon,
  DoorFront as FlatIcon,
  SettingsApplications as SetupIcon,
  People as ResidentsIcon,
  EmojiPeople as GuestIcon,
  Badge as StaffIcon,
  AssignmentInd as AllStaffIcon,
  HowToReg as AttendanceIcon,
  CardMembership as MembershipIcon,
  CalendarMonth as BookingIcon,
  Payment as PaymentIcon,
  SportsVolleyball as FacilityIcon,
  DoorBackSharp as GateIcon,
  CampaignSharp as CampaignIcon,
  Assessment as ReportIcon,
} from "@mui/icons-material";

export const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
  
  { 
    text: "Setup", 
    icon: <SetupIcon />, 
    path: "/setup",
    children: [
      { text: "Project", icon: <ProjectIcon />, path: "/project" },
      { text: "Tower", icon: <TowerIcon />, path: "/tower" },
      { text: "Flats", icon: <FlatIcon />, path: "/flat" },
    ]
  },

  { text: "Residents", icon: <ResidentsIcon />, path: "/residents" },
  { text: "Guest", icon: <GuestIcon />, path: "/guest" },
  { text: "facility", icon: <FacilityIcon />, path: "/facility" },
  
  { 
    text: "Staff", 
    icon: <StaffIcon />, 
    path: "/staff",
    children: [
      { text: "All Staff", icon: <AllStaffIcon />, path: "/staff" },
      { text: "Attendance", icon: <AttendanceIcon />, path: "/staff/attendance" }
    ]
  },

  { text: "Membership", icon: <MembershipIcon />, path: "/membership" },
  { text: "Booking", icon: <BookingIcon />, path: "/booking" },
  { text: "Payment", icon: <PaymentIcon />, path: "/payment" },
  
  { text: "Gate Entry", icon: <GateIcon />, path: "/gate" },
  { text: "Announcements", icon: <CampaignIcon />, path: "/announcements" },
  { text: "Report", icon: <ReportIcon />, path: "/report" },
];
