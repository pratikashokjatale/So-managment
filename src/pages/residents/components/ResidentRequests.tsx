import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Chip,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Assignment as DocIcon,
  Close as CloseIcon,
  Badge as IdIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  ZoomIn as ZoomIcon,
  Email as EmailIcon,
  People as FamilyIcon,
  OpenInNew as OpenIcon,
  VerifiedUser as VerifiedIcon,
} from "@mui/icons-material";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import {
  getPendingEnrollmentsApi,
  approveEnrollmentApi,
  rejectEnrollmentApi,
} from "@/apis/enrollment";
import { getUserDetailsApi, getUsersApi } from "@/apis/user";
import { toast } from "react-hot-toast";

export default function ResidentRequests() {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [kycOpen, setKycOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Pagination State
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  // Document Viewer State
  const [docOpen, setDocOpen] = useState(false);
  const [docToShow, setDocToShow] = useState({ title: "", url: "" });

  const navigate = useNavigate();

  // API Integration States
  const [requests, setRequests] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [kycLoading, setKycLoading] = useState(false);
  const [kycDetails, setKycDetails] = useState<any>(null);
  const [approving, setApproving] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      let list: any[] = [];
      let total = 0;

      // 1. Try to get pending enrollments from enrollment API
      try {
        const res = await getPendingEnrollmentsApi({
          page,
          limit: rowsPerPage,
          search: searchQuery || undefined,
        });
        if (res) {
          if (Array.isArray(res)) {
            list = res;
          } else if (res.data) {
            if (Array.isArray(res.data)) {
              list = res.data;
            } else if (res.data.data && Array.isArray(res.data.data)) {
              list = res.data.data;
            } else if (res.data.users && Array.isArray(res.data.users)) {
              list = res.data.users;
            } else if (res.data.requests && Array.isArray(res.data.requests)) {
              list = res.data.requests;
            } else if (res.data.items && Array.isArray(res.data.items)) {
              list = res.data.items;
            }
          } else if (res.users && Array.isArray(res.users)) {
            list = res.users;
          } else if (res.requests && Array.isArray(res.requests)) {
            list = res.requests;
          } else if (res.items && Array.isArray(res.items)) {
            list = res.items;
          }
          const pagination = res?.data?.pagination || res?.pagination;
          total = pagination?.total || list.length;
        }
      } catch (err) {
        console.warn(
          "getPendingEnrollmentsApi failed, trying getUsersApi fallback:",
          err,
        );
      }

      // 2. If list is empty, call getUsersApi with status: 'PENDING'
      if (list.length === 0) {
        const res = await getUsersApi({
          status: "PENDING",
          role: "RESIDENT",
          page,
          limit: rowsPerPage,
          search: searchQuery || undefined,
        });
        if (res) {
          if (Array.isArray(res)) {
            list = res;
          } else if (res.data) {
            if (Array.isArray(res.data)) {
              list = res.data;
            } else if (res.data.items && Array.isArray(res.data.items)) {
              list = res.data.items;
            } else if (res.data.data && Array.isArray(res.data.data)) {
              list = res.data.data;
            } else if (res.data.users && Array.isArray(res.data.users)) {
              list = res.data.users;
            }
          } else if (res.items && Array.isArray(res.items)) {
            list = res.items;
          } else if (res.users && Array.isArray(res.users)) {
            list = res.users;
          }
          const pagination = res?.data?.pagination || res?.pagination;
          total = pagination?.total || list.length;
        }
      }

      // 3. If both return empty, show empty state (no mock data)
      setRequests(list);
      setTotalCount(total);
    } catch (error) {
      console.warn("Failed to fetch pending requests:", error);
      setRequests([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    fetchRequests();
  }, [page, rowsPerPage, searchQuery]);

  const handleOpenKyc = async (request: any) => {
    setSelectedRequest(request);
    setKycOpen(true);
    setKycLoading(true);
    setKycDetails(null);
    try {
      const res = await getUserDetailsApi(request.id);
      const user = res?.data || res;
      setKycDetails(user);
    } catch (error) {
      console.warn("Failed to fetch KYC user details:", error);
      setKycDetails({ ...request });
    } finally {
      setKycLoading(false);
    }
  };

  const handleOpenDoc = (title: string, url: string) => {
    setDocToShow({ title, url });
    setDocOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;
    setApproving(true);
    try {
      await approveEnrollmentApi(selectedRequest.id);
      toast.success(`${selectedRequest.name} approved successfully!`);
      setKycOpen(false);
      fetchRequests();
    } catch (error: any) {
      toast.error(error?.message || "Failed to approve enrollment");
    } finally {
      setApproving(false);
    }
  };

  const handleOpenReject = () => setRejectOpen(true);

  const handleConfirmReject = async () => {
    if (!selectedRequest) return;
    setApproving(true);
    try {
      await rejectEnrollmentApi(selectedRequest.id, rejectReason);
      toast.success("Enrollment rejected");
      setRejectOpen(false);
      setKycOpen(false);
      setRejectReason("");
      fetchRequests();
    } catch (error: any) {
      toast.error(error?.message || "Failed to reject enrollment");
    } finally {
      setApproving(false);
    }
  };

  const identityProofs = kycDetails?.documents?.IDENTITY_PROOF || [];
  const personalDocs = kycDetails?.documents?.PERSONAL_DOCUMENTS || [];
  const allDocs = [...identityProofs, ...personalDocs];
  const familyMembersList =
    kycDetails?.familyMembers || kycDetails?.family || [];

  return (
    <Box sx={{ mt: 5 }}>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="900" color="#091542">
            Pending Enrollment Requests
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review and approve resident submissions for card enrollment.
          </Typography>
        </Box>
        <Chip
          label={`${totalCount} Requests`}
          color="primary"
          sx={{ fontWeight: 800, borderRadius: "8px" }}
        />
      </Box>

      {/* Filters Area */}
      <Box sx={{ mb: 3 }}>
        <Search
          placeholder="Search by resident name or apartment..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: { xs: "100%", md: 350 },
            "& fieldset": { borderRadius: "8px" },
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ border: "1px solid #f1f5f9", borderRadius: "12px" }}
        >
          <Table>
            <TableHead sx={{ bgcolor: "#f8fafc" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: "#64748b" }}>
                  Resident
                </TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#64748b" }}>
                  Apartment / Flat
                </TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#64748b" }}>
                  Request Type
                </TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#64748b" }}>
                  Submitted
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 800, color: "#64748b", textAlign: "right" }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        src={
                          request.avatar ||
                          `https://i.pravatar.cc/150?u=${request.id}`
                        }
                        sx={{ width: 36, height: 36, borderRadius: "10px" }}
                      />
                      <Box>
                        <Typography variant="body2" fontWeight="700">
                          {request.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {request.email || request.phone}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      color="text.secondary"
                    >
                      {request.flat
                        ? `Flat ${request.flat.flatNumber || request.flat.number} (Floor ${request.flat.floorNumber || request.flat.floor})`
                        : request.apartment || request.flatId || "N/A"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={request.type || request.role || "New Enrollment"}
                      size="small"
                      sx={{
                        bgcolor: "#eff6ff",
                        color: "#1d4ed8",
                        fontWeight: 700,
                        borderRadius: "6px",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="caption"
                      fontWeight="600"
                      color="text.secondary"
                    >
                      {request.date ||
                        (request.createdAt
                          ? new Date(request.createdAt).toLocaleDateString()
                          : "N/A")}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      startIcon={<DocIcon fontSize="small" />}
                      onClick={() => handleOpenKyc(request)}
                      sx={{
                        textTransform: "none",
                        fontWeight: 800,
                        borderRadius: "8px",
                      }}
                    >
                      View KYC
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {requests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      No pending requests found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {totalCount > 0 && (
            <Box sx={{ p: 2, borderTop: "1px solid #f1f5f9" }}>
              <Pagination
                page={page}
                totalResults={totalCount}
                rowsPerPage={rowsPerPage}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(e.target.value as number);
                  setPage(1);
                }}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </Box>
          )}
        </TableContainer>
      )}

      {/* KYC Details Dialog */}
      <Dialog
        open={kycOpen}
        onClose={() => !approving && setKycOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: "20px" } }}
      >
        {selectedRequest && (
          <>
            <DialogTitle
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: "#091542",
                color: "white",
                borderRadius: "20px 20px 0 0",
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight="900">
                  Enrollment Review
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  Review all details before approving
                </Typography>
              </Box>
              <IconButton
                onClick={() => setKycOpen(false)}
                sx={{ color: "white" }}
                disabled={approving}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 0 }}>
              {kycLoading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    py: 10,
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <Box>
                  {/* Header: Avatar + Name + Status badges */}
                  <Box
                    sx={{
                      px: 3,
                      pt: 3,
                      pb: 2,
                      bgcolor: "#f8fafc",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    <Stack direction="row" spacing={3} alignItems="center">
                      <Avatar
                        src={`https://i.pravatar.cc/150?u=${kycDetails?.id || selectedRequest.id}`}
                        sx={{
                          width: 72,
                          height: 72,
                          border: "3px solid white",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          fontWeight: 900,
                          fontSize: "1.5rem",
                          bgcolor: "#e0e7ff",
                          color: "#4f46e5",
                        }}
                      >
                        {(kycDetails?.name ||
                          selectedRequest.name)?.[0]?.toUpperCase()}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="h5"
                          fontWeight="900"
                          color="#091542"
                        >
                          {kycDetails?.name || selectedRequest.name}
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          flexWrap="wrap"
                          sx={{ mt: 0.5 }}
                        >
                          <Chip
                            label={
                              kycDetails?.role ||
                              selectedRequest.role ||
                              "RESIDENT"
                            }
                            size="small"
                            sx={{
                              bgcolor: "#eff6ff",
                              color: "#1d4ed8",
                              fontWeight: 700,
                              borderRadius: "6px",
                            }}
                          />
                          <Chip
                            label={
                              kycDetails?.status ||
                              selectedRequest.status ||
                              "PENDING"
                            }
                            size="small"
                            sx={{
                              bgcolor:
                                (kycDetails?.status ||
                                  selectedRequest.status) === "ACTIVE"
                                  ? "#f0fdf4"
                                  : "#fffbeb",
                              color:
                                (kycDetails?.status ||
                                  selectedRequest.status) === "ACTIVE"
                                  ? "#10b981"
                                  : "#f59e0b",
                              fontWeight: 800,
                              borderRadius: "6px",
                            }}
                          />
                          {kycDetails?.familyMembersAdded && (
                            <Chip
                              icon={
                                <FamilyIcon
                                  sx={{ fontSize: "14px !important" }}
                                />
                              }
                              label="Family Added"
                              size="small"
                              sx={{
                                bgcolor: "#f0fdf4",
                                color: "#10b981",
                                fontWeight: 700,
                                borderRadius: "6px",
                              }}
                            />
                          )}
                          {kycDetails?.emailVerifiedAt && (
                            <Chip
                              icon={
                                <VerifiedIcon
                                  sx={{ fontSize: "14px !important" }}
                                />
                              }
                              label="Email Verified"
                              size="small"
                              sx={{
                                bgcolor: "#f0fdf4",
                                color: "#10b981",
                                fontWeight: 700,
                                borderRadius: "6px",
                              }}
                            />
                          )}
                        </Stack>
                      </Box>
                      <Button
                        variant="outlined"
                        endIcon={<OpenIcon />}
                        size="small"
                        onClick={() => {
                          setKycOpen(false);
                          navigate(
                            `/residents/${kycDetails?.id || selectedRequest.id}`,
                          );
                        }}
                        sx={{
                          borderRadius: "10px",
                          fontWeight: 700,
                          textTransform: "none",
                          whiteSpace: "nowrap",
                          borderColor: "#091542",
                          color: "#091542",
                        }}
                      >
                        View Full Profile
                      </Button>
                    </Stack>
                  </Box>

                  <Box sx={{ px: 3, py: 2 }}>
                    <Stack spacing={2.5}>
                      {/* Approval readiness alert */}
                      {kycDetails &&
                        (!kycDetails.emailVerifiedAt ||
                        !kycDetails.familyMembersAdded ? (
                          <Alert
                            severity="warning"
                            sx={{ borderRadius: "10px" }}
                          >
                            {!kycDetails.emailVerifiedAt &&
                              "Email not yet verified. "}
                            {!kycDetails.familyMembersAdded &&
                              "Family members not yet added. "}
                            User may not meet approval criteria.
                          </Alert>
                        ) : (
                          <Alert
                            severity="success"
                            sx={{ borderRadius: "10px" }}
                          >
                            ✓ Email verified &amp; family members added — ready
                            for approval.
                          </Alert>
                        ))}

                      {/* Contact + Flat */}
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 2,
                        }}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: "12px",
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mb: 1 }}
                          >
                            <PhoneIcon
                              sx={{ fontSize: 16, color: "#64748b" }}
                            />
                            <Typography
                              variant="caption"
                              fontWeight="800"
                              color="#64748b"
                            >
                              CONTACT
                            </Typography>
                          </Stack>
                          <Typography variant="body2" fontWeight="700">
                            {kycDetails?.phone ||
                              selectedRequest.phone ||
                              "N/A"}
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                            sx={{ mt: 0.5 }}
                          >
                            <EmailIcon
                              sx={{ fontSize: 14, color: "#94a3b8" }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {kycDetails?.email ||
                                selectedRequest.email ||
                                "N/A"}
                            </Typography>
                          </Stack>
                        </Paper>

                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: "12px",
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mb: 1 }}
                          >
                            <HomeIcon sx={{ fontSize: 16, color: "#64748b" }} />
                            <Typography
                              variant="caption"
                              fontWeight="800"
                              color="#64748b"
                            >
                              FLAT
                            </Typography>
                          </Stack>
                          {(() => {
                            const flatObj =
                              kycDetails?.flat || selectedRequest.flat;
                            return flatObj ? (
                              <>
                                <Typography variant="body2" fontWeight="800">
                                  Flat {flatObj.flatNumber} • Floor{" "}
                                  {flatObj.floorNumber}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {flatObj.flatType} • {flatObj.occupancyType}
                                </Typography>
                                <Chip
                                  label={flatObj.status}
                                  size="small"
                                  sx={{
                                    mt: 0.5,
                                    bgcolor:
                                      flatObj.status === "OCCUPIED"
                                        ? "#f0fdf4"
                                        : "#fefce8",
                                    color:
                                      flatObj.status === "OCCUPIED"
                                        ? "#10b981"
                                        : "#ca8a04",
                                    fontWeight: 700,
                                    borderRadius: "6px",
                                    height: 20,
                                    fontSize: "0.7rem",
                                  }}
                                />
                              </>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {selectedRequest.flatId || "No flat assigned"}
                              </Typography>
                            );
                          })()}
                        </Paper>
                      </Box>

                      {/* Documents */}
                      <Box>
                        <Typography
                          variant="caption"
                          fontWeight="800"
                          color="#64748b"
                          sx={{ display: "block", mb: 1 }}
                        >
                          KYC DOCUMENTS ({allDocs.length})
                        </Typography>
                        {allDocs.length > 0 ? (
                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: 1.5,
                            }}
                          >
                            {allDocs.map((doc: any) => (
                              <Box
                                key={doc.id}
                                sx={{
                                  p: 1.5,
                                  border: "1px solid #e2e8f0",
                                  borderRadius: "10px",
                                  bgcolor: "#f8fafc",
                                }}
                              >
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                  sx={{ mb: 0.5 }}
                                >
                                  <IdIcon
                                    sx={{ fontSize: 15, color: "#64748b" }}
                                  />
                                  <Typography
                                    variant="caption"
                                    fontWeight="700"
                                    color="#64748b"
                                  >
                                    {doc.title || doc.documentType}
                                  </Typography>
                                </Stack>
                                <Chip
                                  label={
                                    doc.isVerified
                                      ? "Verified"
                                      : doc.status || "PENDING"
                                  }
                                  size="small"
                                  sx={{
                                    bgcolor: doc.isVerified
                                      ? "#f0fdf4"
                                      : "#fffbeb",
                                    color: doc.isVerified
                                      ? "#10b981"
                                      : "#f59e0b",
                                    fontWeight: 700,
                                    borderRadius: "6px",
                                    mb: 0.5,
                                    height: 20,
                                    fontSize: "0.7rem",
                                  }}
                                />
                                {(doc.photoUrl || doc.pdfUrl) && (
                                  <Button
                                    size="small"
                                    startIcon={<ZoomIcon fontSize="inherit" />}
                                    onClick={() =>
                                      handleOpenDoc(
                                        doc.title || doc.documentType,
                                        doc.photoUrl || doc.pdfUrl,
                                      )
                                    }
                                    sx={{
                                      p: 0,
                                      textTransform: "none",
                                      fontWeight: 700,
                                      fontSize: "0.75rem",
                                      display: "block",
                                    }}
                                  >
                                    View
                                  </Button>
                                )}
                              </Box>
                            ))}
                          </Box>
                        ) : (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontStyle: "italic" }}
                          >
                            No documents uploaded yet.
                          </Typography>
                        )}
                      </Box>

                      {/* Family Members */}
                      <Box>
                        <Typography
                          variant="caption"
                          fontWeight="800"
                          color="#64748b"
                          sx={{ display: "block", mb: 1 }}
                        >
                          FAMILY MEMBERS ({familyMembersList.length})
                        </Typography>
                        {familyMembersList.length > 0 ? (
                          <Stack spacing={1.5}>
                            {familyMembersList.map((f: any, idx: number) => (
                              <Box
                                key={f.id || idx}
                                sx={{
                                  p: 2,
                                  border: "1px solid #e2e8f0",
                                  borderRadius: "12px",
                                  bgcolor: "#f8fafc",
                                }}
                              >
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                  sx={{ mb: 1 }}
                                >
                                  <Avatar
                                    sx={{
                                      width: 32,
                                      height: 32,
                                      bgcolor: "#e0e7ff",
                                      color: "#4f46e5",
                                      fontSize: "0.8rem",
                                      fontWeight: 900,
                                    }}
                                  >
                                    {f.name?.[0]}
                                  </Avatar>
                                  <Box sx={{ flexGrow: 1 }}>
                                    <Typography
                                      variant="body2"
                                      fontWeight="800"
                                      color="#091542"
                                    >
                                      {f.name}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {f.relationship}
                                    </Typography>
                                  </Box>
                                  <Chip
                                    label={f.accessLevel || "FULL"}
                                    size="small"
                                    sx={{
                                      bgcolor: "#eff6ff",
                                      color: "#1d4ed8",
                                      fontWeight: 700,
                                      borderRadius: "6px",
                                      fontSize: "0.7rem",
                                    }}
                                  />
                                </Stack>
                                <Box
                                  sx={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: 0.5,
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    <strong>Phone:</strong> {f.phone || "N/A"}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    <strong>Email:</strong> {f.email || "N/A"}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    <strong>Status:</strong>{" "}
                                    {f.status || "ACTIVE"}
                                  </Typography>
                                  {f.dateOfBirth && (
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      <strong>DOB:</strong> {f.dateOfBirth}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            ))}
                          </Stack>
                        ) : (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontStyle: "italic" }}
                          >
                            No family members added.
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </Box>
                </Box>
              )}
            </DialogContent>

            <DialogActions
              sx={{ p: 3, gap: 2, borderTop: "1px solid #e2e8f0" }}
            >
              <Button
                variant="outlined"
                color="error"
                fullWidth
                startIcon={
                  approving ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <RejectIcon />
                  )
                }
                disabled={kycLoading || approving}
                onClick={handleOpenReject}
                sx={{
                  borderRadius: "12px",
                  fontWeight: 800,
                  textTransform: "none",
                  height: 46,
                }}
              >
                Reject
              </Button>
              <Button
                variant="contained"
                fullWidth
                startIcon={
                  approving ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <ApproveIcon />
                  )
                }
                disabled={kycLoading || approving}
                onClick={handleApprove}
                sx={{
                  borderRadius: "12px",
                  fontWeight: 800,
                  textTransform: "none",
                  height: 46,
                  bgcolor: "#10b981",
                  "&:hover": { bgcolor: "#059669" },
                }}
              >
                {approving ? "Approving..." : "Approve Enrollment"}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Document Viewer Dialog */}
      <Dialog
        open={docOpen}
        onClose={() => setDocOpen(false)}
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: "24px", overflow: "hidden" } }}
      >
        <DialogTitle
          sx={{
            bgcolor: "#091542",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight="900">
            {docToShow.title}
          </Typography>
          <IconButton onClick={() => setDocOpen(false)} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            p: 0,
            bgcolor: "#f8fafc",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src={docToShow.url}
            sx={{
              maxWidth: "100%",
              height: "auto",
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              m: 4,
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Reject Reason Dialog */}
      <Dialog
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        PaperProps={{ sx: { borderRadius: "12px" } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Reject Request</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Please provide a reason for rejecting the enrollment request for{" "}
            <strong>{selectedRequest?.name}</strong>.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="e.g. Invalid Aadhaar copy, Photo not clear..."
            variant="outlined"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            sx={{ "& fieldset": { borderRadius: "8px" } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setRejectOpen(false)}
            sx={{ fontWeight: 700, textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmReject}
            disabled={!rejectReason}
            sx={{ fontWeight: 700, textTransform: "none", borderRadius: "8px" }}
          >
            Confirm Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
