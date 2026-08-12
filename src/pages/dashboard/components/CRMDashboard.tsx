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
      });
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

          {/* Member Counter Card */}
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
