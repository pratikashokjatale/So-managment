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

const categoryLabels: Record<string, string> = {
  MAINTENANCE: "Maintenance",
  HOUSEKEEPING: "Housekeeping",
  SECURITY: "Security",
  FACILITY: "Facility",
  BOOKING: "Booking",
  PAYMENT: "Payment",
  STAFF: "Staff",
  APP: "App",
  OTHER: "Other",
};

interface IssueFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  type: string;
  onTypeChange: (val: string) => void;
  category: string;
  onCategoryChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  priority: string;
  onPriorityChange: (val: string) => void;
  dateFrom: string;
  onDateFromChange: (val: string) => void;
  dateTo: string;
  onDateToChange: (val: string) => void;
  onReset: () => void;
}

export default function IssueFilters({
  search,
  onSearchChange,
  type,
  onTypeChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  onReset,
}: IssueFiltersProps) {
  const filterSelectSx = {
    height: 38,
    fontSize: "0.875rem",
    fontWeight: 700,
    color: "#091542",
    bgcolor: "white",
    borderRadius: "10px",
    "& .MuiOutlinedInput-notchedOutline": { border: "1px solid #cbd5e1" },
    "&:hover .MuiOutlinedInput-notchedOutline": { border: "1px solid #94a3b8" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "1px solid #0047b3" },
  };

  const dateInputSx = {
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
      searchPlaceholder="Search issue description, reporter, notes..."
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
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel id="type-label" sx={{ fontWeight: 700, fontSize: "0.85rem" }}>
              Type
            </InputLabel>
            <Select
              labelId="type-label"
              value={type}
              label="Type"
              onChange={(e) => onTypeChange(e.target.value)}
              sx={filterSelectSx}
            >
              <MenuItem value="ALL">All Types</MenuItem>
              <MenuItem value="ISSUE">Issue</MenuItem>
              <MenuItem value="FEEDBACK">Feedback</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="cat-label" sx={{ fontWeight: 700, fontSize: "0.85rem" }}>
              Category
            </InputLabel>
            <Select
              labelId="cat-label"
              value={category}
              label="Category"
              onChange={(e) => onCategoryChange(e.target.value)}
              sx={filterSelectSx}
            >
              <MenuItem value="ALL">All Categories</MenuItem>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
              <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
              <MenuItem value="RESOLVED">Resolved</MenuItem>
              <MenuItem value="CLOSED">Closed</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="priority-label" sx={{ fontWeight: 700, fontSize: "0.85rem" }}>
              Priority
            </InputLabel>
            <Select
              labelId="priority-label"
              value={priority}
              label="Priority"
              onChange={(e) => onPriorityChange(e.target.value)}
              sx={filterSelectSx}
            >
              <MenuItem value="ALL">All Priorities</MenuItem>
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
              <MenuItem value="URGENT">Urgent</MenuItem>
            </Select>
          </FormControl>

          <TextField
            type="date"
            label="From"
            InputLabelProps={{ shrink: true }}
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            size="small"
            sx={dateInputSx}
          />

          <TextField
            type="date"
            label="To"
            InputLabelProps={{ shrink: true }}
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            size="small"
            sx={dateInputSx}
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
