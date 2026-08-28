// @ts-nocheck
import React, { useState } from 'react';
import {
  Wallet, KeyRound, TrendingUp, HardHat, Sparkles, Check, AlertTriangle, 
  X, ScrollText, Calendar, Plus, RefreshCw, Circle, Clock,
  Navigation, ChevronRight, UserCheck, UserPlus, FileText, Crown
} from 'lucide-react';
import { Box, Typography, Button, IconButton, TextField, InputBase, Dialog } from '@mui/material';

const BRAND = "#24528C";      // royal blue
const BRAND_D = "#16345F";
const GOLD = "#C4A265";
const GOLD_D = "#A9863F";
const INK = "#1B2A45";
const MUT = "#6B7794";
const LINE = "#E6ECF5";
const BG = "#EEF3FA";
const TINT = "#EAF1FA";
const GREEN = "#16915A";
const RED = "#C0492F";
const CRM_ACCENT = "#5E3E92";
const CRM_TINT = "#F3EBFD";
const inr = (n) => "₹" + n.toLocaleString("en-IN");

let _toast = () => {};
const toast = (m, kind = "ok") => { console.log(m, kind); };

const CRM_JOURNEY = [
  { t: "Verified buyer", s: "Sales confirms deal", icon: UserCheck },
  { t: "Profile + plan", s: "Central record", icon: UserPlus },
  { t: "Payments", s: "Collected & reconciled", icon: Wallet },
  { t: "Receipt", s: "Accounts-confirmed", icon: FileText },
  { t: "Handover", s: "Keys & access", icon: KeyRound },
  { t: "Resident active", s: "Live in the club", icon: Crown },
];

function CRMFlow() {
  return (
    <Box sx={{ borderRadius: '16px', p: 2, mb: 2, background: `linear-gradient(150deg,${BRAND},${BRAND_D})` }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <Box sx={{ width: 28, height: 28, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: "#ffffff1e", border: `1px solid ${GOLD}` }}>
          <Navigation size={14} color={GOLD} />
        </Box>
        <Typography sx={{ color: '#fff', fontSize: '0.875rem', fontWeight: 600 }}>The onboarding journey</Typography>
        <Typography sx={{ fontSize: '0.6875rem', ml: 'auto', display: { xs: 'none', sm: 'block' }, color: "#cfe0f5" }}>the path every case follows</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'stretch', gap: 0.5, overflowX: 'auto', pb: 0.5 }}>
        {CRM_JOURNEY.map((n, i) => {
          const Ic = n.icon; 
          return (
            <React.Fragment key={n.t}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flexShrink: 0, width: 96 }}>
                <Box sx={{ width: 44, height: 44, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.75, background: "#ffffff14", border: `1px solid ${GOLD}66` }}>
                  <Ic size={19} color={GOLD} />
                </Box>
                <Typography sx={{ color: '#fff', fontSize: '0.718rem', fontWeight: 600, lineHeight: 1.2 }}>{n.t}</Typography>
                <Typography sx={{ fontSize: '0.593rem', lineHeight: 1.2, mt: 0.25, color: "#bcd0ea" }}>{n.s}</Typography>
              </Box>
              {i < CRM_JOURNEY.length - 1 && (
                <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0, pb: 2.75 }}>
                  <ChevronRight size={16} color={GOLD} />
                </Box>
              )}
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
  );
}

