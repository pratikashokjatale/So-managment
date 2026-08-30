// @ts-nocheck
import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
} from "@mui/material";
import {
  Add as PlusIcon,
  Download as DownloadIcon,
  CalendarTodayOutlined as CalendarIcon,
  ScheduleOutlined as ClockIcon,
  PeopleOutlined as UsersIcon,
  RestaurantOutlined as UtensilsIcon,
} from "@mui/icons-material";

const BRAND = "#24528C";
const GREEN = "#22c55e";
const GOLD = "#bca47c";
const GOLD_D = "#a17a3f";
const MUT = "#64748b";
const INK = "#1e293b";
const BG = "#f1f5f9";
const LINE = "#e2e8f0";
const RED = "#ef4444";

const BQ_SLOTS = [
  "Morning (08:00–13:00)",
  "Evening (18:00–23:00)",
  "Full day (08:00–23:00)",
];

const BQ_STATUS = {
  confirmed: { label: "Confirmed", tone: GREEN },
  tentative: { label: "Tentative", tone: GOLD_D },
  done: { label: "Completed", tone: MUT },
  cancelled: { label: "Cancelled", tone: RED },
};

const dayOffset = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

const prettyDate = (s) => {
  try {
    return new Date(s + "T00:00:00").toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
  } catch (e) {
    return s;
  }
};

const daysAway = (s) => {
  try {
    return Math.round(
      (new Date(s + "T00:00:00") -
        new Date(new Date().toISOString().slice(0, 10) + "T00:00:00")) /
        86400000
    );
  } catch (e) {
    return 0;
  }
};

const inr = (v) => "₹" + v.toLocaleString("en-IN");

const initialBanquet = [
  {
    id: "BQ-2201",
    date: dayOffset(0),
    slot: BQ_SLOTS[1],
    event: "Anniversary dinner",
    memberId: "MEM-100355",
    host: "Meera Nair",
    flat: "A-0410",
    pax: 40,
    hire: 5000,
    deposit: 25000,
    status: "confirmed",
    cleared: false,
    notes: "Buffet on the west side; 6 round tables.",
  },
  {
    id: "BQ-2202",
    date: dayOffset(2),
    slot: BQ_SLOTS[1],
    event: "Wedding reception",
    memberId: "MEM-100482",
    host: "Rohit Mehra",
    flat: "B-1204",
    pax: 180,
    hire: 5000,
    deposit: 50000,
    status: "confirmed",
    cleared: false,
    notes: "Outside decorator approved. Extra parking marshals needed.",
  },
  {
    id: "BQ-2203",
    date: dayOffset(5),
    slot: BQ_SLOTS[0],
    event: "Birthday brunch",
    memberId: "MEM-100731",
    host: "Kabir Singh",
    flat: "C-0907",
    pax: 55,
    hire: 5000,
    deposit: 25000,
    status: "tentative",
    cleared: false,
    notes: "Awaiting confirmation on the date.",
  },
  {
    id: "BQ-2204",
    date: dayOffset(11),
    slot: BQ_SLOTS[2],
    event: "Society AGM",
    memberId: "MEM-100613",
    host: "Anjali Mehra",
    flat: "B-1204",
    pax: 120,
    hire: 0,
    deposit: 0,
    status: "confirmed",
    cleared: false,
    notes: "Club-hosted — no hire charge.",
  },
  {
    id: "BQ-2200",
    date: dayOffset(-3),
    slot: BQ_SLOTS[1],
    event: "Engagement party",
    memberId: "MEM-100355",
    host: "Meera Nair",
    flat: "A-0410",
    pax: 90,
    hire: 5000,
    deposit: 25000,
    status: "done",
    cleared: true,
    notes: "",
  },
];

