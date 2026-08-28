import { Navigate } from "react-router-dom";
import ManagerLayout from "@/layout/ManagerLayout";
import ManagerDashboard from "@/pages/dashboard/manager-dashboard/ManagerDashboard";

const ManagerRoutes = {
  path: "/",
  element: <ManagerLayout />,
  children: [
    {
      path: "manager",
      element: <ManagerDashboard />,
    },
  ],
};

export default ManagerRoutes;
