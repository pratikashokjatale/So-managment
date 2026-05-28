import { Chip, Tooltip } from '@mui/material';

interface AccessStatusBadgeProps {
  status: string;
  reason?: string | null;
}

export default function AccessStatusBadge({ status, reason }: AccessStatusBadgeProps) {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    ACTIVE:          { label: 'ACTIVE',         bg: '#ecfdf5', color: '#047857' },
    EXPIRES_TODAY:   { label: 'EXPIRES TODAY',  bg: '#fffbeb', color: '#b45309' },
    EXPIRED:         { label: 'EXPIRED',        bg: '#fef2f2', color: '#dc2626' },
    MISSING_EXPIRY:  { label: 'MISSING EXPIRY', bg: '#f1f5f9', color: '#64748b' },
  };

  const s = map[status?.toUpperCase()] ?? { label: status || '—', bg: '#f1f5f9', color: '#64748b' };
  
  let tooltipText = s.label;
  if (reason) {
    tooltipText += ` (${reason.replace(/_/g, ' ' || '')})`;
  }

  return (
    <Tooltip title={tooltipText} arrow>
      <Chip 
        label={s.label} 
        size="small"
        sx={{ 
          borderRadius: '6px', 
          fontWeight: 800, 
          bgcolor: s.bg, 
          color: s.color, 
          fontSize: '0.72rem', 
          px: 0.5 
        }} 
      />
    </Tooltip>
  );
}