export default function BanquetTab() {
  const [banquet, setBanquet] = useState(initialBanquet);
  const [add, setAdd] = useState(false);
  const [view, setView] = useState("upcoming");
  const [f, setF] = useState({
    date: "",
    slot: BQ_SLOTS[1],
    event: "",
    memberId: "",
    host: "",
    pax: "",
    deposit: "",
    notes: "",
  });

  const sorted = [...banquet].sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = sorted.filter(
    (b) => daysAway(b.date) >= 0 && b.status !== "cancelled"
  );
  const past = sorted
    .filter((b) => daysAway(b.date) < 0 || b.status === "done")
    .reverse();
  const rows = view === "upcoming" ? upcoming : past;

  const next = upcoming[0];
  const paxMonth = upcoming.reduce((a, b) => a + b.pax, 0);
  const turnaroundDue = banquet.filter(
    (b) => !b.cleared && daysAway(b.date) <= 0 && b.status !== "cancelled"
  ).length;
  
  const clash = (d, s) =>
    banquet.some(
      (b) =>
        b.date === d &&
        b.status !== "cancelled" &&
        (b.slot === s || b.slot === BQ_SLOTS[2] || s === BQ_SLOTS[2])
    );

  const save = () => {
    if (!f.event.trim()) return alert("Name the event");
    if (!f.date) return alert("Pick a date");
    if (!f.host.trim()) return alert("Who is hosting?");
    const p = parseInt(String(f.pax).replace(/[^0-9]/g, ""), 10);
    if (!p) return alert("Enter expected guests");
    if (clash(f.date, f.slot))
      return alert("That date and slot is already taken — the hall books once");
    
    setBanquet((bs) => [
      {
        id: "BQ-" + Math.floor(2300 + Math.random() * 600),
        date: f.date,
        slot: f.slot,
        event: f.event,
        memberId: f.memberId.trim().toUpperCase() || "—",
        host: f.host,
        flat: "—",
        pax: p,
        hire: 5000,
        deposit: parseInt(String(f.deposit).replace(/[^0-9]/g, ""), 10) || 0,
        status: "tentative",
        cleared: false,
        notes: f.notes,
      },
      ...bs,
    ]);
    setF({
      date: "",
      slot: BQ_SLOTS[1],
      event: "",
      memberId: "",
      host: "",
      pax: "",
      deposit: "",
      notes: "",
    });
    setAdd(false);
  };

  const setStatus = (id, s) => {
    setBanquet((bs) => bs.map((b) => (b.id === id ? { ...b, status: s } : b)));
  };

  const signOff = (id) => {
    setBanquet((bs) =>
      bs.map((b) =>
        b.id === id
          ? { ...b, cleared: !b.cleared, status: !b.cleared ? "done" : b.status }
          : b
      )
    );
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
            Banquet
          </Typography>
          <Typography sx={{ fontSize: "0.85rem", color: MUT }}>
            Hall diary, guest counts & turnaround
          </Typography>
        </Box>
        <Box sx={{ ml: "auto", display: "flex", gap: 1.5 }}>
          <Button
            onClick={() => setAdd(!add)}
            variant="contained"
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
            Add booking
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

      {/* KPI Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", lg: "repeat(4, 1fr)" },
          gap: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{ p: 2, borderRadius: "12px", border: `1px solid ${LINE}`, height: "100%", display: "flex", flexDirection: "column" }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1.2 }}>
            <CalendarIcon sx={{ fontSize: 16, color: BRAND }} />
            <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: MUT, letterSpacing: "0.6px", textTransform: "uppercase" }}>UPCOMING EVENTS</Typography>
          </Box>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "1.8rem", fontWeight: 600, color: INK, lineHeight: 1.1 }}>{upcoming.length}</Typography>
          <Typography sx={{ fontSize: "0.75rem", color: MUT, mt: "auto" }}>confirmed + tentative</Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{ p: 2, borderRadius: "12px", border: `1px solid ${LINE}`, height: "100%", display: "flex", flexDirection: "column" }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1.2 }}>
            <ClockIcon sx={{ fontSize: 16, color: next && daysAway(next.date) <= 1 ? GOLD_D : GREEN }} />
            <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: MUT, letterSpacing: "0.6px", textTransform: "uppercase" }}>NEXT EVENT</Typography>
          </Box>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "1.8rem", fontWeight: 600, color: INK, lineHeight: 1.1 }}>
            {next ? (daysAway(next.date) === 0 ? "Today" : daysAway(next.date) + "d") : "—"}
          </Typography>
          <Typography sx={{ fontSize: "0.75rem", color: MUT, mt: "auto" }}>{next ? next.event : "diary clear"}</Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{ p: 2, borderRadius: "12px", border: `1px solid ${LINE}`, height: "100%", display: "flex", flexDirection: "column" }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1.2 }}>
            <UsersIcon sx={{ fontSize: 16, color: BRAND }} />
            <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: MUT, letterSpacing: "0.6px", textTransform: "uppercase" }}>GUESTS BOOKED</Typography>
          </Box>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "1.8rem", fontWeight: 600, color: INK, lineHeight: 1.1 }}>{paxMonth}</Typography>
          <Typography sx={{ fontSize: "0.75rem", color: MUT, mt: "auto" }}>across upcoming</Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{ p: 2, borderRadius: "12px", border: `1px solid ${LINE}`, height: "100%", display: "flex", flexDirection: "column" }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1.2 }}>
            <UtensilsIcon sx={{ fontSize: 16, color: turnaroundDue ? GOLD_D : GREEN }} />
            <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: MUT, letterSpacing: "0.6px", textTransform: "uppercase" }}>TURNAROUND DUE</Typography>
          </Box>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "1.8rem", fontWeight: 600, color: INK, lineHeight: 1.1 }}>{turnaroundDue}</Typography>
          <Typography sx={{ fontSize: "0.75rem", color: MUT, mt: "auto" }}>awaiting sign-off</Typography>
        </Paper>
      </Box>

      {/* Info Banner */}
      <Box sx={{ borderRadius: "16px", p: 2, bgcolor: `${GOLD}14`, border: `1px solid ${GOLD}44` }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          <UtensilsIcon sx={{ fontSize: 18, color: GOLD_D, mt: 0.2 }} />
          <Typography sx={{ fontSize: "0.8rem", color: MUT, lineHeight: 1.5 }}>
            The hall diary and the handover are the <Box component="span" sx={{ fontWeight: 600, color: INK }}>club manager's</Box> responsibility.{" "}
            <Box component="span" sx={{ fontWeight: 600, color: INK }}>Cleaning and clearing is the restaurant (F&B) team's job</Box> — the manager signs off the turnaround, he does not staff it.
          </Typography>
        </Box>
      </Box>

      {/* Add Booking Form */}
      {add && (
        <Paper elevation={0} sx={{ p: 3, borderRadius: "16px", border: `1px solid ${LINE}`, bgcolor: "#fff" }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2 }}>
            <TextField
              label="Date"
              type="date"
              size="small"
              value={f.date}
              onChange={(e) => setF({ ...f, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl size="small" sx={{ gridColumn: { sm: "span 2" } }}>
              <InputLabel>Slot</InputLabel>
              <Select value={f.slot} label="Slot" onChange={(e) => setF({ ...f, slot: e.target.value })}>
                {BQ_SLOTS.map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Event"
              size="small"
              sx={{ gridColumn: { sm: "span 2" } }}
              placeholder="e.g. Wedding reception"
              value={f.event}
              onChange={(e) => setF({ ...f, event: e.target.value })}
            />
            <TextField
              label="Expected guests"
              size="small"
              value={f.pax}
              onChange={(e) => setF({ ...f, pax: e.target.value.replace(/[^0-9]/g, "") })}
            />
            <TextField
              label="Host"
              size="small"
              placeholder="Member name"
              value={f.host}
              onChange={(e) => setF({ ...f, host: e.target.value })}
            />
            <TextField
              label="Resident ID"
              size="small"
              placeholder="MEM-100482"
              value={f.memberId}
              onChange={(e) => setF({ ...f, memberId: e.target.value })}
            />
            <TextField
              label="Security deposit (₹)"
              size="small"
              value={f.deposit}
              onChange={(e) => setF({ ...f, deposit: e.target.value.replace(/[^0-9]/g, "") })}
            />
            <TextField
              label="Notes"
              size="small"
              sx={{ gridColumn: { sm: "span 3" } }}
              placeholder="Layout, decorator, parking, anything the team must know"
              value={f.notes}
              onChange={(e) => setF({ ...f, notes: e.target.value })}
            />
            <Box sx={{ gridColumn: { sm: "span 3" }, display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
              <Button onClick={save} variant="contained" sx={{ bgcolor: GREEN, color: "#fff", textTransform: "none", borderRadius: "10px", "&:hover": { bgcolor: "#16a34a" } }}>
                Save booking
              </Button>
              <Button onClick={() => setAdd(false)} variant="text" sx={{ color: MUT, textTransform: "none" }}>
                Cancel
              </Button>
              <Typography sx={{ fontSize: "0.75rem", color: MUT }}>One event per slot — double bookings are refused.</Typography>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Tabs */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          onClick={() => setView("upcoming")}
          sx={{
            textTransform: "none",
            borderRadius: "20px",
            px: 2.5,
            py: 0.5,
            fontSize: "0.85rem",
            fontWeight: 600,
            bgcolor: view === "upcoming" ? BRAND : BG,
            color: view === "upcoming" ? "#fff" : MUT,
            "&:hover": { bgcolor: view === "upcoming" ? "#24528C" : "#e2e8f0" },
          }}
        >
          Upcoming ({upcoming.length})
        </Button>
        <Button
          onClick={() => setView("past")}
          sx={{
            textTransform: "none",
            borderRadius: "20px",
            px: 2.5,
            py: 0.5,
            fontSize: "0.85rem",
            fontWeight: 600,
            bgcolor: view === "past" ? BRAND : BG,
            color: view === "past" ? "#fff" : MUT,
            "&:hover": { bgcolor: view === "past" ? "#24528C" : "#e2e8f0" },
          }}
        >
          Past ({past.length})
        </Button>
      </Box>

      {/* Rows */}
      <Stack spacing={2}>
        {rows.length === 0 && (
          <Paper elevation={0} sx={{ py: 6, textAlign: "center", border: `1px solid ${LINE}`, borderRadius: "16px" }}>
            <Typography sx={{ fontSize: "0.9rem", color: MUT }}>Nothing in the diary here.</Typography>
          </Paper>
        )}
        {rows.map((b) => {
          const st = BQ_STATUS[b.status];
          const d = daysAway(b.date);
          const soon = d >= 0 && d <= 1 && b.status !== "done";
          
          return (
            <Paper
              key={b.id}
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: "16px",
                border: `1px solid ${soon ? GOLD + "88" : LINE}`,
                bgcolor: "#fff",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2.5, flexWrap: "wrap" }}>
                {/* Date Icon */}
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: `${st.tone}14`,
                    flexShrink: 0,
                  }}
                >
                  <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, color: st.tone, lineHeight: 1 }}>
                    {prettyDate(b.date).split(" ")[2]}
                  </Typography>
                  <Typography sx={{ fontSize: "1.1rem", fontWeight: 700, color: st.tone, lineHeight: 1.1 }}>
                    {prettyDate(b.date).split(" ")[1]}
                  </Typography>
                </Box>
                
                {/* Details */}
                <Box sx={{ flex: 1, minWidth: 200 }}>
                  <Typography sx={{ fontSize: "0.95rem", fontWeight: 600, color: INK }}>
                    {b.event} · {b.pax} guests
                  </Typography>
                  <Typography sx={{ fontSize: "0.75rem", color: MUT, mt: 0.5 }}>
                    {b.id} · {prettyDate(b.date)} · {b.slot}
                  </Typography>
                  <Typography sx={{ fontSize: "0.75rem", color: MUT, mt: 0.2 }}>
                    Host {b.host} · {b.memberId}{b.flat !== "—" ? " · " + b.flat : ""}{b.deposit ? " · deposit " + inr(b.deposit) : ""}
                  </Typography>
                  {b.notes && (
                    <Typography sx={{ fontSize: "0.8rem", color: INK, mt: 1 }}>
                      {b.notes}
                    </Typography>
                  )}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1, color: b.cleared ? GREEN : GOLD_D }}>
                    <UtensilsIcon sx={{ fontSize: 14 }} />
                    <Typography sx={{ fontSize: "0.75rem" }}>
                      {b.cleared ? "Turnaround signed off — restaurant cleared the hall" : "Cleaning by restaurant (F&B) — turnaround not signed off"}
                    </Typography>
                  </Box>
                </Box>

                {/* Actions */}
                <Box sx={{ flexShrink: 0, textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.5 }}>
                    <Box sx={{ px: 1.5, py: 0.2, borderRadius: "4px", bgcolor: `${st.tone}14`, color: st.tone, fontSize: "0.65rem", fontWeight: 600 }}>
                      {st.label}
                    </Box>
                    {soon && (
                      <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: GOLD_D }}>
                        {d === 0 ? "TODAY" : "TOMORROW"}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap", justifyContent: "flex-end" }}>
                    {b.status === "tentative" && (
                      <Button onClick={() => setStatus(b.id, "confirmed")} size="small" sx={{ bgcolor: "#e8f5ee", color: GREEN, textTransform: "none", fontSize: "0.7rem", fontWeight: 600, py: 0.5, px: 1.5, borderRadius: "8px", minWidth: 0, "&:hover": { bgcolor: "#d1e7dd" } }}>
                        Confirm
                      </Button>
                    )}
                    {b.status !== "done" && b.status !== "cancelled" && (
                      <Button onClick={() => setStatus(b.id, "cancelled")} size="small" sx={{ bgcolor: "#fbe9e5", color: RED, textTransform: "none", fontSize: "0.7rem", fontWeight: 600, py: 0.5, px: 1.5, borderRadius: "8px", minWidth: 0, "&:hover": { bgcolor: "#f8d7da" } }}>
                        Cancel
                      </Button>
                    )}
                    <Button onClick={() => signOff(b.id)} size="small" sx={{ bgcolor: b.cleared ? BG : "#EAF0F7", color: b.cleared ? MUT : BRAND, textTransform: "none", fontSize: "0.7rem", fontWeight: 600, py: 0.5, px: 1.5, borderRadius: "8px", minWidth: 0, "&:hover": { bgcolor: b.cleared ? "#e2e8f0" : "#EAF0F7" } }}>
                      {b.cleared ? "Undo sign-off" : "Sign off turnaround"}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
}
