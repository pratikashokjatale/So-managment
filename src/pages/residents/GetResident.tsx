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
  Avatar,
  IconButton,
  Select,
  MenuItem,
  Breadcrumbs,
  Link,
  Switch,
  Tabs,
  Tab,
  CircularProgress,
  Chip
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";

import Search from "../../components/Search";
import Pagination from "../../components/Pagination";
import ResidentRequests from "./components/ResidentRequests";
import RejectedRequests from "./components/RejectedRequests";
import { getUsersApi, updateUserApi } from "@/apis/user";
import { getTowers, getFlats } from "@/utils/setupStore";
import { toast } from "react-hot-toast";




export default function GetResident() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const [statusFilter, setStatusFilter] = useState("Active");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [aptFilter, setAptFilter] = useState("All Apartments");
  const [membershipFilter, setMembershipFilter] = useState("All Memberships");
  const [cardFilter, setCardFilter] = useState("All Cards");
  const [tabValue, setTabValue] = useState(0);

  // API Integration States
  const [residents, setResidents] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [activeCount, setActiveCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [activeRes, pendingRes, rejectedRes] = await Promise.all([
          getUsersApi({ page: 1, limit: 1, role: "RESIDENT", status: "ACTIVE" }),
          getUsersApi({ page: 1, limit: 1, role: "RESIDENT", status: "PENDING" }),
          getUsersApi({ page: 1, limit: 1, role: "RESIDENT", status: "SUSPENDED" })
        ]);
        
        const getCount = (res: any) => res?.data?.pagination?.total || res?.pagination?.total || 0;
        setActiveCount(getCount(activeRes));
        setPendingCount(getCount(pendingRes));
        setRejectedCount(getCount(rejectedRes));
      } catch (err) {
        console.warn("Failed to fetch resident counts:", err);
      }
    };
    fetchCounts();
  }, [tabValue]); // Refresh counts on tab change or actions


  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePageChange = (_event: any, value: number) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };


  const fetchResidents = async () => {
    setLoading(true);
    try {
      let statusParam: string | undefined = undefined;
      if (statusFilter === "Active") statusParam = "ACTIVE";
      else if (statusFilter === "Inactive") statusParam = "INACTIVE";

      const res = await getUsersApi({
        page,
        limit: rowsPerPage,
        search: searchQuery || undefined,
        role: roleFilter === "ALL" ? undefined : roleFilter,
        status: statusParam,
      });

      let list: any[] = [];
      if (res) {
        if (Array.isArray(res)) {
          list = res;
        } else if (res.data) {
          if (Array.isArray(res.data)) {
            list = res.data;
          } else if (res.data.items && Array.isArray(res.data.items)) {
            list = res.data.items;
          } else if (res.data.data && Array.isArray(res.data.data)) {
            list = res.data.data;
          } else if (res.data.users && Array.isArray(res.data.users)) {
            list = res.data.users;
          }
        } else if (res.items && Array.isArray(res.items)) {
          list = res.items;
        } else if (res.users && Array.isArray(res.users)) {
          list = res.users;
        }
      }

      const pagination = res?.data?.pagination || res?.pagination;
      setResidents(list);
      setTotalCount(pagination?.total || list.length);
    } catch (error) {
      console.warn("Failed to fetch residents via API:", error);
      setResidents([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tabValue === 0) {
      fetchResidents();
    }
  }, [page, rowsPerPage, searchQuery, tabValue, statusFilter, roleFilter]);

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    // Only proceed if it is a real DB user (non-mock)
    if (id.startsWith("mock-")) return;
    const nextStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await updateUserApi(id, { status: nextStatus });
      toast.success(`Resident status updated to ${nextStatus.toLowerCase()}`);
      fetchResidents();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update status");
    }
  };

  const filterSelectSx = {
    height: 36,
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "text.primary",
    boxShadow: "none",
    ".MuiOutlinedInput-notchedOutline": { border: "none" },
    "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
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
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ mb: 1, color: "#002855" }}
        >
          Residents
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
          <Typography color="text.primary" fontWeight="600">
            Residents
          </Typography>
        </Breadcrumbs>
      </Box>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={{
          mb: 4,
          borderBottom: "1px solid #f1f5f9",
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 800,
            fontSize: "0.95rem",
            minWidth: 120,
          },
          "& .Mui-selected": { color: "#0047b3 !important" },
          "& .MuiTabs-indicator": { backgroundColor: "#0047b3", height: 3 },
        }}
      >
        <Tab
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Active Residents
              {activeCount > 0 && <Chip label={activeCount} size="small" sx={{ height: 18, fontSize: '0.7rem', fontWeight: 800, bgcolor: '#e0f2fe', color: '#0369a1' }} />}
            </Box>
          }
        />
        <Tab
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Enrollment Requests
              {pendingCount > 0 && <Chip label={pendingCount} size="small" color="warning" sx={{ height: 18, fontSize: '0.7rem', fontWeight: 800 }} />}
            </Box>
          }
        />
        <Tab
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Rejected Requests
              {rejectedCount > 0 && <Chip label={rejectedCount} size="small" color="error" sx={{ height: 18, fontSize: '0.7rem', fontWeight: 800 }} />}
            </Box>
          }
        />
      </Tabs>

      {tabValue === 0 && (
        <>
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
              placeholder="Search by name, phone, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                width: { xs: "100%", md: 350 },
                "& fieldset": { borderRadius: "8px" },
              }}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="text"
                startIcon={<DownloadIcon />}
                sx={{
                  color: "text.primary",
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                Export
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/residents/add")}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  px: 3,
                  fontWeight: 600,
                  boxShadow: "none",
                }}
              >
                Add Resident
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 3,
              flexWrap: "wrap",
              p: 1,
              bgcolor: "#f8fafc",
              borderRadius: "12px",
            }}
          >
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as string)}
              sx={filterSelectSx}
            >
              <MenuItem value="All Status">All Status</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as string)}
              sx={filterSelectSx}
            >
              <MenuItem value="ALL">All Roles</MenuItem>
              <MenuItem value="RESIDENT">Resident</MenuItem>
              <MenuItem value="GUEST">Guest</MenuItem>
              <MenuItem value="STAFF">Staff</MenuItem>
              <MenuItem value="SECURITY">Security</MenuItem>
              <MenuItem value="MANAGER">Manager</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>
            </Select>
            <Select
              value={aptFilter}
              onChange={(e) => setAptFilter(e.target.value as string)}
              sx={filterSelectSx}
            >
              <MenuItem value="All Apartments">All Apartments</MenuItem>
            </Select>
            <Select
              value={membershipFilter}
              onChange={(e) => setMembershipFilter(e.target.value as string)}
              sx={filterSelectSx}
            >
              <MenuItem value="All Memberships">All Memberships</MenuItem>
            </Select>
            <Select
              value={cardFilter}
              onChange={(e) => setCardFilter(e.target.value as string)}
              sx={filterSelectSx}
            >
              <MenuItem value="All Cards">All Cards</MenuItem>
            </Select>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer
              sx={{
                overflowX: "auto",
                border: "1px solid #f1f5f9",
                borderRadius: "12px",
              }}
            >
              <Table sx={{ minWidth: 800 }} aria-label="residents table">
                <TableHead sx={{ bgcolor: "#f8fafc" }}>
                  <TableRow>
                    <TableCell
                      sx={{ color: "text.secondary", fontWeight: 700 }}
                    >
                      Resident
                    </TableCell>
                    <TableCell
                      sx={{ color: "text.secondary", fontWeight: 700 }}
                    >
                      Tower
                    </TableCell>
                    <TableCell
                      sx={{ color: "text.secondary", fontWeight: 700 }}
                    >
                      Apartment / Flat
                    </TableCell>
                    <TableCell
                      sx={{ color: "text.secondary", fontWeight: 700 }}
                    >
                      Role
                    </TableCell>
                    <TableCell
                      sx={{ color: "text.secondary", fontWeight: 700 }}
                    >
                      Card Type
                    </TableCell>
                    <TableCell
                      sx={{ color: "text.secondary", fontWeight: 700 }}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "text.secondary",
                        fontWeight: 700,
                        textAlign: "right",
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {residents.map((row) => {
                    const flat = row.flat || getFlats().find((f) => f.id === row.flatId);
                    const tower = getTowers().find((t) => t.id === flat?.towerId);
                    const towerName = row.towerName || flat?.tower?.name || flat?.towerName || tower?.name || (flat?.towerId ? "Tower " + flat.towerId.slice(0, 4).toUpperCase() : "N/A");
                    const flatNumber =
                      flat?.flatNumber || flat?.number || row.flatNumber || "N/A";
                    const isMock = row.id.startsWith("mock-");

                    return (
                      <TableRow
                        key={row.id}
                        hover
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{ borderBottomColor: "#f0f0f0" }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Avatar
                              src={
                                row.avatar ||
                                `https://i.pravatar.cc/150?u=${row.id}`
                              }
                              sx={{ width: 32, height: 32 }}
                            />
                            <Box>
                              <Typography variant="body2" fontWeight="700">
                                {row.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {row.phone || row.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ borderBottomColor: "#f0f0f0" }}>
                          <Typography
                            variant="body2"
                            fontWeight="600"
                            color="#002855"
                          >
                            {isMock ? row.tower : towerName}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ borderBottomColor: "#f0f0f0" }}>
                          <Typography variant="body2" fontWeight="600">
                            {isMock ? row.apartment : `Flat ${flatNumber}`}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ borderBottomColor: "#f0f0f0" }}>
                          <Typography
                            variant="body2"
                            fontWeight="600"
                            color="text.secondary"
                          >
                            {row.role}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ borderBottomColor: "#f0f0f0" }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                bgcolor: "#1d4ed8",
                                border: "1px solid #cbd5e1",
                              }}
                            />
                            <Typography variant="body2" fontWeight="600">
                              Blue Card
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ borderBottomColor: "#f0f0f0" }}>
                          <Switch
                            checked={
                              row.status?.toUpperCase() === "ACTIVE" ||
                              row.status?.toLowerCase() === "active"
                            }
                            onChange={() =>
                              handleStatusToggle(row.id, row.status)
                            }
                            disabled={isMock}
                            size="small"
                            color="success"
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": {
                                color: "#4caf50",
                              },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                { backgroundColor: "#4caf50" },
                            }}
                          />
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ borderBottomColor: "#f0f0f0" }}
                        >
                          <IconButton
                            size="small"
                            sx={{
                              color: "primary.main",
                              bgcolor: "#eff6ff",
                              mr: 1,
                            }}
                            onClick={() => navigate(`/residents/${row.id}`)}
                          >
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{ color: "text.secondary" }}
                            onClick={() =>
                              navigate(`/residents/edit/${row.id}`)
                            }
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{ color: "text.secondary" }}
                          >
                            <MoreVertOutlinedIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {residents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                          No residents found.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Box sx={{ mt: 2 }}>
            <Pagination
              page={page}
              totalResults={totalCount}
              rowsPerPage={rowsPerPage}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </Box>
        </>
      )}

      {tabValue === 1 && <ResidentRequests />}

      {tabValue === 2 && <RejectedRequests />}
    </Box>
  );
}
