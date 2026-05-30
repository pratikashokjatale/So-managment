/**
 * Shared premium form field styles.
 * Use these across all facility form section components for consistency.
 */

export const fieldSx = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  "& .MuiInputLabel-root": {
    position: "relative",
    transform: "none",
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "#0F172A",
    marginBottom: "8px",
    pointerEvents: "auto",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#2563EB",
  },
  "& .MuiInputLabel-root.Mui-error": { color: "#EF4444" },
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    bgcolor: "#ffffff",
    fontSize: "0.9375rem",
    fontFamily: "'Inter', sans-serif",
    minHeight: "56px",
    transition: "all 0.18s ease",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    border: "1.5px solid #E2E8F0",
    padding: 0,
    "& .MuiOutlinedInput-input": {
      padding: "0 16px",
      height: "53px",
      display: "flex",
      alignItems: "center",
      boxSizing: "border-box",
    },
    "& .MuiSelect-select": {
      paddingRight: "40px !important", // Fix overlap with dropdown arrow
      display: "flex",
      alignItems: "center",
    },
    "&.MuiInputBase-multiline": {
      height: "auto",
      minHeight: "120px",
      alignItems: "flex-start",
      "& .MuiOutlinedInput-input": {
        padding: "16px",
        height: "auto",
      }
    },
    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
    "&:hover": {
      boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
      border: "1.5px solid #CBD5E1",
    },
    "&.Mui-focused": {
      border: "1.5px solid #2563EB",
      boxShadow: "0 0 0 3px rgba(37,99,235,0.12)",
    },
    "&.Mui-disabled": {
      bgcolor: "#F8FAFC",
      border: "1.5px solid #E2E8F0",
      boxShadow: "none",
    },
    "&.Mui-error": {
      border: "1.5px solid #EF4444",
      boxShadow: "0 0 0 3px rgba(239,68,68,0.1)",
    },
  },
  "& .MuiFormHelperText-root": {
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.75rem",
    color: "#64748B",
    mt: "6px",
    ml: 0,
  },
  "& input::placeholder, & textarea::placeholder": {
    color: "#94A3B8",
    opacity: 1,
  },
  "& .MuiSelect-icon": {
    color: "#64748B",
    right: 12,
  },
};

export const sectionCardSx = {
  bgcolor: "#ffffff",
  borderRadius: "20px",
  border: "1.5px solid #EEF2F7",
  boxShadow: "0 4px 20px -4px rgba(15, 23, 42, 0.06), 0 1px 4px rgba(0,0,0,0.03)",
  overflow: "hidden",
  mb: 3,
  transition: "box-shadow 0.2s ease",
};

export const sectionHeaderIconSx = (color: string, bgColor: string) => ({
  p: 1, bgcolor: bgColor, borderRadius: "10px", display: "flex", alignItems: "center", color,
  boxShadow: `0 2px 8px ${color}20`,
});
