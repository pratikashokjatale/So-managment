import { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Button, TextField, Breadcrumbs, Link,
  Paper, Grid, InputAdornment, IconButton as MuiIconButton,
  LinearProgress, Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BackButton from '@/components/BackButton';
import { addGuestApi, uploadDocumentApi } from '@/apis/guest';
import { getAllFlatsApi } from '@/apis/flat';
import { toast } from 'react-hot-toast';

// ── helpers ────────────────────────────────────────────────────────────────────
const extractList = (res: any): any[] => {
  if (!res) return [];
  const d = res?.data ?? res;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.items)) return d.items;
  if (Array.isArray(d?.data?.items)) return d.data.items;
  if (Array.isArray(d?.data)) return d.data;
  return [];
};

const inputSx = { '& .MuiOutlinedInput-root': { borderRadius: '12px' } };

// ── file upload widget ─────────────────────────────────────────────────────────
interface UploadWidgetProps {
  label: string;
  required?: boolean;
  url: string;
  uploading: boolean;
  error?: string;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
}

function UploadWidget({ label, required, url, uploading, error, onFileSelect, onRemove }: UploadWidgetProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Box>
      <Typography variant="body2" fontWeight={700} color="text.secondary" sx={{ mb: 1 }}>
        {label} {required && <Typography component="span" color="error">*</Typography>}
      </Typography>

      {url ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px' }}>
          <CheckCircleIcon sx={{ color: '#10b981', flexShrink: 0 }} />
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <Typography variant="body2" fontWeight={700} color="#091542" noWrap>Uploaded successfully</Typography>
            <Typography variant="caption" color="text.secondary" noWrap>{url.split('/').pop()}</Typography>
          </Box>
          <MuiIconButton size="small" onClick={onRemove} sx={{ color: '#ef4444' }}>
            <DeleteOutlineIcon fontSize="small" />
          </MuiIconButton>
        </Box>
      ) : (
        <Box
          onClick={() => !uploading && inputRef.current?.click()}
          sx={{
            border: error ? '2px dashed #ef4444' : '2px dashed #cbd5e1',
            borderRadius: '12px', bgcolor: '#f8fafc', p: 3,
            textAlign: 'center', cursor: uploading ? 'wait' : 'pointer',
            transition: 'all 0.2s',
            '&:hover': !uploading ? { borderColor: '#091542', bgcolor: '#f1f5f9' } : {},
          }}
        >
          <input ref={inputRef} type="file" accept=".png,.jpg,.jpeg,.pdf" style={{ display: 'none' }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onFileSelect(f); e.target.value = ''; }} />
          <CloudUploadOutlinedIcon sx={{ fontSize: 32, color: error ? '#ef4444' : '#94a3b8', mb: 1 }} />
          <Typography variant="body2" fontWeight={700} color={error ? 'error' : '#091542'}>
            {uploading ? 'Uploading…' : 'Click to upload'}
          </Typography>
          <Typography variant="caption" color="text.secondary">PNG, JPG, PDF — max 5 MB</Typography>
          {uploading && <LinearProgress sx={{ mt: 1.5, borderRadius: 4 }} />}
          {error && <Typography variant="caption" color="error" display="block" sx={{ mt: 0.5, fontWeight: 600 }}>{error}</Typography>}
        </Box>
      )}
    </Box>
  );
}

