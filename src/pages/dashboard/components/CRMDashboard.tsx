import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Autocomplete,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  Stack,
  IconButton,
} from "@mui/material";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SensorsIcon from "@mui/icons-material/Sensors";
import { getUsersApi } from "@/apis/user";
import { adminRechargeUserWalletApi } from "@/apis/wallet";
import ScanModal from "./ScanModal";
import CreateProfileModal from "./CreateProfileModal";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import OnboardingCaseModal from "./OnboardingCaseModal";
import PopulationModal from "./PopulationModal";
import ResidentProfileModal from "./ResidentProfileModal";
import AdminQRRechargeModal from "./AdminQRRechargeModal";
import ResidentSearchUI from "./ResidentSearchUI";
import ResidentProfileCard from "./ResidentProfileCard";
import ResidentQRModal from "./ResidentQRModal";
import PaymentPlansTab from "./PaymentPlansTab";
import SalesPipelineTab from "./SalesPipelineTab";
import RequestsTab from "./RequestsTab";
import { 
  getCrmOnboardingSummaryApi, 
  getCrmResidentInventorySummaryApi, 
  getReminderTemplateApi, 
  updateReminderTemplateApi,
  previewReminderApi,
  sendRemindersApi 
} from "@/apis/crm";
import { getAllFlatsApi } from "@/apis/flat";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import SimCardIcon from "@mui/icons-material/SimCard";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import Avatar from "@mui/material/Avatar";
import CloseIcon from "@mui/icons-material/Close";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import SendIcon from "@mui/icons-material/Send";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

const demoIds = ["MEM-100482", "MEM-100613", "MEM-100731", "MEM-100355"];

