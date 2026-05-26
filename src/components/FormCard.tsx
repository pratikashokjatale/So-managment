import React from 'react';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface FormCardProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  children: React.ReactNode;
}

export default function FormCard({ title, subtitle, onBack, children }: FormCardProps) {
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: '900px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
          {onBack && (
            <IconButton 
              onClick={onBack} 
              sx={{ 
                bgcolor: 'white', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                '&:hover': { bgcolor: '#f1f5f9' }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          <Box>
            <Typography variant="h4" fontWeight="900" color="#091542">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 500 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 3, md: 5 }, 
            borderRadius: '24px',
            bgcolor: 'white',
            border: '1px solid #f1f5f9',
            boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
          }}
        >
          {children}
        </Paper>
      </Box>
    </Box>
  );
}
