import { useState, useEffect, useCallback } from "react";
import { Box, Typography, Chip, Avatar, Stack, Button } from "@mui/material";
import {
  Emergency as EmergencyIcon,
  LocalFireDepartment as FireIcon,
  MedicalServices as MedicalIcon,
  Security as SecurityIcon,
  PriorityHigh as PanicIcon,
  Help as UnknownEmergencyIcon,
} from "@mui/icons-material";

import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import { getEmergencyApi } from "@/apis/emergency";
import type { GetEmergencyParams } from "@/apis/emergency";
import { useAuth } from "@/contexts/AuthContext";

// Sub-components
import EmergencyStats from "./components/EmergencyStats";
import EmergencyFilters from "./components/EmergencyFilters";
import EmergencyDetailsModal from "./components/EmergencyDetailsModal";

const severityColors: Record<string, { bg: string; color: string }> = {
  CRITICAL: { bg: "#7f1d1d", color: "#fca5a5" },
  HIGH: { bg: "#fee2e2", color: "#dc2626" },
  MEDIUM: { bg: "#fef3c7", color: "#d97706" },
  LOW: { bg: "#f1f5f9", color: "#475569" },
};

const statusColors: Record<string, { bg: string; color: string }> = {
  OPEN: { bg: "#fef2f2", color: "#dc2626" },
  ACKNOWLEDGED: { bg: "#eff6ff", color: "#1d4ed8" },
  RESOLVED: { bg: "#f0fdf4", color: "#16a34a" },
  FALSE_ALARM: { bg: "#f8fafc", color: "#64748b" },
  CANCELLED: { bg: "#faf5ff", color: "#7c3aed" },
};

const typeIcons: Record<string, React.ReactNode> = {
  FIRE: <FireIcon fontSize="small" />,
  MEDICAL: <MedicalIcon fontSize="small" />,
  SECURITY: <SecurityIcon fontSize="small" />,
  PANIC: <PanicIcon fontSize="small" />,
};

