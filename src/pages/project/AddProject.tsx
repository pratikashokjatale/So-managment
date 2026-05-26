import { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { Save as SaveIcon } from "@mui/icons-material";

import BackButton from "@/components/BackButton";
import { saveProject } from "@/utils/setupStore";
import { createProjectApi } from "@/apis/project";
import { toast } from "react-hot-toast";

export default function AddProject() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    location: "",
    status: "Active" as "Active" | "Inactive",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Project Name is required";
    if (!formData.code.trim()) newErrors.code = "Project Code is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload: any = {
        name: formData.name.trim(),
        code: formData.code.trim(),
      };

      if (formData.description?.trim()) {
        payload.description = formData.description.trim();
      }

      if (formData.location?.trim()) {
        payload.location = formData.location.trim();
      }

      await createProjectApi(payload);
      toast.success("Project created successfully");
      navigate("/project");
    } catch (error: any) {
      console.error("API project creation failed:", error);
      const errMsg = error?.message || "Failed to create project";
      toast.error(errMsg);

      if (error?.status === 0) {
        try {
          saveProject(formData);
          toast.success("Project created successfully (offline fallback)");
          navigate("/project");
        } catch (localError) {
          toast.error("Failed to save project locally");
        }
      }
    } finally {
      setLoading(false);
    }
  };

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
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: "#091542", mb: 1 }}
          >
            Add New Project
          </Typography>
          <Breadcrumbs separator=">" aria-label="breadcrumb">
            <Link
              underline="hover"
              color="inherit"
              onClick={() => navigate("/")}
              sx={{ cursor: "pointer" }}
            >
              Dashboard
            </Link>
            <Link
              underline="hover"
              color="inherit"
              onClick={() => navigate("/project")}
              sx={{ cursor: "pointer" }}
            >
              Projects
            </Link>
            <Typography color="text.primary" fontWeight="600">
              Add Project
            </Typography>
          </Breadcrumbs>
        </Box>
        <BackButton to="/project" label="Back to Projects" />
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
          Project Details
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
            <TextField
              fullWidth
              label="Project Name *"
              placeholder="e.g. Marbella Club"
              variant="outlined"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              error={!!errors.name}
              helperText={errors.name}
              sx={{ "& fieldset": { borderRadius: "8px" } }}
            />
            <TextField
              fullWidth
              label="Project Code *"
              placeholder="e.g. MC01"
              variant="outlined"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              error={!!errors.code}
              helperText={errors.code}
              sx={{ "& fieldset": { borderRadius: "8px" } }}
            />
            <TextField
              fullWidth
              label="Location *"
              placeholder="e.g. Goa, India"
              variant="outlined"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              error={!!errors.location}
              helperText={errors.location}
              sx={{ "& fieldset": { borderRadius: "8px" } }}
            />
            <TextField
              fullWidth
              select
              label="Status"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as "Active" | "Inactive",
                })
              }
              sx={{ "& fieldset": { borderRadius: "8px" } }}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>
            <Box sx={{ gridColumn: "span 2" }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                placeholder="Brief description about the project development, amenities, sector, etc."
                variant="outlined"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                sx={{ "& fieldset": { borderRadius: "8px" } }}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/project")}
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
              startIcon={<SaveIcon />}
              disabled={loading}
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
              {loading ? "Saving..." : "Save Project"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
