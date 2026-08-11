import { Outlet } from "react-router-dom";

// Thin wrapper — ManagerDashboard handles its own auth guard and full layout
export default function ManagerLayout() {
  return <Outlet />;
}
