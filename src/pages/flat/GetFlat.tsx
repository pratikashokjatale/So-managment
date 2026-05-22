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
  EditOutlined as EditOutlinedIcon,
  DeleteOutline as DeleteIcon,
  DoorBackSharp as FlatIcon,
  Add as AddIcon,
  Person as OwnerIcon,
  FiberManualRecord as DotIcon,
} from "@mui/icons-material";

import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import { getFlats, deleteFlat } from "@/utils/setupStore";
import { getProjectsApi } from "@/apis/project";
import { getTowersApi } from "@/apis/tower";
import { getFlatsApi } from "@/apis/flat";
import { CircularProgress } from "@mui/material";
import { getCachedTowersSequentially, getCachedFlatsSequentially } from "@/utils/apiCache";
export default function GetFlat() {
  const navigate = useNavigate();
  const [flats, setFlats] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [towers, setTowers] = useState<any[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [towerFilter, setTowerFilter] = useState("All Towers");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Sorting states
  const [sortBy, setSortBy] = useState<string>("number");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (field: string) => {
    const isAsc = sortBy === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortBy(field);
  };

  // Pagination states
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
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

  const fetchFlats = async () => {
    setLoading(true);
    try {
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

      let towerList = towers;
      if (projectFilter !== "All Projects") {
        const res = await getTowersApi(projectFilter, { page: 1, limit: 100 });
        const list = Array.isArray(res?.data?.data)
          ? res.data.data
          : res?.data?.towers || res?.towers || res?.data || [];
        towerList = list;
        setTowers(list);
      } else {
        const projectIds = projectList.map((p: any) => p.id);
        const list = await getCachedTowersSequentially(projectIds);
        
        // Add projectName attribute mapping
        const mappedList = list.map((t: any) => {
          const p = projectList.find((proj: any) => proj.id === t.projectId);
          return { ...t, projectName: p ? p.name : "" };
        });
        
        towerList = mappedList;
        setTowers(mappedList);
      }

      let mergedFlats: any[] = [];

      if (towerFilter !== "All Towers") {
        const res = await getFlatsApi(towerFilter, { page: 1, limit: 100 });
        const list = Array.isArray(res?.data?.data)
          ? res.data.data
          : res?.data?.flats || res?.flats || res?.data || [];
        
        const currentTower = towerList.find((t) => t.id === towerFilter);
        mergedFlats = list.map((f: any) => ({
          ...f,
          towerName: currentTower ? currentTower.name : "",
          projectName: currentTower ? currentTower.projectName : "",
        }));
      } else {
        const targetTowers =
          projectFilter === "All Projects"
            ? towerList
            : towerList.filter((t) => t.projectId === projectFilter);

        const towerIds = targetTowers.map((t) => t.id);
        const flatsList = await getCachedFlatsSequentially(towerIds);
        
        // Map flats back to project / tower names
        mergedFlats = flatsList.map((f: any) => {
          const t = targetTowers.find((tw) => tw.id === f.towerId);
          return {
            ...f,
            towerName: t ? t.name : "",
            projectName: t ? t.projectName : "",
          };
        });
      }

      const uiFlats = mergedFlats.map((f) => {
        let normStatus = f.status || "Vacant";
        if (normStatus === "VACANT") normStatus = "Vacant";
        else if (normStatus === "OCCUPIED") normStatus = "Occupied";
        else if (normStatus === "MAINTENANCE") normStatus = "Maintenance";

        const t = towerList.find((tw) => tw.id === f.towerId);
        const p = projectList.find((pr) => pr.id === f.projectId);

        return {
          id: f.id,
          projectId: f.projectId,
          towerId: f.towerId,
          number: f.flatNumber || f.number,
          floor: f.floorNumber || f.floor,
          type: f.flatType || f.type,
          occupancyType: f.occupancyType,
          status: normStatus,
          projectName: f.projectName || p?.name || "Unknown Project",
          towerName: f.towerName || t?.name || "Unknown Tower",
        };
      });

      setFlats(uiFlats);
      setTotalCount(uiFlats.length);
      setIsApiMode(true);
    } catch (error) {
      console.warn(
        "Failed to fetch flats via API, performing local storage fallback:",
        error,
      );
      const localFlats = getFlats();
      setFlats(localFlats);
      setTotalCount(localFlats.length);
      setIsApiMode(false);
    } finally {
      setLoading(false);
    }
  };

  // Load data
  useEffect(() => {
    fetchFlats();
  }, [projectFilter, towerFilter]);

  // Reset page to 1 on filter changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, projectFilter, towerFilter, typeFilter, statusFilter]);

  // Cascaded towers dropdown
  const filteredTowersForSelect =
    projectFilter === "All Projects"
      ? towers
      : towers.filter((t) => t.projectId === projectFilter);

  // Reset tower filter if project filter changes and old tower does not belong to new project
  const handleProjectFilterChange = (projId: string) => {
    setProjectFilter(projId);
    setTowerFilter("All Towers"); // Reset tower selection
  };

  // Metrics
  const totalFlats = isApiMode ? totalCount : flats.length;
  const occupiedCount = flats.filter((f) => f.status === "Occupied").length;
  const vacantCount = flats.filter((f) => f.status === "Vacant").length;
  const maintenanceCount = flats.filter(
    (f) => f.status === "Maintenance",
  ).length;

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteFlat(deleteId);
      if (isApiMode) {
        fetchFlats();
      } else {
        setFlats(getFlats()); // Refresh
      }
      setDeleteId(null);
    }
  };

  const filteredFlats = flats.filter((f) => {
    const matchesSearch =
      (f.number || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.projectName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.towerName || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject =
      projectFilter === "All Projects" || f.projectId === projectFilter;
    const matchesTower =
      towerFilter === "All Towers" || f.towerId === towerFilter;
    const matchesType = typeFilter === "All Types" || f.type === typeFilter;
    const matchesStatus =
      statusFilter === "All Status" || f.status === statusFilter;

    return (
      matchesSearch &&
      matchesProject &&
      matchesTower &&
      matchesType &&
      matchesStatus
    );
  });

  const sortedFlats = [...filteredFlats].sort((a, b) => {
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

  const paginatedFlats = sortedFlats.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Occupied":
        return { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" }; // blue
      case "Vacant":
        return { bg: "#ecfdf5", text: "#047857", border: "#a7f3d0" }; // green
      case "Maintenance":
        return { bg: "#fffbeb", text: "#b45309", border: "#fde68a" }; // amber
      default:
        return { bg: "#f8fafc", text: "text.secondary", border: "#e2e8f0" };
    }
  };

  const filterSelectSx = {
    height: 38,
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "text.primary",
    bgcolor: "#f8fafc",
    borderRadius: "8px",
    boxShadow: "none",
    minWidth: 130,
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
            sx={{ mb: 1, color: "#002855" }}
          >
            Flats
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
              Flats
            </Typography>
          </Breadcrumbs>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/flat/add")}
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
          Add Flat
        </Button>
      </Box>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              bgcolor: "#fffbeb",
              borderRadius: "12px",
              boxShadow: "none",
              border: "1px solid #fef3c7",
            }}
          >
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: "#f59e0b",
                  color: "#ffffff",
                  borderRadius: "8px",
                  display: "flex",
                }}
              >
                <FlatIcon />
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight="600"
                >
                  TOTAL FLATS
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight="800"
                  sx={{ color: "#92400e" }}
                >
                  {totalFlats}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              bgcolor: "#eff6ff",
              borderRadius: "12px",
              boxShadow: "none",
              border: "1px solid #bfdbfe",
            }}
          >
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: "#1d4ed8",
                  color: "#ffffff",
                  borderRadius: "8px",
                  display: "flex",
                }}
              >
                <OwnerIcon />
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight="600"
                >
                  OCCUPIED FLATS
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight="800"
                  sx={{ color: "#1e3a8a" }}
                >
                  {occupiedCount}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                  VACANT FLATS
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight="800"
                  sx={{ color: "#065f46" }}
                >
                  {vacantCount}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              bgcolor: "#fff1f2",
              borderRadius: "12px",
              boxShadow: "none",
              border: "1px solid #fecdd3",
            }}
          >
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: "#f43f5e",
                  color: "#ffffff",
                  borderRadius: "8px",
                  display: "flex",
                }}
              >
                <FlatIcon />
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight="600"
                >
                  MAINTENANCE
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight="800"
                  sx={{ color: "#9f1239" }}
                >
                  {maintenanceCount}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dynamic Cascaded Filters Area */}
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
          placeholder="Search by flat, resident, project..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: { xs: "100%", md: 350 },
            "& fieldset": { borderRadius: "8px" },
          }}
        />

        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Select
            value={projectFilter}
            onChange={(e) =>
              handleProjectFilterChange(e.target.value as string)
            }
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
            value={towerFilter}
            onChange={(e) => setTowerFilter(e.target.value as string)}
            sx={filterSelectSx}
            disabled={projectFilter === "All Projects" && towers.length > 5}
          >
            <MenuItem value="All Towers">All Towers</MenuItem>
            {filteredTowersForSelect.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {t.name} ({t.projectName})
              </MenuItem>
            ))}
          </Select>

          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as string)}
            sx={filterSelectSx}
          >
            <MenuItem value="All Types">All Types</MenuItem>
            <MenuItem value="1BHK">1BHK</MenuItem>
            <MenuItem value="2BHK">2BHK</MenuItem>
            <MenuItem value="3BHK">3BHK</MenuItem>
            <MenuItem value="4BHK">4BHK</MenuItem>
            <MenuItem value="Studio">Studio</MenuItem>
            <MenuItem value="Penthouse">Penthouse</MenuItem>
          </Select>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as string)}
            sx={filterSelectSx}
          >
            <MenuItem value="All Status">All Status</MenuItem>
            <MenuItem value="Vacant">Vacant</MenuItem>
            <MenuItem value="Occupied">Occupied</MenuItem>
            <MenuItem value="Maintenance">Maintenance</MenuItem>
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
        <Table sx={{ minWidth: 800 }} aria-label="flats table">
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell sx={{ color: "#002855", fontWeight: 700, py: 2 }}>
                <TableSortLabel
                  active={sortBy === "number"}
                  direction={sortBy === "number" ? sortOrder : "asc"}
                  onClick={() => handleSort("number")}
                >
                  Flat Number
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: "#002855", fontWeight: 700, py: 2 }}>
                <TableSortLabel
                  active={sortBy === "towerName"}
                  direction={sortBy === "towerName" ? sortOrder : "asc"}
                  onClick={() => handleSort("towerName")}
                >
                  Tower & Project
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: "#002855", fontWeight: 700, py: 2 }}>
                <TableSortLabel
                  active={sortBy === "floor"}
                  direction={sortBy === "floor" ? sortOrder : "asc"}
                  onClick={() => handleSort("floor")}
                >
                  Floor
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: "#002855", fontWeight: 700, py: 2 }}>
                <TableSortLabel
                  active={sortBy === "type"}
                  direction={sortBy === "type" ? sortOrder : "asc"}
                  onClick={() => handleSort("type")}
                >
                  Flat Type
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: "#002855", fontWeight: 700, py: 2 }}>
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
                  color: "#002855",
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
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : (
              paginatedFlats.map((row) => {
                const colors = getStatusColor(row.status);

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
                        color: "#0047b3",
                        borderBottomColor: "#f0f0f0",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <FlatIcon sx={{ color: "text.secondary" }} />
                        <Typography variant="body2" fontWeight="700">
                          {row.number}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2, borderBottomColor: "#f0f0f0" }}>
                      <Typography
                        variant="body2"
                        fontWeight="700"
                        color="#002855"
                      >
                        {row.towerName}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block" }}
                      >
                        {row.projectName}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        py: 2,
                        borderBottomColor: "#f0f0f0",
                        fontWeight: 600,
                      }}
                    >
                      {row.floor}
                    </TableCell>
                    <TableCell
                      sx={{
                        py: 2,
                        borderBottomColor: "#f0f0f0",
                        fontWeight: 600,
                      }}
                    >
                      {row.type}
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
                          bgcolor: colors.bg,
                          color: colors.text,
                          border: `1px solid ${colors.border}`,
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
                        sx={{ color: "text.secondary", mr: 1 }}
                        onClick={() => navigate(`/flat/edit/${row.id}`)}
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
            {!loading && filteredFlats.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    No flats found matching the criteria.
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
          totalResults={filteredFlats.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[10, 20, 50, 100]}
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle sx={{ fontWeight: "bold", color: "#002855" }}>
          Delete Flat?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this flat? This will permanently
            delete the flat record and associated owner/occupant links. This
            action cannot be undone.
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
