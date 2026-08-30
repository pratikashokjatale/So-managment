// @ts-nocheck
import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Add as PlusIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

const BRAND = "#24528C";
const GREEN = "#22c55e";
const GOLD = "#bca47c";
const GOLD_D = "#a17a3f";
const MUT = "#64748b";
const INK = "#1e293b";
const BG = "#f1f5f9";
const LINE = "#e2e8f0";

const SPEND_CATS = [
  "Grocery",
  "Utilities",
  "Supplies",
  "Housekeeping",
  "Maintenance",
  "Miscellaneous",
];

const seedSpend = [
  { id: "SP-2201", date: "2026-08-19", cat: "Grocery", vendor: "Reliance Smart", desc: "Pantry — tea, sugar, milk, biscuits", amt: 4820, bill: "INV-2291", by: "Rohit Verma" },
  { id: "SP-2202", date: "2026-08-18", cat: "Utilities", vendor: "PSPCL", desc: "Clubhouse electricity — Jul cycle", amt: 68400, bill: "EB-77120", by: "Rohit Verma" },
  { id: "SP-2203", date: "2026-08-18", cat: "Supplies", vendor: "Aqua Chem", desc: "Pool chlorine & pH kit", amt: 9250, bill: "AC-3311", by: "Rohit Verma" },
  { id: "SP-2204", date: "2026-08-16", cat: "Housekeeping", vendor: "CleanPro", desc: "Detergent, mops, bin liners", amt: 7130, bill: "CP-8842", by: "Rohit Verma" },
  { id: "SP-2205", date: "2026-08-15", cat: "Maintenance", vendor: "CoolAir Services", desc: "Gym AC service — 2 units", amt: 5600, bill: "CA-1190", by: "Rohit Verma" },
  { id: "SP-2206", date: "2026-08-14", cat: "Utilities", vendor: "Municipal Corp", desc: "Water charges — Jul", amt: 12800, bill: "WC-4420", by: "Rohit Verma" },
  { id: "SP-2207", date: "2026-08-12", cat: "Grocery", vendor: "Local vendor", desc: "Fresh produce — café", amt: 3940, bill: "CASH-118", by: "Rohit Verma" },
  { id: "SP-2208", date: "2026-08-11", cat: "Miscellaneous", vendor: "Sharma Printers", desc: "Notice boards & signage reprint", amt: 2600, bill: "SP-0091", by: "Rohit Verma" },
  { id: "SP-2209", date: "2026-08-08", cat: "Supplies", vendor: "SportsMart", desc: "Squash balls, gym towels", amt: 6480, bill: "SM-2210", by: "Rohit Verma" },
  { id: "SP-2210", date: "2026-08-05", cat: "Housekeeping", vendor: "CleanPro", desc: "Deep-clean — banquet hall after event", amt: 11500, bill: "CP-8901", by: "Rohit Verma" },
];

const inr = (v: number) => "₹" + v.toLocaleString("en-IN");

