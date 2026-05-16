import { useEffect, useState } from "react";
import { LinearProgress, Box, useTheme } from "@mui/material";
import { useNavigation, useLocation } from "react-router-dom";

const Loader = () => {
  const navigation = useNavigation();
  const location = useLocation();
  const theme = useTheme();
  const [active, setActive] = useState(false);

  const isLoading = navigation.state === "loading";

  useEffect(() => {
    setActive(true);
    const timer = setTimeout(() => {
      setActive(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isLoading && !active) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 9999,
        "& .MuiLinearProgress-root": {
          height: 5,
          bgcolor: "transparent",
          "& .MuiLinearProgress-bar": {
            borderRadius: 0,
            bgcolor: theme.palette.primary.main,
          },
        },
      }}
    >
      <LinearProgress color="primary" />
    </Box>
  );
};

export default Loader;
