import DashboardLayout from "@/layout/dashboardLayout";
import Dashboard from "@/pages/dashboard";
import GetResident from "@/pages/residents/GetResident";
import AddResident from "@/pages/residents/AddResident";
import ResidentDetails from "@/pages/residents/ResidentDetails";
import EditResident from "@/pages/residents/EditResident";
import GetMembership from "@/pages/membership/GetMembership";
import AddMembership from "@/pages/membership/AddMembership";
import GetBooking from "@/pages/booking/GetBooking";
import BookingCalendar from "@/pages/booking/BookingCalendar";
import GetPayment from "@/pages/payment/GetPayment";
import GetGuest from "@/pages/guest/GetGuest";
import AddGuest from "@/pages/guest/AddGuest";
import GuestDetails from "@/pages/guest/GuestDetails";
import EditGuest from "@/pages/guest/EditGuest";
import GetStaff from "@/pages/staff/GetStaff";
import StaffDetails from "@/pages/staff/StaffDetails";
import EditStaff from "@/pages/staff/EditStaff";
import StaffAttendance from "@/pages/staff/StaffAttendance";
import GetAnnouncement from "@/pages/announcement/GetAnnouncement";
import GetReport from "@/pages/report/GetReport";
import GetSettings from "@/pages/settings/GetSettings";
import GetSupport from "@/pages/support/GetSupport";
import GetLogs from "@/pages/logs/GetLogs";
import GetFacility from "@/pages/facility/GetFacility";
import AddFacility from "@/pages/facility/AddFacility";
import FacilityDetails from "@/pages/facility/FacilityDetails";
import EditFacility from "@/pages/facility/EditFacility";
import GetGateEntry from "@/pages/gate/GetGateEntry";
import GetProject from "@/pages/project/GetProject";
import AddProject from "@/pages/project/AddProject";
import EditProject from "@/pages/project/EditProject";
import ProjectDetails from "@/pages/project/ProjectDetails";
import GetTower from "@/pages/tower/GetTower";
import AddTower from "@/pages/tower/AddTower";
import EditTower from "@/pages/tower/EditTower";
import TowerDetails from "@/pages/tower/TowerDetails";
import GetFlat from "@/pages/flat/GetFlat";
import AddFlat from "@/pages/flat/AddFlat";
import EditFlat from "@/pages/flat/EditFlat";

const DashboardRoutes = {
  path: "/",
  element: <DashboardLayout />,
  children: [
    {
      index: true,
      element: <Dashboard />,
    },
    {
      path: "residents",
      element: <GetResident />,
    },
    {
      path: "residents/add",
      element: <AddResident />,
    },
    {
      path: "residents/:id",
      element: <ResidentDetails />,
    },
    {
      path: "residents/edit/:id",
      element: <EditResident />,
    },
    {
      path: "membership",
      element: <GetMembership />,
    },
    {
      path: "membership/add",
      element: <AddMembership />,
    },
    {
      path: "booking",
      element: <GetBooking />,
    },
    {
      path: "booking/calendar",
      element: <BookingCalendar />,
    },
    {
      path: "payment",
      element: <GetPayment />,
    },
    {
      path: "facility",
      element: <GetFacility />,
    },
    {
      path: "facility/add",
      element: <AddFacility />,
    },
    {
      path: "facility/:id",
      element: <FacilityDetails />,
    },
    {
      path: "facility/edit/:id",
      element: <EditFacility />,
    },
    {
      path: "gate",
      element: <GetGateEntry />,
    },
    {
      path: "guest",
      element: <GetGuest />,
    },
    {
      path: "guest/add",
      element: <AddGuest />,
    },
    {
      path: "guest/:id",
      element: <GuestDetails />,
    },
    {
      path: "guest/edit/:id",
      element: <EditGuest />,
    },
    {
      path: "staff",
      element: <GetStaff />,
    },
    {
      path: "staff/attendance",
      element: <StaffAttendance />,
    },
    {
      path: "staff/add",
      element: <EditStaff />,
    },
    {
      path: "staff/:id",
      element: <StaffDetails />,
    },
    {
      path: "staff/edit/:id",
      element: <EditStaff />,
    },
    {
      path: "announcements",
      element: <GetAnnouncement />,
    },
    {
      path: "report",
      element: <GetReport />,
    },
    {
      path: "settings",
      element: <GetSettings />,
    },
    {
      path: "support",
      element: <GetSupport />,
    },
    {
      path: "logs",
      element: <GetLogs />,
    },
    {
      path: "project",
      element: <GetProject />,
    },
    {
      path: "project/add",
      element: <AddProject />,
    },
    {
      path: "project/edit/:id",
      element: <EditProject />,
    },
    {
      path: "project/:id",
      element: <ProjectDetails />,
    },
    {
      path: "tower",
      element: <GetTower />,
    },
    {
      path: "tower/add",
      element: <AddTower />,
    },
    {
      path: "tower/edit/:id",
      element: <EditTower />,
    },
    {
      path: "tower/:id",
      element: <TowerDetails />,
    },
    {
      path: "flat",
      element: <GetFlat />,
    },
    {
      path: "flat/add",
      element: <AddFlat />,
    },
    {
      path: "flat/edit/:id",
      element: <EditFlat />,
    },
  ],
};

export default DashboardRoutes;
