import { useState, useEffect, useCallback } from "react";
import { Box, Typography, Chip, Avatar, Stack, Button } from "@mui/material";
import {
  ReportProblemOutlined as IssueIcon,
  FeedbackOutlined as FeedbackIcon,
} from "@mui/icons-material";

import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import { getIssuesApi } from "@/apis/issues";
import type { GetIssuesParams } from "@/apis/issues";

// Import modular sub-components
import IssueStats from "./components/IssueStats";
import IssueFilters from "./components/IssueFilters";
import IssueDetailsModal from "./components/IssueDetailsModal";

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
  IN_PROGRESS: { bg: "#eff6ff", color: "#1d4ed8" },
  RESOLVED: { bg: "#f0fdf4", color: "#16a34a" },
  CLOSED: { bg: "#f8fafc", color: "#64748b" },
  REJECTED: { bg: "#fef2f2", color: "#dc2626" },
  CANCELLED: { bg: "#faf5ff", color: "#7c3aed" },
};

const priorityColors: Record<string, { bg: string; color: string }> = {
  LOW: { bg: "#f1f5f9", color: "#475569" },
  MEDIUM: { bg: "#fef3c7", color: "#d97706" },
  HIGH: { bg: "#fee2e2", color: "#dc2626" },
  URGENT: { bg: "#7f1d1d", color: "#fca5a5" },
};

