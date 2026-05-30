import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Breadcrumbs,
  Link,
  Paper,
  Avatar,
  IconButton,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Stack,
  Chip,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import BackButton from "@/components/BackButton";
import { getProjects, getTowers, getFlats } from "@/utils/setupStore";
import type { Project, Tower, Flat } from "@/utils/setupStore";
import {
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  NavigateNext as NextIcon,
  NavigateBefore as BeforeIcon,
  CheckCircle as SuccessIcon,
  CloudUpload as UploadIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import {
  getCachedProjects,
  getCachedTowers,
  getCachedFlats,
} from "@/utils/apiCache";
import { createUserApi } from "@/apis/user";
import { uploadUserDocumentApi, uploadDocumentApi, uploadFamilyDocumentApi } from "@/apis/document";
import { createFamilyMemberApi } from "@/apis/family";
import { toast } from "react-hot-toast";

const steps = ["Resident Information", "Family Members", "Review & Submit"];

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  mobile: string;
  email?: string;
  gender?: string;
  aadhaar?: string;
  pan?: string;
  vcard?: string;
  documentFile?: File | null;
  documentType?: string;
  dateOfBirth?: string;
}

const AADHAAR_URL = "";
const PAN_URL = "";

interface AddResidentProps {
  open?: boolean;
  onClose?: (success?: boolean) => void;
}

