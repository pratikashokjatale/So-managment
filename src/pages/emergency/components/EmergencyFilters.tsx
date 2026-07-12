import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import PageToolbar from "@/components/PageToolbar";

interface EmergencyFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  type: string;
  onTypeChange: (val: string) => void;
  severity: string;
  onSeverityChange: (val: string) => void;
  userId: string;
  onUserIdChange: (val: string) => void;
  flatId: string;
  onFlatIdChange: (val: string) => void;
  dateFrom: string;
  onDateFromChange: (val: string) => void;
  dateTo: string;
  onDateToChange: (val: string) => void;
  onReset: () => void;
  showAdminFilters: boolean;
}

export default function EmergencyFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  type,
  onTypeChange,
  severity,
  onSeverityChange,
  userId,
  onUserIdChange,
  flatId,
  onFlatIdChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  onReset,
  showAdminFilters,
}: EmergencyFiltersProps) {
  const filterSelectSx = {
    height: 38,
    fontSize: "0.875rem",
    fontWeight: 700,
    color: "#091542",
    bgcolor: "white",
    borderRadius: "10px",
    "& .MuiOutlinedInput-notchedOutline": { border: "1px solid #cbd5e1" },
    "&:hover .MuiOutlinedInput-notchedOutline": { border: "1px solid #94a3b8" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "1px solid #2c4d93" },
  };

  const textInputSx = {
    "& .MuiOutlinedInput-root": {
      height: 38,
      fontSize: "0.875rem",
      fontWeight: 600,
      bgcolor: "white",
      borderRadius: "10px",
    },
  };

  return (
    <PageToolbar
      searchPlaceholder="Search emergency details..."
      searchValue={search}
      onSearchChange={onSearchChange}
      hideSearch={false}
      filters={
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            p: 2,
            bgcolor: "#f1f5f9",
            borderRadius: "16px",
            width: "100%",
            alignItems: "center",
          }}
        >
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="status-label" sx={{ fontWeight: 700, fontSize: "0.85rem" }}>
              Status
            </InputLabel>
            <Select
              labelId="status-label"
              value={status}
              label="Status"
              onChange={(e) => onStatusChange(e.target.value)}
              sx={filterSelectSx}
            >
              <MenuItem value="ALL">All Statuses</MenuItem>
              <MenuItem value="OPEN">Open</MenuItem>
              <MenuItem value="ACKNOWLEDGED">Acknowledged</MenuItem>
              <MenuItem value="RESOLVED">Resolved</MenuItem>
              <MenuItem value="FALSE_ALARM">False Alarm</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="type-label" sx={{ fontWeight: 700, fontSize: "0.85rem" }}>
              Alert Type
            </InputLabel>
            <Select
              labelId="type-label"
              value={type}
              label="Alert Type"
              onChange={(e) => onTypeChange(e.target.value)}
              sx={filterSelectSx}
            >
              <MenuItem value="ALL">All Types</MenuItem>
              <MenuItem value="FIRE">Fire Emergency</MenuItem>
              <MenuItem value="MEDICAL">Medical Help</MenuItem>
              <MenuItem value="SECURITY">Security Threat</MenuItem>
              <MenuItem value="PANIC">Panic SOS</MenuItem>
              <MenuItem value="OTHER">Other Emergency</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel id="severity-label" sx={{ fontWeight: 700, fontSize: "0.85rem" }}>
              Severity
            </InputLabel>
            <Select
              labelId="severity-label"
              value={severity}
              label="Severity"
              onChange={(e) => onSeverityChange(e.target.value)}
              sx={filterSelectSx}
            >
              <MenuItem value="ALL">All Severities</MenuItem>
              <MenuItem value="CRITICAL">Critical</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="LOW">Low</MenuItem>
            </Select>
          </FormControl>

          {/* {showAdminFilters && (
            <>
              <TextField
                label="User ID"
                placeholder="Search User ID"
                value={userId}
                onChange={(e) => onUserIdChange(e.target.value)}
                size="small"
                sx={textInputSx}
              />
              <TextField
                label="Flat ID"
                placeholder="Search Flat ID"
                value={flatId}
                onChange={(e) => onFlatIdChange(e.target.value)}
                size="small"
                sx={textInputSx}
              />
            </>
          )} */}

          <TextField
            type="date"
            label="From"
            InputLabelProps={{ shrink: true }}
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            size="small"
            sx={textInputSx}
          />

          <TextField
            type="date"
            label="To"
            InputLabelProps={{ shrink: true }}
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            size="small"
            sx={textInputSx}
          />

          <Button
            variant="outlined"
            onClick={onReset}
            sx={{
              height: 38,
              borderRadius: "10px",
              borderColor: "#cbd5e1",
              color: "#64748b",
              fontWeight: 700,
              textTransform: "none",
              "&:hover": { bgcolor: "#f8fafc", borderColor: "#94a3b8" },
            }}
          >
            Reset
          </Button>
        </Box>
      }
    />
  );
}
