import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
  Divider,
  alpha,
  useTheme,
  Container,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  GitHub as GitHubIcon,
} from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "@/i18n/translations";
import { useAuth } from "@/contexts/AuthContext";

const LoginPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login, isLoginLoading, isLoggedIn, isInitialized } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isInitialized && isLoggedIn) {
      navigate("/");
    }
  }, [isInitialized, isLoggedIn, navigate]);

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email(t("invalidEmail")).required(t("emailRequired")),
      password: Yup.string()
        .min(6, t("passwordMin"))
        .required(t("passwordRequired")),
    }),
    onSubmit: async (values) => {
      try {
        await login(values.email, values.password, true);
        navigate("/");
      } catch (error) {
        console.error("Login error:", error);
      }
    },
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        bgcolor: "background.default",
        // Premium background decoration
        "&::before": {
          content: '""',
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.4)}, ${alpha(theme.palette.primary.light, 0.1)})`,
          top: "-100px",
          right: "-100px",
          filter: "blur(50px)",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.3)}, ${alpha(theme.palette.primary.main, 0.1)})`,
          bottom: "-150px",
          left: "-150px",
          filter: "blur(60px)",
        },
      }}
    >
      <Container maxWidth="sm" sx={{ zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 8 },
            borderRadius: "32px",
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            background: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: "blur(20px)",
            boxShadow: `0 24px 80px ${alpha(theme.palette.common.black, 0.1)}`,
            textAlign: "center",
          }}
        >
          <Box sx={{ mb: 5 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                bgcolor: "primary.main",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
                boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              <Typography
                variant="h4"
                sx={{ color: "white", fontWeight: 900, lineHeight: 1 }}
              >
               SM
              </Typography>
            </Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                letterSpacing: "-1.5px",
                fontSize: { xs: "2rem", md: "2.5rem" },
                mb: 1.5,
              }}
            >
              {t("welcomeBack")}
            </Typography>
            {/* <Typography variant="body1" color="text.secondary">
              {t("loginSubTitle")}
            </Typography> */}
          </Box>

          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label={t("email")}
                placeholder="hello@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                    bgcolor: alpha(theme.palette.action.hover, 0.04),
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: alpha(theme.palette.action.hover, 0.08),
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                id="password"
                name="password"
                label={t("password")}
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                    bgcolor: alpha(theme.palette.action.hover, 0.04),
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: alpha(theme.palette.action.hover, 0.08),
                    },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),  
                }}
              />

              {/* <Box sx={{ mt: -1, display: "flex", justifyContent: "flex-end" }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: "primary.main",
                    fontWeight: 700,
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {t("forgotPassword")}
                </Typography>
              </Box> */}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={isLoginLoading}
                sx={{
                  py: 1.8,
                  borderRadius: "16px",
                  fontWeight: 800,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 16px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
                  },
                  "&:active": {
                    transform: "translateY(0)",
                  },
                }}
              >
                {isLoginLoading ? "Logging in..." : t("submit")}
              </Button>
            </Box>
          </form>

         

         
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
