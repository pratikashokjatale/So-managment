import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Autocomplete, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, Stack } from '@mui/material';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SensorsIcon from '@mui/icons-material/Sensors';
import { getUsersApi } from "@/apis/user";
import { adminRechargeUserWalletApi } from "@/apis/wallet";
import ScanModal from "./ScanModal";
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import SimCardIcon from '@mui/icons-material/SimCard';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Avatar from '@mui/material/Avatar';
import CloseIcon from '@mui/icons-material/Close';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';

const demoIds = ["MEM-100482", "MEM-100613", "MEM-100731", "MEM-100355"];

const CRMDashboard = ({ user }: { user: any }) => {
  const userName = user?.name || 'Simran Kaur';
  const [view, setView] = useState<'home' | 'concierge' | 'groupOffice'>('home');
  const [activeTab, setActiveTab] = useState<'helpdesk' | 'rfid' | 'intake'>('helpdesk');
  const [activeGroupOfficeTab, setActiveGroupOfficeTab] = useState('onboarding');

  // Search and member state
  const [memberId, setMemberId] = useState("");
  const [selectedResident, setSelectedResident] = useState<any>(null);
  const [residentSearchQuery, setResidentSearchQuery] = useState("");
  const [residentOptions, setResidentOptions] = useState<any[]>([]);
  const [loadingResidents, setLoadingResidents] = useState(false);

  // Modal states
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [rechargeModalOpen, setRechargeModalOpen] = useState(false);
  const [populationModalOpen, setPopulationModalOpen] = useState(false);
  const [recharging, setRecharging] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [rechargeMethod, setRechargeMethod] = useState("CASH");
  const [rechargeRefId, setRechargeRefId] = useState("");
  const [rechargeRemarks, setRechargeRemarks] = useState("");

  const mockRfidUsers = [
    { name: "Rohit Mehra", id: "MRB-GR-1042 · B-1204", initials: "RM", status: "READY" },
    { name: "Meera Nair", id: "MRB-GR-1087 · A-0410", initials: "MN", status: "READY" },
    { name: "Neha Kapoor", id: "MRB-GR-1109 · A-1502", initials: "NK", status: "PENDING" },
    { name: "Harpreet Malhotra", id: "MRB-GR-1150 · A-2103", initials: "HM", status: "READY" }
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
        const p1 = getUsersApi({ limit: 10, search: residentSearchQuery, role: "RESIDENT" });
        const p2 = residentSearchQuery && !residentSearchQuery.includes(" ") 
          ? getUsersApi({ limit: 5, cardNumber: residentSearchQuery.toUpperCase(), role: "RESIDENT" })
          : Promise.resolve(null);
          
        const [res1, res2] = await Promise.all([p1, p2]);
        
        const list1 = (res1 as any)?.data?.users || (res1 as any)?.data?.items || (res1 as any)?.items || (res1 as any)?.data || [];
        const list2 = res2 ? ((res2 as any)?.data?.users || (res2 as any)?.data?.items || (res2 as any)?.items || (res2 as any)?.data || []) : [];
        
        const combined = Array.isArray(list1) ? [...list1] : [];
        if (Array.isArray(list2)) combined.push(...list2);

        const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
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

  if (view === 'groupOffice') {
    return (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: '"Inter", sans-serif' }}>
        {/* Top User Profile Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: { xs: 2, md: 3 }, borderBottom: '1px solid #e2e8f0', bgcolor: '#fafafa' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 44, height: 44, bgcolor: '#f3e8ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HeadsetMicIcon sx={{ color: '#7e22ce', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>{userName}</Typography>
              <Typography sx={{ color: '#64748b', fontSize: '0.8rem' }}>Sales / CRM desk</Typography>
            </Box>
          </Box>
          <Box sx={{ bgcolor: '#f3e8ff', color: '#7e22ce', fontWeight: 600, fontSize: '0.75rem', px: 1.5, py: 0.75, borderRadius: '20px' }}>
            CRM portal
          </Box>
        </Box>

        {/* Group Office Content Area */}
        <Box sx={{ p: { xs: 3, md: 4 }, flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 4 }}>
            <Box>
              <Typography variant="h4" sx={{ fontFamily: '"Cormorant Garamond", serif', color: '#1e293b', fontWeight: 600, mb: 1, fontSize: '2.2rem' }}>
                The Group Office
              </Typography>
              <Typography sx={{ color: '#64748b', fontSize: '0.95rem', mb: 1.5 }}>
                Marbella Group · onboarding, key handover, inventory & sales
              </Typography>
            </Box>
            <Button
              onClick={() => setView("home")}
              startIcon={<WorkOutlineIcon sx={{ fontSize: 18 }} />}
              sx={{
                backgroundColor: "#f3e8ff",
                color: "#7e22ce",
                boxShadow: "none",
                textTransform: "none",
                borderRadius: "12px",
                padding: "8px 16px",
                fontWeight: 600,
                "&:hover": { backgroundColor: "#e9d5ff", boxShadow: "none" },
              }}
            >
              Group Office · Switch
            </Button>
          </Box>

          {/* Tabs */}
          <Box sx={{ display: "flex", gap: 1, mb: 4 }}>
            {['Onboarding & handover', 'Inventory', 'Payment plans', 'Reminders', 'Sales pipeline'].map((tab, i) => (
              <Button
                key={i}
                onClick={() => setActiveGroupOfficeTab(tab.toLowerCase())}
                sx={{
                  bgcolor: activeGroupOfficeTab === tab.toLowerCase() || (i === 0 && activeGroupOfficeTab === 'onboarding') ? "#2c5282" : "",
                  color: activeGroupOfficeTab === tab.toLowerCase() || (i === 0 && activeGroupOfficeTab === 'onboarding') ? "#f7f7f7ff" : "",
                  textTransform: "none",
                  borderRadius: "10px",
                  padding: "8px 16px",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  "&:hover": {
                    bgcolor: "#2c5282",
                    color: "#ffffffff",
                  },
                }}
              >
                {tab}
              </Button>
            ))}
          </Box>

          {(activeGroupOfficeTab === 'onboarding & handover' || activeGroupOfficeTab === 'onboarding') && (
            <Box>
              {/* Stat Boxes */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3, mb: 4 }}>
            {[
              { value: "1", label: "COLLECTING", color: "#ab68eaff" },
              { value: "2", label: "PAID UP", color: "#bca462" },
              { value: "1", label: "RELEASED", color: "#a667e2ff" },
              { value: "1", label: "COMPLETE", color: "#10b981" }
            ].map((stat, i) => (
              <Box key={i} sx={{ border: '1px solid #394b63ff', borderRadius: '12px', py: 2.5, px: 2, textAlign: 'center', bgcolor: '#ffffff' }}>
                <Typography sx={{ fontSize: '1rem', color: stat.color, fontWeight: 800, mb: 0.5 }}>{stat.value}</Typography>
                <Typography sx={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.5px' }}>{stat.label}</Typography>
              </Box>
            ))}
          </Box>

          {/* Cases List */}
          <Box sx={{ bgcolor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid #e2e8f0' }}>
              <Typography sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.85rem' }}>Onboarding cases</Typography>
              <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>owners & tenants · post-sales</Typography>
            </Box>
            
            <Box>
              {[
                { name: "Rohit & Priya Mehra", meta: "Owner · B-1204 · Marbella Grand", status: "Released — handover pending", statusColor: "#4f46e5", isBar: false },
                { name: "Meera Nair", meta: "Owner · A-0410 · Marbella Grand", status: "Handover complete — active", statusColor: "#10b981", isBar: false },
                { name: "Aman Verma", meta: "Tenant · D-0302 · Twin Tower", status: "Paid up — ready to release", statusColor: "#bca462", isBar: true, barProgress: "100%" },
                { name: "S. Ahuja", meta: "Owner · T2-1108 · Twin Tower", status: "Paid up — ready to release", statusColor: "#bca462", isBar: true, barProgress: "100%" },
                { name: "Kabir Singh", meta: "Owner · C-0907 · Royce", status: "Collecting · 70% paid", statusColor: "#7e22ce", isBar: true, barProgress: "70%" },
              ].map((row, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5, px: 2.5, borderBottom: i < 4 ? '1px solid #e2e8f0' : 'none', bgcolor: '#ffffff' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                    <Box sx={{ width: 44, height: 44, bgcolor: '#f5edff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BusinessOutlinedIcon sx={{ color: '#9333ea', fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>{row.name}</Typography>
                      <Typography sx={{ color: '#64748b', fontSize: '0.8rem', mt: 0.25 }}>{row.meta}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Box sx={{ textAlign: 'right', minWidth: 160 }}>
                      <Typography sx={{ color: row.statusColor, fontSize: '0.75rem', fontWeight: 600, mb: row.isBar ? 1 : 0 }}>{row.status}</Typography>
                      {row.isBar && (
                        <Box sx={{ width: '100%', height: 4, bgcolor: '#e2e8f0', borderRadius: '2px', mt: 0.5 }}>
                          <Box sx={{ width: row.barProgress, height: '100%', bgcolor: row.statusColor, borderRadius: '2px' }} />
                        </Box>
                      )}
                    </Box>
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: "#7e22ce",
                        color: "#fff",
                        textTransform: "none",
                        borderRadius: "8px",
                        boxShadow: "none",
                        fontWeight: 600,
                        px: 3,
                        py: 0.5,
                        "&:hover": { bgcolor: "#6b21a8", boxShadow: "none" },
                      }}
                    >
                      Open
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
          
          <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem', lineHeight: 1.5, textAlign: 'center' }}>
            CRM allots the unit, keeps the payment trail, and builds the document file over time — every action time & date stamped. Documents unlock only when payments are complete. (Uploads/payments shown are prototype actions.)
          </Typography>
            </Box>
          )}

          {activeGroupOfficeTab === 'inventory' && (
            <Box>
              {/* Inventory Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3 }}>
                <Box>
                  <Typography variant="h5" sx={{ fontFamily: '"Cormorant Garamond", serif', color: '#1e293b', fontWeight: 600, mb: 0.5, fontSize: '1.8rem' }}>
                    Inventory
                  </Typography>
                  <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                    The live unit book — edit anything, changes are approval-gated.
                  </Typography>
                </Box>
                <Button
                  startIcon={<AutorenewOutlinedIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    backgroundColor: "#f8fafc",
                    color: "#94a3b8",
                    border: '1px solid #e2e8f0',
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
              <Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
                {['Inventory', 'My submissions', 'Change log'].map((tab, i) => (
                  <Button
                    key={i}
                    sx={{
                      bgcolor: i === 0 ? "#1e3a8a" : "#f1f5f9",
                      color: i === 0 ? "#ffffff" : "#475569",
                      textTransform: "none",
                      borderRadius: "8px",
                      padding: "6px 16px",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      "&:hover": { bgcolor: i === 0 ? "#1e3a8a" : "#e2e8f0" },
                    }}
                  >
                    {tab}
                  </Button>
                ))}
              </Box>

              {/* Stat Cards (3 identical projects) */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3, mb: 4 }}>
                {[
                  { title: "Grand", loaded: "8 of 600 loaded", avail: 3, held: 1, sold: 4, public: 5, private: 3 },
                  { title: "Twin Tower", loaded: "4 of 480 loaded", avail: 1, held: 1, sold: 2, public: 3, private: 1 },
                  { title: "Royce", loaded: "3 of 360 loaded", avail: 2, held: 0, sold: 1, public: 2, private: 1 }
                ].map((proj, i) => (
                  <Box key={i} sx={{ border: '1px solid #e2e8f0', borderRadius: '12px', p: 3, bgcolor: '#ffffff' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem' }}>{proj.title}</Typography>
                      <Typography sx={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 500 }}>{proj.loaded}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Box sx={{ flex: 1, bgcolor: '#f4f9f5ff', borderRadius: '8px', p: 1.5, textAlign: 'center' }}>
                        <Typography sx={{ color: '#10b981', fontSize: '1.2rem', fontWeight: 700, fontFamily: '"Cormorant Garamond", serif', lineHeight: 1 }}>{proj.avail}</Typography>
                        <Typography sx={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: 600, mt: 0.5 }}>Available</Typography>
                      </Box>
                      <Box sx={{ flex: 1, bgcolor: '#faf9f3ff', borderRadius: '8px', p: 1.5, textAlign: 'center' }}>
                        <Typography sx={{ color: '#bca462', fontSize: '1.2rem', fontWeight: 700, fontFamily: '"Cormorant Garamond", serif', lineHeight: 1 }}>{proj.held}</Typography>
                        <Typography sx={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: 600, mt: 0.5 }}>Held</Typography>
                      </Box>
                      <Box sx={{ flex: 1, bgcolor: '#f1f5f9', borderRadius: '8px', p: 1.5, textAlign: 'center' }}>
                        <Typography sx={{ color: '#475569', fontSize: '1.2rem', fontWeight: 700, fontFamily: '"Cormorant Garamond", serif', lineHeight: 1 }}>{proj.sold}</Typography>
                        <Typography sx={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: 600, mt: 0.5 }}>Sold</Typography>
                      </Box>
                    </Box>

                    <Typography sx={{ color: '#069968ff', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                      <CheckCircleIcon sx={{ fontSize: 14 }} />
                      {proj.avail} + {proj.held} + {proj.sold} = {proj.avail + proj.held + proj.sold} · reconciles
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.8rem', fontWeight: 500, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <VisibilityOutlinedIcon sx={{ fontSize: 14, color: '#94a3b8' }} /> {proj.public} public
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LockOutlinedIcon sx={{ fontSize: 14, color: '#94a3b8' }} /> {proj.private} private
                      </Box>
                    </Box>

                    <Typography sx={{ color: '#069968ff', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <VerifiedUserOutlinedIcon sx={{ fontSize: 16 }} />
                      Every unit checks out.
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Filters Block */}
              <Box sx={{ mb: 4, border: '1px solid #e2e8f0', borderRadius: '16px', p: 3, bgcolor: '#ffffff' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f8fafc', borderRadius: '12px', p: 1.5, mb: 3 }}>
                  <SearchIcon sx={{ color: '#94a3b8', mr: 1, fontSize: 20 }} />
                  <input 
                    type="text" 
                    placeholder="Search unit, type or buyer..." 
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.95rem', color: '#1e293b' }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.7rem', letterSpacing: '0.5px' }}>PROJECT</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {['All', 'Grand', 'Twin Tower', 'Royce'].map((opt, i) => (
                        <Box key={i} sx={{ px: 2, py: 0.75, borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', bgcolor: i === 0 ? '#1e3a8a' : '#f8fafc', color: i === 0 ? '#ffffff' : '#64748b' }}>
                          {opt}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.7rem', letterSpacing: '0.5px' }}>STATUS</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {['All', 'Available', 'Held', 'Sold'].map((opt, i) => (
                        <Box key={i} sx={{ px: 2, py: 0.75, borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', bgcolor: i === 0 ? '#1e3a8a' : '#f8fafc', color: i === 0 ? '#ffffff' : '#64748b' }}>
                          {opt}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.7rem', letterSpacing: '0.5px' }}>VISIBILITY</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {['All', 'Published', 'Private'].map((opt, i) => (
                        <Box key={i} sx={{ px: 2, py: 0.75, borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', bgcolor: i === 0 ? '#1e3a8a' : '#f8fafc', color: i === 0 ? '#ffffff' : '#64748b' }}>
                          {opt}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* List Header and Item */}
              <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '12px', bgcolor: '#ffffff' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid #e2e8f0', bgcolor: '#f8fafc', borderRadius: '12px 12px 0 0' }}>
                  <Typography sx={{ fontWeight: 600, color: '#475569', fontSize: '0.85rem' }}>15 units</Typography>
                  <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>tap a unit to edit · CRM edits go to Admin</Typography>
                </Box>
                <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', '&:hover': { bgcolor: '#f8fafc' } }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                      <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>B-1204</Typography>
                      <Typography sx={{ color: '#64748b', fontSize: '0.9rem' }}>4 BHK · 2450 sq ft · East</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ color: '#94a3b8', fontSize: '0.8rem' }}>Grand</Typography>
                      <Typography sx={{ color: '#64748b', fontSize: '0.8rem' }}>Tower B · Floor 12 · Rohit & Priya Mehra</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem', mb: 0.5 }}>₹1,25,00,000</Typography>
                      <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#eef2ff', color: '#4f46e5', px: 1.5, py: 0.25, borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>
                        Sold
                      </Box>
                    </Box>
                    <ChevronRightOutlinedIcon sx={{ color: '#cbd5e1' }} />
                  </Box>
                </Box>
              </Box>

            </Box>
          )}

          {activeGroupOfficeTab === 'reminders' && (
            <Box>
              {/* Reminders Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3 }}>
                <Box>
                  <Typography variant="h5" sx={{ fontFamily: '"Cormorant Garamond", serif', color: '#1e293b', fontWeight: 600, mb: 0.5, fontSize: '1.8rem' }}>
                    Payment reminders
                  </Typography>
                  <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                    Buyers with an upcoming milestone — nudge them warmly, in one click.
                  </Typography>
                </Box>
                <Button
                  startIcon={<VisibilityOffOutlinedIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    backgroundColor: "#f3e8ff",
                    color: "#7e22ce",
                    boxShadow: "none",
                    textTransform: "none",
                    borderRadius: "8px",
                    padding: "6px 16px",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    "&:hover": { backgroundColor: "#e9d5ff" },
                  }}
                >
                  Hide template
                </Button>
              </Box>

              {/* Template Block */}
              <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', mb: 4, bgcolor: '#ffffff' }}>
                {/* Purple Header */}
                <Box sx={{ bgcolor: '#7e22ce', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#ffffff' }}>
                    <DescriptionOutlinedIcon sx={{ fontSize: 18 }} />
                    <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>Reminder template</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'rgba(255,255,255,0.15)', px: 1.5, py: 0.5, borderRadius: '6px', color: '#ffffff' }}>
                      <EmailOutlinedIcon sx={{ fontSize: 14 }} />
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>Email</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'rgba(255,255,255,0.15)', px: 1.5, py: 0.5, borderRadius: '6px', color: '#ffffff' }}>
                      <PhoneOutlinedIcon sx={{ fontSize: 14 }} />
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>SMS</Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Template Content */}
                <Box sx={{ p: 3 }}>
                  <Typography sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.7rem', letterSpacing: '0.5px', mb: 1 }}>SUBJECT</Typography>
                  <Typography sx={{ color: '#1e293b', fontSize: '0.9rem', mb: 3, display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                    Gentle reminder — payment due for 
                    <Box component="span" sx={{ bgcolor: '#f3e8ff', color: '#7e22ce', px: 1, py: 0.25, borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>{`{Unit}`}</Box> , 
                    <Box component="span" sx={{ bgcolor: '#f3e8ff', color: '#7e22ce', px: 1, py: 0.25, borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>{`{Project}`}</Box>
                  </Typography>

                  <Typography sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.7rem', letterSpacing: '0.5px', mb: 1 }}>MESSAGE</Typography>
                  <Box sx={{ bgcolor: '#f8fafc', p: 3, borderRadius: '12px', color: '#334155', fontSize: '0.9rem', lineHeight: 1.6, mb: 3 }}>
                    <Typography sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                      Dear <Box component="span" sx={{ bgcolor: '#f3e8ff', color: '#7e22ce', px: 1, py: 0.25, borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>{`{Name}`}</Box> ,
                    </Typography>
                    <Typography sx={{ mb: 2, display: 'inline', lineHeight: 2 }}>
                      Warm greetings from Marbella. This is a gentle reminder that your payment of <Box component="span" sx={{ bgcolor: '#f3e8ff', color: '#7e22ce', px: 1, py: 0.25, borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>{`{Amount}`}</Box> towards <Box component="span" sx={{ bgcolor: '#f3e8ff', color: '#7e22ce', px: 1, py: 0.25, borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>{`{Unit}`}</Box> , <Box component="span" sx={{ bgcolor: '#f3e8ff', color: '#7e22ce', px: 1, py: 0.25, borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>{`{Project}`}</Box> — <Box component="span" sx={{ bgcolor: '#f3e8ff', color: '#7e22ce', px: 1, py: 0.25, borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>{`{Milestone}`}</Box> — is due on <Box component="span" sx={{ bgcolor: '#f3e8ff', color: '#7e22ce', px: 1, py: 0.25, borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>{`{Due date}`}</Box> .
                    </Typography>
                    <Typography sx={{ mb: 2, display: 'block' }}>
                      Kindly arrange the payment on time to keep your booking benefits intact and avoid any late charges. We're delighted to have you in the Marbella family and are here to help with anything you need.
                    </Typography>
                    <Typography sx={{ display: 'block' }}>
                      Warm regards,<br/>Team Marbella
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                    <AutoAwesomeIcon sx={{ color: '#9333ea', fontSize: 18, mt: 0.25 }} />
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem', lineHeight: 1.5 }}>
                      The highlighted <Box component="span" sx={{ color: '#7e22ce', fontWeight: 700 }}>fields</Box> auto-fill for each buyer below — their exact legal name, amount, unit, milestone and due date. Overdue buyers get the same message with an "overdue" line. Preview any row to see the final message.
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Buyers List Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.85rem' }}>5 buyers eligible</Typography>
                <Button
                  sx={{
                    bgcolor: '#f3e8ff',
                    color: '#7e22ce',
                    textTransform: 'none',
                    borderRadius: '8px',
                    px: 2,
                    py: 0.5,
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    '&:hover': { bgcolor: '#e9d5ff' }
                  }}
                >
                  Select all eligible
                </Button>
              </Box>

              {/* Buyers List */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { name: "Neha Kapoor", due: "Due in 2 days", dueColor: "#d97706", dueBg: "#fef3c7", meta: "A-1502 · Marbella Grand · Down payment (80%)", amount: "₹96,00,000" },
                  { name: "Kabir Singh", due: "Due in 1 day", dueColor: "#d97706", dueBg: "#fef3c7", meta: "C-0907 · Royce · 10th slab (15%)", amount: "₹12,00,000" }
                ].map((buyer, i) => (
                  <Box key={i} sx={{ border: '1px solid #e2e8f0', borderRadius: '12px', p: 2.5, bgcolor: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box sx={{ mt: 0.5, width: 18, height: 18, border: '1.5px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }} />
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                          <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>{buyer.name}</Typography>
                          <Box sx={{ bgcolor: buyer.dueBg, color: buyer.dueColor, px: 1, py: 0.25, borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700 }}>
                            {buyer.due}
                          </Box>
                        </Box>
                        <Typography sx={{ color: '#64748b', fontSize: '0.8rem' }}>{buyer.meta}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '1.05rem', mb: 0.5 }}>{buyer.amount}</Typography>
                      <Typography sx={{ color: '#7e22ce', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                        Preview message
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

            </Box>
          )}

        </Box>
      </Box>
    );
  }

  if (view === 'concierge') {
    return (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: '"Inter", sans-serif' }}>
        {/* Top User Profile Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: { xs: 2, md: 3 }, borderBottom: '1px solid #e2e8f0', bgcolor: '#fafafa' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 44, height: 44, bgcolor: '#f3e8ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HeadsetMicIcon sx={{ color: '#7e22ce', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>{userName}</Typography>
              <Typography sx={{ color: '#64748b', fontSize: '0.8rem' }}>Sales / CRM desk</Typography>
            </Box>
          </Box>
          <Box sx={{ bgcolor: '#f3e8ff', color: '#7e22ce', fontWeight: 600, fontSize: '0.75rem', px: 1.5, py: 0.75, borderRadius: '20px' }}>
            CRM portal
          </Box>
        </Box>

        {/* Concierge Content Area */}
        <Box sx={{ p: { xs: 3, md: 4 }, flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 4 }}>
            <Box>
              <Typography variant="h4" sx={{ fontFamily: '"Cormorant Garamond", serif', color: '#1e293b', fontWeight: 600, mb: 1, fontSize: '2.2rem' }}>
                Residence Concierge
              </Typography>
              <Typography sx={{ color: '#64748b', fontSize: '0.95rem', mb: 1.5 }}>
                Club Marbella · Marbella Grand clubhouse — profiles, RFID cards, plans & bookings
              </Typography>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5,  color: '#a0890ae3', px: 1, py: 0.25, borderRadius: '4px' }}>
                <LocationOnOutlinedIcon sx={{ fontSize: 14 }} />
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                  Club Marbella is for Marbella Grand members only — for now.
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
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
          {activeTab === 'helpdesk' && (
            <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '12px', p: 3, bgcolor: '#ffffff' }}>
            <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '1.05rem', mb: 3 }}>
              Member counter — book & recharge on a member's behalf
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Autocomplete
                fullWidth
                options={residentOptions}
                filterOptions={(x) => x}
                getOptionLabel={(option) => `${option.name || "Unknown"} (${option.residentId || "No ID"})${option.cardNumber ? ` [Card: ${option.cardNumber}]` : ""} - ${option.phone || ""}`}
                value={selectedResident}
                onChange={(_, val) => {
                  setSelectedResident(val);
                  setMemberId(val ? val.residentId || val.id : "");
                }}
                onInputChange={(_, val) => setResidentSearchQuery(val)}
                loading={loadingResidents}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Scan card or type Resident ID (e.g. MEM-100482)"
                    variant="outlined"
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        bgcolor: '#ffffff',
                        '& fieldset': { borderColor: '#e2e8f0' },
                        '&:hover fieldset': { borderColor: '#cbd5e1' },
                        '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                      },
                      '& .MuiInputBase-input': {
                        p: '6.5px 4px', 
                        fontSize: '0.95rem'
                      }
                    }}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loadingResidents ? <CircularProgress color="inherit" size={16} /> : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
              />
              <Button 
                onClick={() => setRechargeModalOpen(true)}
                disabled={!memberId}
                variant="contained" 
                sx={{ 
                  bgcolor: '#1e40af', 
                  color: '#ffffff', 
                  textTransform: 'none', 
                  fontWeight: 600, 
                  borderRadius: '8px', 
                  px: 4, 
                  py: 1.5, 
                  whiteSpace: 'nowrap',
                  '&:hover': { bgcolor: '#1e3a8a' } 
                }}
              >
                Load member
              </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', mb: 2 }}>
              <InfoOutlinedIcon sx={{ color: '#d97706', fontSize: 16, mt: 0.3 }} />
              <Typography sx={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5 }}>
                <strong>Resident ID</strong> (MEM-######) is the member's account number — one per person. The <strong>Card ID</strong> (MB-/TW-/RY-####) is printed on their physical RFID card; a member may have multiple cards (e.g. dependents, guest). Either loads the same account.
              </Typography>
            </Box>

            <Typography sx={{ fontSize: "0.85rem", color: "#64748b" }}>
              Demo IDs:{" "}
              {demoIds.map((id) => (
                <Box key={id} component="span" onClick={() => setMemberId(id)} sx={{ color: "#204a7b", textDecoration: "underline", cursor: "pointer", mr: 1, "&:hover": { color: "#162d4a" } }}>{id}</Box>
              ))}
            </Typography>
          </Box>
          )}

          {activeTab === 'rfid' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography sx={{ fontWeight: 600, color: '#1e293b', fontSize: '1.35rem', mb: 0.5 }}>Print RFID card</Typography>
                  <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>Prints only when the profile is settled and the ₹2,000 security is verified. The card carries no money — it's access & identity.</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#eefcf3', color: '#16a34a', px: 1.5, py: 0.5, borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#16a34a' }} />
                  Card printer · Evolis Primacy 2 · Ready
                </Box>
              </Box>

              {/* Grid Layout */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
                
                {/* Left Column - Member List */}
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ bgcolor: '#ffffff', borderRadius: '16px', border: '1px solid #f1f5f9', p: 3, mb: 3 }}>
                    <TextField 
                      fullWidth 
                      placeholder="Find a Marbella Grand member..." 
                      variant="outlined" 
                      InputProps={{ 
                        startAdornment: <SearchIcon sx={{ color: '#94a3b8', mr: 1, fontSize: 20 }} />,
                        sx: { bgcolor: '#f8fafc', borderRadius: '12px', '& fieldset': { border: 'none' }, fontSize: '0.9rem', height: 44 }
                      }} 
                      sx={{ mb: 2 }}
                    />
                    
                    <Stack spacing={0} sx={{ border: '1px solid #f1f5f9', borderRadius: '12px', overflow: 'hidden' }}>
                      {mockRfidUsers.map((u, i) => (
                        <Box key={i} onClick={() => setSelectedRfidUser(u)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '12px 16px', borderBottom: i < mockRfidUsers.length - 1 ? '1px solid #f8fafc' : 'none', bgcolor: selectedRfidUser.name === u.name ? '#f8fafc' : '#ffffff', cursor: 'pointer', '&:hover': { bgcolor: '#f8fafc' } }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: selectedRfidUser.name === u.name ? '#475569' : '#f1f5f9', color: selectedRfidUser.name === u.name ? '#ffffff' : '#64748b', fontWeight: 600, width: 32, height: 32, fontSize: '0.8rem' }}>{u.initials}</Avatar>
                            <Box>
                              <Typography sx={{ fontWeight: 600, color: '#1e293b', fontSize: '0.85rem' }}>{u.name}</Typography>
                              <Typography sx={{ color: '#94a3b8', fontSize: '0.7rem' }}>{u.id}</Typography>
                            </Box>
                          </Box>
                          <Box sx={{ bgcolor: u.status === 'READY' ? '#eefcf3' : '#fff3ec', color: u.status === 'READY' ? '#16a34a' : '#ea580c', px: 1, py: 0.25, borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.5px' }}>
                            {u.status}
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                  <Box sx={{ px: 1 }}>
                    <Typography sx={{ fontWeight: 700, color: '#94a3b8', fontSize: '0.7rem', mb: 1, letterSpacing: '0.5px' }}>CARD TYPE</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                      {["Master", "Dependent", "Guest"].map((type) => (
                        <Button 
                          key={type}
                          onClick={() => setRfidCardType(type)}
                          sx={{ 
                            bgcolor: rfidCardType === type ? '#1e3a8a' : '#f1f5f9', 
                            color: rfidCardType === type ? '#ffffff' : '#64748b', 
                            textTransform: 'none', 
                            fontWeight: 600, 
                            borderRadius: '20px', 
                            px: 2.5, 
                            py: 0.5, 
                            fontSize: '0.8rem',
                            boxShadow: 'none',
                            '&:hover': { bgcolor: rfidCardType === type ? '#1e3a8a' : '#e2e8f0', boxShadow: 'none' }
                          }}
                        >
                          {type}
                        </Button>
                      ))}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                      <Typography sx={{ color: '#cbd5e1', fontSize: '1.2rem', mt: -0.5 }}>⤻</Typography>
                      <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem', lineHeight: 1.5 }}>
                        The chip is encoded with the member ID; the printer prints & encodes in one pass. Your developer wires the attached card printer via a local print agent (Evolis / Zebra SDK), and blocks printing until the deposit is verified.
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Right Column - Preview & Actions */}
                <Box sx={{ bgcolor: '#f8fafc', borderRadius: '16px', p: { xs: 3, lg: 4 } }}>
                  <Typography sx={{ fontWeight: 700, color: '#94a3b8', fontSize: '0.7rem', mb: 1, letterSpacing: '0.5px' }}>PREVIEW · what prints</Typography>
                  
                  {/* Card Visual */}
                  <Box sx={{ maxWidth: '500px', mx: 'auto', bgcolor: '#0d213f', borderRadius: '16px', color: '#ffffff', p: 3, mb: 2, position: 'relative', overflow: 'hidden', boxShadow: '0 10px 15px 2px rgba(0, 0, 0, 0.1)', aspectRatio: '1.586/1' }}>
                    <Box sx={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.6rem', letterSpacing: '0px', color: '#ffffff' }}>Club Marbella</Typography>
                          <Typography sx={{ color: '#bca462', fontSize: '0.65rem', letterSpacing: '2px', mt: 0, fontWeight: 600 }}>MARBELLA GRAND</Typography>
                        </Box>
                        <Box sx={{ border: '1px solid rgba(188, 164, 98, 0.4)', color: '#bca462', px: 1.5, py: 0.25, borderRadius: '16px', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.5px' }}>
                          {rfidCardType.toUpperCase()}
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ border: '1px solid #476082', width: 54, height: 54, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', bgcolor: '#273e5c' }}>
                            {selectedRfidUser.initials}
                          </Box>
                          <Box>
                            <Typography sx={{ fontWeight: 600, fontSize: '1.3rem', color: '#ffffff' }}>{selectedRfidUser.name}</Typography>
                            <Typography sx={{ color: '#a3b8cc', fontSize: '0.85rem', mt: 0.2 }}>{selectedRfidUser.id}</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ width: 36, height: 46, bgcolor: '#c29a50', borderRadius: '6px' }} />
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <Box>
                          <Typography sx={{ color: '#a3b8cc', fontSize: '0.75rem', mb: 0.2 }}>Access & Clubhouse Card · No stored value</Typography>
                          <Typography sx={{ color: '#a3b8cc', fontSize: '0.75rem' }}>Valid 08/2026 – 07/2029 · Security ₹2,000 refundable</Typography>
                        </Box>
                        <Box sx={{ width: 44, height: 44, bgcolor: '#ffffff', borderRadius: '6px', p: '2.5px', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1px' }}>
                           {[
                             1,0,1,0,1,1,
                             1,1,0,1,0,0,
                             0,1,1,0,1,0,
                             1,0,0,1,1,1,
                             0,1,1,0,0,1,
                             1,1,0,1,1,0
                           ].map((val, i) => (
                             <Box key={i} sx={{ bgcolor: val ? '#0d213f' : '#ffffff', borderRadius: '1px' }} />
                           ))}
                        </Box>
                      </Box>
                      
                    </Box>
                  </Box>
                  
                  <Box sx={{ bgcolor: '#ffffff', borderRadius: '12px', p: 3, mb: 3 }}>
                    <Typography sx={{ fontWeight: 700, color: '#94a3b8', fontSize: '0.65rem', mb: 2, letterSpacing: '0.5px' }}>BEFORE PRINTING</Typography>
                    <Stack spacing={1.5}>
                      {['Profile complete & verified', 'Documents / KYC in place', '₹2,000 refundable security — verified'].map((text, i) => (
                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ bgcolor: '#eefcf3', color: '#16a34a', width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CheckCircleIcon sx={{ fontSize: 12 }} />
                          </Box>
                          <Typography sx={{ color: '#475569', fontSize: '0.8rem', fontWeight: 500 }}>{text}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                  
                  <Button 
                    fullWidth 
                    variant="contained" 
                    startIcon={<PrintOutlinedIcon sx={{ fontSize: 18 }} />}
                    sx={{ bgcolor: '#1e3a8a', color: '#ffffff', py: 1.5, borderRadius: '8px', textTransform: 'none', fontWeight: 600, fontSize: '0.9rem', boxShadow: 'none', '&:hover': { bgcolor: '#172554', boxShadow: 'none' } }}
                  >
                    Send to card printer
                  </Button>
                </Box>
              </Box>
            </Box>
          )}

          {activeTab === 'intake' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Header */}
              <Box sx={{ mb: 1 }}>
                <Typography sx={{ fontWeight: 600, color: '#1e293b', fontSize: '1.35rem', mb: 0.5, fontFamily: '"Cormorant Garamond", serif' }}>Intake — drop any document, the system files it</Typography>
                <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>It reads the document, gives it a proper name, works out who & what it belongs to, pulls the details into our format, and feeds the system. New kinds of documents teach it — it grows.</Typography>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.8fr 1fr' }, gap: 3 }}>
                
                {/* Left Column - Dropzone */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ 
                    bgcolor: '#f5effb', 
                    borderRadius: '16px', 
                    border: '2px dashed #d8b4fe', 
                    p: { xs: 3, md: 5 }, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    textAlign: 'center' 
                  }}>
                    <Box sx={{ width: 48, height: 48, bgcolor: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                      <FileUploadOutlinedIcon sx={{ color: '#9333ea', fontSize: 24 }} />
                    </Box>
                    <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '1.1rem', mb: 1 }}>Upload or scan any document</Typography>
                    <Typography sx={{ color: '#64748b', fontSize: '0.85rem', mb: 3 }}>PDF · Word (.docx) · Excel (.xlsx/.xls) · CSV · photo or scan — anything.</Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 4 }}>
                      {['PDF', 'DOCX', 'XLSX', 'CSV', 'JPG/scan'].map((ext) => (
                        <Box key={ext} sx={{ bgcolor: '#ffffff', color: '#64748b', px: 1.5, py: 0.5, borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>
                          {ext}
                        </Box>
                      ))}
                    </Box>

                    <Typography sx={{ color: '#64748b', fontSize: '0.85rem', mb: 3 }}>Try a sample so you can see exactly what it does:</Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%', maxWidth: '800px' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                        <Button variant="contained" sx={{ bgcolor: '#ffffff', color: '#1e293b', borderRadius: '12px', py: 1, px: 2, boxShadow: 'none', textTransform: 'none', '&:hover': { bgcolor: '#f8fafc', boxShadow: 'none' } }}>
                          <DescriptionOutlinedIcon sx={{ fontSize: 16, mr: 1, color: '#9333ea' }} />
                          <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>Cheque / PDC</Typography>
                          <Box sx={{ ml: 1, bgcolor: '#f3e8ff', color: '#9333ea', px: 1, py: 0.25, borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700 }}>JPG scan</Box>
                        </Button>
                        <Button variant="contained" sx={{ bgcolor: '#ffffff', color: '#1e293b', borderRadius: '12px', py: 1, px: 2, boxShadow: 'none', textTransform: 'none', '&:hover': { bgcolor: '#f8fafc', boxShadow: 'none' } }}>
                          <DescriptionOutlinedIcon sx={{ fontSize: 16, mr: 1, color: '#9333ea' }} />
                          <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>Aadhaar card</Typography>
                          <Box sx={{ ml: 1, bgcolor: '#f3e8ff', color: '#9333ea', px: 1, py: 0.25, borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700 }}>PDF</Box>
                        </Button>
                        <Button variant="contained" sx={{ bgcolor: '#ffffff', color: '#1e293b', borderRadius: '12px', py: 1, px: 2, boxShadow: 'none', textTransform: 'none', '&:hover': { bgcolor: '#f8fafc', boxShadow: 'none' } }}>
                          <DescriptionOutlinedIcon sx={{ fontSize: 16, mr: 1, color: '#9333ea' }} />
                          <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>Agreement (Word)</Typography>
                          <Box sx={{ ml: 1, bgcolor: '#f3e8ff', color: '#9333ea', px: 1, py: 0.25, borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700 }}>DOCX</Box>
                        </Button>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                        <Button variant="contained" sx={{ bgcolor: '#ffffff', color: '#1e293b', borderRadius: '12px', py: 1, px: 2, boxShadow: 'none', textTransform: 'none', '&:hover': { bgcolor: '#f8fafc', boxShadow: 'none' } }}>
                          <InsertChartOutlinedIcon sx={{ fontSize: 16, mr: 1, color: '#9333ea' }} />
                          <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>Bank statement (CSV)</Typography>
                          <Box sx={{ ml: 1, bgcolor: '#f3e8ff', color: '#9333ea', px: 1, py: 0.25, borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700 }}>CSV</Box>
                        </Button>
                        <Button variant="contained" sx={{ bgcolor: '#ffffff', color: '#1e293b', borderRadius: '12px', py: 1, px: 2, boxShadow: 'none', textTransform: 'none', '&:hover': { bgcolor: '#f8fafc', boxShadow: 'none' } }}>
                          <PeopleOutlineIcon sx={{ fontSize: 16, mr: 1, color: '#9333ea' }} />
                          <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>Owner list (Excel)</Typography>
                          <Box sx={{ ml: 1, bgcolor: '#f3e8ff', color: '#9333ea', px: 1, py: 0.25, borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700 }}>XLSX</Box>
                        </Button>
                        <Button variant="contained" sx={{ bgcolor: '#ffffff', color: '#1e293b', borderRadius: '12px', py: 1, px: 2, boxShadow: 'none', textTransform: 'none', '&:hover': { bgcolor: '#f8fafc', boxShadow: 'none' } }}>
                          <DescriptionOutlinedIcon sx={{ fontSize: 16, mr: 1, color: '#9333ea' }} />
                          <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>Loan sanction letter</Typography>
                          <Box sx={{ ml: 1, bgcolor: '#f3e8ff', color: '#9333ea', px: 1, py: 0.25, borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700 }}>PDF</Box>
                        </Button>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ bgcolor: '#f1f5f9', borderRadius: '12px', p: 2, display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                    <InfoOutlinedIcon sx={{ color: '#64748b', fontSize: 18, mt: 0.2 }} />
                    <Typography sx={{ color: '#64748b', fontSize: '0.8rem', lineHeight: 1.5 }}>
                      In production your developer wires the real engine — <strong>OCR + AI</strong> reads any file, extracts to Marbella's format, and files it automatically. These samples show the exact behaviour and the human-check step.
                    </Typography>
                  </Box>
                </Box>

                {/* Right Column - Sidebar */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  
                  <Box sx={{ bgcolor: '#ffffff', borderRadius: '16px', border: '1px solid #f1f5f9', p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <AutoAwesomeIcon sx={{ color: '#9333ea', fontSize: 16 }} />
                      <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.85rem' }}>The engine knows 4 document types</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                      {['Cheque (PDC)', 'Aadhaar (KYC)', 'Agreement', 'Bank statement'].map((type) => (
                        <Box key={type} sx={{ bgcolor: '#f3e8ff', color: '#9333ea', px: 1.5, py: 0.5, borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
                          {type}
                        </Box>
                      ))}
                    </Box>
                    
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem', lineHeight: 1.5 }}>
                      Each new kind of document it meets becomes a new type it can file by itself.
                    </Typography>
                  </Box>

                  <Box sx={{ bgcolor: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9', p: 3 }}>
                    <Typography sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.85rem', mb: 2 }}>Recently filed</Typography>
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.5 }}>
                      Nothing filed yet. Drop a document to see it land in the right place.
                    </Typography>
                  </Box>

                </Box>
              </Box>
            </Box>
          )}
        </Box>

        {/* Admin Recharge Modal */}
        <Dialog open={rechargeModalOpen} onClose={() => !recharging && setRechargeModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 'bold', color: '#091542' }}>Admin Wallet Recharge</DialogTitle>
          <DialogContent dividers>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Use this to credit the user's wallet manually if they paid offline via Cash, UPI, or Bank Transfer.
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
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Payment Method</Typography>
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
            <Button onClick={() => setRechargeModalOpen(false)} disabled={recharging} sx={{ color: 'text.secondary' }}>
              Cancel
            </Button>
            <Button 
              onClick={handleRecharge}
              variant="contained" 
              disabled={recharging || !rechargeAmount}
              sx={{ bgcolor: '#0284c7', '&:hover': { bgcolor: '#0369a1' }, borderRadius: '8px', px: 3 }}
            >
              {recharging ? <CircularProgress size={24} color="inherit" /> : 'Confirm Recharge'}
            </Button>
          </DialogActions>
        </Dialog>
        {/* Population Modal */}
        <Dialog
          open={populationModalOpen}
          onClose={() => setPopulationModalOpen(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: { borderRadius: '24px', p: { xs: 2, md: 4 }, bgcolor: '#ffffff' }
          }}
        >
          <Box sx={{ position: 'relative' }}>
            {/* Close Button */}
            <Box sx={{ position: 'absolute', top: -8, right: -8, display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: '#fff6e5', color: '#c28b21', px: 1.5, py: 0.5, borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600 }}>
                <LockOutlinedIcon sx={{ fontSize: 14 }} />
                View only
              </Box>
              <Box 
                onClick={() => setPopulationModalOpen(false)}
                sx={{ bgcolor: '#f1f5f9', width: 32, height: 32, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', '&:hover': { bgcolor: '#e2e8f0' } }}
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </Box>
            </Box>

            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'inline-block', bgcolor: '#eef2ff', color: '#4f46e5', px: 1.5, py: 0.5, borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, mb: 2 }}>
                CRM - Population
              </Box>
              <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', color: '#1e293b', lineHeight: 1.2, mb: 0.5 }}>
                Population
              </Typography>
              <Typography sx={{ color: '#64748b', fontSize: '0.9rem' }}>
                Everyone living across the buildings — buyers, families, tenants, resales.
              </Typography>
            </Box>

            {/* Stat Cards Row 1 */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 2 }}>
              {[
                { icon: <PeopleAltOutlinedIcon sx={{ fontSize: 16 }} />, label: "POPULATION", value: "18", subtext: "living here now", color: "#64748b" },
                { icon: <HomeOutlinedIcon sx={{ fontSize: 16 }} />, label: "HOUSEHOLDS", value: "7", subtext: "6 owned · 1 rented", color: "#64748b" },
                { icon: <PersonOutlineIcon sx={{ fontSize: 16 }} />, label: "BUYERS", value: "6", subtext: "bought from us", color: "#64748b" },
                { icon: <AutorenewOutlinedIcon sx={{ fontSize: 16 }} />, label: "RESALES", value: "2", subtext: "ownership transfers", color: "#64748b" }
              ].map((stat, i) => (
                <Box key={i} sx={{ border: '1px solid #e2e8f0', borderRadius: '12px', p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: stat.color, mb: 2 }}>
                    {stat.icon}
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.5px' }}>{stat.label}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '2rem', color: '#1e293b', lineHeight: 1, fontFamily: '"Cormorant Garamond", serif' }}>{stat.value}</Typography>
                  <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem', mt: 1 }}>{stat.subtext}</Typography>
                </Box>
              ))}
            </Box>

            {/* Stat Cards Row 2 */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 4 }}>
              {[
                { value: "13", subtext: "Adults", color: "#1e3a8a" },
                { value: "4", subtext: "Children", color: "#bca462" },
                { value: "1", subtext: "Seniors", color: "#7e22ce" }
              ].map((stat, i) => (
                <Box key={i} sx={{ border: '1px solid #e2e8f0', borderRadius: '12px', p: 2, textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '1.5rem', color: stat.color, lineHeight: 1, fontFamily: '"Cormorant Garamond", serif' }}>{stat.value}</Typography>
                  <Typography sx={{ color: '#64748b', fontSize: '0.75rem', mt: 0.5, fontWeight: 500 }}>{stat.subtext}</Typography>
                </Box>
              ))}
            </Box>

            {/* Search Bar */}
            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f8fafc', borderRadius: '12px', p: 1.5, mb: 3 }}>
              <SearchIcon sx={{ color: '#94a3b8', mr: 1, fontSize: 20 }} />
              <input 
                type="text" 
                placeholder="Search name or unit..." 
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem', color: '#1e293b' }}
              />
            </Box>

            {/* Filters */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.65rem', letterSpacing: '0.5px', width: 60 }}>WHO</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {['Everyone', 'Owners / residents', 'Tenants', 'Family'].map((opt, i) => (
                    <Box key={i} sx={{ px: 1.5, py: 0.5, borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', bgcolor: i === 0 ? '#1e3a8a' : '#f1f5f9', color: i === 0 ? '#ffffff' : '#64748b' }}>
                      {opt}
                    </Box>
                  ))}
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.65rem', letterSpacing: '0.5px', width: 60 }}>AGE</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {['All ages', 'Children', 'Adults', 'Seniors'].map((opt, i) => (
                    <Box key={i} sx={{ px: 1.5, py: 0.5, borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', bgcolor: i === 0 ? '#1e3a8a' : '#f1f5f9', color: i === 0 ? '#ffffff' : '#64748b' }}>
                      {opt}
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.65rem', letterSpacing: '0.5px', width: 60 }}>PROJECT</Typography>
                <Box sx={{ display: 'flex', gap: 1, flex: 1, alignItems: 'center' }}>
                  {['All', 'Grand', 'Twin Tower', 'Royce'].map((opt, i) => (
                    <Box key={i} sx={{ px: 1.5, py: 0.5, borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', bgcolor: i === 0 ? '#1e3a8a' : '#f1f5f9', color: i === 0 ? '#ffffff' : '#64748b' }}>
                      {opt}
                    </Box>
                  ))}
                  
                  <Typography sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.65rem', letterSpacing: '0.5px', ml: 2, mr: 1 }}>MOVED IN</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, border: '1px solid #e2e8f0', borderRadius: '8px', px: 1.5, py: 0.5, color: '#94a3b8' }}>
                      <Typography sx={{ fontSize: '0.8rem' }}>--------- ----</Typography>
                      <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />
                    </Box>
                    <Typography sx={{ color: '#64748b', fontSize: '0.8rem' }}>to</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, border: '1px solid #e2e8f0', borderRadius: '8px', px: 1.5, py: 0.5, color: '#94a3b8' }}>
                      <Typography sx={{ fontSize: '0.8rem' }}>--------- ----</Typography>
                      <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* List Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f8fafc', p: 2, borderRadius: '12px 12px 0 0', borderBottom: '1px solid #e2e8f0' }}>
              <Typography sx={{ fontWeight: 600, color: '#475569', fontSize: '0.85rem' }}>18 people</Typography>
              <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>tap anyone to open their profile</Typography>
            </Box>

            {/* List Items */}
            <Box sx={{ border: '1px solid #e2e8f0', borderTop: 'none', borderRadius: '0 0 12px 12px' }}>
              {[
                { name: "Rohit Mehra", badge: "BUYER", initials: "RM", meta: "Owner · 44 yrs · Adult", unit: "B-1204", project: "Grand" },
                { name: "Priya Mehra", badge: null, initials: "PM", meta: "Spouse · 41 yrs · Adult", unit: "B-1204", project: "Grand" }
              ].map((person, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: i === 0 ? '1px solid #e2e8f0' : 'none', cursor: 'pointer', '&:hover': { bgcolor: '#f8fafc' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#f1f5f9', color: '#1e3a8a', width: 40, height: 40, fontSize: '0.9rem', fontWeight: 600 }}>{person.initials}</Avatar>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>{person.name}</Typography>
                        {person.badge && (
                          <Box sx={{ bgcolor: '#eef2ff', color: '#4f46e5', px: 1, py: 0.25, borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700 }}>
                            {person.badge}
                          </Box>
                        )}
                      </Box>
                      <Typography sx={{ color: '#64748b', fontSize: '0.8rem', mt: 0.5 }}>{person.meta}</Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontWeight: 600, color: '#1e293b', fontSize: '0.85rem' }}>{person.unit}</Typography>
                      <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>{person.project}</Typography>
                    </Box>
                    <ChevronRightOutlinedIcon sx={{ color: '#cbd5e1' }} />
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Dialog>
        
        {/* Scan Modal */}
        <ScanModal open={scanModalOpen} onClose={() => setScanModalOpen(false)} />

      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: '"Inter", sans-serif' }}>
      
      {/* Top User Profile Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: { xs: 2, md: 3 }, borderBottom: '1px solid #e2e8f0', bgcolor: '#fafafa' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 44, height: 44, bgcolor: '#f3e8ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HeadsetMicIcon sx={{ color: '#7e22ce', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>{userName}</Typography>
            <Typography sx={{ color: '#64748b', fontSize: '0.8rem' }}>Sales / CRM desk</Typography>
          </Box>
        </Box>
        <Box sx={{ bgcolor: '#f3e8ff', color: '#7e22ce', fontWeight: 600, fontSize: '0.75rem', px: 1.5, py: 0.75, borderRadius: '20px' }}>
          CRM portal
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', pb: 8 }}>
        {/* Welcome Text */}
        <Box sx={{ textAlign: 'center', mt: 8, mb: 6, px: 2 }}>
          <Typography sx={{ color: '#bca47c', fontWeight: 700, letterSpacing: '1.5px', fontSize: '0.75rem', textTransform: 'uppercase' }}>
            WELCOME BACK
          </Typography>
          <Typography variant="h3" sx={{ fontFamily: '"Cormorant Garamond", serif', color: '#1e293b', mt: 2, mb: 2, fontWeight: 500, fontSize: '2.5rem' }}>
            Where are you working today?
          </Typography>
          <Typography sx={{ color: '#64748b', maxWidth: 650, mx: 'auto', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Two places, one Marbella. Choose where your focus is — you can switch anytime, and it's the same records underneath.
          </Typography>
        </Box>

        {/* Two Option Cards */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, px: { xs: 3, md: 8, lg: 12 }, mb: 8, maxWidth: 1200, mx: 'auto' }}>
          
          {/* Left Card: Residence Concierge */}
          <Box 
            onClick={() => setView('concierge')}
            sx={{ 
              flex: 1, 
              borderRadius: '16px', 
              border: '1px solid #e2e8f0', 
              p: { xs: 3, md: 4 }, 
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': { borderColor: '#3b82f6', boxShadow: '0 8px 24px rgba(59, 130, 246, 0.08)' } 
            }}
          >
            <Box sx={{ width: 48, height: 48, bgcolor: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
              <HeadsetMicIcon sx={{ color: '#3b82f6' }} />
            </Box>
            <Typography sx={{ color: '#1e40af', fontWeight: 700, letterSpacing: '1px', fontSize: '0.7rem', textTransform: 'uppercase', mb: 1 }}>
              CLUB MARBELLA • MARBELLA GRAND
            </Typography>
            <Typography variant="h5" sx={{ fontFamily: '"Cormorant Garamond", serif', color: '#1e293b', fontWeight: 600, mb: 2, fontSize: '1.6rem' }}>
              Residence Concierge
            </Typography>
            <Box sx={{ display: 'inline-block', bgcolor: '#fef3c7', color: '#92400e', px: 1.5, py: 0.5, borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700, mb: 3 }}>
              MARBELLA GRAND ONLY • FOR NOW
            </Box>
            <Typography sx={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, mb: 4, minHeight: 70 }}>
              Everything for our Marbella Grand clubhouse members — create their profile, print their RFID card on the spot, and set up plans, passes & bookings. This is where we take care of people.
            </Typography>
            <Typography sx={{ color: '#3b82f6', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 1 }}>
              Step in <span style={{ fontSize: '1.2rem' }}>&rarr;</span>
            </Typography>
          </Box>

          {/* Right Card: The Group Office */}
          <Box 
            onClick={() => setView('groupOffice')}
            sx={{ 
              flex: 1, 
              borderRadius: '16px', 
              border: '1px solid #e2e8f0', 
              p: { xs: 3, md: 4 }, 
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              '&:hover': { borderColor: '#9333ea', boxShadow: '0 8px 24px rgba(147, 51, 234, 0.08)' } 
            }}
          >
            <Box sx={{ width: 48, height: 48, bgcolor: '#faf5ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
              <WorkOutlineIcon sx={{ color: '#9333ea' }} />
            </Box>
            <Typography sx={{ color: '#6b21a8', fontWeight: 700, letterSpacing: '1px', fontSize: '0.7rem', textTransform: 'uppercase', mb: 1 }}>
              MARBELLA GROUP
            </Typography>
            <Typography variant="h5" sx={{ fontFamily: '"Cormorant Garamond", serif', color: '#1e293b', fontWeight: 600, mb: 3, fontSize: '1.6rem', mt: 1 }}>
              The Group Office
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, mb: 4, minHeight: 70 }}>
              The office work — owner & tenant onboarding, key handover and move-in, inventory, payment plans and the sales pipeline.
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Typography sx={{ color: '#9333ea', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 1 }}>
              Get to work <span style={{ fontSize: '1.2rem' }}>&rarr;</span>
            </Typography>
          </Box>
        </Box>

        {/* Bottom checkmark note */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <CheckCircleOutlineIcon sx={{ color: '#10b981', fontSize: 16 }} />
          <Typography sx={{ color: '#64748b', fontSize: '0.8rem' }}>
            One central record on both — every name, ID, Aadhaar, PAN & apartment stays matched.
          </Typography>
        </Box>
      </Box>

      {/* Admin Recharge Modal */}
      <Dialog open={rechargeModalOpen} onClose={() => !recharging && setRechargeModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#091542' }}>Admin Wallet Recharge</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Use this to credit the user's wallet manually if they paid offline via Cash, UPI, or Bank Transfer.
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
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Payment Method</Typography>
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
          <Button onClick={() => setRechargeModalOpen(false)} disabled={recharging} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleRecharge}
            variant="contained" 
            disabled={recharging || !rechargeAmount}
            sx={{ bgcolor: '#0284c7', '&:hover': { bgcolor: '#0369a1' }, borderRadius: '8px', px: 3 }}
          >
            {recharging ? <CircularProgress size={24} color="inherit" /> : 'Confirm Recharge'}
          </Button>
        </DialogActions>
      </Dialog>
      

      
      {/* Scan Modal */}
      <ScanModal open={scanModalOpen} onClose={() => setScanModalOpen(false)} />

    </Box>
  );
};



export default CRMDashboard;
