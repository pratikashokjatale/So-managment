// @ts-nocheck
import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  CircularProgress,
  Pagination,
  TextField,
  Select,
  MenuItem,
  FormControl,
  IconButton,
} from "@mui/material";
import {
  Download as DownloadIcon,
  AutoAwesomeOutlined as SparklesIcon,
  ReportProblemOutlined as AlertTriangleIcon,
  RestaurantOutlined as UtensilsIcon,
  Check as CheckIcon,
  Add as AddIcon,
  DeleteOutline as DeleteIcon,
} from "@mui/icons-material";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { checkUpkeepItemApi, createUpkeepRoundApi, exportUpkeepRoundsApi, getUpkeepRoundsApi, getUpkeepSummaryApi } from "@/apis/upkeep";
import { getStaffListApi } from "@/apis/staff";

const BRAND = "#24528C";
const GREEN = "#159A5B";
const GOLD = "#bca47c";
const GOLD_D = "#a17a3f";
const MUT = "#64748b";
const INK = "#1e293b";
const BG = "#f1f5f9";
const LINE = "#e2e8f0";
const TINT = "#EAF0F7";

const indiaDate = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
const prettyDepartment = (value: string) => String(value || "OTHER").toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
const unwrap = (value: any) => value?.data ?? value ?? {};

