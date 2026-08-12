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

const demoIds = ["MEM-100482", "MEM-100613", "MEM-100731", "MEM-100355"];

const CRMDashboard = ({ user }: { user: any }) => {
  const userName = user?.name || 'Simran Kaur';
  const [view, setView] = useState<'home' | 'concierge'>('home');
  const [activeTab, setActiveTab] = useState<'helpdesk' | 'rfid' | 'intake'>('helpdesk');

  // Search and member state
  const [memberId, setMemberId] = useState("");
  const [selectedResident, setSelectedResident] = useState<any>(null);
  const [residentSearchQuery, setResidentSearchQuery] = useState("");
  const [residentOptions, setResidentOptions] = useState<any[]>([]);
  const [loadingResidents, setLoadingResidents] = useState(false);

  // Modal states
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [rechargeModalOpen, setRechargeModalOpen] = useState(false);
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
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                onClick={() => setView('home')}
                startIcon={<HeadsetMicIcon sx={{ fontSize: 18 }} />} 
                sx={{ bgcolor: '#eff6ff', color: '#1e40af', textTransform: 'none', fontWeight: 600, borderRadius: '8px', px: 2, py: 0.75, '&:hover': { bgcolor: '#dbeafe' }, mr: 1 }}
              >
                Residence Concierge · Switch
              </Button>
              <Button 
                startIcon={<PeopleAltOutlinedIcon sx={{ fontSize: 18 }} />} 
                sx={{ 
                  bgcolor: '#f8fafc', 
                  color: '#1e40af', 
                  border: '1px solid #cbd5e1',
                  textTransform: 'none', 
                  fontWeight: 600, 
                  borderRadius: '10px', 
                  px: 2.5, 
                  py: 0.75, 
                  '&:hover': { bgcolor: '#f1f5f9' } 
                }}
              >
                Population
              </Button>
              <Button 
                onClick={() => setScanModalOpen(true)}
                startIcon={<SensorsIcon sx={{ fontSize: 18 }} />} 
                sx={{ 
                  bgcolor: '#5b21b6', 
                  color: '#ffffff', 
                  textTransform: 'none', 
                  fontWeight: 600, 
                  borderRadius: '10px', 
                  px: 2.5, 
                  py: 0.75, 
                  '&:hover': { bgcolor: '#4c1d95' } 
                }}
              >
                Scan / block card
              </Button>
            </Box>
          </Box>

          {/* Tabs */}
          <Box sx={{ display: 'flex', gap: 1.5, mb: 4 }}>
            <Button 
              onClick={() => setActiveTab('helpdesk')}
              sx={{ 
                bgcolor: activeTab === 'helpdesk' ? '#1e3a8a' : '#f1f5f9', 
                color: activeTab === 'helpdesk' ? '#ffffff' : '#64748b', 
                textTransform: 'none', 
                fontWeight: 600, 
                borderRadius: '8px', 
                px: 3, 
                py: 1,
                '&:hover': { bgcolor: activeTab === 'helpdesk' ? '#1e3a8a' : '#e2e8f0' }
              }}
            >
              Help desk
            </Button>
            <Button 
              onClick={() => setActiveTab('rfid')}
              sx={{ 
                bgcolor: activeTab === 'rfid' ? '#1e3a8a' : '#f1f5f9', 
                color: activeTab === 'rfid' ? '#ffffff' : '#64748b', 
                textTransform: 'none', 
                fontWeight: 600, 
                borderRadius: '8px', 
                px: 3, 
                py: 1,
                '&:hover': { bgcolor: activeTab === 'rfid' ? '#1e3a8a' : '#e2e8f0' }
              }}
            >
              RFID cards
            </Button>
            <Button 
              onClick={() => setActiveTab('intake')}
              sx={{ 
                bgcolor: activeTab === 'intake' ? '#1e3a8a' : '#f1f5f9', 
                color: activeTab === 'intake' ? '#ffffff' : '#64748b', 
                textTransform: 'none', 
                fontWeight: 600, 
                borderRadius: '8px', 
                px: 3, 
                py: 1,
                '&:hover': { bgcolor: activeTab === 'intake' ? '#1e3a8a' : '#e2e8f0' }
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
                  <Typography sx={{ fontWeight: 700, color: '#94a3b8', fontSize: '0.7rem', mb: 3, letterSpacing: '0.5px' }}>PREVIEW · what prints</Typography>
                  
                  {/* Card Visual */}
                  <Box sx={{ bgcolor: '#0d213f', borderRadius: '16px', color: '#ffffff', p: 3, mb: 4, position: 'relative', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', aspectRatio: '1.586/1' }}>
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

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%', maxWidth: '500px' }}>
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
