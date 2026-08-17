import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Paper,
  Divider,
  Autocomplete,
  CircularProgress,
  Stack,
  Grid,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import PaymentIcon from "@mui/icons-material/Payment";
import { toast } from "react-hot-toast";

import { getUsersApi } from "@/apis/user";
import { getFacilitiesApi } from "@/apis/facility";
import {
  getSubscriptionPlansApi,
  createSubscriptionApi,
} from "@/apis/subscription";
import { createManualPaymentApi } from "@/apis/payment";
import { getFileUrl } from "@/utils/file";

export default function AddMembership() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);

  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>("");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("PENDING");

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getUsersApi({ role: "RESIDENT", limit: 100 }).then((res) => {
      let u = res?.data || res;
      if (Array.isArray(u)) setUsers(u);
      else if (u?.items && Array.isArray(u.items)) setUsers(u.items);
      else if (u?.users && Array.isArray(u.users)) setUsers(u.users);
      else if (u?.data && Array.isArray(u.data)) setUsers(u.data);
    });

    getFacilitiesApi({ limit: 100, isActive: true }).then((res) => {
      let f = res?.data || res;
      let list: any[] = [];
      if (Array.isArray(f)) list = f;
      else if (f?.items && Array.isArray(f.items)) list = f.items;
      else if (f?.facilities && Array.isArray(f.facilities)) list = f.facilities;
      else if (f?.data && Array.isArray(f.data)) list = f.data;
      const activeFacilities = list.filter((item: any) => item.isActive !== false && item.status !== 'CLOSED' && item.status !== 'Inactive');
      setFacilities(activeFacilities);
    });
  }, []);

  useEffect(() => {
    if (selectedFacilityId) {
      setLoading(true);
      getSubscriptionPlansApi(selectedFacilityId, true)
        .then((res) => {
          let p = res?.data || res;
          if (Array.isArray(p)) setPlans(p);
          else if (p?.items && Array.isArray(p.items)) setPlans(p.items);
          else if (p?.plans && Array.isArray(p.plans)) setPlans(p.plans);
          else if (p?.data && Array.isArray(p.data)) setPlans(p.data);
          setSelectedPlanId("");
        })
        .finally(() => setLoading(false));
    } else {
      setPlans([]);
      setSelectedPlanId("");
    }
  }, [selectedFacilityId]);

  const handleSubmit = async () => {
    if (!selectedUserId || !selectedPlanId) {
      toast.error("Please select a resident and a plan");
      return;
    }
    setSubmitting(true);
    try {
      const res = await createSubscriptionApi({
        userId: selectedUserId,
        planId: selectedPlanId,
      });
      const sub = res?.data || res;
      const subscriptionId = sub?.id;

      if (paymentMethod !== "PENDING" && subscriptionId) {
        await createManualPaymentApi({
          payableType: "SUBSCRIPTION",
          payableId: subscriptionId,
          provider: paymentMethod as any,
          notes: "Offline payment recorded during membership creation",
        });
      }

      toast.success("Membership created successfully");
      navigate("/membership");
    } catch (err: any) {
      toast.error(err?.message || "Failed to create membership");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f4f7fe", minHeight: "100vh" }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton
          onClick={() => navigate("/membership")}
          sx={{
            bgcolor: "white",
            color: "#091542",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            "&:hover": { bgcolor: "#091542", color: "white" },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography
            variant="h5"
            fontWeight="900"
            color="#091542"
            sx={{ letterSpacing: "-0.5px" }}
          >
            Assign New Membership
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight="500">
            Create a new subscription plan for a resident
          </Typography>
        </Box>
      </Box>

      <Paper
        elevation={0}
        sx={{
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 12px 40px rgba(9, 21, 66, 0.05)",
          maxWidth: 1150,
          mx: "auto",
          border: "1px solid rgba(255,255,255,0.8)",
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #091542 0%, #1a3a8a 100%)",
            p: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "12px",
              bgcolor: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PersonAddAltIcon sx={{ color: "white", fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="800" color="white">
              Configuration
            </Typography>
            <Typography variant="caption" color="rgba(255,255,255,0.7)">
              Fill out the details below to assign the plan.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: { xs: 3, md: 5 }, bgcolor: "white" }}>
          <Grid container spacing={3}>
            {/* 1. Resident Selection */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 1.5,
                  width: 300,
                }}
              >
                <AccountCircleIcon sx={{ color: "#1a3a8a", fontSize: 20 }} />
                <Typography
                  variant="subtitle2"
                  fontWeight="700"
                  color="#091542"
                >
                  Select Resident
                </Typography>
              </Box>
              <Autocomplete
                fullWidth
                options={users}
                getOptionLabel={(option) =>
                  `${option.name} ${option.flatNumber ? `(Flat ${option.flatNumber})` : ""} - ${option.phone || option.email}`
                }
                onChange={(_, val) => setSelectedUserId(val?.id || "")}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    {...props}
                    sx={{ display: "flex", alignItems: "center", gap: 2, p: 1 }}
                  >
                    <Avatar
                      src={getFileUrl(
                        option.photoUrl || option.profilePhotoUrl,
                      )}
                      imgProps={{ crossOrigin: "anonymous" }}
                      sx={{ width: 28, height: 28 }}
                    />
                    <Box>
                      <Typography variant="body2" fontWeight="700">
                        {option.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.flatNumber
                          ? `Flat ${option.flatNumber} • `
                          : ""}
                        {option.phone || option.email}
                      </Typography>
                    </Box>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Resident..."
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        bgcolor: "#f8fafc",
                      },
                    }}
                  />
                )}
              />
            </Grid>

            {/* 2. Facility Selection */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 1.5,
                     width: 300,
                }}
              >
                <CardMembershipIcon sx={{ color: "#1a3a8a", fontSize: 20 }} />
                <Typography
                  variant="subtitle2"
                  fontWeight="700"
                  color="#091542"
                >
                  Select Facility
                </Typography>
              </Box>
              <TextField
                fullWidth
                select
                label="Select Facility"
                value={selectedFacilityId}
                onChange={(e) => setSelectedFacilityId(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    bgcolor: "#f8fafc",
                  },
                }}
              >
                {facilities.map((f) => (
                  <MenuItem key={f.id} value={f.id} sx={{ fontWeight: 600 }}>
                    {f.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* 3. Plan Selection */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 1.5,
                     width: 300,
                }}
              >
                <CardMembershipIcon
                  sx={{ color: "#1a3a8a", opacity: 0.6, fontSize: 20 }}
                />
                <Typography
                  variant="subtitle2"
                  fontWeight="700"
                  color="#091542"
                >
                  Select Plan Type
                </Typography>
              </Box>
              <TextField
                fullWidth
                select
                label="Select Plan Type"
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                disabled={!selectedFacilityId || loading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    bgcolor: "#f8fafc",
                  },
                }}
              >
                {loading ? (
                  <MenuItem value="">
                    <CircularProgress size={20} />
                  </MenuItem>
                ) : null}
                {plans.map((p) => (
                  <MenuItem key={p.id} value={p.id} sx={{ fontWeight: 600 }}>
                    {p.name} (₹
                    {parseFloat(p.priceAmount || 0).toLocaleString("en-IN")})
                  </MenuItem>
                ))}
                {!loading && plans.length === 0 && selectedFacilityId && (
                  <MenuItem value="" disabled>
                    No plans available
                  </MenuItem>
                )}
              </TextField>
            </Grid>

            <Grid size={12}>
              <Divider sx={{ borderStyle: "dashed", my: 1 }} />
            </Grid>

            {/* 4. Payment Method */}
            <Grid size={12}>
              <Box
                sx={{
                  p: 3,
                  bgcolor: "#f8fafc",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                    
                  justifyContent: "space-between",
                  gap: 3,
                  flexDirection: { xs: "column", md: "row" },
                }}
              >
                <Box sx={{ flex: 1 ,width: 520}}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mb: 1,
                      
                    }}
                  >
                    <PaymentIcon sx={{ color: "#1a3a8a", fontSize: 24 }} />
                    <Typography variant="h6" fontWeight="800" color="#091542">
                      Initial Payment Method
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ maxWidth: 500, lineHeight: 1.6 }}
                  >
                    Select how the resident is paying for this membership right
                    now. If they are paying directly through the app later,
                    select <strong>None / Pay Later</strong>.
                  </Typography>
                </Box>

                <Box sx={{ width: { xs: "100%", md: "350px" } }}>
                  <TextField
                    fullWidth
                    select
                    label="Payment Method"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        bgcolor: "white",
                      },
                    }}
                  >
                    <MenuItem value="PENDING" sx={{ fontWeight: 600 }}>
                      None / Pay Later
                    </MenuItem>
                    <MenuItem
                      value="CASH"
                      sx={{ fontWeight: 600, color: "#059669" }}
                    >
                      Cash
                    </MenuItem>
                    <MenuItem
                      value="UPI"
                      sx={{ fontWeight: 600, color: "#0284c7" }}
                    >
                      UPI
                    </MenuItem>
                    <MenuItem
                      value="BANK_TRANSFER"
                      sx={{ fontWeight: 600, color: "#7c3aed" }}
                    >
                      Net Banking
                    </MenuItem>
                    <MenuItem
                      value="RAZORPAY"
                      sx={{ fontWeight: 600, color: "#c026d3" }}
                    >
                      Razorpay (External)
                    </MenuItem>
                  </TextField>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 6 }}
          >
            <Button
              variant="outlined"
              onClick={() => navigate("/membership")}
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                px: 4,
                fontWeight: 700,
                borderColor: "#cbd5e1",
                color: "text.secondary",
                "&:hover": { borderColor: "#94a3b8", bgcolor: "#f8fafc" },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={
                submitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SaveIcon />
                )
              }
              onClick={handleSubmit}
              disabled={submitting || !selectedUserId || !selectedPlanId}
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                px: 4,
                py: 1.25,
                fontWeight: 800,
                boxShadow: "0 8px 20px rgba(9, 21, 66, 0.15)",
                bgcolor: "#091542",
                "&:hover": {
                  bgcolor: "#1a3a8a",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.2s",
              }}
            >
              Confirm & Assign
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
