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

const GroupOfficeInventorySection = ({ dashboard }: { dashboard: any }) => {
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
                      bgcolor: activeInventoryTab === tab ? "#24528C" : "#f1f5f9",
                      color: activeInventoryTab === tab ? "#ffffff" : "#475569",
                      textTransform: "none",
                      borderRadius: "8px",
                      padding: "6px 16px",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      "&:hover": { bgcolor: activeInventoryTab === tab ? "#24528C" : "#e2e8f0" },
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
                  <CircularProgress size={24} sx={{ color: '#24528C' }} />
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
                            bgcolor: inventoryProject === opt ? "#24528C" : "#f8fafc",
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
                            bgcolor: inventoryStatus === opt ? "#24528C" : "#f8fafc",
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
                            bgcolor: inventoryVisibility === opt ? "#24528C" : "#f8fafc",
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
                        setInventoryPage((prev: number) => prev + 1);
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
                      {inventoryFlats.map((flat: any, i: number) => {
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
                                  bgcolor: flat.status === "SOLD" ? "#EAF0F7" : (flat.status === "HELD" ? "#fef3c7" : "#ecfdf5"),
                                  color: flat.status === "SOLD" ? "#24528C" : (flat.status === "HELD" ? "#d97706" : "#10b981"),
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
                      <CircularProgress size={24} sx={{ color: '#24528C' }} />
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

    </>
  );
};

export default GroupOfficeInventorySection;
