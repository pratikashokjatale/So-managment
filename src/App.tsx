import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "@/routes";
import { Box } from "@mui/material";
import { Toaster } from "react-hot-toast";

function App() {
  const router = createBrowserRouter(routes);

  return (
    <Box>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </Box>
  );
}

export default App;
