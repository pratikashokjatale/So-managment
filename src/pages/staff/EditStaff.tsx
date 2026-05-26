import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Typography, Button, TextField, MenuItem, Avatar, Grid,
  InputAdornment, ToggleButton, ToggleButtonGroup
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import FormCard from "@/components/FormCard";
import EditIcon from "@mui/icons-material/Edit";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import toast from "react-hot-toast";
import { getStaffById } from "@/utils/staffStore";
import { getFacilities } from "@/utils/facilityStore";
import { getFacilitiesApi } from "@/apis/facility";
import {
  getStaffDetailsApi,
  createStaffApi,
  updateStaffApi,
} from "@/apis/staff";
import { getFileUrl } from "@/utils/file";
import { uploadDocumentApi } from "@/apis/document";

const DEPARTMENTS = [
  "Security",
  "Housekeeping",
  "Maintenance",
  "Front Office",
  "Fitness & Gym Training",
  "Pool Operations",
  "Wellness & Spa",
  "Park & Gardens",
];

export default function EditStaff() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isAddMode = !id || id === "add";

  const [facilities, setFacilities] = useState<any[]>([]);

  // Form Fields State
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("Security");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [joiningDate, setJoiningDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [address, setAddress] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [facilityId, setFacilityId] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [idProofType, setIdProofType] = useState("AADHAAR");
  const [idProofNumber, setIdProofNumber] = useState("");
  const [notes, setNotes] = useState("");
  
  // New Fields
  const [employmentType, setEmploymentType] = useState("FULL_TIME");
  const [shiftStart, setShiftStart] = useState("09:00");
  const [shiftEnd, setShiftEnd] = useState("18:00");
  const [workDays, setWorkDays] = useState<string[]>(["MON", "TUE", "WED", "THU", "FRI", "SAT"]);
  const [allowedZones, setAllowedZones] = useState<string[]>(["CLUBHOUSE"]);
  const [accessLevel, setAccessLevel] = useState("FACILITY_ONLY");
  const [attendanceMode, setAttendanceMode] = useState("RFID");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Load facilities and staff details if in edit mode
  useEffect(() => {
    const loadData = async () => {
      let activeFacilities: any[] = [];
      let apiSucceeded = false;
      try {
        const res = await getFacilitiesApi({ limit: 100 });
        const d = res?.data || res;
        let list: any[] = [];
        if (Array.isArray(d)) list = d;
        else if (d?.items && Array.isArray(d.items)) list = d.items;
        else if (d?.facilities && Array.isArray(d.facilities))
          list = d.facilities;
        else if (d?.data && Array.isArray(d.data)) list = d.data;

        if (list.length > 0) {
          activeFacilities = list;
          apiSucceeded = true;
        }
      } catch (err) {
        console.warn("Failed to fetch facilities via API, falling back:", err);
      }

      if (!apiSucceeded) {
        activeFacilities = getFacilities();
      }

      setFacilities(activeFacilities);
      if (activeFacilities.length > 0) {
        setFacilityId(activeFacilities[0].id);
      }

      if (!isAddMode && id) {
        try {
          const res = await getStaffDetailsApi(id);
          const staff = res?.data || res;
          if (staff) {
            setName(staff.name || "");

            let dept = staff.department || "SECURITY";
            if (dept === "SECURITY") dept = "Security";
            else if (dept === "HOUSEKEEPING") dept = "Housekeeping";
            else if (dept === "MAINTENANCE") dept = "Maintenance";
            else if (dept === "ADMINISTRATION") dept = "Front Office";
            else if (dept === "SUPPORT") dept = "Front Office";
            else if (dept === "FACILITY") dept = "Maintenance";
            else if (dept === "OTHER") dept = "Other";
            setDepartment(dept);

            setPhone(staff.phone || "");
            setEmail(staff.email || "");
            setJoiningDate(
              staff.joiningDate ? staff.joiningDate.split("T")[0] : "",
            );
            setAddress(staff.address || "");
            setEmergencyContact(
              staff.emergencyContactPhone || staff.emergencyContact || "",
            );
            setFacilityId(staff.facilityId || "");
            setStatus(staff.status === "ACTIVE" ? "Active" : "Inactive");
            setAvatar(staff.photoUrl || staff.profilePhotoUrl || staff.avatar || "");
            setIdProofType(staff.idProofType || "AADHAAR");
            setIdProofNumber(staff.idProofNumber || "");
            setNotes(staff.notes || "");
            return;
          }
        } catch (error) {
          console.warn(
            "Failed to load staff details via API, falling back:",
            error,
          );
        }

        const staff = getStaffById(id);
        if (staff) {
          setName(staff.name);
          setDepartment(staff.department);
          setPhone(staff.phone);
          setEmail(staff.email);
          setJoiningDate(staff.joiningDate);
          setAddress(staff.address);
          setEmergencyContact(staff.emergencyContact);
          setFacilityId(staff.facilityId);
          setStatus(staff.status);
          setAvatar((staff as any).photoUrl || (staff as any).profilePhotoUrl || staff.avatar || "");
          setAvatarPreview((staff as any).photoUrl || (staff as any).profilePhotoUrl || staff.avatar || "");
          setIdProofType((staff as any).idProofType || "AADHAAR");
          setIdProofNumber((staff as any).idProofNumber || "");
          setNotes((staff as any).notes || "");

          if ((staff as any).employmentType) setEmploymentType((staff as any).employmentType);
          if ((staff as any).shiftStart) setShiftStart((staff as any).shiftStart);
          if ((staff as any).shiftEnd) setShiftEnd((staff as any).shiftEnd);
          if ((staff as any).workDays) setWorkDays((staff as any).workDays);
          if ((staff as any).allowedZones) setAllowedZones((staff as any).allowedZones);
          if ((staff as any).accessLevel) setAccessLevel((staff as any).accessLevel);
          if ((staff as any).attendanceMode) setAttendanceMode((staff as any).attendanceMode);
        }
      }
    };
    loadData();
  }, [id, isAddMode]);

  // Form Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!name.trim()) tempErrors.name = "Full Name is required";
    if (!phone.trim()) tempErrors.phone = "Phone Number is required";
    if (!email.trim()) tempErrors.email = "Email Address is required";
    if (!address.trim()) tempErrors.address = "Address is required";
    if (!emergencyContact.trim())
      tempErrors.emergencyContact = "Emergency Contact is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let finalAvatar = avatar;
    if (avatarFile) {
      try {
        finalAvatar = await uploadDocumentApi(avatarFile);
      } catch (err: any) {
        toast.error("Failed to upload profile photo");
        return;
      }
    }

    let apiDept = "SECURITY";
    if (department === "Housekeeping") apiDept = "HOUSEKEEPING";
    else if (department === "Maintenance") apiDept = "MAINTENANCE";
    else if (department === "Front Office") apiDept = "ADMINISTRATION";
    else if (department === "Fitness & Gym Training") apiDept = "FACILITY";
    else if (department === "Pool Operations") apiDept = "FACILITY";
    else if (department === "Wellness & Spa") apiDept = "FACILITY";
    else if (department === "Park & Gardens") apiDept = "FACILITY";

    let normalizedPhone = phone.trim();
    if (normalizedPhone && !normalizedPhone.startsWith("+")) {
      normalizedPhone = `+91${normalizedPhone.replace(/^0+/, "")}`;
    }

    let normalizedEmergencyPhone = emergencyContact.trim();
    if (normalizedEmergencyPhone && !normalizedEmergencyPhone.startsWith("+")) {
      normalizedEmergencyPhone = `+91${normalizedEmergencyPhone.replace(/^0+/, "")}`;
    }

    const payload: any = {
      name,
      phone: normalizedPhone,
      department: apiDept,
      joiningDate,
      status: status === "Active" ? "ACTIVE" : "INACTIVE",
      employmentType,
      shiftStart,
      shiftEnd,
      workDays,
      allowedZones,
      accessLevel,
      attendanceMode,
      profilePhotoUrl: finalAvatar,
    };

    if (email) payload.email = email;
    if (facilityId && !facilityId.startsWith("fac-"))
      payload.facilityId = facilityId;
    if (department) payload.designation = department;
    if (normalizedEmergencyPhone) {
      payload.emergencyContactName = "Emergency Contact";
      payload.emergencyContactPhone = normalizedEmergencyPhone;
    }
    if (address) payload.address = address;
    if (idProofType) payload.idProofType = idProofType;
    if (idProofNumber) payload.idProofNumber = idProofNumber;
    if (notes) payload.notes = notes;

    let savedId = id;

    try {
      if (isAddMode) {
        const res = await createStaffApi(payload);
        savedId = res?.data?.id || res?.id || `staff-${Date.now()}`;
        toast.success("Staff member created successfully!");
      } else if (id) {
        await updateStaffApi(id, payload);
        toast.success("Staff member updated successfully!");
      }
      navigate(`/staff/${savedId}`);
    } catch (err: any) {
      console.warn("Failed to save staff via API, falling back:", err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save staff member",
      );
    }
  };

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "16px",
      bgcolor: "#f8fafc",
    },
  };

  return (
    <FormCard
      title={isAddMode ? "Add New Staff Member" : "Edit Staff Profile"}
      subtitle={
        isAddMode
          ? "Register a new staff member into the system"
          : "Update staff details and access"
      }
      onBack={() => navigate("/staff")}
    >
      <form onSubmit={handleSave}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Avatar Section */}
          <Box sx={{ textAlign: "center" }}>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Avatar
                src={getFileUrl(avatarPreview || avatar)}
                sx={{
                  width: 120,
                  height: 120,
                  border: "5px solid #f1f5f9",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="contained"
                size="small"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  borderRadius: "50%",
                  minWidth: 40,
                  height: 40,
                  p: 0,
                  bgcolor: "#091542",
                  "&:hover": { bgcolor: "#001a35" },
                }}
              >
                <EditIcon fontSize="small" />
              </Button>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1.5, fontWeight: 700 }}
            >
              {isAddMode
                ? "Upload a photo or an avatar will be generated"
                : "Staff Profile Identity"}
            </Typography>
          </Box>

          {/* Form Fields Grid */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Full Name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                sx={textFieldSx}
                placeholder="e.g. Sumanth Kumar"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="Department"
                fullWidth
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                sx={textFieldSx}
              >
                {DEPARTMENTS.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Dynamic Facility Selection Dropdown */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="Assigned Duty Facility"
                fullWidth
                value={facilityId}
                onChange={(e) => setFacilityId(e.target.value)}
                sx={textFieldSx}
                helperText="Assign the staff member to manage an active society facility"
              >
                {facilities.map((fac) => (
                  <MenuItem key={fac.id} value={fac.id}>
                    {fac.name} ({fac.category})
                  </MenuItem>
                ))}
                {facilities.length === 0 && (
                  <MenuItem value="">No facilities available</MenuItem>
                )}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Phone Number"
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={!!errors.phone}
                helperText={errors.phone}
                sx={textFieldSx}
                placeholder="e.g. 98765 00001"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Email Address"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                sx={textFieldSx}
                placeholder="e.g. sumanth.k@society.com"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                type="date"
                label="Joining Date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                sx={textFieldSx}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Emergency Contact Number"
                fullWidth
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                error={!!errors.emergencyContact}
                helperText={errors.emergencyContact}
                sx={textFieldSx}
                placeholder="e.g. 98765 11111"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="Employment Status"
                fullWidth
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "Active" | "Inactive")
                }
                sx={textFieldSx}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>
            </Grid>

            <Grid size={12}>
              <TextField
                label="Permanent Home Address"
                fullWidth
                multiline
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                error={!!errors.address}
                helperText={errors.address}
                sx={textFieldSx}
                placeholder="Street, City, State, ZIP..."
              />
            </Grid>

            {/* New Fields */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="Employment Type"
                fullWidth
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                sx={textFieldSx}
              >
                <MenuItem value="FULL_TIME">Full Time</MenuItem>
                <MenuItem value="PART_TIME">Part Time</MenuItem>
                <MenuItem value="CONTRACT">Contract</MenuItem>
                <MenuItem value="TEMPORARY">Temporary</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="Attendance Mode"
                fullWidth
                value={attendanceMode}
                onChange={(e) => setAttendanceMode(e.target.value)}
                sx={textFieldSx}
              >
                <MenuItem value="RFID">RFID Card</MenuItem>
                <MenuItem value="BIOMETRIC">Biometric</MenuItem>
                <MenuItem value="MANUAL">Manual</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Shift Start Time"
                fullWidth
                value={shiftStart}
                onChange={(e) => setShiftStart(e.target.value)}
                sx={textFieldSx}
                InputProps={{
                  endAdornment: <InputAdornment position="end"><AccessTimeIcon /></InputAdornment>,
                }}
                placeholder="HH:mm"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Shift End Time"
                fullWidth
                value={shiftEnd}
                onChange={(e) => setShiftEnd(e.target.value)}
                sx={textFieldSx}
                InputProps={{
                  endAdornment: <InputAdornment position="end"><AccessTimeIcon /></InputAdornment>,
                }}
                placeholder="HH:mm"
              />
            </Grid>

            <Grid size={12}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 700 }}>
                Work Days
              </Typography>
              <ToggleButtonGroup
                value={workDays}
                onChange={(_, newDays) => { if (newDays.length) setWorkDays(newDays); }}
                aria-label="work days"
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  '& .MuiToggleButtonGroup-grouped': {
                    border: '1px solid #cbd5e1 !important',
                    borderRadius: '8px !important',
                    m: 0,
                    px: 2,
                    py: 1,
                    bgcolor: 'white',
                    color: '#64748b',
                    '&.Mui-selected': {
                      bgcolor: '#3b82f6',
                      color: 'white',
                      '&:hover': {
                        bgcolor: '#2563eb',
                      }
                    }
                  }
                }}
              >
                <ToggleButton value="MON" aria-label="monday">Mo</ToggleButton>
                <ToggleButton value="TUE" aria-label="tuesday">Tu</ToggleButton>
                <ToggleButton value="WED" aria-label="wednesday">We</ToggleButton>
                <ToggleButton value="THU" aria-label="thursday">Th</ToggleButton>
                <ToggleButton value="FRI" aria-label="friday">Fr</ToggleButton>
                <ToggleButton value="SAT" aria-label="saturday">Sa</ToggleButton>
                <ToggleButton value="SUN" aria-label="sunday">Su</ToggleButton>
              </ToggleButtonGroup>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="Access Level"
                fullWidth
                value={accessLevel}
                onChange={(e) => setAccessLevel(e.target.value)}
                sx={textFieldSx}
              >
                <MenuItem value="FACILITY_ONLY">Facility Only</MenuItem>
                <MenuItem value="ALL_AREAS">All Areas</MenuItem>
                <MenuItem value="RESTRICTED">Restricted</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="Allowed Zones"
                fullWidth
                SelectProps={{
                  multiple: true,
                }}
                value={allowedZones}
                onChange={(e) => {
                  const val = e.target.value;
                  setAllowedZones(typeof val === 'string' ? val.split(',') : (val as string[]));
                }}
                sx={textFieldSx}
              >
                <MenuItem value="CLUBHOUSE">Clubhouse</MenuItem>
                <MenuItem value="TOWER_A">Tower A</MenuItem>
                <MenuItem value="TOWER_B">Tower B</MenuItem>
                <MenuItem value="PARKING">Parking</MenuItem>
                <MenuItem value="GARDEN">Garden</MenuItem>
              </TextField>
            </Grid>

          </Grid>

          {/* Action Buttons */}
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}
          >
            <Button
              variant="outlined"
              onClick={() => navigate("/staff")}
              sx={{
                borderRadius: "16px",
                textTransform: "none",
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
              startIcon={<SaveIcon />}
              sx={{
                borderRadius: "16px",
                textTransform: "none",
                px: 4,
                py: 1.5,
                fontWeight: 900,
                bgcolor: "#091542",
                boxShadow: "none",
              }}
            >
              {isAddMode
                ? "Create Staff & Generate I-Card"
                : "Save Profile Changes"}
            </Button>
          </Box>
        </Box>
      </form>
    </FormCard>
  );
}
