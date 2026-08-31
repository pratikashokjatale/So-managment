// @ts-nocheck
import React, { useState } from 'react';
import {
  Wallet, KeyRound, TrendingUp, HardHat, Sparkles, Check, AlertTriangle, 
  X, ScrollText, Calendar, Plus, RefreshCw, Circle, Clock
} from 'lucide-react';

const BRAND = "#24528C";      // royal blue
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
    <div className="mt-1">
      {plan.milestones.map((m, i) => (
        <div key={i} className="flex items-start gap-2.5">
          <div className="flex flex-col items-center shrink-0">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: plan.accent, marginTop: 4 }} />
            {i < plan.milestones.length - 1 && <div className="w-0.5 flex-1" style={{ background: `${plan.accent}44`, minHeight: 18 }} />}
          </div>
          <div className="flex-1 min-w-0 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-[12.5px] font-semibold" style={{ color: INK }}>{m.label}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md ml-auto shrink-0" style={{ background: plan.tint, color: plan.accent }}>{m.kind === "pct" ? m.value + "%" : inr(m.value)}</span>
            </div>
            <div className="text-[10.5px]" style={{ color: MUT }}>{m.when}{price && m.kind === "pct" ? ` · ${inr(Math.round(price * m.value / 100))}` : ""}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PlanCard({ plan, price }) {
  const Ic = plan.icon; const total = pctTotal(plan.milestones);
  return (
    <div className="rounded-2xl overflow-hidden flex flex-col" style={{ border: `1px solid ${LINE}`, background: "#fff" }}>
      <div className="p-3.5 flex items-center gap-2.5" style={{ background: plan.tint }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#fff" }}><Ic size={19} color={plan.accent} /></div>
        <div className="min-w-0"><div className="text-[14px] font-semibold leading-tight" style={{ color: INK }}>{plan.name}</div><div className="text-[10.5px] font-medium" style={{ color: plan.accent }}>{plan.tag}</div></div>
        {plan.benefit && <span className="ml-auto text-[9.5px] font-bold px-2 py-1 rounded-full shrink-0 flex items-center gap-1" style={{ background: "#fff", color: GREEN, border: `1px solid ${GREEN}44` }}><Sparkles size={10} /> {plan.benefit}</span>}
      </div>
      <div className="p-3.5 flex-1 flex flex-col">
        <div className="text-[11.5px] mb-2.5" style={{ color: MUT }}>{plan.desc}</div>
        <PlanTimeline plan={plan} price={price} />
        <div className="mt-auto pt-2 flex items-center gap-1.5 text-[10.5px]" style={{ color: total === 100 ? GREEN : GOLD_D, borderTop: `1px solid ${LINE}` }}>
          {total === 100 ? <Check size={12} /> : <AlertTriangle size={12} />}<span className="font-semibold">{total}% of value scheduled</span>
          <span className="ml-auto" style={{ color: MUT }}>{plan.milestones.length} milestones</span>
        </div>
      </div>
    </div>
  );
}

function PlanBuilder({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [ms, setMs] = useState([{ ...BLANK_MS, label: "On booking", when: "At booking" }]);
  const setRow = (i, k, v) => setMs((x) => x.map((r, j) => (j === i ? { ...r, [k]: v } : r)));
  const addRow = () => setMs((x) => [...x, { ...BLANK_MS }]);
  const delRow = (i) => setMs((x) => x.filter((_, j) => j !== i));
  const pt = pctTotal(ms), at = amtTotal(ms), hasPct = ms.some((m) => m.kind === "pct");
  const save = () => {
    if (!name.trim()) return toast("Name the plan", "err");
    if (ms.some((m) => !m.label.trim() || m.value === "" || Number(m.value) <= 0)) return toast("Fill every milestone", "err");
    if (hasPct && pt !== 100) return toast(`Percent milestones must total 100% (now ${pt}%)`, "err");
    onSave({ id: "c" + Date.now(), name: name.trim(), tag: "Custom plan", desc: "Tailored for this client.", benefit: null, accent: CRM_ACCENT, tint: CRM_TINT, icon: Sparkles, milestones: ms.map((m) => ({ ...m, value: Number(m.value) })) });
    toast("Custom plan saved", "gold"); onClose();
  };
  return (
    <div className="fixed inset-0 z-[92] flex items-end sm:items-center justify-center sm:p-4" style={{ background: "#0b1a30ee" }}>
      <div className="bg-white w-full sm:max-w-[520px] rounded-t-[26px] sm:rounded-[26px] overflow-hidden flex flex-col fadeUp" style={{ maxHeight: "94vh" }}>
        <div className="px-5 py-4 flex items-center gap-2.5 shrink-0" style={{ background: `linear-gradient(160deg,${CRM_ACCENT},#5E3E92)` }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#ffffff22", border: `1px solid ${GOLD}` }}><Sparkles size={18} color="#fff" /></div>
          <div><div className="text-white font-semibold leading-tight">Custom payment plan</div><div className="text-[11px]" style={{ color: "#e7dcf7" }}>Built for one client</div></div>
          <button onClick={onClose} className="ml-auto w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#ffffff1f", color: "#fff" }}><X size={16} /></button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">
          <Field ic={ScrollText} label="Plan name"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Mr. Sharma — special terms" style={ipS} /></Field>
          <div className="text-[11px] font-semibold mt-4 mb-2 flex items-center gap-1.5" style={{ color: MUT }}><Calendar size={13} /> Milestones</div>
          <div className="space-y-2">
            {ms.map((m, i) => (
              <div key={i} className="rounded-xl p-2.5" style={{ border: `1px solid ${LINE}`, background: "#FBFCFE" }}>
                <div className="flex items-center gap-2 mb-2">
                  <input value={m.label} onChange={(e) => setRow(i, "label", e.target.value)} placeholder="Milestone (e.g. On foundation)" style={{ ...ipS, padding: "9px 11px", fontSize: 13 }} />
                  <button onClick={() => delRow(i)} disabled={ms.length === 1} className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ color: ms.length === 1 ? "#c9d3e2" : RED, border: `1px solid ${LINE}` }}><X size={14} /></button>
                </div>
                <div className="flex items-center gap-2">
                  <input value={m.when} onChange={(e) => setRow(i, "when", e.target.value)} placeholder="When (e.g. Within 45 days)" style={{ ...ipS, padding: "9px 11px", fontSize: 12.5 }} />
                  <div className="flex rounded-lg overflow-hidden shrink-0" style={{ border: `1px solid ${LINE}` }}>
                    {["pct", "amt"].map((k) => <button key={k} onClick={() => setRow(i, "kind", k)} className="px-2.5 py-2 text-[12px] font-semibold" style={m.kind === k ? { background: CRM_ACCENT, color: "#fff" } : { background: "#fff", color: MUT }}>{k === "pct" ? "%" : "₹"}</button>)}
                  </div>
                  <input value={m.value} onChange={(e) => setRow(i, "value", e.target.value.replace(/[^0-9]/g, ""))} placeholder={m.kind === "pct" ? "%" : "Amount"} inputMode="numeric" style={{ ...ipS, padding: "9px 11px", fontSize: 13, width: 92 }} />
                </div>
              </div>
            ))}
          </div>
          <button onClick={addRow} className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-semibold" style={{ border: `1.5px dashed ${CRM_ACCENT}`, color: CRM_ACCENT, background: CRM_TINT }}><Plus size={15} /> Add milestone</button>
          <div className="mt-3 rounded-xl p-3 flex items-center gap-2 text-[12px]" style={{ background: pctTotal(ms) === 100 || !ms.some((x) => x.kind === "pct") ? "#e7f6ee" : "#FDF3E7" }}>
            {pctTotal(ms) === 100 || !ms.some((x) => x.kind === "pct") ? <Check size={14} color={GREEN} /> : <AlertTriangle size={14} color={GOLD_D} />}
            <span style={{ color: INK }}>Percent total <b>{pt}%</b>{at > 0 ? ` · fixed ${inr(at)}` : ""}</span>
            {ms.some((x) => x.kind === "pct") && pt !== 100 && <span className="ml-auto text-[11px]" style={{ color: GOLD_D }}>needs 100%</span>}
          </div>
        </div>
        <div className="p-4 flex items-center gap-2 shrink-0" style={{ borderTop: `1px solid ${LINE}` }}>
          <button onClick={onClose} className="text-sm font-medium px-3 py-2.5 rounded-xl" style={{ color: MUT }}>Cancel</button>
          <button onClick={save} className="ml-auto flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: CRM_ACCENT }}><Check size={16} /> Save plan</button>
        </div>
      </div>
    </div>
  );
}

