import DashboardLayout from "@/layout/dashboardLayout";
import PageNotFound from "@/pages/PageNotFound";

const OtherRoutes = {
  path: "/",
  element: <DashboardLayout />,
  children: [
    {
      path: "*",
      element: <PageNotFound />,
    },
  ],
};

export default OtherRoutes;
