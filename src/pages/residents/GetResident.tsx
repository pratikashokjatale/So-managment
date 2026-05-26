import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Select,
  MenuItem,
  Switch,
  Chip
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";

import PageHeader from "@/components/PageHeader";
import PageToolbar from "@/components/PageToolbar";
import DataTable from "@/components/DataTable";
import ResidentRequests from "./components/ResidentRequests";
import RejectedRequests from "./components/RejectedRequests";
import { getUsersApi, updateUserApi } from "@/apis/user";
import { getTowers, getFlats } from "@/utils/setupStore";
import { toast } from "react-hot-toast";
import AddResident from "./AddResident";
import { getFileUrl } from "@/utils/file";




export default function GetResident() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const [roleFilter, setRoleFilter] = useState("ALL");
  const [aptFilter, setAptFilter] = useState("All Apartments");
  const [membershipFilter, setMembershipFilter] = useState("All Memberships");
  const [cardFilter, setCardFilter] = useState("All Cards");
  const [tabValue, setTabValue] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
      const res = await getUsersApi({
        page,
        limit: rowsPerPage,
        search: searchQuery || undefined,
        role: "RESIDENT",
        status: "ACTIVE",
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
  }, [page, rowsPerPage, searchQuery, tabValue]);

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
      <PageHeader
        title="Residents"
        breadcrumbs={[{ label: 'Dashboard', link: '/' }, { label: 'Residents' }]}
        currentTab={tabValue}
        onTabChange={handleTabChange}
        tabs={[
          {
            label: (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Active Residents
                {activeCount > 0 && <Chip label={activeCount} size="small" sx={{ height: 18, fontSize: '0.7rem', fontWeight: 800, bgcolor: '#e0f2fe', color: '#0369a1' }} />}
              </Box>
            ),
            value: 0
          },
          {
            label: (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Enrollment Requests
                {pendingCount > 0 && <Chip label={pendingCount} size="small" color="warning" sx={{ height: 18, fontSize: '0.7rem', fontWeight: 800 }} />}
              </Box>
            ),
            value: 1
          },
          {
            label: (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Rejected Requests
                {rejectedCount > 0 && <Chip label={rejectedCount} size="small" color="error" sx={{ height: 18, fontSize: '0.7rem', fontWeight: 800 }} />}
              </Box>
            ),
            value: 2
          }
        ]}
      />

      {tabValue === 0 && (
        <>
          <PageToolbar
            searchPlaceholder="Search by name, phone, email..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            onAddClick={() => setIsAddModalOpen(true)}
            addButtonLabel="Add Resident"
            showExport={true}
            filters={
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", p: 1, bgcolor: "#f8fafc", borderRadius: "12px", width: "100%" }}>
                <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as string)} sx={filterSelectSx}>
                  <MenuItem value="ALL">All Roles</MenuItem>
                  <MenuItem value="RESIDENT">Resident</MenuItem>
                  <MenuItem value="GUEST">Guest</MenuItem>
                  <MenuItem value="STAFF">Staff</MenuItem>
                  <MenuItem value="SECURITY">Security</MenuItem>
                  <MenuItem value="MANAGER">Manager</MenuItem>
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>
                </Select>
                <Select value={aptFilter} onChange={(e) => setAptFilter(e.target.value as string)} sx={filterSelectSx}>
                  <MenuItem value="All Apartments">All Apartments</MenuItem>
                </Select>
                <Select value={membershipFilter} onChange={(e) => setMembershipFilter(e.target.value as string)} sx={filterSelectSx}>
                  <MenuItem value="All Memberships">All Memberships</MenuItem>
                </Select>
                <Select value={cardFilter} onChange={(e) => setCardFilter(e.target.value as string)} sx={filterSelectSx}>
                  <MenuItem value="All Cards">All Cards</MenuItem>
                </Select>
              </Box>
            }
          />

          <DataTable
            columns={[
              {
                id: 'resident',
                label: 'Resident',
                render: (row) => (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar src={getFileUrl(row.photoUrl || row.profilePhotoUrl || row.avatar)} sx={{ width: 32, height: 32 }} />
                    <Box>
                      <Typography variant="body2" fontWeight="700">{row.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{row.phone || row.email}</Typography>
                    </Box>
                  </Box>
                )
              },
              {
                id: 'tower',
                label: 'Tower',
                render: (row) => {
                  const flat = row.flat || getFlats().find((f) => f.id === row.flatId);
                  const tower = getTowers().find((t) => t.id === flat?.towerId);
                  const towerName = row.towerName || flat?.tower?.name || flat?.towerName || tower?.name || (flat?.towerId ? "Tower " + flat.towerId.slice(0, 4).toUpperCase() : "N/A");
                  return <Typography variant="body2" fontWeight="600" color="#002855">{row.id.startsWith("mock-") ? row.tower : towerName}</Typography>;
                }
              },
              {
                id: 'apartment',
                label: 'Apartment / Flat',
                render: (row) => {
                  const flat = row.flat || getFlats().find((f) => f.id === row.flatId);
                  const flatNumber = flat?.flatNumber || flat?.number || row.flatNumber || "N/A";
                  return <Typography variant="body2" fontWeight="600">{row.id.startsWith("mock-") ? row.apartment : `Flat ${flatNumber}`}</Typography>;
                }
              },
              {
                id: 'role',
                label: 'Role',
                render: (row) => <Typography variant="body2" fontWeight="600" color="text.secondary">{row.role}</Typography>
              },
              {
                id: 'cardType',
                label: 'Card Type',
                render: () => (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#1d4ed8", border: "1px solid #cbd5e1" }} />
                    <Typography variant="body2" fontWeight="600">Blue Card</Typography>
                  </Box>
                )
              },
              {
                id: 'status',
                label: 'Status',
                render: (row) => (
                  <Switch
                    checked={row.status?.toUpperCase() === "ACTIVE" || row.status?.toLowerCase() === "active"}
                    onChange={() => handleStatusToggle(row.id, row.status)}
                    disabled={row.id.startsWith("mock-")}
                    size="small"
                    color="success"
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": { color: "#4caf50" },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#4caf50" },
                    }}
                  />
                )
              },
              {
                id: 'actions',
                label: 'Actions',
                align: 'right',
                render: (row) => (
                  <>
                    <IconButton size="small" sx={{ color: "primary.main", bgcolor: "#eff6ff", mr: 1 }} onClick={() => navigate(`/residents/${row.id}`)}>
                      <VisibilityOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" sx={{ color: "text.secondary" }} onClick={() => navigate(`/residents/edit/${row.id}`)}>
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" sx={{ color: "text.secondary" }}>
                      <MoreVertOutlinedIcon fontSize="small" />
                    </IconButton>
                  </>
                )
              }
            ]}
            data={residents}
            loading={loading}
            totalCount={totalCount}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            emptyMessage="No residents found."
          />
        </>
      )}

      {tabValue === 1 && <ResidentRequests />}

      {tabValue === 2 && <RejectedRequests />}

      {isAddModalOpen && (
        <AddResident 
          open={isAddModalOpen} 
          onClose={() => {
            setIsAddModalOpen(false);
            fetchResidents();
          }} 
        />
      )}
    </Box>
  );
}
