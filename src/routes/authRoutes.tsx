import AuthLayout from "@/layout/authLayout";
import LoginPage from "@/pages/auth/LoginPage";

const AuthRoutes = {
  path: "/login",
  element: <AuthLayout />,
  children: [
    {
      index: true,
      element: <LoginPage />,
    },
  ],
};

export default AuthRoutes;
