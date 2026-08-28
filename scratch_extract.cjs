const fs = require('fs');

const appFile = '/Users/pratikjatale/Downloads/club-marbella-os 2/club-marbella-os-updated/src/App.jsx';
const outFile = './src/pages/dashboard/components/PaymentPlansTab.tsx';

const content = fs.readFileSync(appFile, 'utf-8');

function extractBlock(startStr, endStr) {
  const start = content.indexOf(startStr);
  if (start === -1) return '';
  const end = content.indexOf(endStr, start);
  if (end === -1) return '';
  return content.slice(start, end + endStr.length);
}

const requiredConstantsStr = `// @ts-nocheck
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
`;

// Exact block extraction
const paymentPlansStr = extractBlock('const PAYMENT_PLANS = [', '];');
const pctTotalStr = `const pctTotal = (ms) => ms.reduce((s, m) => s + (m.kind === "pct" ? Number(m.value || 0) : 0), 0);
const amtTotal = (ms) => ms.reduce((s, m) => s + (m.kind === "amt" ? Number(m.value || 0) : 0), 0);
const planById = (id) => PAYMENT_PLANS.find((p) => p.id === id);`;

const timelineStr = extractBlock('function PlanTimeline', '  );\n}');
const cardStr = extractBlock('function PlanCard', '  );\n}');
const builderStr = extractBlock('function PlanBuilder', '  );\n}');
let tabStr = extractBlock('function PaymentPlansTab', '  );\n}');

tabStr = tabStr.replace(/<CRMFlow \/>/g, '');

const allCode = [
  requiredConstantsStr,
  paymentPlansStr,
  pctTotalStr,
  timelineStr,
  cardStr,
  builderStr,
  tabStr,
  'export default PaymentPlansTab;'
].join('\n\n');

fs.writeFileSync(outFile, allCode);
console.log('Fixed component extracted and written to', outFile);
