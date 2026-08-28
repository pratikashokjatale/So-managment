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
import ScanModal from "../ScanModal";
import CreateProfileModal from "../CreateProfileModal";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import OnboardingCaseModal from "../OnboardingCaseModal";
import PopulationModal from "../PopulationModal";
import ResidentProfileModal from "../ResidentProfileModal";
import AdminQRRechargeModal from "../AdminQRRechargeModal";
import ResidentSearchUI from "../ResidentSearchUI";
import ResidentProfileCard from "../ResidentProfileCard";
import ResidentQRModal from "../ResidentQRModal";
import PaymentPlansTab from "../PaymentPlansTab";
import SalesPipelineTab from "../SalesPipelineTab";
import RequestsTab from "../RequestsTab";
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
import CRMProfileHeader from "./CRMProfileHeader";
import GroupOfficeTabs, {
  type GroupOfficeTab,
} from "./GroupOfficeTabs";
import ConciergeMemberSection from "./ConciergeMemberSection";
import ConciergeIntakeSection from "./ConciergeIntakeSection";
import ConciergeModals from "./ConciergeModals";

const demoIds = ["MEM-100482", "MEM-100613", "MEM-100731", "MEM-100355"];

const CRMConciergeView = ({ dashboard }: { dashboard: any }) => {
  const {
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
  } = dashboard;
  const view = "concierge";
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
        <CRMProfileHeader userName={userName} />

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
          <ConciergeMemberSection dashboard={dashboard} />
          <ConciergeIntakeSection dashboard={dashboard} />
        </Box>

        <ConciergeModals dashboard={dashboard} />
      </Box>
    );
  }
  return null;
};

export default CRMConciergeView;
