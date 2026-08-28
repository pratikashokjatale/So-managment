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
import CRMProfileHeader from "./crm-dashboard/CRMProfileHeader";
import GroupOfficeTabs, {
  type GroupOfficeTab,
} from "./crm-dashboard/GroupOfficeTabs";
import CRMGroupOfficeView from "./CRMGroupOfficeView";
import CRMConciergeView from "./CRMConciergeView";
import CRMHomeView from "./CRMHomeView";

const demoIds = ["MEM-100482", "MEM-100613", "MEM-100731", "MEM-100355"];

type DashboardView = "home" | "concierge" | "groupOffice";

const getResponseList = (payload: any): any[] => {
  if (!payload) return [];

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data?.users)) return payload.data.users;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.data?.flats)) return payload.data.flats;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.users)) return payload.users;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.flats)) return payload.flats;

  return [];
};

const getInventoryList = (payload: any): any[] => {
  if (Array.isArray(payload)) return payload;

  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.data?.flats)) return payload.data.flats;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.flats)) return payload.flats;
  if (Array.isArray(payload?.items)) return payload.items;

  return [];
};

const CRMDashboard = ({ user }: { user: any }) => {
  const userName = user?.name || "Simran Kaur";
  const [view, setView] = useState<DashboardView>("home");
  const [activeTab, setActiveTab] = useState<"helpdesk" | "rfid" | "intake">(
    "helpdesk",
  );
  const [activeGroupOfficeTab, setActiveGroupOfficeTab] =
    useState<GroupOfficeTab>("onboarding");

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
        setOnboardingCases(getResponseList(res));
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
          setEligibleBuyers(getResponseList(res));
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
        const list = getInventoryList(res);

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

  const dashboard = {
    userName, activeTab, setActiveTab, activeGroupOfficeTab,
    setActiveGroupOfficeTab, memberId, setMemberId, selectedResident,
    setSelectedResident, residentSearchQuery, setResidentSearchQuery,
    residentOptions, loadingResidents, scanModalOpen, setScanModalOpen,
    createProfileModalOpen, setCreateProfileModalOpen, selectedCreateProfile,
    setSelectedCreateProfile, rechargeModalOpen, setRechargeModalOpen,
    qrRechargeModalOpen, setQrRechargeModalOpen, populationModalOpen,
    setPopulationModalOpen, recharging, crmSummary, loadingCrmSummary,
    residentSummary, loadingResidentSummary, onboardingCases, loadingCases,
    eligibleBuyers, loadingEligibleBuyers, selectedBuyers, setSelectedBuyers,
    reminderTemplate, isEditingTemplate, setIsEditingTemplate,
    editTemplateForm, setEditTemplateForm, savingTemplate, previewModalOpen,
    setPreviewModalOpen, previewLoading, setPreviewLoading, previewData,
    setPreviewData, previewBuyerId, setPreviewBuyerId, sendingReminders,
    setSendingReminders, selectedOnboardingCase, setSelectedOnboardingCase,
    inventorySearch, setInventorySearch, inventoryProject, setInventoryProject,
    inventoryStatus, setInventoryStatus, inventoryVisibility,
    setInventoryVisibility, inventoryFlats, loadingInventoryFlats,
    inventoryPage, setInventoryPage, inventoryTotalPages, inventoryTotalFlats,
    activeInventoryTab, setActiveInventoryTab, residentProfileModalOpen,
    setResidentProfileModalOpen, selectedResidentProfile,
    setSelectedResidentProfile, rechargeAmount, setRechargeAmount,
    rechargeMethod, setRechargeMethod, rechargeRefId, setRechargeRefId,
    rechargeRemarks, setRechargeRemarks, mockRfidUsers, selectedRfidUser,
    setSelectedRfidUser, rfidCardType, setRfidCardType, renderTemplateWithTokens,
    handleSaveTemplate, handleRecharge, setView,
  };

  if (view === "groupOffice") {
    return <CRMGroupOfficeView dashboard={dashboard} />;
  }

  if (view === "concierge") {
    return <CRMConciergeView dashboard={dashboard} />;
  }

  return <CRMHomeView dashboard={dashboard} />;
};

export default CRMDashboard;
