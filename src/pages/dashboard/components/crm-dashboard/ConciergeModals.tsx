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

const ConciergeModals = ({ dashboard }: { dashboard: any }) => {
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
                    sx={{ mt: 2, borderColor: "#24528C", color: "#24528C", "&:hover": { bgcolor: "#EAF0F7" } }}
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
                bgcolor: "#24528C",
                "&:hover": { bgcolor: "#24528C" },
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
    </>
  );
};

export default ConciergeModals;
