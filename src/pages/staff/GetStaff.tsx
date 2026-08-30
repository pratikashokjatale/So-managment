import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
  MenuItem,
  Select,
  Switch,
  IconButton,
  Avatar,
  Chip,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import PageHeader from "@/components/PageHeader";
import PageToolbar from "@/components/PageToolbar";
import DataTable from "@/components/DataTable";
import Pagination from "@/components/Pagination";
import { QRCodeSVG } from "qrcode.react";
import logoImg from "@/assets/logo.jpeg";

import type { Staff } from "@/utils/staffStore";
import { getStaffListApi, updateStaffApi, deleteStaffApi } from "@/apis/staff";
import { getFileUrl } from "@/utils/file";

const mapBackendStaffToFrontend = (s: any) => {
  let dept = s.department || "Other";
  if (dept === "SECURITY") dept = "Security";
  else if (dept === "HOUSEKEEPING") dept = "Housekeeping";
  else if (dept === "MAINTENANCE") dept = "Maintenance";
  else if (dept === "ADMINISTRATION") dept = "Front Office";
  else if (dept === "SUPPORT") dept = "Front Office";
  else if (dept === "FACILITY") dept = "Maintenance";
  else if (dept === "OTHER") dept = "Other";

  let status = "Inactive";
  if (s.status === "ACTIVE") status = "Active";

  return {
    id: s.id,
    name: s.name,
    avatar:
      s.photoUrl || s.profilePhotoUrl || s.avatar || "",
    department: dept,
    phone: s.phone || "",
    email: s.email || "",
    cardNo: s.employeeCode || s.iCardNumber || s.cardNo || "",
    status: status as "Active" | "Inactive",
    joiningDate: s.joiningDate || "",
    address: s.address || "",
    emergencyContact: s.emergencyContactPhone || s.emergencyContact || "",
    facilityId: s.facilityId || "",
    facilityName: s.facility
      ? s.facility.name
      : s.facilityName || "General Duty",
  };
};

