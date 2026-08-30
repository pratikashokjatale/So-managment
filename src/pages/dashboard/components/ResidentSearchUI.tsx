import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface ResidentSearchUIProps {
  residentOptions: any[];
  selectedResident: any;
  setSelectedResident: (val: any) => void;
  setMemberId: (id: string) => void;
  setResidentSearchQuery: (query: string) => void;
  loadingResidents: boolean;
  demoIds: string[];
}

const ResidentSearchUI: React.FC<ResidentSearchUIProps> = ({
  residentOptions,
  selectedResident,
  setSelectedResident,
  setMemberId,
  setResidentSearchQuery,
  loadingResidents,
  demoIds,
}) => {
  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Autocomplete
          fullWidth
          options={residentOptions}
          filterOptions={(x) => x}
          getOptionLabel={(option) =>
            `${option.name || "Unknown"} (${option.residentId || "No ID"})${
              option.cardNumber ? ` [Card: ${option.cardNumber}]` : ""
            } - ${option.phone || ""}`
          }
          value={selectedResident}
          onChange={(_, val) => {
            setSelectedResident(val);
            setMemberId(val ? val.residentId || val.id : "");
          }}
          onInputChange={(_, val) => setResidentSearchQuery(val)}
          loading={loadingResidents}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Scan card or type Resident ID (e.g. MEM-100482)"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  bgcolor: "#ffffff",
                  "& fieldset": { borderColor: "#e2e8f0" },
                  "&:hover fieldset": { borderColor: "#cbd5e1" },
                  "&.Mui-focused fieldset": { borderColor: "#24528C" },
                },
                "& .MuiInputBase-input": {
                  p: "10px 14px",
                  fontSize: "1rem",
                },
              }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loadingResidents ? (
                      <CircularProgress color="inherit" size={16} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
        <Button
          variant="contained"
          disabled={!selectedResident && !loadingResidents} // Keep enabled if we want to "load" based on text, but Autocomplete handles it mostly.
          sx={{
            bgcolor: "#24528C",
            color: "#ffffff",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            px: 4,
            py: 1.5,
            whiteSpace: "nowrap",
            boxShadow: "none",
            "&:hover": { bgcolor: "#1D4270", boxShadow: "none" },
          }}
        >
           Member Details
        </Button>
      </Box>

      {/* <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <InfoOutlinedIcon sx={{ color: "#d97706", fontSize: 16, mt: 0.3 }} />
        <Typography
          sx={{
            color: "#64748b",
            fontSize: "0.85rem",
            lineHeight: 1.5,
          }}
        >
          <strong>Resident ID</strong> (MEM-######) is the member's account
          number — one per person. The <strong>Card ID</strong> (MB-/TW-/RY-####) is
          printed on their physical RFID card; a member may hold several cards (self,
          dependents, guest). Either loads the same account.
        </Typography>
      </Box> */}

      {/* <Typography sx={{ fontSize: "0.85rem", color: "#64748b" }}>
        Demo IDs:{" "}
        {demoIds.map((id) => (
          <Box
            key={id}
            component="span"
            onClick={() => setResidentSearchQuery(id)}
            sx={{
              color: "#24528C",
              textDecoration: "underline",
              cursor: "pointer",
              mr: 1,
              "&:hover": { color: "#1D4270" },
            }}
          >
            {id}
          </Box>
        ))}
      </Typography> */}
    </Box>
  );
};

export default ResidentSearchUI;
