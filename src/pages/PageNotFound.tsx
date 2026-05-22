import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, Container, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";

interface PageNotFoundProps {
  title?: string;
  message?: string;
  showBackButton?: boolean;
}

const PageNotFound = ({
  title = "Oops! Page Not Found",
  message = "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.",
  showBackButton = true,
}: PageNotFoundProps) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "6rem", md: "10rem" },
            fontWeight: 900,
            color: alpha(theme.palette.primary.main, 0.1),
            lineHeight: 1,
            mb: -4,
          }}
        >
          404
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 2,
            letterSpacing: "-0.5px",
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: "400px" }}
        >
          {message}
        </Typography>
        {showBackButton && (
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/")}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: "12px",
              fontWeight: 700,
              boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
              "&:hover": {
                boxShadow: `0 12px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
              },
            }}
          >
            Back to Dashboard
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default PageNotFound;
