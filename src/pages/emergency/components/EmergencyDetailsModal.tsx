import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Chip,
  TextField,
  Divider,
  Stack,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
} from "@mui/material";
import {
  EmergencyShare as ActionIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import {
  getEmergencyDetailsApi,
  acknowledgeEmergencyApi,
  resolveEmergencyApi,
  cancelEmergencyApi,
} from "@/apis/emergency";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

interface EmergencyDetailsModalProps {
  open: boolean;
  onClose: () => void;
  alertId: string | null;
  onStatusUpdated: () => void;
}

const severityColors: Record<string, { bg: string; color: string }> = {
  CRITICAL: { bg: "#7f1d1d", color: "#fca5a5" },
  HIGH: { bg: "#fee2e2", color: "#dc2626" },
  MEDIUM: { bg: "#fef3c7", color: "#d97706" },
  LOW: { bg: "#f1f5f9", color: "#475569" },
};

const statusColors: Record<string, { bg: string; color: string }> = {
  OPEN: { bg: "#fef2f2", color: "#dc2626" },
  ACKNOWLEDGED: { bg: "#EAF0F7", color: "#24528C" },
  RESOLVED: { bg: "#f0fdf4", color: "#16a34a" },
  FALSE_ALARM: { bg: "#f8fafc", color: "#64748b" },
  CANCELLED: { bg: "#F3E8FF", color: "#7A4FB5" },
};

export default function EmergencyDetailsModal({
  open,
  onClose,
  alertId,
  onStatusUpdated,
}: EmergencyDetailsModalProps) {
  const { user } = useAuth();
  const [alert, setAlert] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [notes, setNotes] = useState("");
  const [resolutionStatus, setResolutionStatus] = useState<"RESOLVED" | "FALSE_ALARM">("RESOLVED");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");

  const isSecurityOrAdmin =
    user?.role?.toLowerCase() === "admin" ||
    user?.role?.toLowerCase() === "security" ||
    user?.roles?.some((r: string) => ["admin", "security"].includes(r.toLowerCase())) ||
    false;

  const isOwner =
    alert && user && (alert.userId === user.id || alert.user?.id === user.id);

  const fetchDetails = async () => {
    if (!alertId) return;
    setLoading(true);
    try {
      const res = await getEmergencyDetailsApi(alertId);
      setAlert(res?.data || res);
    } catch (error) {
      console.error("Failed to fetch emergency details:", error);
      toast.error("Failed to load emergency details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && alertId) {
      fetchDetails();
      // Clear forms
      setNotes("");
      setResolutionStatus("RESOLVED");
      setResolutionNotes("");
      setCancellationReason("");
    }
  }, [open, alertId]);

  const handleAcknowledge = async () => {
    if (!alertId) return;
    if (!notes.trim()) {
      toast.error("Please provide dispatch notes before acknowledging.");
      return;
    }
    setSubmitting(true);
    try {
      await acknowledgeEmergencyApi(alertId, { notes });
      toast.success("Alert acknowledged successfully.");
      onStatusUpdated();
      fetchDetails();
    } catch (error: any) {
      toast.error(error?.message || "Failed to acknowledge alert.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolve = async () => {
    if (!alertId) return;
    if (!resolutionNotes.trim()) {
      toast.error("Please provide resolution notes.");
      return;
    }
    setSubmitting(true);
    try {
      await resolveEmergencyApi(alertId, {
        status: resolutionStatus,
        resolutionNotes,
      });
      toast.success(`Alert marked as ${resolutionStatus.replace("_", " ")}.`);
      onStatusUpdated();
      fetchDetails();
    } catch (error: any) {
      toast.error(error?.message || "Failed to resolve alert.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!alertId) return;
    if (!cancellationReason.trim()) {
      toast.error("Please provide a cancellation reason.");
      return;
    }
    setSubmitting(true);
    try {
      await cancelEmergencyApi(alertId, { cancellationReason });
      toast.success("Alert cancelled successfully.");
      onStatusUpdated();
      fetchDetails();
    } catch (error: any) {
      toast.error(error?.message || "Failed to cancel alert.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const severity = alert?.severity || "MEDIUM";
  const sevColors = severityColors[severity] || { bg: "#f1f5f9", color: "#475569" };
  const status = alert?.status || "OPEN";
  const statColors = statusColors[status] || { bg: "#f1f5f9", color: "#475569" };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "24px",
          overflow: "hidden",
          border: `1.5px solid ${sevColors.color}`,
        },
      }}
    >
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress color="error" />
        </Box>
      ) : alert ? (
        <>
          <DialogTitle
            sx={{
              bgcolor: sevColors.bg,
              color: sevColors.color,
              p: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px", display: "block", mb: 0.5 }}>
                {severity} Severity Alert
              </Typography>
              <Typography variant="h5" fontWeight="950">
                #{alert.id?.substring(0, 8).toUpperCase()} - {alert.type} Alert
              </Typography>
            </Box>
            <Chip
              label={status.replace("_", " ")}
              sx={{
                bgcolor: statColors.bg,
                color: statColors.color,
                fontWeight: 900,
                fontSize: "0.85rem",
                borderRadius: "8px",
                border: `1px solid ${statColors.color}`,
              }}
            />
          </DialogTitle>

          <DialogContent sx={{ p: 4 }}>
            <Grid container spacing={4}>
              {/* Left Column: Metadata */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1" fontWeight="800" color="#091542" gutterBottom>
                  Reporter Details
                </Typography>
                <Stack spacing={2} sx={{ mt: 2, mb: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "#EAF0F7", color: "#24528C" }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="700">
                        REPORTER NAME
                      </Typography>
                      <Typography variant="body2" fontWeight="800" color="#1e293b">
                        {alert.user?.name || "Unknown User"}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "#F3E8FF", color: "#7A4FB5" }}>
                      <HomeIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="700">
                        FLAT / LOCATION
                      </Typography>
                      <Typography variant="body2" fontWeight="800" color="#1e293b">
                        Flat {alert.flat?.flatNumber || "N/A"} ({alert.flat?.tower?.name || "No Tower"})
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "#f0fdf4", color: "#16a34a" }}>
                      <PhoneIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="700">
                        CONTACT PHONE
                      </Typography>
                      <Typography variant="body2" fontWeight="800" color="#1e293b">
                        {alert.user?.phone || "No phone provided."}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1" fontWeight="800" color="#091542" gutterBottom>
                  Audit History
                </Typography>
                <Stack spacing={1.5} sx={{ mt: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="700" display="block">
                      REPORTED AT
                    </Typography>
                    <Typography variant="body2" fontWeight="700" color="#334155">
                      {new Date(alert.createdAt).toLocaleString()}
                    </Typography>
                  </Box>

                  {alert.acknowledgedAt && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="700" display="block">
                        ACKNOWLEDGED BY
                      </Typography>
                      <Typography variant="body2" fontWeight="700" color="#334155">
                        {alert.acknowledgedAdmin?.name || alert.acknowledgedBy || "Security Desk"} at {new Date(alert.acknowledgedAt).toLocaleString()}
                      </Typography>
                      {alert.notes && (
                        <Typography variant="body2" sx={{ bgcolor: "#f1f5f9", p: 1.5, borderRadius: "8px", mt: 0.5, fontStyle: "italic", fontSize: "0.85rem" }}>
                          Notes: {alert.notes}
                        </Typography>
                      )}
                    </Box>
                  )}

                  {(alert.resolvedAt || alert.status === "FALSE_ALARM") && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="700" display="block">
                        RESOLVED AT
                      </Typography>
                      <Typography variant="body2" fontWeight="700" color="#16a34a">
                        {alert.resolvedBy || "Security"} at {new Date(alert.resolvedAt).toLocaleString()}
                      </Typography>
                      {alert.resolutionNotes && (
                        <Typography variant="body2" sx={{ bgcolor: "#f0fdf4", p: 1.5, borderRadius: "8px", mt: 0.5, fontStyle: "italic", fontSize: "0.85rem", color: "#14532d" }}>
                          Resolution Notes: {alert.resolutionNotes}
                        </Typography>
                      )}
                    </Box>
                  )}

                  {alert.status === "CANCELLED" && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="700" display="block">
                        CANCELLED
                      </Typography>
                      <Typography variant="body2" fontWeight="700" color="#7A4FB5">
                        Cancelled at {alert.cancelledAt ? new Date(alert.cancelledAt).toLocaleString() : "N/A"}
                      </Typography>
                      {alert.cancellationReason && (
                        <Typography variant="body2" sx={{ bgcolor: "#F3E8FF", p: 1.5, borderRadius: "8px", mt: 0.5, fontStyle: "italic", fontSize: "0.85rem", color: "#581c87" }}>
                          Reason: {alert.cancellationReason}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Stack>
              </Grid>

              {/* Right Column: Actions */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1" fontWeight="800" color="#091542" gutterBottom>
                  Emergency Operations Desk
                </Typography>

                {status === "OPEN" && isSecurityOrAdmin && (
                  <Box sx={{ mt: 2, p: 2.5, borderRadius: "16px", border: "1px solid #EAF0F7", bgcolor: "#f8fafc" }}>
                    <Typography variant="subtitle2" fontWeight="800" color="#24528C" sx={{ mb: 1 }}>
                      Acknowledge & Dispatch Response
                    </Typography>
                    <TextField
                      fullWidth
                      label="Dispatch Notes"
                      placeholder="e.g. Guard sent to Flat 402, calling resident..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      multiline
                      rows={2}
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleAcknowledge}
                      disabled={submitting}
                      fullWidth
                      sx={{
                        borderRadius: "10px",
                        bgcolor: "#24528C",
                        fontWeight: 700,
                        textTransform: "none",
                        "&:hover": { bgcolor: "#24528C" },
                      }}
                    >
                      {submitting ? "Acknowledging..." : "Acknowledge Alert"}
                    </Button>
                  </Box>
                )}

                {(status === "OPEN" || status === "ACKNOWLEDGED") && isSecurityOrAdmin && (
                  <Box sx={{ mt: 3, p: 2.5, borderRadius: "16px", border: "1px solid #dcfce7", bgcolor: "#f8fafc" }}>
                    <Typography variant="subtitle2" fontWeight="800" color="#15803d" sx={{ mb: 2 }}>
                      Resolve Emergency
                    </Typography>
                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                      <InputLabel id="resolve-status-label">Resolution Status</InputLabel>
                      <Select
                        labelId="resolve-status-label"
                        value={resolutionStatus}
                        label="Resolution Status"
                        onChange={(e) => setResolutionStatus(e.target.value as any)}
                        sx={{ borderRadius: "8px" }}
                      >
                        <MenuItem value="RESOLVED">Resolved Successfully</MenuItem>
                        <MenuItem value="FALSE_ALARM">False Alarm</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      fullWidth
                      label="Resolution Summary"
                      placeholder="e.g. Verified false alarm by child, or resident assisted."
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      multiline
                      rows={2}
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleResolve}
                      disabled={submitting}
                      fullWidth
                      sx={{
                        borderRadius: "10px",
                        bgcolor: "#16a34a",
                        fontWeight: 700,
                        textTransform: "none",
                        "&:hover": { bgcolor: "#15803d" },
                      }}
                    >
                      {submitting ? "Submitting..." : "Resolve Emergency"}
                    </Button>
                  </Box>
                )}

                {(status === "OPEN" || status === "ACKNOWLEDGED") && (isOwner || isSecurityOrAdmin) && (
                  <Box sx={{ mt: 3, p: 2.5, borderRadius: "16px", border: "1px solid #F3E8FF", bgcolor: "#f8fafc" }}>
                    <Typography variant="subtitle2" fontWeight="800" color="#7A4FB5" sx={{ mb: 1 }}>
                      Cancel Emergency
                    </Typography>
                    <TextField
                      fullWidth
                      label="Cancellation Reason"
                      placeholder="e.g. Pressed panic button accidentally."
                      value={cancellationReason}
                      onChange={(e) => setCancellationReason(e.target.value)}
                      multiline
                      rows={2}
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleCancel}
                      disabled={submitting}
                      fullWidth
                      sx={{
                        borderRadius: "10px",
                        bgcolor: "#7A4FB5",
                        fontWeight: 700,
                        textTransform: "none",
                        "&:hover": { bgcolor: "#6d28d9" },
                      }}
                    >
                      {submitting ? "Cancelling..." : "Cancel Emergency Alert"}
                    </Button>
                  </Box>
                )}

                {status !== "OPEN" && status !== "ACKNOWLEDGED" && (
                  <Box sx={{ mt: 3, p: 4, borderRadius: "16px", bgcolor: "#f8fafc", textAlign: "center", border: "1px dashed #cbd5e1" }}>
                    <ActionIcon sx={{ fontSize: 48, color: "#94a3b8", mb: 1 }} />
                    <Typography variant="body2" fontWeight="800" color="#64748b">
                      Emergency Ticket Closed
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      This emergency alert has been resolved or cancelled. No further actions can be taken.
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 3, bgcolor: "#f8fafc" }}>
            <Button
              onClick={onClose}
              sx={{
                fontWeight: 700,
                color: "#64748b",
                textTransform: "none",
                borderRadius: "8px",
              }}
            >
              Close
            </Button>
          </DialogActions>
        </>
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <Typography variant="body1" color="text.secondary" fontWeight="700">
            Emergency details not found.
          </Typography>
        </Box>
      )}
    </Dialog>
  );
}
