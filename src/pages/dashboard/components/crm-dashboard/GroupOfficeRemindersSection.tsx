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

const GroupOfficeRemindersSection = ({ dashboard }: { dashboard: any }) => {
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
                    backgroundColor: "#F3E8FF",
                    color: "#7A4FB5",
                    boxShadow: "none",
                    textTransform: "none",
                    borderRadius: "8px",
                    padding: "6px 16px",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    "&:hover": { backgroundColor: "#F3E8FF" },
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
                          sx={{ bgcolor: '#7A4FB5', '&:hover': { bgcolor: '#7A4FB5' }, textTransform: 'none' }}
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
                      sx={{ color: "#7A4FB5", fontSize: 18, mt: 0.25 }}
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
                        sx={{ color: "#7A4FB5", fontWeight: 700 }}
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
                      setSelectedBuyers(eligibleBuyers.map((_: any, i: number) => i));
                    }
                  }}
                  sx={{
                    bgcolor: "#F3E8FF",
                    color: "#7A4FB5",
                    textTransform: "none",
                    borderRadius: "8px",
                    px: 2,
                    py: 0.5,
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    "&:hover": { bgcolor: "#F3E8FF" },
                  }}
                >
                  {selectedBuyers.length === eligibleBuyers.length && eligibleBuyers.length > 0 ? "Deselect all" : "Select all eligible"}
                </Button>
              </Box>

              {/* Buyers List */}
              {loadingEligibleBuyers ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress size={24} sx={{ color: '#7A4FB5' }} />
                </Box>
              ) : eligibleBuyers.length === 0 ? (
                <Typography sx={{ p: 4, textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                  No eligible buyers found.
                </Typography>
              ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {eligibleBuyers.map((buyer: any, i: number) => {
                  const isSelected = selectedBuyers.includes(i);
                  const flatNum = buyer.flat?.flatNumber || buyer.flatNumber || "Unknown Flat";
                  const towerName = buyer.towerName || buyer.flat?.tower?.name || buyer.flat?.towerName || buyer.tower?.name || "Unknown Tower";
                  const meta = `${flatNum} · ${towerName} · Next installment`;
                  
                  return (
                  <Box
                    key={i}
                    sx={{
                      border: isSelected ? "1px solid #7A4FB5" : "1px solid #e2e8f0",
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
                            setSelectedBuyers(selectedBuyers.filter((index: number) => index !== i));
                          } else {
                            setSelectedBuyers([...selectedBuyers, i]);
                          }
                        }}
                        sx={{
                          mt: 0.5,
                          width: 18,
                          height: 18,
                          border: isSelected ? "none" : "1.5px solid #cbd5e1",
                          bgcolor: isSelected ? "#7A4FB5" : "transparent",
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
                  bgcolor: "#7A4FB5",
                  "&:hover": { bgcolor: "#7A4FB5" },
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
                  const milestoneIds = selectedBuyers.map((i: number) => eligibleBuyers[i].id);
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
                bgcolor: "#7A4FB5",
                "&:hover": { bgcolor: "#7A4FB5" },
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
    </>
  );
};

export default GroupOfficeRemindersSection;
