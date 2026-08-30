import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  Breadcrumbs,
  Link,
  Button,
  Stack,
  Divider,
  Chip,
  CircularProgress,
} from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import ApartmentIcon from "@mui/icons-material/Apartment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PlaceIcon from "@mui/icons-material/Place";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import ContactPhoneOutlinedIcon from "@mui/icons-material/ContactPhoneOutlined";
import { getStaffById } from "@/utils/staffStore";
// import type { Staff } from '@/utils/staffStore';
import { getStaffDetailsApi } from "@/apis/staff";
import { getFileUrl } from "@/utils/file";
import { getUserQrApi } from "@/apis/user";
import { getCachedProjects } from "@/utils/apiCache";
import { getProjects } from "@/utils/setupStore";
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import logoImg from '@/assets/logo.jpeg';

export default function StaffDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [staff, setStaff] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrCodeToken, setQrCodeToken] = useState<string | null>(null);
  const [qrImageDataUrl, setQrImageDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (staff) {
      const targetUserId = staff.userId || staff.id;
      getUserQrApi(targetUserId)
        .then((res) => {
          const qrData = res?.data || res;
          if (qrData?.qrImageDataUrl) {
            setQrImageDataUrl(qrData.qrImageDataUrl);
          }
          if (qrData?.accessQrToken) {
            setQrCodeToken(qrData.accessQrToken);
          } else {
            const fallbackToken =
              qrData?.qrCode ||
              qrData?.code ||
              (typeof qrData === "string" ? qrData : null);
            setQrCodeToken(fallbackToken);
          }
        })
        .catch((err) => console.log("Failed to fetch QR:", err));
    }
  }, [staff?.id]);

  useEffect(() => {
    const loadStaff = async () => {
      setLoading(true);
      if (id) {
        let allProjects: any[] = [];
        try {
          allProjects = await getCachedProjects();
        } catch (err) {
          allProjects = getProjects();
        }

        try {
          const res = await getStaffDetailsApi(id);
          const s = res?.data || res;
          if (s) {
            let dept = s.department || "SECURITY";
            if (dept === "SECURITY") dept = "Security";
            else if (dept === "HOUSEKEEPING") dept = "Housekeeping";
            else if (dept === "MAINTENANCE") dept = "Maintenance";
            else if (dept === "ADMINISTRATION") dept = "Front Office";
            else if (dept === "SUPPORT") dept = "Front Office";
            else if (dept === "FACILITY") dept = "Maintenance";
            else if (dept === "OTHER") dept = "Other";

            let status = "Inactive";
            if (s.status === "ACTIVE") status = "Active";

            const proj = allProjects.find((p: any) => p.id === s.projectId);
            const projectName = proj ? proj.name : "";

            setStaff({
              id: s.id,
              userId: s.userId || s.id,
              name: s.name,
              avatar: s.photoUrl || s.profilePhotoUrl || s.avatar || "",
              department: dept,
              phone: s.phone || "",
              email: s.email || "",
              cardNo: s.employeeCode || s.iCardNumber || s.cardNo || "",
              status: status as "Active" | "Inactive",
              joiningDate: s.joiningDate ? s.joiningDate.split("T")[0] : "",
              address: s.address || "",
              emergencyContact:
                s.emergencyContactPhone || s.emergencyContact || "",
              facilityId: s.facilityId || "",
              facilityName: s.facility
                ? s.facility.name
                : s.facilityName || "General Duty",
              projectId: s.projectId || "",
              projectName: projectName,
              designation: s.designation || "",
              shiftStart: s.shiftStart || "",
              shiftEnd: s.shiftEnd || "",
              workDays: s.workDays || [],
              accessLevel: s.accessLevel || "",
              attendanceMode: s.attendanceMode || "",
              idProofType: s.idProofType || "",
              idProofNumber: s.idProofNumber || "",
              idProofUrl: s.idProofUrl || s.idProofDocumentUrl || "",
              employmentType: s.employmentType || "",
            } as any);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn(
            "Failed to fetch staff details via API, falling back:",
            err,
          );
        }

        const found = getStaffById(id);
        if (found) {
          const proj = allProjects.find((p: any) => p.id === found.projectId);
          const projectName = proj ? proj.name : "";
          setStaff({
            ...found,
            projectName,
            idProofUrl: found.idProofUrl || "",
          });
        }
      }
      setLoading(false);
    };
    loadStaff();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "#f8fafc",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!staff) {
    return (
      <Box sx={{ p: 5 }}>
        <Typography variant="h5" color="error">
          Staff member not found
        </Typography>
        <Button
          onClick={() => navigate("/staff")}
          sx={{ mt: 2 }}
          variant="contained"
        >
          Back to Staff List
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, bgcolor: "#f8fafc", minHeight: "100vh" }}>
      {/* Header Section */}
      <Box
        sx={{
          mb: 5,
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h3" fontWeight="900" color="#091542">
            Staff Details
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/staff")}
            sx={{
              borderRadius: "16px",
              px: 3,
              py: 1.25,
              fontWeight: 900,
              borderColor: "#e2e8f0",
              color: "#091542",
              bgcolor: "white",
              "&:hover": { bgcolor: "#f1f5f9" },
            }}
          >
            Back to List
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/staff/edit/${staff.id}`)}
            sx={{
              borderRadius: "16px",
              px: 3,
              py: 1.25,
              fontWeight: 900,
              bgcolor: "#091542",
              boxShadow: "none",
              "&:hover": { bgcolor: "#001a35" },
            }}
          >
            Edit Profile
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column: Photorealistic Society ID Card (I-Card) */}
        <Grid size={{ xs: 12, md: 5, lg: 4.5 }}>
          <Paper 
            elevation={1} 
            sx={{ 
              width: '100%', 
              minHeight: 460,
              border: "1px solid #e2e8f0", 
              borderRadius: "16px", 
              display: "flex", 
              flexDirection: "column", 
              overflow: "hidden", 
              bgcolor: "#ffffff",
              position: "relative",
              boxShadow: '0 20px 40px rgba(15, 23, 42, 0.06)'
            }}
          >
            {/* Logo placeholder */}
            <Box sx={{ mt: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Box component="img" src={logoImg} alt="Marbella Logo" sx={{ height: 50, objectFit: 'contain' }} />
              <Box sx={{ width: '40%', height: '1px', bgcolor: '#cbd5e1', mt: 1.5 }} />
            </Box>

            {/* Avatar placeholder */}
            <Box sx={{ mt: 3, mx: "auto", width: 120, height: 140, bgcolor: "#e2e8f0", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <PersonRoundedIcon sx={{ fontSize: 70, color: "#94a3b8" }} />
            </Box>

            {/* Title and ID */}
            <Box sx={{ mt: 2.5, textAlign: "center" }}>
              <Typography sx={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "0.7rem", fontWeight: 700, color: "#166534", letterSpacing: "1px" }}>
                STAFF ID NUMBER
              </Typography>
              <Typography sx={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.4rem", fontWeight: 600, color: "#166534", letterSpacing: "3px", mt: 0.5 }}>
                {String(staff.cardNo || '').replace(/(.{2})/g, '$1 ').trim()}
              </Typography>
            </Box>

            {/* QR Code */}
            <Box sx={{ mt: 2, mx: "auto", flexGrow: 1, display: "flex", alignItems: "center", pb: 5 }}>
              {qrImageDataUrl ? (
                <Box 
                  component="img"
                  src={qrImageDataUrl} 
                  alt="Access QR"
                  sx={{ width: 100, height: 100, display: 'block', borderRadius: '8px' }}
                />
              ) : (
                <QRCodeSVG 
                  value={String(qrCodeToken || staff.cardNo || '')} 
                  size={100} 
                  level="H" 
                  style={{ display: 'block' }}
                />
              )}
            </Box>

            {/* Wave footer */}
            <Box sx={{ mt: "auto", width: "100%", position: 'relative' }}>
              {/* Gold Wave Layer */}
              <svg viewBox="0 0 200 24" preserveAspectRatio="none" style={{ width: "100%", height: "20px", display: "block" }}>
                <path d="M0,12 C50,-5 150,20 200,5 L200,24 L0,24 Z" fill="#bca47c" />
              </svg>
              {/* Dark Green Wave Layer (overlapping) */}
              <svg viewBox="0 0 200 24" preserveAspectRatio="none" style={{ width: "100%", height: "20px", display: "block", marginTop: "-17px", position: "relative", zIndex: 2 }}>
                <path d="M0,12 C50,-5 150,20 200,5 L200,24 L0,24 Z" fill="#14532d" />
              </svg>
              {/* Bottom block */}
              <Box sx={{ bgcolor: "#14532d", height: "40px", position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", marginTop: "-1px" }}>
                <Typography sx={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "0.75rem", color: "#ffffff", letterSpacing: "0.5px" }}>
                  clubmarbella.app
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column: Detailed Info Ledger */}
        <Grid size={{ xs: 12, md: 7, lg: 7.5 }}>
          <Stack spacing={4}>
            {/* General Info Profile */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                border: "1px solid #e2e8f0",
                borderRadius: "32px",
                bgcolor: "white",
              }}
            >
              <Typography
                variant="h5"
                fontWeight="900"
                sx={{ mb: 4, color: "#091542" }}
              >
                General Information
              </Typography>

              <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={1}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <BadgeIcon
                        color="primary"
                        fontSize="small"
                        sx={{ color: "#24528C" }}
                      />
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        fontWeight="700"
                      >
                        Full Legal Name
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      fontWeight="800"
                      color="#1e293b"
                    >
                      {staff.name}
                    </Typography>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={1}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <ApartmentIcon
                        color="primary"
                        fontSize="small"
                        sx={{ color: "#24528C" }}
                      />
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        fontWeight="700"
                      >
                        Department
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      fontWeight="800"
                      color="#1e293b"
                    >
                      {staff.department}
                    </Typography>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={1}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <PhoneIcon
                        color="primary"
                        fontSize="small"
                        sx={{ color: "#24528C" }}
                      />
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        fontWeight="700"
                      >
                        Phone Number
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      fontWeight="800"
                      color="#1e293b"
                    >
                      {staff.phone}
                    </Typography>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={1}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <EmailIcon
                        color="primary"
                        fontSize="small"
                        sx={{ color: "#24528C" }}
                      />
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        fontWeight="700"
                      >
                        Email Address
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      fontWeight="800"
                      color="#1e293b"
                    >
                      {staff.email}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>

            {/* Employment and Contact Info */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                border: "1px solid #e2e8f0",
                borderRadius: "32px",
                bgcolor: "white",
              }}
            >
              <Typography
                variant="h5"
                fontWeight="900"
                sx={{ mb: 4, color: "#091542" }}
              >
                Employment & Security Details
              </Typography>

              <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={1}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <CalendarTodayIcon
                        color="primary"
                        fontSize="small"
                        sx={{ color: "#24528C" }}
                      />
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        fontWeight="700"
                      >
                        Date of Joining
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      fontWeight="800"
                      color="#1e293b"
                    >
                      {staff.joiningDate}
                    </Typography>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={1}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <ApartmentIcon
                        color="primary"
                        fontSize="small"
                        sx={{ color: "#24528C" }}
                      />
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        fontWeight="700"
                      >
                        Project / Society
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      fontWeight="800"
                      color="#1e293b"
                    >
                      {staff.projectName || staff.projectId || "N/A"}
                    </Typography>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={1}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <PlaceIcon
                        color="primary"
                        fontSize="small"
                        sx={{ color: "#16a34a" }}
                      />
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        fontWeight="700"
                      >
                        Assigned Duty Facility
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      fontWeight="800"
                      color="#16a34a"
                    >
                      {staff.facilityName}
                    </Typography>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={1}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <ShieldOutlinedIcon
                        color="primary"
                        fontSize="small"
                        sx={{ color: "#16a34a" }}
                      />
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        fontWeight="700"
                      >
                        Security Clearance
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      fontWeight="800"
                      color="#16a34a"
                    >
                      Approved (Level 1)
                    </Typography>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={1}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <ContactPhoneOutlinedIcon
                        color="primary"
                        fontSize="small"
                        sx={{ color: "#ef4444" }}
                      />
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        fontWeight="700"
                      >
                        Emergency Contact
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      fontWeight="900"
                      color="#ef4444"
                    >
                      {staff.emergencyContact}
                    </Typography>
                  </Stack>
                </Grid>

                <Grid size={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid size={12}>
                  <Stack spacing={1}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      fontWeight="700"
                    >
                      Permanent Home Address
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="700"
                      color="#1e293b"
                      sx={{ lineHeight: 1.7 }}
                    >
                      {staff.address}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>

            {/* Work Schedule & Access Details */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                border: "1px solid #e2e8f0",
                borderRadius: "32px",
                bgcolor: "white",
              }}
            >
              <Typography
                variant="h5"
                fontWeight="900"
                sx={{ mb: 4, color: "#091542" }}
              >
                Schedule & Access Details
              </Typography>

              <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={1}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      fontWeight="700"
                    >
                      Designation / Role
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="800"
                      color="#1e293b"
                    >
                      {staff.designation || staff.department}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={1}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      fontWeight="700"
                    >
                      Employment Type
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="800"
                      color="#1e293b"
                    >
                      {(staff.employmentType || "FULL_TIME").replace("_", " ")}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={1}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      fontWeight="700"
                    >
                      Shift Timing
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="800"
                      color="#1e293b"
                    >
                      {staff.shiftStart} to {staff.shiftEnd}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={1}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      fontWeight="700"
                    >
                      Work Days
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="800"
                      color="#1e293b"
                    >
                      {staff.workDays?.join(", ") || "Mon-Sat"}
                    </Typography>
                  </Stack>
                </Grid>

                <Grid size={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={1}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      fontWeight="700"
                    >
                      Access Level
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="800"
                      color="#1e293b"
                    >
                      {(staff.accessLevel || "FACILITY_ONLY").replace("_", " ")}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={1}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      fontWeight="700"
                    >
                      ID Proof Provided
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="800"
                      color="#1e293b"
                    >
                      {staff.idProofType}{" "}
                      {staff.idProofNumber ? `(${staff.idProofNumber})` : ""}
                    </Typography>
                    {staff.idProofUrl && (
                      <Button
                        variant="text"
                        size="small"
                        href={getFileUrl(staff.idProofUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          justifyContent: "flex-start",
                          p: 0,
                          textTransform: "none",
                          fontWeight: 700,
                          color: "#24528C",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        View ID Proof Document
                      </Button>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