export default function GetEmergency() {
  const { user } = useAuth();

  const isSecurityOrAdmin =
    user?.role?.toLowerCase() === "admin" ||
    user?.role?.toLowerCase() === "security" ||
    user?.roles?.some((r: string) => ["admin", "security"].includes(r.toLowerCase())) ||
    false;

  // Local state
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [type, setType] = useState("ALL");
  const [severity, setSeverity] = useState("ALL");
  const [userId, setUserId] = useState("");
  const [flatId, setFlatId] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Details Modal
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Local stats computed from local state
  const openCount = alerts.filter((a) => a.status === "OPEN").length;
  const acknowledgedCount = alerts.filter((a) => a.status === "ACKNOWLEDGED").length;
  const resolvedCount = alerts.filter(
    (a) => a.status === "RESOLVED" || a.status === "FALSE_ALARM"
  ).length;

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const params: GetEmergencyParams = {
        page,
        limit: rowsPerPage,
        status: status !== "ALL" ? (status as any) : undefined,
        type: type !== "ALL" ? type : undefined,
        severity: severity !== "ALL" ? severity : undefined,
        userId: isSecurityOrAdmin && userId ? userId : undefined,
        flatId: isSecurityOrAdmin && flatId ? flatId : undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      };

      const res = await getEmergencyApi(params);
      const dataArr =
        res?.data?.items ||
        res?.items ||
        (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);

      setAlerts(dataArr);

      const pagination = res?.data?.pagination || res?.pagination;
      setTotalCount(pagination?.total || dataArr.length || 0);
    } catch (error) {
      console.warn("Failed to fetch emergency alerts:", error);
      setAlerts([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    rowsPerPage,
    status,
    type,
    severity,
    userId,
    flatId,
    dateFrom,
    dateTo,
    isSecurityOrAdmin,
  ]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleResetFilters = () => {
    setSearch("");
    setStatus("ALL");
    setType("ALL");
    setSeverity("ALL");
    setUserId("");
    setFlatId("");
    setDateFrom("");
    setDateTo("");
  };

  const handleViewDetails = (id: string) => {
    setSelectedAlertId(id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAlertId(null);
  };

  const handleStatusUpdated = () => {
    fetchAlerts();
  };

  // Filter based on client-side search text if present
  const displayedAlerts = search
    ? alerts.filter(
        (a) =>
          a.type?.toLowerCase().includes(search.toLowerCase()) ||
          a.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
          a.flat?.flatNumber?.toLowerCase().includes(search.toLowerCase()) ||
          a.notes?.toLowerCase().includes(search.toLowerCase()) ||
          a.resolutionNotes?.toLowerCase().includes(search.toLowerCase()) ||
          a.cancellationReason?.toLowerCase().includes(search.toLowerCase())
      )
    : alerts;

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "#f8fafc", minHeight: "100vh" }}>
      {/* Title */}
      <PageHeader title="Emergency Alerts Ledger" />
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4, mt: -3, fontWeight: 500 }}>
        Monitor, acknowledge, resolve, and manage emergency distress signals and panic buttons across the community.
      </Typography>

      {/* Analytics Summary */}
      <EmergencyStats
        openCount={openCount}
        acknowledgedCount={acknowledgedCount}
        resolvedCount={resolvedCount}
        onStatusClick={(stat) => setStatus(stat)}
      />

      {/* Filters Toolbar */}
      <EmergencyFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        type={type}
        onTypeChange={setType}
        severity={severity}
        onSeverityChange={setSeverity}
        userId={userId}
        onUserIdChange={setUserId}
        flatId={flatId}
        onFlatIdChange={setFlatId}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        onReset={handleResetFilters}
        showAdminFilters={isSecurityOrAdmin}
      />

      {/* List Table */}
      <DataTable
        columns={[
          {
            id: "id_type",
            label: "Distress ID / Type",
            render: (row) => {
              const sevCol = severityColors[row.severity] || { bg: "#f1f5f9", color: "#475569" };
              return (
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: sevCol.bg,
                      color: sevCol.color,
                      width: 40,
                      height: 40,
                      border: `1px solid ${sevCol.color}`,
                    }}
                  >
                    {typeIcons[row.type?.toUpperCase()] || <UnknownEmergencyIcon fontSize="small" />}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight="900" color="#091542">
                      #{row.id?.substring(0, 8).toUpperCase() || "SOS"}
                    </Typography>
                    <Typography variant="caption" fontWeight="800" color="text.secondary">
                      {row.type} / {row.severity}
                    </Typography>
                  </Box>
                </Stack>
              );
            },
          },
          {
            id: "status",
            label: "Status",
            render: (row) => {
              const colors = statusColors[row.status] || { bg: "#f1f5f9", color: "#475569" };
              return (
                <Chip
                  label={row.status?.replace("_", " ") || "OPEN"}
                  size="small"
                  sx={{
                    fontWeight: 900,
                    fontSize: "0.7rem",
                    borderRadius: "8px",
                    bgcolor: colors.bg,
                    color: colors.color,
                    border: `1px solid ${colors.color}`,
                  }}
                />
              );
            },
          },
          {
            id: "location",
            label: "Flat / Reporter",
            render: (row) => (
              <Box>
                <Typography variant="body2" fontWeight="800" color="#1e293b">
                  Flat {row.flat?.flatNumber || "N/A"}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight="700" display="block">
                  By: {row.user?.name || "Distressed User"}
                </Typography>
              </Box>
            ),
          },
          {
            id: "details",
            label: "Dispatch / Resolution Summary",
            render: (row) => (
              <Box sx={{ maxWidth: 280 }}>
                {row.status === "OPEN" && (
                  <Typography variant="body2" color="error.main" fontWeight="800" sx={{ animation: "blink 1.5s infinite" }}>
                    🔴 distress active - response pending
                  </Typography>
                )}
                {row.status === "ACKNOWLEDGED" && (
                  <Typography variant="body2" fontWeight="700" color="#1e293b" sx={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                    Disp: {row.notes || "Response dispatched"}
                  </Typography>
                )}
                {row.status === "RESOLVED" && (
                  <Typography variant="body2" fontWeight="700" color="#16a34a" sx={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                    Res: {row.resolutionNotes || "Resolved successfully"}
                  </Typography>
                )}
                {row.status === "FALSE_ALARM" && (
                  <Typography variant="body2" fontWeight="700" color="#475569" sx={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                    False Alarm: {row.resolutionNotes || "No emergency found"}
                  </Typography>
                )}
                {row.status === "CANCELLED" && (
                  <Typography variant="body2" fontWeight="700" color="#7c3aed" sx={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                    Cancelled: {row.cancellationReason || "Pressed accidentally"}
                  </Typography>
                )}
              </Box>
            ),
          },
          {
            id: "createdAt",
            label: "Reported Time",
            render: (row) => (
              <Typography variant="body2" color="text.secondary" fontWeight="700">
                {row.createdAt
                  ? new Date(row.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    }) +
                    " " +
                    new Date(row.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A"}
              </Typography>
            ),
          },
          {
            id: "actions",
            label: "Actions",
            align: "right",
            render: (row) => (
              <Button
                variant="contained"
                size="small"
                onClick={() => handleViewDetails(row.id)}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  bgcolor: severityColors[row.severity]?.color || "#2c4d93",
                  color: "#ffffff",
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: "#111827",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                  },
                }}
              >
                Manage
              </Button>
            ),
          },
        ]}
        data={displayedAlerts}
        loading={loading}
        totalCount={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, value) => setPage(value)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(Number(event.target.value));
          setPage(1);
        }}
        emptyMessage="No emergency alerts active or logged."
      />

      {/* Ticket Details & Action Modal */}
      <EmergencyDetailsModal
        open={modalOpen}
        onClose={handleCloseModal}
        alertId={selectedAlertId}
        onStatusUpdated={handleStatusUpdated}
      />
    </Box>
  );
}
