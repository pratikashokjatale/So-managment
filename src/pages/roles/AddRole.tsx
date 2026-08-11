import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  MenuItem,
  Divider,
  FormControlLabel,
  Switch,
  Checkbox,
  Grid,
  InputAdornment
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Save as SaveIcon,
  Description as DescriptionIcon,
  Security as SecurityIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  VpnKey as VpnKeyIcon,
  Badge as BadgeIcon,
  Close as CloseIcon,
  Circle as CircleIcon
} from "@mui/icons-material";

import BackButton from "@/components/BackButton";
import { createRoleApi, updateRoleApi, type RolePermissions } from "@/apis/roles";
import { toast } from "react-hot-toast";

const BASE_ROLES = [
  "ADMIN",
  "RESIDENT",
  "STAFF",
  "MANAGER",
  "GUEST",
  "DEMO_GUEST"
];

const PERMISSION_KEYS: Array<{ key: keyof RolePermissions; label: string }> = [
  { key: "view", label: "View Access (Global)" },
  { key: "book", label: "Booking & Club" },
  { key: "blockCards", label: "Block ID Cards" },
  { key: "attendance", label: "Staff Attendance" },
  { key: "documents", label: "Documents" },
  { key: "crm", label: "CRM (Users & Issues)" },
  { key: "issuePasses", label: "Issue Passes" },
  { key: "analytics", label: "Analytics & Reports" },
  { key: "enroll", label: "Enrollments" },
  { key: "integrations", label: "Integrations" },
  { key: "roles", label: "Roles Management" },
];

export default function AddRole() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role;
  const isEdit = Boolean(role);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    baseRole: "RESIDENT",
    description: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });

  const [permissions, setPermissions] = useState<RolePermissions>({});

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name || "",
        code: role.code || "",
        baseRole: role.baseRole || "RESIDENT",
        description: role.description || "",
        status: role.status || "ACTIVE",
      });
      setPermissions(role.permissions || {});
    } else {
      setPermissions({ view: true });
    }
  }, [role]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (key: keyof RolePermissions) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setPermissions((prev) => ({ ...prev, [key]: e.target.checked }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, status: e.target.checked ? "ACTIVE" : "INACTIVE" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || (!isEdit && !formData.code) || !formData.baseRole) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await updateRoleApi(role.id, {
          name: formData.name,
          description: formData.description,
          status: formData.status,
          permissions,
        });
        toast.success("Role updated successfully");
      } else {
        await createRoleApi({
          name: formData.name,
          code: formData.code,
          baseRole: formData.baseRole,
          description: formData.description,
          status: formData.status,
          permissions,
        });
        toast.success("Role created successfully");
      }
      navigate("/setup/roles");
    } catch (error: any) {
      toast.error(error?.message || `Failed to ${isEdit ? "update" : "create"} role`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f9fafc', minHeight: '100vh' }}>
      
      {/* Header section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" color="#091542" sx={{ mb: 0.5 }}>
            {isEdit ? "Edit Role Profile" : "Create New Role"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure access controls and base permissions
          </Typography>
        </Box>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            bgcolor: '#e8effc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <AdminPanelSettingsIcon sx={{ color: '#2c4d93' }} />
        </Box>
      </Box>

      <form onSubmit={handleSubmit}>
        {/* Basic Details */}
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: '12px', p: { xs: 3, md: 4 }, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 4 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '8px',
                bgcolor: '#e8effc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}
            >
              <DescriptionIcon sx={{ color: '#2c4d93' }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" color="#091542">
                Basic Details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter primary information for this role
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
            <TextField
              fullWidth
              label="Role Name *"
              name="name"
              placeholder="e.g. CRM Manager"
              variant="outlined"
              value={formData.name}
              onChange={handleTextChange}
              sx={{ '& fieldset': { borderRadius: '8px' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ bgcolor: '#e8effc', p: 0.5, borderRadius: '4px', display: 'flex' }}>
                      <BadgeIcon sx={{ color: '#2c4d93', fontSize: 20 }} />
                    </Box>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Role Code (Unique) *"
              name="code"
              placeholder="e.g. CRM_MANAGER"
              variant="outlined"
              value={formData.code}
              onChange={handleTextChange}
              disabled={isEdit}
              helperText={!isEdit && "Used internally, no spaces"}
              sx={{ '& fieldset': { borderRadius: '8px' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ bgcolor: '#e8effc', p: 0.5, borderRadius: '4px', display: 'flex' }}>
                      <VpnKeyIcon sx={{ color: '#2c4d93', fontSize: 20 }} />
                    </Box>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              select
              label="Base Role *"
              name="baseRole"
              value={formData.baseRole}
              onChange={handleTextChange}
              disabled={isEdit}
              sx={{ '& fieldset': { borderRadius: '8px' } }}
              SelectProps={{
                MenuProps: {
                  disableScrollLock: true,
                  PaperProps: {
                    sx: {
                      borderRadius: '8px',
                      mt: 0.5,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                    }
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ bgcolor: '#e8effc', p: 0.5, borderRadius: '4px', display: 'flex' }}>
                      <AdminPanelSettingsIcon sx={{ color: '#2c4d93', fontSize: 20 }} />
                    </Box>
                  </InputAdornment>
                ),
              }}
            >
              {BASE_ROLES.map((br) => (
                <MenuItem key={br} value={br}>
                  {br}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleTextChange}
              sx={{ '& fieldset': { borderRadius: '8px' } }}
              SelectProps={{
                MenuProps: {
                  disableScrollLock: true,
                  PaperProps: {
                    sx: {
                      borderRadius: '8px',
                      mt: 0.5,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                    }
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CircleIcon sx={{ color: formData.status === 'ACTIVE' ? '#10b981' : '#ef4444', fontSize: 14, ml: 1 }} />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="INACTIVE">Inactive</MenuItem>
            </TextField>

            <Box sx={{ gridColumn: 'span 2' }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                name="description"
                placeholder="Brief description about the role and its responsibilities"
                variant="outlined"
                value={formData.description}
                onChange={handleTextChange}
                sx={{ '& fieldset': { borderRadius: '8px' } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                      <Box sx={{ bgcolor: '#e8effc', p: 0.5, borderRadius: '4px', display: 'flex' }}>
                        <DescriptionIcon sx={{ color: '#2c4d93', fontSize: 20 }} />
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
        </Paper>

        {/* Permissions */}
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: '12px', p: { xs: 3, md: 4 }, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 4 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '8px',
                bgcolor: '#e8effc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}
            >
              <SecurityIcon sx={{ color: '#2c4d93' }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" color="#091542">
                Permissions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Select the modules and actions this role should have access to.
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={2}>
            {PERMISSION_KEYS.map((perm) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={perm.key}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(permissions[perm.key])}
                      onChange={handlePermissionChange(perm.key)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2" fontWeight="600" color="#334155">
                      {perm.label}
                    </Typography>
                  }
                />
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/setup/roles')}
            startIcon={<CloseIcon />}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              px: 3,
              py: 1,
              fontWeight: 600,
              borderColor: '#e0e0e0',
              color: '#4b5563',
              '&:hover': { borderColor: '#b0b0b0', bgcolor: '#f9fafc' }
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={<SaveIcon />}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              px: 3,
              py: 1,
              fontWeight: 600,
              boxShadow: 'none',
              bgcolor: '#2c4d93',
              '&:hover': { bgcolor: '#1f3b73', boxShadow: 'none' }
            }}
          >
            {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Role"}
          </Button>
        </Box>
      </form>

    </Box>
  );
}
