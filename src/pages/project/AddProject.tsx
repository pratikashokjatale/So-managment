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
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Save as SaveIcon,
  Search as SearchIcon,
  MyLocation as GpsIcon,
} from "@mui/icons-material";

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
    geofenceEnabled: false,
    geofenceLatitude: "",
    geofenceLongitude: "",
    geofenceRadiusMeters: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [addressSearch, setAddressSearch] = useState("");
  const [geocodingLoading, setGeocodingLoading] = useState(false);

  const handleSearchAddress = async () => {
    if (!addressSearch.trim()) {
      toast.error("Please enter an address to search");
      return;
    }
    setGeocodingLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          addressSearch.trim()
        )}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setFormData((prev) => ({
          ...prev,
          geofenceLatitude: parseFloat(lat).toFixed(7),
          geofenceLongitude: parseFloat(lon).toFixed(7),
        }));
        toast.success("Coordinates retrieved successfully!");
      } else {
        toast.error("No coordinates found for the entered address.");
      }
    } catch (error) {
      console.error("Geocoding failed:", error);
      toast.error("Failed to retrieve coordinates for the address.");
    } finally {
      setGeocodingLoading(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    toast.loading("Retrieving GPS coordinates...", { id: "geolocation" });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          geofenceLatitude: position.coords.latitude.toFixed(7),
          geofenceLongitude: position.coords.longitude.toFixed(7),
        }));
        toast.success("Current location retrieved!", { id: "geolocation" });
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Failed to retrieve current location. Please check browser permissions.", {
          id: "geolocation",
        });
      }
    );
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Project Name is required";
    if (!formData.code.trim()) newErrors.code = "Project Code is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";

    if (formData.geofenceEnabled) {
      if (formData.geofenceLatitude === "" || formData.geofenceLatitude === undefined) {
        newErrors.geofenceLatitude = "Latitude is required when geofence is enabled";
      } else if (isNaN(Number(formData.geofenceLatitude))) {
        newErrors.geofenceLatitude = "Latitude must be a number";
      }
      if (formData.geofenceLongitude === "" || formData.geofenceLongitude === undefined) {
        newErrors.geofenceLongitude = "Longitude is required when geofence is enabled";
      } else if (isNaN(Number(formData.geofenceLongitude))) {
        newErrors.geofenceLongitude = "Longitude must be a number";
      }
      if (formData.geofenceRadiusMeters === "" || formData.geofenceRadiusMeters === undefined) {
        newErrors.geofenceRadiusMeters = "Radius is required when geofence is enabled";
      } else if (isNaN(Number(formData.geofenceRadiusMeters)) || Number(formData.geofenceRadiusMeters) <= 0) {
        newErrors.geofenceRadiusMeters = "Radius must be a positive number";
      }
    }

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
        geofenceEnabled: formData.geofenceEnabled,
      };

      if (formData.description?.trim()) {
        payload.description = formData.description.trim();
      }

      if (formData.location?.trim()) {
        payload.location = formData.location.trim();
      }

      if (formData.geofenceEnabled) {
        payload.geofenceLatitude = Number(formData.geofenceLatitude);
        payload.geofenceLongitude = Number(formData.geofenceLongitude);
        payload.geofenceRadiusMeters = Number(formData.geofenceRadiusMeters);
      } else {
        payload.geofenceLatitude = null;
        payload.geofenceLongitude = null;
        payload.geofenceRadiusMeters = null;
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
          saveProject({
            ...formData,
            geofenceLatitude: formData.geofenceEnabled ? Number(formData.geofenceLatitude) : undefined,
            geofenceLongitude: formData.geofenceEnabled ? Number(formData.geofenceLongitude) : undefined,
            geofenceRadiusMeters: formData.geofenceEnabled ? Number(formData.geofenceRadiusMeters) : undefined,
          });
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
          justifyContent: "end",
          alignItems: "center",
        }}
      >
        
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

          <Typography
            variant="subtitle1"
            fontWeight="bold"
            color="#091542"
            sx={{ mb: 2 }}
          >
            Geofencing Settings
          </Typography>

          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.geofenceEnabled}
                  onChange={(e) =>
                    setFormData({ ...formData, geofenceEnabled: e.target.checked })
                  }
                  color="primary"
                />
              }
              label="Enable Geofence for this project"
            />
          </Box>

          {formData.geofenceEnabled && (
            <Box sx={{ mb: 4 }}>
              {/* Geocoding controls row */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "3fr 1fr" },
                  gap: 2,
                  mb: 3,
                }}
              >
                <TextField
                  fullWidth
                  label="Search Location / Address"
                  placeholder="Enter address (e.g. Marbella Club, Pune) to retrieve coordinates"
                  variant="outlined"
                  value={addressSearch}
                  onChange={(e) => setAddressSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearchAddress();
                    }
                  }}
                  sx={{ "& fieldset": { borderRadius: "8px" } }}
                />
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                  }}
                >
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<SearchIcon />}
                    onClick={handleSearchAddress}
                    disabled={geocodingLoading}
                    sx={{
                      borderRadius: "8px",
                      textTransform: "none",
                      fontWeight: 600,
                      borderColor: "#0047b3",
                      color: "#0047b3",
                      "&:hover": { borderColor: "#003380", bgcolor: "#eff6ff" },
                    }}
                  >
                    {geocodingLoading ? "Searching..." : "Search"}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleGetCurrentLocation}
                    sx={{
                      borderRadius: "8px",
                      minWidth: "56px",
                      height: "56px",
                      p: 0,
                      borderColor: "#10b981",
                      color: "#10b981",
                      "&:hover": { borderColor: "#059669", bgcolor: "#ecfdf5" },
                    }}
                    title="Get Coordinates from My GPS Location"
                  >
                    <GpsIcon />
                  </Button>
                </Box>
              </Box>

              {/* Coordinates inputs row */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
                  gap: 3,
                }}
              >
                <TextField
                  fullWidth
                  type="number"
                  inputProps={{ step: "any" }}
                  label="Geofence Latitude *"
                  placeholder="e.g. 18.5204303"
                  variant="outlined"
                  value={formData.geofenceLatitude}
                  onChange={(e) =>
                    setFormData({ ...formData, geofenceLatitude: e.target.value })
                  }
                  error={!!errors.geofenceLatitude}
                  helperText={errors.geofenceLatitude}
                  sx={{ "& fieldset": { borderRadius: "8px" } }}
                />
                <TextField
                  fullWidth
                  type="number"
                  inputProps={{ step: "any" }}
                  label="Geofence Longitude *"
                  placeholder="e.g. 73.8567437"
                  variant="outlined"
                  value={formData.geofenceLongitude}
                  onChange={(e) =>
                    setFormData({ ...formData, geofenceLongitude: e.target.value })
                  }
                  error={!!errors.geofenceLongitude}
                  helperText={errors.geofenceLongitude}
                  sx={{ "& fieldset": { borderRadius: "8px" } }}
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Geofence Radius (Meters) *"
                  placeholder="e.g. 300"
                  variant="outlined"
                  value={formData.geofenceRadiusMeters}
                  onChange={(e) =>
                    setFormData({ ...formData, geofenceRadiusMeters: e.target.value })
                  }
                  error={!!errors.geofenceRadiusMeters}
                  helperText={errors.geofenceRadiusMeters}
                  sx={{ "& fieldset": { borderRadius: "8px" } }}
                />
              </Box>
            </Box>
          )}

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