const PAYMENT_PLANS = [
  { id: "down", name: "Down Payment Plan", tag: "Pay early, save more",
    desc: "Most of the value up front, a small balance at possession. Carries the best price.",
    benefit: "5% price benefit", accent: BRAND, tint: "#EAF1FA", icon: Wallet,
    milestones: [
      { label: "On booking", when: "At booking", kind: "pct", value: 10 },
      { label: "Down payment", when: "Within 30 days", kind: "pct", value: 80 },
      { label: "On possession", when: "At handover", kind: "pct", value: 10 },
    ] },
  { id: "possession", name: "Possession-Linked Plan", tag: "Minimum down",
    desc: "Smallest possible amount to book — the bulk falls due only at possession.",
    benefit: null, accent: GOLD_D, tint: "#FDF3E7", icon: KeyRound,
    milestones: [
      { label: "On booking", when: "At booking", kind: "pct", value: 5 },
      { label: "On agreement", when: "Within 45 days", kind: "pct", value: 5 },
      { label: "On possession", when: "At handover", kind: "pct", value: 90 },
    ] },
  { id: "flexi", name: "Flexi Plan", tag: "Balanced",
    desc: "A comfortable middle — a fair down payment, then a couple of easy stages.",
    benefit: null, accent: "#7A4FB5", tint: "#f0e9fa", icon: TrendingUp,
    milestones: [
      { label: "On booking", when: "At booking", kind: "pct", value: 10 },
      { label: "First instalment", when: "Within 45 days", kind: "pct", value: 20 },
      { label: "Mid-construction", when: "On structure", kind: "pct", value: 30 },
      { label: "On possession", when: "At handover", kind: "pct", value: 40 },
    ] },
  { id: "clp", name: "Construction-Linked Plan", tag: "Pay as it's built",
    desc: "Payments tied to real build milestones — foundation, each slab, finishing.",
    benefit: null, accent: "#1F7A5A", tint: "#e6f4ee", icon: HardHat,
    milestones: [
      { label: "On booking", when: "At booking", kind: "pct", value: 10 },
      { label: "Excavation", when: "Site start", kind: "pct", value: 10 },
      { label: "Foundation", when: "Foundation cast", kind: "pct", value: 15 },
      { label: "5th slab", when: "5th floor slab", kind: "pct", value: 15 },
      { label: "10th slab", when: "10th floor slab", kind: "pct", value: 15 },
      { label: "Top slab", when: "Top floor slab", kind: "pct", value: 15 },
      { label: "Finishing", when: "Finishing works", kind: "pct", value: 10 },
      { label: "On possession", when: "At handover", kind: "pct", value: 10 },
    ] },
];

const pctTotal = (ms) => ms.reduce((s, m) => s + (m.kind === "pct" ? Number(m.value || 0) : 0), 0);
const amtTotal = (ms) => ms.reduce((s, m) => s + (m.kind === "amt" ? Number(m.value || 0) : 0), 0);
const planById = (id) => PAYMENT_PLANS.find((p) => p.id === id);