export default function GetStaff() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalResults, setTotalResults] = useState(0);

  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [loading, setLoading] = useState(true);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const params: any = { limit: rowsPerPage, page };
      if (searchQuery) params.search = searchQuery;
      if (deptFilter !== "All Departments") params.department = deptFilter;
      if (statusFilter !== "All Status")
        params.status = statusFilter === "Active" ? "ACTIVE" : "INACTIVE";

      const res = await getStaffListApi(params);
      const list =
        res?.data?.staff ||
        res?.data?.items ||
        res?.staff ||
        (Array.isArray(res?.data) ? res.data : null);
      if (Array.isArray(list)) {
        setStaffList(list.map(mapBackendStaffToFrontend));
      } else {
        setStaffList([]);
      }
      const pagination = res?.data?.pagination || res?.pagination;
      setTotalResults(
        pagination?.total || (Array.isArray(list) ? list.length : 0),
      );
    } catch (err) {
      console.warn("Failed to fetch staff list via API:", err);
      setStaffList([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [page, rowsPerPage, searchQuery, deptFilter, statusFilter]);

  const handlePageChange = (_event: any, value: number) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleStatusToggle = async (id: string) => {
    const staff = staffList.find((s) => s.id === id);
    if (!staff) return;
    const isCurrentlyActive = staff.status === "Active";
    const newStatus = isCurrentlyActive ? "INACTIVE" : "ACTIVE";

    try {
      await updateStaffApi(id, { status: newStatus });
      fetchStaff();
      toast.success(`Staff status changed to ${newStatus}`);
    } catch (err: any) {
      console.warn("Failed to toggle staff status via API, falling back:", err);
      toast.error(
        err?.response?.data?.message || "Failed to update staff status",
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStaffApi(id);
      fetchStaff();
      toast.success("Staff member deleted successfully!");
    } catch (err: any) {
      console.warn("Failed to delete staff member via API, falling back:", err);
      toast.error(
        err?.response?.data?.message || "Failed to delete staff member",
      );
    }

    const totalPages = Math.ceil(totalResults / rowsPerPage);
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  };

  const paginatedStaff = staffList;

  const filterSelectSx = {
    height: 44,
    minWidth: 180,
    fontSize: "0.875rem",
    fontWeight: 700,
    color: "#091542",
    borderRadius: "16px",
    bgcolor: "#f8fafc",
    ".MuiOutlinedInput-notchedOutline": { borderColor: "#e2e8f0" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#cbd5e1" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#091542",
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
      {/* Filters Section */}
      <PageToolbar
        searchPlaceholder="Search by name, phone or card..."
        searchValue={searchQuery}
        onSearchChange={(value) => {
          setSearchQuery(value);
          setPage(1);
        }}
        onAddClick={() => navigate("/staff/add")}
        addButtonLabel="Add Staff Member"
        filters={
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{ width: "100%", justifyContent: "space-between", alignItems: "center" }}
          >
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ width: { xs: "100%", md: "auto" } }}>
              <Select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value as string)}
                sx={filterSelectSx}
              >
                <MenuItem value="All Departments">All Departments</MenuItem>
                <MenuItem value="Security">Security</MenuItem>
                <MenuItem value="Housekeeping">Housekeeping</MenuItem>
                <MenuItem value="Maintenance">Maintenance</MenuItem>
                <MenuItem value="Front Office">Front Office</MenuItem>
                <MenuItem value="Fitness & Gym Training">
                  Fitness & Gym Training
                </MenuItem>
                <MenuItem value="Pool Operations">Pool Operations</MenuItem>
                <MenuItem value="Wellness & Spa">Wellness & Spa</MenuItem>
                <MenuItem value="Park & Gardens">Park & Gardens</MenuItem>
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
            </Stack>

            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_e, val) => val && setViewMode(val)}
              size="small"
              sx={{
                bgcolor: "#f1f5f9",
                p: "4px",
                borderRadius: "12px",
                border: "none",
                alignSelf: { xs: "flex-start", md: "center" },
                "& .MuiToggleButton-root": {
                  border: "none",
                  borderRadius: "8px",
                  px: 2,
                  py: 0.75,
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  textTransform: "none",
                  color: "#64748b",
                  "&.Mui-selected": {
                    bgcolor: "#ffffff",
                    color: "#091542",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    "&:hover": {
                      bgcolor: "#ffffff",
                    },
                  },
                },
              }}
            >
              <ToggleButton value="grid" aria-label="grid view">
                <ViewModuleIcon fontSize="small" sx={{ mr: 1 }} />
                Card View
              </ToggleButton>
              <ToggleButton value="table" aria-label="table view">
                <ViewListIcon fontSize="small" sx={{ mr: 1 }} />
                Table View
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        }
      />

      {viewMode === "table" ? (
        <DataTable
          columns={[
            {
              id: "name",
              label: "STAFF IDENTITY",
              render: (row) => (
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  onClick={() => navigate(`/staff/${row.id}`)}
                  sx={{ cursor: "pointer" }}
                >
                  <Avatar
                    src={getFileUrl(row.avatar)}
                    imgProps={{ crossOrigin: "anonymous" }}
                    sx={{ width: 44, height: 44, border: "2px solid #f1f5f9" }}
                  />
                  <Typography
                    variant="body1"
                    fontWeight="800"
                    color="#091542"
                    sx={{ "&:hover": { color: "#24528C" } }}
                  >
                    {row.name}
                  </Typography>
                </Stack>
              ),
            },
            {
              id: "department",
              label: "DEPARTMENT",
              render: (row) => (
                <Chip
                  label={row.department}
                  size="small"
                  sx={{
                    fontWeight: 900,
                    borderRadius: "8px",
                    bgcolor: "#EAF0F7",
                    color: "#24528C",
                  }}
                />
              ),
            },
            {
              id: "facilityName",
              label: "DUTY LOCATION / FACILITY",
              render: (row) => (
                <Chip
                  label={row.facilityName}
                  size="small"
                  sx={{
                    fontWeight: 900,
                    borderRadius: "8px",
                    bgcolor: "#f0fdf4",
                    color: "#16a34a",
                  }}
                />
              ),
            },
            {
              id: "phone",
              label: "PHONE NUMBER",
              render: (row) => (
                <Typography variant="body2" fontWeight={700} color="#1e293b">
                  {row.phone}
                </Typography>
              ),
            },
            {
              id: "cardNo",
              label: "CARD NUMBER",
              render: (row) => (
                <Typography variant="body2" fontWeight={800} color="#091542">
                  {row.cardNo}
                </Typography>
              ),
            },
            {
              id: "status",
              label: "ACTIVE STATUS",
              render: (row) => (
                <Switch
                  checked={row.status === "Active"}
                  onChange={() => handleStatusToggle(row.id)}
                  size="small"
                  color="success"
                />
              ),
            },
            {
              id: "actions",
              label: "ACTIONS",
              align: "right",
              render: (row) => (
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <IconButton
                    size="small"
                    sx={{ color: "#24528C" }}
                    onClick={() => navigate(`/staff/${row.id}`)}
                  >
                    <VisibilityOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ color: "#091542" }}
                    onClick={() => navigate(`/staff/edit/${row.id}`)}
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ color: "#f44336" }}
                    onClick={() => handleDelete(row.id)}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Stack>
              ),
            },
          ]}
          data={paginatedStaff}
          loading={loading}
          totalCount={totalResults}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          emptyMessage="No staff members found matching the criteria."
        />
      ) : (
        <Box sx={{ width: "100%" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 10 }}>
              <CircularProgress size={40} sx={{ color: "#24528C" }} />
            </Box>
          ) : paginatedStaff.length === 0 ? (
            <Box
              sx={{
                py: 8,
                textAlign: "center",
                border: "1px solid #f1f5f9",
                borderRadius: "16px",
                bgcolor: "white",
              }}
            >
              <Typography variant="body1" color="text.secondary" fontWeight={600}>
                No staff members found matching the criteria.
              </Typography>
            </Box>
          ) : (
            <Box>
              <Grid container spacing={4} sx={{ mb: 4 }}>
                {paginatedStaff.map((row) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={row.id} sx={{ display: "flex", justifyContent: "center" }}>
                    <Paper
                      elevation={0}
                      sx={{
                        width: "100%",
                        maxWidth: "340px",
                        p: 3,
                        borderRadius: "24px",
                        border: "1px solid #e2e8f0",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        bgcolor: "white",
                        boxShadow: "0 8px 25px rgba(9, 21, 66, 0.03)",
                        position: "relative",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          transform: "translateY(-6px)",
                          boxShadow: "0 15px 35px rgba(9, 21, 66, 0.08)",
                          borderColor: "#cbd5e1",
                          cursor: "pointer",
                        },
                      }}
                      onClick={() => navigate(`/staff/${row.id}`)}
                    >
                      {/* Dynamic Status Beacon */}
                      <Chip
                        label={row.status}
                        size="small"
                        color={row.status === "Active" ? "success" : "default"}
                        sx={{
                          position: "absolute",
                          top: 16,
                          right: 16,
                          fontWeight: 900,
                          fontSize: "0.6rem",
                          height: 18,
                        }}
                      />

                      {/* Marbella Logo & Crest Header */}
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
                        <Box
                          component="img"
                          src={logoImg}
                          alt="Marbella Crest"
                          sx={{
                            height: 40,
                            objectFit: "contain",
                          }}
                        />
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#091542",
                            fontWeight: 900,
                            letterSpacing: "1.5px",
                            fontFamily: "'Georgia', serif",
                            textTransform: "uppercase",
                            fontSize: "1rem",
                            lineHeight: 1.2,
                            mt: 0.5,
                          }}
                        >
                          Marbella
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#bf9f62",
                            fontWeight: 900,
                            letterSpacing: "2px",
                            textTransform: "uppercase",
                            fontSize: "0.55rem",
                            mt: 0.25,
                          }}
                        >
                          Harbans Vale
                        </Typography>
                      </Box>

                      {/* Styled Portrait Avatar Frame */}
                      <Box
                        sx={{
                          width: 90,
                          height: 90,
                          borderRadius: "14px",
                          border: "1px solid #cbd5e1",
                          p: "3px",
                          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.04)",
                          bgcolor: "#f8fafc",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 1.5,
                          overflow: "hidden",
                        }}
                      >
                        <Avatar
                          src={getFileUrl(row.avatar)}
                          imgProps={{ crossOrigin: "anonymous" }}
                          variant="rounded"
                          sx={{
                            width: "100%",
                            height: "100%",
                            fontSize: "2rem",
                            fontWeight: 900,
                            bgcolor: "#EAF0F7",
                            color: "#24528C",
                            borderRadius: "10px",
                          }}
                        >
                          {row.name
                            ? row.name
                                .split(" ")
                                .map((n: any) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()
                            : "ST"}
                        </Avatar>
                      </Box>

                      {/* Name & Rank */}
                      <Typography variant="body1" fontWeight="900" color="#24528C" noWrap sx={{ maxWidth: "100%" }}>
                        {row.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#bf9f62",
                          fontWeight: 800,
                          letterSpacing: "0.5px",
                          fontSize: "0.75rem",
                          mb: 1.5,
                        }}
                      >
                        {row.department}
                      </Typography>

                      {/* Employee ID Label & Number */}
                      <Box sx={{ mb: 1.5 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#64748b",
                            fontWeight: 800,
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                            fontSize: "0.6rem",
                            display: "block",
                            mb: 0.25,
                          }}
                        >
                          Employee ID Number
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#0f172a",
                            fontWeight: 900,
                            letterSpacing: "1px",
                            fontSize: "1rem",
                          }}
                        >
                          {row.cardNo || "ST-XXXXXX"}
                        </Typography>
                      </Box>

                      {/* Dynamic Assigned Duty Location Badge */}
                      <Chip
                        label={`Duty: ${row.facilityName}`}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          px: 0.75,
                          borderRadius: "6px",
                          bgcolor: "#f0fdf4",
                          color: "#16a34a",
                          border: "1px solid #dcfce7",
                          mb: 2,
                          fontSize: "0.7rem",
                          height: 20,
                        }}
                      />

                      {/* Verified QR Scanner Block */}
                      <Box
                        sx={{
                          p: 1.5,
                          bgcolor: "#f8fafc",
                          borderRadius: "12px",
                          display: "inline-block",
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.01)",
                          transition: "transform 0.3s",
                          "&:hover": { transform: "scale(1.03)" },
                        }}
                      >
                        <QRCodeSVG
                          value={
                            row.cardNo ||
                            `STAFF_VERIFIED:${row.cardNo}:${row.name}:${row.department}:${row.facilityName}`
                          }
                          size={90}
                          level="H"
                        />
                      </Box>

                      {/* Action Buttons Footer */}
                      <Box
                        sx={{
                          width: "100%",
                          mt: 2.5,
                          pt: 1.5,
                          borderTop: "1px solid #f1f5f9",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                        onClick={(e) => e.stopPropagation()} // Prevent card navigation click when interacting with controls
                      >
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Typography variant="caption" fontWeight="800" color="#64748b" sx={{ fontSize: "0.7rem" }}>
                            Active
                          </Typography>
                          <Switch
                            checked={row.status === "Active"}
                            onChange={() => handleStatusToggle(row.id)}
                            size="small"
                            color="success"
                          />
                        </Stack>
                        <Stack direction="row" spacing={0.5}>
                          <IconButton
                            size="small"
                            sx={{ color: "#24528C", bgcolor: "#f0f9ff", "&:hover": { bgcolor: "#e0f2fe" }, p: 0.75 }}
                            onClick={() => navigate(`/staff/${row.id}`)}
                          >
                            <VisibilityOutlinedIcon sx={{ fontSize: "1.1rem" }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{ color: "#091542", bgcolor: "#f1f5f9", "&:hover": { bgcolor: "#e2e8f0" }, p: 0.75 }}
                            onClick={() => navigate(`/staff/edit/${row.id}`)}
                          >
                            <EditOutlinedIcon sx={{ fontSize: "1.1rem" }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{ color: "#ef4444", bgcolor: "#fef2f2", "&:hover": { bgcolor: "#fee2e2" }, p: 0.75 }}
                            onClick={() => handleDelete(row.id)}
                          >
                            <DeleteOutlineIcon sx={{ fontSize: "1.1rem" }} />
                          </IconButton>
                        </Stack>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
                <Pagination
                  page={page}
                  totalResults={totalResults}
                  rowsPerPage={rowsPerPage}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                />
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
