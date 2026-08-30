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
  LockOutlined as LockIcon,
} from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "@/i18n/translations";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import bgImage from "@/assets/bglogin.png";
import logoImg from "@/assets/logo.jpeg";
import {
  signInWithGoogle,
  signInWithApple,
  signInWithFacebook,
} from "@/lib/firebase";

// Custom Google Icon SVG
const GoogleIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ marginRight: "8px" }}
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);

// Custom Pixel-Perfect SVGs (Larger viewBox matching mockup details)
const ResidentIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* House Roof */}
    <path d="M12 3L3 11H21L12 3Z" fill="#FFFFFF" />
    {/* Left Wall */}
    <path d="M6 11H9.5V21H6V11Z" fill="#FFFFFF" />
    {/* Right Wall */}
    <path d="M14.5 11H18V21H14.5V11Z" fill="#FFFFFF" />
    {/* Lintell above door */}
    <path d="M9.5 11H14.5V14H9.5V11Z" fill="#FFFFFF" />
    
    {/* White Person inside the transparent door cutout */}
    <circle cx="12" cy="16.2" r="1.4" fill="#FFFFFF" />
    <path d="M10.2 20C10.2 18.8 11 18 12 18C13 18 13.8 18.8 13.8 20V21H10.2V20Z" fill="#FFFFFF" />
  </svg>
);

const SecurityIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Shield Outline (stroke is white, center is transparent) */}
    <path d="M12 4C8 5.3 6 8 6 12C6 16.8 9.2 20 12 21C14.8 20 18 16.8 18 12C18 8 16 5.3 12 4Z" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    {/* White Checkmark inside */}
    <path d="M9.5 12.5L11 14L14.5 10.5" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MaintenanceIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* White Key with transparent ring hole */}
    <path fillRule="evenodd" clipRule="evenodd" d="M6 7C3.23858 7 1 9.23858 1 12C1 14.7614 3.23858 17 6 17C8.16226 17 9.9934 15.6322 10.6865 13.7222H14.5V16.5H17.25V13.7222H19.0833V16.5H21.8333V10.2778H10.6865C9.9934 8.36782 8.16226 7 6 7ZM3.75 12C3.75 10.7574 4.75736 9.75 6 9.75C7.24264 9.75 8.25 10.7574 8.25 12C8.25 13.2426 7.24264 14.25 6 14.25C4.75736 14.25 3.75 13.2426 3.75 12Z" fill="#FFFFFF" />
  </svg>
);

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isLoginLoading, isLoggedIn, isInitialized, loginWithFirebase, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    if (isInitialized && isLoggedIn) {
      if (user?.role === "MANAGER") {
        navigate("/manager");
      } else {
        navigate("/");
      }
    }
  }, [isInitialized, isLoggedIn, user, navigate]);

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
        const res = await login(values.email, values.password, rememberMe);
        toast.success("Login successful! Welcome back.");
        const loggedUser = res?.data?.user || res?.user || res?.data || res;
        if (loggedUser?.role === "MANAGER") {
          navigate("/manager");
        } else {
          navigate("/");
        }
      } catch (error: any) {
        console.error("Login error:", error);
        const errorMsg =
          error?.response?.data?.message ||
          error?.message ||
          "Invalid credentials. Please try again.";
        toast.error(errorMsg);
      }
    },
  });

  const handleForgotPassword = () => {
    if (formik.values.email) {
      toast.promise(
        new Promise((resolve) => setTimeout(resolve, 1200)),
        {
          loading: "Sending password reset email...",
          success: "Password reset link sent to your email!",
          error: "Failed to send password reset link.",
        }
      );
    } else {
      toast.error("Please enter your email address first.");
    }
  };

  // ── Social login helper (shared logic after Firebase auth) ────────────────
  const handleSocialLogin = async (
    providerFn: () => Promise<any>,
    providerName: string
  ) => {
    try {
      // Step 1: Firebase popup — authenticate with the social provider
      const result = await providerFn();
      const user = result.user;

      // Step 2: Get the Firebase ID token
      const idToken = await user.getIdToken();

      // Step 3: Send Firebase ID token to YOUR backend API (auth/social-login)
      // Backend verifies token via Firebase Admin SDK and returns its own JWT
      const backendRes = await loginWithFirebase(idToken, providerName.toLowerCase(), rememberMe);

      const loggedUser = backendRes?.data?.user || backendRes?.user || backendRes?.data || backendRes;
      toast.success(`Signed in with ${providerName}! Welcome, ${user.displayName || user.email}.`);
      if (loggedUser?.role === "MANAGER") {
        navigate("/manager");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      if (
        error?.code === "auth/popup-closed-by-user" ||
        error?.code === "auth/cancelled-popup-request"
      ) {
        return; // User cancelled — silently ignore
      }
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        `${providerName} sign-in failed. Please try again.`;
      toast.error(msg);
    }
  };

  const handleGoogleSignIn = () => handleSocialLogin(signInWithGoogle, "Google");
  const handleAppleSignIn = () => handleSocialLogin(signInWithApple, "Apple");
  const handleFacebookSignIn = () => handleSocialLogin(signInWithFacebook, "Facebook");

  return (
    <Box
      className="login-page-container"
      sx={{
        minHeight: "100dvh",
        height: { xs: "auto", md: "100vh" },
        width: "100vw",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.75) 90%), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        overflowY: { xs: "auto", md: "hidden" },
        overflowX: "hidden",
        "@keyframes fadeIn": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        animation: "fadeIn 1s ease-out forwards",
      }}
    >
      {/* Left side: branding info and bottom features */}
      <Box
        sx={{
          flex: { xs: "none", md: 6.5 }, // 65% width
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center", // Center horizontally
          color: "#0f172a",
          p: { xs: 3, sm: 4, md: 5, lg: 6 },
          pt: { xs: 5, sm: 6, md: 8, lg: 10 },
          pb: { xs: 3, md: 5 },
          height: { xs: "auto", md: "100%" },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              lineHeight: 1.15,
              fontSize: { xs: "2rem", sm: "2.4rem", md: "2.8rem", lg: "3.5rem" },
              letterSpacing: "-0.5px",
              mb: { xs: 1.5, md: 2 },
              textAlign: "center",
            }}
          >
            <Box component="span" sx={{ color: "#24528C", mr: 1.5 }}>
              Marbella Society
            </Box>
            <Box component="span" sx={{ color: "#C89A3D" }}>
              Admin Portal
            </Box>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#475569",
              fontWeight: 500,
              fontSize: { xs: "0.9rem", md: "1rem" },
              lineHeight: 1.6,
              maxWidth: "680px",
              textAlign: "center",
            }}
          >
            Manage your entire residential community from one secure platform.
            Streamline resident management, visitor approvals, maintenance requests,
            amenities, and society operations with an intuitive dashboard.
          </Typography>
        </Box>

        {/* Feature highlighted elements at the bottom (Inline, no card backgrounds, matching mockup exactly) */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            justifyContent: "center", // Center horizontally
            alignItems: "center",
            gap: 5, // Increased gap for a cleaner and more premium layout
            mt: { xs: 4, md: "auto" },
            width: "100%",
            maxWidth: "1200px",
          }}
        >
          {/* Feature 1 */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 2, // Larger gap between icon and text
              width: "100%",
              maxWidth: { xs: "100%", lg: "340px" }, // Increased width for better text spacing
            }}
          >
            <Box
              sx={{
                width: 52, // Increased icon container size
                height: 52,
                borderRadius: "12px",
                bgcolor: "#b28243",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 4px 10px rgba(178, 130, 67, 0.2)",
              }}
            >
              <ResidentIcon />
            </Box>
            <Box sx={{ textAlign: "left" }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: "#b28243",
                  fontSize: "1rem", // Larger font size for headers
                  mb: 0.3,
                  fontFamily: "'Satoshi', sans-serif",
                }}
              >
                Resident Management
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#475569",
                  fontSize: "0.82rem", // Larger description font size
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  lineHeight: 1.35,
                  fontWeight: 500,
                }}
              >
                Manage resident profiles, approvals, and occupancy records.
              </Typography>
            </Box>
          </Box>

          {/* Feature 2 */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 2,
              width: "100%",
              maxWidth: { xs: "100%", lg: "340px" },
            }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: "12px",
                bgcolor: "#b28243",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 4px 10px rgba(178, 130, 67, 0.2)",
              }}
            >
              <SecurityIcon />
            </Box>
            <Box sx={{ textAlign: "left" }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: "#b28243",
                  fontSize: "1rem",
                  mb: 0.3,
                  fontFamily: "'Satoshi', sans-serif",
                }}
              >
                Visitor & Security
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#475569",
                  fontSize: "0.82rem",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  lineHeight: 1.35,
                  fontWeight: 500,
                }}
              >
                Approve visitors, monitor gate entries, and control access.
              </Typography>
            </Box>
          </Box>

          {/* Feature 3 */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 2,
              width: "100%",
              maxWidth: { xs: "100%", lg: "340px" },
            }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: "12px",
                bgcolor: "#b28243",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 4px 10px rgba(178, 130, 67, 0.2)",
              }}
            >
              <MaintenanceIcon />
            </Box>
            <Box sx={{ textAlign: "left" }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: "#b28243",
                  fontSize: "1rem",
                  mb: 0.3,
                  fontFamily: "'Satoshi', sans-serif",
                }}
              >
                Maintenance Hub
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#475569",
                  fontSize: "0.82rem",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  lineHeight: 1.35,
                  fontWeight: 500,
                }}
              >
                Track complaints, assign staff, and resolve issues faster.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Right side: Login Form Card */}
      <Box
        sx={{
          flex: { xs: "none", md: 3.5 }, // 35% width
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 3, md: 4 },
          pb: { xs: 4, md: 4 },
          height: { xs: "auto", md: "100%" },
          zIndex: 1,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: "370px", // Narrower card width to match mockup exactly
            p: { xs: 3, sm: 4, md: 4.5 },
            borderRadius: "32px",
            bgcolor: "#FFFFFF",
            border: "1px solid rgba(200, 154, 61, 0.22)",
            boxShadow: "0 20px 50px -10px rgba(24, 58, 107, 0.15)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            "@keyframes float": {
              "0%": { transform: "translateY(0px)" },
              "50%": { transform: "translateY(-10px)" },
              "100%": { transform: "translateY(0px)" },
            },
            animation: "float 8s ease-in-out infinite", // Floating animation
          }}
        >
          {/* Marbella Crest Logo Header */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 1.5 }}>
            <Box
              component="img"
              src={logoImg}
              alt="Marbella Logo"
              sx={{
                height: 90,
                width: "auto",
                objectFit: "contain",
                mb: 0.5,
              }}
            />
          </Box>

          {/* Gold divider lines */}
          <Box sx={{ display: "flex", alignItems: "center", width: "100%", mb: 3, mt: 0.5 }}>
            <Box
              sx={{
                flex: 1,
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, rgba(200, 154, 61, 0.25) 50%, rgba(200, 154, 61, 0.6))",
              }}
            />
            <Typography
              sx={{
                mx: 1.5,
                color: "#C89A3D", // Gold
                fontSize: "0.78rem",
                fontWeight: 600,
                fontFamily: "'Cinzel', serif",
                letterSpacing: "1.5px",
                whiteSpace: "nowrap",
              }}
            >
              Sign in to continue
            </Typography>
            <Box
              sx={{
                flex: 1,
                height: "1px",
                background:
                  "linear-gradient(90deg, rgba(200, 154, 61, 0.6), rgba(200, 154, 61, 0.25) 50%, transparent)",
              }}
            />
          </Box>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {/* Email field */}
              <Box sx={{ width: "100%", mb: 2.2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: "#334155",
                    mb: 0.8,
                    fontSize: "0.82rem",
                    fontFamily: "'Satoshi', sans-serif",
                  }}
                >
                  Email Address
                </Typography>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailIcon sx={{ color: "#94a3b8", fontSize: 18 }} />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: "10px",
                      bgcolor: "#ffffff",
                      color: "#0f172a",
                      fontFamily: "'Satoshi', sans-serif",
                      fontSize: "0.88rem",
                      "& fieldset": {
                        borderColor: "#C89A3D", // Gold border
                        borderWidth: "1.2px",
                      },
                      "&:hover fieldset": {
                        borderColor: "#24528C !important", // Navy hover
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#24528C !important", // Navy focus
                        borderWidth: "1.5px",
                      },
                    },
                  }}
                  sx={{
                    "& .MuiFormHelperText-root": {
                      color: "#b45309",
                      fontWeight: 600,
                      mx: 0.5,
                      mt: 0.3,
                    },
                  }}
                />
              </Box>

              {/* Password field */}
              <Box sx={{ width: "100%", mb: 2.2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: "#334155",
                    mb: 0.8,
                    fontSize: "0.82rem",
                    fontFamily: "'Satoshi', sans-serif",
                  }}
                >
                  Password
                </Typography>
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "#94a3b8", fontSize: 18 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePassword}
                          edge="end"
                          sx={{ color: "#94a3b8", p: 0.25 }}
                        >
                          {showPassword ? (
                            <VisibilityOff sx={{ fontSize: 18 }} />
                          ) : (
                            <Visibility sx={{ fontSize: 18 }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: "10px",
                      bgcolor: "#ffffff",
                      color: "#0f172a",
                      fontFamily: "'Satoshi', sans-serif",
                      fontSize: "0.88rem",
                      "& fieldset": {
                        borderColor: "#C89A3D",
                        borderWidth: "1.2px",
                      },
                      "&:hover fieldset": {
                        borderColor: "#24528C !important",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#24528C !important",
                        borderWidth: "1.5px",
                      },
                    },
                  }}
                  sx={{
                    "& .MuiFormHelperText-root": {
                      color: "#b45309",
                      fontWeight: 600,
                      mx: 0.5,
                      mt: 0.3,
                    },
                  }}
                />
              </Box>

              {/* Remember me & Forgot password */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  mb: 3,
                  mt: -0.5,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      sx={{
                        color: "rgba(24, 58, 107, 0.2)",
                        p: 0.25,
                        mr: 0.25,
                        "&.Mui-checked": {
                          color: "#24528C", // Navy
                        },
                      }}
                      size="small"
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: "#475569",
                        fontFamily: "'Satoshi', sans-serif",
                        fontSize: "0.82rem",
                      }}
                    >
                      Remember Me
                    </Typography>
                  }
                />
                {/* <Typography
                  variant="body2"
                  onClick={handleForgotPassword}
                  sx={{
                    fontWeight: 600,
                    color: "#C89A3D", // Gold
                    cursor: "pointer",
                    fontFamily: "'Satoshi', sans-serif",
                    fontSize: "0.82rem",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Forgot Password?
                </Typography> */}
              </Box>

              {/* Sign In button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={isLoginLoading}
                sx={{
                  py: 1.5,
                  borderRadius: "10px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: "0.92rem",
                  letterSpacing: "1px",
                  fontFamily: "'Satoshi', sans-serif",
                  background: "linear-gradient(135deg, #24528C 0%, #254F85 100%)", // Navy
                  boxShadow: "0 4px 15px rgba(24, 58, 107, 0.2)",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    background: "linear-gradient(135deg, #122b51 0%, #1e416d 100%)",
                    boxShadow: "0 6px 18px rgba(24, 58, 107, 0.28)",
                    transform: "translateY(-1.5px)", // hover lift
                  },
                  "&:active": {
                    transform: "translateY(0)",
                  },
                }}
              >
                {isLoginLoading ? "Logging in..." : "SIGN IN"}
              </Button>
            </Box>
          </form>

          {/* OR Divider */}
          <Box sx={{ display: "flex", alignItems: "center", width: "100%", my: 2.2 }}>
            <Box sx={{ flex: 1, height: "1px", bgcolor: "#f1f5f9" }} />
            <Typography
              sx={{
                mx: 1.5,
                color: "#94a3b8",
                fontSize: "0.75rem",
                fontWeight: 700,
                fontFamily: "'Satoshi', sans-serif",
              }}
            >
              OR
            </Typography>
            <Box sx={{ flex: 1, height: "1px", bgcolor: "#f1f5f9" }} />
          </Box>

          {/* Social Login Row — Google · Apple · Facebook */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
              width: "100%",
            }}
          >
            {/* Google */}
            <IconButton
              onClick={handleGoogleSignIn}
              title="Continue with Google"
              sx={{
                flex: 1,
                borderRadius: "10px",
                border: "1.2px solid #C89A3D",
                bgcolor: "#FFFFFF",
                py: 1.1,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  borderColor: "#24528C",
                  bgcolor: "rgba(200,154,61,0.05)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(24,58,107,0.12)",
                },
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
            </IconButton>

            {/* Apple */}
            <IconButton
              onClick={handleAppleSignIn}
              title="Continue with Apple"
              sx={{
                flex: 1,
                borderRadius: "10px",
                border: "1.2px solid #C89A3D",
                bgcolor: "#FFFFFF",
                py: 1.1,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  borderColor: "#24528C",
                  bgcolor: "rgba(200,154,61,0.05)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(24,58,107,0.12)",
                },
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill="#000000"/>
              </svg>
            </IconButton>

            {/* Facebook */}
            <IconButton
              onClick={handleFacebookSignIn}
              title="Continue with Facebook"
              sx={{
                flex: 1,
                borderRadius: "10px",
                border: "1.2px solid #C89A3D",
                bgcolor: "#FFFFFF",
                py: 1.1,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  borderColor: "#24528C",
                  bgcolor: "rgba(200,154,61,0.05)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(24,58,107,0.12)",
                },
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.532-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" fill="#1877F2"/>
              </svg>
            </IconButton>
          </Box>

          {/* Footer link */}
          {/* <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 0.5 }}>
            <Typography
              variant="body2"
              sx={{ color: "#64748b", fontFamily: "'Satoshi', sans-serif", fontSize: "0.82rem" }}
            >
              Don't have an account?
            </Typography>
            <Typography
              variant="body2"
              onClick={() => navigate("/register")}
              sx={{
                fontWeight: 700,
                color: "#C89A3D", // Gold
                cursor: "pointer",
                fontFamily: "'Satoshi', sans-serif",
                fontSize: "0.82rem",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Sign up
            </Typography>
          </Box> */}
        </Paper>
      </Box>
    </Box>
  );
};

export default LoginPage;
