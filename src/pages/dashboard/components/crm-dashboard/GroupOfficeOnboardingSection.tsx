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

const GroupOfficeOnboardingSection = ({ dashboard }: { dashboard: any }) => {
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
          {activeGroupOfficeTab === "onboarding" && (
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
                  { value: crmSummary?.data?.counts?.collecting ?? "0", label: "COLLECTING", color: "#7A4FB5" },
                  { value: crmSummary?.data?.counts?.paidUp ?? "0", label: "PAID UP", color: "#bca462" },
                  { value: crmSummary?.data?.counts?.released ?? "0", label: "RELEASED", color: "#7A4FB5" },
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
                      <CircularProgress size={24} sx={{ color: '#7A4FB5' }} />
                    </Box>
                  ) : onboardingCases.length === 0 ? (
                    <Typography sx={{ p: 3, textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>No onboarding cases found.</Typography>
                  ) : onboardingCases.map((user: any, i: number) => {
                    const roleLabel = user.accountRole === "TENANT" ? "Tenant" : "Owner";
                    const flatNum = user.flat?.flatNumber || user.flatNumber || "Unknown Flat";
                    const towerName = user.towerName || user.flat?.tower?.name || user.flat?.towerName || user.tower?.name || (user.flat?.towerId ? "Tower " + user.flat.towerId.slice(0, 4).toUpperCase() : "Unknown Tower");
                    const meta = `${roleLabel} · ${flatNum} · ${towerName}`;
                    
                    let status = "Collecting · 70% paid";
                    let statusColor = "#7A4FB5";
                    let isBar = true;
                    let barProgress = "70%";

                    if (user.status === "ACTIVE") {
                      status = "Handover complete — active";
                      statusColor = "#10b981";
                      isBar = false;
                    } else if (user.status === "PENDING") {
                      status = "Released — handover pending";
                      statusColor = "#24528C";
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
                            bgcolor: "#F3E8FF",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <BusinessOutlinedIcon
                            sx={{ color: "#7A4FB5", fontSize: 20 }}
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
                              bgcolor: "#7A4FB5",
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

    </>
  );
};

export default GroupOfficeOnboardingSection;
