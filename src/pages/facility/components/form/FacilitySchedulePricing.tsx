import {
  Box,
  Typography,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  Divider,
} from "@mui/material";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import EventRepeatOutlinedIcon from "@mui/icons-material/EventRepeatOutlined";
import { fieldSx, sectionCardSx, sectionHeaderIconSx } from "./formStyles";

const DAYS = [
  { value: "MON", label: "Mon" },
  { value: "TUE", label: "Tue" },
  { value: "WED", label: "Wed" },
  { value: "THU", label: "Thu" },
  { value: "FRI", label: "Fri" },
  { value: "SAT", label: "Sat" },
  { value: "SUN", label: "Sun" },
];

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

interface Props {
  data: any;
  onChange: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export default function FacilitySchedulePricing({ data, onChange, errors }: Props) {
  return (
    <Paper elevation={0} sx={sectionCardSx}>

      {/* ── Operating Hours ──────────────────── */}
      <SectionHeader
        icon={<AccessTimeOutlinedIcon fontSize="small" />}
        title="Operating Hours"
        subtitle="Set the daily opening and closing times for this facility"
        color="#2563eb" bgColor="#eff6ff"
      />
      <Box sx={{ px: 4, py: 3.5 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth label="Opens At"
              value={data.allDay ? "00:00" : data.openingTime}
              disabled={data.allDay}
              onChange={(e) => onChange("openingTime", e.target.value)}
              placeholder="HH:mm"
              helperText="24-hour format, e.g. 06:00"
              sx={fieldSx}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth label="Closes At"
              value={data.allDay ? "23:59" : data.closingTime}
              disabled={data.allDay}
              onChange={(e) => onChange("closingTime", e.target.value)}
              placeholder="HH:mm"
              helperText="24-hour format, e.g. 22:00"
              sx={fieldSx}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{
              width: "100%", height: 56, border: "1.5px solid #EEF2F7", borderRadius: "12px",
              display: "flex", alignItems: "center", px: 2, bgcolor: "#FAFAFA",
              mb: "20px", // Align vertically with other inputs excluding helper text
            }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={data.allDay}
                    onChange={(e) => onChange("allDay", e.target.checked)}
                    sx={{ color: "#E2E8F0", "&.Mui-checked": { color: "#2563EB" }, p: 1 }}
                  />
                }
                label={<Typography variant="body2" fontWeight={600} sx={{ color: "#374151", fontFamily: "'Inter', sans-serif" }}>Open All Day (24hrs)</Typography>}
                sx={{ m: 0, width: "100%" }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* ── Available Days ───────────────────── */}
      <SectionHeader
        icon={<CalendarTodayOutlinedIcon fontSize="small" />}
        title="Available Days"
        subtitle="Select which days this facility operates each week"
        color="#ea580c" bgColor="#fff7ed"
      />
      <Box sx={{ px: 4, py: 3.5 }}>
        <ToggleButtonGroup
          value={data.availableDays}
          onChange={(_, newDays) => { if (newDays.length) onChange("availableDays", newDays); }}
          aria-label="available days"
          sx={{
            display: "flex",
            flexWrap: { xs: "wrap", md: "nowrap" },
            gap: 1.5,
            width: "100%",
            "& .MuiToggleButtonGroup-grouped": {
              border: "1.5px solid #E2E8F0 !important",
              borderRadius: "12px !important",
              m: 0,
              flex: 1,
              minWidth: 50,
              height: 56,
              px: 0.5,
              bgcolor: "#F8FAFC",
              color: "#64748B",
              fontWeight: 600,
              fontSize: "0.875rem",
              textTransform: "none",
              fontFamily: "'Inter', sans-serif",
              transition: "all 0.18s ease",
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              "&.Mui-selected": {
                bgcolor: "#2563EB",
                color: "white",
                borderColor: "#2563EB !important",
                boxShadow: "0 4px 12px rgba(37,99,235,0.2)",
              },
              "&:hover:not(.Mui-selected)": {
                bgcolor: "#F1F5F9",
                borderColor: "#CBD5E1 !important",
              },
            },
          }}
        >
          {DAYS.map((day) => (
            <ToggleButton key={day.value} value={day.value}>{day.label}</ToggleButton>
          ))}
        </ToggleButtonGroup>
        <Typography variant="caption" sx={{ color: "#64748B", mt: 1.5, display: "block", fontFamily: "'Inter', sans-serif", ml: 0.5 }}>
          {data.availableDays?.length} day{data.availableDays?.length !== 1 ? "s" : ""} selected
        </Typography>
      </Box>

      {/* ── Pricing ──────────────────────────── */}
      {data.accessType !== "SUBSCRIPTION" && data.accessType !== "MIXED" && (
        <>
          <SectionHeader
            icon={<AttachMoneyOutlinedIcon fontSize="small" />}
            title="Pricing"
            subtitle="Define the cost structure for using this facility"
            color="#16a34a" bgColor="#f0fdf4"
          />
          <Box sx={{ px: 4, py: 3.5 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth label="Pricing Model"
                  value={data.price}
                  onChange={(e) => onChange("price", e.target.value)}
                  error={!!errors.price}
                  helperText={errors.price || "e.g. ₹500/session, ₹200/hr, Included, Free"}
                  placeholder="e.g. ₹250/hr"
                  required
                  sx={fieldSx}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Box>
        </>
      )}

      {/* ── Booking Rules ────────────────────── */}
      {data.accessType !== "SUBSCRIPTION" && (
        <>
          <SectionHeader
            icon={<EventRepeatOutlinedIcon fontSize="small" />}
            title="Booking Rules"
            subtitle="Advance booking and cancellation window policies"
            color="#9333ea" bgColor="#f5f3ff"
          />
          <Box sx={{ px: 4, py: 3.5 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth type="number" label="Advance Booking (Days)"
                  value={data.advanceBookingDays}
                  onChange={(e) => onChange("advanceBookingDays", e.target.value)}
                  helperText="How many days in advance can residents book?"
                  sx={fieldSx}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth type="number" label="Cancellation Window (Hours)"
                  value={data.cancellationHours}
                  onChange={(e) => onChange("cancellationHours", e.target.value)}
                  helperText="Min hours before slot to cancel without penalty"
                  sx={fieldSx}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth multiline rows={3} label="Rules & Regulations"
                  value={data.rules}
                  onChange={(e) => onChange("rules", e.target.value)}
                  placeholder="e.g. Shoes required, No food inside, Max 2 slots per day..."
                  helperText="Optional usage rules shown to residents on the booking page"
                  sx={fieldSx}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </Paper>
  );
}
