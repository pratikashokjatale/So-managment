import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  VisibilityOutlined as VisibilityOutlinedIcon,
  EditOutlined as EditOutlinedIcon,
  DeleteOutline as DeleteIcon,
  Business as ProjectIcon,
  Add as AddIcon,
  LocationOn as LocationIcon,
  FiberManualRecord as DotIcon,
} from "@mui/icons-material";

import Search from "@/components/Search";
import DataTable from "@/components/DataTable";
import { getProjects, deleteProject } from "@/utils/setupStore";
import type { Project } from "@/utils/setupStore";
import { getProjectsApi, deleteProjectApi } from "@/apis/project";
import toast from "react-hot-toast";

export default function GetProject() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Sorting states
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (field: string) => {
    const isAsc = sortBy === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortBy(field);
  };

  // Pagination states
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [isApiMode, setIsApiMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const handlePageChange = (_event: any, value: number) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await getProjectsApi({
        page,
        limit: rowsPerPage,
        status: statusFilter === "ALL" ? undefined : statusFilter,
      });
      const projectList =
        res?.data?.data ||
        res?.data?.projects ||
        res?.projects ||
        res?.data ||
        [];
      const pagination = res?.data?.pagination || res?.pagination;
      setProjects(projectList);
      setTotalCount(pagination?.total || projectList.length);
      setIsApiMode(true);
      setLoading(false);
    } catch (error) {
      console.warn(
        "Failed to fetch projects via API, falling back to local storage:",
        error,
      );
      const localProjects = getProjects();
      setProjects(localProjects);
      setTotalCount(localProjects.length);
      setIsApiMode(false);
      setLoading(false);
    }
  };

  // Load data
  useEffect(() => {
    fetchProjects();
  }, [page, rowsPerPage, statusFilter]);

  // Reset page to 1 on filter changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter]);

  // Metrics
  const totalProjects = isApiMode ? totalCount : projects.length;
  const activeProjects = projects.filter(
    (p) => p.status?.toUpperCase() === "ACTIVE" || p.status === "Active",
  ).length;

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      try {
        await deleteProjectApi(deleteId);
        toast.success("Project deleted successfully!");
        if (isApiMode) {
          fetchProjects();
        } else {
          deleteProject(deleteId);
          setProjects(getProjects()); // Refresh
        }
      } catch (err: any) {
        console.warn("Failed to delete project:", err);
        toast.error(err?.response?.data?.message || "Failed to delete project");
      }
      setDeleteId(null);
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.code || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.location || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    let aVal = a[sortBy as keyof Project] || "";
    let bVal = b[sortBy as keyof Project] || "";

    if (typeof aVal === "string") {
      aVal = aVal.toLowerCase();
    }
    if (typeof bVal === "string") {
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedProjects = isApiMode
    ? sortedProjects
    : sortedProjects.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const totalResults = isApiMode ? totalCount : filteredProjects.length;

  return (
    <Box
      sx={{
        mt: 2,
        p: { xs: 2, md: 4 },
        bgcolor: "#ffffff",
        minHeight: "100vh",
        borderRadius: "12px",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ mb: 1, color: "#002855" }}
          >
            Projects
          </Typography>
          <Breadcrumbs separator=">" aria-label="breadcrumb">
            <Link
              underline="hover"
              color="inherit"
              onClick={() => navigate("/")}
              sx={{ cursor: "pointer" }}
            >
              Dashboard
            </Link>
            <Typography color="text.primary">Setup</Typography>
            <Typography color="text.primary" fontWeight="600">
              Projects
            </Typography>
          </Breadcrumbs>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/project/add")}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            px: 3,
            fontWeight: 600,
            boxShadow: "none",
            bgcolor: "#0047b3",
            "&:hover": { bgcolor: "#003380" },
          }}
        >
          Add Project
        </Button>
      </Box>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card
            sx={{
              bgcolor: "#eff6ff",
              borderRadius: "12px",
              boxShadow: "none",
              border: "1px solid #d0e1fd",
            }}
          >
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: "#0047b3",
                  color: "#ffffff",
                  borderRadius: "8px",
                  display: "flex",
                }}
              >
                <ProjectIcon />
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight="600"
                >
                  TOTAL PROJECTS
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight="800"
                  sx={{ color: "#002855" }}
                >
                  {totalProjects}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card
            sx={{
              bgcolor: "#ecfdf5",
              borderRadius: "12px",
              boxShadow: "none",
              border: "1px solid #a7f3d0",
            }}
          >
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: "#10b981",
                  color: "#ffffff",
                  borderRadius: "8px",
                  display: "flex",
                }}
              >
                <DotIcon fontSize="small" />
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight="600"
                >
                  ACTIVE PROJECTS
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight="800"
                  sx={{ color: "#065f46" }}
                >
                  {activeProjects}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Filter section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Search
          placeholder="Search by project name, code, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: { xs: "100%", md: 400 },
            "& fieldset": { borderRadius: "8px" },
          }}
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" color="text.secondary" fontWeight="600">
            Status:
          </Typography>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            size="small"
            sx={{ minWidth: 150, borderRadius: "8px", bgcolor: "#ffffff" }}
          >
            <MenuItem value="ALL">All Status</MenuItem>
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="INACTIVE">Inactive</MenuItem>
            <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
          </Select>
        </Box>
      </Box>

      {/* Table Section */}
      <DataTable
        columns={[
          {
            id: "code",
            label: "Project Code",
            sortable: true,
            render: (row) => (
              <Typography variant="body2" fontWeight={700} color="#0047b3">
                {row.code}
              </Typography>
            ),
          },
          {
            id: "name",
            label: "Project Name",
            sortable: true,
            render: (row) => (
              <Box>
                <Typography variant="body2" fontWeight="700" color="#002855">
                  {row.name}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                  sx={{ display: "block", maxWidth: 250 }}
                >
                  {row.description}
                </Typography>
              </Box>
            ),
          },
          {
            id: "location",
            label: "Location",
            sortable: true,
            render: (row) => (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <LocationIcon
                  fontSize="inherit"
                  sx={{ color: "text.secondary" }}
                />
                <Typography variant="body2" color="text.secondary">
                  {row.location}
                </Typography>
              </Box>
            ),
          },
          {
            id: "status",
            label: "Status",
            sortable: true,
            render: (row) => (
              <Box
                sx={{
                  display: "inline-flex",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  bgcolor:
                    row.status?.toUpperCase() === "ACTIVE" ||
                    row.status === "Active"
                      ? "#ecfdf5"
                      : "#fef2f2",
                  color:
                    row.status?.toUpperCase() === "ACTIVE" ||
                    row.status === "Active"
                      ? "#10b981"
                      : "#ef4444",
                }}
              >
                {row.status}
              </Box>
            ),
          },
          {
            id: "actions",
            label: "Actions",
            align: "right",
            render: (row) => (
              <>
                <IconButton
                  size="small"
                  sx={{
                    color: "#0047b3",
                    bgcolor: "#eff6ff",
                    mr: 1,
                    "&:hover": { bgcolor: "#d0e1fd" },
                  }}
                  onClick={() => navigate(`/project/${row.id}`)}
                >
                  <VisibilityOutlinedIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{ color: "text.secondary", mr: 1 }}
                  onClick={() => navigate(`/project/edit/${row.id}`)}
                >
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{ color: "error.main" }}
                  onClick={() => handleDeleteClick(row.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </>
            ),
          },
        ]}
        data={paginatedProjects}
        loading={loading}
        totalCount={totalResults}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        emptyMessage="No projects found matching the criteria."
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort as any}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle sx={{ fontWeight: "bold", color: "#002855" }}>
          Delete Project?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this project? Deleting this project
            will **permanently delete all Towers and Flats** associated with it.
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setDeleteId(null)}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              px: 3,
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              px: 3,
              fontWeight: 600,
              boxShadow: "none",
            }}
          >
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