export default function GetIssues() {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Filter states
  const [search, setSearch] = useState("");
  const [type, setType] = useState<string>("ALL");
  const [category, setCategory] = useState<string>("ALL");
  const [status, setStatus] = useState<string>("ALL");
  const [priority, setPriority] = useState<string>("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Local stats computed from the loaded issues list
  const openCount = issues.filter((i) => i.status === "OPEN").length;
  const inProgressCount = issues.filter((i) => i.status === "IN_PROGRESS").length;
  const resolvedCount = issues.filter((i) => i.status === "RESOLVED").length;

  // Modal control
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Fetch listed issues
  const fetchIssues = useCallback(async () => {
    setLoading(true);
    try {
      const params: GetIssuesParams = {
        page,
        limit: rowsPerPage,
        search: search || undefined,
        type: type !== "ALL" ? (type as any) : undefined,
        category: category !== "ALL" ? (category as any) : undefined,
        status: status !== "ALL" ? (status as any) : undefined,
        priority: priority !== "ALL" ? (priority as any) : undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      };

      const res = await getIssuesApi(params);
      const dataArr =
        res?.data?.items ||
        res?.items ||
        (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);

      setIssues(dataArr);

      const pagination = res?.data?.pagination || res?.pagination;
      setTotalCount(pagination?.total || dataArr.length || 0);
    } catch (error) {
      console.warn("Failed to fetch issues:", error);
      setIssues([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    rowsPerPage,
    search,
    type,
    category,
    status,
    priority,
    dateFrom,
    dateTo,
  ]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const handleResetFilters = () => {
    setSearch("");
    setType("ALL");
    setCategory("ALL");
    setStatus("ALL");
    setPriority("ALL");
    setDateFrom("");
    setDateTo("");
  };

  const handleViewDetails = (id: string) => {
    setSelectedIssueId(id);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedIssueId(null);
  };

  const handleStatusUpdated = () => {
    fetchIssues();
  };

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, bgcolor: "#f8fafc", minHeight: "100vh" }}>
      {/* Analytics Summary */}
      <IssueStats
        openCount={openCount}
        inProgressCount={inProgressCount}
        resolvedCount={resolvedCount}
        onStatusClick={(statusVal) => setStatus(statusVal)}
      />

      {/* Filters Toolbar */}
      <IssueFilters
        search={search}
        onSearchChange={setSearch}
        type={type}
        onTypeChange={setType}
        category={category}
        onCategoryChange={setCategory}
        status={status}
        onStatusChange={setStatus}
        priority={priority}
        onPriorityChange={setPriority}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        onReset={handleResetFilters}
      />

      {/* Issues List Table */}
      <DataTable
        columns={[
          {
            id: "id_type",
            label: "Ticket ID / Type",
            render: (row) => (
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: row.type === "FEEDBACK" ? "#faf5ff" : "#fef2f2",
                    color: row.type === "FEEDBACK" ? "#7c3aed" : "#dc2626",
                    width: 38,
                    height: 38,
                  }}
                >
                  {row.type === "FEEDBACK" ? (
                    <FeedbackIcon fontSize="small" />
                  ) : (
                    <IssueIcon fontSize="small" />
                  )}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight="800" color="#091542">
                    #{row.id?.substring(0, 8).toUpperCase() || "N/A"}
                  </Typography>
                  <Typography
                    variant="caption"
                    fontWeight="700"
                    color="text.secondary"
                  >
                    {row.type}
                  </Typography>
                </Box>
              </Stack>
            ),
          },
          {
            id: "category",
            label: "Category",
            render: (row) => (
              <Chip
                label={categoryLabels[row.category] || row.category || "Other"}
                size="small"
                sx={{
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  borderRadius: "8px",
                  bgcolor: "#f1f5f9",
                  color: "#334155",
                }}
              />
            ),
          },
          {
            id: "details",
            label: "Description / Reporter",
            render: (row) => (
              <Box>
                <Typography
                  variant="body2"
                  fontWeight="700"
                  color="#1e293b"
                  sx={{
                    maxWidth: 280,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.description || "No description provided."}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight="600"
                  display="block"
                >
                  By: {row.user?.name || "Unknown Resident"} (Flat{" "}
                  {row.flat?.flatNumber || "N/A"})
                </Typography>
              </Box>
            ),
          },
          {
            id: "priority",
            label: "Priority",
            render: (row) => {
              const colors = priorityColors[row.priority] || {
                bg: "#f1f5f9",
                color: "#475569",
              };
              return (
                <Chip
                  label={row.priority || "LOW"}
                  size="small"
                  sx={{
                    fontWeight: 900,
                    fontSize: "0.7rem",
                    borderRadius: "6px",
                    bgcolor: colors.bg,
                    color: colors.color,
                  }}
                />
              );
            },
          },
          {
            id: "status",
            label: "Status",
            render: (row) => {
              const colors = statusColors[row.status] || {
                bg: "#f1f5f9",
                color: "#475569",
              };
              return (
                <Chip
                  label={row.status || "OPEN"}
                  size="small"
                  sx={{
                    fontWeight: 900,
                    fontSize: "0.7rem",
                    borderRadius: "8px",
                    bgcolor: colors.bg,
                    color: colors.color,
                  }}
                />
              );
            },
          },
          {
            id: "assignedTo",
            label: "Assigned Admin",
            render: (row) => (
              <Typography variant="body2" fontWeight="600" color="#334155">
                {row.assignedAdmin?.name || "Unassigned"}
              </Typography>
            ),
          },
          {
            id: "createdAt",
            label: "Reported Date",
            render: (row) => (
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="600"
              >
                {row.createdAt
                  ? new Date(row.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
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
                variant="outlined"
                size="small"
                onClick={() => handleViewDetails(row.id)}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  borderColor: "#0047b3",
                  color: "#0047b3",
                  "&:hover": { bgcolor: "#eff6ff", borderColor: "#003380" },
                }}
              >
                Manage
              </Button>
            ),
          },
        ]}
        data={issues}
        loading={loading}
        totalCount={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, value) => setPage(value)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(Number(event.target.value));
          setPage(1);
        }}
        emptyMessage="No issues or feedback found."
      />

      {/* Ticket Actions Dialog */}
      <IssueDetailsModal
        open={detailsOpen}
        onClose={handleCloseDetails}
        issueId={selectedIssueId}
        onStatusUpdated={handleStatusUpdated}
      />
    </Box>
  );
}
