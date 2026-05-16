import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "@/routes";
import { Box } from "@mui/material";

function App() {
  const router = createBrowserRouter(routes);

  return (
    <Box>
      <RouterProvider router={router} />
    </Box>
  );
}

export default App;
