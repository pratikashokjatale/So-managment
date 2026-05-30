import {
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Paper,
  Divider,
  Chip,
  Switch,
  Stack,
} from "@mui/material";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import ToggleOnOutlinedIcon from "@mui/icons-material/ToggleOnOutlined";
import { fieldSx, sectionCardSx, sectionHeaderIconSx } from "./formStyles";

function SectionHeader({ icon, title, subtitle, color, bgColor }: any) {
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

const switchSx = {
  width: 44,
  height: 24,
  p: 0,
  "& .MuiSwitch-switchBase": {
    p: 0, m: "3px",
    "&.Mui-checked": {
      transform: "translateX(20px)",
      color: "white",
      "& + .MuiSwitch-track": { bgcolor: "#2563EB", opacity: 1, border: 0 },
    },
  },
  "& .MuiSwitch-thumb": { width: 18, height: 18, boxShadow: "0 1px 4px rgba(0,0,0,0.2)" },
  "& .MuiSwitch-track": { borderRadius: 12, bgcolor: "#E2E8F0", opacity: 1 },
};

const ACCESS_TYPE_INFO: Record<string, { label: string; description: string; color: string }> = {
  SLOT_BOOKING: { label: "Slot Booking Only", description: "Residents pay per slot — no subscription needed.", color: "#2563eb" },
  SUBSCRIPTION: { label: "Subscription Only", description: "Residents pay a monthly plan for open access.", color: "#16a34a" },
  MIXED: { label: "Subscription + Slot", description: "Subscription required, then resident reserves a slot.", color: "#ea580c" },
  EVENT_SHOW: { label: "Event / Show", description: "Fixed session or show-based access.", color: "#9333ea" },
};

interface Props {
  data: any;
  onChange: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export default function FacilityAccessRules({ data, onChange, errors }: Props) {
  const accessInfo = ACCESS_TYPE_INFO[data.accessType];

  return (
    <Paper elevation={0} sx={sectionCardSx}>

      {/* ── Access & Booking ──────────────────── */}
      <SectionHeader
        icon={<GppGoodOutlinedIcon fontSize="small" />}
        title="Access & Booking Mode"
        subtitle="How residents get permission to use this facility"
        color="#dc2626" bgColor="#fef2f2"
      />
      <Box sx={{ px: 4, py: 3.5 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select fullWidth label="Access Type"
              value={data.accessType}
              onChange={(e) => {
                const val = e.target.value;
                onChange("accessType", val);
                if (val === "SUBSCRIPTION") onChange("bookingMode", "NONE");
                else if (data.bookingMode === "NONE") onChange("bookingMode", "SLOT");
              }}
              helperText=" "
              sx={fieldSx}
              InputLabelProps={{ shrink: true }}
            >
              {Object.entries(ACCESS_TYPE_INFO).map(([val, info]) => (
                <MenuItem key={val} value={val} sx={{ fontFamily: "'Inter', sans-serif" }}>{info.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select fullWidth label="Booking Mode"
              value={data.bookingMode}
              onChange={(e) => onChange("bookingMode", e.target.value)}
              disabled={data.accessType === "SUBSCRIPTION"}
              helperText={data.accessType === "SUBSCRIPTION" ? "Not applicable" : "How time slots are structured"}
              sx={fieldSx}
              InputLabelProps={{ shrink: true }}
            >
              <MenuItem value="SLOT" sx={{ fontFamily: "'Inter', sans-serif" }}>Slot Booking</MenuItem>
              <MenuItem value="CAPACITY" sx={{ fontFamily: "'Inter', sans-serif" }}>Capacity-based</MenuItem>
              <MenuItem value="EVENT" sx={{ fontFamily: "'Inter', sans-serif" }}>Event</MenuItem>
              <MenuItem value="WALK_IN" sx={{ fontFamily: "'Inter', sans-serif" }}>Walk-In</MenuItem>
              <MenuItem value="NONE" sx={{ fontFamily: "'Inter', sans-serif" }}>No Booking Required</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select fullWidth label="Facility Status"
              value={data.status}
              onChange={(e) => onChange("status", e.target.value)}
              helperText="Current operational state of this facility"
              sx={fieldSx}
              InputLabelProps={{ shrink: true }}
            >
              <MenuItem value="OPERATIONAL" sx={{ fontFamily: "'Inter', sans-serif" }}>✅  Operational</MenuItem>
              <MenuItem value="IN_USE" sx={{ fontFamily: "'Inter', sans-serif" }}>🔵  In Use</MenuItem>
              <MenuItem value="MAINTENANCE" sx={{ fontFamily: "'Inter', sans-serif" }}>🟡  Under Maintenance</MenuItem>
              <MenuItem value="CLOSED" sx={{ fontFamily: "'Inter', sans-serif" }}>🔴  Closed / Inactive</MenuItem>
            </TextField>
          </Grid>

          {/* Access type info banner */}
          {accessInfo && (
            <Grid size={{ xs: 12 }}>
              <Box sx={{
                p: 2, borderRadius: "12px",
                bgcolor: `${accessInfo.color}08`,
                border: `1.5px solid ${accessInfo.color}25`,
                display: "flex", alignItems: "center", gap: 2,
              }}>
                <Chip
                  label={accessInfo.label} size="small"
                  sx={{ bgcolor: accessInfo.color, color: "white", fontWeight: 700, fontSize: "0.7rem", fontFamily: "'Inter', sans-serif", flexShrink: 0 }}
                />
                <Typography variant="body2" sx={{ color: "#64748B", fontFamily: "'Inter', sans-serif" }}>
                  {accessInfo.description}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* ── Capacity & Slots ──────────────────── */}
      <SectionHeader
        icon={<PeopleOutlineIcon fontSize="small" />}
        title="Capacity & Slots"
        subtitle="Physical capacity and bookable slot counts"
        color="#16a34a" bgColor="#f0fdf4"
      />
      <Box sx={{ px: 4, py: 3.5 }}>
        <Grid container spacing={3}>
          {data.accessType !== "SUBSCRIPTION" ? (
            <>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth type="number" label="Physical Capacity"
                  value={data.capacity}
                  onChange={(e) => onChange("capacity", e.target.value)}
                  error={!!errors.capacity}
                  helperText={errors.capacity || "Max people at once"}
                  sx={fieldSx}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth type="number" label="Total Slots"
                  value={data.totalSlots}
                  onChange={(e) => onChange("totalSlots", e.target.value)}
                  error={!!errors.totalSlots}
                  helperText="Parallel bookings / courts"
                  sx={fieldSx}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth type="number" label="Booked Slots (Initial)"
                  value={data.bookedSlots}
                  onChange={(e) => onChange("bookedSlots", e.target.value)}
                  helperText="Usually 0 for new facilities"
                  sx={fieldSx}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </>
          ) : (
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth type="number" label="Physical Capacity"
                value={data.capacity}
                onChange={(e) => onChange("capacity", e.target.value)}
                error={!!errors.capacity}
                helperText={errors.capacity || "Max people allowed in the facility at once"}
                sx={fieldSx}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          )}
        </Grid>
      </Box>

      {/* ── Permissions ────────────────────────── */}
      <SectionHeader
        icon={<ToggleOnOutlinedIcon fontSize="small" />}
        title="Permissions"
        subtitle="Visibility and approval settings for this facility"
        color="#7c3aed" bgColor="#f5f3ff"
      />
      <Box sx={{ px: 4, py: 3 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
          {/* Toggle: Requires Approval */}
          <Box sx={{
            flex: 1, p: 2.5, border: "1.5px solid #EEF2F7", borderRadius: "14px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            bgcolor: data.requiresApproval ? "#EFF6FF" : "#FAFAFA",
            transition: "all 0.2s",
            cursor: "pointer",
            boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
            "&:hover": { borderColor: "#CBD5E1" }
          }}
            onClick={() => onChange("requiresApproval", !data.requiresApproval)}
          >
            <Box>
              <Typography variant="body2" fontWeight={600} sx={{ color: "#0F172A", fontFamily: "'Inter', sans-serif" }}>
                Requires Manager Approval
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748B", fontFamily: "'Inter', sans-serif" }}>
                Admin must approve each booking request
              </Typography>
            </Box>
            <Switch
              checked={data.requiresApproval}
              onChange={(e) => { e.stopPropagation(); onChange("requiresApproval", e.target.checked); }}
              sx={switchSx}
            />
          </Box>

          {/* Toggle: Active & Visible */}
          <Box sx={{
            flex: 1, p: 2.5, border: "1.5px solid #EEF2F7", borderRadius: "14px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            bgcolor: data.isActive ? "#F0FDF4" : "#FAFAFA",
            transition: "all 0.2s",
            cursor: "pointer",
            boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
            "&:hover": { borderColor: "#CBD5E1" }
          }}
            onClick={() => onChange("isActive", !data.isActive)}
          >
            <Box>
              <Typography variant="body2" fontWeight={600} sx={{ color: "#0F172A", fontFamily: "'Inter', sans-serif" }}>
                Active & Visible to Residents
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748B", fontFamily: "'Inter', sans-serif" }}>
                Show this facility on the resident portal
              </Typography>
            </Box>
            <Switch
              checked={data.isActive}
              onChange={(e) => { e.stopPropagation(); onChange("isActive", e.target.checked); }}
              sx={switchSx}
            />
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}
