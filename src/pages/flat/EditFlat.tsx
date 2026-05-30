import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Breadcrumbs,
  Link,
  Paper,
  MenuItem,
  Divider,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Save as SaveIcon } from "@mui/icons-material";

import BackButton from "@/components/BackButton";
import { getProjects, getTowers, saveFlat, getFlats } from "@/utils/setupStore";
import { getProjectsApi } from "@/apis/project";
import { getTowersApi } from "@/apis/tower";
import { getFlatDetailsApi, updateFlatApi } from "@/apis/flat";
import { clearApiCache } from "@/utils/apiCache";
import { CircularProgress } from "@mui/material";
import { toast } from "react-hot-toast";

export default function EditFlat() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [projects, setProjects] = useState<any[]>([]);
  const [towers, setTowers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    projectId: "",
    towerId: "",
    number: "",
    floor: "",
    type: "2BHK" as "1BHK" | "2BHK" | "3BHK" | "4BHK" | "Studio" | "Penthouse",
    occupancyType: "OWNER" as "OWNER" | "TENANT" | "VACANT",
    status: "Vacant" as "Vacant" | "Occupied" | "Maintenance",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadFlatData = async () => {
      setLoading(true);
      try {
        if (!id) throw new Error("No flat ID provided");

        // Load projects first
        const projRes = await getProjectsApi({ limit: 100 });
        const projectList =
          projRes?.data?.data ||
          projRes?.data?.projects ||
          projRes?.projects ||
          projRes?.data ||
          [];
        setProjects(projectList);

        // Load towers for all projects in parallel
        const promises = projectList.map((p: any) =>
          getTowersApi(p.id, { page: 1, limit: 100 })
            .then((res) =>
              Array.isArray(res?.data?.data)
                ? res.data.data
                : res?.data?.towers || res?.towers || res?.data || [],
            )
            .catch(() => []),
        );
        const results = await Promise.all(promises);
        setTowers(results.flat());

        // Fetch flat details
        const res = await getFlatDetailsApi(id);
        const flat = res?.data || res;
        if (flat) {
          let normStatus: "Vacant" | "Occupied" | "Maintenance" = "Vacant";
          if (flat.status === "OCCUPIED" || flat.status === "Occupied")
            normStatus = "Occupied";
          else if (
            flat.status === "MAINTENANCE" ||
            flat.status === "Maintenance"
          )
            normStatus = "Maintenance";

          setFormData({
            projectId: flat.projectId || "",
            towerId: flat.towerId || "",
            number: String(flat.flatNumber || flat.number || ""),
            floor: String(flat.floorNumber || flat.floor || ""),
            type: flat.flatType || flat.type || "2BHK",
            occupancyType: flat.occupancyType || "OWNER",
            status: normStatus,
          });
        } else {
          throw new Error("Flat details empty");
        }
      } catch (error) {
        console.warn(
          "Failed to fetch flat via API, performing local storage fallback:",
          error,
        );
        setProjects(getProjects());
        setTowers(getTowers());

        const flats = getFlats();
        const flat = flats.find((f) => f.id === id);
        if (flat) {
          setFormData({
            projectId: flat.projectId,
            towerId: flat.towerId,
            number: flat.number,
            floor: flat.floor,
            type: flat.type,
            occupancyType: flat.ownerName ? "OWNER" : "TENANT",
            status: flat.status,
          });
        } else {
          navigate("/flat");
        }
      } finally {
        setLoading(false);
      }
    };
    loadFlatData();
  }, [id, navigate]);

  // Dynamically filter towers based on project selection
  const filteredTowers = formData.projectId
    ? towers.filter((t) => t.projectId === formData.projectId)
    : [];

  const handleProjectChange = (projId: string) => {
    setFormData((prev) => ({
      ...prev,
      projectId: projId,
      towerId: "", // Reset tower selection
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.projectId) newErrors.projectId = "Project is required";
    if (!formData.towerId) newErrors.towerId = "Tower is required";
    if (!formData.number.trim()) newErrors.number = "Flat Number is required";
    if (!formData.floor.trim()) newErrors.floor = "Floor is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!id) return;

    setSubmitting(true);
    try {
      const payload = {
        flatNumber: formData.number.trim(),
        floorNumber: formData.floor.trim(),
        flatType: formData.type,
        occupancyType: formData.occupancyType,
        status:
          formData.status === "Vacant"
            ? "VACANT"
            : formData.status === "Occupied"
              ? "OCCUPIED"
              : "MAINTENANCE",
      };

      await updateFlatApi(id, payload);
      clearApiCache();
      toast.success("Flat details updated successfully");
      navigate("/flat");
    } catch (error: any) {
      console.error("API flat update failed:", error);
      const errMsg = error?.message || "Failed to update flat details";
      toast.error(errMsg);

      if (error?.status === 0) {
        try {
          saveFlat({
            ...formData,
            id: id,
          });
          toast.success("Flat details saved locally (offline fallback)");
          navigate("/flat");
        } catch (localError) {
          toast.error("Failed to save flat locally");
        }
      }
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
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        bgcolor: "#ffffff",
        minHeight: "100vh",
        borderRadius: "12px",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
        }}
      >
        
        <BackButton to="/flat" label="Back to Flats" />
      </Box>

      {/* Form Container */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid #f0f0f0",
          borderRadius: "16px",
          p: { xs: 3, md: 5 },
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          color="#091542"
          sx={{ mb: 3 }}
        >
          Flat Details: Flat {formData.number}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 3,
              mb: 4,
            }}
          >
            {/* Project Selection */}
            <TextField
              fullWidth
              select
              disabled
              label="Select Project *"
              value={formData.projectId}
              onChange={(e) => handleProjectChange(e.target.value as string)}
              error={!!errors.projectId}
              helperText={errors.projectId}
              sx={{ "& fieldset": { borderRadius: "8px" } }}
            >
              {projects.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name} ({p.code})
                </MenuItem>
              ))}
            </TextField>

            {/* Tower Selection (Cascaded) */}
            <TextField
              fullWidth
              select
              disabled
              label="Select Tower *"
              value={formData.towerId}
              onChange={(e) =>
                setFormData({ ...formData, towerId: e.target.value })
              }
              error={!!errors.towerId}
              helperText={
                errors.towerId ||
                (!formData.projectId ? "Please select a Project first" : "")
              }
              sx={{ "& fieldset": { borderRadius: "8px" } }}
            >
              {filteredTowers.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Flat Number *"
              variant="outlined"
              value={formData.number}
              onChange={(e) =>
                setFormData({ ...formData, number: e.target.value })
              }
              error={!!errors.number}
              helperText={errors.number}
              sx={{ "& fieldset": { borderRadius: "8px" } }}
            />

            <TextField
              fullWidth
              label="Floor *"
              variant="outlined"
              value={formData.floor}
              onChange={(e) =>
                setFormData({ ...formData, floor: e.target.value })
              }
              error={!!errors.floor}
              helperText={errors.floor}
              sx={{ "& fieldset": { borderRadius: "8px" } }}
            />

            <TextField
              fullWidth
              select
              label="Flat Type *"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as any })
              }
              sx={{ "& fieldset": { borderRadius: "8px" } }}
            >
              <MenuItem value="1BHK">1BHK</MenuItem>
              <MenuItem value="2BHK">2BHK</MenuItem>
              <MenuItem value="3BHK">3BHK</MenuItem>
              <MenuItem value="4BHK">4BHK</MenuItem>
              <MenuItem value="Studio">Studio</MenuItem>
              <MenuItem value="Penthouse">Penthouse</MenuItem>
            </TextField>

            <TextField
              fullWidth
              select
              label="Occupancy Status *"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as any })
              }
              sx={{ "& fieldset": { borderRadius: "8px" } }}
            >
              <MenuItem value="Vacant">Vacant</MenuItem>
              <MenuItem value="Occupied">Occupied</MenuItem>
              <MenuItem value="Maintenance">Maintenance</MenuItem>
            </TextField>

            <TextField
              fullWidth
              select
              label="Occupancy Type *"
              value={formData.occupancyType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  occupancyType: e.target.value as any,
                })
              }
              sx={{ "& fieldset": { borderRadius: "8px" } }}
            >
              <MenuItem value="OWNER">Owner</MenuItem>
              <MenuItem value="TENANT">Tenant</MenuItem>
              <MenuItem value="VACANT">Vacant</MenuItem>
            </TextField>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/flat")}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                px: 4,
                fontWeight: 600,
                borderColor: "#e0e0e0",
                color: "text.primary",
                "&:hover": { borderColor: "#b0b0b0" },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              startIcon={<SaveIcon />}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                px: 4,
                fontWeight: 600,
                boxShadow: "none",
                bgcolor: "#0047b3",
                "&:hover": { bgcolor: "#003380" },
              }}
            >
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}