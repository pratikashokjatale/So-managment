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
 
  useTheme,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
 
  MailOutline as MailIcon,
  LockOutlined as LockIcon,
  People as PeopleIcon,
  ShieldOutlined as ShieldIcon,
} from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "@/i18n/translations";
import { useAuth } from "@/contexts/AuthContext";
import bgImage from "@/assets/back.png";

const LoginPage = () => {
  const theme = useTheme();
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
        width: "100vw",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        backgroundImage: `linear-gradient(rgba(0, 40, 85, 0.4), rgba(0, 40, 85, 0.45)), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        overflowX: "hidden",
      }}
    >
      {/* Left side: branding info */}
      <Box
        sx={{
          flex: 1.2,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          textAlign: "center",
          p: 6,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
          }}
        >
          {/* Logo container */}
          
          
          
        </Box>
      </Box>

      {/* Right side: Login Form Card container */}
      <Box
        sx={{
          flex: 0.8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
           bgcolor: { xs: "rgba(0, 40, 85, 0.3)", md: "transparent" },
          p: { xs: 2, sm: 4, md: 6 },
          backdropFilter: { xs: "blur(8px)", md: "none" },
         
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: "480px",
            p: { xs: 4, sm: 5, md: 6 },
            borderRadius: "32px",
            opacity: 0.9,
            background: { md: "#ffffffff" },
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
              bgcolor: "#eff6ff",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <PeopleIcon sx={{ fontSize: 32, color: "#1d4ed8" }} />
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#1e293b",
              textAlign: "center",
              mb: 1,
            }}
          >
            {t("welcomeBack") || "Welcome Back!"}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailIcon sx={{ color: "#64748b" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                    bgcolor: "#f8fafc",
                    "& fieldset": {
                      borderColor: "#e2e8f0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#cbd5e1",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1d4ed8",
                    },
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
                InputProps={{
                  
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                    bgcolor: "#f8fafc",
                   
                    
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
                      color="primary"
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#475569" }}>
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
                  bgcolor: "#1d4ed8",
                  boxShadow: "0 4px 12px rgba(29, 78, 216, 0.2)",
                  "&:hover": {
                    bgcolor: "#1e40af",
                    boxShadow: "0 6px 16px rgba(29, 78, 216, 0.3)",
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
              color: "#1d4ed8",
            }}
          >
            <ShieldIcon sx={{ fontSize: 18 }} />
            <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: "0.5px" }}>
              Secure. Simple. Smart.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default LoginPage;
