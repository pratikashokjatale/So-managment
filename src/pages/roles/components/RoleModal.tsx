import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Grid,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Switch,
  Divider,
} from "@mui/material";
import { createRoleApi, updateRoleApi, type RolePermissions } from "@/apis/roles";
import { toast } from "react-hot-toast";

interface RoleModalProps {
  open: boolean;
  onClose: (success?: boolean) => void;
  role?: any; // null for create, object for edit
}

const BASE_ROLES = [
  "ADMIN",
  "RESIDENT",
  "STAFF",
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

export default function RoleModal({ open, onClose, role }: RoleModalProps) {
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
      setFormData({
        name: "",
        code: "",
        baseRole: "RESIDENT",
        description: "",
        status: "ACTIVE",
      });
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
      onClose(true);
    } catch (error: any) {
      toast.error(error?.message || `Failed to ${isEdit ? "update" : "create"} role`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: "12px" } }}>
      <DialogTitle sx={{ fontWeight: 800, color: "#0f172a", pb: 1 }}>
        {isEdit ? "Edit Role Profile" : "Create Role Profile"}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ p: 3 }}>
          <Typography variant="subtitle2" fontWeight="700" color="#334155" sx={{ mb: 2 }}>
            Basic Details
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Role Name"
                name="name"
                value={formData.name}
                onChange={handleTextChange}
                required
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Role Code (Unique)"
                name="code"
                value={formData.code}
                onChange={handleTextChange}
                required={!isEdit}
                disabled={isEdit} // Code cannot be changed
                size="small"
                helperText={!isEdit && "Used internally, no spaces (e.g. CRM_MANAGER)"}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                select
                label="Base Role"
                name="baseRole"
                value={formData.baseRole}
                onChange={handleTextChange}
                required
                disabled={isEdit}
                size="small"
              >
                {BASE_ROLES.map((br) => (
                  <MenuItem key={br} value={br}>
                    {br}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.status === "ACTIVE"}
                    onChange={handleStatusChange}
                    color="success"
                  />
                }
                label={formData.status === "ACTIVE" ? "Active" : "Inactive"}
                sx={{ ml: 1, mt: 0.5 }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleTextChange}
                size="small"
                multiline
                rows={2}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Typography variant="subtitle2" fontWeight="700" color="#334155" sx={{ mb: 2 }}>
            Permissions
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Select the modules and actions this role should have access to.
          </Typography>

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
                    <Typography variant="body2" fontWeight="600">
                      {perm.label}
                    </Typography>
                  }
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, px: 3 }}>
          <Button onClick={() => onClose(false)} color="inherit" disabled={loading} sx={{ fontWeight: 600 }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading} sx={{ fontWeight: 700, px: 3, borderRadius: 2 }}>
            {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Role"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
