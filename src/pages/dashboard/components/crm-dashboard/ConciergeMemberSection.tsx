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

const ConciergeMemberSection = ({ dashboard }: { dashboard: any }) => {
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
                      {mockRfidUsers.map((u: any, i: number) => (
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

    </>
  );
};

export default ConciergeMemberSection;
