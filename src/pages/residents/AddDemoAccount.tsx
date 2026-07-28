import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Close as CloseIcon,
  CheckCircle as SuccessIcon,
  ContentCopy as CopyIcon,
  PersonOutline as PersonOutlineIcon,
  EmailOutlined as EmailOutlinedIcon,
  PhoneOutlined as PhoneOutlinedIcon,
  LockOutlined as LockOutlinedIcon,
  EventOutlined as EventOutlinedIcon,
  BadgeOutlined as BadgeOutlinedIcon,
} from "@mui/icons-material";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import BackButton from "@/components/BackButton";

import { createDemoAccountApi } from "@/apis/user";
import { getProjects, getTowers, getFlats } from "@/utils/setupStore";
import type { Project, Tower, Flat } from "@/utils/setupStore";
import {
  getCachedProjects,
  getCachedTowers,
  getCachedFlats,
} from "@/utils/apiCache";

export default function AddDemoAccount() {
  const navigate = useNavigate();
  // Cascading Selection Lists
  const [projects, setProjects] = useState<Project[]>([]);
  const [towers, setTowers] = useState<Tower[]>([]);
  const [flats, setFlats] = useState<Flat[]>([]);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("Demo@12345");
  const [role, setRole] = useState("RESIDENT");
  const [projectId, setProjectId] = useState("");
  const [towerId, setTowerId] = useState("");
  const [flatId, setFlatId] = useState("");
  const [roleProfileId, setRoleProfileId] = useState("");
  const [accountRole, setAccountRole] = useState("OWNER");
  const [expiresAt, setExpiresAt] = useState("");

  // UI Flow States
  const [submitting, setSubmitting] = useState(false);
  const [credentials, setCredentials] = useState<any>(null); // To store response credentials

  // Load Initial Setup Data
  useEffect(() => {
    const loadSetupData = async () => {
      try {
        const projectList = await getCachedProjects();
        setProjects(projectList);
      } catch (error) {
        console.warn("Failed to fetch projects via API, falling back to local storage:", error);
        setProjects(getProjects());
      }
    };
    loadSetupData();
  }, []);

  // Project Selection Change
  const handleProjectChange = async (projId: string) => {
    setProjectId(projId);
    setTowerId("");
    setFlatId("");
    setTowers([]);
    setFlats([]);
    try {
      const list = await getCachedTowers(projId);
      setTowers(list);
    } catch (error) {
      console.warn("Failed to fetch towers via API, falling back to local storage:", error);
      setTowers(getTowers().filter((t) => t.projectId === projId));
    }
  };

  // Tower Selection Change
  const handleTowerChange = async (towId: string) => {
    setTowerId(towId);
    setFlatId("");
    setFlats([]);
    try {
      const list = await getCachedFlats(towId);
      setFlats(list);
    } catch (error) {
      console.warn("Failed to fetch flats via API, falling back to local storage:", error);
      setFlats(getFlats().filter((f) => f.towerId === towId));
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name is required");
    if (!email.trim()) return toast.error("Email is required");
    if (!phone.trim()) return toast.error("Phone number is required");
    if (!password) return toast.error("Password is required");

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        role,
        projectId: projectId || undefined,
        flatId: flatId || undefined,
        roleProfileId: roleProfileId.trim() || undefined,
        accountRole: accountRole || undefined,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      };

      const res = await createDemoAccountApi(payload);
      setCredentials(res?.data || res);
      toast.success("Demo account created successfully!");
    } catch (error: any) {
      toast.error(error?.message || "Failed to create demo account");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#ffffff", minHeight: "100vh", borderRadius: 2 }}>
      <Box sx={{ mb: 5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <BackButton to="/demo-accounts" label="Back to Demo Accounts" />
      </Box>

      <Box sx={{ maxWidth: 800, mx: "auto", border: "1px solid #f1f5f9", borderRadius: "24px", p: { xs: 3, md: 5 }, bgcolor: "white" }}>
        <Typography variant="h5" fontWeight="900" color="#091542" sx={{ pb: 2, borderBottom: "1px solid #f1f5f9", mb: 3 }}>
          {credentials ? "Demo Account Created" : "Create Demo Account"}
        </Typography>

        <Box sx={{ border: "none" }}>
          {credentials ? (
          // Success / Credentials view
          <Box sx={{ py: 2, textAlign: "center" }}>
            <SuccessIcon sx={{ fontSize: 64, color: "#10b981", mb: 2 }} />
            <Typography variant="h5" fontWeight="900" color="#091542" sx={{ mb: 1 }}>
              Account Credentials Generated
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Use the following details to log in to the demo environment.
            </Typography>

            <Stack spacing={2} sx={{ mb: 3, textAlign: "left" }}>
              <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <Typography variant="caption" fontWeight="800" color="#64748b">
                  NAME
                </Typography>
                <Typography variant="body1" fontWeight="700" color="#091542">
                  {credentials.name}
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <Typography variant="caption" fontWeight="800" color="#64748b">
                  CARD NUMBER
                </Typography>
                <Typography variant="body1" fontWeight="700" color="#1d4ed8">
                  {credentials.cardNumber || "N/A"}
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: "#eff6ff", borderRadius: "12px", border: "1px solid #bfdbfe" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="caption" fontWeight="800" color="#2c4d93">
                      EMAIL / USERNAME
                    </Typography>
                    <Typography variant="body1" fontWeight="700" color="#2c4d93">
                      {credentials.credentials?.identifier || credentials.email}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => handleCopy(credentials.credentials?.identifier || credentials.email, "Email")}
                  >
                    <CopyIcon fontSize="small" sx={{ color: "#2c4d93" }} />
                  </IconButton>
                </Stack>
              </Box>

              <Box sx={{ p: 2, bgcolor: "#eff6ff", borderRadius: "12px", border: "1px solid #bfdbfe" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="caption" fontWeight="800" color="#2c4d93">
                      PASSWORD
                    </Typography>
                    <Typography variant="body1" fontWeight="700" color="#2c4d93">
                      {credentials.credentials?.password || password}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => handleCopy(credentials.credentials?.password || password, "Password")}
                  >
                    <CopyIcon fontSize="small" sx={{ color: "#2c4d93" }} />
                  </IconButton>
                </Stack>
              </Box>
            </Stack>

            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate("/demo-accounts")}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 800,
                bgcolor: "#2c4d93",
                py: 1.5,
              }}
            >
              Done
            </Button>
          </Box>
        ) : (
          // Form View
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
            <TextField
              label="Full Name"
              required
              fullWidth
              value={name}
              sx={{ "& fieldset": { borderRadius: "12px" } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ bgcolor: '#e8effc', p: 0.5, borderRadius: '4px', mr: 1, ml: 1, display: 'flex' }}>
                      <PersonOutlineIcon sx={{ color: '#2c4d93', fontSize: '1.2rem' }} />
                    </Box>
                  </InputAdornment>
                ),
              }}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Email"
                type="email"
                required
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ "& fieldset": { borderRadius: "12px" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ bgcolor: '#e8effc', p: 0.5, borderRadius: '4px', mr: 1, ml: 1, display: 'flex' }}>
                        <EmailOutlinedIcon sx={{ color: '#2c4d93', fontSize: '1.2rem' }} />
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Phone Number"
                required
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                sx={{ "& fieldset": { borderRadius: "12px" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ bgcolor: '#e8effc', p: 0.5, borderRadius: '4px', mr: 1, ml: 1, display: 'flex' }}>
                        <PhoneOutlinedIcon sx={{ color: '#2c4d93', fontSize: '1.2rem' }} />
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Password"
                type="password"
                required
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ "& fieldset": { borderRadius: "12px" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ bgcolor: '#e8effc', p: 0.5, borderRadius: '4px', mr: 1, ml: 1, display: 'flex' }}>
                        <LockOutlinedIcon sx={{ color: '#2c4d93', fontSize: '1.2rem' }} />
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Role"
                select
                required
                fullWidth
                value={role}
                onChange={(e) => setRole(e.target.value)}
                sx={{ "& fieldset": { borderRadius: "12px" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ bgcolor: '#e8effc', p: 0.5, borderRadius: '4px', mr: 1, ml: 1, display: 'flex' }}>
                        <BadgeOutlinedIcon sx={{ color: '#2c4d93', fontSize: '1.2rem' }} />
                      </Box>
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="RESIDENT">RESIDENT</MenuItem>
                <MenuItem value="STAFF">STAFF</MenuItem>
                <MenuItem value="MANAGER">MANAGER</MenuItem>
                <MenuItem value="ADMIN">ADMIN</MenuItem>
              </TextField>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Project"
                select
                fullWidth
                value={projectId}
                onChange={(e) => handleProjectChange(e.target.value)}
                sx={{ "& fieldset": { borderRadius: "12px" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ bgcolor: '#e8effc', p: 0.5, borderRadius: '4px', mr: 1, ml: 1, display: 'flex' }}>
                        <EventOutlinedIcon sx={{ color: '#2c4d93', fontSize: '1.2rem' }} />
                      </Box>
                    </InputAdornment>
                  ),
                }}
              >
                {projects.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Tower"
                select
                fullWidth
                disabled={!projectId}
                value={towerId}
                onChange={(e) => handleTowerChange(e.target.value)}
                sx={{ "& fieldset": { borderRadius: "12px" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ bgcolor: '#e8effc', p: 0.5, borderRadius: '4px', mr: 1, ml: 1, display: 'flex' }}>
                        <EventOutlinedIcon sx={{ color: '#2c4d93', fontSize: '1.2rem' }} />
                      </Box>
                    </InputAdornment>
                  ),
                }}
              >
                {towers.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.name}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Flat"
                select
                fullWidth
                disabled={!towerId}
                value={flatId}
                onChange={(e) => setFlatId(e.target.value)}
                sx={{ "& fieldset": { borderRadius: "12px" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ bgcolor: '#e8effc', p: 0.5, borderRadius: '4px', mr: 1, ml: 1, display: 'flex' }}>
                        <EventOutlinedIcon sx={{ color: '#2c4d93', fontSize: '1.2rem' }} />
                      </Box>
                    </InputAdornment>
                  ),
                }}
              >
                {flats.map((f: any) => (
                  <MenuItem key={f.id} value={f.id}>
                    Flat {f.flatNumber || f.number}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Account Role"
                select
                fullWidth
                value={accountRole}
                onChange={(e) => setAccountRole(e.target.value)}
                sx={{ "& fieldset": { borderRadius: "12px" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ bgcolor: '#e8effc', p: 0.5, borderRadius: '4px', mr: 1, ml: 1, display: 'flex' }}>
                        <BadgeOutlinedIcon sx={{ color: '#2c4d93', fontSize: '1.2rem' }} />
                      </Box>
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="OWNER">OWNER</MenuItem>
                <MenuItem value="TENANT">TENANT</MenuItem>
              </TextField>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Role Profile ID"
                fullWidth
                value={roleProfileId}
                onChange={(e) => setRoleProfileId(e.target.value)}
                sx={{ "& fieldset": { borderRadius: "12px" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ bgcolor: '#e8effc', p: 0.5, borderRadius: '4px', mr: 1, ml: 1, display: 'flex' }}>
                        <BadgeOutlinedIcon sx={{ color: '#2c4d93', fontSize: '1.2rem' }} />
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Expiry Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                sx={{ "& fieldset": { borderRadius: "12px" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ bgcolor: '#e8effc', p: 0.5, borderRadius: '4px', mr: 1, ml: 1, display: 'flex' }}>
                        <EventOutlinedIcon sx={{ color: '#2c4d93', fontSize: '1.2rem' }} />
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>

            <DialogActions sx={{ p: 0, mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/demo-accounts")}
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 800,
                  px: 4,
                  borderColor: "#e2e8f0",
                  color: "#64748b",
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 800,
                  px: 4,
                  bgcolor: "#2c4d93",
                }}
              >
                {submitting ? <CircularProgress size={20} color="inherit" /> : "Create"}
              </Button>
            </DialogActions>
          </Box>
        )}
        </Box>
      </Box>
    </Box>
  );
}
