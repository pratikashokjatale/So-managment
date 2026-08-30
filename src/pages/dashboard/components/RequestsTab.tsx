// @ts-nocheck
import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  TextField,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Add as PlusIcon,
  Upload as UploadIcon,
  Inventory2Outlined as BoxIcon,
  Link as LinkIcon,
  Attachment as ClipIcon,
} from "@mui/icons-material";

const BRAND = "#24528C";
const GREEN = "#22c55e";
const GOLD = "#bca47c";
const GOLD_D = "#a17a3f";
const MUT = "#64748b";
const INK = "#1e293b";
const BG = "#f1f5f9";
const LINE = "#e2e8f0";

const seedReqs = [
  { id: "REQ-1041", item: "Pool cleaning gear — telescopic vacuum set", qty: 1, urgency: "Urgent", note: "Existing head cracked; deck cleaning slipping to alternate days.", refs: ["https://www.example.com/pool-vacuum-set"], media: 2, status: "with_purchase", by: "Rohit Verma", at: "18 Aug · 10:12" },
  { id: "REQ-1042", item: "Gym towels — 120 gsm, navy, 60 nos", qty: 60, urgency: "Normal", note: "Current stock frayed; members complaining.", refs: [], media: 1, status: "pending", by: "Rohit Verma", at: "19 Aug · 16:40" },
  { id: "REQ-1043", item: "Banquet hall string lights — 30 m", qty: 4, urgency: "Normal", note: "For the Sept event season.", refs: ["https://www.example.com/outdoor-string-lights"], media: 0, status: "approved", by: "Rohit Verma", at: "12 Aug · 09:05" },
];

const REQ_STATUS = {
  pending: { label: "With CRM", tone: GOLD_D, bg: `${GOLD}14` },
  with_purchase: { label: "With Purchase", tone: BRAND, bg: "#EAF0F7" },
  approved: { label: "Approved", tone: GREEN, bg: "#dcfce7" },
  rejected: { label: "Rejected", tone: "#ef4444", bg: "#fee2e2" },
};

