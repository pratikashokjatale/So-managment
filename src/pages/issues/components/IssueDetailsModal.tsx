import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Stack,
  Typography,
  Chip,
  IconButton,
  Box,
  Paper,
  Divider,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Avatar,
} from "@mui/material";
import {
  Close as CloseIcon,
  HourglassEmpty as InProgressIcon,
  AssignmentTurnedIn as ResolvedIcon,
  CheckCircleOutline as CloseStatusIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  AdminPanelSettingsOutlined as AdminIcon,
} from "@mui/icons-material";
import toast from "react-hot-toast";

import { getFileUrl } from "@/utils/file";
import { getUsersApi } from "@/apis/user";
import {
  getIssueDetailsApi,
  updateIssueStatusApi,
  cancelIssueApi,
} from "@/apis/issues";

const categoryLabels: Record<string, string> = {
  MAINTENANCE: "Maintenance",
  HOUSEKEEPING: "Housekeeping",
  SECURITY: "Security",
  FACILITY: "Facility",
  BOOKING: "Booking",
  PAYMENT: "Payment",
  STAFF: "Staff",
  APP: "App",
  OTHER: "Other",
};

const statusColors: Record<string, { bg: string; color: string }> = {
  OPEN: { bg: "#fff7ed", color: "#ea580c" },
  IN_PROGRESS: { bg: "#EAF0F7", color: "#24528C" },
  RESOLVED: { bg: "#f0fdf4", color: "#16a34a" },
  CLOSED: { bg: "#f8fafc", color: "#64748b" },
  REJECTED: { bg: "#fef2f2", color: "#dc2626" },
  CANCELLED: { bg: "#F3E8FF", color: "#7A4FB5" },
};

const priorityColors: Record<string, { bg: string; color: string }> = {
  LOW: { bg: "#f1f5f9", color: "#475569" },
  MEDIUM: { bg: "#fef3c7", color: "#d97706" },
  HIGH: { bg: "#fee2e2", color: "#dc2626" },
  URGENT: { bg: "#7f1d1d", color: "#fca5a5" },
};

interface IssueDetailsModalProps {
  open: boolean;
  onClose: () => void;
  issueId: string | null;
  onStatusUpdated: () => void;
}

