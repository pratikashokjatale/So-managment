import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Chip,
  Breadcrumbs,
  Link,
  Avatar,
  CircularProgress,
  Stack,
  alpha,
  useTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Security as RoleIcon,
  CheckCircle as ActiveIcon,
  CalendarToday as DateIcon,
  VerifiedUser as VerifiedIcon,
  History as LoginIcon,
  Home as FlatIcon,
} from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import { getCachedMe } from "@/utils/apiCache";
import { updateUserApi, getMyQrApi } from "@/apis/user";
import { uploadDocumentApi } from "@/apis/document";
import { toast } from "react-hot-toast";
import { getFileUrl } from "@/utils/file";
import { QRCodeSVG } from "qrcode.react";

export default function GetProfile() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user: contextUser, refreshUser } = useAuth();
  const [user, setUser] = useState<any>(contextUser);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    avatar: "",
  });
  const [updating, setUpdating] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);

  const handleOpenEditModal = () => {
    setEditForm({
      name: user?.name || "",
      phone: user?.phone || "",
      avatar: user?.photoUrl || user?.profilePhotoUrl || user?.avatar || "",
    });
    setEditOpen(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const url = await uploadDocumentApi(file);
        setEditForm((prev) => ({ ...prev, avatar: url }));
        toast.success("Profile photo uploaded");
      } catch (err: any) {
        toast.error(err?.message || "Failed to upload photo");
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!editForm.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setUpdating(true);
    try {
      await updateUserApi(user?.id, {
        name: editForm.name.trim(),
        phone: editForm.phone.trim(),
        profilePhotoUrl: editForm.avatar || null,
      });
      toast.success("Profile updated successfully");
      setEditOpen(false);
      
      if (refreshUser) {
        await refreshUser();
      }
      
      const res = await getCachedMe();
      const freshUser = res?.data?.user || res?.user || res?.data || res;
      if (freshUser) {
        setUser(freshUser);
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await getCachedMe();
        const freshUser = res?.data?.user || res?.user || res?.data || res;
        if (freshUser) {
          setUser(freshUser);
        }
      } catch (error) {
        console.error("Failed to fetch profile details:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchQr = async () => {
      setQrLoading(true);
      try {
        const res = await getMyQrApi();
        const data = res?.data?.qrCode || res?.qrCode || res?.data?.code || res?.code || res?.data || res;
        if (data && typeof data === "string") {
          setQrCodeData(data);
        } else if (data && typeof data === "object" && data.code) {
          setQrCodeData(data.code);
        } else if (data && typeof data === "object" && data.qrCode) {
          setQrCodeData(data.qrCode);
        }
      } catch (err) {
        console.warn("Failed to fetch own QR code:", err);
      } finally {
        setQrLoading(false);
      }
    };
    fetchUserData();
    fetchQr();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const userName = user?.name || "User";
  const userInitials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (loading && !user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#f8fafc",
        }}
      >
        <CircularProgress size={60} thickness={4} sx={{ color: "#091542" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, bgcolor: "#f8fafc", minHeight: "100vh" }}>
      {/* Page Header */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" fontWeight="900" color="#091542" sx={{ mb: 1 }}>
          Profile
        </Typography>
        <Breadcrumbs separator=">" sx={{ fontWeight: 600 }}>
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate("/")}
            sx={{ cursor: "pointer" }}
          >
            Dashboard
          </Link>
          <Typography color="text.primary" fontWeight="800">
            User Account
          </Typography>
        </Breadcrumbs>
      </Box>

      <Grid container spacing={4}>
        {/* Profile Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: "32px",
              border: `1px solid ${theme.palette.divider}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              bgcolor: "white",
              boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
            }}
          >
            <Avatar
              src={getFileUrl(user?.photoUrl || user?.profilePhotoUrl || user?.avatar)}
              sx={{
                width: 120,
                height: 120,
                fontSize: "2.5rem",
                fontWeight: 900,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: "primary.main",
                mb: 3,
                border: `4px solid ${alpha(theme.palette.primary.main, 0.05)}`,
              }}
            >
              {userInitials}
            </Avatar>

            <Typography variant="h5" fontWeight="900" color="#091542" sx={{ mb: 1 }}>
              {userName}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {user?.email}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip
                icon={<RoleIcon sx={{ fontSize: "14px !important" }} />}
                label={user?.role || "ADMIN"}
                sx={{
                  bgcolor: "#eff6ff",
                  color: "#1e40af",
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  borderRadius: "10px",
                }}
              />
              <Chip
                icon={<ActiveIcon sx={{ fontSize: "14px !important" }} />}
                label={user?.status || "ACTIVE"}
                sx={{
                  bgcolor: "#f0fdf4",
                  color: "#166534",
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  borderRadius: "10px",
                }}
              />
            </Stack>
          </Paper>

          {/* Access QR Code Card */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mt: 4,
              borderRadius: "32px",
              border: `1px solid ${theme.palette.divider}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              bgcolor: "white",
              boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
            }}
          >
            <Typography variant="h6" fontWeight="900" color="#091542" sx={{ mb: 2 }}>
              My Access QR Code
            </Typography>
            
            {qrLoading ? (
              <CircularProgress size={30} sx={{ my: 3, color: "#091542" }} />
            ) : qrCodeData ? (
              <Box sx={{ p: 3, bgcolor: "#f8fafc", borderRadius: "24px", border: "2px dashed #cbd5e1" }}>
                <QRCodeSVG value={qrCodeData} size={150} level="H" />
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ my: 3 }}>
                No access QR code available
              </Typography>
            )}
            
            <Typography variant="caption" fontWeight="800" color="#94a3b8" sx={{ mt: 2, display: 'block' }}>
              USE FOR AUTOMATED GATE ENTRY
            </Typography>
          </Paper>
        </Grid>

        {/* Profile Details Grid */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 5,
              borderRadius: "32px",
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: "white",
              boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight="900" color="#091542">
                Account Information
              </Typography>
              <Button
                variant="outlined"
                onClick={handleOpenEditModal}
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 800,
                  borderColor: theme.palette.divider,
                  color: "#091542",
                  px: 3
                }}
              >
                Edit Profile
              </Button>
            </Stack>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={1}>
                  <Typography variant="caption" fontWeight="800" color="text.secondary" sx={{ textTransform: "uppercase" }}>
                    Full Name
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography variant="body1" fontWeight="700" color="#091542">
                      {userName}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={1}>
                  <Typography variant="caption" fontWeight="800" color="text.secondary" sx={{ textTransform: "uppercase" }}>
                    Email Address
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <EmailIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                    <Typography variant="body1" fontWeight="700" color="#091542">
                      {user?.email || "N/A"}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={1}>
                  <Typography variant="caption" fontWeight="800" color="text.secondary" sx={{ textTransform: "uppercase" }}>
                    Phone Number
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <PhoneIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                    <Typography variant="body1" fontWeight="700" color="#091542">
                      {user?.phone || "N/A"}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={1}>
                  <Typography variant="caption" fontWeight="800" color="text.secondary" sx={{ textTransform: "uppercase" }}>
                    Flat Assignment
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <FlatIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                    <Typography variant="body1" fontWeight="700" color="#091542">
                      {user?.flatId || "No Flat Assigned"}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" fontWeight="900" color="#091542" sx={{ mb: 3 }}>
              Audit & Verification
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={1}>
                  <Typography variant="caption" fontWeight="800" color="text.secondary" sx={{ textTransform: "uppercase" }}>
                    Last Login
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <LoginIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                    <Typography variant="body2" fontWeight="700" color="#091542">
                      {formatDate(user?.lastLoginAt)}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={1}>
                  <Typography variant="caption" fontWeight="800" color="text.secondary" sx={{ textTransform: "uppercase" }}>
                    Email Verified At
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <VerifiedIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                    <Typography variant="body2" fontWeight="700" color="#091542">
                      {formatDate(user?.emailVerifiedAt)}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={1}>
                  <Typography variant="caption" fontWeight="800" color="text.secondary" sx={{ textTransform: "uppercase" }}>
                    Member Since
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <DateIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                    <Typography variant="body2" fontWeight="700" color="#091542">
                      {formatDate(user?.createdAt)}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={1}>
                  <Typography variant="caption" fontWeight="800" color="text.secondary" sx={{ textTransform: "uppercase" }}>
                    Last Account Update
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <DateIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                    <Typography variant="body2" fontWeight="700" color="#091542">
                      {formatDate(user?.updatedAt)}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Profile Dialog */}
      <Dialog 
        open={editOpen} 
        onClose={() => setEditOpen(false)} 
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '24px', p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography variant="h6" fontWeight="900" color="#091542">
            Edit Profile
          </Typography>
          <IconButton onClick={() => setEditOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ border: "none" }}>
          <Stack spacing={3} sx={{ mt: 1, alignItems: "center" }}>
            <Box sx={{ position: "relative", mb: 2 }}>
              <Avatar
                src={getFileUrl(editForm.avatar)}
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: "#f5f7fa",
                  color: "#bdbdbd",
                  border: `4px solid ${alpha(theme.palette.primary.main, 0.05)}`,
                }}
              />
              <IconButton
                component="label"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: -10,
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": { bgcolor: "primary.dark" },
                  boxShadow: 2,
                }}
                size="small"
              >
                <PhotoCameraIcon fontSize="small" />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              </IconButton>
            </Box>
            <TextField
              label="Full Name"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              fullWidth
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
            <TextField
              label="Phone Number"
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              fullWidth
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setEditOpen(false)} 
            variant="outlined"
            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 800, color: 'text.secondary', borderColor: '#e2e8f0' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveProfile} 
            variant="contained"
            disabled={updating}
            sx={{ bgcolor: '#091542', borderRadius: '10px', textTransform: 'none', fontWeight: 800 }}
          >
            {updating ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
