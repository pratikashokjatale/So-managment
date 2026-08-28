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

const demoIds = ["MEM-100482", "MEM-100613", "MEM-100731", "MEM-100355"];

const CRMHomeView = ({ dashboard }: { dashboard: any }) => {
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

export default CRMHomeView;
