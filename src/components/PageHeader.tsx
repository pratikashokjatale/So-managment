import React from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  link?: string;
}

export interface TabItem {
  label: React.ReactNode;
  value: number;
}

export interface PageHeaderProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  tabs?: TabItem[];
  currentTab?: number;
  onTabChange?: (event: React.SyntheticEvent, newValue: number) => void;
}

export default function PageHeader({
  title,
  breadcrumbs,
  tabs,
  currentTab = 0,
  onTabChange,
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <Box sx={{ mb: tabs ? 3 : 4 }}>
      {/* Title & Breadcrumbs Row */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: '#091542' }}>
          {title}
        </Typography>
        <Breadcrumbs separator=">" aria-label="breadcrumb">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return isLast ? (
              <Typography key={index} color="text.primary" fontWeight="600">
                {crumb.label}
              </Typography>
            ) : (
              <Link
                key={index}
                underline="hover"
                color="inherit"
                onClick={() => crumb.link ? navigate(crumb.link) : null}
                sx={{ cursor: crumb.link ? 'pointer' : 'default' }}
              >
                {crumb.label}
              </Link>
            );
          })}
        </Breadcrumbs>
      </Box>

      {/* Tabs Row */}
      {tabs && tabs.length > 0 && (
        <Tabs
          value={currentTab}
          onChange={onTabChange}
          sx={{
            borderBottom: '1px solid #f1f5f9',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 800,
              fontSize: '0.95rem',
              minWidth: 120,
            },
            '& .Mui-selected': { color: '#0047b3 !important' },
            '& .MuiTabs-indicator': { backgroundColor: '#0047b3', height: 3 },
          }}
        >
          {tabs.map((tab, idx) => (
            <Tab key={idx} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
      )}
    </Box>
  );
}
