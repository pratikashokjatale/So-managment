import { Button } from '@mui/material';
import type { ButtonProps } from '@mui/material';
import { ArrowBack as BackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps extends Omit<ButtonProps, 'onClick'> {
  to?: string;
  label?: string;
}

export default function BackButton({ to, label = 'Back', sx, ...props }: BackButtonProps) {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button 
      variant="text" 
      startIcon={<BackIcon />} 
      onClick={handleBack}
      sx={{ 
        color: 'text.secondary', 
        fontWeight: 600, 
        textTransform: 'none', 
        px: 1.5,
        py: 0.75,
        borderRadius: '8px',
        '&:hover': {
          bgcolor: '#f1f5f9',
          color: '#091542'
        },
        transition: 'all 0.2s ease',
        ...sx 
      }}
      {...props}
    >
      {label}
    </Button>
  );
}
