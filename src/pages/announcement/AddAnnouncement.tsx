import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, Button, TextField, MenuItem, Grid,
  FormControlLabel, Switch, InputAdornment, LinearProgress, IconButton
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import SubjectOutlinedIcon from "@mui/icons-material/SubjectOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import PriorityHighOutlinedIcon from "@mui/icons-material/PriorityHighOutlined";
import toast from "react-hot-toast";

import FormCard from "@/components/FormCard";
import { getCachedProjects } from "@/utils/apiCache";
import { getProjects } from "@/utils/setupStore";
import { uploadDocumentApi } from "@/apis/document";
import { createAnnouncementApi } from "@/apis/announcement";
import { getFileUrl } from "@/utils/file";

const CATEGORIES = [
  { value: "GENERAL", label: "General" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "FACILITY", label: "Facility" },
  { value: "EVENT", label: "Event" },
  { value: "STAFF", label: "Staff" }
];

const PRIORITIES = [
  { value: "LOW", label: "Low" },
  { value: "NORMAL", label: "Normal" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" }
];

const AUDIENCE_ROLES = [
  { value: "RESIDENT", label: "Resident" },
  { value: "GUEST", label: "Guest" },
  { value: "STAFF", label: "Staff" },
  { value: "MEMBER", label: "Member" }
];

export default function AddAnnouncement() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);

  // Form Fields State
  const [projectId, setProjectId] = useState<string>("all");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("GENERAL");
  const [body, setBody] = useState("");
  const [priority, setPriority] = useState("NORMAL");
  const [audienceRoles, setAudienceRoles] = useState<string[]>(["RESIDENT", "GUEST"]);
  const [pinned, setPinned] = useState(false);
  const [publishNow, setPublishNow] = useState(true);
  const [startsAt, setStartsAt] = useState(() => {
    const d = new Date();
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  });
  const [expiresAt, setExpiresAt] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  });

  // Images & Attachments
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [attachmentUrls, setAttachmentUrls] = useState<string[]>([]);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load projects on mount
  useEffect(() => {
    const loadProjects = async () => {
      let loadedProjects: any[] = [];
      try {
        loadedProjects = await getCachedProjects();
      } catch (err) {
        console.warn("Failed to fetch projects via API, falling back:", err);
        loadedProjects = getProjects();
      }
      setProjects(loadedProjects);
    };
    loadProjects();
  }, []);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingImage(true);
      try {
        const url = await uploadDocumentApi(file);
        setImageUrls(prev => [...prev, url]);
        toast.success("Image uploaded successfully");
      } catch (err) {
        toast.error("Failed to upload image");
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleAttachmentSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingAttachment(true);
      try {
        const url = await uploadDocumentApi(file);
        setAttachmentUrls(prev => [...prev, url]);
        toast.success("Attachment uploaded successfully");
      } catch (err) {
        toast.error("Failed to upload attachment");
      } finally {
        setUploadingAttachment(false);
      }
    }
  };

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!title.trim()) tempErrors.title = "Title is required";
    if (!body.trim()) tempErrors.body = "Content Body is required";
    if (audienceRoles.length === 0) tempErrors.audienceRoles = "Select at least one audience role";

    const start = new Date(startsAt).getTime();
    const end = new Date(expiresAt).getTime();
    if (end <= start) {
      tempErrors.expiresAt = "Expiry date must be after start date";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: any = {
      projectId: projectId === "all" ? null : projectId,
      title,
      category,
      body,
      imageUrls,
      attachmentUrls,
      audienceRoles,
      priority,
      pinned,
      startsAt: new Date(startsAt).toISOString(),
      expiresAt: new Date(expiresAt).toISOString(),
      publishNow
    };

    try {
      await createAnnouncementApi(payload);
      toast.success("Announcement created successfully!");
      navigate("/announcements");
    } catch (err: any) {
      console.warn("Failed to save announcement via API:", err);
      const resData = err?.response?.data;
      if (resData && resData.details && Array.isArray(resData.details)) {
        const apiErrors: Record<string, string> = {};
        resData.details.forEach((d: any) => {
          if (d.field) {
            apiErrors[d.field] = d.message;
          }
        });
        setErrors(apiErrors);
        toast.error("Validation failed. Please correct the fields.");
      } else {
        toast.error(
          resData?.message ||
            err?.message ||
            "Failed to save announcement"
        );
      }
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
      title="Create Announcement"
      subtitle="Broadcast a new announcement to your society residents and guests"
      onBack={() => navigate("/announcements")}
    >
      <form onSubmit={handleSave}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          
          <Grid container spacing={3}>
            {/* Project / Society dropdown */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="Target Project / Society"
                fullWidth
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                sx={textFieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ bgcolor: '#EAF0F7', p: 0.5, borderRadius: '4px', mr: 1, ml: 1, display: 'flex' }}>
                        <EventOutlinedIcon sx={{ color: '#24528C', fontSize: '1.2rem' }} />
                      </Box>
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="all">All Projects (Global Broadcast)</MenuItem>
                {projects.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Category */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="Category"
                fullWidth
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                sx={textFieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ bgcolor: '#EAF0F7', p: 0.5, borderRadius: '4px', mr: 1, ml: 1, display: 'flex' }}>
                        <BadgeOutlinedIcon sx={{ color: '#24528C', fontSize: '1.2rem' }} />
                      </Box>
                    </InputAdornment>
                  ),
                }}
              >
                {CATEGORIES.map((c) => (
                  <MenuItem key={c.value} value={c.value}>
                    {c.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Title */}
            <Grid size={12}>
              <TextField
                label="Announcement Title"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={!!errors.title}
                helperText={errors.title}
                sx={textFieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ bgcolor: '#EAF0F7', p: 0.5, borderRadius: '4px', mr: 1, ml: 1, display: 'flex' }}>
                        <NotificationsActiveOutlinedIcon sx={{ color: '#24528C', fontSize: '1.2rem' }} />
                      </Box>
                    </InputAdornment>
                  ),
                }}
                placeholder="e.g. Swimming Pool Maintenance on Sunday"
              />
            </Grid>

            {/* Body */}
            <Grid size={12}>
              <TextField
                label="Content Body"
                fullWidth
                multiline
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                error={!!errors.body}
                helperText={errors.body}
                sx={textFieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ bgcolor: '#EAF0F7', p: 0.5, borderRadius: '4px', mr: 1, ml: 1, display: 'flex' }}>
                        <SubjectOutlinedIcon sx={{ color: '#24528C', fontSize: '1.2rem' }} />
                      </Box>
                    </InputAdornment>
                  ),
                }}
                placeholder="Enter details of the announcement..."
              />
            </Grid>

            {/* Priority */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="Priority Level"
                fullWidth
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                error={!!errors.priority}
                helperText={errors.priority}
                sx={textFieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ bgcolor: '#EAF0F7', p: 0.5, borderRadius: '4px', mr: 1, ml: 1, display: 'flex' }}>
                        <PriorityHighOutlinedIcon sx={{ color: '#24528C', fontSize: '1.2rem' }} />
                      </Box>
                    </InputAdornment>
                  ),
                }}
              >
                {PRIORITIES.map((p) => (
                  <MenuItem key={p.value} value={p.value}>
                    {p.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Audience Roles Multi-Select */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="Target Audience Roles"
                fullWidth
                SelectProps={{
                  multiple: true,
                }}
                value={audienceRoles}
                onChange={(e) => {
                  const val = e.target.value;
                  setAudienceRoles(typeof val === "string" ? val.split(",") : (val as string[]));
                }}
                error={!!errors.audienceRoles}
                helperText={errors.audienceRoles}
                sx={textFieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ bgcolor: '#EAF0F7', p: 0.5, borderRadius: '4px', mr: 1, ml: 1, display: 'flex' }}>
                        <GroupsOutlinedIcon sx={{ color: '#24528C', fontSize: '1.2rem' }} />
                      </Box>
                    </InputAdornment>
                  ),
                }}
              >
                {AUDIENCE_ROLES.map((r) => (
                  <MenuItem key={r.value} value={r.value}>
                    {r.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Starts At */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                type="datetime-local"
                label="Starts At"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                disabled={publishNow}
                sx={textFieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ bgcolor: '#EAF0F7', p: 0.5, borderRadius: '4px', mr: 1, ml: 1, display: 'flex' }}>
                        <EventOutlinedIcon sx={{ color: '#24528C', fontSize: '1.2rem' }} />
                      </Box>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <AccessTimeIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Expires At */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                type="datetime-local"
                label="Expires At"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                error={!!errors.expiresAt}
                helperText={errors.expiresAt}
                sx={textFieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ bgcolor: '#EAF0F7', p: 0.5, borderRadius: '4px', mr: 1, ml: 1, display: 'flex' }}>
                        <EventOutlinedIcon sx={{ color: '#24528C', fontSize: '1.2rem' }} />
                      </Box>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <AccessTimeIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Switches */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={pinned}
                    onChange={(e) => setPinned(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={700} color="#091542">
                      Pin Announcement
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Keep this notice pinned at the top of resident feeds
                    </Typography>
                  </Box>
                }
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={publishNow}
                    onChange={(e) => {
                      setPublishNow(e.target.checked);
                      if (e.target.checked) {
                        const d = new Date();
                        setStartsAt(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
                      }
                    }}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={700} color="#091542">
                      Publish Immediately
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Make this announcement active immediately upon saving
                    </Typography>
                  </Box>
                }
              />
            </Grid>

            {/* Image Uploads */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" fontWeight={700} color="text.secondary" sx={{ mb: 1 }}>
                Attached Images
              </Typography>
              <input
                type="file"
                accept="image/*"
                ref={imageInputRef}
                style={{ display: "none" }}
                onChange={handleImageSelect}
              />

              {imageUrls.length > 0 && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {imageUrls.map((url, i) => (
                    <Box
                      key={i}
                      sx={{
                        position: "relative",
                        width: 80,
                        height: 80,
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        component="img"
                        src={getFileUrl(url)}
                        alt={`Attachment ${i}`}
                        sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => setImageUrls(prev => prev.filter((_, idx) => idx !== i))}
                        sx={{
                          position: "absolute",
                          top: 2,
                          right: 2,
                          bgcolor: "rgba(255, 255, 255, 0.8)",
                          "&:hover": { bgcolor: "white" },
                          p: 0.25,
                        }}
                      >
                        <DeleteOutlineIcon fontSize="small" color="error" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}

              <Button
                variant="outlined"
                fullWidth
                disabled={uploadingImage}
                startIcon={<CloudUploadOutlinedIcon />}
                onClick={() => imageInputRef.current?.click()}
                sx={{
                  border: "2px dashed #cbd5e1",
                  borderRadius: "16px",
                  p: 2,
                  textTransform: "none",
                  fontWeight: 700,
                  color: "#64748b",
                  "&:hover": { border: "2px dashed #091542", bgcolor: "#f8fafc" },
                }}
              >
                {uploadingImage ? "Uploading..." : "Upload Announcement Image"}
              </Button>
              {uploadingImage && <LinearProgress sx={{ mt: 1.5, borderRadius: 4 }} />}
            </Grid>

            {/* Document Uploads */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" fontWeight={700} color="text.secondary" sx={{ mb: 1 }}>
                Attached Files/PDFs
              </Typography>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                ref={attachmentInputRef}
                style={{ display: "none" }}
                onChange={handleAttachmentSelect}
              />

              {attachmentUrls.length > 0 && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
                  {attachmentUrls.map((url, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        p: 1.5,
                        bgcolor: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                        borderRadius: "12px",
                      }}
                    >
                      <CheckCircleIcon sx={{ color: "#10b981", flexShrink: 0 }} />
                      <Typography variant="body2" fontWeight={700} color="#091542" sx={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }} noWrap>
                        {url.split("/").pop()}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => setAttachmentUrls(prev => prev.filter((_, idx) => idx !== i))}
                        sx={{ color: "#ef4444" }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}

              <Button
                variant="outlined"
                fullWidth
                disabled={uploadingAttachment}
                startIcon={<CloudUploadOutlinedIcon />}
                onClick={() => attachmentInputRef.current?.click()}
                sx={{
                  border: "2px dashed #cbd5e1",
                  borderRadius: "16px",
                  p: 2,
                  textTransform: "none",
                  fontWeight: 700,
                  color: "#64748b",
                  "&:hover": { border: "2px dashed #091542", bgcolor: "#f8fafc" },
                }}
              >
                {uploadingAttachment ? "Uploading..." : "Upload PDF/Document"}
              </Button>
              {uploadingAttachment && <LinearProgress sx={{ mt: 1.5, borderRadius: 4 }} />}
            </Grid>

          </Grid>

          {/* Actions */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/announcements")}
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
                "&:hover": { bgcolor: "#001a35" }
              }}
            >
              Create Announcement
            </Button>
          </Box>

        </Box>
      </form>
    </FormCard>
  );
}
