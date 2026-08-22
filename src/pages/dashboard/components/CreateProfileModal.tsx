import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  CircularProgress,
  FormControlLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import BusinessIcon from "@mui/icons-material/Business";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import { createUserApi } from "@/apis/user";
import { getProjectsApi } from "@/apis/project";
import { getTowersApi } from "@/apis/tower";
import { getFlatsApi } from "@/apis/flat";
import { uploadDocumentApi } from "@/apis/document";

interface CreateProfileModalProps {
  open: boolean;
  onClose: () => void;
}

const CreateProfileModal: React.FC<CreateProfileModalProps> = ({ open, onClose }) => {
  const [view, setView] = useState<"drafts" | "role" | "wizard">("drafts");
  const [role, setRole] = useState<"Apartment owner" | "Tenant" | "Club Marbella member" | null>(null);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aadhaarUrl, setAadhaarUrl] = useState("");
  const [panUrl, setPanUrl] = useState("");
  const [uploadingAadhaar, setUploadingAadhaar] = useState(false);
  const [uploadingPan, setUploadingPan] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    gender: "",
    dob: "",
    project: "",
    tower: "",
    flat: "",
    address: "",
    stayEndsAt: "",
    remarks: "",
  });

  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // API Data States
  const [projects, setProjects] = useState<any[]>([]);
  const [towers, setTowers] = useState<any[]>([]);
  const [flats, setFlats] = useState<any[]>([]);

  const drafts = [
    { name: "Priya Nair", expires: "Expires in 5 days", red: false },
    { name: "Vikram Rao", expires: "Expires in 1 day", red: true },
  ];

  // Fetch Projects when reaching step 2
  useEffect(() => {
    if (wizardStep === 2 && projects.length === 0) {
      getProjectsApi().then((res: any) => {
        const data = res?.data?.data || res?.data || res;
        if (Array.isArray(data)) setProjects(data);
      }).catch(console.error);
    }
  }, [wizardStep]);

  // Fetch Towers when Project changes
  useEffect(() => {
    if (formData.project) {
      getTowersApi(formData.project).then((res: any) => {
        const data = res?.data?.data || res?.data || res;
        if (Array.isArray(data)) setTowers(data);
      }).catch(console.error);
    } else {
      setTowers([]);
      setFlats([]);
    }
  }, [formData.project]);

  // Fetch Flats when Tower changes
  useEffect(() => {
    if (formData.tower) {
      getFlatsApi(formData.tower).then((res: any) => {
        const data = res?.data?.data || res?.data || res;
        if (Array.isArray(data)) setFlats(data);
      }).catch(console.error);
    } else {
      setFlats([]);
    }
  }, [formData.tower]);

  const handleClose = () => {
    setView("drafts");
    setWizardStep(1);
    setRole(null);
    setFormData({
      name: "", mobile: "", email: "", password: "", gender: "", dob: "", project: "", tower: "", flat: "", address: "", stayEndsAt: "", remarks: ""
    });
    setPrivacyAccepted(false);
    setTermsAccepted(false);
    onClose();
  };

  const handleSelectRole = (selectedRole: any) => {
    setRole(selectedRole);
    setView("wizard");
    setWizardStep(1);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "aadhaar" | "pan") => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (type === "aadhaar") setUploadingAadhaar(true);
      else setUploadingPan(true);
      
      try {
        const url = await uploadDocumentApi(file);
        if (type === "aadhaar") setAadhaarUrl(url);
        else setPanUrl(url);
      } catch (err) {
        console.error("Upload error", err);
        alert("Failed to upload document");
      } finally {
        if (type === "aadhaar") setUploadingAadhaar(false);
        else setUploadingPan(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (!privacyAccepted || !termsAccepted) {
      alert("Please accept both the Privacy Policy and Sale Terms.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.mobile,
        password: formData.password || "Password@123", // Fallback just in case
        role: "RESIDENT",
        accountRole: role === "Apartment owner" ? "OWNER" : role === "Tenant" ? "TENANT" : "MEMBER",
        projectId: formData.project,
        towerId: formData.tower,
        flatId: formData.flat,
        stayEndsAt: role === "Tenant" ? (formData.stayEndsAt || null) : null,
        aadhaarDocumentUrl: aadhaarUrl,
        // (Add PAN url to backend payload if required, not standard in CreateUserPayload currently)
      };
      
      await createUserApi(payload as any);
      handleClose();
    } catch (err) {
      console.error(err);
      alert("Failed to create profile. Please check your data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepper = () => {
    const steps = [
      { id: 1, label: "You" },
      { id: 2, label: "Home" },
      { id: 3, label: "Verify" },
      { id: 4, label: "Sign" },
    ];
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
        {steps.map((s, idx) => {
          const isActive = wizardStep === s.id;
          const isCompleted = wizardStep > s.id;
          return (
            <React.Fragment key={s.id}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    bgcolor: isCompleted || isActive ? "#1e3a5f" : "#e2e8f0",
                    color: isCompleted || isActive ? "#fff" : "#94a3b8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                  }}
                >
                  {isCompleted ? <CheckCircleIcon sx={{ fontSize: 16 }} /> : s.id}
                </Box>
                <Typography sx={{ fontSize: "0.8rem", fontWeight: isActive ? 600 : 500, color: isActive ? "#1e293b" : "#94a3b8" }}>
                  {s.label}
                </Typography>
              </Box>
              {idx < steps.length - 1 && (
                <Box sx={{ flex: 1, height: "1px", bgcolor: "#e2e8f0", mx: 1.5 }} />
              )}
            </React.Fragment>
          );
        })}
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          overflow: "hidden",
        },
      }}
    >
      {/* Header for Drafts and Role Selection */}
      {view !== "wizard" && (
        <Box sx={{ bgcolor: "#1e3a5f", color: "#fff", p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            <Box sx={{ bgcolor: "rgba(255,255,255,0.1)", p: 0.75, borderRadius: "8px", display: "flex", border: "1px solid rgba(255,255,255,0.2)" }}>
              <PersonOutlineIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: "0.95rem" }}>Create profile</Typography>
              <Typography sx={{ fontSize: "0.75rem", opacity: 0.8 }}>Join Club Marbella — about 2 minutes</Typography>
            </Box>
          </Box>
          <IconButton onClick={handleClose} size="small" sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* Header for Wizard */}
      {view === "wizard" && (
        <Box sx={{ bgcolor: "#1e3a5f", color: "#fff", p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            <Box sx={{ bgcolor: "rgba(255,255,255,0.1)", p: 0.75, borderRadius: "8px", display: "flex", border: "1px solid rgba(255,255,255,0.2)" }}>
              <PersonOutlineIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: "0.95rem" }}>Create profile</Typography>
              <Typography sx={{ fontSize: "0.75rem", opacity: 0.8 }}>Join Club Marbella — about 2 minutes</Typography>
            </Box>
          </Box>
          <IconButton onClick={handleClose} size="small" sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      <DialogContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3, bgcolor: "#fff", ...(view === "wizard" ? { p: 4 } : {}) }}>
        {/* VIEW: DRAFTS */}
        {view === "drafts" && (
          <>
            <Box
              onClick={() => setView("role")}
              sx={{
                bgcolor: "#bca462",
                color: "#fff",
                borderRadius: "12px",
                p: 2.5,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": { bgcolor: "#a89052" }
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <AddIcon sx={{ opacity: 0.8 }} />
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: "1rem", lineHeight: 1.2 }}>Start a new profile</Typography>
                  <Typography sx={{ fontSize: "0.75rem", opacity: 0.9 }}>Fresh registration</Typography>
                </Box>
              </Box>
              <ArrowForwardIcon sx={{ fontSize: 20, opacity: 0.8 }} />
            </Box>

            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5, color: "#64748b" }}>
                <AccessTimeIcon sx={{ fontSize: 16 }} />
                <Typography sx={{ fontSize: "0.8rem", fontWeight: 500 }}>Resume a saved draft</Typography>
              </Box>
              
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {drafts.map((draft, idx) => (
                  <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1.5, border: "1px solid #e2e8f0", borderRadius: "12px" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box sx={{ bgcolor: "#f8fafc", p: 1, borderRadius: "50%", display: "flex" }}>
                        <PersonOutlineIcon sx={{ fontSize: 20, color: "#94a3b8" }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: "#1e293b" }}>{draft.name}</Typography>
                        <Typography sx={{ fontSize: "0.75rem", color: draft.red ? "#ef4444" : "#64748b" }}>{draft.expires}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Button size="small" variant="outlined" sx={{ textTransform: "none", borderRadius: "8px", borderColor: "#e2e8f0", color: "#475569", fontWeight: 600 }}>Resume</Button>
                      <IconButton size="small" sx={{ border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                        <CloseIcon fontSize="small" sx={{ color: "#94a3b8" }} />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            <Typography sx={{ fontSize: "0.75rem", color: "#94a3b8", textAlign: "center", mt: 1 }}>
              Incomplete drafts are kept for 7 days, then removed automatically.
            </Typography>
          </>
        )}

        {/* VIEW: ROLE */}
        {view === "role" && (
          <>
            <Box>
              <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "1.5rem", fontWeight: 600, color: "#1e293b", mb: 0.5 }}>
                Who are we enrolling?
              </Typography>
              <Typography sx={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.4 }}>
                One profile, one record — used across sales, the club and gate access. You enter their details once.
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {[
                { title: "Apartment owner", sub: "Bought a Marbella flat — full owner record & documents", icon: <BusinessIcon sx={{ color: "#3b82f6" }} />, color: "#eff6ff" },
                { title: "Tenant", sub: "Renting a unit — with agreement expiry tracked", icon: <HomeOutlinedIcon sx={{ color: "#d97706" }} />, color: "#fffbeb" },
                { title: "Club Marbella member", sub: "Clubhouse access & facilities — linked to the same person", icon: <WorkspacePremiumOutlinedIcon sx={{ color: "#9333ea" }} />, color: "#faf5ff" }
              ].map((opt, idx) => (
                <Box key={idx} onClick={() => handleSelectRole(opt.title)} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, border: "1px solid #e2e8f0", borderRadius: "12px", cursor: "pointer", "&:hover": { bgcolor: "#f8fafc" } }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ bgcolor: opt.color, p: 1.5, borderRadius: "12px", display: "flex" }}>
                      {opt.icon}
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: "0.95rem", color: "#1e293b" }}>{opt.title}</Typography>
                      <Typography sx={{ fontSize: "0.75rem", color: "#64748b" }}>{opt.sub}</Typography>
                    </Box>
                  </Box>
                  <ArrowForwardIcon sx={{ fontSize: 18, color: "#cbd5e1" }} />
                </Box>
              ))}
            </Box>

            <Box sx={{ bgcolor: "#f8fafc", p: 2, borderRadius: "12px", display: "flex", gap: 1.5, alignItems: "flex-start" }}>
              <Box sx={{ color: "#94a3b8", mt: 0.5 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
              </Box>
              <Typography sx={{ fontSize: "0.75rem", color: "#64748b", lineHeight: 1.5 }}>
                Aadhaar, PAN, phone and photo are captured <strong>once</strong>. If this person already exists, the system reuses the same central record — so a sale, a club membership and gate access all point to one profile.
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
              <Button onClick={() => setView("drafts")} startIcon={<ArrowBackIcon fontSize="small" />} sx={{ textTransform: "none", color: "#475569", fontSize: "0.85rem", fontWeight: 600 }}>
                Back to saved drafts
              </Button>
            </Box>
          </>
        )}

        {/* VIEW: WIZARD */}
        {view === "wizard" && (
          <>
            {/* Wizard Role Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#f8fafc", p: 1.5, borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {role === "Apartment owner" && <BusinessIcon sx={{ color: "#3b82f6", fontSize: 18 }} />}
                {role === "Tenant" && <HomeOutlinedIcon sx={{ color: "#d97706", fontSize: 18 }} />}
                {role === "Club Marbella member" && <WorkspacePremiumOutlinedIcon sx={{ color: "#9333ea", fontSize: 18 }} />}
                <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: "#1e293b" }}>{role}</Typography>
              </Box>
              <Button size="small" onClick={() => setView("role")} sx={{ textTransform: "none", color: "#64748b", fontWeight: 600 }}>Change</Button>
            </Box>

            {renderStepper()}

            {/* WIZARD STEP 1: YOU */}
            {wizardStep === 1 && (
              <Box>
                <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "1.5rem", fontWeight: 600, color: "#1e293b", mb: 0.5 }}>
                  Let's start with you
                </Typography>
                <Typography sx={{ fontSize: "0.85rem", color: "#64748b", mb: 3 }}>
                  Just the basics — you can finish the rest anytime.
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                  <Box sx={{ width: 80, height: 80, borderRadius: "50%", border: "2px dashed #94a3b8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#3b82f6", cursor: "pointer", "&:hover": { bgcolor: "#f8fafc" } }}>
                    <CameraAltOutlinedIcon />
                    <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, mt: 0.5 }}>Add photo</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box>
                    <Typography sx={{ fontSize: "0.75rem", color: "#64748b", mb: 0.5, display: "flex", alignItems: "center", gap: 0.5 }}><PersonOutlineIcon sx={{ fontSize: 14 }}/> Full name</Typography>
                    <TextField fullWidth size="small" placeholder="Your name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "0.75rem", color: "#64748b", mb: 0.5, display: "flex", alignItems: "center", gap: 0.5 }}>Mobile</Typography>
                    <TextField fullWidth size="small" placeholder="+91 ..." value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "0.75rem", color: "#64748b", mb: 0.5, display: "flex", alignItems: "center", gap: 0.5 }}>Email</Typography>
                    <TextField fullWidth size="small" placeholder="you@email.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "0.75rem", color: "#64748b", mb: 0.5, display: "flex", alignItems: "center", gap: 0.5 }}>Password</Typography>
                    <TextField fullWidth type="password" size="small" placeholder="Create a password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }} />
                  </Box>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: "0.75rem", color: "#64748b", mb: 0.5, display: "flex", alignItems: "center", gap: 0.5 }}><PersonOutlineIcon sx={{ fontSize: 14 }}/> Gender</Typography>
                      <Select fullWidth size="small" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value as string})} displayEmpty sx={{ borderRadius: "8px" }}>
                        <MenuItem value="" disabled>Select</MenuItem>
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: "0.75rem", color: "#64748b", mb: 0.5, display: "flex", alignItems: "center", gap: 0.5 }}>Date of birth</Typography>
                      <TextField type="date" fullWidth size="small" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }} InputLabelProps={{ shrink: true }} />
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}

            {/* WIZARD STEP 2: HOME / LEASE / CLUB */}
            {wizardStep === 2 && (
              <Box>
                <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "1.5rem", fontWeight: 600, color: "#1e293b", mb: 0.5 }}>
                  About your {role === "Apartment owner" ? "home" : role === "Tenant" ? "lease" : "membership"}
                </Typography>
                <Typography sx={{ fontSize: "0.85rem", color: "#64748b", mb: 3 }}>
                  So we set up the right access for you.
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box>
                    <Typography sx={{ fontSize: "0.75rem", color: "#64748b", mb: 0.5 }}>Project</Typography>
                    <Select fullWidth size="small" displayEmpty value={formData.project} onChange={(e) => setFormData({...formData, project: e.target.value as string, tower: "", flat: ""})} sx={{ borderRadius: "8px" }}>
                      <MenuItem value="" disabled>Select Project</MenuItem>
                      {projects.map((p) => (
                        <MenuItem key={p.id || p._id} value={p.id || p._id}>{p.name}</MenuItem>
                      ))}
                    </Select>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "0.75rem", color: "#64748b", mb: 0.5 }}>Tower</Typography>
                    <Select fullWidth size="small" displayEmpty value={formData.tower} onChange={(e) => setFormData({...formData, tower: e.target.value as string, flat: ""})} sx={{ borderRadius: "8px" }} disabled={!formData.project || towers.length === 0}>
                      <MenuItem value="" disabled>{towers.length === 0 && formData.project ? "No towers" : "Select Tower"}</MenuItem>
                      {towers.map((t) => (
                        <MenuItem key={t.id || t._id} value={t.id || t._id}>{t.name}</MenuItem>
                      ))}
                    </Select>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "0.75rem", color: "#64748b", mb: 0.5 }}>Apartment / unit</Typography>
                    <Select fullWidth size="small" displayEmpty value={formData.flat} onChange={(e) => setFormData({...formData, flat: e.target.value as string})} sx={{ borderRadius: "8px" }} disabled={!formData.tower || flats.length === 0}>
                      <MenuItem value="" disabled>{flats.length === 0 && formData.tower ? "No units" : "Select Unit"}</MenuItem>
                      {flats.map((f) => (
                        <MenuItem key={f.id || f._id} value={f.id || f._id}>{f.flatNumber || f.name || f.id}</MenuItem>
                      ))}
                    </Select>
                  </Box>

                  <Box>
                    <Typography sx={{ fontSize: "0.75rem", color: "#64748b", mb: 0.5 }}>Address (optional)</Typography>
                    <TextField fullWidth size="small" placeholder="Correspondence address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }} />
                  </Box>

                  {role === "Tenant" && (
                    <Box>
                      <Typography sx={{ fontSize: "0.75rem", color: "#64748b", mb: 0.5 }}>Lease expiry date</Typography>
                      <TextField type="date" fullWidth size="small" value={formData.stayEndsAt} onChange={(e) => setFormData({...formData, stayEndsAt: e.target.value})} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }} InputLabelProps={{ shrink: true }} />
                    </Box>
                  )}
                </Box>
              </Box>
            )}

            {/* WIZARD STEP 3: VERIFY */}
            {wizardStep === 3 && (
              <Box>
                <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "1.5rem", fontWeight: 600, color: "#1e293b", mb: 0.5 }}>
                  Verify identity
                </Typography>
                <Typography sx={{ fontSize: "0.85rem", color: "#64748b", mb: 3 }}>
                  Captured once, reused across the club — never re-keyed.
                </Typography>

                <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                  <Box sx={{ flex: 1, border: "1px solid", borderColor: aadhaarUrl ? "#81c784" : "#e2e8f0", bgcolor: aadhaarUrl ? "#e8f5e9" : "transparent", borderRadius: "12px", p: 2, display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box sx={{ bgcolor: aadhaarUrl ? "#fff" : "#f8fafc", p: 1, borderRadius: "8px" }}><CreditCardOutlinedIcon sx={{ color: aadhaarUrl ? "#2e7d32" : "#3b82f6" }}/></Box>
                      <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: "#1e293b" }}>Aadhaar</Typography>
                        <Typography sx={{ fontSize: "0.7rem", color: "#64748b" }}>{aadhaarUrl ? "Uploaded" : "Upload / scan"}</Typography>
                      </Box>
                    </Box>
                    {aadhaarUrl ? (
                      <CheckCircleIcon sx={{ color: "#2e7d32" }} />
                    ) : (
                      <Button component="label" size="small" startIcon={uploadingAadhaar ? <CircularProgress size={14} color="inherit" /> : <CloudUploadOutlinedIcon />} sx={{ textTransform: "none", fontWeight: 600 }} disabled={uploadingAadhaar}>
                        {uploadingAadhaar ? "Uploading..." : "Upload"}
                        <input type="file" hidden onChange={(e) => handleFileUpload(e, "aadhaar")} />
                      </Button>
                    )}
                  </Box>
                  
                  <Box sx={{ flex: 1, border: "1px solid", borderColor: panUrl ? "#81c784" : "#e2e8f0", bgcolor: panUrl ? "#e8f5e9" : "transparent", borderRadius: "12px", p: 2, display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box sx={{ bgcolor: panUrl ? "#fff" : "#f8fafc", p: 1, borderRadius: "8px" }}><CreditCardOutlinedIcon sx={{ color: panUrl ? "#2e7d32" : "#3b82f6" }}/></Box>
                      <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: "#1e293b" }}>PAN <span style={{fontWeight: 400}}>(optional)</span></Typography>
                        <Typography sx={{ fontSize: "0.7rem", color: "#64748b" }}>{panUrl ? "Uploaded" : "Upload"}</Typography>
                      </Box>
                    </Box>
                    {panUrl ? (
                      <CheckCircleIcon sx={{ color: "#2e7d32" }} />
                    ) : (
                      <Button component="label" size="small" startIcon={uploadingPan ? <CircularProgress size={14} color="inherit" /> : <CloudUploadOutlinedIcon />} sx={{ textTransform: "none", fontWeight: 600 }} disabled={uploadingPan}>
                        {uploadingPan ? "Uploading..." : "Upload"}
                        <input type="file" hidden onChange={(e) => handleFileUpload(e, "pan")} />
                      </Button>
                    )}
                  </Box>
                </Box>

                <Box sx={{ border: "1px solid #e2e8f0", borderRadius: "12px", p: 1.5, mb: 3, display: "flex", alignItems: "center", color: "#94a3b8" }}>
                  <Typography sx={{ fontSize: "0.85rem" }}>— Resident · Grand</Typography>
                </Box>

                <Box sx={{ bgcolor: "#f8fafc", p: 2, borderRadius: "12px", display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                  <Box sx={{ color: "#94a3b8", mt: 0.5 }}>
                    <CheckCircleIcon sx={{ fontSize: 18 }} />
                  </Box>
                  <Typography sx={{ fontSize: "0.75rem", color: "#64748b", lineHeight: 1.5 }}>
                    Next you'll read the privacy policy and the sale terms, then sign — that completes the profile.
                  </Typography>
                </Box>
              </Box>
            )}

            {/* WIZARD STEP 4: SIGN */}
            {wizardStep === 4 && (
              <Box>
                <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "1.5rem", fontWeight: 600, color: "#1e293b", mb: 0.5 }}>
                  Review & sign
                </Typography>
                <Typography sx={{ fontSize: "0.85rem", color: "#64748b", mb: 3 }}>
                  Please read both, add any remarks, and sign to complete.
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  
                  {/* Privacy Policy */}
                  <Box sx={{ border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
                    <Box sx={{ bgcolor: "#f8fafc", p: 1.5, borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: "#1e293b", display: "flex", alignItems: "center", gap: 1 }}>
                        <Box component="span" sx={{ color: "#94a3b8" }}>🔒</Box> Privacy policy
                      </Typography>
                      <Typography sx={{ fontSize: "0.7rem", color: "#94a3b8" }}>v1.0 · Aug 2026</Typography>
                    </Box>
                    <Box sx={{ p: 2, fontSize: "0.75rem", color: "#64748b", display: "flex", flexDirection: "column", gap: 1.5 }}>
                      <Box>
                        <Typography sx={{ fontWeight: 600, color: "#1e293b", mb: 0.25 }}>Your information is safe with us</Typography>
                        The details you share — including your Aadhaar, PAN, photograph, contact and payment records — are collected only to complete your purchase, issue your access card, and serve you as a member of Club Marbella.
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 600, color: "#1e293b", mb: 0.25 }}>Who can see it</Typography>
                        Your information is kept confidential and shared only with the Marbella departments that genuinely need it to serve you — Sales, CRM, Accounts and Facilities. It is never sold or handed to any outside party for marketing.
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 600, color: "#1e293b", mb: 0.25 }}>How long we keep it</Typography>
                        We retain your records for as long as you are associated with the property or the club, and for the period the law requires thereafter, after which they are securely removed.
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 600, color: "#1e293b", mb: 0.25 }}>Your rights</Typography>
                        You may ask to see, correct or update the information we hold about you at any time by writing to the Marbella office.
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 600, color: "#1e293b", mb: 0.25 }}>Good faith</Typography>
                        This summary is provided under the Digital Personal Data Protection Act, 2023. The complete policy is available at the Marbella office on request.
                      </Box>
                    </Box>
                    <Box sx={{ p: 1.5, borderTop: "1px solid", borderColor: privacyAccepted ? "#81c784" : "#e2e8f0", bgcolor: privacyAccepted ? "#e8f5e9" : "#fafafa" }}>
                      <FormControlLabel
                        control={<Checkbox size="small" checked={privacyAccepted} onChange={(e) => setPrivacyAccepted(e.target.checked)} />}
                        label={<Typography sx={{ fontSize: "0.85rem", color: "#1e293b" }}>I have read and accept the <strong>Privacy Policy</strong>.</Typography>}
                        sx={{ m: 0 }}
                      />
                    </Box>
                  </Box>

                  {/* Sale Terms */}
                  <Box sx={{ border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
                    <Box sx={{ bgcolor: "#fffbeb", p: 1.5, borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: "#1e293b", display: "flex", alignItems: "center", gap: 1 }}>
                        <Box component="span" sx={{ color: "#d97706" }}>📄</Box> Sale terms — acknowledgement
                      </Typography>
                    </Box>
                    <Box sx={{ p: 2, fontSize: "0.75rem", color: "#64748b" }}>
                      <ul style={{ margin: 0, paddingLeft: "1.2rem", display: "flex", flexDirection: "column", gap: "12px" }}>
                        <li>
                          I, —, am proceeding with unit — at Marbella Grand of my own free will.
                        </li>
                        <li>
                          The commercial terms — the total consideration and the the agreed terms schedule — have been explained to me and are acceptable.
                        </li>
                        <li>
                          I understand possession and original documents are handed over once the payments due under my plan are complete, as per the sale agreement.
                        </li>
                        <li>
                          The personal details and documents I have provided are true and belong to me.
                        </li>
                      </ul>
                    </Box>
                    <Box sx={{ p: 1.5, borderTop: "1px solid", borderColor: termsAccepted ? "#81c784" : "#e2e8f0", bgcolor: termsAccepted ? "#e8f5e9" : "#fafafa" }}>
                      <FormControlLabel
                        control={<Checkbox size="small" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />}
                        label={<Typography sx={{ fontSize: "0.85rem", color: "#1e293b" }}>I acknowledge and accept these <strong>sale terms</strong>.</Typography>}
                        sx={{ m: 0 }}
                      />
                    </Box>
                  </Box>

                  <Box>
                    <Typography sx={{ fontSize: "0.75rem", color: "#64748b", mb: 0.5 }}>Remarks (optional)</Typography>
                    <TextField fullWidth multiline rows={2} size="small" value={formData.remarks} onChange={(e) => setFormData({...formData, remarks: e.target.value})} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }} />
                  </Box>

                </Box>
              </Box>
            )}

            {/* Wizard Navigation Footer */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
              {wizardStep > 1 ? (
                <Button onClick={() => setWizardStep(prev => prev - 1 as any)} startIcon={<ArrowBackIcon fontSize="small" />} sx={{ textTransform: "none", color: "#64748b", fontWeight: 600 }}>
                  Back
                </Button>
              ) : <Box />}
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Button sx={{ textTransform: "none", color: "#d97706", fontWeight: 600 }} disabled={isSubmitting}>Finish later</Button>
                {wizardStep < 4 ? (
                  <Button variant="contained" onClick={() => setWizardStep(prev => prev + 1 as any)} sx={{ bgcolor: "#1e3a5f", textTransform: "none", borderRadius: "8px", px: 3, "&:hover": { bgcolor: "#162d4a" } }}>
                    Next &gt;
                  </Button>
                ) : (
                  <Button variant="contained" disabled={isSubmitting} onClick={handleSubmit} sx={{ bgcolor: "#94a3b8", textTransform: "none", borderRadius: "8px", px: 3, "&:hover": { bgcolor: "#64748b" } }}>
                    {isSubmitting ? <CircularProgress size={20} color="inherit" /> : "✓ Agree & sign"}
                  </Button>
                )}
              </Box>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateProfileModal;
