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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PageHeader from "@/components/PageHeader";
import PageToolbar from "@/components/PageToolbar";
import DataTable from "@/components/DataTable";

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
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
    color: "#002855",
    borderRadius: "16px",
    bgcolor: "#f8fafc",
    ".MuiOutlinedInput-notchedOutline": { borderColor: "#e2e8f0" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#cbd5e1" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#002855",
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
      {/* Header Section */}
      {/* Header Section */}
      <PageHeader
        title="Staff Management"
        breadcrumbs={[
          { label: "Dashboard", link: "/" },
          { label: "Staff Management" },
        ]}
      />

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
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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
        }
      />

      {/* Table Section */}
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
                  sx={{ width: 44, height: 44, border: "2px solid #f1f5f9" }}
                />
                <Typography
                  variant="body1"
                  fontWeight="800"
                  color="#002855"
                  sx={{ "&:hover": { color: "#1d4ed8" } }}
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
                  bgcolor: "#eff6ff",
                  color: "#1d4ed8",
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
              <Typography variant="body2" fontWeight={800} color="#002855">
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
                  sx={{ color: "#0284c7" }}
                  onClick={() => navigate(`/staff/${row.id}`)}
                >
                  <VisibilityOutlinedIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{ color: "#002855" }}
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
    </Box>
  );
}
