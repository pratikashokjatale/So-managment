import React from 'react';
import { Headphones } from 'lucide-react';
import { Box, Typography, Button } from '@mui/material';

const LINE = "#E6ECF5";
const INK = "#1B2A45";
const MUT = "#6B7794";
const CRM_ACCENT = "#5E3E92"; // CRM accent from MUI
const CRM_TINT = "#F3EBFD";

const LEADS = [
  { n: "R. Bansal", stage: "Site Visit", proj: "Grand", phone: "•••• 4421" },
  { n: "S. Ahuja", stage: "Contacted", proj: "Twin Tower", phone: "•••• 8890" },
  { n: "V. Rao", stage: "Booked", proj: "Royce", phone: "•••• 1123" },
  { n: "N. Sethi", stage: "New", proj: "Grand", phone: "•••• 7754" },
];

const stages = [["NEW", 42], ["CONTACTED", 31], ["SITE VISIT", 18], ["BOOKED", 9], ["CLOSED", 6]];

const toast = (m: string) => { console.log(m); alert(m); };

function SalesPipelineTab() {
  return (
    <Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', lg: 'repeat(5, 1fr)' }, gap: 1, mb: 2 }}>
        {stages.map(([l, v]) => (
          <Box key={l as string} sx={{ borderRadius: '12px', p: 1.5, background: "#fff", border: `1px solid ${LINE}` }}>
            <Typography sx={{ fontSize: '0.625rem', textTransform: 'uppercase', color: MUT }}>{l}</Typography>
            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.5rem', color: INK, lineHeight: 1.2 }}>{v}</Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ borderRadius: '16px', overflow: 'hidden', border: `1px solid ${LINE}`, mb: 2 }}>
        <Box sx={{ px: 2, py: 1.25, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: "#F6F8FC" }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: MUT }}>Recent leads</Typography>
          <Typography sx={{ fontSize: '0.625rem', fontWeight: 400, color: MUT }}>synced from your CRM</Typography>
        </Box>
        
        {LEADS.map((l, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5, background: '#fff', borderBottom: i < LEADS.length - 1 ? `1px solid ${LINE}` : 'none' }}>
            <Box sx={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: CRM_TINT }}>
              <Headphones size={14} color={CRM_ACCENT} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: INK }}>{l.n}</Typography>
              <Typography sx={{ fontSize: '0.6875rem', color: MUT }}>{l.proj} · {l.phone}</Typography>
            </Box>
            <Typography sx={{ fontSize: '0.625rem', fontWeight: 600, px: 1, py: 0.25, borderRadius: '999px', background: CRM_TINT, color: CRM_ACCENT }}>
              {l.stage}
            </Typography>
            <Button 
              onClick={() => toast(`Follow-up logged for ${l.n}`)} 
              sx={{ fontSize: '0.6875rem', fontWeight: 600, px: 1.5, py: 0.75, borderRadius: '8px', color: '#fff', background: CRM_ACCENT, textTransform: 'none', '&:hover': { background: '#4c3275' }, minWidth: 'auto' }}
            >
              Follow up
            </Button>
          </Box>
        ))}
      </Box>

      <Typography sx={{ fontSize: '0.6875rem', color: MUT }}>
        This portal reads/writes to your connected CRM. Admin can jump in here any time via "View as".
      </Typography>
    </Box>
  );
}

export default SalesPipelineTab;