export default function UpkeepTab() {
  const { user, projectId } = useAuth();
  const [searchParams] = useSearchParams();
  const selectedProjectId = searchParams.get("projectId");
  const managerProjectId = user?.roleProfiles?.find((profile: any) => profile?.projectId)?.projectId || projectId;
  const activeProjectId = user?.role === "MANAGER" ? managerProjectId : selectedProjectId && selectedProjectId !== "all" ? selectedProjectId : undefined;
  const [zones, setZones] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [staffOptions, setStaffOptions] = useState<any[]>([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [togglingItems, setTogglingItems] = useState<Set<string>>(new Set());
  const [form, setForm] = useState<any>({ name: "", roundDate: indiaDate(), roundTime: "", staffId: "", notes: "", items: [""] });
  const limit = 20;

  const load = useCallback(async (showLoader = true) => {
    if (!activeProjectId) return;
    const date = indiaDate();
    if (showLoader) setLoading(true);
    try {
      const [summaryResponse, roundsResponse] = await Promise.all([
        getUpkeepSummaryApi({ projectId: activeProjectId, date }),
        getUpkeepRoundsApi({ projectId: activeProjectId, dateFrom: date, dateTo: date, page, limit }),
      ]);
      const summaryData = unwrap(summaryResponse);
      const roundsData = unwrap(roundsResponse);
      const rounds = roundsData.items ?? roundsData.rounds ?? [];
      setSummary(summaryData.cards ?? summaryData);
      setTotal(Number(roundsData.pagination?.total ?? roundsData.total ?? rounds.length));
      setZones(rounds.map((round: any) => ({
        ...round,
        zone: round.name,
        owner: prettyDepartment(round.department),
        by: round.staffName || "Unassigned",
        at: round.roundTime ? String(round.roundTime).slice(0, 5) : "—",
        checks: (round.items || []).map((item: any) => [item.itemName, Boolean(item.isDone), item.id]),
      })));
    } catch (error: any) {
      toast.error(error?.message || "Failed to load upkeep rounds");
    } finally {
      if (showLoader) setLoading(false);
    }
  }, [activeProjectId, page]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!formOpen) return;
    (async () => {
      setStaffLoading(true);
      try {
        const response = await getStaffListApi({ status: "ACTIVE", limit: 100 });
        const data = unwrap(response);
        const items = data.items ?? data.staff ?? (Array.isArray(data) ? data : []);
        setStaffOptions(items);
      } catch (error: any) {
        toast.error(error?.message || "Failed to load staff");
      } finally {
        setStaffLoading(false);
      }
    })();
  }, [formOpen]);

  const saveRound = async () => {
    const checklist = form.items.map((item: string) => item.trim()).filter(Boolean);
    if (!form.name.trim() || !form.roundDate || !form.roundTime || !form.staffId || checklist.length === 0) {
      return toast.error("Name, date, time, staff and at least one checklist item are required");
    }
    setSaving(true);
    try {
      await createUpkeepRoundApi({
        projectId: activeProjectId,
        name: form.name.trim(),
        roundDate: form.roundDate,
        roundTime: `${form.roundTime}:00`,
        staffId: form.staffId,
        notes: form.notes.trim() || undefined,
        items: checklist.map((itemName: string, sortOrder: number) => ({ itemName, sortOrder })),
      });
      toast.success("Upkeep round created");
      setForm({ name: "", roundDate: indiaDate(), roundTime: "", staffId: "", notes: "", items: [""] });
      setFormOpen(false);
      setPage(1);
      await load(false);
    } catch (error: any) {
      toast.error(error?.message || "Failed to create upkeep round");
    } finally {
      setSaving(false);
    }
  };

  const exportExcel = async () => {
    if (!activeProjectId) return;
    const today = indiaDate();
    const dateFrom = `${today.slice(0, 8)}01`;
    setExporting(true);
    try {
      const blob = await exportUpkeepRoundsApi({ projectId: activeProjectId, dateFrom, dateTo: today });
      const url = URL.createObjectURL(blob), anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `manager-upkeep-${today}.xlsx`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error: any) {
      toast.error(error?.message || "Failed to export upkeep rounds");
    } finally {
      setExporting(false);
    }
  };

  const toggle = async (zid: string, i: number) => {
    const zone = zones.find((item) => item.id === zid);
    const check = zone?.checks?.[i];
    const itemId = check?.[2];
    if (!itemId || togglingItems.has(itemId)) return;
    const isDone = !check[1];
    setTogglingItems((current) => new Set(current).add(itemId));
    setZones((current) => current.map((item) => {
      if (item.id !== zid) return item;
      const checks = item.checks.map((entry: any, index: number) => index === i ? [entry[0], isDone, entry[2]] : entry);
      const completedItems = checks.filter((entry: any) => entry[1]).length;
      return { ...item, checks, completedItems, openItems: checks.length - completedItems, completionPercent: checks.length ? Math.round((completedItems / checks.length) * 100) : 0 };
    }));
    try {
      await checkUpkeepItemApi(itemId, { isDone });
      await load(false);
    } catch (error: any) {
      setZones((current) => current.map((item) => {
        if (item.id !== zid) return item;
        const checks = item.checks.map((entry: any, index: number) => index === i ? [entry[0], !isDone, entry[2]] : entry);
        const completedItems = checks.filter((entry: any) => entry[1]).length;
        return { ...item, checks, completedItems, openItems: checks.length - completedItems, completionPercent: checks.length ? Math.round((completedItems / checks.length) * 100) : 0 };
      }));
      toast.error(error?.message || "Failed to update checklist item");
    } finally {
      setTogglingItems((current) => { const next = new Set(current); next.delete(itemId); return next; });
    }
  };

  const pct = (z: any) =>
    Number(z.completionPercent ?? (z.checks.length ? Math.round((z.checks.filter((c: any) => c[1]).length / z.checks.length) * 100) : 0));

  const openCount = Number(summary.openItems ?? summary.pendingSignOff ?? 0);

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
        <Box sx={{ ml: "auto", display: "flex", gap: 1.5 }}>
          <Button
            onClick={() => setFormOpen((value) => !value)}
            disabled={!activeProjectId}
            variant="contained"
            startIcon={<AddIcon sx={{ fontSize: 16 }} />}
            sx={{ bgcolor: BRAND, color: "#fff", textTransform: "none", borderRadius: "8px", px: 2, py: 1, fontWeight: 600, fontSize: "0.85rem", boxShadow: "none", "&:hover": { bgcolor: BRAND, boxShadow: "none" } }}
          >
            New round
          </Button>
          <Button
            onClick={exportExcel}
            disabled={exporting || !activeProjectId}
            variant="outlined"
            startIcon={exporting ? <CircularProgress size={16} /> : <DownloadIcon sx={{ fontSize: 16 }} />}
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

      {formOpen && (
        <Paper elevation={0} sx={{ p: 3, borderRadius: "16px", border: `1px solid ${LINE}`, bgcolor: "#fff" }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr 1fr" }, gap: 2 }}>
            <TextField label="Round name" size="small" placeholder="Pool deck & changing rooms" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            <TextField label="Date" type="date" size="small" value={form.roundDate} onChange={(event) => setForm({ ...form, roundDate: event.target.value })} InputLabelProps={{ shrink: true }} />
            <TextField label="Time" type="time" size="small" value={form.roundTime} onChange={(event) => setForm({ ...form, roundTime: event.target.value })} InputLabelProps={{ shrink: true }} />
            <FormControl size="small" sx={{ gridColumn: { sm: "span 2" } }}>
              <Select displayEmpty value={form.staffId} onChange={(event) => setForm({ ...form, staffId: event.target.value })}>
                <MenuItem value="" disabled>{staffLoading ? "Loading staff…" : "Select staff"}</MenuItem>
                {staffOptions.map((staff) => <MenuItem key={staff.id} value={staff.id}>{staff.name}{staff.department ? ` · ${prettyDepartment(staff.department)}` : ""}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Notes" size="small" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
          </Box>
          <Typography sx={{ mt: 2, mb: 1, fontSize: ".75rem", fontWeight: 700, color: MUT }}>CHECKLIST ITEMS</Typography>
          <Stack spacing={1}>
            {form.items.map((item: string, index: number) => (
              <Box key={index} sx={{ display: "flex", gap: 1 }}>
                <TextField fullWidth size="small" placeholder={`Checklist item ${index + 1}`} value={item} onChange={(event) => setForm({ ...form, items: form.items.map((current: string, itemIndex: number) => itemIndex === index ? event.target.value : current) })} />
                <IconButton disabled={form.items.length === 1} onClick={() => setForm({ ...form, items: form.items.filter((_: string, itemIndex: number) => itemIndex !== index) })} sx={{ color: MUT }}><DeleteIcon /></IconButton>
              </Box>
            ))}
          </Stack>
          <Box sx={{ mt: 2, display: "flex", gap: 1.5, alignItems: "center" }}>
            <Button onClick={() => setForm({ ...form, items: [...form.items, ""] })} startIcon={<AddIcon />} sx={{ bgcolor: BG, color: BRAND, textTransform: "none" }}>Add item</Button>
            <Box sx={{ ml: "auto", display: "flex", gap: 1 }}><Button onClick={saveRound} disabled={saving || staffLoading} variant="contained" sx={{ bgcolor: GREEN, textTransform: "none", boxShadow: "none" }}>{saving ? "Saving…" : "Create round"}</Button><Button onClick={() => setFormOpen(false)} disabled={saving} sx={{ bgcolor: BG, color: MUT, textTransform: "none" }}>Cancel</Button></Box>
          </Box>
        </Paper>
      )}

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
            {loading ? "—" : summary.zonesCovered ?? zones.length}
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
            {loading ? "—" : openCount}
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
      {loading && <Box sx={{ py: 6, textAlign: "center" }}><CircularProgress size={28} /></Box>}
      {!loading && zones.length === 0 && <Paper elevation={0} sx={{ py: 6, textAlign: "center", border: `1px solid ${LINE}`, borderRadius: "16px" }}><Typography sx={{ color: MUT, fontSize: ".9rem" }}>No upkeep rounds for today.</Typography></Paper>}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 2 }}>
        {!loading && zones.map((z) => {
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
      {Math.ceil(total / limit) > 1 && <Pagination count={Math.ceil(total / limit)} page={page} onChange={(_, value) => setPage(value)} color="primary" sx={{ alignSelf: "center" }} />}
    </Box>
  );
}
