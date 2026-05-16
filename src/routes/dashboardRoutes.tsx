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
import GetStaff from "@/pages/staff/GetStaff";
import StaffDetails from "@/pages/staff/StaffDetails";
import EditStaff from "@/pages/staff/EditStaff";
import StaffAttendance from "@/pages/staff/StaffAttendance";
import GetAnnouncement from "@/pages/announcement/GetAnnouncement";
import GetReport from "@/pages/report/GetReport";
import GetSettings from "@/pages/settings/GetSettings";
import GetLogs from "../pages/logs/GetLogs";
import GetFacility from "@/pages/facility/GetFacility";
import GetGateEntry from "@/pages/gate/GetGateEntry";

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
      path: "gate",
      element: <GetGateEntry />,
    },
    {
      path: "guest",
      element: <GetGuest />,
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
      path: "logs",
      element: <GetLogs />,
    },
  ],
};

export default DashboardRoutes;
