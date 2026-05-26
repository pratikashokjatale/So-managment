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
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Stack,
  Grid,
  Checkbox,
  FormControlLabel,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  InputAdornment,
} from "@mui/material";
import { AccessTime } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import BackButton from "@/components/BackButton";
import { createFacilityApi } from "@/apis/facility";

// Icons for selection previews
import {
  SportsTennis as TennisIcon,
  FitnessCenter as GymIcon,
  Movie as CinemaIcon,
  Spa as SpaIcon,
  SelfImprovement as YogaIcon,
  Pool as PoolIcon,
  Park as ParkIcon,
  Circle as CircleIcon,
} from "@mui/icons-material";

const CATEGORIES = ["Sports", "Fitness", "Leisure", "Wellness", "Other"];

export default function AddFacility() {
  const navigate = useNavigate();

  // Form Fields State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Sports");
  const [price, setPrice] = useState("");
  const [slots, setSlots] = useState("");
  const [managerName, setManagerName] = useState("");
  const [managerContact, setManagerContact] = useState("");
  const [description, setDescription] = useState("");
  const [iconName, setIconName] = useState("SportsTennis");

  const [location, setLocation] = useState("Clubhouse");
  const [floor, setFloor] = useState("Ground Floor");
  const [openingTime, setOpeningTime] = useState("10:00");
  const [closingTime, setClosingTime] = useState("22:00");
  const [allDay, setAllDay] = useState(false);
  const [availableDays, setAvailableDays] = useState<string[]>([
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
    "SAT",
    "SUN",
  ]);

  const [rules, setRules] = useState("");
  const [advanceBookingDays, setAdvanceBookingDays] = useState("7");
  const [cancellationHours, setCancellationHours] = useState("2");

  // Form Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!name.trim()) tempErrors.name = "Facility Name is required";
    if (!price.trim()) tempErrors.price = "Pricing Model is required";
    if (!slots.trim()) tempErrors.slots = "Slots Description is required";
    if (!managerName.trim())
      tempErrors.managerName = "Manager Name is required";
    if (!managerContact.trim())
      tempErrors.managerContact = "Contact Number is required";
    if (!description.trim()) tempErrors.description = "Description is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Parse pricing
    let pricingModel = "CUSTOM";
    let priceAmount = 0;
    const cleanPrice = price.toLowerCase();
    if (cleanPrice.includes("included")) {
      pricingModel = "INCLUDED";
    } else if (cleanPrice.includes("free")) {
      pricingModel = "FREE";
    } else {
      if (cleanPrice.includes("hour") || cleanPrice.includes("hr")) {
        pricingModel = "HOURLY";
      } else if (cleanPrice.includes("show")) {
        pricingModel = "SHOW";
      } else if (cleanPrice.includes("session")) {
        pricingModel = "SESSION";
      } else if (cleanPrice.includes("day")) {
        pricingModel = "DAY";
      }
      const matchNum = price.match(/\d+/);
      priceAmount = matchNum ? parseInt(matchNum[0]) : 0;
    }

    // Parse slots
    const matchSlots = slots.match(/(\d+)\/(\d+)/);
    const bookedSlots = matchSlots ? parseInt(matchSlots[1]) : 0;
    const totalSlots = matchSlots ? parseInt(matchSlots[2]) : 12;

    const code = name.toUpperCase().replace(/\s+/g, "-");
    const categoryUpper = category.toUpperCase();

    let normalizedPhone = managerContact.trim();
    if (normalizedPhone && !normalizedPhone.startsWith("+")) {
      normalizedPhone = `+91${normalizedPhone.replace(/^0+/, "")}`;
    }

    try {
      await createFacilityApi({
        name,
        code,
        category: categoryUpper,
        iconKey: iconName,
        description,
        location,
        floor,
        status: "OPERATIONAL",
        isActive: true,
        pricingModel,
        priceAmount,
        priceCurrency: "INR",
        priceLabel: price,
        bookingMode: "SLOT",
        totalSlots,
        bookedSlots,
        capacity: totalSlots,
        openingTime: allDay ? "00:00" : openingTime,
        closingTime: allDay ? "23:59" : closingTime,
        availableDays,
        advanceBookingDays: parseInt(advanceBookingDays, 10) || 7,
        cancellationHours: parseInt(cancellationHours, 10) || 2,
        requiresApproval: false,
        managerName,
        managerContact: normalizedPhone,
        rules,
        images: [],
        sortOrder: 1,
      });
      toast.success("Facility created successfully!");
      navigate("/facility");
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create facility";
      toast.error(errorMsg);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, bgcolor: "#f8fafc", minHeight: "100vh" }}>
      {/* Header & Navigation */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Box>
          <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 1 }}>
            <Link
              underline="hover"
              color="inherit"
              onClick={() => navigate("/")}
              sx={{ cursor: "pointer", fontWeight: 700 }}
            >
              Dashboard
            </Link>
            <Link
              underline="hover"
              color="inherit"
              onClick={() => navigate("/facility")}
              sx={{ cursor: "pointer", fontWeight: 700 }}
            >
              Facility Management
            </Link>
            <Typography color="text.primary" sx={{ fontWeight: 900 }}>
              Add Facility
            </Typography>
          </Breadcrumbs>
          <Typography variant="h3" fontWeight="900" color="#002855">
            Add Facility
          </Typography>
        </Box>
        <BackButton to="/facility" />
      </Stack>

      {/* Main Card Form */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: "32px",
          border: "1px solid #e2e8f0",
          maxWidth: "850px",
          mx: "auto",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Facility Name */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Facility Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                variant="outlined"
                placeholder="e.g. Grand Gym, Yoga Studio"
                InputProps={{ sx: { borderRadius: "16px" } }}
              />
            </Grid>

            {/* Category */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  value={category}
                  label="Category"
                  onChange={(e) => setCategory(e.target.value)}
                  sx={{ borderRadius: "16px" }}
                >
                  {CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  Choose the corresponding activity unit category
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Facility Icon Selection */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="icon-select-label">Facility Icon</InputLabel>
                <Select
                  labelId="icon-select-label"
                  id="icon-select"
                  value={iconName}
                  label="Facility Icon"
                  onChange={(e) => setIconName(e.target.value)}
                  sx={{ borderRadius: "16px" }}
                >
                  <MenuItem value="SportsTennis">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <TennisIcon sx={{ color: "#1d4ed8" }} />
                      <Typography variant="body2" fontWeight="700">
                        Sports / Tennis Icon
                      </Typography>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="FitnessCenter">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <GymIcon sx={{ color: "#ea580c" }} />
                      <Typography variant="body2" fontWeight="700">
                        Gym / Fitness Icon
                      </Typography>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="Movie">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <CinemaIcon sx={{ color: "#7c3aed" }} />
                      <Typography variant="body2" fontWeight="700">
                        Cinema / Theatre Icon
                      </Typography>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="Spa">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <SpaIcon sx={{ color: "#db2777" }} />
                      <Typography variant="body2" fontWeight="700">
                        Spa / Steam & Sauna Icon
                      </Typography>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="SelfImprovement">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <YogaIcon sx={{ color: "#10b981" }} />
                      <Typography variant="body2" fontWeight="700">
                        Yoga / Meditation Icon
                      </Typography>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="Pool">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <PoolIcon sx={{ color: "#06b6d4" }} />
                      <Typography variant="body2" fontWeight="700">
                        Swimming Pool Icon
                      </Typography>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="Park">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <ParkIcon sx={{ color: "#16a34a" }} />
                      <Typography variant="body2" fontWeight="700">
                        Park / Jogging Track Icon
                      </Typography>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="Circle">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <CircleIcon sx={{ color: "#4b5563" }} />
                      <Typography variant="body2" fontWeight="700">
                        Billiards / Other Icon
                      </Typography>
                    </Stack>
                  </MenuItem>
                </Select>
                <FormHelperText>
                  Select a customized icon symbol to represent this unit
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Pricing Model */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Pricing Model"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                error={!!errors.price}
                helperText={errors.price || "e.g. ₹200/hr, Included, ₹500/show"}
                variant="outlined"
                placeholder="e.g. ₹250/hr"
                InputProps={{ sx: { borderRadius: "16px" } }}
              />
            </Grid>

            {/* Capacity / Slots */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Capacity / Slots"
                value={slots}
                onChange={(e) => setSlots(e.target.value)}
                error={!!errors.slots}
                helperText={errors.slots || "e.g. 5/12 Booked, 15/30 Capacity"}
                variant="outlined"
                placeholder="e.g. 10/20 Slots Open"
                InputProps={{ sx: { borderRadius: "16px" } }}
              />
            </Grid>

            {/* Manager Name */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Manager Name"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                error={!!errors.managerName}
                helperText={errors.managerName}
                variant="outlined"
                placeholder="Name of supervisor"
                InputProps={{ sx: { borderRadius: "16px" } }}
              />
            </Grid>

            {/* Manager Contact */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Contact Number"
                value={managerContact}
                onChange={(e) => setManagerContact(e.target.value)}
                error={!!errors.managerContact}
                helperText={errors.managerContact}
                variant="outlined"
                placeholder="e.g. +91 98765 43210"
                InputProps={{ sx: { borderRadius: "16px" } }}
              />
            </Grid>

            {/* Location & Floor */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Location (e.g. Clubhouse)"
                variant="outlined"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Floor (e.g. Ground Floor)"
                variant="outlined"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
              />
            </Grid>

            {/* Schedule Section */}
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  bgcolor: "#f8fafc",
                  p: 3,
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  mt: 1,
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="800"
                  color="#1e293b"
                  sx={{ mb: 3 }}
                >
                  Schedule & Availability
                </Typography>

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <TextField
                      fullWidth
                      label="Start Time (HH:mm)"
                      variant="outlined"
                      value={allDay ? "00:00" : openingTime}
                      disabled={allDay}
                      onChange={(e) => setOpeningTime(e.target.value)}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <AccessTime />
                            </InputAdornment>
                          ),
                        },
                      }}
                      sx={{ bgcolor: "white", borderRadius: "8px" }}
                    />
                  </Grid>

                  <Grid
                    size={{ xs: 12, md: 1 }}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography color="text.secondary">to</Typography>
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      label="End Time (HH:mm)"
                      variant="outlined"
                      value={allDay ? "23:59" : closingTime}
                      disabled={allDay}
                      onChange={(e) => setClosingTime(e.target.value)}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <AccessTime />
                            </InputAdornment>
                          ),
                        },
                      }}
                      sx={{ bgcolor: "white", borderRadius: "8px" }}
                    />
                  </Grid>

                  <Grid
                    size={{ xs: 12, md: 2 }}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={allDay}
                          onChange={(e) => setAllDay(e.target.checked)}
                        />
                      }
                      label="All day"
                      sx={{ color: "#475569" }}
                    />
                  </Grid>

                  <Grid size={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>

                  {/* Recurrence Section */}
                  <Grid
                    size={{ xs: 12, md: 3 }}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Typography fontWeight="600" color="#1e293b">
                      Repeat on
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 12, md: 9 }}>
                    <ToggleButtonGroup
                      value={availableDays}
                      onChange={(_, newDays) => {
                        if (newDays.length) setAvailableDays(newDays);
                      }}
                      aria-label="available days"
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        "& .MuiToggleButtonGroup-grouped": {
                          border: "1px solid #cbd5e1 !important",
                          borderRadius: "8px !important",
                          m: 0,
                          px: 2,
                          py: 1,
                          bgcolor: "white",
                          color: "#64748b",
                          "&.Mui-selected": {
                            bgcolor: "#3b82f6",
                            color: "white",
                            "&:hover": {
                              bgcolor: "#2563eb",
                            },
                          },
                        },
                      }}
                    >
                      <ToggleButton value="SUN" aria-label="sunday">
                        Su
                      </ToggleButton>
                      <ToggleButton value="MON" aria-label="monday">
                        Mo
                      </ToggleButton>
                      <ToggleButton value="TUE" aria-label="tuesday">
                        Tu
                      </ToggleButton>
                      <ToggleButton value="WED" aria-label="wednesday">
                        We
                      </ToggleButton>
                      <ToggleButton value="THU" aria-label="thursday">
                        Th
                      </ToggleButton>
                      <ToggleButton value="FRI" aria-label="friday">
                        Fr
                      </ToggleButton>
                      <ToggleButton value="SAT" aria-label="saturday">
                        Sa
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Rules */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Rules & Regulations"
                variant="outlined"
                multiline
                rows={2}
                value={rules}
                onChange={(e) => setRules(e.target.value)}
              />
            </Grid>

            {/* Booking Constraints */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Advance Booking Days"
                variant="outlined"
                value={advanceBookingDays}
                onChange={(e) => setAdvanceBookingDays(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Cancellation Window (Hours)"
                variant="outlined"
                value={cancellationHours}
                onChange={(e) => setCancellationHours(e.target.value)}
              />
            </Grid>

            {/* Description */}
            <Grid size={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={!!errors.description}
                helperText={errors.description}
                variant="outlined"
                placeholder="Provide details about the facility's location, rules, and specifications..."
                InputProps={{ sx: { borderRadius: "16px" } }}
              />
            </Grid>

            {/* Action Buttons */}
            <Grid size={12} sx={{ mt: 2 }}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => navigate("/facility")}
                  sx={{
                    borderRadius: "16px",
                    px: 4,
                    py: 1.5,
                    fontWeight: 900,
                    borderColor: "#e2e8f0",
                    color: "#64748b",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    borderRadius: "16px",
                    px: 4,
                    py: 1.5,
                    fontWeight: 900,
                    bgcolor: "#002855",
                  }}
                >
                  Create Facility
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}
