import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  TextField,
  IconButton,
  Switch,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Tooltip,
  Alert,
} from "@mui/material";
import {
  Sensors as SensorsIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  WarningAmber as WarningIcon,
  SettingsEthernet as BridgeIcon,
  MeetingRoom as DoorIcon,
  HistoryEdu as AuditIcon,
  Speed as SpeedIcon,
  Lock as LockIcon,
  CheckCircleOutline as SuccessIcon,
  HighlightOff as FailIcon,
  DeleteOutline as DeleteIcon,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import Pagination from "@/components/Pagination";
import { useAuth } from "@/contexts/AuthContext";
import {
  getDahuaBridgeStatusApi,
  getRfidDevicesApi,
  registerRfidDeviceApi,
  getDahuaMappingsApi,
  createDahuaMappingApi,
  updateDahuaMappingApi,
  deleteDahuaMappingApi,
  deleteRfidDeviceApi,
  getDahuaAttemptsApi,
  type DahuaBridgeStatus,
  type DahuaMapping,
  type RfidDevice,
  type AccessAttempt,
  type CreateMappingPayload,
  type RegisterDevicePayload,
  type AccessMode,
  type HardwareResult,
} from "@/apis/dahua";
import { getProjectsApi } from "@/apis/project";
import { getFacilitiesApi } from "@/apis/facility";


const INTER = "'Inter', system-ui, sans-serif";
const SERIF = "'Cormorant Garamond', Georgia, serif";

export default function DahuaBridgeManager() {
  const { user: currentUser } = useAuth();
  const canManageAccess = ["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(currentUser?.role?.toUpperCase?.() || "");

  const [activeTab, setActiveTab] = useState<"mappings" | "devices" | "attempts">("mappings");

  // Status
  const [bridgeStatus, setBridgeStatus] = useState<DahuaBridgeStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);

  // Mappings
  const [mappings, setMappings] = useState<DahuaMapping[]>([]);
  const [allMappings, setAllMappings] = useState<DahuaMapping[]>([]);
  const [loadingMappings, setLoadingMappings] = useState(false);
  const [mappingsPage, setMappingsPage] = useState(1);
  const [mappingsTotal, setMappingsTotal] = useState(0);

  // Devices
  const [devices, setDevices] = useState<RfidDevice[]>([]);
  const [loadingDevices, setLoadingDevices] = useState(false);

  // Delete Mapping states (Dialog A and Dialog B)
  const [mappingTurnOffTarget, setMappingTurnOffTarget] = useState<DahuaMapping | null>(null);
  const [submittingTurnOff, setSubmittingTurnOff] = useState(false);
  const [mappingDeleteTarget, setMappingDeleteTarget] = useState<DahuaMapping | null>(null);
  const [submittingDeleteMapping, setSubmittingDeleteMapping] = useState(false);
  const [deleteMappingError, setDeleteMappingError] = useState<string | null>(null);
  const [countdownSeconds, setCountdownSeconds] = useState<number | null>(null);

  // Delete Device state
  const [deviceDeleteTarget, setDeviceDeleteTarget] = useState<RfidDevice | null>(null);
  const [submittingDeleteDevice, setSubmittingDeleteDevice] = useState(false);

  // Countdown timer effect for 409 retry seconds
  useEffect(() => {
    if (countdownSeconds === null || countdownSeconds <= 0) return;
    const interval = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [countdownSeconds]);

  // Attempts Audit
  const [attempts, setAttempts] = useState<AccessAttempt[]>([]);
  const [loadingAttempts, setLoadingAttempts] = useState(false);
  const [attemptsPage, setAttemptsPage] = useState(1);
  const [attemptsTotal, setAttemptsTotal] = useState(0);
  const [attemptResultFilter, setAttemptResultFilter] = useState<string>("ALL");
  const [anomalyOnly, setAnomalyOnly] = useState(false);

  // Projects & Facilities
  const [projects, setProjects] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<any[]>([]);

  // Modals
  const [openCreateMapping, setOpenCreateMapping] = useState(false);
  const [submittingMapping, setSubmittingMapping] = useState(false);
  const [mappingForm, setMappingForm] = useState<CreateMappingPayload>({
    deviceId: "",
    cgiDeviceId: "",
    doorIndex: 0,
    accessMode: "SUBSCRIPTION",
    bookingGraceMinutes: 15,
    enabled: true,
  });

  const [openRegisterDevice, setOpenRegisterDevice] = useState(false);
  const [submittingDevice, setSubmittingDevice] = useState(false);
  const [deviceForm, setDeviceForm] = useState<RegisterDevicePayload>({
    name: "",
    provider: "DAHUA",
    serialNumber: "",
    projectId: "",
    facilityId: "",
    purpose: "FACILITY_ACCESS",
    direction: "ENTRY",
    accessZone: "",
    status: "ACTIVE",
  });

  // Load initial meta
  useEffect(() => {
    fetchBridgeStatus();
    fetchProjectsAndFacilities();
    fetchDevices();
    fetchAllMappings();
  }, []);

  useEffect(() => {
    if (activeTab === "mappings") {
      fetchMappings();
      fetchDevices();
      fetchAllMappings();
    } else if (activeTab === "devices") {
      fetchDevices();
      fetchAllMappings();
    } else if (activeTab === "attempts") {
      fetchAttempts();
    }
  }, [activeTab, mappingsPage, attemptsPage, attemptResultFilter, anomalyOnly]);


  const fetchBridgeStatus = async () => {
    setLoadingStatus(true);
    try {
      const data = await getDahuaBridgeStatusApi();
      setBridgeStatus(data);
    } catch (err: any) {
      console.warn("Dahua status endpoint warning/fallback:", err?.message);
      // Fallback display matching backend documentation
      setBridgeStatus({
        enabled: false,
        bridgeSecretConfigured: true,
        decisionTtlSeconds: 5,
        scanMaxAgeSeconds: 30,
        timeZone: "Asia/Kolkata",
        controllerCredentialsStoredInBackend: false,
      });
    } finally {
      setLoadingStatus(false);
    }
  };

  const fetchProjectsAndFacilities = async () => {
    try {
      const [projRes, facRes] = await Promise.allSettled([
        getProjectsApi({ limit: 50 }),
        getFacilitiesApi({ limit: 50 }),
      ]);
      if (projRes.status === "fulfilled") {
        const raw = projRes.value;
        const pList =
          (Array.isArray(raw) && raw) ||
          (Array.isArray(raw?.data?.data) && raw.data.data) ||
          (Array.isArray(raw?.data?.projects) && raw.data.projects) ||
          (Array.isArray(raw?.data?.items) && raw.data.items) ||
          (Array.isArray(raw?.projects) && raw.projects) ||
          (Array.isArray(raw?.items) && raw.items) ||
          (Array.isArray(raw?.data) && raw.data) ||
          [];
        setProjects(Array.isArray(pList) ? pList : []);
        if (Array.isArray(pList) && pList.length > 0 && !deviceForm.projectId) {
          setDeviceForm((prev) => ({ ...prev, projectId: pList[0].id || pList[0]._id }));
        }
      } else {
        setProjects([]);
      }
      if (facRes.status === "fulfilled") {
        const raw = facRes.value;
        const fList =
          (Array.isArray(raw) && raw) ||
          (Array.isArray(raw?.data?.data) && raw.data.data) ||
          (Array.isArray(raw?.data?.facilities) && raw.data.facilities) ||
          (Array.isArray(raw?.data?.items) && raw.data.items) ||
          (Array.isArray(raw?.facilities) && raw.facilities) ||
          (Array.isArray(raw?.items) && raw.items) ||
          (Array.isArray(raw?.data) && raw.data) ||
          [];
        setFacilities(Array.isArray(fList) ? fList : []);
      } else {
        setFacilities([]);
      }
    } catch (e) {
      console.warn("Failed to load projects/facilities for Dahua setup", e);
      setProjects([]);
      setFacilities([]);
    }
  };

  const fetchMappings = async () => {
    setLoadingMappings(true);
    try {
      const res = await getDahuaMappingsApi({ page: mappingsPage, limit: 10 });
      setMappings(res.items);
      setMappingsTotal(res.total);
    } catch (err: any) {
      console.warn("Mappings load warning:", err?.message);
    } finally {
      setLoadingMappings(false);
    }
  };

  const fetchDevices = async () => {
    setLoadingDevices(true);
    try {
      let list = await getRfidDevicesApi({ provider: "DAHUA" });
      if (!list || list.length === 0) {
        list = await getRfidDevicesApi();
      }
      setDevices(list || []);
      if (list && list.length > 0 && !mappingForm.deviceId) {
        setMappingForm((prev) => ({ ...prev, deviceId: list[0].id }));
      }
    } catch (err: any) {
      console.warn("Devices load warning:", err?.message);
    } finally {
      setLoadingDevices(false);
    }
  };

  const fetchAttempts = async () => {
    setLoadingAttempts(true);
    try {
      const params: any = { page: attemptsPage, limit: 15 };
      if (attemptResultFilter !== "ALL") params.hardwareResult = attemptResultFilter;
      if (anomalyOnly) params.hardwareAnomaly = true;
      const res = await getDahuaAttemptsApi(params);
      setAttempts(res.items);
      setAttemptsTotal(res.total);
    } catch (err: any) {
      console.warn("Attempts load warning:", err?.message);
    } finally {
      setLoadingAttempts(false);
    }
  };

  const fetchAllMappings = async () => {
    try {
      const res = await getDahuaMappingsApi({ page: 1, limit: 100 });
      setAllMappings(res.items || []);
    } catch (e) {
      console.warn("Failed to load all mappings for conflict checking", e);
    }
  };

  const handleToggleMapping = async (mapping: DahuaMapping) => {
    const nextState = !mapping.enabled;
    try {
      await updateDahuaMappingApi(mapping.id, { enabled: nextState });
      toast.success("Saved. The door updates within about a minute.");
      setMappings((prev) =>
        prev.map((m) => (m.id === mapping.id ? { ...m, enabled: nextState } : m))
      );
      setAllMappings((prev) =>
        prev.map((m) => (m.id === mapping.id ? { ...m, enabled: nextState } : m))
      );
    } catch (err: any) {
      toast.error(err?.message || "Failed to update mapping state");
    }
  };

  const handleOpenDeleteMapping = (mapping: DahuaMapping) => {
    if (!canManageAccess) return;
    setDeleteMappingError(null);
    setCountdownSeconds(null);
    if (mapping.enabled) {
      // Row toggle is ON -> Show Dialog A
      setMappingTurnOffTarget(mapping);
    } else {
      // Row toggle is OFF -> Show Dialog B
      setMappingDeleteTarget(mapping);
    }
  };

  const handleConfirmTurnOff = async () => {
    if (!mappingTurnOffTarget) return;
    setSubmittingTurnOff(true);
    try {
      await updateDahuaMappingApi(mappingTurnOffTarget.id, { enabled: false });
      toast.success("Saved. The door updates within about a minute.");
      toast("Door turned off. You can delete it after 2 minutes.", { icon: "ℹ️" });
      const targetId = mappingTurnOffTarget.id;
      setMappingTurnOffTarget(null);
      setMappings((prev) =>
        prev.map((m) => (m.id === targetId ? { ...m, enabled: false } : m))
      );
      setAllMappings((prev) =>
        prev.map((m) => (m.id === targetId ? { ...m, enabled: false } : m))
      );
    } catch (err: any) {
      toast.error(err?.message || "Failed to turn off door");
    } finally {
      setSubmittingTurnOff(false);
    }
  };

  const handleConfirmDeleteMapping = async () => {
    if (!mappingDeleteTarget) return;
    setSubmittingDeleteMapping(true);
    setDeleteMappingError(null);
    try {
      await deleteDahuaMappingApi(mappingDeleteTarget.id);
      toast.success("Door mapping deleted");
      const deletedId = mappingDeleteTarget.id;
      setMappingDeleteTarget(null);
      setMappings((prev) => prev.filter((m) => m.id !== deletedId));
      setAllMappings((prev) => prev.filter((m) => m.id !== deletedId));
      setMappingsTotal((prev) => Math.max(0, prev - 1));
      fetchDevices(); // update mapped device states
    } catch (err: any) {
      const msg = err?.message || "Failed to delete door mapping";
      const status = err?.status || err?.response?.status;
      if (status === 404) {
        toast.error(msg);
        setMappingDeleteTarget(null);
        fetchMappings();
        fetchAllMappings();
      } else if (status === 409) {
        setDeleteMappingError(msg);
        toast.error(msg);
        // If row is required to be disabled first
        if (msg.toLowerCase().includes("disable this door mapping first")) {
          const currentTarget = mappingDeleteTarget;
          setMappingDeleteTarget(null);
          setMappingTurnOffTarget(currentTarget);
          return;
        }
        // Check for seconds in message: "Try again in 45 seconds"
        const secMatch = msg.match(/in\s+(\d+)\s+seconds/i);
        if (secMatch && secMatch[1]) {
          setCountdownSeconds(parseInt(secMatch[1], 10));
        }
      } else {
        toast.error(msg);
        setMappingDeleteTarget(null);
      }
    } finally {
      setSubmittingDeleteMapping(false);
    }
  };

  const handleConfirmDeleteDevice = async () => {
    if (!deviceDeleteTarget) return;
    setSubmittingDeleteDevice(true);
    try {
      await deleteRfidDeviceApi(deviceDeleteTarget.id);
      toast.success("RFID device deleted");
      const deletedId = deviceDeleteTarget.id;
      setDeviceDeleteTarget(null);
      setDevices((prev) => prev.filter((d) => d.id !== deletedId));
    } catch (err: any) {
      const msg = err?.message || "Failed to delete reader";
      const status = err?.status || err?.response?.status;
      if (status === 404) {
        toast.error(msg);
        setDeviceDeleteTarget(null);
        fetchDevices();
      } else if (status === 409) {
        toast.error(msg);
        setDeviceDeleteTarget(null);
        setActiveTab("mappings");
      } else {
        toast.error(msg);
        setDeviceDeleteTarget(null);
      }
    } finally {
      setSubmittingDeleteDevice(false);
    }
  };


  const handleCreateMappingSubmit = async () => {
    if (!mappingForm.deviceId || !mappingForm.cgiDeviceId) {
      toast.error("Please select a device and enter the CGI Device ID");
      return;
    }
    setSubmittingMapping(true);
    try {
      await createDahuaMappingApi(mappingForm);
      toast.success("CGI Door Mapping registered successfully!");
      setOpenCreateMapping(false);
      setMappingForm({
        deviceId: "",
        cgiDeviceId: "",
        doorIndex: 0,
        accessMode: "AUTO",
        bookingGraceMinutes: 15,
        enabled: true,
      });
      fetchMappings();
    } catch (err: any) {
      toast.error(err?.message || "Failed to create door mapping");
    } finally {
      setSubmittingMapping(false);
    }
  };

  const handleRegisterDeviceSubmit = async () => {
    if (!deviceForm.name || !deviceForm.serialNumber || !deviceForm.projectId) {
      toast.error("Name, Serial Number, and Project are required");
      return;
    }
    setSubmittingDevice(true);
    try {
      await registerRfidDeviceApi(deviceForm);
      toast.success("Dahua physical device registered in system!");
      setOpenRegisterDevice(false);
      fetchDevices();
    } catch (err: any) {
      toast.error(err?.message || "Failed to register physical device");
    } finally {
      setSubmittingDevice(false);
    }
  };

  return (
    <Box sx={{ mt: 0, display: "flex", flexDirection: "column", gap: 3, fontFamily: INTER }}>
      {/* ── Top Status Banner ── */}
      <Paper
        elevation={0}
        sx={{
          p: 2.8,
          borderRadius: "16px",
          bgcolor: "#ffffff",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, minWidth: 280, flex: "1 1 auto" }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: "14px",
              bgcolor: bridgeStatus?.enabled ? "#f0fdf4" : "#fffbeb",
              color: bridgeStatus?.enabled ? "#16a34a" : "#d97706",
              border: `1px solid ${bridgeStatus?.enabled ? "#bbf7d0" : "#fde68a"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <BridgeIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5, flexWrap: "wrap" }}>
              <Typography sx={{ fontWeight: 700, color: "#1e293b", fontSize: "1.15rem", letterSpacing: "-0.2px" }}>
                Dahua RFID Controller Bridge
              </Typography>
              <Chip
                label={bridgeStatus?.enabled ? "BRIDGE ACTIVE" : "STANDBY / DISABLED"}
                size="small"
                sx={{
                  bgcolor: bridgeStatus?.enabled ? "#dcfce7" : "#fef3c7",
                  color: bridgeStatus?.enabled ? "#15803d" : "#b45309",
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  letterSpacing: "0.5px",
                  borderRadius: "6px",
                  height: 22,
                }}
              />
            </Box>
            <Typography sx={{ color: "#64748b", fontSize: "0.85rem", lineHeight: 1.5, maxWidth: 620 }}>
              {bridgeStatus?.enabled
                ? "Offline sync: the reader enforces Marbella's card list and expiry dates. Changes reach the door within about a minute."
                : "Standby: Secret is configured. Keep disabled until CGI mappings are set, then set DAHUA_BRIDGE_ENABLED=true in backend env."}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 3.5, flexWrap: "wrap", ml: "auto" }}>
          <Box sx={{ textAlign: "right" }}>
            <Typography sx={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", mb: 0.3 }}>
              TTL / Max Age
            </Typography>
            <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "#1e293b" }}>
              {bridgeStatus?.decisionTtlSeconds || 5}s / {bridgeStatus?.scanMaxAgeSeconds || 30}s
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "#64748b" }}>
              {bridgeStatus?.timeZone || "Asia/Kolkata"}
            </Typography>
          </Box>

          <Box sx={{ width: "1px", height: 38, bgcolor: "#e2e8f0" }} />

          <Box sx={{ textAlign: "right" }}>
            <Typography sx={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", mb: 0.3 }}>
              Bridge Secret
            </Typography>
            <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: bridgeStatus?.bridgeSecretConfigured ? "#16a34a" : "#ef4444" }}>
              {bridgeStatus?.bridgeSecretConfigured ? "Configured in Backend" : "Not Set"}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "#64748b" }}>
              Controller credentials not stored
            </Typography>
          </Box>

          <Tooltip title="Checks backend environment config only (does not verify controller hardware online status)">
            <IconButton
              size="medium"
              onClick={fetchBridgeStatus}
              sx={{
                bgcolor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                "&:hover": { bgcolor: "#f1f5f9" },
              }}
            >
              <RefreshIcon fontSize="small" sx={{ color: "#475569" }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* ── Sub Navigation Tabs & Actions ── */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2, pt: 1 }}>
        <Box sx={{ display: "flex", gap: 1, bgcolor: "#f1f5f9", p: "4px", borderRadius: "12px" }}>
          {[
            { key: "mappings", label: "CGI Door Mappings", icon: <DoorIcon sx={{ fontSize: 18 }} /> },
            { key: "devices", label: "Registered Readers", icon: <SensorsIcon sx={{ fontSize: 18 }} /> },
            { key: "attempts", label: "Access Attempts (Audit)", icon: <AuditIcon sx={{ fontSize: 18 }} /> },
          ].map((tab) => {
            const isSelected = activeTab === tab.key;
            return (
              <Button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                startIcon={tab.icon}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  px: 2,
                  py: 0.8,
                  borderRadius: "8px",
                  color: isSelected ? "#24528C" : "#64748b",
                  bgcolor: isSelected ? "#ffffff" : "transparent",
                  boxShadow: isSelected ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                  "&:hover": { bgcolor: isSelected ? "#ffffff" : "rgba(255,255,255,0.5)" },
                }}
              >
                {tab.label}
              </Button>
            );
          })}
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, ml: "auto" }}>
          {activeTab === "mappings" && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                fetchDevices();
                setOpenCreateMapping(true);
              }}
              sx={{
                bgcolor: "#24528C",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "10px",
                px: 2.2,
                py: 0.9,
                fontSize: "0.85rem",
                boxShadow: "0 2px 4px rgba(36, 82, 140, 0.2)",
                "&:hover": { bgcolor: "#1d4373" },
              }}
            >
              Add Door Mapping
            </Button>
          )}
          {activeTab === "devices" && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenRegisterDevice(true)}
              sx={{
                bgcolor: "#24528C",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "10px",
                px: 2.2,
                py: 0.9,
                fontSize: "0.85rem",
                boxShadow: "0 2px 4px rgba(36, 82, 140, 0.2)",
                "&:hover": { bgcolor: "#1d4373" },
              }}
            >
              Register Physical Controller
            </Button>
          )}
        </Box>
      </Box>

      {/* ── TAB 1: CGI Door Mappings ── */}
      {activeTab === "mappings" && (
        <Paper elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: "14px", overflow: "hidden" }}>
          {loadingMappings ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress size={30} />
            </Box>
          ) : mappings.length === 0 ? (
            <Box sx={{ p: 5, textAlign: "center" }}>
              <DoorIcon sx={{ fontSize: 44, color: "#cbd5e1", mb: 1.5 }} />
              <Typography sx={{ fontWeight: 600, color: "#334155", fontSize: "1rem" }}>
                No Dahua CGI Door Mappings Configured
              </Typography>
              <Typography sx={{ color: "#64748b", fontSize: "0.85rem", maxWidth: 460, mx: "auto", mt: 0.5, mb: 2 }}>
                Connect your physical Dahua controller's CGI registration ID and door indices (0-based) to your facility readers to allow real-time tap authorization.
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setOpenCreateMapping(true)}
                sx={{ textTransform: "none", borderRadius: "8px", color: "#24528C", borderColor: "#24528C" }}
              >
                Create First Door Mapping
              </Button>
            </Box>
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>
                    <th style={{ padding: "14px 20px", color: "#64748b", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>CGI Registration ID</th>
                    <th style={{ padding: "14px 20px", color: "#64748b", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Door Index</th>
                    <th style={{ padding: "14px 20px", color: "#64748b", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Mapped Reader</th>
                    <th style={{ padding: "14px 20px", color: "#64748b", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Policy / Mode</th>
                    <th style={{ padding: "14px 20px", color: "#64748b", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Grace Window</th>
                    <th style={{ padding: "14px 20px", color: "#64748b", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Status</th>
                    <th style={{ padding: "14px 20px", color: "#64748b", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "center" }}>Toggle</th>
                    {canManageAccess && (
                      <th style={{ padding: "14px 20px", color: "#64748b", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "right" }}>Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {mappings.map((m) => (
                    <tr key={m.id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.15s" }}>
                      <td style={{ padding: "16px 20px", fontWeight: 600, color: "#1e293b" }}>
                        <code style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: "6px", fontSize: "0.85rem", color: "#1e293b", border: "1px solid #e2e8f0" }}>
                          {m.cgiDeviceId}
                        </code>
                      </td>
                      <td style={{ padding: "16px 20px", color: "#475569", fontWeight: 500 }}>
                        <Chip
                          label={`Door ${m.doorIndex}`}
                          size="small"
                          sx={{ bgcolor: "#f8fafc", border: "1px solid #e2e8f0", fontWeight: 600, fontSize: "0.75rem" }}
                        />
                      </td>
                      <td style={{ padding: "16px 20px", color: "#334155" }}>
                        <Typography sx={{ fontSize: "0.9rem", fontWeight: 600, color: "#1e293b" }}>
                          {m.device?.name || m.deviceId}
                        </Typography>
                        <Typography sx={{ fontSize: "0.75rem", color: "#94a3b8", mt: 0.2 }}>
                          {m.device?.facility?.name || m.device?.accessZone || "Zone"} · {m.device?.direction || "ENTRY"}
                        </Typography>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <Chip
                          label={m.accessMode}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: "0.7rem",
                            borderRadius: "6px",
                            bgcolor: m.accessMode === "AUTO" ? "#ecfdf5" : m.accessMode === "SUBSCRIPTION" ? "#eff6ff" : "#fefce8",
                            color: m.accessMode === "AUTO" ? "#059669" : m.accessMode === "SUBSCRIPTION" ? "#2563eb" : "#d97706",
                            border: `1px solid ${m.accessMode === "AUTO" ? "#a7f3d0" : m.accessMode === "SUBSCRIPTION" ? "#bfdbfe" : "#fde68a"}`,
                          }}
                        />
                      </td>
                      <td style={{ padding: "16px 20px", color: "#475569", fontWeight: 500, fontSize: "0.85rem" }}>
                        ±{m.bookingGraceMinutes ?? 15} mins
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <Chip
                          label={m.enabled ? "ACTIVE" : "PAUSED"}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: "0.68rem",
                            borderRadius: "6px",
                            bgcolor: m.enabled ? "#dcfce7" : "#fee2e2",
                            color: m.enabled ? "#15803d" : "#b91c1c",
                          }}
                        />
                      </td>
                      <td style={{ padding: "16px 20px", textAlign: "center" }}>
                        <Switch
                          checked={Boolean(m.enabled)}
                          onChange={() => handleToggleMapping(m)}
                          size="small"
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": { color: "#24528C" },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#24528C" },
                          }}
                        />
                      </td>
                      {canManageAccess && (
                        <td style={{ padding: "16px 20px", textAlign: "right" }}>
                          <Tooltip title="Delete door mapping">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDeleteMapping(m)}
                              sx={{
                                color: "#94a3b8",
                                "&:hover": { color: "#ef4444", bgcolor: "#fef2f2" },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {mappingsTotal > 10 && (
                <Box sx={{ p: 2 }}>
                  <Pagination
                    page={mappingsPage}
                    totalResults={mappingsTotal}
                    rowsPerPage={10}
                    onPageChange={(_, p) => setMappingsPage(p)}
                  />
                </Box>
              )}
            </Box>
          )}
        </Paper>
      )}

      {/* ── TAB 2: Registered Physical Hardware ── */}
      {activeTab === "devices" && (
        <Paper elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: "14px", overflow: "hidden" }}>
          {loadingDevices ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress size={30} />
            </Box>
          ) : devices.length === 0 ? (
            <Box sx={{ p: 5, textAlign: "center" }}>
              <SensorsIcon sx={{ fontSize: 44, color: "#cbd5e1", mb: 1.5 }} />
              <Typography sx={{ fontWeight: 600, color: "#334155", fontSize: "1rem" }}>
                No Dahua Hardware Devices Registered
              </Typography>
              <Typography sx={{ color: "#64748b", fontSize: "0.85rem", maxWidth: 460, mx: "auto", mt: 0.5, mb: 2 }}>
                Physical controller terminals (ASI6213S-PW) must be registered in the RFID Device Registry before they can be mapped to doors.
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setOpenRegisterDevice(true)}
                sx={{ textTransform: "none", borderRadius: "8px", color: "#24528C", borderColor: "#24528C" }}
              >
                Register First Controller
              </Button>
            </Box>
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>
                    <th style={{ padding: "14px 20px", color: "#64748b", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Reader Name</th>
                    <th style={{ padding: "14px 20px", color: "#64748b", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Serial Number</th>
                    <th style={{ padding: "14px 20px", color: "#64748b", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Purpose</th>
                    <th style={{ padding: "14px 20px", color: "#64748b", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Direction & Zone</th>
                    <th style={{ padding: "14px 20px", color: "#64748b", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Facility / Project</th>
                    <th style={{ padding: "14px 20px", color: "#64748b", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Status</th>
                    {canManageAccess && (
                      <th style={{ padding: "14px 20px", color: "#64748b", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "right" }}>Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {devices.map((d) => {
                    const isMapped = allMappings.some((m) => m.deviceId === d.id);
                    return (
                      <tr key={d.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "16px 20px", fontWeight: 600, color: "#1e293b" }}>
                          <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: "#1e293b" }}>
                            {d.name}
                          </Typography>
                          <Typography sx={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                            DAHUA ASI6213S-PW
                          </Typography>
                        </td>
                        <td style={{ padding: "16px 20px", color: "#475569" }}>
                          <code style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: "6px", fontSize: "0.85rem", color: "#1e293b", border: "1px solid #e2e8f0" }}>
                            {d.serialNumber || d.id.slice(0, 8)}
                          </code>
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          <Chip
                            label={d.purpose}
                            size="small"
                            sx={{ fontSize: "0.7rem", fontWeight: 600, bgcolor: "#f1f5f9", color: "#334155", borderRadius: "6px" }}
                          />
                        </td>
                        <td style={{ padding: "16px 20px", color: "#475569", fontSize: "0.85rem", fontWeight: 500 }}>
                          {d.direction} · <strong>{d.accessZone}</strong>
                        </td>
                        <td style={{ padding: "16px 20px", color: "#334155" }}>
                          <Typography sx={{ fontSize: "0.85rem", fontWeight: 600 }}>
                            {d.facility?.name || "Society Gate"}
                          </Typography>
                          <Typography sx={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                            {d.project?.name || "Marbella Grand"}
                          </Typography>
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          <Chip
                            label={d.status}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              fontSize: "0.68rem",
                              borderRadius: "6px",
                              bgcolor: d.status === "ACTIVE" ? "#dcfce7" : "#fee2e2",
                              color: d.status === "ACTIVE" ? "#15803d" : "#b91c1c",
                            }}
                          />
                        </td>
                        {canManageAccess && (
                          <td style={{ padding: "16px 20px", textAlign: "right" }}>
                            {isMapped ? (
                              <Tooltip title="Delete this reader's door mapping first">
                                <span>
                                  <IconButton size="small" disabled sx={{ color: "#cbd5e1" }}>
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Delete reader">
                                <IconButton
                                  size="small"
                                  onClick={() => setDeviceDeleteTarget(d)}
                                  sx={{
                                    color: "#94a3b8",
                                    "&:hover": { color: "#ef4444", bgcolor: "#fef2f2" },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Box>
          )}
        </Paper>
      )}

      {/* ── TAB 3: Audit & Hardware Telemetry ── */}
      {activeTab === "attempts" && (
        <Paper elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: "14px", p: 2 }}>
          {/* Audit Filters */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center", mb: 2.5, px: 1 }}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Hardware Outcome</InputLabel>
              <Select
                value={attemptResultFilter}
                label="Hardware Outcome"
                onChange={(e) => {
                  setAttemptResultFilter(e.target.value);
                  setAttemptsPage(1);
                }}
              >
                <MenuItem value="ALL">All Outcomes</MenuItem>
                <MenuItem value="OPENED">OPENED (Door unlocked)</MenuItem>
                <MenuItem value="DENIED">DENIED (Lock held closed)</MenuItem>
                <MenuItem value="FAILED">FAILED (Command failed)</MenuItem>
                <MenuItem value="TIMEOUT">TIMEOUT (Late / close)</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant={anomalyOnly ? "contained" : "outlined"}
              color="error"
              size="small"
              onClick={() => {
                setAnomalyOnly(!anomalyOnly);
                setAttemptsPage(1);
              }}
              startIcon={<WarningIcon />}
              sx={{ textTransform: "none", borderRadius: "8px", fontWeight: 600 }}
            >
              Anomalies Only
            </Button>

            <IconButton size="small" onClick={fetchAttempts} sx={{ ml: "auto", border: "1px solid #e2e8f0" }}>
              <RefreshIcon fontSize="small" sx={{ color: "#64748b" }} />
            </IconButton>
          </Box>

          {loadingAttempts ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress size={30} />
            </Box>
          ) : attempts.length === 0 ? (
            <Box sx={{ p: 5, textAlign: "center", color: "#64748b" }}>
              <AuditIcon sx={{ fontSize: 40, color: "#cbd5e1", mb: 1 }} />
              <Typography sx={{ fontWeight: 600 }}>No live Dahua access attempts recorded yet</Typography>
              <Typography sx={{ fontSize: "0.8rem", mt: 0.5 }}>
                Tap an RFID card on an ASI6213S-PW controller connected via the Bridge service to see verified attempts.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>
                    <th style={{ padding: "14px 18px", color: "#64748b", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Tap Time</th>
                    <th style={{ padding: "14px 18px", color: "#64748b", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Card UID</th>
                    <th style={{ padding: "14px 18px", color: "#64748b", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>User / Resident</th>
                    <th style={{ padding: "14px 18px", color: "#64748b", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Decision</th>
                    <th style={{ padding: "14px 18px", color: "#64748b", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Reason</th>
                    <th style={{ padding: "14px 18px", color: "#64748b", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Hardware Outcome</th>
                    <th style={{ padding: "14px 18px", color: "#64748b", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Source</th>
                    <th style={{ padding: "14px 18px", color: "#64748b", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Correlation</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((att) => {
                    // Reason label dictionary
                    const reasonMap: Record<string, string> = {
                      ACTIVE_SUBSCRIPTION: "Active subscription",
                      NO_ACTIVE_SUBSCRIPTION: "No active paid subscription",
                      CARD_BLOCKED: "Card blocked",
                      CARD_INACTIVE: "Card inactive",
                      CARD_EXPIRED: "Card expired",
                      CARD_NOT_FOUND: "Card not registered in Marbella",
                      PROJECT_NOT_ALLOWED: "Resident belongs to another project",
                      USER_NOT_ACTIVE: "User inactive",
                      GUEST_EXPIRED: "Stay ended",
                      TENANT_EXPIRED: "Stay ended",
                      FACILITY_NOT_AVAILABLE: "Facility closed or in maintenance",
                      DAHUA_MAPPING_DISABLED: "Door turned off",
                      STAFF_ACCESS_ALLOWED: "Staff",
                    };
                    const displayReason = reasonMap[att.reason] || att.reason;

                    // Error code label
                    const errorCodeMap: Record<string, string> = {
                      "0": "Opened",
                      "16": "Card not on the reader",
                      "18": "No permission for this door",
                      "20": "Outside validity dates (expired)",
                      "96": "Remote verification is switched on",
                    };
                    const rawCode = att.hardwareErrorCode ?? att.errorCode;
                    const displayErrorCode = rawCode !== null && rawCode !== undefined && errorCodeMap[String(rawCode)]
                      ? errorCodeMap[String(rawCode)]
                      : null;

                    // Source label
                    const isDeviceLocal = att.decision?.source === "DEVICE_LOCAL" || (att as any).source === "DEVICE_LOCAL";
                    const displaySource = isDeviceLocal ? "Reader decision" : "Live check";

                    // Correlation label: local:rec-178-1792857212 -> Reader record #178
                    let correlationDisplay = att.transmissionUuid ? `${att.transmissionUuid.slice(0, 8)}...` : "—";
                    if (att.transmissionUuid) {
                      const match = att.transmissionUuid.match(/local:rec-(\d+)/i);
                      if (match && match[1]) {
                        correlationDisplay = `Reader record #${match[1]}`;
                      }
                    }

                    // Asia/Kolkata tap time
                    let formattedTapTime = "—";
                    if (att.scannedAt) {
                      try {
                        formattedTapTime = new Intl.DateTimeFormat("en-IN", {
                          timeZone: "Asia/Kolkata",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          day: "2-digit",
                          month: "short",
                        }).format(new Date(att.scannedAt));
                      } catch (e) {
                        formattedTapTime = new Date(att.scannedAt).toLocaleTimeString();
                      }
                    }

                    return (
                      <tr key={att.id || att.transmissionUuid} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "14px 18px", color: "#475569", whiteSpace: "nowrap", fontWeight: 500, fontSize: "0.8rem" }}>
                          {formattedTapTime}
                        </td>
                        <td style={{ padding: "14px 18px", fontWeight: 600, color: "#1e293b" }}>
                          <code style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: "6px", fontSize: "0.85rem", color: "#1e293b", border: "1px solid #e2e8f0" }}>
                            {att.cardUid}
                          </code>
                        </td>
                        <td style={{ padding: "14px 18px", color: "#1e293b" }}>
                          <Typography sx={{ fontWeight: 600, fontSize: "0.88rem", color: "#1e293b" }}>
                            {att.userName || att.user?.name || "Unknown card"}
                          </Typography>
                          {att.vendorUserId && (
                            <Typography sx={{ fontSize: "0.72rem", color: "#94a3b8", mt: 0.2 }}>
                              controller ID {att.vendorUserId}
                            </Typography>
                          )}
                        </td>
                        <td style={{ padding: "14px 18px" }}>
                          <Chip
                            icon={att.accessGranted ? <SuccessIcon sx={{ fontSize: 14 }} /> : <FailIcon sx={{ fontSize: 14 }} />}
                            label={att.accessGranted ? "GRANTED" : "DENIED"}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              fontSize: "0.68rem",
                              borderRadius: "6px",
                              bgcolor: att.accessGranted ? "#dcfce7" : "#fee2e2",
                              color: att.accessGranted ? "#15803d" : "#b91c1c",
                            }}
                          />
                        </td>
                        <td style={{ padding: "14px 18px", color: "#475569", fontSize: "0.82rem", fontWeight: 500 }}>
                          {displayReason}
                        </td>
                        <td style={{ padding: "14px 18px" }}>
                          {att.hardwareAnomaly ? (
                            <Tooltip
                              title="The door opened although Marbella refuses this card. Usually the card was also added by hand on the reader under a person Marbella does not manage. Remove it in the reader's Person Management."
                              arrow
                            >
                              <Chip
                                icon={<WarningIcon sx={{ fontSize: 14 }} />}
                                label="ANOMALY (UNAUTHORIZED OPEN)"
                                size="small"
                                color="error"
                                sx={{ fontWeight: 700, fontSize: "0.68rem", borderRadius: "6px", cursor: "help" }}
                              />
                            </Tooltip>
                          ) : att.hardwareResult ? (
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.3, alignItems: "flex-start" }}>
                              <Chip
                                label={att.hardwareResult}
                                size="small"
                                sx={{
                                  fontWeight: 700,
                                  fontSize: "0.68rem",
                                  borderRadius: "6px",
                                  bgcolor: att.hardwareResult === "OPENED" ? "#eff6ff" : "#f1f5f9",
                                  color: att.hardwareResult === "OPENED" ? "#1d4ed8" : "#475569",
                                  border: `1px solid ${att.hardwareResult === "OPENED" ? "#bfdbfe" : "#e2e8f0"}`,
                                }}
                              />
                              {displayErrorCode && (
                                <Typography sx={{ fontSize: "0.7rem", color: "#94a3b8" }}>
                                  {displayErrorCode}
                                </Typography>
                              )}
                            </Box>
                          ) : (
                            <Typography sx={{ fontSize: "0.75rem", color: "#94a3b8" }}>Pending report</Typography>
                          )}
                        </td>
                        <td style={{ padding: "14px 18px" }}>
                          <Chip
                            label={displaySource}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              fontSize: "0.7rem",
                              borderRadius: "6px",
                              bgcolor: isDeviceLocal ? "#f8fafc" : "#eff6ff",
                              color: isDeviceLocal ? "#64748b" : "#2563eb",
                              border: `1px solid ${isDeviceLocal ? "#e2e8f0" : "#dbeafe"}`,
                            }}
                          />
                        </td>
                        <td style={{ padding: "14px 18px", color: "#64748b", fontSize: "0.78rem" }}>
                          <Tooltip title={att.transmissionUuid || ""}>
                            <span style={{ cursor: "pointer", textDecoration: "underline dotted" }}>
                              {correlationDisplay}
                            </span>
                          </Tooltip>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {attemptsTotal > 15 && (
                <Box sx={{ p: 2 }}>
                  <Pagination
                    page={attemptsPage}
                    totalResults={attemptsTotal}
                    rowsPerPage={15}
                    onPageChange={(_, p) => setAttemptsPage(p)}
                  />
                </Box>
              )}
            </Box>
          )}
        </Paper>
      )}

      {/* ── Dialog: Add Door Mapping ── */}
      <Dialog
        open={openCreateMapping}
        onClose={() => !submittingMapping && setOpenCreateMapping(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px" } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#1e293b", fontFamily: INTER }}>
          Map Dahua CGI Door Controller
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
          <Alert severity="info" sx={{ fontSize: "0.8rem", borderRadius: "10px" }}>
            The CGI registration ID is configured in your Dahua controller's network setup. One physical registry device maps to one zero-based door index.
          </Alert>

          {/* Reader Dropdown (Task 4) */}
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.8 }}>
              <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#334155" }}>
                Reader
              </Typography>
              <Button
                size="small"
                onClick={() => {
                  setOpenCreateMapping(false);
                  setOpenRegisterDevice(true);
                }}
                sx={{ textTransform: "none", fontSize: "0.75rem", p: 0, minWidth: 0, color: "#24528C", fontWeight: 600 }}
              >
                + Register New Device
              </Button>
            </Box>

            {(() => {
              // 1. Keep only provider === "DAHUA"
              // 2. Remove readers that already have a mapping
              const availableDahuaDevices = devices.filter((d) => {
                const isDahua = !d.provider || d.provider.toUpperCase() === "DAHUA";
                const isMapped = allMappings.some((m) => m.deviceId === d.id);
                return isDahua && !isMapped;
              });

              if (availableDahuaDevices.length > 0) {
                return (
                  <FormControl fullWidth size="small">
                    <InputLabel>Select Reader</InputLabel>
                    <Select
                      value={mappingForm.deviceId}
                      label="Select Reader"
                      onChange={(e) => setMappingForm({ ...mappingForm, deviceId: e.target.value })}
                    >
                      {availableDahuaDevices.map((d) => (
                        <MenuItem key={d.id} value={d.id}>
                          {d.name} · {d.serialNumber || "No SN"} · {d.facility?.name || d.accessZone || "Gate"}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                );
              }

              return (
                <Alert severity="warning" sx={{ fontSize: "0.82rem", borderRadius: "10px" }}>
                  All Dahua readers are already mapped. Register a new reader first.
                </Alert>
              );
            })()}
          </Box>

          <TextField
            label="CGI Device Registration ID"
            placeholder="e.g. MARBELLATEST01"
            size="small"
            fullWidth
            value={mappingForm.cgiDeviceId}
            onChange={(e) => setMappingForm({ ...mappingForm, cgiDeviceId: e.target.value })}
            helperText="Matches the unique controller registration ID reported by Dahua CGI events"
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Door Index (0-based)"
              type="number"
              size="small"
              sx={{ width: 150 }}
              value={mappingForm.doorIndex}
              onChange={(e) => setMappingForm({ ...mappingForm, doorIndex: Number(e.target.value) })}
              helperText="0 for Door 1, 1 for Door 2"
            />
            <FormControl fullWidth size="small">
              <InputLabel>Access Mode</InputLabel>
              <Select
                value={mappingForm.accessMode}
                label="Access Mode"
                onChange={(e) => setMappingForm({ ...mappingForm, accessMode: e.target.value as AccessMode })}
              >
                <MenuItem value="SUBSCRIPTION">SUBSCRIPTION (Monthly RFID pass only)</MenuItem>
                <MenuItem value="AUTO">AUTO (Dynamic subscription / booking)</MenuItem>
                <MenuItem value="BOOKING">BOOKING (Requires active slot booking)</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Task 8: Booking warning */}
          {(() => {
            const selectedDevice = devices.find((d) => d.id === mappingForm.deviceId);
            const facility = selectedDevice?.facilityId
              ? facilities.find((f) => (f.id || f._id) === selectedDevice.facilityId)
              : null;
            const isBookingMode = mappingForm.accessMode === "BOOKING";
            const isAutoNonSub = mappingForm.accessMode === "AUTO" && facility && facility.accessType && facility.accessType !== "SUBSCRIPTION";

            if (isBookingMode || isAutoNonSub) {
              return (
                <Alert severity="warning" sx={{ fontSize: "0.82rem", borderRadius: "10px" }}>
                  Booking access is not available on Dahua readers yet. Nobody will be let in through this door.
                </Alert>
              );
            }
            return null;
          })()}

          {/* Task 8: Booking Grace Window only when Access Mode is BOOKING */}
          {mappingForm.accessMode === "BOOKING" && (
            <TextField
              label="Booking Grace Window (minutes)"
              type="number"
              size="small"
              fullWidth
              value={mappingForm.bookingGraceMinutes}
              onChange={(e) => setMappingForm({ ...mappingForm, bookingGraceMinutes: Number(e.target.value) })}
              helperText="Allows early arrival and late departure around slot bookings (default 15m)"
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenCreateMapping(false)} disabled={submittingMapping} sx={{ color: "#64748b" }}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateMappingSubmit}
            variant="contained"
            disabled={submittingMapping}
            sx={{ bgcolor: "#24528C", textTransform: "none", borderRadius: "8px", px: 3 }}
          >
            {submittingMapping ? <CircularProgress size={20} color="inherit" /> : "Save Door Mapping"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Dialog: Register Physical Controller (Task 5) ── */}
      <Dialog
        open={openRegisterDevice}
        onClose={() => !submittingDevice && setOpenRegisterDevice(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px" } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#1e293b", fontFamily: INTER }}>
          Register Dahua Terminal
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
          <TextField
            label="Device Friendly Name"
            placeholder="e.g. Gym Entry (Dahua ASI6213S)"
            size="small"
            fullWidth
            value={deviceForm.name}
            onChange={(e) => setDeviceForm({ ...deviceForm, name: e.target.value })}
          />

          <TextField
            label="Serial Number"
            placeholder="e.g. CE001CDPAJ58DDB"
            size="small"
            fullWidth
            value={deviceForm.serialNumber}
            onChange={(e) => setDeviceForm({ ...deviceForm, serialNumber: e.target.value })}
          />

          {projects.length > 0 ? (
            <Box>
              <FormControl fullWidth size="small">
                <InputLabel>Project</InputLabel>
                <Select
                  value={deviceForm.projectId}
                  label="Project"
                  onChange={(e) => setDeviceForm({ ...deviceForm, projectId: e.target.value })}
                >
                  {projects.map((p) => (
                    <MenuItem key={p.id || p._id} value={p.id || p._id}>
                      {p.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography sx={{ fontSize: "0.75rem", color: "#64748b", mt: 0.6, ml: 1.5 }}>
                Only residents of this project can use this reader.
              </Typography>
            </Box>
          ) : (
            <Box>
              <TextField
                label="Project ID (UUID)"
                placeholder="e.g. your-project-uuid"
                size="small"
                fullWidth
                value={deviceForm.projectId}
                onChange={(e) => setDeviceForm({ ...deviceForm, projectId: e.target.value })}
                helperText="Enter the Project UUID to associate this reader with"
              />
              <Typography sx={{ fontSize: "0.75rem", color: "#64748b", mt: 0.6, ml: 1.5 }}>
                Only residents of this project can use this reader.
              </Typography>
            </Box>
          )}

          <FormControl fullWidth size="small" required={deviceForm.purpose === "FACILITY_ACCESS"}>
            <InputLabel>Facility {deviceForm.purpose === "FACILITY_ACCESS" ? "(Required for Facility Access)" : "(Optional)"}</InputLabel>
            <Select
              value={deviceForm.facilityId || ""}
              label={`Facility ${deviceForm.purpose === "FACILITY_ACCESS" ? "(Required for Facility Access)" : "(Optional)"}`}
              onChange={(e) => setDeviceForm({ ...deviceForm, facilityId: e.target.value })}
            >
              {deviceForm.purpose !== "FACILITY_ACCESS" && (
                <MenuItem value="">None / Society Main Gate</MenuItem>
              )}
              {facilities.map((f) => (
                <MenuItem key={f.id || f._id} value={f.id || f._id}>
                  {f.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Purpose</InputLabel>
              <Select
                value={deviceForm.purpose}
                label="Purpose"
                onChange={(e) => {
                  const newPurpose = e.target.value as any;
                  setDeviceForm({
                    ...deviceForm,
                    purpose: newPurpose,
                    facilityId: newPurpose === "FACILITY_ACCESS" ? deviceForm.facilityId : "",
                  });
                }}
              >
                <MenuItem value="FACILITY_ACCESS">FACILITY_ACCESS</MenuItem>
                <MenuItem value="SOCIETY_GATE">SOCIETY_GATE</MenuItem>
                <MenuItem value="STAFF_ATTENDANCE">STAFF_ATTENDANCE</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Direction</InputLabel>
              <Select
                value={deviceForm.direction}
                label="Direction"
                onChange={(e) => setDeviceForm({ ...deviceForm, direction: e.target.value as any })}
              >
                <MenuItem value="ENTRY">ENTRY</MenuItem>
                <MenuItem value="EXIT">EXIT</MenuItem>
                <MenuItem value="BOTH">BOTH</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TextField
            label="Access Zone Code"
            placeholder="e.g. GYM"
            size="small"
            fullWidth
            value={deviceForm.accessZone}
            onChange={(e) => setDeviceForm({ ...deviceForm, accessZone: e.target.value })}
            helperText="Code identifying the physical zone (e.g. GYM for the gym)"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenRegisterDevice(false)} disabled={submittingDevice} sx={{ color: "#64748b" }}>
            Cancel
          </Button>
          <Button
            onClick={handleRegisterDeviceSubmit}
            variant="contained"
            disabled={submittingDevice}
            sx={{ bgcolor: "#24528C", textTransform: "none", borderRadius: "8px", px: 3 }}
          >
            {submittingDevice ? <CircularProgress size={20} color="inherit" /> : "Register Controller"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Dialog A: Turn this door off first (Task 1) ── */}
      <Dialog
        open={Boolean(mappingTurnOffTarget)}
        onClose={() => !submittingTurnOff && setMappingTurnOffTarget(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#1e293b", fontFamily: INTER, fontSize: "1.1rem" }}>
          Turn this door off first
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#475569", fontSize: "0.875rem", lineHeight: 1.6 }}>
            <strong>{mappingTurnOffTarget?.cgiDeviceId} · Door {mappingTurnOffTarget?.doorIndex}</strong> is active. Turning it off removes access for every member at this door within about a minute. After 2 minutes you can delete it.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1, gap: 1 }}>
          <Button
            onClick={() => setMappingTurnOffTarget(null)}
            disabled={submittingTurnOff}
            sx={{ color: "#64748b", textTransform: "none", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmTurnOff}
            variant="contained"
            disabled={submittingTurnOff}
            sx={{
              bgcolor: "#d97706",
              "&:hover": { bgcolor: "#b45309" },
              textTransform: "none",
              borderRadius: "8px",
              fontWeight: 600,
              px: 2.5,
            }}
          >
            {submittingTurnOff ? <CircularProgress size={18} color="inherit" /> : "Turn off door"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Dialog B: Delete door mapping? (Task 1) ── */}
      <Dialog
        open={Boolean(mappingDeleteTarget)}
        onClose={() => !submittingDeleteMapping && setMappingDeleteTarget(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#1e293b", fontFamily: INTER, fontSize: "1.1rem" }}>
          Delete door mapping?
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Typography sx={{ color: "#475569", fontSize: "0.875rem", lineHeight: 1.6 }}>
            <strong>{mappingDeleteTarget?.cgiDeviceId} · Door {mappingDeleteTarget?.doorIndex}</strong> will be removed. Access history stays in the audit.
          </Typography>
          {deleteMappingError && (
            <Alert severity="error" sx={{ fontSize: "0.8rem", borderRadius: "8px" }}>
              {deleteMappingError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1, gap: 1 }}>
          <Button
            onClick={() => setMappingDeleteTarget(null)}
            disabled={submittingDeleteMapping}
            sx={{ color: "#64748b", textTransform: "none", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDeleteMapping}
            variant="contained"
            disabled={submittingDeleteMapping || (countdownSeconds !== null && countdownSeconds > 0)}
            sx={{
              bgcolor: "#ef4444",
              "&:hover": { bgcolor: "#dc2626" },
              textTransform: "none",
              borderRadius: "8px",
              fontWeight: 600,
              px: 2.5,
            }}
          >
            {submittingDeleteMapping ? (
              <CircularProgress size={18} color="inherit" />
            ) : countdownSeconds !== null && countdownSeconds > 0 ? (
              `Delete (${countdownSeconds}s)`
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Dialog: Delete reader? (Task 2) ── */}
      <Dialog
        open={Boolean(deviceDeleteTarget)}
        onClose={() => !submittingDeleteDevice && setDeviceDeleteTarget(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#1e293b", fontFamily: INTER, fontSize: "1.1rem" }}>
          Delete reader?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#475569", fontSize: "0.875rem", lineHeight: 1.6 }}>
            <strong>{deviceDeleteTarget?.name} · serial {deviceDeleteTarget?.serialNumber || "N/A"}</strong> will be removed.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1, gap: 1 }}>
          <Button
            onClick={() => setDeviceDeleteTarget(null)}
            disabled={submittingDeleteDevice}
            sx={{ color: "#64748b", textTransform: "none", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDeleteDevice}
            variant="contained"
            disabled={submittingDeleteDevice}
            sx={{
              bgcolor: "#ef4444",
              "&:hover": { bgcolor: "#dc2626" },
              textTransform: "none",
              borderRadius: "8px",
              fontWeight: 600,
              px: 2.5,
            }}
          >
            {submittingDeleteDevice ? <CircularProgress size={18} color="inherit" /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
