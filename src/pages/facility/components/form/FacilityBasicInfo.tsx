import { useRef } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import { getFileUrl } from "@/utils/file";
import { fieldSx, sectionCardSx, sectionHeaderIconSx } from "./formStyles";

const CATEGORIES = ["Sports", "Fitness", "Leisure", "Wellness", "Other"];
const ICONS = [
  { value: "SportsTennis", label: "Sports / Tennis" },
  { value: "FitnessCenter", label: "Gym / Fitness" },
  { value: "Movie", label: "Cinema / Theatre" },
  { value: "Spa", label: "Spa / Sauna / Steam" },
  { value: "SelfImprovement", label: "Yoga / Meditation" },
  { value: "Pool", label: "Swimming Pool" },
  { value: "Park", label: "Park / Jogging Track" },
  { value: "Circle", label: "Billiards / Other" },
];

function SectionHeader({ icon, color, bgColor, title, subtitle }: any) {
  return (
    <>
      <Box sx={{ px: 4, py: 2.5, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={sectionHeaderIconSx(color, bgColor)}>{icon}</Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={800} sx={{ color: "#0F172A", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.01em" }}>
            {title}
          </Typography>
          <Typography variant="caption" sx={{ color: "#64748B", fontFamily: "'Inter', sans-serif" }}>{subtitle}</Typography>
        </Box>
      </Box>
      <Divider sx={{ borderColor: "#EEF2F7" }} />
    </>
  );
}

interface Props {
  data: any;
  onChange: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export default function FacilityBasicInfo({ data, onChange, errors }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange("imageFile", file);
      const reader = new FileReader();
      reader.onloadend = () => onChange("imagePreview", reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Paper elevation={0} sx={sectionCardSx}>

      {/* ── Cover Photo ─────────────────────────── */}
      <SectionHeader
        icon={<ImageOutlinedIcon fontSize="small" />}
        color="#7c3aed" bgColor="#f5f3ff"
        title="Cover Photo"
        subtitle="Upload a representative photo for this facility"
      />
      <Box sx={{ px: 4, py: 3.5, display: "flex", alignItems: "center", gap: 4 }}>
        <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleImageChange} />
        <Box sx={{ position: "relative", flexShrink: 0 }}>
          <Box
            component="img"
            src={getFileUrl(data.imagePreview) || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop"}
            sx={{
              width: 220, height: 140, borderRadius: "16px", objectFit: "cover",
              display: "block", border: "2px solid #EEF2F7",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            }}
          />
          <Box
            onClick={() => fileInputRef.current?.click()}
            sx={{
              position: "absolute", bottom: -10, right: -10,
              width: 40, height: 40, borderRadius: "50%",
              bgcolor: "#091542", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(9,21,66,0.35)",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": { transform: "scale(1.1)", boxShadow: "0 6px 16px rgba(9,21,66,0.4)" },
            }}
          >
            <EditIcon sx={{ fontSize: 16, color: "white" }} />
          </Box>
        </Box>
        <Box>
          <Typography fontWeight={700} sx={{ color: "#0F172A", fontFamily: "'Inter', sans-serif", mb: 0.5 }}>
            Facility Cover Image
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B", mb: 2, maxWidth: 320, fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}>
            Use a high-quality landscape image. JPG or PNG, max 5MB. Recommended: 1280×720px.
          </Typography>
          <Button
            variant="outlined" size="small"
            onClick={() => fileInputRef.current?.click()}
            sx={{
              borderRadius: "10px", fontWeight: 600, textTransform: "none",
              borderColor: "#E2E8F0", color: "#475569", fontSize: "0.8125rem",
              fontFamily: "'Inter', sans-serif", px: 2.5, py: 1,
              "&:hover": { borderColor: "#2563EB", color: "#2563EB", bgcolor: "#EFF6FF" },
            }}
          >
            Choose Image
          </Button>
        </Box>
      </Box>

      {/* ── Facility Identity ────────────────────── */}
      <SectionHeader
        icon={<InfoOutlinedIcon fontSize="small" />}
        color="#2563eb" bgColor="#eff6ff"
        title="Facility Identity"
        subtitle="Name, unique code, category and display icon"
      />
      <Box sx={{ px: 4, py: 3.5 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth label="Facility Name"
              value={data.name}
              onChange={(e) => onChange("name", e.target.value)}
              error={!!errors.name}
              helperText={errors.name || " "}
              placeholder="e.g. Grand Gym"
              required
              sx={fieldSx}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth label="Facility Code"
              value={data.code}
              onChange={(e) => onChange("code", e.target.value)}
              helperText="Auto-generated if empty"
              placeholder="e.g. GYM-001"
              sx={fieldSx}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select fullWidth label="Category"
              value={data.category}
              onChange={(e) => onChange("category", e.target.value)}
              helperText=" "
              sx={fieldSx}
              InputLabelProps={{ shrink: true }}
            >
              {CATEGORIES.map((c) => <MenuItem key={c} value={c} sx={{ fontFamily: "'Inter', sans-serif" }}>{c}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select fullWidth label="Display Icon"
              value={data.iconName}
              onChange={(e) => onChange("iconName", e.target.value)}
              helperText="Displayed on the card"
              sx={fieldSx}
              InputLabelProps={{ shrink: true }}
            >
              {ICONS.map((icon) => (
                <MenuItem key={icon.value} value={icon.value} sx={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}>
                  {icon.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>

      {/* ── Location ─────────────────────────────── */}
      <SectionHeader
        icon={<PlaceOutlinedIcon fontSize="small" />}
        color="#16a34a" bgColor="#f0fdf4"
        title="Location"
        subtitle="Where this facility is physically situated"
      />
      <Box sx={{ px: 4, py: 3.5 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth label="Building / Wing"
              value={data.location}
              onChange={(e) => onChange("location", e.target.value)}
              placeholder="e.g. Clubhouse"
              helperText=" "
              sx={fieldSx}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth label="Floor"
              value={data.floor}
              onChange={(e) => onChange("floor", e.target.value)}
              placeholder="e.g. Ground Floor"
              helperText=" "
              sx={fieldSx}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* ── Manager & Description ──────────────── */}
      <SectionHeader
        icon={<BadgeOutlinedIcon fontSize="small" />}
        color="#ea580c" bgColor="#fff7ed"
        title="Manager & Description"
        subtitle="Point of contact and overview of the facility"
      />
      <Box sx={{ px: 4, py: 3.5 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth label="Manager Name"
              value={data.managerName}
              onChange={(e) => onChange("managerName", e.target.value)}
              error={!!errors.managerName}
              helperText={errors.managerName || " "}
              placeholder="e.g. Rakesh Kumar"
              required
              sx={fieldSx}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth label="Manager Contact"
              value={data.managerContact}
              onChange={(e) => onChange("managerContact", e.target.value)}
              error={!!errors.managerContact}
              helperText={errors.managerContact || "Include country code"}
              placeholder="+91 98765 43210"
              required
              sx={fieldSx}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth label="Description" multiline rows={4}
              value={data.description}
              onChange={(e) => onChange("description", e.target.value)}
              error={!!errors.description}
              helperText={errors.description || "Describe the facility's rules, usage, and specifications"}
              placeholder="e.g. The gym is equipped with premium cardio machines, free weights, and resistance equipment..."
              required
              sx={fieldSx}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