function PaymentPlansTab() {
  const [custom, setCustom] = useState([]);
  const [building, setBuilding] = useState(false);
  const all = [...PAYMENT_PLANS, ...custom];
  return (
    <div>
      
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <div><div className="serif text-lg" style={{ color: INK }}>Payment plans</div><div className="text-[12px]" style={{ color: MUT }}>Pick a standard plan on every profile, or tailor one per client.</div></div>
        <button onClick={() => setBuilding(true)} className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white" style={{ background: CRM_ACCENT }}><Plus size={16} /> Custom plan</button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {all.map((p) => <PlanCard key={p.id} plan={p} price={12500000} />)}
      </div>
      <div className="mt-3 rounded-xl p-3 flex items-start gap-2 text-[11.5px]" style={{ background: TINT, color: MUT }}>
        <Sparkles size={14} color={BRAND} className="mt-0.5 shrink-0" />
        <span>Amounts shown against a sample <b style={{ color: INK }}>₹1.25 Cr</b> unit — each buyer's plan recalculates on their actual price. Custom plans are saved for this session; your developer persists them to the central database.</span>
      </div>
      {building && <PlanBuilder onClose={() => setBuilding(false)} onSave={(p) => setCustom((c) => [...c, p])} />}
    </div>
  );
}

export default PaymentPlansTab;