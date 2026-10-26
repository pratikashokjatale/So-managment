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
  SettingsEthernet as BridgeIcon,
  Badge as CardsIcon,
} from "@mui/icons-material";
import { Dialog, DialogTitle, DialogContent, DialogActions, Tabs, Tab, MenuItem, Select, FormControl, InputLabel, Tooltip, Alert, Chip } from "@mui/material";
import { getUsersApi, updateUserApi } from "@/apis/user";
import { uploadDocumentApi } from "@/apis/document";
import { getAnalyticsAccessEventsApi } from "@/apis/analytics";
import { getCardsApi, createCardApi, updateCardApi, deleteCardApi, type CardItem, type HolderType } from "@/apis/card";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import Pagination from "@/components/Pagination";
import logoImg from "@/assets/logo.jpeg";
import DahuaBridgeManager from "./DahuaBridgeManager";

const INTER = "'Inter', system-ui, sans-serif";
const SERIF = "'Cormorant Garamond', Georgia, serif";

export default function GetAccess() {
  const { user: currentUser } = useAuth();
  const [accessTab, setAccessTab] = useState<"cards" | "dahua">("cards");
  const [users, setUsers] = useState<any[]>([]);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [openCardDesigns, setOpenCardDesigns] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [blockingUser, setBlockingUser] = useState<any>(null);
  const [inactiveReason, setInactiveReason] = useState("");
  const [inactiveProofImageUrl, setInactiveProofImageUrl] = useState("");
  const [inactiveProofPdfUrl, setInactiveProofPdfUrl] = useState("");
  const [submittingBlock, setSubmittingBlock] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  // Physical Cards State & Modal
  const [userCardsMap, setUserCardsMap] = useState<Record<string, CardItem[]>>({});
  const [loadingCardsMap, setLoadingCardsMap] = useState(false);
  const [openIssueCard, setOpenIssueCard] = useState(false);
  const [submittingIssueCard, setSubmittingIssueCard] = useState(false);
  const [selectedUserForCard, setSelectedUserForCard] = useState<any>(null);
  const [cardForm, setCardForm] = useState({
    cardUid: "",
    cardType: "RFID" as "RFID" | "FOB",
    holderType: "RESIDENT" as HolderType,
    userId: "",
    flatId: "",
  });

  // Role permissions: SUPER_ADMIN, ADMIN, MANAGER can manage cards
  const canManageCards = ["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(currentUser?.role?.toUpperCase?.() || "");

  const cardDesigns = [
    { role: "Resident", title: "RESIDENT ID NUMBER", id: "M B 1 0 4 2", color: "#1e293b", textColor: "#24528C" },
    { role: "Guest", title: "GUEST PASS NUMBER", id: "G B 2 2 1 0", color: "#64748b", textColor: "#475569" },
    { role: "Staff", title: "STAFF ID NUMBER", id: "S T 3 3 0 1", color: "#166534", textColor: "#166534" },
    { role: "Manager", title: "MANAGER ID NUMBER", id: "M G 1 0 0 1", color: "#1e293b", textColor: "#24528C" },
  ];

  const fetchUserCards = async (userIds: string[]) => {
    if (!userIds || userIds.length === 0) return;
    setLoadingCardsMap(true);
    try {
      // Query cards for current page users in parallel
      const promises = userIds.map((uid) =>
        getCardsApi({ userId: uid, limit: 20 })
          .then((res) => ({ uid, cards: res.items || [] }))
          .catch(() => ({ uid, cards: [] }))
      );
      const results = await Promise.all(promises);
      const nextMap: Record<string, CardItem[]> = {};
      results.forEach((r) => {
        nextMap[r.uid] = r.cards;
      });
      setUserCardsMap((prev) => ({ ...prev, ...nextMap }));
    } catch (e) {
      console.warn("Could not load user cards map", e);
    } finally {
      setLoadingCardsMap(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsersApi({ page, limit, search: search || undefined });
      const items = res?.data?.items || res?.items || res?.data || (Array.isArray(res) ? res : []);
      const total = res?.data?.pagination?.total || res?.pagination?.total || items.length;
      setUsers(items);
      setTotalUsers(total);
      
      const userIds = items.map((u: any) => u.id).filter(Boolean);
      fetchUserCards(userIds);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Helper to open Issue Card modal for a user
  const handleOpenIssueCardForUser = (user?: any) => {
    if (!canManageCards) {
      toast.error("Insufficient permissions to assign cards");
      return;
    }
    const target = user || users[0];
    let holderType: HolderType = "RESIDENT";
    const roleUpper = (target?.role || "").toUpperCase();
    if (roleUpper === "GUEST") holderType = "GUEST";
    else if (roleUpper === "STAFF" || roleUpper === "SECURITY") holderType = "STAFF";

    setSelectedUserForCard(target || null);
    setCardForm({
      cardUid: "",
      cardType: "RFID",
      holderType,
      userId: target?.id || "",
      flatId: target?.flatId || target?.flat?.id || "",
    });
    setOpenIssueCard(true);
  };

  const [cardToDelete, setCardToDelete] = useState<{ card: CardItem; userName: string } | null>(null);
  const [submittingRemoveCard, setSubmittingRemoveCard] = useState(false);

  const handleSaveCard = async () => {
    const formattedCardUid = cardForm.cardUid.trim().toUpperCase();
    if (!formattedCardUid) {
      toast.error("Please enter the exact physical Card UID");
      return;
    }
    if (!cardForm.userId) {
      toast.error("Please select a user");
      return;
    }

    setSubmittingIssueCard(true);
    try {
      await createCardApi({
        cardUid: formattedCardUid,
        cardType: cardForm.cardType,
        holderType: cardForm.holderType,
        userId: cardForm.userId,
        flatId: cardForm.flatId ? cardForm.flatId : undefined,
      });
      toast.success("Saved. The door updates within about a minute.");
      setOpenIssueCard(false);
      // Reload cards for this user
      if (cardForm.userId) {
        fetchUserCards([cardForm.userId]);
      }
    } catch (err: any) {
      if (err?.status === 409 || err?.response?.status === 409) {
        toast.error("This card number is already assigned.");
      } else {
        toast.error(err?.message || "Failed to assign card");
      }
    } finally {
      setSubmittingIssueCard(false);
    }
  };

  const handleBlockCard = async (card: CardItem) => {
    if (!canManageCards) {
      toast.error("Insufficient permissions to modify card status");
      return;
    }
    try {
      await updateCardApi(card.id, { status: "BLOCKED" });
      toast.success("Saved. The door updates within about a minute.");
      fetchUserCards([card.userId]);
    } catch (err: any) {
      toast.error(err?.message || "Failed to block card");
    }
  };

  const handleUnblockCard = async (card: CardItem) => {
    if (!canManageCards) {
      toast.error("Insufficient permissions to modify card status");
      return;
    }
    try {
      await updateCardApi(card.id, { status: "ACTIVE" });
      toast.success("Saved. The door updates within about a minute.");
      fetchUserCards([card.userId]);
    } catch (err: any) {
      toast.error(err?.message || "Failed to activate card");
    }
  };

  const handleConfirmRemoveCard = async () => {
    if (!cardToDelete || !canManageCards) return;
    setSubmittingRemoveCard(true);
    try {
      await deleteCardApi(cardToDelete.card.id);
      toast.success("Card removed. The door updates within about a minute.");
      const uId = cardToDelete.card.userId;
      setCardToDelete(null);
      if (uId) {
        fetchUserCards([uId]);
      }
    } catch (err: any) {
      if (err?.status === 404 || err?.response?.status === 404) {
        toast.error(err?.message || "Card not found");
        if (cardToDelete.card.userId) {
          fetchUserCards([cardToDelete.card.userId]);
        }
      } else {
        toast.error(err?.message || "Failed to remove card");
      }
      setCardToDelete(null);
    } finally {
      setSubmittingRemoveCard(false);
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
    if (isCurrentlyActive) {
      setBlockingUser(user);
      setInactiveReason("");
      setInactiveProofImageUrl("");
      setInactiveProofPdfUrl("");
      setBlockDialogOpen(true);
    } else {
      try {
        await updateUserApi(user.id, { status: "ACTIVE" });
        toast.success("User activated successfully");
        fetchUsers();
        fetchRecentEvents();
      } catch (error) {
        toast.error("Failed to activate user");
      }
    }
  };

  const handleConfirmBlock = async () => {
    if (!blockingUser) return;
    setSubmittingBlock(true);
    try {
      const payload: any = {
        status: "INACTIVE"
      };
      if (inactiveReason) payload.inactiveReason = inactiveReason;
      if (inactiveProofImageUrl) payload.inactiveProofImageUrl = inactiveProofImageUrl;
      if (inactiveProofPdfUrl) payload.inactiveProofPdfUrl = inactiveProofPdfUrl;

      await updateUserApi(blockingUser.id, payload);
      toast.success("User blocked successfully");
      setBlockDialogOpen(false);
      setBlockingUser(null);
      fetchUsers();
      fetchRecentEvents();
    } catch (error) {
      toast.error("Failed to block user");
    } finally {
      setSubmittingBlock(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadDocumentApi(file);
      setInactiveProofImageUrl(url);
      toast.success("Image proof uploaded successfully");
    } catch (err) {
      toast.error("Failed to upload image proof");
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPdf(true);
    try {
      const url = await uploadDocumentApi(file);
      setInactiveProofPdfUrl(url);
      toast.success("PDF proof uploaded successfully");
    } catch (err) {
      toast.error("Failed to upload PDF proof");
    } finally {
      setUploadingPdf(false);
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
        return "#24528C"; // Dark Blue
      case "GUEST":
        return "#e2e8f0"; // Light Grey
      case "STAFF":
      case "SECURITY":
        return "#22c55e"; // Green
      default:
        return "#24528C";
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
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontFamily: SERIF, fontSize: "2.2rem", fontWeight: 600, color: "#192038", mb: 0.5 }}>
          Access & Cards
        </Typography>
        <Typography sx={{ fontFamily: INTER, fontSize: "0.875rem", color: "#64748b" }}>
          Block, replace and monitor physical RFID cards and Dahua controller integrations
        </Typography>
      </Box>

      {/* Main Mode Tabs Switcher */}
      <Box sx={{ display: "flex", gap: 1, mb: 3, bgcolor: "#f1f5f9", p: "4px", borderRadius: "12px", width: "fit-content" }}>
        <Button
          onClick={() => setAccessTab("cards")}
          startIcon={<CardsIcon sx={{ fontSize: 18 }} />}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.85rem",
            px: 2.2,
            py: 0.9,
            borderRadius: "9px",
            color: accessTab === "cards" ? "#24528C" : "#64748b",
            bgcolor: accessTab === "cards" ? "#ffffff" : "transparent",
            boxShadow: accessTab === "cards" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            "&:hover": { bgcolor: accessTab === "cards" ? "#ffffff" : "rgba(255,255,255,0.5)" },
          }}
        >
          Resident & Staff RFID Cards
        </Button>
        <Button
          onClick={() => setAccessTab("dahua")}
          startIcon={<BridgeIcon sx={{ fontSize: 18 }} />}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.85rem",
            px: 2.2,
            py: 0.9,
            borderRadius: "9px",
            color: accessTab === "dahua" ? "#24528C" : "#64748b",
            bgcolor: accessTab === "dahua" ? "#ffffff" : "transparent",
            boxShadow: accessTab === "dahua" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            "&:hover": { bgcolor: accessTab === "dahua" ? "#ffffff" : "rgba(255,255,255,0.5)" },
          }}
        >
          Dahua RFID Controller Bridge
        </Button>
      </Box>

      {accessTab === "dahua" ? (
        <DahuaBridgeManager />
      ) : (
        <>
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
            sx={{ borderColor: "#e2e8f0", color: "#24528C", textTransform: "none", borderRadius: "8px", fontWeight: 600, px: 2, bgcolor: "#f0fdfa" }}
          >
            Card designs
          </Button>
          {canManageCards && (
            <Button
              variant="contained"
              onClick={() => handleOpenIssueCardForUser()}
              startIcon={<AddIcon />}
              sx={{ bgcolor: "#24528C", textTransform: "none", borderRadius: "8px", fontWeight: 600, px: 2 }}
            >
              Issue / Assign Card
            </Button>
          )}
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
              {users.map((user) => {
                const assignedCards = userCardsMap[user.id] || [];
                return (
                  <Box key={user.id} sx={{ p: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography sx={{ fontWeight: 600, color: "#1e293b", fontSize: "0.95rem" }}>
                            {user.name || "Unknown User"}
                          </Typography>
                          <Typography sx={{ fontSize: "0.75rem", color: "#64748b" }}>
                            ({user.role || "USER"})
                          </Typography>
                        </Box>
                        <Typography sx={{ fontSize: "0.8rem", color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          Member Card: <strong style={{ color: "#334155" }}>{user.cardNumber || `MB-${user.id?.substring(0, 4) || "0000"}`}</strong>
                          {user.email ? ` · ${user.email}` : ""}
                          {user.flat?.number ? ` · Flat ${user.flat.number}` : ""}
                        </Typography>
                      </Box>

                      {/* Status & Actions */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
                        {getStatusBadge(user.status)}

                        {canManageCards && (
                          <Tooltip title="Assign a physical card UID to this user">
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleOpenIssueCardForUser(user)}
                              startIcon={<AddIcon sx={{ fontSize: 16 }} />}
                              sx={{
                                textTransform: "none",
                                fontSize: "0.75rem",
                                py: 0.4,
                                px: 1.2,
                                borderRadius: "6px",
                                borderColor: "#cbd5e1",
                                color: "#24528C",
                              }}
                            >
                              Assign Card
                            </Button>
                          </Tooltip>
                        )}
                        
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleToggleStatus(user)}
                            sx={{ color: user.status === "ACTIVE" ? "#ef4444" : "#22c55e", bgcolor: "#f8fafc" }}
                            title={user.status === "ACTIVE" ? "Block User Account" : "Activate User Account"}
                          >
                            {user.status === "ACTIVE" ? <BlockIcon fontSize="small" /> : <CheckIcon fontSize="small" />}
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>

                    {/* Physical Cards Linked to this User */}
                    {assignedCards.length > 0 && (
                      <Box sx={{ mt: 1.5, pl: 7, display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
                        <Typography sx={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>
                          Physical Dahua/RFID Cards ({assignedCards.length}):
                        </Typography>
                        {assignedCards.map((card) => {
                          const isBlocked = card.status === "BLOCKED";
                          return (
                            <Box
                              key={card.id}
                              sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 1,
                                px: 1.2,
                                py: 0.4,
                                bgcolor: isBlocked ? "#fee2e2" : "#f1f5f9",
                                border: isBlocked ? "1px solid #fca5a5" : "1px solid #e2e8f0",
                                borderRadius: "8px",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "0.75rem",
                                  fontFamily: "monospace",
                                  fontWeight: 600,
                                  color: isBlocked ? "#991b1b" : "#1e293b",
                                }}
                              >
                                {card.cardUid}
                              </Typography>
                              <Chip
                                size="small"
                                label={card.status}
                                sx={{
                                  height: 18,
                                  fontSize: "0.65rem",
                                  fontWeight: 700,
                                  bgcolor: isBlocked ? "#ef4444" : "#22c55e",
                                  color: "#ffffff",
                                }}
                              />
                              {canManageCards && (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Button
                                    size="small"
                                    onClick={() => (isBlocked ? handleUnblockCard(card) : handleBlockCard(card))}
                                    sx={{
                                      p: 0,
                                      minWidth: "auto",
                                      fontSize: "0.7rem",
                                      textTransform: "none",
                                      color: isBlocked ? "#22c55e" : "#ef4444",
                                      fontWeight: 600,
                                      "&:hover": { textDecoration: "underline", bgcolor: "transparent" },
                                    }}
                                  >
                                    {isBlocked ? "Unblock" : "Block"}
                                  </Button>
                                  <span style={{ color: "#cbd5e1", fontSize: "0.7rem" }}>•</span>
                                  <Button
                                    size="small"
                                    onClick={() => setCardToDelete({ card, userName: user?.name || "this user" })}
                                    sx={{
                                      p: 0,
                                      minWidth: "auto",
                                      fontSize: "0.7rem",
                                      textTransform: "none",
                                      color: "#64748b",
                                      fontWeight: 600,
                                      "&:hover": { textDecoration: "underline", color: "#ef4444", bgcolor: "transparent" },
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </Box>
                              )}
                            </Box>
                          );
                        })}
                      </Box>
                    )}
                  </Box>
                );
              })}
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
      </>
      )}

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

      {/* Block User Dialog */}
      <Dialog 
        open={blockDialogOpen} 
        onClose={() => !submittingBlock && setBlockDialogOpen(false)} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px" } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: '#1e293b' }}>
          Block User / Make Inactive
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Specify the reasons and proof for blocking {blockingUser?.name}. All inactive audit fields are optional.
          </Typography>
          <Stack spacing={2.5}>
            <Box>
              <TextField 
                label="Inactive Reason" 
                placeholder="e.g. KYC rejected / resident moved out" 
                fullWidth
                value={inactiveReason}
                onChange={(e) => setInactiveReason(e.target.value)}
                disabled={submittingBlock}
              />
            </Box>

            <Box>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                <Button
                  variant="outlined"
                  component="label"
                  disabled={submittingBlock || uploadingImage}
                  sx={{ textTransform: 'none', borderRadius: '8px' }}
                >
                  {uploadingImage ? "Uploading..." : "Select Image Proof"}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageUpload}
                  />
                </Button>
                <Typography variant="caption" sx={{ wordBreak: 'break-all', color: 'text.secondary' }}>
                  {inactiveProofImageUrl ? "Uploaded Image" : "No image selected"}
                </Typography>
              </Stack>
              {inactiveProofImageUrl && (
                <TextField
                  size="small"
                  fullWidth
                  value={inactiveProofImageUrl}
                  onChange={(e) => setInactiveProofImageUrl(e.target.value)}
                  disabled={submittingBlock}
                  helperText="Image proof URL (automatically set on upload)"
                />
              )}
            </Box>

            <Box>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                <Button
                  variant="outlined"
                  component="label"
                  disabled={submittingBlock || uploadingPdf}
                  sx={{ textTransform: 'none', borderRadius: '8px' }}
                >
                  {uploadingPdf ? "Uploading..." : "Select PDF Proof"}
                  <input
                    type="file"
                    accept="application/pdf"
                    hidden
                    onChange={handlePdfUpload}
                  />
                </Button>
                <Typography variant="caption" sx={{ wordBreak: 'break-all', color: 'text.secondary' }}>
                  {inactiveProofPdfUrl ? "Uploaded PDF" : "No PDF selected"}
                </Typography>
              </Stack>
              {inactiveProofPdfUrl && (
                <TextField
                  size="small"
                  fullWidth
                  value={inactiveProofPdfUrl}
                  onChange={(e) => setInactiveProofPdfUrl(e.target.value)}
                  disabled={submittingBlock}
                  helperText="PDF proof URL (automatically set on upload)"
                />
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setBlockDialogOpen(false)} 
            color="inherit" 
            disabled={submittingBlock}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmBlock} 
            variant="contained" 
            color="error" 
            disabled={submittingBlock}
            startIcon={submittingBlock ? <CircularProgress size={16} color="inherit" /> : <BlockIcon />}
            sx={{ textTransform: 'none', borderRadius: '8px', boxShadow: 'none' }}
          >
            Block User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Physical RFID Card Modal */}
      <Dialog
        open={openIssueCard}
        onClose={() => !submittingIssueCard && setOpenIssueCard(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#1e293b", pb: 1 }}>
          Assign Physical RFID / Dahua Card
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 3, borderRadius: "10px", fontSize: "0.82rem" }}>
            The physical card UID is read by the Dahua controller. Enter the <strong>exact card number</strong> (keeping leading zeroes). Do not convert hex to decimal.
          </Alert>

          <Stack spacing={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Assign To User *</InputLabel>
              <Select
                value={cardForm.userId}
                label="Assign To User *"
                onChange={(e) => {
                  const targetId = e.target.value;
                  const target = users.find((u) => u.id === targetId);
                  setSelectedUserForCard(target || null);
                  let hType: HolderType = "RESIDENT";
                  const roleUpper = (target?.role || "").toUpperCase();
                  if (roleUpper === "GUEST") hType = "GUEST";
                  else if (roleUpper === "STAFF" || roleUpper === "SECURITY") hType = "STAFF";

                  setCardForm((prev) => ({
                    ...prev,
                    userId: targetId,
                    holderType: hType,
                    flatId: target?.flatId || target?.flat?.id || "",
                  }));
                }}
              >
                {users.map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.name || "Unknown"} ({u.role || "USER"}) — {u.cardNumber || `MB-${u.id?.substring(0, 4)}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Physical Card UID *"
              placeholder="e.g. 04A1B2C3D4 or 12345678"
              fullWidth
              size="small"
              value={cardForm.cardUid}
              onChange={(e) => setCardForm((prev) => ({ ...prev, cardUid: e.target.value }))}
              helperText="Exact string output from Dahua device card list / export tool"
              inputProps={{ style: { fontFamily: "monospace", letterSpacing: "1px" } }}
            />

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Card Type</InputLabel>
                <Select
                  value={cardForm.cardType}
                  label="Card Type"
                  onChange={(e) => setCardForm((prev) => ({ ...prev, cardType: e.target.value as any }))}
                >
                  <MenuItem value="RFID">RFID Card</MenuItem>
                  <MenuItem value="FOB">Key FOB</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Holder Type</InputLabel>
                <Select
                  value={cardForm.holderType}
                  label="Holder Type"
                  onChange={(e) => setCardForm((prev) => ({ ...prev, holderType: e.target.value as any }))}
                >
                  <MenuItem value="RESIDENT">Resident (Tenant / Owner)</MenuItem>
                  <MenuItem value="GUEST">Guest</MenuItem>
                  <MenuItem value="STAFF">Staff / Facility Worker</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {selectedUserForCard?.flat && (
              <TextField
                label="Associated Flat"
                size="small"
                fullWidth
                disabled
                value={`Flat ${selectedUserForCard.flat.number || selectedUserForCard.flat.flatNumber || selectedUserForCard.flat.id}`}
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setOpenIssueCard(false)}
            color="inherit"
            disabled={submittingIssueCard}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveCard}
            variant="contained"
            disabled={submittingIssueCard || !cardForm.cardUid.trim() || !cardForm.userId}
            startIcon={submittingIssueCard ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
            sx={{
              bgcolor: "#24528C",
              textTransform: "none",
              borderRadius: "8px",
              fontWeight: 600,
              px: 3,
            }}
          >
            {submittingIssueCard ? "Saving..." : "Assign Card"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Dialog: Confirm Remove Card ── */}
      <Dialog
        open={Boolean(cardToDelete)}
        onClose={() => !submittingRemoveCard && setCardToDelete(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#1e293b", fontFamily: INTER, fontSize: "1.1rem" }}>
          Remove card {cardToDelete?.card.cardUid} from {cardToDelete?.userName}?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#475569", fontSize: "0.875rem", lineHeight: 1.6 }}>
            The card stops working at Dahua doors within about a minute and can then be assigned to someone else.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1, gap: 1 }}>
          <Button
            onClick={() => setCardToDelete(null)}
            disabled={submittingRemoveCard}
            sx={{ color: "#64748b", textTransform: "none", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmRemoveCard}
            variant="contained"
            disabled={submittingRemoveCard}
            sx={{
              bgcolor: "#ef4444",
              "&:hover": { bgcolor: "#dc2626" },
              textTransform: "none",
              borderRadius: "8px",
              fontWeight: 600,
              px: 2.5,
            }}
          >
            {submittingRemoveCard ? <CircularProgress size={18} color="inherit" /> : "Remove card"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

