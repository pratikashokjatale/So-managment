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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  MailOutline as MailIcon,
  People as PeopleIcon,
  ShieldOutlined as ShieldIcon,
  VpnKeyOutlined as KeyIcon,
} from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "@/i18n/translations";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import bgImage from "@/assets/test.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login, isLoginLoading, isLoggedIn, isInitialized } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

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
        await login(values.email, values.password, rememberMe);
        toast.success("Login successful! Welcome back.");
        navigate("/");
      } catch (error: any) {
        console.error("Login error:", error);
        const errorMsg = error?.response?.data?.message || error?.message || "Invalid credentials. Please try again.";
        toast.error(errorMsg);
      }
    },
  });

  return (
    <Box
      className="login-page-container"
      sx={{
        minHeight: "100dvh",
        height: "auto",
        width: "100vw",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: 3, md: 0 },
        backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.3), rgba(15, 23, 42, 0.75)), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        overflowX: "hidden",
      }}
    >
      {/* Left side: branding info */}
      <Box
        sx={{
          flex: { xs: "none", md: 1.2 },
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: { xs: "center", md: "flex-start" },
          justifyContent: "flex-start",
          color: "#ffffff",
          p: { xs: 2.5, sm: 4, md: 6, lg: 10 },
          pt: { xs: 5, sm: 8, md: 10, lg: 14 },
        }}
      >
        <Box
          sx={{
            bgcolor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            p: { xs: 3.5, sm: 4, md: 5 },
            borderRadius: "16px",
            maxWidth: "540px",
            width: "100%",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              mb: 2,
              background: "linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.2,
              fontSize: { xs: "1.85rem", sm: "2.25rem", md: "2.75rem", lg: "3rem" },
            }}
          >
            Marbella Society Admin Portal
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: "#e2e8f0", 
              mb: { xs: 2.5, md: 4 }, 
              fontWeight: 500, 
              fontSize: { xs: "0.95rem", md: "1.05rem" }, 
              lineHeight: 1.6 
            }}
          >
            Manage bookings, monitor visitor entries, handle resident issues, and oversee community operations all from a single dashboard.
          </Typography>

          <Box sx={{ display: { xs: "none", md: "flex" }, flexDirection: "column", gap: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ bgcolor: "rgba(56, 189, 248, 0.15)", p: 1.2, borderRadius: "12px", display: "flex" }}>
                <PeopleIcon sx={{ fontSize: 20, color: "#38bdf8" }} />
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#ffffff" }}>
                  Resident Relations
                </Typography>
                <Typography variant="caption" sx={{ color: "#cbd5e1", fontWeight: 500 }}>
                  Approve enrollments and maintain resident ledgers.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ bgcolor: "rgba(52, 211, 153, 0.15)", p: 1.2, borderRadius: "12px", display: "flex" }}>
                <ShieldIcon sx={{ fontSize: 20, color: "#34d399" }} />
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#ffffff" }}>
                  Smart Gate & Security
                </Typography>
                <Typography variant="caption" sx={{ color: "#cbd5e1", fontWeight: 500 }}>
                  Track entries, visitor passes, and security checklists.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ bgcolor: "rgba(251, 113, 133, 0.15)", p: 1.2, borderRadius: "12px", display: "flex" }}>
                <KeyIcon sx={{ fontSize: 20, color: "#fb7185" }} />
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#ffffff" }}>
                  Issue Resolution Hub
                </Typography>
                <Typography variant="caption" sx={{ color: "#cbd5e1", fontWeight: 500 }}>
                  Dispatch maintenance and resolve complaints in real-time.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Right side: Login Form Card container */}
      <Box
        sx={{
          flex: { xs: "none", md: 0.8 },
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "transparent",
          p: { xs: 2.5, sm: 4, md: 6 },
          pt: { xs: 0, md: 6 },
          pb: { xs: 5, md: 6 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: "480px",
            p: { xs: 4, sm: 5, md: 6 },
            borderRadius: "32px",
            bgcolor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Top user icon */}
          <Box
            sx={{
              width: 70,
              height: 70,
              bgcolor: "rgba(56, 189, 248, 0.1)",
              border: "1px solid rgba(56, 189, 248, 0.35)",
              boxShadow: "0 0 20px rgba(56, 189, 248, 0.15)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <PeopleIcon sx={{ fontSize: 32, color: "#38bdf8" }} />
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#ffffff",
              textAlign: "center",
              mb: 1,
            }}
          >
            {t("welcomeBack") || "Welcome Back!"}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#cbd5e1",
              textAlign: "center",
              mb: 4,
            }}
          >
            Login to your account
          </Typography>

          <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label={t("email") || "Email Address"}
                placeholder="hello@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                variant="outlined"
                InputLabelProps={{
                  sx: {
                    color: "#94a3b8",
                    "&.Mui-focused": {
                      color: "#38bdf8",
                    },
                  },
                }}
                InputProps={{
                  style: { color: "#ffffff" },
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailIcon sx={{ color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                    bgcolor: "rgba(15, 23, 42, 0.6)",
                    transition: "all 0.2s ease-in-out",
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.15)",
                      transition: "all 0.2s ease-in-out",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.35)",
                    },
                    "&.Mui-focused": {
                      boxShadow: "0 0 0 4px rgba(56, 189, 248, 0.25)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#38bdf8",
                    },
                    "& input:-webkit-autofill": {
                      WebkitBoxShadow: "0 0 0 1000px #0f172a inset !important",
                      WebkitTextFillColor: "#ffffff !important",
                    },
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#fca5a5",
                  },
                }}
              />

              <TextField
                fullWidth
                id="password"
                name="password"
                label={t("password") || "Password"}
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                InputLabelProps={{
                  sx: {
                    color: "#94a3b8",
                    "&.Mui-focused": {
                      color: "#38bdf8",
                    },
                  },
                }}
                InputProps={{
                  style: { color: "#ffffff" },
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyIcon sx={{ color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword} edge="end" sx={{ color: "#94a3b8" }}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                    bgcolor: "rgba(15, 23, 42, 0.6)",
                    transition: "all 0.2s ease-in-out",
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.15)",
                      transition: "all 0.2s ease-in-out",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.35)",
                    },
                    "&.Mui-focused": {
                      boxShadow: "0 0 0 4px rgba(56, 189, 248, 0.25)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#38bdf8",
                    },
                    "& input:-webkit-autofill": {
                      WebkitBoxShadow: "0 0 0 1000px #0f172a inset !important",
                      WebkitTextFillColor: "#ffffff !important",
                    },
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#fca5a5",
                  },
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: -1,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      sx={{
                        color: "rgba(255, 255, 255, 0.5)",
                        "&.Mui-checked": {
                          color: "#38bdf8",
                        },
                      }}
                      size="small"
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "#cbd5e1" }}
                    >
                      Remember me
                    </Typography>
                  }
                />
              </Box>

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
                  fontSize: "1.05rem",
                  background: "linear-gradient(135deg, #38bdf8 0%, #1d4ed8 100%)",
                  boxShadow: "0 4px 20px rgba(29, 78, 216, 0.35)",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    background: "linear-gradient(135deg, #0ea5e9 0%, #1e40af 100%)",
                    boxShadow: "0 6px 24px rgba(29, 78, 216, 0.5)",
                    transform: "translateY(-2px)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                  },
                }}
              >
                {isLoginLoading ? "Logging in..." : "Login"}
              </Button>
            </Box>
          </form>

          <Box
            sx={{
              mt: 4,
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#38bdf8",
            }}
          >
            <ShieldIcon sx={{ fontSize: 18 }} />
            <Typography
              variant="caption"
              sx={{ fontWeight: 800, letterSpacing: "0.5px" }}
            >
              Secure. Simple. Smart.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default LoginPage;