export default function RequestsTab({ isCrm = false }: { isCrm?: boolean }) {
  const [reqs, setReqs] = useState(seedReqs);
  const [add, setAdd] = useState(false);
  const [f, setF] = useState({ item: "", qty: "1", urgency: "Normal", note: "", ref: "", media: 0 });

  const handleSave = () => {
    if (!f.item.trim()) return alert("Describe what you need");
    setReqs((r) => [
      {
        id: "REQ-" + Math.floor(1100 + Math.random() * 800),
        item: f.item,
        qty: parseInt(f.qty, 10) || 1,
        urgency: f.urgency,
        note: f.note,
        refs: f.ref.trim() ? [f.ref.trim()] : [],
        media: f.media,
        status: "pending",
        by: "Rohit Verma",
        at: "Just now",
      },
      ...r,
    ]);
    setF({ item: "", qty: "1", urgency: "Normal", note: "", ref: "", media: 0 });
    setAdd(false);
  };

  const handleDecide = (id: string, newStatus: string) => {
    setReqs((r) => r.map((x) => x.id === id ? { ...x, status: newStatus } : x));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: "1.7rem",
              fontWeight: 600,
              color: INK,
              lineHeight: 1.1,
              mb: 0.3,
            }}
          >
            Requests
          </Typography>
          <Typography sx={{ fontSize: "0.85rem", color: MUT }}>
            {isCrm ? "Purchase requests raised by the club manager" : "Raise a purchase request to CRM & Purchase"}
          </Typography>
        </Box>
        <Box sx={{ ml: "auto", display: "flex", gap: 1.5 }}>
          {!isCrm && (
            <Button
              variant="contained"
              onClick={() => setAdd(!add)}
              startIcon={<PlusIcon sx={{ fontSize: 16 }} />}
              sx={{
                bgcolor: BRAND,
                color: "#fff",
                textTransform: "none",
                borderRadius: "8px",
                px: 2,
                py: 1,
                fontWeight: 600,
                fontSize: "0.85rem",
                boxShadow: "none",
                "&:hover": { bgcolor: "#24528C", boxShadow: "none" },
              }}
            >
              New request
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<DownloadIcon sx={{ fontSize: 16 }} />}
            sx={{
              bgcolor: BG,
              color: BRAND,
              borderColor: "transparent",
              textTransform: "none",
              borderRadius: "8px",
              px: 2,
              py: 1,
              fontWeight: 600,
              fontSize: "0.85rem",
              "&:hover": { bgcolor: "#e2e8f0", borderColor: "transparent" },
            }}
          >
            Export Excel
          </Button>
        </Box>
      </Box>

      {/* Add Form */}
      {add && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "16px",
            border: `1px solid ${LINE}`,
            bgcolor: "#fff",
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr" }, gap: 2.5 }}>
            <Box>
              <Typography sx={{ fontSize: "0.7rem", color: MUT, mb: 0.5 }}>What do you need</Typography>
              <TextField
                size="small"
                fullWidth
                placeholder="e.g. Pool cleaning gear — telescopic vacuum set"
                value={f.item}
                onChange={(e) => setF({ ...f, item: e.target.value })}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: "0.85rem" } }}
              />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "0.7rem", color: MUT, mb: 0.5 }}>Quantity</Typography>
              <TextField
                size="small"
                fullWidth
                value={f.qty}
                onChange={(e) => setF({ ...f, qty: e.target.value.replace(/[^0-9]/g, "") })}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: "0.85rem" } }}
              />
            </Box>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 2fr" }, gap: 2.5 }}>
            <Box>
              <Typography sx={{ fontSize: "0.7rem", color: MUT, mb: 0.5 }}>Urgency</Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={f.urgency}
                  onChange={(e) => setF({ ...f, urgency: e.target.value as string })}
                  sx={{ borderRadius: "10px", fontSize: "0.85rem" }}
                >
                  <MenuItem value="Normal" sx={{ fontSize: "0.85rem" }}>Normal</MenuItem>
                  <MenuItem value="Urgent" sx={{ fontSize: "0.85rem" }}>Urgent</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Typography sx={{ fontSize: "0.7rem", color: MUT, mb: 0.5 }}>Reference link (looks like this)</Typography>
              <TextField
                size="small"
                fullWidth
                placeholder="https://..."
                value={f.ref}
                onChange={(e) => setF({ ...f, ref: e.target.value })}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: "0.85rem" } }}
              />
            </Box>
          </Box>

          <Box>
            <Typography sx={{ fontSize: "0.7rem", color: MUT, mb: 0.5 }}>Note for CRM / Purchase</Typography>
            <TextField
              size="small"
              fullWidth
              placeholder="Why it's needed, spec, deadline"
              value={f.note}
              onChange={(e) => setF({ ...f, note: e.target.value })}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: "0.85rem" } }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setF({ ...f, media: f.media + 1 })}
              startIcon={<UploadIcon sx={{ fontSize: 16 }} />}
              sx={{
                bgcolor: BG,
                color: BRAND,
                borderColor: "transparent",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "10px",
                px: 2.5,
                py: 1,
                "&:hover": { bgcolor: "#e2e8f0", borderColor: "transparent" },
              }}
            >
              Attach photo / video {f.media > 0 ? `(${f.media})` : ""}
            </Button>
            
            <Box sx={{ ml: "auto", display: "flex", gap: 1.5 }}>
              <Button
                variant="contained"
                onClick={handleSave}
                sx={{
                  bgcolor: GREEN,
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "10px",
                  px: 3,
                  py: 1,
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#16a34a", boxShadow: "none" },
                }}
              >
                Send request
              </Button>
              <Button
                variant="outlined"
                onClick={() => setAdd(false)}
                sx={{
                  bgcolor: BG,
                  color: MUT,
                  borderColor: "transparent",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "10px",
                  px: 3,
                  py: 1,
                  "&:hover": { bgcolor: "#e2e8f0", borderColor: "transparent" },
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
          
          <Typography sx={{ fontSize: "0.65rem", color: MUT }}>
            Attachments are counted, not stored — real photo/video upload needs file storage, which this single-file build does not have.
          </Typography>
        </Paper>
      )}

      {/* Requests List */}
      <Stack spacing={2}>
        {reqs.map((r) => {
          const st = REQ_STATUS[r.status] || REQ_STATUS.pending;
          return (
            <Paper
              key={r.id}
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: "16px",
                border: `1px solid ${LINE}`,
                bgcolor: "#fff",
                display: "flex",
                gap: 2.5,
              }}
            >
              {/* Icon */}
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: st.bg,
                  color: st.tone,
                  flexShrink: 0,
                }}
              >
                <BoxIcon sx={{ fontSize: 20 }} />
              </Box>

              {/* Details */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2, mb: 0.5 }}>
                  <Typography sx={{ fontSize: "0.95rem", fontWeight: 600, color: INK }}>
                    {r.item}
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
                    <Box
                      sx={{
                        px: 1.5,
                        py: 0.3,
                        borderRadius: "12px",
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        bgcolor: st.bg,
                        color: st.tone,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {st.label}
                    </Box>
                    {isCrm && (r.status === "pending" || r.status === "with_purchase") && (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          size="small"
                          onClick={() => handleDecide(r.id, "approved")}
                          sx={{
                            textTransform: "none",
                            bgcolor: "#e8f5ee",
                            color: GREEN,
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            borderRadius: "8px",
                            px: 1.5,
                            py: 0.2,
                            minWidth: 0,
                            "&:hover": { bgcolor: "#dcfce7" },
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          onClick={() => handleDecide(r.id, "rejected")}
                          sx={{
                            textTransform: "none",
                            bgcolor: "#fee2e2",
                            color: "#ef4444",
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            borderRadius: "8px",
                            px: 1.5,
                            py: 0.2,
                            minWidth: 0,
                            "&:hover": { bgcolor: "#fecaca" },
                          }}
                        >
                          Reject
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Box>
                
                <Typography sx={{ fontSize: "0.75rem", color: MUT, mb: 1 }}>
                  {r.id} · qty {r.qty} · {r.urgency} · raised by {r.by} · {r.at}
                </Typography>
                
                <Typography sx={{ fontSize: "0.85rem", color: INK, mb: 1.5 }}>
                  {r.note}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                  {r.refs.map((u, i) => (
                    <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 0.5, color: BRAND }}>
                      <LinkIcon sx={{ fontSize: 14 }} />
                      <Typography sx={{ fontSize: "0.75rem", color: BRAND }}>{u}</Typography>
                    </Box>
                  ))}
                  {r.media > 0 && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: MUT }}>
                      <ClipIcon sx={{ fontSize: 14 }} />
                      <Typography sx={{ fontSize: "0.75rem" }}>
                        {r.media} attachment{r.media > 1 ? "s" : ""}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
}
