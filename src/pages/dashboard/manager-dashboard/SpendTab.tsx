// @ts-nocheck
import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Typography, Button, Paper, Stack, TextField, CircularProgress, Pagination, Select, MenuItem, FormControl } from "@mui/material";
import { Add as PlusIcon, Download as DownloadIcon } from "@mui/icons-material";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { createSpendExpenseApi, exportSpendExpensesApi, getSpendExpensesApi, getSpendSummaryApi } from "@/apis/spend";

const BRAND = "#24528C", MUT = "#64748b", INK = "#1e293b", BG = "#f1f5f9", LINE = "#e2e8f0", RED = "#ef4444";
const CATEGORY_LIMIT = 100000;
const CATEGORIES = ["GROCERY", "UTILITIES", "SUPPLIES", "HOUSEKEEPING", "MAINTENANCE", "MISCELLANEOUS"];
const label = value => value.charAt(0) + value.slice(1).toLowerCase();
const inr = value => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const unwrap = value => value?.data ?? value ?? {};
const itemsFrom = response => { const data = unwrap(response); return data.items ?? data.expenses ?? data.rows ?? (Array.isArray(data) ? data : []); };
const totalFrom = (response, fallback) => { const data = unwrap(response); return Number(data.total ?? data.totalItems ?? data.pagination?.total ?? fallback); };
const amountOf = expense => Number(expense.amount ?? expense.expenseAmount ?? expense.totalAmount ?? expense.total ?? expense.value ?? 0);

const allTimeRange = () => {
  return { dateFrom: "2000-01-01", dateTo: "2099-12-31" };
};

const summaryAmount = (response, category) => {
  const data = unwrap(response);
  const source = data.categories ?? data.summary ?? data.byCategory ?? data.items ?? data;
  if (Array.isArray(source)) {
    const row = source.find(item => String(item.category || item.name || "").toUpperCase() === category);
    return amountOf(row || {});
  }
  const value = source?.[category] ?? source?.[category.toLowerCase()] ?? 0;
  return typeof value === "object" ? amountOf(value) : Number(value || 0);
};

