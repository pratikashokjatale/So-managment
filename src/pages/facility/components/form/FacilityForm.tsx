import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Stack,
  Fade,
  LinearProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SaveIcon from "@mui/icons-material/Save";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import FacilityBasicInfo from "./FacilityBasicInfo";
import FacilityAccessRules from "./FacilityAccessRules";
import FacilitySchedulePricing from "./FacilitySchedulePricing";

const STEPS = [
  { label: "Basic Info", description: "Name, icon & location" },
  { label: "Access Rules", description: "Type, capacity & status" },
  { label: "Schedule & Pricing", description: "Hours, days & pricing" },
];

interface Props {
  data: any;
  onChange: (field: string, value: any) => void;
  onSubmit: () => void;
  errors: Record<string, string>;
  isLoading?: boolean;
}

export default function FacilityForm({ data, onChange, onSubmit, errors, isLoading = false }: Props) {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const isLastStep = activeStep === STEPS.length - 1;
  const progress = ((activeStep + 1) / STEPS.length) * 100;

  return (
    <Box>
      {/* Step Header */}
      <Box sx={{
        bgcolor: "white",
        borderRadius: "20px",
        border: "1px solid #f1f5f9",
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        p: 3,
        mb: 3,
      }}>
        {/* Progress bar */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="body2" color="text.secondary" fontWeight={700}>
            Step {activeStep + 1} of {STEPS.length}
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={700}>
            {Math.round(progress)}% complete
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 6,
            borderRadius: 99,
            bgcolor: "#f1f5f9",
            mb: 3,
            "& .MuiLinearProgress-bar": {
              bgcolor: "#091542",
              borderRadius: 99,
            },
          }}
        />

        {/* Step indicators */}
        <Stack direction="row" spacing={0} sx={{ position: "relative" }}>
          {/* Connecting line */}
          <Box sx={{
            position: "absolute",
            top: 18,
            left: 24,
            right: 24,
            height: 2,
            bgcolor: "#f1f5f9",
            zIndex: 0,
          }} />
          <Box sx={{
            position: "absolute",
            top: 18,
            left: 24,
            height: 2,
            width: `calc(${(activeStep / (STEPS.length - 1)) * 100}% - 24px)`,
            bgcolor: "#091542",
            zIndex: 0,
            transition: "width 0.5s ease",
          }} />

          {STEPS.map((step, idx) => {
            const isCompleted = idx < activeStep;
            const isActive = idx === activeStep;
            return (
              <Box
                key={step.label}
                onClick={() => idx < activeStep && setActiveStep(idx)}
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: idx === 0 ? "flex-start" : idx === STEPS.length - 1 ? "flex-end" : "center",
                  cursor: isCompleted ? "pointer" : "default",
                  zIndex: 1,
                }}
              >
                {/* Step circle */}
                <Box sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: isCompleted ? "#091542" : isActive ? "#091542" : "white",
                  border: `2px solid ${isCompleted || isActive ? "#091542" : "#e2e8f0"}`,
                  color: isCompleted || isActive ? "white" : "#94a3b8",
                  fontWeight: 900,
                  fontSize: "0.85rem",
                  transition: "all 0.3s ease",
                  boxShadow: isActive ? "0 0 0 4px rgba(9, 21, 66, 0.12)" : "none",
                }}>
                  {isCompleted ? <CheckCircleIcon sx={{ fontSize: 18 }} /> : idx + 1}
                </Box>
                {/* Step label */}
                <Typography
                  variant="caption"
                  fontWeight={isActive ? 800 : 600}
                  color={isActive ? "#091542" : isCompleted ? "#64748b" : "#94a3b8"}
                  sx={{ mt: 0.8, display: { xs: "none", sm: "block" }, textAlign: "center" }}
                >
                  {step.label}
                </Typography>
                <Typography
                  variant="caption"
                  color="#94a3b8"
                  fontSize="0.65rem"
                  sx={{ display: { xs: "none", md: "block" }, textAlign: "center" }}
                >
                  {step.description}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </Box>

      {/* Form content */}
      <Box component="form" onSubmit={(e) => { e.preventDefault(); isLastStep ? onSubmit() : setActiveStep(s => s + 1); }}>

        {activeStep === 0 && (
          <Fade in key="step0" timeout={400}>
            <Box><FacilityBasicInfo data={data} onChange={onChange} errors={errors} /></Box>
          </Fade>
        )}
        {activeStep === 1 && (
          <Fade in key="step1" timeout={400}>
            <Box><FacilityAccessRules data={data} onChange={onChange} errors={errors} /></Box>
          </Fade>
        )}
        {activeStep === 2 && (
          <Fade in key="step2" timeout={400}>
            <Box><FacilitySchedulePricing data={data} onChange={onChange} errors={errors} /></Box>
          </Fade>
        )}

        {/* Navigation Buttons */}
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
          pt: 2,
        }}>
          <Button
            variant="outlined"
            onClick={activeStep === 0 ? () => navigate("/facility") : () => setActiveStep(s => s - 1)}
            disabled={isLoading}
            startIcon={activeStep > 0 ? <ArrowBackIcon /> : undefined}
            sx={{
              borderRadius: "16px",
              px: 3,
              py: 1.5,
              fontWeight: 700,
              borderColor: "#e2e8f0",
              color: "#64748b",
              textTransform: "none",
              "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f8fafc" },
            }}
          >
            {activeStep === 0 ? "Cancel" : "Previous Step"}
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            endIcon={isLastStep ? <SaveIcon /> : <ArrowForwardIcon />}
            sx={{
              borderRadius: "16px",
              px: 4,
              py: 1.5,
              fontWeight: 700,
              textTransform: "none",
              bgcolor: "#091542",
              boxShadow: "none",
              "&:hover": { bgcolor: "#001a35", boxShadow: "none" },
            }}
          >
            {isLoading ? <CircularProgress size={22} color="inherit" /> : (isLastStep ? "Save Facility" : "Next Step")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
