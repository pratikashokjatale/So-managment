import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TableSortLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  VisibilityOutlined as VisibilityOutlinedIcon,
  EditOutlined as EditOutlinedIcon,
  DeleteOutline as DeleteIcon,
  Apartment as TowerIcon,
  Add as AddIcon,
  FiberManualRecord as DotIcon,
} from "@mui/icons-material";

import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import { getTowers, deleteTower } from "@/utils/setupStore";
import { getProjectsApi } from "@/apis/project";
import { getTowersApi, getAllTowersApi } from "@/apis/tower";
import { CircularProgress } from "@mui/material";

export default function GetTower() {
  const navigate = useNavigate();
  const [towers, setTowers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [deleteId, setDeleteId] = useState<string | null>(null);

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

  const fetchTowers = async () => {
    setLoading(true);
    try {
      let mergedTowers: any[] = [];

      let projectList = projects;
      if (projects.length === 0) {
        const projRes = await getProjectsApi({ limit: 100 });
        projectList =
          projRes?.data?.data ||
          projRes?.data?.projects ||
          projRes?.projects ||
          projRes?.data ||
          [];
        setProjects(projectList);
      }

      let paginationObj: any = null;

      if (projectFilter !== "All Projects") {
        const res = await getTowersApi(projectFilter, { page, limit: rowsPerPage, search: searchQuery });
        const list = Array.isArray(res?.data?.data)
          ? res.data.data
          : res?.data?.towers || res?.towers || res?.data || [];
        mergedTowers = list;
        paginationObj = res?.data?.pagination || res?.pagination;
      } else {
        const res = await getAllTowersApi({ page, limit: rowsPerPage, search: searchQuery });
        const list = Array.isArray(res?.data?.data)
          ? res.data.data
          : res?.data?.towers || res?.towers || res?.data || [];
        mergedTowers = list;
        paginationObj = res?.data?.pagination || res?.pagination;
      }

      mergedTowers = mergedTowers.map((t) => {
        if (!t.projectName) {
          const proj = projectList.find((p) => p.id === t.projectId);
          t.projectName = proj ? proj.name : "Unknown Project";
        }
        return t;
      });

      setTowers(mergedTowers);
      setTotalCount(paginationObj?.total || mergedTowers.length);
      setIsApiMode(true);
    } catch (error) {
      console.warn(
        "Failed to fetch towers via API, falling back to local storage:",
        error,
      );
      const localTowers = getTowers();
      setTowers(localTowers);
      setTotalCount(localTowers.length);
      setIsApiMode(false);
    } finally {
      setLoading(false);
    }
  };

  // Load data
  useEffect(() => {
    fetchTowers();
  }, [projectFilter, page, rowsPerPage, searchQuery]);

  // Reset page to 1 on filter changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, projectFilter, statusFilter]);

  // Metrics
  const totalTowers = isApiMode ? totalCount : towers.length;
  const activeTowers = towers.filter(
    (t) => t.status?.toUpperCase() === "ACTIVE" || t.status === "Active",
  ).length;
  const totalFloors = towers.reduce(
    (acc, t) => acc + (t.totalFloors || t.floorsCount || 0),
    0,
  );

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteTower(deleteId);
      if (isApiMode) {
        fetchTowers();
      } else {
        setTowers(getTowers()); // Refresh
      }
      setDeleteId(null);
    }
  };

  const filteredTowers = isApiMode ? towers : towers.filter((t) => {
    const matchesSearch =
      (t.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.projectName || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject =
      projectFilter === "All Projects" || t.projectId === projectFilter;
    const matchesStatus =
      statusFilter === "All Status" ||
      t.status === statusFilter ||
      (statusFilter === "Active" && t.status?.toUpperCase() === "ACTIVE") ||
      (statusFilter === "Inactive" && t.status?.toUpperCase() === "INACTIVE");

    return matchesSearch && matchesProject && matchesStatus;
  });

  const sortedTowers = [...filteredTowers].sort((a, b) => {
    let aVal = a[sortBy] || "";
    let bVal = b[sortBy] || "";

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

  const paginatedTowers = isApiMode ? sortedTowers : sortedTowers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  const totalResults = isApiMode ? totalCount : filteredTowers.length;

  const filterSelectSx = {
    height: 38,
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "text.primary",
    bgcolor: "#f8fafc",
    borderRadius: "8px",
    boxShadow: "none",
    ".MuiOutlinedInput-notchedOutline": { borderColor: "#e2e8f0" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#cbd5e1" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#0047b3",
    },
  };

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
            sx={{ mb: 1, color: "#091542" }}
          >
            Towers
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
              Towers
            </Typography>
          </Breadcrumbs>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/tower/add")}
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
          Add Tower
        </Button>
      </Box>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card
            sx={{
              bgcolor: "#faf5ff",
              borderRadius: "12px",
              boxShadow: "none",
              border: "1px solid #f3e8ff",
            }}
          >
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: "#8b5cf6",
                  color: "#ffffff",
                  borderRadius: "8px",
                  display: "flex",
                }}
              >
                <TowerIcon />
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight="600"
                >
                  TOTAL TOWERS
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight="800"
                  sx={{ color: "#5b21b6" }}
                >
                  {totalTowers}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
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
                  ACTIVE TOWERS
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight="800"
                  sx={{ color: "#065f46" }}
                >
                  {activeTowers}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
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
                <TowerIcon />
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight="600"
                >
                  TOTAL FLOORS
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight="800"
                  sx={{ color: "#091542" }}
                >
                  {totalFloors}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters Area */}
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
          placeholder="Search by tower name or project..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: { xs: "100%", md: 350 },
            "& fieldset": { borderRadius: "8px" },
          }}
        />

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value as string)}
            sx={filterSelectSx}
          >
            <MenuItem value="All Projects">All Projects</MenuItem>
            {projects.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </Select>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as string)}
            sx={filterSelectSx}
          >
            <MenuItem value="All Status">All Status</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </Box>
      </Box>

      {/* Table Section */}
      <TableContainer
        sx={{
          border: "1px solid #f0f0f0",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <Table sx={{ minWidth: 800 }} aria-label="towers table">
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell sx={{ color: "#091542", fontWeight: 700, py: 2 }}>
                <TableSortLabel
                  active={sortBy === "name"}
                  direction={sortBy === "name" ? sortOrder : "asc"}
                  onClick={() => handleSort("name")}
                >
                  Tower Name
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: "#091542", fontWeight: 700, py: 2 }}>
                <TableSortLabel
                  active={sortBy === "projectName"}
                  direction={sortBy === "projectName" ? sortOrder : "asc"}
                  onClick={() => handleSort("projectName")}
                >
                  Project Name
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: "#091542", fontWeight: 700, py: 2 }}>
                <TableSortLabel
                  active={sortBy === "totalFloors"}
                  direction={sortBy === "totalFloors" ? sortOrder : "asc"}
                  onClick={() => handleSort("totalFloors")}
                >
                  Total Floors
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: "#091542", fontWeight: 700, py: 2 }}>
                <TableSortLabel
                  active={sortBy === "status"}
                  direction={sortBy === "status" ? sortOrder : "asc"}
                  onClick={() => handleSort("status")}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell
                sx={{
                  color: "#091542",
                  fontWeight: 700,
                  py: 2,
                  textAlign: "right",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : (
              paginatedTowers.map((row) => {
                return (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        py: 2,
                        fontWeight: 700,
                        color: "#091542",
                        borderBottomColor: "#f0f0f0",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <TowerIcon sx={{ color: "text.secondary" }} />
                        <Box>
                          <Typography variant="body2" fontWeight="700">
                            {row.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", maxWidth: 200 }}
                            noWrap
                          >
                            {row.description}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        py: 2,
                        borderBottomColor: "#f0f0f0",
                        fontWeight: 600,
                      }}
                    >
                      {row.projectName}
                    </TableCell>
                    <TableCell
                      sx={{
                        py: 2,
                        borderBottomColor: "#f0f0f0",
                        fontWeight: 600,
                      }}
                    >
                      {row.totalFloors !== undefined
                        ? row.totalFloors
                        : row.floorsCount}{" "}
                      Floors
                    </TableCell>
                    <TableCell sx={{ py: 2, borderBottomColor: "#f0f0f0" }}>
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
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ py: 2, borderBottomColor: "#f0f0f0" }}
                    >
                      <IconButton
                        size="small"
                        sx={{
                          color: "#0047b3",
                          bgcolor: "#eff6ff",
                          mr: 1,
                          "&:hover": { bgcolor: "#d0e1fd" },
                        }}
                        onClick={() => navigate(`/tower/${row.id}`)}
                      >
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ color: "text.secondary", mr: 1 }}
                        onClick={() => navigate(`/tower/edit/${row.id}`)}
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
                    </TableCell>
                  </TableRow>
                );
              })
            )}
            {!loading && filteredTowers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    No towers found matching the filters.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Section */}
      <Box sx={{ mt: 3 }}>
        <Pagination
          page={page}
          totalResults={totalResults}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle sx={{ fontWeight: "bold", color: "#091542" }}>
          Delete Tower?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this tower? Deleting this tower will
            **permanently delete all Flats** associated with it. This action
            cannot be undone.
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
