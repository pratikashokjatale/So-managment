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
  ReportProblem as IssueIcon,
  Groups as GroupsIcon,
  Emergency as EmergencyIcon,
  BarChart as AnalyticsIcon,
  Security as RolesIcon,
  WorkspacePremium as CrownIcon,
  CreditCard as CardIcon,
} from "@mui/icons-material";

export const menuItems = [
    { text: "Overview", icon:  <DashboardIcon />, path: "/" },
    { text: "Analytics", icon: <AnalyticsIcon />, path: "/analytics" },
    { text: "Access & Cards", icon: <CardIcon />, path: "/access" },
     {
        text: "Attendance",
        icon: <AttendanceIcon />,
        path: "/staff/attendance",
      },
    { text: "VIP Pass", icon: <CrownIcon />, path: "/vip-pass" },
  { text: "Announcements", icon: <CampaignIcon />, path: "/announcements" },

  

  {
    text: "Setup",
    icon: <SetupIcon />,
    path: "/setup",
    children: [
      { text: "Project", icon: <ProjectIcon />, path: "/project" },
      { text: "Tower", icon: <TowerIcon />, path: "/tower" },
      { text: "Flats", icon: <FlatIcon />, path: "/flat" },
    ],
  },
  { text: "Roles & Permissions", icon: <RolesIcon />, path: "/setup/roles" },
  { text: "facility", icon: <FacilityIcon />, path: "/facility" },

  {
    text: "User Management",
    icon: <ResidentsIcon />,
    path: "/residents",
    children: [
      { text: "Residents", icon: <ResidentsIcon />, path: "/residents" },
      { text: "Guest", icon: <GuestIcon />, path: "/guest" },
      {
        text: "Accounts Creation",
        icon: <ResidentsIcon />,
        path: "/demo-accounts",
      },
    ],
  },

  {
    text: "Staff",
    icon: <StaffIcon />,
    path: "/staff",
    children: [
      { text: "All Staff", icon: <AllStaffIcon />, path: "/staff" },
      {
        text: "Attendance",
        icon: <AttendanceIcon />,
        path: "/staff/attendance",
      },
    ],
  },

  {
    text: "Club Management",
    icon: <GroupsIcon />,
    path: "/membership",
    children: [
      {
        text: "All Memberships",
        icon: <MembershipIcon />,
        path: "/membership",
      },
      { text: "Booking", icon: <BookingIcon />, path: "/booking" },
      { text: "Payment", icon: <PaymentIcon />, path: "/payment" },
    ],
  },
  {
    text: "Emergency",
    icon: <EmergencyIcon />,
    path: "/emergency",
  },

  { text: "Issues & Feedback", icon: <IssueIcon />, path: "/issues" },

  // { text: "Gate Entry", icon: <GateIcon />, path: "/gate" },
  { text: "Announcements", icon: <CampaignIcon />, path: "/announcements" },
  { text: "Report", icon: <ReportIcon />, path: "/report" },
];
