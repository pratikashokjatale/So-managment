import { Typography, Box } from '@mui/material';
import type { TypographyProps } from '@mui/material';

export type StatusType = 'active' | 'pending' | 'inactive' | 'blocked' | 'expired';

interface StatusBadgeProps extends TypographyProps {
  status: StatusType | string;
  variantType?: 'text' | 'chip';
}

const statusColors: Record<string, { text: string; bg?: string }> = {
  active: { text: '#2e7d32', bg: '#e8f5e9' },
  pending: { text: '#ed6c02', bg: '#fff3e0' },
  inactive: { text: '#d32f2f', bg: '#ffebee' },
  blocked: { text: '#d32f2f', bg: '#ffebee' },
  expired: { text: '#d32f2f', bg: '#ffebee' },
  confirmed: { text: '#2e7d32', bg: '#e8f5e9' },
  paid: { text: '#2e7d32', bg: '#e8f5e9' },
  cancelled: { text: '#d32f2f', bg: '#ffebee' },
  rejected: { text: '#d32f2f', bg: '#ffebee' },
  failed: { text: '#d32f2f', bg: '#ffebee' },
  refunded: { text: '#1976d2', bg: '#e3f2fd' },
};

export default function StatusBadge({ status, variantType = 'text', sx, ...props }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();
  const colors = statusColors[normalizedStatus] || { text: '#757575', bg: '#f5f5f5' };

  if (variantType === 'chip') {
    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 1.5,
          py: 0.5,
          borderRadius: 1,
          backgroundColor: colors.bg,
          color: colors.text,
          fontWeight: 600,
          fontSize: '0.75rem',
          textTransform: 'capitalize',
          ...sx
        }}
      >
        {status}
      </Box>
    );
  }

  return (
    <Typography
      variant="body2"
      sx={{
        color: colors.text,
        fontWeight: 600,
        textTransform: 'capitalize',
        ...sx,
      }}
      {...props}
    >
      {status}
    </Typography>
  );
}