export default function SpendTab() {
  const { user, projectId } = useAuth();
  const [searchParams] = useSearchParams();
  const selectedProjectId = searchParams.get("projectId");
  const managerProjectId = user?.roleProfiles?.find(profile => profile?.projectId)?.projectId || projectId;
  const activeProjectId = user?.role === "MANAGER" ? managerProjectId : selectedProjectId && selectedProjectId !== "all" ? selectedProjectId : undefined;
  const dates = useMemo(allTimeRange, []);
  const [category, setCategory] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ expenseDate: "", category: "GROCERY", vendorName: "", description: "", amount: "", billNumber: "", receiptUrl: "" });
  const limit = 20;

  const load = useCallback(async () => {
    if (!activeProjectId) return;
    setLoading(true);
    try {
      const params = {
        projectId: activeProjectId,
        ...(category !== "ALL" ? { category } : {}),
        ...(search.trim() ? { search: search.trim() } : {}),
        page,
        limit,
      };
      const [summaryResponse, expensesResponse] = await Promise.all([
        getSpendSummaryApi({ projectId: activeProjectId, ...dates }),
        getSpendExpensesApi(params),
      ]);
      const items = itemsFrom(expensesResponse);
      setSummary(summaryResponse);
      setRows(items);
      setTotal(totalFrom(expensesResponse, items.length));
    } catch (error) {
      toast.error(error?.message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }, [activeProjectId, category, dates, limit, page, search]);

  useEffect(() => { const timer = window.setTimeout(load, 300); return () => window.clearTimeout(timer); }, [load]);
  useEffect(() => { setPage(1); }, [category, search]);

  const byCategory = CATEGORIES.map(categoryName => ({ category: categoryName, amount: summaryAmount(summary, categoryName) }));
  const pageTotal = rows.reduce((sum, expense) => sum + amountOf(expense), 0);

  const exportExcel = async () => {
    if (!activeProjectId) return;
    setExporting(true);
    try {
      const blob = await exportSpendExpensesApi({
        projectId: activeProjectId,
        ...(category !== "ALL" ? { category } : {}),
        ...(search.trim() ? { search: search.trim() } : {}),
      });
      const url = URL.createObjectURL(blob), anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `spend-expenses-${new Date().toISOString().slice(0, 10)}.xlsx`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(error?.message || "Failed to export expenses");
    } finally {
      setExporting(false);
    }
  };

  const saveExpense = async () => {
    if (!activeProjectId) return;
    if (!form.expenseDate || !form.vendorName.trim() || !form.description.trim() || Number(form.amount) <= 0) {
      return toast.error("Date, vendor, description and amount are required");
    }
    setSaving(true);
    try {
      await createSpendExpenseApi({
        projectId: activeProjectId,
        expenseDate: form.expenseDate,
        category: form.category,
        vendorName: form.vendorName.trim(),
        description: form.description.trim(),
        amount: Number(form.amount),
        ...(form.billNumber.trim() ? { billNumber: form.billNumber.trim() } : {}),
        ...(form.receiptUrl.trim() ? { receiptUrl: form.receiptUrl.trim() } : {}),
      });
      toast.success("Expense recorded");
      setForm({ expenseDate: "", category: "GROCERY", vendorName: "", description: "", amount: "", billNumber: "", receiptUrl: "" });
      setFormOpen(false);
      await load();
    } catch (error) {
      toast.error(error?.message || "Failed to record expense");
    } finally {
      setSaving(false);
    }
  };

  return <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
    <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
      <Box>
        <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "1.7rem", fontWeight: 600, color: INK, lineHeight: 1.1, mb: .3 }}>Spend</Typography>
        <Typography sx={{ fontSize: ".85rem", color: MUT }}>Departmental expenses — filter and total any slice</Typography>
      </Box>
      <Box sx={{ ml: "auto", display: "flex", gap: 1.5 }}><Button onClick={() => setFormOpen(value => !value)} disabled={!activeProjectId} variant="contained" startIcon={<PlusIcon sx={{ fontSize: 16 }}/>} sx={{ bgcolor: BRAND, color: "#fff", textTransform: "none", borderRadius: "8px", px: 2, py: 1, fontWeight: 600, fontSize: ".85rem", boxShadow: "none", "&:hover": { bgcolor: BRAND, boxShadow: "none" } }}>Record expense</Button><Button onClick={exportExcel} disabled={exporting || !activeProjectId} variant="outlined" startIcon={exporting ? <CircularProgress size={16}/> : <DownloadIcon sx={{ fontSize: 16 }}/>} sx={{ bgcolor: BG, color: BRAND, borderColor: "transparent", textTransform: "none", borderRadius: "8px", px: 2, py: 1, fontWeight: 600, fontSize: ".85rem", "&:hover": { bgcolor: "#e2e8f0", borderColor: "transparent" } }}>Export Excel</Button></Box>
    </Box>

    {!activeProjectId && <Paper elevation={0} sx={{ p: 2, color: RED, border: `1px solid ${RED}44` }}>{user?.role === "MANAGER" ? "No project is assigned to this manager." : "Select a project before viewing departmental expenses."}</Paper>}

    {formOpen && <ExpenseForm form={form} setForm={setForm} saving={saving} save={saveExpense} close={() => setFormOpen(false)}/>}

    <Paper elevation={0} sx={{ p: 3, borderRadius: "16px", border: `1px solid ${LINE}`, bgcolor: "#fff" }}>
      <Typography sx={{ fontSize: ".95rem", fontWeight: 600, color: INK, mb: 3 }}>By category — all time</Typography>
      <Stack spacing={2.5}>
        {byCategory.map(item => {
          const percentage = Math.min(100, Math.max(0, (item.amount / CATEGORY_LIMIT) * 100));
          return <Box key={item.category}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: .8 }}><Typography sx={{ fontSize: ".8rem", fontWeight: 500, color: INK }}>{label(item.category)}</Typography><Typography sx={{ fontSize: ".8rem", color: MUT }}>{inr(item.amount)}</Typography></Box>
            <Box sx={{ height: 6, borderRadius: 3, bgcolor: BG, overflow: "hidden" }}><Box sx={{ height: "100%", borderRadius: 3, bgcolor: BRAND, width: `${percentage}%`, transition: "width .3s ease" }}/></Box>
          </Box>;
        })}
      </Stack>
    </Paper>

    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
      {["ALL", ...CATEGORIES].map(item => <Button key={item} onClick={() => setCategory(item)} sx={{ textTransform: "none", borderRadius: "20px", px: 2, py: .5, fontSize: ".8rem", fontWeight: 600, bgcolor: category === item ? BRAND : BG, color: category === item ? "#fff" : MUT, "&:hover": { bgcolor: category === item ? BRAND : "#e2e8f0" } }}>{item === "ALL" ? "All" : label(item)}</Button>)}
      <TextField size="small" placeholder="Search vendor, item, bill..." value={search} onChange={event => setSearch(event.target.value)} sx={{ ml: "auto", minWidth: 240, "& .MuiOutlinedInput-root": { borderRadius: "20px", bgcolor: "#fff", fontSize: ".85rem", "& fieldset": { borderColor: LINE }, "&.Mui-focused fieldset": { borderColor: BRAND } } }}/>
    </Box>

    <Paper elevation={0} sx={{ borderRadius: "16px", border: `1px solid ${LINE}`, bgcolor: "#fff", overflow: "hidden" }}>
      <Box sx={{ px: 3, py: 2, bgcolor: "#f8fafc", borderBottom: `1px solid ${LINE}`, display: "flex", justifyContent: "space-between" }}><Typography sx={{ fontSize: ".85rem", fontWeight: 600, color: MUT }}>{total} {total === 1 ? "entry" : "entries"}{category !== "ALL" ? ` · ${label(category)}` : ""}</Typography><Typography sx={{ fontSize: ".85rem", fontWeight: 600, color: INK }}>Page total {inr(pageTotal)}</Typography></Box>
      {loading ? <Box sx={{ py: 6, textAlign: "center" }}><CircularProgress size={28}/></Box> : rows.length === 0 ? <Box sx={{ py: 6, textAlign: "center" }}><Typography sx={{ fontSize: ".9rem", color: MUT }}>No entries match your filters.</Typography></Box> : <Stack>{rows.map(expense => <Box key={expense.id} sx={{ display: "flex", alignItems: "center", gap: 3, px: 3, py: 2.5, borderBottom: `1px solid ${LINE}`, "&:last-of-type": { borderBottom: "none" } }}><Box sx={{ flex: 1, minWidth: 0 }}><Typography sx={{ fontSize: ".95rem", fontWeight: 600, color: INK, mb: .3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{expense.description || expense.item || expense.notes || "Expense"}</Typography><Typography sx={{ fontSize: ".75rem", color: MUT, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{expense.expenseDate || expense.date || "—"} · {label(expense.category || "MISCELLANEOUS")} · {expense.vendor || expense.vendorName || "—"} · {expense.billNumber || expense.receiptNumber || expense.referenceNumber || "—"}</Typography></Box><Typography sx={{ fontSize: "1rem", fontWeight: 700, color: INK, flexShrink: 0 }}>{inr(amountOf(expense))}</Typography></Box>)}</Stack>}
    </Paper>
    {Math.ceil(total / limit) > 1 && (
      <Pagination count={Math.ceil(total / limit)} page={page} onChange={(_, value) => setPage(value)} color="primary" sx={{ alignSelf: "center" }}/>
    )}
  </Box>;
}

function ExpenseForm({ form, setForm, saving, save, close }) {
  const set = (key, value) => setForm({ ...form, [key]: value });
  const fieldSx = { "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: ".85rem" } };
  return <Paper elevation={0} sx={{ p: 3, borderRadius: "16px", border: `1px solid ${LINE}`, bgcolor: "#fff", display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2.5 }}>
    <Box><Typography sx={{ fontSize: ".7rem", color: MUT, mb: .5 }}>Date</Typography><TextField type="date" size="small" fullWidth value={form.expenseDate} onChange={event => set("expenseDate", event.target.value)} sx={fieldSx}/></Box>
    <Box><Typography sx={{ fontSize: ".7rem", color: MUT, mb: .5 }}>Category</Typography><FormControl fullWidth size="small"><Select value={form.category} onChange={event => set("category", event.target.value)} sx={{ borderRadius: "10px", fontSize: ".85rem" }}>{CATEGORIES.map(item => <MenuItem key={item} value={item} sx={{ fontSize: ".85rem" }}>{label(item)}</MenuItem>)}</Select></FormControl></Box>
    <Box><Typography sx={{ fontSize: ".7rem", color: MUT, mb: .5 }}>Vendor</Typography><TextField size="small" fullWidth placeholder="Vendor name" value={form.vendorName} onChange={event => set("vendorName", event.target.value)} sx={fieldSx}/></Box>
    <Box sx={{ gridColumn: { sm: "span 2" } }}><Typography sx={{ fontSize: ".7rem", color: MUT, mb: .5 }}>Description</Typography><TextField size="small" fullWidth placeholder="What was bought" value={form.description} onChange={event => set("description", event.target.value)} sx={fieldSx}/></Box>
    <Box><Typography sx={{ fontSize: ".7rem", color: MUT, mb: .5 }}>Amount (₹)</Typography><TextField size="small" fullWidth type="number" value={form.amount} onChange={event => set("amount", event.target.value)} sx={fieldSx}/></Box>
    <Box><Typography sx={{ fontSize: ".7rem", color: MUT, mb: .5 }}>Bill / receipt no.</Typography><TextField size="small" fullWidth placeholder="INV-..." value={form.billNumber} onChange={event => set("billNumber", event.target.value)} sx={fieldSx}/></Box>
    <Box sx={{ gridColumn: { sm: "span 2" } }}><Typography sx={{ fontSize: ".7rem", color: MUT, mb: .5 }}>Receipt URL</Typography><TextField size="small" fullWidth placeholder="https://.../receipt.jpg" value={form.receiptUrl} onChange={event => set("receiptUrl", event.target.value)} sx={fieldSx}/></Box>
    <Box sx={{ gridColumn: { sm: "span 3" }, display: "flex", gap: 1.5 }}><Button variant="contained" onClick={save} disabled={saving} sx={{ bgcolor: "#22c55e", color: "#fff", textTransform: "none", fontWeight: 600, borderRadius: "10px", px: 3, boxShadow: "none", "&:hover": { bgcolor: "#16a34a", boxShadow: "none" } }}>{saving ? "Saving…" : "Save"}</Button><Button variant="outlined" onClick={close} disabled={saving} sx={{ bgcolor: BG, color: MUT, borderColor: "transparent", textTransform: "none", fontWeight: 600, borderRadius: "10px", px: 3, "&:hover": { bgcolor: "#e2e8f0", borderColor: "transparent" } }}>Cancel</Button></Box>
  </Paper>;
}
