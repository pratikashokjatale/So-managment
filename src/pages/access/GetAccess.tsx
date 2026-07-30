import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  InputAdornment,
  Stack,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  Sensors as ScanIcon,
  CreditCard as CardDesignsIcon,
  Add as AddIcon,
  Block as BlockIcon,
  CheckCircleOutline as CheckIcon,
  Sync as RefreshIcon,
  Person as PersonIcon,
  QrCode2 as QrCode2Icon,
} from "@mui/icons-material";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { getUsersApi, updateUserApi } from "@/apis/user";
import { getAnalyticsAccessEventsApi } from "@/apis/analytics";
import toast from "react-hot-toast";
import Pagination from "@/components/Pagination";
import logoImg from "@/assets/logo.jpeg";

const INTER = "'Inter', sans-serif";
const SERIF = "'Playfair Display', serif";

export default function GetAccess() {
  const [users, setUsers] = useState<any[]>([]);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [openCardDesigns, setOpenCardDesigns] = useState(false);

  const cardDesigns = [
    { role: "Resident", title: "RESIDENT ID NUMBER", id: "M B 1 0 4 2", color: "#1e293b", textColor: "#1e3a8a" },
    { role: "Guest", title: "GUEST PASS NUMBER", id: "G B 2 2 1 0", color: "#64748b", textColor: "#475569" },
    { role: "Staff", title: "STAFF ID NUMBER", id: "S T 3 3 0 1", color: "#166534", textColor: "#166534" },
    { role: "Manager", title: "MANAGER ID NUMBER", id: "M G 1 0 0 1", color: "#1e293b", textColor: "#1e3a8a" },
  ];

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsersApi({ page, limit, search: search || undefined });
      const items = res?.data?.items || res?.items || res?.data || (Array.isArray(res) ? res : []);
      const total = res?.data?.pagination?.total || res?.pagination?.total || items.length;
      setUsers(items);
      setTotalUsers(total);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Debounced search and pagination effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [page, limit, search]);

  useEffect(() => {
    fetchRecentEvents();
  }, []);

  const fetchRecentEvents = async () => {
    setLoadingEvents(true);
    try {
      const res = await getUsersApi({ limit: 10, status: "INACTIVE" });
      const items = res?.data?.items || res?.items || res?.data || (Array.isArray(res) ? res : []);
      setRecentEvents(items);
    } catch (error) {
      console.warn("Failed to load inactive users", error);
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleToggleStatus = async (user: any) => {
    const isCurrentlyActive = user.status === "ACTIVE";
    const newStatus = isCurrentlyActive ? "INACTIVE" : "ACTIVE";
    try {
      await updateUserApi(user.id, { status: newStatus });
      toast.success(`User ${newStatus === "ACTIVE" ? "activated" : "blocked"} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  const handleBlockUserById = async (userId: string, name: string) => {
    try {
      await updateUserApi(userId, { status: "INACTIVE" });
      toast.success(`User ${name} blocked successfully`);
      fetchUsers(); // Refresh the top list to reflect the block
    } catch (error) {
      toast.error("Failed to block user");
    }
  };

  const getRoleColor = (role: string) => {
    switch (role?.toUpperCase()) {
      case "ADMIN":
      case "SUPER_ADMIN":
        return "#d6b361"; // Gold
      case "RESIDENT":
        return "#204a7b"; // Dark Blue
      case "GUEST":
        return "#e2e8f0"; // Light Grey
      case "STAFF":
      case "SECURITY":
        return "#22c55e"; // Green
      default:
        return "#204a7b";
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status?.toUpperCase() || "";
    if (s === "INACTIVE" || s === "BLOCKED") {
      return (
        <Box sx={{ bgcolor: "#fee2e2", color: "#ef4444", px: 1.5, py: 0.5, borderRadius: "12px", fontSize: "0.75rem", fontWeight: 700 }}>
          blocked
        </Box>
      );
    }
    if (s === "EXPIRED") {
      return (
        <Box sx={{ bgcolor: "#f1f5f9", color: "#64748b", px: 1.5, py: 0.5, borderRadius: "12px", fontSize: "0.75rem", fontWeight: 700 }}>
          expired
        </Box>
      );
    }
    return (
      <Box sx={{ bgcolor: "#dcfce7", color: "#22c55e", px: 1.5, py: 0.5, borderRadius: "12px", fontSize: "0.75rem", fontWeight: 700 }}>
        active
      </Box>
    );
  };

  const filteredUsers = users.filter((u) => u.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#ffffff", minHeight: "100vh", fontFamily: INTER }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontFamily: SERIF, fontSize: "2rem", fontWeight: 600, color: "#192038", mb: 0.5 }}>
          Access & Cards
        </Typography>
        <Typography sx={{ fontFamily: INTER, fontSize: "0.875rem", color: "#64748b" }}>
          Block, replace and monitor RFID cards
        </Typography>
      </Box>

      {/* Top Actions */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center", mb: 4 }}>
        <TextField
          placeholder="Search cards..."
          size="small"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset page on search
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            flexGrow: 1,
            maxWidth: 300,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              bgcolor: "#f8fafc",
              "& fieldset": { borderColor: "#e2e8f0" },
            },
          }}
        />

        <Stack direction="row" spacing={1.5} sx={{ ml: "auto" }}>
          
          <Button
            variant="outlined"
            onClick={() => setOpenCardDesigns(true)}
            startIcon={<CardDesignsIcon />}
            sx={{ borderColor: "#e2e8f0", color: "#3b82f6", textTransform: "none", borderRadius: "8px", fontWeight: 600, px: 2, bgcolor: "#f0fdfa" }}
          >
            Card designs
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ bgcolor: "#204a7b", textTransform: "none", borderRadius: "8px", fontWeight: 600, px: 2 }}
          >
            Issue card
          </Button>
        </Stack>
      </Box>

      {/* Cards List */}
      <Paper elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: "16px", p: 1, mb: 4 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : users.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center", color: "#64748b" }}>No users found.</Box>
        ) : (
          <>
            <Stack spacing={0} divider={<Box sx={{ height: "1px", bgcolor: "#f1f5f9", mx: 2 }} />}>
              {users.map((user) => (
                <Box key={user.id} sx={{ display: "flex", alignItems: "center", p: 2, gap: 2 }}>
                
                {/* Color Box */}
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "8px",
                    bgcolor: getRoleColor(user.role),
                    flexShrink: 0,
                  }}
                />

                {/* User Info */}
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 600, color: "#1e293b", fontSize: "0.95rem" }}>
                    {user.name || "Unknown User"}
                  </Typography>
                  <Typography sx={{ fontSize: "0.8rem", color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {user.cardNumber || `MB-${user.id?.substring(0, 4) || "0000"}`} · {user.role || "USER"} · Grand
                  </Typography>
                </Box>

                {/* Status & Actions */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
                  {getStatusBadge(user.status)}
                  
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <IconButton size="small" sx={{ color: "#64748b", bgcolor: "#f8fafc" }}>
                      <ScanIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleToggleStatus(user)}
                      sx={{ color: user.status === "ACTIVE" ? "#ef4444" : "#22c55e", bgcolor: "#f8fafc" }}
                      title={user.status === "ACTIVE" ? "Block User" : "Activate User"}
                    >
                      {user.status === "ACTIVE" ? <BlockIcon fontSize="small" /> : <CheckIcon fontSize="small" />}
                    </IconButton>
                    <IconButton size="small" sx={{ color: "#64748b", bgcolor: "#f8fafc" }}>
                      <RefreshIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

              </Box>
            ))}
            </Stack>
            <Box sx={{ px: 3, py: 1 }}>
              <Pagination
                page={page}
                totalResults={totalUsers}
                rowsPerPage={limit}
                onPageChange={(e, val) => setPage(val)}
                onRowsPerPageChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
              />
            </Box>
          </>
        )}
      </Paper>

      {/* Recent Access Events */}
      <Paper elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: "16px", p: { xs: 2, md: 4 } }}>
        <Typography sx={{ fontWeight: 600, color: "#1e293b", mb: 3, textAlign: "left" }}>
          Blocked / Inactive Users
        </Typography>
        
        {loadingEvents ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={24} />
          </Box>
        ) : recentEvents.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4, color: "#64748b" }}>
            <Typography sx={{ fontSize: "0.9rem" }}>
              No inactive users found.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {recentEvents.map((user) => (
              <Box key={user.id} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2, bgcolor: "#f8fafc", borderRadius: "8px" }}>
                <Box>
                  <Typography sx={{ fontWeight: 600, color: "#334155", fontSize: "0.95rem" }}>
                    {user.name || "Unknown"} <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: "0.85rem" }}>({user.role})</span>
                  </Typography>
                  <Typography sx={{ fontSize: "0.8rem", color: "#64748b" }}>
                    {user.cardNumber || `MB-${user.id?.substring(0,4)}`} • Blocked Account
                  </Typography>
                </Box>
                
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#ef4444", bgcolor: "#fee2e2", px: 1.5, py: 0.5, borderRadius: "12px" }}>
                    INACTIVE
                  </Typography>
                  <Button
                    size="small"
                    color="success"
                    variant="outlined"
                    onClick={() => handleToggleStatus(user)}
                    sx={{ textTransform: "none", borderRadius: "6px", py: 0.5 }}
                  >
                    Activate User
                  </Button>
                </Box>
              </Box>
            ))}
          </Stack>
        )}
      </Paper>

      {/* Card Designs Modal */}
      <Dialog 
        open={openCardDesigns} 
        onClose={() => setOpenCardDesigns(false)} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px", bgcolor: "#f8fafc" } }}
      >
        <DialogTitle sx={{ fontFamily: SERIF, fontSize: "1.6rem", fontWeight: 600, textAlign: "center", pt: 4, color: "#1e293b" }}>
          Role-based Card Designs
        </DialogTitle>
        <DialogContent sx={{ pb: 6, display: "flex", justifyContent: "center", gap: { xs: 2, md: 4 }, flexWrap: "wrap", mt: 2 }}>
          {cardDesigns.map((card, idx) => (
            <Box key={idx} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <Paper 
                elevation={1} 
                sx={{ 
                  width: 250, 
                  height: 420, 
                  border: "1px solid #e2e8f0", 
                  borderRadius: "8px", 
                  display: "flex", 
                  flexDirection: "column", 
                  overflow: "hidden", 
                  bgcolor: "#ffffff",
                  position: "relative"
                }}
              >
                {/* Logo placeholder */}
                <Box sx={{ mt: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Box component="img" src={logoImg} alt="Marbella Logo" sx={{ height: 45, objectFit: 'contain' }} />
                  <Box sx={{ width: '40%', height: '1px', bgcolor: '#cbd5e1', mt: 1.5 }} />
                </Box>

                {/* Avatar placeholder */}
                <Box sx={{ mt: 3, mx: "auto", width: 110, height: 130, bgcolor: "#e2e8f0", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <PersonIcon sx={{ fontSize: 65, color: "#94a3b8" }} />
                </Box>

                {/* Title and ID */}
                <Box sx={{ mt: 3, textAlign: "center" }}>
                  <Typography sx={{ fontFamily: INTER, fontSize: "0.6rem", fontWeight: 700, color: card.textColor, letterSpacing: "0.5px" }}>
                    {card.title}
                  </Typography>
                  <Typography sx={{ fontFamily: SERIF, fontSize: "1.25rem", fontWeight: 600, color: "#1e293b", letterSpacing: "3px", mt: 0.5 }}>
                    {card.id}
                  </Typography>
                </Box>

                {/* QR Code */}
                <Box sx={{ mt: 1, mx: "auto", flexGrow: 1, display: "flex", alignItems: "center" }}>
                  <QrCode2Icon sx={{ fontSize: 75, color: "#1e293b" }} />
                </Box>

                {/* Wave footer */}
                <Box sx={{ mt: "auto", width: "100%" }}>
                  <svg viewBox="0 0 200 24" preserveAspectRatio="none" style={{ width: "100%", height: "24px", display: "block" }}>
                    <path d="M0,12 C50,-5 150,20 200,5 L200,24 L0,24 Z" fill={card.color} />
                  </svg>
                  <Box sx={{ bgcolor: card.color, height: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography sx={{ fontFamily: INTER, fontSize: "0.6rem", color: "#ffffff", letterSpacing: "0.5px" }}>
                      clubmarbella.app
                    </Typography>
                  </Box>
                </Box>
              </Paper>
              <Typography sx={{ fontFamily: INTER, fontSize: "0.95rem", fontWeight: 600, color: "#334155" }}>
                {card.role}
              </Typography>
            </Box>
          ))}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
