// @ts-nocheck
import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
} from "@mui/material";
import {
  Download as DownloadIcon,
  AutoAwesomeOutlined as SparklesIcon,
  ReportProblemOutlined as AlertTriangleIcon,
  RestaurantOutlined as UtensilsIcon,
  Check as CheckIcon,
} from "@mui/icons-material";

const BRAND = "#24528C";
const GREEN = "#159A5B";
const GOLD = "#bca47c";
const GOLD_D = "#a17a3f";
const MUT = "#64748b";
const INK = "#1e293b";
const BG = "#f1f5f9";
const LINE = "#e2e8f0";
const TINT = "#EAF0F7";

const initialZones = [
  { id: "Z1", zone: "Pool deck & changing rooms", owner: "Housekeeping", by: "Ramesh Kumar", at: "07:20", checks: [["Deck swept & mopped", true], ["Changing rooms sanitised", true], ["Towels restocked", false], ["Water clarity / pH log", true]] },
  { id: "Z2", zone: "Gym & studio", owner: "Housekeeping", by: "Sunita Devi", at: "06:50", checks: [["Equipment wiped down", true], ["Mirrors & floor", true], ["Sanitiser stations filled", false]] },
  { id: "Z3", zone: "Home theatre", owner: "Housekeeping", by: "Ramesh Kumar", at: "09:05", checks: [["Seats vacuumed", true], ["Screen & AV dusted", true], ["Bin cleared", true]] },
  { id: "Z4", zone: "Lobby & washrooms", owner: "Housekeeping", by: "Sunita Devi", at: "08:15", checks: [["Floors mopped", true], ["Washroom consumables", false], ["Bins cleared", true], ["Glass & handrails", true]] },
  { id: "Z5", zone: "Banquet hall & pre-function area", owner: "Restaurant (F&B)", by: "F&B turnaround crew", at: "—", checks: [["Tables & chairs cleared", false], ["Floor swept & mopped", false], ["Linen & crockery returned", false], ["Bins cleared, waste removed", false], ["AV & staging reset", false]] },
];

export default function UpkeepTab() {
  const [zones, setZones] = useState(initialZones);

  const toggle = (zid: string, i: number) => {
    setZones((zs) =>
      zs.map((z) =>
        z.id !== zid
          ? z
          : {
              ...z,
              checks: z.checks.map((c, j) => (j === i ? [c[0], !c[1]] : c)),
            }
      )
    );
  };

  const pct = (z: any) =>
    Math.round((z.checks.filter((c: any) => c[1]).length / z.checks.length) * 100);

  const openCount = zones.reduce(
    (a, z) => a + z.checks.filter((c: any) => !c[1]).length,
    0
  );

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
            Upkeep
          </Typography>
          <Typography sx={{ fontSize: "0.85rem", color: MUT }}>
            Hygiene & cleanliness rounds
          </Typography>
        </Box>
        <Box sx={{ ml: "auto" }}>
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
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
        <Paper
          elevation={0}
          sx={{ p: 2, borderRadius: "12px", border: `1px solid ${LINE}`, display: "flex", flexDirection: "column" }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1.2 }}>
            <SparklesIcon sx={{ fontSize: 16, color: BRAND }} />
            <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: MUT, letterSpacing: "0.6px", textTransform: "uppercase" }}>
              ZONES COVERED
            </Typography>
          </Box>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "1.8rem", fontWeight: 600, color: INK, lineHeight: 1.1 }}>
            {zones.length}
          </Typography>
          <Typography sx={{ fontSize: "0.75rem", color: MUT, mt: "auto" }}>
            today's rounds
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{ p: 2, borderRadius: "12px", border: `1px solid ${LINE}`, display: "flex", flexDirection: "column" }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1.2 }}>
            <AlertTriangleIcon sx={{ fontSize: 16, color: openCount ? GOLD_D : GREEN }} />
            <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: MUT, letterSpacing: "0.6px", textTransform: "uppercase" }}>
              OPEN ITEMS
            </Typography>
          </Box>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "1.8rem", fontWeight: 600, color: INK, lineHeight: 1.1 }}>
            {openCount}
          </Typography>
          <Typography sx={{ fontSize: "0.75rem", color: MUT, mt: "auto" }}>
            pending sign-off
          </Typography>
        </Paper>
      </Box>

      {/* Info Banner */}
      <Box sx={{ borderRadius: "16px", p: 2, bgcolor: `${GOLD}0d`, border: `1px solid ${GOLD}44` }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          <UtensilsIcon sx={{ fontSize: 16, color: GOLD_D, mt: 0.2 }} />
          <Typography sx={{ fontSize: "0.8rem", color: MUT, lineHeight: 1.5 }}>
            Club zones are cleaned by <Box component="span" sx={{ fontWeight: 600, color: INK }}>housekeeping</Box>. The <Box component="span" sx={{ fontWeight: 600, color: INK }}>banquet hall is the restaurant (F&B) team's</Box> job — the manager inspects and signs off, he does not staff it.
          </Typography>
        </Box>
      </Box>

      {/* Zones Grid */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 2 }}>
        {zones.map((z) => {
          const percentage = pct(z);
          return (
            <Paper
              key={z.id}
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: "16px",
                border: `1px solid ${LINE}`,
                bgcolor: "#fff",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: "0.95rem", fontWeight: 600, color: INK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {z.zone}
                  </Typography>
                  <Typography sx={{ fontSize: "0.75rem", color: MUT, mt: 0.2 }}>
                    {z.by}
                    {z.at && z.at !== "—" ? ` · ${z.at}` : ""}
                  </Typography>
                  <Box
                    sx={{
                      display: "inline-block",
                      mt: 1,
                      px: 1,
                      py: 0.3,
                      borderRadius: "12px",
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      bgcolor: z.owner === "Restaurant (F&B)" ? `${GOLD}22` : TINT,
                      color: z.owner === "Restaurant (F&B)" ? GOLD_D : BRAND,
                    }}
                  >
                    {z.owner}
                  </Box>
                </Box>
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: percentage === 100 ? GREEN : GOLD_D }}>
                  {percentage}%
                </Typography>
              </Box>

              {/* Progress Bar */}
              <Box sx={{ height: 4, borderRadius: 2, bgcolor: BG, mb: 2.5, overflow: "hidden" }}>
                <Box
                  sx={{
                    height: "100%",
                    borderRadius: 2,
                    bgcolor: percentage === 100 ? GREEN : GOLD,
                    width: `${percentage}%`,
                    transition: "width 0.3s ease",
                  }}
                />
              </Box>

              {/* Checkboxes */}
              <Stack spacing={0.5}>
                {z.checks.map((c, i) => {
                  const isChecked = c[1];
                  return (
                    <Box
                      key={i}
                      onClick={() => toggle(z.id, i)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        py: 0.5,
                        cursor: "pointer",
                        "&:hover": { opacity: 0.8 }
                      }}
                    >
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          bgcolor: isChecked ? GREEN : "#fff",
                          border: `1px solid ${isChecked ? GREEN : LINE}`,
                        }}
                      >
                        {isChecked && <CheckIcon sx={{ fontSize: 12, color: "#fff" }} />}
                      </Box>
                      <Typography
                        sx={{
                          fontSize: "0.85rem",
                          color: isChecked ? MUT : INK,
                          textDecoration: isChecked ? "line-through" : "none",
                          textDecorationColor: MUT,
                          textDecorationThickness: "1px",
                        }}
                      >
                        {c[0]}
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}
