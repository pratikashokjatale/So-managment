import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Switch,
  Chip,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import PageToolbar from "@/components/PageToolbar";
import DataTable from "@/components/DataTable";
import { getRolesApi } from "@/apis/roles";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function GetRoles() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const [roles, setRoles] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await getRolesApi({
        page,
        limit: rowsPerPage,
        search: searchQuery || undefined,
      });

      let list: any[] = [];
      if (res) {
        if (Array.isArray(res)) list = res;
        else if (res.data && Array.isArray(res.data)) list = res.data;
        else if (res.data && typeof res.data === 'object') {
          const possibleArr = Object.values(res.data).find(v => Array.isArray(v));
          if (possibleArr) list = possibleArr as any[];
        }
        else if (typeof res === 'object') {
          const possibleArr = Object.values(res).find(v => Array.isArray(v));
          if (possibleArr) list = possibleArr as any[];
        }
      }
      const pagination = res?.data?.pagination || res?.pagination;
      setRoles(list);
      setTotalCount(pagination?.total || list.length);
    } catch (error: any) {
      console.warn("Failed to fetch roles via API:", error);
      toast.error(error?.message || "Failed to fetch roles");
      setRoles([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [page, rowsPerPage, searchQuery]);

  const handlePageChange = (_event: any, value: number) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleEditClick = (role: any) => {
    navigate('/setup/roles/edit', { state: { role } });
  };

  const handleAddClick = () => {
    navigate('/setup/roles/add');
  };

  const permissionColumns = [
    { key: "view", label: "View" },
    { key: "book", label: "Book" },
    { key: "blockCards", label: "Block" },
    { key: "attendance", label: "Attend" },
    { key: "documents", label: "Docs" },
    { key: "crm", label: "CRM" },
    { key: "issuePasses", label: "Passes" },
    { key: "analytics", label: "Stats" },
    { key: "enroll", label: "Enroll" },
    { key: "integrations", label: "Integrate" },
    { key: "roles", label: "Roles" },
  ].map((perm) => ({
    id: `perm_${perm.key}`,
    label: perm.label,
    align: "center" as const,
    render: (row: any) =>
      row.permissions?.[perm.key] ? (
        <CheckIcon sx={{ color: "#10b981", fontSize: 20 }} />
      ) : (
        <CloseIcon sx={{ color: "#cbd5e1", fontSize: 20 }} />
      ),
  }));

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
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="800" color="#0f172a">
          Roles & Permissions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage access controls and configure custom role profiles.
        </Typography>
      </Box>

      <PageToolbar
        searchPlaceholder="Search roles by name or code..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={handleAddClick}
        addButtonLabel="Create Role"
      />

      <DataTable
        columns={[
          {
            id: 'name',
            label: 'Role Name',
            render: (row) => (
              <Box>
                <Typography variant="body2" fontWeight="700">{row.name}</Typography>
                <Typography variant="caption" color="text.secondary">Code: {row.code}</Typography>
              </Box>
            )
          },
          {
            id: 'baseRole',
            label: 'Base Role',
            render: (row) => <Chip label={row.baseRole} size="small" sx={{ fontWeight: 700, bgcolor: "#e2e8f0", color: "#334155", fontSize: "0.75rem" }} />
          },
          ...permissionColumns,
          {
            id: 'status',
            label: 'Status',
            render: (row) => (
              <Chip 
                label={row.status} 
                size="small" 
                color={row.status === "ACTIVE" ? "success" : "default"} 
                sx={{ fontWeight: 700, fontSize: "0.7rem", height: 20 }} 
              />
            )
          },
          {
            id: 'actions',
            label: 'Actions',
            align: 'right',
            render: (row) => (
              <IconButton size="small" sx={{ color: "text.secondary" }} onClick={() => handleEditClick(row)}>
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            )
          }
        ]}
        data={roles}
        loading={loading}
        totalCount={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        emptyMessage="No roles found. Create one to get started."
      />
    </Box>
  );
}