export default function AddResident({
  open,
  onClose,
}: AddResidentProps = {}) {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  // Form State
  const [residentData, setResidentData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    password: "",
    apartment: "",
    category: "Owner",
    userType: "Master",
    aadhaar: "",
    pan: "",
    photo: null as string | null,
    role: "RESIDENT",
    stayEndsAt: "",
  });

  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>("");

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [newMember, setNewMember] = useState({
    name: "",
    relationship: "",
    mobile: "",
    email: "",
    gender: "",
    aadhaar: "",
    pan: "",
    vcard: "",
    documentFile: null as File | null,
    documentType: "AADHAAR",
    dateOfBirth: "",
  });

  const [isFamilyDialogOpen, setIsFamilyDialogOpen] = useState(false);

  // Flat Selection Cascading States
  const [projectId, setProjectId] = useState("");
  const [towerId, setTowerId] = useState("");
  const [flatId, setFlatId] = useState("");

  const [projects, setProjects] = useState<Project[]>([]);
  const [towers, setTowers] = useState<Tower[]>([]);
  const [flats, setFlats] = useState<Flat[]>([]);
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

  useEffect(() => {
    if (open || isFamilyDialogOpen) {
      window.dispatchEvent(new CustomEvent('set-sidebar', { detail: false }));
    } else {
      window.dispatchEvent(new CustomEvent('set-sidebar', { detail: true }));
    }
  }, [open, isFamilyDialogOpen]);

  // Fetch initial data
  useEffect(() => {
    loadSetupData();
  }, []);

  useEffect(() => {
    if (projectId) {
      loadTowersForProject(projectId);
    } else {
      setTowers([]);
    }
    setTowerId("");
    setFlatId("");
  }, [projectId]);

  useEffect(() => {
    if (towerId) {
      loadFlatsForTower(towerId);
    } else {
      setFlats([]);
    }
    setFlatId("");
  }, [towerId]);

  const handleFlatChange = (selectedFlatId: string) => {
    setFlatId(selectedFlatId);
    const flat = flats.find((f) => f.id === selectedFlatId);
    const tower = towers.find((t) => t.id === towerId);
    const project = projects.find((p) => p.id === projectId);
    if (flat && tower && project) {
      setResidentData((prev) => ({
        ...prev,
        apartment: `${project.name} • ${tower.name} • Flat ${(flat as any).flatNumber || flat.number}`,
      }));
    }
  };

  const validateStep0 = () => {
    if (!residentData.fullName.trim()) {
      toast.error("Full name is required");
      return false;
    }
    if (!residentData.mobile.trim()) {
      toast.error("Mobile phone is required");
      return false;
    }
    if (!residentData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!residentData.password || residentData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }
    if (!flatId) {
      toast.error("Assigned Flat selection is required");
      return false;
    }
    if (residentData.category === "Tenant" && !residentData.stayEndsAt) {
      toast.error("Stay ends date (expiry date) is required for Tenants");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (activeStep === 0 && !validateStep0()) return;
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const addFamilyMember = () => {
    if (newMember.name && newMember.relationship) {
      setFamilyMembers([
        ...familyMembers,
        { ...newMember, id: Math.random().toString() },
      ]);
      setNewMember({
        name: "",
        relationship: "",
        mobile: "",
        email: "",
        gender: "",
        aadhaar: "",
        pan: "",
        vcard: "",
        documentFile: null,
        documentType: "AADHAAR",
        dateOfBirth: "",
      });
      setIsFamilyDialogOpen(false);
    } else {
      toast.error("Name and Relationship are required for family members");
    }
  };

  const removeFamilyMember = (id: string) => {
    setFamilyMembers(familyMembers.filter((m) => m.id !== id));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const selectedFlat = flats.find((f) => f.id === flatId) as any;
      const accountRole = residentData.category.toUpperCase() === "TENANT" ? "TENANT" : "OWNER";
      const stayEndsAtVal = accountRole === "TENANT" ? residentData.stayEndsAt : null;

      let uploadedProfileUrl = residentData.photo || undefined;
      if (profilePhotoFile) {
        uploadedProfileUrl = await uploadDocumentApi(profilePhotoFile);
      }

      let uploadedAadhaarUrl = AADHAAR_URL;
      let aadhaarFileName = "aadhar.png";
      let aadhaarFileSize = 245111;
      if (aadhaarFile) {
        uploadedAadhaarUrl = await uploadDocumentApi(aadhaarFile);
        aadhaarFileName = aadhaarFile.name;
        aadhaarFileSize = aadhaarFile.size;
      }

      let uploadedPanUrl = PAN_URL;
      let panFileName = "pan.png";
      if (panFile) {
        uploadedPanUrl = await uploadDocumentApi(panFile);
        panFileName = panFile.name;
      }

      // 1. Create resident user
      const userRes = await createUserApi({
        name: residentData.fullName.trim(),
        email: residentData.email.trim(),
        phone: residentData.mobile.trim(),
        password: residentData.password,
        role: residentData.role || "RESIDENT",
        accountRole: accountRole,
        flatId: flatId,
        projectId: projectId,
        towerId: towerId,
        floorNumber: String(
          selectedFlat?.floorNumber || selectedFlat?.floor || "1",
        ),
        flatNumber: String(
          selectedFlat?.flatNumber || selectedFlat?.number || "101",
        ),
        flatType: selectedFlat?.type || selectedFlat?.flatType || "2BHK",
        stayEndsAt: stayEndsAtVal,
        profilePhotoUrl: uploadedProfileUrl,
        aadhaarNumber: residentData.aadhaar.trim() || undefined,
        aadhaarDocumentUrl: residentData.aadhaar.trim()
          ? uploadedAadhaarUrl
          : undefined,
        aadhaarDocumentFileName: residentData.aadhaar.trim()
          ? aadhaarFileName
          : undefined,
        aadhaarDocumentSize: residentData.aadhaar.trim()
          ? aadhaarFileSize
          : undefined,
      });
      const createdUser = userRes?.data?.user || userRes?.data || userRes;
      const userId = createdUser?.id;

      if (userId) {
        // 2. Upload Aadhaar Card document if Aadhar number is entered
        if (residentData.aadhaar.trim()) {
          try {
            await uploadUserDocumentApi(userId, {
              documentType: "AADHAR_CARD",
              documentCategory: "IDENTITY_PROOF",
              title: "Aadhar Card",
              photoUrl: uploadedAadhaarUrl,
              photoFileName: aadhaarFileName,
            });
          } catch (docErr) {
            console.error("Failed to upload Aadhaar document:", docErr);
          }
        }

        // 3. Upload PAN Card document if PAN number is entered
        if (residentData.pan.trim()) {
          try {
            await uploadUserDocumentApi(userId, {
              documentType: "PAN_CARD",
              documentCategory: "IDENTITY_PROOF",
              title: "PAN Card",
              photoUrl: uploadedPanUrl,
              photoFileName: panFileName,
            });
          } catch (docErr) {
            console.error("Failed to upload PAN document:", docErr);
          }
        }

        // 4. Create Family Members
        for (const member of familyMembers) {
          try {
            let relationshipUpper = member.relationship.toUpperCase();
            if (relationshipUpper === "SPOUSE") relationshipUpper = "SPOUSE";
            else if (relationshipUpper === "CHILD") relationshipUpper = "CHILD";
            else if (relationshipUpper === "PARENT")
              relationshipUpper = "PARENT";
            else if (relationshipUpper === "SIBLING")
              relationshipUpper = "SIBLING";
            else relationshipUpper = "OTHER";

            const famRes = await createFamilyMemberApi(userId, {
              name: member.name,
              relationship: relationshipUpper,
              phone: member.mobile || undefined,
              email: member.email || undefined,
              idType: member.documentType || (member.aadhaar ? "AADHAAR" : member.pan ? "PAN" : undefined),
              idNumber: member.aadhaar || member.pan || undefined,
              accessLevel: "FULL",
              dateOfBirth: member.dateOfBirth || undefined,
            });
            const famId = famRes?.data?.id || famRes?.id;
            
            if (famId && member.documentFile) {
              try {
                const docUrl = await uploadDocumentApi(member.documentFile);
                await uploadFamilyDocumentApi(userId, famId, {
                  documentType: member.documentType || "AADHAAR",
                  documentCategory: "IDENTITY_PROOF",
                  title: member.documentType === "PAN" ? "PAN Card" : member.documentType === "PASSPORT" ? "Passport" : member.documentType === "DRIVING_LICENSE" ? "Driving License" : "Aadhaar Card",
                  photoUrl: docUrl,
                  photoFileName: member.documentFile.name,
                  photoSize: member.documentFile.size,
                });
              } catch (docErr) {
                console.error("Failed to upload document for family member:", docErr);
              }
            }
          } catch (famErr) {
            console.error("Failed to create family member:", famErr);
          }
        }
      }

      toast.success("Resident enrolled successfully");
      if (onClose) {
        onClose(true);
      } else {
        navigate("/residents");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to enroll resident");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <Avatar
                  sx={{ width: 100, height: 100, bgcolor: "#f0f4f8" }}
                  src={profilePhotoPreview || residentData.photo || ""}
                />
                <IconButton
                  color={profilePhotoFile ? "success" : "primary"}
                  component="label"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: -10,
                    bgcolor: profilePhotoFile ? "#dcfce7" : "white",
                    border: "1px solid #e0e0e0",
                    "&:hover": {
                      bgcolor: profilePhotoFile ? "#bbf7d0" : "#f1f5f9",
                    },
                  }}
                >
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setProfilePhotoFile(file);
                        setProfilePhotoPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                  {profilePhotoFile ? (
                    <SuccessIcon fontSize="small" />
                  ) : (
                    <PhotoCameraIcon fontSize="small" />
                  )}
                </IconButton>
              </Box>
              <Typography
                variant="caption"
                display="block"
                sx={{ mt: 1, color: "text.secondary" }}
              >
                Upload Profile Photo *
              </Typography>
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 3,
              }}
            >
              <TextField
                fullWidth
                label="Full Name *"
                placeholder="John Doe"
                variant="outlined"
                value={residentData.fullName}
                onChange={(e) =>
                  setResidentData({ ...residentData, fullName: e.target.value })
                }
                sx={{ "& fieldset": { borderRadius: "12px" } }}
              />
              <TextField
                fullWidth
                label="Mobile Number *"
                placeholder="+919876543210"
                variant="outlined"
                value={residentData.mobile}
                onChange={(e) =>
                  setResidentData({ ...residentData, mobile: e.target.value })
                }
                sx={{ "& fieldset": { borderRadius: "12px" } }}
              />
              <TextField
                fullWidth
                label="Email Address *"
                placeholder="resident@example.com"
                variant="outlined"
                value={residentData.email}
                onChange={(e) =>
                  setResidentData({ ...residentData, email: e.target.value })
                }
                sx={{ "& fieldset": { borderRadius: "12px" } }}
              />
              <TextField
                fullWidth
                label="Password *"
                type="password"
                placeholder="Minimum 8 characters"
                variant="outlined"
                value={residentData.password}
                onChange={(e) =>
                  setResidentData({ ...residentData, password: e.target.value })
                }
                sx={{ "& fieldset": { borderRadius: "12px" } }}
              />
              <TextField
                fullWidth
                select
                label="Project *"
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
                label="Tower *"
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
                label="Flat *"
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
              <TextField
                fullWidth
                select
                label="User Category"
                value={residentData.category}
                onChange={(e) => {
                  const val = e.target.value;
                  setResidentData({ 
                    ...residentData, 
                    category: val,
                    stayEndsAt: val === "Tenant" ? residentData.stayEndsAt : ""
                  });
                }}
                sx={{ "& fieldset": { borderRadius: "12px" } }}
              >
                <MenuItem value="Owner">Owner</MenuItem>
                <MenuItem value="Tenant">Tenant</MenuItem>
              </TextField>

              {residentData.category === "Tenant" && (
                <TextField
                  fullWidth
                  type="date"
                  label="Stay Ends At (Expiry Date) *"
                  value={residentData.stayEndsAt}
                  onChange={(e) =>
                    setResidentData({ ...residentData, stayEndsAt: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                  sx={{ "& fieldset": { borderRadius: "12px" } }}
                />
              )}

              <TextField
                fullWidth
                label="Aadhaar Card Number"
                placeholder="XXXX XXXX XXXX"
                variant="outlined"
                value={residentData.aadhaar}
                onChange={(e) =>
                  setResidentData({
                    ...residentData,
                    aadhaar: e.target.value,
                  })
                }
                sx={{ "& fieldset": { borderRadius: "12px" } }}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      color={aadhaarFile ? "success" : "primary"}
                      component="label"
                      size="small"
                      sx={{
                        bgcolor: aadhaarFile ? "#dcfce7" : "#f1f5f9",
                        borderRadius: "8px",
                        mr: -0.5,
                      }}
                    >
                      {aadhaarFile ? (
                        <SuccessIcon fontSize="small" />
                      ) : (
                        <UploadIcon fontSize="small" />
                      )}
                      <input
                        type="file"
                        hidden
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setAadhaarFile(e.target.files[0]);
                          }
                        }}
                      />
                    </IconButton>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="PAN Card Number"
                placeholder="ABCDE1234F"
                variant="outlined"
                value={residentData.pan}
                onChange={(e) =>
                  setResidentData({ ...residentData, pan: e.target.value })
                }
                sx={{ "& fieldset": { borderRadius: "12px" } }}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      color={panFile ? "success" : "primary"}
                      component="label"
                      size="small"
                      sx={{
                        bgcolor: panFile ? "#dcfce7" : "#f1f5f9",
                        borderRadius: "8px",
                        mr: -0.5,
                      }}
                    >
                      {panFile ? (
                        <SuccessIcon fontSize="small" />
                      ) : (
                        <UploadIcon fontSize="small" />
                      )}
                      <input
                        type="file"
                        hidden
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setPanFile(e.target.files[0]);
                          }
                        }}
                      />
                    </IconButton>
                  ),
                }}
              />
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography
              variant="h6"
              fontWeight="800"
              color="#091542"
              sx={{ mb: 1 }}
            >
              Family Members
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add details for family members living in the same apartment.
            </Typography>

            <Box sx={{ mb: 4, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsFamilyDialogOpen(true)}
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                  px: 3,
                  py: 1,
                  fontWeight: 700,
                  bgcolor: "#0047b3",
                  "&:hover": { bgcolor: "#003380" },
                }}
              >
                Add Family Member
              </Button>
            </Box>

            <Stack spacing={2}>
              {familyMembers.map((member) => (
                <Box
                  key={member.id}
                  sx={{
                    p: 3,
                    border: "1px solid #f1f5f9",
                    borderRadius: "16px",
                    bgcolor: "white",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                      sx={{ mb: 1 }}
                    >
                      <Typography
                        variant="body1"
                        fontWeight="800"
                        color="#091542"
                      >
                        {member.name}
                      </Typography>
                      <Chip
                        label={member.relationship}
                        size="small"
                        sx={{
                          bgcolor: "#eff6ff",
                          color: "#0047b3",
                          fontWeight: 700,
                          borderRadius: "6px",
                        }}
                      />
                      {member.gender && (
                        <Chip
                          label={member.gender}
                          size="small"
                          variant="outlined"
                          sx={{ borderRadius: "6px", fontSize: "0.75rem" }}
                        />
                      )}
                    </Stack>
                    <Box
                      sx={{ display: "flex", gap: 3, flexWrap: "wrap", mt: 1 }}
                    >
                      {member.mobile && (
                        <Typography variant="caption" color="text.secondary">
                          <strong>Mobile:</strong> {member.mobile}
                        </Typography>
                      )}
                      {member.aadhaar && (
                        <Typography variant="caption" color="text.secondary">
                          <strong>Aadhaar:</strong> {member.aadhaar}
                        </Typography>
                      )}
                      {member.pan && (
                        <Typography variant="caption" color="text.secondary">
                          <strong>PAN:</strong> {member.pan}
                        </Typography>
                      )}
                      {member.vcard && (
                        <Typography variant="caption" color="text.secondary">
                          <strong>VCard:</strong> {member.vcard}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <IconButton
                    color="error"
                    onClick={() => removeFamilyMember(member.id)}
                    sx={{
                      border: "1px solid #fee2e2",
                      bgcolor: "#fef2f2",
                      "&:hover": { bgcolor: "#fca5a5", color: "white" },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              {familyMembers.length === 0 && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textAlign: "center",
                    py: 4,
                    border: "1px dashed #e2e8f0",
                    borderRadius: "12px",
                  }}
                >
                  No family members added yet.
                </Typography>
              )}
            </Stack>
          </Box>
        );
      case 2: {
        const selectedProjectName =
          projects.find((p) => p.id === projectId)?.name || "Not Selected";
        const selectedTowerName =
          towers.find((t) => t.id === towerId)?.name || "Not Selected";
        const selectedFlatNumber =
          (flats.find((f) => f.id === flatId) as any)?.flatNumber ||
          flats.find((f) => f.id === flatId)?.number ||
          "Not Selected";

        return (
          <Box sx={{ py: 2 }}>
            <Box sx={{ textAlign: "center", mb: 5 }}>
              <SuccessIcon color="success" sx={{ fontSize: 64, mb: 1.5 }} />
              <Typography variant="h5" fontWeight="900" color="#091542">
                Review Enrollment Details
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, maxWidth: 500, mx: "auto" }}
              >
                Please review the compiled KYC and family member profiles below
                before completing enrollment.
              </Typography>
            </Box>

            {/* Section 1: Master Resident Details */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                border: "1px solid #e2e8f0",
                borderRadius: "20px",
                mb: 4,
                bgcolor: "white",
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight="800"
                color="#091542"
                sx={{ mb: 3 }}
              >
                1. Master Resident Information
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="700"
                  >
                    FULL NAME
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="800"
                    color="#091542"
                    sx={{ mt: 0.5 }}
                  >
                    {residentData.fullName || "Not Provided"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="700"
                  >
                    MOBILE PHONE
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="800"
                    color="#091542"
                    sx={{ mt: 0.5 }}
                  >
                    {residentData.mobile || "Not Provided"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="700"
                  >
                    EMAIL ADDRESS
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="800"
                    color="#091542"
                    sx={{ mt: 0.5 }}
                  >
                    {residentData.email || "Not Provided"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="700"
                  >
                    RESIDENT CATEGORY
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="800"
                    color="#091542"
                    sx={{ mt: 0.5 }}
                  >
                    {residentData.category}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="700"
                  >
                    ASSIGNED APARTMENT
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="800"
                    color="#091542"
                    sx={{ mt: 0.5 }}
                  >
                    {projectId
                      ? `${selectedProjectName} • ${selectedTowerName} • Flat ${selectedFlatNumber}`
                      : "Not Assigned"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="700"
                  >
                    AADHAAR CARD
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="800"
                    color="#091542"
                    sx={{ mt: 0.5 }}
                  >
                    {residentData.aadhaar || "Not Provided"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="700"
                  >
                    PAN CARD
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="800"
                    color="#091542"
                    sx={{ mt: 0.5 }}
                  >
                    {residentData.pan || "Not Provided"}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Section 2: Uploaded Compliance Files */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                border: "1px solid #e2e8f0",
                borderRadius: "20px",
                mb: 4,
                bgcolor: "white",
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight="800"
                color="#091542"
                sx={{ mb: 3 }}
              >
                2. KYC Documents Checklist
              </Typography>
              <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                <Chip
                  label={
                    residentData.aadhaar
                      ? "✓ Aadhaar Number Provided"
                      : "⚠ Aadhaar Number Pending"
                  }
                  color={residentData.aadhaar ? "success" : "warning"}
                  variant="outlined"
                  sx={{ fontWeight: 800, borderRadius: "8px", px: 1 }}
                />
                <Chip
                  label={
                    residentData.pan
                      ? "✓ PAN Number Provided"
                      : "⚠ PAN Number Pending"
                  }
                  color={residentData.pan ? "success" : "warning"}
                  variant="outlined"
                  sx={{ fontWeight: 800, borderRadius: "8px", px: 1 }}
                />
              </Box>
            </Paper>

            {/* Section 3: Family Directory Preview */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                border: "1px solid #e2e8f0",
                borderRadius: "20px",
                bgcolor: "white",
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight="800"
                color="#091542"
                sx={{ mb: 3 }}
              >
                3. Family Members Directory ({familyMembers.length})
              </Typography>
              <Stack spacing={2}>
                {familyMembers.map((member) => (
                  <Box
                    key={member.id}
                    sx={{
                      p: 2.5,
                      border: "1px solid #f1f5f9",
                      borderRadius: "16px",
                      bgcolor: "#f8fafc",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                      sx={{ mb: 1.5 }}
                    >
                      <Typography
                        variant="body1"
                        fontWeight="800"
                        color="#091542"
                      >
                        {member.name}
                      </Typography>
                      <Chip
                        label={member.relationship}
                        size="small"
                        sx={{
                          bgcolor: "#eff6ff",
                          color: "#0047b3",
                          fontWeight: 700,
                          borderRadius: "6px",
                        }}
                      />
                      {member.gender && (
                        <Chip
                          label={member.gender}
                          size="small"
                          variant="outlined"
                          sx={{ borderRadius: "6px", fontSize: "0.75rem" }}
                        />
                      )}
                    </Stack>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
                        gap: 1.5,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        <strong>Mobile:</strong> {member.mobile || "N/A"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        <strong>Aadhaar:</strong> {member.aadhaar || "N/A"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        <strong>PAN Card:</strong> {member.pan || "N/A"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        <strong>Access Card/VCard:</strong>{" "}
                        {member.vcard || "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                ))}
                {familyMembers.length === 0 && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center", py: 2 }}
                  >
                    No family members enrolled.
                  </Typography>
                )}
              </Stack>
            </Paper>
          </Box>
        );
      }
      default:
        return null;
    }
  };

  const formContent = (
    <Box sx={{ maxWidth: 800, mx: "auto", pt: open ? 2 : 0 }}>
      {!open && (
        <Box
          sx={{
            mb: 5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          
          <BackButton to="/residents" label="Back to Residents" />
        </Box>
      )}

      <Box sx={{ maxWidth: 800, mx: "auto" }}>
        <Stepper activeStep={activeStep} sx={{ mb: 6 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  "& .MuiStepLabel-label": {
                    fontWeight: 700,
                    fontSize: "0.85rem",
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box
          sx={
            open
              ? { p: { xs: 1, md: 2 } }
              : {
                  border: "1px solid #f1f5f9",
                  borderRadius: "24px",
                  p: { xs: 3, md: 5 },
                  bgcolor: "white",
                }
          }
        >
          {renderStepContent(activeStep)}

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 6 }}
          >
            <Button
              disabled={activeStep === 0 || submitting}
              onClick={handleBack}
              startIcon={<BeforeIcon />}
              sx={{
                borderRadius: "12px",
                fontWeight: 800,
                textTransform: "none",
                px: 3,
              }}
            >
              Back
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                disabled={submitting}
                onClick={handleSubmit}
                sx={{
                  borderRadius: "12px",
                  fontWeight: 800,
                  textTransform: "none",
                  px: 4,
                  bgcolor: "#0047b3",
                }}
              >
                {submitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Complete Enrollment"
                )}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<NextIcon />}
                sx={{
                  borderRadius: "12px",
                  fontWeight: 800,
                  textTransform: "none",
                  px: 4,
                  bgcolor: "#0047b3",
                }}
              >
                Continue
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      {open ? (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth="md"
          fullWidth
          sx={{ "& .MuiDialog-container": { pl: { md: "var(--sidebar-width, 280px)" } } }}
          PaperProps={{ sx: { borderRadius: "24px", p: 2 } }}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2, borderBottom: '1px solid #f1f5f9', mb: 2 }}>
            <Typography variant="h5" fontWeight="900" color="#091542">Resident Enrollment</Typography>
            <IconButton onClick={onClose} size="small" edge="end">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>{formContent}</DialogContent>
        </Dialog>
      ) : (
        <Box
          sx={{
            p: { xs: 2, md: 4 },
            bgcolor: "#ffffff",
            minHeight: "100vh",
            borderRadius: 2,
          }}
        >
          {formContent}
        </Box>
      )}

      <Dialog
        open={isFamilyDialogOpen}
        onClose={() => setIsFamilyDialogOpen(false)}
        maxWidth="md"
        fullWidth
        sx={{ "& .MuiDialog-container": { pl: { md: "var(--sidebar-width, 280px)" } } }}
        PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#091542" }}>
          Add New Member Details
        </DialogTitle>
        <DialogContent dividers sx={{ border: "none" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 3,
              mt: 1,
            }}
          >
            <TextField
              fullWidth
              label="Name *"
              value={newMember.name}
              onChange={(e) =>
                setNewMember({ ...newMember, name: e.target.value })
              }
              sx={{ "& fieldset": { borderRadius: "10px" } }}
            />
            <TextField
              fullWidth
              select
              label="Relationship *"
              value={newMember.relationship}
              onChange={(e) =>
                setNewMember({ ...newMember, relationship: e.target.value })
              }
              sx={{ "& fieldset": { borderRadius: "10px" } }}
            >
              <MenuItem value="Spouse">Spouse</MenuItem>
              <MenuItem value="Child">Child</MenuItem>
              <MenuItem value="Parent">Parent</MenuItem>
              <MenuItem value="Sibling">Sibling</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Mobile"
              value={newMember.mobile}
              onChange={(e) =>
                setNewMember({ ...newMember, mobile: e.target.value })
              }
              sx={{ "& fieldset": { borderRadius: "10px" } }}
            />
            <TextField
              fullWidth
              label="Email"
              value={newMember.email}
              onChange={(e) =>
                setNewMember({ ...newMember, email: e.target.value })
              }
              sx={{ "& fieldset": { borderRadius: "10px" } }}
            />
            <TextField
              fullWidth
              type="date"
              label="Date of Birth (Optional)"
              InputLabelProps={{ shrink: true }}
              value={newMember.dateOfBirth}
              onChange={(e) =>
                setNewMember({ ...newMember, dateOfBirth: e.target.value })
              }
              sx={{ "& fieldset": { borderRadius: "10px" } }}
            />
            <TextField
              fullWidth
              select
              label="Gender (Optional)"
              value={newMember.gender}
              onChange={(e) =>
                setNewMember({ ...newMember, gender: e.target.value })
              }
              sx={{ "& fieldset": { borderRadius: "10px" } }}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Aadhaar Card (Optional)"
              placeholder="XXXX XXXX XXXX"
              value={newMember.aadhaar}
              onChange={(e) =>
                setNewMember({ ...newMember, aadhaar: e.target.value })
              }
              sx={{ "& fieldset": { borderRadius: "10px" } }}
            />
            <TextField
              fullWidth
              label="PAN Card (Optional)"
              placeholder="ABCDE1234F"
              value={newMember.pan}
              onChange={(e) =>
                setNewMember({ ...newMember, pan: e.target.value })
              }
              sx={{ "& fieldset": { borderRadius: "10px" } }}
            />
            <TextField
              fullWidth
              label="Access Card / VCard (Optional)"
              placeholder="CMR-V100"
              value={newMember.vcard}
              onChange={(e) =>
                setNewMember({ ...newMember, vcard: e.target.value })
              }
              sx={{ "& fieldset": { borderRadius: "10px" } }}
            />
            <Box sx={{ gridColumn: "1 / -1", mt: 1 }}>
              <Typography variant="caption" fontWeight="800" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                UPLOAD KYC DOCUMENT (Optional)
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  select
                  size="small"
                  value={newMember.documentType}
                  onChange={(e) => setNewMember({ ...newMember, documentType: e.target.value })}
                  sx={{ width: 200, "& fieldset": { borderRadius: "10px" } }}
                >
                  <MenuItem value="AADHAAR">Aadhaar Card</MenuItem>
                  <MenuItem value="PAN">PAN Card</MenuItem>
                  <MenuItem value="PASSPORT">Passport</MenuItem>
                  <MenuItem value="DRIVING_LICENSE">Driving License</MenuItem>
                </TextField>
                
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 700, borderColor: '#e2e8f0', color: 'text.primary' }}
                >
                  {newMember.documentFile ? newMember.documentFile.name : "Choose File"}
                  <input
                    type="file"
                    hidden
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setNewMember({ ...newMember, documentFile: e.target.files[0] });
                      }
                    }}
                  />
                </Button>
                {newMember.documentFile && (
                  <IconButton color="error" size="small" onClick={() => setNewMember({ ...newMember, documentFile: null })}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Stack>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setIsFamilyDialogOpen(false)}
            sx={{
              color: "text.secondary",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addFamilyMember}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              px: 3,
              fontWeight: 700,
              bgcolor: "#0047b3",
              "&:hover": { bgcolor: "#003380" },
            }}
          >
            Add Member
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