function PlanTimeline({ plan, price }) {
  return (
    <Box sx={{ mt: 1 }}>
      {plan.milestones.map((m, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, mb: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: plan.accent, mt: 0.5 }} />
            {i < plan.milestones.length - 1 && (
              <Box sx={{ width: 2, flex: 1, backgroundColor: `${plan.accent}44`, minHeight: 18, mt: 0.5 }} />
            )}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0, pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: INK }}>{m.label}</Typography>
              <Box sx={{ backgroundColor: plan.tint, color: plan.accent, fontSize: '0.65rem', fontWeight: 700, px: 0.75, py: 0.25, borderRadius: '4px', ml: 'auto', flexShrink: 0 }}>
                {m.kind === "pct" ? m.value + "%" : inr(m.value)}
              </Box>
            </Box>
            <Typography sx={{ fontSize: '0.65rem', color: MUT, mt: 0.25 }}>
              {m.when}{price && m.kind === "pct" ? ` · ${inr(Math.round(price * m.value / 100))}` : ""}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

function PlanCard({ plan, price }) {
  const Ic = plan.icon; 
  const total = pctTotal(plan.milestones);
  return (
    <Box sx={{ borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: `1px solid ${LINE}`, backgroundColor: "#fff" }}>
      <Box sx={{ p: 1.75, display: 'flex', alignItems: 'center', gap: 1.25, backgroundColor: plan.tint }}>
        <Box sx={{ width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backgroundColor: "#fff" }}>
          <Ic size={19} color={plan.accent} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.2, color: INK }}>{plan.name}</Typography>
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 500, color: plan.accent, mt: 0.25 }}>{plan.tag}</Typography>
        </Box>
        {plan.benefit && (
          <Box sx={{ ml: 'auto', fontSize: '0.6rem', fontWeight: 700, px: 1, py: 0.5, borderRadius: '999px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 0.5, backgroundColor: "#fff", color: GREEN, border: `1px solid ${GREEN}44` }}>
            <Sparkles size={10} /> {plan.benefit}
          </Box>
        )}
      </Box>
      <Box sx={{ p: 1.75, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography sx={{ fontSize: '0.75rem', mb: 1.25, color: MUT }}>{plan.desc}</Typography>
        <PlanTimeline plan={plan} price={price} />
        <Box sx={{ mt: 'auto', pt: 1, display: 'flex', alignItems: 'center', gap: 0.75, fontSize: '0.65rem', color: total === 100 ? GREEN : GOLD_D, borderTop: `1px solid ${LINE}` }}>
          {total === 100 ? <Check size={12} /> : <AlertTriangle size={12} />}
          <Typography sx={{ fontWeight: 600, fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>{total}% of value scheduled</Typography>
          <Typography sx={{ ml: 'auto', color: MUT, fontSize: '0.65rem' }}>{plan.milestones.length} milestones</Typography>
        </Box>
      </Box>
    </Box>
  );
}

function PlanBuilder({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [ms, setMs] = useState([{ label: "On booking", when: "At booking", kind: "pct", value: "" }]);
  const setRow = (i, k, v) => setMs((x) => x.map((r, j) => (j === i ? { ...r, [k]: v } : r)));
  const addRow = () => setMs((x) => [...x, { label: "", when: "", kind: "pct", value: "" }]);
  const delRow = (i) => setMs((x) => x.filter((_, j) => j !== i));
  const pt = pctTotal(ms), at = amtTotal(ms), hasPct = ms.some((m) => m.kind === "pct");
  
  const save = () => {
    if (!name.trim()) return toast("Name the plan", "err");
    if (ms.some((m) => !m.label.trim() || m.value === "" || Number(m.value) <= 0)) return toast("Fill every milestone", "err");
    if (hasPct && pt !== 100) return toast(`Percent milestones must total 100% (now ${pt}%)`, "err");
    onSave({ 
      id: "c" + Date.now(), 
      name: name.trim(), 
      tag: "Custom plan", 
      desc: "Tailored for this client.", 
      benefit: null, 
      accent: CRM_ACCENT, 
      tint: CRM_TINT, 
      icon: Sparkles, 
      milestones: ms.map((m) => ({ ...m, value: Number(m.value) })) 
    });
    toast("Custom plan saved", "gold"); 
    onClose();
  };
  
  const ipS = {
    flex: 1,
    padding: '9px 11px',
    fontSize: '13px',
    border: `1px solid ${LINE}`,
    borderRadius: '8px',
    outline: 'none',
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '26px' } }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', maxHeight: '94vh' }}>
        {/* Header */}
        <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', gap: 1.25, flexShrink: 0, background: `linear-gradient(160deg,${CRM_ACCENT},#5E3E92)` }}>
          <Box sx={{ width: 36, height: 36, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: "#ffffff22", border: `1px solid ${GOLD}` }}>
            <Sparkles size={18} color="#fff" />
          </Box>
          <Box>
            <Typography sx={{ color: '#fff', fontWeight: 600, lineHeight: 1.2 }}>Custom payment plan</Typography>
            <Typography sx={{ fontSize: '0.7rem', color: "#e7dcf7" }}>Built for one client</Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ ml: 'auto', width: 32, height: 32, background: "#ffffff1f", color: "#fff", '&:hover': { background: '#ffffff33' } }}>
            <X size={16} />
          </IconButton>
        </Box>
        
        {/* Body */}
        <Box sx={{ p: 2.5, overflowY: 'auto', flex: 1 }}>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: MUT, mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ScrollText size={13} /> Plan name
            </Typography>
            <InputBase 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Mr. Sharma — special terms" 
              sx={{ ...ipS, width: '100%', boxSizing: 'border-box' }} 
            />
          </Box>
          
          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, mt: 2, mb: 1, display: 'flex', alignItems: 'center', gap: 0.75, color: MUT }}>
            <Calendar size={13} /> Milestones
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {ms.map((m, i) => (
              <Box key={i} sx={{ borderRadius: '12px', p: 1.25, border: `1px solid ${LINE}`, background: "#FBFCFE" }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <InputBase 
                    value={m.label} 
                    onChange={(e) => setRow(i, "label", e.target.value)} 
                    placeholder="Milestone (e.g. On foundation)" 
                    sx={{ ...ipS }} 
                  />
                  <IconButton 
                    onClick={() => delRow(i)} 
                    disabled={ms.length === 1} 
                    sx={{ width: 32, height: 32, borderRadius: '8px', color: ms.length === 1 ? "#c9d3e2" : RED, border: `1px solid ${LINE}` }}
                  >
                    <X size={14} />
                  </IconButton>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InputBase 
                    value={m.when} 
                    onChange={(e) => setRow(i, "when", e.target.value)} 
                    placeholder="When (e.g. Within 45 days)" 
                    sx={{ ...ipS }} 
                  />
                  <Box sx={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', border: `1px solid ${LINE}`, flexShrink: 0 }}>
                    {["pct", "amt"].map((k) => (
                      <Box 
                        key={k} 
                        onClick={() => setRow(i, "kind", k)} 
                        sx={{ px: 1.25, py: 1, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', ...(m.kind === k ? { background: CRM_ACCENT, color: "#fff" } : { background: "#fff", color: MUT }) }}
                      >
                        {k === "pct" ? "%" : "₹"}
                      </Box>
                    ))}
                  </Box>
                  <InputBase 
                    value={m.value} 
                    onChange={(e) => setRow(i, "value", e.target.value.replace(/[^0-9]/g, ""))} 
                    placeholder={m.kind === "pct" ? "%" : "Amount"} 
                    inputProps={{ inputMode: "numeric" }} 
                    sx={{ ...ipS, width: 92, flex: 'none' }} 
                  />
                </Box>
              </Box>
            ))}
          </Box>
          
          <Button 
            onClick={addRow} 
            fullWidth 
            sx={{ mt: 1.25, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75, py: 1.25, borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, border: `1.5px dashed ${CRM_ACCENT}`, color: CRM_ACCENT, background: CRM_TINT, textTransform: 'none' }}
          >
            <Plus size={15} /> Add milestone
          </Button>
          
          <Box sx={{ mt: 1.5, borderRadius: '12px', p: 1.5, display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.75rem', background: pctTotal(ms) === 100 || !ms.some((x) => x.kind === "pct") ? "#e7f6ee" : "#FDF3E7" }}>
            {pctTotal(ms) === 100 || !ms.some((x) => x.kind === "pct") ? <Check size={14} color={GREEN} /> : <AlertTriangle size={14} color={GOLD_D} />}
            <Typography sx={{ color: INK, fontSize: '0.75rem' }}>Percent total <Box component="b">{pt}%</Box>{at > 0 ? ` · fixed ${inr(at)}` : ""}</Typography>
            {ms.some((x) => x.kind === "pct") && pt !== 100 && (
              <Typography sx={{ ml: 'auto', fontSize: '0.7rem', color: GOLD_D }}>needs 100%</Typography>
            )}
          </Box>
        </Box>
        
        {/* Footer */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0, borderTop: `1px solid ${LINE}` }}>
          <Button onClick={onClose} sx={{ color: MUT, fontSize: '0.85rem', fontWeight: 500, px: 1.5, py: 1.25, borderRadius: '12px', textTransform: 'none' }}>Cancel</Button>
          <Button onClick={save} sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.75, px: 2.5, py: 1.25, borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, color: '#fff', background: CRM_ACCENT, textTransform: 'none', '&:hover': { background: '#4c3275' } }}>
            <Check size={16} /> Save plan
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}

function PaymentPlansTab() {
  const [custom, setCustom] = useState([]);
  const [building, setBuilding] = useState(false);
  const all = [...PAYMENT_PLANS, ...custom];
  
  return (
    <Box>
      <CRMFlow />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 3 }}>
        <Box>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.8rem', color: INK, fontWeight: 600, mb: 0.5 }}>Payment plans</Typography>
          <Typography sx={{ fontSize: '0.85rem', color: MUT }}>Pick a standard plan on every profile, or tailor one per client.</Typography>
        </Box>
        <Button 
          onClick={() => setBuilding(true)} 
          sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1, borderRadius: '12px', fontWeight: 600, fontSize: '0.85rem', color: '#fff', background: CRM_ACCENT, textTransform: 'none', '&:hover': { background: '#4c3275' } }}
        >
          <Plus size={16} /> Custom plan
        </Button>
      </Box>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
        {all.map((p) => <PlanCard key={p.id} plan={p} price={12500000} />)}
      </Box>
      
      <Box sx={{ mt: 3, borderRadius: '12px', p: 2, display: 'flex', alignItems: 'flex-start', gap: 1, fontSize: '0.75rem', background: TINT, color: MUT }}>
        <Sparkles size={14} color={BRAND} style={{ marginTop: '2px', flexShrink: 0 }} />
        <Typography sx={{ fontSize: '0.75rem', lineHeight: 1.5 }}>
          Amounts shown against a sample <Box component="b" sx={{ color: INK }}>₹1.25 Cr</Box> unit — each buyer's plan recalculates on their actual price. Custom plans are saved for this session; your developer persists them to the central database.
        </Typography>
      </Box>
      
      {building && <PlanBuilder onClose={() => setBuilding(false)} onSave={(p) => setCustom((c) => [...c, p])} />}
    </Box>
  );
}

export default PaymentPlansTab;