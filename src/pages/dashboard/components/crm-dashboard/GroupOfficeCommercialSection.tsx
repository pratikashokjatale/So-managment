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

const demoIds = ["MEM-100482", "MEM-100613", "MEM-100731", "MEM-100355"];

const GroupOfficeCommercialSection = ({ dashboard }: { dashboard: any }) => {
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
  return (
    <>
          {activeGroupOfficeTab === "purchase requests" && (
            <Box sx={{ position: "relative" }}>
              <Box sx={{ opacity: 0.6, pointerEvents: "none", userSelect: "none" }}>
                <RequestsTab isCrm={true} />
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                  backgroundColor: "rgba(255, 255, 255, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                }}
              >
                <Box
                  sx={{
                    bgcolor: "#ffffff",
                    borderRadius: "16px",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                    border: "1px solid #e2e8f0",
                    p: 4,
                    textAlign: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "#1e293b",
                      fontSize: "1.5rem",
                      mb: 1,
                      fontFamily: '"Cormorant Garamond", serif',
                    }}
                  >
                    Coming soon
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: "0.95rem" }}>
                    The Purchase requests feature is currently being wired up.
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

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

    </>
  );
};

export default GroupOfficeCommercialSection;
