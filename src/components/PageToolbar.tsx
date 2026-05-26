import React from "react";
import { Box, Button, TextField } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";

export interface PageToolbarProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onAddClick?: () => void;
  addButtonLabel?: string;
  onExportClick?: () => void;
  showExport?: boolean;
  filters?: React.ReactNode;
  hideSearch?: boolean;
}

export default function PageToolbar({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  onAddClick,
  addButtonLabel = "Add",
  onExportClick,
  showExport = false,
  filters,
  hideSearch = false,
}: PageToolbarProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: filters ? 3 : 0,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {!hideSearch ? (
          <TextField
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <SearchIcon
                  sx={{ color: "text.secondary", mr: 1 }}
                  fontSize="small"
                />
              ),
            }}
            sx={{
              width: { xs: "100%", md: 350 },
              "& fieldset": { borderRadius: "8px" },
            }}
          />
        ) : (
          <Box />
        )}

        <Box sx={{ display: "flex", gap: 2 }}>
          {showExport && (
            <Button
              variant="text"
              startIcon={<DownloadIcon />}
              onClick={onExportClick}
              sx={{
                color: "text.primary",
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Export
            </Button>
          )}
          {onAddClick && (
            <Button
              variant="contained"
              color="primary"
              onClick={onAddClick}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                px: 3,
                fontWeight: 600,
                boxShadow: "none",
                bgcolor: "#0047b3",
                "&:hover": { bgcolor: "#003380" },
              }}
            >
              {addButtonLabel}
            </Button>
          )}
        </Box>
      </Box>

      {filters && (
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>{filters}</Box>
      )}
    </Box>
  );
}