// ── main component ─────────────────────────────────────────────────────────────
export default function AddGuest() {
  const navigate = useNavigate();

  // form fields
  const [name, setName]               = useState('');
  const [email, setEmail]             = useState('');
  const [phone, setPhone]             = useState('');
  const [password, setPassword]       = useState('');
  const [showPwd, setShowPwd]         = useState(false);
  const [flatId, setFlatId]           = useState('');
  const [stayEndsAt, setStayEndsAt]   = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });

  // document URLs (obtained after upload)
  const [aadhaarUrl, setAadhaarUrl]   = useState('');
  const [panUrl, setPanUrl]           = useState('');

  // upload progress flags
  const [uploadingAadhaar, setUploadingAadhaar] = useState(false);
  const [uploadingPan, setUploadingPan]         = useState(false);

  // flat picker
  const [flats, setFlats]             = useState<any[]>([]);
  const [flatSearch, setFlatSearch]   = useState('');

  const [errors, setErrors]           = useState<Record<string, string>>({});
  const [apiError, setApiError]       = useState('');
  const [saving, setSaving]           = useState(false);

  // ── load flats ─────────────────────────────────────────────────────────────
  useEffect(() => {
    getAllFlatsApi({ limit: 100 })
      .then((res) => setFlats(extractList(res)))
      .catch(() => setFlats([]));
  }, []);

  // ── document upload handlers ───────────────────────────────────────────────
  const handleAadhaarUpload = async (file: File) => {
    setUploadingAadhaar(true);
    setErrors(p => ({ ...p, aadhaar: '' }));
    try {
      const url = await uploadDocumentApi(file);
      setAadhaarUrl(url);
      toast.success('Aadhaar uploaded');
    } catch (err: any) {
      setErrors(p => ({ ...p, aadhaar: err?.message || 'Upload failed' }));
      toast.error('Aadhaar upload failed');
    } finally {
      setUploadingAadhaar(false);
    }
  };

  const handlePanUpload = async (file: File) => {
    setUploadingPan(true);
    setErrors(p => ({ ...p, pan: '' }));
    try {
      const url = await uploadDocumentApi(file);
      setPanUrl(url);
      toast.success('PAN uploaded');
    } catch (err: any) {
      setErrors(p => ({ ...p, pan: err?.message || 'Upload failed' }));
      toast.error('PAN upload failed');
    } finally {
      setUploadingPan(false);
    }
  };

  // ── validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim())    e.name       = 'Guest name is required';
    if (!email.trim())   e.email      = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!phone.trim())   e.phone      = 'Phone number is required';
    if (!password)       e.password   = 'Password is required';
    else if (password.length < 6) e.password = 'Minimum 6 characters';
    if (!stayEndsAt)     e.stayEndsAt = 'Stay end date is required';
    if (!aadhaarUrl && !panUrl) e.aadhaar = 'Upload Aadhaar or PAN document';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    setApiError('');
    try {
      let normalizedPhone = phone.trim();
      if (!normalizedPhone.startsWith('+')) {
        normalizedPhone = '+91' + normalizedPhone.replace(/^0+/, '');
      }

      const payload: any = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: normalizedPhone,
        password,
        stayEndsAt: new Date(stayEndsAt).toISOString(),
        // role: 'GUEST' injected by addGuestApi
      };
      if (flatId)      payload.flatId            = flatId;
      if (aadhaarUrl)  payload.aadhaarDocumentUrl = aadhaarUrl;
      if (panUrl)      payload.panDocumentUrl     = panUrl;

      console.log('[AddGuest] Sending payload:', payload);
      await addGuestApi(payload);
      toast.success('Guest account created successfully');
      navigate('/guest');
    } catch (err: any) {
      console.error('[AddGuest] API error:', err?.data || err?.message);
      const details: any[] = err?.data?.details || [];
      if (details.length > 0) {
        const msgs = details.map((d: any) => `${d.field ? d.field + ': ' : ''}${d.message}`).join('\n');
        setApiError(msgs);
        details.forEach((d: any) => toast.error(`${d.field ? d.field + ': ' : ''}${d.message}`, { duration: 6000 }));
      } else {
        const msg = err?.message || 'Failed to create guest';
        setApiError(msg);
        toast.error(msg);
      }
    } finally {
      setSaving(false);
    }
  };

  const filteredFlats = flats.filter((f) =>
    `${f.flatNumber} ${f.floorNumber}`.toLowerCase().includes(flatSearch.toLowerCase())
  );

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>

      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#091542', mb: 1 }}>Add Guest</Typography>
          <Breadcrumbs separator=">" aria-label="breadcrumb">
            <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>Dashboard</Link>
            <Link underline="hover" color="inherit" onClick={() => navigate('/guest')} sx={{ cursor: 'pointer' }}>Guests</Link>
            <Typography color="text.primary" fontWeight={600}>Add Guest</Typography>
          </Breadcrumbs>
        </Box>
        <BackButton to="/guest" label="Back to Guests" />
      </Box>

      <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '24px', p: { xs: 3, md: 5 } }}>

        <Grid container spacing={3}>

          {/* ── Left: account fields ── */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="h6" fontWeight={800} color="#091542" sx={{ mb: 3 }}>Guest Login Details</Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Full Name" fullWidth required value={name}
                  onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })); }}
                  error={!!errors.name} helperText={errors.name} placeholder="e.g. Alice Walker" sx={inputSx} />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Phone Number" fullWidth required value={phone}
                  onChange={(e) => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: '' })); }}
                  error={!!errors.phone} helperText={errors.phone} placeholder="+919999999998" sx={inputSx} />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField label="Email Address" type="email" fullWidth required value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                  error={!!errors.email} helperText={errors.email} placeholder="guest@example.com" sx={inputSx} />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Password" type={showPwd ? 'text' : 'password'} fullWidth required value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                  error={!!errors.password} helperText={errors.password} placeholder="Min. 6 characters" sx={inputSx}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <MuiIconButton onClick={() => setShowPwd(v => !v)} edge="end">
                          {showPwd ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </MuiIconButton>
                      </InputAdornment>
                    )
                  }} />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Stay End Date" type="date" fullWidth required
                  InputLabelProps={{ shrink: true }} value={stayEndsAt}
                  onChange={(e) => { setStayEndsAt(e.target.value); setErrors(p => ({ ...p, stayEndsAt: '' })); }}
                  error={!!errors.stayEndsAt} helperText={errors.stayEndsAt || 'Date when guest stay expires'}
                  inputProps={{ min: new Date().toISOString().split('T')[0] }} sx={inputSx} />
              </Grid>

              {/* Flat picker */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" fontWeight={700} color="text.secondary" sx={{ mb: 1 }}>
                  Assign Flat <Typography component="span" variant="caption" color="text.disabled">(optional)</Typography>
                </Typography>
                <TextField label="Search flat by number…" fullWidth value={flatSearch}
                  onChange={(e) => setFlatSearch(e.target.value)} sx={{ ...inputSx, mb: 1.5 }} />
                <Box sx={{ maxHeight: 170, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                  {filteredFlats.length === 0 ? (
                    <Box sx={{ p: 2 }}>
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        {flats.length === 0 ? 'Loading flats…' : 'No flats match.'}
                      </Typography>
                    </Box>
                  ) : filteredFlats.map((f) => (
                    <Box key={f.id} onClick={() => setFlatId(flatId === f.id ? '' : f.id)}
                      sx={{
                        px: 2, py: 1.5, cursor: 'pointer',
                        bgcolor: flatId === f.id ? '#eff6ff' : 'transparent',
                        borderLeft: flatId === f.id ? '3px solid #091542' : '3px solid transparent',
                        '&:hover': { bgcolor: '#f8fafc' },
                        borderBottom: '1px solid #f1f5f9',
                      }}>
                      <Typography variant="body2" fontWeight={700} color={flatId === f.id ? '#091542' : 'text.primary'}>
                        Flat {f.flatNumber}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Floor {f.floorNumber} · {f.flatType} · {f.status}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                {flatId && <Typography variant="caption" color="primary" sx={{ mt: 0.5, display: 'block', fontWeight: 700 }}>✓ Flat selected</Typography>}
              </Grid>
            </Grid>
          </Grid>

          {/* ── Right: document upload ── */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="h6" fontWeight={800} color="#091542" sx={{ mb: 1 }}>
              Identity Documents
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              At least one document is required (Aadhaar or PAN).
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <UploadWidget
                label="Aadhaar Card"
                required={!panUrl}
                url={aadhaarUrl}
                uploading={uploadingAadhaar}
                error={!panUrl ? errors.aadhaar : undefined}
                onFileSelect={handleAadhaarUpload}
                onRemove={() => setAadhaarUrl('')}
              />

              <UploadWidget
                label="PAN Card"
                url={panUrl}
                uploading={uploadingPan}
                error={errors.pan}
                onFileSelect={handlePanUpload}
                onRemove={() => setPanUrl('')}
              />
            </Box>

            {(aadhaarUrl || panUrl) && (
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {aadhaarUrl && <Chip label="Aadhaar ✓" size="small" sx={{ bgcolor: '#f0fdf4', color: '#047857', fontWeight: 700 }} />}
                {panUrl && <Chip label="PAN ✓" size="small" sx={{ bgcolor: '#f0fdf4', color: '#047857', fontWeight: 700 }} />}
              </Box>
            )}

           
          </Grid>

        </Grid>

        {/* Inline API error */}
        {apiError && (
          <Box sx={{ mt: 3, p: 2, bgcolor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px' }}>
            <Typography variant="body2" fontWeight={700} color="#dc2626" sx={{ mb: 0.5 }}>Request Failed</Typography>
            {apiError.split('\n').map((line, i) => (
              <Typography key={i} variant="caption" color="#dc2626" display="block">{line}</Typography>
            ))}
          </Box>
        )}

        {/* Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4, pt: 3, borderTop: '1px solid #f1f5f9' }}>
          <Button onClick={() => navigate('/guest')} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, px: 3, color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={saving || uploadingAadhaar || uploadingPan}
            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, px: 4, bgcolor: '#091542', '&:hover': { bgcolor: '#001a3f' }, boxShadow: 'none' }}>
            {saving ? 'Creating…' : 'Create Guest'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