const CRMDashboard = ({ user }: { user: any }) => {
  const userName = user?.name || "Simran Kaur";
  const [view, setView] = useState<"home" | "concierge" | "groupOffice">(
    "home",
  );
  const [activeTab, setActiveTab] = useState<"helpdesk" | "rfid" | "intake">(
    "helpdesk",
  );
  const [activeGroupOfficeTab, setActiveGroupOfficeTab] =
    useState("onboarding");

  // Search and member state
  const [memberId, setMemberId] = useState("");
  const [selectedResident, setSelectedResident] = useState<any>(null);
  const [residentSearchQuery, setResidentSearchQuery] = useState("");
  const [residentOptions, setResidentOptions] = useState<any[]>([]);
  const [loadingResidents, setLoadingResidents] = useState(false);

  // Modal states
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [createProfileModalOpen, setCreateProfileModalOpen] = useState(false);
  const [selectedCreateProfile, setSelectedCreateProfile] = useState<any>(null);
  const [rechargeModalOpen, setRechargeModalOpen] = useState(false);
  const [qrRechargeModalOpen, setQrRechargeModalOpen] = useState(false);
  const [populationModalOpen, setPopulationModalOpen] = useState(false);
  const [recharging, setRecharging] = useState(false);

  const [crmSummary, setCrmSummary] = useState<any>(null);
  const [loadingCrmSummary, setLoadingCrmSummary] = useState(false);
  const [residentSummary, setResidentSummary] = useState<any>(null);
  const [loadingResidentSummary, setLoadingResidentSummary] = useState(false);
  const [onboardingCases, setOnboardingCases] = useState<any[]>([]);
  const [loadingCases, setLoadingCases] = useState(false);
  
  const [eligibleBuyers, setEligibleBuyers] = useState<any[]>([]);
  const [loadingEligibleBuyers, setLoadingEligibleBuyers] = useState(false);
  const [selectedBuyers, setSelectedBuyers] = useState<number[]>([]);
  
  // Reminder Template State
  const [reminderTemplate, setReminderTemplate] = useState<any>(null);
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  const [editTemplateForm, setEditTemplateForm] = useState({ subjectTemplate: "", bodyTemplate: "", channel: "BOTH" });
  const [savingTemplate, setSavingTemplate] = useState(false);

  // Preview Modal State
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [previewBuyerId, setPreviewBuyerId] = useState<string | null>(null);
  const [sendingReminders, setSendingReminders] = useState(false);

  const [selectedOnboardingCase, setSelectedOnboardingCase] = useState<any>(null);

  // Inventory Flats State
  const [inventorySearch, setInventorySearch] = useState("");
  const [inventoryProject, setInventoryProject] = useState("All");
  const [inventoryStatus, setInventoryStatus] = useState("All");
  const [inventoryVisibility, setInventoryVisibility] = useState("All");
  const [inventoryFlats, setInventoryFlats] = useState<any[]>([]);
  const [loadingInventoryFlats, setLoadingInventoryFlats] = useState(false);
  const [inventoryPage, setInventoryPage] = useState(1);
  const [inventoryTotalPages, setInventoryTotalPages] = useState(1);
  const [inventoryTotalFlats, setInventoryTotalFlats] = useState(0);
  const [activeInventoryTab, setActiveInventoryTab] = useState("Inventory");

  // Resident Profile Modal
  const [residentProfileModalOpen, setResidentProfileModalOpen] = useState(false);
  const [selectedResidentProfile, setSelectedResidentProfile] = useState<any>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoadingCrmSummary(true);
      try {
        const res = await getCrmOnboardingSummaryApi();
        if (res) {
          setCrmSummary(res);
        }
      } catch (error) {
        console.error("Failed to fetch CRM summary", error);
      } finally {
        setLoadingCrmSummary(false);
      }
    };

    const fetchResidentSummary = async () => {
      setLoadingResidentSummary(true);
      try {
        const res = await getCrmResidentInventorySummaryApi();
        setResidentSummary(res);
      } catch (error) {
        console.error("Failed to fetch CRM resident summary", error);
      } finally {
        setLoadingResidentSummary(false);
      }
    };

    const fetchCases = async () => {
      setLoadingCases(true);
      try {
        const res = await getUsersApi({ role: "RESIDENT", limit: 5 });
        const list = (res as any)?.data?.users || (res as any)?.data?.items || (res as any)?.items || (res as any)?.data || [];
        setOnboardingCases(Array.isArray(list) ? list : []);
      } catch (error) {
        console.error("Failed to fetch onboarding cases", error);
      } finally {
        setLoadingCases(false);
      }
    };

    fetchSummary();
    fetchResidentSummary();
    fetchCases();
  }, []);

  useEffect(() => {
    if (activeGroupOfficeTab === "reminders") {
      const fetchEligibleBuyers = async () => {
        setLoadingEligibleBuyers(true);
        try {
          const res = await getUsersApi({ role: "RESIDENT", limit: 5 });
          const list = (res as any)?.data?.users || (res as any)?.data?.items || (res as any)?.items || (res as any)?.data || [];
          setEligibleBuyers(Array.isArray(list) ? list : []);
        } catch (error) {
          console.error("Failed to fetch eligible buyers", error);
        } finally {
          setLoadingEligibleBuyers(false);
        }
      };
      
      const fetchTemplate = async () => {
        try {
          const res = await getReminderTemplateApi();
          setReminderTemplate(res?.data || res);
        } catch (error) {
          console.error("Failed to fetch reminder template", error);
        }
      };
      
      fetchEligibleBuyers();
      fetchTemplate();
    }
  }, [activeGroupOfficeTab]);

  const renderTemplateWithTokens = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\{.*?\})/g);
    return parts.map((part, index) => {
      if (part.startsWith("{") && part.endsWith("}")) {
        return (
          <Box
            key={index}
            component="span"
            sx={{
              bgcolor: "#f3e8ff",
              color: "#7e22ce",
              px: 1,
              py: 0.25,
              borderRadius: "4px",
              fontSize: "0.75rem",
              fontWeight: 600,
              mx: 0.5,
              display: "inline-block",
            }}
          >
            {part}
          </Box>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const handleSaveTemplate = async () => {
    setSavingTemplate(true);
    try {
      const res = await updateReminderTemplateApi(editTemplateForm);
      setReminderTemplate(res?.data || res || editTemplateForm);
      setIsEditingTemplate(false);
    } catch (error) {
      console.error("Failed to update template", error);
    } finally {
      setSavingTemplate(false);
    }
  };

  useEffect(() => {
    if (activeGroupOfficeTab !== "inventory") return;

    const fetchFlats = async () => {
      setLoadingInventoryFlats(true);
      try {
        const params: any = { page: inventoryPage, limit: 10 };
        if (inventorySearch) params.search = inventorySearch;
        if (inventoryProject !== "All") params.projectId = inventoryProject; // Or handle mapping to project IDs if needed
        if (inventoryStatus !== "All") params.status = inventoryStatus.toUpperCase();
        if (inventoryVisibility !== "All") params.visibility = inventoryVisibility.toUpperCase();
        
        const res: any = await getAllFlatsApi(params);
        
        let list: any[] = [];
        if (Array.isArray(res)) {
          list = res;
        } else if (Array.isArray(res?.data?.data)) {
          list = res.data.data;
        } else if (Array.isArray(res?.data?.flats)) {
          list = res.data.flats;
        } else if (Array.isArray(res?.data)) {
          list = res.data;
        } else if (Array.isArray(res?.flats)) {
          list = res.flats;
        } else if (Array.isArray(res?.items)) {
          list = res.items;
        }
        
        setInventoryFlats((prev) => (inventoryPage === 1 ? list : [...prev, ...list]));
        
        const pagination = res?.data?.pagination || res?.pagination;
        if (pagination) {
          setInventoryTotalPages(pagination.pages || 1);
          setInventoryTotalFlats(pagination.total || 0);
        } else {
          setInventoryTotalPages(1);
          setInventoryTotalFlats(list.length);
        }
      } catch (error) {
        console.error("Failed to fetch inventory flats", error);
      } finally {
        setLoadingInventoryFlats(false);
      }
    };

    // Debounce the search input by a bit or just call it directly
    const timeoutId = setTimeout(() => fetchFlats(), 300);
    return () => clearTimeout(timeoutId);
  }, [activeGroupOfficeTab, inventorySearch, inventoryProject, inventoryStatus, inventoryVisibility, inventoryPage]);

  // Reset page when filters change
  useEffect(() => {
    setInventoryPage(1);
  }, [inventorySearch, inventoryProject, inventoryStatus, inventoryVisibility]);

  const [rechargeAmount, setRechargeAmount] = useState("");
  const [rechargeMethod, setRechargeMethod] = useState("CASH");
  const [rechargeRefId, setRechargeRefId] = useState("");
  const [rechargeRemarks, setRechargeRemarks] = useState("");

  const mockRfidUsers = [
    {
      name: "Rohit Mehra",
      id: "MRB-GR-1042 · B-1204",
      initials: "RM",
      status: "READY",
    },
    {
      name: "Meera Nair",
      id: "MRB-GR-1087 · A-0410",
      initials: "MN",
      status: "READY",
    },
    {
      name: "Neha Kapoor",
      id: "MRB-GR-1109 · A-1502",
      initials: "NK",
      status: "PENDING",
    },
    {
      name: "Harpreet Malhotra",
      id: "MRB-GR-1150 · A-2103",
      initials: "HM",
      status: "READY",
    },
  ];
  const [selectedRfidUser, setSelectedRfidUser] = useState(mockRfidUsers[0]);
  const [rfidCardType, setRfidCardType] = useState("Master");

  useEffect(() => {
    if (!residentSearchQuery && !selectedResident) {
      setResidentOptions([]);
      return;
    }
    const fetchResidents = async () => {
      setLoadingResidents(true);
      try {
        const p1 = getUsersApi({
          limit: 10,
          search: residentSearchQuery,
          role: "RESIDENT",
        });
        const p2 =
          residentSearchQuery && !residentSearchQuery.includes(" ")
            ? getUsersApi({
                limit: 5,
                cardNumber: residentSearchQuery.toUpperCase(),
                role: "RESIDENT",
              })
            : Promise.resolve(null);

        const [res1, res2] = await Promise.all([p1, p2]);

        const list1 =
          (res1 as any)?.data?.users ||
          (res1 as any)?.data?.items ||
          (res1 as any)?.items ||
          (res1 as any)?.data ||
          [];
        const list2 = res2
          ? (res2 as any)?.data?.users ||
            (res2 as any)?.data?.items ||
            (res2 as any)?.items ||
            (res2 as any)?.data ||
            []
          : [];

        const combined = Array.isArray(list1) ? [...list1] : [];
        if (Array.isArray(list2)) combined.push(...list2);

        const unique = Array.from(
          new Map(combined.map((item) => [item.id, item])).values(),
        );
        setResidentOptions(unique);
      } catch (e) {
        console.warn("resident search error:", e);
      } finally {
        setLoadingResidents(false);
      }
    };
    const timer = setTimeout(fetchResidents, 400);
    return () => clearTimeout(timer);
  }, [residentSearchQuery]);

  const handleRecharge = async () => {
    if (!memberId || !rechargeAmount) return;
    setRecharging(true);
    try {
      await adminRechargeUserWalletApi(memberId, {
        amount: Number(rechargeAmount),
        paymentMethod: rechargeMethod,
        referenceId: rechargeRefId,
        remarks: rechargeRemarks,
      } as any);
      setRechargeModalOpen(false);
      setRechargeAmount("");
      setRechargeRefId("");
      setRechargeRemarks("");
    } catch (e) {
      console.error("Recharge failed", e);
    } finally {
      setRecharging(false);
    }
  };

  if (view === "groupOffice") {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          fontFamily: '"Inter", sans-serif',
        }}
      >
        {/* Top User Profile Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: { xs: 2, md: 3 },
            borderBottom: "1px solid #e2e8f0",
            bgcolor: "#fafafa",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                bgcolor: "#f3e8ff",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <HeadsetMicIcon sx={{ color: "#7e22ce", fontSize: 22 }} />
            </Box>
            <Box>
              <Typography
                sx={{ fontWeight: 600, color: "#1e293b", fontSize: "0.95rem" }}
              >
                {userName}
              </Typography>
              <Typography sx={{ color: "#64748b", fontSize: "0.8rem" }}>
                Sales / CRM desk
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              bgcolor: "#f3e8ff",
              color: "#7e22ce",
              fontWeight: 600,
              fontSize: "0.75rem",
              px: 1.5,
              py: 0.75,
              borderRadius: "20px",
            }}
          >
            CRM portal
          </Box>
        </Box>

        {/* Group Office Content Area */}
        <Box sx={{ p: { xs: 3, md: 4 }, flexGrow: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 2,
              mb: 4,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"Cormorant Garamond", serif',
                  color: "#1e293b",
                  fontWeight: 600,
                  mb: 1,
                  fontSize: "2.2rem",
                }}
              >
                The Group Office
              </Typography>
              <Typography
                sx={{ color: "#64748b", fontSize: "0.95rem", mb: 1.5 }}
              >
                Marbella Group · onboarding, key handover, inventory & sales
              </Typography>
            </Box>
            <Button
              onClick={() => setView("home")}
              startIcon={<WorkOutlineIcon sx={{ fontSize: 18 }} />}
              sx={{
                backgroundColor: "#f3e8ff",
                color: "#7e22ce",
                boxShadow: "none",
                textTransform: "none",
                borderRadius: "12px",
                padding: "8px 16px",
                fontWeight: 600,
                "&:hover": { backgroundColor: "#e9d5ff", boxShadow: "none" },
              }}
            >
              Group Office · Switch
            </Button>
          </Box>

          {/* Tabs */}
          <Box sx={{ display: "flex", gap: 1, mb: 4 }}>
            {[
              "Onboarding & handover",
              "Inventory",
              "Payment plans",
              "Reminders",
              "Purchase requests",
              "Sales pipeline",
            ].map((tab, i) => (
              <Button
                key={i}
                onClick={() => setActiveGroupOfficeTab(tab.toLowerCase())}
                sx={{
                  bgcolor:
                    activeGroupOfficeTab === tab.toLowerCase() ||
                    (i === 0 && activeGroupOfficeTab === "onboarding")
                      ? "#2c5282"
                      : "#EEF3FA",
                  color:
                    activeGroupOfficeTab === tab.toLowerCase() ||
                    (i === 0 && activeGroupOfficeTab === "onboarding")
                      ? "#f7f7f7ff"
                      : "#6B7794",
                  textTransform: "none",
                  borderRadius: "10px",
                  padding: "8px 16px",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  "&:hover": {
                    bgcolor: "#2c5282",
                    color: "#ffffffff",
                  },
                }}
              >
                {tab}
              </Button>
            ))}
          </Box>

          {(activeGroupOfficeTab === "onboarding & handover" ||
            activeGroupOfficeTab === "onboarding") && (
            <Box>
              {/* Stat Boxes */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 3,
                  mb: 4,
                }}
              >
                {[
                  { value: crmSummary?.data?.counts?.collecting ?? "0", label: "COLLECTING", color: "#ab68eaff" },
                  { value: crmSummary?.data?.counts?.paidUp ?? "0", label: "PAID UP", color: "#bca462" },
                  { value: crmSummary?.data?.counts?.released ?? "0", label: "RELEASED", color: "#a667e2ff" },
                  { value: crmSummary?.data?.counts?.complete ?? "0", label: "COMPLETE", color: "#10b981" },
                ].map((stat, i) => (
                  <Box
                    key={i}
                    sx={{
                      border: "1px solid #394b63ff",
                      borderRadius: "12px",
                      py: 2.5,
                      px: 2,
                      textAlign: "center",
                      bgcolor: "#ffffff",
                    }}
                  >
                    {loadingCrmSummary ? (
                      <CircularProgress size={24} sx={{ color: stat.color, mb: 0.5 }} />
                    ) : (
                      <Typography
                        sx={{
                          fontSize: "1rem",
                          color: stat.color,
                          fontWeight: 800,
                          mb: 0.5,
                        }}
                      >
                        {stat.value}
                      </Typography>
                    )}
                    <Typography
                      sx={{
                        color: "#94a3b8",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        letterSpacing: "0.5px",
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Cases List */}
              <Box
                sx={{
                  bgcolor: "#f8fafc",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  overflow: "hidden",
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "#64748b",
                      fontSize: "0.85rem",
                    }}
                  >
                    Onboarding cases
                  </Typography>
                  <Typography sx={{ color: "#94a3b8", fontSize: "0.75rem" }}>
                    owners & tenants · post-sales
                  </Typography>
                </Box>

                <Box sx={{ maxHeight: 350, overflowY: "auto" }}>
                  {loadingCases ? (
                    <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
                      <CircularProgress size={24} sx={{ color: '#7e22ce' }} />
                    </Box>
                  ) : onboardingCases.length === 0 ? (
                    <Typography sx={{ p: 3, textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>No onboarding cases found.</Typography>
                  ) : onboardingCases.map((user: any, i: number) => {
                    const roleLabel = user.accountRole === "TENANT" ? "Tenant" : "Owner";
                    const flatNum = user.flat?.flatNumber || user.flatNumber || "Unknown Flat";
                    const towerName = user.towerName || user.flat?.tower?.name || user.flat?.towerName || user.tower?.name || (user.flat?.towerId ? "Tower " + user.flat.towerId.slice(0, 4).toUpperCase() : "Unknown Tower");
                    const meta = `${roleLabel} · ${flatNum} · ${towerName}`;
                    
                    let status = "Collecting · 70% paid";
                    let statusColor = "#7e22ce";
                    let isBar = true;
                    let barProgress = "70%";

                    if (user.status === "ACTIVE") {
                      status = "Handover complete — active";
                      statusColor = "#10b981";
                      isBar = false;
                    } else if (user.status === "PENDING") {
                      status = "Released — handover pending";
                      statusColor = "#4f46e5";
                      isBar = false;
                    }

                    return (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        py: 1.5,
                        px: 2.5,
                        borderBottom: i < 4 ? "1px solid #e2e8f0" : "none",
                        bgcolor: "#ffffff",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2.5 }}
                      >
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            bgcolor: "#f5edff",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <BusinessOutlinedIcon
                            sx={{ color: "#9333ea", fontSize: 20 }}
                          />
                        </Box>
                        <Box>
                          <Typography
                            sx={{
                              fontWeight: 700,
                              color: "#1e293b",
                              fontSize: "0.95rem",
                            }}
                          >
                            {user.name || "Unknown"}
                          </Typography>
                          <Typography
                            sx={{
                              color: "#94a3b8",
                              fontSize: "0.75rem",
                              mt: 0.25,
                            }}
                          >
                            {meta}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 4 }}
                      >
                        <Box sx={{ textAlign: "right", minWidth: 160 }}>
                          <Typography
                            sx={{
                              color: statusColor,
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              mb: isBar ? 1 : 0,
                            }}
                          >
                            {status}
                          </Typography>
                          {isBar && (
                            <Box
                              sx={{
                                width: "100%",
                                height: "4px",
                                bgcolor: "#f1f5f9",
                                borderRadius: "2px",
                                overflow: "hidden",
                              }}
                            >
                              <Box
                                sx={{
                                  width: barProgress,
                                  height: "100%",
                                  bgcolor: statusColor,
                                  borderRadius: "2px",
                                }}
                              />
                            </Box>
                          )}
                        </Box>
                        <Button
                          variant="contained"
                          onClick={() => setSelectedOnboardingCase(user)}
                          sx={{
                            bgcolor: "#7A4FB5",
                            color: "#fff",
                            textTransform: "none",
                            borderRadius: "8px",
                            boxShadow: "none",
                            fontWeight: 600,
                            px: 3,
                            py: 0.5,
                            "&:hover": {
                              bgcolor: "#653F97",
                              boxShadow: "none",
                            },
                          }}
                        >
                          Open
                        </Button>
                      </Box>
                    </Box>
                    );
                  })}
                </Box>
              </Box>

              <Typography
                sx={{
                  color: "#94a3b8",
                  fontSize: "0.75rem",
                  lineHeight: 1.5,
                  textAlign: "center",
                }}
              >
                CRM allots the unit, keeps the payment trail, and builds the
                document file over time — every action time & date stamped.
                Documents unlock only when payments are complete.
                (Uploads/payments shown are prototype actions.)
              </Typography>
            </Box>
          )}

          {activeGroupOfficeTab === "inventory" && (
            <Box>
              {/* Inventory Header */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  mb: 3,
                }}
              >
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: '"Cormorant Garamond", serif',
                      color: "#1e293b",
                      fontWeight: 600,
                      mb: 0.5,
                      fontSize: "1.8rem",
                    }}
                  >
                    Inventory
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: "0.85rem" }}>
                    The live unit book — edit anything, changes are
                    approval-gated.
                  </Typography>
                </Box>
                <Button
                  startIcon={<AutorenewOutlinedIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    backgroundColor: "#f8fafc",
                    color: "#94a3b8",
                    border: "1px solid #e2e8f0",
                    boxShadow: "none",
                    textTransform: "none",
                    borderRadius: "8px",
                    padding: "4px 12px",
                    fontWeight: 500,
                    fontSize: "0.75rem",
                    "&:hover": { backgroundColor: "#f1f5f9" },
                  }}
                >
                  Auto-backup · snapshot 2d ago
                </Button>
              </Box>

              {/* Sub tabs */}
              <Box sx={{ display: "flex", gap: 1, mb: 4 }}>
                {["Inventory", "My submissions", "Change log"].map((tab, i) => (
                  <Button
                    key={i}
                    onClick={() => setActiveInventoryTab(tab)}
                    sx={{
                      bgcolor: activeInventoryTab === tab ? "#1e3a8a" : "#f1f5f9",
                      color: activeInventoryTab === tab ? "#ffffff" : "#475569",
                      textTransform: "none",
                      borderRadius: "8px",
                      padding: "6px 16px",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      "&:hover": { bgcolor: activeInventoryTab === tab ? "#1e3a8a" : "#e2e8f0" },
                    }}
                  >
                    {tab}
                  </Button>
                ))}
              </Box>

              {activeInventoryTab === "My submissions" && (
                <Box
                  sx={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "16px",
                    p: 4,
                    bgcolor: "#ffffff",
                    textAlign: "center",
                    minHeight: "200px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1
                  }}
                >
                  <SendOutlinedIcon sx={{ fontSize: 24, color: "#475569", mb: 1, transform: "rotate(-45deg)" }} />
                  <Typography sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>
                    No pending submissions
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: "0.85rem" }}>
                    Edit a unit and submit it — it waits here until Admin approves.
                  </Typography>
                </Box>
              )}

              {activeInventoryTab === "Change log" && (
                <Box
                  sx={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    bgcolor: "#f8fafc",
                    minHeight: "150px",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative"
                  }}
                >
                  <Box sx={{ p: 2, borderBottom: "1px solid #e2e8f0" }}>
                    <Typography sx={{ color: "#475569", fontSize: "0.85rem", fontWeight: 500 }}>
                      Every applied change - newest first
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Typography sx={{ color: "#64748b", fontSize: "0.85rem" }}>
                      No changes yet this session.
                    </Typography>
                  </Box>
                </Box>
              )}

              {activeInventoryTab === "Inventory" && (
                <Box>
                  {/* Stat Cards (dynamic projects) */}
                  {loadingResidentSummary ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress size={24} sx={{ color: '#1e3a8a' }} />
                </Box>
              ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 3,
                  mb: 4,
                }}
              >
                {(residentSummary?.data?.projects || []).map((proj: any, i: number) => {
                  const residents = proj.counts?.residentOwners || 0;
                  const guests = proj.counts?.guests || 0;
                  const tenants = proj.counts?.tenants || 0;
                  const totalLoaded = proj.flats?.total || 0;
                  const activeMembers = proj.counts?.activeMembers || (residents + guests + tenants);
                  
                  return (
                  <Box
                    key={i}
                    sx={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      p: 3,
                      bgcolor: "#ffffff",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#1e293b",
                          fontSize: "1rem",
                        }}
                      >
                        {proj.project?.name || "Unknown Project"}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#94a3b8",
                          fontSize: "0.8rem",
                          fontWeight: 500,
                        }}
                      >
                        {activeMembers} of {totalLoaded} loaded
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                      <Box
                        sx={{
                          flex: 1,
                          bgcolor: "#f4f9f5ff",
                          borderRadius: "8px",
                          p: 1.5,
                          textAlign: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#10b981",
                            fontSize: "1.2rem",
                            fontWeight: 700,
                            fontFamily: '"Cormorant Garamond", serif',
                            lineHeight: 1,
                          }}
                        >
                          {residents}
                        </Typography>
                        <Typography
                          sx={{
                            color: "#94a3b8",
                            fontSize: "0.65rem",
                            fontWeight: 600,
                            mt: 0.5,
                          }}
                        >
                          Residents
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          flex: 1,
                          bgcolor: "#faf9f3ff",
                          borderRadius: "8px",
                          p: 1.5,
                          textAlign: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#bca462",
                            fontSize: "1.2rem",
                            fontWeight: 700,
                            fontFamily: '"Cormorant Garamond", serif',
                            lineHeight: 1,
                          }}
                        >
                          {guests}
                        </Typography>
                        <Typography
                          sx={{
                            color: "#94a3b8",
                            fontSize: "0.65rem",
                            fontWeight: 600,
                            mt: 0.5,
                          }}
                        >
                          Guest
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          flex: 1,
                          bgcolor: "#f1f5f9",
                          borderRadius: "8px",
                          p: 1.5,
                          textAlign: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#475569",
                            fontSize: "1.2rem",
                            fontWeight: 700,
                            fontFamily: '"Cormorant Garamond", serif',
                            lineHeight: 1,
                          }}
                        >
                          {tenants}
                        </Typography>
                        <Typography
                          sx={{
                            color: "#94a3b8",
                            fontSize: "0.65rem",
                            fontWeight: 600,
                            mt: 0.5,
                          }}
                        >
                          Tenants
                        </Typography>
                      </Box>
                    </Box>

                    <Typography
                      sx={{
                        color: "#069968ff",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mb: 2,
                      }}
                    >
                      <CheckCircleIcon sx={{ fontSize: 14 }} />
                      {residents} + {guests} + {tenants} ={" "}
                      {residents + guests + tenants} · reconciles
                    </Typography>

                    <Typography
                      sx={{
                        color: "#069968ff",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <VerifiedUserOutlinedIcon sx={{ fontSize: 16 }} />
                      Every unit checks out.
                    </Typography>
                  </Box>
                  );
                })}
              </Box>
              )}

              {/* Filters Block */}
              <Box
                sx={{
                  mb: 4,
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  p: 3,
                  bgcolor: "#ffffff",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    bgcolor: "#f8fafc",
                    borderRadius: "12px",
                    p: 1.5,
                    mb: 3,
                  }}
                >
                  <SearchIcon sx={{ color: "#94a3b8", mr: 1, fontSize: 20 }} />
                  <input
                    type="text"
                    placeholder="Search unit, type or buyer..."
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    style={{
                      border: "none",
                      background: "transparent",
                      outline: "none",
                      width: "100%",
                      fontSize: "0.95rem",
                      color: "#1e293b",
                    }}
                  />
                </Box>

                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 4, mb: 2 }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#64748b",
                        fontSize: "0.7rem",
                        letterSpacing: "0.5px",
                      }}
                    >
                      PROJECT
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {["All", "Grand", "Twin Tower", "Royce"].map((opt, i) => (
                        <Box
                          key={i}
                          onClick={() => setInventoryProject(opt)}
                          sx={{
                            px: 2,
                            py: 0.75,
                            borderRadius: "8px",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            bgcolor: inventoryProject === opt ? "#1e3a8a" : "#f8fafc",
                            color: inventoryProject === opt ? "#ffffff" : "#64748b",
                          }}
                        >
                          {opt}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#64748b",
                        fontSize: "0.7rem",
                        letterSpacing: "0.5px",
                      }}
                    >
                      STATUS
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {["All", "Available", "Held", "Sold"].map((opt, i) => (
                        <Box
                          key={i}
                          onClick={() => setInventoryStatus(opt)}
                          sx={{
                            px: 2,
                            py: 0.75,
                            borderRadius: "8px",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            bgcolor: inventoryStatus === opt ? "#1e3a8a" : "#f8fafc",
                            color: inventoryStatus === opt ? "#ffffff" : "#64748b",
                          }}
                        >
                          {opt}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#64748b",
                        fontSize: "0.7rem",
                        letterSpacing: "0.5px",
                      }}
                    >
                      VISIBILITY
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {["All", "Published", "Private"].map((opt, i) => (
                        <Box
                          key={i}
                          onClick={() => setInventoryVisibility(opt)}
                          sx={{
                            px: 2,
                            py: 0.75,
                            borderRadius: "8px",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            bgcolor: inventoryVisibility === opt ? "#1e3a8a" : "#f8fafc",
                            color: inventoryVisibility === opt ? "#ffffff" : "#64748b",
                          }}
                        >
                          {opt}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* List Header and Item */}
              <Box
                sx={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  bgcolor: "#ffffff",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                    borderBottom: "1px solid #e2e8f0",
                    bgcolor: "#f8fafc",
                    borderRadius: "12px 12px 0 0",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "#475569",
                      fontSize: "0.85rem",
                    }}
                  >
                    {inventoryTotalFlats} units
                  </Typography>
                  <Typography sx={{ color: "#94a3b8", fontSize: "0.75rem" }}>
                    tap a unit to edit · CRM edits go to Admin
                  </Typography>
                </Box>
                <Box 
                  sx={{ maxHeight: 400, overflowY: "auto" }}
                  onScroll={(e) => {
                    const target = e.target as HTMLDivElement;
                    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 10) {
                      if (!loadingInventoryFlats && inventoryPage < inventoryTotalPages) {
                        setInventoryPage((prev) => prev + 1);
                      }
                    }
                  }}
                >
                  {inventoryFlats.length === 0 && !loadingInventoryFlats ? (
                    <Typography sx={{ p: 4, textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                      No units match the given criteria.
                    </Typography>
                  ) : (
                    <>
                      {inventoryFlats.map((flat, i) => {
                    const priceFormatted = flat.price ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(flat.price) : "Price N/A";
                    
                    return (
                      <Box
                        key={i}
                        sx={{
                          p: 2.5,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          cursor: "pointer",
                          "&:hover": { bgcolor: "#f8fafc" },
                        }}
                      >
                        <Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                              mb: 0.5,
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight: 700,
                                color: "#1e293b",
                                fontSize: "0.95rem",
                              }}
                            >
                              {flat.flatNumber || "N/A"}
                            </Typography>
                            <Typography sx={{ color: "#64748b", fontSize: "0.9rem" }}>
                              {[flat.flatType, flat.area ? `${flat.area} sq ft` : null, flat.facing].filter(Boolean).join(" · ")}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography sx={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                              {flat.tower?.project?.name || "N/A"}
                            </Typography>
                            <Typography sx={{ color: "#64748b", fontSize: "0.8rem" }}>
                              {[flat.tower?.name || flat.towerName, flat.floor ? `Floor ${flat.floor}` : null, flat.ownerName].filter(Boolean).join(" · ")}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Box sx={{ textAlign: "right" }}>
                            <Typography
                              sx={{
                                fontWeight: 700,
                                color: "#1e293b",
                                fontSize: "1rem",
                                mb: 0.5,
                              }}
                            >
                              {priceFormatted}
                            </Typography>
                            {flat.status && (
                              <Box
                                sx={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  px: 1,
                                  py: 0.25,
                                  borderRadius: "4px",
                                  bgcolor: flat.status === "SOLD" ? "#eef2ff" : (flat.status === "HELD" ? "#fef3c7" : "#ecfdf5"),
                                  color: flat.status === "SOLD" ? "#4f46e5" : (flat.status === "HELD" ? "#d97706" : "#10b981"),
                                  fontSize: "0.65rem",
                                  fontWeight: 700,
                                }}
                              >
                                {flat.status}
                              </Box>
                            )}
                          </Box>
                          <ChevronRightOutlinedIcon
                            sx={{ color: "#cbd5e1", fontSize: 20 }}
                          />
                        </Box>
                      </Box>
                    );
                  })}
                  {loadingInventoryFlats && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                      <CircularProgress size={24} sx={{ color: '#1e3a8a' }} />
                    </Box>
                  )}
                  </>
                )}
                </Box>
              </Box>
              </Box>
              )}
            </Box>
          )}

          {activeGroupOfficeTab === "purchase requests" && <RequestsTab isCrm={true} />}

          {activeGroupOfficeTab === "payment plans" && (
            <Box sx={{ position: 'relative' }}>
              <Box sx={{ opacity: 0.6, pointerEvents: 'none', userSelect: 'none' }}>
                <PaymentPlansTab />
              </Box>
              <Box 
                sx={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10
                }}
              >
                <Box
                  sx={{
                    bgcolor: "#ffffff",
                    borderRadius: "16px",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                    border: "1px solid #e2e8f0",
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center"
                  }}
                >
                  <Typography sx={{ fontWeight: 700, color: "#1e293b", fontSize: "1.5rem", mb: 1, fontFamily: '"Cormorant Garamond", serif' }}>
                    Coming soon
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: "0.95rem" }}>
                    The Payment plans feature is currently being wired up.
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {activeGroupOfficeTab === "sales pipeline" && (
            <Box sx={{ position: 'relative' }}>
              <Box sx={{ opacity: 0.6, pointerEvents: 'none', userSelect: 'none' }}>
                <SalesPipelineTab />
              </Box>
              <Box 
                sx={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10
                }}
              >
                <Box
                  sx={{
                    bgcolor: "#ffffff",
                    borderRadius: "16px",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                    border: "1px solid #e2e8f0",
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center"
                  }}
                >
                  <Typography sx={{ fontWeight: 700, color: "#1e293b", fontSize: "1.5rem", mb: 1, fontFamily: '"Cormorant Garamond", serif' }}>
                    Coming soon
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: "0.95rem" }}>
                    The Sales pipeline feature is currently being wired up.
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {activeGroupOfficeTab === "reminders" && (
            <Box>
              {/* Reminders Header */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  mb: 3,
                }}
              >
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: '"Cormorant Garamond", serif',
                      color: "#1e293b",
                      fontWeight: 600,
                      mb: 0.5,
                      fontSize: "1.8rem",
                    }}
                  >
                    Payment reminders
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: "0.85rem" }}>
                    Buyers with an upcoming milestone — nudge them warmly, in
                    one click.
                  </Typography>
                </Box>
                <Button
                  startIcon={
                    <VisibilityOffOutlinedIcon sx={{ fontSize: 16 }} />
                  }
                  sx={{
                    backgroundColor: "#f3e8ff",
                    color: "#7e22ce",
                    boxShadow: "none",
                    textTransform: "none",
                    borderRadius: "8px",
                    padding: "6px 16px",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    "&:hover": { backgroundColor: "#e9d5ff" },
                  }}
                >
                  Hide template
                </Button>
              </Box>

              {/* Template Block */}
              <Box
                sx={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  overflow: "hidden",
                  mb: 4,
                  bgcolor: "#ffffff",
                }}
              >
                {/* Purple Header */}
                <Box
                  sx={{
                    bgcolor: "#7A4FB5",
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      color: "#ffffff",
                    }}
                  >
                    <DescriptionOutlinedIcon sx={{ fontSize: 18 }} />
                    <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                      Reminder template
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        bgcolor: "rgba(255,255,255,0.15)",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "6px",
                        color: "#ffffff",
                      }}
                    >
                      <EmailOutlinedIcon sx={{ fontSize: 14 }} />
                      <Typography sx={{ fontSize: "0.75rem", fontWeight: 600 }}>
                        Email
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        bgcolor: "rgba(255,255,255,0.15)",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "6px",
                        color: "#ffffff",
                      }}
                    >
                      <PhoneOutlinedIcon sx={{ fontSize: 14 }} />
                      <Typography sx={{ fontSize: "0.75rem", fontWeight: 600 }}>
                        SMS
                      </Typography>
                    </Box>
                    <Button
                      onClick={() => {
                        if (isEditingTemplate) {
                          setIsEditingTemplate(false);
                        } else {
                          setEditTemplateForm({
                            subjectTemplate: reminderTemplate?.subjectTemplate || "Gentle reminder - payment due for {Unit}, {Project}",
                            bodyTemplate: reminderTemplate?.bodyTemplate || "Dear {Name},\n\nYour payment of {Amount} towards {Unit}, {Project} - {Milestone} - is due on {Due date} ({Due label}).\n\nTeam Marbella",
                            channel: reminderTemplate?.channel || "BOTH"
                          });
                          setIsEditingTemplate(true);
                        }
                      }}
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "#fff",
                        textTransform: "none",
                        borderRadius: "6px",
                        px: 1.5,
                        py: 0.5,
                        ml: 1,
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        "&:hover": { bgcolor: "rgba(255,255,255,0.3)" }
                      }}
                    >
                      {isEditingTemplate ? "Cancel" : "Edit template"}
                    </Button>
                  </Box>
                </Box>

                {/* Template Content */}
                <Box sx={{ p: 3 }}>
                  {isEditingTemplate ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField
                        label="Subject Template"
                        fullWidth
                        value={editTemplateForm.subjectTemplate}
                        onChange={(e) => setEditTemplateForm({ ...editTemplateForm, subjectTemplate: e.target.value })}
                      />
                      <TextField
                        label="Body Template"
                        fullWidth
                        multiline
                        minRows={4}
                        value={editTemplateForm.bodyTemplate}
                        onChange={(e) => setEditTemplateForm({ ...editTemplateForm, bodyTemplate: e.target.value })}
                      />
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Channel:</Typography>
                        <Select
                          size="small"
                          value={editTemplateForm.channel}
                          onChange={(e) => setEditTemplateForm({ ...editTemplateForm, channel: e.target.value })}
                          sx={{ minWidth: 120 }}
                        >
                          <MenuItem value="EMAIL">Email</MenuItem>
                          <MenuItem value="SMS">SMS</MenuItem>
                          <MenuItem value="BOTH">Both</MenuItem>
                        </Select>
                        <Box sx={{ flex: 1 }} />
                        <Button 
                          variant="contained" 
                          onClick={handleSaveTemplate}
                          disabled={savingTemplate}
                          sx={{ bgcolor: '#7e22ce', '&:hover': { bgcolor: '#6b21a8' }, textTransform: 'none' }}
                        >
                          {savingTemplate ? <CircularProgress size={20} color="inherit" /> : "Save Template"}
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#64748b",
                          fontSize: "0.7rem",
                          letterSpacing: "0.5px",
                          mb: 1,
                        }}
                      >
                        SUBJECT
                      </Typography>
                      <Typography
                        sx={{
                          color: "#1e293b",
                          fontSize: "0.9rem",
                          mb: 3,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          flexWrap: "wrap",
                        }}
                      >
                        {renderTemplateWithTokens(reminderTemplate?.subjectTemplate || "Gentle reminder — payment due for {Unit}, {Project}")}
                      </Typography>

                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#64748b",
                          fontSize: "0.7rem",
                          letterSpacing: "0.5px",
                          mb: 1,
                        }}
                      >
                        MESSAGE
                      </Typography>
                      <Box
                        sx={{
                          bgcolor: "#f8fafc",
                          p: 3,
                          borderRadius: "12px",
                          border: "1px solid #f1f5f9",
                          mb: 3,
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#475569",
                            fontSize: "0.85rem",
                            lineHeight: 1.6,
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {renderTemplateWithTokens(reminderTemplate?.bodyTemplate || "Dear {Name},\n\nYour payment of {Amount} towards {Unit}, {Project} - {Milestone} - is due on {Due date} ({Due label}).\n\nKindly arrange the payment on time to keep your booking benefits intact and avoid any late charges. We're delighted to have you in the Marbella family and are here to help with anything you need.\n\nWarm regards,\nTeam Marbella")}
                        </Typography>
                      </Box>
                    </>
                  )}

                  <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                    <AutoAwesomeIcon
                      sx={{ color: "#9333ea", fontSize: 18, mt: 0.25 }}
                    />
                    <Typography
                      sx={{
                        color: "#94a3b8",
                        fontSize: "0.75rem",
                        lineHeight: 1.5,
                      }}
                    >
                      The highlighted{" "}
                      <Box
                        component="span"
                        sx={{ color: "#7e22ce", fontWeight: 700 }}
                      >
                        fields
                      </Box>{" "}
                      auto-fill for each buyer below — their exact legal name,
                      amount, unit, milestone and due date. Overdue buyers get
                      the same message with an "overdue" line. Preview any row
                      to see the final message.
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Buyers List Header */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: "#64748b",
                    fontSize: "0.85rem",
                  }}
                >
                  {eligibleBuyers.length} buyers eligible
                </Typography>
                <Button
                  onClick={() => {
                    if (selectedBuyers.length === eligibleBuyers.length) {
                      setSelectedBuyers([]);
                    } else {
                      setSelectedBuyers(eligibleBuyers.map((_, i) => i));
                    }
                  }}
                  sx={{
                    bgcolor: "#f3e8ff",
                    color: "#7e22ce",
                    textTransform: "none",
                    borderRadius: "8px",
                    px: 2,
                    py: 0.5,
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    "&:hover": { bgcolor: "#e9d5ff" },
                  }}
                >
                  {selectedBuyers.length === eligibleBuyers.length && eligibleBuyers.length > 0 ? "Deselect all" : "Select all eligible"}
                </Button>
              </Box>

              {/* Buyers List */}
              {loadingEligibleBuyers ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress size={24} sx={{ color: '#7e22ce' }} />
                </Box>
              ) : eligibleBuyers.length === 0 ? (
                <Typography sx={{ p: 4, textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                  No eligible buyers found.
                </Typography>
              ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {eligibleBuyers.map((buyer, i) => {
                  const isSelected = selectedBuyers.includes(i);
                  const flatNum = buyer.flat?.flatNumber || buyer.flatNumber || "Unknown Flat";
                  const towerName = buyer.towerName || buyer.flat?.tower?.name || buyer.flat?.towerName || buyer.tower?.name || "Unknown Tower";
                  const meta = `${flatNum} · ${towerName} · Next installment`;
                  
                  return (
                  <Box
                    key={i}
                    sx={{
                      border: isSelected ? "1px solid #7e22ce" : "1px solid #e2e8f0",
                      borderRadius: "12px",
                      p: 2.5,
                      bgcolor: isSelected ? "#fdfafc" : "#ffffff",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
                    >
                      <Box
                        onClick={() => {
                          if (isSelected) {
                            setSelectedBuyers(selectedBuyers.filter(index => index !== i));
                          } else {
                            setSelectedBuyers([...selectedBuyers, i]);
                          }
                        }}
                        sx={{
                          mt: 0.5,
                          width: 18,
                          height: 18,
                          border: isSelected ? "none" : "1.5px solid #cbd5e1",
                          bgcolor: isSelected ? "#7e22ce" : "transparent",
                          borderRadius: "4px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {isSelected && <CheckCircleOutlineIcon sx={{ color: "#fff", fontSize: 16 }} />}
                      </Box>
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: 700,
                              color: "#1e293b",
                              fontSize: "0.95rem",
                            }}
                          >
                            {buyer.name || "Unknown"}
                          </Typography>
                          <Box
                            sx={{
                              bgcolor: "#fef3c7",
                              color: "#d97706",
                              px: 1,
                              py: 0.25,
                              borderRadius: "4px",
                              fontSize: "0.65rem",
                              fontWeight: 700,
                            }}
                          >
                            Due soon
                          </Box>
                        </Box>
                        <Typography
                          sx={{ color: "#64748b", fontSize: "0.8rem" }}
                        >
                          {meta}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#1e293b",
                          fontSize: "1rem",
                          mb: 0.5,
                        }}
                      >
                      </Typography>
                      <Typography
                        onClick={async () => {
                          setPreviewModalOpen(true);
                          setPreviewLoading(true);
                          setPreviewData(null);
                          setPreviewBuyerId(buyer.id || "mock-id");
                          try {
                            const res = await previewReminderApi({ milestoneId: buyer.id || "mock-id", channel: "EMAIL" });
                            setPreviewData(res?.data || res);
                          } catch (err) {
                            console.error("Preview failed", err);
                          } finally {
                            setPreviewLoading(false);
                          }
                        }}
                        sx={{
                          color: "#7A4FB5",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Preview message
                      </Typography>
                    </Box>
                  </Box>
                  );
                })}
              </Box>
              )}
            </Box>
          )}
        </Box>

        {/* Onboarding Case Details Modal */}
        <OnboardingCaseModal
          open={!!selectedOnboardingCase}
          onClose={() => setSelectedOnboardingCase(null)}
          user={selectedOnboardingCase}
        />

        {/* Reminder Preview Dialog */}
        <Dialog 
          open={previewModalOpen} 
          onClose={() => setPreviewModalOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: "16px", overflow: "hidden" }
          }}
        >
          <Box sx={{ bgcolor: "#7A4FB5", color: "#fff", p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              <Box sx={{ bgcolor: "rgba(255,255,255,0.2)", p: 0.75, borderRadius: "8px", display: "flex" }}>
                <EmailOutlinedIcon sx={{ fontSize: 20 }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>Reminder preview</Typography>
                <Typography sx={{ fontSize: "0.75rem", opacity: 0.9 }}>
                  {previewData?.recipient?.name || "Loading..."}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={() => setPreviewModalOpen(false)} size="small" sx={{ color: "#fff" }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <DialogContent sx={{ p: 0 }}>
            {previewLoading ? (
              <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}><CircularProgress /></Box>
            ) : previewData ? (
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, pb: 2, borderBottom: "1px solid #f1f5f9", color: "#64748b", fontSize: "0.75rem" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <EmailOutlinedIcon sx={{ fontSize: 14 }} /> {previewData?.recipient?.email}
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <PhoneOutlinedIcon sx={{ fontSize: 14 }} /> {previewData?.recipient?.phoneMasked}
                  </Box>
                </Box>
                <Typography sx={{ color: "#334155", fontSize: "0.9rem", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                  {previewData?.message}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ p: 4, textAlign: "center", color: "error.main" }}>Failed to load preview</Box>
            )}
          </DialogContent>
          {previewData && !previewLoading && (
            <DialogActions sx={{ p: 2, borderTop: "1px solid #e2e8f0", bgcolor: "#f8fafc" }}>
              <Button onClick={() => setPreviewModalOpen(false)} sx={{ color: "#64748b" }}>
                Cancel
              </Button>
              <Button
                variant="contained"
                disabled={sendingReminders}
                onClick={async () => {
                  if (!previewBuyerId) return;
                  setSendingReminders(true);
                  try {
                    await sendRemindersApi({ milestoneIds: [previewBuyerId], channel: "EMAIL" });
                    setPreviewModalOpen(false);
                    alert("Reminder sent successfully!");
                  } catch (err) {
                    console.error("Failed to send reminder", err);
                    alert("Failed to send reminder");
                  } finally {
                    setSendingReminders(false);
                  }
                }}
                sx={{
                  bgcolor: "#7e22ce",
                  "&:hover": { bgcolor: "#6b21a8" },
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 600,
                }}
                startIcon={sendingReminders ? <CircularProgress size={16} color="inherit" /> : <SendIcon sx={{ fontSize: 18 }} />}
              >
                {sendingReminders ? "Sending..." : "Send email + SMS"}
              </Button>
            </DialogActions>
          )}
        </Dialog>

        {/* Sticky Bottom Send Bar */}
        {selectedBuyers.length > 0 && activeGroupOfficeTab === "reminders" && (
          <Box
            sx={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: "#fff",
              borderTop: "1px solid #e2e8f0",
              boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.05)",
              p: 2,
              px: { xs: 2, md: 4 },
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 1200,
            }}
          >
            <Typography sx={{ fontWeight: 600, color: "#1e293b" }}>
              {selectedBuyers.length} selected
            </Typography>
            <Button
              variant="contained"
              disabled={sendingReminders}
              onClick={async () => {
                setSendingReminders(true);
                try {
                  const milestoneIds = selectedBuyers.map(i => eligibleBuyers[i].id);
                  await sendRemindersApi({ milestoneIds, channel: "EMAIL" });
                  setSelectedBuyers([]);
                  alert("Reminders sent successfully!");
                } catch (err) {
                  console.error("Failed to send reminders", err);
                  alert("Failed to send reminders");
                } finally {
                  setSendingReminders(false);
                }
              }}
              sx={{
                bgcolor: "#7e22ce",
                "&:hover": { bgcolor: "#6b21a8" },
                borderRadius: "8px",
                px: 3,
                py: 1,
                textTransform: "none",
                fontWeight: 600,
              }}
              startIcon={sendingReminders ? <CircularProgress size={16} color="inherit" /> : <SendIcon sx={{ fontSize: 18 }} />}
            >
              {sendingReminders ? "Sending..." : "Send email + SMS"}
            </Button>
          </Box>
        )}
      </Box>
    );
  }

  if (view === "concierge") {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          fontFamily: '"Inter", sans-serif',
        }}
      >
        {/* Top User Profile Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: { xs: 2, md: 3 },
            borderBottom: "1px solid #e2e8f0",
            bgcolor: "#fafafa",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                bgcolor: "#f3e8ff",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <HeadsetMicIcon sx={{ color: "#7e22ce", fontSize: 22 }} />
            </Box>
            <Box>
              <Typography
                sx={{ fontWeight: 600, color: "#1e293b", fontSize: "0.95rem" }}
              >
                {userName}
              </Typography>
              <Typography sx={{ color: "#64748b", fontSize: "0.8rem" }}>
                Sales / CRM desk
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              bgcolor: "#f3e8ff",
              color: "#7e22ce",
              fontWeight: 600,
              fontSize: "0.75rem",
              px: 1.5,
              py: 0.75,
              borderRadius: "20px",
            }}
          >
            CRM portal
          </Box>
        </Box>

        {/* Concierge Content Area */}
        <Box sx={{ p: { xs: 3, md: 4 }, flexGrow: 1, position: "relative" }}>
          
          {/* Top Row: Title & Switch Button */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"Cormorant Garamond", serif',
                  color: "#1e293b",
                  fontWeight: 600,
                  mb: 1,
                  fontSize: "2.2rem",
                }}
              >
                Residence Concierge
              </Typography>
              <Typography sx={{ color: "#64748b", fontSize: "0.95rem" }}>
                Club Marbella · Marbella Grand clubhouse — profiles, RFID cards, plans & bookings
              </Typography>
            </Box>
            <Button
              onClick={() => setView("home")}
              startIcon={<HeadsetMicIcon sx={{ fontSize: 18 }} />}
              sx={{
                backgroundColor: "#e8eff7",
                color: "#2a5c8d",
                boxShadow: "none",
                textTransform: "none",
                borderRadius: "12px",
                padding: "8px 16px",
                fontWeight: 600,
                "&:hover": { backgroundColor: "#d0e1f0", boxShadow: "none" },
              }}
            >
              Residence Concierge · Switch
            </Button>
          </Box>

          {/* Second Row: Location text & Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                color: "#a0890ae3",
                px: 1,
                py: 0.25,
                borderRadius: "4px",
              }}
            >
              <LocationOnOutlinedIcon sx={{ fontSize: 14 }} />
              <Typography sx={{ fontSize: "0.75rem", fontWeight: 500 }}>
                Club Marbella is for Marbella Grand members only — for now.
              </Typography>
            </Box>
            
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button 
                onClick={() => setCreateProfileModalOpen(true)}
                variant="contained"
                startIcon={<PersonAddAltOutlinedIcon sx={{ fontSize: 18 }} />} 
                sx={{
                  bgcolor: "#f8f3e6",
                  color: "#a17a3f",
                  boxShadow: "none",
                  textTransform: "none",
                  borderRadius: "12px",
                  padding: "8px 16px",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#f0e8d5", boxShadow: "none" },
                }}
              >
                Create profile
              </Button>
              <Button
                onClick={() => setPopulationModalOpen(true)}
                startIcon={<PeopleAltOutlinedIcon sx={{ fontSize: 18 }} />}
                sx={{
                  backgroundColor: "#e8eff7",
                  color: "#2a5c8d",
                  boxShadow: "none",
                  textTransform: "none",
                  borderRadius: "12px",
                  padding: "8px 16px",
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "#d0e1f0", boxShadow: "none" },
                }}
              >
                Population
              </Button>

              <Button
                onClick={() => setScanModalOpen(true)}
                startIcon={<SensorsIcon sx={{ fontSize: 18 }} />}
                sx={{
                  backgroundColor: "#5a3d7a",
                  color: "#fff",
                  boxShadow: "none",
                  textTransform: "none",
                  borderRadius: "12px",
                  padding: "8px 16px",
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "#472e61", boxShadow: "none" },
                }}
              >
                Scan / block card
              </Button>
            </Box>
          </Box>

          {/* Tabs */}
          <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
            <Button
              onClick={() => setActiveTab("helpdesk")}
              sx={{
                bgcolor: activeTab === "helpdesk" ? "#2c5282" : "#f0f2f5",
                color: activeTab === "helpdesk" ? "#fff" : "#666",
                textTransform: "none",
                borderRadius: "12px",
                padding: "6px 20px",
                fontWeight: 600,
                fontSize: "14px",
                "&:hover": {
                  bgcolor: activeTab === "helpdesk" ? "#1a365d" : "#e2e8f0",
                },
              }}
            >
              Help desk
            </Button>
            <Button
              onClick={() => setActiveTab("rfid")}
              sx={{
                bgcolor: activeTab === "rfid" ? "#2c5282" : "#f0f2f5",
                color: activeTab === "rfid" ? "#fff" : "#666",
                textTransform: "none",
                borderRadius: "12px",
                padding: "6px 20px",
                fontWeight: 600,
                fontSize: "14px",
                "&:hover": {
                  bgcolor: activeTab === "rfid" ? "#1a365d" : "#e2e8f0",
                },
              }}
            >
              RFID cards
            </Button>
            <Button
              onClick={() => setActiveTab("intake")}
              sx={{
                bgcolor: activeTab === "intake" ? "#2c5282" : "#f0f2f5",
                color: activeTab === "intake" ? "#fff" : "#666",
                textTransform: "none",
                borderRadius: "12px",
                padding: "6px 20px",
                fontWeight: 600,
                fontSize: "14px",
                "&:hover": {
                  bgcolor: activeTab === "intake" ? "#1a365d" : "#e2e8f0",
                },
              }}
            >
              Intake
            </Button>
          </Box>

          {/* Tabs Content */}
          {activeTab === "helpdesk" && (
            <Box
              sx={{
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                p: 3,
                bgcolor: "#ffffff",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  color: "#1e293b",
                  fontSize: "1.05rem",
                  mb: 3,
                }}
              >
                Member counter — book & recharge on a member's behalf
              </Typography>

              <ResidentSearchUI
                residentOptions={residentOptions}
                selectedResident={selectedResident}
                setSelectedResident={setSelectedResident}
                setMemberId={setMemberId}
                setResidentSearchQuery={setResidentSearchQuery}
                loadingResidents={loadingResidents}
                demoIds={demoIds}
              />

              <ResidentProfileCard
                user={selectedResident}
                walletBalance={0} // Ideally we fetch real balance, but defaulting to 0 as in screenshot
                onShowRechargeQR={() => setQrRechargeModalOpen(true)}
              />
            </Box>
          )}

          {activeTab === "rfid" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Header */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "#1e293b",
                      fontSize: "1.35rem",
                      mb: 0.5,
                    }}
                  >
                    Print RFID card
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: "0.85rem" }}>
                    Prints only when the profile is settled and the ₹2,000
                    security is verified. The card carries no money — it's
                    access & identity.
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    bgcolor: "#eefcf3",
                    color: "#16a34a",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: "20px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: "#16a34a",
                    }}
                  />
                  Card printer · Evolis Primacy 2 · Ready
                </Box>
              </Box>

              {/* Grid Layout */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
                  gap: 3,
                }}
              >
                {/* Left Column - Member List */}
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Box
                    sx={{
                      bgcolor: "#ffffff",
                      borderRadius: "16px",
                      border: "1px solid #f1f5f9",
                      p: 3,
                      mb: 3,
                    }}
                  >
                    <TextField
                      fullWidth
                      placeholder="Find a Marbella Grand member..."
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <SearchIcon
                            sx={{ color: "#94a3b8", mr: 1, fontSize: 20 }}
                          />
                        ),
                        sx: {
                          bgcolor: "#f8fafc",
                          borderRadius: "12px",
                          "& fieldset": { border: "none" },
                          fontSize: "0.9rem",
                          height: 44,
                        },
                      }}
                      sx={{ mb: 2 }}
                    />

                    <Stack
                      spacing={0}
                      sx={{
                        border: "1px solid #f1f5f9",
                        borderRadius: "12px",
                        overflow: "hidden",
                      }}
                    >
                      {mockRfidUsers.map((u, i) => (
                        <Box
                          key={i}
                          onClick={() => setSelectedRfidUser(u)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            p: "12px 16px",
                            borderBottom:
                              i < mockRfidUsers.length - 1
                                ? "1px solid #f8fafc"
                                : "none",
                            bgcolor:
                              selectedRfidUser.name === u.name
                                ? "#f8fafc"
                                : "#ffffff",
                            cursor: "pointer",
                            "&:hover": { bgcolor: "#f8fafc" },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor:
                                  selectedRfidUser.name === u.name
                                    ? "#475569"
                                    : "#f1f5f9",
                                color:
                                  selectedRfidUser.name === u.name
                                    ? "#ffffff"
                                    : "#64748b",
                                fontWeight: 600,
                                width: 32,
                                height: 32,
                                fontSize: "0.8rem",
                              }}
                            >
                              {u.initials}
                            </Avatar>
                            <Box>
                              <Typography
                                sx={{
                                  fontWeight: 600,
                                  color: "#1e293b",
                                  fontSize: "0.85rem",
                                }}
                              >
                                {u.name}
                              </Typography>
                              <Typography
                                sx={{ color: "#94a3b8", fontSize: "0.7rem" }}
                              >
                                {u.id}
                              </Typography>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              bgcolor:
                                u.status === "READY" ? "#eefcf3" : "#fff3ec",
                              color:
                                u.status === "READY" ? "#16a34a" : "#ea580c",
                              px: 1,
                              py: 0.25,
                              borderRadius: "4px",
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              letterSpacing: "0.5px",
                            }}
                          >
                            {u.status}
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                  <Box sx={{ px: 1 }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#94a3b8",
                        fontSize: "0.7rem",
                        mb: 1,
                        letterSpacing: "0.5px",
                      }}
                    >
                      CARD NO
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                      {["Master", "Dependent", "Guest"].map((type) => (
                        <Button
                          key={type}
                          onClick={() => setRfidCardType(type)}
                          sx={{
                            bgcolor:
                              rfidCardType === type ? "#1e3a8a" : "#f1f5f9",
                            color:
                              rfidCardType === type ? "#ffffff" : "#64748b",
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: "20px",
                            px: 2.5,
                            py: 0.5,
                            fontSize: "0.8rem",
                            boxShadow: "none",
                            "&:hover": {
                              bgcolor:
                                rfidCardType === type ? "#1e3a8a" : "#e2e8f0",
                              boxShadow: "none",
                            },
                          }}
                        >
                          {type}
                        </Button>
                      ))}
                    </Box>

                    <Box
                      sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}
                    >
                      <Typography
                        sx={{ color: "#cbd5e1", fontSize: "1.2rem", mt: -0.5 }}
                      >
                        ⤻
                      </Typography>
                      <Typography
                        sx={{
                          color: "#94a3b8",
                          fontSize: "0.75rem",
                          lineHeight: 1.5,
                        }}
                      >
                        The chip is encoded with the member ID; the printer
                        prints & encodes in one pass. Your developer wires the
                        attached card printer via a local print agent (Evolis /
                        Zebra SDK), and blocks printing until the deposit is
                        verified.
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Right Column - Preview & Actions */}
                <Box
                  sx={{
                    bgcolor: "#f8fafc",
                    borderRadius: "16px",
                    p: { xs: 3, lg: 4 },
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "#94a3b8",
                      fontSize: "0.7rem",
                      mb: 1,
                      letterSpacing: "0.5px",
                    }}
                  >
                    PREVIEW · what prints
                  </Typography>

                  {/* Card Visual */}
                  <Box
                    sx={{
                      maxWidth: "500px",
                      mx: "auto",
                      bgcolor: "#0d213f",
                      borderRadius: "16px",
                      color: "#ffffff",
                      p: 3,
                      mb: 2,
                      position: "relative",
                      overflow: "hidden",
                      boxShadow: "0 10px 15px 2px rgba(0, 0, 0, 0.1)",
                      aspectRatio: "1.586/1",
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        zIndex: 1,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <Box>
                          <Typography
                            sx={{
                              fontFamily: '"Cormorant Garamond", serif',
                              fontSize: "1.6rem",
                              letterSpacing: "0px",
                              color: "#ffffff",
                            }}
                          >
                            Club Marbella
                          </Typography>
                          <Typography
                            sx={{
                              color: "#bca462",
                              fontSize: "0.65rem",
                              letterSpacing: "2px",
                              mt: 0,
                              fontWeight: 600,
                            }}
                          >
                            MARBELLA GRAND
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            border: "1px solid rgba(188, 164, 98, 0.4)",
                            color: "#bca462",
                            px: 1.5,
                            py: 0.25,
                            borderRadius: "16px",
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            letterSpacing: "0.5px",
                          }}
                        >
                          {rfidCardType.toUpperCase()}
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Box
                            sx={{
                              border: "1px solid #476082",
                              width: 54,
                              height: 54,
                              borderRadius: "10px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "1.2rem",
                              fontWeight: 700,
                              color: "#ffffff",
                              bgcolor: "#273e5c",
                            }}
                          >
                            {selectedRfidUser.initials}
                          </Box>
                          <Box>
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: "1.3rem",
                                color: "#ffffff",
                              }}
                            >
                              {selectedRfidUser.name}
                            </Typography>
                            <Typography
                              sx={{
                                color: "#a3b8cc",
                                fontSize: "0.85rem",
                                mt: 0.2,
                              }}
                            >
                              {selectedRfidUser.id}
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            width: 36,
                            height: 46,
                            bgcolor: "#c29a50",
                            borderRadius: "6px",
                          }}
                        />
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-end",
                        }}
                      >
                        <Box>
                          <Typography
                            sx={{
                              color: "#a3b8cc",
                              fontSize: "0.75rem",
                              mb: 0.2,
                            }}
                          >
                            Access & Clubhouse Card · No stored value
                          </Typography>
                          <Typography
                            sx={{ color: "#a3b8cc", fontSize: "0.75rem" }}
                          >
                            Valid 08/2026 – 07/2029 · Security ₹2,000 refundable
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            bgcolor: "#ffffff",
                            borderRadius: "6px",
                            p: "2.5px",
                            display: "grid",
                            gridTemplateColumns: "repeat(6, 1fr)",
                            gap: "1px",
                          }}
                        >
                          {[
                            1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1,
                            0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1,
                            1, 0,
                          ].map((val, i) => (
                            <Box
                              key={i}
                              sx={{
                                bgcolor: val ? "#0d213f" : "#ffffff",
                                borderRadius: "1px",
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      bgcolor: "#ffffff",
                      borderRadius: "12px",
                      p: 3,
                      mb: 3,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#94a3b8",
                        fontSize: "0.65rem",
                        mb: 2,
                        letterSpacing: "0.5px",
                      }}
                    >
                      BEFORE PRINTING
                    </Typography>
                    <Stack spacing={1.5}>
                      {[
                        "Profile complete & verified",
                        "Documents / KYC in place",
                        "₹2,000 refundable security — verified",
                      ].map((text, i) => (
                        <Box
                          key={i}
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Box
                            sx={{
                              bgcolor: "#eefcf3",
                              color: "#16a34a",
                              width: 16,
                              height: 16,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <CheckCircleIcon sx={{ fontSize: 12 }} />
                          </Box>
                          <Typography
                            sx={{
                              color: "#475569",
                              fontSize: "0.8rem",
                              fontWeight: 500,
                            }}
                          >
                            {text}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<PrintOutlinedIcon sx={{ fontSize: 18 }} />}
                    sx={{
                      bgcolor: "#1e3a8a",
                      color: "#ffffff",
                      py: 1.5,
                      borderRadius: "8px",
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      boxShadow: "none",
                      "&:hover": { bgcolor: "#172554", boxShadow: "none" },
                    }}
                  >
                    Send to card printer
                  </Button>
                </Box>
              </Box>
            </Box>
          )}

          {activeTab === "intake" && (
            <Box sx={{ position: 'relative' }}>
              <Box sx={{ opacity: 0.6, pointerEvents: 'none', userSelect: 'none' }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Header */}
              <Box sx={{ mb: 1 }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: "#1e293b",
                    fontSize: "1.35rem",
                    mb: 0.5,
                    fontFamily: '"Cormorant Garamond", serif',
                  }}
                >
                  Intake — drop any document, the system files it
                </Typography>
                <Typography sx={{ color: "#64748b", fontSize: "0.85rem" }}>
                  It reads the document, gives it a proper name, works out who &
                  what it belongs to, pulls the details into our format, and
                  feeds the system. New kinds of documents teach it — it grows.
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", lg: "1.8fr 1fr" },
                  gap: 3,
                }}
              >
                {/* Left Column - Dropzone */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box
                    sx={{
                      bgcolor: "#f5effb",
                      borderRadius: "16px",
                      border: "2px dashed #d8b4fe",
                      p: { xs: 3, md: 5 },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: "#ffffff",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 3,
                        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                      }}
                    >
                      <FileUploadOutlinedIcon
                        sx={{ color: "#9333ea", fontSize: 24 }}
                      />
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#1e293b",
                        fontSize: "1.1rem",
                        mb: 1,
                      }}
                    >
                      Upload or scan any document
                    </Typography>
                    <Typography
                      sx={{ color: "#64748b", fontSize: "0.85rem", mb: 3 }}
                    >
                      PDF · Word (.docx) · Excel (.xlsx/.xls) · CSV · photo or
                      scan — anything.
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        justifyContent: "center",
                        mb: 4,
                      }}
                    >
                      {["PDF", "DOCX", "XLSX", "CSV", "JPG/scan"].map((ext) => (
                        <Box
                          key={ext}
                          sx={{
                            bgcolor: "#ffffff",
                            color: "#64748b",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: "4px",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                          }}
                        >
                          {ext}
                        </Box>
                      ))}
                    </Box>

                    <Typography
                      sx={{ color: "#64748b", fontSize: "0.85rem", mb: 3 }}
                    >
                      Try a sample so you can see exactly what it does:
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                        width: "100%",
                        maxWidth: "800px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 1.5,
                          flexWrap: "wrap",
                        }}
                      >
                        <Button
                          variant="contained"
                          sx={{
                            bgcolor: "#ffffff",
                            color: "#1e293b",
                            borderRadius: "12px",
                            py: 1,
                            px: 2,
                            boxShadow: "none",
                            textTransform: "none",
                            "&:hover": {
                              bgcolor: "#f8fafc",
                              boxShadow: "none",
                            },
                          }}
                        >
                          <DescriptionOutlinedIcon
                            sx={{ fontSize: 16, mr: 1, color: "#9333ea" }}
                          />
                          <Typography
                            sx={{ fontWeight: 600, fontSize: "0.85rem" }}
                          >
                            Cheque / PDC
                          </Typography>
                          <Box
                            sx={{
                              ml: 1,
                              bgcolor: "#f3e8ff",
                              color: "#9333ea",
                              px: 1,
                              py: 0.25,
                              borderRadius: "4px",
                              fontSize: "0.6rem",
                              fontWeight: 700,
                            }}
                          >
                            JPG scan
                          </Box>
                        </Button>
                        <Button
                          variant="contained"
                          sx={{
                            bgcolor: "#ffffff",
                            color: "#1e293b",
                            borderRadius: "12px",
                            py: 1,
                            px: 2,
                            boxShadow: "none",
                            textTransform: "none",
                            "&:hover": {
                              bgcolor: "#f8fafc",
                              boxShadow: "none",
                            },
                          }}
                        >
                          <DescriptionOutlinedIcon
                            sx={{ fontSize: 16, mr: 1, color: "#9333ea" }}
                          />
                          <Typography
                            sx={{ fontWeight: 600, fontSize: "0.85rem" }}
                          >
                            Aadhaar card
                          </Typography>
                          <Box
                            sx={{
                              ml: 1,
                              bgcolor: "#f3e8ff",
                              color: "#9333ea",
                              px: 1,
                              py: 0.25,
                              borderRadius: "4px",
                              fontSize: "0.6rem",
                              fontWeight: 700,
                            }}
                          >
                            PDF
                          </Box>
                        </Button>
                        <Button
                          variant="contained"
                          sx={{
                            bgcolor: "#ffffff",
                            color: "#1e293b",
                            borderRadius: "12px",
                            py: 1,
                            px: 2,
                            boxShadow: "none",
                            textTransform: "none",
                            "&:hover": {
                              bgcolor: "#f8fafc",
                              boxShadow: "none",
                            },
                          }}
                        >
                          <DescriptionOutlinedIcon
                            sx={{ fontSize: 16, mr: 1, color: "#9333ea" }}
                          />
                          <Typography
                            sx={{ fontWeight: 600, fontSize: "0.85rem" }}
                          >
                            Agreement (Word)
                          </Typography>
                          <Box
                            sx={{
                              ml: 1,
                              bgcolor: "#f3e8ff",
                              color: "#9333ea",
                              px: 1,
                              py: 0.25,
                              borderRadius: "4px",
                              fontSize: "0.6rem",
                              fontWeight: 700,
                            }}
                          >
                            DOCX
                          </Box>
                        </Button>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 1.5,
                          flexWrap: "wrap",
                        }}
                      >
                        <Button
                          variant="contained"
                          sx={{
                            bgcolor: "#ffffff",
                            color: "#1e293b",
                            borderRadius: "12px",
                            py: 1,
                            px: 2,
                            boxShadow: "none",
                            textTransform: "none",
                            "&:hover": {
                              bgcolor: "#f8fafc",
                              boxShadow: "none",
                            },
                          }}
                        >
                          <InsertChartOutlinedIcon
                            sx={{ fontSize: 16, mr: 1, color: "#9333ea" }}
                          />
                          <Typography
                            sx={{ fontWeight: 600, fontSize: "0.85rem" }}
                          >
                            Bank statement (CSV)
                          </Typography>
                          <Box
                            sx={{
                              ml: 1,
                              bgcolor: "#f3e8ff",
                              color: "#9333ea",
                              px: 1,
                              py: 0.25,
                              borderRadius: "4px",
                              fontSize: "0.6rem",
                              fontWeight: 700,
                            }}
                          >
                            CSV
                          </Box>
                        </Button>
                        <Button
                          variant="contained"
                          sx={{
                            bgcolor: "#ffffff",
                            color: "#1e293b",
                            borderRadius: "12px",
                            py: 1,
                            px: 2,
                            boxShadow: "none",
                            textTransform: "none",
                            "&:hover": {
                              bgcolor: "#f8fafc",
                              boxShadow: "none",
                            },
                          }}
                        >
                          <PeopleOutlineIcon
                            sx={{ fontSize: 16, mr: 1, color: "#9333ea" }}
                          />
                          <Typography
                            sx={{ fontWeight: 600, fontSize: "0.85rem" }}
                          >
                            Owner list (Excel)
                          </Typography>
                          <Box
                            sx={{
                              ml: 1,
                              bgcolor: "#f3e8ff",
                              color: "#9333ea",
                              px: 1,
                              py: 0.25,
                              borderRadius: "4px",
                              fontSize: "0.6rem",
                              fontWeight: 700,
                            }}
                          >
                            XLSX
                          </Box>
                        </Button>
                        <Button
                          variant="contained"
                          sx={{
                            bgcolor: "#ffffff",
                            color: "#1e293b",
                            borderRadius: "12px",
                            py: 1,
                            px: 2,
                            boxShadow: "none",
                            textTransform: "none",
                            "&:hover": {
                              bgcolor: "#f8fafc",
                              boxShadow: "none",
                            },
                          }}
                        >
                          <DescriptionOutlinedIcon
                            sx={{ fontSize: 16, mr: 1, color: "#9333ea" }}
                          />
                          <Typography
                            sx={{ fontWeight: 600, fontSize: "0.85rem" }}
                          >
                            Loan sanction letter
                          </Typography>
                          <Box
                            sx={{
                              ml: 1,
                              bgcolor: "#f3e8ff",
                              color: "#9333ea",
                              px: 1,
                              py: 0.25,
                              borderRadius: "4px",
                              fontSize: "0.6rem",
                              fontWeight: 700,
                            }}
                          >
                            PDF
                          </Box>
                        </Button>
                      </Box>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      bgcolor: "#f1f5f9",
                      borderRadius: "12px",
                      p: 2,
                      display: "flex",
                      gap: 1.5,
                      alignItems: "flex-start",
                    }}
                  >
                    <InfoOutlinedIcon
                      sx={{ color: "#64748b", fontSize: 18, mt: 0.2 }}
                    />
                    <Typography
                      sx={{
                        color: "#64748b",
                        fontSize: "0.8rem",
                        lineHeight: 1.5,
                      }}
                    >
                      In production your developer wires the real engine —{" "}
                      <strong>OCR + AI</strong> reads any file, extracts to
                      Marbella's format, and files it automatically. These
                      samples show the exact behaviour and the human-check step.
                    </Typography>
                  </Box>
                </Box>

                {/* Right Column - Sidebar */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Box
                    sx={{
                      bgcolor: "#ffffff",
                      borderRadius: "16px",
                      border: "1px solid #f1f5f9",
                      p: 3,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <AutoAwesomeIcon
                        sx={{ color: "#9333ea", fontSize: 16 }}
                      />
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#1e293b",
                          fontSize: "0.85rem",
                        }}
                      >
                        The engine knows 4 document types
                      </Typography>
                    </Box>

                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}
                    >
                      {[
                        "Cheque (PDC)",
                        "Aadhaar (KYC)",
                        "Agreement",
                        "Bank statement",
                      ].map((type) => (
                        <Box
                          key={type}
                          sx={{
                            bgcolor: "#f3e8ff",
                            color: "#9333ea",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: "20px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                          }}
                        >
                          {type}
                        </Box>
                      ))}
                    </Box>

                    <Typography
                      sx={{
                        color: "#94a3b8",
                        fontSize: "0.75rem",
                        lineHeight: 1.5,
                      }}
                    >
                      Each new kind of document it meets becomes a new type it
                      can file by itself.
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      bgcolor: "#f8fafc",
                      borderRadius: "16px",
                      border: "1px solid #f1f5f9",
                      p: 3,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#64748b",
                        fontSize: "0.85rem",
                        mb: 2,
                      }}
                    >
                      Recently filed
                    </Typography>
                    <Typography
                      sx={{
                        color: "#94a3b8",
                        fontSize: "0.8rem",
                        lineHeight: 1.5,
                      }}
                    >
                      Nothing filed yet. Drop a document to see it land in the
                      right place.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
              </Box>
              <Box 
                sx={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10
                }}
              >
                <Box
                  sx={{
                    bgcolor: "#ffffff",
                    borderRadius: "16px",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                    border: "1px solid #e2e8f0",
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center"
                  }}
                >
                  <Typography sx={{ fontWeight: 700, color: "#1e293b", fontSize: "1.5rem", mb: 1, fontFamily: '"Cormorant Garamond", serif' }}>
                    Coming soon
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: "0.95rem" }}>
                    The AI document intake engine is currently being wired up.
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>

        {/* Admin Recharge Modal */}
        {/* New Resident QR Modal */}
        <ResidentQRModal
          open={qrRechargeModalOpen}
          onClose={() => setQrRechargeModalOpen(false)}
          user={selectedResident}
          onSuccess={() => {
            setQrRechargeModalOpen(false);
          }}
        />

        <Dialog
          open={rechargeModalOpen}
          onClose={() => !recharging && setRechargeModalOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: "bold", color: "#091542" }}>
            Admin Wallet Recharge
          </DialogTitle>
          <DialogContent dividers>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Use this to credit the user's wallet manually if they paid offline
              via Cash, UPI, or Bank Transfer.
            </Typography>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Amount (₹)"
                type="number"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
                disabled={recharging}
              />
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 1, display: "block" }}
                >
                  Payment Method
                </Typography>
                <Select
                  fullWidth
                  value={rechargeMethod}
                  onChange={(e) => setRechargeMethod(e.target.value)}
                  disabled={recharging}
                >
                  <MenuItem value="CASH">Cash</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                  <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
                  <MenuItem value="MANUAL">Manual/Other</MenuItem>
                </Select>
                {rechargeMethod === "UPI" && (
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2, borderColor: "#1e40af", color: "#1e40af", "&:hover": { bgcolor: "#f0f4ff" } }}
                    onClick={() => {
                      setRechargeModalOpen(false);
                      setQrRechargeModalOpen(true);
                    }}
                    startIcon={<QrCode2Icon />}
                  >
                    Show QR code
                  </Button>
                )}
              </Box>
              <TextField
                fullWidth
                label="Reference ID (Optional)"
                value={rechargeRefId}
                onChange={(e) => setRechargeRefId(e.target.value)}
                disabled={recharging}
              />
              <TextField
                fullWidth
                label="Remarks (Optional)"
                value={rechargeRemarks}
                onChange={(e) => setRechargeRemarks(e.target.value)}
                disabled={recharging}
                multiline
                rows={2}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => setRechargeModalOpen(false)}
              disabled={recharging}
              sx={{ color: "text.secondary" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRecharge}
              variant="contained"
              disabled={recharging || !rechargeAmount}
              sx={{
                bgcolor: "#0284c7",
                "&:hover": { bgcolor: "#0369a1" },
                borderRadius: "8px",
                px: 3,
              }}
            >
              {recharging ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Confirm Recharge"
              )}
            </Button>
          </DialogActions>
        </Dialog>
        {/* Population Modal */}
        <PopulationModal 
          open={populationModalOpen} 
          onClose={() => setPopulationModalOpen(false)} 
          onResidentClick={(user) => {
            setSelectedResidentProfile(user);
            setResidentProfileModalOpen(true);
          }}
        />

        {/* Resident Profile Modal */}
        <ResidentProfileModal
          open={residentProfileModalOpen}
          onClose={() => setResidentProfileModalOpen(false)}
          user={selectedResidentProfile}
        />

        {/* Scan Modal */}
        <ScanModal
          open={scanModalOpen}
          onClose={() => setScanModalOpen(false)}
        />
        
        {/* Create Profile Modal */}
        <CreateProfileModal 
          open={createProfileModalOpen} 
          onClose={() => {
            setCreateProfileModalOpen(false);
            setSelectedCreateProfile(null);
          }} 
          selectedProfile={selectedCreateProfile}
        />

        {/* Floating Action Button */}
        <Button
          variant="contained"
          startIcon={<PersonAddAltOutlinedIcon />}
          onClick={() => setCreateProfileModalOpen(true)}
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            bgcolor: "#bca462",
            color: "#fff",
            borderRadius: "30px",
            px: 3,
            py: 1.5,
            boxShadow: "0 4px 14px 0 rgba(0,0,0,0.2)",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "1rem",
            zIndex: 1000,
            "&:hover": {
              bgcolor: "#a89052",
            }
          }}
        >
          Create profile
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        fontFamily: '"Inter", sans-serif',
      }}
    >
      {/* Top User Profile Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: { xs: 2, md: 3 },
          borderBottom: "1px solid #e2e8f0",
          bgcolor: "#fafafa",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              bgcolor: "#f3e8ff",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <HeadsetMicIcon sx={{ color: "#7e22ce", fontSize: 22 }} />
          </Box>
          <Box>
            <Typography
              sx={{ fontWeight: 600, color: "#1e293b", fontSize: "0.95rem" }}
            >
              {userName}
            </Typography>
            <Typography sx={{ color: "#64748b", fontSize: "0.8rem" }}>
              Sales / CRM desk
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            bgcolor: "#f3e8ff",
            color: "#7e22ce",
            fontWeight: 600,
            fontSize: "0.75rem",
            px: 1.5,
            py: 0.75,
            borderRadius: "20px",
          }}
        >
          CRM portal
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", pb: 8 }}>
        {/* Welcome Text */}
        <Box sx={{ textAlign: "center", mt: 8, mb: 6, px: 2 }}>
          <Typography
            sx={{
              color: "#bca47c",
              fontWeight: 700,
              letterSpacing: "1.5px",
              fontSize: "0.75rem",
              textTransform: "uppercase",
            }}
          >
            WELCOME BACK
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              color: "#1e293b",
              mt: 2,
              mb: 2,
              fontWeight: 500,
              fontSize: "2.5rem",
            }}
          >
            Where are you working today?
          </Typography>
          <Typography
            sx={{
              color: "#64748b",
              maxWidth: 650,
              mx: "auto",
              fontSize: "0.95rem",
              lineHeight: 1.6,
            }}
          >
            Two places, one Marbella. Choose where your focus is — you can
            switch anytime, and it's the same records underneath.
          </Typography>
        </Box>

        {/* Two Option Cards */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            px: { xs: 3, md: 8, lg: 12 },
            mb: 8,
            maxWidth: 1200,
            mx: "auto",
          }}
        >
          {/* Left Card: Residence Concierge */}
          <Box
            onClick={() => setView("concierge")}
            sx={{
              flex: 1,
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              p: { xs: 3, md: 4 },
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                borderColor: "#3b82f6",
                boxShadow: "0 8px 24px rgba(59, 130, 246, 0.08)",
              },
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                bgcolor: "#eff6ff",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <HeadsetMicIcon sx={{ color: "#3b82f6" }} />
            </Box>
            <Typography
              sx={{
                color: "#1e40af",
                fontWeight: 700,
                letterSpacing: "1px",
                fontSize: "0.7rem",
                textTransform: "uppercase",
                mb: 1,
              }}
            >
              CLUB MARBELLA • MARBELLA GRAND
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"Cormorant Garamond", serif',
                color: "#1e293b",
                fontWeight: 600,
                mb: 2,
                fontSize: "1.6rem",
              }}
            >
              Residence Concierge
            </Typography>
            <Box
              sx={{
                display: "inline-block",
                bgcolor: "#fef3c7",
                color: "#92400e",
                px: 1.5,
                py: 0.5,
                borderRadius: "4px",
                fontSize: "0.65rem",
                fontWeight: 700,
                mb: 3,
              }}
            >
              MARBELLA GRAND ONLY • FOR NOW
            </Box>
            <Typography
              sx={{
                color: "#64748b",
                fontSize: "0.9rem",
                lineHeight: 1.6,
                mb: 4,
                minHeight: 70,
              }}
            >
              Everything for our Marbella Grand clubhouse members — create their
              profile, print their RFID card on the spot, and set up plans,
              passes & bookings. This is where we take care of people.
            </Typography>
            <Typography
              sx={{
                color: "#3b82f6",
                fontWeight: 600,
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              Step in <span style={{ fontSize: "1.2rem" }}>&rarr;</span>
            </Typography>
          </Box>

          {/* Right Card: The Group Office */}
          <Box
            onClick={() => setView("groupOffice")}
            sx={{
              flex: 1,
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              p: { xs: 3, md: 4 },
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              flexDirection: "column",
              "&:hover": {
                borderColor: "#9333ea",
                boxShadow: "0 8px 24px rgba(147, 51, 234, 0.08)",
              },
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                bgcolor: "#faf5ff",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <WorkOutlineIcon sx={{ color: "#9333ea" }} />
            </Box>
            <Typography
              sx={{
                color: "#6b21a8",
                fontWeight: 700,
                letterSpacing: "1px",
                fontSize: "0.7rem",
                textTransform: "uppercase",
                mb: 1,
              }}
            >
              MARBELLA GROUP
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"Cormorant Garamond", serif',
                color: "#1e293b",
                fontWeight: 600,
                mb: 3,
                fontSize: "1.6rem",
                mt: 1,
              }}
            >
              The Group Office
            </Typography>
            <Typography
              sx={{
                color: "#64748b",
                fontSize: "0.9rem",
                lineHeight: 1.6,
                mb: 4,
                minHeight: 70,
              }}
            >
              The office work — owner & tenant onboarding, key handover and
              move-in, inventory, payment plans and the sales pipeline.
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Typography
              sx={{
                color: "#9333ea",
                fontWeight: 600,
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              Get to work <span style={{ fontSize: "1.2rem" }}>&rarr;</span>
            </Typography>
          </Box>
        </Box>

        {/* Bottom checkmark note */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <CheckCircleOutlineIcon sx={{ color: "#10b981", fontSize: 16 }} />
          <Typography sx={{ color: "#64748b", fontSize: "0.8rem" }}>
            One central record on both — every name, ID, Aadhaar, PAN &
            apartment stays matched.
          </Typography>
        </Box>
      </Box>

      {/* Admin Recharge Modal */}
      <Dialog
        open={rechargeModalOpen}
        onClose={() => !recharging && setRechargeModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold", color: "#091542" }}>
          Admin Wallet Recharge
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Use this to credit the user's wallet manually if they paid offline
            via Cash, UPI, or Bank Transfer.
          </Typography>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Amount (₹)"
              type="number"
              value={rechargeAmount}
              onChange={(e) => setRechargeAmount(e.target.value)}
              disabled={recharging}
            />
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 1, display: "block" }}
              >
                Payment Method
              </Typography>
              <Select
                fullWidth
                value={rechargeMethod}
                onChange={(e) => setRechargeMethod(e.target.value)}
                disabled={recharging}
              >
                <MenuItem value="CASH">Cash</MenuItem>
                <MenuItem value="UPI">UPI</MenuItem>
                <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
                <MenuItem value="MANUAL">Manual/Other</MenuItem>
              </Select>
            </Box>
            <TextField
              fullWidth
              label="Reference ID (Optional)"
              value={rechargeRefId}
              onChange={(e) => setRechargeRefId(e.target.value)}
              disabled={recharging}
            />
            <TextField
              fullWidth
              label="Remarks (Optional)"
              value={rechargeRemarks}
              onChange={(e) => setRechargeRemarks(e.target.value)}
              disabled={recharging}
              multiline
              rows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setRechargeModalOpen(false)}
            disabled={recharging}
            sx={{ color: "text.secondary" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRecharge}
            variant="contained"
            disabled={recharging || !rechargeAmount}
            sx={{
              bgcolor: "#0284c7",
              "&:hover": { bgcolor: "#0369a1" },
              borderRadius: "8px",
              px: 3,
            }}
          >
            {recharging ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Confirm Recharge"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      
      {/* Scan Modal */}
      <ScanModal open={scanModalOpen} onClose={() => setScanModalOpen(false)} />
    </Box>
  );
};

export default CRMDashboard;
