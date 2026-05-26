import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Divider,
  Avatar,
  IconButton
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import FormCard from "@/components/FormCard";
import { getProjects, getTowers, getFlats } from "@/utils/setupStore";
import type { Project, Tower, Flat } from "@/utils/setupStore";
import { getCachedProjects, getCachedTowers, getCachedFlats } from "@/utils/apiCache";
import { getUserDetailsApi, updateUserApi } from "@/apis/user";
import { uploadDocumentApi } from "@/apis/document";
import { toast } from "react-hot-toast";
import { getFileUrl } from "@/utils/file";

export default function EditResident() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Reactive State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    apartment: "",
    membership: "Active",
    cardNo: "",
    status: "ACTIVE",
    avatar: "",
  });

  // Cascading states
  const [projectId, setProjectId] = useState("");
  const [towerId, setTowerId] = useState("");
  const [flatId, setFlatId] = useState("");

  const [projects, setProjects] = useState<Project[]>([]);
  const [towers, setTowers] = useState<Tower[]>([]);
  const [flats, setFlats] = useState<Flat[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadSetupData = async () => {
    try {
      const projectList = await getCachedProjects();
      setProjects(projectList);
    } catch (error) {
      console.warn(
        "Failed to fetch projects via API, falling back to local storage:",
        error,
      );
      setProjects(getProjects());
    }
  };

  const loadTowersForProject = async (projId: string) => {
    try {
      const list = await getCachedTowers(projId);
      setTowers(list);
    } catch (error) {
      console.warn(
        "Failed to fetch towers via API, falling back to local storage:",
        error,
      );
      setTowers(getTowers().filter((t) => t.projectId === projId));
    }
  };

  const loadFlatsForTower = async (towId: string) => {
    try {
      const list = await getCachedFlats(towId);
      setFlats(list);
    } catch (error) {
      console.warn(
        "Failed to fetch flats via API, falling back to local storage:",
        error,
      );
      setFlats(getFlats().filter((f) => f.towerId === towId));
    }
  };

  const fetchResidentDetails = async () => {
    setLoading(true);
    try {
      await loadSetupData();

      const res = await getUserDetailsApi(id || "");
      const user = res?.data || res;

      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        apartment: user.apartment || "",
        membership: "Active",
        cardNo: user.cardNo || `CMR-${user.id?.substring(0, 6).toUpperCase()}`,
        status: user.status || "ACTIVE",
        avatar: user.photoUrl || user.profilePhotoUrl || user.avatar || "",
      });

      if (user.flat) {
        setProjectId(user.flat.projectId);
        setTowerId(user.flat.towerId);
        setFlatId(user.flat.id || user.flatId);
      } else if (user.flatId) {
        setFlatId(user.flatId);
        // Find flat details to pre-populate project and tower selection cascading
        try {
          const flat = getFlats().find((f) => f.id === user.flatId);
          if (flat) {
            setTowerId(flat.towerId);
            const tower = getTowers().find((t) => t.id === flat.towerId);
            if (tower) {
              setProjectId(tower.projectId);
            }
          }
        } catch (e) {
          console.warn("Failed to resolve flat/tower mappings:", e);
        }
      }
    } catch (error) {
      console.warn("Failed to fetch resident details, using fallback:", error);
      // Fallback
      setFormData({
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "9876543210",
        apartment: "A-101",
        membership: "Active",
        cardNo: "CMR10101",
        status: "ACTIVE",
        avatar: "",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const url = await uploadDocumentApi(file);
        setFormData(prev => ({ ...prev, avatar: url }));
        toast.success("Profile photo uploaded successfully");
      } catch (err: any) {
        toast.error(err?.message || "Failed to upload photo");
      }
    }
  };

  useEffect(() => {
    fetchResidentDetails();
  }, [id]);

  useEffect(() => {
    if (projectId) {
      loadTowersForProject(projectId);
    } else {
      setTowers([]);
    }
  }, [projectId]);

  useEffect(() => {
    if (towerId) {
      loadFlatsForTower(towerId);
    } else {
      setFlats([]);
    }
  }, [towerId]);

  const handleFlatChange = (selectedFlatId: string) => {
    setFlatId(selectedFlatId);
    const flat = flats.find((f) => f.id === selectedFlatId);
    const tower = towers.find((t) => t.id === towerId);
    const project = projects.find((p) => p.id === projectId);
    if (flat && tower && project) {
      setFormData((prev) => ({
        ...prev,
        apartment: `${project.name} • ${tower.name} • Flat ${(flat as any).flatNumber || flat.number}`,
      }));
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Full name is required");
      return;
    }
    setSubmitting(true);
    try {
      await updateUserApi(id || "", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        flatId: flatId || undefined,
        status: formData.status,
        profilePhotoUrl: formData.avatar || undefined,
      });
      toast.success("Resident details updated successfully");
      navigate("/residents");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update resident details");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <FormCard
      title="Edit Resident"
      subtitle={formData.name ? `Editing details for ${formData.name}` : "Update resident information"}
      onBack={() => navigate("/residents")}
    >
        {/* Profile Picture Upload */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 5,
          }}
        >
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={getFileUrl(formData.avatar)}
              sx={{
                width: 100,
                height: 100,
                bgcolor: "#f5f7fa",
                color: "#bdbdbd",
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
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Allowed *.jpeg, *.jpg, *.png, *.gif
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Max size of 3.1 MB
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Form Fields */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 3,
          }}
        >
          <TextField
            fullWidth
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            variant="outlined"
            sx={{ "& fieldset": { borderRadius: "12px" } }}
          />
          <TextField
            fullWidth
            disabled
            label="Email Address"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            variant="outlined"
            helperText="Email address cannot be changed"
            sx={{ 
              "& fieldset": { borderRadius: "12px" },
              "& .MuiInputBase-root.Mui-disabled": {
                bgcolor: "#f1f5f9",
              },
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#0f172a",
                color: "#0f172a",
                opacity: 1,
                fontWeight: 600
              }
            }}
          />
          <TextField
            fullWidth
            label="Phone Number"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            variant="outlined"
            sx={{ "& fieldset": { borderRadius: "12px" } }}
          />
          <TextField
            fullWidth
            select
            label="Status"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            sx={{ "& fieldset": { borderRadius: "12px" } }}
          >
            <MenuItem value="ACTIVE">ACTIVE</MenuItem>
            <MenuItem value="INACTIVE">INACTIVE</MenuItem>
            <MenuItem value="PENDING">PENDING</MenuItem>
            <MenuItem value="SUSPENDED">SUSPENDED</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Access Card Number"
            value={formData.cardNo}
            disabled
            variant="outlined"
            sx={{ "& fieldset": { borderRadius: "12px" } }}
          />

          <Box sx={{ gridColumn: "span 2" }}>
            <Divider sx={{ my: 2 }} />
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              color="#091542"
              sx={{ mb: 2 }}
            >
              Resident Flat Allocation: {formData.apartment || "Not selected"}
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
                gap: 3,
              }}
            >
              <TextField
                fullWidth
                select
                label="Project"
                value={projectId}
                onChange={(e) => {
                  setProjectId(e.target.value);
                }}
                sx={{ "& fieldset": { borderRadius: "12px" } }}
              >
                {projects.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                select
                label="Tower"
                value={towerId}
                disabled={!projectId}
                onChange={(e) => {
                  setTowerId(e.target.value);
                }}
                sx={{ "& fieldset": { borderRadius: "12px" } }}
              >
                {towers.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                select
                label="Flat"
                value={flatId}
                disabled={!towerId}
                onChange={(e) => handleFlatChange(e.target.value)}
                sx={{ "& fieldset": { borderRadius: "12px" } }}
              >
                {flats.map((f) => (
                  <MenuItem key={f.id} value={f.id}>
                    {(f as any).flatNumber || f.number} (Floor{" "}
                    {(f as any).floorNumber || f.floor})
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 5 }}
        >
          <Button
            variant="outlined"
            disabled={submitting}
            onClick={() => navigate("/residents")}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              px: 4,
              fontWeight: 600,
              borderColor: "#e0e0e0",
              color: "text.primary",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={submitting}
            onClick={handleSave}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              px: 4,
              fontWeight: 600,
              boxShadow: "none",
              bgcolor: "#0047b3",
            }}
          >
            {submitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </Box>
    </FormCard>
  );
}
