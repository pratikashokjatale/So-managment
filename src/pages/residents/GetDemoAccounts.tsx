import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { toast } from "react-hot-toast";

import PageToolbar from "@/components/PageToolbar";
import DataTable from "@/components/DataTable";
import { getUsersApi, deleteUserApi } from "@/apis/user";
import { getFileUrl } from "@/utils/file";

export default function GetDemoAccounts() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [demoAccounts, setDemoAccounts] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  // Three-dot menu state
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuUser, setMenuUser] = useState<any>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, row: any) => {
    setMenuAnchor(event.currentTarget);
    setMenuUser(row);
  };
  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleDeleteUser = async () => {
    if (!menuUser) return;
    if (!window.confirm(`Are you sure you want to delete demo account for ${menuUser.name}?`)) return;
    try {
      await deleteUserApi(menuUser.id);
      toast.success("Demo account deleted successfully");
      handleMenuClose();
      fetchDemoAccounts();
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete demo account");
    }
  };

  const fetchDemoAccounts = async () => {
    setLoading(true);
    try {
      // Fetch active users list to filter demo users
      const res = await getUsersApi({
        page: 1,
        limit: 100, // Fetch more to allow frontend filtering
        search: searchQuery || undefined,
        status: "ACTIVE",
      });

      let list: any[] = [];
      if (res) {
        if (Array.isArray(res)) list = res;
        else if (res.data && Array.isArray(res.data)) list = res.data;
        else if (res.data?.items && Array.isArray(res.data.items)) list = res.data.items;
        else if (res.items && Array.isArray(res.items)) list = res.items;
      }

      // Filter in frontend
      list = list.filter((u: any) => u.isDemoAccount === true || u.email?.includes(".demo"));

      setDemoAccounts(list);
      setTotalCount(list.length);
    } catch (error) {
      console.warn("Failed to fetch accounts via API:", error);
      setDemoAccounts([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemoAccounts();
  }, [searchQuery]);

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
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" fontWeight="800" color="#091542">
         Accounts Creation
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          Manage temporary, auto-configured developer/client demonstration profiles
        </Typography>
      </Box>

      <PageToolbar
        searchPlaceholder="Search by name, email..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={() => navigate("/demo-accounts/add")}
        addButtonLabel="Create Demo Account"
        showExport={false}
      />

      <DataTable
        columns={[
          {
            id: 'user',
            label: 'User Profile',
            render: (row) => (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={getFileUrl(row.photoUrl || row.profilePhotoUrl || row.avatar)}
                  imgProps={{ crossOrigin: 'anonymous' }}
                  sx={{ width: 36, height: 36 }}
                />
                <Box>
                  <Typography variant="body2" fontWeight="700" color="#091542">
                    {row.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    {row.email || row.phone}
                  </Typography>
                </Box>
              </Box>
            )
          },
          {
            id: 'role',
            label: 'System Role',
            render: (row) => (
              <Typography variant="body2" fontWeight="800" color="primary.main">
                {row.role}
              </Typography>
            )
          },
          {
            id: 'cardDetails',
            label: 'Card Details',
            render: (row) => (
              <Box>
                
                {(row.cardNumber || row.cardNo) && (
                  <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ mt: 0.5, display: "block" }}>
                    No: {row.cardNumber || row.cardNo}
                  </Typography>
                )}
              </Box>
            )
          },
          {
            id: 'expires',
            label: 'Expires At',
            render: (row) => (
              <Typography variant="body2" fontWeight="800" color="error.main">
                {row.demoExpiresAt || row.expiresAt ? new Date(row.demoExpiresAt || row.expiresAt).toLocaleDateString() : 'N/A'}
              </Typography>
            )
          },
          {
            id: 'actions',
            label: 'Actions',
            align: 'right',
            render: (row) => (
              <>
                <IconButton
                  size="small"
                  sx={{ color: "primary.main", bgcolor: "#eff6ff", mr: 1 }}
                  onClick={() => navigate(`/residents/${row.id}`)}
                >
                  <VisibilityOutlinedIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{ color: "text.secondary" }}
                  onClick={() => navigate(`/residents/edit/${row.id}`)}
                >
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{ color: "text.secondary" }}
                  onClick={(e) => handleMenuOpen(e, row)}
                >
                  <MoreVertOutlinedIcon fontSize="small" />
                </IconButton>
              </>
            )
          }
        ]}
        data={demoAccounts}
        loading={loading}
        totalCount={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(e, p) => setPage(p)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(1);
        }}
        emptyMessage="No accounts found."
      />

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 4,
          sx: {
            borderRadius: '12px',
            minWidth: 150,
            boxShadow: '0 8px 30px rgba(9,21,66,0.12)',
            '& .MuiMenuItem-root': { borderRadius: '8px', mx: 0.5, my: 0.25, px: 1.5, py: 1 }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleDeleteUser}>
          <ListItemIcon><DeleteOutlineIcon fontSize="small" sx={{ color: '#ef4444' }} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 700, color: '#ef4444' }}>Delete Demo</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