export default function IssueDetailsModal({
  open,
  onClose,
  issueId,
  onStatusUpdated,
}: IssueDetailsModalProps) {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState<any[]>([]);

  // Action/form states
  const [actionType, setActionType] = useState<string | null>(null);
  const [assignedTo, setAssignedTo] = useState("");
  const [ticketPriority, setTicketPriority] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");

  const fetchDetails = useCallback(async () => {
    if (!issueId) return;
    setLoading(true);
    try {
      const res = await getIssueDetailsApi(issueId);
      const data = res?.data || res;
      setDetails(data);
      setAssignedTo(data.assignedTo || "");
      setTicketPriority(data.priority || "");
      setAdminNotes(data.adminNotes || "");
      setResolutionNotes(data.resolutionNotes || "");
    } catch (err) {
      toast.error("Failed to load issue details.");
      onClose();
    } finally {
      setLoading(false);
    }
  }, [issueId, onClose]);

  const fetchAdmins = useCallback(async () => {
    try {
      const res = await getUsersApi({ role: "ADMIN", limit: 100 });
      const list = res?.data || res?.items || res || [];
      const arr = Array.isArray(list) ? list : list.data || [];
      setAdmins(arr);
    } catch (err) {
      console.warn("Failed to fetch admin list:", err);
    }
  }, []);

  useEffect(() => {
    if (open && issueId) {
      fetchDetails();
      fetchAdmins();
      setActionType(null);
      setCancellationReason("");
    }
  }, [open, issueId, fetchDetails, fetchAdmins]);

  const handleUpdateStatus = async () => {
    if (!issueId) return;

    try {
      if (actionType === "CANCELLED") {
        if (!cancellationReason.trim()) {
          toast.error("Cancellation reason is required.");
          return;
        }
        await cancelIssueApi(issueId, { reason: cancellationReason });
        toast.success("Issue cancelled successfully.");
      } else {
        const payload: any = { status: actionType };

        if (actionType === "IN_PROGRESS") {
          payload.priority = ticketPriority || undefined;
          payload.assignedTo = assignedTo || undefined;
          payload.adminNotes = adminNotes || undefined;
        } else if (actionType === "RESOLVED") {
          payload.resolutionNotes = resolutionNotes || undefined;
        } else if (actionType === "CLOSED" || actionType === "REJECTED") {
          payload.adminNotes = adminNotes || undefined;
        }

        await updateIssueStatusApi(issueId, payload);
        toast.success(`Status updated to ${actionType}.`);
      }

      setActionType(null);
      onStatusUpdated();
      fetchDetails();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update status.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "24px", p: 1 },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography variant="h6" fontWeight="900" color="#091542">
            Ticket #{details?.id?.substring(0, 8).toUpperCase() || "Details"}
          </Typography>
          {details && (
            <Chip
              label={details.status}
              size="small"
              sx={{
                fontWeight: 900,
                fontSize: "0.75rem",
                borderRadius: "8px",
                bgcolor: statusColors[details.status]?.bg || "#f1f5f9",
                color: statusColors[details.status]?.color || "#475569",
              }}
            />
          )}
        </Stack>
        <IconButton onClick={onClose} sx={{ color: "#94a3b8" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {loading ? (
          <Typography align="center" sx={{ py: 6 }} fontWeight="600" color="text.secondary">
            Fetching ticket details...
          </Typography>
        ) : (
          details && (
            <Grid container spacing={4}>
              {/* Left Column */}
              <Grid size={{ xs: 12, md: 7 }}>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="800" display="block" sx={{ mb: 0.5 }}>
                      TICKET TYPE & CATEGORY
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={details.type}
                        color={details.type === "FEEDBACK" ? "secondary" : "error"}
                        size="small"
                        sx={{ fontWeight: 900, borderRadius: "6px" }}
                      />
                      <Chip
                        label={categoryLabels[details.category] || details.category}
                        size="small"
                        sx={{ fontWeight: 800, borderRadius: "6px", bgcolor: "#f1f5f9" }}
                      />
                      {details.priority && (
                        <Chip
                          label={`PRIORITY: ${details.priority}`}
                          size="small"
                          sx={{
                            fontWeight: 900,
                            borderRadius: "6px",
                            bgcolor: priorityColors[details.priority]?.bg,
                            color: priorityColors[details.priority]?.color,
                          }}
                        />
                      )}
                    </Stack>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="800" display="block" sx={{ mb: 0.5 }}>
                      DESCRIPTION
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{ p: 2, borderRadius: "12px", bgcolor: "#f8fafc", borderColor: "#e2e8f0" }}
                    >
                      <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", color: "#334155", fontWeight: 500 }}>
                        {details.description || "No description provided."}
                      </Typography>
                    </Paper>
                  </Box>

                  {/* Image Attachments */}
                  {details.images && details.images.length > 0 && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="800" display="block" sx={{ mb: 1 }}>
                        ATTACHED IMAGES ({details.images.length})
                      </Typography>
                      <Grid container spacing={1.5}>
                        {details.images.map((img: string, idx: number) => (
                          <Grid size={{ xs: 6, sm: 4 }} key={idx}>
                            <Box
                              component="img"
                              src={getFileUrl(img)}
                              alt={`Attachment ${idx + 1}`}
                              sx={{
                                width: "100%",
                                height: 100,
                                objectFit: "cover",
                                borderRadius: "12px",
                                border: "1px solid #cbd5e1",
                                cursor: "pointer",
                                transition: "opacity 0.2s",
                                "&:hover": { opacity: 0.8 },
                              }}
                              onClick={() => window.open(getFileUrl(img), "_blank")}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}

                  {/* Admin notes history */}
                  {details.adminNotes && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="800" display="block" sx={{ mb: 0.5 }}>
                        ADMIN NOTES
                      </Typography>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: "12px", bgcolor: "#fffbeb", borderColor: "#fde68a" }}>
                        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", color: "#78350f", fontWeight: 600 }}>
                          {details.adminNotes}
                        </Typography>
                      </Paper>
                    </Box>
                  )}

                  {/* Resolution Notes */}
                  {details.resolutionNotes && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="800" display="block" sx={{ mb: 0.5 }}>
                        RESOLUTION DETAILS
                      </Typography>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: "12px", bgcolor: "#f0fdf4", borderColor: "#bbf7d0" }}>
                        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", color: "#166534", fontWeight: 600 }}>
                          {details.resolutionNotes}
                        </Typography>
                      </Paper>
                    </Box>
                  )}

                  {/* Cancellation reason */}
                  {details.cancellationReason && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="800" display="block" sx={{ mb: 0.5 }}>
                        CANCELLATION REASON
                      </Typography>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: "12px", bgcolor: "#F3E8FF", borderColor: "#F3E8FF" }}>
                        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", color: "#581c87", fontWeight: 600 }}>
                          {details.cancellationReason}
                        </Typography>
                      </Paper>
                    </Box>
                  )}
                </Stack>
              </Grid>

              {/* Right Column */}
              <Grid size={{ xs: 12, md: 5 }}>
                <Stack spacing={3.5}>
                  {/* Reporter Info */}
                  <Paper elevation={0} sx={{ p: 2.5, borderRadius: "16px", bgcolor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="800" display="block" sx={{ mb: 1.5 }}>
                      REPORTER RESIDENT
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: "#24528C", width: 44, height: 44 }}>
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="800" color="#091542">
                          {details.user?.name || "Unknown"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight="600" display="block">
                          {details.user?.phone || details.user?.email || "No contact info"}
                        </Typography>
                      </Box>
                    </Stack>
                    <Divider sx={{ my: 1.5 }} />
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ bgcolor: "#f1f5f9", color: "#64748b", width: 32, height: 32 }}>
                        <HomeIcon fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="700" color="#334155">
                          Flat {details.flat?.flatNumber || "N/A"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight="600">
                          Tower: {details.flat?.tower?.name || "N/A"}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>

                  {/* Assigned Admin */}
                  <Paper elevation={0} sx={{ p: 2.5, borderRadius: "16px", bgcolor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="800" display="block" sx={{ mb: 1.5 }}>
                      ASSIGNED OFFICER
                    </Typography>
                    {details.assignedAdmin ? (
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: "#0ea5e9", width: 40, height: 40 }}>
                          <AdminIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="800" color="#091542">
                            {details.assignedAdmin.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" fontWeight="600">
                            {details.assignedAdmin.email || "Admin Officer"}
                          </Typography>
                        </Box>
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary" fontWeight="600">
                        Not assigned to any administrator yet.
                      </Typography>
                    )}
                  </Paper>

                  {/* Dates */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="800" display="block" sx={{ mb: 1 }}>
                      TIMESTAMPS
                    </Typography>
                    <Stack spacing={1}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" color="text.secondary" fontWeight="600">
                          Reported:
                        </Typography>
                        <Typography variant="caption" fontWeight="700" color="#1e293b">
                          {new Date(details.createdAt).toLocaleString()}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" color="text.secondary" fontWeight="600">
                          Last Updated:
                        </Typography>
                        <Typography variant="caption" fontWeight="700" color="#1e293b">
                          {new Date(details.updatedAt).toLocaleString()}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>

                  {/* State Actions */}
                  {details.status !== "CLOSED" && details.status !== "CANCELLED" && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="800" display="block" sx={{ mb: 1.5 }}>
                        TRANSITION STATUS
                      </Typography>

                      {actionType === null ? (
                        <Stack spacing={1.5}>
                          {details.status === "OPEN" && (
                            <Button
                              variant="contained"
                              startIcon={<InProgressIcon />}
                              onClick={() => setActionType("IN_PROGRESS")}
                              sx={{
                                borderRadius: "10px",
                                bgcolor: "#24528C",
                                textTransform: "none",
                                fontWeight: 700,
                                boxShadow: "none",
                                "&:hover": { bgcolor: "#24528C" },
                              }}
                            >
                              Assign & Start Work
                            </Button>
                          )}

                          {details.status === "IN_PROGRESS" && (
                            <Stack spacing={1}>
                              <Button
                                variant="contained"
                                startIcon={<ResolvedIcon />}
                                onClick={() => setActionType("RESOLVED")}
                                sx={{
                                  borderRadius: "10px",
                                  bgcolor: "#16a34a",
                                  textTransform: "none",
                                  fontWeight: 700,
                                  boxShadow: "none",
                                  "&:hover": { bgcolor: "#15803d" },
                                }}
                              >
                                Resolve Issue
                              </Button>
                              <Button
                                variant="outlined"
                                onClick={() => setActionType("IN_PROGRESS")}
                                sx={{
                                  borderRadius: "10px",
                                  textTransform: "none",
                                  fontWeight: 700,
                                }}
                              >
                                Re-assign / Edit Notes
                              </Button>
                            </Stack>
                          )}

                          {details.status === "RESOLVED" && (
                            <Button
                              variant="contained"
                              startIcon={<CloseStatusIcon />}
                              onClick={() => setActionType("CLOSED")}
                              sx={{
                                borderRadius: "10px",
                                bgcolor: "#64748b",
                                textTransform: "none",
                                fontWeight: 700,
                                boxShadow: "none",
                                "&:hover": { bgcolor: "#475569" },
                              }}
                            >
                              Close Ticket
                            </Button>
                          )}

                          <Stack direction="row" spacing={1.5}>
                            {details.status === "OPEN" && (
                              <Button
                                variant="outlined"
                                color="error"
                                fullWidth
                                onClick={() => setActionType("REJECTED")}
                                sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 700 }}
                              >
                                Reject Ticket
                              </Button>
                            )}
                            <Button
                              variant="outlined"
                              color="warning"
                              fullWidth
                              onClick={() => setActionType("CANCELLED")}
                              sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 700 }}
                            >
                              Cancel Ticket
                            </Button>
                          </Stack>
                        </Stack>
                      ) : (
                        <Paper variant="outlined" sx={{ p: 2, borderRadius: "16px", borderColor: "#cbd5e1" }}>
                          <Typography variant="body2" fontWeight="800" sx={{ mb: 2 }}>
                            Move status to: {actionType}
                          </Typography>

                          {actionType === "IN_PROGRESS" && (
                            <Stack spacing={2}>
                              <FormControl fullWidth size="small">
                                <InputLabel id="assign-admin-label">Assign To</InputLabel>
                                <Select
                                  labelId="assign-admin-label"
                                  value={assignedTo}
                                  label="Assign To"
                                  onChange={(e) => setAssignedTo(e.target.value)}
                                >
                                  <MenuItem value="">Unassigned</MenuItem>
                                  {admins.map((ad) => (
                                    <MenuItem key={ad.id} value={ad.id}>
                                      {ad.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>

                              <FormControl fullWidth size="small">
                                <InputLabel id="assign-priority-label">Priority</InputLabel>
                                <Select
                                  labelId="assign-priority-label"
                                  value={ticketPriority}
                                  label="Priority"
                                  onChange={(e) => setTicketPriority(e.target.value)}
                                >
                                  <MenuItem value="LOW">Low</MenuItem>
                                  <MenuItem value="MEDIUM">Medium</MenuItem>
                                  <MenuItem value="HIGH">High</MenuItem>
                                  <MenuItem value="URGENT">Urgent</MenuItem>
                                </Select>
                              </FormControl>

                              <TextField
                                label="Admin Notes"
                                multiline
                                rows={2}
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                size="small"
                                placeholder="Provide dispatch details..."
                                fullWidth
                              />
                            </Stack>
                          )}

                          {actionType === "RESOLVED" && (
                            <TextField
                              label="Resolution Notes"
                              multiline
                              rows={3}
                              value={resolutionNotes}
                              onChange={(e) => setResolutionNotes(e.target.value)}
                              size="small"
                              placeholder="Explain what was fixed..."
                              fullWidth
                              required
                            />
                          )}

                          {(actionType === "CLOSED" || actionType === "REJECTED") && (
                            <TextField
                              label="Closure Notes"
                              multiline
                              rows={2}
                              value={adminNotes}
                              onChange={(e) => setAdminNotes(e.target.value)}
                              size="small"
                              placeholder="Resident verified/Closing comments..."
                              fullWidth
                            />
                          )}

                          {actionType === "CANCELLED" && (
                            <TextField
                              label="Cancellation Reason"
                              multiline
                              rows={2}
                              value={cancellationReason}
                              onChange={(e) => setCancellationReason(e.target.value)}
                              size="small"
                              placeholder="E.g. Duplicate complaint..."
                              fullWidth
                              required
                            />
                          )}

                          <Stack direction="row" spacing={1.5} sx={{ mt: 2.5 }}>
                            <Button
                              size="small"
                              onClick={() => setActionType(null)}
                              sx={{ textTransform: "none", fontWeight: 700 }}
                            >
                              Cancel Action
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              onClick={handleUpdateStatus}
                              sx={{ textTransform: "none", fontWeight: 700, borderRadius: "8px" }}
                            >
                              Submit Update
                            </Button>
                          </Stack>
                        </Paper>
                      )}
                    </Box>
                  )}
                </Stack>
              </Grid>
            </Grid>
          )
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: "8px", textTransform: "none" }}>
          Close Detail Panel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
