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
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";

import Search from "../../components/Search";
import Pagination from "../../components/Pagination";
import ResidentRequests from "./components/ResidentRequests";
import { getUsersApi, updateUserApi } from "@/apis/user";
import { getTowers, getFlats } from "@/utils/setupStore";
import { toast } from "react-hot-toast";
import { getCachedProjects, getCachedTowersSequentially, getCachedFlatsSequentially } from "@/utils/apiCache";



export default function GetResident() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const [statusFilter, setStatusFilter] = useState("Active");
  const [aptFilter, setAptFilter] = useState("All Apartments");
  const [membershipFilter, setMembershipFilter] = useState("All Memberships");
  const [cardFilter, setCardFilter] = useState("All Cards");
  const [tabValue, setTabValue] = useState(0);

  // API Integration States
  const [residents, setResidents] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [towers, setTowers] = useState<any[]>([]);
  const [flats, setFlats] = useState<any[]>([]);

  // Rejected residents state
  const [rejectedResidents, setRejectedResidents] = useState<any[]>([]);
  const [rejectedTotal, setRejectedTotal] = useState(0);
  const [rejectedLoading, setRejectedLoading] = useState(false);

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

  const loadSetupData = async () => {
    try {
      const projectList = await getCachedProjects();
      const projectIds = projectList.map((p: any) => p.id);
      const towerList = await getCachedTowersSequentially(projectIds);
      setTowers(towerList);

      const towerIds = towerList.map((t: any) => t.id);
      const flatList = await getCachedFlatsSequentially(towerIds);
      setFlats(flatList);
    } catch (error) {
      console.warn(
        "Failed to load setup configurations, falling back to local storage:",
        error,
      );
      setTowers(getTowers());
      setFlats(getFlats());
    }
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
        role: "RESIDENT",
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
    loadSetupData();
  }, []);

  useEffect(() => {
    if (tabValue === 0) {
      fetchResidents();
    }
  }, [page, rowsPerPage, searchQuery, tabValue, statusFilter]);

  const fetchRejectedResidents = async () => {
    setRejectedLoading(true);
    try {
      const res = await getUsersApi({
        page,
        limit: rowsPerPage,
        search: searchQuery || undefined,
        role: "RESIDENT",
        status: "SUSPENDED",
      });
      let list: any[] = [];
      if (res?.data?.items && Array.isArray(res.data.items)) list = res.data.items;
      else if (res?.data?.data && Array.isArray(res.data.data)) list = res.data.data;
      else if (res?.data?.users && Array.isArray(res.data.users)) list = res.data.users;
      else if (Array.isArray(res?.data)) list = res.data;
      const pagination = res?.data?.pagination || res?.pagination;
      setRejectedResidents(list);
      setRejectedTotal(pagination?.total || list.length);
    } catch (error) {
      console.warn("Failed to fetch rejected residents:", error);
      setRejectedResidents([]);
    } finally {
      setRejectedLoading(false);
    }
  };

  const handleRestore = async (id: string, name: string) => {
    try {
      await updateUserApi(id, { status: "PENDING" });
      toast.success(`${name} restored to pending`);
      fetchRejectedResidents();
    } catch (error: any) {
      toast.error(error?.message || "Failed to restore resident");
    }
  };

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
        <Tab label="Active Residents" />
        <Tab label="Enrollment Requests" />
        <Tab
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Rejected Requests
              {rejectedTotal > 0 && (
                <Chip label={rejectedTotal} size="small" color="error" sx={{ height: 18, fontSize: '0.7rem', fontWeight: 800 }} />
              )}
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
                    const flat = row.flat || flats.find((f) => f.id === row.flatId);
                    const tower = towers.find((t) => t.id === flat?.towerId);
                    const towerName = tower?.name || "N/A";
                    const flatNumber =
                      flat?.flatNumber || flat?.number || "N/A";
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

      {tabValue === 2 && (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" fontWeight="900" color="#002855">Rejected Requests</Typography>
              <Typography variant="body2" color="text.secondary">Residents whose enrollment was rejected or suspended.</Typography>
            </Box>
            <Chip label={`${rejectedTotal} Records`} color="error" sx={{ fontWeight: 800, borderRadius: '8px' }} />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Search
              placeholder="Search rejected residents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ width: { xs: '100%', md: 350 }, '& fieldset': { borderRadius: '8px' } }}
            />
          </Box>

          {rejectedLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
          ) : (
            <TableContainer sx={{ overflowX: 'auto', border: '1px solid #f1f5f9', borderRadius: '12px' }}>
              <Table sx={{ minWidth: 700 }}>
                <TableHead sx={{ bgcolor: '#fef2f2' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#64748b', fontWeight: 700 }}>Resident</TableCell>
                    <TableCell sx={{ color: '#64748b', fontWeight: 700 }}>Flat</TableCell>
                    <TableCell sx={{ color: '#64748b', fontWeight: 700 }}>Submitted</TableCell>
                    <TableCell sx={{ color: '#64748b', fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ color: '#64748b', fontWeight: 700, textAlign: 'right' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rejectedResidents.map((row) => {
                    const flat = row.flat;
                    return (
                      <TableRow key={row.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              src={`https://i.pravatar.cc/150?u=${row.id}`}
                              sx={{ width: 36, height: 36, bgcolor: '#fee2e2', color: '#ef4444', fontWeight: 900 }}
                            >
                              {row.name?.[0]}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="700">{row.name}</Typography>
                              <Typography variant="caption" color="text.secondary">{row.email || row.phone}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="600" color="text.secondary">
                            {flat ? `Flat ${flat.flatNumber} • Floor ${flat.floorNumber}` : (row.flatId || 'N/A')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                            {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label="SUSPENDED"
                            size="small"
                            sx={{ bgcolor: '#fee2e2', color: '#ef4444', fontWeight: 800, borderRadius: '6px' }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="outlined"
                            color="success"
                            onClick={() => handleRestore(row.id, row.name)}
                            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '8px', mr: 1 }}
                          >
                            Restore
                          </Button>
                          <IconButton
                            size="small"
                            sx={{ color: 'primary.main', bgcolor: '#eff6ff' }}
                            onClick={() => navigate(`/residents/${row.id}`)}
                          >
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {rejectedResidents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                        <Typography variant="body2" color="text.secondary">No rejected residents found.</Typography>
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
              totalResults={rejectedTotal}
              rowsPerPage={rowsPerPage}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}
