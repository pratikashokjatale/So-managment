import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import {
  MailOutline as MailIcon,
  PersonOutline as PersonIcon,
  BadgeOutlined as BadgeIcon,
  ShieldOutlined as ShieldIcon,
} from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import bgImage from "@/assets/test.png";
import { registerApi } from "@/apis/auth";

const roles = [
  { value: "USER", label: "User" },
  { value: "ADMIN", label: "Admin" },
  { value: "RESIDENT", label: "Resident" },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      role: "USER",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      role: Yup.string().required("Role is required"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await registerApi(values);
        toast.success("Registration successful!");
        navigate("/login");
      } catch (error: any) {
        console.error("Registration error:", error);
        const errorMsg =
          error?.response?.data?.message ||
          error?.data?.message ||
          error?.message ||
          "Registration failed. Please try again.";
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
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
        backgroundImage: `url(${bgImage})`,
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
      ></Box>

      {/* Right side: Register Form Card container */}
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
            <PersonIcon sx={{ fontSize: 32, color: "#1d4ed8" }} />
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
            Create Account
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
              textAlign: "center",
              mb: 4,
            }}
          >
            Register a new user account
          </Typography>

          <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Full Name"
                placeholder="John Doe"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#64748b" }} />
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

              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email Address"
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
                  },
                }}
              />

              <TextField
                fullWidth
                id="role"
                name="role"
                select
                label="Role"
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.role && Boolean(formik.errors.role)}
                helperText={formik.touched.role && formik.errors.role}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon sx={{ color: "#64748b" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                    bgcolor: "#f8fafc",
                  },
                }}
              >
                {roles.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={isLoading}
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
                {isLoading ? "Registering..." : "Register"}
              </Button>
            </Box>
          </form>

          <Box
            sx={{
              mt: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Already have an account?
            </Typography>
            <Typography
              component={Link}
              to="/login"
              variant="body2"
              sx={{
                fontWeight: 700,
                color: "#1d4ed8",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Login here
            </Typography>
          </Box>

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

export default RegisterPage;