export default function SpendTab() {
  const [spend, setSpend] = useState(seedSpend);
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [add, setAdd] = useState(false);
  const [f, setF] = useState({ date: "", cat: "Grocery", vendor: "", desc: "", amt: "", bill: "" });

  const handleSave = () => {
    if (!f.vendor.trim() || !f.desc.trim()) return alert("Add a vendor and a description");
    const v = parseInt(String(f.amt).replace(/[^0-9]/g, ""), 10);
    if (!v) return alert("Enter the amount");
    setSpend((s) => [
      {
        id: "SP-" + Math.floor(3000 + Math.random() * 6999),
        date: f.date || new Date().toISOString().slice(0, 10),
        cat: f.cat,
        vendor: f.vendor,
        desc: f.desc,
        amt: v,
        bill: f.bill || "—",
        by: "Rohit Verma",
      },
      ...s,
    ]);
    setF({ date: "", cat: "Grocery", vendor: "", desc: "", amt: "", bill: "" });
    setAdd(false);
  };

  const rows = spend.filter(
    (s) =>
      (cat === "all" || s.cat === cat) &&
      (!q.trim() ||
        (s.vendor + " " + s.desc + " " + s.bill)
          .toLowerCase()
          .indexOf(q.trim().toLowerCase()) !== -1)
  );

  const total = rows.reduce((a, s) => a + s.amt, 0);

  const byCat = SPEND_CATS.map((c) => ({
    c,
    v: spend.filter((s) => s.cat === c).reduce((a, s) => a + s.amt, 0),
  }));

  const maxVal = Math.max(...byCat.map((b) => b.v));
  const grand = maxVal > 0 ? maxVal : 1;

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
            Spend
          </Typography>
          <Typography sx={{ fontSize: "0.85rem", color: MUT }}>
            Departmental expenses — filter and total any slice
          </Typography>
        </Box>
        <Box sx={{ ml: "auto", display: "flex", gap: 1.5 }}>
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
            Record expense
          </Button>
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
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            gap: 2.5,
          }}
        >
          <Box>
            <Typography sx={{ fontSize: "0.7rem", color: MUT, mb: 0.5 }}>Date</Typography>
            <TextField
              type="date"
              size="small"
              fullWidth
              value={f.date}
              onChange={(e) => setF({ ...f, date: e.target.value })}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: "0.85rem" } }}
            />
          </Box>
          <Box>
            <Typography sx={{ fontSize: "0.7rem", color: MUT, mb: 0.5 }}>Category</Typography>
            <FormControl fullWidth size="small">
              <Select
                value={f.cat}
                onChange={(e) => setF({ ...f, cat: e.target.value as string })}
                sx={{ borderRadius: "10px", fontSize: "0.85rem" }}
              >
                {SPEND_CATS.map((c) => (
                  <MenuItem key={c} value={c} sx={{ fontSize: "0.85rem" }}>{c}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box>
            <Typography sx={{ fontSize: "0.7rem", color: MUT, mb: 0.5 }}>Vendor</Typography>
            <TextField
              size="small"
              fullWidth
              placeholder="Vendor name"
              value={f.vendor}
              onChange={(e) => setF({ ...f, vendor: e.target.value })}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: "0.85rem" } }}
            />
          </Box>
          <Box sx={{ gridColumn: { sm: "span 2" } }}>
            <Typography sx={{ fontSize: "0.7rem", color: MUT, mb: 0.5 }}>Description</Typography>
            <TextField
              size="small"
              fullWidth
              placeholder="What was bought"
              value={f.desc}
              onChange={(e) => setF({ ...f, desc: e.target.value })}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: "0.85rem" } }}
            />
          </Box>
          <Box>
            <Typography sx={{ fontSize: "0.7rem", color: MUT, mb: 0.5 }}>Amount (₹)</Typography>
            <TextField
              size="small"
              fullWidth
              value={f.amt}
              onChange={(e) => setF({ ...f, amt: e.target.value.replace(/[^0-9]/g, "") })}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: "0.85rem" } }}
            />
          </Box>
          <Box>
            <Typography sx={{ fontSize: "0.7rem", color: MUT, mb: 0.5 }}>Bill / receipt no.</Typography>
            <TextField
              size="small"
              fullWidth
              placeholder="INV-..."
              value={f.bill}
              onChange={(e) => setF({ ...f, bill: e.target.value })}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: "0.85rem" } }}
            />
          </Box>
          <Box sx={{ gridColumn: { sm: "span 2" }, display: "flex", alignItems: "flex-end", gap: 1.5 }}>
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
              Save
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
        </Paper>
      )}

      {/* Category Breakdown */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: "16px",
          border: `1px solid ${LINE}`,
          bgcolor: "#fff",
        }}
      >
        <Typography sx={{ fontSize: "0.95rem", fontWeight: 600, color: INK, mb: 3 }}>
          By category — all time
        </Typography>

        <Stack spacing={2.5}>
          {byCat.map((b) => {
            const pct = Math.round((b.v / grand) * 100);
            return (
              <Box key={b.c}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.8 }}>
                  <Typography sx={{ fontSize: "0.8rem", fontWeight: 500, color: INK }}>
                    {b.c}
                  </Typography>
                  <Typography sx={{ fontSize: "0.8rem", color: MUT }}>
                    {inr(b.v)}
                  </Typography>
                </Box>
                <Box sx={{ height: 6, borderRadius: 3, bgcolor: BG, overflow: "hidden" }}>
                  <Box
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      bgcolor: BRAND,
                      width: `${pct}%`,
                      transition: "width 0.3s ease",
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Stack>
      </Paper>

      {/* Filters */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
        {["all", ...SPEND_CATS].map((c) => (
          <Button
            key={c}
            onClick={() => setCat(c)}
            sx={{
              textTransform: "none",
              borderRadius: "20px",
              px: 2,
              py: 0.5,
              fontSize: "0.8rem",
              fontWeight: 600,
              bgcolor: cat === c ? BRAND : BG,
              color: cat === c ? "#fff" : MUT,
              "&:hover": { bgcolor: cat === c ? "#24528C" : "#e2e8f0" },
            }}
          >
            {c === "all" ? "All" : c}
          </Button>
        ))}
        <TextField
          size="small"
          placeholder="Search vendor, item, bill..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          sx={{
            ml: "auto",
            minWidth: 240,
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
              bgcolor: "#fff",
              fontSize: "0.85rem",
              "& fieldset": { borderColor: LINE },
              "&:hover fieldset": { borderColor: "#cbd5e1" },
              "&.Mui-focused fieldset": { borderColor: BRAND },
            },
          }}
        />
      </Box>

      {/* Entry List */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: `1px solid ${LINE}`,
          bgcolor: "#fff",
          overflow: "hidden",
        }}
      >
        {/* List Header */}
        <Box sx={{ px: 3, py: 2, bgcolor: "#f8fafc", borderBottom: `1px solid ${LINE}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: MUT }}>
            {rows.length} {rows.length === 1 ? "entry" : "entries"}
            {cat !== "all" ? ` · ${cat}` : ""}
          </Typography>
          <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: INK }}>
            Total {inr(total)}
          </Typography>
        </Box>

        {rows.length === 0 ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <Typography sx={{ fontSize: "0.9rem", color: MUT }}>No entries match your filters.</Typography>
          </Box>
        ) : (
          <Stack divider={<Box sx={{ height: "1px", bgcolor: LINE }} />}>
            {rows.map((s) => (
              <Box key={s.id} sx={{ display: "flex", alignItems: "center", gap: 3, px: 3, py: 2.5 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: "0.95rem", fontWeight: 600, color: INK, mb: 0.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {s.desc}
                  </Typography>
                  <Typography sx={{ fontSize: "0.75rem", color: MUT, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {s.date} · {s.cat} · {s.vendor} · {s.bill}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: INK, flexShrink: 0 }}>
                  {inr(s.amt)}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </Paper>
    </Box>
  );
}
