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

const ConciergeIntakeSection = ({ dashboard }: { dashboard: any }) => {
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
                      bgcolor: "#F3E8FF",
                      borderRadius: "16px",
                      border: "2px dashed #F3E8FF",
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
                        sx={{ color: "#7A4FB5", fontSize: 24 }}
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
                            sx={{ fontSize: 16, mr: 1, color: "#7A4FB5" }}
                          />
                          <Typography
                            sx={{ fontWeight: 600, fontSize: "0.85rem" }}
                          >
                            Cheque / PDC
                          </Typography>
                          <Box
                            sx={{
                              ml: 1,
                              bgcolor: "#F3E8FF",
                              color: "#7A4FB5",
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
                            sx={{ fontSize: 16, mr: 1, color: "#7A4FB5" }}
                          />
                          <Typography
                            sx={{ fontWeight: 600, fontSize: "0.85rem" }}
                          >
                            Aadhaar card
                          </Typography>
                          <Box
                            sx={{
                              ml: 1,
                              bgcolor: "#F3E8FF",
                              color: "#7A4FB5",
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
                            sx={{ fontSize: 16, mr: 1, color: "#7A4FB5" }}
                          />
                          <Typography
                            sx={{ fontWeight: 600, fontSize: "0.85rem" }}
                          >
                            Agreement (Word)
                          </Typography>
                          <Box
                            sx={{
                              ml: 1,
                              bgcolor: "#F3E8FF",
                              color: "#7A4FB5",
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
                            sx={{ fontSize: 16, mr: 1, color: "#7A4FB5" }}
                          />
                          <Typography
                            sx={{ fontWeight: 600, fontSize: "0.85rem" }}
                          >
                            Bank statement (CSV)
                          </Typography>
                          <Box
                            sx={{
                              ml: 1,
                              bgcolor: "#F3E8FF",
                              color: "#7A4FB5",
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
                            sx={{ fontSize: 16, mr: 1, color: "#7A4FB5" }}
                          />
                          <Typography
                            sx={{ fontWeight: 600, fontSize: "0.85rem" }}
                          >
                            Owner list (Excel)
                          </Typography>
                          <Box
                            sx={{
                              ml: 1,
                              bgcolor: "#F3E8FF",
                              color: "#7A4FB5",
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
                            sx={{ fontSize: 16, mr: 1, color: "#7A4FB5" }}
                          />
                          <Typography
                            sx={{ fontWeight: 600, fontSize: "0.85rem" }}
                          >
                            Loan sanction letter
                          </Typography>
                          <Box
                            sx={{
                              ml: 1,
                              bgcolor: "#F3E8FF",
                              color: "#7A4FB5",
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
                        sx={{ color: "#7A4FB5", fontSize: 16 }}
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
                            bgcolor: "#F3E8FF",
                            color: "#7A4FB5",
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
    </>
  );
};

export default ConciergeIntakeSection;
